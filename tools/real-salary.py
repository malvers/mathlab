#!/usr/bin/env python3
"""The Real Salary: from Doc's PowerPoint onto the page HTML/the-real-salary.html.

The deck ("The real salary.pptx" in ~/PRIVAT MRA) collects letters, chats, survey results and
photos from school - children's faces and names, so none of it may enter this public repo.
This script cuts every picture out of the deck the way the slide shows it (crop and rotation
from the slide XML), writes web JPEGs - <id>.jpg (1800 px) and <id>-thumb.jpg (720 px) - and
content.json (one "moment" per slide: pictures, captions, text) into the private folder
~/PRIVAT MRA/Bewerbungen/real-salary-web. scripts/cv-docs.mjs then seals that folder with the
key of the CV documents, so a device that has opened the CV documents opens this page too.

    python3 tools/real-salary.py [deck.pptx]
    node scripts/cv-docs.mjs ~/"PRIVAT MRA/Bewerbungen/real-salary-web" HTML/resources/real-salary
    bash tools/real-salary-r2.sh          # live the page reads the sealed files from R2, not git

Per-slide settings live next to the output (real-salary-overrides.json, private as well),
keyed by a hash of the slide's content, so they survive slides being added or moved:
    { "<key>": { "kind": "worte" | "zahlen" | "bilder", "score": "9,65", "skip": true } }
A run prints every slide with its key. Picture ids are hashes of the cut picture, so an
unchanged picture keeps its file (no churn in the sealed output).
"""
import hashlib
import io
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path, PurePosixPath

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None

HOME = Path.home()
DECK = Path(sys.argv[1]) if len(sys.argv) > 1 else HOME / "PRIVAT MRA/The real salary.pptx"
OUT = HOME / "PRIVAT MRA/Bewerbungen/real-salary-web"
OVERRIDES = HOME / "PRIVAT MRA/Bewerbungen/real-salary-overrides.json"

FULL, THUMB = 1800, 720          # long edge of the full picture, width of the grid picture
Q_FULL, Q_THUMB = 82, 76
SHORT = 110                       # a paragraph up to this length is a caption, longer ones are text
RASTER = (".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff")

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
R_EMBED = "{%s}embed" % NS["r"]
R_ID = "{%s}id" % NS["r"]
SKIP_TEXT = re.compile(r"^(click to play sound.*|\d{1,3})$", re.I)


def rels(z, part):
    """relationship id -> target path inside the zip, for one part"""
    p = PurePosixPath(part)
    f = p.parent / "_rels" / (p.name + ".rels")
    out = {}
    for r in ET.fromstring(z.read(str(f))):
        t = r.get("Target")
        if r.get("TargetMode") == "External":
            continue
        out[r.get("Id")] = str(PurePosixPath(*_norm((p.parent / t).parts)))
    return out


def _norm(parts):
    out = []
    for s in parts:
        if s == "..":
            out.pop()
        elif s != ".":
            out.append(s)
    return out


def slide_parts(z):
    """slides in show order, hidden ones left out"""
    pres = ET.fromstring(z.read("ppt/presentation.xml"))
    rl = rels(z, "ppt/presentation.xml")
    parts = []
    for s in pres.find("p:sldIdLst", NS):
        part = rl[s.get(R_ID)]
        if ET.fromstring(z.read(part)).get("show") == "0":
            continue
        parts.append(part)
    return parts


def paragraphs(tx):
    """the paragraphs of one text body, line breaks kept"""
    out = []
    for p in tx.findall("a:p", NS):
        line = []
        for n in p:
            tag = n.tag.split("}")[1]
            if tag in ("r", "fld"):
                t = n.find("a:t", NS)
                line.append(t.text if t is not None and t.text else "")
            elif tag == "br":
                line.append("\n")
        out.append("".join(line).strip())
    return out


def walk(node, pics, texts):
    for ch in node:
        tag = ch.tag.split("}")[1]
        if tag == "grpSp":
            walk(ch, pics, texts)
        elif tag == "pic":
            nv = ch.find("p:nvPicPr/p:nvPr", NS)
            if nv is not None and nv.find("a:audioFile", NS) is not None:
                continue                      # the loudspeaker icon of a sound
            blip = ch.find(".//a:blip", NS)
            xf = ch.find("p:spPr/a:xfrm", NS)
            if blip is None or xf is None or xf.find("a:ext", NS) is None:
                continue
            ext, off = xf.find("a:ext", NS), xf.find("a:off", NS)
            sr = ch.find(".//a:srcRect", NS)
            pics.append({
                "rid": blip.get(R_EMBED),
                "crop": {k: int(sr.get(k, 0)) / 100000 for k in "ltrb"} if sr is not None else {},
                "rot": round(int(xf.get("rot", 0)) / 60000) % 360,
                "w": int(ext.get("cx")), "h": int(ext.get("cy")),
                "x": int(off.get("x")), "y": int(off.get("y")),
            })
        elif tag == "sp":
            ph = ch.find("p:nvSpPr/p:nvPr/p:ph", NS)
            if ph is not None and ph.get("type") in ("sldNum", "dt", "ftr"):
                continue
            tx = ch.find("p:txBody", NS)
            if tx is not None:
                texts.append([t for t in paragraphs(tx) if t and not SKIP_TEXT.match(t)])


def cut(raw, pic):
    """the picture as the slide shows it: orientation, crop, rotation"""
    im = Image.open(io.BytesIO(raw))
    im.load()
    want = pic["w"] / max(1, pic["h"])
    c = pic["crop"]

    def cropped(img):
        w, h = img.size
        box = (round(w * c.get("l", 0)), round(h * c.get("t", 0)),
               round(w * (1 - c.get("r", 0))), round(h * (1 - c.get("b", 0))))
        return img.crop(box) if c else img

    # PowerPoint may or may not have applied the EXIF orientation - take what fits the frame
    a, b = cropped(im), cropped(ImageOps.exif_transpose(im))
    ratio = lambda img: abs((img.width / max(1, img.height)) / want - 1)
    im = b if ratio(b) < ratio(a) else a
    if pic["rot"] in (90, 180, 270):
        im = im.rotate(-pic["rot"], expand=True)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    return im.convert("RGB")


def jpeg(im, q):
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    return buf.getvalue()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    over = json.loads(OVERRIDES.read_text()) if OVERRIDES.exists() else {}
    z = zipfile.ZipFile(DECK)
    moments, written, keep = [], 0, set()
    for n, part in enumerate(slide_parts(z), 1):
        root = ET.fromstring(z.read(part))
        rl = rels(z, part)
        pics, texts = [], []
        walk(root.find(".//p:spTree", NS), pics, texts)
        imgs, seen = [], set()
        for pic in pics:
            target = rl.get(pic["rid"], "")
            if not target.lower().endswith(RASTER):
                continue                      # emf, wdp: no web picture
            im = cut(z.read(target), pic)
            if min(im.size) < 48:
                continue                      # icons
            full = im.copy()
            full.thumbnail((FULL, FULL), Image.LANCZOS)
            data = jpeg(full, Q_FULL)
            pid = "p" + hashlib.sha1(data).hexdigest()[:10]
            if pid in seen:
                continue
            seen.add(pid)
            th = im.copy()
            th.thumbnail((THUMB, THUMB * 3), Image.LANCZOS)
            for name, blob in ((pid, data), (pid + "-thumb", jpeg(th, Q_THUMB))):
                f = OUT / (name + ".jpg")
                keep.add(f.name)
                if not f.exists() or f.read_bytes() != blob:
                    f.write_bytes(blob)
                    written += 1
            imgs.append({"id": pid, "w": full.width, "h": full.height,
                         "area": pic["w"] * pic["h"], "x": pic["x"], "y": pic["y"]})
        # the biggest picture leads, the others follow in reading order
        imgs.sort(key=lambda i: (round(i["y"] / 900000), i["x"]))
        if imgs:
            big = max(imgs, key=lambda i: i["area"])
            imgs.remove(big)
            imgs.insert(0, big)
        paras = [t for block in texts for t in block]
        cap = [t for t in paras if len(t) <= SHORT]
        body = [t for t in paras if len(t) > SHORT]
        key = hashlib.sha1(json.dumps([[i["id"] for i in imgs], paras], ensure_ascii=False)
                           .encode()).hexdigest()[:8]
        o = over.get(key, {})
        print(f"{n:3d}  {key}  {len(imgs):2d} Bilder  {(cap + body + [''])[0][:60]}")
        if o.get("skip"):
            continue
        m = {"n": n, "key": key, "kind": o.get("kind") or ("bilder" if imgs else "worte"),
             "imgs": [{k: i[k] for k in ("id", "w", "h")} for i in imgs], "cap": cap, "body": body}
        if o.get("score"):
            m["score"] = o["score"]
        moments.append(m)
    content = {"v": 1, "deck": DECK.name, "moments": moments}
    blob = json.dumps(content, ensure_ascii=False, indent=1).encode()
    f = OUT / "content.json"
    if not f.exists() or f.read_bytes() != blob:
        f.write_bytes(blob)
        written += 1
    keep.add(f.name)
    stale = sorted(p.name for p in OUT.iterdir() if p.name not in keep)
    print(f"{len(moments)} Momente, {sum(len(m['imgs']) for m in moments)} Bilder, {written} Dateien neu.")
    if stale:
        print("Ohne Folie (nicht gelöscht): " + ", ".join(stale))


if __name__ == "__main__":
    main()
