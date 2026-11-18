@echo off
title ManakSetu AI - FullStack Launcher
color 0B
cd /d "%~dp0"

echo ===================================================
echo   MANAKSETU AI - FULLSTACK LAUNCHER (BACKEND + FRONTEND)
echo ===================================================
echo.

:: Start FastAPI backend in a separate background window
echo [1/2] Launching Python FastAPI Backend (Port 8000)...
start "ManakSetu Backend" cmd /c "if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) & python server.py"

:: Open Browser
echo [2/2] Launching React Frontend (Port 5173)...
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173/"

:: Start Frontend in this window
call npm run dev

pause
