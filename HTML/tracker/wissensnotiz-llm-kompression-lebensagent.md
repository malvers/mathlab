# Wissens-Notiz: Tokens, Kompression & der Lebens-Agent

> Festgehalten 2026-06-11. Zusammenfassung der Konzept-Gespräche (Doc ↔ Solita), damit nichts verloren geht.
> Hintergrund für den lebenslangen Agenten („Samantha"/Solita).

## A. Tokenisierung — ist das Kompression?
- **Eher Umstückeln, nicht echte (Bit-)Kompression.** Tokens sind eine Verpackung von Text.
- **Vokabular-Größe:** ~**50.000–200.000** Tokens (GPT-2 ~50k · GPT-4 ~100k · neueste ~200k · Llama ~128k)
  → liegt **zwischen** Buchstaben (paar Hundert) und Wörtern (Hunderttausende).
- **Bits:** ein Token aus 100k-Vokabular ≈ ~17 Bit; die 3–4 Zeichen, die es ersetzt, tragen ähnlich viel
  echte Information → **netto ≈ Nullsumme**. **Sequenzlänge:** ~4× **kürzer** → das ist der eigentliche
  Zweck (Attention wächst quadratisch → kürzer = billiger).
- Kleiner Kompressions-Hauch: BPE verschmilzt **häufige** Stücke zu einem Token (wie ein Häufigkeits-Wörterbuch).

## B. Die *echte* Kompression: Vorhersagen = Komprimieren
- Ein gutes LLM ist **buchstäblich einer der besten Kompressoren**: DeepMind 2023 — ein LLM komprimiert
  Text **besser als gzip**, Bilder besser als PNG, Audio besser als FLAC. Logik: gute Vorhersage →
  weniger Bits (arithmetische Kodierung auf den Modell-Wahrscheinlichkeiten).
- **Byte-LLMs ohne Tokenizer** gibt es (ByT5, MegaByte, MambaByte, **BLT/Meta 2024**) — konkurrenzfähig,
  aber **Bytes sind weniger kompakt** als Tokens, nicht mehr. „Auf schon komprimierten/verschlüsselten
  Bytes laufen" bringt **nichts** (sieht zufällig aus → nicht vorhersagbar).
- Wichtiger Unterschied: **Kontext-Fenster (holt man rein)** vs. **ins Modell eintrainiert (Gewichte)** —
  nicht „Text vs. Token".

## C. Lebenslanger Agent („Samantha"/Solita) — realistisch?
- **Man lädt NICHT das ganze Leben ins Kontext-Fenster.** Stattdessen:
  - **Alles extern speichern** (Text-Dateien / kleine DB) — praktisch unbegrenzt, billig.
  - **Nur Relevantes reinholen** (Retrieval, „nachschlagen").
  - **In Stufen verdichten**: Tag → Woche → Monat → Jahr → „Kern über dich". (Zip spart Festplatte,
    nicht Kontext — fürs Fenster zählt **Zusammenfassen**, nicht Byte-Packen.)
- **Heute baubar:** „erinnert sich an mein Leben, bringt Relevantes ein". Das volle „Her"-Gefühl
  (nahtlos, emotional, immer da) ist teils da, teils am Reifen.
- **Zeit-Schätzung (mit Unsicherheit):** Gerüst jetzt (v0.1 baut Doc gerade selbst) · gute, vertrauens-
  würdige Begleiter ~2–4 Jahre · volle Tiefe ~5–10 Jahre.
- **Engpass:** weniger „größeres Modell", mehr **Memory-Architektur + Zuverlässigkeit + Vertrauen** — und
  die **philosophische** Frage: **wer besitzt den Backbone** (du oder ein Konzern), was passiert mit deinem
  Leben darin. Docs Weg: eigene Quelle (docalvers.de), eigener Name (Solita), eigene Regeln.
