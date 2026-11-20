#!/usr/bin/env bash
# Публикация проекта на GitHub. Запуск в Ubuntu: bash publish-github.sh
set -e
cd "$(dirname "$0")"
REPO="sacred-heart"

if ! command -v gh >/dev/null; then sudo apt-get update && sudo apt-get install -y gh git; fi
gh auth status >/dev/null 2>&1 || gh auth login --hostname github.com --git-protocol https --web

git config --global user.name  >/dev/null || git config --global user.name  "Georgii Kochkin"
git config --global user.email >/dev/null || git config --global user.email "georgiihelpii@proton.me"
git config --global --add safe.directory "$(pwd)"

[ -d .git ] || git init -b main
git add -A

# Проверка: ни одного секрета в коммите
if git diff --cached --name-only | grep -Ei '(test-wallets/|deploy-log|keypair|id\.json|\.env)'; then
  echo "!! СТОП: в коммит попали секретные файлы (список выше). Ничего не опубликовано."
  exit 1
fi

git diff --cached --quiet || git commit -m "Sacred Heart: смарт-контракт, сайт и скрипты деплоя (devnet)"

if git remote get-url origin >/dev/null 2>&1; then
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Sacred Heart — прозрачная благотворительность на Solana: 85% каждого пожертвования на помощь"
fi
echo; echo "Готово: https://github.com/$(gh api user -q .login)/$REPO"
