# Tracker — GPS nachträglich verbessern (PPK / PPP)? — Recherche-Notiz

> Idee von Doc: „Man kann GPS-Daten nachträglich mit Satellitendaten noch verbessern."
> Aufgeschrieben + recherchiert, **noch nicht gebaut**. Stand: 2026-06-08.

## Begriffsklärung
„Orknham System" ist mit hoher Wahrscheinlichkeit ein **Transkriptions-Verhörer** (Spracheingabe).
Das gemeinte, reale Verfahren heißt **GNSS-Post-Processing** — konkret **PPK** (Post-Processed
Kinematic) bzw. **PPP** (Precise Point Positioning). Mögliche verhörte Originalbegriffe: *RINEX*,
*RTKLIB*, *EGNOS/SBAS*, *SAPOS*. Inhaltlich geht es immer um dasselbe:

**Die Idee stimmt.** Der Echtzeit-GPS-Fix nutzt nur die groben Satelliten-Bahn-/Uhrdaten, die der
Satellit *gerade* funkt. Stunden bis Tage später veröffentlichen Dienste (IGS, GFZ Potsdam, MGEX)
die **präzisen** Bahn- und Uhrkorrekturen. Rechnet man die Aufzeichnung damit neu, wird die Position
deutlich genauer — Studien zeigen **~20–80 % Verbesserung**, auf Dual-Frequenz-Handys sogar
Dezimeter-Niveau (RTKLIB mit Pixel-4-Rohdaten).

## ⚠️ Der Haken für UNSEREN Tracker
PPK/PPP braucht die **GNSS-Rohdaten** (Pseudoranges + Trägerphase, als **RINEX**-Datei) — **nicht**
die fertigen Lat/Lon-Fixes, die wir heute speichern.

- Unser Tracker bekommt die Position über die Web-`geolocation`-API bzw. das Capacitor-
  **BackgroundGeolocation**-Plugin (`tracker.html:676,708`). Beide liefern **nur den fertig
  gerechneten Fix** (lat/lng/accuracy) — die Rohmessungen sind da schon weg.
- Android stellt Roh-GNSS zwar seit Android 7 (2016) über die `GnssMeasurement`-API bereit, und
  Apps wie **Geo++ RINEX Logger** oder Googles **GnssLogger** loggen daraus RINEX. Aber: das geht
  **nur nativ** (nicht im Web-Client), unser BgGeo-Plugin reicht es **nicht** durch, und auf iOS ist
  Roh-GNSS gar nicht zugänglich.

**Fazit:** Echtes PPK/PPP ist mit dem, was wir heute aufzeichnen, **nicht möglich** — wir müssten
erst die Rohdaten loggen. Das ist machbar, aber ein größerer, nativer Eingriff (s. Stufe 2).

## Zwei realistische Stufen

### Stufe 1 — Track nachträglich „aufräumen" (sofort machbar, keine Rohdaten nötig)
Kein echtes PPK, aber sichtbar bessere Spuren aus dem, was wir **schon haben**:
- **Map-Matching:** die Spur auf reale Wege/Straßen schnappen — via **Valhalla Meili**, **OSRM**,
  **GraphHopper** oder **Mapbox Map-Matching-API** (OSM-basiert). Entfernt das „Zickzack" und das
  Versetzt-Sein neben dem Weg.
- **Glättung / Ausreißer:** Kalman-Smoothing + Sprung-Filter (Teile davon macht der Tracker schon,
  `tracker.html:594-601`, `MAX_JUMP_KMH`).
- **Höhen-Korrektur:** die verrauschte GPS-Höhe durch ein **Geländemodell (DEM)** ersetzen
  (SRTM/Copernicus) → saubere Höhenprofile.
- **Aufwand:** mittel, rein clientseitig oder als kleiner Edge-Function-Schritt; kostenlos
  (Self-host) bis günstig.

### Stufe 2 — Echtes PPK/PPP (die Sache, die Doc gehört hat)
Hohe Genauigkeit, aber Forschungs-/Profi-Niveau:
1. **Roh-GNSS als RINEX loggen** — nur nativ (Android `GnssMeasurement`), eigenes Capacitor-Plugin
   oder Integration eines RINEX-Loggers. iOS scheidet aus.
2. **Post-Processing** mit **RTKLIB** (`RTKPOST`, open source) gegen
   - **präzise Bahn-/Uhrprodukte** (IGS final/rapid, GFZ, MGEX), und/oder
   - eine **Referenzstation**. In Deutschland: **SAPOS** (amtlicher Dienst, teils kostenpflichtig)
     oder eine nahe **CORS/IGS-Station**.
3. Optional: kostenlose **PPP-Webdienste** (NRCan **CSRS-PPP**, NOAA **OPUS**) nehmen RINEX-Dateien
   und liefern die korrigierte Lösung zurück — spart eigene Rechen-Pipeline.

- **Voraussetzungen für gute Resultate:** möglichst **Dual-Frequenz-GNSS-Handy**, freie Sicht,
  längere Beobachtung. In Häuserschluchten (genau wo's nervt) bleibt's schwierig.
- **Aufwand:** hoch (nativer Logger + Processing-Kette). Eher ein eigenes Projekt als ein Feature.

## Empfehlung
- **Jetzt:** Stufe 1 (Map-Matching + Glättung + DEM-Höhe) bringt für eine Wander-/Stadt-App den
  größten sichtbaren Nutzen pro Aufwand — und braucht **keine** Rohdaten.
- **Später / optional:** Stufe 2 nur, wenn Zentimeter/Dezimeter wirklich gebraucht werden (Vermessung
  o. Ä.). Dann zuerst einen RINEX-Logger nativ einbauen, danach RTKLIB/CSRS-PPP anbinden.
- Beides erst nach Doc's **go**.

## Quellen
- Continuous High-Precision Positioning in Smartphones (GNSS-PPK + PDR), MDPI Micromachines 2024 — https://www.mdpi.com/2072-666X/15/9/1141
- Conditioning and PPP processing of smartphone GNSS measurements, Satellite Navigation (Springer) 2021 — https://link.springer.com/article/10.1186/s43020-021-00042-2
- PPK mit RTKLIB auf Pixel-4-Rohdaten (~22,5 % Verbesserung), MDPI Applied Sciences — https://www.mdpi.com/2076-3417/11/11/4787
- GNSS Observation Generation from Android Location API (RINEX-Logger-Apps), MDPI Sensors 2023 — https://www.mdpi.com/1424-8220/23/2/777
- Benefits of PPK in GNSS/INS, Advanced Navigation — https://www.advancednavigation.com/tech-articles/benefits-of-using-post-processing-kinematic-ppk-software-in-gnss-based-and-inertial-navigation-solutions/
