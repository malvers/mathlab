# Solita — Spracherkennung (STT): DE-EN-Mix-Problem + Optionen

> **Status: OFFENE Entscheidung** (Doc denkt nach, 2026-06-23). **Kein Bau-Auftrag.**
> Auslöser: die aktuelle Erkennung hadert mit gemischtem Deutsch-Englisch in einem Satz.

## Das Problem
Solitas Sprache→Text macht heute die **Web Speech API** des Browsers/WebViews
(`SpeechRecognition` / `webkitSpeechRecognition`) — in `solita-listen.js`, `solita-tts.js`, `solita-wake.js`,
Sprachcodes in `solita-core.js` (`stt:'de-DE'/'en-US'/'es-ES'`).
Sie ist auf **EINE feste Sprache** festgenagelt (`recog.lang = 'de-DE'`). Code-Switching DE↔EN **in einem
Satz** („schick das *file* als *email*") kann sie strukturell nicht — im Web-SR nicht behebbar.
(Unter der Haube auf Android = Googles Speech-Dienst, über den Web-Standard; **kein** Gemini.)

→ Lösung = **server-seitige ASR**, die mehrsprachig / Code-Switching kann. Passt zu Solitas Prinzip
„App = Fernbedienung, KI server-seitig" — die client-seitige STT ist eh die Anomalie.

## Optionen

**① Gemini-Audio-Transkription** *(Empfehlung als Start)*
- Audio-Clip → Gemini 2.5 Flash → Transkript. **LLM-basiert ⇒ versteht den Mix nativ.**
- **Pro:** kein neuer Anbieter/Key (Gemini ist server-seitig schon verdrahtet), winziger Preis, Aufnahme-Pfad existiert (Voice-Notes / capacitor-voice-recorder).
- **Contra:** **Clip statt Live-Stream** → kein laufender „Interim"-Text; ~1–2 s Latenz nach dem Sprechen.

**② Deepgram Nova-3** *(wenn der Live-Stream wichtig ist)*
- Echtes Streaming + **explizit multilingual code-switching**, wie das jetzige „höre zu"-Gefühl.
- **Contra:** neuer Key/Anbieter + Kosten. Alternativen: **Google Chirp 2** (USM), **gpt-4o-transcribe**.

**③ Whisper large-v3** *(offline / self-host)*
- Top mehrsprachig. **Contra:** Server/Compute nötig; on-device am Handy zu schwer.

## Sketch ① (falls gebaut)
Fluss: Weckwort „Solita" (Vosk/Web-SR **bleibt**) → Aufnahme → Edge-Fn `stt-gemini` → Gemini → Text →
**selber Pfad wie heute der Web-SR-Transkript** (ins Brain).
- **Edge Function `stt-gemini`** (~40 Z., Muster wie `gmail-send`/`identify`): `x-app-pass`-Gate, Gemini `generateContent` mit `inline_data` (base64-Audio) + Transkriptions-Prompt („wörtlich; DE/EN je gesprochen lassen; nur Transkript").
- **Client `solita-stt.js`** (self-registering Add-on): `transcribe(blob)` → base64 → POST → `text`.
- **Einhängen:** Web-SR-`onresult` ersetzen durch *Aufnahme → `transcribe` → selber Callback*. Pillen-Zustände (höre zu / denkt) bleiben.

## Die schweren Punkte (warum Doc innehält)
- **Kern-Interaktion:** betrifft das **Dauer-Zuhören**, kein Randfeature. Koppelt an die heikle Weckwort↔Recorder↔Mikro-Geschichte (Web-SR↔Vosk-Mikro-Streit).
- **Ende-der-Rede erkennen:** Web-SR stoppt bei Stille selbst; ein Clip braucht eigenes **VAD** (Stille > ~1,2 s ⇒ stopp) oder Push-to-Talk. **Wichtigster Bau-Punkt.**
- **Audio-Format:** Chrome-MediaRecorder = `webm/opus` (Gemini nimmt offiziell ogg/wav/mp3/aac/flac). **Nativ (Pixel) = aac/m4a → passt direkt** (Solitas Haupt-Bühne). Web-Pfad ggf. als wav aufnehmen oder zweitrangig behandeln.
- **Live-Gefühl weg:** kein Interim-Text mehr; in der Pille „verstehe …" zeigen.
- **Datenschutz:** Audio geht an Google (Gemini) statt an Googles Web-SR — faktisch derselbe Konzern, aber **bewusst** entscheiden. DE/DSGVO-Alternative = Voicely.de oder Deepgram-EU.
- **Kosten:** Gemini-Audio ~pro Sekunde, Bruchteile eines Cents/Kommando → ins bestehende Kosten-Log.

## De-Risk
Lässt sich **parallel** bauen: **Umschalter Web-SR ↔ Gemini**, Web-SR bleibt Fallback. Entscheidung damit
**reversibel**, beide am selben Satz vergleichbar — statt blinder Festlegung.

## Offen (Docs Entscheidung)
1. Überhaupt umstellen — oder die Web-SR-Mix-Schwäche aushalten?
2. Falls ja: **①** (Clip/Gemini, kein Stream, null neue Infra) vs. **②** (Deepgram, Stream, neuer Key)?
3. Parallel-Umschalter (de-risk) ja/nein?
