#!/usr/bin/env bash
# Добавляет направления из mainnet/causes.json.
#   Проверка:  bash mainnet/add-causes.sh "https://mainnet.helius-rpc.com/?api-key=..."
#   Отправка:  bash mainnet/add-causes.sh "https://mainnet.helius-rpc.com/?api-key=..." yes
set -e
cd "$(dirname "$0")/.."
export TS_NODE_TRANSPILE_ONLY=true
RPC="$1"; KEY="$HOME/.config/solana/mainnet-admin.json"
case "$RPC" in *mainnet*) ;; *) echo "!! Нужна ссылка MAINNET RPC"; exit 1;; esac
[ -f "$KEY" ] || { echo "!! Нет кошелька админа $KEY. Сначала deploy-mainnet.sh"; exit 1; }
ANCHOR_PROVIDER_URL="$RPC" ANCHOR_WALLET="$KEY" CONFIRM="${2:-no}" npx ts-node mainnet/add-causes.ts
