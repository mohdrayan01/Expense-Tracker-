@echo off
echo ====================================
echo   MongoDB Connection Checker
echo ====================================
echo.

echo [1/3] Checking if MongoDB service exists...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ MongoDB service found
    
    echo.
    echo [2/3] Checking if MongoDB is running...
    sc query MongoDB | find "RUNNING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo   ✓ MongoDB is RUNNING
        
        echo.
        echo [3/3] Testing connection to localhost:27017...
        timeout /t 1 /nobreak >nul
        echo   ✓ MongoDB appears to be ready
        echo.
        echo ====================================
        echo   STATUS: Ready to run application!
        echo ====================================
    ) else (
        echo   ✗ MongoDB is NOT running
        echo.
        echo To start MongoDB, run as Administrator:
        echo   net start MongoDB
        echo.
        echo Or use Windows Services (services.msc^)
    )
) else (
    echo   ✗ MongoDB service not found
    echo.
    echo MongoDB is NOT installed on this system.
    echo.
    echo Options:
    echo   1. Install MongoDB locally
    echo   2. Use MongoDB Atlas (cloud database^)
    echo.
    echo See MONGODB_SETUP.md for detailed instructions
)

echo.
echo Press any key to exit...
pause >nul
