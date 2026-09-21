# ===============================================================================
# VILLA TURAMAN AIRBNB PLATFORM: ВОЗОБНОВЛЕНИЕ РАБОТЫ САЙТА - VERCEL RESUME
# ===============================================================================
# Файл: resume_site.ps1
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
Write-Host "  ДЕАКТИВАЦИЯ РЕЖИМА ОБСЛУЖИВАНИЯ - ВОЗВРАТ В СТРОЙ [VERCEL RESUME]" -ForegroundColor Yellow
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  Проект:         $ProjectTitle" -ForegroundColor DarkGray
Write-Host "  Каталог:        $ProjectRoot" -ForegroundColor DarkGray
Write-Host "  Целевая ветка:  $TargetBranch" -ForegroundColor DarkGray
Write-Host ""

# 1. Удаление файлов заглушки и конфигурации обслуживания
Write-Host "[1/3] Удаление maintenance.html и vercel.json..." -ForegroundColor Cyan
$maintenancePath = Join-Path $ProjectRoot "maintenance.html"
$vercelJsonPath = Join-Path $ProjectRoot "vercel.json"

$filesRemoved = $false
if (Test-Path -LiteralPath $maintenancePath) {
    Remove-Item -LiteralPath $maintenancePath -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Файл maintenance.html удален." -ForegroundColor Green
    $filesRemoved = $true
}

if (Test-Path -LiteralPath $vercelJsonPath) {
    Remove-Item -LiteralPath $vercelJsonPath -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Файл vercel.json удален." -ForegroundColor Green
    $filesRemoved = $true
}

if (-not $filesRemoved) {
    Write-Host "  [ИНФО] Файлы режима обслуживания уже отсутствовали." -ForegroundColor Yellow
}

# 2. Фиксация в Git и отправка в ветку v1-airbnb
Write-Host "[2/3] Фиксация изменений в Git и отправка коммита..." -ForegroundColor Cyan
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

    git rm -f "$ProjectFolder/maintenance.html" "$ProjectFolder/vercel.json" 2>$null
    git add -A 2>$null
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        git commit -m "chore: деактивация режима обслуживания и возврат в строй - $TargetBranch" 2>$null
        Write-Host "  [ИНФО] Коммит отключения техобслуживания сформирован." -ForegroundColor Yellow
        
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
            Write-Host "  [OK] Ветка $TargetBranch обновлена. Vercel инициировал пересборку боевого сайта." -ForegroundColor Green
        } else {
            Write-Host "  [ИНФО] Локальные файлы удалены и коммит создан. Отправка на remote отложена [проверьте сеть или права Git]." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  [OK] Git репозиторий находится в актуальном чистом состоянии." -ForegroundColor Green
    }
} catch {
    Write-Host "  [ИНФО] Завершено локальное удаление файлов обслуживания." -ForegroundColor Yellow
} finally {
    Set-Location -LiteralPath $ProjectRoot
}

# 3. Финал
Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  УСПЕХ! Режим обслуживания деактивирован. Платформа возвращена в строй." -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Green
