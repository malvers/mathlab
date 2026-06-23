        (function () {
            // Solita adapter for the generic ear (js/ear.js). The recognizer mechanics live in Ear;
            // this file owns ONLY the Solita-specific parts: the wake words, the #wakeBtn + #messageInput
            // DOM, the spoken-command decoding (pause/farewell/logout/slash), UI-mode, the multilang SAY
            // map, the speakReply suspend/resume wrapper, the load-init gate, and the window.solita*Voice API.
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            const wakeBtn = document.getElementById('wakeBtn');
            const input = document.getElementById('messageInput');
            if (!wakeBtn) return;
            // Native app (Stufe B): the SolitaVoice plugin gives an ALWAYS-ON Vosk wake-word that survives a
            // screen-lock (native FGS). It is detected INDEPENDENTLY of SR: the Android WebView HAS Web-SR too,
            // and we want BOTH — Web-SR runs the proven foreground conversation, Vosk handles background/locked
            // wake. The native side owns the mic handoff by Activity lifecycle (Vosk recognizer runs only while
            // backgrounded; foreground frees the mic for Web-SR), so the ear never manages the Vosk mic.
            const NATIVE = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SolitaVoice)
                ? window.Capacitor.Plugins.SolitaVoice : null;
            if (!SR && !NATIVE) { wakeBtn.style.display = 'none'; return; }   // e.g. iOS Safari: nothing to listen with

            // Start/stop the ALWAYS-ON background Vosk wake SERVICE (native only). Android 14 forbids
            // (re)starting a mic-FGS from the background, so we start it ONCE while foreground (on login) and
            // never stop+start it from the background — only the native lifecycle stops/starts the RECOGNIZER.
            function startNativeWake() { if (NATIVE) { try { NATIVE.start().catch(function () { }); } catch (e) { } } }
            function stopNativeWake() { if (NATIVE) { try { NATIVE.stop().catch(function () { }); } catch (e) { } } }
            // Tell the native Vosk recognizer to free the mic NOW for the foreground Web-SR. The Activity
            // lifecycle (MainActivity.onResume → setListening(false)) is the primary driver, but at LOGIN the
            // Activity is ALREADY resumed, so onResume will NOT re-fire to stop Vosk — we must do it explicitly
            // right after start()ing the service, or the fresh service steals the mic from the foreground Web-SR.
            function freeMicForWebSR() {
                if (!NATIVE) return;
                try { window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SolitaVoice && window.Capacitor.Plugins.SolitaVoice.setListening({ listen: false }); } catch (e) { }
            }

            const TRIGGERS = ['solita', 'solida', 'rita'];          // Vosk-tested variants (see krass-app note)
            const WAKE_KEY = 'solita_wake';
            // Doc rule: the ear is ALWAYS on — it must never be silently off after a reload/login. The 👂
            // button only mutes it for the current session; on the next load it is on again.
            let wakeOn = true;
            // SOURCE OF TRUTH for the Solita conversation state. The ear keeps pure mirrors of these
            // (pushed via ear.resume/pause/setConvo/setAwaiting); these locals are what the adapter reads.
            // awaitingConfirm: a lock-wake asked „Soll ich helfen?" and is waiting for the yes/no answer.
            let awaitingQuery = false, convo = false, paused = false, awaitingConfirm = false, confirmAccepting = false, confirmTimer = null;

            // Build the generic ear with Solita's config. The ear knows no Solita words/DOM/globals.
            const ear = new Ear({
                triggers: TRIGGERS,
                getLang: function () { return window.solitaSttLang ? window.solitaSttLang() : 'de-DE'; },
                nativePlugin: NATIVE,
                debounceMs: 900,
                log: function (m) { if (window.DebugWindow) DebugWindow.log(m); },
                onWake: onWake,
                onUtterance: onUtterance,
                onInterim: onInterim,
                onRawFinal: onRawFinal
            });
            ear.setEnabled(wakeOn);

            function reflect() { wakeBtn.classList.toggle('active', wakeOn); }
            reflect();

            // Pause listening while Solita speaks (so the mic doesn't pick up her own "Solita"), resume after.
            const _speak = window.speakReply;
            window.speakReply = function (text) {
                // Old guard was `if (wakeOn && (rec || NATIVE)) { speaking = true; rec.stop(); }` — it only
                // muted when a recognizer was actually live. We intentionally simplify to `isEnabled()`:
                // suspend() sets the mute flag synchronously and is idempotent + harmless when no rec is
                // running (the `if(suspended)return` gates in Ear.start()/onResult() do the rest), and
                // resume() clears it unconditionally — so there is no behavioral loss. (SR is guaranteed
                // truthy here: we early-returned above when neither SR nor NATIVE exists.)
                if (ear.isEnabled()) ear.suspend();
                // BELT (native): the real fix is the native lifecycle, but while Solita speaks make doubly sure
                // the Vosk recognizer isn't holding the mic — stop it before TTS so it can't hear her own voice.
                try { window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SolitaVoice && window.Capacitor.Plugins.SolitaVoice.setListening({ listen: false }); } catch (e) { }
                if (typeof _speak === 'function') _speak(text);
                if (window.solitaPhase) solitaPhase('speaking');
                const resume = () => {
                    ear.unsuspend();   // unconditional, matching the old `speaking = false;` (clears mute even if off)
                    // Turn-loop: while a conversation is open, reopen the ear after EVERY reply (no "Solita"
                    // per turn). When the conversation has ENDED, fall back to the SLUMBER resting state —
                    // visible pill, waiting for "Solita" — instead of an invisible idle. (UI-mode = own flow.)
                    if (ear.isEnabled()) {
                        ear.start();
                        if (convo && !window.__uiMode) awaitingQuery = true;
                        else if (!convo) paused = true;   // resting → dormant
                        ear.resume({ awaitingQuery: awaitingQuery, convo: convo });   // mirror the flags
                        if (paused) ear.pause();
                    }
                    if (window.solitaPhase) solitaPhase(!ear.isEnabled() ? 'idle' : (convo ? 'listening' : 'dormant'));
                    // Ear reopened and waiting → (re)start the silence countdown for an open conversation.
                    if (ear.isEnabled() && convo && !paused && !window.__uiMode) armIdle(); else disarmIdle();
                };
                // _speak set window.__solitaSpeaking synchronously; poll it (covers Cloud audio AND the
                // browser fallback) → re-open the ear when playback ends.
                const iv = setInterval(function () {
                    if (!window.__solitaSpeaking) { clearInterval(iv); setTimeout(resume, 300); }
                }, 200);
            };

            function fire(query) {
                disarmIdle();                                        // new turn underway → resume() re-arms after the reply
                convo = true;                                        // addressing Solita opens the conversation thread
                if (!query) {                                        // heard "Solita" alone → prompt + listen once
                    awaitingQuery = true;
                    ear.setConvo(true); ear.setAwaiting(true);
                    if (window.speakReply) window.speakReply(say('yes'));
                    return;
                }
                awaitingQuery = false;
                ear.setConvo(true); ear.setAwaiting(false);
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

            // Short spoken responses, per language (so an EN/ES command doesn't get a German reply).
            // `yes` is the WAKE-ACK — a list, not one word, so "Solita" never gets the same curt "Ja?"
            // twice in a row. Picked LOCALLY (no token, zero latency — the ack must be instant) and warm,
            // with a polyglot sprinkle (Doc: "Sí, jep, jo, ja, Yes, what's up"). bye/logout stay single.
            // `offerHelp` is the lock-wake question (she woke from sleep and asks before acting); `okay` is the
            // brief acknowledgement when Doc declines, right before she drifts back to sleep.
            const SAY = {
                de: { yes: ['Ja!', 'Sí!', 'Bin da!', 'Kann ich helfen!', 'Yes!', 'Was ist es nun schon wieder? Spaaaaß!!! wie kann ich Dir helfen?'], offerHelp: ['Soll ich helfen?', 'Brauchst du mich?', 'Kann ich helfen?', 'Ja? Soll ich helfen?'], okay: ['Okay.', 'Alles klar.', 'Dann schlafe ich weiter.', 'Bis gleich.'], bye: 'Bis später.', logout: 'Logge dich aus. Bis bald.' },
                en: { yes: ['Yes?', 'Yep!', 'Hey!', 'I’m here!', 'What’s up?', 'Go ahead.', 'Sí?', 'Listening!'], offerHelp: ['Can I help?', 'Need me?', 'Should I help?', 'Yes? Can I help?'], okay: ['Okay.', 'Alright.', 'Back to sleep then.', 'See you.'], bye: 'See you later.', logout: 'Logging you out. See you soon.' },
                es: { yes: ['¿Sí?', '¿Dime?', '¡Aquí estoy!', '¡Hey!', '¿Qué tal?', 'Te escucho.', '¡Sí, sí!'], offerHelp: ['¿Te ayudo?', '¿Me necesitas?', '¿Puedo ayudar?', '¿Sí? ¿Te ayudo?'], okay: ['Vale.', 'De acuerdo.', 'Sigo durmiendo.', 'Hasta luego.'], bye: 'Hasta luego.', logout: 'Cerrando sesión. Hasta pronto.' }
            };
            let _lastSaid = '';
            function say(key) {
                const v = (SAY[window.solitaLang] || SAY.de)[key];
                if (!Array.isArray(v)) return v;                          // bye/logout: single line
                let pick = v[Math.floor(Math.random() * v.length)];      // random, but…
                let guard = 0;                                           // …never the same one twice running (feels mechanical)
                while (v.length > 1 && pick === _lastSaid && guard++ < 8) pick = v[Math.floor(Math.random() * v.length)];
                _lastSaid = pick;
                return pick;
            }

            // Login welcome — spoken ONCE right after a MANUAL unlock (solita-core calls window.solitaGreet
            // there, where a click/keypress gesture exists so the browser actually lets the audio play; on a
            // silent auto-restore it is NOT called → no autoplay-block, no nag on Doc's constant hard-reloads).
            // Time-of-day aware, varied, with a warm „Hola"-sprinkle (Solita ↔ Altea). Speaks in solitaLang.
            const GREET = {
                de: {
                    morning: ['Guten Morgen! Ich bin wach.', 'Morgen! Schön, dass du da bist.', 'Hola, guten Morgen!', 'Guten Morgen — leg los.'],
                    day:     ['Hallo! Ich bin da.', 'Hola! Schön, dich zu hören.', 'Hey, willkommen zurück!', 'Da bin ich. Was geht?'],
                    evening: ['Guten Abend! Ich bin wach.', 'Hola, guten Abend!', 'Schönen Abend — ich bin da.', 'Abend! Wie kann ich helfen?'],
                    night:   ['Noch wach? Ich auch.', 'Hola, Nachteule — ich bin da.', 'Späte Stunde — ich höre zu.', 'Spät dran? Ich bin wach.']
                },
                en: {
                    morning: ['Good morning! I’m awake.', 'Morning! Good to have you.', 'Hola, good morning!', 'Up and ready — go ahead.'],
                    day:     ['Hello! I’m here.', 'Hola! Good to hear you.', 'Hey, welcome back!', 'Here I am. What’s up?'],
                    evening: ['Good evening! I’m awake.', 'Hola, good evening!', 'Evening — I’m here.', 'Welcome back this evening.'],
                    night:   ['Still up? Me too.', 'Hola, night owl — I’m here.', 'Late hour — I’m listening.', 'Up late? So am I.']
                },
                es: {
                    morning: ['¡Buenos días! Estoy despierta.', '¡Hola, buenos días!', 'Buenos días — cuando quieras.', '¡Despierta y lista!'],
                    day:     ['¡Hola! Aquí estoy.', '¡Hola! Me alegro de oírte.', '¡Hey, bienvenido!', 'Aquí estoy. ¿Qué tal?'],
                    evening: ['¡Buenas tardes! Estoy despierta.', '¡Hola, buenas tardes!', 'Buenas — aquí estoy.', '¡Bienvenido esta tarde!'],
                    night:   ['¿Todavía despierto? Yo también.', '¡Hola, búho nocturno!', 'Hora tardía — te escucho.', 'Despierta a estas horas.']
                }
            };
            function greetWelcome() {
                const h = new Date().getHours();
                const tod = h < 5 ? 'night' : h < 11 ? 'morning' : h < 18 ? 'day' : h < 22 ? 'evening' : 'night';
                const list = (GREET[window.solitaLang] || GREET.de)[tod];
                return list[Math.floor(Math.random() * list.length)];
            }
            window.solitaGreet = function () { if (window.speakReply) window.speakReply(greetWelcome()); };

            // Hang up the conversation: a goodbye drops back to idle (wake-word needed again). NOT sent to the API.
            //   DE: tschüss · auf wiederhören · das war's · schluss für heute    EN: bye · goodbye · good night ·
            //   see you · that's all/it · we're done    ES: adiós · hasta luego/pronto/mañana · buenas noches · chao
            const FAREWELL = /^(tschü(?:ss?)?|auf wiederhör(?:en)?|das war'?s(?: für (?:heute|jetzt))?|danke,? das war'?s|schluss für (?:heute|jetzt)|beenden?(?: das gespräch)?|bye(?:[\s-]?bye)?|goodbye|good ?night|see you(?: later)?|that'?s (?:all|it)|we'?re done|adi[oó]s|hasta (?:luego|pronto|ma[ñn]ana)|buenas noches|chao|ciao|eso es todo)\b/i;
            function endConvo() {
                disarmIdle();
                ear.cancelPending();
                convo = false; awaitingQuery = false;
                ear.setConvo(false); ear.setAwaiting(false);
                if (window.speakReply) window.speakReply(say('bye'));
            }

            // Voice action — logout. Spoken intent ("Solita, log mich aus" / "melde mich ab" / "kannst du
            // mich ausloggen"). Note: keyword-based, so ASKING about logging out can also trigger it — real
            // LLM intent-interpretation is the next step. Speaks a goodbye, then logs out (which kills the mic).
            //   EN: log (me) out · sign (me) out      ES: cierra(me) (la) sesión · cerrar sesión · desconéctame
            const LOGOUT = /\bausloggen\b|\babmelden\b|\blogout\b|\blog\s?out\b|\blog+e?\s?mich\s?(aus|raus)\b|\bmelde mich (ab|aus|raus)\b|\bmich (ab|aus)melden\b|\blog ?me ?out\b|\bsign\s?(?:me\s?)?out\b|\bci[eé]rra(?:me)? (?:la )?sesi[oó]n\b|\bcerrar sesi[oó]n\b|\bdescon[eé]ctame\b/i;
            function doVoiceLogout() {
                disarmIdle();
                ear.cancelPending();
                convo = false; awaitingQuery = false;
                ear.setConvo(false); ear.setAwaiting(false);
                if (window.speakReply) window.speakReply(say('logout'));
                setTimeout(function () { if (window.solitaLogout) window.solitaLogout(); }, 1700);
            }

            // Pause: a spoken "Pause" makes Solita go dormant — she ignores everything until she hears
            // "Solita" again. The pill shows the half-asleep word. Reuses the wake-word detector to wake.
            // Pause words per language → all send her dormant (gated by `addressed`).
            //   DE: pause · pausier… · chill mal · chillen · ruh(e) dich aus · sogni d'oro (also "soni d'oro")
            //   EN: pause · chill out · take a break · go to sleep      ES: pausa · descansa · a dormir · duérmete
            const PAUSE = /\bpause\b|\bpausier|\bchill\s+mal\b|\bchillen\b|\bruhe?\s+dich\s+aus\b|\bso(?:g)?ni\s+d'?\s?oro\b|\bchill\s+out\b|\btake a break\b|\bgo to sleep\b|\bpausa\b|\bdescansa\b|\ba dormir\b|\bdué?rmete\b/i;
            // Idle-to-slumber (Doc 2026-06-17): an open conversation that sits silent for IDLE_MS — Doc said
            // nothing — drifts into the quiet SLUMBER on its own (same resting state as a spoken "Pause" or a
            // screen-lock). Re-armed each time the ear reopens for Doc's next turn and pushed out while he is
            // mid-utterance; the callback re-checks the state so a stale timer can never nap her at a wrong moment.
            const IDLE_MS = 60000;
            let idleTimer = null;
            function disarmIdle() { if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; } }
            function armIdle() {
                disarmIdle();
                idleTimer = setTimeout(function () {
                    idleTimer = null;
                    if (convo && !paused && !window.__uiMode && !awaitingConfirm && ear.isEnabled()) enterPause();
                }, IDLE_MS);
            }

            function enterPause() {
                disarmIdle();
                ear.cancelPending(); clearConfirm(); confirmAccepting = false;   // going dormant cancels any pending lock-wake gate
                paused = true; convo = false; awaitingQuery = false;
                ear.pause(); ear.setConvo(false); ear.setAwaiting(false);
                if (window.solitaPhase) solitaPhase('dormant');     // pill → half-asleep
            }

            // ── Lock-wake confirmation gate (Doc 2026-06-16) ─────────────────────────────────────────────
            // A background/locked wake comes from the native Vosk recognizer, whose "Solita" detection is OOV
            // and so fires on the homophone "solide" too (fundamental — see solita-vosk-hybrid.md). So a
            // lock-wake must NOT open a live turn blind: she asks „Soll ich helfen?" first. „Nein" — or no
            // answer at all (a false fire to an empty room) — sends her straight back to sleep; anything else
            // counts as yes (optionally carrying the wish) and the normal conversation opens.
            const NEG_CONFIRM = /\b(nein|nee?|n[öo]|nope|lass(?:\s+(?:mal|gut|stecken))?|vergiss(?:\s+es)?|schon\s+gut|passt\s+schon|kein(?:en)?\s+bedarf|nicht\s+n[öo]tig|brauch(?:e)?\s+(?:dich\s+)?nicht|no\s+gracias|d[eé]jalo|olv[ií]dalo)\b/i;
            // Greedy leader: strip any run of affirmative fillers („ja", „ja bitte", „na klar gerne", …) so what
            // remains is the actual wish (empty remainder = a pure „ja" → just open the ear and prompt).
            const AFFIRM_LEAD = /^[\s,.;:!-]*(?:(?:ja|jo|jep|jawohl|klar|gerne|sicher|na\s+klar|bitte|doch|yes|yeah|yep|sure|ok(?:ay)?|s[ií]|vale|venga)\b[\s,.;:!-]*)+/i;
            const CONFIRM_MS = 8000;   // no answer within this window → treat as a false fire → back to sleep

            function clearConfirm() { awaitingConfirm = false; if (confirmTimer) { clearTimeout(confirmTimer); confirmTimer = null; } }

            // Ask before acting on a lock-wake. Reuse the proven turn-listen plumbing (convo + awaitingQuery so
            // speakReply's resume keeps the ear open afterwards) and arm a silence timeout so an empty-room
            // false fire falls back to sleep on its own.
            function askConfirm() {
                disarmIdle();                                        // the confirm gate runs its own silence timeout
                awaitingConfirm = true; convo = true; awaitingQuery = true;
                ear.setConvo(true); ear.setAwaiting(true);
                if (confirmTimer) clearTimeout(confirmTimer);
                confirmTimer = setTimeout(confirmTimeout, CONFIRM_MS);
                if (window.speakReply) window.speakReply(say('offerHelp'));   // „Soll ich helfen?"
            }
            // Yes: leave the confirm gate but do NOT act on this first (possibly partial) final. The Android
            // WebView delivers one phrase as GROWING finals, so route the wish through the ear's cumulative-
            // finals debounce (onRawFinal returns false → queueQuery → onUtterance), where `confirmAccepting`
            // decides: a pure „ja" → prompt + listen for the real wish; „ja <wish>" / a direct wish → submit
            // just the wish. This keeps „ja bitte, lies mir die Mail" from being truncated to „ja" on the Pixel.
            function beginAccept() {
                clearConfirm(); paused = false; convo = true; awaitingQuery = true; confirmAccepting = true;
                ear.setConvo(true); ear.setAwaiting(true);
            }
            // No (spoken=true → a brief „Okay." then dormant) or silence (spoken=false → straight to dormant).
            function declineHelp(spoken) {
                clearConfirm();
                convo = false; awaitingQuery = false; paused = true;
                ear.setConvo(false); ear.setAwaiting(false);
                if (spoken && window.speakReply) window.speakReply(say('okay'));   // resume() then parks her dormant
                else enterPause();                                                // silent (timeout) → dormant now
                goToSleepNative();   // best-effort: drop back behind the lockscreen so Vosk reclaims the mic at once
            }
            function confirmTimeout() { confirmTimer = null; if (awaitingConfirm) declineHelp(false); }

            // Best-effort native re-background so Vosk reclaims the mic immediately on a decline (instead of
            // waiting for the screen to time out). No-op until a native goToSleep()/App plugin exists — the web
            // path still sleeps correctly: she stays dormant in the foreground (Web-SR keeps wake-listening)
            // until the screen locks, then the native lifecycle (onPause) hands the mic back to Vosk.
            function goToSleepNative() {
                try {
                    const P = window.Capacitor && window.Capacitor.Plugins;
                    if (P && P.SolitaVoice && P.SolitaVoice.goToSleep) P.SolitaVoice.goToSleep();
                    else if (P && P.App && P.App.minimizeApp) P.App.minimizeApp();
                } catch (e) { }
            }

            // The wake handler: a trigger word was detected (ambient/dormant or native). The ear already
            // cleared its own dormant flag; clear the adapter's local mirror too (matches old lines 186/207).
            //   native (background/locked) → ask „Soll ich helfen?" first (she may have mis-fired on "solide").
            //   ambient (Doc is at the phone) → open the conversation directly, exactly as the old fire() did.
            function onWake(residual, meta) {
                paused = false;
                if (meta && meta.native) { askConfirm(); return; }
                fire(residual);
            }

            // Live interim mirror (ear emits only while listening && !dormant && !suspended). Skip UI-mode here
            // (matches the old `!window.__uiMode` gate) so dictated UI wishes don't echo into the input.
            function onInterim(t) {
                // While awaiting the lock-wake yes/no, a partial means Doc is speaking → push the silence
                // timeout out so a slow answer („ja bitte, lies mir …") isn't cut off and sent back to sleep.
                if (awaitingConfirm && confirmTimer) { clearTimeout(confirmTimer); confirmTimer = setTimeout(confirmTimeout, 6000); }
                if (convo && !awaitingConfirm) armIdle();             // Doc is talking → push the nap out
                if (!window.__uiMode) { if (input) { input.value = t; input.dispatchEvent(new Event('input')); } }
            }

            // Settled debounced cumulative-finals output. Resolve against the latest text shown in the input
            // (the "longest shown" wins, exactly as the old queueQuery did) and submit.
            function onUtterance(q) {
                let out = ((input && input.value) || q).trim();
                const low = out.toLowerCase();                       // drop a leading wake word if it slipped in
                for (const w of TRIGGERS) { if (low.startsWith(w)) { out = out.slice(w.length).replace(/^[\s,.:!?-]+/, '').trim(); break; } }
                if (confirmAccepting) {                              // this settled phrase is the answer to „Soll ich helfen?"
                    confirmAccepting = false;
                    const wish = out.replace(AFFIRM_LEAD, '').trim();
                    if (!wish) { fire(''); return; }                 // pure „ja" → speak „Ja?" and listen for the real wish
                    out = wish;                                      // „ja <wish>" → submit only the wish
                }
                if (!out) return;
                // Cost guard (Doc: 5€ soll halten): the open mic sometimes transcribes ambient noise as a pure
                // non-lexical sound (laughter / hesitation). Sending that pays for a full Claude turn on nothing.
                // Deliberately NOT dropping real short words like „ja"/„ok"/„nein" — those can be genuine answers.
                if (/^(?:h+m+|m+h+m*|ä+h*m*|öh+|haha(?:ha)*|hihi|haa+)[\s.!?]*$/i.test(out)) return;
                disarmIdle();                                        // query going out → resume() re-arms after the reply
                awaitingQuery = false; convo = true;
                ear.setConvo(true); ear.setAwaiting(false);
                if (input) { input.value = out; input.dispatchEvent(new Event('input')); }
                if (typeof sendMessage === 'function') sendMessage();
            }

            // THE SEAM: decode every raw trimmed final BEFORE the ear's generic wake/debounce logic. Returns
            // true when this final was a Solita command (ear then does nothing further). This reproduces the
            // live onResult if-ladder (old lines 178-197) IN ORDER; the `return false` cases fall through to
            // the ear's generic fallback (dormant-wake / awaitingQuery-debounce / extractQuery→fire).
            function onRawFinal(txt) {
                if (awaitingConfirm) {                                 // lock-wake gate: settle yes/no FIRST
                    if (NEG_CONFIRM.test(txt)) { declineHelp(true); return true; }   // „nein" → „Okay." → back to sleep
                    beginAccept(); return false;                                     // yes → debounce the (growing) wish
                }
                if (ear.isPaused()) {                                  // dormant: "Solita" wakes her …
                    // … but spoken slash-commands ("slash ui" / "slash list" …) still fire — quick remote, stays asleep.
                    if (/^(?:slash|splash|flash)\s+(?:ui|u\s*i|list|liste|clear|de|en|es|deutsch|english|spanish|espa[nñ]ol)\b/i.test(txt)) {
                        if (input) { input.value = txt; input.dispatchEvent(new Event('input')); }
                        if (typeof sendMessage === 'function') setTimeout(sendMessage, 200);
                        return true;                                   // run it, stay in slumber
                    }
                    return false;                                      // non-slash dormant → ear does extractQuery→wake
                }
                if (window.__uiMode) { handleUiVoice(txt); return true; }   // UI mode: accumulate + go/pause
                if (input) input.value = '';                           // final arrived → clear the live interim text
                const addressed = convo || awaitingQuery || ear.matchTrigger(txt) !== null;
                if (addressed && PAUSE.test(txt)) { enterPause(); return true; }     // "Pause" → dormant until "Solita"
                if (addressed && LOGOUT.test(txt)) { doVoiceLogout(); return true; } // "Solita, log mich aus" → action, not chat
                if (convo && FAREWELL.test(txt)) { endConvo(); return true; } // "tschüss" → hang up the thread
                return false;   // plain question: ear handles (awaitingQuery→queueQuery, else extractQuery→fire)
            }

            // Turn the whole voice line OFF (used on logout). Persists off so a fresh login starts quiet.
            window.solitaStopVoice = function () {
                // Logout stops the live mic while logged out — but NEVER persists "off" (Doc: ear always on),
                // so it resumes on the next login (solitaStartVoice) or page load.
                ear.cancelPending();
                disarmIdle();
                wakeOn = false;
                convo = false; awaitingQuery = false; paused = false; reflect();
                ear.setEnabled(false); ear.setConvo(false); ear.setAwaiting(false);
                if (window.solitaPhase) solitaPhase('idle');
                ear.stop();
                stopNativeWake();   // logout kills the always-on Vosk service too (resumes on next login)
            };

            // Turn the voice line ON — called from the auth flow on every successful login so the ear is always
            // on once you're in (also restores it after a logout→login without a reload). Resumes in the
            // SLUMBER resting state (pill visible, waiting for "Solita").
            window.solitaStartVoice = function () {
                wakeOn = true; convo = false; awaitingQuery = false; paused = true; reflect();
                ear.setEnabled(true); ear.setConvo(false); ear.setAwaiting(false); ear.pause();
                if (window.solitaPhase) solitaPhase('dormant');
                startNativeWake();   // light the always-on Vosk wake service NOW (foreground = Android-14-legal)
                freeMicForWebSR();   // Activity already resumed at login → onResume won't fire; stop Vosk by hand
                ear.start();         // …and the Web-SR foreground ear (binds the native wake-listener too)
            };

            // Programmatic wake (typed /wake, or a future button): make sure the ear is on, then open the
            // conversation exactly like hearing "Solita" — she answers „Ja?" and listens for the next query.
            // Especially useful when the mic is OFF (you can't SAY the wake word) → type /wake to bring her up.
            window.solitaWake = function () {
                if (!wakeOn) window.solitaStartVoice();   // ear off → turn it on (→ dormant) first
                paused = false;
                onWake('', {});                           // ambient wake path → fire('') → „Ja?" + listen
            };

            // Like solitaWake, but she opens with a SPECIFIC spoken line instead of a random „Ja?" ack, then
            // listens for the wish exactly as after a normal wake. Used by the /spass typed command (Doc's joke ack).
            // `line` may be a string (single utterance) or an array of segments spoken with a 2 s beat between
            // them (Web-Speech can't do an inline pause, so we chain segments + a timed gap).
            window.solitaWakeWith = function (line) {
                if (!wakeOn) window.solitaStartVoice();   // ear off → turn it on (→ dormant) first
                paused = false;
                disarmIdle();
                convo = true; awaitingQuery = true;
                ear.setConvo(true); ear.setAwaiting(true);
                const parts = Array.isArray(line) ? line.slice() : [line];
                (function speakNext() {
                    if (!parts.length || !window.speakReply) return;
                    window.speakReply(parts.shift());
                    if (!parts.length) return;
                    const wait = setInterval(function () {        // wait out this segment, then a 2 s beat, then the next
                        if (!window.__solitaSpeaking) { clearInterval(wait); setTimeout(speakNext, 2000); }
                    }, 150);
                })();
            };

            // Programmatic pause (typed /pause): drop her into the quiet SLUMBER (dormant) right away, exactly
            // like a spoken "Pause" — she ignores everything until she hears "Solita" (or /wake) again.
            window.solitaPause = function () {
                if (!wakeOn) return;   // ear already off → nothing to pause
                enterPause();
            };

            // Restart the recognition so a language switch takes effect at once (a fresh rec reads solitaSttLang()).
            window.solitaRestartVoice = function () {
                if (!wakeOn) return;
                ear.restart();
            };

            wakeBtn.addEventListener('click', function () {
                wakeOn = !wakeOn; localStorage.setItem(WAKE_KEY, wakeOn ? '1' : '0'); reflect();
                if (window.solitaSyncSettings) window.solitaSyncSettings();   // sync wake pref cross-device
                convo = false; awaitingQuery = false;                 // toggling the line resets the thread
                ear.setConvo(false); ear.setAwaiting(false);
                if (wakeOn) { paused = true; ear.setEnabled(true); ear.pause(); if (window.solitaPhase) solitaPhase('dormant'); startNativeWake(); freeMicForWebSR(); ear.start(); }   // ear on → SLUMBER (waiting for "Solita")
                else { ear.cancelPending(); paused = false; ear.setEnabled(false); if (window.solitaPhase) solitaPhase('idle'); ear.stop(); stopNativeWake(); }
            });

            // Typed activity in an open conversation also defers the nap (Doc may type instead of speak).
            if (input) input.addEventListener('keydown', function () { if (convo && !window.__uiMode && !awaitingConfirm) armIdle(); });

            // On load, start the ear once auth has settled — but only if already logged in (overlay hidden,
            // e.g. local auto-login). On production the overlay is still up here; the ear then starts on login
            // via window.solitaStartVoice. (Ear always on, just not before auth — so the mic stays cold at the
            // password screen.)
            setTimeout(function () {
                const ov = document.getElementById('cyber-auth-overlay');
                if (ov && ov.classList.contains('visible')) return;     // not logged in yet → wait for login
                paused = true; ear.pause(); if (window.solitaPhase) solitaPhase('dormant'); startNativeWake(); freeMicForWebSR(); ear.start();
            }, 600);

            // Option A (Doc 2026-06-16): locking the screen sends Solita into the quiet SLUMBER (dormant) — any
            // active conversation ends and the half-asleep pill shows — while the native Vosk keeps wake-listening
            // in the lock (always-on preserved; she still wakes on "Solita"). NATIVE app only: a browser tab-switch
            // must NOT pause her, so this is gated on the Vosk plugin being present.
            if (NATIVE) {
                document.addEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'hidden' && wakeOn && !paused) enterPause();
                });
            }
        })();
