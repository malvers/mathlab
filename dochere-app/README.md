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
