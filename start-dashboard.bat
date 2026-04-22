@echo off
title JIRAH Dashboard
cd /d "%~dp0dashboard"

REM If port 3000 is already listening, just open the browser — don't launch a second dev server.
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo Dashboard already running on port 3000 — opening browser.
    start "" http://localhost:3000
    timeout /t 2 >nul
    exit /b 0
)

REM Fresh start: open browser after a delay, then run dev server in foreground.
start "" /min cmd /c "timeout /t 8 >nul && start http://localhost:3000"
call npm run dev
