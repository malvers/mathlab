#!/bin/bash
# Builds DocBar.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# The app is installed straight to /Applications: the login item and the
# Accessibility approval both hang on the bundle path, so there must be exactly
# one DocBar.app on this machine — a second copy in the repo would be the
# one that starts at login, silently outdated.
APP="/Applications/DocBar.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/DocBar" main.swift docbarclient.swift -framework Cocoa

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>DocBar</string>
  <key>CFBundleDisplayName</key><string>DocBar</string>
  <key>CFBundleExecutable</key><string>DocBar</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.docbar</string>
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

echo "built: $APP"
