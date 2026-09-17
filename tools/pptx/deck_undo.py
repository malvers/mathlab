"""Undo and redo for the deck editor (Doc, 17.09.2026: "Undo ... intelligent klein").

Every write of a deck goes through deck_edit._write(), which hands the file as it was and as it becomes to record() -
text, bullet lines and pictures alike, so there is one undo for all of them. back() puts the older text in place, but
only while the file is still exactly what that step wrote: nothing done elsewhere (a rebuild, another session, a hand
edit, the deck editor in a second tab) is ever thrown away - then the undo just stops with a message. Going forward
again (redo) works until the next new change.

A step that moved Solita's clips (a bullet line with its own click group, deck_edit._narration) is `stuck`: the clips on
disk would not move back with the text, so undo stops there instead of mixing up who says what.

The steps lie in <git dir>/deck-undo/<deck>/ - never in the working tree, never committed - at most KEEP per deck,
the texts once per content. On disk, because serve.py reloads the modules per request; they even survive a restart.
"""
import hashlib
import json
import os
import subprocess
import tempfile
import time

KEEP = 50


def _root(e):
    """<git dir>/deck-undo, or a temp folder when REPO is no git repo (tests on a copy)."""
    try:
        return os.path.join(e._git("rev-parse", "--absolute-git-dir"), "deck-undo")
    except (RuntimeError, OSError, subprocess.SubprocessError):
        return os.path.join(tempfile.gettempdir(), "deck-undo-" + hashlib.sha1(e.REPO.encode()).hexdigest()[:8])


def _sha(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def _load(folder):
    try:
        with open(os.path.join(folder, "steps.json"), encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {"undo": [], "redo": []}


def _save(folder, steps):
    """Write the step list and keep only the texts it still names."""
    os.makedirs(folder, exist_ok=True)
    tmp = os.path.join(folder, "steps.json.tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(steps, f, ensure_ascii=False, indent=1)
    os.replace(tmp, os.path.join(folder, "steps.json"))
    used = {s[k] for side in ("undo", "redo") for s in steps[side] for k in ("before", "after")}
    for name in os.listdir(folder):
        if name.endswith(".html") and name[:-5] not in used:
            os.remove(os.path.join(folder, name))


def _keep(folder, text):
    sha = _sha(text)
    path = os.path.join(folder, sha + ".html")
    if not os.path.exists(path):
        os.makedirs(folder, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
    return sha


def record(e, deck, before, after, what="Änderung", stuck=False):
    """One write of the deck: `before` -> `after`. Call it under deck_edit._lock, right after the write.
    `before` None (the file was not there) is no step to go back to."""
    if before is None or before == after:
        return
    folder = os.path.join(_root(e), deck)
    steps = _load(folder)
    steps["undo"].append({"before": _keep(folder, before), "after": _keep(folder, after), "what": what,
                          "stuck": bool(stuck), "t": int(time.time())})
    steps["undo"] = steps["undo"][-KEEP:]
    steps["redo"] = []                                # a new change ends the way forward
    _save(folder, steps)


def back(e, deck, forward=False):
    """Undo (or redo with forward=True) the last step of this deck. Returns (status, reply).
    deck_edit._write must be called with record=False here - moving through the steps is not a new step."""
    take, give = ("redo", "undo") if forward else ("undo", "redo")
    gen = e._gen()
    with e._lock:
        folder = os.path.join(_root(e), deck)
        steps = _load(folder)
        if not steps[take]:
            return 409, {"error": "Nichts mehr wiederherzustellen." if forward else "Nichts mehr rückgängig zu machen."}
        step = steps[take][-1]
        now, to = (step["before"], step["after"]) if forward else (step["after"], step["before"])
        page = e._read(deck)
        if _sha(page) != now:
            return 409, {"error": "Die Datei wurde inzwischen anders geändert – hier hört Rückgängig auf."}
        if step["stuck"]:
            return 422, {"error": "Hier sind Solita-Clips mitgewandert – das lässt sich nicht rückgängig machen."}
        with open(os.path.join(folder, to + ".html"), encoding="utf-8") as f:
            text = f.read()
        e._write(deck, text, gen, record=False)
        steps[give].append(steps[take].pop())
        _save(folder, steps)
    return 200, {"what": step["what"], "undo": len(steps["undo"]), "redo": len(steps["redo"]),
                 "mtime": e._mtime(deck), "pending": e.pending(deck)}
