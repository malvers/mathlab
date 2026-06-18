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
    if (!window.Brain) { return; } // solita-brain.js must load before this

    // Shared Solita backend (same project as solita.html). SB_ANON is a publishable, client-safe key.
    const AI_URL  = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
    const CFG_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/solita-config';
    const TTS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
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
        if (name !== 'change_setting') return { ok: false, summary: 'Unbekanntes Werkzeug: ' + name };
        try {
            const r = await fetch(CFG_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON, 'x-app-pass': pwd },
                body: JSON.stringify({ instruction: String((input && input.instruction) || '') })
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return { ok: false, summary: 'Fehlgeschlagen: ' + (d.error || ('HTTP ' + r.status)) };
            return { ok: true, summary: 'Einstellung geändert (config v' + d.version + ', committet).' };
        } catch (e) { return { ok: false, summary: 'Fehler: ' + ((e && e.message) || e) }; }
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

    // ---- Brain (generic conversation + tool-use engine). Own history key so it doesn't mix with solita.html;
    // the cost meter (solita_cost_total + the daily €-cap) is shared, which is what we want — one budget.
    const brain = new window.Brain({
        apiUrl: AI_URL, anonKey: SB_ANON, getPwd: getPwd,
        getModel: function () { return 'claude-sonnet-4-6'; },
        getSystem: function () { return PERSONA; },
        getTools: function () { return TOOLS; },
        execTool: execTool,
        toolBadge: function (n) { return n === 'change_setting' ? '🔧 ich ändere die Einstellung …' : ''; },
        storage: { history: 'tracker_solita_history', summary: 'tracker_solita_summary' },
        onTyping: function (on) { if (on) setState('thinking'); },
        onAssistant: function (text) { bubble(text, true); },
        onSpeak: function (text) { speak(text); },
        onError: function (err) { bubble('❌ ' + ((err && err.message) ? err.message : err)); setState(''); btn.disabled = false; },
        onDone: function () { btn.disabled = false; }
    });
    try { brain.load(); } catch (e) { }

    // ---- TTS: speak the reply via the tts edge fn (Google Cloud TTS). No password needed (the fn isn't gated).
    let audio = null;
    function speak(text) {
        const clean = String(text || '').replace(/[*_`#>•]/g, '').replace(/\s+/g, ' ').trim();
        if (!clean) { setState(''); return; }
        setState('speaking');
        fetch(TTS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON },
            body: JSON.stringify({ text: clean, voice: 'de-DE-Studio-C', languageCode: 'de-DE', speakingRate: 1.0 })
        })
            .then((r) => r.json())
            .then((d) => {
                if (d && d.audioContent) {
                    try { if (audio) audio.pause(); } catch (e) { }
                    audio = new Audio('data:audio/mp3;base64,' + d.audioContent);
                    audio.onended = () => setState('');
                    audio.onerror = () => setState('');
                    audio.play().catch(() => setState(''));
                } else { setState(''); }
            })
            .catch(() => setState(''));
    }

    // ---- STT: one-shot Web-Speech (de-DE), same proven pattern as the nav "Ziel"-mic / photo "Falsch" editor.
    let recog = null, listening = false;
    function listen() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { bubble('Spracherkennung wird hier nicht unterstützt.'); return; }
        if (listening) { try { recog && recog.stop(); } catch (e) { } return; } // tap again → stop
        if (!ensurePwd()) { bubble('Kein Solita-Passwort — abgebrochen.'); return; }
        recog = new SR();
        recog.lang = 'de-DE';
        recog.interimResults = true;
        recog.maxAlternatives = 1;
        recog.continuous = false;
        let finalText = '';
        recog.onstart = function () { listening = true; setState('listening'); bubble('… ich höre', true); };
        recog.onresult = function (e) {
            let interim = '';
            for (let k = e.resultIndex; k < e.results.length; k++) {
                const t = e.results[k][0].transcript;
                if (e.results[k].isFinal) finalText += t; else interim += t;
            }
            bubble((finalText + interim).replace(/\s+/g, ' ').trim() || '… ich höre', true);
        };
        recog.onerror = function () { listening = false; setState(''); };
        recog.onend = function () {
            listening = false;
            const q = finalText.replace(/\s+/g, ' ').trim();
            if (q) { setState('thinking'); btn.disabled = true; dbg('frage: „' + q + '"'); brain.send(q); }
            else { setState(''); bubble(''); }
        };
        try { recog.start(); } catch (e) { listening = false; setState(''); }
    }

    // ---- Wake Solita by a LONG-PRESS on the map (replaces the old floating "S" button). A stationary
    // press for HOLD_MS on the bare map starts listening; any finger drift beyond MOVE_TOL is treated as a
    // pan (not a hold), a second finger (pinch-zoom) cancels, and presses on pins / popups / the lightbox or
    // while a panel is open are ignored so Solita never hijacks those gestures.
    (function wireLongPress() {
        const mapEl = document.getElementById('map');
        if (!mapEl) { btn.addEventListener('click', listen); return; } // fallback: keep tap if no map
        const HOLD_MS = 550;   // press this long → Solita wakes
        const MOVE_TOL = 12;   // px of drift allowed before it counts as a pan, not a hold
        let timer = null, sx = 0, sy = 0, pid = null;
        function clear() { if (timer) { clearTimeout(timer); timer = null; } pid = null; }
        function blocked(t) {
            if (t && t.closest && t.closest('.wp-pin, .leaflet-marker-icon, .leaflet-popup, .poi-pin-wrap, .fuel-pin-wrap, #photo-lightbox')) return true;
            if (document.querySelector('.ov-panel.open')) return true;          // a panel owns the screen
            const lb = document.getElementById('photo-lightbox');
            return !!(lb && lb.classList.contains('open'));
        }
        mapEl.addEventListener('pointerdown', function (e) {
            if (pid !== null) { clear(); return; }   // second finger (pinch) → cancel
            if (blocked(e.target)) return;
            pid = e.pointerId; sx = e.clientX; sy = e.clientY;
            timer = setTimeout(function () { clear(); listen(); }, HOLD_MS);
        }, { passive: true });
        mapEl.addEventListener('pointermove', function (e) {
            if (timer && (Math.abs(e.clientX - sx) > MOVE_TOL || Math.abs(e.clientY - sy) > MOVE_TOL)) clear();
        }, { passive: true });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
            mapEl.addEventListener(ev, clear, { passive: true });
        });
    })();
    dbg('tracker-solita bereit (lange auf die Karte drücken)');
})();
