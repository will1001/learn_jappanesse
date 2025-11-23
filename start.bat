@echo off
echo ========================================
echo   Japanese Text Parser - Quick Start
echo ========================================
echo.
echo Starting servers...
echo.
echo 1. Backend Server: http://localhost:3001
echo 2. Frontend GUI:   http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend server
start "Backend Server" cmd /c "node src/server.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server
start "Frontend Server" cmd /c "npm run dev"

REM Open browser after a short delay
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo ✅ Both servers are running!
echo 🌐 Opening browser in 5 seconds...
echo.
echo Keep this window open. Close it to stop all servers.
echo.

REM Wait for user to stop
pause