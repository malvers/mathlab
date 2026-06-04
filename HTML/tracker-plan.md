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

## Offen
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
