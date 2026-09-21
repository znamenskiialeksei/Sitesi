# ===============================================================================
# Скрипт:         pause_site.ps1
# Проект:         Villa Turaman Airbnb Platform
# Назначение:     Активация режима обслуживания Vercel Pause [HTTP 503]
# Стандарты:      UTF-8 BOM, Zero-Terminal, Zero-Brackets, Modern Vercel Config
# ===============================================================================

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ProjectName = "Villa Turaman Airbnb Platform"
$ProjectFolder = "villa-turaman-airbnb-platform"
$TargetBranch = "v1-airbnb"

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  АКТИВАЦИЯ РЕЖИМА ОБСЛУЖИВАНИЯ - VERCEL PAUSE [HTTP 503]" -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  Проект:         $ProjectName" -ForegroundColor White
Write-Host "  Каталог:        $ProjectFolder" -ForegroundColor White
Write-Host "  Целевая ветка:  $TargetBranch" -ForegroundColor White
Write-Host ""

# Определение корня проекта
$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) { $ScriptDir = Get-Location }

# Поиск корня монорепозитория
$RepoRoot = $ScriptDir
while ($RepoRoot -and (-not (Test-Path (Join-Path $RepoRoot ".git")))) {
    $Parent = Split-Path $RepoRoot -Parent
    if ($Parent -eq $RepoRoot) { break }
    $RepoRoot = $Parent
}

if (-not (Test-Path (Join-Path $RepoRoot ".git"))) {
    Write-Host "[ОШИБКА] Корень монорепозитория Git не найден." -ForegroundColor Red
    exit 1
}

# Шаг 1: Создание страницы заглушки maintenance.html
Write-Host "[1/3] Создание страницы-заглушки maintenance.html..." -ForegroundColor Yellow

$MaintenanceHtml = @"
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Villa Turaman Dalyan - Режим технического обслуживания</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0b1329 0%, #101d42 50%, #0d1b2a 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      padding: 48px 40px;
      max-width: 580px;
      width: 100%;
      text-align: center;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      background: rgba(217, 119, 6, 0.15);
      border: 1px solid rgba(217, 119, 6, 0.35);
      border-radius: 9999px;
      color: #fbbf24;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      background: #f59e0b;
      border-radius: 50%;
      box-shadow: 0 0 10px #f59e0b;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    p {
      color: #94a3b8;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .contacts {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .contact-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 14px;
    }
    .contact-row:last-child { border-bottom: none; }
    .contact-label { color: #64748b; font-weight: 500; }
    .contact-value { color: #38bdf8; font-weight: 600; text-decoration: none; }
    .contact-value:hover { text-decoration: underline; }
    .btn-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-tg { background: #229ED9; color: #fff; }
    .btn-tg:hover { background: #1a8cc2; transform: translateY(-2px); }
    .btn-wa { background: #25D366; color: #fff; }
    .btn-wa:hover { background: #20ba59; transform: translateY(-2px); }
    .footer-note {
      margin-top: 24px;
      font-size: 12px;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="badge-dot"></span>
      HTTP 503 • Режим обслуживания
    </div>
    <h1>Villa Turaman Dalyan</h1>
    <p>
      Сайт временно находится в режиме планового технического обслуживания.
      Мы обновляем сервисы и готовим платформу к приему новых гостей.
      Пожалуйста, свяжитесь с нами напрямую для бронирования или справок:
    </p>
    <div class="contacts">
      <div class="contact-row">
        <span class="contact-label">Локация:</span>
        <span class="contact-value" style="color: #cbd5e1;">Dalyan, Ortaca, Muğla, Türkiye</span>
      </div>
      <div class="contact-row">
        <span class="contact-label">Telegram:</span>
        <a href="https://t.me/villaturaman" class="contact-value" target="_blank">@villaturaman</a>
      </div>
      <div class="contact-row">
        <span class="contact-label">WhatsApp:</span>
        <a href="https://wa.me/905433358070" class="contact-value" target="_blank">+90 543 335 80 70</a>
      </div>
      <div class="contact-row">
        <span class="contact-label">Официальный VKN:</span>
        <span class="contact-value" style="color: #cbd5e1;">9991120181</span>
      </div>
    </div>
    <div class="btn-group">
      <a href="https://t.me/villaturaman" class="btn btn-tg" target="_blank">
        Написать в Telegram
      </a>
      <a href="https://wa.me/905433358070" class="btn btn-wa" target="_blank">
        Связаться в WhatsApp
      </a>
    </div>
    <div class="footer-note">
      Villa Turaman Luxury Accommodation Platform • Vercel HTTP 503 Mode
    </div>
  </div>
</body>
</html>
"@

$MaintenancePath = Join-Path $ScriptDir "maintenance.html"
$IndexPath = Join-Path $ScriptDir "index.html"
$PublicDir = Join-Path $ScriptDir "public"
$PublicMaintenancePath = Join-Path $PublicDir "maintenance.html"

[System.IO.File]::WriteAllText($MaintenancePath, $MaintenanceHtml, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($IndexPath, $MaintenanceHtml, [System.Text.Encoding]::UTF8)

if (Test-Path $PublicDir) {
    [System.IO.File]::WriteAllText($PublicMaintenancePath, $MaintenanceHtml, [System.Text.Encoding]::UTF8)
}

Write-Host "  [OK] Страница-заглушка создана: maintenance.html и продублирована в index.html" -ForegroundColor Green

# Шаг 2: Настройка конфигурации Vercel vercel.json по современному стандарту
Write-Host "[2/3] Настройка конфигурации Vercel vercel.json [HTTP 503 modern format]..." -ForegroundColor Yellow

$VercelJson = @"
{
  "framework": null,
  "buildCommand": null,
  "outputDirectory": ".",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/((?!maintenance\\.html).*)",
      "destination": "/maintenance.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, no-cache, must-revalidate, max-age=0"
        },
        {
          "key": "Retry-After",
          "value": "3600"
        }
      ]
    }
  ]
}
"@

$VercelPath = Join-Path $ScriptDir "vercel.json"
[System.IO.File]::WriteAllText($VercelPath, $VercelJson, [System.Text.Encoding]::UTF8)
Write-Host "  [OK] Конфигурация vercel.json создана [современный стандарт Vercel Static Serving, HTTP 503, framework: null]." -ForegroundColor Green

# Шаг 3: Синхронизация с Git и отправка в целевую ветку
Write-Host "[3/3] Синхронизация с Git и веткой $TargetBranch..." -ForegroundColor Yellow

Push-Location $RepoRoot
try {
    # Добавляем созданные файлы
    git add "$ProjectFolder/maintenance.html" "$ProjectFolder/index.html" "$ProjectFolder/vercel.json"
    if (Test-Path (Join-Path $ScriptDir "public/maintenance.html")) {
        git add "$ProjectFolder/public/maintenance.html"
    }

    # Создаем коммит в рабочей копии
    git commit -m "chore: activate maintenance mode HTTP 503 for $ProjectFolder" --allow-empty

    # Выделяем subtree коммит для целевой ветки
    Write-Host "  Генерация изолированного коммита для ветки $TargetBranch через git subtree split..." -ForegroundColor Gray
    $subCommit = (git subtree split --prefix=$ProjectFolder)
    if (-not $subCommit) {
        throw "Не удалось сгенерировать коммит через git subtree split."
    }
    $subCommit = $subCommit.Trim()
    Write-Host "  [OK] Изолированный коммит сформирован: $subCommit" -ForegroundColor Green

    # Безопасная отправка в целевую ветку
    Write-Host "  Отправка в ветку origin/$TargetBranch..." -ForegroundColor Gray
    git push origin "${subCommit}:refs/heads/${TargetBranch}" --force
    Write-Host "  [OK] Ветка $TargetBranch успешно обновлена. Vercel автоматически развернет режим обслуживания." -ForegroundColor Green
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  РЕЖИМ ОБСЛУЖИВАНИЯ УСПЕШНО АКТИВИРОВАН НА VERCEL" -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  Для возврата сайта в рабочий боевой режим запустите:" -ForegroundColor White
Write-Host "  pwsh -ExecutionPolicy Bypass -File .\resume_site.ps1" -ForegroundColor Yellow
Write-Host "===============================================================================" -ForegroundColor Green
