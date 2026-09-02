#!/bin/bash
# Builds WindowSets.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

APP="WindowSets.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/WindowSets" main.swift -framework Cocoa -framework ApplicationServices -framework ServiceManagement

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>WindowSets</string>
  <key>CFBundleDisplayName</key><string>WindowSets</string>
  <key>CFBundleExecutable</key><string>WindowSets</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.windowsets</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>LSUIElement</key><true/>
  <key>NSHumanReadableCopyright</key><string>Dr. Michael R. Alvers</string>
</dict>
</plist>
PLIST

codesign --force --sign - "$APP" >/dev/null 2>&1 || true

# An ad-hoc signature is tied to the binary, so every rebuild invalidates the
# Accessibility approval — while the checkbox stays visibly on and simply stops
# working ("Failed to match existing code requirement" in the tccd log). Clearing
# the entry turns that silent failure back into an honest question.
tccutil reset Accessibility de.docalvers.windowsets >/dev/null 2>&1 || true

echo "built: $(pwd)/$APP"
echo "note:  Accessibility has to be granted again after every build."
