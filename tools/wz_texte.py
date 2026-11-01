#!/usr/bin/env python3
"""Texts for the watermark lab (HTML/wasserzeichen.html), written word by word by a local model through Ollama.

Before every word the model's chances are read, green words get the bonus (e^delta times the chance) and only then one is
drawn: the real procedure, with the key 7. A word's colour depends on the first two letters of it and of the word before,
so the lab can colour any text, also one that was rewritten or translated afterwards. The attacks are real too: the model
rewrites the bonus-2 texts and translates them there and back, three rounds. Writes HTML/data/wasserzeichen-texte.json after
every text and skips what is already there. Usage: wz_texte.py [words] [out.json]
"""
import json
import math
import os
import random
import re
import sys
import time
import urllib.request

MODEL, KEY, WORDS = "qwen3-vl:8b-instruct", 7, int(sys.argv[1]) if len(sys.argv) > 1 else 200
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "HTML", "data", "wasserzeichen-texte.json")
BONI = (2, 0, 1, 3, 4, 6)
STILE = {"goethe": ("Goethe", "ein Brief im Stil von Goethes Werther, geschrieben an einem Frühlingstag am See", 11),
         "dickens": ("Dickens", "eine Szene im Stil von Charles Dickens, auf Deutsch, an einem Winterabend in einer Londoner Gasse", 12),
         "zeitung": ("Zeitung", "ein sachlicher Zeitungsartikel im Stil einer heutigen Lokalzeitung über die Eröffnung der neuen Stadtbibliothek", 13)}
WORD = re.compile(r"[A-Za-zÄÖÜäöüß]+")


def hash_(key, a, b):                                  # the same as hash() in wasserzeichen.html
    h = 0x811c9dc5
    for c in f"{key}|{a}|{b}":
        h = ((h ^ ord(c)) * 16777619) & 0xffffffff
    h ^= h >> 15
    h = (h * 0x2c1b3c6d) & 0xffffffff
    h ^= h >> 12
    h = (h * 0x297a2d39) & 0xffffffff
    h ^= h >> 15
    return h >> 31


cut = lambda w: w.lower()[:2]


def ollama(prompt, n, temp=.9, chances=False):
    d = {"model": MODEL, "prompt": prompt, "raw": True, "stream": False, "keep_alive": "10m", "options": {"num_predict": n, "temperature": temp, "seed": 1}}
    if chances:
        d.update(logprobs=True, top_logprobs=20)
    r = urllib.request.Request("http://localhost:11434/api/generate", json.dumps(d).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(r, timeout=600))


def chat(user, system="Du schreibst natürliches, gutes Deutsch."):
    return f"<|im_start|>system\n{system}<|im_end|>\n<|im_start|>user\n{user}<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n"


def write(thema, delta, seed):
    head, rng, out = chat(f"Schreibe einen Text mit etwa {round(WORDS * 1.2)} Wörtern: {thema}. Nur Fließtext, keine Überschrift."), random.Random(seed), b""
    for _ in range(1600):
        text = out.decode("utf-8", "ignore")
        words = WORD.findall(text)
        if len(words) >= WORDS and re.search(r"[.!?]\s*$", text):
            break
        d = ollama(head + text, 2, chances=True)
        if "logprobs" not in d:                        # the model wants to stop: below the goal it goes on with a paragraph
            if len(words) >= WORDS:
                break
            out += b"\n\n"
            continue
        prev = cut(words[-1]) if words else ""
        opts = []
        for c in d["logprobs"][0]["top_logprobs"]:
            if "<|" in c["token"] or not c.get("bytes") or (len(words) < WORDS and not c["token"].strip()):
                continue
            p, w = math.exp(c["logprob"]), WORD.match(c["token"].strip())
            at_start = not text or not text[-1].isalpha() or not c["token"][:1].isalpha()   # a token brings its space along
            if at_start and w and len(w.group()) >= 2 and hash_(KEY, prev, cut(w.group())):
                p *= math.exp(delta)
            if len(words) >= WORDS and c["token"].strip()[:1] in (".", "!", "?"):
                p *= math.exp(delta)                   # a big bonus would never let a sentence end
            opts.append((p, c))
        if not opts:
            out += b" "
            continue
        r, pick = rng.random() * sum(o[0] for o in opts), opts[-1][1]
        for p, c in opts:
            r -= p
            if r <= 0:
                pick = c
                break
        out += bytes(pick["bytes"])
    return out.decode("utf-8", "ignore").strip()


def share(text):
    w = WORD.findall(text)
    g = sum(hash_(KEY, cut(a) if i else "", cut(b)) for i, (a, b) in enumerate(zip([""] + w, w)))
    return len(w), g


def task(sys_prompt, text):
    return ollama(chat(text, sys_prompt), 1400, .3)["response"].strip()


data = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
def save():
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))


for name, (label, thema, seed) in STILE.items():
    data.setdefault(name, {"label": label, "bonus": {}})
for delta in BONI:
    for name, (label, thema, seed) in STILE.items():
        b = data[name]["bonus"]
        if str(delta) not in b:
            t0 = time.time()
            b[str(delta)] = write(thema, delta, seed + int(os.environ.get("WZ_SEED", 0)))
            save()
            n, g = share(b[str(delta)])
            print(f"{name} bonus {delta}: {n} words, {100 * g / n:.0f} % green, {time.time() - t0:.0f} s", flush=True)
        if delta == 2 and "um" not in data[name]:
            data[name]["um"] = task("Du bist Lektor. Gib nur den fertigen Text aus.", "Formuliere diesen Text mit eigenen Worten um, der Inhalt bleibt gleich:\n\n" + b["2"])
            t, trips = b["2"], []
            for _ in range(3):
                en = task("You are a translator. Output only the translation.", "Translate into English:\n\n" + t)
                t = task("Du bist Übersetzer. Gib nur die Übersetzung aus.", "Übersetze ins Deutsche:\n\n" + en)
                trips.append(t)
            data[name]["trips"] = trips
            save()
            print(name, "attacks:", [f"{100 * share(x)[1] / max(share(x)[0], 1):.0f} %" for x in [data[name]["um"]] + trips], flush=True)
print("fertig", flush=True)
