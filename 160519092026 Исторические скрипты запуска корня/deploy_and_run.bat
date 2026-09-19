@echo off
title SPARK ENTERPRISE HUB - УНИВЕРСАЛЬНОЕ РАЗВЕРТЫВАНИЕ И ЗАПУСК
chcp 65001 >nul
color 0A

cd /d "%~dp0"

echo ===============================================================================
echo   ⚡ SPARK ENTERPRISE HUB - АВТОМАТИЗИРОВАННЫЙ СТАРТ РАЗВЕРТЫВАНИЯ
echo ===============================================================================
echo.

:: 1. Проверяем наличие Git Bash или bash в системе
where bash >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Обнаружен интерпретатор Bash. Запуск deploy_and_run.sh...
    bash deploy_and_run.sh %*
    goto :end
)

if exist "C:\Program Files\Git\bin\bash.exe" (
    echo [OK] Запуск через Git Bash (C:\Program Files\Git\bin\bash.exe)...
    "C:\Program Files\Git\bin\bash.exe" deploy_and_run.sh %*
    goto :end
)

if exist "C:\Program Files\Git\usr\bin\bash.exe" (
    echo [OK] Запуск через Git Bash (C:\Program Files\Git\usr\bin\bash.exe)...
    "C:\Program Files\Git\usr\bin\bash.exe" deploy_and_run.sh %*
    goto :end
)

:: 2. Если Bash не найден, выполняем базовый нативный Windows bootstrap
echo [ПРЕДУПРЕЖДЕНИЕ] Интерпретатор Bash не найден в PATH. Запуск нативного сценария Windows...

if not exist ".vscode" mkdir .vscode
if not exist "browser_profiles\vrbo" mkdir browser_profiles\vrbo
if not exist "invoices" mkdir invoices
if not exist "_BACKUPS" mkdir _BACKUPS
if not exist "scratch" mkdir scratch

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [OK] Создан .env из .env.example
    )
)

if not exist "node_modules" (
    echo [ИНФО] Установка npm зависимостей...
    call npm install
)

echo [ИНФО] Очистка порта 3000...
call node cli_tools.js clean-port 3000 >nul 2>&1

echo.
echo Запуск экосистемы...
call START_TOTAL.bat

:end
pause
