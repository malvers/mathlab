# Solita: E-Mail senden — Aufwands-Analyse

Stand: 2026-06-15 · Status: **nur Analyse, nichts gebaut**

Ausgangslage: Das **Lesen** von Gmail ist bereits eingebaut (READ-ONLY).
Frage: Wie aufwendig ist es, Solita auch **senden** zu lassen?

## Kurzantwort

Der **Code** ist klein (≈ 1–2 h), aber es gibt **eine echte Hürde** und
**eine Design-Frage**, die schwerer wiegen als das Tippen.

## Was schon da ist (die Blaupause)

Die Lese-Kette liefert das komplette Muster:

- `supabase/functions/gmail/index.ts` — Edge Function: Passwort-Gate
  (`LABAI_PASSWORD`), OAuth-Token-Refresh (`getAccessToken()`), ruft die
  Gmail-API READ-ONLY auf. **Sendet/löscht/markiert nichts.**
- `HTML/js/solita-gmail.js` — selbst-registrierendes Solita-Tool
  `check_gmail`; schiebt `{ specs, handlers, badges }` in
  `window.SolitaTools` und fasst den Core nicht an (Regel 7).
- `HTML/js/solita-core.js` — Tool-Loop in `sendMessage()` führt Tools aus
  (`execTool`), inklusive registrierter Add-on-Tools.

## Was leicht ist (die Mechanik ist vorhanden)

1. **Neue Edge Function `gmail-send`** (~40 Zeilen) — kopiert aus
   `gmail/index.ts`: gleiches Passwort-Gate, gleiches `getAccessToken()`.
   Statt „list/read" baut sie eine RFC-822-MIME-Mail, base64url-kodiert sie
   und macht **ein** POST auf `…/users/me/messages/send`.
2. **Neues Solita-Tool `send_gmail`** — `solita-gmail.js` kopieren, Schema
   `{ subject, body }` (Empfänger fest, siehe unten), registriert sich
   selbst in `window.SolitaTools`. Core bleibt unangetastet (Regel 7).
3. **Eine Zeile Persona** in `SOLITA_SYSTEM` (`solita-core.js`), damit
   Solita das neue Werkzeug kennt.

## Die echte Hürde: OAuth-Scope (manueller Schritt von Doc)

Der jetzige Refresh-Token hat **nur `gmail.readonly`** — damit kann man
technisch nicht senden. Nötig ist ein **einmaliger** Gang durch den
OAuth-Playground (siehe Header von `gmail/index.ts`) mit zusätzlichem Scope
`gmail.send` und ein **neues Refresh-Token** als Secret
(`GMAIL_SEND_REFRESH_TOKEN`). Kein Code, ~10 Min Handarbeit bei Google —
und nur Doc kann das (Secrets, Regel 18).

## Die Design-Frage: Bestätigung

Lesen ist harmlos (Blast-Radius = null). **Senden geht nach außen und ist
unwiderruflich.** Der Tool-Loop führt Tools aktuell **autonom** aus. Eine
Mail sollte Solita **nicht einfach rausschicken** — sinnvoll ist ein
**Bestätigungs-Schritt** („Soll ich an X mit Betreff Y senden?" → erst nach
dem „ja" wird gesendet). Das ist der eigentlich überlegenswerte Teil.

## Empfehlung / Entscheidungen

- **Empfänger:** erstmal **nur an Doc selbst**
  (michael.r.alvers@gmail.com) — kein freies To-Feld. Sicherer Start.
- **Bestätigung:** offen — mit explizitem „ja"-Schritt (empfohlen) oder
  direkt senden.
- **Isolation:** getrennte Send-Function + getrennter Scope-Token, damit
  Lesen und Senden sauber isoliert bleiben.

## Skizze der Bausteine (noch nicht umgesetzt)

| Baustein | Datei | Aufwand |
|---|---|---|
| Edge Function | `supabase/functions/gmail-send/index.ts` | ~40 Zeilen |
| Solita-Tool | `HTML/js/solita-gmail-send.js` | Kopie von `solita-gmail.js` |
| Persona-Hinweis | `HTML/js/solita-core.js` (`SOLITA_SYSTEM`) | 1 Zeile |
| Scope-Token | Supabase-Secret `GMAIL_SEND_REFRESH_TOKEN` | manuell (Doc) |
