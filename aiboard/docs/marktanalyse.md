# AI Board — Marktanalyse & Machbarkeit (Stand 2026)

> **Wie dieser Bericht entstand.** Aus einem Recherche-Harness mit parallelen Web-Suchen,
> Quellen-Abruf und **adversarialer Prüfung jeder Behauptung** (eine Aussage überlebt nur,
> wenn sie 2 von 3 Widerlegungs-Versuchen standhält). Ergebnis: **67 verifizierte Aussagen**
> (64 davon „high confidence"). Belegte Aussagen sind unten mit Quellen-Nummern `[S#]` markiert.
> Wo Zahlen nur indikativ sind (gelistete Quelle, nicht jede Einzelzahl gegengeprüft), steht das
> ausdrücklich dabei. Quellenliste am Ende.

---

## 0. Das Fazit zuerst

**Die Idee ist nicht „schon gemacht" — aber sie ist auch nicht magisch neu. Neu ist die saubere
Ausführung.** Konkret, belegt:

- **Niemand** treibt die *laufende, inline* Wortvorhersage mit einem echten LLM. Überall, wo „KI"
  draufsteht, sitzt das große Modell **hinter einem Knopf** (Umschreiben/Proofread/Chat) — die
  eigentliche Tipp-Vorhersage macht weiter ein kleines Modell.
- Die Welle der Dritt-„AI-Keyboards" ist überwiegend **Gimmick**: Text muss mit Sondersyntax
  getriggert werden, läuft über fremde Cloud-Keys, **ohne Datenschutz-Gate** — teils mit echten
  Datenlecks in der Vergangenheit.
- Die **Marktlücke** ist exakt unser Plan: nahtlose inline-Phrasenvorhersage per LLM **und**
  striktes Datenschutz-Gate. Das hat noch keiner zusammengebracht.
- Der harte Teil ist **nicht** die Idee, sondern **Latenz, Datenschutz und ein verlässlicher
  On-Device-Fallback**. Genau dafür ist unsere Hybrid-Architektur gebaut.

---

## 1. Wettbewerbslandschaft — wer sagt wirklich was vorher?

### Gboard (Google)
- Die **inline** Tipp-Vorhersage (nächstes Wort / Smart Compose) läuft über ein **separates,
  kleines Nicht-LLM-Modell** (LSTM/skalierter Decoder, föderiert trainiert) — **nicht** über Gemini `[S4]`.
- Die **Gemini-Schicht** steckt in den **„AI Writing Tools"** (Proofread, Rephrase, Ton): laufen
  **on-device über Gemini Nano v2**, Text geht nicht in die Cloud — aber sie sind **diskrete
  Knopf-Aktionen** (markieren → Tippen → Werkzeug), **keine** laufende Phrasenvorhersage `[S3]`.
- Gemini Nano ist auf **Flaggschiff-SoCs** beschränkt (Snapdragon 8 Elite, Dimensity 9400,
  Exynos 2500) `[S3]`.
- **Einordnung:** Das LLM ist da, aber **bewusst nicht** in die laufende Vorhersage verdrahtet.

### Microsoft SwiftKey
- Produktiv-Vorhersage = kleines **On-Device-Neuronalmodell (GRU)**. Ein **differenziell-privates,
  herunterskaliertes GPT-2** (Transformer) wurde als Next-Word-Modell **erprobt** und bringt
  gegenüber dem Produktiv-GRU nur **kleine, konsistente Gewinne** — bei **mehr Speicher und mehr
  Latenz**; integriert via ONNX `[S1]`. Also: Transformer **experimentell**, GRU **im Versand**.
- Der **Cloud-Copilot (GPT-4)** in SwiftKey ist ein **angeflanschter Umschreib-/Chat-Knopf**,
  **nicht** der Inline-Prädiktor `[S1]`.

### Apple iOS-Tastatur (ab iOS 17)
- Autokorrektur/Vorhersage auf ein **On-Device-Transformer-Sprachmodell** umgestellt `[S2]`.
  Das ist aktuell **das Seriöseste** in Richtung „echte KI-Vorhersage" am Tippfluss — aber bewusst
  dezent (Wort-/Korrektur-Ebene), **kein** kontextuelles Phrasen-Umschreiben im Tippen, und iOS-only.
  *(Belegtiefe: Apple-Newsroom-Primärquelle zum Transformer-Umstieg; Detailtiefe geringer als bei den
  obigen arXiv-Belegen.)*

### Samsung Keyboard
- Klassische Vorhersage + angedockte **Galaxy-AI**-Schreibhilfen (Übersetzen, Ton, Zusammenfassen)
  als **Werkzeuge**, nicht als Inline-Prädiktor. *(Allgemeinwissen, in dieser Recherche nicht
  primärbelegt — als „bolt-on tools, wie die anderen" einzuordnen, niedrigere Konfidenz.)*

### Typewise
- Schweizer, **on-device**, datenschaftsbetont, vermarktet „KI-Vorhersage" (Honigwaben-Layout).
  Eine der **ernsteren** Dritt-Apps. *(Allgemeinwissen, nicht primärbelegt in dieser Recherche.)*

### FlorisBoard / OpenBoard / AOSP LatinIME (Open Source)
- **FlorisBoard**: Apache-2.0, Android 8.0+, betont **Privatsphäre** (keine INTERNET-Permission,
  keine Telemetrie, Inkognito-Modus) `[S8]`. **Aber:** aktuelle Releases enthalten **gar keine**
  Wortvorhersage/Rechtschreibung — auf Meilenstein v0.6 verschoben. **Ein Fork startet also ohne
  eigene Vorhersageschicht** `[S8][S9]`. Die in Arbeit befindliche NLP ist ein **statistisches
  n-gram-Modell in C++**, **nicht** neuronal/LLM, **nicht** vortrainiert (lernt live) `[S9][S10]`.
  Der Maintainer hielt On-Device-LLMs (selbst kleinste LLaMa) 2023 für Tastaturen **für unrealistisch** `[S9]`.
- **OpenBoard / AOSP LatinIME**: klassische Wörterbuch-/n-gram-Vorhersage, kein LLM `[S22]`.

### Dritt-„AI-Keyboards" (ChatGPT-/Rizz-Keyboards) — die laute Welle
- Stellvertretend **KeyboardGPT**: ein **LSPosed/Xposed-Modul** (kein eigenständiges IME), das sich
  in bestehende Tastaturen einklinkt (Gboard, SwiftKey, Yandex, …) `[S5]`.
  - KI wird **nur über getippte Trigger** aktiviert (`$prompt$`, `%…%`, `%s …%`) — **keine** ambiente
    Inline-Vorhersage `[S5]`.
  - **Rein Cloud**, Nutzer bringt **eigene API-Keys** (Gemini/ChatGPT/Groq/OpenRouter/Claude),
    **kein On-Device-Modell** `[S5]`.
  - **Keine** Datenschutz-Erklärung, **kein** Feldtyp-/Passwort-Ausschluss dokumentiert — getippter
    Text geht **ungated** an die gewählte Cloud `[S5]`.
- **Datenschutz-Historie der Kategorie ist übel:** Die App **ai.type** hat Daten von **31 Mio.**
  Nutzern offengelegt `[S6]`; akademische Analysen stufen Dritt-Tastaturen seit Jahren als
  Keylogger-Risiko ein `[S7]`.

---

## 2. Feature-Vergleich

| Tastatur | Inline-Vorhersage-Technik | LLM im Einsatz? | On-device / Cloud | LLM = inline oder nur Knopf? | Datenschutz-Gate | Beleg |
|---|---|---|---|---|---|---|
| **Gboard** | kleines Nicht-LLM-Modell (LSTM/Decoder) | ja, aber separat | inline on-device; Nano on-device | **nur Knopf** (Writing Tools) | gut (Nano lokal) | `[S3][S4]` |
| **SwiftKey** | GRU (Transformer experimentell) | inline: nein; Copilot: ja | inline on-device; Copilot cloud | **nur Knopf** (Copilot) | gemischt | `[S1]` |
| **Apple iOS 17+** | **On-Device-Transformer** | ja (klein, lokal) | on-device | Vorhersage inline, aber wort-/korrektur-nah | gut (lokal) | `[S2]` |
| **Samsung** | klassisch + Galaxy-AI-Tools | als Werkzeuge | hybrid | **nur Knopf** | gemischt | (n. primärbelegt) |
| **Typewise** | on-device, „KI"-Vorhersage | beworben | on-device | inline (Anspruch) | gut (Anspruch) | (n. primärbelegt) |
| **FlorisBoard** | **keine** in Release; n-gram (C++) in Arbeit | nein | on-device | — (noch nichts) | sehr gut (keine Netz-Permission) | `[S8][S9][S10]` |
| **OpenBoard/AOSP** | Wörterbuch/n-gram | nein | on-device | — | gut | `[S22]` |
| **KeyboardGPT & Co.** | keine (Trigger-basiert) | ja (Cloud, BYO-Key) | cloud | **Knopf/Trigger** | **keins** | `[S5]` |
| **→ AI Board (Plan)** | **n-gram instant + LLM-Phrase bei Pause** | **ja, inline** | **hybrid** | **inline + Ton-Knopf** | **strikt (Feldtyp-Gate)** | dieser Plan |

---

## 3. Die Lücke — und was davon echt vs. Marketing ist

**Echt (belegt):**
- Die **laufende Inline-Vorhersage** wird **nirgends** von einem echten LLM getrieben. Gboard nutzt
  inline ein separates kleines Modell `[S4]`, SwiftKey den GRU `[S1]`, Apple einen kleinen
  On-Device-Transformer `[S2]`. Die LLM-Schicht sitzt überall **hinter Knöpfen** `[S1][S3]`.
- Die Dritt-Apps lösen das **nicht**: Trigger-Syntax, Cloud-BYO-Key, **kein Gate** `[S5]`.
- **Datenschutz** ist in der Kategorie ein offener Schwachpunkt mit realer Schadensbilanz `[S6][S7]`.

**Marketing-„KI":**
- „AI Keyboard" heißt fast immer **Umschreib-/Chat-Knopf**, nicht klügeres Tippen.
- „On-device AI" bei Gboard ist real (Nano), aber eben **diskrete Werkzeuge**, kein Tippfluss `[S3]`.

**Die unbesetzte Position:** *nahtlose, inline, kontextuelle Phrasen-Vorhersage per LLM* **plus**
*striktes Datenschutz-Gate*. Genau das ist AI Board. **Ehrlich:** Apples On-Device-Transformer ist
der nächste ernsthafte Nachbar — aber er macht Wort-/Korrektur-Ebene, nicht Phrasen-im-Kontext, und
ist iOS-only. Auf Android ist das Feld **offen**.

---

## 4. Technische Pipeline & Machbarkeit

### 4.1 Android-IME-Grundlagen (belegt, stabil)
- Ein IME ist ein **`InputMethodService`** mit Callbacks für UI, Eingabe und Textauslieferung; der
  Kanal zur App ist die **`InputConnection`** (Text um den Cursor lesen, Text committen) `[S12][S13]`.
- **Feldtyp erkennen** über `EditorInfo.inputType` + `TYPE_MASK_CLASS`; Passwortfelder via
  `TYPE_TEXT_VARIATION_PASSWORD` (+ `…_WEB_PASSWORD`, `…_VISIBLE_PASSWORD`, `…NUMBER_VARIATION_PASSWORD`).
  **Das ist der dokumentierte Hook fürs Datenschutz-Gate** `[S12]`.
- Android-Leitlinie **verlangt** Passwort-Sonderbehandlung: in Eingabe- **und** Vorschlags-Ansicht
  verbergen, **nie** auf dem Gerät speichern `[S12]`.
- **Vorschläge einspeisen:** `onCreateCandidatesView()` liefert den Vorschlags-Streifen (oder `null`).
  Seit **Android 11** können IMEs Vorschläge **inline im Streifen** zeigen `[S12][S13]`.

### 4.2 FlorisBoard als Basis (belegt)
- **Apache-2.0 → legal forkbar**, Android 8.0+ `[S8]`. Pflicht: LICENSE/NOTICE behalten, Änderungen
  ausweisen, **Name „FlorisBoard"** ist evtl. markenbehaftet (umbenennen).
- **Reifegrad-Warnung:** noch **Beta** (stabil v0.5.2, 28.11.2025; öffentliche Play-Beta erst v0.7) `[S8]`.
- **Wichtig fürs Andocken:** FlorisBoard hat eine **pluggbare `NlpProvider`-Schnittstelle**
  (`SuggestionProvider`/`SpellingProvider`, pro Subtype auswählbar, mit Fallback) `[S9][S11]`.
  **Genau hier klinkt unsere Vorschlagsquelle ein** — wir liefern einen eigenen `SuggestionProvider`.
  Da der native n-gram-Provider ohnehin **noch nicht fertig** ist, treten wir niemandem auf die Füße.

### 4.3 On-Device-LLM-Pfad (Sofortschicht / Option)
- Google **MediaPipe LLM Inference (Android)** bzw. **LiteRT-LM** erlauben kleine LLMs (z. B. Gemma)
  on-device `[S14][S17]`.
- **Realitätscheck Latenz/RAM:** Mobile-LLM-Benchmarks und Praxisberichte zeigen, dass selbst kleine
  Modelle auf dem Handy spürbar träge sind und RAM kosten — u. a. der offene Report
  *„Is Gemma on device really this slow?"* und mehrere Mobile-LLM-Benchmarks `[S15][S16][S18]`.
  *(Belegtiefe: Quellen gelistet/abgerufen, Einzelzahlen aber nicht alle adversarial gegengeprüft →
  als Größenordnung lesen.)*
- **Konsequenz für uns:** Ein On-Device-LLM **pro Tastendruck** ist heute **nicht** sinnvoll. Daher
  unsere Aufteilung: **On-Device = schnelles n-gram/Wörterbuch** (instant, lokal), **LLM = Cloud bei
  Tipp-Pause**. Ein On-Device-Gemma bleibt **optionale** Ausbaustufe, kein Tag-1-Baustein.

### 4.4 Cloud-LLM-Pfad (das Gehirn)
- **Gemini Flash / Flash-Lite** sind günstig und schnell genug für Vorschläge bei Pause `[S19][S20]`.
  Ein Vorhersage-Aufruf schickt nur **wenig Kontext** (letzter Satz) und bekommt eine **kurze**
  Phrase → Kosten pro Aufruf im **Bruchteil-eines-Cents**-Bereich. *(Größenordnung; konkrete
  $/Mio-Token vor Einsatz an `[S19]` gegenchecken.)*
- **Debounce** ist Pflicht: nicht pro Anschlag, sondern nach **~300–500 ms** Pause feuern — Standard
  für Echtzeit-Vorschläge `[S21]`. Spart Kosten, Latenz und Datenmenge.

### 4.5 Datenschutz-Gate (das Alleinstellungsmerkmal)
- **Vor jedem** Cloud-Aufruf: Feldtyp prüfen `[S12]`. Passwort/PIN/„no personalized learning" →
  **kein** Cloud-Call, **kein** Lernen. Nur Sofortschicht.
- Cloud **nur bei Pause**, harter **„KI aus"**-Schalter, **minimaler** Kontext, server-seitig **nichts**
  speichern. (Details: `docs/datenschutz.md`.)
- Das ist nicht nur Kür: Die Kategorie hat reale Lecks (ai.type, 31 Mio.) — Datenschutz ist unser
  Vertrauens- und Marketing-Hebel `[S6][S7]`.

---

## 5. „Was wir brauchen" — Bauliste & Risiken

### Bauliste (Tag 1 → Ausbau)
1. **FlorisBoard forken**, umbenennen (Package/Name/Icon), bauen, aufs Pixel — tippt. *(P0, `docs/floris-fork.md`)*
2. **Eigener `SuggestionProvider`** im FlorisBoard-NLP-Interface als Einklink-Punkt `[S9][S11]`.
3. **Sofortschicht:** lokales Wörterbuch/n-gram für Instant-Wörter (lernt live).
4. **Cloud-Brain:** Supabase-Edge-Fn → **Gemini Flash**, getriggert per **Debounce ~400 ms** `[S19][S21]`.
5. **Datenschutz-Gate:** `EditorInfo.inputType`-Prüfung, „KI aus"-Toggle, Min-Kontext `[S12]`.
6. **Vorschlags-Streifen** füllen (`onCreateCandidatesView` / Inline-Strip) `[S12][S13]`.
7. **Ausbau:** Ton/Umschreiben (Claude-Knopf), optional On-Device-Gemma als Fallback `[S14]`.

### Risiken & Fallstricke
- **On-Device-LLM-Latenz** ist real → *nicht* pro Anschlag; Hybrid-Split ist die Antwort `[S15][S18]`.
- **Cloud = Latenz + Kosten + Datenschutz** → Debounce, Kontext kappen, Feldtyp-Gate `[S12][S21]`.
- **FlorisBoard ist pre-1.0-Beta** → Basis bewegt sich; Upstream-Updates einplanen `[S8]`.
- **Keine fertige Vorhersageschicht zum Erben** → wir bauen Gehirn **und** Verdrahtung `[S8][S9]`.
- **Apache-2.0-Pflichten** (NOTICE/Attribution) + **„FlorisBoard"-Markenname** → sauber umbenennen `[S8]`.
- **Flaggschiff-Gating** bei On-Device-Nano zeigt: schwere KI braucht starke Hardware — gut, dass unser
  Pflicht-Pfad die Cloud ist und On-Device nur die leichte Sofortschicht `[S3]`.

---

## Quellen

- `[S1]` SwiftKey DP-Transformer (GPT-2, next-word, vs. Produktiv-GRU) — arXiv 2505.05648 — https://arxiv.org/abs/2505.05648
- `[S2]` Apple, iOS 17 On-Device-Transformer-Vorhersage — https://www.apple.com/newsroom/2023/06/ios-17-makes-iphone-more-personal-and-intuitive/
- `[S3]` Gboard AI Writing Tools (Gemini Nano, on-device, SoC-Gating) — https://www.androidauthority.com/gboard-writing-tools-other-android-phones-3593589/
- `[S4]` Gboard-Decoder = separates Nicht-LLM-Inline-Modell — arXiv 2410.15575
- `[S5]` KeyboardGPT (LSPosed, Trigger, Cloud-BYO-Key, kein Gate) — https://github.com/Mino260806/KeyboardGPT
- `[S6]` ai.type — 31 Mio. Nutzerdaten offengelegt — https://hackread.com/keyboard-app-caught-collecting-users-data-after-31m-records-leaked-online/
- `[S7]` „Keyboard or Keylogger?" (SKKU SecLab) — https://seclab.skku.edu/wp-content/uploads/2015/07/mka.pdf
- `[S8]` FlorisBoard (Apache-2.0, 8.0+, Beta, Privacy) — https://github.com/florisboard/florisboard
- `[S9]` FlorisBoard NLP-Status (n-gram/C++, NlpProvider) — Discussion #2197 — https://github.com/florisboard/florisboard/discussions/2197
- `[S10]` FlorisBoard „Suggestions Phase 1" — PR #329 — https://github.com/florisboard/florisboard/pull/329
- `[S11]` FlorisBoard-Architektur (NlpManager/Provider) — https://deepwiki.com/florisboard/florisboard
- `[S12]` Android „Create an input method" (InputType, Passwort, Candidates) — https://developer.android.com/develop/ui/views/touch-and-input/creating-input-method
- `[S13]` `InputMethodService` API-Referenz — https://developer.android.com/reference/android/inputmethodservice/InputMethodService
- `[S14]` MediaPipe LLM Inference (Android) — https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android
- `[S15]` LLM-Performance-Benchmark Mobile — arXiv 2410.03613 — https://arxiv.org/html/2410.03613v1
- `[S16]` PalmBench (komprimierte LLMs mobil) — arXiv 2410.05315 — https://arxiv.org/pdf/2410.05315
- `[S17]` LiteRT-LM (On-Device-GenAI) — https://developers.googleblog.com/blazing-fast-on-device-genai-with-litert-lm/
- `[S18]` „Is Gemma on device really this slow?" — Issue #379 — https://github.com/google-ai-edge/mediapipe-samples/issues/379
- `[S19]` Gemini API Pricing — https://ai.google.dev/gemini-api/docs/pricing
- `[S20]` Gemini 2.5 Flash-Lite Pricing — https://pricepertoken.com/pricing-page/model/google-gemini-2.5-flash-lite
- `[S21]` Debounce für Echtzeit-Vorschläge — https://dev.to/raffizulvian/beyond-the-keystrokes-solving-real-time-suggestions-with-debounce-k18
- `[S22]` OpenBoard / AOSP LatinIME — https://grokipedia.com/page/openboard_keyboard
- `[S23]` „AI Keyboards on Mobile" (Überblick) — https://www.clevertype.co/post/chatgpt-in-your-pocket-ai-keyboards-on-mobile

> **Konfidenz-Hinweis:** Abschnitte 1–4.2 und 4.5 stützen sich auf adversarial verifizierte
> Primärquellen (arXiv, offizielle Android-Docs, Projekt-Repos). Die On-Device-Latenz-Größenordnungen
> (4.3) und die Gemini-Preise (4.4) sind **indikativ** — Quellen gelistet, vor dem realen Einsatz die
> aktuellen Zahlen an `[S19]`/`[S14]` gegenchecken.
