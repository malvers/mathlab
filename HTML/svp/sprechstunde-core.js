// Sprechstunde - what the pupils' page (svp/sprechstunde.html) and Doc's Kontakt app
// (kontakt/index.html) share: the red phone, the function calls, time labels and the
// message bubbles. Look: sprechstunde.css. Tables + functions: supabase/migrations/20261029_chat.sql.
// Needs svp-auth.js (DB_URL / DB_KEY). Exposes window.Sprechstunde.
(function () {
    /* The red telephone Doc asked for (29.10.2026: "Als Icon ein rotes fon" - a telephone, not a handset):
       Apple's ☎️ as an image from the set VGP and the buzzer use, so every phone shows the same one. */
    const PHONE = '<img class="sp-phone-ico" alt="" draggable="false" '
        + 'src="https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/260e-fe0f.png">';
    /* Lucide "send" (ISC licence) */
    const SEND_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';

    const MAX_LEN = 1000;            // characters per message, before sealing
    const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    function auth() {
        if (!window.svpAuth) throw new Error('svp-auth.js fehlt');
        return window.svpAuth;
    }

    /* Anonymous function call (the pupils' way in). Errors carry the database's own sentence. */
    async function rpc(name, args) {
        const a = auth();
        const res = await fetch(a.DB_URL + '/rest/v1/rpc/' + name, {
            method: 'POST',
            headers: { apikey: a.DB_KEY, Authorization: 'Bearer ' + a.DB_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify(args || {})
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            const err = new Error((data && data.message) || ('HTTP ' + res.status));
            err.status = res.status;
            throw err;
        }
        return data;
    }

    /* Is the Sprechstunde set up in the database? (an empty key reads nothing and changes nothing)
       Until the SQL has run, the red phone and the VGP row stay out of sight instead of failing. */
    let ready = null;
    function available() {
        if (!ready) ready = rpc('chat_read', { p_key: '' }).then(() => true, () => false);
        return ready;
    }

    /* "heute 12:40", "gestern 18:02", "Mo 27.10. 09:15" */
    function fmtTime(iso) {
        const d = new Date(iso), now = new Date();
        const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        const day = x => x.getFullYear() * 10000 + x.getMonth() * 100 + x.getDate();
        const y = new Date(now); y.setDate(now.getDate() - 1);
        if (day(d) === day(now)) return 'heute ' + hm;
        if (day(d) === day(y)) return 'gestern ' + hm;
        return DAYS[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '. ' + hm;
    }

    /* One bubble. mine = right side; text is set as text, never as HTML. */
    function bubble(m) {
        const el = document.createElement('div');
        el.className = 'sp-msg ' + (m.mine ? 'mine' : 'theirs') + (m.state ? ' ' + m.state : '');
        if (m.id != null) el.dataset.id = m.id;
        const body = document.createElement('div');
        body.className = 'sp-body';
        body.textContent = m.text;
        const meta = document.createElement('div');
        meta.className = 'sp-meta';
        meta.textContent = m.state === 'pending' ? 'wird gesendet …' : m.state === 'failed' ? 'nicht gesendet' : fmtTime(m.at);
        el.append(body, meta);
        return el;
    }

    /* Paint a whole conversation; stays at the bottom if it was there before. */
    function paint(box, msgs, emptyText) {
        const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 40;
        box.innerHTML = '';
        if (!msgs.length) {
            const e = document.createElement('p');
            e.className = 'sp-empty';
            e.textContent = emptyText || 'Noch keine Nachrichten.';
            box.appendChild(e);
            return;
        }
        for (const m of msgs) box.appendChild(bubble(m));
        if (atBottom || box.dataset.painted !== '1') box.scrollTop = box.scrollHeight;
        box.dataset.painted = '1';
    }

    /* The compose field grows with its text, up to the CSS max-height. The border counts into the
       height (border-box), and the scroll bar only comes once the field is full - before, a one-line
       field showed a white bar (Doc's screenshot, 29.10.2026). */
    function autoGrow(ta) {
        const fit = () => {
            ta.style.height = 'auto';
            const want = ta.scrollHeight + ta.offsetHeight - ta.clientHeight;
            const max = parseFloat(getComputedStyle(ta).maxHeight) || Infinity;
            ta.style.height = Math.min(want, max) + 'px';
            ta.style.overflowY = want > max ? 'auto' : 'hidden';
        };
        ta.addEventListener('input', fit);
        fit();
        return fit;
    }

    /* The red telephone opens the chat in a window of its own, the size of a phone (Doc, 29.10.2026:
       "in einem extra Fenster ... dass klar ist, hier wird gechattet"). On a phone or a touch screen
       the link just opens the page - a popup there is only a new tab. */
    /* No browser window of its own (Doc, 29.10.2026: "das muss kein wirkliches Fenster sein"): on a computer
       the chat lies over the plan as a card on a dimmed page, the chat page inside a frame (look: .sp-layer
       in meinplan.css). ✕ in its head, Esc or a click beside the card closes it. A phone opens the page. */
    function openChat(link) {
        let layer = null;
        const close = () => {
            if (!layer) return;
            layer.remove();
            layer = null;
            link.focus();
        };
        addEventListener('message', e => { if (e.origin === location.origin && e.data === 'svp-kontakt-close') close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        link.addEventListener('click', e => {
            if (matchMedia('(pointer: coarse)').matches || innerWidth < 700) return;
            e.preventDefault();
            if (layer) return;
            layer = document.createElement('div');
            layer.className = 'sp-layer';
            const frame = document.createElement('iframe');
            frame.name = 'svp-kontakt';
            frame.title = 'Kontakt';
            frame.src = link.href;
            layer.appendChild(frame);
            layer.addEventListener('click', ev => { if (ev.target === layer) close(); });
            document.body.appendChild(layer);
            frame.focus();
        });
    }

    /* In that frame the back arrow becomes ✕ at the top right and closes the chat (nothing to go back to). */
    function backOrClose(el) {
        if (!el || window.parent === window || window.name !== 'svp-kontakt') return;
        el.title = 'Schließen';
        el.setAttribute('aria-label', 'Schließen');
        el.classList.add('sp-x');
        el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        const close = () => parent.postMessage('svp-kontakt-close', location.origin);
        el.addEventListener('click', e => { e.preventDefault(); close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* Run fn now, then every `ms` while the page is visible, and right away when it comes back. */
    function poll(fn, ms) {
        let timer = null;
        const tick = () => { if (document.visibilityState === 'visible') fn(); };
        const start = () => { clearInterval(timer); timer = setInterval(tick, ms); };
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { fn(); start(); } });
        fn();
        start();
    }

    window.Sprechstunde = { PHONE, SEND_SVG, MAX_LEN, rpc, available, fmtTime, bubble, paint, autoGrow, poll, openChat, backOrClose };
})();
