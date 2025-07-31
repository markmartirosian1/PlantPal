# PowerShell script to start React Native Debugger and PlantPal app
Write-Host "Starting React Native Debugger and PlantPal app..." -ForegroundColor Green
Write-Host ""

# Start React Native Debugger in background
Write-Host "Starting React Native Debugger..." -ForegroundColor Yellow
Start-Process -FilePath "react-native-debugger" -WindowStyle Normal

# Wait a moment for debugger to start
Write-Host "Waiting for debugger to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start the Expo app
Write-Host "Starting PlantPal app..." -ForegroundColor Yellow
npm start

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 