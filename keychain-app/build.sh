#!/bin/bash
# Builds MeineKeychain.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# Installed to /Applications like the other tools, so there is exactly one copy
# and DocBar can start it again from a stable path.
APP="/Applications/MeineKeychain.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/MeineKeychain" main.swift ../docbar-app/docbarclient.swift -framework Cocoa -framework LocalAuthentication

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>MeineKeychain</string>
  <key>CFBundleDisplayName</key><string>Meine Keychain</string>
  <key>CFBundleExecutable</key><string>MeineKeychain</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.meinekeychain</string>
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
echo "built: $APP"
