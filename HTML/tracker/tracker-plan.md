# Tracker — Backlog / offene Punkte (Stand 2026-06-04, nach Web-Test)

## ✅ Erledigt (2026-06-04)
- #1 (Web-Teil): POSITION oben **zentriert**, Genauigkeit **±X m dahinter** im Chip; GENAU-Box unten raus.
- #2: Wort „DAUER" weg, Uhr `0:00:00` bleibt.
- #3: Wort „TEMPO" weg, Geschwindigkeitswert bleibt (Label „KM/H").
- #6: Map-`doubleClickZoom` aus + Tap auf Uhr gekapselt → Doppel-Tap stört die Karte nicht mehr.
- Quellen-Label (geschätzt aus Accuracy): GPS/WLAN/FUNK im POSITION-Chip.
- Status-Zeile entfernt → stattdessen transienter Toast für Aktions-Feedback.
- #4 Supabase: Client + Anon-Auth + Tabelle `tracks` (RLS) → Speichern/Laden/Löschen.
- #5 Kontextmenü: radiales Popup (worldclock-Stil, Orange) per Long-Press/Rechtsklick →
  SPEICHERN · LADEN · VOLLBILD · INFO; + Lade-Liste-Panel + GNSS-Info-Panel.
- (www im Wrapper neu gesynct.)

## ✅ Erledigt (2026-06-04, autonome Session während Doc unterwegs)
- **Zoom/Folgen**: Karte folgt neuen Fixes nur bis der User selbst draggt (`following`-Flag);
  ZENTRIEREN aktiviert Folgen wieder. Roter Punkt wird bei `zoomstart` ausgeblendet, bei `zoomend`
  wieder eingeblendet → „ordentlich zoomen".
- **Menü final**: Halbkreis-Bogen um den Hamburger (worldclock-Stil), 5 gleich breite Buttons:
  SPEICHERN · LADEN · ZENTRIEREN · VOLLBILD · INFO. Export/Löschen raus (Löschen in der Liste).
- **Struktur**: alles nach `HTML/tracker/` (tracker.html, index.html=Landing, icon.svg, tracker-plan.md);
  `HTML/tracker.html` ist jetzt ein **Redirect** → `tracker/tracker.html`. Landing Page mit KISS + USPs.
- **Wrapper**: sync-web.sh zieht jetzt aus `HTML/tracker/tracker.html` und schreibt `../` → root um.
  (APK NICHT neu gebaut — Doc testet die installierte Version; Zoom-Fix kommt beim nächsten Build.)

## Offen
- **Pro Punkt: Höhe + Velocity speichern** — aktuell nur `[lat, lng, t]`. Erweitern auf
  `[lat, lng, t, alt, speed]` (Geolocation: `coords.altitude` in m, `coords.speed` in m/s;
  nativ liefert das BackgroundGeolocation-Plugin beides auch). Ermöglicht später Höhenprofil
  + Geschwindigkeitsverlauf eines Tracks. Schema-Änderung in `track`/`times` → `onPosition`,
  `plotTrack`, `saveTrack`/`buildGpx` (GPX `<ele>` pro `<trkpt>`) anfassen.
- **Bewegungs-Gate** (Accelerometer/DeviceMotion gegen Phantom-Tempo im Stand) — bewusst NICHT blind
  gebaut, braucht Geräte-Test. Nächster Schritt mit Doc.
- **Tracking-Notification farbig** (Akzentfarbe/Icon im Benachrichtigungs-Panel) — Doc hatte gefragt;
  nativer Eingriff, offen.
- Native App: Background-Test (START → sperren → laufen) durch Doc; ggf. Notification-Farbe.

## UI-Umbau (HUD verschlanken)
1. **POSITION** oben **zentriert**, dahinter die **Genauigkeit** (±X m). Den separaten
   GENAU-Wert unten rechts **entfernen**.
   - Zusätzlich gewünscht: anzeigen, **welche Satelliten/Systeme aktuell zum Fix beitragen**.
   - ⚠️ Im **Web NICHT möglich** — die Geolocation-API liefert keine Satelliten-Daten
     (keine Anzahl, keine Konstellation). Nur in der **nativen App** via Android `GnssStatus`
     (braucht ein kleines Capacitor-Plugin). Web: höchstens „—".
2. **Dauer** komplett entfernen.
3. **TEMPO**: NUR das **Wort „TEMPO"** entfernen — der Geschwindigkeitswert **bleibt**
   (Label dann nur noch „KM/H"). Wert wird wichtig fürs Bewegungs-Gate.
   - **KM (Distanz) bleibt** (nicht zum Entfernen genannt).

## Daten / Backend
4. **Supabase** anbinden (wie VGP: Anonymous Auth) → Tracks **speichern & laden**.
   - Datenmodell: tracks (id, name, created_at, …) + Punkte (oder GPX-Blob).
   - Liste der Tracks + Laden auf die Karte. **Großes Feature, eigene Session.**

## Menü / Interaktion
5. **Kontextmenü** auf **Long-Tap / Rechtsklick** im Stil des **worldclock-Hamburger-Menüs**
   (als Vorlage prüfen): **Load Track**, **Fullscreen**, **Info**.
   - **Info-Text**: Was sind die GNSS-Systeme? GPS (USA, US Space Force), GLONASS (Russland),
     Galileo (EU), BeiDou (China), QZSS (Japan), NavIC (Indien) — wer dahinter steckt, wie's
     grob funktioniert.
6. **Double-Tap auf die Uhr** darf NICHT die Karte mit-triggern (Event-Propagation stoppen).
   - Quick-Fix.

## Bewegungs-Erkennung (aus Frage 1)
- GPS-Speed jittert im Stand → „fährt" obwohl still.
- Idee: **Beschleunigungssensor als Bewegungs-Gate** — DeviceMotion (Web) bzw. Activity
  Recognition (nativ). Wenn Sensor „still" → Speed = 0 und keine Punkte. Mindestschritt
  adaptiv = f(accuracy).

## Map-Matching (aus Frage 2)
- Aktuell: **rohe GPS-Punkte**, KEIN Snap-to-Road. 30 m Versatz trotz „4 m" = GPS-Multipath /
  optimistische Accuracy, **nicht** OSM-Fehler.
- Optional später: Map-Matching (OSRM / Valhalla / Mapbox) — aber für Fuß-/Radwege oft falsch;
  nur fürs Auto sinnvoll. Standard: roh lassen (ehrlich).
