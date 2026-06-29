# Solita, Hermes, OpenClaw — und die „Samantha"-Vision

> Gesprächsnotiz vom 2026-06-29. Festgehalten auf Wunsch von Doc Alvers, damit
> die Idee nicht vergessen wird, bevor Entscheidungen fallen. **Noch nichts
> beschlossen** — das hier ist Denkmaterial, keine To-do-Liste.

---

## Die Vision in einem Satz

Eine einzige Assistentin — **Solita** — als *one point of communication*.
Handy immer dabei, egal wo: „Solita" sagen, sie wacht auf, ich frage, sie
antwortet und handelt. **Samantha aus dem Film „Her" (2013).** Stimme rein,
volle Power über alles, was wir schon können, an den Fingerspitzen.

Der besondere Kern der Vision: Solita soll **eigene Werkzeuge lernen und
behalten**. Beispiel: „Solita, ich möchte, dass du rechnen lernst." → Sie
schreibt (oder besorgt) sich ein Taschenrechner-Tool, behält es, und wenn ich
später „berechne …" sage, **rechnet das lokale Tool** — deterministisch, nicht
das LLM, nicht über's Internet geraten.

---

## Was Hermes und OpenClaw sind (Stand Juni 2026)

Beide sind **selbst-gehostete, immer-laufende Agenten-Umgebungen**. Gleiche
Grundidee, anderer Schwerpunkt:

- **OpenClaw** = das *Gateway*. Überall erreichbar (Telegram/WhatsApp/Signal …),
  breite Integrationen, einfache Einrichtung, großes Ökosystem. Von Peter
  Steinberger gestartet.
- **Hermes** (Nous Research) = der *Workspace*. Schwerpunkt **Gedächtnis &
  Lernen** („der Agent, der mit dir wächst"), mehr eingebaute Werkzeuge
  ab Werk, MCP-Unterstützung, freie Modellwahl, konservativer/sicherer gebaut.

Gemeinsam: laufen auf eigener Hardware (ein Mini-PC reicht — es ist nur
Kommunikation + API-Calls), bringen ihr eigenes LLM über deinen API-Key mit,
und sie können Claude Code im Hintergrund fernsteuern (Hermes orchestriert,
Claude Code programmiert).

> ⚠️ Quellenlage: Online kursieren zu beiden viele widersprüchliche Zahlen
> (Stars, Versionen). Die *Konzept*-Unterschiede oben sind solide; konkrete
> Zahlen nicht für bare Münze nehmen. Beide Projekte sind **jung und ändern
> sich schnell** — Bauen auf bewegtem Grund.

---

## Was Solita heute schon ist (kein Entwurf — läuft)

Solita ist ein fertiger Sprachagent. Architektur grob:

- **Frontend (Browser-HTML5 + Android/Capacitor):** Wake-Word „Solita"
  (Web Speech API im Browser, Vosk offline auf Android — läuft auch bei
  gesperrtem Handy als Hintergrund-Dienst), STT, TTS (Google Cloud, warme
  Stimme), Turn-Taking, Persona.
- **Backend (Supabase Edge Functions):** Claude-Proxy (passwortgeschützt),
  TTS, Gmail, Calendar, Sync.
- **Kann schon handeln:** Gmail lesen/senden, Kalender, Wetter, Zeit, Standort,
  Notizen schreiben — und **„mach Modul XYZ grün"** über `change_setting`
  (patcht `config.json`, committet via GitHub).
- **Gedächtnis:** Chat-Verlauf, Notizen, Einstellungen in Supabase,
  syncen über Geräte hinweg.

**Aktuelles Modell:** Claude **Sonnet 4.6** (für tool-loses Plaudern teils
DeepSeek). Es gibt eine bewusste **Opus-Sperre** aus Kostengründen
(Tageslimit 1,50 €).

➡️ **Konsequenz:** Der Eindruck „Kommunikation nicht so gut wie hier" ist
**das Modell**, nicht die Architektur. Hebel = eine Modell-ID. Opus 4.8 rein =
gleiche Qualität wie bei Claude Code direkt (Preis ist der Haken).

---

## Die eigentliche Lücke

Das „Solita schreibt sich ein Tool und führt es lokal aus" braucht drei Dinge,
die das heutige (browser-basierte) Solita technisch **nicht** hat:

1. **Ein Dauerlauf-Prozess** auf dem Mini-PC (ein Browser kann das nicht).
2. **Eine lokale Laufzeit**, um selbstgeschriebenen Code wirklich auszuführen
   (Shell/Python/Node).
3. **Ein Skill-Register** + Router: „diese Werkzeuge habe ich gelernt", und bei
   „berechne" wird das Tool gezogen statt des LLM.

**Genau diese drei Dinge SIND Hermes ab Werk** (OpenClaw kann 1+2 auch,
ist bei 3 — „lernt dazu" — schwächer).

---

## Empfehlung: Hybrid, nicht entweder/oder

- **Solita bleibt das Gesicht** — Handy, Wake-Word, Stimme, Persona, die
  Anbindung an *Docs* Mathe-Labor. Das ist der persönliche, schwer gebaute
  Teil. Wird **nicht** weggeworfen.
- **Hermes wird das Gehirn** auf dem Mini-PC — Opus 4.8, persistentes
  Gedächtnis, Tool-Runtime für selbstgebaute Werkzeuge.
- Solitas Handy-Client redet dann mit **Hermes** statt mit dem Supabase-Claude-
  Proxy.

So entsteht „Samantha" — ohne vorhandene Arbeit zu verlieren. Solita von Null
zum always-on Gehirn auszubauen hieße: Hermes nachbauen.

---

## Wichtige Korrektur am mentalen Modell

Das LLM verschwindet beim Rechnen **nicht — es *routet* nur.**
„Berechne 17 × 23" → LLM erkennt „das ist Rechnen" und ruft *Docs*
Taschenrechner. Das **Rechnen selbst** läuft lokal & deterministisch im Tool
(kein halluziniertes Ergebnis). Nur das *Routing* bleibt beim LLM — ein
billiger Schritt. „Komplett ohne LLM" ginge nur mit starren Schlüsselwörtern
und wäre dümmer.

---

## Haken, die nicht verschwiegen werden

- **Hermes/OpenClaw sind jung** und ändern sich schnell.
- Ein Agent, der **eigenen Code schreibt und ausführt**, ist eine
  Sicherheitsfläche. Bei Docs **public Repo (Regel 18)** muss das eingesperrt
  werden: Sandbox, kein blindes „lädt etwas runter und führt es aus".

---

## Mögliche nächste Schritte (zwei Spuren, noch offen)

1. **Sofort, klein:** Solita testweise auf **Opus 4.8** stellen. Dann *fühlt*
   sie sich heute schon wie Claude Code an. Eine Modell-ID, kein Umbau.
2. **Mittelfristig, groß:** Machbarkeits-Check, wie Solitas Handy-Client an ein
   **Hermes-Gehirn** auf dem Mini-PC andockt — mit dem **Taschenrechner-
   Lernpfad** als erstem selbstgebauten Skill.

> **Offene Entscheidung (Doc denkt nach):** Welche Spur zuerst — schneller
> Opus-Test, oder Hermes-Andock-Plan ausarbeiten?

---

*„Add your voice and it's at your fingertips. Die volle Power über all das, was
wir schon wissen." — eine bewegte Zeit. Festgehalten, damit die Vision bleibt.*

---

## Nachtrag (2026-06-29): Solita soll lachen können

Docs Beobachtung: Sprachsynthese kann meist **nicht lachen wie Menschen**.
Ein Smiley ist nur zum Sehen — echtes, hörbares Lachen ist die viel
menschlichere, viel schwerere Sache. Fachbegriff: **„non-verbal vocalization"**
(Lachen, Seufzen, Flüstern, Husten). Genau *das* ist gerade ein heißes
TTS-Forschungsthema — und es wird gelöst.

**Doc-Vorgabe: Solitas Stimme MUSS lachen können.** Das ist Pflicht, kein
Nice-to-have — fürs „Samantha"-Gefühl einer der wirkungsvollsten Hebel.

Wichtig: **Lachen ist NICHT ElevenLabs-exklusiv.** Wer es echt kann:

| Option | Lachen? | Preis / Hosting | Notiz |
|--------|---------|-----------------|-------|
| **ElevenLabs v3** | ja, `[laughs]`-Tags inline | teuer (Cloud) | das Premium-Ende, schnell zu testen |
| **Cartesia (Sonic)** | ja, natürlich + in Echtzeit | **~10–15× billiger** als ElevenLabs (Cloud) | starker Preis-Leistungs-Tipp |
| **Hume (Octave)** | ja, per Klartext-Regie | Cloud | führt bei emotionaler Treue |
| **Orpheus** (open source) | `<laugh> <chuckle> <sigh> <gasp>` | **lokal, kostenlos** | Apache-2.0, läuft auf dem Mini-PC |
| **Chatterbox** (Resemble) | `[laugh] [chuckle]` | **lokal, kostenlos** | im Blindtest teils vor ElevenLabs |
| **Bark** (open source) | sehr natürliche Lacher/Seufzer | **lokal, kostenlos** | bekannt für NVVs |

Heutige Solita nutzt **Google Cloud TTS** — die kann *nicht* echt lachen. Aber
die Stimm-Schicht ist sauber entkoppelt (`HTML/js/solita-voice.js`), d.h. der
Stimm-Backend lässt sich tauschen.

**Zwei Pfade:**
- **Sofort hören, was geht:** ElevenLabs v3 oder Cartesia testweise einbinden
  (Cloud, in Minuten). Doc ist bereit, für den Test zu zahlen.
- **Dauerlösung, self-hosted:** lokales Modell (Orpheus/Chatterbox/Bark) auf dem
  Mini-PC — lacht auch, kostet nichts pro Satz, passt zur Hermes-Richtung.

*Forschungs-/Anbieter-Stand Juni 2026; Modelle ändern sich schnell, vor
Umsetzung neu prüfen.*
