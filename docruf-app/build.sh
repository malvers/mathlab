#!/bin/sh
# Builds DocRuf's APK and installs it on the Pixel when it hangs on USB.
# The call topic comes from the Keychain (service doc-ruf, account ntfy-topic) and goes into BuildConfig only:
# never into the source, and the APK stays on this Mac (it is gitignored), because whoever has it can read the calls.
set -e
cd "$(dirname "$0")/android"
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
DOCRUF_TOPIC=$(security find-generic-password -s doc-ruf -a ntfy-topic -w) || { echo "kein Kanal in der Keychain (doc-ruf / ntfy-topic)"; exit 1; }
export DOCRUF_TOPIC
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew -q assembleDebug
APK=app/build/outputs/apk/debug/app-debug.apk
echo "gebaut: $(pwd)/$APK"
# on the cable or over WLAN, whichever is there (tools/pixel-serial.sh)
if PIXEL=$(sh ../../tools/pixel-serial.sh); then
    "$ADB" -s "$PIXEL" install -r "$APK"
    "$ADB" -s "$PIXEL" shell am start -n de.docalvers.docruf/.MainActivity >/dev/null
    echo "auf dem Pixel installiert und gestartet ($PIXEL)"
else
    echo "Pixel weder per USB noch per WLAN da: installieren mit  $ADB install -r $(pwd)/$APK"
fi
