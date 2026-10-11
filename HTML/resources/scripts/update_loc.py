#!/usr/bin/env python3
"""Count lines of code and write HTML/resources/loc.js (window.__CURRENT_LOC) for the intro.

Sources:
  1. This repo: git-tracked files only (no build output, no untracked data dumps).
  2. All own projects in ~/IdeaProjects (DOCPAD, Finanzen/fixkosten, the Java projects, ...)
     except FOREIGN_PROJECTS, plus EXTRA_DIRS (private script/app folders; skipped if absent).
     Git folders count their tracked + untracked-not-ignored files, other folders are walked.

Counted: non-blank lines of real code extensions only (see CODE_EXTENSIONS) — no JSON/MD/TXT
data files, no third-party vendor/minified bundles, no caches; identical files count once.

Usage: python3 HTML/resources/scripts/update_loc.py   (any cwd; paths resolve from this file)
"""
import hashlib
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
VENDOR_PATH_PARTS = ('/vendor/', '.min.', '/libs/')
# Lines longer than this on average = minified / generated, not written by hand
MINIFIED_AVG_LINE = 250
# Skipped when walking extra folders
IGNORE_DIRS = {'.git', 'node_modules', '.venv', 'venv', '__pycache__', '.build', 'DerivedData', 'build', 'dist',
               '.idea', 'out', 'target', '.gradle', 'uv', 'uv-cache', 'uv-pythons', 'hf-cache'}
# Clones / forks of other people's code in ~/IdeaProjects
FOREIGN_PROJECTS = {'forloop', 'aiboard', 'excite2026', 'JavaPackagerTextArea', '_libraries'}
IDEA_PROJECTS = Path.home() / 'IdeaProjects'
# Private folders outside ~/IdeaProjects (Doc's machine); silently skipped elsewhere
EXTRA_DIRS = [
    Path.home() / 'pinkerfinder',
    Path.home() / 'pinker2',
    Path.home() / 'gopubmed',
    Path.home() / 'solita-voicelab',
    Path.home() / 'bin',
    Path.home() / '.claude' / 'hooks',
]


def code_lines(data):
    """Non-blank lines, or 0 for minified/generated files."""
    lines = [l for l in data.splitlines() if l.strip()]
    if not lines or sum(len(l) for l in lines) / len(lines) > MINIFIED_AVG_LINE:
        return 0
    return len(lines)


def is_vendor(rel_path):
    return any(part in rel_path for part in VENDOR_PATH_PARTS)


def git_files(base, untracked):
    """Files of a git work tree, as absolute paths (None if base is not a git root)."""
    top = subprocess.run(['git', '-C', str(base), 'rev-parse', '--show-toplevel'], capture_output=True, text=True)
    if top.returncode or Path(top.stdout.strip()).resolve() != base.resolve():
        return None
    args = ['git', '-C', str(base), 'ls-files', '-z'] + (['-co', '--exclude-standard'] if untracked else [])
    out = subprocess.run(args, capture_output=True, check=True).stdout
    return [base / raw.decode('utf-8', 'surrogateescape') for raw in out.split(b'\0') if raw]


def extra_files(base):
    files = git_files(base, untracked=True)
    if files is not None:
        yield from (p for p in files if not IGNORE_DIRS.intersection(p.relative_to(base).parts[:-1]))
        return
    for root, dirs, names in os.walk(base):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.') and not d.endswith('.app')]
        for fn in names:
            yield Path(root) / fn


def tally(paths, by_lang, by_source, source, seen):
    for p in paths:
        lang = CODE_EXTENSIONS.get(p.suffix.lower())
        if not lang or is_vendor('/' + p.as_posix()) or p.is_symlink() or not p.is_file():
            continue
        try:
            data = p.read_bytes()
        except OSError:
            continue
        digest = hashlib.sha1(data).digest()
        if digest in seen:
            continue
        seen.add(digest)
        n = code_lines(data)
        by_lang[lang] += n
        by_source[source] += n


def main():
    by_lang, by_source, seen = Counter(), Counter(), set()
    tally(git_files(REPO_ROOT, untracked=False), by_lang, by_source, 'repo', seen)
    dirs = []
    if IDEA_PROJECTS.is_dir():
        dirs += sorted(d for d in IDEA_PROJECTS.iterdir() if d.is_dir() and d.name not in FOREIGN_PROJECTS)
    dirs += [d for d in EXTRA_DIRS if d.is_dir()]
    for d in dirs:
        tally(extra_files(d), by_lang, by_source, '~/' + d.relative_to(Path.home()).as_posix(), seen)

    total = sum(by_lang.values())
    formatted = f'{total:,}'.replace(',', '.')  # 204.123 style

    for src, n in by_source.most_common():
        if n:
            print(f'{src:40} {n:>9,}')
    print('-' * 50)
    for lang, n in by_lang.most_common():
        print(f'{lang:40} {n:>9,}')
    print('=' * 50)
    print(f'{"TOTAL":40} {total:>9,}')

    OUTPUT_PATH.write_text(f'window.__CURRENT_LOC = "{formatted}";\n', encoding='utf-8')
    print(f'\nwritten: {OUTPUT_PATH.relative_to(REPO_ROOT)} -> {formatted}')


if __name__ == '__main__':
    main()
