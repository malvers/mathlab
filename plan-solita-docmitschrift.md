# Solita + DocMitschrift: ein gemeinsames Ohr

Stand 05.11.2026 · Marie (Solita) mit Ada (DocMitschrift) · **Nur Plan. Nichts davon wird jetzt gebaut.**

> Doc, 05.11.2026: „Wir müssen das irgendwann zusammenführen … im Moment aber noch nicht. Einfach mal so lassen.
> Ich will nur einen Überblick kriegen und verstehen, was geht.“

## Worum es geht

Zwei Projekte hören Doc zu, aus zwei verschiedenen Gründen:

- **Solita** antwortet, wenn Doc sie ruft. Sie ist seine Assistentin, das Vorbild ist Samantha aus *Her*.
- **DocMitschrift** schreibt den Schultag mit, damit Doc weiß, welcher Klasse er was erzählt hat.

Beide brauchen dasselbe: ein Mikro, das am Pixel dauernd läuft. Heute sind es zwei getrennte Apps.

## Stand heute

### Solita (Marie)

- Webseite und App am Pixel. Sie hört, denkt mit Claude (über Supabase) und spricht mit Google-Stimme „die Kleine“
  (`de-DE-Studio-C`).
- Weckwort am Pixel: seit Juni 2026 Vosk, auch bei gesperrtem Bildschirm. Springt auch auf das Wort „solide“ an.
- Am 05.11. hat sie auf „Solita“ nicht reagiert. Ursache offen: App nicht geöffnet, schlanke APK ohne Weckwort-Modell,
  Android 17 oder das Mikro gehörte gerade einer anderen App.
- Im Juni hörte sie nach dem Wegwischen weiter (`bug-solita-hoert-nach-app-kill.md`). Das hat Vertrauen gekostet.
- Doc nutzt sie kaum. Vermutete Gründe: Das Weckwort ist unzuverlässig, sie antwortet langsam (im Juli gefühlt
  ~3,5 s), und vor allem kann sie nicht, was die Agentinnen täglich für Doc tun.
- Dateien: `HTML/solita.html`, `HTML/js/ear.js` (hört), `HTML/js/solita-wake.js` (Weckwort), `HTML/js/solita-brain.js`
  (denkt), `HTML/js/solita-core.js` (Seite), `HTML/js/solita-tts.js` + `HTML/js/solita-voice.js` (spricht),
  `supabase/functions/claude/`, `solita-app/` (Android-App mit Vosk-Dienst).

### DocMitschrift (Ada)

- Das Pixel nimmt auf, nur den Ton. Keine Erkennung, kein Internet. Start und Stopp per Knopf, kein Weckwort.
  Läuft bei gesperrtem Bildschirm weiter.
- Eine Pegel-Pille auf dem Schirm zeigt, dass gehört wird: grün atmend; gelb nach 15 s Stille; grau = keine
  Aufnahme. Gesperrt am 05.11. um 08:38 geprüft: Der Satz kam vollständig an.
- Mikro: USB (DJI Mic Mini 2, kommt 7.–9.11.) vor Bluetooth vor Telefon-Mikro.
- Transport: heute per USB-Kabel. Der Mac holt die Stücke, prüft die Größe und löscht sie danach am Phone.
  Vorgeschlagen, Doc hat noch nicht geantwortet: WLAN zu Hause, Pixel → Mac direkt, ohne Cloud.
- Abends am Mac: Apples Spracherkennung (offline), jeder Satz wird über die Untis-Kopie seiner Stunde zugeordnet,
  Apple Intelligence fasst jede Stunde zusammen: Stoff / Im Unterricht / Hausaufgabe / Termine. Der Ton kommt danach
  am Mac in den Papierkorb und ist am Phone schon gelöscht.
- Noch nicht gebaut: Betrieb direkt am Mac, wenn der DJI-Empfänger dort steckt (dieselbe Verarbeitung).
- Ergebnis nur lokal in `~/Documents/mitschrift/` (`tage/`, `klassen/`, `daten/`). Nie in die Cloud, weil
  Schülerstimmen dabei sind (§ 201 StGB).
- Eine Suche „wo habe ich X erzählt?“ gibt es noch nicht, nur grep über die Dateien.
- Stand: `docmitschrift-app/` (README dort), lokal, nicht committet. Erster Test im Unterricht am 05.11. mit dem
  Telefon-Mikro.

## Warum zusammenführen

1. **Das Mikro gehört nur einer App.** Ab Android 10 bekommt meist nur eine App echten Ton: die sichtbare, sonst die
   zuletzt gestartete. Die andere nimmt Stille auf, ohne Fehlermeldung. „Hey Google“ hört nebenher, ohne zu stören.
   Ein Telefonat nimmt allen das Mikro. Startet Solita oder die Claude-App nach der Mitschrift, wird die Mitschrift
   stumm, und umgekehrt. Die Mitschrift startet alle 5 min ein neues Stück und ist dann wieder die zuletzt
   gestartete. Vermutlich holt sie sich das Mikro so zurück, verlassen kann man sich darauf nicht.
2. **Bessere Erkennung am Phone.** Das Pixel hat Deutsch offline installiert. Adas nächster Schritt ist Live-Text am
   Phone. Derselbe Text könnte Solitas Weckwort liefern, statt Vosk mit seinen „solide“-Fehlalarmen.
   Zu prüfen: ob die Android-Erkennung 8 h am Stück hält und was sie am Akku kostet. Ein Weckwort über volle
   Spracherkennung ist schwerer als ein reiner Weckwort-Erkenner.
3. **Gedächtnis.** Die Mitschrift wäre Solitas Langzeitgedächtnis: „Was habe ich BGY24 zur Kettenregel gesagt?“

## Zielbild

```
            Mikro (DJI / Bluetooth / Telefon)
                         │
           ┌─────────────▼─────────────┐
           │  EIN Ohr-Dienst am Pixel  │   läuft gesperrt, zeigt immer an, dass er hört
           └──────┬─────────────┬──────┘
                  │             │
       Aufnahme für die     Live-Text am Phone
          Mitschrift            │
                  │             └─► Weckwort „Solita“ → Vollbild, Solita antwortet
                  ▼
       Mac abends: Text, Stunden, Zusammenfassung
                  │
                  ▼
       ~/Documents/mitschrift/  ◄── lokale Suche ◄── Solita fragt: „Wo habe ich … erzählt?“
```

Am Mac genauso: ein Ohr (Apples Spracherkennung, wie DocMic) für Diktat, Mitschrift und Weckwort.

## Datenschutz (der Knackpunkt)

- Ton und Text aus dem Unterricht bleiben auf Docs Geräten. Das gilt auch, wenn Solita darin sucht.
- Solitas Hirn läuft heute über die Cloud. Fragen an die Mitschrift dürfen deshalb nicht einfach an Claude gehen.
  Denkbar: Suche und Antwort lokal auf dem Mac (Apple Intelligence), Solita liest nur das Ergebnis vor.
  Doc entscheidet.
- Das Weckwort darf nie heimlich hören: immer sichtbar, aus beim Wegwischen (Lehre aus dem Juni-Bug).

## Reihenfolge (Vorschlag, jeder Schritt erst auf Docs Wort)

0. **Jetzt:** Die Mitschrift muss sich im Alltag bewähren (ab 05.11. Telefon-Mikro, ab 7.–9.11. DJI). Vor dem
   Unterricht Solitas Weckwort ausschalten (Wegwischen reicht nicht sicher, siehe Juni-Bug) und keine Spracheingabe
   der Claude-App nutzen, solange die Mitschrift läuft. Wird die Pegel-Pille gelb, kommt kein Ton an.
1. Die Mitschrift merkt selbst, wenn sie stumm geschaltet wird, und warnt Doc (Android meldet das).
2. Suche in der Mitschrift („wo habe ich X erzählt?“), lokal am Mac.
3. Live-Text am Pixel. Doc hat am 05.11. „Okay“ gesagt, als reine DocMitschrift-Funktion ohne Solita. Ada baut ihn
   nach dem Feedback aus dem Praxistest. Die Reihenfolge kann also auch 1 → 3 → 2 sein.
4. Ein Ohr-Dienst: Solitas Weckwort hängt sich an den Ton des Ohr-Dienstes. Ob es dann über den Live-Text läuft oder
   weiter über einen Weckwort-Erkenner (dann ohne eigenes Mikro), entscheiden wir nach einer Akku-Messung.
5. Solita fragt die Mitschrift, lokal.
6. Solita kann, was die Agentinnen täglich tun. Das ist unabhängig von 1–5 und vermutlich der eigentliche Grund,
   warum Doc sie nutzen würde.
7. Vollbild beim Weckwort mit Solitas Live-Gesicht (siehe unten).

## Live-Gesicht: was geht, was es kostet (Stand 05.11.2026)

- **Cloud geht heute** in Echtzeit, als Videostream auch aufs Phone: Tavus, HeyGen LiveAvatar, Anam (im kleinen
  Blindtest der beste Mund), Simli (billiger, Bild matschiger), D-ID hat auch eine Live-Fassung.
- **Lokal auf dem Mac geht es noch nicht.** Forschungsmodelle schaffen Echtzeit nur auf Nvidia-Grafikkarten.
- **Preis:** etwa 9–35 US-Cent pro Minute. Eine Demo von ein paar Minuten kostet also unter 1 €.
- **Alltag:** 20 Fragen am Tag mit je 30 s Gesicht ≈ 10 min ≈ 1–3,50 € am Tag ≈ 30–100 € im Monat. Zu teuer.
  Billiger, wenn das Gesicht nur läuft, während sie spricht (sonst Standbild), und mit dem günstigsten Anbieter.
  Richtig billig wird es erst lokal.
- Doc, 05.11.: Atmen, Leuchten oder Puls-Ring als Ersatz will er nicht. Entweder echtes Gesicht oder Standbild.
- Wiedervorlage „sprechendes Gesicht“: ~25.03.2027.

## Wer macht was

- **Ada:** DocMitschrift, Ohr-Dienst am Pixel, Schritte 1, 2 (lokale Suche am Mac) und 3, dazu WLAN-Übertragung und
  Betrieb am Mac.
- **Marie:** Solita (Weckwort als Abnehmer, Hirn, Gesicht), Schritte 5–7.
- **Schritt 4 gemeinsam:** Ada liefert den Ton bzw. Text, Marie den Abnehmer.
- Bevor eine von beiden etwas am Mikro ändert, sprechen wir uns ab.

## Offene Fragen an Doc (wenn es so weit ist)

- Darf Solita in der Mitschrift suchen, und wenn ja, nur lokal?
- Soll das Weckwort auch im Unterricht aktiv sein oder nur außerhalb?
- Eine App für beides oder zwei Apps, die sich das Ohr teilen?
- Soll die Mitschrift nur in Unterrichtszeiten aufnehmen und sich nach dem Stundenplan selbst pausieren? Gespräche mit
  Kolleginnen und Kollegen im Lehrerzimmer fallen auch unter § 201 StGB.
