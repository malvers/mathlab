// solita-brain.js — a GENERIC, reusable "brain": the LLM conversation + tool-use engine.
//
// Extracted from solita-core.js so any lab page can drop it in. It owns ONLY the model-conversation
// mechanics: the chat history, the rolling context summary, the request shaping, and the tool-use loop
// (call the proxy → run whatever tool the model asks for via a HOST-supplied executor → feed the result
// back → repeat until a plain answer). It renders nothing, reads no DOM, knows no auth: the host supplies
// the password / model / system prompt / tool layer via config, and is told what to render via callbacks.
// (Pairs with ear.js (hears) and solita-tts.js (speaks): ear + brain + tts = a full assistant, no iframe.)
//
// Usage:
//   const brain = new Brain({
//     apiUrl, anonKey, getPwd, getModel, getSystem, getTools, execTool, toolBadge,
//     summaryModel:'claude-haiku-4-5-20251001', keepRecent:16,
//     storage:{ history:'ai_history', summary:'solita_summary', legacyHistory:'deepseek_history' },
//     onTyping, onAssistant, onSpeak, onError, onDone
//   });
//   const restored = brain.load();   // host renders the restored bubbles (or null if none)
//   brain.send('wie ist das Wetter in Altea');
(function () {
    function Brain(cfg) {
        cfg = cfg || {};
        // ---- config: host wiring (all the app-specific seams) ----
        const apiUrl       = cfg.apiUrl;
        const anonKey      = cfg.anonKey;
        const getPwd       = cfg.getPwd     || function () { return ''; };
        const getModel     = cfg.getModel   || function () { return 'claude-sonnet-4-6'; };
        const getSystem    = cfg.getSystem  || function () { return ''; };           // persona / system prompt
        const getTools     = cfg.getTools   || function () { return []; };           // tool SPECS sent to the model
        const execTool     = cfg.execTool   || function () { return Promise.resolve({ ok: false, summary: 'no executor' }); };
        const toolBadge    = cfg.toolBadge  || function () { return ''; };           // short line shown while a tool runs
        const summaryModel = cfg.summaryModel || 'claude-haiku-4-5-20251001';
        const KEEP_RECENT  = (typeof cfg.keepRecent === 'number') ? cfg.keepRecent : 16;
        const STORE        = cfg.storage || {};
        const HISTORY_KEY        = STORE.history || 'ai_history';
        const SUMMARY_KEY        = STORE.summary || 'solita_summary';
        const LEGACY_HISTORY_KEY = STORE.legacyHistory || '';                        // optional migration source
        // ---- callbacks: the host renders these; no-ops if not given ----
        const onTyping    = cfg.onTyping    || function () { };   // (on) → show/hide the "thinking" indicator
        const onAssistant = cfg.onAssistant || function () { };   // (text) → render an assistant line (interim, badge, final)
        const onSpeak     = cfg.onSpeak     || function () { };   // (finalText) → read the final answer aloud
        const onError     = cfg.onError     || function () { };   // (err) → show the failure
        const onDone      = cfg.onDone      || function () { };   // () → re-enable input etc. (always runs)

        // ---- state (in-memory; persisted to localStorage under the host's keys) ----
        let conversationHistory = [];
        let runningSummary = '';
        try { runningSummary = localStorage.getItem(SUMMARY_KEY) || ''; } catch (e) { }

        const self = this;

        function saveHistory() {
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(conversationHistory)); } catch (e) { }
        }

        // Build the proxy payload: persona + rolling summary as a system turn, then the recent chat.
        function buildRequestMessages() {
            const sys = getSystem()
                + (runningSummary ? "\n\nBisheriger Gesprächskontext (Zusammenfassung):\n" + runningSummary : "");
            return [{ role: 'system', content: sys }].concat(conversationHistory);
        }

        // Keep context bounded WITHOUT just forgetting: fold the oldest turns into runningSummary, drop them.
        async function maybeSummarize() {
            if (conversationHistory.length <= KEEP_RECENT + 8) return;
            const old = conversationHistory.slice(0, conversationHistory.length - KEEP_RECENT);
            const transcript = old.map(m => (m.role === 'user' ? 'Doc' : 'Solita') + ': ' + m.content).join('\n');
            try {
                const r = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey, 'x-app-pass': getPwd() },
                    body: JSON.stringify({
                        model: summaryModel,   // cheap + fast for summarising
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
                    if (s) { runningSummary = s.trim(); try { localStorage.setItem(SUMMARY_KEY, runningSummary); } catch (e) { } }
                }
            } catch (e) { /* summarising is best-effort; we trim below either way */ }
            conversationHistory = conversationHistory.slice(-KEEP_RECENT);
            saveHistory();
        }

        // THE TURN: push the user line, run the tool-use loop, render via callbacks, persist + summarise.
        // If the model calls a tool, execute it (host's executor), feed the result back, and continue —
        // until it gives a normal answer. Tool turns live ONLY in the local `msgs` array, so
        // conversationHistory stays string-only (no reload/persist surprises).
        async function send(userText) {
            const pwd = getPwd();
            conversationHistory.push({ role: 'user', content: userText });
            onTyping(true);
            try {
                let msgs = buildRequestMessages();
                let finalText = '(keine Antwort)';
                let guard = 0;
                while (guard++ < 6) {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey, 'x-app-pass': pwd },
                        body: JSON.stringify({ model: getModel(), messages: msgs, tools: getTools(), max_tokens: 3000 })
                    });
                    if (!response.ok) {
                        let err = 'Fehler ' + response.status;
                        if (response.status === 401) err = 'Falsches Passwort';
                        else if (response.status === 402) err = 'Nicht genug Guthaben – AI-Konto aufladen';
                        else { try { const e = await response.json(); if (e && e.error) err += ' — ' + e.error; } catch (_) { } }
                        throw new Error(err);
                    }
                    const data = await response.json();
                    const blocks = Array.isArray(data.content) ? data.content : [];
                    const textOut = (data.choices && data.choices[0] && data.choices[0].message.content) || '';

                    // Model wants to act → execute each tool_use, feed results back, loop. Needs the updated
                    // claude edge fn; an OLD one returns no stop_reason → we fall straight to the text path.
                    if (data.stop_reason === 'tool_use' && blocks.some(b => b && b.type === 'tool_use')) {
                        msgs = msgs.concat([{ role: 'assistant', content: blocks }]);
                        if (textOut.trim()) { onTyping(false); onAssistant(textOut); onTyping(true); }
                        const toolResults = [];
                        for (const blk of blocks) {
                            if (!blk || blk.type !== 'tool_use') continue;
                            onTyping(false); const _b = toolBadge(blk.name, blk.input); if (_b) onAssistant(_b); onTyping(true);
                            const res = await execTool(blk.name, blk.input, pwd);
                            toolResults.push({ type: 'tool_result', tool_use_id: blk.id, content: res.summary, is_error: !res.ok });
                        }
                        msgs = msgs.concat([{ role: 'user', content: toolResults }]);
                        continue;   // let the model respond to the tool results
                    }

                    finalText = textOut || '(keine Antwort)';
                    break;
                }
                conversationHistory.push({ role: 'assistant', content: finalText });   // persist final text only
                saveHistory();
                onTyping(false);
                onAssistant(finalText);
                onSpeak(finalText);
                maybeSummarize();   // fold older turns into the rolling summary (best-effort, background)
            } catch (err) {
                conversationHistory.pop();   // drop the user turn on failure
                onTyping(false);
                onError(err);                // host clears the stuck indicator (e.g. fetch aborted by an app-switch)
            } finally {
                onDone();
            }
        }

        // Load persisted history into memory; returns the array for the host to render (or null if none).
        function load() {
            try {
                const saved = localStorage.getItem(HISTORY_KEY) || (LEGACY_HISTORY_KEY ? localStorage.getItem(LEGACY_HISTORY_KEY) : null);
                if (!saved) return null;
                const history = JSON.parse(saved);
                if (!Array.isArray(history) || history.length === 0) return null;
                conversationHistory = history;
                return history;
            } catch (e) { return null; }
        }

        // Wipe memory (history + rolling summary + their storage). The host keeps the visible transcript.
        function clear() {
            conversationHistory = [];
            runningSummary = '';
            try { localStorage.removeItem(HISTORY_KEY); localStorage.removeItem(SUMMARY_KEY); } catch (e) { }
        }

        // ---- public API ----
        self.send = send;
        self.load = load;
        self.clear = clear;
        self.getHistory = function () { return conversationHistory; };
    }

    window.Brain = Brain;
})();
