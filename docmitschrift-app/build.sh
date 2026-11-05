#!/bin/sh
# Builds DocMitschrift: the Android app (and installs it when the Pixel hangs on USB) and the Mac helper.
#   docmitschrift-app/build.sh            both
#   docmitschrift-app/build.sh android    only the app
#   docmitschrift-app/build.sh mac        only mitschrift-mac
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
PIXEL=43211JEKB10668
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
WHAT="${1:-all}"

if [ "$WHAT" = all ] || [ "$WHAT" = android ]; then
    cd "$HERE/android"
    JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew -q assembleDebug
    APK="$HERE/android/app/build/outputs/apk/debug/app-debug.apk"
    echo "gebaut: $APK"
    if "$ADB" devices | grep -q "^$PIXEL[[:space:]]*device"; then
        "$ADB" -s "$PIXEL" install -r "$APK"
        "$ADB" -s "$PIXEL" shell am start -n de.docalvers.docmitschrift/.MainActivity >/dev/null
        echo "auf dem Pixel installiert und gestartet"
    else
        echo "Pixel nicht per USB da: installieren mit  $ADB -s $PIXEL install -r $APK"
    fi
fi

if [ "$WHAT" = all ] || [ "$WHAT" = mac ]; then
    mkdir -p "$HERE/mac/build"
    xcrun swiftc -O -o "$HERE/mac/build/mitschrift-mac" "$HERE/mac/main.swift" \
        -framework AVFoundation -framework Speech -framework FoundationModels -framework CoreMedia
    echo "gebaut: $HERE/mac/build/mitschrift-mac"
fi
