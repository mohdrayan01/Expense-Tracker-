@echo off
echo ====================================
echo   Expense Tracker - Quick Start
echo ====================================
echo.

REM Check if MongoDB is running (local installation)
echo Checking MongoDB connection...
sc query MongoDB | find "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] MongoDB service is not running locally!
    echo.
    echo Please choose one of the following options:
    echo   1. Start MongoDB service: net start MongoDB
    echo   2. Use MongoDB Atlas (cloud database^)
    echo   3. See MONGODB_SETUP.md for detailed instructions
    echo.
    echo Press any key to continue anyway (if using MongoDB Atlas^)...
    pause >nul
)

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening Browser...
start http://localhost:3000

echo.
echo ====================================
echo All servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ====================================
echo.
echo If the webpage doesn't load:
echo   1. Check MongoDB is running
echo   2. See backend terminal for errors
echo   3. Read MONGODB_SETUP.md for help
echo.
echo Press any key to close this window...
pause >nul
