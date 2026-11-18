@echo off
title ManakSetu AI - Server Launcher
echo ====================================================
echo Starting ManakSetu AI - BIS Compliance Platform...
echo ====================================================
cd /d "%~dp0"
python -m streamlit run app.py
pause
