# DocHere

Knows whether Doc sits at the Mac. The D of DocBar is green while he does.

- Keyboard or mouse used in the last 30 s: here, the camera stays off
- Screen locked or display asleep: away, the camera stays off
- Otherwise the camera looks for about two seconds, at most every 30 s

The green light is on during a look. Apple's Vision looks for a person on this Mac: face,
upper body or person mask. Frames stay in memory, nothing is saved or sent, and it only tells
that somebody is there, never who. The log in `~/Library/Logs/DocHere.log` holds the answer
and the measured values, never a picture.

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
