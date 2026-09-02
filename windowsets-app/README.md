# WindowSets

Menu bar app that remembers where your windows are — separately for every monitor
setup — and puts them back when you plug that setup in again.

`./build.sh` builds and installs `/Applications/WindowSets.app` (command line tools are
enough, no Xcode project). It installs there on purpose: the login item and the
Accessibility approval both hang on the bundle path, so a second copy would be the one
starting at login, silently outdated.

## How it works

- Every 6 seconds the current window layout is recorded for the display configuration
  that is attached right now. A configuration is identified by the panels themselves
  (vendor, model, serial), their resolution and their arrangement — so "MacBook alone",
  "MacBook + LG ULTRAWIDE" and "office setup" are separate entries.
- When displays are plugged or unplugged, macOS shuffles the windows. WindowSets stops
  recording the moment that happens, waits 2.5 s for things to settle, and then restores
  the layout last seen with the new configuration. The number of restored windows flashes
  next to the menu bar icon.
- The last 6 snapshots per configuration are kept — "Earlier snapshots" in the menu goes
  back if a restore was not what you wanted.
- Left click on the icon restores immediately, right click opens the menu.

Windows are matched per app by title first, then in recorded order. Minimised, full screen
and non-standard windows (panels, dialogs) are left alone.

Layouts live in `~/Library/Application Support/WindowSets/layouts.json`.

## Setup

1. `./build.sh`, then launch `/Applications/WindowSets.app`.
2. Grant **System Settings → Privacy & Security → Accessibility** — without it macOS lets
   nobody read or move other apps' windows.
3. Menu → **Start at login**, so the recorder is always running.
