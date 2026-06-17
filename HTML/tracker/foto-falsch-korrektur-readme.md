# Foto „Falsch"-Korrektur + Session-Notizen (2026-06-17)

> Handoff für andere Agenten: Was in dieser Session gebaut/entschieden wurde,
> wo der Code liegt und was noch offen ist. Audience = Agenten, die am Tracker
> oder an diesen Dateien weiterarbeiten.

## Überblick

Vier Dinge in dieser Session:

1. **Prozent-Umbruch-Fix** in der Foto-Lightbox (PlantNet-Konfidenz „42 %").
2. **„Falsch"-Korrektur mit Sprach-Diktat** (Phase 1) — Hauptfeature.
3. **Idee** „Voicerecorder als Capacitor-App" → in `backlog.md` (auf `main`).
4. **Regel 20** in `CLAUDE.md` geändert (Auto-Commit+Push auf Branch).

Branch-Status siehe ganz unten.

---

## 1. Prozent-Umbruch-Fix

**Problem:** In der Lightbox-Faktentabelle brach „42 %" um — die Zahl in einer
Zeile, das „%" in der nächsten.

**Fix:** In `HTML/js/photo-layer.js` → `renderFacts()` wird beim Rendern der
Tabellenzelle das normale Leerzeichen zwischen Ziffer und `%` durch ein
**geschütztes Leerzeichen** (U+00A0) ersetzt:

```js
const val = esc(r[1]).replace(/(\d)\s+%/g, '$1 %');
```

Bewusst im **Display** (nicht in der Edge-Function / DB): Transport bleibt
plain text, und auch bereits gespeicherte Fotos profitieren.

---

## 2. „Falsch"-Korrektur mit Sprach-Diktat (Phase 1)

**Use-Case:** Die KI (Gemini/PlantNet) liegt bei einem Foto daneben. Doc will
die richtige Antwort dranhängen — am liebsten gesprochen, sofort transkribiert,
am Foto als DB-Eintrag.

### UX-Fluss
1. Lightbox offen, KI-Verdikt sichtbar.
2. **Long-Press (~500 ms)** auf Titel/Fakten → Button **„✗ Falsch"** erscheint
   (bricht bei >10 px Bewegung ab → kein Konflikt mit Swipe-Navigation).
3. „Falsch" → Editor mit **Mikro + Textfeld + Speichern/Abbrechen**.
   Diktat = **Web Speech API**, `de-DE`, One-Shot — exakt das Muster vom
   Navigations-Mikro „Ziel eingeben" (`HTML/js/tracker-nav.js`, `initNavMic`).
   Kein Speech-Support → Mikro versteckt, Tippen bleibt.
4. Speichern → Korrektur wird persistiert, als rote Zeile „✗ Korrektur: …"
   unter den Fakten gezeigt, und der Karten-Pin bekommt einen roten ✗-Marker.

### Scope-Entscheidungen (von Doc)
- **Nur Recorder** (`tracker.html`), nicht der Share-Viewer (`view.html`).
- **Nur transkribierter Text** (kein Original-Audio).
- Korrigiertes Foto **sichtbar markiert**: Pin **und** Lightbox-Zeile.

### Datenmodell
Neues Feld am Waypoint:

```js
wp.correction = { text: "<transkribiert/getippt>", t: "<ISO-Zeit>" }
```

Waypoints sind **keine** eigenen DB-Zeilen — sie liegen als JSON-Array in der
Spalte `tracks.waypoints`. `wpSer()` (`HTML/js/tracker.js`) klont das ganze
`wp`-Objekt, also persistiert `correction` automatisch. **Keine Migration.**

### Persistenz
- `wp._trackId` = Laufzeit-Feld, das die DB-Zeile merkt, in der dieser
  Waypoint steckt. Gesetzt in `saveOnePointTrack` (Einzelfoto bekommt eigene
  Track-Zeile). Fallback: `T.currentTrackId` (Foto im laufenden Track).
- `wpSer()` löscht `_trackId` (wie `_marker`/`_blob`) → wandert **nicht** in
  die DB.
- `saveCorrection(wp)` in `HTML/js/tracker-media.js`: liest die Zeile per
  `_trackId`, findet den Waypoint per Zeitstempel-Key `wp.t`, setzt
  `correction`, schreibt das Array zurück (`update({ waypoints }).eq('id', …)`).
  Read-modify-write → patcht **genau einen** Waypoint, ohne die anderen zu
  überschreiben (funktioniert für Einzelfoto- UND geladene/aktive Tracks).
- Verdrahtung: `PhotoLayer.setCorrectionHandler(saveCorrection)`. Die Lightbox
  schreibt **nie** selbst in die DB — sie ruft nur den injizierten Handler.
  Der Viewer setzt keinen Handler → dort erscheint kein „Falsch"-Button.

### Geänderte Dateien
| Datei | Was |
|---|---|
| `HTML/js/photo-layer.js` | Long-Press, ✗-Button, Mikro (Web-Speech), Korrektur-Render, Pin-Marker, `setCorrectionHandler` (neuer Export) |
| `HTML/js/photo-layer.css` | Styles: Pin-✗, Korrektur-Zeile, Button, Editor (responsive, Orbitron, Palette) |
| `HTML/js/tracker-media.js` | `saveCorrection`, Registrierung, `saveOnePointTrack` merkt `_trackId` |
| `HTML/js/tracker.js` | `wpSer` löscht `_trackId` |

### Wichtige Details / Fallstricke
- Long-Press nur, wenn ein `correctionHandler` gesetzt ist **und** `!wp.type`
  (also nur Foto-Waypoints; Voice/Video übersprungen).
- Keyboard-Guard: Im offenen Editor navigieren ←/→ **nicht** die Fotos, Esc
  bricht nur den Editor ab (statt die Lightbox zu schließen).
- `#lightbox-title`/`#lightbox-text` bekommen `user-select:none`, damit der
  native Long-Press (Textauswahl/Callout) die Geste nicht stört.
- **Persistenz braucht eine `UPDATE`-RLS-Policy auf `tracks`** (dieselbe, die
  „Fotos analysieren"/Nachbrennen nutzt). Fehlt sie, meldet der Toast „nicht
  gespeichert".
- Web Speech läuft v. a. in Chrome/Android; Firefox/Safari ggf. ohne → dann
  nur Tippen.

### Offen (Phase 2 / zu entscheiden)
- Soll „Falsch" das KI-Verdikt (Titel) **ersetzen** oder nur **zusätzlich**
  danebenstehen? Aktuell: zusätzlich (Original bleibt nachvollziehbar).
- Korrektur im Viewer (read-only Share) — bewusst ausgeklammert.
- Noch **nicht** im echten Browser verifiziert (Regel 10: Chrome nur mit
  Docs OK).

---

## 3. Idee: Voicerecorder als Capacitor-App

In `backlog.md` (auf `main`, Commit `c892a60`) festgehalten: Wenn der
Voicerecorder (`HTML/voicerecorder/`) als Capacitor-App nativ verpackt würde
(wie Tracker/Solita), gäbe es voraussichtlich Zugriff auf **alles** — volle
native Geräte-APIs (Mikro inkl. Hintergrund-Audio, Dateisystem, Berechtigungen,
ggf. On-Device-STT) statt Browser/PWA-Sandbox. Noch zu klären.

---

## 4. Regel 20 geändert (Auto-Commit+Push auf Branch)

Neue stehende Policy (Branch `claude/agent-autocommit-branch-rule`, Commit
`5404784`, noch **nicht** auf `main` gemergt):

> **Nach jeder Änderung committen UND auf den Arbeits-Branch pushen** — nie auf
> `main`, nie Force. Grund: flüchtige Container, nur Gepushtes überlebt das
> Recycling. Vorher immer Diff auf Secrets prüfen (Regel 18). `main` nur per
> PR/Merge durch Doc oder nach ausdrücklicher Einzel-Zustimmung.

Hintergrund: In der Remote-Umgebung ist uncommittete **und** committete-aber-
ungepushte Arbeit beim Container-Recycling verloren — nur GitHub (`origin`) ist
dauerhaft.

---

## Branches / Status (Stand 2026-06-17)

| Branch | Inhalt | Auf `main`? |
|---|---|---|
| `claude/plantnet-confidence-formatting-wlur7r` | Prozent-Fix (`661d426`) + Falsch-Button (`06bc8e2`) | nein — wartet auf Merge |
| `claude/agent-autocommit-branch-rule` | Regel-20-Änderung (`5404784`) | nein — wartet auf Merge |
| `main` | Capacitor-Idee in `backlog.md` (`c892a60`) | ja |

Zum Aktivieren der Features/Regel: die zwei Branches nach `main` mergen.
