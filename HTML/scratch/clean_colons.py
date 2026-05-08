import re
import os

PATH = 'js/branding/i18n-descriptions_debug.js'

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

def remove_colons_in_text(match):
    text = match.group(0)
    # Entferne alle Doppelpunkte innerhalb des Backtick-Strings
    return text.replace(':', '')

# Wir suchen alles zwischen Backticks (inklusive der Backticks selbst)
# und wenden die Ersetzung nur darauf an.
new_content = re.sub(r'`[\s\S]*?`', remove_colons_in_text, content)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Alle Doppelpunkte innerhalb der pädagogischen Texte wurden entfernt.")
