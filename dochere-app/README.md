# DocHere

Knows whether Doc sits at the Mac, and since 13.11.2026 whether it is Doc or somebody else. The D of DocBar is
green while he does.

- Keyboard or mouse used in the last 30 s: here, the camera stays off
- Screen locked or display asleep: away, the camera stays off
- Otherwise the camera looks for about two seconds, at most every 30 s

The green light is on during a look. Apple's Vision looks for a person on this Mac: face,
upper body or person mask. Frames stay in memory, nothing is saved or sent. The log in
`~/Library/Logs/DocHere.log` holds the answer and the measured values, never a picture.

## Who it is

When a face is seen, `face.swift` aligns it (Vision landmarks onto the 112 x 112 template) and turns it into
512 numbers with AuraFace-v1 (fal.ai, Apache-2.0, converted to Core ML on this Mac). The best cosine against
Doc's enrolled prints decides: 0.45 or more is `doc`, below is `other`. Measured 13.11.2026: Doc's 10 photos
0.58 to 0.85 against each other (leave-one-out), 2000 strangers from LFW at most 0.367, none above 0.40.

Everything personal stays outside the repo, in `~/Library/Application Support/DocHere/` (700): the photos
(`faces/doc-*.jpg`), Doc's prints (`doc-prints.json`) and the model (`models/`). Never commit any of it.

    --snap <file.jpg>   one photo through DocHere's camera (for enrolling)
    --enroll            prints of Doc from faces/doc-*.jpg -> doc-prints.json
    --evaluate          each doc photo against the others, other-*.jpg against all
    --crops             the aligned 112 x 112 crops into faces/crops/, to check the alignment
    --ask-who           one look: doc, other, away or unknown
    --measure <s>       the watching camera, one line per frame: brightness, face, quality, cm, score, steady answer
    --distance <s>      the watching camera, one line per frame: distance in cm, recognised, steady answer, near
                        (--keep also writes the frames with a person to faces/dark/, to tune on them)
    --score <dir>       how a folder of Doc's frames scores (--prefix <name> picks some)
    --strangers <dir>   LFW-style folder of folders: one picture per person against Doc's prints
                        (--dim makes each look like a dark-room webcam frame, --limit <n>, default 2000)

## In the dark (13.11.2026)

Doc in a dark room, lit by the screen: the face was found in nearly every frame, but its score against the
daytime prints wandered (median 0.62, 10 of 116 frames below 0.45, the lowest 0.28), and DocPhoto, which hides
after two misses, flickered. Two changes:

- Five frames from the dark room are enrolled as `doc-11-dunkel-1..5.jpg`: on a second dark measurement 1 of 117
  frames below 0.45 (median 0.71). LFW stays clear: 2000 strangers max 0.355, made dark (`--dim`) max 0.382,
  none at 0.40 or above. The old prints are kept as `doc-prints-vor-dunkel-1311.json`.
- The watching answers are steadied (`Steady` in main.swift); the threshold stays 0.45 for every frame. "doc"
  comes back with one frame at 0.45 or more; leaving it for "other" takes three faces below 0.45 without a Doc
  frame between; a person without a clear face keeps the answer; "away" takes three empty frames in a row. The
  log gets each change with score, brightness and how many frames were held back.

## Head turned (15.11.2026)

The camera sits on the MacBook beside the big screen, so Doc's usual pose is already turned (yaw 35..60 degrees,
scores 0.68 on average). Turned further, nearly in profile, his score fell below 0.45 in 3 of 4 frames, and a head
held turned for a few seconds made three weak frames in a row: DocPhoto flickered. Now Vision's head pose comes with
every face (`yaw`, `pitch` in `--measure`, `--evaluate` and the log), and a weak face outside yaw -25..60 or beyond
25 degrees up or down is "unclear" - it keeps the answer (`Pose` in main.swift). A match still counts at any angle,
so the threshold for strangers is untouched (LFW: 2000 strangers max 0.355, dark max 0.382; 134 of them were turned
too far to be judged). Leaving "doc" now takes five judgeable weak faces without a Doc frame between.

## One bad frame in the background (16.11.2026)

A single background look scored 0.104 and DocBar showed "!" for six minutes while Doc typed: the background decided
on one frame, and keyboard and mouse kept the old answer. Now each background look goes through `Pose` and `Steady`
like the watching; a stranger needs two judgeable weak faces before "other" (`Steady.confirm`, the watching stays at
one). While a stranger is suspected or shown, DocHere looks again after 5 s even while Doc types (at most 3 quick
looks in a row, `Timing.recheck`/`rechecks`), and while "!" stays it keeps the 30 s pace despite keyboard and mouse.
A look without a person still ends it at once. The log line carries the head pose and the steady answer, e.g.
`who: doc (model 0.709, yaw -5, pitch 24) -> doc` (a weak face outside the pose range adds `, turned too far`).

## Near enough (20.11.2026, experiment)

Doc: the photos also showed while he stood a metre away. The watching now estimates how far the face is from the face
box the landmarks give anyway (`closeness.swift`): a 13 cm box (2.07 x the pupil distance on Doc's pictures, 6.3 cm
pupils) at a horizontal field of view of 65 degrees over the camera's full picture (square, 1552 x 1552 on this
MacBook Air, the 480 x 480 frames are all of it). The field of view is a guess; one measurement at a known distance
corrects it. Sitting normally measured 48..62 cm, the pupils agree.

"near" comes after two frames at or below `nearCm`, "far" after two frames beyond `nearCm + nearMarginCm`; in between,
and for frames without a clear face, the answer stays (30 such frames in a row end "near"). Each `who` notification
carries `near` (1/0) and `cm` next to `answer`; only DocPhoto uses it ("doc" and near). The answer itself, DocBar's D
and "!" and `--ask` for Solita are unchanged. The log gets each change (`near: yes (57 cm, threshold 75 cm)`) and one
line a minute (`distance: median 55 cm (48..62, ...)`).

    defaults write de.docalvers.dochere nearCm -float 75          # the threshold (0 = off, as before)
    defaults write de.docalvers.dochere nearMarginCm -float 15    # hysteresis
    defaults write de.docalvers.dochere distanceScale -float 1.0  # real cm / shown cm, after calibrating

Read on every frame, no restart. The experiment, one line per frame (time, cm from the box and from the pupils, yaw,
score, recognised, steady answer, near), also appended to `~/Library/Logs/DocHere-distance.log`, with a 5 s summary:

    open -g -n -a /Applications/DocHere.app --args --distance 120
    tail -f ~/Library/Logs/DocHere-distance.log

Tests: `swiftc -parse-as-library -o /tmp/closeness-test closeness.swift steady.swift tests/closeness_test.swift && /tmp/closeness-test`

## Sticky Doc (20.11.2026)

Doc works facing the LG, the MacBook to his right: yaw 40..60 degrees is his normal pose, not an exception. There his
scores hovered around 0.45 (0.10..0.55), five weak frames came every 20..60 s, and each made "other" for 2 s - DocPhoto
hid the photos every time ("Jetzt geht es ständig weg und kommt"). Two changes:

- `Steady` (now `steady.swift`): once "doc", only a run of faces all below 0.30 for 12 s (20 s when a face in it was
  turned beyond 35 degrees, at least 3 frames) makes "other"; a face between 0.30 and 0.45 ends the run, and so
  does a frame without a clear face or without a person. With two or
  more faces in the frame the old rule holds (5 weak faces). Entering "doc" still needs 0.45, a stranger after "away"
  is still "other" at once, and the background looks keep the old rule (`sticky: false`).
- Eight frames of his working pose (yaw 41..59, 20.11.2026 daylight, from `--measure --keep`) are enrolled as
  `doc-12-lg-1..8.jpg`: 23 prints. The old ones are kept as `doc-prints-vor-lg-2011.json`.

DocPhoto hides only after 10 s of "not doc or not near" (an empty chair: two answers, as before) and shows again at the
first "doc" that is near.

## Watching for DocPhoto

DocPhoto shows its desktop photos only while Doc sits here. While it asks for it (distributed notification
`de.docalvers.dochere.watch`, renewed every 5 s, DocHere stops 30 s after the last request), the camera stays on
without pausing - one steady green light - and one frame is checked every second on mains power, every 5 s on
battery. Each answer (`doc`, `other`, `unknown`, `away`), steadied as described under "In the dark", goes out as
`de.docalvers.dochere.who`. Lock, display
asleep or DocHere off: the camera stops. Measured 13.11.2026 on mains: about 10 % of one core.

Since 20.11.2026 another local tool asks too. Each tool's request counts on its own - the notification's object names
the tool (e.g. `de.docalvers.example`), and its `"on": "0"` withdraws only its own request. Before, one shared request
time meant that DocPhoto quitting stopped the watching another tool still wanted, which read that as `away`.

On/off and the login item live in DocBar. Off means no looks in the background and a plain
D, a Solita call still looks once.

## Solita calls

`~/.claude/hooks/solita-ruf.mjs` writes `ruf-auto-<stamp>.mp3` unless a volume was given, and
the watcher asks DocHere once: `here` is 35, anything else is 100 with a fixed announcement
in front. Before 07:00 Berlin it stays 35 without asking.

    open -g -n -W --stdout answer.txt -a /Applications/DocHere.app --args --ask

`--ask` prints `here`, `away`, or `unknown` when the camera gives no answer, for example
with the lid closed. `--test <seconds>` prints the measured values for finding the thresholds.
`--every <seconds>` ignores keyboard and mouse and looks this often, to try it out.

Always start it with `open -g`: a plain `open` takes the front from VS Code, and GlobeMic
drops every hold while VS Code is not in front. `-n` keeps it apart from the running copy.

## Build

    ./build.sh        # installs /Applications/DocHere.app

Needs only the Xcode command line tools, no project file.

## Setup

- Privacy & Security: allow DocHere under Camera
