        (function () {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            const wakeBtn = document.getElementById('wakeBtn');
            const input = document.getElementById('messageInput');
            if (!wakeBtn) return;
            if (!SR) { wakeBtn.style.display = 'none'; return; }   // e.g. iOS Safari: no SpeechRecognition

            const TRIGGERS = ['solita', 'solida', 'rita'];          // Vosk-tested variants (see krass-app note)
            const WAKE_KEY = 'solita_wake';
            let wakeOn = localStorage.getItem(WAKE_KEY) === '1';
            let rec = null, awaitingQuery = false, speaking = false, stopping = false, convo = false, paused = false;

            function reflect() { wakeBtn.classList.toggle('active', wakeOn); }
            reflect();

            // Pause listening while Solita speaks (so the mic doesn't pick up her own "Solita"), resume after.
            const _speak = window.speakReply;
            window.speakReply = function (text) {
                if (wakeOn && rec) { speaking = true; try { rec.stop(); } catch (e) { } }
                if (typeof _speak === 'function') _speak(text);
                if (window.solitaPhase) solitaPhase('speaking');
                const resume = () => {
                    speaking = false;
                    // Turn-loop: while a conversation is open, reopen the ear after EVERY reply (no "Solita"
                    // per turn). When the conversation has ENDED, fall back to the SLUMBER resting state —
                    // visible pill, waiting for "Solita" — instead of an invisible idle. (UI-mode = own flow.)
                    if (wakeOn) {
                        startRec();
                        if (convo && !window.__uiMode) awaitingQuery = true;
                        else if (!convo) paused = true;   // resting → dormant
                    }
                    if (window.solitaPhase) solitaPhase(!wakeOn ? 'idle' : (convo ? 'listening' : 'dormant'));
                };
                // _speak set window.__solitaSpeaking synchronously; poll it (covers Cloud audio AND the
                // browser fallback) → re-open the ear when playback ends.
                const iv = setInterval(function () {
                    if (!window.__solitaSpeaking) { clearInterval(iv); setTimeout(resume, 300); }
                }, 200);
            };

            function extractQuery(t) {
                const low = t.toLowerCase();
                let idx = -1, hit = '';
                for (const w of TRIGGERS) {
                    const i = low.indexOf(w);
                    if (i !== -1 && (idx === -1 || i < idx)) { idx = i; hit = w; }
                }
                if (idx === -1) return null;                         // no wake word in this phrase
                return t.slice(idx + hit.length).replace(/^[\s,.:!?-]+/, '').trim();
            }

            function fire(query) {
                convo = true;                                        // addressing Solita opens the conversation thread
                if (!query) {                                        // heard "Solita" alone → prompt + listen once
                    awaitingQuery = true;
                    if (window.speakReply) window.speakReply('Ja?');
                    return;
                }
                awaitingQuery = false;
                // Show the heard question in the input line first, then submit a beat later.
                if (input) { input.value = query; input.dispatchEvent(new Event('input')); }
                if (typeof sendMessage === 'function') setTimeout(sendMessage, 700);
            }

            // UI-mode voice flow (Doc): once in UI mode, speak the wish freely (no "Solita" needed),
            // then "go" OR a 4 s pause submits it; "fertig" leaves. (sendMessage routes UI-mode text to config.)
            let uiTimer = null;
            function uiExec() {
                if (uiTimer) { clearTimeout(uiTimer); uiTimer = null; }
                if (input && input.value.trim() && typeof sendMessage === 'function') sendMessage();
            }
            function handleUiVoice(txt) {
                if (/^\s*(fertig|exit|stopp?|ende|raus)\b/i.test(txt)) {   // leave UI mode
                    if (uiTimer) { clearTimeout(uiTimer); uiTimer = null; }
                    if (input) { input.value = txt; input.dispatchEvent(new Event('input')); }
                    if (typeof sendMessage === 'function') sendMessage();
                    return;
                }
                const sawGo = /\bgo\b/i.test(txt);
                const cmd = txt.replace(/\bgo\b.*$/i, '').trim();          // text before "go"
                if (cmd && input) {
                    input.value = (input.value.trim() ? input.value.trim() + ' ' : '') + cmd;
                    input.dispatchEvent(new Event('input'));
                }
                if (sawGo) { uiExec(); return; }                          // "go" → submit now
                if (uiTimer) clearTimeout(uiTimer);                       // else (re)start the 4 s pause-timer
                uiTimer = setTimeout(uiExec, 4000);
            }

            // Hang up the conversation: a goodbye drops back to idle (wake-word needed again). NOT sent to the API.
            const FAREWELL = /^(tschü(?:ss?)?|auf wiederhör(?:en)?|das war'?s(?: für (?:heute|jetzt))?|danke,? das war'?s|schluss für (?:heute|jetzt)|beenden?(?: das gespräch)?)\b/i;
            function endConvo() {
                convo = false; awaitingQuery = false;
                if (window.speakReply) window.speakReply('Bis später.');
            }

            // Voice action — logout. Spoken intent ("Solita, log mich aus" / "melde mich ab" / "kannst du
            // mich ausloggen"). Note: keyword-based, so ASKING about logging out can also trigger it — real
            // LLM intent-interpretation is the next step. Speaks a goodbye, then logs out (which kills the mic).
            const LOGOUT = /\bausloggen\b|\babmelden\b|\blogout\b|\blog\s?out\b|\blog+e?\s?mich\s?(aus|raus)\b|\bmelde mich (ab|aus|raus)\b|\bmich (ab|aus)melden\b/i;
            function doVoiceLogout() {
                convo = false; awaitingQuery = false;
                if (window.speakReply) window.speakReply('Logge dich aus. Bis bald.');
                setTimeout(function () { if (window.solitaLogout) window.solitaLogout(); }, 1700);
            }

            // Pause: a spoken "Pause" makes Solita go dormant — she ignores everything until she hears
            // "Solita" again. The pill shows the half-asleep word. Reuses the wake-word detector to wake.
            const PAUSE = /\bpause\b|\bpausier/i;   // anywhere (gated by `addressed`) → "ok pause", "mach mal pause", "pausiere" …
            function enterPause() {
                paused = true; convo = false; awaitingQuery = false;
                if (window.solitaPhase) solitaPhase('dormant');     // pill → half-asleep
            }

            function onResult(e) {
                if (speaking) return;
                let txt = '', interim = '';
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    if (e.results[i].isFinal) txt += e.results[i][0].transcript;
                    else interim += e.results[i][0].transcript;
                }
                // Live: while it's your turn in a conversation, mirror the INTERIM transcript into the input
                // line as you speak (not committed yet). Skip ambient wake-listening / UI-mode / pause.
                if (!txt && interim && (convo || awaitingQuery) && !window.__uiMode && !paused) {
                    if (input) { input.value = interim; input.dispatchEvent(new Event('input')); }
                    return;
                }
                txt = txt.trim();
                if (!txt) return;
                try { console.log('[solita] heard: "' + txt + '"'); } catch (_) {}  // measure what de-DE actually transcribes
                if (paused) {                                          // dormant: ONLY the wake word "Solita" wakes her
                    const w = extractQuery(txt);
                    if (w !== null) { paused = false; fire(w); }       // "Solita …" → wake; rest becomes the first turn
                    return;
                }
                if (window.__uiMode) { handleUiVoice(txt); return; }   // UI mode: accumulate + go/pause
                if (input) input.value = '';                           // final arrived → clear the live interim text
                const addressed = convo || awaitingQuery || extractQuery(txt) !== null;
                if (addressed && PAUSE.test(txt)) { enterPause(); return; }     // "Pause" → dormant until "Solita"
                if (addressed && LOGOUT.test(txt)) { doVoiceLogout(); return; } // "Solita, log mich aus" → action, not chat
                if (convo && FAREWELL.test(txt)) { endConvo(); return; } // "tschüss" → hang up the thread
                if (awaitingQuery) { fire(txt); return; }             // in conversation: this utterance is the next turn
                const q = extractQuery(txt);
                if (q !== null) fire(q);                               // phrase contained "Solita …" → (re)open convo
            }

            function startRec() {
                if (!wakeOn || speaking || rec) return;
                try {
                    rec = new SR();
                    rec.lang = 'de-DE'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
                    rec.onresult = onResult;
                    rec.onerror = function () { };
                    rec.onend = function () { rec = null; if (wakeOn && !speaking && !stopping) setTimeout(startRec, 300); };
                    rec.start();
                } catch (e) { rec = null; }
            }

            function stopRec() {
                stopping = true;
                if (rec) { try { rec.stop(); } catch (e) { } rec = null; }
                setTimeout(function () { stopping = false; }, 500);
            }

            // Turn the whole voice line OFF (used on logout). Persists off so a fresh login starts quiet.
            window.solitaStopVoice = function () {
                wakeOn = false; try { localStorage.setItem(WAKE_KEY, '0'); } catch (e) {}
                convo = false; awaitingQuery = false; paused = false; reflect();
                if (window.solitaPhase) solitaPhase('idle');
                stopRec();
            };

            wakeBtn.addEventListener('click', function () {
                wakeOn = !wakeOn; localStorage.setItem(WAKE_KEY, wakeOn ? '1' : '0'); reflect();
                convo = false; awaitingQuery = false;                 // toggling the line resets the thread
                if (wakeOn) { paused = true; if (window.solitaPhase) solitaPhase('dormant'); startRec(); }   // ear on → SLUMBER (waiting for "Solita")
                else { paused = false; if (window.solitaPhase) solitaPhase('idle'); stopRec(); }
            });

            if (wakeOn) { paused = true; if (window.solitaPhase) solitaPhase('dormant'); setTimeout(startRec, 600); }   // left on → resume in SLUMBER (pill visible, waiting for "Solita")
        })();
