        (function () {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            const TTS_KEY = 'solita_tts';
            let ttsOn = localStorage.getItem(TTS_KEY) !== '0';   // default: read aloud ON
            const ttsBtn = document.getElementById('ttsBtn');
            const micBtn = document.getElementById('micBtn');
            const input = document.getElementById('messageInput');

            function reflectTts() { if (ttsBtn) ttsBtn.classList.toggle('active', ttsOn); }
            reflectTts();

            // Pick a GOOD German voice — the browser default is often the robotic one. Prefer Chrome's
            // natural "Google Deutsch", then named female macOS voices (Solita's persona), then any German.
            // getVoices() loads async, so also re-pick on 'voiceschanged'. (Same approach as the glocken lab.)
            let chosenVoice = null;
            const VOICE_KEY = 'solita_voice';   // browser-voice name (fallback path only)
            const GVOICE_KEY = 'solita_gvoice'; // chosen Google Cloud TTS voice (PRIMARY, persists)
            const TTS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
            function pickVoice() {
                if (!('speechSynthesis' in window)) return;
                const voices = window.speechSynthesis.getVoices();
                if (!voices.length) return;
                const saved = localStorage.getItem(VOICE_KEY);
                const chosen = saved ? voices.find(v => v.name === saved) : null;
                const google = voices.find(v => /^de/i.test(v.lang) && /Google/i.test(v.name));
                const femaleDE = voices.find(v => /^de(-DE)?/i.test(v.lang) && /Anna|Petra|Helena|Katja|Hedda/i.test(v.name));
                const anyDE = voices.find(v => /^de(-DE)?/i.test(v.lang));
                chosenVoice = chosen || google || femaleDE || anyDE || voices[0];   // saved pick wins
            }
            pickVoice();
            if ('speechSynthesis' in window) window.speechSynthesis.addEventListener('voiceschanged', pickVoice);

            // Voice picker (hamburger panel): Google Cloud TTS female German voices (synthesized by the tts
            // edge fn). Picking one previews it live + persists. Chirp3-HD/Studio addable once IDs confirmed.
            (function () {
                const sel = document.getElementById('hh-voice');
                if (!sel) return;
                // Female de-DE voices. Chirp3-HD = Google's newest/warmest ("Samantha"-näher), several truly
                // distinct ones — but they need the tts-fn pitch-fix DEPLOYED (else they 400 → browser fallback).
                // Neural2/Wavenet/Studio work today; the plain Neural2/Wavenet females are largely aliased to one
                // speaker, so only one of each + Studio is offered.
                // All verified DISTINCT (probed post-deploy, different md5). Chirp3-HD = warm "Samantha"-Liga;
                // Wavenet-C dropped (byte-identical to Neural2-A in Google's de-DE catalog).
                const VOICES = [
                    ['de-DE-Studio-C', 'Studio C · weiblich'],
                    ['de-DE-Chirp3-HD-Aoede', 'Aoede · Chirp3-HD (warm)'],
                    ['de-DE-Chirp3-HD-Kore', 'Kore · Chirp3-HD (warm)'],
                    ['de-DE-Chirp3-HD-Leda', 'Leda · Chirp3-HD (warm)'],
                    ['de-DE-Neural2-A', 'Neural2 A · weiblich'],
                ];
                const saved = localStorage.getItem(GVOICE_KEY) || 'de-DE-Studio-C';
                VOICES.forEach(function (v) {
                    const o = document.createElement('option');
                    o.value = v[0]; o.textContent = v[1];
                    if (v[0] === saved) o.selected = true;
                    sel.appendChild(o);
                });
                sel.addEventListener('change', function () {
                    localStorage.setItem(GVOICE_KEY, sel.value);
                    if (window.solitaSyncSettings) window.solitaSyncSettings();   // sync voice pref cross-device
                    if (window.DebugWindow) DebugWindow.log('🔊 Stimme gewählt: ' + sel.value);
                    if (window.speakReply) window.speakReply('Hallo, ich bin Solita. So klinge ich.');   // live preview
                });
            })();

            // Read the assistant's reply aloud (called from sendMessage). Strip light markdown first.
            window.speakReply = function (text) {
                if (!ttsOn || !text) { window.__solitaSpeaking = false; return; }
                try {
                    // Code is SHOWN, never read aloud (Doc 2026-06-23). Drop fenced ```code``` from the spoken
                    // text; if there was any, append a short hint instead of reading the listing.
                    const hadCode = /```[\s\S]*?```/.test(String(text));
                    let clean = String(text).replace(/```[\s\S]*?```/g, ' ')
                        .replace(/[\p{Extended_Pictographic}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}\uFE0F\u200D]/gu, '') // strip smileys/emoji — don't read them aloud (Doc)
                        .replace(/\$\$[\s\S]*?\$\$/g, '')   // LaTeX display math — shown on screen, NOT read aloud (Doc 2026-06-22)
                        .replace(/\$[^$\n]*?\$/g, '')        // LaTeX inline math — shown on screen, NOT read aloud
                        .replace(/[*_`#>]/g, '')
                        .replace(/\bSolita\b/gi, 'Solíta')   // TTS: say her name so-LÍ-ta (stress 2nd syllable), not SÓlita
                        .replace(/\bUI\b/g, 'Ju Ei')         // TTS: say "UI" the English way (you-eye), not German "oo-ee"
                        .replace(/\bKI\b/g, 'Kah Ih')        // TTS: spell "KI" as the letters K-I (Kah-Ih), not the word „kih"
                        .replace(/\s+/g, ' ').trim();
                    if (hadCode) clean = (clean ? clean + ' ' : '') + 'Wenn du Fragen zum Code hast, gern!';
                    // PRIMARY: Google Cloud TTS via the tts edge fn (warm Neural2 voice) → play MP3.
                    window.__solitaSpeaking = true;     // set SYNCHRONOUSLY → the wake loop polls this
                    try { if (window.__solitaAudio) { window.__solitaAudio.pause(); window.__solitaAudio = null; } } catch (e) { }
                    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { }
                    const gvoice = (window.solitaTtsVoice ? window.solitaTtsVoice() : (localStorage.getItem(GVOICE_KEY) || 'de-DE-Studio-C'));
                    const gLang = (window.solitaTtsLangCode ? window.solitaTtsLangCode() : 'de-DE');
                    fetch(TTS_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON },
                        body: JSON.stringify({ text: clean, voice: gvoice, languageCode: gLang, speakingRate: 1.0 })
                    }).then(function (r) { return r.json(); }).then(function (j) {
                        if (!j || !j.audioContent) throw new Error((j && j.error && (j.error.message || JSON.stringify(j.error))) || 'no audio');
                        try { var _m = 'TTS cloud OK: ' + gvoice + ' · ' + (j.audioContent.length) + ' B(b64)'; if (window.DebugWindow) DebugWindow.log(_m); else console.log('[solita] ' + _m); } catch (e) { }
                        const audio = new Audio('data:audio/mp3;base64,' + j.audioContent);
                        window.__solitaAudio = audio;
                        audio.onended = function () { window.__solitaSpeaking = false; window.__solitaAudio = null; };
                        audio.onerror = function () { window.__solitaSpeaking = false; window.__solitaAudio = null; };
                        audio.play().catch(function (e) { window.__solitaSpeaking = false; try { console.warn('[solita] audio.play() blockiert:', e); } catch (_) { } });
                    }).catch(function (e) { try { var _f = 'TTS FALLBACK → Browser-Stimme (Cloud fehlgeschlagen): ' + ((e && e.message) || e); if (window.DebugWindow) DebugWindow.log(_f); else console.warn('[solita] ' + _f); } catch (_) { } browserFallback(clean); });
                } catch (e) { window.__solitaSpeaking = false; }
            };
            // FALLBACK voice (browser speechSynthesis) — only when the Cloud TTS fn can't be reached.
            function browserFallback(clean) {
                if (!('speechSynthesis' in window)) { window.__solitaSpeaking = false; return; }
                try {
                    const u = new SpeechSynthesisUtterance(clean);
                    u.lang = (window.solitaTtsLangCode ? window.solitaTtsLangCode() : 'de-DE'); if (!chosenVoice) pickVoice(); if (chosenVoice && window.solitaLang === 'de') u.voice = chosenVoice;
                    u.rate = 1.0; u.pitch = 1.0;
                    u.onend = function () { window.__solitaSpeaking = false; };
                    u.onerror = function () { window.__solitaSpeaking = false; };
                    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
                } catch (e) { window.__solitaSpeaking = false; }
            }

            // Central "shut up NOW": kill the Cloud-TTS audio AND the browser speechSynthesis. Clearing
            // __solitaSpeaking lets the wake loop (which polls it) resume listening ~300 ms later.
            window.solitaStopSpeaking = function () {
                try { if (window.__solitaAudio) { window.__solitaAudio.pause(); window.__solitaAudio = null; } } catch (e) { }
                try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { }
                window.__solitaSpeaking = false;
            };

            // Tap the phase pill while Solita talks → stop her instantly (Doc 2026-06-22). Mid-speech voice
            // can't work (mic is muted against self-hearing), so the pill is the reliable barge-in.
            const phasePill = document.getElementById('solita-phase');
            if (phasePill) phasePill.addEventListener('click', () => {
                if (window.solitaStopAll) window.solitaStopAll(); else window.solitaStopSpeaking();
            });

            if (ttsBtn) ttsBtn.addEventListener('click', () => {
                ttsOn = !ttsOn; localStorage.setItem(TTS_KEY, ttsOn ? '1' : '0'); reflectTts();
                if (window.solitaSyncSettings) window.solitaSyncSettings();   // sync pref cross-device
                if (!ttsOn) { window.solitaStopSpeaking(); }
            });

            // Dictation: tap mic → listen once (de-DE) → fill the input and send hands-free.
            let rec = null, listening = false;
            if (micBtn) {
                if (!SR) { micBtn.style.display = 'none'; }      // e.g. iOS Safari: no SpeechRecognition
                else micBtn.addEventListener('click', () => {
                    if (listening) { try { rec.stop(); } catch (e) { } return; }
                    try {
                        rec = new SR(); rec.lang = (window.solitaSttLang ? window.solitaSttLang() : 'de-DE'); rec.interimResults = true; rec.maxAlternatives = 1;
                        listening = true; micBtn.classList.add('rec');
                        try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { } // don't talk over you
                        // Live transcript flows into the input line as you speak…
                        rec.onresult = (e) => {
                            let txt = '';
                            for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
                            if (input) { input.value = txt; input.dispatchEvent(new Event('input')); }
                        };
                        rec.onend = () => {
                            listening = false; micBtn.classList.remove('rec');
                            // …then a short beat so you SEE it in the line, and only THEN submit.
                            if (input && input.value.trim() && typeof sendMessage === 'function') setTimeout(sendMessage, 700);
                        };
                        rec.onerror = () => { listening = false; micBtn.classList.remove('rec'); };
                        rec.start();
                    } catch (e) { listening = false; micBtn.classList.remove('rec'); }
                });
            }
        })();
