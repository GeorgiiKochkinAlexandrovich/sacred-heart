#!/usr/bin/env bash
# Обновляет контракт в DEVNET после изменений в коде.
# Запуск: bash upgrade-devnet.sh "https://devnet.helius-rpc.com/?api-key=ВАШ_КЛЮЧ"
set -e
cd "$(dirname "$0")"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$HOME/.cargo/bin:$PATH"
LOG=upgrade-log.txt; exec > >(tee "$LOG") 2>&1

# Сервер devnet: свой (Helius) из аргумента, иначе публичный
RPC_URL="${1:-https://api.devnet.solana.com}"
case "$RPC_URL" in *devnet*) ;; *) echo "!! Это не devnet-адрес. Нужна ссылка вида https://devnet.helius-rpc.com/?api-key=..."; exit 1;; esac
solana config set --url "$RPC_URL" >/dev/null
echo "Сервер: ${RPC_URL%%\?*}"
PID=$(solana address -k target/deploy/help_split-keypair.json)

# 1. Вернуть SOL из неудачных попыток деплоя (временные буферы)
solana program close --buffers || true
echo "Баланс CLI-кошелька: $(solana balance)"

# 2. Сборка (быстро, если ничего не менялось)
anchor build

# 3. Если новая версия больше старой — расширить место под контракт
NEW_SIZE=$(stat -c%s target/deploy/help_split.so)
CUR_SIZE=$(solana program show "$PID" | awk '/Data Length/{print $3}')
echo "Размер: был $CUR_SIZE, стал $NEW_SIZE байт"
if [ "$NEW_SIZE" -gt "$CUR_SIZE" ]; then
  EXTRA=$((NEW_SIZE - CUR_SIZE + 4096))
  [ "$EXTRA" -lt 20480 ] && EXTRA=20480   # сеть требует минимум 10240 байт за раз
  echo "Расширяю контракт на $EXTRA байт..."
  solana program extend "$PID" "$EXTRA"
fi

# 4. Обновление контракта (через RPC, с повторами — публичный devnet часто перегружен)
for i in 1 2 3 4 5; do
  if solana program deploy target/deploy/help_split.so \
       --program-id target/deploy/help_split-keypair.json --use-rpc; then
    break
  fi
  if [ "$i" -eq 5 ]; then echo "!! Деплой не прошёл 5 раз подряд. Подожди пару минут и запусти скрипт снова."; exit 1; fi
  echo "Сервер devnet занят, повтор через 20 секунд ($i/5)..."
  solana program close --buffers >/dev/null 2>&1 || true
  sleep 20
done

echo; echo "=== ГОТОВО: контракт в devnet обновлён ==="
