# Code-Metriken — Hotspot-Refactor (tracker + solita)

**Datum:** 2026-06-19
**Scope:** Die drei komplexesten Funktionen in `HTML/js/` zerlegt — reines *Extract-Function*, **keine Logikänderung**.
**Methodik:** Komplexität gemessen mit echtem AST-Parser (`acorn`, ES2022+) pro Funktion: zyklomatische (McCabe) + kognitive (SonarSource-Modell) Komplexität, max. Verschachtelung, LOC. Anwendung via AST-Splice (exakte Node-Offsets), danach `node --check` + `eslint` (0 errors) + adversarischer Verify-Workflow (12 Reviewer × 4 Lenses + Schiedsrichter → **SHIP, 0 Divergenzen**).

> Kognitiv-Faustregel: > 25 = Refactor-Kandidat (🔴), > 15 = erhöht (🟠).

## Vorher → Nachher

| Funktion | Datei | kognitiv vorher | nachher (Orchestrator) | max. Nesting |
|---|---|---:|---:|---:|
| `onPosition`  | tracker.js     | **102** 🔴 | **4** | 5 → 1 |
| `sendMessage` | solita-core.js | **53** 🔴 | **4** | (dispatch) → 1 |
| `send`        | solita-brain.js| **50** 🔴 | **2** | 5 → 1 |

Alle drei sind aus der Hotspot-Liste verschwunden. Die Orchestratoren lesen sich jetzt als ~20-zeiliges Inhaltsverzeichnis ihrer Pipeline.

### `onPosition` (tracker.js) — GPS-Watch-Callback, 13 Phasen
| Helfer | kognitiv | zyklo | nest | LOC |
|---|---:|---:|---:|---:|
| updateGpsReal | 3 | 4 | 0 | 7 |
| computeMovementGate | 10 | 11 | 1 | 25 |
| renderInitialFix | 2 | 3 | 1 | 7 |
| rejectNoisyFix | 2 | 3 | 1 | 9 |
| rejectTeleportFix | 9 | 6 | 3 | 18 |
| computeAndDisplaySpeed | 15 | 12 | 3 | 38 |
| computeBearing | 7 | 7 | 2 | 10 |
| recordTrackPoint | 13 | 9 | 3 | 27 |
| updateAutoFollow | 8 | 7 | 2 | 13 |
| **updateFitMode** | **25** 🔴 | 13 | 5 | 19 |
| updateNavigationAndDebug | 4 | 5 | 1 | 7 |
| **onPosition (Orchestrator)** | **4** | 5 | 1 | 21 |

### `sendMessage` (solita-core.js) — Chat-Eingabe-Dispatch
| Helfer | kognitiv | zyklo | nest | LOC |
|---|---:|---:|---:|---:|
| normalizeVoiceCommand | 3 | 3 | 2 | 11 |
| handleBuiltInCommands | 15 | 12 | 2 | 74 |
| checkAuthAndReturnPwd | 1 | 2 | 1 | 8 |
| handleConfigOrUiMode | 17 🟠 | 15 | 2 | 38 |
| postConfigInstruction | 11 | 8 | 3 | 28 |
| executeChatSend | 0 | 1 | 0 | 7 |
| **sendMessage (Orchestrator)** | **4** | 5 | 1 | 21 |

### `send` (solita-brain.js) — Brain-Turn / Tool-Loop
| Helfer | kognitiv | zyklo | nest | LOC |
|---|---:|---:|---:|---:|
| checkDailyCapAtStart | 1 | 2 | 1 | 9 |
| callModel | 15 | 7 | 4 | 15 |
| executeToolRound | 7 | 6 | 2 | 14 |
| runToolUseLoop | 13 | 11 | 2 | 23 |
| finalizeAndSave | 0 | 1 | 0 | 10 |
| **send (Orchestrator)** | **2** | 3 | 1 | 17 |

## Beim Review abgefangene Bugs (in den Auto-Vorschlägen, vor dem Anwenden korrigiert)
1. `rejectTeleportFix` nutzte `accuracy` ohne Parameter → `ReferenceError`. Param ergänzt.
2. `lastFix` wurde fälschlich an `if (recorded)` gekoppelt — Original re-baselined bei **jedem** akzeptierten Fix. Wieder unbedingt.
3. solita-brain: `pwd` pro Iteration neu via `getPwd()` statt einmal gecaptured. Einmal + durchgereicht.
4. solita-core `/ui`: `await renderUiList()` war in detached `.then()` umgewandelt. `await`-Semantik erhalten.

## Noch offen / Kandidaten (nicht angefasst)
- `updateFitMode` (kognitiv 25, nest 5): die bidirektionale FIT-Mode-Hysterese. Ließe sich weiter splitten (`all`- vs `remaining`-Zweig), ist aber eine kohärente Einheit.
- Unberührte Hotspots: `Brain` (Konstruktor, 25), `execTool` (24), `getWeather` (24), `accountUsage` (16) — waren nicht Teil des Auftrags.
- Pre-existing: `fmtDur` doppelt deklariert in tracker.js (Z. 324 `fmtDur(ms)` + Z. 2584 `fmtDur(s)` — verschiedene Signaturen, kein triviales Dedup).
