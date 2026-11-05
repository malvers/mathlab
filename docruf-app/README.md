# DocRuf

Solita calls Doc on his Pixel instead of over the Mac's speakers, which do not reach the
other room (Doc, 02.11.2026). A short text arrives as a notification with sound and
vibration, and when "Ansagen" is on the phone also speaks it, in Solita's own voice.

## How a call travels

1. `~/.claude/hooks/solita-ruf.mjs "text" [auto|phone|0-100]` renders Solita's MP3 and puts
   it with the text into `~/solita-rufe`, as before.
2. The watcher `~/.claude/hooks/solita-ruf-waechter.sh` asks DocHere. Doc at the Mac: 35
   over the speakers. Away, or `phone`: `docruf-send.mjs` publishes text and MP3 on ntfy.sh.
3. The app keeps one line open to that topic (foreground service, back after a reboot),
   shows the call, posts its id to `<topic>-ok` as a receipt and plays the MP3. Without an
   MP3, or once it expired (3 h on ntfy.sh), the phone's own voice reads the text.
4. No receipt within 20 s: the Mac plays the call at 100 as it always did.

Media volume goes up to at least 70 % for a call and back afterwards. Calls older than
10 min, found after the line was down, are only listed.

## How Doc answers (since 1.2, 05.11.2026)

Every call carries two buttons. "Sprechen" opens Google's speech input (de-DE) and sends what
Doc said right away; the notification then shows what the phone understood. "Antworten" types
the answer in the notification. The app's "Antwort sprechen" answers the newest call. The
answer goes to `<topic>-antwort`, with the id of the call as its title, and shows under its
call in the app's list.

On the Mac an agent follows that topic:

    node docruf-app/docruf-antwort.mjs [--since 30m] [--once]

One line per answer (`ANTWORT 20:06: …`), kept in `~/Library/Logs/docruf-antwort.log`. Run as
a Claude Code Monitor, every answer arrives in the agent's chat.

## The secret

The topic name is the channel's only key: whoever knows it can read and send calls. It
lives in the Keychain (service `doc-ruf`, account `ntfy-topic`), goes into `BuildConfig`
when `build.sh` runs, and never into the source. The APK carries it, so the APK stays on
this Mac (gitignored) and goes onto the Pixel over USB. New topic = new Keychain entry and
`build.sh` again. Calls should never carry pupils' names or data, ntfy.sh is a public server.

## Build and install

    docruf-app/build.sh

builds with Android Studio's JDK and installs right away when the Pixel (`43211JEKB10668`)
hangs on USB. On the phone once: allow notifications, tap "Akku-Ausnahme erlauben" (else
Android closes the line while the screen is dark), then "Probe-Ruf".

From the Mac, without Solita's MP3:

    node docruf-app/docruf-send.mjs "Doc, kurzer Test." --wait 20
