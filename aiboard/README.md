# AI Board

Eine KI-Tastatur für Android, die Gboard & Co. in den Schatten stellt.

Nicht „nächstes Statistik-Wort raten" wie die üblichen Tastaturen, sondern ein
echtes Sprachmodell, das **ganze Phrasen** im **Kontext** des Feldes vorschlägt,
den **Ton** umschalten kann und DE/EN-Mischmasch versteht.

## Status

Planungs-/Vorbereitungsphase. Code folgt in Phase 0 (siehe `plan.md`).

## Eckdaten

- **Form:** eigene native Android-App (`InputMethodService` / IME, Kotlin) —
  kein HTML-Tool. Eigenes Projekt, eigene APK, lebt neben `solita-app`.
- **Basis:** Fork von **FlorisBoard** (Open Source, Apache-2.0) — Layouts,
  Wischen, Themes sind fertig; wir bauen das **Gehirn** rein.
- **KI:** Hybrid — schnelle On-Device-Schicht für Sofort-Wörter + Cloud-LLM
  (Gemini Flash über Supabase-Edge-Fn) für die schlauen Phrasen bei einer Pause.
- **Datenschutz zuerst:** Passwort-/PIN-Felder verlassen das Gerät nie, Cloud
  feuert nur bei Pause, harter „KI aus"-Schalter, server-seitig nichts gespeichert.

## Dateien

- `plan.md` — der Masterplan (Architektur, Phasen, Entscheidungen).
- `docs/architektur.md` — die vier Schichten im Detail.
- `docs/datenschutz.md` — das Datenschutz-Gate (Pflicht bei einer Tastatur).
- `docs/floris-fork.md` — Phase 0: wie wir FlorisBoard forken und bauen.
