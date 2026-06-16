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

## Konfig-Schema — was alles fernsteuerbar wäre (hierarchisch)
Geerdet an echten DOM-Elementen. Jeder Knoten = ein paar Werte (Farbe / Größe / Position / z-Index /
Sichtbarkeit / Font). „20 % höher" = `scale: 1.2`; „nach Süden" = `offsetY` erhöhen; „ganz nach unten"
= kleiner `zIndex`.

```jsonc
{
  "version": 7,
  "theme": {
    "colors": {                    // zentrale Palette (CLAUDE.md) — überall referenziert
      "orange": "rgb(245,194,66)",  // λ  ← „mach das Orange zu …"
      "red":    "rgb(176,36,24)",   // Υ
      "green":  "rgb(121,158,49)",  // φ
      "routeBlue":   "#4285F4",      // Navi-Linie
      "navBannerBg": "#188038"       // Navi-Banner-Hintergrund
    },
    "fonts": { "display": "Orbitron", "body": "system-ui", "scale": 1.0 }  // globaler Schrift-Faktor
  },

  "head": {                        // #hud-top (Kopf-Panel)
    "visible": true,
    "bgOpacity": 0.95,
    "clock":  { "visible": true, "color": "#fff", "scale": 1.0 },   // #hud-time
    "stats": {                                                       // #hud-stats
      "distance": { "visible": true, "label": "DISTANCE KM", "color": "#fff", "scale": 1.0 },
      "speed":    { "visible": true, "label": "SPEED KM/H",  "color": "#fff", "scale": 1.0 },
      "altitude": { "visible": true, "label": "Höhe m",      "color": "#fff", "scale": 1.0 },
      "modeIcon": { "visible": true }                                // 📍 #mode-icon
    }
  },

  "fabs": {                        // Floating-Buttons
    "sizeScale": 1.0,              // ← „mach die 20 % größer" = 1.2
    "left":  { "menu":   { "visible": true } },                      // #menu-fab
    "right": { "camera": { "visible": true },                        // #cam-fab
               "mic":    { "visible": true },                        // #mic-fab
               "video":  { "visible": true } },                      // #vid-fab
    "recenter": { "visible": true }                                  // #recenter-fab
  },

  "navBanner": {                   // #nav-banner (Abbiege-Karte)
    "bg": "#188038", "textColor": "#fff", "scale": 1.0,
    "zIndex": 480,                 // ← „z-Order ganz nach unten" = kleiner machen
    "offsetX": 0, "offsetY": 96    // ← „ein Stück nach Süden" = offsetY hoch
  },

  "speedSign": {                   // #speed-sign
    "visible": true, "scale": 1.0, "corner": "top-left",
    "ringColor": "rgb(176,36,24)", "overScale": 1.35
  },

  "compass": { "visible": true, "scale": 1.0, "corner": "top-right" }, // #compass

  "route":   { "color": "#4285F4", "weight": 6, "casingColor": "rgba(8,20,42,.55)", "casingWeight": 11 },

  "controls": { "scale": 1.0 },    // #trk-controls (START/STOP/LÖSCHEN)

  "params": {                      // Parameter (kein Aussehen, aber fernsteuerbar)
    "speedBingPercent": 10,        // Tempo-Warnton ab … % drüber
    "offrouteMeters": 45,          // Re-Routing-Schwelle
    "idleHideSeconds": 8,          // Auto-Hide-Zeit
    "speedLimitPollSeconds": 5     // Tempolimit-Abrufrate
  }
}
```

**Umsetzung:** Die meisten Knoten → **CSS-Variablen** auf `:root` (`--orange`, `--nav-bg`, `--nav-z`,
`--fab-scale` …). Position/Sichtbarkeit/z-Index = ein paar gezielte Variablen + minimal JS. Ein
zentraler `applyConfig(cfg)` setzt alles. **Sofort, ohne Reload.**

## Wie erfährt die App von einer geänderten Config? (proaktiv vs. gucken)
- **Proaktiv (Push) — der schöne Weg:** **Supabase Realtime** (habt ihr schon). App abonniert einen
  `config`-Channel; ändert sich die Config-Zeile, kommt sie **sofort** rein. **Kein ständiges Gucken.**
- **Polling, aber schlau:** alle ~30 s ein **ETag/If-None-Match**-Check → unverändert ⇒ Server antwortet
  **`304 Not Modified`, kein Download** (winziger Heartbeat, nicht „gucken-gucken-gucken" mit Volllast).
  Oder nur **bei App-Fokus** (`visibilitychange`) prüfen.
- **Empfehlung:** Supabase Realtime für instant; ETag-Poll als Fallback offline/ohne Realtime.

## Committen/Pushen aus der Agent-Umgebung
- **Ja — kann ich, mache ich die ganze Session** (Commits + Push auf den Branch). „Push das" reicht.
- Disziplin: ich pushe auf den **Feature-Branch**, nicht ungefragt auf `main`. Für die **Live-Wirkung**
  muss die `config.json` dort liegen, wo die App liest (→ `main`/GitHub-Pages **oder** eine Supabase-
  Tabelle). Heißt: „grün machen" = Config ändern → push/Update an die Lese-Quelle → App zieht's.

## Fazit
B ist die runde Sache: **CSS-Variablen-Backbone + Supabase-Realtime-Push** = Farben/Größen/Panels
**sofort & reload-frei** fernsteuerbar, ohne je eine APK anzufassen. A (Capgo-OTA) ergänzt es, wenn
mal echte **Logik** geändert werden muss. Lässt sich auch über den Tracker hinaus aufs ganze
forloop-Projekt verallgemeinern (zentrale Theme-Config).
