# Tracker — Bug: Geschwindigkeitsanzeige stimmt nicht

> Beobachtung von Doc: Die km/h-Anzeige ist offensichtlich falsch. Vermutung: hängt mit dem
> Jitter-/Bewegungs-Gate zusammen. **Hier dokumentiert, noch nicht gefixt** (Regeln 2/4).
> Stand: 2026-06-08.

## Wo die Geschwindigkeit berechnet wird
`onPosition()` in `tracker.html:547`, Speed-Block `:612-624`:
```
let kmh = 0;
if (!still) {
    if (speed != null && speed >= 0) kmh = speed * 3.6;     // GPS-Doppler-Speed (gut)
    else if (lastFix) { ... haversine/dt * 3.6 }            // Fallback aus Distanz/Zeit
    if (kmh > MAX_JUMP_KMH) kmh = 0;
}
shownSpeed = still ? 0 : (0.6 * shownSpeed + 0.4 * kmh);    // EMA-Glättung
setSpeed(shownSpeed);
```
Derselbe `shownSpeed` wird auch **pro Punkt gespeichert** (`spdVal`, `tracker.html:633`) → das
Speed-Profil der Aufzeichnung erbt den Fehler mit, nicht nur die Live-Anzeige.

## Docs Vermutung bestätigt: das Gate ist beteiligt
„Jitter-Guide" = das **Bewegungs-Gate** `still = sensorStill || posStill` (`tracker.html:579`).
Wenn `still` wahr ist, wird `shownSpeed` **hart auf 0** gesetzt (`:623`). Zwei Quellen:

1. **`posStill`** (`tracker.html:573-578`) — der neue Fix liegt innerhalb eines
   genauigkeits-skalierten Bands um den angezeigten Punkt:
   `band = max(MIN_MOVE_M=4 m, accuracy * 0.7)`.
   → Bei mäßiger Genauigkeit (z. B. ±20 m) ist das Band **14 m**. Beim **langsamen Gehen** wandern
   aufeinanderfolgende Fixes oft weniger als 14 m → `posStill = true` → **Speed wird auf 0 gezwungen,
   obwohl man läuft.** Sehr wahrscheinlich die Hauptursache für „zeigt 0 / springt".

2. **`sensorStill`** (`tracker.html:567`) — Beschleunigungssensor sagt „still" UND kein
   `gpsMoving`. `gpsMoving` greift erst über **`SPEED_MOVE_KMH = 4`** (`:392,566`). → Unter ~4 km/h
   (Spaziertempo!) überschreibt GPS das Gate nicht; bei ruhiger Hand/Gehweise liest der Sensor „still"
   → Speed 0.

## Zweiter, gegenläufiger Effekt
- **Fallback-Speed bläht bei Jitter auf:** ist `pos.coords.speed` `null` (manche Geräte / das
  BgGeo-Plugin liefern keinen Doppler-Speed), greift `haversine/dt` (`:617-619`). Bei kleinem `dt`
  und GPS-Zickzack wird die Strecke überschätzt → **Speed zu hoch / Spikes**, sobald das Gate gerade
  *nicht* greift.
- **EMA ist asymmetrisch & taktabhängig:** `shownSpeed` snappt bei `still` sofort auf 0, rampt beim
  Losgehen aber nur mit `0.4`-Gewicht hoch (`:623`) → Anzeige hängt nach und liegt tendenziell zu
  niedrig. Das Gewicht ist **pro Fix**, nicht pro Zeit → bei unregelmäßiger Fix-Frequenz schwankt die
  Glättung.

**Netto:** Die Anzeige ist in *beide* Richtungen unzuverlässig — beim langsamen Gehen **0/zu niedrig**
(Gate), beim fehlenden Doppler-Speed **zu hoch/Spikes** (Jitter-Fallback).

## Hypothesen, nach Wahrscheinlichkeit
1. **`posStill`-Band zu groß** bei schlechter Accuracy → erstickt langsames Gehen (Speed 0).
2. **`SPEED_MOVE_KMH = 4` zu hoch** → Gate killt Sub-4-km/h-Bewegung.
3. **Fehlender `coords.speed`** → Jitter-Fallback überschätzt.
4. **EMA-Glättung** verzerrt zusätzlich (Nachlauf + taktabhängig).

## Vorschläge zum Prüfen/Fixen (noch NICHT umsetzen)
- **Erst messen:** In `updateMotionDbg` (Aufrufe `:589,604,656`) bzw. via `DebugWindow.log` pro Fix
  ausgeben: roher `coords.speed`, abgeleiteter `kmh`, `still`/`posStill`/`sensorStill`, `accuracy`,
  `band`, `dt`. Dann sieht man sofort, ob (a) der Doppler-Speed fehlt oder (b) das Gate fälschlich
  „still" sagt.
- **Speed von der Anzeige entkoppeln:** Den **rohen GPS-Doppler-Speed** anzeigen (wenn vorhanden),
  unabhängig vom `still`-Gate — das Gate soll nur das **Track-Aufzeichnen** unterdrücken, nicht die
  km/h-Zahl. Nur wenn `coords.speed` fehlt, geglätteten Fallback nutzen.
- **`posStill` für die Speed-Logik lockern** oder Speed nicht an `posStill` koppeln.
- **EMA zeitbasiert** machen (Gewicht aus `dt`) statt pro Fix.
- **`SPEED_MOVE_KMH`** überdenken (z. B. 2 km/h), oder Gehen separat behandeln.

## Betroffene Stellen (Kurzliste)
`tracker.html:392` (`SPEED_MOVE_KMH`) · `:566-579` (Gate/`still`/`posStill`) · `:612-624`
(Speed-Berechnung + EMA) · `:633` (gespeicherter Speed pro Punkt) · `:589,604,656`
(`updateMotionDbg`-Hooks).

---

## ✅ Verifiziert am 2026-06-08 + Plan für morgen

**Gegen den Live-Code geprüft** (die Zeilen oben waren verrutscht — aktuelle Stände):
- `onPosition()` `:614` · Gate `still = sensorStill || posStill` `:646` · posStill-Band `:643-644`
  (`band = max(MIN_MOVE_M, accuracy·ACC_STEP_FACTOR)`) · gpsMoving-Schwelle `:633` ·
  Speed-Block + EMA `:679-691` · **Speed-Kill `shownSpeed = still ? 0 : …` `:690`** ·
  gespeicherter `spdVal` `:700`.
- Konstanten bestätigt (`:446-459`): `MIN_MOVE_M=4`, `MAX_ACC_M=50`, `MAX_JUMP_KMH=300`,
  `ACC_STEP_FACTOR=0.7`, `SPEED_MOVE_KMH=4`.

**Ursache, hart belegt (3 Mechanismen):**
1. **Speed hängt am Aufzeichnungs-Gate** (`:690`). Das Gate soll nur Positions-Jitter im Stand
   unterdrücken, nullt aber zusätzlich die Anzeige-Zahl — Konstruktionsfehler.
2. **posStill-Band beim Gehen riesig:** ±20 m → 14 m, bei noch akzeptierten ±50 m → 35 m. Langsame
   Schritte bleiben im Band → `still=true` → Speed 0 *und* kein Punkt, bis ein ganzes Band gelaufen
   ist → „zeigt 0 / springt".
3. **Sub-4-km/h überschreibt das Gate nicht** (`SPEED_MOVE_KMH=4`); Gehen ≈ 3–5 km/h.

**Beschlossene Richtung — Speed-Anzeige vom Gate ENTKOPPELN:**
- Bevorzugt rohen GPS-Doppler `coords.speed × 3.6` zeigen, **unabhängig vom `still`-Gate**
  (Doppler misst Geschwindigkeit direkt, ist auch im Rausch-Band korrekt).
- Nur wenn Doppler fehlt → geglätteter Distanz/Zeit-Fallback. Im Stand ist Doppler ≈ 0, die Zahl
  fällt von selbst auf 0 → der harte Gate-Kill ist überflüssig. **Regressionsfrei:** fehlt Doppler,
  bleibt es beim heutigen Verhalten.

**ZUERST messen (Regel „nie raten"):** pro Fix ins **DEBUG-Fenster** loggen (`DebugWindow.log`,
NICHT console): `coords.speed`, abgeleitetes kmh, `still`/`posStill`/`sensorStill`, accuracy, band,
dt. 30 s gehen → die EINE offene Frage klären: **liefert Pixel 8a / Lenovo überhaupt `coords.speed`?**
- Doppler **da** → Entkopplung reicht.
- Doppler **null** → Fallback-Pfad fixen: posStill von der Speed-Logik lösen, `SPEED_MOVE_KMH` ~2,
  EMA zeitbasiert (Gewicht aus `dt` statt pro Fix).

**Noch zu entscheiden (separat vom Display-Fix):** posStill schluckt langsames Gehen auch aus dem
AUFGEZEICHNETEN Track (grobe ~band-weite Sprünge), nicht nur aus der Anzeige. Display zuerst;
Aufzeichnungs-Granularität getrennt — Risiko: Jitter im echten Stand wieder reinholen.

**Reihenfolge morgen:**
1. DEBUG-Logging pro Fix einbauen → 30 s gehen → ablesen.
2. Je nach Doppler-Befund: Entkopplung (`:679-691`) ODER Fallback-Pfad fixen.
3. `spdVal` (`:700`) erbt den neuen Wert → das gespeicherte Speed-Profil wird automatisch mit korrekt.
4. Logging danach wieder raus (oder hinter ein Debug-Flag).
