# ==============================================================================
# VILLA TURAMAN AIRBNB PLATFORM — НАТИВНЫЙ СКРИПТ POWERSHELL ДЛЯ WINDOWS
# Скрипт: deploy_and_run.ps1
# Назначение: Автоматизированное развертывание, проверка окружения, очистка портов
#             и интерактивное меню запуска для Windows PowerShell.
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Переход в директорию скрипта
Set-Location -Path $PSScriptRoot

function Show-Banner {
    Clear-Host
    Write-Host "===============================================================================" -ForegroundColor Cyan
    Write-Host "  ⚡ VILLA TURAMAN AIRBNB PLATFORM v2.0 — POWERSHELL СТАРТЕР" -ForegroundColor Yellow
    Write-Host "  Владелец: Aleksei Znamenskii | Объект: Villa Turaman (Dalyan, Turkey)" -ForegroundColor Cyan
    Write-Host "  Реквизиты: VKN 9991120181 | Раздельные кабинеты: Гость / Хозяин" -ForegroundColor Cyan
    Write-Host "  Директория: $PSScriptRoot" -ForegroundColor DarkGray
    Write-Host "===============================================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Check-Prerequisites {
    Write-Host "==> Этап 1: Проверка окружения Node.js и npm" -ForegroundColor Magenta

    # Проверка Node.js
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeCmd) {
        Write-Host "[ОШИБКА] Node.js не найден! Установите Node.js 18+ с https://nodejs.org/" -ForegroundColor Red
        Exit 1
    }
    $nodeVer = node -v
    Write-Host "[УСПЕХ] Node.js обнаружен: $nodeVer" -ForegroundColor Green

    # Проверка npm
    $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
    if (-not $npmCmd) {
        Write-Host "[ОШИБКА] npm не найден!" -ForegroundColor Red
        Exit 1
    }
    $npmVer = npm -v
    Write-Host "[УСПЕХ] npm обнаружен: v$npmVer" -ForegroundColor Green
}

function Setup-Directories {
    Write-Host "==> Этап 2: Проверка и создание системных директорий" -ForegroundColor Magenta
    $dirs = @(".vscode", "scratch", "_BACKUPS", "public", "components", "utils", "pages")
    foreach ($d in $dirs) {
        if (-not (Test-Path $d)) {
            New-Item -ItemType Directory -Path $d -Force | Out-Null
            Write-Host "[ИНФО] Создана папка: $d" -ForegroundColor Cyan
        }
    }
    Write-Host "[УСПЕХ] Файловая структура готова к работе." -ForegroundColor Green
}

function Setup-VsCodeTasks {
    Write-Host "==> Этап 3: Настройка .vscode/tasks.json" -ForegroundColor Magenta
    $tasksPath = ".vscode/tasks.json"
    if (-not (Test-Path $tasksPath)) {
        $tasksJson = @'
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
'@
        Set-Content -Path $tasksPath -Value $tasksJson -Encoding UTF8
        Write-Host "[УСПЕХ] Файл .vscode/tasks.json успешно создан." -ForegroundColor Green
    } else {
        Write-Host "[УСПЕХ] Файл .vscode/tasks.json уже существует." -ForegroundColor Green
    }
}

function Install-Dependencies {
    Write-Host "==> Этап 4: Проверка npm зависимостей" -ForegroundColor Magenta
    if (-not (Test-Path "node_modules")) {
        Write-Host "[ИНФО] Каталог node_modules не найден. Установка npm пакетов..." -ForegroundColor Cyan
        npm install
        Write-Host "[УСПЕХ] Зависимости успешно установлены." -ForegroundColor Green
    } else {
        Write-Host "[УСПЕХ] Каталог node_modules готов." -ForegroundColor Green
    }
}

function Free-Port3000 {
    Write-Host "[ИНФО] Проверка порта 3000..." -ForegroundColor Cyan
    try {
        $connections = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $pidToKill = $conn.OwningProcess
                if ($pidToKill -gt 0) {
                    Write-Host "[ВНИМАНИЕ] Порт 3000 занят процессом PID $pidToKill. Освобождаем..." -ForegroundColor Yellow
                    Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                }
            }
            Start-Sleep -Seconds 1
            Write-Host "[УСПЕХ] Порт 3000 освобожден." -ForegroundColor Green
        } else {
            Write-Host "[УСПЕХ] Порт 3000 свободен." -ForegroundColor Green
        }
    } catch {
        # Запасной вариант через netstat для старых версий PowerShell
        $netstatOut = netstat -ano | Select-String ":3000 " | Select-String "LISTENING"
        if ($netstatOut) {
            $parts = ($netstatOut -split '\s+') | Where-Object { $_ -ne "" }
            $pidToKill = $parts[-1]
            if ($pidToKill -match '^\d+$') {
                taskkill /F /PID $pidToKill 2>$null | Out-Null
                Write-Host "[УСПЕХ] Порт 3000 освобожден (PID $pidToKill)." -ForegroundColor Green
            }
        } else {
            Write-Host "[УСПЕХ] Порт 3000 свободен." -ForegroundColor Green
        }
    }
}

function Interactive-Menu {
    while ($true) {
        Show-Banner
        Write-Host "Выберите действие для запуска платформы:" -ForegroundColor White
        Write-Host "  [1] Запустить сервер разработки (npm run dev -> http://localhost:3000)" -ForegroundColor Green
        Write-Host "  [2] Собрать и запустить боевую версию (npm run build && npm start)" -ForegroundColor Green
        Write-Host "  [3] Синхронизировать контент с Google Sheets (sync-content.js)" -ForegroundColor Green
        Write-Host "  [4] Инициализировать таблицы CRM Google Sheets (init-google-sheets.js)" -ForegroundColor Green
        Write-Host "  [5] Проверить и освободить порт 3000" -ForegroundColor Cyan
        Write-Host "  [6] ⏸️ Перевести сайт в режим обслуживания - Vercel Pause" -ForegroundColor Yellow
        Write-Host "  [7] ▶️ Возобновить штатную работу сайта - Vercel Resume" -ForegroundColor Green
        Write-Host "  [0] Выход" -ForegroundColor Red
        Write-Host ""
        
        $choice = Read-Host "Введите номер команды (0-7)"
        
        switch ($choice) {
            "1" {
                Free-Port3000
                Write-Host "`nЗапуск dev-сервера... Браузер откроется на http://localhost:3000" -ForegroundColor Cyan
                Start-Process "http://localhost:3000"
                npm run dev
                return
            }
            "2" {
                Free-Port3000
                Write-Host "`nСборка и запуск продакшн Next.js..." -ForegroundColor Cyan
                npm run build
                if ($LASTEXITCODE -eq 0) {
                    npm start
                }
                return
            }
            "3" {
                Write-Host "`nСинхронизация контента из Google Sheets..." -ForegroundColor Cyan
                node scripts/sync-content.js
                Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
                $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            }
            "4" {
                Write-Host "`nИнициализация CRM структуры Google Sheets..." -ForegroundColor Cyan
                node scripts/init-google-sheets.js
                Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
                $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            }
            "5" {
                Free-Port3000
                Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
                $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            }
            "6" {
                Write-Host "`nАктивация режима обслуживания на Vercel..." -ForegroundColor Yellow
                & pwsh -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "pause_site.ps1")
                Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
                $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            }
            "7" {
                Write-Host "`nВозобновление штатной работы на Vercel..." -ForegroundColor Green
                & pwsh -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "resume_site.ps1")
                Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
                $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            }
            "0" {
                Write-Host "`nРабота завершена." -ForegroundColor Green
                return
            }
            default {
                Write-Host "`nНеверный ввод! Выберите цифру от 0 до 7." -ForegroundColor Yellow
                Start-Sleep -Seconds 1
            }
        }
    }
}

# Основная последовательность шагов
Show-Banner
Check-Prerequisites
Setup-Directories
Setup-VsCodeTasks
Install-Dependencies
Free-Port3000

# Запуск меню
Interactive-Menu
