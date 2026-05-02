#!/usr/bin/env python3
"""One-off: translate German developer strings/comments in HTML/intro.html to English."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INTRO = ROOT / "HTML" / "intro.html"


def main() -> None:
    t = INTRO.read_text(encoding="utf-8")

    pairs = [
        ('<html lang="de">', '<html lang="en">'),
        ("/* Catching Words: End-Größe scale 0.9 */", "/* Catching Words: final scale 0.9 */"),
        (
            "/* Domain-Zeile „docalvers.xx“: Endgröße 1:1 zur Dramaturgie (pt), kein scale(0.9) wie andere Schlagworte */",
            '/* Domain line “docalvers.xx”: final scale 1:1 per dramaturgy (pt), no scale(0.9) like other keywords */',
        ),
        (
            "            /* Undurchsichtige Bühne: sonst scheint bei Opacity-Animationen und zwischen\n               Fullscreen-Screens kurz das HG-Video durch (transparentes Panel). */",
            "            /* Opaque stage: otherwise background video flashes through during opacity transitions\n               and between fullscreen screenshots (transparent panel). */",
        ),
        (
            "        /* Mehrzeilig: oben verankert (kein Aufwärts-Sprung). Ein Schlagwort: vertikal zentriert. */",
            "        /* Multi-line: anchored at top (no upward jump). Single keyword: vertically centered. */",
        ),
        (
            "        /* Intro-Ende: linksbündig; keine automatische Breiten-/scaleX-Anpassung mehr */",
            "        /* Intro end: left-aligned; no automatic width/scaleX adjustment */",
        ),
        (
            "        /* „docalvers.de“: drei Spans — nur Script-font-size (pt), keine Teil-Skalierung */",
            '        /* “docalvers.de”: three spans — script font-size (pt) only, no partial scaling */',
        ),
        (
            "        /* Schlagwort: Orbitron-Gradient, Endgröße scale 0.9 */",
            "        /* Keyword: Orbitron gradient, final scale 0.9 */",
        ),
        (
            "        /* %purplepulsating … — Violett + deutlich pulsierender Glow (text-shadow + drop-shadow) */",
            "        /* %purplepulsating … — purple + stronger pulsing glow (text-shadow + drop-shadow) */",
        ),
        (
            "            /* Einflug + Glow-Puls parallel (nach Einflug übernimmt .cw-settled nur noch den Puls) */",
            "            /* Fly-in + glow pulse in parallel (after fly-in .cw-settled only keeps the pulse) */",
        ),
        (
            "            /* schlägt .cw-settled { animation: none } zuverlässig */",
            "            /* overrides .cw-settled { animation: none } reliably */",
        ),
        (
            "        /* Medien: erst laden, dann ein eineinziges cw-portal-in auf dem Wrapper (wie früher optisch,\n           aber ohne leeren unscharfen Rahmen und ohne Parent×Child-Opacity). */",
            "        /* Media: load first, then a single cw-portal-in on the wrapper (same look as before,\n           without empty blurred frame or parent×child opacity issues). */",
        ),
        (
            "        /* Nach Ausblendung: aus dem Stack „entsorgen“, kein weiteres Repaint */",
            "        /* After hiding: remove from stack, no further repaint */",
        ),
        (
            "        /* Schnelle Screenshot-Reihe: Crossfade (opacity) zwischen aufeinanderfolgenden Vollbildern */",
            "        /* Fast screenshot sequence: crossfade (opacity) between consecutive fullscreen frames */",
        ),
        (
            "        /* ⌘D Debug: über der unteren Abschnitts-Leiste (intro-section-nav), nicht beschneiden */",
            "        /* ⌘D debug: above bottom section bar (intro-section-nav), do not clip */",
        ),
        (
            'aria-label="Wiedergabe-Steuerung"',
            'aria-label="Playback controls"',
        ),
        ('title="Vorheriger Abschnitt / Langsamer (<<)"', 'title="Previous section / slower (<<)"'),
        ('title="Ein Bild zurück"', 'title="Previous frame"'),
        ('title="Pause / Play (Leertaste)"', 'title="Pause / play (space)"'),
        ('title="Ein Bild vor"', 'title="Next frame"'),
        ('title="Nächster Abschnitt / Schneller (>>)"', 'title="Next section / faster (>>)"'),
        (
            'title="Musik & Ambient-Sound (Standard an · Klick deaktiviert und wird gespeichert)" aria-label="Musik & Ambient-Sound ein oder aus"',
            'title="Music & ambient (on by default · click toggles and persists)" aria-label="Music and ambient on or off"',
        ),
        ('title="Vollbildmodus (F)"', 'title="Fullscreen (F)"'),
        (
            'title="Zurück zum Mathe-Labor" aria-label="Schließen und zurück zum Index"',
            'title="Back to math lab" aria-label="Close and return to index"',
        ),
        (
            'aria-label="Abschnitt wechseln"',
            'aria-label="Change section"',
        ),
        ('title="Zurück (←)"', 'title="Back (←)"'),
        ("<span>zurück</span>", "<span>back</span>"),
        ('title="Vor (→)"', 'title="Next (→)"'),
        ("<span>vor</span>", "<span>next</span>"),
        (
            "        /** Sprache für Dramaturgie — gleiche Codes wie CyberI18n (de, en, es, fr, it, pt, sw). */",
            "        /** Intro dramaturgy language — same codes as CyberI18n (de, en, es, fr, it, pt, sw). */",
        ),
        (
            "        /* keydown: unten registriert (nach allen CW-Helfern), damit Pfeile zuverlässig greifen */",
            "        /* keydown: registered below (after CW helpers) so arrow keys work reliably */",
        ),
        (
            "        /* —— Catching Words: Reihenfolge per .txt/.md (Zeile = Eintrag) oder Drop von Text —— */",
            "        /* —— Catching Words: order via .txt/.md (line = entry) or dropped text —— */",
        ),
        (
            "        /** Jede Zeile mit # beginnt eine neue Section; folgende Wörter gehören dazu (inkl. # 20pt …). ←/→ wechseln die Section. */",
            "        /** Each line starting with # begins a new section; following words belong to it (incl. # 20pt …). ←/→ switch section. */",
        ),
        (
            "        /** Debug-HUD: Zeit von Play-all-Start bis `%stop` */",
            "        /** Debug HUD: elapsed time from play-all start until `%stop` */",
        ),
        ("                /* file:// oder private mode */", "                /* file:// or private mode */"),
        (
            "            /** Sanftes Dur‑Pad (C‑Dur Grundlage): wirkt warm/freundlich statt „dunkler Sci‑Fi‑Drone“. */",
            "            /** Soft major pad (C major): warm/friendly rather than a dark sci-fi drone. */",
        ),
        (
            "                    hud.setAttribute('aria-label', 'Intro Debug · Fußzeile');",
            "                    hud.setAttribute('aria-label', 'Intro debug · footer strip');",
        ),
        (
            "                        ? 'Abschnitt ' + (cwSectionIndex + 1) + ' / ' + cwSections.length\n                        : 'Abschnitt —';",
            "                        ? 'Section ' + (cwSectionIndex + 1) + ' / ' + cwSections.length\n                        : 'Section —';",
        ),
        (
            "                        'Stopuhr → %stop: ' +\n                        (cwDbgSwLatchMs / 1000).toFixed(2) +\n                        ' s (bei %stop eingefroren)';",
            "                        'Stopwatch → %stop: ' +\n                        (cwDbgSwLatchMs / 1000).toFixed(2) +\n                        ' s (frozen at %stop)';",
        ),
        (
            "                        'Stopuhr → %stop: ' +\n                        ((performance.now() - cwDbgSwStart) / 1000).toFixed(2) +\n                        ' s (läuft …)';",
            "                        'Stopwatch → %stop: ' +\n                        ((performance.now() - cwDbgSwStart) / 1000).toFixed(2) +\n                        ' s (running…)';",
        ),
        (
            "                    secLine + '  ·  Play-all ' + (cwPlayAllActive ? 'an' : 'aus'),",
            "                    secLine + '  ·  Play-all ' + (cwPlayAllActive ? 'on' : 'off'),",
        ),
        (
            "                    'Flug (Keyframe): ' + cwAnimSec.toFixed(1) + ' s',\n                    'Spawn-Takt:      ' + cwSpawnMs + ' ms (SS: ' + cwFastSpawnMs + ' ms)',\n                    '↑ schneller · ↓ langsamer  (±0,1 s · ±10 ms)',\n                    '⇧↑ / ⇧↓  SS-Takt schneller / langsamer (±50 ms)',\n                    'h · d  Video heller / dunkler',\n                    'Beim Laden: automatisch Play-all (alle #‑Sections wie S)',\n                    '%stop in Script/.txt beendet Play-all',\n                    'S  Play-all neu ab Abschnitt 1 · Wechsel wenn Section fertig animiert',\n                    '⌘D  Debug ein/aus (bleibt gespeichert)',\n                    'M · Ambient ein/aus (Standard aus · bleibt gespeichert)',",
            "                    'Flight (keyframes): ' + cwAnimSec.toFixed(1) + ' s',\n                    'Spawn cadence:      ' + cwSpawnMs + ' ms (screenshots: ' + cwFastSpawnMs + ' ms)',\n                    '↑ faster · ↓ slower  (±0.1 s · ±10 ms)',\n                    '⇧↑ / ⇧↓  screenshot cadence faster/slower (±50 ms)',\n                    'h · d  brighter / darker video',\n                    'On load: auto play-all (all # sections like S)',\n                    '%stop in script/.txt ends play-all',\n                    'S  restart play-all from section 1 · advance when section animation completes',\n                    '⌘D  toggle debug (persisted)',\n                    'M · ambient on/off (default off · persisted)',",
        ),
        (
            "                    /* Früher: alle Past sofort visibility:hidden → Lücke bis das neue Bild da ist\n                       (HG-Video / Schwarz-Flash). Alte Screens bleiben bis load sichtbar (darunter). */",
            "                    /* Previously: all past frames visibility:hidden at once → gap until new image loads\n                       (bg video / black flash). Old screenshots stay visible until load (underneath). */",
        ),
        (
            "                        a.textContent = 'Bild konnte nicht geladen werden · Link öffnen';",
            "                        a.textContent = 'Image failed to load · open link';",
        ),
        (
            "                /* Aus Cache / bereits decodiert: load feuert in manchen Engines nicht zuverlässig —\n                   ohne markImgSettled bleibt Play-all nach dem letzten Screenshot (heart3d) stehen. */",
            "                /* From cache / already decoded: load may not fire reliably in some engines —\n                   without markImgSettled play-all can stall after the last screenshot (heart3d). */",
        ),
        (
            "                    p.textContent =\n                        'Nur die Videodatei — keine eingebettete Coverr-Webseite. Tipp: Intro über http://localhost öffnen (nicht file://) oder MP4 nach resources/ legen.';",
            "                    p.textContent =\n                        'Video file only — no embedded Coverr page. Tip: open intro via http://localhost (not file://) or place MP4 under resources/.';",
        ),
        ("                    a.textContent = 'Clip auf Coverr öffnen';", "                    a.textContent = 'Open clip on Coverr';"),
        ("                        a.textContent = 'Video-Link öffnen';", "                        a.textContent = 'Open video link';"),
        (
            "            if (h === 'index.html' || h.endsWith('/index.html')) return 'ZUM INDEX';\n            return 'WEITER';",
            "            if (h === 'index.html' || h.endsWith('/index.html')) return 'TO INDEX';\n            return 'NEXT';",
        ),
        (
            "        /** Coverr-Seite oder direkte Mediendatei — wird nicht als Fließtext gerendert. */",
            "        /** Coverr page or direct media file — not rendered as body text. */",
        ),
        (
            "        /** Eine Zeile nur Bild-URL oder relativer Pfad (.webp, .png …). */",
            "        /** Single-line image URL or relative path (.webp, .png …). */",
        ),
        (
            "        /** Eine Zeile nur Audio-URL oder relativer Pfad (.wav, .mp3 …). */",
            "        /** Single-line audio URL or relative path (.wav, .mp3 …). */",
        ),
        ("reject(new Error('dramaturgie script'))", "reject(new Error('intro dramaturgy script'))"),
        ("throw new Error('dramaturgie fetch')", "throw new Error('intro dramaturgy fetch')"),
    ]

    old_doc = """         /**
         * Sections (←/→): neuer Abschnitt bei jeder #‑Zeile (# allein, # Kommentar oder # 60pt in einer Zeile).
         * Größe: «# 60pt» oder eigene Zeile nur «60pt» / «200pt» (gilt für folgende Wörter bis zur nächsten Größenzeile).
         * Zeilen, die mit «//» beginnen: Kommentar (ignorieren).
         * Video: «%video URL» — auch «%videohttps://…» ohne Leerzeichen. Reine Zeile nur mit Coverr- oder .mp4/.webm-URL zählt ebenfalls als Video (Paste ohne %video).
         * Coverr-Seite: MP4 aus der Seite (Hero vor „Related“), nur HTML5-Video — keine Coverr-Navigation im iframe.
         * Ohne URL: «%video» → resources/galay20.mp4
         * Navigation: «%button» → Button nach index.html; «%button index» / «%button orbitals.html»; optional Beschriftung:
         * «%button orbitals.html Orbitale». Ein einzelnes Wort, das kein Ziel ist (z. B. «%button TOLL»), wird nur als Text auf index verlinkt.
         * Sound: «%sound pfad» — WAV/MP3/OGG/M4A (z. B. resources/kids.wav); eine Zeile nur mit Ton-URL/Pfad zählt ebenso.
         * Bild: «%picture pfad» oder «%picturehttps://…» — lokaler Pfad (z. B. resources/kids.webp) oder URL; WebP/JPEG/PNG/GIF/SVG.
         * Emoji: «%emoji 😎» oder «%emoji😎» — wirkt wie ein Schlagwort, ohne Textverlauf (farbiges Emoji).
         * S (und Standard beim Laden): alle Abschnitte von #1 an nacheinander — Wechsel erst, wenn alle Wörter eingeflogen sind (oder erwischt) und %button-Animationen fertig sind; kurze Pause; letzter Abschnitt Stopp. ←/→ / Drop brechen ab.
         */"""

    new_doc = """         /**
         * Sections (←/→): new section at each # line (# alone, # comment, or # 60pt on one line).
         * Size: «# 60pt» or its own line «60pt» / «200pt» (applies to following words until the next size line).
         * Lines starting with «//»: comment (ignore).
         * Video: «%video URL» — also «%videohttps://…» without space. A lone line with only a Coverr or .mp4/.webm URL counts as video (paste without %video).
         * Coverr page: extract MP4 from page (hero before “Related”), HTML5 video only — no Coverr UI in iframe.
         * No URL: «%video» → resources/galay20.mp4
         * Navigation: «%button» → button to index.html; «%button index» / «%button orbitals.html»; optional label:
         * «%button orbitals.html Orbitals». A single word that is not a target (e.g. «%button GREAT») links to index as plain text only.
         * Sound: «%sound path» — WAV/MP3/OGG/M4A (e.g. resources/kids.wav); a lone audio URL/path line counts too.
         * Image: «%picture path» or «%picturehttps://…» — local path (e.g. resources/kids.webp) or URL; WebP/JPEG/PNG/GIF/SVG.
         * Emoji: «%emoji 😎» or «%emoji😎» — behaves like a keyword, colored emoji.
         * S (and default on load): play all sections from #1 in order — advance only after all words finished flying (or caught) and %button animations done; short pause; last section stops. ←/→ / drop cancel.
         */"""

    for old, new in pairs:
        if old not in t:
            raise SystemExit(f"MISSING fragment in intro.html:\n{old[:120]}…")
        t = t.replace(old, new, 1)

    if old_doc not in t:
        raise SystemExit("MISSING large JSDoc block in intro.html")
    t = t.replace(old_doc, new_doc, 1)

    INTRO.write_text(t, encoding="utf-8")
    print("Updated", INTRO)


if __name__ == "__main__":
    main()
