# Aahuti (आहुति) — VS Code Quickstart Guide

This folder contains the complete fullstack Aahuti project configured for VS Code.

---

## ⚡ Fastest Way to Run (1-Click)

Double-click **`start-all.bat`** in this folder.  
It will automatically launch:
- **Backend (FastAPI)** at `http://localhost:8000` (API docs at `http://localhost:8000/docs`)
- **Frontend (Vite React)** at `http://localhost:5173`

---

## 💻 Running inside VS Code

### Step 1: Open Folder in VS Code
1. Open VS Code.
2. Click **File** > **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Select this folder: `Desktop\aahuti`.

### Step 2: Open Terminal & Run

Open the built-in VS Code Terminal (`Ctrl + ~` or **Terminal > New Terminal**):

#### Terminal 1: Run Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

#### Terminal 2: Run Frontend (Click '+' to open second terminal tab)
```bash
cd frontend
npm run dev
```

Open your browser to `http://localhost:5173`.

---

## 🛠️ VS Code Automated Tasks
You can also use VS Code's task runner:
1. Press `Ctrl + Shift + P`.
2. Type `Tasks: Run Task` and press Enter.
3. Choose **`Start Full Project (Frontend + Backend)`**.

---

## 📂 Project Structure
```
aahuti/
├── backend/            # FastAPI Python backend (AI agent, Decider 2B, SQLite)
│   ├── app/            # Routers, models, services, AI integration
│   ├── tests/          # 14 passed test suites
│   ├── foodbridge.db   # Pre-seeded SQLite database
│   └── requirements.txt
├── frontend/           # Vite + React + TypeScript frontend
│   ├── src/            # Editorial UI components, pages, design system
│   ├── public/         # Images and assets
│   ├── node_modules/   # Pre-installed dependencies
│   └── package.json
├── .vscode/            # Pre-configured launch & tasks for VS Code
├── start-all.bat       # Double-click launcher for both servers
├── start-backend.bat   # Double-click launcher for backend only
└── start-frontend.bat  # Double-click launcher for frontend only
```
