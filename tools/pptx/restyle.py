#!/usr/bin/env python3
"""Find decks that carry a design - and pull a changed design through them.

    python3 restyle.py --scan ~/Desktop "~/Library/CloudStorage/OneDrive-.../UNTERRICHT"
    python3 restyle.py --apply deck.pptx --template out/informatik-vorlage.pptx

--scan reads only the tiny custom-properties part out of each .pptx, so it stays
fast even over hundreds of files. --apply swaps master, layouts, theme and the
design media; the slides themselves are untouched.
"""
import argparse
import datetime
import os
import re
import shutil
import sys
import tempfile
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stamp import read_stamp, write_stamp, PROP_TEMPLATE, PROP_VERSION  # noqa: E402

DESIGN_PREFIXES = ("ppt/slideMasters/", "ppt/slideLayouts/", "ppt/theme/")
MEDIA_RE = re.compile(r'Target="\.\./media/([^"]+)"')
CT_BY_EXT = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
             ".gif": "image/gif", ".svg": "image/svg+xml", ".emf": "image/x-emf"}


# ----------------------------------------------------------------- scanning --
def iter_pptx(roots):
    for root in roots:
        root = os.path.expanduser(root)
        if os.path.isfile(root):
            yield root
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if not d.startswith(".")]
            for name in filenames:
                if name.lower().endswith(".pptx") and not name.startswith("~$"):
                    yield os.path.join(dirpath, name)


def cmd_scan(args):
    hits, seen = [], 0
    for path in iter_pptx(args.scan):
        seen += 1
        stamp = read_stamp(path)
        if not stamp:
            continue
        if args.template_id and stamp.get(PROP_TEMPLATE) != args.template_id:
            continue
        hits.append((path, stamp))
    for path, stamp in sorted(hits, key=lambda h: h[0]):
        print(f"{stamp.get(PROP_TEMPLATE, '?'):18s} v{stamp.get(PROP_VERSION, '?'):3s} {path}")
    print(f"\n{len(hits)} von {seen} PPTX tragen einen Design-Stempel.")
    return 0


# ------------------------------------------------------------------ applying --
def _media_of(rels_blobs):
    """Media file names referenced by a set of .rels blobs."""
    found = set()
    for blob in rels_blobs:
        found.update(MEDIA_RE.findall(blob.decode("utf-8", "replace")))
    return found


def _read_design(template):
    """Design parts of the template plus the media they reference."""
    with zipfile.ZipFile(template) as z:
        parts = {n: z.read(n) for n in z.namelist()
                 if n.startswith(DESIGN_PREFIXES)}
        rels = [b for n, b in parts.items() if "/_rels/" in n]
        media = {}
        for name in _media_of(rels):
            src = "ppt/media/" + name
            if src in z.namelist():
                media[name] = z.read(src)
    return parts, media


def apply_design(deck, template, dry_run=False):
    design, media = _read_design(template)
    tpl_stamp = read_stamp(template)
    # design media get a prefix so they can never collide with a deck's own images
    renamed = {name: "design-" + name for name in media}

    with zipfile.ZipFile(deck) as z:
        entries = [(i, z.read(i.filename)) for i in z.infolist()]
    names = {i.filename for i, _ in entries}

    old_design_rels = [b for i, b in entries
                       if i.filename.startswith(DESIGN_PREFIXES) and "/_rels/" in i.filename]
    other_rels = [b for i, b in entries
                  if i.filename.endswith(".rels") and not i.filename.startswith(DESIGN_PREFIXES)]
    stale_media = {"ppt/media/" + n for n in _media_of(old_design_rels) - _media_of(other_rels)}

    # a slide must not end up pointing at a layout the new design does not have
    tpl_layouts = {n for n in design if re.match(r"ppt/slideLayouts/slideLayout\d+\.xml$", n)}
    for i, blob in entries:
        if not re.match(r"ppt/slides/_rels/slide\d+\.xml\.rels$", i.filename):
            continue
        for ref in re.findall(r'Target="\.\./slideLayouts/(slideLayout\d+\.xml)"',
                              blob.decode("utf-8", "replace")):
            if "ppt/slideLayouts/" + ref not in tpl_layouts:
                raise SystemExit(f"ABBRUCH: {os.path.basename(deck)} benutzt {ref}, "
                                 f"die Vorlage kennt sie nicht.")

    types = next(b for i, b in entries if i.filename == "[Content_Types].xml").decode()
    for part in sorted(design):
        if part.endswith(".rels"):
            continue
        if f'PartName="/{part}"' not in types:
            kind = ("slideMaster" if "slideMasters" in part else
                    "slideLayout" if "slideLayouts" in part else "theme")
            ct = (f"application/vnd.openxmlformats-officedocument.presentationml."
                  f"{kind}+xml") if kind != "theme" else \
                 "application/vnd.openxmlformats-officedocument.theme+xml"
            types = types.replace("</Types>", f'<Override PartName="/{part}" ContentType="{ct}"/></Types>')
    for new_name in renamed.values():
        ext = os.path.splitext(new_name)[1].lower()
        if f'Extension="{ext[1:]}"' not in types and ext in CT_BY_EXT:
            types = types.replace("<Types ", "<Types ", 1)
            types = types.replace("</Types>",
                                  f'<Default Extension="{ext[1:]}" ContentType="{CT_BY_EXT[ext]}"/></Types>')

    if dry_run:
        print(f"  wuerde ersetzen: {len(design)} Design-Teile, {len(media)} Bilder, "
              f"{len(stale_media)} alte Design-Bilder raus")
        return

    tmp = tempfile.NamedTemporaryFile(suffix=".pptx", delete=False)
    tmp.close()
    with zipfile.ZipFile(tmp.name, "w", zipfile.ZIP_DEFLATED) as out:
        for info, blob in entries:
            if info.filename.startswith(DESIGN_PREFIXES) or info.filename in stale_media:
                continue                                   # replaced or orphaned
            if info.filename == "[Content_Types].xml":
                blob = types.encode()
            out.writestr(info, blob)
        for part, blob in design.items():
            if part.endswith(".rels"):
                text = blob.decode("utf-8", "replace")
                for old, new in renamed.items():
                    text = text.replace(f'Target="../media/{old}"', f'Target="../media/{new}"')
                blob = text.encode()
            out.writestr(part, blob)
        for old, new in renamed.items():
            out.writestr("ppt/media/" + new, media[old])
    shutil.move(tmp.name, deck)
    write_stamp(deck, tpl_stamp.get(PROP_TEMPLATE, "?"), tpl_stamp.get(PROP_VERSION, "?"),
                datetime.date.today().isoformat())


def cmd_apply(args):
    if not args.template:
        raise SystemExit("--apply braucht --template")
    tpl_stamp = read_stamp(args.template)
    if not tpl_stamp:
        raise SystemExit("Die Vorlage hat keinen Design-Stempel - erst build_design.py laufen lassen.")
    print(f"Vorlage: {tpl_stamp.get(PROP_TEMPLATE)} v{tpl_stamp.get(PROP_VERSION)}\n")
    for deck in args.apply:
        deck = os.path.expanduser(deck)
        before = read_stamp(deck)
        print(f"{os.path.basename(deck)} (war v{before.get(PROP_VERSION, '-')})")
        if not args.dry_run and args.backup:
            shutil.copy2(deck, deck + ".bak")
        apply_design(deck, args.template, dry_run=args.dry_run)
        if not args.dry_run:
            print(f"  -> v{read_stamp(deck).get(PROP_VERSION)}"
                  + (f", Sicherung: {os.path.basename(deck)}.bak" if args.backup else ""))
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scan", nargs="+", metavar="PFAD",
                    help="Ordner/Dateien nach gestempelten Decks durchsuchen")
    ap.add_argument("--apply", nargs="+", metavar="DECK",
                    help="Design in diesen Decks nachziehen")
    ap.add_argument("--template", metavar="VORLAGE", help="Vorlage mit dem neuen Design")
    ap.add_argument("--template-id", metavar="ID", help="beim Scan auf diese Design-ID filtern")
    ap.add_argument("--dry-run", action="store_true", help="nur zeigen, nichts schreiben")
    ap.add_argument("--no-backup", dest="backup", action="store_false",
                    help="keine .bak-Sicherung anlegen")
    args = ap.parse_args()
    if args.scan:
        return cmd_scan(args)
    if args.apply:
        return cmd_apply(args)
    ap.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
