#!/usr/bin/env bash
# ЗАПУСК В MAINNET (настоящие деньги). Запуск из папки проекта:
#   bash mainnet/deploy-mainnet.sh "https://mainnet.helius-rpc.com/?api-key=ВАШ_КЛЮЧ"
set -e
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$HOME/.cargo/bin:$PATH"
export TS_NODE_TRANSPILE_ONLY=true

RPC="$1"
CREATOR="DdTPV7RmR7XRritRBTSQLTKi7mFDeWyrjA43n7EibYbM"     # кошелёк для 6% (Trust Wallet)
KEY="$HOME/.config/solana/mainnet-admin.json"              # НОВЫЙ кошелёк только для mainnet
NEED_SOL=5.5   # временно: залог за буфер + за контракт; ~половина вернётся сразу после загрузки

case "$RPC" in *mainnet*) ;; *) echo "!! Нужна ссылка MAINNET RPC, например https://mainnet.helius-rpc.com/?api-key=..."; exit 1;; esac

# 1. Кошелёк админа для mainnet (не тестовый — его фраза засвечена на скриншотах)
if [ ! -f "$KEY" ]; then
  echo "Создаю новый кошелёк админа для mainnet."
  echo "Сейчас появятся 12 слов. ЗАПИШИ ИХ НА БУМАГУ. Не фотографируй, не делай скриншот, никому не показывай."
  read -r -p "Готов? Нажми Enter..." _
  solana-keygen new --no-bip39-passphrase -o "$KEY"
  read -r -p "Записал 12 слов на бумагу? Нажми Enter..." _
  clear
fi
ADMIN=$(solana address -k "$KEY")

LOG=mainnet/deploy-mainnet-log.txt; exec > >(tee "$LOG") 2>&1
PID=$(solana address -k target/deploy/help_split-keypair.json)
echo "Сеть:             MAINNET (${RPC%%\?*})"
echo "Контракт:         $PID"
echo "Админ (mainnet):  $ADMIN"
echo "Кошелёк для 6%:  $CREATOR"

BAL=$(solana balance "$ADMIN" --url "$RPC" | cut -d' ' -f1)
echo "Баланс админа:    $BAL SOL"
if awk "BEGIN{exit !($BAL < $NEED_SOL)}"; then
  echo; echo "!! Нужно минимум $NEED_SOL SOL на адресе $ADMIN."
  echo "   Переведи SOL с биржи или Trust Wallet на этот адрес и запусти скрипт снова."
  exit 1
fi

if solana program show "$PID" --url "$RPC" >/dev/null 2>&1; then
  echo; echo "Контракт уже есть в mainnet — будет ОБНОВЛЕНИЕ кода."
fi
echo
read -r -p "Это настоящие деньги. Напиши MAINNET, чтобы продолжить: " ANSWER
[ "$ANSWER" = "MAINNET" ] || { echo "Отменено."; exit 1; }

# 2. Сборка
anchor build

# 3. Деплой с повторами
for i in 1 2 3 4 5; do
  if solana program deploy target/deploy/help_split.so \
       --program-id target/deploy/help_split-keypair.json \
       --keypair "$KEY" --upgrade-authority "$KEY" \
       --url "$RPC" --use-rpc --with-compute-unit-price 20000; then
    break
  fi
  if [ "$i" -eq 5 ]; then
    echo "!! Деплой не прошёл 5 раз. Возвращаю SOL из временных буферов..."
    solana program close --buffers --keypair "$KEY" --url "$RPC" || true
    exit 1
  fi
  echo "Повтор через 20 секунд ($i/5)..."
  solana program close --buffers --keypair "$KEY" --url "$RPC" >/dev/null 2>&1 || true
  sleep 20
done

# 4. Конфигурация (админ = этот кошелёк, 6% = Trust Wallet)
ANCHOR_PROVIDER_URL="$RPC" ANCHOR_WALLET="$KEY" CREATOR="$CREATOR" npx ts-node mainnet/init-mainnet.ts

echo
echo "=== КОНТРАКТ ЗАПУЩЕН В MAINNET ==="
echo "Explorer: https://explorer.solana.com/address/$PID"
echo "Остаток на кошельке админа: $(solana balance "$ADMIN" --url "$RPC")"
echo
echo "Дальше (см. mainnet/README-MAINNET.md):"
echo "  1) заполнить mainnet/causes.json реальными получателями и запустить mainnet/add-causes.sh"
echo "  2) передать управление мультиподписи: mainnet/handover-multisig.sh"
echo "  3) переключить сайт: app/config.js"
