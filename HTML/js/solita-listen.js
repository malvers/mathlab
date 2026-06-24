// js/solita-listen.js — shared, headless STT "turn" engine (Web-Speech). Keeps listening THROUGH mid-sentence
// pauses: it finalises a turn only after ~silenceMs of real quiet, OR when the speaker says the finish word
// ("bin fertig"). If the browser ends the recogniser early it restarts it (bounded by the silence timer), so
// listening genuinely continues. No DOM. Any tap-to-talk Solita host drives it via callbacks + start()/stop().
//
//   const ear = SolitaListen({ lang?, silenceMs?, finishWord?, onState, onPartial, onFinal, log? });
//   ear.start();          // begin a turn (call again while active → stop/submit)
//   ear.stop();           // force-stop
//   ear.active            // bool
//     onState('listening'|'idle'|'unsupported')   onPartial(text)   onFinal(finalText)   // host UI + submit
(function (global) {
    function SolitaListen(cfg) {
        cfg = cfg || {};
        const SR = global.SpeechRecognition || global.webkitSpeechRecognition;
        const lang = cfg.lang || 'de-DE';
        const SILENCE_MS = (typeof cfg.silenceMs === 'number') ? cfg.silenceMs : 5000;
        const word = (cfg.finishWord || 'bin fertig').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const finishRe = new RegExp('\\b' + word + '\\b', 'i');
        const stripRe = new RegExp('\\b' + word + '\\b.*$', 'i');
        const onState = cfg.onState || function () { };
        const onPartial = cfg.onPartial || function () { };
        const onFinal = cfg.onFinal || function () { };
        const dbg = cfg.log || function () { };

        let recog = null, active = false;
        const strip = function (s) { return s.replace(stripRe, '').replace(/\s+/g, ' ').trim(); };
        // Containment-aware join. Android's WebView delivers CUMULATIVE recognition results (each result is the
        // WHOLE phrase so far, not a disjoint chunk), so naive concatenation snowballed
        // ("solitasolita mirsolita mir…", Doc 2026-06-23). Across a recognizer RESTART the re-heard phrase can
        // also gain NEW LEADING words — session 1 dropped "Solita mir gefällt", sessions 2/3 caught it, so a
        // prefix-only check (acc must START t) failed and appended a near-duplicate three times over (Doc
        // 2026-06-24). Fix: if EITHER string fully contains the other, keep the LONGER (no matter where the
        // overlap sits); if they touch only at the seam, merge there; only genuinely new text is appended.
        // Standard (disjoint-result) browsers still concatenate correctly.
        const addText = function (acc, t) {
            t = (t || '').replace(/\s+/g, ' ').trim();
            if (!t) return acc;
            if (!acc) return t;
            if (t.indexOf(acc) !== -1) return t;                // acc fully inside t (cumulative OR new leading words) → t
            if (acc.indexOf(t) !== -1) return acc;              // t already contained in acc → ignore
            // Seam overlap: a restart can re-hear the boundary, so acc's tail repeats t's head. Merge on the
            // longest word-aligned overlap (≥2 words) instead of appending a duplicate.
            const aw = acc.split(' '), tw = t.split(' ');
            for (let n = Math.min(aw.length, tw.length); n >= 2; n--) {
                if (aw.slice(-n).join(' ') === tw.slice(0, n).join(' ')) return acc + ' ' + tw.slice(n).join(' ');
            }
            return acc + ' ' + t;                               // genuinely disjoint → append
        };

        function start() {
            if (!SR) { onState('unsupported'); return; }
            if (active && recog) { try { recog.stop(); } catch (e) { } return; } // running → stop (toggle)
            recog = new SR();
            recog.lang = lang; recog.interimResults = true; recog.maxAlternatives = 1; recog.continuous = true;
            let committed = '', sessionFinal = '', started = false, stopping = false, silence = null;
            function arm() { if (silence) clearTimeout(silence); silence = setTimeout(finish, SILENCE_MS); }
            function disarm() { if (silence) { clearTimeout(silence); silence = null; } }
            function finish() { stopping = true; disarm(); try { recog && recog.stop(); } catch (e) { } } // → onend submits

            recog.onstart = function () {
                active = true; onState('listening');
                if (!started) { started = true; onPartial(''); arm(); } // arm ONCE; restarts mustn't reset the 5 s window
            };
            recog.onresult = function (e) {
                // Build THIS session's transcript prefix-aware (see addText): Android delivers cumulative
                // results, so plain concatenation snowballs. `committed` keeps text finalised in PRIOR
                // (restarted) sessions — also merged prefix-aware so a re-heard phrase can't double.
                let finalT = '', interim = '';
                for (let k = 0; k < e.results.length; k++) {
                    const t = e.results[k][0].transcript;
                    if (e.results[k].isFinal) finalT = addText(finalT, t); else interim = addText(interim, t);
                }
                sessionFinal = finalT;
                const shown = addText(committed, addText(finalT, interim));
                onPartial(shown);
                if (finishRe.test(shown)) { committed = strip(shown); sessionFinal = ''; finish(); return; } // explicit "done"
                arm();                                                                                       // real speech → reset window
            };
            recog.onerror = function (ev) { dbg('STT-Fehler: ' + (ev && ev.error)); if ((ev && ev.error) === 'no-speech') return; active = false; disarm(); onState('idle'); };
            recog.onend = function () {
                if (!stopping) {
                    // Carry this session's final text over BEFORE the restart (prefix-aware → a re-heard phrase
                    // can't double across restarts; the new session's results reset).
                    committed = addText(committed, sessionFinal); sessionFinal = '';
                    try { recog.start(); dbg('STT: Neustart (weiter zuhören)'); return; } catch (e) { } // browser ended early → keep going
                }
                active = false; disarm();
                const q = strip(addText(committed, sessionFinal));
                if (q) onFinal(q); else onState('idle');
            };
            try { recog.start(); } catch (e) { active = false; onState('idle'); }
        }
        function stop() { try { recog && recog.stop(); } catch (e) { } }

        return { start: start, stop: stop, get active() { return active; }, supported: !!SR };
    }
    global.SolitaListen = SolitaListen;
})(window);
