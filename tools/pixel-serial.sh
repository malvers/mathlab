#!/bin/sh
# Prints the adb serial of Doc's Pixel: the USB cable when it hangs on one, otherwise the phone over WLAN
# (adb tcpip 5555 or Android's wireless debugging) - Doc, 08.11.2026: "Jetzt brauchen wir das Kabel nie mehr".
# Prints nothing and exits 1 when the phone is on neither. Used by the apps' build.sh.
USB=43211JEKB10668
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
LIST=$("$ADB" devices)
if echo "$LIST" | grep -q "^$USB[[:space:]]*device"; then
    echo "$USB"
    exit 0
fi
WLAN=$(echo "$LIST" | awk '$2 == "device" && ($1 ~ /:[0-9]+$/ || $1 ~ /_adb-tls-connect/) { print $1; exit }')
[ -n "$WLAN" ] && { echo "$WLAN"; exit 0; }
exit 1
