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
        let rec = null, nativeBound = false;   // nativeBound: the Vosk wake-listener is wired (mic is native-owned)
        let wakeOn = false;        // set via setEnabled() (was Solita `wakeOn`)
        let suspended = false;     // host is speaking; mute the ear (was Solita `speaking`)
        let stopping = false;
        let paused = false;        // dormant: only the wake-word triggers (was Solita `paused`)
        let awaitingQuery = false; // a turn is open without a fresh trigger (adapter-driven mirror)
        let convoMirror = false;   // mirror of the adapter's conversation flag — interim-gate parity only
        let qTimer = null;         // debounce for cumulative "final" results
        let gen = 0;               // generation token: bumped on every stop/suspend/restart/visibility teardown,
                                   //   so a rec.onend from a SUPERSEDED recognizer can no longer reschedule start()
                                   //   and relaunch Web-SR to fight the native Vosk AudioRecord.

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

        // Bind the native (Vosk) wake listener ONCE. Idempotent and independent of Web-SR: in the
        // Capacitor app the native side OWNS the mic handoff by Activity lifecycle (Vosk recognizer
        // runs only while backgrounded/locked; foreground hands the mic to Web-SR), so the ear must
        // NOT start/stop the Vosk recognizer here — it only listens for the "background wake" event.
        // The service brings the Activity to the foreground and emits 'result'; we then open the
        // conversation via onWake('') so the now-foreground Web-SR captures the question.
        function bindNativeWake() {
            if (!NATIVE || nativeBound) return;
            nativeBound = true;
            NATIVE.addListener('result', function () {              // Vosk heard the wake-word (background)
                if (!wakeOn) return;                                // suspended is fine: a real Vosk wake foregrounds us
                paused = false;                                     // dormant → wake
                onWake('');                                         // prompt, then take the question via Web-SR
            });
            log('wake: native Vosk wake-listener bound');
        }

        function start() {
            // Native app: bind the background wake listener, then CONTINUE to start Web-SR for the
            // foreground conversation (mic exclusivity is enforced natively by lifecycle, not here).
            bindNativeWake();
            if (!SR) return;                                        // no Web-SR (e.g. iOS Safari): native wake only
            if (!wakeOn || suspended || rec) return;
            const myGen = gen;                                      // tie this recognizer to the current generation
            try {
                rec = new SR();
                rec.lang = getLang(); rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
                rec.onresult = onResult;
                rec.onstart = function () { log('wake: started'); };
                rec.onerror = function (e) { log('wake onerror: ' + (e && e.error)); };
                rec.onend = function () {
                    rec = null;
                    log('wake onend (on=' + wakeOn + ' speak=' + suspended + ' stop=' + stopping + ' gen=' + myGen + '/' + gen + ')');
                    // Only reschedule if THIS rec is still the current generation AND the WebView is visible.
                    // The visibilityState check alone stops a suspended/backgrounded WebView from relaunching
                    // Web-SR to fight the native Vosk AudioRecord; the gen check kills superseded onend storms.
                    if (myGen === gen && wakeOn && !suspended && !stopping && document.visibilityState === 'visible') setTimeout(start, 300);
                };
                rec.start();
            } catch (e) {
                rec = null;
                log('wake start() THROW: ' + ((e && e.message) || e));
                // Same generation + visibility guard on the throw-retry path (e.g. mic busy right after unlock).
                if (myGen === gen && wakeOn && !suspended && !stopping && document.visibilityState === 'visible') setTimeout(start, 1000);
            }
        }

        // stop(): stop ONLY the Web-SR recognizer. The native Vosk service is owned by the app's
        // Activity lifecycle (start once on login, never stop/start the SERVICE from background); the
        // host stops it explicitly on logout via SolitaVoice.stop(), not through the ear.
        function stop() {
            gen++;                                                  // supersede any in-flight rec → its onend won't restart
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
        function suspend() { gen++; suspended = true; if (rec) { try { rec.stop(); } catch (e) { } } }
        function unsuspend() { suspended = false; }
        // setEnabled(): mirror the host's on/off; ear does NOT itself start/stop (host pairs with start/stop).
        function setEnabled(on) { wakeOn = !!on; }
        // restart(): drop the current rec and start a fresh one (picks up a new getLang()).
        function restart() {
            if (!wakeOn) return;
            gen++;                                                  // supersede the old rec so its onend won't double-restart
            if (rec) { try { rec.stop(); } catch (e) { } rec = null; }
            setTimeout(start, 300);
        }
        // setConvo(): pure mirror used ONLY by the interim gate (single source of truth stays in the host).
        function setConvo(on) { convoMirror = !!on; }
        function setAwaiting(on) { awaitingQuery = !!on; }

        // Screen lock / app-switch suspends the WebView → Web SpeechRecognition dies (or zombies: `rec`
        // still set but deaf). On becoming visible again, force a clean restart. (Native manages its own.)
        // On becoming visible again (app resumed / unlocked), the native onResume has ALREADY stopped the
        // Vosk recognizer and freed the AudioRecord, so Web-SR may reclaim the mic. Force a clean restart
        // (handles the WebView-suspended zombie rec). Native wake (background) needs no web restart.
        document.addEventListener('visibilitychange', function () {
            gen++;                                                  // any rec from the previous visibility era is now stale
            if (document.visibilityState !== 'visible' || !wakeOn || suspended || !SR) return;
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
