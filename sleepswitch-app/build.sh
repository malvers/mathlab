#!/bin/bash
# Builds SleepSwitch.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

APP="SleepSwitch.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/SleepSwitch" main.swift -framework Cocoa -framework LocalAuthentication

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>SleepSwitch</string>
  <key>CFBundleDisplayName</key><string>SleepSwitch</string>
  <key>CFBundleExecutable</key><string>SleepSwitch</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.sleepswitch</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>LSUIElement</key><true/>
  <key>NSHumanReadableCopyright</key><string>Dr. Michael R. Alvers</string>
</dict>
</plist>
PLIST

# Ad-hoc signature keeps the app's identity stable across rebuilds.
codesign --force --sign - "$APP" >/dev/null 2>&1 || true
echo "built: $(pwd)/$APP"
