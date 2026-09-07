#!/usr/bin/env python3
"""Hang every generated Textaufgaben sheet into its plan week (svp_plan_edits, Material field).

    python3 tools/aufgaben/link-sheets.py            # dry run: shows what would be added
    python3 tools/aufgaben/link-sheets.py --write    # writes, one SQL update per week

Deck -> week comes from tools/aufgaben/mathe11-wochen.json (idx = 0-based row of the plan in
the database, which is shifted by one week against the static HTML - always this file, never the
HTML row). A sheet is linked once: weeks that already carry its URL are skipped. The pill label
is "3 Textaufgaben" - svp-plan.js puts it into the "Aufgaben" dropdown next to the week quiz.
"""
import json
import os
import sys
import time
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..")
PAGE = "/svp/mathe/mathe11.html"
LABEL = "3 Textaufgaben"
DESC = "Je eine Textaufgabe für die Anforderungsbereiche I, II und III, mit Lösungen zum Aufklappen."

spec = importlib.util.spec_from_file_location("svm", os.path.join(ROOT, "tools", "svp-material.py"))
svm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(svm)


def sql_retry(query, tries=5):
    for i in range(tries):
        try:
            return svm.sql(query)
        except Exception as e:      # DNS hiccups happen (seen 07.09.2026)
            print("  retry", i + 1, type(e).__name__)
            time.sleep(3)
    sys.exit("aufgegeben")


def main():
    write = "--write" in sys.argv
    wochen = json.load(open(os.path.join(HERE, "mathe11-wochen.json"), encoding="utf-8"))
    edits = svm.read(PAGE)["edits"]
    todo, skipped, missing = [], [], []
    for deck, w in sorted(wochen.items()):
        html = os.path.join(ROOT, "HTML", "aufgaben", deck + "-textaufgaben.html")
        if not os.path.exists(html):
            missing.append(deck)
            continue
        url = "https://docalvers.de/aufgaben/%s-textaufgaben.html" % deck
        week = edits.get(str(w["idx"])) or {}
        mat = (week.get("material") or "").strip()
        if url in mat:
            skipped.append(deck)
            continue
        entry = "%s %s «%s»" % (LABEL, url, DESC)
        todo.append((str(w["idx"]), w.get("nr"), deck, (mat + " " + entry).strip()))
    print("schon verlinkt: %d, ohne Blatt: %d, einzuhaengen: %d" % (len(skipped), len(missing), len(todo)))
    for d in missing:
        print("  kein Blatt:", d)
    for idx, nr, deck, _ in todo:
        print("  Woche %s (idx %s): %s" % (nr, idx, deck))
    if not write or not todo:
        return
    for idx, nr, deck, new in todo:
        res = sql_retry("update svp_plan_edits set edits = jsonb_set(edits, '{%s,material}', to_jsonb(%s::text)), "
                        "ts = now() where page = %s returning edits->'%s'->>'material' as material"
                        % (idx, svm.q(new), svm.q(PAGE), idx))
        assert res and deck in res[0]["material"], deck
    edits = svm.read(PAGE)["edits"]
    n = sum((w.get("material") or "").count("docalvers.de/aufgaben/") for w in edits.values() if isinstance(w, dict))
    print("geschrieben: %d, Blatt-Links im Plan jetzt: %d" % (len(todo), n))


if __name__ == "__main__":
    main()
