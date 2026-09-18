@echo off
title VILLA TURAMAN AIRBNB PLATFORM — УНИВЕРСАЛЬНЫЙ СТАРТ И РАЗВЕРТЫВАНИЕ
chcp 65001 >nul
color 0A

cd /d "%~dp0"

echo ===============================================================================
echo   ⚡ VILLA TURAMAN AIRBNB PLATFORM — АВТОМАТИЗИРОВАННЫЙ СТАРТ
echo   Владелец: Aleksei Znamenskii ^| Объект: Villa Turaman (Dalyan, Turkey)
echo   Реквизиты: VKN 9991120181 ^| Двухкабинетная платформа (Гость / Хозяин)
echo ===============================================================================
echo.

:: 1. Проверяем наличие Git Bash или bash в системе
where bash >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Обнаружен интерпретатор Bash. Перенаправление в deploy_and_run.sh...
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

:: 2. Если Bash не установлен, запускаем нативный Windows CMD сценарий
echo [ИНФО] Bash не найден. Запуск нативного Windows сценария...

if not exist ".vscode" mkdir .vscode
if not exist "scratch" mkdir scratch
if not exist "_BACKUPS" mkdir _BACKUPS

if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo [OK] Создан .env.local из шаблона .env.example
    )
)

if not exist "node_modules" (
    echo [ИНФО] Установка npm зависимостей...
    call npm install
)

echo [ИНФО] Проверка и освобождение порта 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ===============================================================================
echo   МЕНЮ ЗАПУСКА VILLA TURAMAN AIRBNB PLATFORM:
echo   1. Запустить сервер разработки (npm run dev -> http://localhost:3000)
echo   2. Собрать и запустить продакшн-сервер (npm run build ^&^& npm start)
echo   3. Синхронизировать контент с Google Sheets (npm run sync-content)
echo   4. Инициализировать структуру Google Sheets (npm run init-sheets)
echo   5. Выход
echo ===============================================================================
set /p choice="Выберите действие (1-5): "

if "%choice%"=="1" (
    echo Запуск dev сервера на порту 3000...
    start http://localhost:3000
    npm run dev
)
if "%choice%"=="2" (
    echo Сборка и старт продакшн сервера...
    npm run build && npm start
)
if "%choice%"=="3" (
    echo Синхронизация контента...
    node scripts/sync-content.js
    pause
)
if "%choice%"=="4" (
    echo Инициализация Google Sheets...
    node scripts/init-google-sheets.js
    pause
)

:end
pause

