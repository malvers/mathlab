# NOTES — Ideen, Wünsche & Pläne (Übersicht)

> **Wozu:** Eine Landkarte über alle verstreuten Ideen-, Wunsch-, Plan- und Bug-Notizen im Repo,
> damit niemand mehr suchen muss „wo ist'n jetzt was". Diese Datei **verlinkt nur** — sie verschiebt
> oder ändert keine Originale. Wenn eine neue Notiz dazukommt, hier eine Zeile ergänzen.
> Stand: 2026-06-10.

**Status-Legende:**
`💡 Idee` roher Wunsch · `📐 Konzept/Plan` durchdacht, noch nicht gebaut · `🔬 Recherche` Recherche-Notiz ·
`🐞 Bug` dokumentiert & offen · `🏗️ teils gebaut` begonnen · `✅ umgesetzt` gebaut (Referenz/Historie) ·
`📚 Referenz` lebendes Nachschlage-Doc

---

## 🛰️ Tracker
GPS-Tracker (`HTML/tracker/`). Einstieg/Regeln: [`HTML/tracker/agents.md`](HTML/tracker/agents.md).

| Notiz | Worum es geht | Status |
|---|---|---|
| [tracker-plan.md](HTML/tracker/tracker-plan.md) | Backlog / offene Punkte, inkl. „Erledigt"-Historie | 📚 Referenz |
| [cluster-konvexe-huelle-hover.md](HTML/tracker/cluster-konvexe-huelle-hover.md) | Konvexe Außenhülle um das Cluster-Badge beim Maus-Hover | 💡 Idee |
| [drivecast-audio-poi-am-weg.md](HTML/tracker/drivecast-audio-poi-am-weg.md) | Standort-getriggerter Audio-Reiseführer („WegCast", Vorbild Blitzer.de DriveCast) | 💡 Idee |
| [plan-navigation-einfach.md](HTML/tracker/plan-navigation-einfach.md) | Einfache Navigation: Adresse → Route, START navigiert + trackt (Radial-Eintrag „ZIEL") | 🏗️ teils gebaut |
| [plan-tracking-vs-navigation.md](HTML/tracker/plan-tracking-vs-navigation.md) | Tracking & Navigation entkoppeln (Navi beenden ≠ Track beenden); Vorschläge A/B/C | 📐 Konzept/Plan |
| [polish-ki-erkennt-indikator.md](HTML/tracker/polish-ki-erkennt-indikator.md) | „KI erkennt"-Roboter (🤖) durch schönen On-Brand-Indikator ersetzen | 💡 Idee |
| [tracker-ideen.md](HTML/tracker/tracker-ideen.md) | Lose Feature-Ideen (Fahrt-Brainstorm), einzeln gesammelt | 💡 Idee |
| [plan-live-video-broadcast.md](HTML/tracker/plan-live-video-broadcast.md) | Live-Video durchleiten statt speichern — Transport + Kostenmodelle (P2P/SFU vs. pro Minute) | 📐 Konzept/Plan |
| [plan-fernsteuerung-remote-config.md](HTML/tracker/plan-fernsteuerung-remote-config.md) | App live fernsteuern: Remote-Config (Farben/z-order/Panels) via CSS-Variablen + Supabase-Realtime; OTA via Capgo | 📐 Konzept/Plan |
| [plan-contact-ai-im-tracker.md](HTML/tracker/plan-contact-ai-im-tracker.md) | „Contact AI" in der App: Chat via Claude API + Agent (Routines/SDK) der Repo editiert & pusht | 📐 Konzept/Plan |
| `HTML/js/tracker-speedlimit.js` | Tempo-Limit-Schild der aktuellen Straße (OSM `maxspeed` via Overpass), rot bei Übertretung | ✅ umgesetzt |
| [bug-geschwindigkeitsanzeige.md](HTML/tracker/bug-geschwindigkeitsanzeige.md) | km/h-Anzeige stimmt nicht (Jitter-/Bewegungs-Gate) | 🐞 Bug |
| [bug-regenradar-kein-regen.md](HTML/tracker/bug-regenradar-kein-regen.md) | Regenradar zeigt in DE keinen Regen (DWD leer/stale, kein RainViewer-Fallback innerhalb Abdeckung) | 🐞 Bug |
| [activity-debug-morgen.md](HTML/tracker/activity-debug-morgen.md) | Reisemodus/Activity-Erkennung — Test- & Debug-Plan | 📐 Konzept/Plan |
| [e2e-verschluesselung-plan.md](HTML/tracker/e2e-verschluesselung-plan.md) | Tracks + Fotos in Supabase nur noch als Ciphertext (à la VGP) | 📐 Konzept/Plan |
| [geo-erkennung-und-voice-spur.md](HTML/tracker/geo-erkennung-und-voice-spur.md) | Geo-gestützte Foto-Erkennung + Sprach-Nachrichten am Track | 📐 Konzept/Plan |
| [pflanzen-datenbanken-enrichment.md](HTML/tracker/pflanzen-datenbanken-enrichment.md) | Pflanzen-DBs (POWO/GBIF/iNaturalist) zur Veredelung der Erkennung | 🔬 Recherche |
| [gps-nachbearbeitung-ppk-ppp.md](HTML/tracker/gps-nachbearbeitung-ppk-ppp.md) | GPS nachträglich verbessern (PPK/PPP, GNSS-Post-Processing) | 🔬 Recherche |
| [plan-fotos-in-storage.md](HTML/tracker/plan-fotos-in-storage.md) | Foto-base64 aus der DB in einen Supabase-Storage-Bucket | 📐 Konzept/Plan |
| [plan-r2-media.md](HTML/tracker/plan-r2-media.md) | Medien (Foto/Voice/Video) in Cloudflare R2 + erste Bausteine | 🏗️ teils gebaut |
| [update-hinweis-installierte-app.md](HTML/tracker/update-hinweis-installierte-app.md) | „Neue Version verfügbar"-Hinweis für installierte Nutzer | 📐 Konzept/Plan |
| [sync-sketch.md](HTML/tracker/sync-sketch.md) | Sync-Code: geteilte Identität ohne Login (deterministisches Konto) | ✅ umgesetzt |

## 🔔 Glocken
Glocken-Lab (`HTML/glocken/`, `HTML/glocken.html`).

| Notiz | Worum es geht | Status |
|---|---|---|
| [plan-morgen.md](HTML/plan-morgen.md) | AI-Tutor „Khwārizmī": adaptiv kgV üben & Brüche addieren/subtrahieren | 📐 Konzept/Plan |
| [glocken-tutor-lob.md](HTML/glocken-tutor-lob.md) | Wo & wie der kgV-Tutor lobt — coole Ausrufe ergänzen | 📚 Referenz |

## 🕐 World Clock
| Notiz | Worum es geht | Status |
|---|---|---|
| [clockwise-flip.md](HTML/worldclock/clockwise-flip.md) | Toggle für Uhrzeigersinn (CW) statt CCW — was dafür nötig wäre | 💡 Idee |

## 🌐 Cross-Lab & Visionen
| Notiz | Worum es geht | Status |
|---|---|---|
| [TRAUM.md](TRAUM.md) | Verbindungen zwischen bestehenden Labs (z. B. Morph ↔ OCR-Bridge) | 💡 Idee |
| [IDEAS.md](IDEAS.md) | Sammlung neuer, eigenständiger Lab-Ideen (Sierpinski, Newton-Fraktal …) | 💡 Idee |

## 🏗️ Projektweit (Audit & Refactor)
| Notiz | Worum es geht | Status |
|---|---|---|
| [AUDIT.md](AUDIT.md) | Globaler Audit & Refactor-Plan (file:line-belegte Funde) | 📐 Konzept/Plan |
| [Global check forloop.md](HTML/Global%20check%20forloop.md) | Der Brief/Auftrag, der zu AUDIT.md geführt hat | ✅ umgesetzt |
| [LABS.md](LABS.md) | Index aller Labs & Tools (nach Themengebiet) | 📚 Referenz |

## 💬 Gespräche (Quellen für Ideen)
Längere Dialoge Doc ↔ Claude — Fundgrube, aus der die obigen Ideen teils stammen.

| Notiz | Worum es geht | Status |
|---|---|---|
| [unterhaltung-lernidee.md](HTML/unterhaltung-lernidee.md) | Über Lernen, Mathe und was Kids wirklich begeistert (30.–31. Mai 2026) | 📚 Referenz |
| [unterhaltung-reiseidee.md](HTML/unterhaltung-reiseidee.md) | Über eine App zum Reisen planen (31. Mai 2026) | 📚 Referenz |

---

## Nicht hier (bewusst ausgelassen)
Regeln & Identität sind **keine** Ideen/Wünsche und bleiben unangetastet — nur als Wegweiser:
[`CLAUDE.md`](CLAUDE.md) (Kopf-Regeln) · [`SOULD.md`](SOULD.md) (Herz-Regeln) ·
[`HTML/tracker/agents.md`](HTML/tracker/agents.md) (Tracker-Onboarding) ·
[`allowance.md`](allowance.md) (was der Agent autonom darf).
