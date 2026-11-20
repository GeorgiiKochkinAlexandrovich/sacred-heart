//! HelpSplit — прозрачная донат-платформа на Solana.
//!
//! Каждое пожертвование делится ПРЯМО В МОМЕНТ ПЕРЕВОДА:
//!   85% -> кошелёк получателя (фонд / клиника / проверенный человек)
//!   15% -> кошелёк создателя
//!
//! Процент зашит в код константой и НЕ может быть изменён никем,
//! даже админом. Адрес получателя у направления тоже нельзя поменять —
//! можно только выключить направление и создать новое (всё видно в блокчейне).

use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

declare_id!("5Ei6gHSQspXtzyMH9wxAru4CEoEx2eyedBQGAPzTzNau"); // заменить после `anchor keys list`

/// 15% создателю (в базисных пунктах: 1500 / 10000). Неизменяемо.
pub const CREATOR_FEE_BPS: u64 = 1500;
pub const BPS_DENOMINATOR: u64 = 10_000;
/// Минимальное пожертвование в минимальных единицах (лампорты / единицы токена).
pub const MIN_DONATION: u64 = 1_000;
pub const MAX_NAME_LEN: usize = 128; // байты; кириллица = 2 байта на букву

#[program]
pub mod help_split {
    use super::*;

    /// Один раз: создаёт глобальную конфигурацию.
    /// `admin` лучше сделать мультиподписью (например, Squads), а не личным кошельком.
    pub fn initialize(ctx: Context<Initialize>, creator: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.creator = creator;
        config.cause_count = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Добавить направление помощи с конкретным кошельком получателя.
    pub fn add_cause(
        ctx: Context<AddCause>,
        name: String,
        category: Category,
        beneficiary: Pubkey,
    ) -> Result<()> {
        require!(name.len() <= MAX_NAME_LEN, HelpError::NameTooLong);
        require!(!name.is_empty(), HelpError::NameTooLong);

        let config = &mut ctx.accounts.config;
        let cause = &mut ctx.accounts.cause;
        cause.id = config.cause_count;
        cause.category = category as u8;
        cause.active = true;
        cause.beneficiary = beneficiary;
        cause.total_lamports = 0;
        cause.total_tokens = 0;
        cause.donations = 0;
        cause.bump = ctx.bumps.cause;
        cause.name = name;

        config.cause_count = config
            .cause_count
            .checked_add(1)
            .ok_or(HelpError::Overflow)?;

        emit!(CauseAdded {
            id: cause.id,
            category: cause.category,
            beneficiary,
        });
        Ok(())
    }

    /// Включить / выключить направление (например, сбор на операцию закрыт).
    pub fn set_cause_active(ctx: Context<SetCauseActive>, active: bool) -> Result<()> {
        ctx.accounts.cause.active = active;
        emit!(CauseStatusChanged {
            id: ctx.accounts.cause.id,
            active,
        });
        Ok(())
    }

    /// Пожертвование в SOL.
    pub fn donate_sol(ctx: Context<DonateSol>, amount: u64) -> Result<()> {
        require!(ctx.accounts.cause.active, HelpError::CauseInactive);
        let (to_beneficiary, to_creator) = split(amount)?;

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.donor.to_account_info(),
                    to: ctx.accounts.beneficiary.to_account_info(),
                },
            ),
            to_beneficiary,
        )?;
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.donor.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            ),
            to_creator,
        )?;

        let cause = &mut ctx.accounts.cause;
        cause.total_lamports = cause
            .total_lamports
            .checked_add(to_beneficiary)
            .ok_or(HelpError::Overflow)?;
        cause.donations = cause.donations.checked_add(1).ok_or(HelpError::Overflow)?;

        emit!(Donation {
            cause_id: cause.id,
            donor: ctx.accounts.donor.key(),
            mint: None,
            amount,
            to_beneficiary,
            to_creator,
        });
        Ok(())
    }

    /// Пожертвование в токене (например, USDC).
    pub fn donate_token(ctx: Context<DonateToken>, amount: u64) -> Result<()> {
        require!(ctx.accounts.cause.active, HelpError::CauseInactive);
        let (to_beneficiary, to_creator) = split(amount)?;
        let decimals = ctx.accounts.mint.decimals;

        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.donor_token.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.beneficiary_token.to_account_info(),
                    authority: ctx.accounts.donor.to_account_info(),
                },
            ),
            to_beneficiary,
            decimals,
        )?;
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.donor_token.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.creator_token.to_account_info(),
                    authority: ctx.accounts.donor.to_account_info(),
                },
            ),
            to_creator,
            decimals,
        )?;

        let cause = &mut ctx.accounts.cause;
        cause.total_tokens = cause
            .total_tokens
            .checked_add(to_beneficiary)
            .ok_or(HelpError::Overflow)?;
        cause.donations = cause.donations.checked_add(1).ok_or(HelpError::Overflow)?;

        emit!(Donation {
            cause_id: cause.id,
            donor: ctx.accounts.donor.key(),
            mint: Some(ctx.accounts.mint.key()),
            amount,
            to_beneficiary,
            to_creator,
        });
        Ok(())
    }
}

/// Делит сумму: 15% создателю (округление вниз), остальное (>=85%) получателю.
pub fn split(amount: u64) -> Result<(u64, u64)> {
    require!(amount >= MIN_DONATION, HelpError::DonationTooSmall);
    let to_creator = ((amount as u128) * (CREATOR_FEE_BPS as u128) / (BPS_DENOMINATOR as u128)) as u64;
    let to_beneficiary = amount - to_creator;
    Ok((to_beneficiary, to_creator))
}

// ───────────────────────── Аккаунты ─────────────────────────

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub creator: Pubkey,
    pub cause_count: u32,
    pub bump: u8,
}
impl Config {
    pub const SPACE: usize = 8 + 32 + 32 + 4 + 1;
}

/// Порядок полей важен: сайт читает их напрямую (name — последним).
#[account]
pub struct Cause {
    pub id: u32,
    pub category: u8,
    pub active: bool,
    pub beneficiary: Pubkey,
    pub total_lamports: u64,
    pub total_tokens: u64,
    pub donations: u64,
    pub bump: u8,
    pub name: String,
}
impl Cause {
    pub const SPACE: usize = 8 + 4 + 1 + 1 + 32 + 8 + 8 + 8 + 1 + 4 + MAX_NAME_LEN;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Category {
    AddictionMentalHealth, // 0 — зависимости и психическое здоровье
    LostDocuments,         // 1 — потерянные документы за границей
    UkraineWar,            // 2 — помощь украинцам, пострадавшим от войны
    Surgery,               // 3 — операции и лечение
}

// ───────────────────────── Контексты ─────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = Config::SPACE, seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddCause<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    #[account(
        init,
        payer = admin,
        space = Cause::SPACE,
        seeds = [b"cause", config.cause_count.to_le_bytes().as_ref()],
        bump
    )]
    pub cause: Account<'info, Cause>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetCauseActive<'info> {
    #[account(seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"cause", cause.id.to_le_bytes().as_ref()], bump = cause.bump)]
    pub cause: Account<'info, Cause>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct DonateSol<'info> {
    #[account(seeds = [b"config"], bump = config.bump, has_one = creator)]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"cause", cause.id.to_le_bytes().as_ref()],
        bump = cause.bump,
        has_one = beneficiary
    )]
    pub cause: Account<'info, Cause>,
    #[account(mut)]
    pub donor: Signer<'info>,
    /// CHECK: проверяется через `has_one = beneficiary`
    #[account(mut)]
    pub beneficiary: UncheckedAccount<'info>,
    /// CHECK: проверяется через `has_one = creator`
    #[account(mut)]
    pub creator: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DonateToken<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"cause", cause.id.to_le_bytes().as_ref()], bump = cause.bump)]
    pub cause: Account<'info, Cause>,
    #[account(mut)]
    pub donor: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, token::mint = mint, token::authority = donor)]
    pub donor_token: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = mint,
        constraint = beneficiary_token.owner == cause.beneficiary @ HelpError::WrongRecipient
    )]
    pub beneficiary_token: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = mint,
        constraint = creator_token.owner == config.creator @ HelpError::WrongRecipient
    )]
    pub creator_token: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

// ───────────────────────── События и ошибки ─────────────────────────

#[event]
pub struct Donation {
    pub cause_id: u32,
    pub donor: Pubkey,
    pub mint: Option<Pubkey>,
    pub amount: u64,
    pub to_beneficiary: u64,
    pub to_creator: u64,
}

#[event]
pub struct CauseAdded {
    pub id: u32,
    pub category: u8,
    pub beneficiary: Pubkey,
}

#[event]
pub struct CauseStatusChanged {
    pub id: u32,
    pub active: bool,
}

#[error_code]
pub enum HelpError {
    #[msg("Название пустое или длиннее 128 байт")]
    NameTooLong,
    #[msg("Направление закрыто")]
    CauseInactive,
    #[msg("Слишком маленькое пожертвование")]
    DonationTooSmall,
    #[msg("Неверный кошелёк получателя")]
    WrongRecipient,
    #[msg("Переполнение")]
    Overflow,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn split_is_85_15() {
        let (b, c) = split(1_000_000_000).unwrap(); // 1 SOL
        assert_eq!(c, 150_000_000);
        assert_eq!(b, 850_000_000);
        assert_eq!(b + c, 1_000_000_000);
    }

    #[test]
    fn split_rounds_in_favor_of_beneficiary() {
        let (b, c) = split(1_001).unwrap();
        assert_eq!(c, 150); // 150.15 -> 150
        assert_eq!(b, 851);
    }

    #[test]
    fn split_rejects_dust() {
        assert!(split(999).is_err());
    }
}
