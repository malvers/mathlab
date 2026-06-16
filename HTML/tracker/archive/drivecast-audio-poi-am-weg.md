# Tracker — Audio-Sehenswürdigkeiten am Weg („WegCast", Vorbild Blitzer.de DriveCast)

> Ideen-/Konzept-Notiz von Doc, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.
> Geschwister-Notiz: [`geo-erkennung-und-voice-spur.md`](geo-erkennung-und-voice-spur.md) (Voice-Spur +
> Geo-Grounding) — die hier ist die **passiv-erzählende** Variante davon.

## Was Doc will
„Wenn man durch die Gegend geht — gelaufen, gefahren, whatever — und automatisch auf
**Sinnwürdigkeiten am Weg** aufmerksam gemacht wird, und das wird einem **vorgelesen**." Also: kein
Tippen, kein Suchen — der Tracker erzählt von selbst, was links und rechts gerade Spannendes liegt.

## Vorbild: Blitzer.de **DriveCast** (recherchiert 2026-06-10)
- **Was:** Erzählt im Vorbeifahren **Fakten & Geschichten** zu Orten, an denen man gerade vorbeikommt
  — „direkt im Ohr und ohne Ablenkung". Tagline: *„Deine Route. Deine Geschichten."*
- **Auslöser:** **automatisch per GPS-Nähe** — „sobald du einen spannenden Ort erreichst, startet dein
  Audio-Erlebnis automatisch."
- **Inhaltsarten:** Fakten zu **Unternehmen & Bauwerken** direkt an der Route; ein **persönlicher Guide
  am Ortsschild** mit kurzen Einblicken „in die Seele der nächsten Stadt".
- **Steuerung:** Themen selbst wählbar, jederzeit **pausierbar**, läuft im Hintergrund.
- **Plattform:** exklusiv in **Blitzer.de PRO** ab App-Version 4.6.36; Angebot der *movato GmbH*.
- **Sicherheit:** rein Audio — „Hände am Steuer, Blick auf der Straße."

→ Kurz: ein **standortgetriggerter Audio-Reiseführer**. Genau das, was Doc meint.

## Warum WIR das fast geschenkt bekommen
Der Tracker hat die teuren Zutaten **schon**:
- **Dauerhafte Position** — `currentLatLng()` (tracker-media.js) / der Live-Fix in `onPosition()`.
- **Bewegungsart** — wir erkennen laufen/fahren bereits (`effectiveActivity()`, Activity-Recognition).
  → der „whatever"-Wunsch ist gelöst: **Radius & Tiefe pro Modus** anpassen (siehe unten).
- **Geo-Grounding-Konzept** liegt schon vor (geo-erkennung-und-voice-spur.md) — dieselbe Idee,
  nur statt „Foto erkennen" jetzt „Umgebung erzählen".
- **Foto-Spur + Gemini** — Pipeline für „Ort → Text" existiert konzeptionell (identify-Function).
- **TTS** — Vorlesen via Web Speech API (`speechSynthesis`, gratis, offline-fähig auf vielen Geräten).
  ⚠️ Falls Cloud-TTS (schöner): Key **server-seitig** in einer Edge-Function, **nie** im Repo (Regel 18).

## Inhalts-Quellen (was vorgelesen wird) — von billig nach reich
1. **Wikipedia/Wikidata Geosearch** — `geosearch` liefert Artikel im Umkreis (lat/lng/Radius), dann
   `extracts` für den Intro-Absatz → kostenlos, weltweit, mehrsprachig. **Bester MVP-Hebel.**
2. **OpenStreetMap / Overpass** — benannte POIs (Denkmäler, Kirchen, Aussichtspunkte, Naturschutz,
   historische Stätten). Wir laden OSM-Tiles ohnehin schon (`baseMap`).
3. **Eigene Spur als Quelle** — beim Wieder-Begehen einer Strecke die **eigenen alten Foto-/Voice-
   Waypoints** vorlesen („hier hast du vor 3 Wochen die Frauenkirche fotografiert").
4. **Pflanzen-/Natur-Layer** — bei „laufen" im Grünen die Pflanzen-DBs (siehe
   `pflanzen-datenbanken-enrichment.md`): „links blüht gerade Bärlauch."
5. **„Seele der Stadt" am Ortsschild** — wie DriveCast: beim Überqueren einer Ortsgrenze (Nominatim
   reverse-geocode-Wechsel der `city`) ein kurzer Stadt-Steckbrief.
6. **Mathe-Labor-Twist** 😏 — passend zu „Doc Alvers Mathe-Labor": an markanten Bauwerken auch die
   **Mathematik/Geometrie** erzählen (Kuppel-Radius, goldener Schnitt einer Fassade, Brücken-Statik).
   Das hebt uns von einem reinen Touri-Guide ab — Sehens**würdigkeit** → **Sinn**würdigkeit.

## Auslöse-Logik (das Herz)
- **Korridor statt Punkt:** entlang der Fahrtrichtung (Bearing aus zwei Fixes) einen Kegel/Korridor
  voraus prüfen, nicht nur einen Kreis — man will von dem hören, **worauf man zugeht**.
- **Modus-adaptiver Radius & Detailgrad** (nutzt die Activity-Erkennung):
  - 🚶 **laufen:** kleiner Radius (~50–150 m), **mehr Details**, auch Kleinkram (Bäume, Brunnen).
  - 🚴 **Rad:** mittel.
  - 🚗 **fahren:** großer Radius (~300–800 m), nur **Headlines**, frühzeitig (man ist schnell vorbei).
- **Wichtigkeit/Ranking:** pro POI ein Score (Wikipedia-Sichtbarkeit/Länge, OSM-`importance`,
  Entfernung, „kommt direkt" vs „seitlich"). Nur Top-N erzählen, sonst Dauergeplapper.
- **Anti-Wiederholung:** je Ort einmal pro Tour; Cooldown; „schon gehört"-Set persistieren.
- **Budget/Takt:** max. 1 Erzählung pro X Sekunden, Queue statt Überlappung, kurze Snippets (15–30 s).

## Bedienung & Sicherheit
- **Ein Schalter** „Vorlesen an/aus" (FAB oder im Radial-Menü) + **Themen-Filter** (Geschichte / Natur /
  Mathe / Stadt). Jederzeit **Pause** und „**das interessiert mich nicht**" (skippt + senkt den Score).
- **Hintergrund/Lockscreen:** Audio läuft weiter (Media-Session-API). ⚠️ Web friert JS bei gesperrtem
  Screen ein → für echtes Hintergrund-Erzählen die **native App** nötig (wie beim Tracking selbst).
- Rein Audio, große Toasts optional — Blick bleibt frei.

## MVP → Ausbau
- **MVP (klein, sofort testbar):** „laufen"-Modus + **Wikipedia-Geosearch** im 120-m-Umkreis +
  `speechSynthesis`-Vorlesen + Anti-Wiederholung. Ein Schalter. Ein Thema. Fertig fühlbar.
- **Stufe 2:** Fahrtrichtungs-Korridor + Modus-adaptiver Radius (Activity) + OSM-POIs + Themen-Filter.
- **Stufe 3:** eigene Spur als Quelle, Cloud-TTS (server-seitig), Mathe-Layer, „Seele der Stadt".

## Andockpunkte / Querverweise (für später)
- Position/Bewegung: `onPosition()` + `currentLatLng()` + `effectiveActivity()`.
- Konzept-Geschwister: `geo-erkennung-und-voice-spur.md`, `pflanzen-datenbanken-enrichment.md`.
- TTS gratis: `speechSynthesis`; Cloud nur über Edge-Function (kein Key im Repo, Regel 18).
- **Nichts hiervon ist gebaut** — reine Konzept-/Ideensammlung.

## Namensideen (nicht „DriveCast" — das ist Blitzer.de/movato)
**WegCast** · **Spazierfunk** · **Beifahrer** · **Sinnwürdigkeiten** · **Vorbei** · **Routen-Raunen**.
