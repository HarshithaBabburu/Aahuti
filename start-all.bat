@echo off
title Aahuti Fullstack Launcher
echo ========================================================
echo   Launching Aahuti AI-Powered Surplus Food Rescue
echo ========================================================
echo.
echo [1/2] Starting Backend in separate window...
start "Aahuti Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting Frontend in separate window...
start "Aahuti Frontend (Vite React)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Both servers are launching!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo.
echo You can keep this window open or close it anytime.
pause
