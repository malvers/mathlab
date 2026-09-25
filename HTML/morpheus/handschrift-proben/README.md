# Handschrift-Proben

Echte Striche von Docs Pad (Lenovo TB330FU), aufgenommen mit `../../vorrechnen.html`.
Sie sind der Prüfstein für `../../js/stroke-symbols.js` — die Schwellwerte dort waren zuerst
an nachgebauten Strichen eingestellt, diese Dateien zeigen, ob sie echter Handschrift standhalten.

Eine `.json` enthält Canvas-Maße, die damals eingestellten Schwellwerte und die Striche als
`{ points: [{x, y, t}], width }`. Das `t` ist der Punkt, auf den es ankommt: Es trennt zwei eng
geschriebene Zeichen von einem Zeichen aus zwei Strichen.

## probe-01-3x5y — `3(x+5y)=`
Erste echte Aufnahme überhaupt. 13 Striche, und die Gruppierung findet **alle 8 Zeichen** richtig:
`3` `(` `x` `+` `5` `y` `)` `=`, mit `x`, `+`, `5`, `y` und `=` aus je zwei Strichen.

Der interessante Teil: Doc hat die **schließende Klammer zuletzt nachgetragen**, 1,9 s nach dem `=`
(Strich 12, t = 23,5 s; das `=` sind die Striche 10 und 11 bei 21,3 s und 21,6 s). In der Leserichtung
steht sie trotzdem korrekt vor dem `=`. Genau daran scheitert der alte Weg über gerasterte Konturen:
Einem Bild sieht man nicht an, dass da noch etwas nachkam.
