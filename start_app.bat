@echo off
title ManakSetu AI - Server Launcher
color 0A
cd /d "%~dp0"

echo ===================================================
echo       MANAKSETU AI (मानक सेतु) - BIS ASSISTANT
echo ===================================================
echo.
echo Starting Application Server on http://localhost:5173/ ...
echo.

:: Open browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173/"

:: Start Vite dev server
call npm run dev

pause
