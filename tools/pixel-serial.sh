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

# The router gives the phone a new address now and then (08.11.2026: 192.168.2.102 -> .100, nothing else had
# changed, adb tcpip still listened). So drop the stale entry and ask for the phone by its name, which the
# router always resolves to today's address (Doc: "Ja, klar, machen"). Each try gives up after 8 s, because
# adb connect to an address nobody answers hangs for minutes.
NAME=vita-somnium-breve-pixel
echo "$LIST" | awk '$2 == "offline" && $1 ~ /:[0-9]+$/ { print $1 }' | while read -r old; do
    "$ADB" disconnect "$old" >/dev/null 2>&1
done
GW=$(route -n get default 2>/dev/null | awk '/gateway:/ { print $2 }')
IPS=$({ host "$NAME" "$GW" 2>/dev/null | awk '/has address/ { print $4 }'
        dscacheutil -q host -a name "$NAME.local" 2>/dev/null | awk '/^ip_address:/ { print $2 }'; } | awk '!seen[$0]++')
# adb connect, but given up after 8 s without a shell message (the adb server may still finish it meanwhile)
connect() {
    perl -e '$p = fork; exec @ARGV unless $p; $SIG{ALRM} = sub { kill 9, $p; exit 0 }; alarm 8; waitpid $p, 0' \
        "$ADB" connect "$1" >/dev/null 2>&1
}
found() {
    for ip in $IPS; do
        "$ADB" devices | grep -q "^$ip:5555[[:space:]]*device" && { echo "$ip:5555"; return 0; }
    done
    return 1
}
for ip in $IPS; do
    connect "$ip:5555"
    found && exit 0
done
sleep 3                                          # a connect cut off above can still land
found && exit 0
exit 1
