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
        // apiUrl may be a plain string OR a function (model) → url, so the host can route by model (e.g.
        // Claude vs DeepSeek live on different proxy functions). The summariser resolves its OWN model's url.
        const apiUrl       = cfg.apiUrl;
        const resolveUrl   = (typeof apiUrl === 'function') ? apiUrl : function () { return apiUrl; };
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
        const onPersist   = cfg.onPersist   || function () { };   // () → history changed; host may sync it (solita-sync.js)
        const onCost      = cfg.onCost      || function () { };   // (eurThisQuery, eurTotalAllTime) → host shows per-query + running total

        // ---- state (in-memory; persisted to localStorage under the host's keys) ----
        let conversationHistory = [];
        let runningSummary = '';
        let inFlight = null;   // AbortController for the running turn → host can cancel (e.g. tap-to-stop)
        try { runningSummary = localStorage.getItem(SUMMARY_KEY) || ''; } catch (e) { }

        const self = this;

        function saveHistory() {
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(conversationHistory)); } catch (e) { }
        }

        // Build the proxy payload. Persona (static) and the rolling summary (volatile) go as TWO SEPARATE
        // system turns so the edge fn can cache the big persona on its OWN breakpoint (read ~0.1× every turn).
        // Gluing them meant any summary change re-wrote the whole persona at 1.25× — the cache_creation churn
        // Doc measured (2196w per turn). Split, a summary change re-reads only its own few hundred tokens.
        function buildRequestMessages() {
            const msgs = [{ role: 'system', content: getSystem() }];
            if (runningSummary) msgs.push({ role: 'system', content: "Bisheriger Gesprächskontext (Zusammenfassung):\n" + runningSummary });
            return msgs.concat(conversationHistory);
        }

        // --- Kosten-Zähler (Doc: ab sofort Transparenz). Preise $/1M Tokens; Cache-Read ~0,1×, Write 1,25×.
        // Rechnet je API-Hop (AUCH jeder Tool-Loop-Schritt) aus `usage` die € aus, loggt ins DEBUG-Fenster mit
        // Cache-Trefferquote (springt nach dem Caching-Deploy von 0% hoch) und summiert in localStorage.
        const PRICES = { 'claude-sonnet-4-6': [3, 15], 'claude-opus-4-8': [5, 25], 'claude-haiku-4-5': [1, 5],
                         'deepseek-chat': [0.27, 1.10], 'deepseek-reasoner': [0.55, 2.19] }; // [in,out] $/1M (DeepSeek ~10× günstiger; Preise können sich ändern)
        const USD_EUR = 0.92;
        const COST_KEY = STORE.cost || 'solita_cost_total';
        // Hard DAILY €-brake (Doc: die 5€ sollen halten). accountUsage only ever counted UP, never blocked —
        // a stuck tab or a pathological tool-loop could fire paid requests until the balance is gone. We tally
        // spend per calendar day and refuse new Claude calls once the day's cap is hit. Tune via cfg.dailyCapEur.
        const DAY_CAP_EUR     = (typeof cfg.dailyCapEur === 'number') ? cfg.dailyCapEur : 1.5;
        const DAY_COST_PREFIX = STORE.dayCost || 'solita_cost_day_';
        function dayCostKey() { return DAY_COST_PREFIX + new Date().toISOString().slice(0, 10); }
        function daySpentEur() { try { return parseFloat(localStorage.getItem(dayCostKey()) || '0') || 0; } catch (e) { return 0; } }
        function totalSpentEur() { try { return parseFloat(localStorage.getItem(COST_KEY) || '0') || 0; } catch (e) { return 0; } } // running grand total (all-time)
        function priceFor(model) {
            const k = model && Object.keys(PRICES).find(function (p) { return model.indexOf(p) === 0; });
            return PRICES[k] || PRICES['claude-sonnet-4-6'];
        }
        function accountUsage(model, u, label) {
            if (!u) return;
            // Usage field names differ: Claude → input_tokens / output_tokens / cache_read_input_tokens.
            // DeepSeek (OpenAI shape) → prompt_tokens (INCLUDES cache hits) / completion_tokens /
            // prompt_cache_hit_tokens. So for DeepSeek the uncached input = prompt − cache_hit.
            const cr = (u.cache_read_input_tokens != null) ? u.cache_read_input_tokens : (u.prompt_cache_hit_tokens || 0);
            const inTok = (u.input_tokens != null) ? u.input_tokens : Math.max(0, (u.prompt_tokens || 0) - cr);
            const outTok = (u.output_tokens != null) ? u.output_tokens : (u.completion_tokens || 0);
            const cw = u.cache_creation_input_tokens || 0;
            const p = priceFor(model);
            // Cache pricing differs by provider: Anthropic bills cache-READ ~0.1× and cache-WRITE 1.25×.
            // DeepSeek has no write premium and its cache-HIT input ≈ 0.26× ($0.07 vs 0.27 / $0.14 vs 0.55).
            const isDS = /^deepseek/.test(model || '');
            const readMul = isDS ? 0.26 : 0.1, writeMul = isDS ? 1 : 1.25;
            const eur = (inTok * p[0] + cr * p[0] * readMul + cw * p[0] * writeMul + outTok * p[1]) / 1e6 * USD_EUR;
            let total = 0; try { total = parseFloat(localStorage.getItem(COST_KEY) || '0') || 0; } catch (e) { }
            total += eur;
            try { localStorage.setItem(COST_KEY, String(total)); } catch (e) { }
            try { localStorage.setItem(dayCostKey(), String(daySpentEur() + eur)); } catch (e) { } // per-day tally for the hard brake
            const totIn = inTok + cr + cw;
            const hit = totIn ? Math.round(cr / totIn * 100) : 0;
            if (window.DebugWindow) window.DebugWindow.log('€ ' + (label || 'chat') + ': ↑' + inTok + ' ↓' + outTok
                + ' · Cache ' + hit + '% (' + cr + 'r/' + cw + 'w) · ' + (eur * 100).toFixed(2) + '¢ · Σ ' + total.toFixed(3) + ' €');
            if (typeof window.solitaCostUpdate === 'function') { try { window.solitaCostUpdate(total); } catch (e) { } }
            return eur;   // so the caller can sum a whole query's cost (tool-loop hops) for the per-query display
        }

        // Keep context bounded WITHOUT just forgetting: fold the oldest turns into runningSummary, drop them.
        async function maybeSummarize() {
            if (conversationHistory.length <= KEEP_RECENT + 8) return;
            const old = conversationHistory.slice(0, conversationHistory.length - KEEP_RECENT);
            const transcript = old.map(m => (m.role === 'user' ? 'Doc' : 'Solita') + ': ' + m.content).join('\n');
            try {
                const r = await fetch(resolveUrl(summaryModel), {   // summariser routes by ITS model (Claude-Haiku) → claude proxy
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
                    accountUsage(summaryModel, d.usage, 'summary');   // cost meter: the background summariser too
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
        function checkDailyCapAtStart() {
            // Hard daily brake: refuse the whole turn once today's spend hit the cap (protects the 5€).
            if (daySpentEur() >= DAY_CAP_EUR) {
                onError(new Error('Solita-Tageslimit (' + DAY_CAP_EUR.toFixed(2) + ' €) erreicht — Schutz gegen Leerlauf. Morgen wieder, oder cfg.dailyCapEur erhöhen.'));
                onDone();
                return false;
            }
            return true;
        }

        async function callModel(msgs, pwd) {
            const response = await fetch(resolveUrl(getModel()), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey, 'x-app-pass': pwd },
                body: JSON.stringify({ model: getModel(), messages: msgs, tools: getTools(), max_tokens: 3000 }),
                signal: inFlight ? inFlight.signal : undefined   // lets abort() cancel the turn mid-flight
            });
            if (!response.ok) {
                let err = 'Fehler ' + response.status;
                if (response.status === 401) err = 'Falsches Passwort';
                else if (response.status === 402) err = 'Nicht genug Guthaben – AI-Konto aufladen';
                else { try { const e = await response.json(); if (e && e.error) err += ' — ' + e.error; } catch (_) { } }
                throw new Error(err);
            }
            return await response.json();
        }

        async function executeToolRound(msgs, blocks, textOut, pwd) {
            // Model wants to act → record its turn, surface any interim text, then execute each tool_use
            // and feed the results back as a user turn. Returns the extended message list for the next hop.
            msgs = msgs.concat([{ role: 'assistant', content: blocks }]);
            if (textOut.trim()) { onTyping(false); onAssistant(textOut); onTyping(true); }
            const toolResults = [];
            for (const blk of blocks) {
                if (!blk || blk.type !== 'tool_use') continue;
                onTyping(false); const _b = toolBadge(blk.name, blk.input); if (_b) onAssistant(_b); onTyping(true);
                const res = await execTool(blk.name, blk.input, pwd);
                toolResults.push({ type: 'tool_result', tool_use_id: blk.id, content: res.summary, is_error: !res.ok });
            }
            return msgs.concat([{ role: 'user', content: toolResults }]);
        }

        async function runToolUseLoop(msgs, pwd) {
            let finalText = '(keine Antwort)';
            let guard = 0;
            let turnEur = 0;   // sum of all hops in THIS query (tool-loop included) → per-query cost
            while (guard++ < 6) {
                // Mid-turn brake: a pathological tool-loop must not blow past the daily cap either.
                if (daySpentEur() >= DAY_CAP_EUR) { finalText = 'Tageslimit erreicht — ich stoppe hier, damit das Guthaben hält.'; break; }
                const data = await callModel(msgs, pwd);
                turnEur += accountUsage(getModel(), data.usage, 'chat') || 0;   // cost meter: every hop (tool-loop included)
                const blocks = Array.isArray(data.content) ? data.content : [];
                const textOut = (data.choices && data.choices[0] && data.choices[0].message.content) || '';

                // Needs the updated claude edge fn; an OLD one returns no stop_reason → we fall straight to the text path.
                if (data.stop_reason === 'tool_use' && blocks.some(b => b && b.type === 'tool_use')) {
                    msgs = await executeToolRound(msgs, blocks, textOut, pwd);
                    continue;   // let the model respond to the tool results
                }

                finalText = textOut || '(keine Antwort)';
                break;
            }
            return { finalText, turnEur };
        }

        function finalizeAndSave(finalText, turnEur) {
            conversationHistory.push({ role: 'assistant', content: finalText });   // persist final text only
            saveHistory();
            onPersist();        // host may push the updated log to the shared server (solita-sync.js)
            onTyping(false);
            onAssistant(finalText);
            onCost(turnEur, totalSpentEur(), getModel());    // per-query cost + all-time total + the model that produced it (colour)
            onSpeak(finalText);
            maybeSummarize();   // fold older turns into the rolling summary (best-effort, background)
        }

        async function send(userText) {
            const pwd = getPwd();
            if (!checkDailyCapAtStart()) return;   // daily cap hit → onError + onDone already fired, drop the turn
            conversationHistory.push({ role: 'user', content: userText });
            inFlight = new AbortController();
            onTyping(true);
            try {
                const msgs = buildRequestMessages();
                const { finalText, turnEur } = await runToolUseLoop(msgs, pwd);
                finalizeAndSave(finalText, turnEur);
            } catch (err) {
                conversationHistory.pop();   // drop the user turn on failure
                onTyping(false);
                // A user-triggered abort (tap-to-stop) is NOT an error → clean up quietly, no red bubble.
                if (!(err && err.name === 'AbortError')) onError(err);
            } finally {
                inFlight = null;
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
            onPersist();   // propagate the wipe to the shared server too (solita-sync.js)
        }

        // Adopt a history (and optionally summary) from outside — e.g. a merged log pulled from the shared
        // server (solita-sync.js). Persists locally so a reload shows the same merged state.
        function setState(history, summary) {
            if (Array.isArray(history)) { conversationHistory = history; saveHistory(); }
            if (typeof summary === 'string') {
                runningSummary = summary;
                try { localStorage.setItem(SUMMARY_KEY, runningSummary); } catch (e) { }
            }
        }

        // ---- public API ----
        self.send = send;
        self.abort = function () { try { if (inFlight) inFlight.abort(); } catch (e) { } };   // cancel the running turn
        self.load = load;
        self.clear = clear;
        self.getHistory = function () { return conversationHistory; };
        self.getSummary = function () { return runningSummary; };
        self.setState = setState;
    }

    window.Brain = Brain;
})();
