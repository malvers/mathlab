// ear.js — a GENERIC, reusable "ear": wake-word + continuous speech-recognition lifecycle.
//
// Extracted from solita-wake.js so any lab page can drop it in. It owns ONLY the generic recognizer
// mechanics: SpeechRecognition / native-plugin lifecycle, configurable wake-word detection, the
// cumulative-finals query buffer + debounce, the visibility restart, the start()-throw retry, and the
// suspend/resume/pause(dormant) state flags. It speaks no Solita words, touches no DOM, reads no
// Solita/app globals. Everything app-specific is supplied via config and reported via callbacks.
//
// Usage:
//   const ear = new Ear({ triggers:['solita','solida','rita'], getLang:()=>'de-DE',
//                         nativePlugin:NATIVE, debounceMs:900, log:m=>console.log(m),
//                         onWake, onUtterance, onInterim, onPhase, onRawFinal });
//   ear.setEnabled(true); ear.pause(); ear.start();
(function () {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    function Ear(cfg) {
        cfg = cfg || {};
        // ---- config (all optional except triggers) ----
        const triggers = cfg.triggers || [];                       // lowercased wake words
        const getLang = cfg.getLang || function () { return 'de-DE'; };
        const NATIVE = cfg.nativePlugin || null;                   // Capacitor Vosk plugin or null
        const debounceMs = (typeof cfg.debounceMs === 'number') ? cfg.debounceMs : 900;
        const log = cfg.log || function () { };
        // callbacks (no-ops if not given)
        const onWake = cfg.onWake || function () { };
        const onUtterance = cfg.onUtterance || function () { };
        const onInterim = cfg.onInterim || function () { };
        const onPhase = cfg.onPhase || function () { };
        const onRawFinal = cfg.onRawFinal || function () { return false; };

        // ---- state (in-memory only; NO localStorage) ----
        let rec = null, nativeListening = false, nativeBound = false;
        let wakeOn = false;        // set via setEnabled() (was Solita `wakeOn`)
        let suspended = false;     // host is speaking; mute the ear (was Solita `speaking`)
        let stopping = false;
        let paused = false;        // dormant: only the wake-word triggers (was Solita `paused`)
        let awaitingQuery = false; // a turn is open without a fresh trigger (adapter-driven mirror)
        let convoMirror = false;   // mirror of the adapter's conversation flag — interim-gate parity only
        let qTimer = null;         // debounce for cumulative "final" results

        const self = this;

        // PURE: residual text after the earliest wake-word, or null if none present.
        function matchTrigger(t) {
            const low = t.toLowerCase();
            let idx = -1, hit = '';
            for (const w of triggers) {
                const i = low.indexOf(w);
                if (i !== -1 && (idx === -1 || i < idx)) { idx = i; hit = w; }
            }
            if (idx === -1) return null;                            // no wake word in this phrase
            return t.slice(idx + hit.length).replace(/^[\s,.:!?-]+/, '').trim();
        }

        function cancelPending() { if (qTimer) { clearTimeout(qTimer); qTimer = null; } }

        // Cumulative-finals buffer (Android WebView delivers ONE spoken question as several growing
        // "final" results). Show progress live via onInterim, then emit the latest RAW buffered text via
        // onUtterance once ~debounceMs of quiet has passed. The ear does NOT strip a leading trigger here:
        // the host resolves the "longest shown" text and strips, so the strip happens on exactly ONE side
        // (matches the old queueQuery, which resolved `(input.value)||t` and stripped that).
        function queueQuery(t) {
            awaitingQuery = true;                                   // stay open while the finals keep growing
            onInterim(t);                                           // show progress live (adapter mirrors)
            if (qTimer) clearTimeout(qTimer);
            qTimer = setTimeout(function () {
                qTimer = null;
                // NOTE: do NOT clear awaitingQuery here. The host clears it (via setAwaiting) only on a
                // non-empty result inside onUtterance — matching the old `if(!q)return;` BEFORE the clear,
                // which keeps the turn open when the settled text strips down to nothing.
                onUtterance(t);                                     // raw latest final; host resolves + strips + submits
            }, debounceMs);
        }

        function onResult(e) {
            if (suspended) return;                                  // host is speaking → ignore
            let txt = '', interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) txt += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            // Live interim mirror: only while a turn is open and not dormant/suspended. The adapter adds
            // any further host gate (e.g. UI-mode skip). Equals the old gate `(convo||awaitingQuery)&&!paused`.
            if (!txt && interim && (awaitingQuery || convoMirror) && !paused && !suspended) {
                onInterim(interim);
                return;
            }
            txt = txt.trim();
            if (!txt) return;
            log('heard: "' + txt + '"');                            // measure what STT actually transcribes
            // THE SEAM: hand the raw trimmed final to the host first. If it consumed it (command), stop.
            if (onRawFinal(txt)) return;
            // Generic fallback (host returned false): dormant-wake, then awaitingQuery-debounce, then trigger.
            if (paused) {                                           // dormant: a wake word wakes her
                const w = matchTrigger(txt);
                if (w !== null) { paused = false; onWake(w); }      // rest of the phrase = first turn
                return;
            }
            if (awaitingQuery) { queueQuery(txt); return; }         // buffer cumulative finals, submit once settled
            const q = matchTrigger(txt);
            if (q !== null) onWake(q);                              // phrase contained a wake word → (re)open
        }

        function start() {
            if (NATIVE) {                                           // native Vosk path (no Web SpeechRecognition)
                if (!wakeOn || suspended || nativeListening) return;
                if (!nativeBound) {
                    nativeBound = true;
                    NATIVE.addListener('result', function () {      // Vosk heard the wake-word
                        if (suspended || !wakeOn) return;
                        paused = false;                             // dormant → wake
                        onWake('');                                 // prompt, then take the question
                    });
                }
                nativeListening = true;
                log('wake: native Vosk start');
                try { NATIVE.start().catch(function (e) { nativeListening = false; log('Vosk start reject: ' + ((e && e.message) || e)); }); }
                catch (e) { nativeListening = false; }
                return;
            }
            if (!wakeOn || suspended || rec) return;
            try {
                rec = new SR();
                rec.lang = getLang(); rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
                rec.onresult = onResult;
                rec.onstart = function () { log('wake: started'); };
                rec.onerror = function (e) { log('wake onerror: ' + (e && e.error)); };
                rec.onend = function () {
                    rec = null;
                    log('wake onend (on=' + wakeOn + ' speak=' + suspended + ' stop=' + stopping + ')');
                    if (wakeOn && !suspended && !stopping) setTimeout(start, 300);
                };
                rec.start();
            } catch (e) {
                rec = null;
                log('wake start() THROW: ' + ((e && e.message) || e));
                if (wakeOn && !suspended && !stopping) setTimeout(start, 1000);   // e.g. mic busy right after unlock → retry
            }
        }

        function stop() {
            if (NATIVE) { nativeListening = false; try { NATIVE.stop().catch(function () { }); } catch (e) { } return; }
            stopping = true;
            if (rec) { try { rec.stop(); } catch (e) { } rec = null; }
            setTimeout(function () { stopping = false; }, 500);
        }

        // pause(): go dormant — stay running, only the wake-word triggers, interim mirror off.
        function pause() { paused = true; }
        // resume(): leave dormant; carry an open-turn flag so the host's turn-loop keeps one turn open
        // without a fresh trigger. convoMirror lets the interim gate match the old behaviour.
        function resume(opts) {
            opts = opts || {};
            paused = false;
            awaitingQuery = !!opts.awaitingQuery;
            if (typeof opts.convo === 'boolean') convoMirror = opts.convo;
        }
        // suspend(): mute while the host speaks — set the flag SYNCHRONOUSLY, then stop the recognizer.
        function suspend() { suspended = true; if (rec) { try { rec.stop(); } catch (e) { } } }
        function unsuspend() { suspended = false; }
        // setEnabled(): mirror the host's on/off; ear does NOT itself start/stop (host pairs with start/stop).
        function setEnabled(on) { wakeOn = !!on; }
        // restart(): drop the current rec and start a fresh one (picks up a new getLang()).
        function restart() {
            if (!wakeOn) return;
            if (rec) { try { rec.stop(); } catch (e) { } rec = null; }
            setTimeout(start, 300);
        }
        // setConvo(): pure mirror used ONLY by the interim gate (single source of truth stays in the host).
        function setConvo(on) { convoMirror = !!on; }
        function setAwaiting(on) { awaitingQuery = !!on; }

        // Screen lock / app-switch suspends the WebView → Web SpeechRecognition dies (or zombies: `rec`
        // still set but deaf). On becoming visible again, force a clean restart. (Native manages its own.)
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState !== 'visible' || !wakeOn || suspended || NATIVE) return;
            log('wake: visible → restart recognizer');
            if (rec) { try { rec.onend = null; rec.stop(); } catch (e) { } rec = null; }   // drop a dead/zombie rec
            setTimeout(start, 300);
        });

        // ---- public API ----
        self.start = start;
        self.stop = stop;
        self.pause = pause;
        self.resume = resume;
        self.suspend = suspend;
        self.unsuspend = unsuspend;
        self.setEnabled = setEnabled;
        self.restart = restart;
        self.cancelPending = cancelPending;
        self.queueQuery = queueQuery;
        self.matchTrigger = matchTrigger;
        self.setConvo = setConvo;
        self.setAwaiting = setAwaiting;
        // read-only getters for host routing parity
        self.isEnabled = function () { return wakeOn; };
        self.isPaused = function () { return paused; };
        self.isSuspended = function () { return suspended; };
        if (typeof onPhase === 'function') { /* optional coarse hint; Solita keeps its own rich phase */ }
    }

    Ear.SR = SR;                                                   // expose feature-detect so adapters can branch
    window.Ear = Ear;
})();
