#!/usr/bin/env bash
# Передаёт права админа и право обновлять контракт мультиподписи Squads.
#   bash mainnet/handover-multisig.sh "https://mainnet.helius-rpc.com/?api-key=..." АДРЕС_VAULT_SQUADS
# ВАЖНО: указывать адрес VAULT (хранилища) из Squads, а не адрес самой мультиподписи.
set -e
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$HOME/.cargo/bin:$PATH"
export TS_NODE_TRANSPILE_ONLY=true
RPC="$1"; VAULT="$2"; KEY="$HOME/.config/solana/mainnet-admin.json"
case "$RPC" in *mainnet*) ;; *) echo "!! Нужна ссылка MAINNET RPC"; exit 1;; esac
[ -n "$VAULT" ] || { echo "!! Укажи адрес Vault из Squads вторым параметром"; exit 1; }
PID=$(solana address -k target/deploy/help_split-keypair.json)

LOG=mainnet/handover-log.txt; exec > >(tee "$LOG") 2>&1
echo "Права админа и право обновлять контракт $PID"
echo "будут переданы адресу: $VAULT"
echo "После этого любые изменения — только через Squads (app.squads.so) с подписями участников."
read -r -p "Проверь адрес Vault ещё раз. Напиши ПЕРЕДАТЬ, чтобы продолжить: " ANSWER
[ "$ANSWER" = "ПЕРЕДАТЬ" ] || { echo "Отменено."; exit 1; }

ANCHOR_PROVIDER_URL="$RPC" ANCHOR_WALLET="$KEY" NEW_ADMIN="$VAULT" npx ts-node mainnet/set-admin.ts
solana program set-upgrade-authority "$PID" \
  --new-upgrade-authority "$VAULT" --skip-new-upgrade-authority-signer-check \
  --upgrade-authority "$KEY" --keypair "$KEY" --url "$RPC"
echo; echo "=== Управление передано мультиподписи $VAULT ==="
solana program show "$PID" --url "$RPC"
