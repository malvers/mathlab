import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_DIR = Path(__file__).resolve().parent
I18N_PATH = ROOT / "HTML/js/i18n.js"
TMP_JS = SCRIPT_DIR / "_parse_i18n_tmp.js"

with open(I18N_PATH, "r", encoding="utf-8") as f:
    text = f.read()

start = text.find("translations: {")
end = text.find("    get: function")
if start != -1 and end != -1:
    obj_text = text[start + 14 : end].strip()
    if obj_text.endswith(","):
        obj_text = obj_text[:-1]

    js_code = (
        "try { var obj = "
        + obj_text
        + "; console.log('OK'); } catch(e) { console.log('Err: ' + e); }"
    )
    TMP_JS.write_text(js_code, encoding="utf-8")

    tmp_abs = str(TMP_JS.resolve()).replace("\\", "\\\\").replace('"', '\\"')
    apple_js = (
        "eval(ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError("
        f'"{tmp_abs}", $.NSUTF8StringEncoding, null)))'
    )
    res = subprocess.run(
        ["osascript", "-l", "JavaScript", "-e", apple_js],
        capture_output=True,
        text=True,
    )
    print("osascript output:", res.stdout, res.stderr)
else:
    print("Not found")
