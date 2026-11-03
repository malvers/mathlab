#!/bin/bash
# Builds GlobeMic.app (no Xcode project needed, just the command line tools).
set -e
cd "$(dirname "$0")"

# Installed to /Applications like the other tools, so there is exactly one copy:
# the login item and both privacy approvals hang on it.
APP="/Applications/GlobeMic.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

swiftc -O -o "$APP/Contents/MacOS/GlobeMic" main.swift ../docbar-app/docbarclient.swift -framework Cocoa -framework CoreAudio -framework ServiceManagement -framework AVFoundation -framework Speech

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>DocMic</string>
  <key>CFBundleDisplayName</key><string>DocMic</string>
  <key>CFBundleExecutable</key><string>GlobeMic</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.globemic</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>26.0</string>
  <key>LSUIElement</key><true/>
  <key>NSHumanReadableCopyright</key><string>Dr. Michael R. Alvers</string>
  <key>NSMicrophoneUsageDescription</key><string>DocMic records while you hold Globe and writes it down on this Mac.</string>
  <key>NSSpeechRecognitionUsageDescription</key><string>DocMic writes your dictation down on this Mac.</string>
</dict>
</plist>
PLIST

# A real certificate keeps both approvals alive across rebuilds, which an ad-hoc
# signature does not (the checkbox stays on and silently stops working).
codesign --force --sign "Pinker-Finder Dev" "$APP" || codesign --force --sign - "$APP"
echo "built: $APP"
