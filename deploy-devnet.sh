#!/usr/bin/env bash
# Сборка и деплой в DEVNET (тестовая сеть, ненастоящие деньги). Запуск: bash deploy-devnet.sh
set -e
cd "$(dirname "$0")"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$HOME/.cargo/bin:$PATH"
LOG=deploy-log.txt; exec > >(tee "$LOG") 2>&1

solana config set --url devnet
[ -f ~/.config/solana/id.json ] || solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json
echo "Твой тестовый кошелёк: $(solana address)"
BAL=$(solana balance | cut -d' ' -f1)
if awk "BEGIN{exit !($BAL < 3)}"; then
  solana airdrop 2 || echo "!! Airdrop не прошёл (лимит). Возьми SOL на https://faucet.solana.com для адреса $(solana address) и запусти скрипт снова."
fi

anchor keys sync

# Фиксируем версии библиотек, совместимые со сборщиком Solana (cargo 1.79).
# Свежие crates требуют Rust 1.85+ (edition2024) и ломают сборку.
if [ ! -f .lock-ok ]; then
  rm -f Cargo.lock
  CARGO_RESOLVER_INCOMPATIBLE_RUST_VERSIONS=fallback cargo +stable generate-lockfile
  # blake3 >= 1.6 тянет digest 0.11 / block-buffer 0.12 (edition2024)
  cargo +stable update -p blake3 --precise 1.5.5
  sed -i 's/^version = 4$/version = 3/' Cargo.lock
  touch .lock-ok
fi

anchor build
anchor deploy
PID=$(solana address -k target/deploy/help_split-keypair.json)
echo "Program ID: $PID"
sed -i "s/new PublicKey(\"[1-9A-HJ-NP-Za-km-z]\{32,44\}\"); \/\/ заменить после деплоя/new PublicKey(\"$PID\"); \/\/ заменить после деплоя/" app/index.html

# Тестовые кошельки получателей (только для devnet!)
mkdir -p test-wallets
BENS=""
for i in 1 2 3 4; do
  [ -f test-wallets/ben$i.json ] || solana-keygen new --no-bip39-passphrase --silent -o test-wallets/ben$i.json
  BENS="$BENS,$(solana address -k test-wallets/ben$i.json)"
done
export BENEFICIARIES="${BENS#,}"

[ -d node_modules ] || npm install
anchor run init
echo; echo "=== ГОТОВО. Program ID: $PID ==="
echo "Сайт: npx serve app  (потом открой ссылку, в Phantom включи Devnet)"
