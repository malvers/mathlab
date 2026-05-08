import re
import os

PATH = 'js/branding/i18n-descriptions_debug.js'

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Wir suchen 'INTERFACE:' und alles danach, bis wir auf einen neuen Header 
# (GROSSBUCHSTABEN gefolgt von Doppelpunkt) oder das Ende des JavaScript-Strings (`,) stoßen.
# Wir achten darauf, auch die vorangehenden Zeilenumbrüche mitzunehmen.
pattern = r'\n+INTERFACE:[\s\S]*?(?=\n\n[A-Z ]+:|`,)'
new_content = re.sub(pattern, '', content)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Alle INTERFACE-Abschnitte wurden erfolgreich entfernt.")
