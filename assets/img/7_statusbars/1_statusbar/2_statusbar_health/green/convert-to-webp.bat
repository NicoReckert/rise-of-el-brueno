@echo off
echo ========================================
echo   PNG -> WebP Konverter (mit Transparenz)
echo ========================================
echo.

REM Pfad zu ffmpeg.exe anpassen!
set FFMPEG=C:\Users\%USERNAME%\Desktop\ffmpeg-8.0\bin\ffmpeg.exe

REM Qualität einstellen (0–100, Standard: 80 ist gut)
set QUALITY=80

for %%i in (*.png) do (
    echo Konvertiere: %%i ...
    "%FFMPEG%" -i "%%i" -c:v libwebp -lossless 0 -q:v %QUALITY% "%%~ni.webp"
)

echo.
echo Fertig! Alle PNGs wurden nach WebP konvertiert.
pause
