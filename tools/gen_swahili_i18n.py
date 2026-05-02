#!/usr/bin/env python3
"""Extract EN i18n block, translate unique string values to Swahili, emit sw block."""
import json
import os
import re
import time

from deep_translator import GoogleTranslator

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "HTML", "js", "i18n.js")
CACHE = os.path.join(ROOT, "tools", "sw_translation_cache.json")
OUT = os.path.join(ROOT, "tools", "i18n_sw_block_fragment.txt")

MARK0, MARK1 = "\ufdd0", "\ufdd1"
# Keys: "value" in i18n (capture group handles \" and \\)
LINE_RE = re.compile(
    r'^(\s+)([a-zA-Z0-9_]+):\s*"((?:\\.|[^"\\])*)"(,?)\s*$', re.MULTILINE
)


def protect(s: str):
    slots = []

    def repl(m):
        slots.append(m.group(0))
        return f"{MARK0}{len(slots) - 1}{MARK1}"

    return re.sub(r"\{[a-zA-Z0-9_]+\}", repl, s), slots


def unprotect(s: str, slots: list) -> str:
    for i, ph in enumerate(slots):
        s = s.replace(f"{MARK0}{i}{MARK1}", ph)
    return s


def js_unescape(s: str) -> str:
    """Turn JS string escapes in capture into text for translation."""
    return (
        s.replace("\\\\", "\xff")
        .replace('\\"', '"')
        .replace("\\n", "\n")
        .replace("\xff", "\\")
    )


def translate_val(translator, cache: dict, raw: str) -> str:
    if raw in cache:
        return cache[raw]
    # Decode minimal escapes for translator
    try:
        inner = js_unescape(raw.replace("\\\n", "\n"))
    except Exception:
        inner = raw
    prot, slots = protect(inner)
    if not prot.strip():
        cache[raw] = raw
        return raw
    # Skip likely-non-text tokens
    if re.fullmatch(r"[\d\s·\-\+\=\/\.,↑↓⌘%:]+", prot):
        cache[raw] = raw
        return raw
    try:
        time.sleep(0.035)
        out = translator.translate(prot)
        out = unprotect(out, slots)
    except Exception as e:
        print("fail", repr(inner[:60]), e)
        out = inner
    cache[raw] = out.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
    return cache[raw]


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    m = re.search(
        r"(        en: \{)(\n.*?)(\n        \},\n        es: \{)", text, re.DOTALL
    )
    if not m:
        raise SystemExit("en block not found")
    body = m.group(2)

    cache = {}
    if os.path.exists(CACHE):
        with open(CACHE, encoding="utf-8") as f:
            cache = json.load(f)

    translator = GoogleTranslator(source="en", target="sw")

    # Unique values in first-seen order
    seen = set()
    unique = []
    for mm in LINE_RE.finditer(body):
        raw_val = mm.group(3)
        if raw_val not in seen:
            seen.add(raw_val)
            unique.append(raw_val)

    print(len(unique), "unique strings")
    for i, raw in enumerate(unique):
        translate_val(translator, cache, raw)
        if (i + 1) % 40 == 0:
            with open(CACHE, "w", encoding="utf-8") as cf:
                json.dump(cache, cf, ensure_ascii=False, indent=1)

    with open(CACHE, "w", encoding="utf-8") as cf:
        json.dump(cache, cf, ensure_ascii=False, indent=1)

    # Rebuild body with Swahili values
    def esc_js(t: str) -> str:
        return t.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

    def sub_line(match):
        indent, key, raw_val, comma = (
            match.group(1),
            match.group(2),
            match.group(3),
            match.group(4),
        )
        new_raw = cache.get(raw_val, raw_val)
        return f'{indent}{key}: "{new_raw}"{comma}'

    new_body = LINE_RE.sub(sub_line, body)
    fragment = new_body  # already includes leading newline + full inner of en

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(fragment)

    print("Wrote", OUT, "lines:", fragment.count("\n"))


if __name__ == "__main__":
    main()
