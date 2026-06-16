# Solita Stufe 2 — „smart & actionable" (Tool-Use)

> Gebaut autonom 2026-06-14 auf Branch **`solita-actionable`** (isolierter Worktree, damit die parallele
> Tracker-Session auf `main` ungestört bleibt). **Nicht gemmerged, nicht gepusht** — liegt für dein Review.
> Aktivierung = deine Entscheidung (eine KI committet damit in den public Repo).

## Was Solita jetzt kann (wenn aktiviert)
Aus dem **normalen Gespräch** heraus handeln — keine Spezial-Syntax nötig:
- **„mach die Uhr grün"** / „Banner nach unten" → ändert die Live-Config (`HTML/config.json`) → greift live.
- **„schreib auf: …"** / „notier …" / „merk dir …" → hängt eine datierte Notiz an `solita-notizen.md` + committet.
- Alles andere → ganz normale Antwort (sie nutzt Werkzeuge nur, wenn du klar darum bittest).

Technisch: **Claude Tool-Use** (function-calling). Solita bekommt zwei Werkzeuge (`change_setting`, `write_note`);
Claude entscheidet, ob/wann es eins aufruft; der Client führt es aus und gibt das Ergebnis an Claude zurück.

## Was gebaut wurde (Dateien auf dem Branch)
1. **`supabase/functions/claude/index.ts`** — reicht ein `tools`-Schema durch und gibt zusätzlich die rohen
   Content-Blöcke + `stop_reason` zurück. **Rückwärtskompatibel**: `choices[0].message.content` (Text) bleibt,
   der alte Chat funktioniert unverändert.
2. **`HTML/js/solita-core.js`** — `SOLITA_TOOLS` + ein **begrenzter Tool-Loop** in `sendMessage` (max 6 Runden) +
   `execTool` (ruft `solita-config` / `solita-note`) + Persona kennt ihre Werkzeuge. `conversationHistory` bleibt
   **String-only** (Tool-Blöcke leben nur lokal im Loop → kein Reload-/Persist-Risiko).
3. **`supabase/functions/solita-note/index.ts`** — NEU. Hängt eine Notiz an `solita-notizen.md` + committet via
   GitHub Contents API. **Kein** Claude-Call. Pfad **fest** auf `solita-notizen.md` (Whitelist), Passwort-Gate,
   Secret-Scan (lehnt Secrets ab), nutzt dasselbe `GITHUB_TOKEN` wie `solita-config`.
4. **`solita-notizen.md`** — Ziel-Datei (Seed).

Bereits vorhanden (Stufe 2a, von früher): `supabase/functions/solita-config/index.ts` + `HTML/config.json` v6.

## Sicherheit
- **Kein Secret im Client** (Regel 18). Tokens nur server-seitig als Edge-Function-Secrets.
- **Blast-Radius eng**: die Functions dürfen je **genau eine** Datei schreiben (`HTML/config.json` bzw.
  `solita-notizen.md`). Sonst nichts.
- **Passwort-Gate** (`x-app-pass` / `LABAI_PASSWORD`) auf allen drei Functions.
- **Graceful**: ist die aktualisierte `claude`-Function noch nicht deployt, ignoriert die alte das `tools`-Feld →
  Chat läuft normal weiter (nur ohne Aktionen).

## Aktivierung (deine Schritte, wenn gewollt)
1. **GitHub-Token** (fine-grained PAT): nur Repo `malvers/mathlab`, Permission *Contents: Read and write*.
2. **Secret setzen** (Supabase → Edge Functions → Secrets): `GITHUB_TOKEN = <PAT>`
   (`ANTHROPIC_API_KEY` + `LABAI_PASSWORD` sind schon da).
3. **Deploy:**
   ```
   supabase functions deploy claude        --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
   supabase functions deploy solita-config --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
   supabase functions deploy solita-note   --no-verify-jwt --project-ref fyfhxzyymmurlaenmzse
   ```
4. **Branch reviewen + mergen:**
   ```
   git diff main solita-actionable        # alles ansehen
   git switch main && git merge solita-actionable
   ```

## Testen (nach Aktivierung, am Browser)
- „Solita, mach die Uhr grün" → 🔧-Zeile + „erledigt", Uhr wird grün (binnen ~20 s Config-Poll).
- „schreib auf: Idee XY" → 📝-Zeile, `solita-notizen.md` bekommt einen Eintrag.
- „wie geht's?" → normale Antwort, kein Werkzeug.

## Offen / nächste Stufe (mit dir)
- Mehr Werkzeuge (z.B. `read_notes`, `list_settings`, Tracker-Aktionen).
- `change_setting` validiert Grenzen aktuell nur via Prompt (das `_schema` ist Doku) — optional server-seitig hart prüfen.
- Stufe 2b: Solita editiert echten Code (auf `solita/*`-Branches, nie direkt main).
