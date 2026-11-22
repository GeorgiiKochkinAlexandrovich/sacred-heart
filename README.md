# Sacred Heart

**Каждое сердце заслуживает второй шанс.**

🌐 [Сайт (devnet demo)](https://sacred-heart-blond.vercel.app) · 𝕏 [@sacred_heart26](https://x.com/sacred_heart26) · ✉️ georgiihelpii@proton.me

> **English.** Sacred Heart is an open-source donation platform on Solana. No token, no custody: an Anchor program splits every SOL/USDC donation in the same transaction, **94% straight to the cause's wallet, 6% to the operator**. Causes: addiction recovery & mental health, people stranded abroad without documents, humanitarian aid for Ukrainians affected by the war, surgeries. Every donation is a public on-chain event. MIT-licensed, so any NGO can fork it. Status: live on devnet, mainnet after audit.

Sacred Heart — прозрачная благотворительная платформа на Solana. Каждое пожертвование делится
смарт-контрактом прямо в момент перевода:

- **94%** — получателю помощи (фонд, клиника или проверенный человек)
- **6%** — создателю платформы

Процент зашит в код константой (`CREATOR_FEE_BPS = 600`) и не может быть изменён. Адрес получателя
у направления нельзя подменить: можно только закрыть направление и открыть новое, и это видно в блокчейне.

## Направления помощи
1. Лечение зависимостей и психическое здоровье
2. Восстановление документов за границей
3. Помощь украинцам, пострадавшим от войны
4. Сборы на операции

## Статус
⚠️ **Тестовая версия.** Контракт работает в Solana **Devnet** и ещё не прошёл аудит. Настоящие деньги не принимаются.

- Program ID (devnet): `5Ei6gHSQspXtzyMH9wxAru4CEoEx2eyedBQGAPzTzNau`
- [Посмотреть в Solana Explorer](https://explorer.solana.com/address/5Ei6gHSQspXtzyMH9wxAru4CEoEx2eyedBQGAPzTzNau?cluster=devnet)

## Как устроен код
| Путь | Что это |
|---|---|
| `programs/help_split/src/lib.rs` | Смарт-контракт (Anchor 0.31): пожертвования в SOL и токенах (USDC), деление 94/6 |
| `scripts/init.ts` | Создание конфигурации и направлений |
| `app/index.html` | Сайт: направления, пожертвование через Phantom, статистика из блокчейна |
| `setup.sh`, `deploy-devnet.sh`, `upgrade-devnet.sh` | Установка инструментов, деплой и обновление в devnet (Ubuntu / WSL) |
| `mainnet/` | Скрипты запуска в mainnet: деплой, получатели, передача управления мультиподписи |
| `app/config.js` | Настройки сети сайта (devnet / mainnet) |

## Запуск у себя (devnet)
```bash
bash setup.sh          # Rust, Solana CLI, Anchor, Node
bash deploy-devnet.sh  # сборка, деплой, создание направлений
npx serve app          # сайт на http://localhost:3000
```
Тесты логики деления: `cargo test -p help_split`

## Безопасность
Результаты внутренней проверки контракта: [SECURITY-REVIEW.md](SECURITY-REVIEW.md).
Инструкция запуска в mainnet: [mainnet/README-MAINNET.md](mainnet/README-MAINNET.md).

## План до запуска с настоящими деньгами
- [ ] Партнёры: фонды и клиники, согласные принимать крипту
- [x] Внутренняя проверка безопасности контракта
- [ ] Управление через мультиподпись (Squads), отключение права обновлять контракт
- [ ] Независимый аудит контракта
- [ ] Юридическое оформление
- [x] Заявка на грант Solana Foundation (ноябрь 2026)
- [ ] Деплой в mainnet

## Контакты
Георгий Кочкин, основатель — georgiihelpii@proton.me · X: [@sacred_heart26](https://x.com/sacred_heart26)

Лицензия: MIT
