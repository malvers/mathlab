# GlobeMic

Push-to-talk on the Globe key: the Claude panel of VS Code, and local dictation in every other app.

- Hold Globe: presses Cmd+D, the mic goes on
- Release: the mic runs on for 0.3 s so the last word arrives, then Return goes out
- A short tap or Globe with another key stays what it was
- Saying exactly "Slash clear", "Slash usage" or "Slash context" (or "Slash Kontext") runs the real command, also when it arrives as "/clear."; anything else stays a normal message
- Only acts like this while VS Code is in front

## Every other app (WhatsApp, Mail, Notes …)

- Hold Globe: the microphone feeds Apple's SpeechAnalyzer (macOS 26, Neural Engine) live,
  the words appear in the field while you speak, about half a second behind. When the
  recognizer changes its guess, only the characters DocMic typed itself are deleted and typed
  again. Release: the last words follow. In WhatsApp, Signal, Teams and Telegram Return goes out
  right after, like in the Claude panel; everywhere else the text only goes in
- Live typing only happens when Accessibility says the cursor is in a text field, because typed
  letters anywhere else are shortcuts (Gmail: "e" archives, "#" deletes). Otherwise the text is
  pasted at the end through the clipboard, which is given back right away. Electron apps like
  Signal are asked for accessibility (AXManualAccessibility) so their fields show
- Mail writes a new mail into an editable web area (AXWebArea with a settable AXValue), the
  message view is a web area that can not be changed and stays paste-only; Outlook's body is a
  plain AXTextArea. Neither sends on release
- A tiny dark pill at the bottom of the screen, five orange bars move with the voice
- If another app came to the front in the meantime, the text waits on the clipboard (green bars)
- Spoken commands (German and English, `Spoken` in main.swift): "neue Zeile" (Shift+Return, so
  messengers do not send), "neuer Absatz", "Ausrufezeichen", "Fragezeichen", "Doppelpunkt",
  "Semikolon", "Gedankenstrich", "Klammer auf/zu", "Anführungszeichen auf/zu", "Smiley",
  "lachender/Zwinker-/trauriger Smiley", "Daumen hoch", "Herzchen". At the end: "nicht senden"
  keeps the text but sends nothing, "Kommando zurück" takes the whole dictation away.
  "Punkt" and "Komma" stay words, the recognizer sets them itself. A message ending in a new
  line is not sent. Not in the Claude panel, there Anthropic's dictation writes the field
- German (de_DE); the names of the house tools are fixed afterwards ("Doc Point" → "DocPoint")
- No tokens, no cloud: the audio never leaves the Mac, the system keeps the model
- "Dictate in every app" in DocBar switches this part off
- Whisper large-v3-turbo was tried first: about 3 s per dictation on the M3 and 0.7 to 1.7 GB
  held all the time, which pushed the Mac into swap
- On/off, login item and permissions live in DocBar

Return only goes out when a new microphone capture started during the hold. With the
cursor in the code Cmd+D selects a word, the mic stays off and nothing is sent. The event
tap only listens, and the log in `~/Library/Logs/GlobeMic.log` holds phases and timing,
never keys or text, only how many characters the field held.

To check for a spoken command, holds up to 6 s copy the field through the clipboard for a
moment. The old clipboard content is put back right away.

## Build

    ./build.sh        # installs /Applications/GlobeMic.app

Needs only the Xcode command line tools, no project file. The German speech model comes from
Apple on the first start (about a minute and a half, log line "speech model ready").

## Setup

- Privacy & Security: allow GlobeMic under Input Monitoring, Accessibility and Microphone
- Keyboard: set "Press Globe key to" to "Do Nothing"
