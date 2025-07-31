#!/bin/bash

echo "Starting React Native Debugger and PlantPal app..."
echo

# Start React Native Debugger in background
react-native-debugger &

# Wait a moment for debugger to start
sleep 3

# Start the Expo app
echo "Starting PlantPal app..."
npm start 