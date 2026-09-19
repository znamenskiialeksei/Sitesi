#!/usr/bin/env bash
# ==============================================================================
# VILLA TURAMAN AIRBNB PLATFORM — МАСТЕР-СКРИПТ АВТОМАТИЗАЦИИ И РАЗВЕРТЫВАНИЯ
# Скрипт: deploy_and_run.sh
# Назначение: Развертывание платформы в 1 клик, проверка Node.js/npm, установка
#             зависимостей, настройка VS Code tasks, авто-очистка портов и запуск.
# ==============================================================================

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
RESET='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

print_banner() {
    clear
    echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
    echo -e "${YELLOW}${BOLD}  ⚡ VILLA TURAMAN AIRBNB PLATFORM v2.0 — АВТОМАТИЗИРОВАННЫЙ СТАРТ${RESET}"
    echo -e "${CYAN}  Владелец: Aleksei Znamenskii | Объект: Villa Turaman (Dalyan, Turkey)${RESET}"
    echo -e "${CYAN}  Налоговый номер: VKN 9991120181 | Раздельные кабинеты: Гость / Хозяин${RESET}"
    echo -e "${CYAN}  Директория: ${SCRIPT_DIR}${RESET}"
    echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
    echo ""
}

log_info() {
    echo -e "${CYAN}[ИНФО]${RESET} $1"
}

log_success() {
    echo -e "${GREEN}[УСПЕХ]${RESET} $1"
}

log_warn() {
    echo -e "${YELLOW}[ВНИМАНИЕ]${RESET} $1"
}

log_error() {
    echo -e "${RED}[ОШИБКА]${RESET} $1"
}

log_step() {
    echo -e "\n${MAGENTA}${BOLD}==>${RESET} ${BOLD}$1${RESET}"
}

check_prerequisites() {
    log_step "Этап 1: Проверка окружения Node.js и npm"
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js не установлен! Установите Node.js 18+ с https://nodejs.org/"
        exit 1
    fi
    log_success "Node.js обнаружен: $(node -v)"

    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm не обнаружен!"
        exit 1
    fi
    log_success "npm обнаружен: v$(npm -v)"
}

setup_directories() {
    log_step "Этап 2: Проверка и создание системных директорий"
    DIRS=(".vscode" "scratch" "_BACKUPS" "public" "components" "utils" "pages")
    for dir in "${DIRS[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "Создана папка: $dir"
        fi
    done
    log_success "Файловая структура готова к работе."
}

setup_vscode_tasks() {
    log_step "Этап 3: Конфигурация VS Code (.vscode/tasks.json)"
    TASKS_FILE=".vscode/tasks.json"
    cat << 'EOF' > "$TASKS_FILE"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "1. Запуск Сервера Разработки (Dev: Port 3000)",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true,
      "problemMatcher": "$tsc-watch",
      "group": { "kind": "build", "isDefault": true }
    },
    {
      "label": "2. Сборка Проекта (Build Next.js)",
      "type": "shell",
      "command": "npm run build",
      "problemMatcher": []
    },
    {
      "label": "3. Запуск Продакшн Сервера (Start)",
      "type": "shell",
      "command": "npm start",
      "problemMatcher": []
    },
    {
      "label": "4. Синхронизация Контента (Google Sheets -> content.json)",
      "type": "shell",
      "command": "node scripts/sync-content.js",
      "problemMatcher": []
    },
    {
      "label": "5. Инициализация Структуры Google Sheets CRM",
      "type": "shell",
      "command": "node scripts/init-google-sheets.js",
      "problemMatcher": []
    }
  ]
}
EOF
    log_success "Файл .vscode/tasks.json успешно настроен."
}

install_dependencies() {
    log_step "Этап 4: Проверка npm зависимостей"
    if [ ! -d "node_modules" ]; then
        log_info "Установка npm пакетов..."
        npm install
        log_success "Зависимости успешно установлены."
    else
        log_success "Каталог node_modules уже существует."
    fi
}

free_port() {
    local port=${1:-3000}
    log_info "Проверка доступности порта ${port}..."
    if command -v netstat >/dev/null 2>&1; then
        PID=$(netstat -ano 2>/dev/null | grep ":${port} " | grep "LISTENING" | awk '{print $5}' | head -n 1)
        if [ -n "$PID" ] && [ "$PID" -ne 0 ]; then
            log_warn "Порт ${port} занят процессом PID ${PID}. Выполняется освобождение..."
            taskkill //F //PID "$PID" >/dev/null 2>&1 || true
            sleep 1
            log_success "Порт ${port} успешно освобожден."
        else
            log_success "Порт ${port} свободен."
        fi
    fi
}

interactive_menu() {
    while true; do
        print_banner
        echo -e "${BOLD}Выберите действие для запуска платформы:${RESET}"
        echo -e "  ${GREEN}1)${RESET} Запустить сервер разработки (npm run dev -> http://localhost:3000)"
        echo -e "  ${GREEN}2)${RESET} Собрать и запустить боевую версию (npm run build && npm start)"
        echo -e "  ${GREEN}3)${RESET} Синхронизировать контент с Google Sheets (sync-content.js)"
        echo -e "  ${GREEN}4)${RESET} Инициализировать таблицы CRM Google Sheets (init-google-sheets.js)"
        echo -e "  ${GREEN}5)${RESET} Проверить и освободить порт 3000"
        echo -e "  ${GREEN}6)${RESET} ⏸️ Перевести сайт в режим обслуживания (Vercel Pause)"
        echo -e "  ${GREEN}7)${RESET} ▶️ Возобновить штатную работу сайта (Vercel Resume)"
        echo -e "  ${RED}0)${RESET} Выход"
        echo ""
        read -r -p "Введите номер команды (0-7): " CHOICE

        case "$CHOICE" in
            1)
                free_port 3000
                log_info "Запуск dev-сервера на http://localhost:3000..."
                npm run dev
                ;;
            2)
                free_port 3000
                log_info "Сборка и старт Next.js..."
                npm run build && npm start
                ;;
            3)
                log_info "Синхронизация с Google Sheets..."
                node scripts/sync-content.js
                read -r -p "Нажмите Enter для возврата в меню..."
                ;;
            4)
                log_info "Инициализация таблиц Google Sheets..."
                node scripts/init-google-sheets.js
                read -r -p "Нажмите Enter для возврата в меню..."
                ;;
            5)
                free_port 3000
                read -r -p "Нажмите Enter для возврата в меню..."
                ;;
            6)
                bash "160519092026 Исторические скрипты запуска корня/pause-site.sh"
                read -r -p "Нажмите Enter для возврата в меню..."
                ;;
            7)
                bash "160519092026 Исторические скрипты запуска корня/resume-site.sh"
                read -r -p "Нажмите Enter для возврата в меню..."
                ;;
            0)
                echo -e "\n${GREEN}Работа завершена.${RESET}"
                exit 0
                ;;
            *)
                log_warn "Неверный ввод. Пожалуйста, укажите цифру от 0 до 7."
                sleep 1
                ;;
        esac
    done
}

# Выполнение шагов развертывания
print_banner
check_prerequisites
setup_directories
setup_vscode_tasks
install_dependencies
free_port 3000

# Если переданы аргументы CLI, запускаем конкретную задачу, иначе интерактивное меню
if [ "$1" == "--dev" ]; then
    npm run dev
elif [ "$1" == "--build" ]; then
    npm run build
elif [ "$1" == "--sync" ]; then
    node scripts/sync-content.js
elif [ "$1" == "--init" ]; then
    node scripts/init-google-sheets.js
else
    interactive_menu
fi

