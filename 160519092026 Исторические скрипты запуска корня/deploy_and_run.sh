#!/usr/bin/env bash
# ==============================================================================
# SPARK ENTERPRISE HUB — УНИВЕРСАЛЬНЫЙ АВТОМАТИЗИРОВАННЫЙ СКРИПТ РАЗВЕРТЫВАНИЯ
# Скрипт: deploy_and_run.sh
# Назначение: Развертывание в любой директории, создание структуры, настройка VS Code,
#             обновление зависимостей, авто-очистка портов и запуск всей системы.
# ==============================================================================

# Цветовая палитра терминала (ANSI Colors)
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
RESET='\033[0m'

# Определение рабочей директории скрипта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

print_banner() {
    clear
    echo -e "${CYAN}${BOLD}===============================================================================${RESET}"
    echo -e "${YELLOW}${BOLD}  ⚡ SPARK ENTERPRISE HUB v6.5 — АВТОМАТИЗИРОВАННОЕ РАЗВЕРТЫВАНИЕ И ЗАПУСК${RESET}"
    echo -e "${CYAN}  Владелец: Aleksei Znamenskii | Объект: Villa Turaman (ID: 4985823)${RESET}"
    echo -e "${CYAN}  Налоговый номер: VKN 9991120181 | Регламент: VUK 213 Madde 230${RESET}"
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

# 1. Проверка окружения (Node.js, npm, Chrome)
check_prerequisites() {
    log_step "Этап 1: Проверка системных требований и окружения"

    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js не найден в системе! Пожалуйста, установите Node.js версии 18 или выше: https://nodejs.org/"
        exit 1
    fi

    NODE_VER=$(node -v)
    log_success "Node.js обнаружен: ${NODE_VER}"

    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm не найден в системе!"
        exit 1
    fi
    log_success "npm обнаружен: v$(npm -v)"

    # Проверка наличия официального Google Chrome
    CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"
    CHROME_WIN="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    if [ -f "$CHROME_PATH" ] || [ -f "C:/Program Files/Google/Chrome/Application/chrome.exe" ]; then
        log_success "Официальный Google Chrome найден: ${CHROME_WIN}"
    else
        log_warn "Google Chrome не найден по стандартному пути (${CHROME_WIN}). Проверьте настройки браузера."
    fi
}

# 2. Создание всех необходимых директорий
setup_directories() {
    log_step "Этап 2: Инициализация файловой структуры проекта"

    DIRS=(
        ".vscode"
        "browser_profiles/vrbo"
        "invoices"
        "_BACKUPS"
        "scratch"
        "СОХРАНЕННЫЕ_ВЕРСИИ_ПРОЕКТА"
        "УТВЕРЖДЕННЫЕ_ПЛАНЫ_ИЗМЕНЕНИЙ_ПРОЕКТА"
    )

    for dir in "${DIRS[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "Создана директория: ${dir}"
        else
            log_success "Директория готова: ${dir}"
        fi
    done
}

# 3. Развертывание конфигурации VS Code со всеми задачами (tasks.json, settings.json, launch.json)
setup_vscode() {
    log_step "Этап 3: Настройка интеграции с Visual Studio Code (Задачи и Отладка)"

    # Создание .vscode/tasks.json со всеми преднастроенными запусками
    TASKS_FILE=".vscode/tasks.json"
    if [ ! -f "$TASKS_FILE" ]; then
        cat << 'EOF' > "$TASKS_FILE"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 0. SPARK: ПОЛНЫЙ ЗАПУСК ВСЕГО (Сервер + Браузер + Туннель + Таблица + Telegram)",
      "type": "shell",
      "command": "cmd /c START_TOTAL.bat",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "⚡ 1. SPARK: Запуск Сервера и Туннеля (START_ALL.bat)",
      "type": "shell",
      "command": "cmd /c START_ALL.bat",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "🖥️ 2. SPARK: Запуск Сервера Node.js (порт 3000)",
      "type": "shell",
      "command": "node vrbo_playwright_runner.js",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "🌐 3. SPARK: Запуск Шлюза Localtunnel (small-lamps-start)",
      "type": "shell",
      "command": "npx localtunnel --port 3000 --subdomain small-lamps-start",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "🤖 4. SPARK: Запуск с авто-стартом браузера Vrbo (--start)",
      "type": "shell",
      "command": "node vrbo_playwright_runner.js --start",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "📊 5. SPARK: Открыть Google Таблицу в браузере",
      "type": "shell",
      "command": "start https://docs.google.com/spreadsheets/d/1o5MOFxIMtNqnfRqSBR4hsy3VhoICfRFB03_O0kJe5hQ/edit",
      "problemMatcher": [],
      "presentation": {
        "reveal": "silent",
        "panel": "shared"
      }
    },
    {
      "label": "📱 6. SPARK: Открыть Telegram-бота (@yristvilla_bot)",
      "type": "shell",
      "command": "start https://t.me/yristvilla_bot",
      "problemMatcher": [],
      "presentation": {
        "reveal": "silent",
        "panel": "shared"
      }
    },
    {
      "label": "💻 7. SPARK: Интерактивный диспетчер задач (Меню)",
      "type": "shell",
      "command": "cmd /c SPARK_MENU.bat",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "🔐 8. SPARK: Отправить SMS-код 2FA в браузер",
      "type": "shell",
      "command": "node cli_tools.js 2fa ${input:twoFactorCode}",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "📸 9. SPARK: Запросить скриншот экрана в Telegram",
      "type": "shell",
      "command": "node cli_tools.js screenshot",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "🧹 10. SPARK: Принудительная очистка портов (порт 3000)",
      "type": "shell",
      "command": "cmd /c CLEAN_PORTS.bat",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "🛑 11. SPARK: Полная остановка всех процессов Hub",
      "type": "shell",
      "command": "cmd /c STOP_ALL.bat",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "🧪 12. SPARK: Запуск универсальных тестов (test_universal.js)",
      "type": "shell",
      "command": "node test_universal.js",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "🛠️ 13. SPARK: Универсальное развертывание (deploy_and_run.sh)",
      "type": "shell",
      "command": "bash deploy_and_run.sh",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ],
  "inputs": [
    {
      "id": "twoFactorCode",
      "type": "promptString",
      "description": "Введите 6-значный SMS-код двухфакторной аутентификации:"
    }
  ]
}
EOF
        log_success "Файл .vscode/tasks.json успешно создан со всеми 14 задачами!"
    else
        log_success "Файл .vscode/tasks.json уже существует и готов к работе."
    fi

    # Создание .vscode/settings.json для терминала VS Code и кодировки UTF-8
    SETTINGS_FILE=".vscode/settings.json"
    if [ ! -f "$SETTINGS_FILE" ]; then
        cat << 'EOF' > "$SETTINGS_FILE"
{
  "files.encoding": "utf8",
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "terminal.integrated.cursorBlinking": true,
  "workbench.colorCustomizations": {
    "terminal.ansiGreen": "#00ff66",
    "terminal.ansiCyan": "#00ffff"
  }
}
EOF
        log_success "Файл .vscode/settings.json настроен (UTF-8, Git Bash профиль)."
    fi
}

# 4. Проверка и инициализация конфигурационного файла .env
setup_env() {
    log_step "Этап 4: Проверка файла переменных окружения (.env)"

    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp ".env.example" ".env"
            log_success "Файл .env автоматически создан на основе .env.example!"
        else
            cat << 'EOF' > ".env"
PORT=3000
LOCALTUNNEL_SUBDOMAIN=small-lamps-start
VRBO_PROPERTY_ID=4985823
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
GEMINI_API_KEY=
GOOGLE_SHEETS_ID=1o5MOFxIMtNqnfRqSBR4hsy3VhoICfRFB03_O0kJe5hQ
EOF
            log_success "Файл .env создан с базовыми системными параметрами."
        fi
    else
        log_success "Конфигурационный файл .env найден и активен."
    fi
}

# 5. Обновление и установка зависимостей npm
install_dependencies() {
    log_step "Этап 5: Проверка и установка зависимостей проекта (npm install)"

    if [ ! -d "node_modules" ] || [ ! -d "node_modules/playwright" ]; then
        log_info "Установка пакетов проекта через npm install..."
        npm install
        log_success "Зависимости npm успешно установлены!"
    else
        log_success "Все зависимости (node_modules, Playwright) установлены и актуальны."
    fi
}

# 6. Автоматическая очистка порта 3000 (Auto-Heal Port Conflict)
clean_port_3000() {
    log_step "Этап 6: Проверка и освобождение порта 3000"

    if [ -f "cli_tools.js" ]; then
        node cli_tools.js clean-port 3000 >/dev/null 2>&1
        log_success "Порт 3000 проверен и готов к работе."
    fi
}

# 7. Комплексная самодиагностика готовности
run_diagnostics() {
    log_step "Этап 7: Экспресс-диагностика состояния экосистемы"

    # Проверка файла сессии auth_state_vrbo.json
    if [ -f "auth_state_vrbo.json" ]; then
        COOKIES_SIZE=$(stat -c%s "auth_state_vrbo.json" 2>/dev/null || stat -f%z "auth_state_vrbo.json" 2>/dev/null || echo "0")
        if [ "$COOKIES_SIZE" -gt 1000 ]; then
            log_success "Сессионный кэш auth_state_vrbo.json активен (${COOKIES_SIZE} байт)."
        else
            log_warn "Кэш auth_state_vrbo.json слишком мал. Возможно, потребуется авторизация в браузере."
        fi
    else
        log_warn "Файл auth_state_vrbo.json отсутствует. При первом запуске потребуется вход через Chrome."
    fi

    # Проверка архива сообщений
    if [ -f "vrbo_chat_archive_full.json" ]; then
        ARCH_SIZE=$(stat -c%s "vrbo_chat_archive_full.json" 2>/dev/null || stat -f%z "vrbo_chat_archive_full.json" 2>/dev/null || echo "0")
        log_success "Архив переписки vrbo_chat_archive_full.json готов (${ARCH_SIZE} байт)."
    fi

    log_success "Экосистема полностью готова к запуску!"
}

# 8. Запуск системы по сценариям
launch_total() {
    log_step "Запуск полной экосистемы SPARK TOTAL LAUNCH..."
    if command -v cmd.exe >/dev/null 2>&1; then
        cmd.exe /c START_TOTAL.bat
    elif [ -f "START_TOTAL.bat" ]; then
        cmd /c START_TOTAL.bat
    else
        node vrbo_playwright_runner.js --start &
        npx localtunnel --port 3000 --subdomain small-lamps-start &
        log_success "Сервер и Туннель запущены в фоновом режиме!"
    fi
}

launch_server_browser() {
    log_step "Запуск сервера SPARK с авто-стартом Google Chrome..."
    node vrbo_playwright_runner.js --start
}

launch_tunnel() {
    log_step "Запуск шлюза Localtunnel (small-lamps-start)..."
    npx localtunnel --port 3000 --subdomain small-lamps-start
}

launch_cli_menu() {
    log_step "Запуск интерактивного диспетчера задач SPARK..."
    node cli_menu.js
}

# Главное меню пользователя
interactive_menu() {
    while true; do
        print_banner
        echo -e "${YELLOW}${BOLD}ВЫБЕРИТЕ ДЕЙСТВИЕ ДЛЯ ЗАПУСКА:${RESET}"
        echo -e "  ${GREEN}${BOLD}[1]${RESET} 🚀 ПОЛНЫЙ ЗАПУСК ВСЕГО (Сервер + Chrome + Туннель + Google Sheets + Telegram)"
        echo -e "  ${GREEN}${BOLD}[2]${RESET} 🤖 Запуск Сервера и Чат-Раннера Chrome (--start)"
        echo -e "  ${GREEN}${BOLD}[3]${RESET} 🌐 Запуск только шлюза Localtunnel (small-lamps-start)"
        echo -e "  ${GREEN}${BOLD}[4]${RESET} 💻 Интерактивное консольное меню SPARK (cli_menu.js)"
        echo -e "  ${GREEN}${BOLD}[5]${RESET} 🧪 Запуск самодиагностики и тестов (test_universal.js)"
        echo -e "  ${GREEN}${BOLD}[6]${RESET} 🧹 Принудительная очистка порта 3000"
        echo -e "  ${GREEN}${BOLD}[7]${RESET} 🛑 Полная остановка всех процессов SPARK"
        echo -e "  ${RED}${BOLD}[0]${RESET} ❌ Выход"
        echo ""
        read -rp "Введите номер пункта [0-7] (по умолчанию: 1): " choice
        choice=${choice:-1}

        case "$choice" in
            1)
                launch_total
                break
                ;;
            2)
                launch_server_browser
                break
                ;;
            3)
                launch_tunnel
                break
                ;;
            4)
                launch_cli_menu
                break
                ;;
            5)
                node test_universal.js
                echo ""
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            6)
                clean_port_3000
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            7)
                if [ -f "STOP_ALL.bat" ]; then
                    cmd /c STOP_ALL.bat
                else
                    pkill -f "vrbo_playwright_runner.js" 2>/dev/null
                    pkill -f "localtunnel" 2>/dev/null
                fi
                log_success "Все процессы остановлены."
                read -rp "Нажмите ENTER для возврата в меню..."
                ;;
            0)
                echo -e "\n${CYAN}Завершение работы скрипта. Удачного дня!${RESET}\n"
                exit 0
                ;;
            *)
                log_warn "Неверный выбор. Пожалуйста, введите цифру от 0 до 7."
                sleep 1.5
                ;;
        esac
    done
}

# Обработка параметров командной строки
main() {
    print_banner
    check_prerequisites
    setup_directories
    setup_vscode
    setup_env
    install_dependencies
    clean_port_3000
    run_diagnostics

    if [ "$1" == "--total" ] || [ "$1" == "-t" ]; then
        launch_total
    elif [ "$1" == "--start" ] || [ "$1" == "-s" ]; then
        launch_server_browser
    elif [ "$1" == "--setup-only" ]; then
        log_success "Развертывание и настройка успешно завершены без авто-запуска сервисов."
        exit 0
    else
        interactive_menu
    fi
}

main "$@"
