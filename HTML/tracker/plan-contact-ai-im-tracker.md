# Plan: „Contact AI" im Tracker — mit einem Agenten direkt aus der App reden

> Ideen-/Plan-Notiz von Doc (2026-06-11): „Future Now." **Noch nicht gebaut** (CLAUDE.md Regeln 2/4).
> Ziel: nicht mehr über die Claude-App reden, sondern **direkt aus dem Tracker** mit einer KI/einem
> Agenten — bis hin zu „sprich einen Wunsch rein → der Agent ändert den Code und pusht".
> Verbunden mit Idee 19 (Live-Config) und `plan-fernsteuerung-remote-config.md`.

## Grundprinzip (wichtig!)
**Die App ist nur die Fernbedienung. Die KI/der Agent läuft server-seitig. Die App schickt nur einen
HTTP-Call.** Im Browser/Capacitor läuft **kein** SDK, **kein** git, **kein** API-Key.
→ Der Einwand „SDK läuft nie im Web" ist richtig — wird aber dadurch gelöst, dass das SDK **gar nicht
im Client** läuft. Auch **nicht** in Capacitor einbetten (Webview/on-device; ein Agent mit git-Zugriff
gehört nicht aufs Handy).

## Stufe 1 — „Contact AI": Chat/Q&A direkt in der App
- App → **Supabase Edge Function** → **Claude API** (Key **server-seitig**, nie im Browser, Regel 18) → Antwort.
- Kann: Q&A, **Fotos beschreiben/erkennen (multimodal)** — löst u. a. das Kunstwerk-Problem —, Sprache→Antwort.
- Modelle: **`claude-opus-4-8`** (1M Kontext, top), **`claude-sonnet-4-6`** (Balance), **`claude-haiku-4-5`**
  (billig); **`claude-fable-5`** als neuestes Modell, sobald passend.
- **Streaming** für Live-Gefühl.
- ⚠️ Das ist ein **frischer** Claude: kennt Gespräch/Fotos, **nicht** das Repo, **kann keinen Code ändern**.

## Stufe 2 — „sprich einen Wunsch rein → Agent ändert Repo + pusht"
Zwei server-seitige Heimstätten für den Agenten:
1. **Claude Code Routines (Anthropic-gehostet)** *(kein eigener Server!)*
   - Einmal eine Routine anlegen (Repo + Prompt) → die App **POSTet** an den Routines-API-Endpoint.
   - **Trigger-Token in einer Supabase Edge Function** (server-seitig) → App ruft Edge Function → die feuert.
   - Läuft auf Anthropics Cloud; gibt eine Session-URL zurück. **Status: experimentell/Beta.**
   - Abrechnung: **Claude-Code-Abo** (Max-Plan).
2. **Claude Agent SDK auf eigenem VPS** *(volle Kontrolle)*
   - Python/Node-Bibliothek, gleiche Werkzeuge wie Claude Code (Read/Edit/Bash/git…).
   - Eigenes Backend-Endpoint: App schickt Wunsch → SDK läuft → editiert/committet/pusht.
   - **Echtes Chat-Hin-und-Her** (Streaming, Sessions, Hooks) baubar.
   - Abrechnung: API-Nutzung bzw. separates Agent-SDK-Kontingent.
- **Edge Functions (Deno, kurzlebig):** super für Stufe 1 **und** zum *Feuern* einer Routine —
  können aber den **vollen Agent-SDK-Loop nicht selbst hosten** (Zeitlimits, kein echtes FS/git).

## Der ganze Kreis (Future Now)
Tracker (Web/Capacitor) → Sprach-Wunsch → **Edge Function** (hält Token) → **Routine/Agent** →
editiert z. B. `config.json` + **push** → die **Live-Config** (Idee 19) zieht's → **Änderung erscheint
live in der App** — ohne je die Claude-App zu öffnen, ohne SDK im Client.

## Ehrliche Caveats (vor dem Bauen verifizieren)
- **Kontext vs. Plan:** Opus 4.8 = **1M Kontext** (Modell-Fähigkeit), aber der **Max-Plan deckelt das
  Nutzungs-Kontingent** (wie oft/wie groß). Vor dem Bau konkret prüfen, um nicht ins Limit zu laufen.
- **Chat-Komfort** (flüssiges Hin-und-Her im eigenen UI) = Frontend-Eigenbau, v. a. beim SDK-Weg.
- **Sicherheit:** Key/Token **immer server-seitig**; der Agent kann das Repo ändern → **Scope/Rechte
  eng setzen**; git-History vergisst nichts.
- **Kosten:** pro Anfrage (Stufe 1) bzw. pro Agent-Lauf (Stufe 2).

## Quellen
- Claude Agent SDK — https://code.claude.com/docs/en/agent-sdk/overview
- Claude Code programmatisch / headless — https://code.claude.com/docs/en/headless
- Routine via API feuern — https://platform.claude.com/docs/en/api/claude-code/routines-fire
- Messages API (Stufe 1) — https://platform.claude.com/docs/en/api/messages

---

## ✅ Stufe 1 GEBAUT (2026-06-12) — „Solita" (Client fertig, Backend-Deploy = Doc)
Aus `labai.html` wurde **`HTML/solita.html`** (git-rename, Verlauf erhalten). Gebaut:
- **Claude-Edge-Function** `supabase/functions/claude/index.ts` — Passwort-Gate (`x-app-pass` gegen
  `LABAI_PASSWORD`), übersetzt die OpenAI-förmige Anfrage auf die **Anthropic Messages API** und gibt
  wieder `choices[0].message.content` zurück (Client bleibt fast gleich). **Kein Key im Repo** (nur
  `Deno.env.get('ANTHROPIC_API_KEY')`).
- **solita.html** zeigt jetzt auf `/functions/v1/claude`, Modell-Auswahl **OPUS 4.8 · SONNET 4.6 (default)
  · HAIKU 4.5**, Persona-System-Prompt, **Kontext-Zusammenfassung** (ältere Turns werden per Haiku in eine
  rollende Summary gefaltet statt vergessen), **Wake-Word „Solita"** (Dauer-Zuhören, pausiert beim
  Vorlesen; Web-Vordergrund — echtes Hintergrund-Wecken bleibt nativ/krass), **XSS-Fix** (WP-5: AI-Text
  wird vor dem Markdown-Rendern escaped). Vorlesen (TTS) war schon da.

### Deploy (DU, einmalig — Agent setzt keine Secrets):
```
supabase functions deploy claude --no-verify-jwt
```
Dann in **Supabase → Edge Functions → Secrets** setzen:
- `ANTHROPIC_API_KEY` = ein Claude-API-Key (console.anthropic.com)
- `LABAI_PASSWORD` = dasselbe Login-Passwort wie bei labai/deepseek (existiert schon)

Danach `solita.html` öffnen → Passwort eingeben → reden/tippen. ⚠️ Bis zum Deploy antwortet Solita mit
Fehler (Function fehlt). **Sicherheit offen:** DeepSeek-Key (AUDIT **S3**) in der alten labai-Krypto ist
toter Code, aber noch **nicht rotiert** — bei Gelegenheit rotieren + den vestigialen Blob aus solita.html
entfernen.

### Stufe 2 (offen): „Wunsch einsprechen → Solita ändert das Repo + pusht" (Claude Code Routines / Agent SDK).
