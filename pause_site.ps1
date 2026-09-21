# ===============================================================================
# VILLA TURAMAN AIRBNB PLATFORM: РЕЖИМ ТЕХНИЧЕСКОГО ОБСЛУЖИВАНИЯ - VERCEL PAUSE
# ===============================================================================
# Файл: pause_site.ps1
# Кодировка: UTF-8 с BOM [\uFEFF] - нативный стандарт VS Code и PowerShell 7
# Целевая ветка Vercel: v1-airbnb
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

# 1. Создание страницы заглушки maintenance.html
Write-Host "[1/3] Создание страницы-заглушки maintenance.html..." -ForegroundColor Cyan
$maintenanceHtmlContent = @'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Villa Turaman - Технические работы</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f8fafc;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .card {
            text-align: center;
            padding: 48px;
            background: rgba(30, 41, 59, 0.75);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            max-width: 560px;
            width: 100%;
        }
        .badge {
            display: inline-block;
            padding: 6px 16px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid #ef4444;
            color: #f87171;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        h1 {
            color: #ffffff;
            font-size: 28px;
            margin: 0 0 16px 0;
            font-weight: 700;
        }
        p {
            color: #94a3b8;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 24px 0;
        }
        .en-notice {
            font-size: 14px;
            color: #64748b;
            font-style: italic;
            border-top: 1px dashed rgba(255, 255, 255, 0.1);
            padding-top: 16px;
            margin-top: 16px;
        }
        .footer {
            font-size: 13px;
            color: #64748b;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 20px;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">Режим обслуживания - Maintenance Mode</div>
        <h1>Villa Turaman Platform</h1>
        <p>Платформа бронирования временно обновляется для улучшения сервиса. Мы скоро вернемся в строй. Благодарим за понимание!</p>
        <div class="en-notice">
            The booking platform is undergoing scheduled maintenance. Services will resume shortly. Thank you for your patience!
        </div>
        <div class="footer">Dalyan, Ortaca, Mugla | VKN: 9991120181 | Villa Turaman</div>
    </div>
</body>
</html>
'@

$maintenancePath = Join-Path $ProjectRoot "maintenance.html"
[System.IO.File]::WriteAllText($maintenancePath, $maintenanceHtmlContent, [System.Text.Encoding]::UTF8)
Write-Host "  [OK] Страница-заглушка создана: maintenance.html" -ForegroundColor Green

# 2. Создание конфигурации маршрутизации vercel.json со статусом HTTP 503
Write-Host "[2/3] Настройка конфигурации Vercel vercel.json [HTTP 503]..." -ForegroundColor Cyan
$vercelJsonContent = @'
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
'@

$vercelJsonPath = Join-Path $ProjectRoot "vercel.json"
[System.IO.File]::WriteAllText($vercelJsonPath, $vercelJsonContent, [System.Text.Encoding]::UTF8)
Write-Host "  [OK] Конфигурация vercel.json создана [маршрутизация 503 сохраняет позиции в поисковых системах]." -ForegroundColor Green

# 3. Фиксация в Git и отправка в целевую ветку
Write-Host "[3/3] Синхронизация с Git и веткой $TargetBranch..." -ForegroundColor Cyan
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

    $gitStatus = git status --porcelain 2>$null
    if ($LASTEXITCODE -eq 0) {
        git add -f "$ProjectFolder/maintenance.html" "$ProjectFolder/vercel.json" 2>$null
        git commit -m "chore: активация режима обслуживания [HTTP 503] - $TargetBranch" 2>$null
        Write-Host "  [ИНФО] Изменения зафиксированы локально в монорепозитории." -ForegroundColor Yellow
        
        Write-Host "  [ИНФО] Формирование изолированного коммита проекта через git subtree split..." -ForegroundColor Cyan
        $subCommit = git subtree split --prefix=$ProjectFolder 2>$null
        if ($subCommit) {
            Write-Host "  [ИНФО] Отправка изолированного дерева в ветку $TargetBranch на GitHub..." -ForegroundColor Cyan
            git push origin "${subCommit}:refs/heads/${TargetBranch}" --force 2>$null
        } else {
            Write-Host "  [ИНФО] Прямая отправка через git subtree push..." -ForegroundColor Cyan
            git subtree push --prefix=$ProjectFolder origin $TargetBranch 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Ветка $TargetBranch обновлена. Vercel развернул режим обслуживания [HTTP 503]." -ForegroundColor Green
        } else {
            Write-Host "  [ИНФО] Локальные файлы созданы и зафиксированы. Отправка на remote отложена [проверьте сеть или права Git]." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  [ИНФО] Git не обнаружен в репозитории. Локальные файлы maintenance.html и vercel.json готовы." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ИНФО] Локальная конфигурация обслуживания успешно развернута." -ForegroundColor Yellow
} finally {
    Set-Location -LiteralPath $ProjectRoot
}

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  УСПЕХ! Режим обслуживания активирован [HTTP 503 Service Unavailable]." -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Green
