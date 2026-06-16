# Tracker — Activity-Erkennung: morgen weiter

Stand 2026-06-05. Frage: Reisemodus-Icon (laufen/fahren) wirkt nur speed-basiert.

## Was schon drin ist
- Activity-Diagnose über zentrale `DebugWindow.log()` — in `tracker.html`, Funktion `startActivity()` (~Zeile 2886).
- **Kein APK-Neubau nötig**: `tracker.html` lädt live (Plan A, docalvers.de).

## Morgen: Test
1. `tracker.html` **pushen**.
2. App am Pixel **kalt** neu starten.
3. Tracking starten, ein Stück **fahren** (auch langsam).
4. **DEBUG-Window** lesen.

## Log lesen → Diagnose
Im DEBUG-Window erscheinen `🚶`-Zeilen:
- `requestPermission → granted=true/false`
- `ActRec.start ✓ — warte auf Events …`  ODER  `ActRec FEHLER: …`
- `ActRec event: type=… conf=…` (pro Event vom Play-Services-API)

Drei mögliche Befunde:
- **`start ✓` aber NIE ein `event`** → API streamt nicht. Echte Ursache wahrscheinlich native:
  `RECEIVER_NOT_EXPORTED` in `ActivityRecognitionPlugin.java:100` blockiert evtl. den
  Play-Services-Broadcast (Android 14+). Fix native → dann **ein gezielter APK-Build**.
- **`event`s kommen, aber `type=on_bicycle/walking` beim Autofahren** → Play Services
  klassifiziert Langsamfahrt schlecht. Fix im JS: Speed-Korrektur
  (z.B. API sagt on_bicycle, aber Speed > 25 km/h über X s → in_vehicle).
- **`FEHLER: …`** → Meldung sagt direkt, was klemmt.

## Hintergrund (alles verifiziert, strukturell vollständig)
- Dependency `play-services-location:21.3.0` vorhanden (build.gradle)
- Permission `ACTIVITY_RECOGNITION` im Manifest
- Plugin registriert (MainActivity.java:12)
- JS ruft `startActivity()` beim Tracking-Start (tracker.html:1805)
- Permission wurde am Gerät erteilt (Doc bestätigt) → Grund „nie gefragt" fällt raus.

## Nebenbei: Outdoor-Zugang steht
claude.ai/code → „Continue on web" → Cloud → Repo **mathlab** (= lokal forloop), GitHub App installiert.
Von unterwegs beschreiben → Cloud-Agent committet → am Mac `git pull`.
