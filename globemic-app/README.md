# GlobeMic

Push-to-talk on the Globe key for the Claude panel of VS Code.

- Hold Globe: presses Cmd+D, the mic goes on
- Release: the mic runs on for 0.3 s so the last word arrives, then Return goes out
- A short tap or Globe with another key stays what it was
- Saying exactly "Slash clear" runs the real /clear, also when it arrives as "/clear."; anything else stays a normal message
- Only acts while VS Code is in front
- On/off, login item and permissions live in DocBar

Return only goes out when a new microphone capture started during the hold. With the
cursor in the code Cmd+D selects a word, the mic stays off and nothing is sent. The event
tap only listens, and the log in `~/Library/Logs/GlobeMic.log` holds phases and timing,
never keys or text, only how many characters the field held.

To check for "Slash clear", holds up to 6 s copy the field through the clipboard for a
moment. The old clipboard content is put back right away.

## Build

    ./build.sh        # installs /Applications/GlobeMic.app

Needs only the Xcode command line tools, no project file.

## Setup

- Privacy & Security: allow GlobeMic under Input Monitoring and Accessibility
- Keyboard: set "Press Globe key to" to "Do Nothing"
