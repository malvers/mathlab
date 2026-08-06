#!/bin/bash
# Double-click in Finder: regenerates the five CV PDFs into ~/Downloads/cv-pdfs.
# First run installs local tooling (puppeteer-core + Chrome for Testing, ~250 MB)
# into this folder – both are gitignored and never leave this machine.
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules/puppeteer-core ]; then
  echo "Erst-Setup: installiere puppeteer-core …"
  npm install puppeteer-core --no-fund --no-audit
fi

if ! ls -d chrome/*/chrome-mac-*/ > /dev/null 2>&1; then
  echo "Erst-Setup: lade Chrome for Testing herunter …"
  npx --yes @puppeteer/browsers install chrome@stable
fi

node make-cv-pdfs.mjs
open "$HOME/Downloads/cv-pdfs"
