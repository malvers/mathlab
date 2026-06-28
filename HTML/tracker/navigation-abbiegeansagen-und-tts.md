# Navigation: Woher kommen Abbiegeansagen und der Ton?

Kurz für mitlesende Kolleg:innen (z.B. Anna): wie die gesprochenen Abbiege-Hinweise
im Tracker entstehen — und warum wir dafür **keine** Straßen-Datenbank und **keine**
Audio-Bibliothek speichern müssen.

## Die Kette in drei Stufen

1. **Route + Abbiege-Info** kommt von einem **Routing-Dienst** (nicht von OpenStreetMap direkt).
2. **Den deutschen Satz** bauen **wir selbst** im Code.
3. **Den Ton (das MP3)** macht **Google Cloud Text-to-Speech**, über unsere eigene Server-Funktion.

---

### 1. Route + Abbiege-Info — vom Routing-Dienst

Wenn du ein Ziel wählst, wird die Route live berechnet:

- **Primär: OpenRouteService (ORS)** — über unsere Edge-Function `reroute`.
- **Fallback: FOSSGIS-OSRM** — die öffentliche, keylose OSRM-Instanz.

Beide rechnen auf **OpenStreetMap-Daten** und liefern zweierlei zurück:
- die **Geometrie** der Route (die Linie auf der Karte), und
- die **Maneuvers**: pro Abbiegepunkt ein Datensatz mit Typ (`turn`, `roundabout`,
  `merge`, …), Richtung (`left`/`right`/`slight left`/…), ggf. Kreisverkehr-Ausfahrt
  und Straßenname.

Wichtig: ORS/OSRM liefern die **Daten** der Abbiegung — **nicht** den fertigen Satz und
**nicht** den Ton. Beides entsteht erst bei uns.

Beide Dienste sind **keyless** (kein API-Schlüssel im Client). Datei: `HTML/js/tracker-nav.js`.

### 2. Der deutsche Satz — bauen wir selbst

In `tracker-nav.js` mappen wir die Maneuver-Daten auf eine kurze deutsche Anweisung.
Es gibt eine kleine Übersetzungstabelle:

```
left → links,  right → rechts,  slight left → leicht links,
sharp right → scharf rechts,  straight → geradeaus,  uturn → wenden, …
```

Daraus werden Sätze wie:
- „**Rechts abbiegen** auf die Hauptstraße"
- „**Im Kreisverkehr die 2. Ausfahrt**"
- „**In 200 Metern links**" (die Vorwarnung, abhängig von Tempo/Modus)

Das ist **unsere eigene Logik** — keine externe Sprach-/Phrasing-Bibliothek. Reine
Geradeaus-Fahrt ohne Abbiegung wird bewusst **nicht** angesagt (kein „Spam").

### 3. Der Ton — Google Cloud TTS über unsere Edge-Function

Den eigentlichen Klang erzeugt **Google Cloud Text-to-Speech**:

- Der fertige deutsche Satz geht an unsere Edge-Function `tts`
  (`supabase/functions/tts/index.ts`).
- Diese Funktion hängt serverseitig den Google-Key an (der **Key liegt nur am Server**,
  nie im öffentlichen Client) und ruft Google auf.
- Zurück kommt ein **MP3 als Base64**, das der Tracker direkt abspielt.

Stimme/Logik dazu: `HTML/js/solita-voice.js` (Standardstimme `de-DE-Studio-C`).

---

## „Machen wir das jedes Mal neu?"

**Abbiegeansagen: ja — live, pro Abbiegung frisch synthetisiert.**
Grund: in der Ansage steckt **Variables** — der konkrete Straßenname und die Entfernung
(„In 200 Metern links auf die Bahnhofstraße"). Solche Sätze kann man nicht sinnvoll
vorab erzeugen, weil es praktisch unendlich viele Kombinationen gibt. Sie werden genau
**im Moment der Abbiegung** erzeugt — und es sind kurze Clips, nicht „alle Straßen".

**Feste Phrasen: nein — die werden gecacht.**
Wiederkehrende, immer gleiche Sätze (z.B. Tool-/Status-Hinweise) werden **einmal**
synthetisiert und danach **gratis aus dem `localStorage`** wiederholt
(`SolitaVoice.speakCached`). Kein erneuter Google-Aufruf, keine Kosten.

## „Wir können doch unmöglich alle Straßen abspeichern" — richtig, machen wir auch nicht

Es gibt bei uns **keine** Straßen-Datenbank und **keine** Audio-Bibliothek. Das System
hält nichts auf Vorrat:

- Die **Route** wird pro Fahrt **live** abgefragt (ORS/OSRM).
- Pro Abbiegung wird **ein** kurzer Satz erzeugt und gesprochen.
- Geladen wird immer nur das, was **gerade auf deiner Route** liegt — nicht mehr.

## Kostenhinweis

Jede frische Abbiegeansage ist ein kleiner **Google-TTS-Aufruf** (kostet minimal pro
Clip). Bei viel Navigieren summiert sich das ein wenig. Die **festen, gecachten Phrasen**
sind dagegen kostenlos, weil sie nur einmal synthetisiert und danach lokal wiederholt
werden.

## Dateien auf einen Blick

| Stufe | Was | Datei |
| --- | --- | --- |
| 1 | Route + Maneuvers (ORS primär, OSRM Fallback) | `HTML/js/tracker-nav.js`, `supabase/functions/reroute/index.ts` |
| 2 | Maneuver → deutscher Satz | `HTML/js/tracker-nav.js` |
| 3 | Satz → MP3 (Google TTS, Key serverseitig) | `HTML/js/solita-voice.js`, `supabase/functions/tts/index.ts` |
