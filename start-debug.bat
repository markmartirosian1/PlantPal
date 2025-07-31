@echo off
echo Starting React Native Debugger and PlantPal app...
echo.

REM Start React Native Debugger in background
start "" react-native-debugger

REM Wait a moment for debugger to start
timeout /t 3 /nobreak > nul

REM Start the Expo app
echo Starting PlantPal app...
npm start

pause 