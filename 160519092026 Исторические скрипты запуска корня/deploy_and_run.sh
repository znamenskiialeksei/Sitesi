#!/usr/bin/env bash
# ==============================================================================
# VILLA TURAMAN AIRBNB PLATFORM — МАСТЕР-СКРИПТ АВТОМАТИЗАЦИИ И РАЗВЕРТЫВАНИЯ
# Скрипт: deploy_and_run.sh
# Ветка: v1-airbnb (Изолированная платформа бронирования в стиле Airbnb)
# ==============================================================================

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
RESET='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Если скрипт вызван из папки исторических скриптов, переходим в корень проекта
if [[ "$SCRIPT_DIR" == *"Исторические скрипты"* ]]; then
    cd "$SCRIPT_DIR/.." || exit 1
else
    cd "$SCRIPT_DIR" || exit 1
fi
ROOT_DIR="$(pwd)"

print_banner() {
    clear
    echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
    echo -e "${YELLOW}${BOLD}  ⚡ VILLA TURAMAN AIRBNB PLATFORM (ВЕТКА v1-airbnb) — МАСТЕР-СТАРТЕР${RESET}"
    echo -e "${CYAN}  Владелец: Aleksei Znamenskii | Объект: Villa Turaman (Dalyan, Turkey)${RESET}"
    echo -e "${CYAN}  Кабинеты: Раздельные Личные кабинеты Хозяина и Гостя | Налог: VKN 9991120181${RESET}"
    echo -e "${CYAN}  Директория: ${ROOT_DIR}${RESET}"
    echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
    echo ""
}

log_info() { echo -e "${CYAN}[ИНФО]${RESET} $1"; }
log_success() { echo -e "${GREEN}[УСПЕХ]${RESET} $1"; }
log_warn() { echo -e "${YELLOW}[ВНИМАНИЕ]${RESET} $1"; }
log_error() { echo -e "${RED}[ОШИБКА]${RESET} $1"; }
log_step() { echo -e "\n${MAGENTA}${BOLD}==>${RESET} ${BOLD}$1${RESET}"; }

check_prerequisites() {
    log_step "Этап 1: Проверка системных требований"
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js не установлен! Пожалуйста, установите Node.js 18+ с https://nodejs.org/"
        exit 1
    fi
    log_success "Node.js обнаружен: $(node -v)"

    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm не обнаружен в системе!"
        exit 1
    fi
    log_success "npm обнаружен: v$(npm -v)"
}

setup_directories() {
    log_step "Этап 2: Проверка файловой структуры"
    DIRS=(".vscode" "public/images" "invoices" "scratch")
    for d in "${DIRS[@]}"; do
        if [ ! -d "$d" ]; then
            mkdir -p "$d"
            log_info "Создана папка: $d"
        fi
    done
    log_success "Файловая структура готова."
}

install_dependencies() {
    log_step "Этап 3: Проверка npm зависимостей"
    if [ ! -d "node_modules" ]; then
        log_info "Установка npm пакетов..."
        npm install
        log_success "Зависимости успешно установлены."
    else
        log_success "Каталог node_modules активен."
    fi
}

free_port_3000() {
    log_info "Проверка доступности порта 3000..."
    if command -v pwsh >/dev/null 2>&1; then
        pwsh -Command "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }" 2>/dev/null || true
    elif command -v netstat >/dev/null 2>&1; then
        PID=$(netstat -ano 2>/dev/null | grep ":3000 " | grep "LISTENING" | awk '{print $5}' | head -n 1)
        if [ -n "$PID" ] && [ "$PID" -ne 0 ]; then
            taskkill //F //PID "$PID" >/dev/null 2>&1 || true
        fi
    fi
    log_success "Порт 3000 свободен и готов к работе."
}

interactive_menu() {
    while true; do
        print_banner
        echo -e "${YELLOW}${BOLD}ВЫБЕРИТЕ ДЕЙСТВИЕ ДЛЯ ЗАПУСКА ПЛАТФОРМЫ AIRBNB:${RESET}"
        echo -e "  ${GREEN}${BOLD}[1]${RESET} 🚀 Запустить Dev-сервер (npm run dev -> http://localhost:3000)"
        echo -e "  ${GREEN}${BOLD}[2]${RESET} 📦 Собрать боевую версию (npm run build)"
        echo -e "  ${GREEN}${BOLD}[3]${RESET} ⚡ Запустить боевую версию (npm start)"
        echo -e "  ${GREEN}${BOLD}[4]${RESET} 📊 Синхронизация контента (Google Sheets -> content.json)"
        echo -e "  ${GREEN}${BOLD}[5]${RESET} 🏛️ Инициализация CRM таблиц Google Sheets"
        echo -e "  ${GREEN}${BOLD}[6]${RESET} ⏸️ Перевести сайт в режим обслуживания (Vercel Pause)"
        echo -e "  ${GREEN}${BOLD}[7]${RESET} ▶️ Возобновить штатную работу сайта (Vercel Resume)"
        echo -e "  ${GREEN}${BOLD}[8]${RESET} 🧹 Освободить порт 3000"
        echo -e "  ${RED}${BOLD}[0]${RESET} 🚪 Выход"
        echo ""
        read -rp "Введите номер пункта [0-8] (по умолчанию: 1): " choice
        choice=${choice:-1}

        case "$choice" in
            1)
                free_port_3000
                log_info "Старт Next.js Dev сервера на http://localhost:3000..."
                npm run dev
                ;;
            2)
                log_info "Сборка проекта..."
                npm run build
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            3)
                free_port_3000
                log_info "Старт Production сервера..."
                npm start
                ;;
            4)
                log_info "Синхронизация контента с Google Sheets..."
                node scripts/sync-content.js
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            5)
                log_info "Инициализация таблиц CRM..."
                node scripts/init-google-sheets.js
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            6)
                bash "160519092026 Исторические скрипты запуска корня/pause-site.sh"
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            7)
                bash "160519092026 Исторические скрипты запуска корня/resume-site.sh"
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            8)
                free_port_3000
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            0)
                echo -e "\n${CYAN}Завершение работы. Удачного дня!${RESET}\n"
                exit 0
                ;;
            *)
                log_warn "Неверный выбор. Введите число от 0 до 8."
                sleep 1
                ;;
        esac
    done
}

# Инициализация и запуск
print_banner
check_prerequisites
setup_directories
install_dependencies
free_port_3000

if [ "$1" == "--dev" ]; then
    npm run dev
elif [ "$1" == "--build" ]; then
    npm run build
elif [ "$1" == "--pause" ]; then
    bash "160519092026 Исторические скрипты запуска корня/pause-site.sh"
elif [ "$1" == "--resume" ]; then
    bash "160519092026 Исторические скрипты запуска корня/resume-site.sh"
else
    interactive_menu
fi
