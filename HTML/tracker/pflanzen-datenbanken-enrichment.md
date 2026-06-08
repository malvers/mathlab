# Tracker — Pflanzen-Datenbanken zur Veredelung & Geo-Validierung (POWO / GBIF / iNaturalist)

> Recherche-/Ideen-Notiz, **noch nicht gebaut** (CLAUDE.md Regeln 2/4).
> Ergänzt die Foto-Erkennung um eine **Anreicherungs-/Plausibilitäts-Schicht** *nach* der
> Bestimmung. Bewusst getrennt von `geo-erkennung-und-voice-spur.md` (das ist Prompt-Grounding;
> hier geht es um botanische Fachdatenbanken). Stand: 2026-06-08.

## Kernunterscheidung
- **Erkennen** (Foto → Art): macht heute **Pl@ntNet** + Gemini (`supabase/functions/identify/index.ts`).
- **Veredeln/Validieren** (Art → autoritative Fakten + Verbreitung): das ist die Lücke, die die
  folgenden Datenbanken füllen. **Keine** davon (außer iNaturalist) erkennt aus dem Bild — sie
  brauchen einen Namen.

## POWO — Plants of the World Online (Kew)
- **Was:** autoritative Taxonomie + Nomenklatur + **Verbreitungsdaten** zu Pflanzenarten.
- **API:** HTTP-API, offiziell zugänglich über Kews **`pykew`** (Python) bzw. **`kewr`** (R).
  Liefert akzeptierten Namen, Synonyme, Distribution. **Halb-offiziell** — keine garantierte
  Stabilität/SLA, Rate-Limits undokumentiert. Unser `identify`-Function ist Deno/TS → wir würden
  den HTTP-Endpoint direkt per `fetch` anfragen (pykew nur als Referenz für die Endpunkt-Struktur).
- **Nutzen im Tracker:** Pl@ntNet/Gemini liefert den Namen → POWO bestätigt den **akzeptierten
  Artnamen** (räumt Synonym-Wirrwarr auf) und liefert das **natürliche Verbreitungsgebiet**.

## GBIF — Global Biodiversity Information Facility
- **Was:** riesige, **kostenlose** Arten- und Fundpunkt-Datenbank (**kein API-Key**).
- **API:** dokumentierte REST-API — **Species API** (Namens-Matching, Taxonomie) + **Occurrence API**
  (Fundpunkte) + Geocode. Kann „welche Arten kommen **nahe diesen Koordinaten** vor".
- **Nutzen im Tracker:** die beste **Geo-Plausibilität**: Steht die erkannte Art laut realen
  Fundpunkten überhaupt in der Region (z. B. Sachsen)? → unplausible Treffer abwerten,
  **„heimisch / Neophyt / invasiv"** ableiten. Breiter und neutraler als POWO, gratis, kein Key.

## iNaturalist
- **Was:** Community-Beobachtungen **mit** Standort + ein **geo-bewusstes Computer-Vision-Modell**,
  das Arten **nach Standort gewichtet** — und nicht nur Pflanzen, auch Tiere/Pilze.
- **API:** Vision-/Identification-API vorhanden, **braucht aber Auth + Nutzungsbedingungen**.
- **Nutzen im Tracker:** der stärkste Einzel-Upgrade, wenn man die **Erkennung selbst**
  geo-bewusster machen will (statt nur den Prompt zu grounden). Könnte Pl@ntNet ergänzen oder in
  Teilen ablösen. Mehr Integrationsaufwand (Auth) als POWO/GBIF.

## Einordnung / Empfehlung
| Quelle | Rolle | Key | Aufwand | Wofür |
|---|---|---|---|---|
| **Pl@ntNet** (heute) | Erkennen (Foto→Art) | ja (gesetzt) | — | bereits integriert |
| **GBIF** | Geo-Validierung + heimisch/invasiv | **nein** | niedrig (`fetch`) | „kommt die Art hier vor?" |
| **POWO** | autoritativer Name + Verbreitung | nein (halb-offiziell) | niedrig–mittel | Namens-/Synonym-Sicherheit |
| **iNaturalist** | geo-bewusste Bilderkennung | ja (Auth) | mittel–hoch | Erkennung selbst aufwerten |

**Vorschlag:**
1. **GBIF zuerst** — gratis, kein Key, kleiner `fetch` im `identify`-Function: die von
   Pl@ntNet/Gemini bestimmte Art gegen die GPS-Position plausibilisieren und „heimisch/Neophyt"
   anzeigen. Größter Nutzen pro Aufwand, passt zur Geo-Idee.
2. **POWO** additiv, wenn saubere akzeptierte Namen/Synonyme + Verbreitung gewünscht sind.
3. **iNaturalist** nur, wenn die **Erkennung** selbst geo-bewusster werden soll (eigenes Projekt
   wegen Auth/Terms).

> Alles erst nach Doc's **go** umsetzen.

## Quellen
- POWO (Kew) — https://powo.science.kew.org/
- pykew (Kew, GitHub) — https://github.com/RBGKew/pykew
- GBIF Species API — https://techdocs.gbif.org/en/openapi/v1/species
- GBIF API-Einstieg — https://data-blog.gbif.org/post/gbif-api-beginners-guide/
