# Tracker — Bug: Live-Broadcast funktioniert (gerade) nicht

> Beobachtung von Doc (2026-06-11), **live unterwegs**: Live-Broadcasting scheint im Moment **nicht zu
> funktionieren** — Zuschauer (Screenshots) sehen nichts. **Die Links/Namen (z. B. „vsb") sind korrekt.**
> Dokumentiert, **noch nicht gefixt** (CLAUDE.md Regeln 2/4).

## Wie es funktioniert (kurz)
Sender (`tracker.js`) sendet über **Supabase Realtime Broadcast** auf Kanal `live:<name>`; Viewer
(`view.html`) abonniert denselben Kanal. Kein DB/Token. Sender-Kadenz ~4 s (`pos`), Trail alle ~15 s.

## Verdächtige Ursachen (nach Wahrscheinlichkeit)
1. **Kanalname-Mismatch durch Groß/Klein.** Sender bildet den Kanal **immer kleingeschrieben**:
   `canon = name.trim().toLowerCase()` → `'live:' + canon` (`tracker.js:979,986`). Der **erzeugte Link**
   ist auch lowercase (`tracker.js:1649`). **ABER** wenn ein Zuschauer den Namen **selbst eintippt**,
   wird er **nicht** kleingeschrieben: `location.search = '?live=' + encodeURIComponent(v)`
   (`view.html:466`), und `goLive('live:' + key)` (`view.html:359`) nimmt den Key roh. Tippt also jemand
   „VSB"/„Vsb", landet er auf `live:VSB` ≠ `live:vsb` → **sieht nichts.** → **Fix: view.html den
   `?live=`-Key ebenfalls `.toLowerCase()`.**
2. **Supabase Realtime aus/gedrosselt/Störung** oder Sender & Viewer auf **unterschiedlichem
   Supabase-Projekt/Key** (`SUPABASE_URL/KEY` in tracker.js vs. view.html vergleichen).
3. **Sender startet ohne Track** → `beginLive` bricht mit „Erst aufzeichnen, dann LIVE" ab
   (`tracker.js:982`); `broadcastLive` sendet nur bei `track.length` (`:935`). Wenn Live „an" scheint,
   aber keine Aufzeichnung läuft, kommt nichts an.
4. Sender-`ensureSb()`/`subscribe` schlägt still fehl (catch → Toast „Live fehlgeschlagen").

## Schnell eingrenzen
- Zuschauer den **kopierten Link** (lowercase) öffnen lassen, **nicht** den Namen tippen → wenn's dann
  geht, ist es **Ursache 1**.
- Sender: läuft eine **Aufzeichnung** (Track-Punkte vorhanden)? (Ursache 3)
- DebugWindow/Konsole auf „Live fehlgeschlagen" prüfen.

## Dauerhafter Fix + Diagnose (siehe Rückkanal-Wunsch)
Ein **Rückkanal/Presence** würde genau das sichtbar machen: **Zuschauer-Zähler** („3 sehen dich") +
**Empfangs-Bestätigung** („zuletzt empfangen vor 2 s"). Dann sieht der Sender sofort: 0 verbunden =
Name/Link-Problem, verbunden aber kein Empfang = Sende-Problem. (Eigene Idee — als Feature einplanen.)

## Dateien
- `HTML/js/tracker.js` (`beginLive`/`broadcastLive`/`stopLive`, ~971–1013)
- `HTML/tracker/view.html` (`goLive`, Key aus `?live=`, ~358–367, 466)
