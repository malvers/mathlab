#!/bin/bash
# Builds Spiegel.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# Installed to /Applications like the other tools, so there is exactly one copy:
# the Screen Recording approval hangs on it.
APP="/Applications/Spiegel.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/Spiegel" main.swift ../docbar-app/docbarclient.swift -framework Cocoa -framework CoreMedia -framework ScreenCaptureKit -framework ServiceManagement

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Spiegel</string>
  <key>CFBundleDisplayName</key><string>Spiegel</string>
  <key>CFBundleExecutable</key><string>Spiegel</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.spiegel</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>14.0</string>
  <key>LSUIElement</key><true/>
  <key>NSHumanReadableCopyright</key><string>Dr. Michael R. Alvers</string>
</dict>
</plist>
PLIST

# A real certificate keeps the Screen Recording approval alive across rebuilds, which an
# ad-hoc signature does not (the checkbox stays on and silently stops working).
codesign --force --sign "Pinker-Finder Dev" "$APP" || codesign --force --sign - "$APP"
echo "built: $APP"
