#!/usr/bin/env python3
"""The invisible label that says which design a .pptx carries.

Written as an OOXML custom document property, so it survives renaming, moving
and normal editing in PowerPoint. That is what makes `restyle.py --scan` work
without anybody keeping a list of decks.
"""
import re
import shutil
import tempfile
import zipfile
from xml.sax.saxutils import escape

CUSTOM_PART = "docProps/custom.xml"
CUSTOM_CT = "application/vnd.openxmlformats-officedocument.custom-properties+xml"
CUSTOM_RT = ("http://schemas.openxmlformats.org/officeDocument/2006/"
             "relationships/custom-properties")
NS_CUSTOM = ("http://schemas.openxmlformats.org/officeDocument/2006/"
             "custom-properties")
NS_VT = "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"

PROP_TEMPLATE = "DesignTemplate"
PROP_VERSION = "DesignVersion"
PROP_BUILT = "DesignBuilt"


def _props_xml(props):
    """Serialise {name: value} as a custom-properties part (pid starts at 2)."""
    body = "".join(
        f'<property fmtid="{{D5CDD505-2E9C-101B-9397-08002B2CF9AE}}" '
        f'pid="{i + 2}" name="{escape(name)}">'
        f'<vt:lpwstr>{escape(str(value))}</vt:lpwstr></property>'
        for i, (name, value) in enumerate(props.items()))
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
            f'<Properties xmlns="{NS_CUSTOM}" xmlns:vt="{NS_VT}">{body}</Properties>')


def read_stamp(pptx_path):
    """Return the design properties of a .pptx, or {} when it carries none."""
    try:
        with zipfile.ZipFile(pptx_path) as z:
            xml = z.read(CUSTOM_PART).decode("utf-8", "replace")
    except (KeyError, zipfile.BadZipFile, OSError):
        return {}
    found = {}
    for name, value in re.findall(
            r'name="([^"]+)"[^>]*>\s*<vt:lpwstr>([^<]*)</vt:lpwstr>', xml):
        found[name] = value
    return {k: v for k, v in found.items() if k.startswith("Design")}


def write_stamp(pptx_path, template, version, built=""):
    """Add or replace the design properties, keeping every other part byte-identical."""
    props = {PROP_TEMPLATE: template, PROP_VERSION: str(version)}
    if built:
        props[PROP_BUILT] = built
    new_part = _props_xml(props).encode("utf-8")

    with zipfile.ZipFile(pptx_path) as z:
        names = z.namelist()
        items = [(i, z.read(i.filename)) for i in z.infolist()]

    types = next(b for i, b in items if i.filename == "[Content_Types].xml").decode()
    if CUSTOM_PART not in types:
        types = types.replace("</Types>",
                              f'<Override PartName="/{CUSTOM_PART}" ContentType="{CUSTOM_CT}"/></Types>')
    root_rels = next(b for i, b in items if i.filename == "_rels/.rels").decode()
    # targets in _rels/.rels are relative to the package root - the part is in docProps/
    if f'Target="{CUSTOM_PART}"' not in root_rels:
        root_rels = re.sub(r'<Relationship[^>]*Type="' + re.escape(CUSTOM_RT) + r'"[^>]*/>', "", root_rels)
        used = [int(n) for n in re.findall(r'Id="rId(\d+)"', root_rels)] or [0]
        root_rels = root_rels.replace(
            "</Relationships>",
            f'<Relationship Id="rId{max(used) + 1}" Type="{CUSTOM_RT}" '
            f'Target="{CUSTOM_PART}"/></Relationships>')

    tmp = tempfile.NamedTemporaryFile(suffix=".pptx", delete=False)
    tmp.close()
    with zipfile.ZipFile(tmp.name, "w", zipfile.ZIP_DEFLATED) as out:
        for info, blob in items:
            if info.filename == CUSTOM_PART:
                continue                                   # replaced below
            if info.filename == "[Content_Types].xml":
                blob = types.encode()
            elif info.filename == "_rels/.rels":
                blob = root_rels.encode()
            out.writestr(info, blob)
        out.writestr(CUSTOM_PART, new_part)
    shutil.move(tmp.name, pptx_path)
    return props


if __name__ == "__main__":
    import sys
    for path in sys.argv[1:]:
        print(path, read_stamp(path) or "- kein Design-Stempel -")
