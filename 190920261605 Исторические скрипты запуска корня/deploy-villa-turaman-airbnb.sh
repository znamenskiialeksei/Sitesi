#!/usr/bin/env bash
# ==============================================================================
# VILLA TURAMAN AIRBNB PLATFORM v2.0 — МОНОЛИТНЫЙ BASH-СКРИПТ РАЗВЕРТЫВАНИЯ
# Файл: deploy-villa-turaman-airbnb.sh
# Целевой проект: villa-turaman-airbnb-platform (Двухкабинетная архитектура Airbnb)
# Владелец: Aleksei Znamenskii | VKN: 9991120181 | Локация: Dalyan, Mugla, Turkey
# ==============================================================================
# Назначение:
# 1. Развертывание платформы в любой новой папке в 1 команду: bash deploy-villa-turaman-airbnb.sh [FOLDER]
# 2. Авто-создание 14 листов Google Sheets CRM со смарт-форматированием (autoResizeDimensions, WRAP, MIDDLE, ';')
# 3. Развертывание расширения Google Apps Script (Code.js) с поддержкой Свойств скрипта (Script Properties)
# 4. Настройка задач VS Code (.vscode/tasks.json) для среды PowerShell 7 (pwsh.exe)
# ==============================================================================

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
RESET='\033[0m'

TARGET_DIR="${1:-villa-turaman-airbnb-platform}"
CURRENT_DIR="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
echo -e "${YELLOW}${BOLD}  🏡 VILLA TURAMAN AIRBNB PLATFORM v2.0 — ПОЛНОЕ АВТОНОМНОЕ РАЗВЕРТЫВАНИЕ${RESET}"
echo -e "${CYAN}  Архитектура: Airbnb 2.0 (Раздельные кабинеты /guest и /host, Модульные блоки)${RESET}"
echo -e "${CYAN}  Владелец: Aleksei Znamenskii | Налоговый номер: VKN 9991120181${RESET}"
echo -e "${CYAN}  Целевая папка: ${TARGET_DIR}${RESET}"
echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
echo ""

# Проверка окружения
echo -e "${MAGENTA}${BOLD}==>${RESET} ${BOLD}Этап 1: Проверка системных требований (Node.js 18+ и npm)${RESET}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ОШИБКА] Node.js не найден! Установите Node.js 18+ с https://nodejs.org/${RESET}"
    exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}[УСПЕХ] Node.js обнаружен: ${NODE_VER}${RESET}"

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}[ОШИБКА] npm не найден!${RESET}"
    exit 1
fi
NPM_VER=$(npm -v)
echo -e "${GREEN}[УСПЕХ] npm обнаружен: v${NPM_VER}${RESET}"

# Подготовка целевой директории
echo -e "\n${MAGENTA}${BOLD}==>${RESET} ${BOLD}Этап 2: Инициализация файловой структуры проекта${RESET}"

# Если скрипт запущен уже внутри проекта villa-turaman-airbnb-platform
if [ -f "package.json" ] && grep -q "villa-turaman-airbnb-platform" package.json 2>/dev/null; then
    PROJECT_ROOT="$CURRENT_DIR"
    echo -e "${CYAN}[ИНФО] Развертывание в текущей директории: ${PROJECT_ROOT}${RESET}"
else
    mkdir -p "$TARGET_DIR"
    PROJECT_ROOT="$(cd "$TARGET_DIR" && pwd)"
    echo -e "${CYAN}[ИНФО] Развертывание в каталог: ${PROJECT_ROOT}${RESET}"
fi

cd "$PROJECT_ROOT"

# Создание каталогов проекта
mkdir -p .vscode components components/GuestCabinet components/HostCabinet components/Modals \
         context google-apps-script pages pages/api pages/api/admin pages/api/webhooks \
         pages/guest pages/host pages/legal public public/images scripts styles utils scratch _BACKUPS

# Если исходные файлы доступны рядом со скриптом, копируем их
PARENT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_CANDIDATE="$SCRIPT_DIR"
if [ ! -f "$SOURCE_CANDIDATE/package.json" ] && [ -f "$PARENT_DIR/package.json" ]; then
    SOURCE_CANDIDATE="$PARENT_DIR"
fi

if [ "$SOURCE_CANDIDATE" != "$PROJECT_ROOT" ] && [ -f "$SOURCE_CANDIDATE/package.json" ]; then
    echo -e "${CYAN}[ИНФО] Копирование исходных файлов из репозитория ${SOURCE_CANDIDATE}...${RESET}"
    cp -ru "$SOURCE_CANDIDATE"/components "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/components "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/context "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/context "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/google-apps-script "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/google-apps-script "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/pages "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/pages "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/public "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/public "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/scripts "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/scripts "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/styles "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/styles "$PROJECT_ROOT"/
    cp -ru "$SOURCE_CANDIDATE"/utils "$PROJECT_ROOT"/ 2>/dev/null || cp -r "$SOURCE_CANDIDATE"/utils "$PROJECT_ROOT"/
    cp -u "$SOURCE_CANDIDATE"/*.js "$PROJECT_ROOT"/ 2>/dev/null || true
    cp -u "$SOURCE_CANDIDATE"/*.json "$PROJECT_ROOT"/ 2>/dev/null || true
    cp -u "$SOURCE_CANDIDATE"/deploy_and_run.* "$PROJECT_ROOT"/ 2>/dev/null || true
fi

# Настройка .env.local если отсутствует
if [ ! -f ".env.local" ]; then
    echo -e "${CYAN}[ИНФО] Создание шаблона .env.local...${RESET}"
    cat << 'EOF' > .env.local
# Базовый URL платформы
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Google Cloud Service Account (Основная база данных Google Sheets)
GOOGLE_CLIENT_EMAIL="your-service-account-email@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID="1ESfaH3FBOx-Z0Z1CKU8-c1cQZCE2YjJBiTvX0MV0A5Q"

# Telegram Bot (Уведомления владельца о новых заявках)
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# 2FA Secret для входа хозяина
NEXT_PUBLIC_ADMIN_2FA_SECRET="BASE32SECRET32323232323232323232"

# Секретный ключ для On-demand ISR ревалидации
REVALIDATE_SECRET_TOKEN="YOUR_VERY_SECRET_RANDOM_STRING"

# Deploy Hook панели Vercel (необязательно)
VERCEL_DEPLOY_HOOK_URL=""
EOF
fi

# Настройка package.json если отсутствует
if [ ! -f "package.json" ]; then
    echo -e "${CYAN}[ИНФО] Генерация package.json...${RESET}"
    cat << 'EOF' > package.json
{
  "name": "villa-turaman-airbnb-platform",
  "version": "2.0.0",
  "private": true,
  "description": "Премиальная платформа аренды виллы Villa Turaman в стиле Airbnb с разделением кабинетов хозяина и гостя",
  "scripts": {
    "dev": "next dev",
    "build": "node scripts/init-google-sheets.js && next build",
    "start": "next start",
    "lint": "next lint",
    "init-db": "node scripts/init-google-sheets.js"
  },
  "dependencies": {
    "@paypal/checkout-server-sdk": "^1.0.3",
    "@vercel/kv": "^3.0.0",
    "axios": "^1.19.0",
    "bcryptjs": "^3.0.3",
    "date-fns": "^2.30.0",
    "dotenv": "^17.4.2",
    "force-graph": "^1.51.4",
    "googleapis": "^174.0.0",
    "iyzipay": "^2.0.69",
    "jsonwebtoken": "^9.0.3",
    "lucide-react": "^1.28.0",
    "next": "14.2.35",
    "node-ical": "^0.27.1",
    "pdfkit": "^0.19.1",
    "qrcode": "^1.5.4",
    "react": "^18.2.0",
    "react-datepicker": "^9.1.0",
    "react-dom": "^18.2.0",
    "speakeasy": "^2.0.0",
    "stripe": "^22.4.0",
    "yookassa": "^0.1.1"
  },
  "devDependencies": {
    "@types/node": "^26.1.2",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.35",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.5"
  }
}
EOF
fi

# Настройка VS Code tasks.json под стандарт pwsh.exe
echo -e "${CYAN}[ИНФО] Настройка задач VS Code (.vscode/tasks.json)...${RESET}"
cat << 'EOF' > .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 1. Запуск Сервера Разработки Airbnb (Dev: Port 3000)",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true,
      "problemMatcher": "$tsc-watch",
      "group": { "kind": "build", "isDefault": true }
    },
    {
      "label": "⚡ 2. Сборка Проекта (Build Next.js)",
      "type": "shell",
      "command": "npm run build",
      "problemMatcher": []
    },
    {
      "label": "🌐 3. Запуск Продакшн Сервера (Start)",
      "type": "shell",
      "command": "npm start",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "📊 4. Инициализация и Форматирование Google Sheets (14 листов CRM)",
      "type": "shell",
      "command": "node scripts/init-google-sheets.js",
      "problemMatcher": []
    },
    {
      "label": "🧹 5. Очистить порт 3000 в Windows",
      "type": "shell",
      "command": "pwsh.exe -ExecutionPolicy Bypass -Command \"Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }\"",
      "problemMatcher": []
    },
    {
      "label": "⏸️ 6. Перевести сайт в режим обслуживания - Vercel Pause",
      "type": "shell",
      "command": "bash \".\\160519092026 Исторические скрипты запуска корня\\pause-site.sh\"",
      "problemMatcher": []
    },
    {
      "label": "▶️ 7. Возобновить штатную работу сайта - Vercel Resume",
      "type": "shell",
      "command": "bash \".\\160519092026 Исторические скрипты запуска корня\\resume-site.sh\"",
      "problemMatcher": []
    }
  ]
}
EOF

# Установка npm зависимостей
echo -e "\n${MAGENTA}${BOLD}==>${RESET} ${BOLD}Этап 3: Установка зависимостей платформы (npm install)${RESET}"
npm install --no-audit --no-fund

# Автономная инициализация Google Sheets CRM
echo -e "\n${MAGENTA}${BOLD}==>${RESET} ${BOLD}Этап 4: Автономная инициализация и смарт-форматирование Google Sheets (14 листов)${RESET}"
if [ -f "scripts/init-google-sheets.js" ]; then
    node scripts/init-google-sheets.js || true
else
    echo -e "${YELLOW}[ВНИМАНИЕ] scripts/init-google-sheets.js не найден. Пропуск инициализации таблицы.${RESET}"
fi

# Итоговый отчет
echo -e "\n${GREEN}${BOLD}===============================================================================${RESET}"
echo -e "${GREEN}${BOLD}  ✅ РАЗВЕРТЫВАНИЕ VILLA TURAMAN AIRBNB PLATFORM v2.0 УСПЕШНО ЗАВЕРШЕНО!${RESET}"
echo -e "${GREEN}${BOLD}===============================================================================${RESET}"
echo ""
echo -e "${YELLOW}${BOLD}📋 ИНСТРУКЦИЯ ПО НАСТРОЙКЕ GOOGLE APPS SCRIPT И СВОЙСТВ СКРИПТА:${RESET}"
echo -e "  1. Откройте вашу Google Таблицу в браузере."
echo -e "  2. Выберите: ${CYAN}Расширения (Extensions) ➔ Apps Script${RESET}."
echo -e "  3. Скопируйте и вставьте код из: ${CYAN}google-apps-script/Code.js${RESET} и сохраните (Ctrl+S)."
echo -e "  4. Перезагрузите таблицу (F5) — появится меню ${GREEN}🏡 Villa Turaman Suite${RESET}."
echo -e "  5. Нажмите: ${CYAN}🏡 Villa Turaman Suite ➔ ⚙️ 6. Системный аудит & Свойства ➔ 🔑 1. Настроить Свойства скрипта${RESET}."
echo -e "     (Подробная инструкция: ${CYAN}google-apps-script/СВОЙСТВА_СКРИПТА_И_ИНСТРУКЦИЯ.md${RESET})"
echo ""
echo -e "${YELLOW}${BOLD}🚀 ВАРИАНТЫ ЗАПУСКА ПЛАТФОРМЫ (СТАНДАРТ ТРОЙНОГО ДУБЛИРОВАНИЯ VS CODE):${RESET}"
echo -e "  ${BOLD}Способ 1 (Интерфейс VS Code):${RESET} Нажмите ${CYAN}Ctrl+Shift+B${RESET} или ${CYAN}F5${RESET} для старта сервера."
echo -e "  ${BOLD}Способ 2 (Задачи VS Code):${RESET}    ${CYAN}Ctrl+Shift+P${RESET} ➔ ${CYAN}Tasks: Run Task${RESET} ➔ ${GREEN}🚀 1. Запуск Сервера Разработки Airbnb${RESET}."
echo -e "  ${BOLD}Способ 3 (Терминал VS Code):${RESET}   Выполните в pwsh: ${CYAN}npm run dev${RESET}."
echo ""
echo -e "  🌐 Локальный адрес витрины: ${CYAN}http://localhost:3000${RESET}"
echo -e "  👤 Кабинет гостя:           ${CYAN}http://localhost:3000/guest${RESET}"
echo -e "  👑 Кабинет хозяина:         ${CYAN}http://localhost:3000/host${RESET}"
echo ""
