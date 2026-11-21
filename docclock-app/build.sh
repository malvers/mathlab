#!/bin/bash
# Builds DocClock.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# Installed straight to /Applications: the login item hangs on the bundle path,
# so there must be exactly one DocClock.app on this machine.
APP="/Applications/DocClock.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/DocClock" main.swift ../docbar-app/docbarclient.swift \
    -framework Cocoa -framework WebKit -framework ServiceManagement

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>DocClock</string>
  <key>CFBundleDisplayName</key><string>DocClock</string>
  <key>CFBundleExecutable</key><string>DocClock</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.docclock</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>LSUIElement</key><true/>
  <key>NSHumanReadableCopyright</key><string>Dr. Michael R. Alvers</string>
</dict>
PLIST
echo "</plist>" >> "$APP/Contents/Info.plist"

codesign --force --sign - "$APP" >/dev/null 2>&1 || true

echo "built: $APP"
