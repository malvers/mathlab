# DocMitschrift

Doc records what he says in class all day and later knows what he told which class (Doc, 05.11.2026:
"ich kann mir einfach nie merken, welcher Klasse ich was erzählt habe"). The microphone is a DJI Mic
Mini 2 clipped to the collar; its USB-C receiver goes into the Pixel or, over a short extension, into
the Mac.

## How a day travels

1. **Pixel:** the app records in pieces of five minutes (AAC, mono, 16 kHz, 32 kbit/s, about 14 MB an
   hour, 110 MB for 8 hours). USB microphone before Bluetooth before the phone's own; plugging one in
   or out starts a new piece (only a real change: Android reports every device once when the app
   starts listening). The screen may stay dark. If Android ends the recording, a loud notification
   says so. The app has no internet permission at all. Reinstalling the app kills a running
   recording: check `adb shell dumpsys activity services de.docalvers.docmitschrift` first.
2. **Evening, Pixel on USB at the Mac:** `python3 docmitschrift-app/mitschrift.py`
   - fetches every finished piece (`adb run-as`, size checked) and deletes it on the phone,
   - writes it down with Apple's SpeechAnalyzer (German, on this Mac, about 30× real time),
   - puts each sentence next to Doc's lessons from the local Untis copy (`HTML/svp/plandaten/`),
   - summarises each lesson with Apple Intelligence on this Mac in four lists: Stoff, Im Unterricht,
     Hausaufgabe, Termine,
   - moves the audio to the Trash. Only the text stays.
3. **Read:** `~/Documents/mitschrift/tage/<tag>.md` (the day, summary + full wording per lesson) and
   `~/Documents/mitschrift/klassen/<klasse>.md` (per class, newest first).

## Data protection

Nothing leaves Doc's devices: no cloud for audio, text or summaries, and `~/Documents/mitschrift/`
is outside the repo. The clip-on microphone mostly hears Doc. What pupils say counts as non-public
speech (§ 201 StGB), which is why the audio is deleted as soon as it is written down. The
summaries are told to leave out pupils' names.

## Build

    docmitschrift-app/build.sh          # app (installs when the Pixel hangs on USB) + Mac helper
    docmitschrift-app/build.sh mac      # only the Mac helper

On the phone once: allow microphone and notifications, tap "Akku-Ausnahme erlauben".

## The screen

Start/Stop, the microphone in use, today's minutes, what still waits for the Mac, and in the lower half
a pill (Doc, 05.11.2026): its rim breathes green and the bars move with the voice while recording,
yellow with "gerade still" after 15 s without sound, grey and flat when stopped.

## Status (05.11.2026)

- Mac: 79 s of synthetic speech (`say -v Anna`) written down in 2.6 s, summary lists correct.
- Pixel 8a: installed, first tests with Doc at 08:27 and 08:35 recorded, fetched and written down.
  With the screen locked (08:38) it kept recording, Android reported the mic as not silenced, and
  the sentence came through word for word.
- Android gives real audio to only one ordinary app at a time: Solita's wake word, the Claude app's
  voice input or a phone call can make the recording silent (the pill turns yellow). Plan with Marie
  for one shared ear: `plan-solita-docmitschrift.md` in the repo root.
- First real day: Doc lets it run in class on 05.11. with the phone's own microphone (the DJI arrives
  7.–9.11.). Lessons that day: 13:30–14:30 BGY24, 14:45–15:45 BGY25 (GK Informatik).
- German offline recognition is installed on the Pixel (`checkRecognitionSupport`: installed de-DE),
  so live text on the phone can work without the internet.

## Next

1. Live text on the Pixel while it records (on-device recognizer fed from the same audio), the Mac
   still makes the clean version in the evening.
2. Transfer over Wi-Fi at home instead of the cable: the phone pushes its pieces straight to the Mac,
   secret from the Keychain like DocRuf. Not Supabase: classroom audio with pupils' voices does not go
   to a cloud service (proposed to Doc, his answer pending).
3. Mac mode when the DJI receiver hangs on the Mac: record into the same `eingang/`.

## Known limits

- The on-device language model is small: it sometimes misfiles a class exercise as homework or
  mangles a word. The full wording is always on the page underneath.
- Bluetooth straight from the DJI transmitter to the phone is wired in but untested; USB is the
  sure way.
