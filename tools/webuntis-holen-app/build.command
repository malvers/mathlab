#!/bin/bash
# Builds "WebUntis holen.app" (native AppKit, see main.swift) into ~/Applications.
# Needs the Xcode Command Line Tools (swiftc). Double-click or: bash build.command
set -e
cd "$(dirname "$0")"
APP="$HOME/Applications/WebUntis holen.app"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
swiftc -O -framework AppKit main.swift -o "$APP/Contents/MacOS/WebUntisHolen"
# icon: drawn by icon.swift, packed with iconutil
ICONSET="$(mktemp -d)/icon.iconset"
swiftc -O -framework AppKit icon.swift -o "$(dirname "$ICONSET")/mkicon"
"$(dirname "$ICONSET")/mkicon" "$ICONSET" >/dev/null
iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/AppIcon.icns"
cat > "$APP/Contents/Info.plist" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>WebUntis holen</string>
  <key>CFBundleDisplayName</key><string>WebUntis holen</string>
  <key>CFBundleIdentifier</key><string>de.docalvers.webuntis-holen</string>
  <key>CFBundleExecutable</key><string>WebUntisHolen</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>LSMinimumSystemVersion</key><string>12.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>CFBundleIconFile</key><string>AppIcon</string>
</dict>
</plist>
EOF
touch "$APP"
echo "gebaut: $APP"
