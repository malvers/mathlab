# SleepSwitch

Menu bar switch for "running with closed screen" — toggles `pmset -a disablesleep 0|1`.

- Left click: toggle, confirmed by Touch ID
- Right click: menu (state, toggle, Touch ID on/off, quit)
- Icon: red cup = stays awake with the lid closed, moon = normal sleep

## Build

    ./build.sh        # produces SleepSwitch.app next to the sources

Needs only the Xcode command line tools, no project file.

## Passwordless switching

`pmset` needs root. The menu item *Set up Touch ID / passwordless…* installs a
sudoers rule limited to exactly these two commands:

    /etc/sudoers.d/pmset-disablesleep
    <user> ALL=(root) NOPASSWD: /usr/bin/pmset -a disablesleep 0, /usr/bin/pmset -a disablesleep 1

Without that rule the app falls back to the standard password dialog.
