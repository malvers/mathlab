# NOTES — Ideen, Wünsche & Pläne (Übersicht)

> **Wozu:** Eine Landkarte über alle verstreuten Ideen-, Wunsch-, Plan- und Bug-Notizen im Repo,
> damit niemand mehr suchen muss „wo ist'n jetzt was". Diese Datei **verlinkt nur** — sie verschiebt
> oder ändert keine Originale. Wenn eine neue Notiz dazukommt, hier eine Zeile ergänzen.
> Stand: 2026-06-16 (nach dem großen .md-Aufräumen: `notes/`, `docs/solita/`, `HTML/tracker/archive/`).

**Status-Legende:**
`💡 Idee` roher Wunsch · `📐 Konzept/Plan` durchdacht, noch nicht gebaut · `🔬 Recherche` Recherche-Notiz ·
`🐞 Bug` dokumentiert & offen · `🏗️ teils gebaut` begonnen · `✅ umgesetzt` gebaut (Referenz/Historie) ·
`📚 Referenz` lebendes Nachschlage-Doc

---

## 🛰️ Tracker — offen
GPS-Tracker (`HTML/tracker/`). Einstieg/Regeln: [`HTML/tracker/agents.md`](HTML/tracker/agents.md).

| Notiz | Worum es geht | Status |
|---|---|---|
| [bugfixes.md](HTML/tracker/bugfixes.md) | **Dispatch-Queue Bugs** (subagenten-tauglich): Speed · Regenradar · Live-Broadcast · geparkte Fixes | 🐞 Arbeitsliste |
| [feature-requests.md](HTML/tracker/feature-requests.md) | **Dispatch-Queue Features** (Prio/Status): Brotkrumen · Goldene Stunde · Contact-AI/Solita … | 📐 Arbeitsliste |
| [ideen.md](HTML/tracker/ideen.md) | **Dispatch-Triage Ideen** (Prio-Board 1–20 + Konzept-Notizen); verlinkt archive/tracker-ideen.md | 💡 Arbeitsliste |
| [tracker-plan.md](archive.md) | Backlog / offene Punkte, inkl. „Erledigt"-Historie | 📚 Referenz |
| [tracker-ideen.md](HTML/tracker/archive/tracker-ideen.md) | Lose Feature-Ideen (Fahrt-Brainstorm), einzeln gesammelt | 💡 Idee |
| [cluster-konvexe-huelle-hover.md](HTML/tracker/archive/cluster-konvexe-huelle-hover.md) | Konvexe Außenhülle um das Cluster-Badge beim Maus-Hover | 💡 Idee |
| [plan-brotkrumen.md](HTML/tracker/archive/plan-brotkrumen.md) | Brotkrumen-Spur / Wegpunkte-Pfad | 📐 Konzept/Plan |
| [plan-live-video-broadcast.md](HTML/tracker/archive/plan-live-video-broadcast.md) | Live-Video durchleiten statt speichern — Transport + Kostenmodelle (P2P/SFU vs. pro Minute) | 📐 Konzept/Plan |
| [bug-live-broadcast-funktioniert-nicht.md](archive.md) | Live-Broadcast geht gerade nicht — Realtime-spezifisch (Auth/Config/Pause) | 🐞 Bug |
| [plan-contact-ai-im-tracker.md](HTML/tracker/archive/plan-contact-ai-im-tracker.md) | „Contact AI" in der App: Chat via Claude API + Agent der Repo editiert & pusht | 📐 Konzept/Plan |
| [e2e-verschluesselung-plan.md](HTML/tracker/archive/e2e-verschluesselung-plan.md) | Tracks + Fotos in Supabase nur noch als Ciphertext (à la VGP) | 📐 Konzept/Plan |
| [pflanzen-datenbanken-enrichment.md](HTML/tracker/archive/pflanzen-datenbanken-enrichment.md) | Pflanzen-DBs (POWO/GBIF/iNaturalist) zur Veredelung der Erkennung | 🔬 Recherche |
| [gps-nachbearbeitung-ppk-ppp.md](HTML/tracker/archive/gps-nachbearbeitung-ppk-ppp.md) | GPS nachträglich verbessern (PPK/PPP, GNSS-Post-Processing) | 🔬 Recherche |
| [plan-fotos-in-storage.md](archive.md) | Foto-base64 aus der DB in einen Supabase-Storage-Bucket | 📐 Konzept/Plan |
| [plan-r2-media.md](archive.md) | Medien (Foto/Voice/Video) in Cloudflare R2 + erste Bausteine | 🏗️ teils gebaut |
| [agent-name-solita.md](HTML/tracker/archive/agent-name-solita.md) | Agent-Name & Weckwort „Solita" — Begründung, Tagline, Voice-Erkennbarkeit | 💡 Idee |
| [verteilung-playstore-tester.md](HTML/tracker/verteilung-playstore-tester.md) | Verteilung: Sideload vs. Play Store, 12-Tester-Auflage, Firmenkonto-Ausnahme | 📚 Referenz |
| [wissensnotiz-llm-kompression-lebensagent.md](HTML/tracker/wissensnotiz-llm-kompression-lebensagent.md) | Wissens-Notiz: Tokens/Kompression, LLM=Kompressor, Memory-Architektur | 📚 Referenz |

## 🗄️ Tracker — Archiv (gebaut/gefixt, in `HTML/tracker/archive/`)
Code-verifiziert umgesetzt am 2026-06-16 archiviert — als Historie/Referenz, nicht mehr als Arbeitsliste.

| Notiz | Umgesetzt als | Status |
|---|---|---|
| `HTML/js/tracker-speedlimit.js` | Tempo-Limit-Schild (OSM `maxspeed` via Overpass), rot bei Übertretung | ✅ umgesetzt |
| [archive/plan-poi.md](HTML/tracker/archive/plan-poi.md) | Points of Interest → `tracker-poi.js` | ✅ |
| [archive/plan-navigation-einfach.md](HTML/tracker/archive/plan-navigation-einfach.md) | Navigation (Adresse→Route) → `tracker-nav.js` | ✅ |
| [archive/plan-tracking-vs-navigation.md](HTML/tracker/archive/plan-tracking-vs-navigation.md) | Tracking/Navigation entkoppelt → `tracker-nav.js` | ✅ |
| [archive/plan-fernsteuerung-remote-config.md](HTML/tracker/archive/plan-fernsteuerung-remote-config.md) | Remote-Config → `tracker-config.js` | ✅ |
| [archive/update-hinweis-installierte-app.md](HTML/tracker/archive/update-hinweis-installierte-app.md) | „Neue Version"-Hinweis → `app-update.js` | ✅ |
| [archive/geo-erkennung-und-voice-spur.md](HTML/tracker/archive/geo-erkennung-und-voice-spur.md) | Voice-Spur → `voice-note.js` | ✅ |
| [archive/drivecast-audio-poi-am-weg.md](HTML/tracker/archive/drivecast-audio-poi-am-weg.md) | Standort-Audio-Reiseführer (DriveCast) | ✅ |
| [archive/bug-geschwindigkeitsanzeige.md](HTML/tracker/archive/bug-geschwindigkeitsanzeige.md) | km/h vom Gate entkoppelt (Doppler, BUG-1) → `tracker.js` | ✅ gefixt |
| [archive/bug-regenradar-kein-regen.md](HTML/tracker/archive/bug-regenradar-kein-regen.md) | Regenradar live → `rain-radar.js` | ✅ gefixt |
| [archive/polish-ki-erkennt-indikator.md](HTML/tracker/archive/polish-ki-erkennt-indikator.md) | „KI erkennt"-Indikator | ✅ |
| [archive/sync-sketch.md](HTML/tracker/archive/sync-sketch.md) | Sync ohne Login (deterministisches Konto) | ✅ |
| [archive/activity-debug-morgen.md](HTML/tracker/archive/activity-debug-morgen.md) | Reisemodus/Activity — Debug-Session erledigt | ✅ |

## 🗣️ Solita
Sprach-Assistentin (`HTML/solita/`, Tools in `HTML/js/solita-*.js`). Konzepte in `docs/solita/`.

| Notiz | Worum es geht | Status |
|---|---|---|
| [solita-notizen.md](solita-notizen.md) | Docs gespeicherte Solita-Notizen — **liest das Live-Tool `read_notes`** (feste raw-URL, nicht verschieben!) | ✅ live |
| [docs/solita/solita-gespraech-konzept.md](docs/solita/solita-gespraech-konzept.md) | Gesprächskonzept / Persönlichkeit | 📚 Referenz |
| [docs/solita/solita-stufe2-aktivierung.md](archive.md) | „Actionable" Stufe 2 — Tool-Use-Aktivierung | 📚 Referenz |
| [docs/solita/solita-vosk-hybrid.md](docs/solita/solita-vosk-hybrid.md) | Always-on Vosk-Hybrid (Weckwort nativ) | 📚 Referenz |
| [docs/solita/solita-vosk-wakeword.md](archive.md) | Vosk-Weckwort „Solita" — Grammar-Trick, Selbsthör-Blocker | 📚 Referenz |
| [docs/solita/solita-mail-senden-analyse.md](docs/solita/solita-mail-senden-analyse.md) | Analyse: Mail-Senden-Tool (Smart-Quote/Längen-Diagnose) | 📚 Referenz |
| [krass-app/wakeword-solita-erkennung.md](archive.md) | Weckwort zuverlässig erkennen — Vosk-Wortliste vs. eigene Stimme | 💡 Idee |

## 🔔 Glocken
Glocken-Lab (`HTML/glocken/`, `HTML/glocken.html`).

| Notiz | Worum es geht | Status |
|---|---|---|
| [plan-morgen.md](archive.md) | AI-Tutor „Khwārizmī": adaptiv kgV üben & Brüche addieren/subtrahieren | 📐 Konzept/Plan |
| [glocken-tutor-lob.md](HTML/glocken-tutor-lob.md) | Wo & wie der kgV-Tutor lobt — coole Ausrufe ergänzen | 📚 Referenz |

## 🕐 World Clock
| Notiz | Worum es geht | Status |
|---|---|---|
| [clockwise-flip.md](archive.md) | Toggle für Uhrzeigersinn (CW) statt CCW — was dafür nötig wäre | 💡 Idee |

## 🌐 Cross-Lab & Visionen
| Notiz | Worum es geht | Status |
|---|---|---|
| [IDEAS.md](IDEAS.md) | Neue eigenständige Lab-Ideen (Sierpinski, Newton-Fraktal …) **+ Cross-Lab-Visionen** (Morph↔OCR, Handschrift→LaTeX; vormals TRAUM.md) | 💡 Idee |

## 🎒 Backlog & Wünsche (projektübergreifend)
| Notiz | Worum es geht | Status |
|---|---|---|
| [HTML/tracker/archive/backlog.md](HTML/tracker/archive/backlog.md) | Offene Wünsche quer übers Projekt (Karten-PIN, PlantNet <20 %, Route Ulfladen …); markiert Gebautes | 🎒 Backlog |

## 📚 Index & Projektweit
| Notiz | Worum es geht | Status |
|---|---|---|
| [LABS.md](LABS.md) | Index aller Labs & Tools (nach Themengebiet) | 📚 Referenz |

> **Hinweis:** `AUDIT.md` wurde am 2026-06-16 aus dem Repo entfernt (re-leakte entschlüsselte Secrets).
> Die Secrets stecken weiter in der git-History → **Key-Rotation** ist der eigentliche Fix (WP-1 offen).
> Der Auslöser-Brief liegt archiviert: [notes/global-check-forloop-2026-06-07.md](archive.md).

## 📒 Handover-Notizen (datiert, in `notes/`)
Tages-/Fahrt-Notizen und Stände — Historie, keine Arbeitsliste.

| Notiz | Worum es geht |
|---|---|
| [notes/notiz-2026-06-16.md](archive.md) | Navigation: Punkt mitführen, sofort Fadenkreuz, Zieleingabe überarbeiten |
| [notes/notiz-2026-06-15-wuensche-und-backfixes.md](notes/notiz-2026-06-15-wuensche-und-backfixes.md) | Wünsche + Backfixes 15.06. |
| [notes/notiz-2026-06-14.md](notes/notiz-2026-06-14.md) | Tagesnotiz 14.06. |
| [notes/notiz-2026-06-13.md](archive.md) | Tagesnotiz 13.06. |
| [notes/fahrt-bad-homburg-2026-06-10.md](archive.md) | Fahrt-Notizen Bad Homburg 10.06. |
| [notes/stand-branch-cleanup-2026-06-16.md](archive.md) | Stand: Branch-Cleanup (9 Branches gelöscht, Notizen gesichert) |
| [notes/global-check-forloop-2026-06-07.md](archive.md) | Der Brief/Auftrag zum globalen Check (führte zu AUDIT) |

## 💬 Gespräche (Quellen für Ideen)
Längere Dialoge Doc ↔ Claude — Fundgrube, aus der die obigen Ideen teils stammen.

| Notiz | Worum es geht | Status |
|---|---|---|
| [unterhaltung-lernidee.md](HTML/unterhaltung-lernidee.md) | Über Lernen, Mathe und was Kids wirklich begeistert (30.–31. Mai 2026) | 📚 Referenz |
| [unterhaltung-reiseidee.md](HTML/unterhaltung-reiseidee.md) | Über eine App zum Reisen planen (31. Mai 2026) | 📚 Referenz |

---

## Nicht hier (bewusst ausgelassen)
Regeln & Identität sind **keine** Ideen/Wünsche und bleiben unangetastet — nur als Wegweiser:
[`CLAUDE.md`](CLAUDE.md) (Kopf-Regeln) · [`SOUL.md`](SOUL.md) (Herz-Regeln) ·
[`HTML/tracker/agents.md`](HTML/tracker/agents.md) (Tracker-Onboarding) ·
[`allowance.md`](allowance.md) (was der Agent autonom darf).
