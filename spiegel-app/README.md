# Spiegel

Shows the second screen in a small window on the Mac's own screen: in the classroom Doc
sees what the board shows while he works on the Mac.

- Comes by itself when a screen is extended next to the built-in display, goes with it
- Mirrored screens (⌘F1) and the closed lid (two monitors at home) show nothing
- Floats over every app, full screen included, and never takes the keyboard
- Drag to move; under the mouse orange grips show in the corners, drag one to resize
  (the opposite corner stays, the board's shape too); both are remembered
- 15 frames a second with the mouse pointer, as many pixels as the window shows

Frames go straight from ScreenCaptureKit into the window, nothing is saved or sent. The log
in `~/Library/Logs/Spiegel.log` holds which screen was shown and why it stopped.

On/off, "Back to the corner" and the login item live in DocBar. A red DocBar icon means
Screen Recording is not allowed yet.

## Build

    ./build.sh        # installs /Applications/Spiegel.app
    open -g /Applications/Spiegel.app

Needs only the Xcode command line tools, no project file. Signed with the "Pinker-Finder
Dev" certificate so the Screen Recording approval survives a rebuild.

## Setup

- Privacy & Security: allow Spiegel under Screen & System Audio Recording, then
  "Quit & Reopen"
