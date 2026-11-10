#!/bin/sh
# Builds DocFeedback's APK and installs it on the Pixel - on the cable or over WLAN (tools/pixel-serial.sh).
# No secrets: the app only opens the public page rueckmeldung.html?c=<code>.
set -e
cd "$(dirname "$0")/android"
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew -q assembleDebug
APK=app/build/outputs/apk/debug/app-debug.apk
echo "gebaut: $(pwd)/$APK"
if PIXEL=$(sh ../../tools/pixel-serial.sh); then
    "$ADB" -s "$PIXEL" install -r "$APK"
    "$ADB" -s "$PIXEL" shell am start -n de.docalvers.docfeedback/.MainActivity >/dev/null
    echo "auf dem Pixel installiert und gestartet ($PIXEL)"
else
    echo "Pixel weder per USB noch per WLAN da: installieren mit  $ADB install -r $(pwd)/$APK"
fi
