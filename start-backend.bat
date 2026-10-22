@echo off
title Aahuti Backend (FastAPI)
echo Starting Aahuti Backend on http://localhost:8000 ...
cd /d "%~dp0backend"
python -m uvicorn app.main:app --reload --port 8000
pause
