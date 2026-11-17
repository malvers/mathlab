#!/bin/sh
# Prints the path of the adb every script here should use - the newest one on this Mac (Doc, 17.11.2026).
# The Android SDK copy (~/Library/Android/sdk/platform-tools, version 29) is too old for Android's wireless
# debugging (TLS + mDNS, "Kabelloses Debugging"); /usr/local/bin/adb (37) speaks both. Two different adb
# versions also kill each other's server, so ALL scripts (tools/pixel-serial.sh, the apps' build.sh) take
# their adb from here and never hard-wire a path.
for a in /usr/local/bin/adb /opt/homebrew/bin/adb "$HOME/Library/Android/sdk/platform-tools/adb"; do
    if [ -x "$a" ]; then
        echo "$a"
        exit 0
    fi
done
command -v adb && exit 0
exit 1
