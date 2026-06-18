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

        function start() {
            if (!SR) { onState('unsupported'); return; }
            if (active && recog) { try { recog.stop(); } catch (e) { } return; } // running → stop (toggle)
            recog = new SR();
            recog.lang = lang; recog.interimResults = true; recog.maxAlternatives = 1; recog.continuous = true;
            let finalText = '', started = false, stopping = false, silence = null;
            function arm() { if (silence) clearTimeout(silence); silence = setTimeout(finish, SILENCE_MS); }
            function disarm() { if (silence) { clearTimeout(silence); silence = null; } }
            function finish() { stopping = true; disarm(); try { recog && recog.stop(); } catch (e) { } } // → onend submits

            recog.onstart = function () {
                active = true; onState('listening');
                if (!started) { started = true; onPartial(''); arm(); } // arm ONCE; restarts mustn't reset the 5 s window
            };
            recog.onresult = function (e) {
                let interim = '';
                for (let k = e.resultIndex; k < e.results.length; k++) {
                    const t = e.results[k][0].transcript;
                    if (e.results[k].isFinal) finalText += t; else interim += t;
                }
                const shown = (finalText + interim).replace(/\s+/g, ' ').trim();
                onPartial(shown);
                if (finishRe.test(shown)) { finalText = strip(finalText + interim); finish(); return; } // explicit "done"
                arm();                                                                                   // real speech → reset window
            };
            recog.onerror = function (ev) { dbg('STT-Fehler: ' + (ev && ev.error)); if ((ev && ev.error) === 'no-speech') return; active = false; disarm(); onState('idle'); };
            recog.onend = function () {
                if (!stopping) { try { recog.start(); dbg('STT: Neustart (weiter zuhören)'); return; } catch (e) { } } // browser ended early → keep going
                active = false; disarm();
                const q = strip(finalText);
                if (q) onFinal(q); else onState('idle');
            };
            try { recog.start(); } catch (e) { active = false; onState('idle'); }
        }
        function stop() { try { recog && recog.stop(); } catch (e) { } }

        return { start: start, stop: stop, get active() { return active; }, supported: !!SR };
    }
    global.SolitaListen = SolitaListen;
})(window);
