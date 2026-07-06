#!/bin/bash
set -e
cd "$(dirname "$0")/.."

if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

git add -A
git commit -m "Auto-save: work in progress $(date '+%Y-%m-%d %H:%M')"
git push origin main
