#!/bin/sh
# Builds DocMitschrift: the Android app (and installs it when the Pixel hangs on USB) and the Mac helper.
#   docmitschrift-app/build.sh            both
#   docmitschrift-app/build.sh android    only the app
#   docmitschrift-app/build.sh mac        only mitschrift-mac
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
WHAT="${1:-all}"

if [ "$WHAT" = all ] || [ "$WHAT" = android ]; then
    cd "$HERE/android"
    JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew -q assembleDebug
    APK="$HERE/android/app/build/outputs/apk/debug/app-debug.apk"
    echo "gebaut: $APK"
    # on the cable or over WLAN, whichever is there (tools/pixel-serial.sh)
    if PIXEL=$(sh "$HERE/../tools/pixel-serial.sh"); then
        "$ADB" -s "$PIXEL" install -r "$APK"
        "$ADB" -s "$PIXEL" shell am start -n de.docalvers.docmitschrift/.MainActivity >/dev/null
        echo "auf dem Pixel installiert und gestartet ($PIXEL)"
    else
        echo "Pixel weder per USB noch per WLAN da: installieren mit  $ADB install -r $APK"
    fi
fi

if [ "$WHAT" = all ] || [ "$WHAT" = mac ]; then
    mkdir -p "$HERE/mac/build"
    xcrun swiftc -O -o "$HERE/mac/build/mitschrift-mac" "$HERE/mac/main.swift" \
        -framework AVFoundation -framework Speech -framework FoundationModels -framework CoreMedia
    echo "gebaut: $HERE/mac/build/mitschrift-mac"
fi
