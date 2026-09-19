@echo off
cd /d "%~dp0"
title VILLA TURAMAN AIRBNB PLATFORM - Starter
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy_and_run.ps1"
pause
