#!/bin/bash
# Builds DocHere.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# Installed to /Applications like the other tools, so there is exactly one copy:
# the camera approval hangs on it.
APP="/Applications/DocHere.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/DocHere" main.swift face.swift ../docbar-app/docbarclient.swift -framework Cocoa -framework AVFoundation -framework ServiceManagement -framework Vision -framework CoreML

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>DocHere</string>
  <key>CFBundleDisplayName</key><string>DocHere</string>
  <key>CFBundleExecutable</key><string>DocHere</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.dochere</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>14.4</string>
  <key>LSUIElement</key><true/>
  <key>NSCameraUsageDescription</key><string>DocHere looks for about two seconds whether somebody sits at the Mac, so Solita calls quietly. No picture is saved or sent.</string>
  <key>NSHumanReadableCopyright</key><string>Dr. Michael R. Alvers</string>
</dict>
</plist>
PLIST

# A real certificate keeps the camera approval alive across rebuilds, which an ad-hoc
# signature does not (the checkbox stays on and silently stops working).
codesign --force --sign "Pinker-Finder Dev" "$APP" || codesign --force --sign - "$APP"
echo "built: $APP"
