#!/usr/bin/env python3
"""Read or set the Material field of one SVP week directly in Supabase (svp_plan_edits).

    python3 tools/svp-material.py get  /svp/informatik/fos12.html 7
    python3 tools/svp-material.py set  /svp/informatik/fos12.html 7 "Label https://url «Beschreibung»"
    python3 tools/svp-material.py add  /svp/informatik/fos12.html 7 "Label https://url «Beschreibung»"

Week index = 0-based row index of PLAN (holiday rows count). `set` replaces the
field, `add` appends one entry. Writes go through the Supabase Management API with
the CLI token in ~/.supabase/access-token (never stored here) and bump `ts`, so open
browsers pull the cloud state instead of overwriting it.
"""
import json, os, sys, urllib.request

PROJECT = "fyfhxzyymmurlaenmzse"
ANON = "sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk"      # public read key, RLS select only
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
      "(KHTML, like Gecko) Version/17.0 Safari/605.1.15")


def read(page):
    url = (f"https://{PROJECT}.supabase.co/rest/v1/svp_plan_edits?page=eq."
           + urllib.request.quote(page, safe="") + "&select=ts,edits")
    req = urllib.request.Request(url, headers={"apikey": ANON, "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        rows = json.load(r)
    if not rows:
        sys.exit("keine Zeile fuer " + page)
    return rows[0]


def sql(query):
    tok = open(os.path.expanduser("~/.supabase/access-token")).read().strip()
    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{PROJECT}/database/query",
        data=json.dumps({"query": query}).encode(),
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json",
                 "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def q(s):
    return "'" + s.replace("'", "''") + "'"


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    cmd, page, idx = sys.argv[1], sys.argv[2], sys.argv[3]
    row = read(page)
    week = row["edits"].get(idx)
    if week is None:
        sys.exit(f"Index {idx} gibt es auf {page} nicht")
    old = (week.get("material") or "").strip()
    print(f"Woche {week.get('nr', '?')} · {week.get('topic', week.get('ferien', ''))}")
    print("bisher:", old or "(leer)")
    if cmd == "get":
        return
    new = sys.argv[4].strip()
    if cmd == "add":
        new = (old + " " + new).strip() if old else new
    elif cmd != "set":
        sys.exit("Befehl: get | set | add")
    res = sql("update svp_plan_edits set edits = jsonb_set(edits, '{%s,material}', to_jsonb(%s::text)), "
              "ts = now() where page = %s returning ts, edits->'%s'->>'material' as material"
              % (idx, q(new), q(page), idx))
    print("jetzt: ", res[0]["material"] if res else res)
    print("ts:    ", res[0]["ts"] if res else "-")


if __name__ == "__main__":
    main()
