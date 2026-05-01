import re
import json
import ast

with open("HTML/js/i18n.js", "r", encoding="utf-8") as f:
    text = f.read()

start = text.find('translations: {')
end = text.find('    get: function')
if start != -1 and end != -1:
    obj_text = text[start+14:end].strip()
    if obj_text.endswith(','):
        obj_text = obj_text[:-1]
    
    # Try to parse it using ast if possible? No, ast is for Python.
    # We can run a QuickJS or py_mini_racer? Let's see if sqlite3 can run JS? No.
    # What about osascript again, but we properly escape it!
    import subprocess
    js_code = "try { var obj = " + obj_text + "; console.log('OK'); } catch(e) { console.log('Err: ' + e); }"
    with open("test.js", "w") as jf:
        jf.write(js_code)
    
    res = subprocess.run(['osascript', '-l', 'JavaScript', '-e', f'eval(ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError("test.js", $.NSUTF8StringEncoding, null)))'], capture_output=True, text=True)
    print("osascript output:", res.stdout, res.stderr)
else:
    print("Not found")