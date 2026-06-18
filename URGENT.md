# URGENT — bitte zuerst lesen (für Agenten)

> Zeitkritische Dinge, die beim Arbeiten an diesem Repo leicht übersehen werden.
> Stand: 2026-06-17.

---

## 1. ⚠️ Edge Functions müssen DEPLOYED werden — Push/Merge allein reicht NICHT

`supabase/functions/**` läuft **auf Supabase**, nicht auf GitHub Pages. GitHub
Pages serviert nur statische Dateien (`HTML/**`, JS, CSS). **Jede** Änderung an
einer Edge-Function ist erst live, wenn sie deployed wurde:

```sh
supabase functions deploy <name> --no-verify-jwt
# z. B.: supabase functions deploy claude --no-verify-jwt
```

**Konsequenz:** Wenn du `supabase/functions/...` änderst, nach `main` mergst und
denkst „läuft" — es läuft NICHT, bis jemand `supabase functions deploy` ausführt.
Im Zweifel den Menschen (Doc) bitten, zu deployen, und es hier/in der PR vermerken.

Betroffene Functions: `claude`, `deepseek`, `gemini`, `identify`, `gmail`,
`gmail-send`, `fuel-prices`, `media-sign`, `push-on-message`, `solita-config`,
`solita-note`, `solita-sync`, `tts`.

---

## 2. OFFEN: Solita Prompt-Caching-Fix wartet aufs Deploy

- **Was:** `supabase/functions/claude/index.ts` cacht jetzt auch die
  **Gesprächs-Historie** (vorher nur System+Tools). Spart im Tool-Loop und über
  mehrere Turns deutlich Anthropic-Kosten.
- **Branch:** `claude/solita-cache-message-history`.
- **MUSS deployed werden** (siehe §1), sonst greift der Fix nicht.
- **Verifizieren:** In Solitas DEBUG-Fenster die Zeile
  `€ chat: ↑… ↓… · Cache XX% (…r/…w) …` ansehen. Ab dem 2. Turn / bei Tool-Hops
  sollte `Cache %` **> 0** sein (`…r` = cache reads). Bleibt es bei **0 %**, ist
  der gecachte Prefix noch zu klein **oder** die rollende Summary ändert sich zu
  oft → dann Persona (statisch) und Summary (volatil) in **zwei** System-Blöcke
  trennen, damit die Persona gecacht bleibt.

### Kosten-Kontext
- Anthropic-Alert: ~6 €/Tag auf der Org. Treiber sind **(a)** Solita (Claude über
  die `claude`-Edge-Function, Default `claude-sonnet-4-6`) und **(b)** lange
  Claude-Code-Agent-Sessions (Opus 4.8, 1M-Kontext) — beide zählen auf dieselbe Org.
- Solita hat einen **eigenen Kostenzähler**: `localStorage['solita_cost_total']`
  + DEBUG-Zeile (`accountUsage` in `HTML/js/solita-brain.js`). Diese Σ-€-Zahl =
  Solitas kompletter Verbrauch — gut zum Aufteilen „Solita vs. Code-Agent".
- Anthropic Console → Usage zeigt den maßgeblichen Split pro Modell/Key.

---

## 3. Caching-Regeln, die hier gelten (Kurzfassung)

- Caching ist ein **Prefix-Match**: jede Byte-Änderung im Prefix invalidiert alles
  danach. Reihenfolge: `tools → system → messages`.
- **Kein** `datetime.now()`, kein Datum/keine Uhrzeit/GPS in System-Prompt oder
  Tools — sonst Cache-Miss bei jedem Request. (Solitas Persona ist bewusst statisch.)
- Mindest-Prefix bis Caching feuert: **2048** Tokens (Sonnet 4.6) bzw. **4096**
  (Haiku 4.5 / Opus). Darunter cacht es **still gar nicht** (kein Fehler,
  `cache_creation_input_tokens: 0`).
- Max **4** `cache_control`-Breakpoints pro Request. Die `claude`-Function nutzt
  jetzt 3 (tools + system + letzte Message).

---

## 4. Arbeits-Konventionen (siehe CLAUDE.md)

- Jede Aufgabe auf **frischem Branch** von aktuellem `origin/main`.
- Nach jeder Änderung **committen + pushen auf den Branch** — **nie** auf `main`,
  **nie** Force. `main` ändert nur Doc per Merge/PR (Regel 20).
- Vor jedem Commit Diff auf **Secrets** prüfen (Regel 18; Repo ist public).
