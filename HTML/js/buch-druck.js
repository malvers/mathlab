/* buch-druck.js — the print edition of a textbook (buch/<book>/druck.html): all chapters in one document,
 * set into A4 pages by Paged.js, ready for "Drucken → Als PDF speichern".
 * Doc, 09.10.2026: "wenn man das Ganze als PDF noch ausdrucken könnte, so mit Seitenzahlen … dann gibt es halt
 * Screenshots so als Teaser".
 *
 *   cover (the same one as on index.html) · how to use · contents with page numbers · every chapter with a QR code to
 *   its interactive version · every widget frozen in its first state (canvas → image) with a pointer to the online
 *   version · solutions of tasks and self-checks in an appendix · page numbers and running heads (js/buch-druck.css).
 * The page is forced into the light scheme (<html data-fs-force="light">), so paper stays white.
 */
(function () {
    'use strict';
    const B = window.BUCH;
    const SITE = 'https://docalvers.de';
    const here = location.pathname.replace(/[^/]*$/, '');            // /buch/mathe11/
    const status = document.getElementById('d-status');
    const say = t => { if (status) status.textContent = t; };
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
    const wait = ms => new Promise(r => setTimeout(r, ms));

    function qrSvg(url) {
        if (typeof qrcode !== 'function') return '';
        const q = qrcode(0, 'M'); q.addData(url); q.make();
        return q.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
    }
    // links inside the book point to the live site in print: a PDF has no local server
    function absolute(href) {
        if (!href || /^(https?:|mailto:|#)/.test(href)) return href;
        const u = new URL(href, location.origin + here);
        return SITE + u.pathname + u.hash;
    }

    async function chapter(c, n) {
        const src = await (await fetch(c.file)).text();
        const doc = new DOMParser().parseFromString(src, 'text/html');
        const main = doc.querySelector('.b-main');
        const sec = el('section', 'd-chapter');
        const pre = c.file.replace(/\.html$/, '');
        sec.id = 'kap-' + pre;
        const url = SITE + here + c.file;
        // the chapter head: number, title, where it sits in the year, QR to the interactive version
        sec.appendChild(el('div', 'd-khead',
            '<div><p class="d-kkick">KAPITEL ' + c.k + ' · ' + c.lb.toUpperCase() + ' · ' + c.when.toUpperCase() + '</p>' +
            '<h1 class="d-ktitle">' + c.title + '</h1><p class="d-ksub">' + c.sub + '</p></div>' +
            '<a class="d-qr" href="' + url + '">' + qrSvg(url) + '<span>Interaktiv:<br>' + url.replace('https://', '') + '</span></a>'));
        Array.from(main.children).forEach(ch => {
            if (ch.matches('.b-foot, .b-chapnav, footer')) return;
            sec.appendChild(document.importNode(ch, true));
        });
        // the opener's own title is now in the chapter head
        const h = sec.querySelector('.b-hero h1'); if (h) h.remove();
        const k = sec.querySelector('.b-hero .b-kicker'); if (k) k.remove();
        // ids unique across the whole book
        sec.querySelectorAll('[id]').forEach(e => { if (e !== sec) e.id = pre + '-' + e.id; });
        sec.querySelectorAll('a[href^="#"]').forEach(a => { a.setAttribute('href', '#' + pre + '-' + a.getAttribute('href').slice(1)); });
        sec.querySelectorAll('a[href]').forEach(a => { if (!a.getAttribute('href').startsWith('#')) a.setAttribute('href', absolute(a.getAttribute('href'))); });
        sec.querySelectorAll('.b-sec').forEach(s => s.removeAttribute('data-toc'));
        // every interactive box says where it lives
        sec.querySelectorAll('.b-widget').forEach(w => w.appendChild(el('p', 'd-online', 'Interaktiv im Online-Buch: ' + url.replace('https://', ''))));
        return sec;
    }

    function freezeCanvases(root) {
        root.querySelectorAll('canvas').forEach(cv => {
            try {
                // JPEG on white: a tenth of the PNG size, and the PDF stays small enough to send around
                const flat = document.createElement('canvas');
                flat.setAttribute('data-fs-keep', '');                          // its white must stay white (js/farbschema.js)
                flat.width = cv.width; flat.height = cv.height;
                const fx = flat.getContext('2d');
                fx.fillStyle = '#ffffff'; fx.fillRect(0, 0, flat.width, flat.height);
                fx.drawImage(cv, 0, 0);
                const img = new Image();
                img.src = flat.toDataURL('image/jpeg', 0.9);
                img.className = 'd-frozen';
                img.alt = cv.getAttribute('aria-label') || 'Grafik';
                const box = cv.closest('.b-canvasbox') || cv;
                img.style.width = '100%';
                box.replaceWith(img);
            } catch (e) { /* a tainted canvas stays as it is */ }
        });
        // controls are for the screen only
        root.querySelectorAll('.b-widget .b-ctrls, .b-widget .b-range, .b-widget .b-seg, .b-widget button, .b-widget input, .b-widget .b-help, .b-widget .st-say-acts, .b-acts').forEach(e => e.remove());
    }

    // solutions of tasks and self-checks move into the appendix; worked examples keep theirs in the text
    function harvest(sec, c) {
        const part = el('div', 'd-loes-kap');
        part.appendChild(el('h3', 'd-loes-h', 'Kapitel ' + c.k + ' · ' + c.title));
        let any = false;
        sec.querySelectorAll('.b-tasks').forEach(list => {
            list.querySelectorAll(':scope > .b-task').forEach(t => {
                const no = t.querySelector('.b-task-no'), sol = t.querySelector(':scope > .b-sol');
                t.querySelectorAll(':scope > .b-hint, :scope > .b-sol').forEach(x => x.remove());
                if (!sol) return;
                any = true;
                const row = el('div', 'd-loes'); row.appendChild(el('span', 'd-loes-no', no ? no.textContent : '•'));
                const body = el('div', 'd-loes-body'); body.innerHTML = sol.innerHTML; row.appendChild(body);
                part.appendChild(row);
            });
        });
        sec.querySelectorAll('.b-check').forEach(box => {
            const qs = Array.from(box.querySelectorAll('.b-q'));
            const title = (box.querySelector('.b-box-title')?.childNodes[0]?.textContent || 'Selbsttest').trim();
            const sub = el('div', 'd-loes-check'); sub.appendChild(el('p', 'd-loes-t', title));
            let has = false;
            qs.forEach((q, i) => {
                const sol = q.querySelector(':scope > .b-sol'); if (!sol) return;
                has = true; sol.remove();
                const row = el('div', 'd-loes'); row.appendChild(el('span', 'd-loes-no', String(i + 1)));
                const body = el('div', 'd-loes-body'); body.innerHTML = sol.innerHTML; row.appendChild(body);
                sub.appendChild(row);
            });
            if (has) { part.appendChild(sub); any = true; }
            qs.forEach((q, i) => q.insertBefore(el('span', 'd-qno', (i + 1) + '.'), q.firstChild));
        });
        return any ? part : null;
    }

    async function build() {
        const book = document.getElementById('d-book');
        // cover and how-to: already in druck.html; contents next
        const toc = el('section', 'd-toc');
        toc.appendChild(el('h1', 'd-toc-h', 'Inhalt'));
        const list = el('ol', 'd-toc-list');
        B.chapters.forEach(c => list.appendChild(el('li', '', '<a href="#kap-' + c.file.replace(/\.html$/, '') + '"><span class="d-toc-k">' + c.k + '</span><span class="d-toc-t">' + c.title +
            '<small>' + c.lb + ' · ' + c.when + '</small></span></a>')));
        list.appendChild(el('li', 'd-toc-loes', '<a href="#loesungen"><span class="d-toc-k">L</span><span class="d-toc-t">Lösungen</span></a>'));
        toc.appendChild(list);
        book.appendChild(toc);

        const loes = el('section', 'd-loesungen'); loes.id = 'loesungen';
        loes.appendChild(el('h1', 'd-ktitle', 'Lösungen'));
        loes.appendChild(el('p', 'd-loes-intro', 'Lösungen zu den Aufgaben (nach ihrer Nummer im Kapitel) und zu den Selbsttests. Die Lösungswege der Beispiele stehen direkt im Text.'));

        for (let i = 0; i < B.chapters.length; i++) {
            const c = B.chapters[i];
            say('Kapitel ' + c.k + ' wird geladen …');
            const sec = await chapter(c, i);
            book.appendChild(sec);
            Buch.render(sec, { print: true });
        }
        say('Grafiken werden gezeichnet …');
        await document.fonts.ready;
        await wait(900);                                                   // widgets draw, KaTeX settles
        window.dispatchEvent(new Event('resize'));
        await wait(400);
        book.querySelectorAll('.d-chapter').forEach((sec, i) => {
            freezeCanvases(sec);
            const part = harvest(sec, B.chapters[i]);
            if (part) loes.appendChild(part);
        });
        book.appendChild(loes);
        say('Seiten werden gesetzt … (das dauert einen Moment)');
        const t0 = performance.now();
        if (window.Farbschema && Farbschema.freeze) Farbschema.freeze();     // Paged.js copies the sheets: nothing more to translate
        // only the book goes onto the pages; the status bar stays outside
        const frag = document.createDocumentFragment();
        frag.appendChild(book);
        await window.PagedPolyfill.preview(frag, undefined, document.getElementById('d-pages'));
        const pages = document.querySelectorAll('.pagedjs_page').length;
        say(pages + ' Seiten fertig in ' + Math.round((performance.now() - t0) / 1000) + ' s. Drucken: Strg/Cmd + P → „Als PDF speichern“.');
        document.body.classList.add('d-ready');
        // the local server's LOCAL badge is fixed and would land on every printed page: it moves into the status bar,
        // which Paged.js keeps off the paper (our own @media print rules do not survive Paged.js)
        const badge = document.getElementById('local-badge');
        if (badge) { badge.style.position = 'static'; badge.style.marginLeft = '10px'; document.querySelector('.d-bar')?.appendChild(badge); }
        window.__druckFertig = pages;
    }

    document.getElementById('d-print')?.addEventListener('click', () => window.print());
    window.addEventListener('load', () => { build().catch(e => { say('Fehler: ' + e.message); console.error(e); }); });
})();
