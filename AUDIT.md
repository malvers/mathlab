# forloop — Globaler Audit & Refactor-Plan

> Erstellt als Antwort auf `HTML/Global check forloop.md`. Read-only Audit, **keine Quell-Dateien verändert**
> (CLAUDE.md Regeln 2/4). Befunde von 8 parallelen Sub-Agenten + eigener Stichproben-Verifikation.
> Stand: 2026-06-08 · Branch: `claude/global-check-forloop-mPHhm`.
> Alle Funde sind `file:line`-belegt. „✅ bestätigt" = selbst nachgeprüft; sonst „⚠️ zu verifizieren".

---

## 0. Management-Summary (Ist-Zustand in 5 Sätzen)

1. **forloop** ist eine erstaunlich große, gewachsene Sammlung — ~83 HTML-Seiten (64 Top-Level-Labs + 19 in Unterordnern), eine geteilte JS/CSS-Schicht aus ~58 Modulen, plus drei eigenständige Apps (`tracker/`, `vgp/`, `morpheus/`) auf einem gemeinsamen Supabase-Backend.
2. Die **gemeinsame Schicht funktioniert** (zentrale `branding.js` / `ui.js` / `i18n.js` / `cyber-layout.css` werden von 50+ Labs konsistent geladen), ist aber **architektonisch fragil**: rein global, load-order-abhängig, mit 4 konkurrierenden Layout-CSS-Systemen und 4 Button-Systemen, die sich per `!important` überschreiben.
3. Das **Kernziel des Briefs — „alle Farben zentral"** ist erst zu ⅓ erreicht: nur λ-Orange ist tokenisiert; Υ-Rot und φ-Grün haben **kein** zentrales Token und werden in 13–15 Dateien je hartkodiert; insgesamt ~2300 Farb-Literale im Code.
4. Es gibt **vier bestätigte Secret-Leaks** in einem **public** Repo (Google-TTS-, Gemini-, DeepSeek-Key, ein Klartext-Passwort) — alle auch in der git-History → Regel 18 verletzt, **Rotation zwingend**.
5. **Tests existieren praktisch nicht** (4 manuelle Print-Skripte, kein CI-Gate), und ~195 MB Binär-Ballast (`resources/` 161 MB, eine 7,7 MB APK, ein 24 MB MP4) liegen dauerhaft in der git-History eines Pages-Repos.

### Die 3 größten Risiken (ehrlich)

| # | Risiko | Warum kritisch | Sofort-Maßnahme |
|---|---|---|---|
| **R1** | **4 Secrets im public Repo + History** | Live Google-/DeepSeek-API-Keys sind abrufbar → fremde Abrechnung/Missbrauch auf deine Rechnung. Löschen reicht nicht (History). | **Keys rotieren**, dann Source bereinigen. Siehe Dimension 6. |
| **R2** | **Kein zentrales Design-System trotz „Farben"-Projektziel** | Jede Farb-/Button-Änderung = manuelle Suche über ~83 Dateien; `!important`-Kriege machen lokale Tweaks unmöglich. Bremst genau das, was als Nächstes wächst. | `js/tokens.css` einführen (WP-2). |
| **R3** | **Kein Test-/CI-Gate + 195 MB Git-Ballast** | Ein toter Link, fehlender i18n-Key oder kaputtes Lab geht ungebremst live auf die Apex-Domain; jeder Clone zieht 195 MB. | Link-/i18n-Check als CI-Gate (WP-7), Binaries → LFS/Releases (WP-8). |

---

## 1. Dimension 1 — Labs/Tools-Inventar

**Umfang:** 83 HTML-Dateien, ~58 JS-Module in `HTML/js/`, 24 CSS. Größte Labs:
`mandelbrot.html` (4216 Z.), `intro.html` (3546), `index.html` (2682), `orbitals.html` (1631),
`numberrecognition.html` (1429), `gravitation.html` (1415), `batman.html` (1148).

**Gemeinsame Shell (gut):** ~50+ Labs laden denselben Stack — `js/branding.js`, `js/ui.js`, `js/i18n.js`
+ 9 Sprachpakete, `js/cyber-left-chrome.js`, CSS `cyber-layout.css` / `cyber-lab-overrides.css` /
`buttons-ultra.css` / `branding.styles.extracted.css`. Niemand baut eine eigene Shell — **konsistent**.
`template.html` (126 Z., 0 Farb-Literale) ist die saubere Referenz-Shell.

**Vorbild-Muster:** `cmaes.html` lagert seine Logik korrekt nach `js/cmaes-logic.js` aus —
genau das Pattern, das die großen Inline-Labs (s.u.) übernehmen sollten.

### Red Flags Inventar

- **Riesige Inline-Skripte, die nach `js/` gehören:**
  `intro.html` (~2400 Inline-Zeilen, ab `intro.html:1144`), `mandelbrot.html` (~3236, ab `:1023`),
  `gravitation.html` (~1232, `:197`), `orbitals.html` (~970 ES-Modul, `:625`),
  `numberrecognition.html` (~941, `:486`), `batman.html` (~854, `:292`), `ann.html` (~770),
  `galtonboard.html` (~589). ✅ bestätigt via Zeilenzählung.
- **Labs ohne zentrale Layout-Schicht (Regel 7):** `universe.html`, `zahlenwidget.html`,
  `happybirthday.html`, `labai.html`, `posterstudio.html` rollen eigene Shell;
  `audio-counter.html`, `box-selector.html` sind komplett standalone (0 geteilte Deps).
  Ordner-Apps `voicerecorder/` und `orbitals/` nutzen ebenfalls nicht die zentrale Schicht.
- **three.js-Versions-Split:** `heart3d.html:90` & `litchi3d.html` nutzen legacy **three r128 (global)**,
  `orbitals.html` & `gravitation.html` nutzen **three@0.160 (ESM)** — zwei inkompatible three-Stacks.
- **KaTeX-Versions-Drift:** 0.16.9 (Mehrheit), 0.16.8 (`uhrzeitwinkel.html:9`, `fermatpunkt.html:9`),
  0.16.0 (`potenzlabor.html:13`, `fourier.html:16`). Renderer-Inkonsistenz: `lenglay.html:222` als
  einziges Lab auf MathJax 3 statt KaTeX.
- **i18n unvollständig in Einzel-Labs:** `team.html` lädt nur 3 von 9 Sprachen (de/en/es).
- **Debug-Spam committed:** `parabellabor.html` (:102, :192, :293, :306),
  `gleichungssysteme.html` (:79, :136, :314) — identische Emoji-`console.log`-Boilerplate.
- **Legacy-CSS-Outlier:** `triangulierer.html:19` lädt als Einziges noch `css/style.css`.

→ Volle Tabelle aller 64 Top-Level-Labs (Zweck · Größe · Deps · Flags) liegt in den Agenten-Rohbefunden;
hier verdichtet auf die handlungsrelevanten Muster.

---

## 2. Dimension 2 — Doppel-Implementierungen & Tests

### Doppel-Code

| Concern | Befund | file:line | Konsolidierung |
|---|---|---|---|
| **Recorder** | Bereits zentral (gut). Aber **zwei** Inject-Pfade laden dieselbe 1794-Z.-Datei: `branding/nav.js:146` **und** `cyber-recorder-key.js:1-30`. | `js/cyber-recorder.js`, `js/branding/nav.js:146`, `js/cyber-recorder-key.js` | Niedrig — einen Loader behalten. |
| **Canvas→PNG** | **3 Implementierungen**, keine geteilt: `ui.js:417` (toDataURL), `forloop-canvas-png.js:14-40` (toBlob, **0 Refs = tot**), eigener Export in `cyber-recorder.js`. | wie links | Mittel — 1 Helper. |
| **Branding-CSS** | 3 Dateien, überlappende Tokens: `branding.js` + `branding.styles.extracted.css` (55 Labs) + `branding-extracted.css` (**0 Refs = tot**). Name-Drift: „Mathe-**Labore**" (`branding.js:178`) vs „Mathe-**Labor**" (`branding.js:308`). | `js/branding.js:178,308` | Mittel. |
| **Layout-CSS** | **4 konkurrierende Systeme** stylen dieselben Roots: `cyber-layout.css` (52), `cyber-lab-overrides.css` (52), `lab-shell-minimal.css` (11), `css/style.css` (1–7). `lab-shell-minimal.css:22` kommentiert die eigene Regel selbst als „no-op". | s. CSS-Dateien | **Hoch.** |
| **Buttons** | **4 Klassen-Systeme**: `.cyber-btn`/`.btn` in `buttons-ultra.css` + Redefs in `glocken/glocken.css`, `voicerecorder/voicerecorder.css`, `morpheus/morph.css`, `equationocr.css`. `buttons-ultra.css` erzwingt Maße global per `!important`. | `js/buttons-ultra.css:26` | Mittel. |
| **Debug-Overlay** | 2 UIs: `cyber-recorder.js:230-484` baut eigenes `#cyber-recorder-debug`; `debug-window.js` (634 Z.) ist separates Widget. | wie links | Niedrig. |
| **i18n** | 9 nahezu identische 24–25 KB-Dateien, ~441 Keys je Sprache. Jeder neue String = 9-Datei-Edit ohne Drift-Tooling. | `js/i18n-*.js` | Mittel (Tooling, s.u.). |
| **Token-`:root`-Blöcke** | **8–12 separate `:root`** definieren Custom-Props; kein zentrales Token-File. | s. Dimension 5 | **Hoch.** |

**Toter Code (mit OK löschbar, Regel 2):** `js/forloop-canvas-png.js`, `js/branding-extracted.css`
(beide 0 Refs), `js/branding/i18n-descriptions_debug.js` (89 KB Debug-Zwilling neben 97 KB Original),
`js/events.js` / `js/guard.js` (0 Refs). `js/main.js`/`config.js`/`draw.js`/`geometry.js` liegen in
`js/`, sind aber Single-Lab (nur von `lenglay.html` genutzt) — irreführend platziert.

### Test-Abdeckung

**Ist-Zustand: faktisch null automatisiert.** Kein Runner (Jest/Vitest/Playwright), kein `*.test.js`,
kein `package.json`-Test-Script. Vorhanden: 4 manuelle Print-Skripte in `HTML/`
(`check_htmls.py`, `check_universe.py`, `check_screenshots.py`, `test_emoji.py`) ohne Asserts/Exit-Codes;
`check_screenshots_script.py` ist **kaputt** (hartkodierter Pfad `/Users/malvers/IdeaProjects/...`).
CI = nur `deploy-pages.yml` (kopiert Screenshots + deployt) — **kein Test/Lint/Link-Check vor Deploy.**

**Was getestet werden sollte (nach Hebel):**
1. **Link-/Asset-Integrität** (billigster, höchster Wert): jeder `href` in `labs-config.js` existiert on-disk;
   jeder referenzierte Screenshot existiert; keine Lab-Waisen. Bestehende `check_*.py`-Logik → Exit-Code + CI-Gate.
2. **i18n-Key-Vollständigkeit** — Counts driften bereits: `i18n-de.js` ~505 Keys vs. en/fr/it/es/pt/sw ~487,
   nl ~489, tr ~488. Test: Key-Set je Sprache gegen Referenz, Fail bei fehlenden Keys.
3. **Pure-Logic-Unit-Tests** (DOM-frei, sofort testbar): `geometry.js`, `math-library.js`, `gotzelahmayer.js`,
   `integral-engine.js`, `fourier-logic.js`, `cmaes-logic.js`.
4. **Lab-Boot-Smoke** (Playscript headless): jedes Lab laden, kein uncaught console-error, `ui.js`/`branding.js` initialisiert.

---

## 3. Dimension 3 — Codequalität / Bugs / Wartbarkeit

**Echte Bugs:**
- ✅ **`js/i18n.js:84` Falsy-Bug:** `get()` läuft mit `if (result && result[part])`. Eine legitim leere
  Übersetzung (`""`) oder `0` ist falsy → Lookup bricht ab und gibt **den rohen Key** zurück statt des
  leeren Werts. Echter Korrektheits-Bug für jede absichtlich leere Übersetzung.
- **DOM-XSS in `labai.html:746-775`** (auch Dimension 6): AI-Markdown wird via Regex in `innerHTML`
  gerendert, Nicht-Code-Text **nicht** escaped → `<img onerror=…>` aus vergifteter Modell-Antwort führt aus.

**Fragile Muster:**
- **Recorder koppelt an Lab-interne Globals:** `cyber-recorder.js:1046,1068,1185` überschreiben
  `window.getPlaybackTime`; `:1189` schreibt `window.useGlobe`; greift auf `toggleGlobe`/`resetGlobeCenter`.
  Geteiltes Modul mutiert worldclock-spezifische Globals — brüchig.
- **Install-Guards per Global:** `window.__cyberAppScreenshotInstalled` (`ui.js:336`),
  `__cyberResourceGuardInstalled` (`ui.js:445`), `__cyberRecorderKeyInstalled` (`cyber-recorder-key.js:2`) —
  Ad-hoc-Dedup statt idempotenter Module.
- **Brüchige Selbst-Erkennung:** `cyber-recorder-key.js:6-14` sucht sein eigenes `<script>` per
  String-Match in `document.scripts` und leitet daraus den Recorder-Pfad ab — bricht bei Rename/Inline/Concat.
- **`document.write`-Injektion:** `tracker.html:19-24,225-234` lädt 7 Skripte + CSS per `document.write`
  (parsing-blockierend). `coolsquares.html:7`/`universe.html:16` rufen `CyberI18n.get()` im `<title>` —
  load-order-abhängig.

**Komplexitäts-Hotspots:** `cyber-recorder.js` `injectUI()` = **~543 Z.** Inline-HTML/CSS-String in einer
Methode (`:245-787`); `cmaes-logic.js` (871 Z.) und die Recorder-Klasse (1794) monolithisch.

**Toter Code:** s. Dimension 2 (5 Dateien mit 0 Refs).

---

## 4. Dimension 4 — Dokumentation

**Ist: unreif/informell.** Docs lesen sich wie Labor-Notizbuch (`unterhaltung-*.md` 45K Gesprächslog,
`plan-morgen.md`, `SOULD.md`, `TRAUM.md`) statt Projekt-Doku.

**Stärken:** zentrale Engines selbst-labelnd (`ui.js:1`, `branding.js:1`, `labs-config.js:1` mit
`@AI-READONLY`-Bannern); `rain-radar.js:1`/`sw.js` mit guten Headern; `LABS.md` ist echter Katalog;
`resources/README.md` dokumentiert den Commit-Guard; `tracker/` hat die meisten Modul-Docs.

**Lücken, die einen 2. Contributor treffen:**
- **Kein Onboarding** (run/build/deploy/„wo liegt was"). Kein README im Repo-Root.
- **Kein Architektur-/Dependency-Map** der 58-Datei-`js/`-Schicht.
- **Kein README** für `morpheus/`, `vgp/`, `worldclock/`, `glocken/`, `js/` — die größten Sub-Apps undokumentiert.
- **Dünne Kommentar-Dichte** auf kritischen Dateien: `ui.js` ~5 %, `cyber-recorder.js` (77 KB) ~3,5 % —
  ausgerechnet das least-kommentierte Kern-Modul.
- **Regel-14-Verstöße (Kommentare müssen Englisch sein):** Deutsche Kommentare in
  `js/gotzelahmayer.js` (Z. 28,35,36,50,58,60,75,124,132,176,207), `js/TS.js:1,92`,
  `js/cyber-canvas.js:430,447`, `js/draw.js:69`, `js/cyber-clock.js:31`, `js/cyber-left-chrome.js:118`,
  `js/branding/i18n-descriptions.js:2363`, `universe.html:232`. ~17+ Zeilen.

---

## 5. Dimension 5 — Performance

**Schwergewichte im Pages-Repo (`.git` = ~195 MB):**
- `resources/` **161 MB**: `screenshots/` 61 MB (43 PNGs, mehrere 2–5 MB), `team/` 30 MB
  (`SW-Developer.png` **9 MB**), `galay20.mp4` **24 MB**, `constellations/` 23 MB,
  `Infinity_6min.m4a` 5,6 MB. Kein git-LFS, keine Bild-Optimierung.
- `tracker/doc-alvers-tracker.apk` **7,7 MB** — Capacitor-WebView-Wrapper, ~98 % des tracker-Ordners.
- `morpheus/` 5,0 MB (`KOMPLEXE_FORMELN.jpg` 1,6 MB + vendored KaTeX 1,5 MB),
  `worldclock/` 2,7 MB (Stern-JSONs 1,8 MB + `.bak`/`.bak2`-Dateien committed),
  `recordings/*.recording` 3,2 MB (Debug-Artefakt).
- **Tote Assets:** ✅ `HTML/Formeln.jpg` (1,09 MB, **0 HTML-Refs**), `img/litchi-icon.png` (524 KB für ein Icon).

**Main-Page-Ladekosten:**
- ✅ **Alle 9 i18n-Bundles laden blockierend auf jeder Seite** (`index.html:10-20`, +50 weitere Labs) —
  ~323 KB i18n-JS synchron, obwohl der Nutzer genau **eine** Sprache braucht. **Größter Einzel-Win.**
- Geteilte Skripte ohne `defer`/`async`: `ui.js?v=4` (`index.html:85`), i18n-Stack, `labs-icons.js` (40 KB).
- Render-blockierende Google-Fonts auf jeder Seite (`index.html:8` etc.).
- `intro.html`: lädt `galay20.mp4` (24 MB) + `Infinity_6min.m4a` (5,6 MB, `new Audio` eager) +
  ~40 Full-Res-Screenshots in Folge (`:3207`).

**Korrekt gelöst:** `HTML/sw.js` ist bewusst No-Cache (KISS) und purged alte Caches → kann die großen
Assets **nicht** cache-blähen. `mandelbrot.html` ist Inline-everything, aber WebGL (GPU trägt die Last) —
kein Render-Perf-Problem, nur Dateigröße.

---

## 6. Dimension 6 — Sicherheit (Repo ist PUBLIC)

### 🚨 CRITICAL — bestätigte, rekonstruierbare Secrets (Regel-18-Verstöße)

| # | file:line | Was | Verifikation |
|---|---|---|---|
| **S1** | `HTML/glocken/glocken.js:20` | Live Google-TTS-Key `AIza‹REDACTED›Fj…OwL8o`, Klartext. Kommentar: „REMOVE THIS BLOCK BEFORE `git push`" — wurde gepusht. | ✅ **selbst nachgeprüft** (sed). |
| **S2** | `HTML/morpheus/apikey.embedded.js:15-16` | Gemini-Key, XOR+base64; `PASS="‹REDACTED-PASS›"` + `BLOB` zusammen → dekodiert zu gültigem `AIzaSy…`. Header gibt selbst zu „effectively public". | ✅ von 2 Agenten dekodiert. |
| **S3** | `HTML/labai.html:590-591` | DeepSeek-Key: Passphrase `‹REDACTED›` im Kommentar über `ENCRYPTED_API_KEY`. Entschlüsselt zu `sk-‹REDACTED›`. | ✅ via openssl entschlüsselt. |
| **S4** | `HTML/scratch/check_pwd.js:1` | Klartext-Passwort `‹REDACTED-PW›` (`btoa(...)`) committed. | ✅ Literal im Source. |

**Git-History:** 50 Commits. `-S`-Suchen zeigen: Commit `f916e3f` führte den morpheus-BLOB/PASS ein;
der einzige `AIzaSy`-Key in der History ist `AIza‹REDACTED›…` (= glocken/morpheus). **Alle Secrets sind in
HEAD UND History** → Löschen aus dem Working-Tree genügt nicht.

> **EMPFEHLUNG (zwingend, Regel 18):** Google-TTS-Key (S1), Gemini-Key (S2) und DeepSeek-Key (S3)
> **jetzt rotieren** (in den jeweiligen Consoles neu erzeugen, alte invalidieren), Passwort `‹REDACTED-PW›` (S4)
> überall wechseln. Danach Source bereinigen (Ciphertext-only ist OK; Passwort+Ciphertext zusammen NICHT).
> Google-Keys zusätzlich per Referrer/API-Restriction einschränken. **Vorbild:** `glocken/glocken.js:94-180`
> (AES-GCM-WebCrypto-Vault, Key nie im Source) — zu diesem Muster für alle drei migrieren.

### MEDIUM
- **DOM-XSS:** `HTML/labai.html:746-775` — AI-Antwort via Regex-Markdown in `innerHTML`, Nicht-Code-Text
  nicht escaped. Auth-gated + semi-trusted Input → MEDIUM. Fix: vor Markdown escapen oder Sanitizer.
- **Supabase RLS effektiv world-writable:** `supabase/setup.sql:23-31,42-50,83-85` — RLS *aktiviert*, aber
  jede Policy `to authenticated using(true) with check(true)`; Anon-Auth zählt als `authenticated`.
  → `messages`/`reactions`/`media`-Bucket von jedem Anon-Session les-/schreib-/löschbar. Mitigiert durch
  E2E-Verschlüsselung (Inhalt ist Ciphertext, Edits ECDSA-signiert) — **akzeptabel by-design**, aber
  Metadaten-Exposure + Flood/Delete-Risiko. file:line zum Review notiert.

### LOW / informational (✅ verifiziert KEIN Verstoß)
- `tracker/tracker.html:1278`, `view.html:221`, `vgp/js/vgp-setup.js:12`: `sb_publishable_…`-Key —
  **neues Supabase-Publishable-Format, bewusst client-seitig**, Schutz via RLS. Korrekt dokumentiert in
  `tracker/agents.md:103`. `vgp-push.js:7` VAPID-Public-Key — public by design.
- **vgp-Krypto ist solide:** PBKDF2 (200k) → AES-GCM-256, ECDSA P-256 + ECDH, non-extractable Private-Keys
  in IndexedDB, signatur-verifizierte Messages. innerHTML in `vgp-messages.js` durchweg `escapeHtml()`'d.
- Supabase Edge Functions (`supabase/functions/*`) sauber — alle Secrets via `Deno.env.get()`.
- `tools/reset_hash.py` — Good Practice (nur PBKDF2-Hash, nie Klartext).

---

## 7. Design-System-Vorschlag (Tokens · Komponenten · Migration)

### Token-Ist-Zustand
- **λ-Orange `rgb(245,194,66)`** — zentral tokenisiert (`branding.styles.extracted.css:8 --branding-orange`,
  `index-portal-tokens.css:8 --portal-neon-orange`), **aber zusätzlich 27× in 15 Dateien hartkodiert**.
- **Υ-Rot `rgb(176,36,24)`** — **KEIN zentrales Token.** 27 Vorkommen / 15 Dateien; jeder Ordner erfindet
  `--red` neu (`tracker/tracker.css:8`, `glocken/glocken.css:6`, …).
- **φ-Grün `rgb(121,158,49)`** — **KEIN zentrales Token.** 16 Vorkommen / 13 Dateien.
- Gesamt-Literale: HTML 972 hex + 1336 rgb(); CSS 181 hex + 733 rgb(). 8–12 separate `:root`-Blöcke,
  3 Button-Systeme, kein gemeinsamer Token-Header.

### Vorschlag: ein kanonisches Token-File `js/tokens.css` (neu, zuerst geladen)

```css
:root {
  /* Brand-Palette — die 3 CLAUDE.md-Farben, endlich zentral */
  --lambda:  rgb(245, 194, 66);   /* λ orange */
  --upsilon: rgb(176, 36, 24);    /* Υ red   */
  --phi:     rgb(121, 158, 49);   /* φ green */
  /* Bestehende Akzente (re-homed) */
  --branding-blue:   #00d2ff;
  --branding-purple: #9d50bb;
  --branding-white:  #ffffff;
  /* Neutrals */
  --bg-space: rgb(0, 0, 20);
  --surface:  rgba(18, 22, 32, 0.94);
  --border:   rgba(165, 186, 210, 0.28);
  --text-main:#ffffff;
  --text-dim: #a0a0a0;
}
```

**Aliasing statt Bruch:** in `branding.styles.extracted.css` → `--branding-orange: var(--lambda)`;
in jeder Ordner-Datei `--red: rgb(176,36,24)` → `--red: var(--upsilon)`, `--green` → `var(--phi)`.
Per-Lab-`--red`/`--green` funktionieren weiter, jetzt aus **einer** Quelle.

**Komponenten:** `buttons-ultra.css` als Autorität behalten (nicht umbenennen — Regel 17, `@AI-READONLY`,
52 Refs), aber die 4 Satelliten-Button-Defs (`glocken`, `voicerecorder`, `morpheus/morph`, `equationocr`)
darauf zurückführen (`@import` bzw. Redef entfernen), so dass `.btn`/`.cyber-btn` **eine** Definition haben.
Dropdowns/Inputs analog in die zentrale Schicht falten.

> **Hinweis Regel 17:** der Dateiname `js/buttons-ultra.css` enthält „ultra" und verletzt die Namensregel.
> **Nicht umbenannt** (52 Refs + Read-only-Marker) — Umbenennung nur mit deinem OK als eigenes WP.

---

## 8. Globaler Refactor-Plan — Work-Packages (dependency-sortiert)

> Format: `ID · Ziel · Dateien · Risiko · Aufwand (PT) · Owner-Agent-Typ · Abhängigkeiten · parallelisierbar`

| ID | Ziel | Betroffene Dateien | Risiko | Aufwand | Owner-Agent | Deps | parallel |
|---|---|---|---|---|---|---|---|
| **WP-1** | **Secret-Rotation + Bereinigung** (S1–S4): Keys rotieren, Bake-ins entfernen, alle auf glocken-Vault-Muster | `glocken/glocken.js:20`, `morpheus/apikey.embedded.js`, `labai.html:590`, `scratch/check_pwd.js` | niedrig (Code) / **hoch (Pflicht)** | 0,5 | Security | — (Doc rotiert Keys) | ja |
| **WP-2** | **`js/tokens.css`** anlegen (λ/υ/φ + Neutrals) + Aliasing, 0-Risiko-Phase | neu `js/tokens.css`; `branding.styles.extracted.css`, `index-portal-tokens.css`, Ordner-CSS | niedrig | 1 | Design-System | — | ja |
| **WP-3** | **i18n.js Falsy-Bug fixen** (`:84`) + i18n-Key-Drift-Check | `js/i18n.js:84`, `js/i18n-*.js` | niedrig | 0,5 | Qualität | — | ja |
| **WP-4** | **Toten Code entfernen** (mit OK): `forloop-canvas-png.js`, `branding-extracted.css`, `events.js`, `guard.js`, `i18n-descriptions_debug.js` | s. Dim. 2 | niedrig | 0,5 | Qualität | — | ja |
| **WP-5** | **labai DOM-XSS** beheben (escape vor Markdown) | `labai.html:746-775` | niedrig | 0,5 | Security | — | ja |
| **WP-6** | **Layout-CSS konsolidieren**: 4 Systeme → 1 Schicht, `!important`-Kriege auflösen, `css/style.css` entfernen | `cyber-layout.css`, `cyber-lab-overrides.css`, `lab-shell-minimal.css`, `css/style.css`, `triangulierer.html:19` | **hoch** | 4 | Design-System | WP-2 | nein |
| **WP-7** | **CI-Test-Gate**: Link-/Asset-Integrität + i18n-Vollständigkeit als blockierende GH-Action | `check_*.py` → Exit-Codes, neu `.github/workflows/ci.yml` | niedrig | 1,5 | Test | WP-3 | ja |
| **WP-8** | **Git-Entschlackung**: `resources/`-Binaries + APK + MP4 → LFS/Releases, Bilder optimieren, tote Assets löschen (`Formeln.jpg`, `.bak`) | `resources/`, `tracker/*.apk`, `worldclock/*.bak*`, `HTML/Formeln.jpg`, `recordings/` | **hoch** (History-Rewrite) | 2 | Performance | — | nein |
| **WP-9** | **i18n nur aktive Sprache laden** (lazy rest) | `index.html:10-20` + ~50 Labs, `js/i18n.js` | mittel | 2 | Performance | WP-3 | nein |
| **WP-10** | **Große Inline-Skripte nach `js/` auslagern** (cmaes-Muster): intro, mandelbrot, gravitation, orbitals, numberrecognition, batman, ann | je 1 HTML → je 1 neues `js/*.js` | mittel | 5 | Qualität (je Lab 1 Sub-Agent) | WP-6 | **ja (je Lab)** |
| **WP-11** | **Farb-Literale → Tokens** migrieren (λ/υ/φ-Literale skript-ersetzbar) | ~83 HTML + 24 CSS | mittel | 3 | Design-System (je Bündel 1 Sub-Agent) | WP-2, WP-6 | **ja (je Bündel)** |
| **WP-12** | **15 Nicht-zentrale Labs** auf Standard-Shell heben (Regel 7) | `universe`, `zahlenwidget`, `happybirthday`, `labai`, `posterstudio`, `audio-counter`, `box-selector`, `voicerecorder/`, `orbitals/`, … | mittel | 2,5 | Design-System | WP-6 | ja (je Lab) |
| **WP-13** | **Recorder entkoppeln**: 1 Loader, keine Lab-Global-Mutation, `injectUI()` splitten | `cyber-recorder.js`, `cyber-recorder-key.js`, `branding/nav.js:146` | mittel | 2 | Qualität | WP-4 | nein |
| **WP-14** | **three.js/KaTeX vereinheitlichen** (eine three-Version, eine KaTeX-Version, MathJax→KaTeX in lenglay) | `heart3d`, `litchi3d`, `orbitals`, `gravitation`, `potenzlabor`, `fourier`, `lenglay` | mittel | 2 | Qualität | — | ja |
| **WP-15** | **Doku-Fundament**: Root-README + Architektur-Map `js/` + READMEs für morpheus/vgp/worldclock/glocken; Regel-14-Sweep (DE-Kommentare→EN) | neu READMEs, `js/gotzelahmayer.js`, `TS.js`, `cyber-canvas.js`, … | niedrig | 2 | Doku | — | ja |
| **WP-16** | **Pure-Logic-Unit-Tests** (geometry, math-library, gotzelahmayer, integral-engine, fourier-logic, cmaes-logic) | `js/*-logic.js` etc., neu `tests/` | niedrig | 2 | Test | WP-7 | ja |

**Summe ~33 PT.** Owner-Agent-Typen entsprechen den Audit-Agenten — der Chef-Agent verteilt WP-IDs direkt.

---

## 9. Empfohlene Reihenfolge (Phasen) + Quick-Wins

**Quick-Wins (heute, niedriges Risiko, hoher Wert):**
- **WP-1** Secrets rotieren *(blockierend — zuerst)*
- **WP-2** `tokens.css` + Aliasing *(0 visuelle Änderung, schließt die Rot/Grün-Lücke sofort)*
- **WP-3** `i18n.js:84`-Bugfix
- **WP-5** labai-XSS
- löschen `HTML/Formeln.jpg` (1 MB tot) + `worldclock/*.bak*` *(Teil WP-8, ohne History-Rewrite)*

**Phase 1 — Fundament (parallel):** WP-1, WP-2, WP-3, WP-4, WP-5, WP-7, WP-15.
**Phase 2 — Konsolidierung (seriell-Kern):** WP-6 (Layout) → dann WP-11/WP-12 (Tokens/Shell-Migration, parallel).
**Phase 3 — Entkopplung & Perf:** WP-9, WP-10 (je Lab parallel), WP-13, WP-14, WP-16.
**Phase 4 — Hygiene mit Vorlauf:** WP-8 (Git-History-Rewrite — koordiniert, da alle Clones betroffen).

---

## 10. Hinweis zur Ausführung

Dieser Bericht ist **nur Befund + Plan** — es wurde **keine** Quell-Datei geändert (Regeln 2/4).
Einzige geschriebene Datei: `AUDIT.md` (Repo-Root). Nächster Schritt liegt bei dir, Doc:
**zuerst WP-1 (Keys rotieren)** — der Rest kann danach kontrolliert per Work-Package laufen.
