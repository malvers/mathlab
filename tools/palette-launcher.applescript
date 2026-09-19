-- Launcher for the SVP colour picker: a Chrome app window without address bar.
-- Started from the Dock/Spotlight (run) or by Shift+C in a plan on localhost:8765
-- (svp-palette:// link, open location). An open picker window is brought to the
-- front instead of opening a second one. No --window-size: Chrome keeps the
-- window's own position and size per app (Doc: "pos und size persist") - under a name
-- made from the start URL, which must not contain a dot (see HTML/palette/index.html).
on run
	showPalette()
end run

on open location theURL
	showPalette()
end open location

on showPalette()
	if application "Google Chrome" is running then
		tell application "Google Chrome"
			repeat with w in windows
				try
					if URL of active tab of w contains "localhost:8765/tailwind-palette.html" then
						set index of w to 1
						activate
						return
					end if
				end try
			end repeat
		end tell
	end if
	do shell script "open -na 'Google Chrome' --args --app=http://localhost:8765/palette/"
end showPalette

-- Build (macOS): osacompile -o ~/Applications/tailwind-palette.app tools/palette-launcher.applescript
-- then add to Contents/Info.plist: CFBundleIdentifier de.docalvers.svp-palette and
-- CFBundleURLTypes -> CFBundleURLSchemes "svp-palette" (PlistBuddy), then
-- codesign --force --sign - <app> and lsregister -f <app>.
