# Wichtige Idee — Solita: Kosten pro Abfrage anzeigen

**Idee (Doc, 2026-06-18):** In Solita nach **jeder** Abfrage in geeigneter Weise
anzeigen, **wie viel diese eine Abfrage gerade gekostet hat**. So sieht man
laufend mit, was der Spaß kostet (vgl. die Anthropic-Kostensorge ~6 $/Tag), und
kann teure Anfragen sofort erkennen.

---

## Warum das einfach geht — die Daten liegen schon vor

Die Edge-Function gibt die Token-Nutzung bereits ans Frontend zurück:

- `supabase/functions/claude/index.ts` antwortet u. a. mit `usage: data.usage`
  (das rohe Anthropic-`usage`-Objekt der jeweiligen Antwort).

Damit hat der Client **pro Antwort** schon alles, was für die Kostenrechnung
nötig ist. Es muss nichts Neues vom Server geholt werden — nur clientseitig
rechnen und anzeigen.

### Die relevanten `usage`-Felder (pro Antwort)

| Feld | Bedeutung | Preisfaktor |
|---|---|---|
| `input_tokens` | ungecachte Eingabe-Token (voller Preis) | 1× Input |
| `cache_read_input_tokens` | aus dem Prompt-Cache gelesen | ~0,1× Input |
| `cache_creation_input_tokens` | frisch in den Cache geschrieben | 1,25× Input (5-Min-TTL); 2× bei 1-h-TTL |
| `output_tokens` | erzeugte Ausgabe-Token | 1× Output |

> Achtung: `input_tokens` ist NUR der ungecachte Rest. Gesamt-Prompt =
> `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`.

---

## Preise pro 1 Mio. Token (Stand 2026-06, bitte gelegentlich prüfen)

| Modell | Model-ID | Input $/1M | Output $/1M |
|---|---|---|---|
| Sonnet 4.6 (Solita-Default) | `claude-sonnet-4-6` | 3,00 | 15,00 |
| Opus 4.8 | `claude-opus-4-8` | 5,00 | 25,00 |
| Haiku 4.5 | `claude-haiku-4-5` | 1,00 | 5,00 |

Solita-Default ist aktuell `claude-sonnet-4-6` (der Client kann opus/haiku
schicken). Die Kostenformel muss also das **tatsächlich benutzte Modell**
berücksichtigen — das Modell steht in der Antwort (bzw. ist das gesendete).

---

## Kostenformel (pro Abfrage)

```
kosten =
    (input_tokens                 / 1e6) * preisInput
  + (cache_read_input_tokens      / 1e6) * preisInput * 0.10
  + (cache_creation_input_tokens  / 1e6) * preisInput * 1.25   // 5-Min-TTL
  + (output_tokens                / 1e6) * preisOutput
```

(Bei 1-h-TTL den Cache-Write-Faktor auf 2.0 setzen. Solita nutzt aktuell den
Standard-TTL → 1,25.)

Eine Mini-Preis-Tabelle im Client (Model-ID → {in, out}) genügt; unbekanntes
Modell → Sonnet-Preise als Fallback und einmal warnen.

---

## Anzeige — „in geeigneter Weise"

Vorschläge, von dezent bis ausführlich:

1. **Pro Antwort ein kleines Badge** unter/neben der Assistenten-Antwort, z. B.
   `≈ 0,012 $` (USD), beim Antippen ausklappbar mit der Aufschlüsselung
   (Input/Cache/Output + Token-Zahlen). Dezent, stört den Lesefluss nicht.
2. **Laufende Sitzungs-Summe** (klein in der Kopf-/Fußzeile): „Sitzung: 0,34 $".
   Reset pro Sitzung; optional Tages-Summe in `localStorage`.
3. **Farbcodierung** wie sonst im Labor: günstig φ-Grün, mittel λ-Orange, teuer
   Υ-Rot — Schwellen frei wählbar (z. B. < 0,01 $ grün, < 0,05 $ orange, sonst rot).
4. **Cache-Hinweis:** wenn `cache_read_input_tokens` hoch ist, ein kleines
   „Cache aktiv"-Zeichen — macht sichtbar, dass das Prompt-Caching greift.

Empfehlung: (1) + (2) zusammen — pro Antwort ein kleines Badge, plus eine
laufende Sitzungs-Summe.

---

## Hinweise / offene Punkte

- **Währung:** Anthropic rechnet in USD. Für eine €-Anzeige bräuchte es einen
  (groben, festen) Umrechnungskurs — oder schlicht bei USD bleiben.
- **Beträge sind winzig** (Bruchteile eines Cents). Format mit genügend
  Nachkommastellen oder in Cent/Tausendstel-Cent anzeigen, damit nicht alles
  „0,00 $" heißt. Für die Sitzungs-Summe lohnt sich USD mit 4 Nachkommastellen.
- **Genauigkeit:** Die Rechnung ist eine sehr gute Schätzung; die echte
  Abrechnung macht Anthropic. Im UI als „≈" kennzeichnen.
- **Single Source of Truth:** Preis-Tabelle an EINER Stelle im Client halten,
  damit Preisänderungen leicht nachzuziehen sind.
- Optional später: die Edge-Function könnte die fertig berechneten Kosten schon
  mitliefern (dann liegt die Preis-Tabelle serverseitig) — fürs Erste reicht
  aber die Client-Rechnung, weil `usage` ohnehin schon ankommt.
