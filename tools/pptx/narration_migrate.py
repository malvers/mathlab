"""Moves a deck's narration from the old format into its slides (Doc, 13.11.2026: "Die Vertonung mit Solita schwierig.
Weil bei jeder Änderung müssen wir da nachfeilen." - "Können wir uns da nicht ein besseres System ausdenken?").

Old: one <script id="narration"> with {deck, minutes, ..., slides: {"<index>": [parts]}, hold: [index],
demo: {"<index>" | "<index>.<part>": [...]}} and clips audio/<deck>/sNN-KK.mp3 named by slide and part - every slide
or line that was put in, taken out or moved meant renaming clips.

New (SOLITA in HTML/decks/deck.js): each slide carries its own words as its last child,
    <script type="application/json" class="say">{"say": [parts], "hold": true, "demo": {"0": [...], "8": [...]}}</script>
the deck-wide script keeps only the settings (deck, minutes, tempo, countdown, voice), and every clip is named after
its words: the first 12 hex digits of SHA-256 of voice + "\\n" + text. Nothing is spoken anew: each existing clip
sNN-KK.mp3 is renamed to the name of the words it belongs to, and texts.json follows (so deck_audio.mjs knows them).

    python3 tools/pptx/narration_migrate.py ai-wasserzeichen mathe11-lehrbuch ...   [--dry]   [--map]

--dry only tells what it would do. --map prints old -> new clip names as JSON (for pages that name clips themselves,
like js/wuerfelspiel-stations.js). The renames are plain renames on disk; commit them on their own (git sees them as
renames, the content is unchanged), the decks and texts.json in the next commit (CLAUDE.md, rule 19).
Clips no part of the deck speaks (an empty part, an old leftover) keep their old name and are listed - deleting them
is Doc's call.
"""
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import deck_edit  # noqa: E402  (section counting and the say tag, exactly as the editor does it)

VOICE = "de-DE-Studio-C"
OLD_CLIP = re.compile(r"^s(\d{2})-(\d{2})\.mp3$")


def clip_name(voice, text):
    """The same rule as clipFile in deck.js and clipName in deck_audio.mjs."""
    return hashlib.sha256((voice + "\n" + text).encode("utf-8")).hexdigest()[:12] + ".mp3"


def migrate(deck, dry=False):
    """Returns (report lines, {old clip: new clip})."""
    path = os.path.join(deck_edit.DECKS, deck + ".html")
    page = open(path, encoding="utf-8").read()
    m = deck_edit.NARRATION.search(page)
    if not m or not m.group(2).strip():
        return ["%s: no narration" % deck], {}
    data = json.loads(m.group(2).replace("<\\/", "</"))
    if not any(k in data for k in ("slides", "hold", "demo")):
        return ["%s: already in the new format" % deck], {}
    slides, hold, demo = data.get("slides") or {}, data.get("hold") or [], data.get("demo") or {}
    voice = data.get("voice") or VOICE
    bounds = deck_edit.elements(page, deck_edit._gen())[1]

    per = {}                                          # slide index -> its say dict
    for k, parts in slides.items():
        per.setdefault(int(k), {})["say"] = parts
    for h in hold:
        per.setdefault(int(h), {})["hold"] = True
    for key, entries in demo.items():
        i, _, part = key.partition(".")
        per.setdefault(int(i), {}).setdefault("demo", {})[part or "0"] = entries
    if max(per) >= len(bounds):
        raise SystemExit("%s: narration for slide %d, but the deck has %d slides" % (deck, max(per), len(bounds)))
    for i in sorted(per, reverse=True):               # from the end: the offsets in front stay valid
        a, b = bounds[i]
        if deck_edit.SAY_TAG.search(page[a:b]):
            raise SystemExit("%s: slide %d already has words of its own" % (deck, i))
        words = {k: per[i][k] for k in ("say", "hold", "demo") if k in per[i]}
        page = page[:a] + deck_edit._say_put(page[a:b], words) + page[b:]
    head = {k: v for k, v in data.items() if k not in ("slides", "hold", "demo")}
    m = deck_edit.NARRATION.search(page)
    page = page[:m.start(2)] + json.dumps(head, ensure_ascii=False).replace("</", "<\\/") + page[m.end(2):]

    folder = os.path.join(deck_edit.DECKS, "audio", data.get("deck") or deck)
    files = set(os.listdir(folder)) if os.path.isdir(folder) else set()
    renames, missing, clash = {}, [], []
    for k, parts in slides.items():
        for p, text in enumerate(parts):
            if not text.strip():
                continue
            old, new = "s%02d-%02d.mp3" % (int(k), p), clip_name(voice, text)
            if old not in files:
                missing.append(old)
            elif new in renames.values() or (new in files and new not in renames):
                clash.append("%s -> %s" % (old, new))
            else:
                renames[old] = new
    left = sorted(f for f in files if OLD_CLIP.match(f) and f not in renames)
    report = ["%s: %d slides with words, %d clips renamed, %d parts without a clip (silent as before)%s"
              % (deck, len(per), len(renames), len(missing), " " + ", ".join(missing) if missing else "")]
    if left:
        report.append("  %d old clips no part speaks, kept under their names: %s" % (len(left), ", ".join(left)))
    if clash:
        raise SystemExit("%s: the same words with two different clips - decide by ear first: %s" % (deck, clash))
    if dry:
        return report, renames

    texts_path = os.path.join(folder, "texts.json")
    texts = json.load(open(texts_path, encoding="utf-8")) if os.path.exists(texts_path) else None
    for old, new in renames.items():
        os.rename(os.path.join(folder, old), os.path.join(folder, new))
    if texts is not None:
        texts = {renames.get(k, k): v for k, v in texts.items()}
        with open(texts_path, "w", encoding="utf-8") as f:
            f.write(json.dumps(texts, ensure_ascii=False, indent=1))
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(page)
    os.replace(tmp, path)
    return report, renames


if __name__ == "__main__":
    args = sys.argv[1:]
    dry, show = "--dry" in args, "--map" in args
    decks = [a for a in args if not a.startswith("--")]
    if not decks:
        sys.exit(__doc__)
    maps = {}
    for d in decks:
        lines, maps[d] = migrate(d[:-5] if d.endswith(".html") else d, dry)
        print("\n".join(lines))
    if show:
        print(json.dumps(maps, indent=1))
