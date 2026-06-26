// js/tracker-solita.js — "Solita goes tracker" (Stufe 1: Tap-to-talk).
//
// A self-contained voice button that lets Doc talk to Solita INSIDE the tracker:
//   tap → one-shot Web-Speech STT (de-DE) → the generic Brain (js/solita-brain.js) → Claude (claude proxy)
//   with the change_setting tool → solita-config patches HTML/config.json → tracker-config.js applies it
//   live, no reload (e.g. "mach die Uhr cyan" → --cfg-clock-color). Solita's reply is spoken via the tts fn.
//
// Deliberately LEAN: reuses the battle-tested Brain + Solita's own login password (localStorage 'dev_access',
// same origin docalvers.de). No solita-core UI baggage. NO continuous wake-word yet — tap-to-talk only, so it
// never fights the voice-note recorder for the mic (Stufe 2 = real wake-word + mic arbitration).
(function () {
    // The shared Solita engine must load first: solita-brain.js (LLM loop), solita-voice.js (TTS), solita-listen.js (STT).
    if (!window.Brain || !window.SolitaVoice || !window.SolitaListen) { return; }

    // Shared Solita backend (same project as solita.html). SB_ANON is a publishable, client-safe key.
    const AI_URL  = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
    const CFG_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-config';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';
    const PWD_KEY = 'dev_access'; // Solita stores the app password here (solita-core.js)

    const dbg = (m) => { if (window.DebugWindow && window.DebugWindow.log) window.DebugWindow.log('solita: ' + m); };

    // The edge functions are password-gated. Reuse Solita's stored password; if absent (e.g. Doc never logged
    // into Solita in this browser, or the native APK with a separate origin), ask once and remember it.
    function getPwd() {
        let p = '';
        try { p = localStorage.getItem(PWD_KEY) || ''; } catch (e) { }
        return p;
    }
    function ensurePwd() {
        let p = getPwd();
        if (p) return p;
        try { p = (window.prompt('Solita-Passwort (einmalig):') || '').trim(); } catch (e) { p = ''; }
        if (p) { try { localStorage.setItem(PWD_KEY, p); } catch (e) { } }
        return p;
    }

    const PERSONA =
        'Du bist Solita — Docs persönliche Assistentin, hier eingebettet in seinen GPS-Tracker. Du antwortest ' +
        'kurz und auf Deutsch (ein bis zwei Sätze, denn deine Antwort wird vorgelesen) — keine Aufzählungen, ' +
        'kein Monolog. Du hast das Werkzeug change_setting: damit änderst du sichtbare Tracker-UI-Einstellungen ' +
        '(Farben, Größe, Position, Sichtbarkeit), z.B. "mach die Uhr cyan" oder "Banner nach unten". Setze es ' +
        'NUR ein, wenn Doc klar um eine Änderung bittet, und bestätige die Aktion danach in einem kurzen Satz. ' +
        'Du kannst Doc außerdem NAVIGIEREN: bittet er, irgendwohin gebracht/gefahren zu werden oder um eine Route ' +
        'zu einem Ort, nutze das Werkzeug navigate_to — löse den (oft umgangssprachlichen) Ort aus deinem Wissen zu ' +
        'einer möglichst genauen Adresse auf und übergib sie; bestätige danach kurz, wohin du routest. ' +
        'Sonst antworte einfach kurz und nah.';

    // change_setting → solita-config edits HTML/config.json (the tracker's OWN live config) and commits it;
    // tracker-config.js polls + applies it without a reload. Same pipeline the solita page uses.
    const TOOLS = [{
        name: 'change_setting',
        description: 'Ändere eine sichtbare Tracker-UI-Einstellung (Farben, Größe, Position, z-Index, Sichtbarkeit) per natürlichsprachiger Anweisung, z.B. "mach die Uhr cyan" oder "Banner nach unten". Wird in der Live-Config (config.json) committet und greift ohne Reload.',
        input_schema: {
            type: 'object',
            properties: { instruction: { type: 'string', description: 'Die gewünschte Änderung in natürlicher Sprache.' } },
            required: ['instruction']
        }
    }];

    async function execTool(name, input, pwd) {
        if (name === 'change_setting') {
            try {
                const r = await fetch(CFG_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                    body: JSON.stringify({ instruction: String((input && input.instruction) || '') })
                });
                const d = await r.json().catch(() => ({}));
                if (!r.ok) return { ok: false, summary: 'Fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
                // The change is committed, but it goes live via GitHub Pages + the config poll — so it is NOT
                // instant. The poll no longer runs around the clock (battery), so kick a 3-min fast-poll burst
                // now → the pushed change shows within ~10 s, then polling stops again. Tell Doc to expect a
                // short delay (from the tool result, not the persona prompt).
                try { if (window.TrackerConfig && window.TrackerConfig.burst) window.TrackerConfig.burst(); } catch (e) { }
                return { ok: true, summary: 'Einstellung geändert (config v' + d.version + '). Sag Doc dazu, dass es ein paar Minuten dauern kann, bis er es sieht.' };
            } catch (e) { return { ok: false, summary: 'Fehler: ' + ((e && e.message) || e) }; }
        }
        // Registered add-on tools (e.g. js/solita-navigate.js push into window.SolitaTools) — run their handler.
        const ext = window.SolitaTools && window.SolitaTools.handlers && window.SolitaTools.handlers[name];
        if (ext) { try { return await ext(input, pwd); } catch (e) { return { ok: false, summary: 'Fehler: ' + ((e && e.message) || e) }; } }
        return { ok: false, summary: 'Unbekanntes Werkzeug: ' + name };
    }

    // ---- UI: a reply bubble + a (detached) state element. Solita is now woken by a LONG-PRESS on the
    // map (see below) — there is NO visible "S" button anymore. The button object is kept but never added
    // to the DOM, purely so the existing setState()/btn.disabled bookkeeping keeps working unchanged.
    const btn = document.createElement('button');
    btn.id = 'solita-fab';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Solita fragen');
    btn.innerHTML = '<span>S</span>';
    const bub = document.createElement('div');
    bub.id = 'solita-bubble';
    document.body.appendChild(bub); // only the reply bubble is shown; btn stays detached (invisible)

    let bubTimer = null;
    function bubble(text, sticky) {
        if (bubTimer) { clearTimeout(bubTimer); bubTimer = null; }
        bub.textContent = text || '';
        bub.classList.toggle('show', !!text);
        if (text && !sticky) bubTimer = setTimeout(() => bub.classList.remove('show'), 6000); // auto-fade finished replies
    }
    function setState(s) { btn.setAttribute('data-state', s || ''); }

    // Anchor the status bubble at a screen point (the gesture position) — "… ich höre" + the live transcript
    // pop up right where Doc invoked Solita (right-click / long-press / touch). Clamped on-screen.
    function anchorAt(x, y) {
        bub.classList.remove('top');
        bub.style.width = bub.style.maxWidth = '';
        if (x == null || y == null) { bub.style.left = bub.style.top = bub.style.right = bub.style.transform = ''; return; }
        const cx = Math.max(70, Math.min(window.innerWidth - 70, x));
        const cy = Math.max(72, Math.min(window.innerHeight - 16, y));
        bub.style.left = cx + 'px';
        bub.style.top = cy + 'px';
        bub.style.right = 'auto';
        bub.style.transform = 'translate(-50%, calc(-100% - 14px))'; // float just above the point
    }

    // Anchor the bubble as a wide, centred speech bubble near the TOP — used for Solita's ANSWERS (Doc:
    // "80% breit, ca. 10% unter der Oberkante bzw. 10% unter dem Header, wenn er sichtbar ist").
    function anchorTop() {
        const vh = window.innerHeight;
        const hdr = document.getElementById('hud-top');
        // NOTE: #hud-top is position:fixed → offsetParent is ALWAYS null, so don't use it to test visibility
        // (that was the "zu hoch" bug — header undetected → bubble landed on the stats). Use display + idle.
        const headerVisible = hdr && getComputedStyle(hdr).display !== 'none' && !document.body.classList.contains('ui-idle');
        const ref = headerVisible ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0;
        const gap = headerVisible ? Math.round(0.04 * vh) : Math.round(0.10 * vh); // small gap under the header, else 10% from top
        bub.classList.add('top');
        bub.style.left = '50%';
        bub.style.right = 'auto';
        bub.style.top = (ref + gap) + 'px';
        bub.style.transform = 'translateX(-50%)';
        bub.style.width = bub.style.maxWidth = '80%';
    }

    // ---- Brain (generic conversation + tool-use engine). Own history key so it doesn't mix with solita.html;
    // the cost meter (solita_cost_total + the daily €-cap) is shared, which is what we want — one budget.
    const brain = new window.Brain({
        apiUrl: AI_URL, anonKey: SB_ANON, getPwd: getPwd,
        getModel: function () { return 'claude-sonnet-4-6'; },
        getSystem: function () { return PERSONA; },
        getTools: function () { return TOOLS.concat((window.SolitaTools && window.SolitaTools.specs) || []); },
        execTool: execTool,
        toolBadge: function (n, input) {
            speakBadge(n);
            if (n === 'change_setting') return '🔧 ich ändere die Einstellung …';
            const xb = window.SolitaTools && window.SolitaTools.badges && window.SolitaTools.badges[n];
            return xb ? xb(input) : '';
        },
        storage: { history: 'tracker_solita_history', summary: 'tracker_solita_summary' },
        onTyping: function (on) { if (on) setState('thinking'); },
        onAssistant: function (text) { bubble(text, true); },
        onSpeak: function (text) { speak(text); },
        onError: function (err) { bubble('❌ ' + ((err && err.message) ? err.message : err)); setState(''); btn.disabled = false; },
        onDone: function () { btn.disabled = false; }
    });
    try { brain.load(); } catch (e) { }

    // ---- Voice (TTS) via the SHARED engine (js/solita-voice.js): spoken answers + cached tool badges.
    const BADGE = { change_setting: 'Ich ändere die Einstellung.' };
    function speak(text) { SolitaVoice.speak(text, { onstate: function (on) { setState(on ? 'speaking' : ''); } }); }
    function speakBadge(name) { if (BADGE[name]) SolitaVoice.speakCached('tracker_badge_' + name, BADGE[name]); }

    // ---- Listening (STT) via the SHARED engine (js/solita-listen.js): keeps listening through mid-sentence
    // pauses (~5 s) and finishes on "bin fertig" / a re-trigger. The host only maps the engine's callbacks
    // onto the bubble (state + live transcript) and sends the final text to the brain.
    const ear = SolitaListen({
        silenceMs: 5000,
        log: dbg,
        onState: function (s) {
            if (s === 'listening') setState('listening');
            else if (s === 'unsupported') bubble('Spracherkennung wird hier nicht unterstützt.');
            else { setState(''); bubble(''); }                              // idle: no result / error
        },
        onPartial: function (t) { bubble(t || '… ich höre', true); },       // '' on first start → "… ich höre"
        onFinal: function (q) { anchorTop(); setState('thinking'); btn.disabled = true; dbg('frage: „' + q + '"'); brain.send(q); }
    });
    function listen() {
        if (!ensurePwd()) { bubble('Kein Solita-Passwort — abgebrochen.'); return; }
        ear.start();   // calling again while active stops + submits (the engine toggles)
    }

    // ---- Wake Solita on the map: RIGHT-CLICK (desktop) or a LONG-PRESS (touch). Both anchor the "… ich höre"
    // bubble at the gesture point. A stationary press for HOLD_MS starts listening; drift beyond MOVE_TOL is a
    // pan (not a hold), a second finger (pinch) cancels, and gestures on pins / popups / lightbox or while a
    // panel is open are ignored so Solita never hijacks those.
    (function wireWake() {
        const mapEl = document.getElementById('map');
        if (!mapEl) { btn.addEventListener('click', () => { anchorAt(null, null); listen(); }); return; } // fallback
        const HOLD_MS = 550;   // press this long → Solita wakes
        const MOVE_TOL = 12;   // px of drift allowed before it counts as a pan, not a hold
        let timer = null, sx = 0, sy = 0, pid = null, lastPointerType = '';
        function clear() { if (timer) { clearTimeout(timer); timer = null; } pid = null; }
        function blocked(t) {
            if (t && t.closest && t.closest('.wp-pin, .leaflet-marker-icon, .leaflet-popup, .poi-pin-wrap, .fuel-pin-wrap, #photo-lightbox')) return true;
            if (document.querySelector('.ov-panel.open')) return true;          // a panel owns the screen
            const lb = document.getElementById('photo-lightbox');
            return !!(lb && lb.classList.contains('open'));
        }
        // Right-click (DESKTOP) → wake Solita at the cursor. On TOUCH the OS also fires `contextmenu` on a
        // long-press — but that gesture is already handled by the pointer timer below; firing here too would
        // call listen() twice and the SECOND call toggles it OFF (the "… ich höre" flashed up and vanished —
        // Doc's bug). So: always suppress the native menu, but only WAKE from contextmenu on a mouse.
        mapEl.addEventListener('contextmenu', function (e) {
            if (blocked(e.target)) return;
            e.preventDefault();
            if (lastPointerType === 'touch') { dbg('contextmenu(touch) ignoriert — Long-Press übernimmt'); return; }
            anchorAt(e.clientX, e.clientY);
            listen();
        });
        mapEl.addEventListener('pointerdown', function (e) {
            lastPointerType = e.pointerType;                         // remember mouse vs touch for the contextmenu guard
            if (e.pointerType === 'mouse' && e.button !== 0) return; // right/middle mouse → handled by contextmenu
            if (pid !== null) { clear(); return; }   // second finger (pinch) → cancel
            if (blocked(e.target)) return;
            pid = e.pointerId; sx = e.clientX; sy = e.clientY;
            timer = setTimeout(function () { clear(); dbg('Long-Press → wecke Solita'); anchorAt(sx, sy); listen(); }, HOLD_MS);
        }, { passive: true });
        mapEl.addEventListener('pointermove', function (e) {
            if (timer && (Math.abs(e.clientX - sx) > MOVE_TOL || Math.abs(e.clientY - sy) > MOVE_TOL)) clear();
        }, { passive: true });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
            mapEl.addEventListener(ev, clear, { passive: true });
        });
    })();
    dbg('tracker-solita bereit (Rechtsklick oder lange auf die Karte drücken)');
})();
