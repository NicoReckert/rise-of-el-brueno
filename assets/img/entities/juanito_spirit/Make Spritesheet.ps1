Write-Host "========================================="
Write-Host "  FFmpeg Spritesheet Builder (FINAL + JSON)"
Write-Host "========================================="
Write-Host ""

# === FFmpeg Pfad ===
$ffmpeg = "C:\Users\$env:USERNAME\Desktop\ffmpeg-8.0\bin\ffmpeg.exe"
$ffprobe = "C:\Users\$env:USERNAME\Desktop\ffmpeg-8.0\bin\ffprobe.exe"

if (-not (Test-Path $ffmpeg)) {
    Write-Host "❌ FFmpeg nicht gefunden:"
    Write-Host $ffmpeg
    Read-Host
    exit
}

if (-not (Test-Path $ffprobe)) {
    Write-Host "❌ ffprobe nicht gefunden:"
    Write-Host $ffprobe
    Read-Host
    exit
}

# === Konfiguration ===
$MAX_FRAMES_PER_SHEET = 22
$FPS_DEFAULT = 12

# === Frames laden ===
$files = Get-ChildItem -File |
  Where-Object { $_.Extension -in ".png", ".webp" } |
  Sort-Object @{ Expression = {
      # Zahl am Ende / im Namen finden (z.B. I-10 -> 10)
      $m = [regex]::Match($_.BaseName, '(\d+)(?!.*\d)')
      if ($m.Success) { [int]$m.Value } else { 999999 }
  }}, Name


if ($files.Count -eq 0) {
    Write-Host "❌ Keine Frames gefunden!"
    Read-Host
    exit
}

$ext = $files[0].Extension.TrimStart(".")
$totalFrames = $files.Count

Write-Host "✔ Format: $ext"
Write-Host "✔ Frames gesamt: $totalFrames"
Write-Host ""

# === Framegröße über ffprobe lesen (WEBP & PNG sicher) ===
$probe = & $ffprobe `
    -v error `
    -select_streams v:0 `
    -show_entries stream=width,height `
    -of csv=p=0 `
    "$($files[0].FullName)"

if (-not $probe) {
    Write-Host "❌ Konnte Framegröße nicht lesen!"
    Read-Host
    exit
}

$parts = $probe.Trim().Split(',')
$FRAME_WIDTH  = [int]$parts[0]
$FRAME_HEIGHT = [int]$parts[1]

Write-Host "✔ Framegröße: ${FRAME_WIDTH} x ${FRAME_HEIGHT}"

# === Chunks ===
$chunks = @()
for ($i = 0; $i -lt $totalFrames; $i += $MAX_FRAMES_PER_SHEET) {
    $chunks += ,($files[$i..([Math]::Min($i + $MAX_FRAMES_PER_SHEET - 1, $totalFrames - 1))])
}

$sheetIndex = 1

foreach ($chunk in $chunks) {

    $frameCount = $chunk.Count

    # === GRID: IDENTISCH ZU DEINER VERSION ===
    if ($frameCount -le 4) {
        $cols = $frameCount
    } else {
        $cols = 4
    }
    $rows = [Math]::Ceiling($frameCount / $cols)

    Write-Host "➡️ Sheet $sheetIndex : $frameCount Frames → $cols x $rows"

    # === Temp ===
    $tmp = "_tmp_sheet_$sheetIndex"
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
    New-Item $tmp -ItemType Directory | Out-Null

    # === concat.txt ===
    $concatFile = "$tmp\concat.txt"
    $i = 1
    foreach ($f in $chunk) {
        Copy-Item $f.FullName "$tmp\$i.$ext"
        Add-Content $concatFile "file '$i.$ext'"
        $i++
    }

    # === Output ===
    $sheetName = ("spritesheet_{0:D2}.$ext" -f $sheetIndex)
    $jsonName  = ("spritesheet_{0:D2}.json" -f $sheetIndex)

    Push-Location $tmp

    if ($ext -eq "png") {
        & $ffmpeg `
            -y `
            -f concat `
            -safe 0 `
            -i concat.txt `
            -vf "tile=${cols}x${rows}:color=0x00000000" `
            "..\$sheetName"
    }
    else {
        & $ffmpeg `
            -y `
            -f concat `
            -safe 0 `
            -i concat.txt `
            -vf "tile=${cols}x${rows}:color=0x00000000" `
            -c:v libwebp `
            -lossless 1 `
            "..\$sheetName"
    }

    Pop-Location
    Remove-Item $tmp -Recurse -Force

    # === JSON (NEU, rein rechnerisch) ===
    $meta = @{
        image       = $sheetName
        frameWidth  = $FRAME_WIDTH
        frameHeight = $FRAME_HEIGHT
        columns     = $cols
        rows        = $rows
        frames      = $frameCount
        animations  = @{
            default = @{
                from = 0
                to   = ($frameCount - 1)
                fps  = $FPS_DEFAULT
                loop = $true
            }
        }
    }

    $meta | ConvertTo-Json -Depth 6 | Out-File $jsonName -Encoding UTF8

    $sheetIndex++
}

Write-Host ""
Write-Host "✅ Fertig! Spritesheets + JSON erzeugt."
Read-Host "Enter zum Beenden"
