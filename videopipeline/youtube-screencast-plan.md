# Screencast für den YouTube-API-Review — Ablaufplan

Interne Checkliste (nicht für Google). Was Google bekommt, steht in `youtube-api-review.md`.
Testvideo: `videos/subtraktion-demo-1440p.mp4` — 5,7 MB, lädt in Sekunden, Metadaten-Abschnitt
existiert. Gesamtdauer der Aufnahme: rund drei Minuten.

---

## A · Vorbereitung (vor der Aufnahme, 5 Minuten)

1. **Nicht stören** einschalten (Kontrollzentrum → Fokus) — sonst rutscht eine Benachrichtigung
   mit privatem Inhalt ins Bild.
2. **Chrome aufräumen:** alle Tabs bis auf einen leeren schließen. Der Zustimmungsbildschirm zeigt
   gleich deine Google-Adresse — das ist in Ordnung, Google prüft ja genau dieses Konto —, aber
   sonst soll nichts Privates zu sehen sein.
3. **Terminal groß machen:** Cmd-+ drei-, viermal, Fenster auf etwa halbe Bildschirmbreite. Der
   Prüfer muss die Ausgabe lesen können.
4. **Ins Repo wechseln:**
   ```
   cd ~/IdeaProjects/forloop/videopipeline
   ```
5. **Bildschirmaufnahme vorbereiten:** Cmd-Shift-5 → *Optionen* → Mikrofon auf
   „MacBook Air-Mikrofon" → *Gesamten Bildschirm aufnehmen*. Noch nicht starten.

## B · Generalprobe — OHNE Aufnahme

Nie einen Drei-Minuten-Take an einem Weg verbrennen, der noch nie gelaufen ist. Der Upload-Pfad
wurde bis heute **kein einziges Mal** ausgeführt.

```
node youtube-upload.mjs --auth
node youtube-upload.mjs videos/subtraktion-demo-1440p.mp4 --meta
```

Erwartung: Zustimmungsbildschirm im Browser → „✓ Zugriff erteilt", dann eine `https://youtu.be/…`-URL.
Kommt stattdessen ein Fehler, hören wir hier auf und reparieren — dafür ist die Probe da.

Danach das Probe-Video in Studio **löschen** (es ist privat, stört niemanden, aber es soll nicht
neben dem Take auftauchen). Kosten: 1600 von 10 000 Quota-Einheiten am Tag — Probe plus Take
passen sechsmal rein.

## C · Der Take (ein Stück, keine Schnitte)

Aufnahme starten, drei Sekunden warten, dann:

| # | Befehl / Handlung | Englisch dazu sagen |
|---|---|---|
| 1 | `ls -lh videos/*.mp4` | „These are the finished lab videos my pipeline produced on this machine. I upload them to my own YouTube channel." |
| 2 | Datei kurz im QuickLook zeigen (Leertaste) und wieder schließen | „This is one of them — a sixty-second explainer about written subtraction, for my pupils." |
| 3 | `sed -n '/## subtraktion/,/^$/p' videos/youtube-metadaten.md` | „Title, description and tags are maintained in one text file, one section per video." |
| 4 | `node youtube-upload.mjs videos/subtraktion-demo-1440p.mp4 --meta --dry-run` | „A dry run first: this prints exactly what would be sent to the API, and sends nothing." |
| 5 | `node youtube-upload.mjs --auth` → im Browser zustimmen | „One-time authorisation. The scope is youtube.upload — upload only. This is my own account and my own channel." |
| 6 | `node youtube-upload.mjs videos/subtraktion-demo-1440p.mp4 --meta --privacy private` | „Now the real upload, through the YouTube Data API, as a resumable upload. One video, started by hand." |
| 7 | Ausgegebene `youtu.be`-URL anklicken | „And here is the result: the video is on my channel." |
| 8 | Studio-Link öffnen, Titel/Beschreibung/Tags zeigen | „Same title, same description, same tags as in the text file. Visibility is private — the API enforces that while this review is pending." |

Aufnahme stoppen (Cmd-Ctrl-Esc oder das Symbol in der Menüleiste).

## D · Danach

**Datei kleiner machen** (Mail-tauglich, bleibt gut lesbar):
```
ffmpeg -i ~/Desktop/Bildschirmaufnahme*.mov -vf scale=1280:-2 -c:v libx264 -crf 24 \
  -preset medium -c:a aac -b:a 96k ~/Desktop/youtube-api-review-screencast.mp4
```

**In die Antwortmail:**
- der Screencast
- `youtube-api-review.md` (die schriftliche Antwort — gern als PDF)
- `youtube-upload.mjs` und `lib/youtube.mjs` als Quellcode-Anhänge

**Mailtext (kurz halten):**
> Dear YouTube API Services Team,
>
> please find attached the requested material: a screencast showing the complete upload workflow of
> our internal CLI tool end to end, a written walkthrough of the same workflow, and the full source
> of the two files that make up the API client.
>
> The tool is used by one person — the channel owner — to publish short educational videos to his
> own channel. It uses a single scope, youtube.upload, and calls no other endpoint.
>
> Happy to answer any further questions.
