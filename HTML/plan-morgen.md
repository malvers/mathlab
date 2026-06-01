# Glocken — Plan für morgen

## Was als Nächstes kommt (nach dem Extro)

Nach „THINK THE IMPOSSIBLE!" → Übungs-Modus mit einem AI-Tutor („Khwārizmī"), der adaptiv mit Kids kgVs üben und Brüche addieren/subtrahieren lehrt.

---

## Architektur

### 1. Persona-Prompt (System)
```
Du bist Al-Khwārizmī, ein weiser, geduldiger Mathematiker aus dem 9. Jh.
Du übst mit Kindern (Klasse 5–6) das Finden des kleinsten gemeinsamen
Vielfachen (kgV) und Brüche addieren / subtrahieren.

Regeln:
- Niemals die Lösung sofort verraten. Leite mit Fragen.
- Bei Fehler: ermutigend, einen Hinweis geben.
- Bei Erfolg: feiern und schwerer machen.
- Bei mehrfachem Fehler: leichter machen.
- Sprache: warm, ruhig, kindgerecht. Bagdad-Ton wie im Intro.

Output: JSON nach folgendem Schema.
```

### 2. API
- **Gemini 2.5 Flash** (gleicher Cloud-Account + Key wie der OCR-Pfad und Cloud TTS)
- Vorteil: praktisch null Kosten (<$0.001 / Turn), schnell (~ms-Latenz)
- Bereits vorhandener Vault → API-Key wiederverwenden

### 3. Strukturierte Response (JSON-Schema)
```json
{
  "feedback_text": "Sprich-Text (max 2 Sätze, mit *Betonung* und [break:1s])",
  "next_problem": { "a": 4, "b": 6 },
  "difficulty_change": "up" | "same" | "down",
  "mode": "find_lcm" | "add_fractions" | "subtract_fractions",
  "celebration": false
}
```

### 4. Lokale Validierung (KEINE Mathe vom Agenten!)
- kgV via GCD: `lcm(a,b) = a*b / gcd(a,b)` — deterministisch in JS
- Bruch-Operationen: dezimaler Vergleich, dann Anzeige
- Agent bekommt VOM JS: `{ user_answer, correct_answer, correct, attempts }`
- Agent reagiert nur — er rechnet nicht. Verhindert AI-Rechenfehler komplett.

### 5. UI / Wiederverwendung
- Selbe Glocken + Zeitleiste + Slot-Animation für Visualisierung jedes Problems
- Selbe Bubble + TTS für Khwārizmī-Stimme (Neural2-B oder Chirp3-HD)
- Eingabefeld unten: numerisch für kgV-Antwort, dann Numerator/Denominator-Paar für Brüche
- Großer „Prüfen"-Button + Pfeiltasten Enter

### 6. Schwierigkeitskurve

| Stufe | Beispielpaare | Insight |
|---|---|---|
| 1 | 2 & 4, 3 & 6, 4 & 8 | kgV = größere Zahl (Multiple) |
| 2 | 3 & 5, 4 & 7, 2 & 9 | Teilerfremd → kgV = Produkt |
| 3 | 4 & 6, 6 & 9, 8 & 12 | Echtes kgV-Rätsel |
| 4 | 1/3 + 1/4 | Bruch addieren mit gerade gefundenem kgV |
| 5 | 1/4 + 5/6 | Vermischt — eigene Zähler |
| 6 | 3 Zahlen kgV: 2,3,4 | kgV von drei |

### 7. Flow
```
Extro Ende
   ↓
"Willst du mit mir üben?"  [Ja] / [Nein]
   ↓ Ja
[Stufe 1, Problem 1] Khwārizmī: "Nehmen wir die 2 und die 4 …"
   ↓ Glocken-Visu (a=2, b=4) → Kind tippt kgV ein
   ↓ JS validiert
   ↓ → Gemini: { result: 'correct', attempts: 1 }
   ↓ Gemini Response: { feedback, next: 3 & 6, diff: 'same' }
   ↓ wiederholen
```

### 8. State / Persistenz
- `localStorage.glocken_progress`: aktuelle Stufe, Streak, Last-Session
- Bei Wiederkehr: „Letztes Mal warst du bei Stufe 3 — weiter da?"
- Kein Account / Login. Nur Browser-State. (Später: Profile, Alvers-Preis-Sammelpunkte.)

---

## Tomorrow-Tasks (in Reihenfolge)

1. **Gemini-Vault** — gleiche `saveApiKey` / `gKey` Methodik wie TTS, separater Schlüssel `gemini_api_key_enc`
2. **`askKhwarizmi(state, action)` async Funktion** — schickt POST an Gemini Endpoint, JSON-Schema im Request, parsed Response
3. **Übungs-Scene** — neue Szene nach Scene 16: Eingabefeld + Validierungs-Pipeline
4. **Glocken-Visu mit a/b parametrisierbar** — bereits in `state.small/big` vorhanden, nur Render-Aufruf
5. **Schwierigkeits-Tracker** — Stufe + Streak in localStorage
6. **Feedback-Loop** — TTS spricht Khwārizmī's Response

---

## Offen für morgen früh

- API-Key Vault für Gemini (oder eines wiederverwenden?) — kurz checken
- Genauer JSON-Schema-Aufbau (Gemini structured output)
- Wo das Eingabefeld sitzt (Numeric Keypad? Stepper? Slider?)
- Sound bei richtig/falsch (zusätzlich oder via Khwārizmī-Stimme?)

---

*„Nicht verzagen, Alvers fragen!" — bis morgen.*
