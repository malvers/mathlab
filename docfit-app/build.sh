#!/bin/sh
# Builds DocFit's APK and installs it on the Pixel (USB or WLAN, tools/pixel-serial.sh).
#   ./build.sh            build + install + start
#   ./build.sh --bauen    build only (e.g. while Doc teaches: never install onto his phone during lessons)
# The small German Vosk model (vosk-model-small-de-0.15, Apache 2.0, ~45 MB) is fetched once into a cache outside the
# repo and unpacked into the APK's assets (gitignored) - it never goes into git.
set -e
cd "$(dirname "$0")/android"
ADB="$(sh ../../tools/adb.sh)"   # the newest adb on this Mac - wireless debugging needs it, never the old SDK copy
MODEL=vosk-model-small-de-0.15
CACHE="$HOME/Library/Caches/docfit"
ASSET=app/src/main/assets/model-de
if [ ! -f "$ASSET/uuid" ]; then
    mkdir -p "$CACHE"
    if [ ! -f "$CACHE/$MODEL.zip" ]; then
        curl -fL -o "$CACHE/$MODEL.zip.part" "https://alphacephei.com/vosk/models/$MODEL.zip"
        mv "$CACHE/$MODEL.zip.part" "$CACHE/$MODEL.zip"
    fi
    (cd "$CACHE" && unzip -q -o "$MODEL.zip")
    mkdir -p "$ASSET"
    cp -R "$CACHE/$MODEL/." "$ASSET/"
    # StorageService.unpack copies the model out of the APK again only when this id changes
    echo "$MODEL" > "$ASSET/uuid"
fi
# the "Fasting" tab shows Doc's fasts from web/fasting/private/ (health data, gitignored) - without it only a hint
[ -f ../web/fasting/private/fasting-data.js ] || echo "Hinweis: keine Fasten-Daten - vorher: python3 tools/fasting_from_excel.py"
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew -q testDebugUnitTest assembleDebug
APK=app/build/outputs/apk/debug/app-debug.apk
# the model must be inside, at assets/model-de (the gradle check guards the sources, this the result)
unzip -l "$APK" | grep -q " assets/model-de/uuid$" || { echo "FEHLER: im APK fehlt das Sprachmodell (assets/model-de)" >&2; exit 1; }
echo "gebaut: $(pwd)/$APK ($(du -h "$APK" | cut -f1))"
[ "$1" = "--bauen" ] && exit 0
if PIXEL=$(sh ../../tools/pixel-serial.sh); then
    "$ADB" -s "$PIXEL" install -r "$APK"
    "$ADB" -s "$PIXEL" shell am start -n de.docalvers.docfit/.MainActivity >/dev/null
    echo "auf dem Pixel installiert und gestartet ($PIXEL)"
else
    echo "Pixel weder per USB noch per WLAN da: installieren mit  $ADB install -r $(pwd)/$APK"
fi
