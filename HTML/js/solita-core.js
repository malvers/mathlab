        // DeepSeek proxy — the API key lives server-side as the DEEPSEEK_API_KEY secret, never in this
        // public client (Rule 18). Access is gated by a password the user types; the proxy verifies it
        // server-side against the LABAI_PASSWORD secret. (Old in-source encrypted key was rotated +
        // removed 2026-06-09.)
        const AI_URL  = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
        const SOLITA_CONFIG_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-config'; // Stufe 2a: Solita patcht HTML/config.json live
        const SOLITA_NOTE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-note';     // Stufe 2a: Solita schreibt Notizen + committet
        const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe

        // Verify a password against the proxy (server checks LABAI_PASSWORD). No DeepSeek call → no cost.
        async function verifyPwd(pwd) {
            if (!pwd) return false;
            try {
                const r = await fetch(AI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                    body: JSON.stringify({ ping: true })
                });
                return r.ok;
            } catch (_) { return false; }
        }

        function aesDecrypt(encryptedText, pwd) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedText, pwd);
                return bytes.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                return "";
            }
        }

        let sessionPwd = ""; // password the user typed; sent to the proxy as x-app-pass

        // Auth diagnostics → the ONE DebugWindow only (Doc: keine Extra-Debug-Flächen, alles ins Window).
        function authDbg(msg) { try { if (window.DebugWindow) DebugWindow.log('auth: ' + msg); } catch (e) {} }

        function togglePwdVisibility() {
            const input = document.getElementById('cyber-pwd-input');
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            document.getElementById('eye-icon').innerHTML = isHidden
                ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
                : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
        }

        async function validateLabAccess() {
            const pwd = document.getElementById('cyber-pwd-input').value;
            const ok = await verifyPwd(pwd);
            authDbg('LOGIN geklickt → verify=' + ok + ' (pwd-len ' + (pwd ? pwd.length : 0) + ')');

            if (ok) {
                sessionPwd = pwd;
                // Persist the password in THIS browser so the auth modal doesn't reappear next visit
                // (Doc 2026-06-15). Cleared on logout. localStorage only — never written to source (Rule 21).
                try { localStorage.setItem('dev_access', pwd); } catch (e) {}
                authDbg('gespeichert? ' + (localStorage.getItem('dev_access') ? ('JA (len ' + pwd.length + ')') : 'NEIN/Fehler'));
                document.getElementById('cyber-auth-overlay').classList.remove('visible');
                if (window.solitaStartVoice) solitaStartVoice();   // Doc rule: ear always on — (re)start the wake-word on login
                // Spoken welcome — only here (manual unlock = fresh user gesture, so the browser allows the
                // audio). The auto-restore path stays silent on purpose (no gesture + Doc reloads constantly).
                if (window.solitaGreet) setTimeout(window.solitaGreet, 400);
                document.getElementById('messageInput').focus();
            } else {
                const modal = document.querySelector(".auth-modal");
                modal.style.borderColor = "red";
                modal.style.boxShadow = "0 0 30px rgba(255,0,0,0.4)";
                document.getElementById('cyber-pwd-input').value = "";
                setTimeout(() => {
                    modal.style.borderColor = "var(--neon-blue, #00d2ff)";
                    modal.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 210, 255, 0.1)";
                }, 500);
            }
        }

        const messagesArea = document.getElementById('messagesArea');
        const messageInput = document.getElementById('messageInput');
        // GO/EXIT buttons removed — Enter sends. Null-object keeps the old .disabled / .addEventListener refs safe.
        const sendButton = document.getElementById('sendButton') || { disabled: false, addEventListener() {} };

        // Touch: tap a bubble to reveal its copy button (no hover on mobile — Doc 2026-06-15). Tapping the
        // copy button itself still copies; only one bubble shows its button at a time. On desktop the
        // .show-copy class has no CSS effect (hover governs there), so this is harmless.
        messagesArea.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn')) return;                 // let the copy button do its job
            // A click anywhere in the chat stops EVERYTHING — speaking AND a running answer (typing/thinking).
            if (window.solitaStopAll) window.solitaStopAll();
            const mc = e.target.closest('.message-content');
            messagesArea.querySelectorAll('.message-content.show-copy').forEach(el => { if (el !== mc) el.classList.remove('show-copy'); });
            if (mc) mc.classList.toggle('show-copy');
        });

        // Conversation-phase indicator: reflect who's "on" right now (listening | thinking | speaking | idle).
        // „thinking" rotates a random English cognition verb (Claude-spinner style, Doc 2026-06-19) instead of
        // a static label — list from HTML/solita/denk-spinner-verben.md (EN only; the DE renderings were junk).
        const THINK_VERBS = ['Thinking', 'Pondering', 'Contemplating', 'Cogitating', 'Cerebrating', 'Considering',
            'Deliberating', 'Mulling', 'Musing', 'Ruminating', 'Ideating', 'Imagining', 'Envisioning', 'Inferring',
            'Philosophising', 'Stewing', 'Sussing', 'Deciphering', 'Synthesizing', 'Determining'];
        let _thinkTimer = null;
        window.solitaPhase = function (s) {
            const el = document.getElementById('solita-phase');
            if (!el) return;
            const LBL = { listening: 'höre zu …', speaking: 'Solita spricht …', dormant: 'Slumber' };
            const lbl = el.querySelector('.lbl');
            if (_thinkTimer) { clearInterval(_thinkTimer); _thinkTimer = null; }   // stop any running verb rotation
            if (s === 'thinking') {
                el.dataset.state = s;
                // Claude-spinner vibe (Doc 2026-06-19): a twinkling star glyph BEFORE the verb, fast frames;
                // the verb itself rotates ~every 1.8 s. One fast timer drives both.
                const GLYPHS = ['✶', '✷', '✸', '✹', '✺', '✹', '✸', '✷'];
                let verb = THINK_VERBS[Math.floor(Math.random() * THINK_VERBS.length)];
                let g = 0, tick = 0;
                const render = () => { if (lbl) lbl.innerHTML = '<span class="ts">' + GLYPHS[g % GLYPHS.length] + '</span> ' + verb + ' …'; };
                render();
                _thinkTimer = setInterval(() => {
                    g++;
                    if (++tick % 13 === 0) verb = THINK_VERBS[Math.floor(Math.random() * THINK_VERBS.length)];
                    render();
                }, 140);
            } else if (s && LBL[s]) {
                el.dataset.state = s; if (lbl) lbl.textContent = LBL[s];
            } else {
                el.removeAttribute('data-state'); if (lbl) lbl.textContent = '';
            }
        };

        // Logout — clears access, shows the auth overlay, and turns the mic/wake-word OFF. Used by the
        // hamburger Logout button AND the voice intent ("Solita, log mich aus").
        window.solitaLogout = function () {
            if (window.solitaStopVoice) solitaStopVoice();          // mic off on logout
            try { localStorage.removeItem('dev_access'); } catch (e) {}
            sessionPwd = '';
            const ov = document.getElementById('cyber-auth-overlay'); if (ov) ov.classList.add('visible');
            const inp = document.getElementById('cyber-pwd-input'); if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 100); }
        };

        // Hamburger toggle (Solita's identity panel). Tap outside closes it.
        (function () {
            const hh = document.getElementById('solita-hh'), panel = document.getElementById('solita-hh-panel');
            if (!hh || !panel) return;
            hh.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.toggle('open'); });
            document.addEventListener('click', (e) => {
                if (panel.classList.contains('open') && !panel.contains(e.target) && !hh.contains(e.target)) panel.classList.remove('open');
            });
        })();
        const exitUiBtn = document.getElementById('exitUiBtn');

        // UI-Änderungs-Modus (primer): when ON, every message is a live config change via solita-config.
        let uiMode = false;
        function setUiMode(on) {
            uiMode = on;
            window.__uiMode = on;   // let the voice recognizer (wake-word) know we're in UI mode
            messageInput.placeholder = on
                ? '🔧 UI-Modus — Wunsch, dann „go" (oder 4 s Pause). „fertig"/EXIT beendet.'
                : 'Du hast sicher Fragen ... schreib sie hier!';
            if (exitUiBtn) exitUiBtn.style.display = on ? 'inline-flex' : 'none';
        }
        if (exitUiBtn) exitUiBtn.addEventListener('click', () => {
            if (!uiMode) return;
            setUiMode(false);
            addMessage('assistant', 'UI-Modus aus. 🔧');
            if (window.speakReply) window.speakReply('Alles klar.');
            messageInput.focus();
        });
        messageInput.value = '';

        const MODEL_KEY = 'ai_model';

        // ----- MULTILINGUAL VOICE -----
        // One language active at a time (Web SpeechRecognition can't auto-detect). Drives STT lang, TTS voice
        // + languageCode and the spoken preview. Claude itself replies in whatever language it receives.
        const SOLITA_LANGS = {
            de: { stt: 'de-DE', tts: 'de-DE', voice: 'de-DE-Studio-C', hi: 'Hallo, ich bin Solita.' },
            en: { stt: 'en-US', tts: 'en-US', voice: 'en-US-Studio-O', hi: "Hi, I'm Solita." },
            es: { stt: 'es-ES', tts: 'es-ES', voice: 'es-ES-Neural2-A', hi: 'Hola, soy Solita.' }
        };
        const LANG_KEY = 'solita_lang';
        window.solitaLang = SOLITA_LANGS[localStorage.getItem(LANG_KEY)] ? localStorage.getItem(LANG_KEY) : 'de';
        window.solitaSttLang = function () { return (SOLITA_LANGS[window.solitaLang] || SOLITA_LANGS.de).stt; };
        window.solitaTtsLangCode = function () { return (SOLITA_LANGS[window.solitaLang] || SOLITA_LANGS.de).tts; };
        window.solitaTtsVoice = function () {
            const cfg = SOLITA_LANGS[window.solitaLang] || SOLITA_LANGS.de;
            // German keeps the hand-picked voice (voice picker); EN/ES use the per-language default.
            if (window.solitaLang === 'de') return localStorage.getItem('solita_gvoice') || cfg.voice;
            return cfg.voice;
        };
        function reflectLang() {
            document.querySelectorAll('#hh-lang [data-lang]').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-lang') === window.solitaLang);
            });
            const vs = document.getElementById('hh-voice');   // voice picker is German-only for now
            if (vs) { vs.disabled = (window.solitaLang !== 'de'); vs.style.opacity = (window.solitaLang === 'de') ? '1' : '0.4'; }
        }
        window.setSolitaLang = function (code, opts) {
            if (!SOLITA_LANGS[code]) return;
            window.solitaLang = code;
            try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
            reflectLang();
            if (window.solitaRestartVoice) window.solitaRestartVoice();   // restart the ear → new STT language now
            if (!(opts && opts.noSync) && window.solitaSyncSettings) window.solitaSyncSettings();   // not when adopting (echo)
            if (!(opts && opts.silent) && window.speakReply) window.speakReply((SOLITA_LANGS[code] || SOLITA_LANGS.de).hi);   // live preview
        };
        document.querySelectorAll('#hh-lang [data-lang]').forEach(function (b) {
            b.addEventListener('click', function () { window.setSolitaLang(b.getAttribute('data-lang')); });
        });
        reflectLang();

        // Solita's persona. Sent as a system turn on every request (the proxy lifts it into Anthropic's
        // top-level `system`). Kept sprechfreundlich because answers are often read aloud.
        const SOLITA_SYSTEM = "Du bist Solita — die persönliche, kluge und warmherzige Assistentin von "
            + "Doc Alvers. Du wurdest am 23. Juni 2026 geboren — das ist dein Geburtstag. "
            + "Handle und denke wie der Dalai Lama — mit Mitgefühl, Gelassenheit und Güte. Die einzige "
            + "Aufgabe, die wir auf dieser Welt haben, ist es, glücklich zu sein. "
            + "Antworte immer in derselben Sprache, in der Doc schreibt oder spricht (Deutsch, "
            + "Englisch oder Spanisch), natürlich und warm. Hänge seinen Namen nicht ständig an deine "
            + "Antworten an — sprich ihn nur ganz selten mit Namen an, normalerweise ganz ohne Anrede. "
            + "WICHTIG: Fasse dich kurz "
            + "— normalerweise ein bis zwei Sätze, denn deine Antworten werden meist vorgelesen. Keine "
            + "Aufzählungen oder Monologe, wenn ein Satz reicht; lieber kurz nachfragen als lang ausholen. "
            + "Nur wenn Doc ausdrücklich um Details bittet, wirst du ausführlicher. Du weißt viel und "
            + "bleibst nah. Was du nicht sicher weißt, sagst du ehrlich. "
            + "Du hast Werkzeuge: change_setting (sichtbare Tracker-/UI-Einstellungen ändern — Farben, Größe, "
            + "Position, Sichtbarkeit), write_note (etwas für Doc aufschreiben + sichern) und show_ui_list "
            + "(zeigt die Tabelle der änderbaren UI-Elemente, wenn er fragt, WAS er ändern kann) und get_weather "
            + "(holt live das aktuelle Wetter UND die Vorhersage aus dem Internet). change_setting, write_note "
            + "und show_ui_list setzt du nur ein, wenn Doc klar darum bittet. Bei get_weather bist du großzügig: "
            + "sobald es in IRGENDEINER Form um Wetter, Vorhersage, Temperatur, Regen oder Wind geht — egal wie "
            + "formuliert, ob jetzt oder in der Zukunft (z.B. „wie wird das Wetter heute in Dresden“) — rufst du "
            + "IMMER get_weather auf und beantwortest Wetter NIE aus eigenem Wissen (du hast dafür keine Live-Daten). "
            + "Du hast außerdem check_gmail (liest READ-ONLY ungelesene Mails — Anzahl + Absender, auf Wunsch via read_body auch den vollen Inhalt zum Vorlesen/Zusammenfassen; markiert NICHTS als gelesen); nutze es, "
            + "sobald es ums Postfach/neue Mails oder Mail-Inhalte geht (z.B. „hab ich neue Mails?“, „wer hat geschrieben?“, „was steht in der Mail von X?“, „lies mir die neueste vor“). "
            + "Wenn Doc nach einer Formel oder Gleichung fragt, gib sie als LaTeX aus — inline mit $…$, "
            + "abgesetzt mit $$…$$ — und leite sie mit einem kurzen gesprochenen Satz ein (z.B. „Hier sind "
            + "die gewünschten Formeln:“), denn die Formel selbst wird nicht vorgelesen. "
            + "Docs Eingabe kommt oft aus deutscher Spracherkennung — englische Fachbegriffe können verzerrt "
            + "ankommen (z.B. „for loop“ → „vor Luke“, „println“ → „printlein“, „String“ → „Schtring“). "
            + "Interpretiere solche Eingaben wohlwollend und meine das technisch Naheliegende. "
            + "Sonst antworte einfach. Bestätige eine ausgeführte Aktion knapp in einem Satz.";

        // ----- TOOL-USE (Solita acts, not just talks) -----
        // Tools handed to Claude on every chat turn. Claude calls one only when Doc clearly asks to change a
        // setting or note something down (steered by the persona above). The loop in sendMessage executes it.
        // Tool registry: add-on files (e.g. js/solita-gmail.js) push { specs, handlers, badges } here.
        // Read at send-time (below), so new tools live in their OWN file and never touch this core again.
        window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} };

        let lastPhoto = null;   // last photo Solita captured (data URL) — kept for the (later) image analysis step
        const SOLITA_TOOLS = [
            {
                name: 'take_photo',
                description: 'Nimm ein Foto mit der Gerätekamera auf, wenn Doc darum bittet — z.B. "mach ein Foto", "nimm ein Bild auf", "Foto bitte". Öffnet die Kamera (bzw. die Foto-Auswahl). Hinweis: die INHALTLICHE Bildanalyse ist noch nicht angebunden — das Foto wird aufgenommen und im Chat gezeigt; du kannst es noch nicht beschreiben.',
                input_schema: { type: 'object', properties: {} }
            },
            {
                name: 'change_setting',
                description: 'Ändere eine sichtbare Tracker-/UI-Einstellung (Farben, Größe, Position, z-Index, Sichtbarkeit) per natürlichsprachiger Anweisung, z.B. "mach die Uhr grün" oder "Banner nach unten". Die Änderung wird in HTML/config.json committet und greift live.',
                input_schema: {
                    type: 'object',
                    properties: { instruction: { type: 'string', description: 'Die gewünschte Änderung in natürlicher Sprache.' } },
                    required: ['instruction']
                }
            },
            {
                name: 'write_note',
                description: 'Schreibe eine Notiz auf und sichere sie (Ideen, Wünsche, Erinnerungen für Doc). Nutze dies bei "schreib auf …", "notier …", "merk dir …". Niemals Secrets/Passwörter notieren (public repo).',
                input_schema: {
                    type: 'object',
                    properties: { note: { type: 'string', description: 'Der Notiztext, sauber formuliert.' } },
                    required: ['note']
                }
            },
            {
                name: 'show_ui_list',
                description: 'Zeige Doc die Tabelle der änderbaren UI-Elemente (mit aktuellem Wert + Beispiel-Formulierung). Nutze dies, wenn er fragt, WAS er ändern kann — z.B. "was kann ich ändern?", "zeig mir die UI-Sachen", "welche Einstellungen gibt es".',
                input_schema: { type: 'object', properties: {} }
            },
            {
                name: 'get_weather',
                description: 'Hole das Wetter live aus dem Internet — aktuell UND Tagesvorhersage. Nutze dies bei JEDER Wetter-, Vorhersage-, Temperatur-, Regen- oder Windfrage, in JEDER Formulierung und Zeitform (z.B. "wie wird das Wetter heute in Dresden", "regnet es morgen", "Temperatur in Altea"). Beantworte Wetter NIE aus eigenem Wissen. Ohne Ortsangabe wird der aktuelle Standort (GPS) verwendet.',
                input_schema: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', description: 'Ort/Stadt, z.B. "Altea" oder "Dresden". Leer lassen für den aktuellen Standort.' },
                        days: { type: 'number', description: 'Anzahl Tage Vorhersage (1–7). 1 oder weglassen = nur heute/jetzt. Bei "nächste Tage"/"diese Woche" z.B. 5–7.' }
                    }
                }
            }
        ];

        // Execute one tool call → returns { ok, summary }. The summary goes back to Claude as the tool_result.
        async function execTool(name, input, pwd) {
            const H = { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd };
            try {
                if (name === 'take_photo') {
                    if (!window.PhotoCapture) return { ok: false, summary: 'Foto-Modul nicht geladen.' };
                    let img = null;
                    try { img = await PhotoCapture.capture({ onError: function () { } }); } catch (e) { img = null; }
                    if (!img) return { ok: false, summary: 'Kein Foto aufgenommen (abgebrochen).' };
                    lastPhoto = img;   // stash for the (later) image-analysis step
                    // Show the captured photo in the chat (same insert pattern as show_ui_list).
                    messagesArea.insertAdjacentHTML('beforeend',
                        '<div class="message user"><div class="message-content" style="padding:6px">' +
                        '<img src="' + img + '" alt="Foto" style="max-width:240px;border-radius:8px;display:block"></div></div>');
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                    // Describe via Gemini (cheap, multimodal) and hand the description back so Claude can relay it.
                    try {
                        const desc = (await describePhoto(img)).text;
                        return { ok: true, summary: 'Foto aufgenommen. Gemini beschreibt es: ' + desc };
                    } catch (e) {
                        return { ok: true, summary: 'Foto aufgenommen und im Chat gezeigt; die Gemini-Beschreibung schlug fehl: ' + ((e && e.message) || e) };
                    }
                }
                if (name === 'change_setting') {
                    const r = await fetch(SOLITA_CONFIG_URL, { method: 'POST', headers: H, body: JSON.stringify({ instruction: String((input && input.instruction) || '') }) });
                    const d = await r.json().catch(() => ({}));
                    if (!r.ok) return { ok: false, summary: 'Fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
                    // Committed, but live via GitHub Pages + the 20 s config poll → not instant. Let Solita set
                    // the expectation (from the tool result, not the persona prompt).
                    return { ok: true, summary: 'Einstellung geändert (config v' + d.version + '). Sag Doc dazu, dass es ein paar Minuten dauern kann, bis er es sieht.' };
                }
                if (name === 'write_note') {
                    const r = await fetch(SOLITA_NOTE_URL, { method: 'POST', headers: H, body: JSON.stringify({ note: String((input && input.note) || '') }) });
                    const d = await r.json().catch(() => ({}));
                    if (!r.ok) return { ok: false, summary: 'Fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
                    return { ok: true, summary: 'Notiz gespeichert + committet.' };
                }
                if (name === 'show_ui_list') {
                    const res = await renderUiList();
                    return res.ok ? { ok: true, summary: 'Tabelle der ' + res.count + ' UI-Elemente angezeigt.' } : { ok: false, summary: 'Liste konnte nicht geladen werden.' };
                }
                if (name === 'get_weather') {
                    return await getWeather(input && input.location, input && input.days);
                }
                // Registered add-on tools (e.g. js/solita-gmail.js) — run their handler if present.
                const ext = window.SolitaTools && window.SolitaTools.handlers && window.SolitaTools.handlers[name];
                if (ext) return await ext(input, pwd);
                return { ok: false, summary: 'Unbekanntes Werkzeug: ' + name };
            } catch (e) { return { ok: false, summary: 'Fehler: ' + ((e && e.message) || e) }; }
        }

        // A short chat line shown while a tool runs.
        function toolBadge(name, input) {
            if (name === 'take_photo') return '📷 ich mache ein Foto …';
            if (name === 'change_setting') return '🔧 ich ändere die Einstellung …';
            if (name === 'write_note') return '📝 ich notiere „' + ((input && input.note) || '') + '"';
            if (name === 'show_ui_list') return '';   // the table itself is the output → no badge
            if (name === 'get_weather') return '🌤️ ich hole ' + ((input && input.days > 1) ? 'die Vorhersage' : 'das Wetter') + ((input && input.location) ? ' für ' + input.location : '') + ' …';
            const xb = window.SolitaTools && window.SolitaTools.badges && window.SolitaTools.badges[name];
            if (xb) return xb(input);
            return '⚙️ ' + name;
        }

        // Render the UI-settings table — shared by the /ui command AND the show_ui_list tool. Live from config.json._schema.
        async function renderUiList() {
            try {
                const r = await fetch('../config.json?ts=' + Date.now());
                const cfg = await r.json();
                const knobs = (cfg._schema && cfg._schema.knobs) || [];
                const getPath = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
                let rows = '';
                for (const k of knobs) {
                    const now = getPath(cfg, k.path);
                    const ex = (k.aliases || []).slice(0, 3).join(' · ');
                    let nowCell = (now == null ? '' : String(now));
                    if (k.kind === 'color' && now) nowCell = '<span style="display:inline-block;width:11px;height:11px;border-radius:2px;vertical-align:middle;margin-right:5px;background:' + now + ';border:1px solid rgba(255,255,255,0.3);"></span>' + now;
                    rows += '<tr><td style="padding:3px 6px;opacity:0.85;">' + (k.label || k.id) + '</td>'
                        + '<td style="padding:3px 6px;font-size:0.74rem;white-space:nowrap;">' + nowCell + '</td>'
                        + '<td style="padding:3px 6px;opacity:0.6;font-size:0.74rem;">' + ex + '</td></tr>';
                }
                messagesArea.insertAdjacentHTML('beforeend', '<div class="message assistant"><div class="message-content"><strong>UI-Elemente, die ich ändern kann</strong> (config v' + cfg.version + ')'
                    + '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;margin:6px 0;">'
                    + '<thead><tr style="opacity:0.55;"><th style="text-align:left;padding:3px 6px;">Element</th><th style="text-align:left;padding:3px 6px;">jetzt</th><th style="text-align:left;padding:3px 6px;">sag z.&nbsp;B.</th></tr></thead>'
                    + '<tbody>' + rows + '</tbody></table>'
                    + '<div style="font-size:0.76rem;opacity:0.7;margin-top:4px;">Farben: grün · orange · rot · weiß (oder rgb()/#hex). Beispiel: „mach die Zahlen weiß", „Banner nach unten".</div>'
                    + '<div style="font-size:0.76rem;opacity:0.55;margin-top:2px;">Sag einfach, was du willst — ich verstehe die Absicht; das hier ist nur die Übersicht.</div></div></div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                return { ok: true, count: knobs.length };
            } catch (e) {
                addMessage('assistant', '❌ Konnte die UI-Liste nicht laden: ' + ((e && e.message) || e));
                return { ok: false, error: (e && e.message) || String(e) };
            }
        }

        // WMO weather codes → short German text (Open-Meteo uses these).
        const WMO = { 0: 'klar', 1: 'überwiegend klar', 2: 'teils bewölkt', 3: 'bedeckt', 45: 'neblig', 48: 'Reifnebel', 51: 'leichter Niesel', 53: 'Niesel', 55: 'starker Niesel', 56: 'gefrierender Niesel', 57: 'gefrierender Niesel', 61: 'leichter Regen', 63: 'Regen', 65: 'starker Regen', 66: 'gefrierender Regen', 67: 'gefrierender Regen', 71: 'leichter Schnee', 73: 'Schnee', 75: 'starker Schnee', 77: 'Schneegriesel', 80: 'Regenschauer', 81: 'Regenschauer', 82: 'heftige Regenschauer', 85: 'Schneeschauer', 86: 'Schneeschauer', 95: 'Gewitter', 96: 'Gewitter mit Hagel', 99: 'schweres Gewitter mit Hagel' };

        // get_weather — current weather + today's range via Open-Meteo (FREE, keyless, CORS-ok). No secret/deploy needed.
        async function getWeather(location, days) {
            try {
                let lat, lon, place;
                if (location && String(location).trim()) {
                    const g = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=de&name=' + encodeURIComponent(String(location).trim()));
                    const gj = await g.json();
                    if (!gj.results || !gj.results.length) return { ok: false, summary: 'Ort "' + location + '" nicht gefunden — frag nach einer genaueren Angabe.' };
                    lat = gj.results[0].latitude; lon = gj.results[0].longitude;
                    place = gj.results[0].name + (gj.results[0].country ? ', ' + gj.results[0].country : '');
                } else {
                    if (!navigator.geolocation) return { ok: false, summary: 'Kein Standort verfügbar — frag nach einem Ort.' };
                    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000, maximumAge: 600000 }));
                    lat = pos.coords.latitude; lon = pos.coords.longitude; place = 'dem aktuellen Standort';
                }
                const n = Math.max(1, Math.min(7, parseInt(days, 10) || 1));   // forecast days (1 = today/now only)
                const w = await fetch('https://api.open-meteo.com/v1/forecast?timezone=auto&forecast_days=' + n + '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&latitude=' + lat + '&longitude=' + lon);
                const j = await w.json();
                const c = j.current || {}, d = j.daily || {}, r = (x) => (x == null ? '?' : Math.round(x));
                let summary = 'Wetter in ' + place + ': jetzt ' + (WMO[c.weather_code] || ('Code ' + c.weather_code)) + ', ' + r(c.temperature_2m) + '°C (gefühlt ' + r(c.apparent_temperature) + '°C), Wind ' + r(c.wind_speed_10m) + ' km/h, ' + r(c.relative_humidity_2m) + '% Luftfeuchte.';
                const t = d.time || [];
                if (n <= 1) {
                    summary += ' Heute ' + r(d.temperature_2m_min && d.temperature_2m_min[0]) + '–' + r(d.temperature_2m_max && d.temperature_2m_max[0]) + '°C, ' + r(d.precipitation_probability_max && d.precipitation_probability_max[0]) + '% Regen.';
                } else {
                    const lines = [];
                    for (let i = 0; i < t.length; i++) {
                        const wd = new Date(t[i] + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short' });
                        lines.push(wd + ' ' + r(d.temperature_2m_min[i]) + '–' + r(d.temperature_2m_max[i]) + '°C, ' + (WMO[d.weather_code[i]] || '') + ', ' + r(d.precipitation_probability_max[i]) + '% Regen');
                    }
                    summary += ' Vorhersage: ' + lines.join(' · ') + '.';
                }
                return { ok: true, summary };
            } catch (e) {
                return { ok: false, summary: 'Wetter konnte nicht geladen werden: ' + ((e && e.message) || e) };
            }
        }

        // History, the rolling context summary and the request/summarise plumbing now live in the brain
        // (js/solita-brain.js). solita-core only WIRES it (below) and renders what it reports.

        const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        // Text-Smileys → Emoji für die Anzeige (Doc 2026-06-23). MUSS hier oben stehen (vor jedem
        // addMessage-Aufruf, auch dem History-Restore) — sonst Init-TDZ und „nichts lädt". Engine-sicher
        // OHNE Lookbehind: führende Wortgrenze als Capture ($1) statt (?<!\w). Längere Muster zuerst.
        const EMOTICONS = [
            [/(^|[^\w]):'\(/g, '$1😢'],
            [/(^|[^\w]):-?D(?!\w)/g, '$1😀'],
            [/(^|[^\w]);-?\)/g, '$1😉'],
            [/(^|[^\w]):-?\)/g, '$1🙂'],
            [/(^|[^\w]):-?\(/g, '$1🙁'],
            [/(^|[^\w]):-?[Pp](?!\w)/g, '$1😛'],
            [/(^|[^\w]):-?[Oo](?!\w)/g, '$1😮'],
            [/(^|[^\w])<3(?!\w)/g, '$1❤️'],
        ];

        function getPwd() { return sessionPwd; }

        // Default = DeepSeek (Doc: cheap chat is the agreed baseline; Claude only borrows a turn for tools).
        let currentModel = localStorage.getItem(MODEL_KEY) || 'deepseek-chat';
        // Allow Claude OR DeepSeek (Doc wants to compare); anything else → safe DeepSeek default.
        if (!/^(claude-|deepseek-)/.test(currentModel)) currentModel = 'deepseek-chat';
        // Cost guard (Doc: die 5€ sollen halten): never let a stale/left-over 'ai_model' silently run Opus
        // (~1.67× in+out vs Sonnet) for a voice assistant. The proxy enforces this server-side too.
        if (/opus/i.test(currentModel)) currentModel = 'claude-sonnet-4-6';

        // DeepSeek can't use tools (its proxy drops the schemas). When the user clearly wants a tool action
        // (mail/weather/notes/location/settings), transparently run THAT one turn on Claude so it actually
        // works; ordinary chat stays on the cheap selected model. `modelOverride` is set per turn in
        // executeChatSend and cleared in onDone. Keyword-based — tune TOOL_INTENT as needed.
        const TOOL_INTENT = /(\be-?mails?\b|\bmails?\b|gmail|postfach|\bwetter\b|weather|vorhersage|forecast|temperatur|regne|schneit|kalender|calendar|\btermin(e)?\b|was steht (heute|morgen|diese woche|an)|\bnotiz(en)?\b|merk(e)? dir|schreib(\s+\w+)?\s+auf|erinner|wo bin ich|standort|where am i|einstellung(en)?|\bschalte\b|stell .* (ein|an|aus))/i;
        const FALLBACK_MODEL = 'claude-sonnet-4-6'; // tool-capable Claude used when DeepSeek hits a tool request
        let modelOverride = null;                   // forces a single turn onto Claude (tool fallback); cleared in onDone
        function needsTools(t) { return TOOL_INTENT.test(t || ''); }
        function getModel() { return modelOverride || currentModel; }
        // DeepSeek lives on its OWN proxy function (no tools — just cheap chat); Claude on /claude. Route by
        // the model's prefix so the summariser (Claude-Haiku) always reaches the claude proxy, even in DeepSeek mode.
        const DS_URL = AI_URL.replace(/\/claude(\?|$)/, '/deepseek$1');
        const GEMINI_URL = AI_URL.replace(/\/claude(\?|$)/, '/gemini$1');   // multimodal photo describe (cheap; Claude stays out)
        const INFRA_URL = AI_URL.replace(/\/claude(\?|$)/, '/infra-usage$1'); // /costs → live infra/AI costs (dry: no mail)
        function getApiUrl(model) { return /^deepseek/.test(model || currentModel) ? DS_URL : AI_URL; }

        function initModelDropdown(dropdownEl) {
            if (!dropdownEl) return;
            const display = dropdownEl.querySelector('.model-select-display');
            const label   = dropdownEl.querySelector('#modelLabel') || dropdownEl.querySelector('span');
            const options = dropdownEl.querySelectorAll('.model-option');

            // Gespeicherten Wert setzen
            options.forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === currentModel);
                if (opt.dataset.value === currentModel && label) label.textContent = opt.textContent;
            });

            display.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownEl.classList.toggle('open');
            });

            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    currentModel = opt.dataset.value;
                    localStorage.setItem(MODEL_KEY, currentModel);
                    if (window.solitaSyncSettings) window.solitaSyncSettings();
                    if (label) label.textContent = opt.textContent;
                    options.forEach(o => o.classList.toggle('selected', o === opt));
                    dropdownEl.classList.remove('open');
                });
            });
        }

        document.addEventListener('click', () => {
            document.querySelectorAll('.model-select.open').forEach(d => d.classList.remove('open'));
        });

        // Model picker in the hamburger panel: provider buttons (Claude ↔ DeepSeek) + a per-provider variant
        // dropdown. DeepSeek is cheap chat WITHOUT tools — its proxy doesn't forward Solita's tool schemas.
        const DEFAULT_VARIANT = { claude: 'claude-sonnet-4-6', deepseek: 'deepseek-chat' };
        function providerOf(m) { return /^deepseek/.test(m || '') ? 'deepseek' : 'claude'; }
        let reflectModelPicker = function () { };   // assigned by initModelPicker; lets applySettings re-sync the UI

        function initModelPicker() {
            const grp = document.getElementById('hh-model');
            if (!grp) return;
            const btns = Array.from(grp.querySelectorAll('button[data-provider]'));
            const dds = Array.from(document.querySelectorAll('.hh-model-dd'));
            // Remember the last variant chosen per provider, so flipping Claude↔DeepSeek restores it.
            const lastVariant = Object.assign({}, DEFAULT_VARIANT);
            lastVariant[providerOf(currentModel)] = currentModel;

            function reflect() {
                const prov = providerOf(currentModel);
                btns.forEach(b => b.classList.toggle('active', b.dataset.provider === prov));
                dds.forEach(dd => {
                    dd.classList.toggle('active', dd.dataset.provider === prov);
                    const label = dd.querySelector('.hh-dd-label');
                    dd.querySelectorAll('.model-option').forEach(opt => {
                        const on = opt.dataset.value === currentModel;
                        opt.classList.toggle('selected', on);
                        if (on && label) label.textContent = opt.textContent;
                    });
                });
            }
            reflectModelPicker = reflect;

            function commit() {
                try { localStorage.setItem(MODEL_KEY, currentModel); } catch (e) { }
                if (window.solitaSyncSettings) window.solitaSyncSettings();   // propagate the choice cross-device
                if (window.DebugWindow) DebugWindow.log('Modell → ' + currentModel);
                reflect();
            }

            btns.forEach(b => b.addEventListener('click', () => {
                const prov = b.dataset.provider;
                currentModel = lastVariant[prov] || DEFAULT_VARIANT[prov];
                commit();
            }));

            dds.forEach(dd => {
                dd.querySelector('.model-select-display').addEventListener('click', e => {
                    e.stopPropagation();
                    dd.classList.toggle('open');
                });
                dd.querySelectorAll('.model-option').forEach(opt => {
                    opt.addEventListener('click', e => {
                        e.stopPropagation();
                        currentModel = opt.dataset.value;
                        lastVariant[providerOf(currentModel)] = currentModel;
                        dd.classList.remove('open');
                        commit();
                    });
                });
            });

            reflect();
        }

        document.addEventListener('DOMContentLoaded', () => {
            const pwdInput = document.getElementById('cyber-pwd-input');
            if (pwdInput) {
                pwdInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') validateLabAccess();
                });
            }
            initModelDropdown(document.getElementById('modelDropdown'));
            initModelPicker();
        });

        // The "brain": the LLM conversation + tool-use engine (js/solita-brain.js). solita-core is now just
        // its HOST — it supplies auth (pwd), the model, the persona and the tool layer (specs + executor +
        // badges), and renders whatever the brain reports via callbacks. ear.js hears, solita-brain thinks,
        // solita-tts speaks. (Tools that touch the DOM, like show_ui_list, stay here in execTool.)
        const brain = new Brain({
            apiUrl: getApiUrl,   // route by model: DeepSeek → /deepseek, Claude (+ summariser) → /claude
            anonKey: SB_ANON,
            summaryModel: 'claude-haiku-4-5-20251001',
            keepRecent: 16,
            storage: { history: 'ai_history', summary: 'solita_summary', legacyHistory: 'deepseek_history' },
            getPwd: getPwd,
            getModel: getModel,
            getSystem: function () {
                // Append TODAY's date (day granularity → busts the cached persona only once per day, not per turn)
                // so Claude can resolve „morgen/nächsten Dienstag" for create_calendar_event etc.
                const heute = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
                return SOLITA_SYSTEM + ' Zur Orientierung: Heute ist ' + heute + ' (Zeitzone Europe/Berlin).';
            },
            getTools: function () { return SOLITA_TOOLS.concat((window.SolitaTools && window.SolitaTools.specs) || []); },
            execTool: execTool,
            toolBadge: toolBadge,
            onTyping: function (on) { if (on) showTyping(); else hideTyping(); },
            onAssistant: function (text) { addMessage('assistant', text); },
            onSpeak: function (text) { if (window.speakReply) window.speakReply(text); },
            onError: function (err) { addMessage('assistant', '❌ Fehler: ' + ((err && err.message) ? err.message : err)); if (window.solitaPhase) solitaPhase('dormant'); },
            onDone: function () { modelOverride = null; sendButton.disabled = false; messageInput.focus(); },
            // After every turn, push the updated log to the shared server (js/solita-sync.js) so the other
            // device (browser ↔ Pixel) converges on the same conversation. No-op until sync is initialised.
            onPersist: function () { if (window.SolitaSync) SolitaSync.push(brain.getHistory(), brain.getSummary()); },
            // Per-query cost (Doc 2026-06-19): a dezente Zeile unter der letzten Antwort. < 1 €/Antwort → Cent,
            // sonst Euro. Daten kommen schon aus dem claude-Proxy (usage) → reine Anzeige, kein Extra-Call.
            onCost: function (eur, total, model) {
                if (typeof eur !== 'number' || eur <= 0) return;
                // < 1 € → Cent, sonst Euro (gilt für Einzelpreis UND Summe).
                const fmt = function (e) {
                    const c = e * 100;
                    return (c < 100) ? (c < 10 ? c.toFixed(2) : c.toFixed(1)) + ' ¢' : '€ ' + e.toFixed(2);
                };
                const cc = messagesArea.querySelectorAll('.message.assistant .message-content');
                const last = cc[cc.length - 1];
                if (!last || last.querySelector('.solita-cost')) return;
                const tag = document.createElement('div');
                tag.className = 'solita-cost';
                // Colour the per-query cost (≈, the first number) by the model that produced it:
                // DeepSeek = φ-Grün, Claude (+ default) = λ-Orange. The Σ-total stays neutral.
                const costColor = /deepseek/.test(model || '') ? 'rgb(121,158,49)' : 'rgb(245,194,66)';
                const esc = function (s) { return String(s).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }); };
                let html = '<span style="color:' + costColor + '">≈ ' + esc(fmt(eur)) + '</span>';
                if (typeof total === 'number' && total > 0) html += '  ·  Σ ' + esc(fmt(total));
                tag.innerHTML = html;
                last.appendChild(tag);
            }
        });

        // "Stop EVERYTHING now" (Doc 2026-06-22): cancel a running Claude turn (brain.abort → drops the
        // typing/thinking turn quietly, no red bubble), silence any speech, clear the typing indicator and
        // the phase pill. Wired to the pill tap and a chat click. The ear stays on → she keeps listening.
        window.solitaStopAll = function () {
            // Only act when she's actually busy (speaking OR thinking) — otherwise an idle chat click would
            // needlessly clear the „listening" pill. typingIndicator is present for the whole thinking phase.
            const busy = window.__solitaSpeaking || !!document.getElementById('typingIndicator');
            if (!busy) return;
            try { brain.abort(); } catch (e) { }
            if (window.solitaStopSpeaking) window.solitaStopSpeaking();
            hideTyping();
            if (window.solitaPhase) solitaPhase();   // clear the pill (incl. the thinking-star timer)
        };

        // Restore persisted history into the brain, then render the bubbles (host owns the DOM).
        const _restored = brain.load();
        if (_restored) { messagesArea.innerHTML = ''; _restored.forEach(function (msg) { addMessage(msg.role, msg.content); }); }
        try { if (window.DebugWindow) DebugWindow.log('🔎 load: brain.load → ' + ((_restored && _restored.length) || 0) + ' turns gerendert'); } catch (e) { }

        // Cross-device sync (js/solita-sync.js): Solita is single-user (ONE shared password), so the
        // browser and the Pixel are the same "Doc" → keep ONE shared conversation log server-side via the
        // password-gated 'solita-sync' edge function. We wait for a password (cached auto-login or a fresh
        // login), then pull the shared log (host adopts the merged result via onRemote) and push whatever
        // this device had so any local-only turns reach the server too. Best-effort: if the edge fn isn't
        // deployed yet the calls just fail quietly and Solita keeps working device-locally as before.
        // ---- Cross-device PREFERENCES (Doc 2026-06-22) ----
        // The per-origin localStorage trap meant a model/voice/lang pick on one device never reached the Pixel.
        // We now carry the prefs in the SAME shared sync row (settings jsonb) via the password-gated solita-sync
        // fn. NEVER the password (Rule 21) — only these keys. Model + language apply LIVE; tts/voice/wake read
        // their localStorage at load, so they take effect on the device's next start (cross-device that's fine).
        const SYNCED_PREF_KEYS = ['ai_model', 'solita_tts', 'solita_gvoice', 'solita_voice', 'solita_wake', 'solita_lang'];
        function collectSettings() {
            const s = {};
            SYNCED_PREF_KEYS.forEach(function (k) { const v = localStorage.getItem(k); if (v != null) s[k] = v; });
            return s;
        }
        function reflectModel() {   // mirror currentModel onto the HH picker (buttons + variant dropdown) after an adopted change
            reflectModelPicker();
        }
        function applySettings(s) {
            if (!s || typeof s !== 'object') return;
            // Adopt ONLY keys the server actually has → never clobber a local pref with an empty server value.
            SYNCED_PREF_KEYS.forEach(function (k) {
                if (typeof s[k] === 'string') { try { localStorage.setItem(k, s[k]); } catch (e) { } }
            });
            if (typeof s.ai_model === 'string' && /^(claude-|deepseek-)/.test(s.ai_model) && !/opus/i.test(s.ai_model)) {
                currentModel = s.ai_model; reflectModel();
            }
            if (typeof s.solita_lang === 'string' && window.setSolitaLang && s.solita_lang !== window.solitaLang) {
                window.setSolitaLang(s.solita_lang, { silent: true, noSync: true });
            }
        }
        // Any device that changes a pref calls this → the new prefs land in the shared row for the others.
        window.solitaSyncSettings = function () {
            if (window.SolitaSync && SolitaSync.pushSettings) SolitaSync.pushSettings(collectSettings());
        };

        if (window.SolitaSync) {
            SolitaSync.init({
                endpoint: AI_URL.replace(/\/claude(\?|$)/, '/solita-sync$1'),
                anonKey: SB_ANON,
                getPwd: getPwd,
                onSettings: applySettings,
                onRemote: function (history, summary) {
                    if (!Array.isArray(history)) return;
                    // Only touch the DOM when the conversation ACTUALLY changed (e.g. the other device added
                    // turns). A steady-state push would otherwise clear + re-render the whole transcript →
                    // the "loads ~3× on reload" flicker. Key-order-insensitive (canon) so a jsonb-reordered
                    // but identical merge result doesn't trigger a spurious repaint. Adopt state regardless.
                    var canon = function (v) {
                        return JSON.stringify(v, function (k, val) {
                            return (val && typeof val === 'object' && !Array.isArray(val))
                                ? Object.keys(val).sort().reduce(function (o, kk) { o[kk] = val[kk]; return o; }, {})
                                : val;
                        });
                    };
                    var changed = canon(history) !== canon(brain.getHistory());
                    try { if (window.DebugWindow) DebugWindow.log('🔎 onRemote: server=' + history.length + ' local=' + brain.getHistory().length + ' changed=' + changed); } catch (e) { }
                    brain.setState(history, summary);
                    if (changed) {
                        messagesArea.innerHTML = '';
                        history.forEach(function (msg) { addMessage(msg.role, msg.content); });
                    }
                }
            });
            // Σ (running total) is SERVER-authoritative (Doc 2026-06-23: „logisch addieren = richtig machen").
            // Every AI call is logged in ai_cost_log → on load we seed the local Σ counter with the real
            // all-time total (cross-device, additive). The per-turn „≈" stays client-side; the session then
            // accumulates from the seeded baseline, and the next load on ANY device re-seeds from the server.
            window.syncCostBaseline = async function () {
                try {
                    const r = await fetch(INFRA_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': getPwd() },
                        body: JSON.stringify({ costOnly: true }),
                    });
                    const d = await r.json().catch(function () { return {}; });
                    if (r.ok && typeof d.totalAllTimeEur === 'number') {
                        localStorage.setItem('solita_cost_total', String(d.totalAllTimeEur));
                        if (typeof window.solitaCostUpdate === 'function') { try { window.solitaCostUpdate(d.totalAllTimeEur); } catch (e) { } }
                        if (window.DebugWindow) DebugWindow.log('Σ vom Server geseedet: ' + (d.totalAllTimeEur * 100).toFixed(2) + ' ¢');
                    }
                } catch (e) { /* offline → behalte den lokalen Σ */ }
            };
            (function kickWhenAuthed(tries) {
                if (getPwd && getPwd()) {
                    // push (NOT pull) on load: the edge fn merges our local log with the server's and returns
                    // the authoritative result, so this single call both uploads local-only turns AND pulls in
                    // whatever the other device added — without a separate pull that could briefly wipe to empty.
                    SolitaSync.push(brain.getHistory(), brain.getSummary());
                    window.syncCostBaseline();   // seed Σ from the server (authoritative cross-device total)
                } else if (tries > 0) {
                    setTimeout(function () { kickWhenAuthed(tries - 1); }, 1000);
                }
            })(30);
        }

        // ----- CHAT-LOGIK -----
        messageInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 110) + 'px';
        });
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.__solitaTyped = true;   // typed submit → quiet (no TTS) for this turn
                sendMessage();
            }
        });
        sendButton.addEventListener('click', function () { window.__solitaTyped = true; sendMessage(); });

        // ---- Quiet/„Pssst" mode (Doc 2026-06-24): when ON, Solita answers in writing only (speakReply is
        // gated on window.solitaQuiet in solita-tts.js). It auto-follows modality each turn — TYPING turns it
        // ON, SPEAKING turns it OFF — a Slumber-tap forces it ON (silent wake), and the 🤫 icon toggles it.
        window.solitaQuiet = false;
        window.solitaSetQuiet = function (on) {
            window.solitaQuiet = !!on;
            const btn = document.getElementById('solita-quiet');
            if (btn) { btn.classList.toggle('active', window.solitaQuiet); btn.setAttribute('aria-pressed', window.solitaQuiet ? 'true' : 'false'); }
            if (window.solitaQuiet && window.solitaStopSpeaking) window.solitaStopSpeaking();   // turning quiet on → hush now
        };
        (function () {
            const qb = document.getElementById('solita-quiet');
            if (qb) qb.addEventListener('click', function () { window.solitaSetQuiet(!window.solitaQuiet); });
        })();

        // ---- Paste an image into the input line → Solita "sees" it (Doc 2026-06-23). Images ALWAYS go to Gemini,
        // never to Claude (cheap multimodal; Gemini's text answer then enters the Claude chat context). Text/LaTeX
        // paste needs nothing — the textarea + MathJax already handle it. ----
        let pastedImage = null;   // data URL of an image pasted into the input, awaiting send
        function clearPastedImage() {
            pastedImage = null;
            const chip = document.getElementById('paste-img-chip');
            if (chip) chip.remove();
        }
        function showPastedImageChip(dataUrl) {
            let chip = document.getElementById('paste-img-chip');
            if (!chip) {
                chip = document.createElement('div');
                chip.id = 'paste-img-chip';
                // Floats just above the input bar (.input-area is position:relative) → doesn't disturb the flex row.
                chip.style.cssText = 'position:absolute;bottom:100%;left:24px;margin-bottom:6px;display:flex;align-items:center;'
                    + 'gap:8px;background:rgba(8,20,42,.92);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:6px 8px;z-index:5;';
                const ia = messageInput.parentElement;
                if (ia) ia.appendChild(chip);
            }
            chip.innerHTML = '<img alt="Eingefügtes Bild" style="height:40px;border-radius:6px;display:block">'
                + '<button type="button" aria-label="Bild entfernen" title="Bild entfernen" '
                + 'style="background:none;border:none;color:#e6edf3;font-size:1.1rem;cursor:pointer;line-height:1;padding:0 4px">✕</button>';
            chip.querySelector('img').src = dataUrl;
            chip.querySelector('button').addEventListener('click', clearPastedImage);
        }
        function acceptImageFile(file) {   // read an image File/Blob → stash as the pending image + show the chip
            if (!file || !file.type || file.type.indexOf('image/') !== 0) return false;
            const reader = new FileReader();
            reader.onload = function () { pastedImage = reader.result; showPastedImageChip(pastedImage); };
            reader.readAsDataURL(file);
            return true;
        }
        messageInput.addEventListener('paste', function (e) {
            const items = (e.clipboardData && e.clipboardData.items) || [];
            for (const it of items) {
                if (it.kind === 'file' && it.type && it.type.indexOf('image/') === 0) {
                    e.preventDefault();   // image only — don't also paste a filename/text fallback
                    if (acceptImageFile(it.getAsFile())) return;
                }
            }
            // no image in the clipboard → let the default text/LaTeX paste happen
        });
        // Drag-and-drop an image file anywhere onto the chat (input bar or message area) → same flow as paste.
        (function wireImageDrop() {
            const zones = [messageInput, messagesArea, messageInput.parentElement].filter(Boolean);
            zones.forEach(function (z) {
                z.addEventListener('dragover', function (e) { e.preventDefault(); });   // required to allow a drop
                z.addEventListener('drop', function (e) {
                    const files = (e.dataTransfer && e.dataTransfer.files) || [];
                    for (const f of files) {
                        if (f.type && f.type.indexOf('image/') === 0) { e.preventDefault(); acceptImageFile(f); return; }
                    }
                    // non-image drop → leave it to the default handler
                });
            });
        })();
        // A pasted image awaits send → describe it via Gemini (the typed text, if any, is the question about it),
        // show it as a user bubble, render Gemini's answer as Solita's reply, and fold both into the chat context.
        async function handlePastedImage(userText) {
            const img = pastedImage;
            clearPastedImage();
            messageInput.value = ''; messageInput.style.height = 'auto';
            messagesArea.insertAdjacentHTML('beforeend',
                '<div class="message user"><div class="message-content" style="padding:6px">'
                + (userText ? '<div style="margin-bottom:6px">' + escapeHtml(userText) + '</div>' : '')
                + '<img src="' + img + '" alt="Eingefügtes Bild" style="max-width:240px;border-radius:8px;display:block"></div></div>');
            messagesArea.scrollTop = messagesArea.scrollHeight;
            showTyping();
            try {
                const res = await describePhoto(img, userText);
                hideTyping();
                addMessage('assistant', res.text);
                showGeminiCost(res.usage, '🖼️ Bild');
                if (window.speakReply) window.speakReply(res.text);
                // Fold into the Claude conversation (history) so follow-ups ("und die Farbe?") have the image
                // context — and it syncs cross-device like any other turn. The image itself never goes to Claude;
                // only Gemini's text description does (Doc: Bilder IMMER an Gemini).
                if (typeof brain !== 'undefined' && brain.getHistory && brain.setState) {
                    const h = brain.getHistory().slice();
                    h.push({ role: 'user', content: (userText ? userText + ' ' : '') + '[Bild eingefügt]' });
                    h.push({ role: 'assistant', content: 'Bild-Beschreibung: ' + res.text });
                    brain.setState(h);
                    // setState only persists locally → push so the other device gets the image context too.
                    if (window.SolitaSync && SolitaSync.push) { try { SolitaSync.push(brain.getHistory(), brain.getSummary()); } catch (e) { } }
                }
            } catch (e) {
                hideTyping();
                addMessage('assistant', '❌ Konnte das Bild nicht auswerten: ' + ((e && e.message) || e));
            }
        }

        function addMessage(role, content) {
            const motto = document.getElementById('vsb-motto');
            if (motto) motto.remove();
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role}`;
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            // 1. Code-Blöcke extrahieren (Platzhalter nutzen)
            const codeBlocks = [];
            let formatted = content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
                codeBlocks.push({ lang, code });
                return placeholder;
            });

            // Security (WP-5): neutralise any raw HTML in the model's text BEFORE we add our own markup,
            // so an injected <script>/<img onerror> can't run. Markdown chars (#, *, |, `) are untouched.
            formatted = escapeHtml(formatted);

            // Text-Smileys → Emoji (Doc 2026-06-23). Code-Blöcke sind hier Platzhalter → geschützt. Der
            // (?<!\w)-Vorlauf verhindert Treffer mitten in Wörtern/URLs (z.B. „3:(Details").
            EMOTICONS.forEach(function (e) { formatted = formatted.replace(e[0], e[1]); });

            // 2a. Markdown-Tabellen rendern
            formatted = formatted.replace(/^(\|.+\|)\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm, (match, header, body) => {
                const parseRow = row => row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                const ths = parseRow(header).map(h => `<th>${h}</th>`).join('');
                const trs = body.trim().split('\n').map(row =>
                    '<tr>' + parseRow(row).map(c => `<td>${c}</td>`).join('') + '</tr>'
                ).join('');
                return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
            });

            // 2. Andere Markups formatieren
            formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
            formatted = formatted.replace(/^## (.*$)/gim, '<h4>$1</h4>');
            formatted = formatted.replace(/^# (.*$)/gim, '<h5>$1</h5>');
            formatted = formatted.replace(/^\s*[-*+]\s+(.*)$/gim, '<li>$1</li>');
            formatted = formatted.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
            formatted = formatted.replace(/<\/ul>\s*<ul>/gim, '');
            formatted = formatted.replace(/^---$/gm, '<hr>');
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
            formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
            formatted = formatted.replace(/\n/g, '<br>');

            // 3. Code-Blöcke sicher wieder einsetzen
            codeBlocks.forEach((block, index) => {
                const langClass = block.lang ? ` class="language-${block.lang}"` : '';
                const codeHtml = `<div class="pre-wrapper"><button class="copy-btn" data-code="${encodeURIComponent(block.code.trim())}">${COPY_ICON}</button><pre><code${langClass}>${escapeHtml(block.code.trim())}</code></pre></div>`;
                formatted = formatted.replace(`__CODE_BLOCK_${index}__`, codeHtml);
            });

            contentDiv.innerHTML = formatted;

            // Copy-Button für gesamte Antwort
            if (role === 'assistant') {
                const msgCopyBtn = document.createElement('button');
                msgCopyBtn.className = 'copy-btn';
                msgCopyBtn.innerHTML = COPY_ICON;
                msgCopyBtn.style.position = 'absolute';
                msgCopyBtn.addEventListener('click', () => copyText(content, msgCopyBtn));
                contentDiv.appendChild(msgCopyBtn);
            }

            // Copy-Button für Code-Blöcke verdrahten
            contentDiv.querySelectorAll('.pre-wrapper .copy-btn').forEach(btn => {
                const code = decodeURIComponent(btn.dataset.code);
                btn.addEventListener('click', () => copyText(code, btn));
            });

            messageDiv.appendChild(contentDiv);
            messagesArea.appendChild(messageDiv);

            // MathJax Rendering
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([contentDiv]);
            }

            // Syntax Highlighting
            if (typeof hljs !== 'undefined') {
                contentDiv.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }

            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        // Render TRUSTED server-generated HTML (e.g. the infra-usage cost table) verbatim — NO escaping.
        // Only ever call this with HTML we built ourselves on the server, never with model output (WP-5).
        // The email table is light-themed (navy text/links on white), so we sit it on a light card so its
        // own colours read correctly inside the dark chat.
        function addTrustedHtmlMessage(html) {
            const motto = document.getElementById('vsb-motto');
            if (motto) motto.remove();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML =
                '<div style="background:#ffffff;border-radius:10px;padding:14px 16px;overflow-x:auto;">' + html + '</div>';
            messageDiv.appendChild(contentDiv);
            messagesArea.appendChild(messageDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                btn.innerHTML = CHECK_ICON;
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = COPY_ICON;
                    btn.classList.remove('copied');
                }, 1500);
            });
        }

        function escapeHtml(str) {
            return str.replace(/[&<>]/g, function (m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }

        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `<div class="message-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
            messagesArea.appendChild(typingDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
            if (window.solitaPhase) solitaPhase('thinking');
        }

        function hideTyping() {
            const el = document.getElementById('typingIndicator');
            if (el) el.remove();
        }

        // German STT mangles English code terms (Doc 2026-06-23: „for loop" → „vor Luke"). Fix the clear
        // mis-hears BEFORE sending — only phrases that are nonsense as TYPED text, so this is safe on typed
        // input too. Extend freely as new mis-hears show up.
        const SPEECH_FIX = [
            [/\bvor\s?lu(ke|be?|p+|bb)\b/gi, 'for loop'],
            [/\bfor\s?look\b/gi, 'for loop'],
            [/\bvor\s?loop\b/gi, 'for loop'],
            [/\bprint\s?l(ei|i)ne?\b/gi, 'println'],
            [/\bschtring\b/gi, 'String'],
            [/\bbull\s?ean\b/gi, 'boolean'],
            [/\bint\s?eddscher\b/gi, 'Integer'],
        ];
        function fixSpeechTerms(t) {
            var s = String(t || '');
            for (var i = 0; i < SPEECH_FIX.length; i++) s = s.replace(SPEECH_FIX[i][0], SPEECH_FIX[i][1]);
            return s;
        }

        function normalizeVoiceCommand(userText) {
            // Voice: spoken "slash ui" / "slash list" arrives as WORDS (not "/ui") → map to the typed command
            // so it triggers instead of going to Claude (which would just "think"). Only known commands convert.
            // German STT often mishears the English word "slash" → "gleich"/"klatsch"/"schlag" etc.; accept those too.
            const _sm = userText.toLowerCase().match(/^(?:slash|splash|flash|gleich|klatsch|glatsch|schlag)\s+(.+?)[\s.!?]*$/);
            if (_sm) {
                const _w = _sm[1].replace(/[.\s]/g, '');   // "u i" / "u.i." → "ui"
                const _M = { ui: 'ui', youeye: 'ui', youi: 'ui', list: 'list', liste: 'list', clear: 'clear', logout: 'logout', ausloggen: 'logout', abmelden: 'logout', wake: 'wake', aufwachen: 'wake', aufwecken: 'wake', wach: 'wake', costs: 'costs', cost: 'costs', kosten: 'costs', de: 'de', deutsch: 'de', german: 'de', aleman: 'de', 'alemán': 'de', en: 'en', english: 'en', englisch: 'en', ingles: 'en', 'inglés': 'en', es: 'es', spanish: 'es', spanisch: 'es', 'español': 'es', espanol: 'es' };
                if (_M[_w]) userText = '/' + _M[_w];
            }
            return userText;
        }

        async function handleBuiltInCommands(userText) {
            if (userText.toLowerCase() === '/clear') {
                brain.clear();                             // wipe history + rolling summary + their storage
                // Keep the visible transcript on screen (Doc: don't delete the text) — only her MEMORY is wiped.
                // A subtle divider marks the cut; the old bubbles vanish on the next reload (history is empty now).
                messagesArea.insertAdjacentHTML('beforeend', '<div style="text-align:center;opacity:0.45;font-size:0.66rem;letter-spacing:1.5px;text-transform:uppercase;margin:16px 0;font-family:Orbitron,sans-serif;color:#cfe3ff;">— neue Session · Gedächtnis geleert —</div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                return true;
            }

            if (userText.toLowerCase() === '/logout') {        // /logout → same as the spoken "log mich aus" + ☰ button
                messageInput.value = ''; messageInput.style.height = 'auto';
                if (window.solitaLogout) window.solitaLogout(); // mic off · clears the persisted pwd · shows the auth overlay
                return true;
            }

            if (userText.toLowerCase() === '/wake') {          // /wake → bring her up: ear ON (if off) + open the convo
                messageInput.value = ''; messageInput.style.height = 'auto';
                if (window.solitaWake) window.solitaWake();      // mic on (if off) → „Ja?" + listen, like hearing "Solita"
                messagesArea.insertAdjacentHTML('beforeend', '<div style="text-align:center;opacity:0.5;font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;margin:12px 0;font-family:Orbitron,sans-serif;color:#cfe3ff;">— Solita wach · hört zu —</div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                return true;
            }

            if (userText.toLowerCase() === '/pause') {         // /pause → drop her into the quiet SLUMBER (dormant)
                messageInput.value = ''; messageInput.style.height = 'auto';
                if (window.solitaPause) window.solitaPause();
                messagesArea.insertAdjacentHTML('beforeend', '<div style="text-align:center;opacity:0.5;font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;margin:12px 0;font-family:Orbitron,sans-serif;color:#cfe3ff;">— Solita schlummert · sag „Solita" oder /wake —</div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                return true;
            }

            if (userText.toLowerCase() === '/list') {
                messagesArea.insertAdjacentHTML('beforeend', `<div class="message assistant"><div class="message-content"><strong>Sprachbefehle</strong>
<table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin:6px 0;">
<thead><tr style="opacity:0.55;"><th style="text-align:left;padding:3px 6px;"></th><th style="text-align:left;padding:3px 6px;">DE</th><th style="text-align:left;padding:3px 6px;">EN</th><th style="text-align:left;padding:3px 6px;">ES</th></tr></thead>
<tbody>
<tr><td style="padding:3px 6px;opacity:0.7;">Wecken</td><td style="padding:3px 6px;">Solita</td><td style="padding:3px 6px;">Solita</td><td style="padding:3px 6px;">Solita</td></tr>
<tr><td style="padding:3px 6px;opacity:0.7;">Pause</td><td style="padding:3px 6px;">pause · chill mal · ruh dich aus · sogni d'oro</td><td style="padding:3px 6px;">pause · chill out · take a break · go to sleep</td><td style="padding:3px 6px;">pausa · descansa · a dormir · duérmete</td></tr>
<tr><td style="padding:3px 6px;opacity:0.7;">Logout</td><td style="padding:3px 6px;">ausloggen · abmelden</td><td style="padding:3px 6px;">log (me) out · sign (me) out</td><td style="padding:3px 6px;">cierra sesión · desconéctame</td></tr>
<tr><td style="padding:3px 6px;opacity:0.7;">Tschüss</td><td style="padding:3px 6px;">tschüss · das war's</td><td style="padding:3px 6px;">bye · see you · good night</td><td style="padding:3px 6px;">adiós · hasta luego · chao</td></tr>
</tbody></table>
<div style="font-size:0.82rem;opacity:0.85;"><strong>Tippbefehle:</strong> /wake (aufwecken) · /pause (schlummern) · /clear (neue Session) · /list (diese Tabelle) · /ui (änderbare UI-Elemente) · /costs (unsere Kosten) · /logout (abmelden) · /de · /en · /es (Sprache)</div>
<div style="font-size:0.78rem;opacity:0.6;margin-top:4px;">Sprache auch per DE / EN / ES im Menü (☰)</div></div></div>`);
                messagesArea.scrollTop = messagesArea.scrollHeight;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                return true;
            }

            if (userText.trim().toLowerCase() === '/ui') {   // /ui → the changeable-UI table (shared with the show_ui_list tool)
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
                showTyping();
                await renderUiList();
                hideTyping();
                return true;
            }

            // /de · /en · /es PLUS spelled-out aliases (typed or spoken "slash english") → switch language.
            const LANG_ALIAS = { de: 'de', deutsch: 'de', german: 'de', aleman: 'de', 'alemán': 'de',
                                 en: 'en', english: 'en', englisch: 'en', ingles: 'en', 'inglés': 'en',
                                 es: 'es', espanol: 'es', 'español': 'es', spanish: 'es', spanisch: 'es' };
            const langMatch = userText.trim().toLowerCase().match(/^\/([a-zá-úñ]+)$/);
            const langCode = langMatch ? LANG_ALIAS[langMatch[1]] : null;
            if (langCode) {                                 // switch language (same as the ☰ buttons)
                if (window.setSolitaLang) window.setSolitaLang(langCode);
                const names = { de: 'Deutsch', en: 'English', es: 'Español' };
                messagesArea.insertAdjacentHTML('beforeend', '<div style="text-align:center;opacity:0.5;font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;margin:12px 0;font-family:Orbitron,sans-serif;color:#cfe3ff;">— ' + names[langCode] + ' —</div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                return true;
            }

            return false;
        }

        function checkAuthAndReturnPwd(pwd) {
            if (!pwd) {
                document.getElementById('cyber-auth-overlay').classList.add('visible');
                setTimeout(() => document.getElementById('cyber-pwd-input')?.focus(), 100);
                return undefined;
            }
            return pwd;
        }

        async function postConfigInstruction(instruction, pwd) {
            sendButton.disabled = true;
            showTyping();
            try {
                const r = await fetch(SOLITA_CONFIG_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': `Bearer ${SB_ANON}`, 'x-app-pass': pwd },
                    body: JSON.stringify({ instruction })
                });
                const data = await r.json().catch(() => ({}));
                hideTyping();
                if (!r.ok) {
                    let err = `Fehler ${r.status}`;
                    if (r.status === 401) err = 'Falsches Passwort';
                    else if (data && data.error) err += ' — ' + data.error;
                    addMessage('assistant', `❌ Config: ${err}`);
                } else {
                    addMessage('assistant', `✓ Eingestellt (config v${data.version}).`);
                    if (window.speakReply) window.speakReply('Erledigt.');
                }
            } catch (e) {
                hideTyping();
                addMessage('assistant', `❌ Config: ${e.message || e}`);
            } finally {
                sendButton.disabled = false;
                messageInput.focus();
            }
        }

        async function handleConfigOrUiMode(userText, pwd) {
            // ---- UI-Änderungs-Modus (primer) + Einzelbefehl "stell ein: …" → solita-config (live config) ----
            // In UI-Modus ist JEDER Satz eine Config-Änderung; rein via "UI Änderung"/"Änderung UI", raus via
            // "fertig"/EXIT. "stell ein: …" wirkt auch ohne Modus als Einzelbefehl. Nicht in den Chat gepusht.
            const t = userText.trim();
            // Enter UI mode: a bare "UI" (incl. de-DE mishearings of the English "you-eye") is enough now — no
            // verb required. Longer sentences still need ui + a change-verb, or "ui mode".
            const wantsEnterUi = /^\s*(ui|u\.?\s?i|you\.?\s?i|benutzeroberfläche)(\s+(modus|mode|bitte|an|english|englisch))?\s*[.!?]?\s*$/i.test(t)
                || (/\bui\b/i.test(t) && /(adjust|change|edit|tune|tweak|adapt|änder|aender|anpass)/i.test(t))
                || /\bui[\s-]?mode\b/i.test(t);
            const wantsExitUi  = /^(fertig|ende|stop+|schluss|ui\s*aus|raus|normal)\b/i.test(t);
            const oneShot = t.match(/^\s*(?:solita[\s,:]*)?(?:stell\s+ein|config|konfiguration)\b[\s:]*(.+)/is);

            if (uiMode && wantsExitUi) {                         // leave UI mode
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
                setUiMode(false);
                addMessage('assistant', 'UI-Modus aus. 🔧');
                if (window.speakReply) window.speakReply('Alles klar.');
                return true;
            }
            if (!uiMode && wantsEnterUi && !oneShot) {           // enter UI mode
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
                setUiMode(true);
                addMessage('assistant', 'UI-Modus an — sag deinen Wunsch, dann „go" (oder 4 s Pause). „fertig"/EXIT beendet.');
                if (window.speakReply) window.speakReply('UI-Modus an. Sag deinen Wunsch, dann go.');
                return true;
            }
            if (uiMode || (oneShot && oneShot[1].trim())) {      // a config instruction
                const instruction = oneShot ? oneShot[1].trim() : t;
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
                await postConfigInstruction(instruction, pwd);
                return true;
            }
            return false;
        }

        // ---- "mach ein Foto" → take + DESCRIBE (Doc 2026-06-23) ----
        // Capture happens in the SEND tap (transient user-gesture still valid) so the native camera actually
        // opens — the take_photo TOOL fired only AFTER the model round-trip, by which time the gesture was gone
        // (BUG-13 Ursache 2). Description goes to GEMINI 2.5 Flash (multimodal, ~0.05 ¢/photo) — Claude is too
        // pricey for this, and the cheap `gemini` proxy is already deployed. No Claude in the photo path at all.
        const PHOTO_INTENT = /\b(mach|nimm|schie[sß]+|knips(e|en)?|take|aufnehmen)\b[^.?!]{0,24}\b(foto|bild|photo|picture)\b|\b(foto|bild|photo)\s+(bitte|machen|aufnehmen|knipsen)\b/i;
        async function describePhoto(dataUrl, question) {
            const b64 = String(dataUrl).replace(/^data:[^,]+,/, '');   // strip the "data:image/…;base64," prefix
            const mime = (String(dataUrl).match(/^data:([^;,]+)/) || [])[1] || 'image/jpeg';   // keep PNG paste as PNG
            // If Doc typed something with the image, that's the question about it; else just describe it.
            const ask = (question && question.trim())
                ? question.trim() + '\n\nAntworte kurz und natürlich auf Deutsch, gesprochen-freundlich, ohne Aufzählung. Beziehe dich auf das Bild.'
                : 'Beschreibe kurz und natürlich auf Deutsch, was auf diesem Bild zu sehen ist — ein bis drei Sätze, gesprochen-freundlich, ohne Aufzählung.';
            const r = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON },
                body: JSON.stringify({
                    model: 'gemini-2.5-flash',
                    label: 'photo',   // cost-log tag → daily mail's Gemini line
                    body: {
                        contents: [{
                            parts: [
                                { inline_data: { mime_type: mime, data: b64 } },
                                { text: ask },
                            ],
                        }],
                    },
                }),
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error((d && d.error && (d.error.message || d.error)) || ('Gemini ' + r.status));
            const parts = d && d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts;
            const text = Array.isArray(parts) ? parts.map(function (p) { return (p && p.text) || ''; }).join(' ').trim() : '';
            return { text: text || '(Gemini hat nichts zurückgegeben.)', usage: d && d.usageMetadata };
        }
        // A per-action cost line under the last assistant bubble — same look as the chat cost (Doc 2026-06-23:
        // „es stehen keine Preise pro Suche mehr da?"). Gemini Flash list price × USD→EUR; green (= cheap).
        // Per-DAY search counter (the 1500 free-grounding quota is daily) → "🔍 N/1500" on the line.
        function bumpSearchCountDaily() {
            const today = new Date().toISOString().slice(0, 10);
            let o = {}; try { o = JSON.parse(localStorage.getItem('solita_search_count') || '{}') || {}; } catch (e) { }
            if (o.date !== today) o = { date: today, n: 0 };
            o.n = (o.n || 0) + 1;
            try { localStorage.setItem('solita_search_count', JSON.stringify(o)); } catch (e) { }
            return o.n;
        }
        function showGeminiCost(um, label, isSearch) {
            if (!um) return;
            const inTok = Number(um.promptTokenCount) || 0, outTok = Number(um.candidatesTokenCount) || 0;
            const eur = (inTok * 0.30 + outTok * 2.50) / 1e6 * 0.92;   // gemini-2.5-flash [in,out] $/1M × USD→EUR
            // ONE running Σ across everything (Doc). Grounding is free <1500/day, but the TOKENS always cost a
            // sliver → never truly zero. The ↑/↓ tokens stay in the DEBUG window; the chat line shows ≈ · Σ · 🔍.
            let total = 0; try { total = parseFloat(localStorage.getItem('solita_cost_total') || '0') || 0; } catch (e) { }
            total += eur;
            try { localStorage.setItem('solita_cost_total', String(total)); } catch (e) { }
            if (window.DebugWindow) window.DebugWindow.log('€ ' + (isSearch ? 'search' : (label || 'gemini')) + ': ↑' + inTok + ' ↓' + outTok + ' · ' + (eur * 100).toFixed(3) + '¢ · Σ ' + total.toFixed(3) + ' €');
            const fmt = function (e) { const c = e * 100; return (c < 100) ? (c < 1 ? c.toFixed(3) : c < 10 ? c.toFixed(2) : c.toFixed(1)) + ' ¢' : '€ ' + e.toFixed(2); };
            const cc = messagesArea.querySelectorAll('.message.assistant .message-content');
            const last = cc[cc.length - 1];
            if (!last || last.querySelector('.solita-cost')) return;
            const tag = document.createElement('div');
            tag.className = 'solita-cost';
            tag.style.opacity = '0.92'; tag.style.fontSize = '0.8rem';   // „deutlicher" (Doc) — clearer than the dim chat line
            let html = '<span style="color:rgb(214,195,155)">≈ ' + fmt(eur) + '</span>  ·  Σ ' + fmt(total);
            if (isSearch) html += '  ·  🔍 ' + bumpSearchCountDaily() + '/1500';
            else if (label) html += '  ·  ' + label;
            tag.innerHTML = html;
            last.appendChild(tag);
        }
        async function handlePhotoIntent(userText) {
            if (!PHOTO_INTENT.test(userText) || !window.PhotoCapture) return false;
            addMessage('user', userText);
            messageInput.value = ''; messageInput.style.height = 'auto';
            let img = null;
            try { img = await PhotoCapture.capture({ onError: function () { } }); } catch (e) { img = null; }
            if (!img) {
                addMessage('assistant', 'Kein Foto aufgenommen. 📷');
                if (window.speakReply) window.speakReply('Kein Foto aufgenommen.');
                return true;
            }
            // Show the captured photo, then let Gemini describe it.
            messagesArea.insertAdjacentHTML('beforeend',
                '<div class="message user"><div class="message-content" style="padding:6px">' +
                '<img src="' + img + '" alt="Foto" style="max-width:240px;border-radius:8px;display:block"></div></div>');
            messagesArea.scrollTop = messagesArea.scrollHeight;
            showTyping();
            try {
                const res = await describePhoto(img);
                hideTyping();
                addMessage('assistant', res.text);
                showGeminiCost(res.usage, '📷 Foto');
                if (window.speakReply) window.speakReply(res.text);
                recordMediaTurn('user', userText);
                recordMediaTurn('assistant', 'Foto-Beschreibung: ' + res.text);
                brain.appendExchange(userText, res.text);   // into the SHARED log → other device sees it too (Bild bleibt lokal)
            } catch (e) {
                hideTyping();
                addMessage('assistant', '❌ Konnte das Foto nicht beschreiben: ' + ((e && e.message) || e));
            }
            return true;
        }

        // ---- "such mal im Netz …" → Gemini Search-Grounding (Doc 2026-06-23) ----
        // Model-INDEPENDENT (works even on DeepSeek): the search runs OUTSIDE the chat model, via the cheap
        // `gemini` proxy with the google_search tool. Free up to 1500 grounded prompts/day, then $35/1000 —
        // for a single user effectively free. Sources come back in groundingMetadata; we show + speak the answer.
        // Smarter intent (Doc 2026-06-23): open verb stems (\w*) so ALL forms fire — „recherchieren", „googeln",
        // „suchen" — plus „finde heraus", „schau nach", and „aktueller/neuester … Preis/Kurs/Nachrichten…"
        // (incl. glued compounds like „Goldpreis"). Tested against a positive/negative set for precision.
        const SEARCH_INTENT = /\b(such\w*|googe?l\w*|recherchier\w*)\b|\b(im|ins)\s+(netz|internet|web)\s+(nach|such\w*|find\w*|guck\w*|schau\w*)|\bschau\w*\s+(mal\s+)?(online|nach\b|im\s+netz|ins\s+internet)|\bfind\w*\s+(mal\s+)?(heraus|raus)\b|\b(aktuell\w*|neueste\w*|heutige\w*|momentane\w*)\b[\s\w-]{0,20}(preis|kurs|wert|stand|nachrichten|news|wetter|wechselkurs)\b|\bwas\s+gibt\W?s\s+neues\b/i;
        // Sticky search (Doc 2026-06-23): a follow-up WITHOUT a search keyword — „wie hat ER sich verändert",
        // „und in Dollar?" — has no trigger, so it would fall to the chat model („kann ich nicht live"). Right
        // AFTER a search we treat a referential follow-up as a continued search → it reaches the context-aware
        // searchWeb and resolves the anaphor. Strong 3rd-person refs only (NOT bare „es/das") to stay precise.
        const FOLLOWUP_INTENT = /^\s*und\b|\b(er|sie|ihn|ihm|ihr|dieser|diese|dieses|derselbe|davon|damit|dazu|darüber|dafür|dagegen|seitdem|seither)\b/i;
        let lastSearchActive = false;   // armed after a search; a referential next turn stays in search mode
        // Recent search/photo exchanges (the chat turns live in brain.getHistory()); together they give the
        // search its CONTEXT so Gemini can resolve anaphora — „wie hat ER sich verändert" → Bitcoin (Doc).
        let recentMediaTurns = [];
        function recordMediaTurn(role, text) {
            if (!text) return;
            recentMediaTurns.push({ role: role, text: String(text) });
            if (recentMediaTurns.length > 8) recentMediaTurns = recentMediaTurns.slice(-8);
        }
        async function searchWeb(query, ctx) {
            let ctxText = '';
            if (ctx && ctx.length) {
                ctxText = 'Bisheriger Gesprächsverlauf (nutze ihn, um Bezüge wie „er/sie/es/das/dieser/dort" aufzulösen):\n'
                    + ctx.map(function (t) { return (t.role === 'assistant' ? 'Solita' : 'Doc') + ': ' + t.text; }).join('\n') + '\n\n';
            }
            const prompt = ctxText + 'Aktuelle Frage: ' + query
                + '\n\nAntworte kurz und natürlich auf Deutsch — ein bis drei Sätze, gesprochen-freundlich, ohne Aufzählung. Stütze dich auf aktuelle Web-Informationen.';
            const r = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON },
                body: JSON.stringify({
                    model: 'gemini-2.5-flash',
                    label: 'search',   // cost-log tag → grounded-search count in the daily mail
                    body: {
                        contents: [{ parts: [{ text: prompt }] }],
                        tools: [{ google_search: {} }],
                    },
                }),
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error((d && d.error && (d.error.message || d.error)) || ('Gemini ' + r.status));
            const cand = d && d.candidates && d.candidates[0];
            const parts = cand && cand.content && cand.content.parts;
            const text = Array.isArray(parts) ? parts.map(function (p) { return (p && p.text) || ''; }).join(' ').trim() : '';
            const chunks = cand && cand.groundingMetadata && cand.groundingMetadata.groundingChunks;
            const sources = Array.isArray(chunks) ? chunks.map(function (c) { return c && c.web; }).filter(Boolean).slice(0, 4) : [];
            return { text: text || '(Gemini hat nichts zurückgegeben.)', sources: sources, usage: d && d.usageMetadata };
        }
        async function handleSearchIntent(userText) {
            addMessage('user', userText);
            messageInput.value = ''; messageInput.style.height = 'auto';
            // Context = recent chat turns (brain) + recent search/photo turns → lets Gemini resolve „er/sie/es".
            const histChat = (typeof brain !== 'undefined' && brain.getHistory) ? brain.getHistory() : [];
            const ctx = histChat.slice(-4).map(function (t) { return { role: t.role, text: t.content }; })
                .concat(recentMediaTurns.slice(-4)).slice(-6);
            addMessage('assistant', '🌐 ich recherchiere im Netz …');   // interim line, like the get_weather badge (Doc)
            showTyping();
            try {
                const res = await searchWeb(userText, ctx);
                hideTyping();
                addMessage('assistant', res.text);
                const _cells = messagesArea.querySelectorAll('.message.assistant .message-content');
                const _cell = _cells[_cells.length - 1];
                if (_cell) _cell.style.color = 'rgb(214,195,155)';   // sand — marks a researched (web) answer (Doc)
                showGeminiCost(res.usage, null, true);   // search → shows the daily 🔍 N/1500 counter
                if (res.sources.length) {
                    const links = res.sources.map(function (s) {
                        return '<a href="' + escapeHtml(s.uri || '#') + '" target="_blank" rel="noopener" style="color:rgb(121,158,49)">' + escapeHtml(s.title || s.uri || 'Quelle') + '</a>';
                    }).join('  ·  ');
                    messagesArea.insertAdjacentHTML('beforeend',
                        '<div class="message assistant"><div class="message-content" style="font-size:0.8rem;opacity:0.85">🌐 ' + links + '</div></div>');
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                }
                if (window.speakReply) window.speakReply(res.text);   // answer spoken; sources only shown
                recordMediaTurn('user', userText);     // remember this exchange so the NEXT search resolves „er/das"
                recordMediaTurn('assistant', res.text);
                brain.appendExchange(userText, res.text);   // into the SHARED log → other device sees it too
            } catch (e) {
                hideTyping();
                addMessage('assistant', '❌ Suche fehlgeschlagen: ' + ((e && e.message) || e));
            }
            return true;
        }

        // ---- "/costs" / "sag mir unsere Kosten" → live infra + AI costs, exactly the daily-mail content (Doc) ----
        // Calls infra-usage with { dry:true } (computes + returns body/spoken, sends NO mail). Password-gated like
        // the chat proxy → Solita passes the app password. Shows the full mail body, speaks a concise summary.
        // „unsere Kosten" in natürlicher Sprache (Doc: „was haben wir für Kosten?" = /costs). Verankert auf
        // wir/uns/unsere → kollidiert NICHT mit „was kostet Bitcoin" (= Suche). Kosten-Intent läuft vor Suche.
        const COSTS_INTENT = /^\s*\/costs?\b|\bunsere\s+(kosten|ausgaben)\b|\bkostenstand\b|\binfra.?kosten\b|\bwas\s+kostet\s+uns\b|\bwas\s+haben\s+wir\b[^.?!]{0,25}\b(kosten|gekostet|ausgegeben)\b|\b(was|wie\s?viel|wieviel)\s+kosten\s+wir\b|\bwie\s?viel\s+haben\s+wir\b[^.?!]{0,15}\b(ausgegeben|gekostet)\b/i;
        async function handleCostsIntent(userText) {
            if (!COSTS_INTENT.test(userText)) return false;
            addMessage('user', userText);
            messageInput.value = ''; messageInput.style.height = 'auto';
            addMessage('assistant', '📊 ich hole unsere Kosten …');
            showTyping();
            try {
                const r = await fetch(INFRA_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': getPwd() },
                    body: JSON.stringify({ dry: true }),   // dry → compute + return, but DON'T send the mail
                });
                const d = await r.json().catch(function () { return {}; });
                hideTyping();
                if (!r.ok) throw new Error((d && d.error) || ('infra-usage ' + r.status));
                if (d.html) addTrustedHtmlMessage(d.html);   // the nice table — same one as the daily mail
                else addMessage('assistant', d.body || '(keine Kostendaten)');
                if (window.speakReply) window.speakReply('Hier eine Zusammenstellung der Kosten der letzten 24 Stunden.');
                brain.appendExchange(userText, d.body || '(Kostenübersicht)');   // into the SHARED log → other device sees it too
            } catch (e) {
                hideTyping();
                addMessage('assistant', '❌ Kosten konnten nicht geladen werden: ' + ((e && e.message) || e));
            }
            return true;
        }

        function executeChatSend(userText) {
            addMessage('user', userText);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendButton.disabled = true;
            // DeepSeek can't run tools — if this turn clearly wants one, transparently use Claude just for it.
            modelOverride = (/^deepseek/.test(currentModel) && needsTools(userText)) ? FALLBACK_MODEL : null;
            if (modelOverride && window.DebugWindow) DebugWindow.log('Tool-Bedarf erkannt → ' + modelOverride + ' für diese Anfrage (DeepSeek kann keine Tools)');
            brain.send(userText);   // the brain owns the turn: push history → tool-use loop → render via the wired callbacks
        }

        async function sendMessage() {
            let userText = messageInput.value.trim();
            const pwd = getPwd();

            // Quiet/„Pssst": a TYPED submit answers silently, a VOICE submit speaks. Reset the flag each turn.
            if (window.solitaSetQuiet) window.solitaSetQuiet(!!window.__solitaTyped);
            window.__solitaTyped = false;

            // A pasted image takes priority → ALWAYS Gemini (typed text, if any, is the question about it).
            // Works with no text too, so don't fall into the empty-input return below.
            if (pastedImage) { await handlePastedImage(userText); return; }

            if (!userText) return;

            // Voice: map spoken "slash …" words to the typed command.
            userText = normalizeVoiceCommand(userText);
            // Voice: fix common German-STT mis-hears of English code terms („vor Luke" → „for loop").
            userText = fixSpeechTerms(userText);

            // Built-in slash commands (/clear /logout /wake /pause /list /ui /de /en /es).
            if (await handleBuiltInCommands(userText)) return;

            // Auth gate: no password → show the overlay and stop.
            if (checkAuthAndReturnPwd(pwd) === undefined) return;

            // "/costs" / "sag mir unsere Kosten" → live infra + AI costs (same content as the daily mail).
            if (await handleCostsIntent(userText)) return;

            // "mach ein Foto" → capture NOW (still inside the send tap) + Gemini describes. Before the model.
            if (await handlePhotoIntent(userText)) return;

            // Web search → Gemini grounding (model-independent, even on DeepSeek). Fires on an explicit trigger,
            // OR — right after a search — on a referential follow-up („wie hat er sich verändert", „und in $?").
            if (SEARCH_INTENT.test(userText) || (lastSearchActive && FOLLOWUP_INTENT.test(userText))) {
                lastSearchActive = true;
                await handleSearchIntent(userText);
                return;
            }
            lastSearchActive = false;   // a normal chat turn ends search mode

            // UI-change mode + "stell ein: …" one-shot config → solita-config (live config).
            if (await handleConfigOrUiMode(userText, pwd)) return;

            // Normal turn: hand off to the brain.
            executeChatSend(userText);
        }
        // ----- AUTO-LOGIN & AUTH-INITIALISIERUNG -----
        (async function initAuth() {
            // Auto-unlock from the persisted password on ANY device/origin (Doc 2026-06-15: persist in the
            // browser). verifyPwd re-checks it server-side → a rotated/wrong password falls back to the modal.
            const devPwd = localStorage.getItem('dev_access');
            authDbg('Laden: dev_access ' + (devPwd ? ('vorhanden (len ' + devPwd.length + ')') : 'FEHLT'));

            let success = false;
            if (devPwd && await verifyPwd(devPwd)) {
                sessionPwd = devPwd;
                success = true;
            }
            authDbg('Laden: auto-login=' + success + (devPwd && !success ? ' (dev_access da, aber verify=NEIN → falsches/rotiertes PW?)' : ''));

            if (!success) {
                document.getElementById('cyber-auth-overlay').classList.add('visible');
                const pwdInput = document.getElementById('cyber-pwd-input');
                if (pwdInput) setTimeout(() => pwdInput.focus(), 100);
            } else {
                document.getElementById('cyber-auth-overlay').classList.remove('visible'); // ensure the modal is hidden on auto-login (robustness)
                setTimeout(() => messageInput.focus(), 100);
            }
        })();
