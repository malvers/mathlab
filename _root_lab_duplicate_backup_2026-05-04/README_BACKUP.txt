Backup of former repo-root duplicates of the static Mathe-Lab site tree.

Why: Canonical site source and GitHub Pages artifact path is HTML/ only (.github/workflows/deploy-pages.yml uploads path: HTML).

What was moved here (2026-05-04): Root-level *.html, css/, js/, orbitals/, LensStandalone/, img/, python/, plus root CNAME, build-inline-kff.sh, check_*.py — parallel copies of files that also exist under HTML/ (or were only at root).

NOT moved (still at repo root): HTML/, .github/, resources/ (deploy copies resources/screenshots into HTML/), scripts/, hooks/, Material/, tools/, etc.

Restore: mv paths back from this folder to repo root if ever needed.
