# План: Автоматизация 1-кликового развертывания deploy_and_run и задач запуска в VS Code

- **Дата утверждения:** 18.09.2026 16:10
- **Статус:** ✅ Успешно реализовано
- **Ключевой модуль:** Автоматизация окружения / Bash + Windows Batch + Windows PowerShell + .vscode/tasks.json

---

## 1. Цель и контекст задачи
Требовалось ликвидировать любые ручные барьеры при запуске и разработке проекта:
1. Обеспечить старт приложения в 1 клик на Windows, Linux и macOS.
2. Автоматически решать проблему блокировки занятого порта 3000 (Port Auto-Heal).
3. Настроить нативный запуск из VS Code по `Ctrl+Shift+B` (Default Build Task) и отладку по `F5`.
4. Создать PowerShell-скрипт `deploy_and_run.ps1` с кодировкой UTF-8, исключающий ошибки «Термин не распознается как имя...» в среде Windows.

---

## 2. Затронутые файлы и компоненты
| Файл | Описание | Ссылка |
| :--- | :--- | :--- |
| `deploy_and_run.sh` | Мастер-скрипт с интерактивным цветным меню для Bash/Linux/macOS | [deploy_and_run.sh](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/deploy_and_run.sh) |
| `deploy_and_run.bat` | Запускатор в 1 клик для проводника Windows | [deploy_and_run.bat](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/deploy_and_run.bat) |
| `deploy_and_run.ps1` | Нативный PowerShell-раннер с проверкой зависимостей и киллом порта 3000 | [deploy_and_run.ps1](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/deploy_and_run.ps1) |
| `.vscode/tasks.json` | 7 нативных задач сборки, синхронизации и запуска в среде VS Code | [.vscode/tasks.json](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/.vscode/tasks.json) |
| `.vscode/launch.json` | Конфигурация отладки в Chrome/Edge по F5 | [.vscode/launch.json](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/.vscode/launch.json) |

---

## 3. Архитектурные решения
```bash
# Алгоритм автоматического освобождения порта 3000 в Windows PowerShell:
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | 
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
- Запуск через системную кроссплатформенную оболочку `"type": "shell"` в `tasks.json`.
- Внедрение подавления предупреждения компилятора TypeScript в `jsconfig.json` (`"ignoreDeprecations": "6.0"`).

---

## 4. Результаты верификации
- Запуск dev-сервера по `Ctrl+Shift+B` выполняется мгновенно.
- Скрипт `deploy_and_run.ps1` успешно освобождает порт 3000 и поднимает Next.js.
