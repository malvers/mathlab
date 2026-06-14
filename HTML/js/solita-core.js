        // DeepSeek proxy — the API key lives server-side as the DEEPSEEK_API_KEY secret, never in this
        // public client (Rule 18). Access is gated by a password the user types; the proxy verifies it
        // server-side against the LABAI_PASSWORD secret. (Old in-source encrypted key was rotated +
        // removed 2026-06-09.)
        const AI_URL  = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
        const SOLITA_CONFIG_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-config'; // Stufe 2a: Solita patcht HTML/config.json live
        const SOLITA_NOTE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-note';     // Stufe 2a: Solita schreibt Notizen + committet
        const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe
        let conversationHistory = [];

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

            if (ok) {
                sessionPwd = pwd;
                const isLocal = location.hostname === "localhost" ||
                    location.hostname === "127.0.0.1" ||
                    location.protocol === "file:" ||
                    location.hostname.startsWith("192.168.");
                if (isLocal) localStorage.setItem('dev_access', pwd);
                document.getElementById('cyber-auth-overlay').classList.remove('visible');
                if (window.solitaStartVoice) solitaStartVoice();   // Doc rule: ear always on — (re)start the wake-word on login
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

        // Conversation-phase indicator: reflect who's "on" right now (listening | thinking | speaking | idle).
        window.solitaPhase = function (s) {
            const el = document.getElementById('solita-phase');
            if (!el) return;
            const LBL = { listening: 'höre zu …', thinking: 'denkt …', speaking: 'Solita spricht …', dormant: 'Slumber' };
            const lbl = el.querySelector('.lbl');
            if (s && LBL[s]) { el.dataset.state = s; if (lbl) lbl.textContent = LBL[s]; }
            else { el.removeAttribute('data-state'); if (lbl) lbl.textContent = ''; }
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
        const HISTORY_KEY = 'ai_history';
        const SUMMARY_KEY = 'solita_summary';

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
            if (!(opts && opts.silent) && window.speakReply) window.speakReply((SOLITA_LANGS[code] || SOLITA_LANGS.de).hi);   // live preview
        };
        document.querySelectorAll('#hh-lang [data-lang]').forEach(function (b) {
            b.addEventListener('click', function () { window.setSolitaLang(b.getAttribute('data-lang')); });
        });
        reflectLang();

        // Solita's persona. Sent as a system turn on every request (the proxy lifts it into Anthropic's
        // top-level `system`). Kept sprechfreundlich because answers are often read aloud.
        const SOLITA_SYSTEM = "Du bist Solita — die persönliche, kluge und warmherzige Assistentin von "
            + "Doc Alvers. Antworte immer in derselben Sprache, in der Doc schreibt oder spricht (Deutsch, "
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
            + "(holt live das aktuelle Wetter aus dem Internet). Setze sie NUR ein, wenn Doc klar darum bittet, "
            + "etwas zu ändern, aufzuschreiben, die Liste zu sehen oder das Wetter zu erfahren; sonst antworte "
            + "einfach. Bestätige eine ausgeführte Aktion knapp in einem Satz.";

        // ----- TOOL-USE (Solita acts, not just talks) -----
        // Tools handed to Claude on every chat turn. Claude calls one only when Doc clearly asks to change a
        // setting or note something down (steered by the persona above). The loop in sendMessage executes it.
        const SOLITA_TOOLS = [
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
                description: 'Hole das aktuelle Wetter + heutige Spanne für einen Ort (live aus dem Internet). Nutze dies, wenn Doc nach dem Wetter fragt. Ohne Ortsangabe wird der aktuelle Standort (GPS) verwendet.',
                input_schema: {
                    type: 'object',
                    properties: { location: { type: 'string', description: 'Ort/Stadt, z.B. "Altea" oder "Dresden". Leer lassen für den aktuellen Standort.' } }
                }
            }
        ];

        // Execute one tool call → returns { ok, summary }. The summary goes back to Claude as the tool_result.
        async function execTool(name, input, pwd) {
            const H = { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd };
            try {
                if (name === 'change_setting') {
                    const r = await fetch(SOLITA_CONFIG_URL, { method: 'POST', headers: H, body: JSON.stringify({ instruction: String((input && input.instruction) || '') }) });
                    const d = await r.json().catch(() => ({}));
                    if (!r.ok) return { ok: false, summary: 'Fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
                    return { ok: true, summary: 'Einstellung geändert (config v' + d.version + ', committet).' };
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
                    return await getWeather(input && input.location);
                }
                return { ok: false, summary: 'Unbekanntes Werkzeug: ' + name };
            } catch (e) { return { ok: false, summary: 'Fehler: ' + ((e && e.message) || e) }; }
        }

        // A short chat line shown while a tool runs.
        function toolBadge(name, input) {
            if (name === 'change_setting') return '🔧 ich ändere die Einstellung …';
            if (name === 'write_note') return '📝 ich notiere „' + ((input && input.note) || '') + '"';
            if (name === 'show_ui_list') return '';   // the table itself is the output → no badge
            if (name === 'get_weather') return '🌤️ ich hole das Wetter' + ((input && input.location) ? ' für ' + input.location : '') + ' …';
            return '⚙️ ' + name;
        }

        // Render the UI-settings table — shared by the /ui command AND the show_ui_list tool. Live from config.json._schema.
        async function renderUiList() {
            try {
                const r = await fetch('config.json?ts=' + Date.now());
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
        async function getWeather(location) {
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
                const w = await fetch('https://api.open-meteo.com/v1/forecast?timezone=auto&forecast_days=1&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&latitude=' + lat + '&longitude=' + lon);
                const j = await w.json();
                const c = j.current || {}, d = j.daily || {};
                const r = (x) => (x == null ? '?' : Math.round(x));
                const summary = 'Wetter in ' + place + ': ' + (WMO[c.weather_code] || ('Code ' + c.weather_code)) + ', ' + r(c.temperature_2m) + '°C (gefühlt ' + r(c.apparent_temperature) + '°C), Wind ' + r(c.wind_speed_10m) + ' km/h, ' + r(c.relative_humidity_2m) + '% Luftfeuchte. Heute ' + r(d.temperature_2m_min && d.temperature_2m_min[0]) + '–' + r(d.temperature_2m_max && d.temperature_2m_max[0]) + '°C, ' + r(d.precipitation_probability_max && d.precipitation_probability_max[0]) + '% Regen.';
                return { ok: true, summary };
            } catch (e) {
                return { ok: false, summary: 'Wetter konnte nicht geladen werden: ' + ((e && e.message) || e) };
            }
        }

        // Rolling summary of older turns so context survives without sending the whole history every time.
        let runningSummary = localStorage.getItem(SUMMARY_KEY) || '';
        const KEEP_RECENT = 16;   // recent turns kept verbatim; older ones get folded into runningSummary

        // Build the proxy payload: persona + rolling summary as a system turn, then the recent chat.
        function buildRequestMessages() {
            const sys = SOLITA_SYSTEM
                + (runningSummary ? "\n\nBisheriger Gesprächskontext (Zusammenfassung):\n" + runningSummary : "");
            return [{ role: 'system', content: sys }].concat(conversationHistory);
        }

        // Keep context bounded WITHOUT just forgetting: fold the oldest turns into runningSummary, drop them.
        async function maybeSummarize() {
            if (conversationHistory.length <= KEEP_RECENT + 8) return;
            const old = conversationHistory.slice(0, conversationHistory.length - KEEP_RECENT);
            const transcript = old.map(m => (m.role === 'user' ? 'Doc' : 'Solita') + ': ' + m.content).join('\n');
            try {
                const r = await fetch(AI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': `Bearer ${SB_ANON}`, 'x-app-pass': getPwd() },
                    body: JSON.stringify({
                        model: 'claude-haiku-4-5-20251001',   // cheap + fast for summarising
                        max_tokens: 600,
                        messages: [
                            { role: 'system', content: 'Fasse den folgenden Gesprächsausschnitt knapp auf Deutsch zusammen — nur Fakten, Wünsche und Beschlüsse, die für das weitere Gespräch wichtig sind. Stichpunktartig, höchstens 8 Zeilen.' + (runningSummary ? ' Beziehe diese bisherige Zusammenfassung mit ein:\n' + runningSummary : '') },
                            { role: 'user', content: transcript }
                        ]
                    })
                });
                if (r.ok) {
                    const d = await r.json();
                    const s = d.choices && d.choices[0] && d.choices[0].message.content;
                    if (s) { runningSummary = s.trim(); localStorage.setItem(SUMMARY_KEY, runningSummary); }
                }
            } catch (e) { /* summarising is best-effort; we trim below either way */ }
            conversationHistory = conversationHistory.slice(-KEEP_RECENT);
            saveHistory();
        }

        const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        function getPwd() { return sessionPwd; }

        let currentModel = localStorage.getItem(MODEL_KEY) || 'claude-sonnet-4-6';
        // Migrate any legacy (DeepSeek) model id → a real Claude model so the proxy gets a valid id.
        if (!/^claude-/.test(currentModel)) currentModel = 'claude-sonnet-4-6';

        function getModel() { return currentModel; }

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
                    if (label) label.textContent = opt.textContent;
                    options.forEach(o => o.classList.toggle('selected', o === opt));
                    dropdownEl.classList.remove('open');
                });
            });
        }

        document.addEventListener('click', () => {
            document.querySelectorAll('.model-select.open').forEach(d => d.classList.remove('open'));
        });

        document.addEventListener('DOMContentLoaded', () => {
            const pwdInput = document.getElementById('cyber-pwd-input');
            if (pwdInput) {
                pwdInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') validateLabAccess();
                });
            }
            initModelDropdown(document.getElementById('modelDropdown'));
        });

        function saveHistory() {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(conversationHistory));
        }

        function loadHistory() {
            try {
                const saved = localStorage.getItem(HISTORY_KEY)
                    || localStorage.getItem('deepseek_history');
                if (!saved) return;
                const history = JSON.parse(saved);
                if (!Array.isArray(history) || history.length === 0) return;
                conversationHistory = history;
                messagesArea.innerHTML = '';
                history.forEach(msg => addMessage(msg.role, msg.content));
            } catch (e) { }
        }

        loadHistory();

        // ----- CHAT-LOGIK -----
        messageInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 110) + 'px';
        });
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        sendButton.addEventListener('click', sendMessage);

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

        async function sendMessage() {
            let userText = messageInput.value.trim();
            const pwd = getPwd();

            if (!userText) return;

            // Voice: spoken "slash ui" / "slash list" arrives as WORDS (not "/ui") → map to the typed command
            // so it triggers instead of going to Claude (which would just "think"). Only known commands convert.
            const _sm = userText.toLowerCase().match(/^(?:slash|splash|flash)\s+(.+?)[\s.!?]*$/);
            if (_sm) {
                const _w = _sm[1].replace(/[.\s]/g, '');   // "u i" / "u.i." → "ui"
                const _M = { ui: 'ui', youeye: 'ui', youi: 'ui', list: 'list', liste: 'list', clear: 'clear', de: 'de', deutsch: 'de', en: 'en', english: 'en', es: 'es', spanish: 'es', 'español': 'es', espanol: 'es' };
                if (_M[_w]) userText = '/' + _M[_w];
            }

            if (userText.toLowerCase() === '/clear') {
                conversationHistory = [];
                runningSummary = '';                       // wipe long-term memory too → a real fresh start
                localStorage.removeItem(HISTORY_KEY);
                localStorage.removeItem(SUMMARY_KEY);
                // Keep the visible transcript on screen (Doc: don't delete the text) — only her MEMORY is wiped.
                // A subtle divider marks the cut; the old bubbles vanish on the next reload (history is empty now).
                messagesArea.insertAdjacentHTML('beforeend', '<div style="text-align:center;opacity:0.45;font-size:0.66rem;letter-spacing:1.5px;text-transform:uppercase;margin:16px 0;font-family:Orbitron,sans-serif;color:#cfe3ff;">— neue Session · Gedächtnis geleert —</div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                return;
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
<div style="font-size:0.82rem;opacity:0.85;"><strong>Tippbefehle:</strong> /clear (neue Session) · /list (diese Tabelle) · /ui (änderbare UI-Elemente) · /de · /en · /es (Sprache)</div>
<div style="font-size:0.78rem;opacity:0.6;margin-top:4px;">Sprache auch per DE / EN / ES im Menü (☰)</div></div></div>`);
                messagesArea.scrollTop = messagesArea.scrollHeight;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                return;
            }

            if (userText.trim().toLowerCase() === '/ui') {   // /ui → the changeable-UI table (shared with the show_ui_list tool)
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
                showTyping();
                await renderUiList();
                hideTyping();
                return;
            }

            const langCmd = userText.toLowerCase().match(/^\/(de|en|es)$/);
            if (langCmd) {                                  // /de · /en · /es → switch language (same as the ☰ buttons)
                if (window.setSolitaLang) window.setSolitaLang(langCmd[1]);
                const names = { de: 'Deutsch', en: 'English', es: 'Español' };
                messagesArea.insertAdjacentHTML('beforeend', '<div style="text-align:center;opacity:0.5;font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;margin:12px 0;font-family:Orbitron,sans-serif;color:#cfe3ff;">— ' + names[langCmd[1]] + ' —</div>');
                messagesArea.scrollTop = messagesArea.scrollHeight;
                messageInput.value = '';
                messageInput.style.height = 'auto';
                return;
            }

            if (!pwd) {
                document.getElementById('cyber-auth-overlay').classList.add('visible');
                setTimeout(() => document.getElementById('cyber-pwd-input')?.focus(), 100);
                return;
            }

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
                return;
            }
            if (!uiMode && wantsEnterUi && !oneShot) {           // enter UI mode
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
                setUiMode(true);
                addMessage('assistant', 'UI-Modus an — sag deinen Wunsch, dann „go" (oder 4 s Pause). „fertig"/EXIT beendet.');
                if (window.speakReply) window.speakReply('UI-Modus an. Sag deinen Wunsch, dann go.');
                return;
            }
            if (uiMode || (oneShot && oneShot[1].trim())) {      // a config instruction
                const instruction = oneShot ? oneShot[1].trim() : t;
                addMessage('user', userText);
                messageInput.value = ''; messageInput.style.height = 'auto';
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
                return;
            }

            addMessage('user', userText);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendButton.disabled = true;
            conversationHistory.push({ role: 'user', content: userText });
            showTyping();

            try {
                // Tool-use loop: send the chat + Solita's tools. If Claude calls a tool, execute it, hand the
                // result back, and continue — until Claude gives a normal answer. Tool turns live ONLY in the
                // local `msgs` array, so conversationHistory stays string-only (no reload/persist surprises).
                let msgs = buildRequestMessages();
                let finalText = '(keine Antwort)';
                let guard = 0;
                while (guard++ < 6) {
                    const response = await fetch(AI_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': SB_ANON,
                            'Authorization': `Bearer ${SB_ANON}`,
                            'x-app-pass': pwd
                        },
                        body: JSON.stringify({
                            model: getModel(),
                            messages: msgs,
                            tools: SOLITA_TOOLS,
                            max_tokens: 3000
                        })
                    });
                    if (!response.ok) {
                        let err = `Fehler ${response.status}`;
                        if (response.status === 401) err = 'Falsches Passwort';
                        else if (response.status === 402) err = 'Nicht genug Guthaben – AI-Konto aufladen';
                        else { try { const e = await response.json(); if (e && e.error) err += ' — ' + e.error; } catch (_) { } }
                        throw new Error(err);
                    }
                    const data = await response.json();
                    const blocks = Array.isArray(data.content) ? data.content : [];
                    const textOut = (data.choices && data.choices[0] && data.choices[0].message.content) || '';

                    // Claude wants to act → execute each tool_use, feed results back, loop. Needs the updated
                    // claude edge fn; an OLD one returns no stop_reason → we fall straight to the text path.
                    if (data.stop_reason === 'tool_use' && blocks.some(b => b && b.type === 'tool_use')) {
                        msgs = msgs.concat([{ role: 'assistant', content: blocks }]);
                        if (textOut.trim()) { hideTyping(); addMessage('assistant', textOut); showTyping(); }
                        const toolResults = [];
                        for (const blk of blocks) {
                            if (!blk || blk.type !== 'tool_use') continue;
                            hideTyping(); const _b = toolBadge(blk.name, blk.input); if (_b) addMessage('assistant', _b); showTyping();
                            const res = await execTool(blk.name, blk.input, pwd);
                            toolResults.push({ type: 'tool_result', tool_use_id: blk.id, content: res.summary, is_error: !res.ok });
                        }
                        msgs = msgs.concat([{ role: 'user', content: toolResults }]);
                        continue;   // let Claude respond to the tool results
                    }

                    finalText = textOut || '(keine Antwort)';
                    break;
                }
                conversationHistory.push({ role: 'assistant', content: finalText });   // persist final text only
                saveHistory();
                hideTyping();
                addMessage('assistant', finalText);
                if (window.speakReply) window.speakReply(finalText); // read the answer aloud (voice mode)
                maybeSummarize();   // fold older turns into the rolling summary (best-effort, background)
            } catch (err) {
                conversationHistory.pop(); // User-Nachricht bei Fehler wieder entfernen
                hideTyping();
                addMessage('assistant', `❌ Fehler: ${err.message}`);
            } finally {
                sendButton.disabled = false;
                messageInput.focus();
            }
        }
        // ----- AUTO-LOGIN & AUTH-INITIALISIERUNG -----
        (async function initAuth() {
            const devPwd = localStorage.getItem('dev_access');
            const isLocal = location.hostname === "localhost" ||
                location.hostname === "127.0.0.1" ||
                location.protocol === "file:" ||
                location.hostname.startsWith("192.168.");

            let success = false;
            if (isLocal && devPwd && await verifyPwd(devPwd)) {
                sessionPwd = devPwd;
                success = true;
            }

            if (!success) {
                document.getElementById('cyber-auth-overlay').classList.add('visible');
                const pwdInput = document.getElementById('cyber-pwd-input');
                if (pwdInput) setTimeout(() => pwdInput.focus(), 100);
            } else {
                setTimeout(() => messageInput.focus(), 100);
            }
        })();
