#!/bin/bash
# Builds DeskPhoto.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# Installed straight to /Applications: the login item hangs on the bundle path,
# so there must be exactly one DeskPhoto.app on this machine.
APP="/Applications/DeskPhoto.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/DeskPhoto" main.swift ../docbar-app/docbarclient.swift -framework Cocoa -framework ServiceManagement

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>DeskPhoto</string>
  <key>CFBundleDisplayName</key><string>DeskPhoto</string>
  <key>CFBundleExecutable</key><string>DeskPhoto</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.deskphoto</string>
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
