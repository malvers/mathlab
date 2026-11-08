#!/bin/sh
# Builds DocStep, runs the gait tests, and installs + starts the app when the Pixel is on USB or WLAN.
#   docstep-app/build.sh           tests, build, install
#   docstep-app/build.sh test      only the tests (JUnit on the Mac)
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
PKG=de.docalvers.docstep
WHAT="${1:-all}"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

cd "$HERE/android"
./gradlew -q testDebugUnitTest
echo "Tests grün"
[ "$WHAT" = test ] && exit 0

./gradlew -q assembleDebug
APK="$HERE/android/app/build/outputs/apk/debug/app-debug.apk"
echo "gebaut: $APK"
# on the cable or over WLAN, whichever is there (tools/pixel-serial.sh)
if PIXEL=$(sh "$HERE/../tools/pixel-serial.sh"); then
    "$ADB" -s "$PIXEL" install -r "$APK"
    "$ADB" -s "$PIXEL" shell am start -n "$PKG/.MainActivity" >/dev/null
    echo "auf dem Pixel installiert und gestartet ($PIXEL)"
else
    echo "Pixel weder per USB noch per WLAN da: installieren mit  $ADB install -r $APK"
fi
