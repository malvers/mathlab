# Fokus-Timer — PowerPoint-Deck bauen

Baut ein Deck, in dem jede Folie ein stiller Countdown ist: ruhiges Seefoto mit ganz langsamer
Zoomfahrt, ein durchscheinender Pac-Man, der im Uhrzeigersinn leerläuft, die Restzeit
**sekundengenau** in der Mitte, Musik in Schleife. Alles startet mit der Folie, kein Klick.

Das Web-Gegenstück ist [`HTML/fokus.html`](../../../HTML/fokus.html) und hängt im
„Mehr"-Menü der SVP-Seiten. Beide sind bewusst gleich proportioniert (Radius 0,29 der kurzen
Seite, Zahl 0,30 des Radius, Deckkraft 88 %, Rand 60 %), damit Änderungen übertragbar bleiben.

## Bauen

```bash
./build.sh ~/Desktop/focus-timer.pptx 1 2 3 4 5 6 7 8 9 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90
```

Zahlen sind Minuten, mit `s` am Ende Sekunden (`90s`). Die Liste wird sortiert und entdoppelt.
`MEDIA=<dir>` sagt, wo Video und Ton liegen (nicht im Repo, siehe unten).

**Zählschritte:** bis 10 Minuten sekundengenau, darüber alle 10 Sekunden (`LONGSTEP=n` ändert
das, `STEP=n` erzwingt einen Wert für alle Folien). Der Grund steht unter „Gemessen".

**Die Dauer steckt in den Textfeldern.** Eine andere Länge heißt neu bauen — es gibt keinen Weg,
sie nachträglich zu ändern (`set_timer.py` verstellt nur das Rad und lässt die Zahlen falsch
stehen; nur benutzen, wenn gar keine Zahlen im Deck sind).

## Was gebraucht wird, aber nicht im Repo liegt

`build_focus_slide.py` erwartet neben sich:

| Datei | Woher |
|---|---|
| `lake_loop.mp4` | `node render-photo.mjs . photo.html`, dann `ffmpeg -framerate 25 -i frames/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow -g 25 -movflags +faststart lake_loop.mp4` |
| `frames/0000.jpg` | fällt beim Rendern mit ab (Standbild für die Bearbeitungsansicht) |
| `photo_src.jpg` | die Vorlage; im Repo liegt sie als `HTML/resources/lake-tahoe.jpg` |
| `focus_audio.m4a` | siehe unten |

**Die Musik liegt bewusst nicht im Repo** — das Repo ist öffentlich und der Track gehört uns
nicht. Zum Selbstbauen (nahtlose Schleife: Ende wird in den Anfang gekreuzblendet):

```bash
yt-dlp -f bestaudio[ext=m4a] --download-sections "*20-800" --force-keyframes-at-cuts \
       -o src_audio.m4a "https://www.youtube.com/watch?v=DNqQnV4V4o8"
ffmpeg -i src_audio.m4a -t 720 -c copy _full.m4a
ffmpeg -i _full.m4a -t 6 -c:a pcm_s16le _head.wav
ffmpeg -ss 6 -i _full.m4a -c:a pcm_s16le _body.wav
ffmpeg -i _body.wav -i _head.wav \
  -filter_complex "[0][1]acrossfade=d=6:c1=tri:c2=tri[a];[a]afade=t=in:st=0:d=4[o]" \
  -map "[o]" -c:a aac -b:a 128k -ar 44100 focus_audio.m4a
```

Das Web-Lab umgeht das Problem anders: es bettet den YouTube-Player ein, statt Ton auszuliefern.

Das Foto ist „Lake Tahoe at morning" von John D., CC BY 2.0, Wikimedia Commons. Die Namensnennung
steht klein unten links auf jeder Folie und muss dort bleiben.

## Warum drei Schritte

PowerPoint-Dateien lassen sich nicht in einem Rutsch schreiben — jedes Werkzeug kann nur ein Stück:

1. **`build_focus_slide.py`** legt Folien, Formen, Zahlen und Medien an. `python-pptx` kann
   **kein Audio** (nur `add_movie`) und **keine Animation**.
2. **`finish.applescript`** fährt PowerPoint fern und setzt Wiedergabe-Optionen und das Rad.
   AppleScript kann **keine Startverzögerung** — die Zahlen gehen hier nicht.
3. **`post_fix.py`** repariert im XML, was PowerPoint verwirft, und schreibt die Zeitsteuerung
   der Zahlen.

## Fallen, jede davon einmal teuer bezahlt

**Reihenfolge im AppleScript.** Wiedergabe-Optionen **vor** `add effect`. Andersherum baut
PowerPoint den Timing-Baum um und wirft die Wheel-Animation stillschweigend weg. Der Preis
dieser Reihenfolge: der `<p:audio>`-Knoten verschwindet — `post_fix.py` setzt ihn wieder ein.

**Gruppen laufen nacheinander, nicht gleichzeitig.** Gruppe 2 der Hauptsequenz startet erst,
wenn Gruppe 1 **beendet** ist. Da die Countdown-Zahlen bis zum Schluss laufen, endete Gruppe 1
nie rechtzeitig und der Pac-Man in Gruppe 2 tat scheinbar nichts. `merge_groups()` legt alles in
**eine** Gruppe, in der `withEffect` „gleichzeitig" bedeutet.

**Jede Gruppe steht auf „warte auf Klick"**, auch bei `trigger with previous`. Für Selbststart
`<p:cond delay="0"/>` und `nodeType="clickEffect"` → `"withEffect"`.

**Jedes Medienobjekt bekommt einen Klick-Pausenschalter** (`interactiveSeq` mit `togglePause`).
Beim bildschirmfüllenden Video frisst der jeden Klick. Fliegt raus.

**Lautsprecher-Symbol:** `hide while not playing` versteckt es nur in der Präsentation. Weg damit
per 1×1-transparentem PNG als Standbild.

**Weißer Haarstrich am Rand**, wenn das Video exakt Folienmaß hat. 0,04″ Überstand plus dunkler
Folienhintergrund.

**AppleScript-Variablennamen:** `t` und `out` knallen beide (`constant AnDi`, Fehler -10003).

## Gemessen, nicht geschätzt (06.09.2026)

Zwei Behauptungen von mir waren falsch, hier die echten Zahlen:

| | |
|---|---|
| 26 Folien, 1–90 min, sekundengenau | 53 700 Zahlen, 107 426 Effekte |
| Datei | **27,7 MB** |
| Folien-XML | 37 MB roh, **0,8 MB gepackt** |
| PowerPoint öffnen + speichern | **1,2 s** |
| Bauen | 2 min 48 s (fast alles: Textfelder anlegen) |

**Aber sekundengenau ist trotzdem falsch für lange Folien** — nicht wegen der Datei, sondern wegen
der *Formen pro Folie*. Bei durchgehend einer Sekunde trägt die 85-Minuten-Folie 5100 Formen, und
in der laufenden Präsentation dorthin zu blättern dauerte ewig. Deshalb die Staffelung:

| pro Folie über 10 min | Zahlen gesamt | Formen auf der 90-min-Folie | Datei | Sprung dorthin |
|---|---|---|---|---|
| 1 s | 53 700 | 5 400 | 27,7 MB | zäh |
| **10 s (Vorgabe)** | **8 340** | **545** | **25,7 MB** | **0,16 s** |
| 60 s | 4 140 | 90 | 25,5 MB | 0,14 s |

10 Sekunden kosten gegenüber Minuten also 0,2 MB und zwei Hundertstel — deshalb die Vorgabe.

**Sekundengenau geht also.** Und Folien kosten fast nichts: `python-pptx` erkennt Video und Ton
am SHA1 und legt beide **einmal** ab, egal ob 1 oder 26 Folien. Die 25 MB Medien dominieren.

**Prüfen geht nicht per Vorschau.** Quick Look zeichnet `prst="donut"` überhaupt nicht — Ringe
fehlen, obwohl die Datei stimmt. PowerPoints `save … as save as PNG` und `as save as movie`
schreiben per AppleScript stumm gar nichts, und Exporte außerhalb erlaubter Ordner lösen einen
blockierenden „Grant File Access"-Dialog aus. Verlässlich ist nur: XML lesen und die Geometrie
selbst nachzeichnen.
