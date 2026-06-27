# AI Board — Architektur

## Überblick

```
┌─────────────────────────────────────────────────────────────┐
│  FlorisBoard-Fork (IME)                                      │
│  Layouts · Wischen · Themes · Vorschlags-Streifen · Tippen   │
└───────────────┬─────────────────────────────────────────────┘
                │ Text vor/um den Cursor (InputConnection)
                ▼
        ┌───────────────────┐
        │ Datenschutz-Gate  │  Feldtyp prüfen · „KI aus"? · nur bei Pause
        └───┬───────────┬───┘
   jeder    │           │  bei Pause (~400 ms), wenn erlaubt
   Anschlag │           ▼
            ▼      ┌──────────────────────────────┐
   ┌──────────────┐│  Supabase Edge-Fn `keyboard` │
   │ Sofortschicht ││  → Gemini Flash              │
   │ Wörterbuch +  ││  (Claude für „Umschreiben")  │
   │ n-gram, lokal ││──────────────────────────────┘
   └──────┬────────┘           │ Phrasen-Vorschläge
          │                    ▼
          └────────►  Vorschlags-Streifen  ◄──────────
                     (Sofort-Wörter + Cloud-Phrasen)
```

## 1. Basis — FlorisBoard-Fork

- Kotlin / Jetpack Compose, Apache-2.0, aktiv gepflegt.
- Bringt mit: Tastatur-Layouts (inkl. DE), Glide/Wischen, Themes, Vorschlags-Strip,
  die ganze `InputMethodService`-Anbindung.
- Wir verändern: App-Name/Package → „AI Board", und klinken unsere
  Vorschlags-Quelle in Floris' bestehende Suggestion-Pipeline ein.

## 2. On-Device-Sofortschicht

- **Aufgabe:** bei *jedem* Anschlag sofort 1–3 plausible Wörter, ohne Netz.
- **Technik (Start):** persönliches Wörterbuch + n-gram, das mittippt und lernt.
- **Optional später:** kleines On-Device-LLM (z. B. Gemma via MediaPipe LLM
  Inference) — nur wenn das n-gram messbar zu schwach ist.
- **Wichtig:** läuft immer, auch offline und bei „KI aus". Das ist die Grundsicherung.

## 3. Cloud-Gehirn

- **Auslöser:** Tipp-Pause (Debounce ~400 ms) — *nicht* pro Anschlag (Latenz/Kosten).
- **Eingabe:** der gefilterte Kontext vor dem Cursor (z. B. letzter Satz / N Zeichen).
- **Weg:** App → Supabase Edge-Fn `keyboard` → Gemini Flash → kurze Phrasen-Liste.
- **Ausgabe:** ganze Phrasen/Satzenden, die in den Streifen kommen; Tap fügt ein.
- **„Umschreiben/Ton":** expliziter Knopf, kein Pro-Pause-Aufruf → hier darf es
  langsamer/schlauer sein → Claude.
- Edge-Fn hält den Modell-Key server-seitig (nie in der App — Repo ist public).

## 4. Datenschutz-Gate

Eine Tastatur sieht *alles*. Das Gate ist daher Pflicht, nicht Kür — Details in
`docs/datenschutz.md`. Kurz:

- **Feldtyp-Filter:** Passwort/PIN/Nummern/„no personalized learning"-Felder →
  Cloud aus, nur Sofortschicht.
- **Nur bei Pause:** kein Streaming jedes Tastendrucks an den Server.
- **Harter Toggle:** „KI aus" → 100 % lokal.
- **Kein Server-Log:** die Edge-Fn proxyt nur, speichert nichts.

## Datenfluss-Regeln (Kurz)

1. Tippen → Sofortschicht füllt sofort.
2. Pause + Gate erlaubt → Kontext an Cloud → Phrasen ergänzen den Streifen.
3. Gate verbietet (Passwortfeld / KI aus / offline) → nur Sofortschicht, fertig.
