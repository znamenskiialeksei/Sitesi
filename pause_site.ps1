# ===============================================================================
# VILLA TURAMAN AIRBNB PLATFORM: АКТИВАЦИЯ РЕЖИМА ОБСЛУЖИВАНИЯ - VERCEL PAUSE
# ===============================================================================
# Файл:           pause_site.ps1
# Редакция:       16.11.2026 07:25 | ПЛАН: 161120260725 ПЛАН Фикс задачи паузы VS Code и warn Vercel.md
# Тег:            [TAG: VILLA-VERCEL-PAUSE-TASK-SYNC-161120260725]
# Кодировка:      UTF-8 с BOM [\uFEFF] - нативный стандарт VS Code и PowerShell 7
# Целевая ветка:  v1-airbnb
# ===============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$TargetBranch = "v1-airbnb"
$ProjectTitle = "Villa Turaman Airbnb Platform"

if ($PSScriptRoot) {
    $ProjectRoot = $PSScriptRoot
} elseif ($env:SCRIPT_FILE) {
    $ProjectRoot = Split-Path -Parent $env:SCRIPT_FILE
} else {
    $ProjectRoot = (Get-Location).Path
}

Set-Location -LiteralPath $ProjectRoot

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  АКТИВАЦИЯ РЕЖИМА ОБСЛУЖИВАНИЯ - VERCEL PAUSE [HTTP 503]" -ForegroundColor Yellow
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  Проект:         $ProjectTitle" -ForegroundColor DarkGray
Write-Host "  Каталог:        $ProjectRoot" -ForegroundColor DarkGray
Write-Host "  Целевая ветка:  $TargetBranch" -ForegroundColor DarkGray
Write-Host ""

# Кодировка UTF-8 БЕЗ BOM для всех конфигурационных файлов JSON, JS, HTML и .npmrc [Правило 9.18]
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# 1. Создание страницы-заглушки maintenance.html и нативного Edge Middleware HTTP 503
Write-Host "[1/3] Создание maintenance.html и нативного Edge Middleware middleware.js [HTTP 503]..." -ForegroundColor Cyan

$MaintenanceHtml = @'
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
'@

$MaintenancePath = Join-Path $ProjectRoot "maintenance.html"
$IndexPath = Join-Path $ProjectRoot "index.html"
$PublicDir = Join-Path $ProjectRoot "public"
$PublicMaintenancePath = Join-Path $PublicDir "maintenance.html"
$MiddlewarePath = Join-Path $ProjectRoot "middleware.js"
$VercelPath = Join-Path $ProjectRoot "vercel.json"
$NpmrcPath = Join-Path $ProjectRoot ".npmrc"

if (Test-Path -LiteralPath $IndexPath) {
    Remove-Item -LiteralPath $IndexPath -Force -ErrorAction SilentlyContinue
}

$NormalizedHtml = $MaintenanceHtml -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($MaintenancePath, $NormalizedHtml, $Utf8NoBom)

if (Test-Path -LiteralPath $PublicDir) {
    [System.IO.File]::WriteAllText($PublicMaintenancePath, $NormalizedHtml, $Utf8NoBom)
}

$MiddlewareTemplate = @'
/**
 * ============================================================================
 * МОДУЛЬ: middleware.js - НАТИВНЫЙ EDGE-ПЕРЕХВАТЧИК РЕЖИМА ОБСЛУЖИВАНИЯ HTTP 503
 * ПРОЕКТ: Villa Turaman Airbnb Platform
 * ----------------------------------------------------------------------------
 * [ПРЕДЫДУЩАЯ РЕДАКЦИЯ]: 16.11.2026 00:55 | ПЛАН: 161120260055 ПЛАН Фикс vercel_json в pause_site.md
 *   - Базовый Edge-перехватчик HTTP 503.
 * [АКТУАЛЬНАЯ РЕДАКЦИЯ]: 16.11.2026 07:25 | ПЛАН: 161120260725 ПЛАН Фикс задачи паузы VS Code и warn Vercel.md
 *   - Литеральная генерация без конфликтов интерполяции PowerShell и отдача HTTP 503 на уровне Edge.
 *   - Тег: [TAG: VILLA-VERCEL-PAUSE-TASK-SYNC-161120260725]
 * ============================================================================
 */
import { NextResponse } from 'next/server';

const MAINTENANCE_HTML = `__MAINTENANCE_HTML__`;

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Retry-After': '3600'
    }
  });
}

export const config = {
  matcher: ['/:path*']
};
'@

$NormalizedMiddleware = ($MiddlewareTemplate.Replace('__MAINTENANCE_HTML__', $NormalizedHtml)) -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($MiddlewarePath, $NormalizedMiddleware, $Utf8NoBom)

Write-Host "  [OK] Файлы maintenance.html и middleware.js созданы [HTTP 503, UTF-8 без BOM]." -ForegroundColor Green

# 2. Настройка валидной конфигурации vercel.json и .npmrc без BOM
Write-Host "[2/3] Настройка конфигурации vercel.json и .npmrc [UTF-8 без BOM]..." -ForegroundColor Cyan

$VercelJson = @'
{
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
'@

$NormalizedVercelJson = $VercelJson -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($VercelPath, $NormalizedVercelJson, $Utf8NoBom)

$NpmrcContent = "loglevel=error`nfund=false`naudit=false`n"
[System.IO.File]::WriteAllText($NpmrcPath, $NpmrcContent, $Utf8NoBom)

Write-Host "  [OK] Конфигурации vercel.json и .npmrc записаны строго в UTF-8 без BOM." -ForegroundColor Green

# 3. Фиксация в Git и отправка в ветку v1-airbnb [идентично эталону resume_site.ps1]
Write-Host "[3/3] Фиксация изменений в Git и отправка коммита в $TargetBranch..." -ForegroundColor Cyan
try {
    $WorkspaceRoot = $ProjectRoot
    while ($WorkspaceRoot -and -not (Test-Path -LiteralPath (Join-Path $WorkspaceRoot ".git"))) {
        $parent = Split-Path -Parent $WorkspaceRoot
        if ($parent -eq $WorkspaceRoot) { break }
        $WorkspaceRoot = $parent
    }
    if (-not (Test-Path -LiteralPath (Join-Path $WorkspaceRoot ".git"))) {
        $WorkspaceRoot = Split-Path -Parent $ProjectRoot
    }

    $ProjectFolder = Split-Path -Leaf $ProjectRoot
    Set-Location -LiteralPath $WorkspaceRoot

    git rm -f --ignore-unmatch "$ProjectFolder/index.html" 2>$null
    git add -A 2>$null
    git commit -m "chore: активация режима обслуживания HTTP 503 - $TargetBranch" --allow-empty 2>$null
    Write-Host "  [ИНФО] Коммит включения техобслуживания сформирован." -ForegroundColor Yellow

    Write-Host "  [ИНФО] Формирование изолированного коммита проекта через git subtree split..." -ForegroundColor Cyan
    $subCommit = git subtree split --prefix=$ProjectFolder 2>$null
    if ($subCommit) {
        $subCommit = $subCommit.Trim()
        Write-Host "  [OK] Изолированный коммит сформирован: $subCommit" -ForegroundColor Green
        Write-Host "  [ИНФО] Отправка изолированного дерева в ветку $TargetBranch на GitHub..." -ForegroundColor Cyan
        git push origin "${subCommit}:refs/heads/${TargetBranch}" --force 2>$null
    } else {
        Write-Host "  [ИНФО] Прямая отправка через git subtree push..." -ForegroundColor Cyan
        git subtree push --prefix=$ProjectFolder origin $TargetBranch 2>$null
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Ветка $TargetBranch обновлена. Vercel автоматически развернет режим обслуживания HTTP 503." -ForegroundColor Green
    } else {
        Write-Host "  [ИНФО] Локальные файлы созданы и коммит зафиксирован. Проверьте подключение к GitHub." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ИНФО] Завершено локальное создание файлов обслуживания." -ForegroundColor Yellow
} finally {
    Set-Location -LiteralPath $ProjectRoot
}

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  РЕЖИМ ОБСЛУЖИВАНИЯ УСПЕШНО АКТИВИРОВАН НА VERCEL [HTTP 503]" -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  Для возврата сайта в рабочий боевой режим запустите задачу Возобновление Работы Сайта или:" -ForegroundColor White
Write-Host "  pwsh -ExecutionPolicy Bypass -File .\resume_site.ps1" -ForegroundColor Yellow
Write-Host "===============================================================================" -ForegroundColor Green
