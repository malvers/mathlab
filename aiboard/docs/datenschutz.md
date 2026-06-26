# AI Board — Datenschutz-Gate

Eine Tastatur sieht **jedes** getippte Zeichen — Passwörter, PINs, Nachrichten,
Suchanfragen. Deshalb ist Datenschutz hier kein Feature, sondern die Grundlage.
Wenn das nicht sauber ist, ist die ganze App nicht vertrauenswürdig.

## Eiserne Regeln

1. **Sensible Felder verlassen das Gerät NIE.**
   Das IME kennt den Feldtyp (`InputType` / `imeOptions`). Bei
   - Passwort (`TYPE_TEXT_VARIATION_PASSWORD`, `…_WEB_PASSWORD`, `…_VISIBLE_PASSWORD`),
   - PIN/Nummern-Passwort (`TYPE_NUMBER_VARIATION_PASSWORD`),
   - Feldern mit `IME_FLAG_NO_PERSONALIZED_LEARNING`,
   
   → **kein** Cloud-Aufruf, **kein** Lernen ins Wörterbuch. Nur die Basistastatur.

2. **Cloud feuert nur bei einer Tipp-Pause**, nie pro Anschlag. Kein
   Zeichen-für-Zeichen-Stream an den Server.

3. **Harter „KI aus"-Schalter.** Ein Tap → 100 % lokal, kein Netz. Sichtbar und
   schnell erreichbar (nicht in Untermenüs vergraben).

4. **Server speichert/loggt nichts.** Die Supabase-Edge-Fn ist ein reiner Proxy:
   Kontext rein → Modell → Phrasen raus. Keine Persistenz, keine Analytics auf Inhalt.

5. **Kein Secret in der App.** Modell-Keys liegen server-seitig in der Edge-Fn.
   Das Repo ist public — nie ein Key/Token im Client (Projektregel 18).

## Was lokal bleibt

- Das persönliche Wörterbuch (gelernte Wörter) lebt **nur** auf dem Gerät.
- Export/Backup nur, wenn der Nutzer es aktiv auslöst.

## Transparenz

- Sichtbarer Indikator, wenn gerade Cloud-Vorschläge geholt werden.
- Klartext-Erklärung in den Einstellungen: was wann das Gerät verlässt, was nie.

## Noch zu klären

- Minimaler nötiger Kontext: so wenig wie möglich senden (letzter Satz statt ganzer
  Verlauf), damit auch im erlaubten Fall wenig Inhalt das Gerät verlässt.
- Opt-in vs. Opt-out für die Cloud beim ersten Start (Tendenz: bewusste Zustimmung).
