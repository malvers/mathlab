#!/usr/bin/env python3
"""wrap.py - builds a chapter of an English edition from its translated content.

    python3 tools/buch-en/wrap.py <book> <chapter> <translated.html> [--out DIR] [--lang es]

<book> is the German book (mathe11), the chapter goes to HTML/buch/<book>-en/<chapter>.html (or DIR).
<translated.html> is either the whole <body …> … </html> or only what is inside <main class="b-main"> up to and with
</footer> - then the header and the scripts come from the German chapter, with the words of the header in English.
Title and description of the page come from HTML/buch/<book>-en/kapitel.js (title, short, and the chapter's k, lb,
title, sub). js/buch-en.js goes right before js/buch.js and every widget module gets its dictionary js/buch-en/<module>.js
right after it (an empty one is made if there is none yet). At the end the tag skeleton is compared with the German
chapter: the same tags and the same structural attributes, only <b> and the like of the translation may differ.
After that: node tools/buch-en/check.mjs <book>-en, and in the browser node tools/buch-en/encheck.mjs <book>-en --poke.
--lang es (package ES0, 12.10.2026): the same for a Spanish edition - HTML/buch/<book>-es/, js/buch-es.js and
js/buch-es/<module>.js, header and title in Spanish. Without --lang everything is English as before.
--lang it (package IT0, 18.10.2026): the same for an Italian edition - HTML/buch/<book>-it/, js/buch-it.js and
js/buch-it/<module>.js, header and title in Italian.
"""
import sys, os, re, json, subprocess, html.parser, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.normpath(os.path.join(HERE, '..', '..', 'HTML'))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
out_dir = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else None
if out_dir: args.remove(out_dir)
LANG = sys.argv[sys.argv.index('--lang') + 1] if '--lang' in sys.argv else 'en'
if '--lang' in sys.argv: args.remove(LANG)
assert LANG in ('en', 'es', 'it'), 'unknown language ' + LANG
book, name, src = args
name = name[:-5] if name.endswith('.html') else name
DE_DIR = os.path.join(HTML, 'buch', book)
EN_DIR = os.path.join(HTML, 'buch', book + '-' + LANG)
# the words of the header and of the page title, per language
WORDS = {
    'en': {'Kapitel': 'Chapter', 'Inhalt des Kapitels': 'Contents of the chapter', 'CHAPTER': 'CHAPTER %s · ',
           'title': '%s · Chapter %s · %s | Doc Alvers Mathe-Labor',
           'desc': '%s. Chapter %s of the interactive textbook %s: explanations, examples, exercises at three levels, self-checks and labs to try out.',
           'langname': 'English'},
    'es': {'Kapitel': 'Capítulo', 'Inhalt des Kapitels': 'Contenido del capítulo', 'CHAPTER': 'CAPÍTULO %s · ',
           'title': '%s · Capítulo %s · %s | Doc Alvers Mathe-Labor',
           'desc': '%s. Capítulo %s del libro de texto interactivo %s: explicaciones, ejemplos, ejercicios en tres niveles, autoevaluaciones y laboratorios para experimentar.',
           'langname': 'Spanish'},
    'it': {'Kapitel': 'Capitolo', 'Inhalt des Kapitels': 'Contenuto del capitolo', 'CHAPTER': 'CAPITOLO %s · ',
           'title': '%s · Capitolo %s · %s | Doc Alvers Mathe-Labor',
           'desc': '%s. Capitolo %s del libro di testo interattivo %s: spiegazioni, esempi, esercizi su tre livelli, autoverifiche e laboratori da provare.',
           'langname': 'Italian'},
}[LANG]


def kapitel(d):
    js = subprocess.run(['node', '-e', "global.window={};require(" + json.dumps(os.path.join(d, 'kapitel.js')) + ");console.log(JSON.stringify(window.BUCH))"],
                        capture_output=True, text=True, check=True).stdout
    return json.loads(js)


B = kapitel(EN_DIR)
c = next(c for c in B['chapters'] if c['file'] == name + '.html')
de = open(os.path.join(DE_DIR, name + '.html'), encoding='utf-8').read()
body = open(src, encoding='utf-8').read()

if not body.lstrip().startswith('<body'):
    # only the main content was translated: header and scripts from the German chapter, the header words in English
    dbody = de[de.index('<body'):]
    a = dbody.index('<main class="b-main">') + len('<main class="b-main">')
    b = dbody.index('</footer>') + len('</footer>')
    pre, post = dbody[:a], dbody[b:]
    pre = re.sub(r'(<span class="b-top-book">)[^<]*(</span>)', lambda m: m.group(1) + B['title'].upper() + m.group(2), pre)
    pre = pre.replace('aria-label="Kapitel"', 'aria-label="%s"' % WORDS['Kapitel']).replace('aria-label="Inhalt des Kapitels"', 'aria-label="%s"' % WORDS['Inhalt des Kapitels'])
    # "KAPITEL 3.2 · LERNBEREICH 3" → "CHAPTER 3.2 · LEARNING AREA 3", "WAHLBEREICH 3" → "ELECTIVE 3"
    pre = re.sub(r'(<p class="b-toc-title">)([^<]*)(</p>)',
                 lambda m: m.group(1) + ((WORDS['CHAPTER'] % c['k']) if m.group(2).startswith('KAPITEL') else '') + c['lb'].upper() + m.group(3), pre)
    left = re.findall(r'KAPITEL|LERNBEREICH|WAHLBEREICH|WAHLPFLICHT', pre)
    assert not left, 'German left in the header: ' + ', '.join(sorted(set(left)))
    body = pre + '\n\n' + body.strip('\n') + '\n' + post

head = de[:de.index('<body')]
head = head.replace('<html lang="de">', '<html lang="%s">' % LANG)
head = re.sub(r'[ \t]*<!-- OG:BEGIN[\s\S]*?<!-- OG:END -->\n', '', head)
title = WORDS['title'] % (B['short'], c['k'], c['title'])
desc = WORDS['desc'] % (c['sub'], c['k'], B['title'])
head = re.sub(r'<title>[\s\S]*?</title>', '<title>' + title + '</title>\n    <meta name="description" content="' + desc.replace('"', '&quot;') + '">', head)

# scripts: the engine before js/buch.js, each widget module followed by its dictionary
if 'buch-%s.js' % LANG not in body:
    body = body.replace('<script src="../../js/buch.js"></script>', '<script src="../../js/buch-%s.js"></script>\n<script src="../../js/buch.js"></script>' % LANG)
made = []
def dictionary(m):
    mod = m.group(1)
    src_js = os.path.join(HTML, 'js', 'buch-%s.js' % mod)
    if mod in ('en', 'es', 'it', 'druck') or not os.path.exists(src_js) or not re.search(r"^[ \t]*W\('", open(src_js, encoding='utf-8').read(), re.M):
        return m.group(0)
    f = os.path.join(HTML, 'js', 'buch-' + LANG, mod + '.js')
    if not os.path.exists(f) and LANG == 'es':
        os.makedirs(os.path.dirname(f), exist_ok=True)
        open(f, 'w', encoding='utf-8').write(
            "/* js/buch-es/%s.js — Spanish for the widgets of js/buch-%s.js.\n"
            " * Loaded by the Spanish editions right after js/buch-%s.js; the engine and the shared words are in js/buch-es.js.\n"
            " *   word    a whole label → its Spanish\n"
            " *   phrase  German sentence pieces exactly as the widget source writes them → Spanish\n"
            " *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)\n"
            " * Numbers keep their German form (0,5 · 10.000 · 30 %%); never write a rule that can match digits around a comma or a\n"
            " * point without German words around them - SVG coordinates are written \"x,y\" (tools/buch-es/auftrag.md, section 5).\n"
            " * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es\n"
            " */\n"
            "window.BuchES && BuchES.add('%s', {\n    word: {\n    },\n    phrase: [\n    ],\n    rule: []\n});\n" % (mod, mod, mod, mod))
        made.append(f)
    if not os.path.exists(f) and LANG == 'it':
        os.makedirs(os.path.dirname(f), exist_ok=True)
        open(f, 'w', encoding='utf-8').write(
            "/* js/buch-it/%s.js — Italian for the widgets of js/buch-%s.js.\n"
            " * Loaded by the Italian editions right after js/buch-%s.js; the engine and the shared words are in js/buch-it.js.\n"
            " *   word    a whole label → its Italian\n"
            " *   phrase  German sentence pieces exactly as the widget source writes them → Italian\n"
            " *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)\n"
            " * Numbers keep their German form (0,5 · 10.000 · 30 %%); never write a rule that can match digits around a comma or a\n"
            " * point without German words around them - SVG coordinates are written \"x,y\" (tools/buch-es/auftrag.md, section 5).\n"
            " * After changing a German widget sentence: node tools/buch-en/check.mjs --lang it\n"
            " */\n"
            "window.BuchIT && BuchIT.add('%s', {\n    word: {\n    },\n    phrase: [\n    ],\n    rule: []\n});\n" % (mod, mod, mod, mod))
        made.append(f)
    if not os.path.exists(f):
        open(f, 'w', encoding='utf-8').write(
            "/* js/buch-en/%s.js — English for the widgets of js/buch-%s.js.\n"
            " * Loaded by the English editions right after js/buch-%s.js; the engine and the shared words are in js/buch-en.js.\n"
            " *   word    a whole label → its English\n"
            " *   phrase  German sentence pieces exactly as the widget source writes them → English\n"
            " *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)\n"
            " * After changing a German widget sentence: node tools/buch-en/check.mjs\n"
            " */\n"
            "window.BuchEN && BuchEN.add('%s', {\n    word: {\n    },\n    phrase: [\n    ],\n    rule: []\n});\n" % (mod, mod, mod, mod))
        made.append(f)
    return m.group(0) + '\n<script src="../../js/buch-%s/%s.js"></script>' % (LANG, mod)
body = re.sub(r'<script src="\.\./\.\./js/buch-([a-z0-9-]+)\.js"></script>(?!\n<script src="\.\./\.\./js/buch-' + LANG + r'/)', dictionary, body)

out = head + body
target = os.path.join(out_dir or EN_DIR, name + '.html')
open(target, 'w', encoding='utf-8').write(out)
for f in made: print('new, still empty: ' + os.path.relpath(f, HTML))

# skeleton compare: tags and their structural attributes (text attributes and decimal commas in data-ans normalised)
TEXTATTR = {'title', 'aria-label', 'placeholder', 'alt', 'data-toc', 'data-toc-short', 'data-toc-k', 'data-ph', 'data-label', 'data-labels', 'data-aria', 'content', 'data-xl', 'data-yl', 'hreflang'}
class P(html.parser.HTMLParser):
    def __init__(s): super().__init__(); s.seq = []
    def handle_starttag(s, t, a):
        d = {k: (v or '') for k, v in a if k not in TEXTATTR}
        if 'data-ans' in d: d['data-ans'] = d['data-ans'].replace(',', '.')
        s.seq.append((t, tuple(sorted(d.items()))))
def skel(text):
    p = P(); p.feed(text[text.index('<body'):]); return [x for x in p.seq if not (x[0] == 'script' and 'buch-' + LANG in dict(x[1]).get('src', ''))]
a, b = skel(de), skel(out)
diff = [l for l in difflib.unified_diff([repr(x) for x in a], [repr(x) for x in b], lineterm='', n=0) if l[:1] in '+-' and not l.startswith(('+++', '---'))]
print(('%s: %d tags German, %d tags ' + WORDS['langname'] + ', %d differences → %s') % (name, len(a), len(b), len(diff), os.path.relpath(target, HTML) if not out_dir else target))
for l in diff[:40]: print('  ' + l[:220])
