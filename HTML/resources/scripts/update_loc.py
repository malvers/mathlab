#!/usr/bin/env python3
"""Count lines of code and write HTML/resources/loc.js (window.__CURRENT_LOC) for the intro.

Sources:
  1. This repo: git-tracked files only (no build output, no untracked data dumps).
  2. EXTRA_DIRS: private script/app folders outside the repo (skipped if absent).

Counted: real code extensions only (see CODE_EXTENSIONS) — no JSON/MD/TXT data files,
no third-party vendor/minified bundles.

Usage: python3 HTML/resources/scripts/update_loc.py   (any cwd; paths resolve from this file)
"""
import os
import subprocess
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
OUTPUT_PATH = REPO_ROOT / 'HTML' / 'resources' / 'loc.js'

CODE_EXTENSIONS = {
    '.html': 'HTML', '.js': 'JavaScript', '.mjs': 'JavaScript', '.css': 'CSS',
    '.py': 'Python', '.ts': 'TypeScript', '.java': 'Java', '.kt': 'Kotlin',
    '.swift': 'Swift', '.sql': 'SQL', '.sh': 'Bash', '.command': 'Bash',
    '.gradle': 'Groovy', '.bat': 'Batch', '.glsl': 'GLSL', '.go': 'Go', '.rs': 'Rust',
}
# Third-party code that is not ours
VENDOR_PATH_PARTS = ('/vendor/', '.min.')
# Skipped when walking EXTRA_DIRS
IGNORE_DIRS = {'.git', 'node_modules', '.venv', 'venv', '__pycache__', '.build', 'DerivedData', 'build', 'dist', '.idea'}
# Private folders outside the repo (Doc's machine); silently skipped elsewhere
EXTRA_DIRS = [
    Path.home() / 'pinkerfinder',
    Path.home() / 'pinker2',
    Path.home() / 'gopubmed',
    Path.home() / '.claude' / 'hooks',
]


def count_lines(path):
    try:
        with open(path, 'rb') as f:
            data = f.read()
    except OSError:
        return 0
    if not data:
        return 0
    return data.count(b'\n') + (0 if data.endswith(b'\n') else 1)


def is_vendor(rel_path):
    return any(part in rel_path for part in VENDOR_PATH_PARTS)


def repo_files():
    """Git-tracked files of the repo, as absolute paths."""
    out = subprocess.run(['git', '-C', str(REPO_ROOT), 'ls-files', '-z'], capture_output=True, check=True).stdout
    for raw in out.split(b'\0'):
        if raw:
            yield REPO_ROOT / raw.decode('utf-8', 'surrogateescape')


def extra_files(base):
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]
        for fn in files:
            yield Path(root) / fn


def tally(paths, by_lang, by_source, source):
    for p in paths:
        lang = CODE_EXTENSIONS.get(p.suffix.lower())
        if not lang or is_vendor('/' + p.as_posix()):
            continue
        n = count_lines(p)
        by_lang[lang] += n
        by_source[source] += n


def main():
    by_lang, by_source = Counter(), Counter()
    tally(repo_files(), by_lang, by_source, 'repo')
    for d in EXTRA_DIRS:
        if d.is_dir():
            tally(extra_files(d), by_lang, by_source, '~/' + d.relative_to(Path.home()).as_posix())

    total = sum(by_lang.values())
    formatted = f'{total:,}'.replace(',', '.')  # 204.123 style

    for src, n in by_source.most_common():
        print(f'{src:22} {n:>9,}')
    print('-' * 32)
    for lang, n in by_lang.most_common():
        print(f'{lang:22} {n:>9,}')
    print('=' * 32)
    print(f'{"TOTAL":22} {total:>9,}')

    OUTPUT_PATH.write_text(f'window.__CURRENT_LOC = "{formatted}";\n', encoding='utf-8')
    print(f'\nwritten: {OUTPUT_PATH.relative_to(REPO_ROOT)} -> {formatted}')


if __name__ == '__main__':
    main()
