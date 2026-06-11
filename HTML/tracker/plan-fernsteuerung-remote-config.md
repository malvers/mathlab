# Plan: App fernsteuern / live anpassen ohne Neuinstallation

> Idee/Plan von Doc (2026-06-11). **Noch nicht gebaut** (CLAUDE.md Regeln 2/4).
> Zwei Ebenen: **Code ändern** (riskanter) vs. **Config ändern** (Docs eigentliche Idee — schick & sicher).

## A. Code-Ebene — Verhalten ändern (lädt echten Code)
- **Dev:** Hot Module Replacement (Vite/webpack) — JS/CSS live tauschen, Zustand bleibt. Standard.
- **Ausgeliefert:**
  - **Service Worker** (haben wir): lädt neue Assets, übernimmt sie beim nächsten Laden.
  - **OTA-Live-Updates** für den Capacitor-Tracker: **Capgo** (Capacitor), Expo Updates (RN), CodePush
    (Original abgelöst/community) → JS/HTML/CSS in die installierte App **ohne neue APK / ohne Store**.
    Relevant wegen Samsung-Sideload-Theater.
- Charakter: mächtig, aber „echter Code" → Review/Test nötig.

## B. Config-Ebene — Aussehen/Parameter fernsteuern (DOCS IDEE) ★
Kernidee: **alles Deklarative externalisieren** — Farben, z-orderings, Schriftgrößen, Panel-Sichtbarkeit,
Schwellen (z. B. Tempo-Bing-Prozent), Texte — in eine **`config.json`**. Die App **interpretiert** sie,
kennt aber nicht „im Detail, was sie tut". Nur Präsentation/Parameter, **keine neue Logik**.

**So läuft's (genau wie Doc beschreibt):**
1. Doc sagt z. B. „Navi-Panel von Schwarz auf Grün."
2. Ich ändere **einen Wert in `config.json`**, commit + push.
3. Die App fragt im Hintergrund **alle ~30 s** „gibt's eine neue Config?" und lädt sie — **im laufenden Betrieb**.

**Eleganter Trick — CSS-Variablen:** Config-Werte auf `:root`-CSS-Variablen mappen
(`--nav-bg`, `--banner-z`, `--font-…`). Wert ändern → die **ganze App re-themed sofort, ohne Reload**.
Ein paar Dinge JS-gesteuert (Panel ein/aus, z-index, Text).

**Noch besser als 30-s-Polling:** **Supabase Realtime** (nutzen wir schon für Live-Position!) →
Config-Änderung wird **sofort gepusht**, kein Polling. Polling ist der einfache Fallback.

**Vorbilder (Standard, kein Exot):** Firebase Remote Config · LaunchDarkly · Statsig · AWS AppConfig ·
**Server-Driven UI** (Airbnb/Spotify re-themen/re-layouten so ohne App-Update).

**Caveats:**
- Config **validieren & clampen** — ein kaputter/feindlicher Wert darf die UI nicht zerlegen; Defaults als Fallback.
- Public abrufbar → **keine Secrets** in der Config (Regel 18). Nur Präsentation.
- **ETag/If-None-Match** fürs günstige Pollen; Versionsfeld in der Config.
- Quelle: GitHub-raw / Supabase-Tabelle / kleiner CDN-Endpunkt.

## Fazit
B ist die runde Sache: **CSS-Variablen-Backbone + Supabase-Realtime-Push** = Farben/Größen/Panels
**sofort & reload-frei** fernsteuerbar, ohne je eine APK anzufassen. A (Capgo-OTA) ergänzt es, wenn
mal echte **Logik** geändert werden muss. Lässt sich auch über den Tracker hinaus aufs ganze
forloop-Projekt verallgemeinern (zentrale Theme-Config).
