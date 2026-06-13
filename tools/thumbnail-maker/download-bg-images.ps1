# download-bg-images.ps1
# Baixa as imagens de background do Thumbnail Maker para images/bg/
# Execute uma vez: powershell -ExecutionPolicy Bypass -File download-bg-images.ps1

$ErrorActionPreference = 'Continue'
$dir = Join-Path $PSScriptRoot "images\bg"
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

$images = @(
  @{ name="xp-bliss.jpg";   url="https://upload.wikimedia.org/wikipedia/en/e/ea/Bliss_%28Windows_XP%29.png" },
  @{ name="earth.jpg";      url="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1280px-The_Earth_seen_from_Apollo_17.jpg" },
  @{ name="aurora.jpg";     url="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1280&h=720&fit=crop&auto=format" },
  @{ name="mountain.jpg";   url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&h=720&fit=crop&auto=format" },
  @{ name="sunset.jpg";     url="https://images.unsplash.com/photo-1506905489827-e8cc738c1e3a?w=1280&h=720&fit=crop&auto=format" },
  @{ name="beach.jpg";      url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&h=720&fit=crop&auto=format" },
  @{ name="cat.jpg";        url="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1280&h=720&fit=crop&auto=format" },
  @{ name="dog.jpg";        url="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1280&h=720&fit=crop&auto=format" },
  @{ name="money.jpg";      url="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1280&h=720&fit=crop&auto=format" },
  @{ name="coffee.jpg";     url="https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=1280&h=720&fit=crop&auto=format" },
  @{ name="handshake.jpg";  url="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1280&h=720&fit=crop&auto=format" },
  @{ name="team.jpg";       url="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1280&h=720&fit=crop&auto=format" }
)

$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" }

Write-Host "Baixando imagens para: $dir`n"
$ok = 0; $fail = 0

foreach ($img in $images) {
  $dest = Join-Path $dir $img.name
  if (Test-Path $dest) {
    Write-Host "  [skip] $($img.name) (já existe)"
    $ok++
    continue
  }
  try {
    Write-Host "  [down] $($img.name)..." -NoNewline
    Invoke-WebRequest -Uri $img.url -OutFile $dest -Headers $headers -UseBasicParsing -TimeoutSec 30
    Write-Host " OK" -ForegroundColor Green
    $ok++
  } catch {
    Write-Host " FALHOU: $_" -ForegroundColor Red
    $fail++
  }
}

Write-Host "`n$ok OK, $fail falhas."
if ($fail -gt 0) { Write-Host "Imagens que falharam podem ser baixadas manualmente e salvas em: $dir" }
