#!/usr/bin/env python3
"""Split i18n.js into core + per-language files, then update all HTML files."""

import os
import re
import glob
import shutil

BASE     = os.path.join(os.path.dirname(__file__), '..', 'HTML', 'js')
SRC      = os.path.join(BASE, 'i18n.js')
HTML_DIR = os.path.join(os.path.dirname(__file__), '..', 'HTML')

LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'pt', 'sw', 'tr']

# ── 1. Read source ────────────────────────────────────────────────────────────
with open(SRC, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Read {len(lines)} lines from i18n.js")

# ── 2. Find true end of CyberI18n object via brace depth ─────────────────────
#    Start counting from the `const CyberI18n = {` line.
cyberi18n_open = next(i for i, l in enumerate(lines) if 'const CyberI18n = {' in l)

depth = 0
cyberi18n_close = None
for i in range(cyberi18n_open, len(lines)):
    depth += lines[i].count('{') - lines[i].count('}')
    if i > cyberi18n_open and depth == 0:
        cyberi18n_close = i
        break

assert cyberi18n_close, "Could not find closing of CyberI18n object"

# ── 3. Locate language block boundaries (brace-depth tracking) ────────────────
lang_starts = {}
lang_ends   = {}

for i, line in enumerate(lines):
    stripped = line.strip()
    for lang in LANGUAGES:
        if lang not in lang_starts and re.match(rf'^{lang}\s*:\s*\{{', stripped):
            lang_starts[lang] = i

for lang in LANGUAGES:
    start = lang_starts[lang]
    depth = 0
    for i in range(start, len(lines)):
        depth += lines[i].count('{') - lines[i].count('}')
        if i > start and depth == 0:
            lang_ends[lang] = i
            break

# Where `translations: {` is
trans_line  = next(i for i, l in enumerate(lines) if 'translations: {' in l)
# Line that closes the translations object (one after last language ends)
trans_close = lang_ends['tr'] + 1
# nl block starts after the CyberI18n `};`
nl_start    = cyberi18n_close + 1

print("Boundaries (1-indexed lines):")
for lang in LANGUAGES:
    print(f"  {lang}: {lang_starts[lang]+1} – {lang_ends[lang]+1}")
print(f"  translations block: {trans_line+1} … {trans_close+1}")
print(f"  CyberI18n closes:   line {cyberi18n_close+1}  → '{lines[cyberi18n_close].rstrip()}'")
print(f"  nl block:           lines {nl_start+1} – {len(lines)}")

# ── 4. Backup original ────────────────────────────────────────────────────────
backup = SRC + '.bak'
shutil.copy2(SRC, backup)
print(f"\nBackup: i18n.js.bak")

# ── 5. Write core i18n.js ─────────────────────────────────────────────────────
core  = []
core += [
    '/**\n',
    ' * CYBER-LABOR GLOBAL i18n DICTIONARY — CORE\n',
    ' * Languages: DE, EN, ES, FR, IT, PT, NL, SW, TR\n',
    ' * Translations are in separate files loaded after this one:\n',
    ' *   i18n-de.js  i18n-en.js  i18n-es.js  i18n-fr.js  i18n-it.js\n',
    ' *   i18n-pt.js  i18n-sw.js  i18n-tr.js  i18n-nl.js\n',
    ' * i18n-nl.js calls resolveLanguageFromEnvironment() at the end.\n',
    ' */\n',
    '\n',
    'const CyberI18n = {\n',
    "    current: 'de',\n",
    '\n',
    '    translations: {},\n',
    '\n',
]
# methods: everything between translations close and CyberI18n close (inclusive)
core += lines[trans_close + 1 : cyberi18n_close + 1]

with open(SRC, 'w', encoding='utf-8') as f:
    f.writelines(core)
print(f"Written: i18n.js          ({len(core)} lines)")

# ── 6. Write per-language files ───────────────────────────────────────────────
for lang in LANGUAGES:
    start = lang_starts[lang]
    end   = lang_ends[lang]

    first = re.sub(
        rf'^\s*{lang}\s*:\s*\{{',
        f'CyberI18n.translations.{lang} = {{',
        lines[start]
    )
    body = [first] + lines[start + 1 : end] + ['};']

    path = os.path.join(BASE, f'i18n-{lang}.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(body)
    print(f"Written: i18n-{lang}.js       ({len(body)} lines)")

# ── 7. Write i18n-nl.js ───────────────────────────────────────────────────────
nl_lines = lines[nl_start:]
with open(os.path.join(BASE, 'i18n-nl.js'), 'w', encoding='utf-8') as f:
    f.writelines(nl_lines)
print(f"Written: i18n-nl.js       ({len(nl_lines)} lines)")

# ── 8. Update HTML files ──────────────────────────────────────────────────────
OLD = '<script src="js/i18n.js"></script>'
NEW = (
    '<script src="js/i18n.js"></script>\n'
    '    <script src="js/i18n-de.js"></script>\n'
    '    <script src="js/i18n-en.js"></script>\n'
    '    <script src="js/i18n-es.js"></script>\n'
    '    <script src="js/i18n-fr.js"></script>\n'
    '    <script src="js/i18n-it.js"></script>\n'
    '    <script src="js/i18n-pt.js"></script>\n'
    '    <script src="js/i18n-sw.js"></script>\n'
    '    <script src="js/i18n-tr.js"></script>\n'
    '    <script src="js/i18n-nl.js"></script>'
)

updated = 0
for path in sorted(glob.glob(os.path.join(HTML_DIR, '*.html'))):
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()
    if OLD not in src:
        continue
    with open(path, 'w', encoding='utf-8') as f:
        f.write(src.replace(OLD, NEW))
    updated += 1
    print(f"  HTML: {os.path.basename(path)}")

print(f"\nUpdated {updated} HTML files.")
print("Done — open a lab in the browser to verify.")
