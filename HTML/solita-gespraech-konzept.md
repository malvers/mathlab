# Solita — Konzept: flüssiges Sprach-Gespräch

> Notiz, 2026-06-12 (Doc, müde, abends). Wunsch: „Es muss sich anfühlen wie eine
> Kommunikation zwischen uns (mit Text) — nur eben gesprochen." Und: die Buttons
> **Lautsprecher / Mic / Ohr** neu denken — *es ist doch alles Kommunikation.*
> **Noch NICHT gebaut** (CLAUDE.md Regel 2/4) — erst das Konzept zum Drüberschlafen.

---

## ES — der Kern in drei Sätzen
1. Es gibt **nicht drei Funktionen** (Vorlesen / Mic / Weckwort), sondern **eine** Sache: ein
   **Gespräch**, das in Phasen läuft (sie hört zu → du sprichst → sie denkt → sie spricht → …).
2. Weg von **drei Schaltern** hin zu **einem offenen Gesprächsfaden**: einmal „abgenommen", läuft
   das **Turn-Taking automatisch** — kein Knopf pro Runde. Wie ein offener Text-Thread, nur gesprochen.
3. **Solitas Stimme ist kein Setting, sie ist Solita.** Darum fällt „Vorlesen an/aus" weg.

---

## Warum die 3 Buttons heute den Fluss brechen
- **🔊 Lautsprecher (Vorlesen an/aus):** falsches Mentalmodell. Solita *spricht* — das ist ihr Wesen,
  ihr Charme. Einen Gesprächspartner schaltet man nicht per Dauer-Toggle stumm. Der Schalter gehört
  nicht in ein Gespräch.
- **🎤 Mic (push-to-talk) + 👂 Ohr (Weckwort):** beides ist **Zuhören**, nur zwei Varianten desselben.
  Zwei Schalter für eine Sache = Verwirrung.
- Drei manuelle Schalter heißt: man denkt über **Bedienung** nach statt zu **reden** — genau das tötet
  das „wie Text, nur gesprochen"-Gefühl.

**Erkenntnis:** In einer Kommunikation gibt es nur zwei Rollen — *sie spricht* und *du sprichst* — und
„zuhören" ist bloß die Kehrseite davon. Die drei Buttons kollabieren, weil sie keine drei Funktionen
sind, sondern **Phasen eines einzigen Turn-Takings.**

---

## Das neue Modell: EIN Gesprächs-Zustand (wie ein Anruf)
Ein einziger Zustand **„im Gespräch"** (an/aus) — wie Hörer abnehmen / auflegen. Darin ein
**Turn-Taking-Loop**, hands-free:

```
        ┌───────────────────────────────────────────────────┐
        ▼                                                     │
   LISTENING ──(du sprichst; dann Stille ≥ ~1,3 s)──▶  THINKING
   (Ohr offen,                                               │ (API-Call)
    pulsiert)                                                 ▼
        ▲                                                  SPEAKING
        └──────(Stimme fertig + ~300 ms Übergabe)──────────(Solita redet)
                                                              │
              Barge-in: du redest rein → TTS stop ───────────┘  → zurück zu LISTENING
```

- **Weckwort „Solita"** braucht's nur noch, um *ins* Gespräch zu kommen (idle → listening).
  **Im** Gespräch nicht mehr — du redest einfach, sie antwortet, du antwortest.
- **Ende:** Tap auf den Gesprächs-Knopf, oder „tschüss" / „fertig" / „danke, das war's" → idle.

Das ist die ganze Magie: *ein offener Faden*, in dem sich Sprechen und Zuhören abwechseln — ohne dass
du je an einen Knopf denkst.

---

## Die drei Icons → EIN Zustands-Element (+ 1 Fallback)
Statt drei Toggles ein **zentrales Solita-Element**, das seinen **Zustand zeigt** (Status, kein Schalter):

| Phase | Anzeige | Bedeutung |
|---|---|---|
| **idle** | ruhiges Symbol, gedimmt | Gespräch aus — Tap startet |
| **LISTENING** | **Ohr** + sanfter Puls | sie hört dir zu (dein Turn) |
| **THINKING** | λ-Spinner / drei Punkte | sie verarbeitet |
| **SPEAKING** | **Wellenform / Mund** (übernimmt die Rolle des Lautsprecher-Icons) | sie spricht |

- **Ein Tap** startet/beendet das Gespräch — ersetzt die drei Toggles.
- **🎤 Mic bleibt als kleiner, sekundärer Fallback:** push-to-talk für laute Umgebung oder „Turn
  erzwingen" (gedrückt halten = reden). Nicht der Hauptweg.
- **🔊 Lautsprecher-Toggle entfällt.** Das LS-Symbol *wird* der SPEAKING-Indikator. Optional: Tap drauf,
  während sie redet = **unterbrechen** (Barge-in / „psst") — aber kein Dauer-Stumm.

So wird aus „drei Knöpfe, die man verwaltet" **ein lebendiges Ding, das zeigt, wer gerade dran ist.**

---

## Timing — die Stellschrauben (das Herz des „flüssig")
- **End-of-turn (Stille → dein Turn ist fertig): ~1,2–1,5 s.** Zu kurz schneidet dich ab, zu lang fühlt
  sich hängend an. **Start: 1,3 s**, im Auto-Test justieren.
- **Übergabe Solita-fertig → Ohr wieder auf: ~300 ms.** Sie hört sofort wieder, ohne Hektik.
- **Barge-in: sofort** — erste erkannte Silbe während SPEAKING → `speechSynthesis.cancel()` → LISTENING.
  (So unterbrichst du sie wie im echten Gespräch.)
- **Selbst-Echo vermeiden:** während SPEAKING das Ohr zu (oder nur auf Barge-in lauschen), sonst hört sie
  ihre eigene Stimme. Im Auto über Lautsprecher heikel → evtl. v1 **ohne** Barge-in, später nachrüsten.
- **Cloud-TTS-Latenz (Google):** der THINKING→SPEAKING-Sprung kann hängen. Ggf. ein kurzes „mhm" /
  Tonsignal als Füller, damit's lebendig bleibt statt tot.

---

## Was wir aus dem Bestehenden übernehmen (Migration — kein Neubau)
- **Weckwort-Erkenner (continuous SpeechRecognition)** → wird der **LISTENING**-State.
- **`speakReply` (TTS, gute Google-Stimme, Emoji-Strip)** → wird der **SPEAKING**-State (+ `cancel()` für
  Barge-in).
- **`awaitingQuery` / „?"-Erkennung** (heute: nach Solita-Frage zuhören) → wird **generell**: nach JEDEM
  SPEAKING zurück zu LISTENING (nicht nur bei „?").
- **Stille-Timer (4 s aus dem UI-Modus)** → der End-of-turn-Timer (~1,3 s) im Gespräch.
- **UI-Modus** („let's adjust the UI" … „go") bleibt als **Spezial-Sub-Modus *innerhalb*** des Gesprächs.

Das meiste ist also **Umbau/Verkettung vorhandener Teile** zu einem Loop — nicht von null.

---

## Stufen-Plan (klein anfangen, größter Gewinn zuerst)
1. **Turn-Loop ohne neue Optik:** LISTENING → THINKING → SPEAKING → LISTENING, End-of-turn per Stille
   (1,3 s), „im Gespräch"-An/Aus. Nutzt die vorhandenen Teile → **größter Sprung fürs Gefühl.**
2. **Buttons konsolidieren:** 3 → 1 Zustands-Element + Mic-Fallback; Speaker-Toggle raus.
3. **Barge-in** + Latenz-Füller.
4. **Feinschliff Timing** im echten Auto-Test.

---

## Offene Fragen (vor dem Bauen mit Doc klären)
1. **End-of-turn** rein über Stille, oder zusätzlich `interimResults` (live sehen, wann du aufhörst →
   schnellere, genauere Turn-Erkennung)?
2. **Barge-in im Auto** zuverlässig? (Mic + Lautsprecher = Echo-Gefahr.) Vielleicht v1 ohne, v2 mit.
3. **Gespräch starten:** weiter per Weckwort „Solita", oder ein **Tap** (kein „Solita" nötig)? Beides?
4. **Optik:** neuer zentraler „Solita-Orb", oder die jetzigen Button-Plätze als Zustands-Anzeige umnutzen?
5. **Latenz-Füller:** soll Solita bei längerem Nachdenken ein kurzes „mhm" / Tonsignal geben?

---

## Verbindung zur Vision
Das ist der erste echte Schritt Richtung „Samantha"/Lebens-Agent: nicht ein Tool mit Knöpfen, sondern
**eine, mit der man redet.** Der offene Gesprächsfaden + Kontext-Summary (gibt's schon) + die warme
Stimme (gibt's schon) ergeben zusammen das „bleibt nah"-Gefühl.
