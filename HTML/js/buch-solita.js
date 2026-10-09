// js/buch-solita.js — Solita in the header of the interactive textbooks (HTML/buch/…), as in the decks: her picture in
// the middle of the header, a click opens the question line (mic, field), a click with the line open switches between
// Solita and Doc (Doc, 09.10.2026: "da zentral in der Mitte hätte ich das gerne, sowohl ich als auch Solita. Genauso
// wie es in Decks gemacht ist"). The box itself - password, question, her voice, karaoke, menu, mic - is the shared
// js/solita-frage.js; what is the book's own stays here: the place in the header, the answers under it, and the
// context - not the whole chapter, only what the reader has on screen right now ("das, wo man gerade ist").
// js/buch.js loads this file; it loads the box's files itself, so no chapter page needs a new line.
// Unlike the decks with holds (decks/deck.js), the book hands her every solution and she works any task out when
// asked (Doc, 09.10.2026: "Im Buch alles vorrechnen").
//
//   buchSolitaKontext('Aufgabe 3?')   debug: exactly what would go out with this question
(function () {
    'use strict';
    const ME = (document.currentScript && document.currentScript.src) || location.href;
    const top = document.querySelector('.b-top');
    if (!top || document.querySelector('.b-solita') || document.body.classList.contains('b-print')) return;

    // the version rides along with every file of the box: Pages keeps files 10 minutes, an older copy must not win
    const V = '2026-10-09e';
    const url = p => new URL(p + '?v=' + V, ME).href;
    function css(p) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = url(p);
        document.head.appendChild(l);
    }
    function load(p) {
        return new Promise((ok, no) => {
            const s = document.createElement('script');
            s.src = url(p); s.onload = ok; s.onerror = () => no(new Error(p));
            document.head.appendChild(s);
        });
    }
    function dbg(m) { if (window.Buch && Buch.dbg) Buch.dbg('[solita] ' + m); }

    // ---------- her place: the middle of the header ----------
    const SOLITA_PIC = new URL('../resources/solita-avatar.png', ME).href;
    const DOC_PIC = new URL('../resources/team/alvers_avatar.jpg', ME).href;
    // Lucide "x" (ISC)
    const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    let istDoc = false;                               // the box remembers who answers, per page - shown at once, no flash
    try { istDoc = localStorage.getItem('solita_voice:' + location.pathname) === 'doc'; } catch (_) { }
    const ask = document.createElement('div');
    ask.className = 'b-solita';
    ask.innerHTML = '<div class="b-solita-in"><button class="b-solita-btn" type="button"><img alt="" width="34" height="34"></button>' +
        '<div class="b-solita-line"></div></div>' +
        '<div class="b-solita-panel" hidden><button class="b-solita-x" type="button" title="Schließen (Esc)" aria-label="Schließen">' + X + '</button></div>';
    const brand = top.querySelector('.b-brand');
    if (brand) brand.after(ask); else top.prepend(ask);
    const inner = ask.querySelector('.b-solita-in'), btn = ask.querySelector('.b-solita-btn'), face = btn.querySelector('img');
    const line = ask.querySelector('.b-solita-line'), panel = ask.querySelector('.b-solita-panel');
    let offen = false;
    function zeigeWer() {
        face.src = istDoc ? DOC_PIC : SOLITA_PIC;
        face.alt = istDoc ? 'Doc Alvers' : 'Solita';
        btn.title = offen ? 'Klick: zu ' + (istDoc ? 'Solita' : 'Doc') + ' wechseln' : 'Frag ' + (istDoc ? 'Doc' : 'Solita');
        btn.setAttribute('aria-label', btn.title);
    }
    zeigeWer();
    document.addEventListener('solita-wer', e => { istDoc = !!(e.detail && e.detail.name === 'Doc'); zeigeWer(); });

    // ---------- her instructions for the book; who she is (Solita, or Doc in his voice) the box puts in front ----------
    const SYS = 'Du hilfst Schülerinnen und Schülern der Klassen 11 bis 13 am Beruflichen Gymnasium. Sie arbeiten allein '
        + 'mit Doc Alvers interaktivem Lehrbuch Mathematik. Du bekommst eine Übersicht des Kapitels und genau die Stelle, '
        + 'die gerade auf dem Bildschirm steht: Erklärungen, Merkkästen, Beispiele, Aufgaben samt Tipps und Lösungen - hat '
        + 'die Schülerin oder der Schüler etwas markiert, auch das. Fragen wie "wie kommt man darauf?" oder "diese Aufgabe" '
        + 'meinen diese Stelle, eine Markierung geht vor. Erklär kurz und klar, meist in höchstens vier Sätzen. Wird nach '
        + 'einer Lösung gefragt oder darum, eine Aufgabe vorzurechnen, rechnest du sie vollständig vor, Schritt für Schritt '
        + 'bis zum Ergebnis - die Lösung im Buch ist deine Richtschnur, und die Antwort darf so lang sein, wie die Rechnung '
        + 'braucht. Stütze dich zuerst auf das Buch und nimm seine Schreibweisen. Hintergrundwissen zum Thema - Personen, '
        + 'Geschichte, Anwendungen, verwandte Begriffe - darfst du ergänzen, wenn du dir sicher bist; sonst sag kurz, dass '
        + 'du es nicht genau weißt. Nur wenn eine Frage wirklich außergewöhnlich klug ist, darfst du das einmal kurz sagen.';

    // ---------- the context: where the reader is ----------
    function headOffset() {
        const s = document.querySelector('.b-strip');
        return top.offsetHeight + (s && s.offsetParent !== null ? s.offsetHeight : 0);
    }
    // A block that goes whole, with all its tips and solutions, opened or not: a box, a task, a self-check question, a
    // note, a heading, a paragraph. Anything bigger is opened up into the parts of it that are on screen.
    const GANZ = '.b-box, .b-task, .b-q, .b-note, .b-lab, .b-chap, .b-band, .b-hero, h1, h2, h3, h4, p, li, tr, table, figure';
    const KLEIN = 1500;
    // really in view: a sliver under the header or at the bottom edge does not count (measured 09.10.2026: the last 15 px
    // of the Auftakt's boxes, their padding, brought the whole check-in along)
    function imBild(el, oben, unten) {
        const r = el.getBoundingClientRect();
        return r.height > 0 && Math.min(r.bottom, unten) - Math.max(r.top, oben) >= Math.min(40, r.height / 2);
    }
    function sichtbar(el, oben, unten, list) {
        for (const ch of el.children) {
            if (!imBild(ch, oben, unten)) continue;
            if (ch.matches(GANZ) || !ch.children.length || (ch.textContent || '').length <= KLEIN) list.push(ch);
            else sichtbar(ch, oben, unten, list);
        }
        return list;
    }
    // the text of a block as she should read it: formulas back as $TeX$, tasks with their number and level, tips and
    // solutions named, the choices of a self-check with the right one, what the reader typed into a field
    const ABSATZ = 'p, div, li, tr, h1, h2, h3, h4, table, figure, br';
    function text(node) {
        const box = document.createElement('div');
        box.appendChild(node.cloneNode(true));
        box.querySelectorAll('.katex').forEach(k => {
            const a = k.querySelector('annotation[encoding="application/x-tex"]');
            const tex = a ? a.textContent.trim() : '';
            const display = k.parentElement && k.parentElement.classList.contains('katex-display');
            k.replaceWith(tex ? (display ? ' $$' + tex + '$$ ' : ' $' + tex + '$ ') : k.textContent);
        });
        box.querySelectorAll('.b-mc').forEach(mc => {
            const q = mc.closest('[data-mc]'), richtig = q ? parseInt(q.dataset.mc, 10) : -1;
            mc.textContent = 'Auswahl: ' + Array.from(mc.children).map((b, i) =>
                String.fromCharCode(65 + i) + ') ' + b.textContent.trim() + (i === richtig ? ' (richtig)' : '')).join('; ');
        });
        box.querySelectorAll('.b-q[data-ans]').forEach(q => q.append('\nRichtige Antwort: ' + q.dataset.ans));
        box.querySelectorAll('input').forEach(i => {
            i.replaceWith(i.type === 'range' ? '' : i.value ? ' [eingetragen: ' + i.value + '] ' : ' [Eingabefeld] ');
        });
        box.querySelectorAll('.b-acts, button, script, style, svg, canvas, .b-check-score').forEach(e => e.remove());
        box.querySelectorAll('.b-task-no').forEach(e => { e.textContent = 'Aufgabe ' + e.textContent.trim() + ' '; });
        box.querySelectorAll('.b-lvl').forEach(e => { e.textContent = e.title ? '(' + e.title + '): ' : ': '; });
        box.querySelectorAll('.b-hint').forEach(e => e.prepend('Tipp: '));
        box.querySelectorAll('.b-sol').forEach(e => e.prepend('Lösung: '));
        box.querySelectorAll('.b-chip, .b-band-tag, .b-band-sub, .b-no').forEach(e => e.append(' '));   // pills side by side
        box.querySelectorAll(ABSATZ).forEach(e => { if (!e.matches('.b-task-no')) e.append('\n'); });
        return box.textContent.replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
    }
    function abschnitt(el) {
        const s = el && el.closest && el.closest('.b-sec');
        return s ? (s.dataset.toc || s.id) : '';
    }
    // the section the reader is in: the one that fills most of the screen
    function aktuell() {
        const oben = headOffset(), unten = innerHeight;
        let cur = null, best = 0;
        document.querySelectorAll('.b-sec[id][data-toc]').forEach(s => {
            const r = s.getBoundingClientRect(), h = Math.min(r.bottom, unten) - Math.max(r.top, oben);
            if (h > best) { best = h; cur = s; }
        });
        return cur;
    }
    // "Aufgabe 3", "Beispiel 2" in the question: that block goes along whole - the one in the reader's section first,
    // otherwise the nearest one (task numbers start again in every section)
    function benannt(frage, sec) {
        const treffer = [];
        String(frage).replace(/\b(aufgabe|beispiel)\s*(\d{1,2})\b/gi, (m, art, n) => {
            const aufgabe = art.toLowerCase() === 'aufgabe';
            const pool = aufgabe
                ? Array.from(document.querySelectorAll('.b-main .b-task')).filter(t => {
                    const no = t.querySelector('.b-task-no');
                    return no && no.textContent.trim() === n;
                })
                : Array.from(document.querySelectorAll('.b-main .b-box')).filter(b => {
                    const t = b.querySelector(':scope > .b-box-title');
                    return t && new RegExp('^BEISPIEL\\s+' + n + '\\b', 'i').test(t.textContent.trim());
                });
            if (!pool.length) return m;
            const mitte = innerHeight / 2;
            const nah = e => Math.abs(e.getBoundingClientRect().top - mitte);
            const el = pool.find(e => e.closest('.b-sec') === sec) || pool.slice().sort((a, b) => nah(a) - nah(b))[0];
            if (!treffer.some(t => t[1] === el)) treffer.push([(aufgabe ? 'Aufgabe ' : 'Beispiel ') + n, el]);
            return m;
        });
        return treffer;
    }
    // what the reader marked in the book - a click into her field keeps it, a click into the book drops it
    let markiert = '';
    const BILD_MAX = 9000;                            // characters of the screen at most (~3,000 tokens, about 0.3 ct)
    function zusammenstellen(frage) {
        const main = document.querySelector('.b-main');
        if (!main) return '';
        const lines = [];
        const buch = document.querySelector('.b-top-book');
        if (buch) lines.push('Lehrbuch: ' + buch.textContent.trim());
        lines.push('Seite: ' + document.title.split(' | ')[0]);
        const secs = Array.from(document.querySelectorAll('.b-sec[data-toc]'));
        if (secs.length) lines.push('Abschnitte des Kapitels: ' + secs.map(s => s.dataset.toc).join(' · '));
        const sec = aktuell();
        if (sec) lines.push('Die Schülerin oder der Schüler ist gerade im Abschnitt „' + (sec.dataset.toc || sec.id) + '“.');
        // on screen: grouped by section, in reading order
        const bloecke = sichtbar(main, headOffset(), innerHeight, []);
        let bild = '', vorher = null;
        bloecke.forEach(b => {
            const s = abschnitt(b);
            if (s && s !== vorher) { bild += (bild ? '\n' : '') + '[Abschnitt „' + s + '“]\n'; vorher = s; }
            const t = text(b);
            if (t) bild += t + '\n';
        });
        if (bild.length > BILD_MAX) bild = bild.slice(0, BILD_MAX) + ' …';
        lines.push('', 'Was gerade auf dem Bildschirm steht:', bild.trim() || '(nichts Lesbares)');
        if (markiert) lines.push('', 'Markiert hat sie oder er diese Stelle:', markiert);
        benannt(frage, sec).forEach(([name, el]) => {
            if (bloecke.some(b => b === el || b.contains(el))) return;   // on screen already
            const s = abschnitt(el);
            lines.push('', name + ', nach der gefragt wird' + (s ? ' (Abschnitt „' + s + '“)' : '') + ':', text(el));
        });
        return lines.join('\n');
    }
    window.buchSolitaKontext = zusammenstellen;

    // ---------- the box ----------
    if (!document.querySelector('link[href*="solita-frage.css"]')) css('solita-frage.css');
    css('buch-solita.css');
    Promise.all([
        window.SolitaListen ? 0 : load('solita-listen.js'),
        window.SolitaKaraoke ? 0 : load('solita-karaoke.js'),
    ]).then(() => window.SolitaFrage ? 0 : load('solita-frage.js'))
        .then(start, e => dbg('the box did not load: ' + e.message));

    function start() {
        if (!window.SolitaFrage) return;
        // the invitation in the field, as long as it fits; with something marked it says so
        const HINWEISE = ['Frag {name} zu dieser Stelle im Buch', 'Frag {name} zu dieser Stelle', 'Frag {name}'];
        const MARKIERT = ['Frag {name} zur Markierung', 'Frag {name}'];
        const hinweise = HINWEISE.slice();
        const sf = SolitaFrage.mount(panel, {
            kontext: frage => { const k = zusammenstellen(frage); markiert = ''; zeigeHinweis(); return k; },
            kontextKopf: '', system: SYS, maxTokens: 900,
            hinweise: hinweise,
            mic: { stille: 2000, selbst: true },
            menueAuf: ask,                                // her picture, the line and the answers
            beiEscape: schliessen,
        });
        const out = sf.out, row = sf.row, sfRoot = row.parentNode, rowHome = row.nextSibling;
        function zeigeHinweis() {
            hinweise.splice(0, hinweise.length, ...(markiert ? MARKIERT : HINWEISE));
            sf.auffrischen();
        }
        document.addEventListener('selectionchange', () => {
            const s = getSelection(), main = document.querySelector('.b-main');
            if (!s || !main || !s.anchorNode || !main.contains(s.anchorNode)) return;   // her field: keep what was marked
            const neu = s.isCollapsed || !s.rangeCount ? '' : text(s.getRangeAt(0).cloneContents());
            if (neu === markiert) return;
            markiert = neu;
            zeigeHinweis();
        });

        // The line stands in the header beside her picture when there is room, the answers hang under it; on a narrow
        // screen (the phone) the line goes into the card under the header, above the answers.
        const LINE_MAX = 460, LINE_MIN = 200, GAP = 8;
        let inline = false;
        function move(to) {                               // moving a focused field blurs it - keep typing
            const typing = document.activeElement === sf.feld();
            if (to === line) { if (row.parentNode !== line) line.appendChild(row); }
            else if (row.parentNode !== sfRoot) sfRoot.insertBefore(row, rowHome && rowHome.parentNode === sfRoot ? rowHome : null);
            if (typing) sf.feld().focus({ preventScroll: true });
        }
        function layout() {
            const a = ask.getBoundingClientRect(), AV = btn.offsetWidth || 34;
            const room = a.width - AV - GAP - 8;
            inline = offen && room >= LINE_MIN;
            const lw = inline ? Math.min(LINE_MAX, Math.floor(room)) : 0;
            line.style.width = lw + 'px';
            move(inline ? line : sfRoot);
            ask.classList.toggle('offen', offen);
            // her group in the middle of the page where there is room, never over the brand or the book's title
            const w = AV + (lw ? GAP + lw : 0);
            const slack = Math.max(0, (a.width - w) / 2);
            const shift = Math.round(Math.max(-slack, Math.min(slack, innerWidth / 2 - (a.left + a.width / 2))));
            inner.style.transform = 'translateX(' + shift + 'px)';
            // the answers: under the line in the header, or the whole card on a narrow screen
            panel.classList.toggle('unten', offen && !inline);
            panel.hidden = !offen || (inline && (!out.children.length || out.classList.contains('sf-zu')));
            if (panel.hidden) return;
            const t = top.getBoundingClientRect();
            if (inline) {
                // under her whole group, flush with the picture on the left and the line on the right - centred under the
                // line alone it stood 21 px to the right (Doc, 09.10.2026: "Die Box ist zu weit rechts")
                const mitte = a.left - t.left + (a.width - w) / 2 + shift + w / 2;
                const W = Math.min(t.width - 24, Math.max(w, 480));
                panel.style.width = Math.round(W) + 'px';
                panel.style.left = Math.round(Math.max(12, Math.min(t.width - 12 - W, mitte - W / 2))) + 'px';
            } else {
                panel.style.width = Math.round(t.width - 24) + 'px';
                panel.style.left = '12px';
            }
        }
        function oeffnen() {
            offen = true;
            zeigeWer();
            sf.auffrischen();                             // the password once, then the question
            layout();
            sf.feld().focus({ preventScroll: true });   // a focus in the sticky header jumped the book (measured 09.10.2026)
            sf.aufwaermen();
        }
        function schliessen() {
            offen = false;
            sf.stop();
            zeigeWer();
            layout();
        }
        // the field has its width once the line has grown: then the invitation that fits
        line.addEventListener('transitionend', e => { if (e.propertyName === 'width') sf.auffrischen(); });
        panel.querySelector('.b-solita-x').addEventListener('click', () => { schliessen(); btn.focus({ preventScroll: true }); });
        // her picture: a click opens the line, with the line open it switches between Solita and Doc (the box does it).
        // The mouse gives the picture no focus: in the sticky header that alone scrolled the book by 500 px (Doc, 09.10.2026)
        btn.addEventListener('mousedown', e => e.preventDefault());
        sf.bild(btn, { offen: () => offen, oeffnen: oeffnen });
        // Space is her mic while the line is open; closed, it scrolls the book as always
        sf.sprechtaste({ offen: () => offen, oeffnen: oeffnen, innen: ask, wenn: () => offen });
        addEventListener('keydown', e => {
            if (e.key !== 'Escape' || !offen || document.documentElement.classList.contains('b-ov-open')) return;
            if (e.target && e.target.closest && e.target.closest('.sf-menu')) return;
            schliessen();
        });
        // keys and clicks in her group stay there: typing must not open the page overview ('o')
        ask.addEventListener('keydown', e => e.stopPropagation());
        new MutationObserver(layout).observe(out, { childList: true, attributes: true, attributeFilter: ['class'] });
        if (window.ResizeObserver) new ResizeObserver(layout).observe(ask);
        addEventListener('resize', layout);
        if (document.fonts) document.fonts.ready.then(layout);   // Orbitron arrives late: the brand and the title grow
        layout();
        dbg('ready');
    }
})();
