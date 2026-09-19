#!/usr/bin/env bash
# ==============================================================================
# VILLA TURAMAN AIRBNB PLATFORM — ВОЗОБНОВЛЕНИЕ РАБОТЫ САЙТА (VERCEL RESUME)
# Целевая ветка: v1-airbnb
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Переходим в корень проекта/ветки v1-airbnb
cd "$SCRIPT_DIR/.." || exit 1

echo "================================================================="
echo "  ⚡ Возобновление работы сайта: Ветка v1-airbnb"
echo "  Проект: Villa Turaman Airbnb Platform"
echo "================================================================="

echo "1. Удаление файлов заглушки и конфигурации обслуживания..."
if [ -f "maintenance.html" ] || [ -f "vercel.json" ]; then
    git rm -f maintenance.html vercel.json 2>/dev/null || rm -f maintenance.html vercel.json
fi

echo "2. Фиксация в Git и отправка в ветку v1-airbnb..."
git commit -m "chore: отключение режима обслуживания и возврат в строй (ветка v1-airbnb)" || true
git push origin v1-airbnb || git push origin HEAD:v1-airbnb

echo "================================================================="
echo "  УСПЕХ! Режим обслуживания деактивирован. Vercel пересобирает сайт."
echo "================================================================="
