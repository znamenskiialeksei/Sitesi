#!/usr/bin/env bash
# ==============================================================================
# VILLA TURAMAN AIRBNB PLATFORM — РЕЖИМ ТЕХНИЧЕСКОГО ОБСЛУЖИВАНИЯ (VERCEL PAUSE)
# Целевая ветка: v1-airbnb
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Переходим в корень проекта/ветки v1-airbnb
cd "$SCRIPT_DIR/.." || exit 1

echo "================================================================="
echo "  ⚡ Активация режима обслуживания: Ветка v1-airbnb"
echo "  Проект: Villa Turaman Airbnb Platform"
echo "================================================================="

# Создаем файл заглушки прямо в корне ветки
echo "1. Создание страницы заглушки (maintenance.html)..."
cat << 'EOF' > maintenance.html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Villa Turaman — Технические работы</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f8fafc;
            margin: 0;
        }
        .card {
            text-align: center;
            padding: 48px;
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            max-width: 520px;
        }
        .badge {
            display: inline-block;
            padding: 6px 14px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid #ef4444;
            color: #f87171;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        h1 {
            color: #ffffff;
            font-size: 26px;
            margin: 0 0 16px 0;
            font-weight: 700;
        }
        p {
            color: #94a3b8;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 24px 0;
        }
        .footer {
            font-size: 13px;
            color: #64748b;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 16px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">Режим обслуживания</div>
        <h1>Villa Turaman Platform</h1>
        <p>Платформа бронирования временно обновляется. Сервис станет доступен в ближайшее время. Благодарим за понимание!</p>
        <div class="footer">Dalyan, Ortaca, Mugla | VKN: 9991120181</div>
    </div>
</body>
</html>
EOF

# Создаем конфигурацию перенаправления Vercel с кодом HTTP 503
echo "2. Настройка маршрутизации Vercel (vercel.json)..."
cat << 'EOF' > vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "maintenance.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/maintenance.html",
      "status": 503
    }
  ]
}
EOF

# Фиксация и отправка коммита строго в ветку v1-airbnb
echo "3. Фиксация в Git и отправка в ветку v1-airbnb..."
git add maintenance.html vercel.json
git commit -m "chore: включение режима обслуживания (ветка v1-airbnb)" || true
git push origin v1-airbnb || git push origin HEAD:v1-airbnb

echo "================================================================="
echo "  УСПЕХ! Режим обслуживания активирован для ветки v1-airbnb."
echo "================================================================="
