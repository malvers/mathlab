# Gedanke der Woche (GdW) – Pipeline

Alles, was ein Blatt ausmacht, steht in **`blaetter.json`**: Spruch (`<b>` = rote Wörter), `wer`, `rolle`,
optional `groesse` (`riesig`/`kurz`/`mittel`/`lang`, sonst nach Textlänge) und das Bild samt Commons-Titel,
Lizenz und Urheber. Das Aussehen steht in **`blatt.css`**. Arbeitsdateien liegen in `arbeit/` (git-ignoriert).

## Neues Blatt

```bash
# 1. Text in blaetter.json eintragen (nächste freie Nummer: gdw.py status)
python3 tools/gdw/gdw.py suche 100 "Hubble eXtreme Deep Field" "Earthrise"   # Kontaktbogen
python3 tools/gdw/gdw.py waehle 100 0                                        # Bild festlegen
python3 tools/gdw/gdw.py baue 100          # -> arbeit/out/: blaetter.pdf, png/, gross/ (1200 px), thumb/ (200 px)
python3 tools/gdw/gdw.py einbau 100        # Vorschau nach HTML/svp/gdw/, groß nach R2 (Bucket "gdw")
# 2. Woche festlegen: HTML/svp/gdw.json bzw. gdw-weisheiten.json, "bild": "100"
```

`baue` bricht ab, wenn Outfit nicht geladen ist, ein Bild fehlt oder der Satz ins Bild läuft.

## Docs eigene Blätter (aus der PowerPoint)

PowerPoint → PDF exportieren (auf den Desktop, nicht in ein Sandbox-Temp), dann
`python3 tools/gdw/gdw.py aus-pdf <datei.pdf> <erste-nr>` und `einbau`.

## Regeln

- Bilder nur von Wikimedia Commons, gemeinfrei oder CC BY(-SA): die großen Bilder sind öffentlich auf R2.
- Keine Bilder ins Git – `hole` lädt sie über den Commons-Titel neu. Ausnahme: von Hand freigestellte
  Bilder (`"zugeschnitten"` in blaetter.json, 59/63/78) liegen gesichert im Memory-Ordner.
- Nummern: 01–58 Docs PowerPoint, 59–99 Weisheiten der Welt, ab 100 neue Blätter aus dieser Pipeline.
