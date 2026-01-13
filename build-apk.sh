#!/bin/bash

# Build APK script for Mantra Practice App
# This script builds the web app and generates the Android APK

set -e

echo "============================="
echo "Mantra Practice App Builder"
echo "============================="

# Step 1: Install dependencies
echo ""
echo "[1/4] Installing dependencies..."
npm install

# Step 2: Build the web app
echo ""
echo "[2/4] Building web app..."
npm run build

# Step 3: Sync with Capacitor
echo ""
echo "[3/4] Syncing with Capacitor..."
npx cap sync android

# Step 4: Build Android APK
echo ""
echo "[4/4] Building Android APK..."
cd android

# Use wrapper or system gradle
if command -v gradle &> /dev/null; then
    gradle assembleDebug
else
    ./gradlew assembleDebug
fi

# Show result
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "============================="
    echo "BUILD SUCCESSFUL!"
    echo "============================="
    echo ""
    echo "APK Location: android/$APK_PATH"
    echo "APK Size: $(du -h "$APK_PATH" | cut -f1)"
    echo ""

    # Copy to root for easy access
    cp "$APK_PATH" "../MantraPractice.apk"
    echo "APK also copied to: MantraPractice.apk"
else
    echo ""
    echo "Build may have completed. Check android/app/build/outputs/apk/ for the APK."
fi
