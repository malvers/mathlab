# email-notes — Notizen/Dateien per E-Mail verschicken

Kleines Skript, das beliebige Dateien als Anhang per **Resend**-API verschickt.
Gedacht für die Tracker-Notizen, funktioniert aber mit jeder Datei.

> **Sicherheit (Repo ist public, CLAUDE.md Regel 18):** Im Code steht **kein** Key.
> API-Key und Zieladresse kommen **ausschließlich** aus Umgebungsvariablen
> (oder einer git-ignorierten lokalen Datei). Niemals committen.

## Einmalige Einrichtung

1. **Resend-Account + API-Key:** auf https://resend.com registrieren → *API Keys* → Key erzeugen.
   - Ohne eigene verifizierte Domain kannst du als Absender `onboarding@resend.dev` nutzen;
     Resend liefert dann nur an **deine eigene** Konto-Adresse. Für freien Versand an beliebige
     Empfänger eine Domain in Resend verifizieren und `MAIL_FROM` darauf setzen.

2. **Zugangsdaten setzen** — zwei Wege:

   **a) Als Umgebungsvariablen** (empfohlen; in der Web-Umgebung über die Environment-Settings):
   ```
   RESEND_API_KEY=re_xxxxxxxx
   MAIL_TO=deine@adresse.de
   # optional:
   MAIL_FROM=Tracker Notes <onboarding@resend.dev>
   ```

   **b) Als lokale, git-ignorierte Datei** `tools/email-notes.local.env` (KEY=VALUE pro Zeile):
   ```
   RESEND_API_KEY=re_xxxxxxxx
   MAIL_TO=deine@adresse.de
   ```
   Diese Datei ist in `.gitignore` ausgeschlossen und wird nie committet.

## Benutzung

```bash
python3 tools/email-notes.py notes/notiz-2026-06-16.md
python3 tools/email-notes.py HTML/tracker/*.md -s "Tracker-Notizen"
python3 tools/email-notes.py backlog.md -s "Backlog" -m "Offene Wünsche."
```

Oder bequem im Claude-Chat: **`/email-notes`** (siehe `.claude/commands/email-notes.md`).

## Hinweise
- Reine Python-Standardbibliothek, keine Abhängigkeiten.
- Sendet über `https://api.resend.com/emails`. Klappt nur, wenn die **Netzwerk-Policy** der
  Umgebung ausgehende HTTPS-Verbindungen zu `api.resend.com` erlaubt.
- Bei „HTTP 403/422" prüfen: Key gültig? Absender (`MAIL_FROM`) erlaubt? Empfänger bei Test-Absender
  = eigene Konto-Adresse?
