Is is going to be a math lab for kids and students. Up to now (8th of April 2026) all tools are entirely created by gemini. Also the web site itself and the link to my domain provider. The guy in two minute paper (YouTube) ends always with: "What a time to be alife!" in euphoric voice. In some aspects like AI is is right. Very much right! Why are there wars? We could be so insanely great if we would not fight! Damn.

## Commit Safety Guard

To prevent accidental mass deletions (especially in central CSS/HTML/JS files), this repo ships with a local pre-commit hook.

Install once:

```bash
./scripts/install-hooks.sh
```

What it blocks by default:
- too many deleted lines overall in staged `*.css`, `*.html`, `*.js`
- too many deleted lines in one file
- edits with larger deletions in protected core files (`js/cyber-layout.css`, `js/index-ui.css`, `js/ui.js`, `index.html`)
- file deletions for `*.css`, `*.html`, `*.js`

Intentional override for rare refactors:

```bash
ALLOW_PROTECTED_EDIT=1 ALLOW_MASS_DELETE=1 git commit -m "intentional refactor"
```

If you intentionally remove files:

```bash
ALLOW_FILE_DELETE=1 git commit -m "intentional file removal"
```
