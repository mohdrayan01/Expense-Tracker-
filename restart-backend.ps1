# Restart Backend Server

# Stop any process using port 5000
$processId = (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Write-Host "Stopping process on port 5000..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Green
Set-Location "d:\Projects\Expense Project\backend"
node server.js
