# Tracker — „KI erkennt"-Indikator: Roboter raus, schöner anzeigen

> Wunsch von Doc (Morgen 2026-06-11): „Wenn KI erkannt wird, steht nur ‚KI erkennt' und da sind komische
> Roboter — gefällt mir nicht. Mach da bitte einen schönen hin." **Noch nicht umgesetzt** (Regeln 2/4).

## Wo es sitzt
- **Foto-Detail-Wartanzeige:** `HTML/js/tracker-media.js:295`
  → `$('pd-result').innerHTML = '<div class="pd-wait">🤖 KI erkennt …</div>';`
  Das **🤖-Emoji** ist „der komische Roboter". CSS: `.pd-wait` (`tracker.css:132`), Overlay-Spinner via
  `ov.classList.add('loading')`.
- **Karten-Pin währenddessen:** `photo-layer.js` `PENDING_TITLE = 'Wird erkannt …'`, oranger Puls
  `.wp-dot.pending` (`tracker.css:659`, `photo-layer.css:58`) — das ist nur ein Punkt, kein Roboter,
  aber sprachlich (`Wird erkannt …`) zur selben Sache.

## Vorschläge (statt 🤖)
Ziel: ruhig, on-brand (λ-Orange `rgb(245,194,66)`), klar „KI arbeitet", kein Comic-Roboter.
1. **Schlichter Spinner + Text** *(Empfehlung)*: kleiner animierter Kreis-/Drei-Punkte-Spinner in
   λ-Orange + Text **„KI analysiert …"**. Kein Emoji. Passt zum bestehenden `.loading`-Spinner.
2. **Funkeln statt Roboter:** ein dezent pulsierendes **✨** (oder ein eigenes kleines SVG-„Sparkle")
   vor „KI analysiert …" — freundlicher, nicht kindisch.
3. **Eigenes „KI"-Badge:** kleines rundes Badge mit „KI" in Orbitron, sanft pulsierend.

Wording-Vorschlag einheitlich: **„KI analysiert …"** (statt „KI erkennt …" / „Wird erkannt …").

## Umfang
Klein & isoliert: Emoji raus, `.pd-wait` umgestalten (CSS-Spinner), evtl. Pin-Text angleichen. Kein
Eingriff in die Erkennungs-Logik. → Sag, welche Variante (1/2/3), dann baue ich's.
