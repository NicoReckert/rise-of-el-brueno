@echo off
echo ========================================
echo   MP3 -> Opus Konverter (Stereo, 128 kbps, 48 kHz)
echo ========================================
echo.

REM Pfad zu ffmpeg.exe (falls nicht in PATH, anpassen!)
set FFMPEG=C:\Users\%USERNAME%\Desktop\ffmpeg-8.0\bin\ffmpeg.exe

REM Ziel-Bitrate & Samplerate (48 kHz ist Standard für Opus)
set BITRATE=128k
set SAMPLERATE=48000

for %%i in (*.mp3) do (
    echo Konvertiere: %%i ...
    "%FFMPEG%" -i "%%i" -c:a libopus -b:a %BITRATE% -ac 2 -ar %SAMPLERATE% "%%~ni.opus"
)

echo.
echo Fertig! Alle MP3s wurden nach Opus (128 kbps Stereo, 48 kHz) konvertiert.
pause
