#!/bin/bash

# Build Release APK script for Mantra Practice App
# This script builds an unsigned release APK

set -e

echo "======================================="
echo "Mantra Practice App - Release Builder"
echo "======================================="

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

# Step 4: Build Android Release APK
echo ""
echo "[4/4] Building Android Release APK..."
cd android

# Use wrapper or system gradle
if command -v gradle &> /dev/null; then
    gradle assembleRelease
else
    ./gradlew assembleRelease
fi

# Show result
APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "======================================="
    echo "BUILD SUCCESSFUL!"
    echo "======================================="
    echo ""
    echo "Unsigned Release APK: android/$APK_PATH"
    echo "APK Size: $(du -h "$APK_PATH" | cut -f1)"
    echo ""
    echo "Note: To publish to Play Store, you need to sign the APK."
    echo "Use Android Studio or jarsigner to sign the APK."

    # Copy to root for easy access
    cp "$APK_PATH" "../MantraPractice-release.apk"
    echo "APK also copied to: MantraPractice-release.apk"
else
    echo ""
    echo "Build may have completed. Check android/app/build/outputs/apk/release/ for the APK."
fi
