        // DeepSeek proxy — the API key lives server-side as the DEEPSEEK_API_KEY secret, never in this
        // public client (Rule 18). Access is gated by a password the user types; the proxy verifies it
        // server-side against the LABAI_PASSWORD secret. (Old in-source encrypted key was rotated +
        // removed 2026-06-09.)
        const AI_URL  = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
        const SOLITA_CONFIG_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-config'; // Stufe 2a: Solita patcht HTML/config.json live
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

        // Solita's persona. Sent as a system turn on every request (the proxy lifts it into Anthropic's
        // top-level `system`). Kept sprechfreundlich because answers are often read aloud.
        const SOLITA_SYSTEM = "Du bist Solita — die persönliche, kluge und warmherzige Assistentin von "
            + "Doc Alvers. Du sprichst Deutsch und antwortest natürlich und warm. WICHTIG: Fasse dich kurz "
            + "— normalerweise ein bis zwei Sätze, denn deine Antworten werden meist vorgelesen. Keine "
            + "Aufzählungen oder Monologe, wenn ein Satz reicht; lieber kurz nachfragen als lang ausholen. "
            + "Nur wenn Doc ausdrücklich um Details bittet, wirst du ausführlicher. Du weißt viel und "
            + "bleibst nah. Was du nicht sicher weißt, sagst du ehrlich.";

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
            const userText = messageInput.value.trim();
            const pwd = getPwd();

            if (!userText) return;

            if (userText.toLowerCase() === '%clear') {
                conversationHistory = [];
                localStorage.removeItem(HISTORY_KEY);
                messagesArea.innerHTML = `<div class="message assistant" style="align-items:center;gap:10px;width:100%;"><div class="message-content"><strong>Wie kann ich Dir helfen?</strong></div><div class="model-select" id="modelDropdown"><div class="model-select-display" id="modelDisplay"><span id="modelLabel">SONNET 4.6</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div><div class="model-select-options" id="modelOptions"><div class="model-option" data-value="claude-opus-4-8">OPUS 4.8</div><div class="model-option selected" data-value="claude-sonnet-4-6">SONNET 4.6</div><div class="model-option" data-value="claude-haiku-4-5-20251001">HAIKU 4.5</div></div></div></div>`;
                initModelDropdown(document.getElementById('modelDropdown'));
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
                        messages: buildRequestMessages(),
                        temperature: 0.6,
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
                const reply = (data.choices && data.choices[0] && data.choices[0].message.content) || '(keine Antwort)';
                conversationHistory.push({ role: 'assistant', content: reply });
                saveHistory();
                hideTyping();
                addMessage('assistant', reply);
                if (window.speakReply) window.speakReply(reply); // read the answer aloud (voice mode)
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
