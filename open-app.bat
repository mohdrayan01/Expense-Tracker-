@echo off
echo Opening Expense Tracker...
start http://localhost:3000
echo.
echo If the page doesn't load, make sure both servers are running:
echo   - Backend: cd backend && npm run dev
echo   - Frontend: cd frontend && npm run dev
pause
