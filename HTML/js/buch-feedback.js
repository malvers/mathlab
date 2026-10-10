// js/buch-feedback.js — "Fehler melden", the red button at the right end of Solita's line in the interactive textbooks
// (HTML/buch/…; Doc, 10.10.2026: "wir machen in die Solitazeile rechts einen roten Fehler melden button"): the reader speaks
// (or types) what is wrong or unclear, the browser transcribes it at once (js/solita-listen.js), the reader sees and may
// edit the text, and it goes into the table buch_feedback together with its place in the book - book, chapter file,
// section, the block (data-ziel from js/buch.js) and the marked or visible passage. Only the TEXT is stored, never the
// recording. A daily job reads the new reports, checks them against the book and fixes what is really wrong on a branch
// Doc approves (Doc, 09.10.2026: "oben ein Feedback-Knopf … einsprechen, sofort transkribiert, in unsere Datenbank, ein
// Cronjob geht jeden Tag drüber und korrigiert"; 10.10.2026: "ja").
// js/buch.js loads this file; it loads its CSS and, if needed, the speech engine itself.
//
//   buchFeedbackOrt()   debug: exactly the place that would go out with a report now
(function () {
    'use strict';
    const ME = (document.currentScript && document.currentScript.src) || location.href;
    const top = document.querySelector('.b-top');
    if (!top || document.querySelector('.b-meld') || document.body.classList.contains('b-print')) return;

    const V = '2026-10-10e';                          // rides along with the CSS: Pages keeps files 10 minutes
    const url = p => new URL(p + '?v=' + V, ME).href;
    function dbg(m) { if (window.Buch && Buch.dbg) Buch.dbg('[feedback] ' + m); }

    // buch_feedback (supabase/migrations/20261010_buch_feedback.sql): anon may only insert, reading is Doc's alone
    const DB_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
    const DB_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';     // publishable (public by design)
    const STELLE_MAX = 2500, TEXT_MAX = 2000;

    // a random id per browser, only for the rate limit of the table (10 reports per device and hour)
    function geraet() {
        let id = '';
        try { id = localStorage.getItem('buch_feedback_device') || ''; } catch (_) { }
        if (!/^[0-9a-z-]{8,64}$/.test(id)) {
            id = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12));
            try { localStorage.setItem('buch_feedback_device', id); } catch (_) { }
        }
        return id;
    }

    // ---------- the button: red, at the right end of Solita's line; the card hangs under the header like her answers ----------
    // Lucide "flag", "mic", "x" (ISC)
    const FLAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>';
    const MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg>';
    const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

    // the card: placed absolutely in the header (no flex item, so no gap among the header's pills)
    const fb = document.createElement('div');
    fb.className = 'b-meld';
    fb.hidden = true;
    fb.setAttribute('role', 'dialog');
    fb.setAttribute('aria-label', 'Fehler melden');
    fb.innerHTML =
        '<button class="b-meld-x" type="button" title="Schließen (Esc)" aria-label="Schließen">' + X + '</button>' +
        '<div class="b-meld-title">Fehler melden</div>' +
        '<div class="b-meld-wo"></div>' +
        '<label class="b-meld-label" for="b-meld-text">Was ist falsch oder unklar? Sprich einfach los oder tippe.</label>' +
        '<div class="b-meld-row">' +
        '  <button class="b-meld-mic" type="button" title="Einsprechen" aria-label="Einsprechen">' + MIC + '</button>' +
        '  <textarea class="b-meld-text" id="b-meld-text" rows="4" maxlength="' + TEXT_MAX + '" placeholder="Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21."></textarea>' +
        '</div>' +
        // honest about the speech: the browser transcribes, Chrome does it on Google's servers (Doc, 10.10.2026: "ja, schadet nicht")
        '<div class="b-meld-note">Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.</div>' +
        '<div class="b-meld-acts"><span class="b-meld-status" role="status" aria-live="polite"></span>' +
        '  <button class="b-meld-send" type="button">Senden</button></div>';
    top.appendChild(fb);
    const wo = fb.querySelector('.b-meld-wo'), feld = fb.querySelector('.b-meld-text'), mic = fb.querySelector('.b-meld-mic');
    const send = fb.querySelector('.b-meld-send'), status = fb.querySelector('.b-meld-status');

    // the button: js/buch-solita.js builds her line once the box has loaded - it goes in as soon as the line stands
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'b-meld-rot';
    btn.title = 'Fehler melden: einsprechen oder tippen';
    btn.setAttribute('aria-label', 'Fehler melden');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = FLAG + '<span class="b-meld-l">Fehler<br>melden</span>';   // two lines (Doc, 10.10.2026)
    function einsetzen() {
        const row = top.querySelector('.b-solita .sf-row');
        if (!row) return false;
        if (btn.parentNode !== row) row.appendChild(btn);
        return true;
    }
    if (!einsetzen()) {
        const mo = new MutationObserver(() => { if (einsetzen()) mo.disconnect(); });
        mo.observe(top, { childList: true, subtree: true });
    }

    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = url('buch-feedback.css');
    document.head.appendChild(l);
    // the button's own sheet stays out of the colour schemes: white on red everywhere (js/buch-feedback-knopf.css)
    const k = document.createElement('link');
    k.rel = 'stylesheet'; k.href = url('buch-feedback-knopf.css'); k.dataset.fsSkip = '';
    document.head.appendChild(k);

    // ---------- the place in the book ----------
    // the helpers of js/buch-solita.js (what is on screen, the section, a block as text with its formulas as TeX);
    // without them a plainer fallback
    const S = () => window.BuchStelle || null;
    function headOffset() {
        if (S()) return S().headOffset();
        const s = document.querySelector('.b-strip');
        return top.offsetHeight + (s && s.offsetParent !== null ? s.offsetHeight : 0);
    }
    function alsText(node) {
        if (S()) return S().text(node);
        return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }
    function abschnitt() {
        const sec = S() ? S().aktuell() : null;
        return sec ? (sec.dataset.toc || sec.id) : '';
    }
    // what the reader marked in the book: kept from the last selection there (the click on the button keeps it, too)
    let markiert = '', markiertZiel = '';
    document.addEventListener('selectionchange', () => {
        const s = getSelection(), main = document.querySelector('.b-main');
        if (!s || !main || !s.anchorNode || !main.contains(s.anchorNode)) return;   // the panel's field: keep it
        if (s.isCollapsed || !s.rangeCount) { markiert = ''; markiertZiel = ''; return; }
        markiert = alsText(s.getRangeAt(0).cloneContents());
        const a = s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement;
        const z = a && a.closest('[data-ziel]');
        markiertZiel = z ? z.dataset.ziel : '';
    });
    function ort() {
        const teile = location.pathname.split('/');
        const i = teile.lastIndexOf('buch');
        const buch = (i >= 0 && teile[i + 1]) ? teile[i + 1] : (teile[teile.length - 2] || 'buch');
        const seite = teile[teile.length - 1] || 'index.html';
        const off = headOffset();
        const erster = Array.from(document.querySelectorAll('.b-main [data-ziel]')).find(x => x.getBoundingClientRect().bottom > off);
        let stelle = markiert;
        if (!stelle) {
            const main = document.querySelector('.b-main');
            const bloecke = main ? (S() ? S().sichtbar(main, off, innerHeight, []) : [erster].filter(Boolean)) : [];
            stelle = bloecke.map(alsText).filter(Boolean).join('\n');
        }
        if (stelle.length > STELLE_MAX) stelle = stelle.slice(0, STELLE_MAX - 2) + ' …';
        return {
            buch: buch.slice(0, 40),
            seite: seite.slice(0, 80),
            abschnitt: abschnitt().slice(0, 160) || null,
            ziel: (markiertZiel || (erster ? erster.dataset.ziel : '')).slice(0, 200) || null,
            stelle: stelle || null,
            markiert: !!markiert,
            titel: document.title.split(' | ')[0],
        };
    }
    window.buchFeedbackOrt = ort;

    // ---------- open, close ----------
    let offen = false, ortJetzt = null, gesprochen = false, busy = false;
    function zeigeOrt() {
        ortJetzt = ort();
        const t = ortJetzt.titel + (ortJetzt.abschnitt ? ' · ' + ortJetzt.abschnitt : '');
        wo.textContent = (ortJetzt.markiert ? 'Zur Markierung in ' : 'Zu ') + t;
        wo.title = t;
    }
    function setStatus(text, art) {
        status.textContent = text || '';
        status.dataset.art = art || '';
    }
    function layout() {
        if (!offen) return;
        // under Solita's group in the middle of the header, like her answers; never past the header's edges
        const t = top.getBoundingClientRect(), g = top.querySelector('.b-solita-in');
        const r = g && g.offsetParent ? g.getBoundingClientRect() : null;
        const W = Math.min(440, t.width - 24);
        const mitte = r ? r.left + r.width / 2 - t.left : t.width / 2;
        fb.style.width = W + 'px';
        fb.style.left = Math.round(Math.max(12, Math.min(t.width - 12 - W, mitte - W / 2))) + 'px';
    }
    // what already stands in her field goes along - never the password (shown or not: its field asks for it)
    function ausIhremFeld() {
        const f = top.querySelector('.b-solita .sf-in'), eye = top.querySelector('.b-solita .sf-eye');
        if (!f || f.type === 'password' || f.getAttribute('autocomplete') === 'current-password' || (eye && !eye.hidden)) return '';
        return f.value.trim();
    }
    function oeffnen() {
        if (offen) return;
        const vor = ausIhremFeld();
        document.dispatchEvent(new CustomEvent('buch-solita-zu'));   // her answers make room (js/buch-solita.js)
        offen = true;
        if (vor && !feld.value.trim()) feld.value = vor;
        zeigeOrt();
        fb.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('offen');
        setStatus('');
        layout();
        feld.focus({ preventScroll: true });            // a focus in the sticky header jumped the book (js/buch-solita.js)
        if (!mic.hidden && !feld.value.trim()) hoeren(); // speak at once - one click, then talk
    }
    function schliessen() {
        if (!offen) return;
        offen = false;
        stopHoeren();
        fb.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('offen');
    }

    // ---------- speaking: the shared engine of js/solita-listen.js ----------
    let ohr = null, basis = '';
    function ladeOhr() {
        if (window.SolitaListen) return Promise.resolve();
        return new Promise((ok, no) => {
            const s = document.createElement('script');
            s.src = new URL('solita-listen.js', ME).href; s.onload = ok; s.onerror = () => no(new Error('solita-listen.js'));
            document.head.appendChild(s);
        });
    }
    mic.hidden = !(window.SpeechRecognition || window.webkitSpeechRecognition);   // no engine (Firefox): typing only
    function zustand(s) {
        const an = s === 'listening';
        mic.classList.toggle('on', an);
        mic.title = an ? 'Zuhören beenden' : 'Einsprechen';
        mic.setAttribute('aria-label', mic.title);
        if (an) setStatus('Ich höre zu …', 'hoert');
        else if (status.dataset.art === 'hoert') setStatus('');
        if (s === 'unsupported') mic.hidden = true;
    }
    function hoeren() {
        if (mic.hidden) return;
        ladeOhr().then(() => {
            if (!offen) return;
            if (!ohr) {
                // a report wants a moment's thought: 3.5 s of quiet end it (Solita's questions: 2 s), or "bin fertig"
                ohr = window.SolitaListen({
                    lang: 'de-DE', silenceMs: 3500, finishWord: 'bin fertig',
                    onState: zustand,
                    // what is heard goes behind what stood in the field before, live, as with dictation
                    onPartial: t => { feld.value = (basis + ' ' + t).trim(); },
                    onFinal: t => {
                        zustand('idle');                  // the engine hands over the text without an 'idle' of its own
                        if (t) { feld.value = (basis + ' ' + t).trim(); gesprochen = true; }
                        basis = feld.value;
                        feld.focus({ preventScroll: true });
                        feld.setSelectionRange(feld.value.length, feld.value.length);
                    },
                    log: dbg,
                });
            }
            if (ohr.active) return;
            basis = feld.value.trim();
            ohr.start();
        }, e => { dbg('no speech engine: ' + e.message); mic.hidden = true; });
    }
    function stopHoeren() { if (ohr && ohr.active) ohr.stop(); }
    mic.addEventListener('click', () => { if (ohr && ohr.active) stopHoeren(); else hoeren(); });
    feld.addEventListener('input', () => { if (!(ohr && ohr.active)) basis = feld.value; });

    // ---------- sending ----------
    async function senden() {
        if (busy) return;
        stopHoeren();
        const body = feld.value.trim();
        if (body.length < 3) { setStatus('Bitte erst etwas einsprechen oder tippen.', 'fehler'); feld.focus({ preventScroll: true }); return; }
        const o = ortJetzt || ort();
        const zeile = {
            buch: o.buch, seite: o.seite, abschnitt: o.abschnitt, ziel: o.ziel, stelle: o.stelle,
            body: body.slice(0, TEXT_MAX), gesprochen: gesprochen, device: geraet(),
        };
        busy = true; send.disabled = true;
        setStatus('Wird gesendet …', '');
        try {
            const r = await fetch(DB_URL + '/rest/v1/buch_feedback', {
                method: 'POST',
                headers: { apikey: DB_KEY, Authorization: 'Bearer ' + DB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
                body: JSON.stringify(zeile),
            });
            if (r.ok) {
                feld.value = ''; basis = ''; gesprochen = false;
                setStatus('Danke! Deine Meldung ist angekommen.', 'ok');
                dbg('sent ' + zeile.buch + '/' + zeile.seite + ' ' + (zeile.ziel || ''));
                setTimeout(() => { if (status.dataset.art === 'ok') schliessen(); }, 1800);
            } else {
                const t = await r.text();
                dbg('insert ' + r.status + ' ' + t.slice(0, 200));
                setStatus(/too many|daily limit/.test(t) ? 'Gerade sind es zu viele Meldungen. Bitte später noch einmal.'
                    : 'Das hat nicht geklappt. Bitte später noch einmal.', 'fehler');
            }
        } catch (e) {
            dbg('insert failed: ' + e.message);
            setStatus('Keine Verbindung. Bitte später noch einmal.', 'fehler');
        } finally {
            busy = false; send.disabled = false;
        }
    }
    send.addEventListener('click', senden);

    // ---------- keys and clicks ----------
    // the mouse gives the button no focus (in the sticky header that alone scrolled the book) and keeps what was marked
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.addEventListener('click', e => { e.stopPropagation(); if (offen) schliessen(); else oeffnen(); });
    fb.querySelector('.b-meld-x').addEventListener('click', () => { schliessen(); btn.focus({ preventScroll: true }); });
    // keys in the panel stay there: typing must not open the page overview ('o'); Cmd/Ctrl+Enter sends, Esc closes
    fb.addEventListener('keydown', e => {
        e.stopPropagation();
        if (e.key === 'Escape') { e.preventDefault(); schliessen(); btn.focus({ preventScroll: true }); }
        else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); senden(); }
    });
    // a click outside closes it, unless something is still in the field (nothing typed gets lost by a stray click)
    document.addEventListener('mousedown', e => {
        if (offen && !fb.contains(e.target) && !btn.contains(e.target) && !feld.value.trim()) schliessen();
    });
    addEventListener('resize', layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(top);
    dbg('ready');
})();
