#!/bin/bash
# The Real Salary: puts the sealed files of the-real-salary.html (HTML/resources/real-salary/*.bin, made by
# tools/real-salary.py + scripts/cv-docs.mjs) into the R2 bucket "media" under real-salary/ - only what is new or
# changed (R2's ETag is the MD5 of the file), so a run after a few new slides takes seconds. The files are sealed
# with the key of the CV documents; nothing plain leaves the Mac.
#
#     bash tools/real-salary-r2.sh
#
# wrangler needs a login once, in a terminal:  npx wrangler login
cd "$(dirname "$0")/../HTML/resources/real-salary" || exit 1
BASE=https://pub-5e3b331002a14e5a8532e12ebae95bf9.r2.dev/real-salary
up=0; same=0; fail=0
for f in *.bin; do
  md5=$(md5 -q "$f")
  etag=$(curl -sI "$BASE/$f" | tr -d '\r"' | awk -F': ' 'tolower($1) == "etag" { print $2 }')
  if [ "$etag" = "$md5" ]; then same=$((same + 1)); continue; fi
  # wrangler pinned like tools/media_publish.mjs: 4.152 answers every put with 403 "Please enable R2"
  if npx --yes wrangler@4.40.0 r2 object put "media/real-salary/$f" --file "$f" --remote \
       --content-type application/octet-stream >/dev/null 2>&1; then
    up=$((up + 1)); echo "↑ $f"
  else
    fail=$((fail + 1)); echo "FEHLER $f (angemeldet? npx wrangler login)"
  fi
done
echo "$up hochgeladen, $same schon da, $fail Fehler"
