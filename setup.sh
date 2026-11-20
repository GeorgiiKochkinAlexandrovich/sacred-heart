#!/usr/bin/env bash
# Установка инструментов в Ubuntu (WSL). Запуск: bash setup.sh
set -e
sudo apt-get update
sudo apt-get install -y build-essential pkg-config libudev-dev llvm libclang-dev protobuf-compiler libssl-dev curl git
# Официальный установщик: Rust + Solana CLI + Anchor (avm) + Node
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
source "$HOME/.cargo/env" || true
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$HOME/.cargo/bin:$PATH"
avm install 0.31.1 && avm use 0.31.1
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs
fi
echo; rustc --version; solana --version; anchor --version; node --version
echo "Готово. Закрой и открой терминал Ubuntu заново, потом: bash deploy-devnet.sh"
