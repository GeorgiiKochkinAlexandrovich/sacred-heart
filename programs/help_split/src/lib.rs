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
use anchor_lang::solana_program::pubkey;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

declare_id!("5Ei6gHSQspXtzyMH9wxAru4CEoEx2eyedBQGAPzTzNau"); // заменить после `anchor keys list`

/// 15% создателю (в базисных пунктах: 1500 / 10000). Неизменяемо.
pub const CREATOR_FEE_BPS: u64 = 1500;
pub const BPS_DENOMINATOR: u64 = 10_000;
/// Минимальное пожертвование в SOL: 0.01 SOL. Меньше нельзя: 15% от суммы должны покрывать
/// минимальный баланс («rent») нового кошелька, иначе перевод на пустой кошелёк падает.
pub const MIN_SOL_DONATION: u64 = 10_000_000;
/// Минимальное пожертвование в токене: 0.10 USDC (6 знаков). Защита от спама счётчиков.
pub const MIN_TOKEN_DONATION: u64 = 100_000;
/// Какие токены принимаются: только USDC (mainnet и devnet).
/// Иначе любой мог бы «пожертвовать» самодельный токен и накрутить статистику.
pub const ALLOWED_MINTS: [Pubkey; 2] = [
    pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC mainnet
    pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), // USDC devnet
];
pub const MAX_NAME_LEN: usize = 128; // байты; кириллица = 2 байта на букву

#[program]
pub mod help_split {
    use super::*;

    /// Один раз: создаёт глобальную конфигурацию.
    /// Вызвать может ТОЛЬКО владелец права на обновление контракта — иначе после деплоя
    /// посторонний успел бы первым вызвать initialize и стать админом.
    pub fn initialize(ctx: Context<Initialize>, creator: Pubkey) -> Result<()> {
        require!(creator != Pubkey::default(), HelpError::InvalidAddress);
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
        // Получатель — реальный адрес и не кошелёк создателя (85% не могут уйти создателю).
        require!(beneficiary != Pubkey::default(), HelpError::InvalidAddress);
        require!(beneficiary != ctx.accounts.config.creator, HelpError::InvalidAddress);

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

    /// Сменить кошелёк, на который приходят 15% (только админ).
    /// Процент при этом НЕ меняется — он константа. Каждая смена пишется в блокчейн событием.
    pub fn set_creator(ctx: Context<SetCreator>, new_creator: Pubkey) -> Result<()> {
        require!(new_creator != Pubkey::default(), HelpError::InvalidAddress);
        let config = &mut ctx.accounts.config;
        let old_creator = config.creator;
        config.creator = new_creator;
        emit!(CreatorChanged { old_creator, new_creator });
        Ok(())
    }

    /// Передать права админа (например, мультиподписи Squads). Только текущий админ.
    pub fn set_admin(ctx: Context<SetAdmin>, new_admin: Pubkey) -> Result<()> {
        require!(new_admin != Pubkey::default(), HelpError::InvalidAddress);
        let config = &mut ctx.accounts.config;
        let old_admin = config.admin;
        config.admin = new_admin;
        emit!(AdminChanged { old_admin, new_admin });
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
        let (to_beneficiary, to_creator) = split(amount, MIN_SOL_DONATION)?;

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
        let (to_beneficiary, to_creator) = split(amount, MIN_TOKEN_DONATION)?;
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
pub fn split(amount: u64, min: u64) -> Result<(u64, u64)> {
    require!(amount >= min, HelpError::DonationTooSmall);
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
    #[account(constraint = program.programdata_address()? == Some(program_data.key()))]
    pub program: Program<'info, crate::program::HelpSplit>,
    #[account(constraint = program_data.upgrade_authority_address == Some(admin.key()) @ HelpError::Unauthorized)]
    pub program_data: Account<'info, ProgramData>,
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
pub struct SetCreator<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetAdmin<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    pub admin: Signer<'info>,
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
    #[account(constraint = ALLOWED_MINTS.contains(&mint.key()) @ HelpError::MintNotAllowed)]
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
pub struct CreatorChanged {
    pub old_creator: Pubkey,
    pub new_creator: Pubkey,
}

#[event]
pub struct AdminChanged {
    pub old_admin: Pubkey,
    pub new_admin: Pubkey,
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
    #[msg("Недопустимый адрес")]
    InvalidAddress,
    #[msg("Этот токен не принимается (только USDC)")]
    MintNotAllowed,
    #[msg("Нет прав: вызвать может только владелец контракта")]
    Unauthorized,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn split_is_85_15() {
        let (b, c) = split(1_000_000_000, MIN_SOL_DONATION).unwrap(); // 1 SOL
        assert_eq!(c, 150_000_000);
        assert_eq!(b, 850_000_000);
        assert_eq!(b + c, 1_000_000_000);
    }

    #[test]
    fn split_rounds_in_favor_of_beneficiary() {
        let (b, c) = split(10_000_001, MIN_SOL_DONATION).unwrap();
        assert_eq!(c, 1_500_000); // 1500000.15 -> 1500000
        assert_eq!(b, 8_500_001);
        assert_eq!(b + c, 10_000_001);
    }

    #[test]
    fn split_rejects_dust() {
        assert!(split(MIN_SOL_DONATION - 1, MIN_SOL_DONATION).is_err());
        assert!(split(MIN_TOKEN_DONATION - 1, MIN_TOKEN_DONATION).is_err());
    }

    #[test]
    fn creator_share_covers_rent_on_minimum_sol() {
        // 15% от минимального пожертвования должно быть больше минимального баланса кошелька (890 880 лампортов)
        let (_, c) = split(MIN_SOL_DONATION, MIN_SOL_DONATION).unwrap();
        assert!(c > 890_880);
    }

    #[test]
    fn split_never_loses_or_creates_lamports() {
        for a in [MIN_SOL_DONATION, 12_345_678, 999_999_999_999, u64::MAX] {
            let (b, c) = split(a, MIN_SOL_DONATION).unwrap();
            assert_eq!(b + c, a);
            assert!(c <= a / 100 * 15 + 15);
        }
    }

    #[test]
    fn usdc_is_allowed_other_mints_are_not() {
        assert!(ALLOWED_MINTS.contains(&pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")));
        assert!(!ALLOWED_MINTS.contains(&Pubkey::default()));
    }
}
