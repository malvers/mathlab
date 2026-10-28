/* buch-druck.js — the print edition of a textbook (buch/<book>/druck.html): all chapters in one document,
 * set into A4 pages by Paged.js, ready for "Drucken → Als PDF speichern". druck.html?format=letter sets US Letter for KDP.
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
    let ovWait = null;                                                   // the waiting card of the overview mode (below)
    const say = t => { if (status) status.textContent = t; if (ovWait) ovWait.textContent = t; };
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    // the edition's language (js/buch.js): German, English, Spanish, Italian, French - the translations print too
    // (Doc, 27.10.2026: "für alle Bücher … das Grußwort und auch den PDF Download Button"); French sets a no-break space before a colon
    const tr = (de, en, es, it, fr) => Buch.t(de, en, es, it, fr);
    const colon = Buch.lang === 'fr' ? '\u00a0: ' : ': ';
    // the page format: the book's own (kapitel.js format, default A4), or ?format=letter / ?format=a4 to try the other one.
    // KDP offers Standard Color only in US Letter, not in A4 (Doc, 28.10.2026: "Wir machen das Letter fertig")
    const OWN = B.format === 'letter' ? 'letter' : 'a4';
    const FORMAT = ({ letter: 'letter', a4: 'a4' })[new URLSearchParams(location.search).get('format')] || OWN;
    const LETTER = FORMAT === 'letter';
    // the overview sets the pages afresh instead of showing the pictures from R2 (they may be older than a local change)
    const NEU = new URLSearchParams(location.search).has('neu');

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

    // a lab card on paper: the short address under its text and a QR code at the right edge (js/buch-druck.css)
    function labCard(a) {
        const url = a.getAttribute('href') || '';
        const text = a.querySelector(':scope > span:not(.b-lab-icon)');
        if (!/^https?:/.test(url) || !text) return;
        text.appendChild(el('span', 'd-lab-url', url.replace(/^https?:\/\//, '')));
        a.appendChild(el('span', 'd-lab-qr', qrSvg(url)));
    }

    async function chapter(c, n) {
        const src = await (await fetch(c.file)).text();
        const doc = new DOMParser().parseFromString(src, 'text/html');
        const main = doc.querySelector('.b-main');
        Buch.ziele(main, c.file);                                        // where every block lives online (overview, O)
        if (Buch.fotos) Buch.fotos(main, c.file, true);                  // photos from js/buch-fotos.js, while the ids are the chapter's own
        const sec = el('section', 'd-chapter');
        const pre = c.file.replace(/\.html$/, '');
        sec.id = 'kap-' + pre;
        const url = SITE + here + c.file;
        // the chapter head: number, title, where it sits in the year, QR to the interactive version
        sec.appendChild(el('div', 'd-khead',
            '<div><p class="d-kkick">' + tr('KAPITEL', 'CHAPTER', 'CAPÍTULO', 'CAPITOLO', 'CHAPITRE') + ' ' + c.k + ' · ' + c.lb.toUpperCase() + ' · ' + c.when.toUpperCase() + '</p>' +
            '<h1 class="d-ktitle">' + c.title + '</h1><p class="d-ksub">' + c.sub + '</p></div>' +
            '<a class="d-qr" href="' + url + '">' + qrSvg(url) + '<span>' + tr('Interaktiv', 'Interactive', 'Interactivo', 'Interattivo', 'Interactif') + colon.trimEnd() + '<br>' + url.replace('https://', '') + '</span></a>'));
        sec.lastChild.dataset.ziel = c.file + '||';
        Array.from(main.children).forEach(ch => {
            if (ch.matches('.b-foot, .b-chapnav, footer')) return;
            sec.appendChild(document.importNode(ch, true));
        });
        // the opener's own title is now in the chapter head
        const h = sec.querySelector('.b-hero h1'); if (h) h.remove();
        const k = sec.querySelector('.b-hero .b-kicker'); if (k) k.remove();
        // ids unique across the whole book; the chapter's own id stays readable for the pictures in white space (fillGaps)
        sec.dataset.datei = c.file;
        sec.querySelectorAll('[id]').forEach(e => { if (e !== sec) { e.dataset.stelle = e.id; e.id = pre + '-' + e.id; } });
        sec.querySelectorAll('a[href^="#"]').forEach(a => { a.setAttribute('href', '#' + pre + '-' + a.getAttribute('href').slice(1)); });
        sec.querySelectorAll('a[href]').forEach(a => { if (!a.getAttribute('href').startsWith('#')) a.setAttribute('href', absolute(a.getAttribute('href'))); });
        sec.querySelectorAll('a.b-lab').forEach(labCard);
        sec.querySelectorAll('.b-sec').forEach(s => s.removeAttribute('data-toc'));
        // every interactive box says where it lives, with a QR code straight to it (Doc, 28.10.2026: "wäre schon cool,
        // wenn man da auch den QR-Code mit hinpacken würde. Bei allen diesen lokalen Tools.")
        sec.querySelectorAll('.b-widget').forEach(w => {
            const at = w.closest('[data-stelle]'), wurl = url + (at ? '#' + at.dataset.stelle : '');
            w.appendChild(el('a', 'd-online', '<span>' + tr('Interaktiv im Online-Buch', 'Interactive in the online book', 'Interactivo en el libro en línea',
                'Interattivo nel libro online', 'Interactif dans le livre en ligne') + colon + wurl.replace('https://', '') + '</span>' + qrSvg(wurl)));
            w.lastChild.href = wurl;
        });
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
                img.alt = cv.getAttribute('aria-label') || tr('Grafik', 'Figure', 'Gráfico', 'Grafico', 'Figure');
                const box = cv.closest('.b-canvasbox') || cv;
                // an equal-axes plot may be narrower than its box (js/buch-plot.js): keep its share of the width, centred
                const share = box === cv ? 1 : cv.getBoundingClientRect().width / (box.getBoundingClientRect().width || 1);
                img.style.width = share < 0.995 ? (share * 100).toFixed(2) + '%' : '100%';
                if (share < 0.995) img.style.margin = '0 auto';
                box.replaceWith(img);
            } catch (e) { /* a tainted canvas stays as it is */ }
        });
        // controls are for the screen only
        root.querySelectorAll('.b-widget .b-ctrls, .b-widget .b-range, .b-widget .b-seg, .b-widget button, .b-widget input, .b-widget .b-help, .b-widget .st-say-acts, .b-acts').forEach(e => e.remove());
    }

    // a table wider than its column shrinks until it fits: widget tables with many columns of numbers (white-space: nowrap)
    // scroll on screen but ran over the edge of the paper (druckcheck, 27.10.2026: Mathe 6 p. 37 +22 px, Mathe 9 p. 63 +153 px)
    function fitTables(root) {
        root.querySelectorAll('.b-table-wrap').forEach(w => {
            const t = w.querySelector(':scope > table');
            const over = t ? t.scrollWidth / (w.clientWidth || 1) : 1;
            if (over > 1.005) t.style.zoom = (1 / over).toFixed(3);
        });
    }

    // solutions of tasks and self-checks move into the appendix; worked examples keep theirs in the text
    function harvest(sec, c) {
        const part = el('div', 'd-loes-kap');
        part.appendChild(el('h3', 'd-loes-h', tr('Kapitel', 'Chapter', 'Capítulo', 'Capitolo', 'Chapitre') + ' ' + c.k + ' · ' + c.title));
        part.lastChild.dataset.ziel = c.file + '||';
        // a solution leads back to its task
        const from = (row, src) => { const z = src.closest('[data-ziel]'); if (z) row.dataset.ziel = z.dataset.ziel; };
        let any = false;
        sec.querySelectorAll('.b-tasks').forEach(list => {
            list.querySelectorAll(':scope > .b-task').forEach(t => {
                const no = t.querySelector('.b-task-no'), sol = t.querySelector(':scope > .b-sol');
                t.querySelectorAll(':scope > .b-hint, :scope > .b-sol').forEach(x => x.remove());
                if (!sol) return;
                any = true;
                const row = el('div', 'd-loes'); row.appendChild(el('span', 'd-loes-no', no ? no.textContent : '•')); from(row, t);
                const body = el('div', 'd-loes-body'); body.innerHTML = sol.innerHTML; row.appendChild(body);
                part.appendChild(row);
            });
        });
        sec.querySelectorAll('.b-check').forEach(box => {
            const qs = Array.from(box.querySelectorAll('.b-q'));
            const title = (box.querySelector('.b-box-title')?.childNodes[0]?.textContent || tr('Selbsttest', 'Self-check', 'Autoevaluación', 'Autoverifica', 'Autoévaluation')).trim();
            const sub = el('div', 'd-loes-check'); sub.appendChild(el('p', 'd-loes-t', title));
            let has = false;
            qs.forEach((q, i) => {
                const sol = q.querySelector(':scope > .b-sol'); if (!sol) return;
                has = true; sol.remove();
                const row = el('div', 'd-loes'); row.appendChild(el('span', 'd-loes-no', String(i + 1))); from(row, q);
                const body = el('div', 'd-loes-body'); body.innerHTML = sol.innerHTML; row.appendChild(body);
                sub.appendChild(row);
            });
            if (has) { part.appendChild(sub); any = true; }
            qs.forEach((q, i) => q.insertBefore(el('span', 'd-qno', (i + 1) + '.'), q.firstChild));
        });
        return any ? part : null;
    }

    // ---------- the foreword: one page before "So arbeitest du mit diesem Buch", the same in every book ----------
    // Doc, 24.10.2026, with the KDP proof: "wir brauchen ein Grußwort von Doc Alvers, was das Aim ist … dass wir investieren,
    // um bessere Bildung zu ermöglichen, dass wir das alles aus freien Stücken machen und dass es kein Geld kostet …
    // und ein Bild von Doc Alvers". In the language of the edition (27.10.2026: "natürlich in allen Sprachen").
    // The letter lives in js/buch-gruss.js: the same text stands first on the online start page (js/buch.js).
    async function grusswort() {
        const G = await Buch.gruss(), L = G && G[Buch.lang];
        if (!L) return null;
        const sec = el('section', 'd-gruss');
        sec.innerHTML = '<h1>' + Buch.grussTitel() + '</h1>' + Buch.grussHtml(L, 'd-gruss');
        sec.dataset.ziel = 'index.html|gruss|';
        return sec;
    }

    // ---------- the imprint: page 2, the back of the foreword, in every book and language ----------
    // Doc, 28.10.2026, before selling on KDP: "mach schon mal in alle Bücher ein Impressum". Self-published in Saxony,
    // so § 6 SächsPresseG wants the name and address of author/publisher and printer, plainly visible - in no set
    // language: the labels follow the edition, the address stays as it is (the same as on docalvers.de/impressum.html).
    // KDP prints the actual printer and place on its own last page. An ISBN only where a book has one, by its folder.
    const ISBN = { mathe11: '979-8161192665' };                         // free KDP ISBN of the A4 paperback draft (09.10.2026)
    function impressum() {
        const book = (here.match(/\/buch\/([^/]+)\/$/) || [])[1] || '';
        const online = SITE + here;
        const sep = Buch.lang === 'fr' ? ' ; ' : '; ';
        const row = (k, v) => '<dt>' + k + '</dt><dd>' + v + '</dd>';
        const sec = el('section', 'd-impressum');
        sec.innerHTML = '<h1>' + tr('Impressum', 'Imprint', 'Créditos', 'Colophon', 'Mentions légales') + '</h1>' +
            '<p class="d-imp-titel">' + B.title + '</p>' +
            '<p class="d-imp-stand">' + tr('Stand', 'Edition', 'Edición', 'Edizione', 'Édition') + colon +
            new Intl.DateTimeFormat(Buch.lang || 'de', { month: 'long', year: 'numeric' }).format(new Date()) + '</p>' +
            '<dl>' +
            row(tr('Autor und Verlag', 'Author and publisher', 'Autor y editor', 'Autore ed editore', 'Auteur et éditeur'),
                'Dr. Michael R. Alvers<br>Sachsenallee 8<br>01468 Moritzburg<br>' + tr('Deutschland', 'Germany', 'Alemania', 'Germania', 'Allemagne')) +
            row(tr('Kontakt', 'Contact', 'Contacto', 'Contatti', 'Contact'), 'info@docalvers.de<br>docalvers.de') +
            (ISBN[book] ? row('ISBN', ISBN[book]) : '') +
            row(tr('Druck', 'Printing', 'Impresión', 'Stampa', 'Impression'), tr(
                'Print on Demand über Amazon KDP' + sep + 'Druckerei und Druckort stehen auf der letzten Seite.',
                'Print on demand via Amazon KDP' + sep + 'printer and place of printing are named on the last page.',
                'Impresión bajo demanda a través de Amazon KDP' + sep + 'la imprenta y el lugar de impresión figuran en la última página.',
                'Stampa su richiesta tramite Amazon KDP' + sep + 'tipografia e luogo di stampa sono indicati nell’ultima pagina.',
                'Impression à la demande via Amazon KDP' + sep + 'l’imprimeur et le lieu d’impression figurent en dernière page.')) +
            row(tr('Interaktive Ausgabe', 'Interactive edition', 'Edición interactiva', 'Edizione interattiva', 'Édition interactive'),
                '<a class="d-qr" href="' + online + '">' + qrSvg(online) + '<span>' + online.replace('https://', '') + '</span></a>') +
            '</dl>' +
            '<p class="d-imp-copy">© ' + new Date().getFullYear() + ' Dr. Michael R. Alvers</p>';
        return sec;
    }
    // ---------- the how-to page: why the online book is the heart of it, for every book in its language ----------
    // Doc, 28.10.2026, on the Letter proof: "dass man in der Online-Version Fehler melden kann … nochmal richtig pushen, dass
    // der Witz eigentlich auf der Online-Version liegt, und das sozusagen ein nahtloses Ineinander möglich ist". The rest of
    // the page stands in each book's druck.html; this part is the same everywhere, so it comes from here.
    function onlineBuch() {
        const online = SITE + here, q = s => Buch.lang === 'fr' ? s.replace(/ ([:?!])/g, ' $1') : s;
        const box = el('div', 'd-online-buch');
        box.innerHTML = '<h2>' + q(tr('Papier und Bildschirm: ein Buch', 'Paper and screen: one book', 'Papel y pantalla: un solo libro',
                'Carta e schermo: un solo libro', 'Papier et écran : un seul livre')) + '</h2>' +
            '<div><p>' + q(tr(
                '<b>Das Online-Buch ist das Herzstück.</b> Dort bewegt sich alles: Du verschiebst Graphen, drehst an Parametern, lässt Zufallsversuche tausendmal laufen und bekommst bei jedem Selbsttest sofort Rückmeldung. Jeder QR-Code in diesem Heft – am Kapitelanfang, an jedem interaktiven Element, an jedem Lab-Kasten – bringt dich genau an diese Stelle.',
                '<b>The online book is the heart of it.</b> Everything moves there: you drag graphs, turn parameters, run random experiments a thousand times and get instant feedback on every self-check. Every QR code in this book – at the start of a chapter, at every interactive element, at every lab box – takes you straight to that spot.',
                '<b>El libro en línea es el corazón.</b> Allí todo se mueve: desplazas gráficas, cambias parámetros, repites experimentos aleatorios mil veces y recibes respuesta inmediata en cada autoevaluación. Cada código QR de este libro – al inicio de cada capítulo, en cada elemento interactivo, en cada recuadro de laboratorio – te lleva directamente a ese lugar.',
                '<b>Il libro online è il cuore.</b> Lì tutto si muove: sposti grafici, cambi parametri, ripeti esperimenti casuali mille volte e ricevi subito un riscontro a ogni autoverifica. Ogni codice QR di questo libro – all’inizio di ogni capitolo, a ogni elemento interattivo, a ogni riquadro di laboratorio – ti porta esattamente in quel punto.',
                '<b>Le livre en ligne est le cœur de l’ouvrage.</b> Tout y bouge : tu déplaces des courbes, tu modifies des paramètres, tu relances mille fois une expérience aléatoire et chaque auto-évaluation te répond aussitôt. Chaque code QR de ce livre – au début de chaque chapitre, à chaque élément interactif, à chaque encadré de labo – t’amène exactement à cet endroit.')) + '</p>' +
            '<p>' + q(tr(
                '<b>Hin und zurück:</b> Im Online-Buch zeigen die Taste O oder der Knopf „Seiten“ alle Seiten dieser Druckausgabe, ein Klick auf eine Seite führt an dieselbe Stelle online. Jedes Kapitel endet mit „Mehr üben online“, und wo Platz ist, findest du Karopapier für deine Notizen.',
                '<b>There and back:</b> in the online book the O key or the “Pages” button shows all pages of this print edition, and a click on a page takes you to the same spot online. Every chapter ends with “More practice online”, and wherever there is room you will find squared paper for your notes.',
                '<b>Ida y vuelta:</b> en el libro en línea, la tecla O o el botón «Páginas» muestran todas las páginas de esta edición impresa, y un clic en una página te lleva al mismo lugar en línea. Cada capítulo termina con «Más práctica en línea», y donde hay espacio encontrarás papel cuadriculado para tus notas.',
                '<b>Andata e ritorno:</b> nel libro online il tasto O o il pulsante «Pagine» mostrano tutte le pagine di questa edizione a stampa, e un clic su una pagina ti porta allo stesso punto online. Ogni capitolo finisce con «Altri esercizi online», e dove c’è spazio trovi la carta a quadretti per i tuoi appunti.',
                '<b>Aller-retour :</b> dans le livre en ligne, la touche O ou le bouton « Pages » affichent toutes les pages de cette édition imprimée, et un clic sur une page te mène au même endroit en ligne. Chaque chapitre se termine par « S’entraîner en ligne », et là où il reste de la place, tu trouves du papier quadrillé pour tes notes.')) + '</p>' +
            '<p>' + q(tr(
                '<b>Fehler gefunden?</b> Im Online-Buch gibt es den roten Knopf „Fehler melden“: einfach sagen oder tippen, was nicht stimmt. Die Meldung kommt direkt beim Autor an, online ist der Fehler meist schnell behoben – und die gedruckte Ausgabe zieht mit der nächsten Auflage nach.',
                '<b>Found a mistake?</b> The online book has a red “Fehler melden” (report a mistake) button: just say or type what is wrong. The report goes straight to the author, the online book is usually fixed quickly – and the printed book catches up with its next edition.',
                '<b>¿Has encontrado un error?</b> El libro en línea tiene un botón rojo «Fehler melden» (informar de un error): solo di o escribe qué está mal. El aviso llega directamente al autor, en línea suele corregirse enseguida, y el libro impreso se pone al día en su próxima edición.',
                '<b>Hai trovato un errore?</b> Il libro online ha un pulsante rosso «Fehler melden» (segnala un errore): basta dire o scrivere che cosa non va. La segnalazione arriva direttamente all’autore, online di solito viene corretta in fretta, e il libro stampato si aggiorna con la prossima edizione.',
                '<b>Tu as trouvé une erreur ?</b> Le livre en ligne a un bouton rouge « Fehler melden » (signaler une erreur) : dis ou écris simplement ce qui ne va pas. Le signalement arrive directement chez l’auteur, en ligne il est en général vite corrigé, et le livre imprimé suit à sa prochaine édition.')) + '</p></div>' +
            '<a class="d-qr" href="' + online + '">' + qrSvg(online) + '<span>' + tr('Das Online-Buch', 'The online book', 'El libro en línea', 'Il libro online', 'Le livre en ligne') +
            colon.trimEnd() + '<br>' + online.replace('https://', '') + '</span></a>';
        return box;
    }

    // photo credits stand under every photo: the imprint says so, once the chapters are in and a book has photos
    function impressumFotos(sec, book) {
        if (!sec || !book.querySelector('.b-foto')) return;
        sec.querySelector('dl').insertAdjacentHTML('beforeend', '<dt>' + tr('Fotos', 'Photos', 'Fotos', 'Foto', 'Photos') + '</dt><dd>' + tr(
            'Der Bildnachweis steht bei jedem Foto.', 'The credit is given with every photo.', 'El crédito figura junto a cada foto.',
            'Il credito è indicato accanto a ogni foto.', 'Le crédit figure à côté de chaque photo.') + '</dd>');
    }

    // ---------- a heading never stays alone at the foot of a page ----------
    // Doc, 24.10.2026, with the KDP proof in hand: "Aufgaben" (p. 34), "Wiederholen · Vertiefen · Vernetzen" (p. 38),
    // "Rückblick" (p. 51) and "Gauß-Verfahren" (p. 101) stood alone at the bottom - "die fühlen sich dann auch einsam".
    // Paged.js 0.4.3 ignores break-after: avoid. So after every page: if its last content is a heading (or a band with
    // its heading), the page ends before it and the heading opens the next one. The approach of
    // pagedjs.org/plugins/temporary-fix-for-break-after-avoid; a heading that already opens its page stays.
    const KEEP = 'h1, h2, h3, h4, .b-band, .d-loes-h, .d-loes-t';
    const MM = 96 / 25.4;                                                // CSS px per millimetre
    function contentNodes(area) {
        const out = [];
        const w = document.createTreeWalker(area, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
            acceptNode: n => (n.nodeType === 3 ? n.data.trim() : n.matches('img, svg, canvas, hr')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        while (w.nextNode()) out.push(w.currentNode);
        return out;
    }
    const nodeEl = n => n.nodeType === 3 ? n.parentElement : n;
    // a short paragraph ending in a colon announces what follows (a formula, a list): it never stays behind alone
    // (Doc, 28.10.2026, p. 7/8: "Man schreibt sie hinter einen senkrechten Strich:" and the formula on the next page)
    function leadIn(e) {
        const p = e.closest('p');
        return p && !p.hasAttribute('data-split-from') && /:\s*$/.test(p.textContent) && p.getBoundingClientRect().height < 18 * MM ? p : null;
    }
    const keepOf = n => nodeEl(n).closest(KEEP) || leadIn(nodeEl(n));
    // where the visible content of a page ends: its last text, picture or the frame of the box around it
    function contentBottom(area) {
        const top = area.getBoundingClientRect().top, seen = new Map();
        let max = top;
        const range = document.createRange();
        contentNodes(area).forEach(n => {
            if (n.nodeType === 3) { range.selectNodeContents(n); max = Math.max(max, range.getBoundingClientRect().bottom); }
            else max = Math.max(max, n.getBoundingClientRect().bottom);
            for (let e = nodeEl(n); e && e !== area && !(e.parentElement && e.parentElement.classList.contains('pagedjs_page_content')); e = e.parentElement) {
                if (seen.has(e)) { if (seen.get(e)) max = Math.max(max, seen.get(e)); continue; }
                const cs = getComputedStyle(e), framed = cs.borderBottomWidth !== '0px' || cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
                const b = framed ? e.getBoundingClientRect().bottom : 0;
                seen.set(e, b);
                if (b) max = Math.max(max, b);
            }
        });
        return max;
    }
    // the next node after n in the source (its own subtree skipped), blank text left out
    function nextAfter(n) {
        const up = x => { for (; x; x = x.parentNode) if (x.nextSibling) return x.nextSibling; return null; };
        for (n = up(n); n && n.nodeType === 3 && !n.data.trim(); n = up(n));
        return n;
    }
    if (window.Paged && Paged.Handler) Paged.registerHandlers(class KeepWithNext extends Paged.Handler {
        afterPageLayout(pageEl, page, breakToken, chunker) {
            if (!breakToken || !breakToken.node || !page.area) return;
            // a page that ends at a forced break (the next chapter) keeps its white space - the section simply ends there.
            // Moving a heading on would end the next page at the same break again: Paged.js 0.4.3 remembers every break
            // before this hook runs, sees this one twice and stops setting the book ("Layout repeated" - OS 10 ended after
            // p. 94 at chapter 4.2, 28.10.2026)
            const stop = breakToken.offset ? null : nodeEl(breakToken.node);
            if (stop && stop.matches && stop.matches('[data-break-before="page"], [data-break-before="left"], [data-break-before="right"]')) return;
            const nodes = contentNodes(page.area);
            let i = nodes.length - 1, first = null;
            while (i >= 0) {
                const h = keepOf(nodes[i]);
                if (!h || !page.area.contains(h)) break;
                first = h;
                while (i >= 0 && h.contains(nodes[i])) i--;
            }
            // a heading with hardly anything under it goes too (Doc, 28.10.2026, p. 79: "Aufgaben" with only task 1 at
            // the foot - "ich würde die dennoch auf die Seite 80 ziehen"); bands and headings right above it go along
            if (!first) {
                const end = contentBottom(page.area);
                for (let k = nodes.length - 1; k > 0; k--) {
                    const h = nodeEl(nodes[k]).closest(KEEP);
                    if (!h || !page.area.contains(h)) continue;
                    if (end - h.getBoundingClientRect().bottom > 25 * MM) break;
                    let j = k;
                    while (j > 0 && h.contains(nodes[j - 1])) j--;
                    first = h; i = j - 1;
                    while (i >= 0) { const g = keepOf(nodes[i]); if (!g || g === first) break; first = g; while (i >= 0 && g.contains(nodes[i])) i--; }
                    break;
                }
            }
            if (first && i >= 0) {
                const src = chunker.source && chunker.source.querySelector('[data-ref="' + first.dataset.ref + '"]');
                if (!src) return;
                breakToken.node = src;
                breakToken.offset = 0;
                // off this page: the heading and the empty wrappers after it
                for (let n = first; n && n !== page.area; n = n.parentNode) while (n.nextSibling) n.nextSibling.remove();
                first.remove();
                return;
            }
            // a wide photo that would open the next page squeezes into the white space at the foot of this one, smaller
            // (Doc, 28.10.2026: the fire brigades alone on p. 63 - "dann würde ich sagen, machen wir das Bild kleiner")
            const at = breakToken.offset ? null : nodeEl(breakToken.node);
            const fig = at && at.closest && at.closest('figure.b-foto-breit');
            if (!fig || !nodes.length) return;
            const ar = page.area.getBoundingClientRect(), top = contentBottom(page.area) + 4 * MM;
            const h = ar.bottom - top - 6 * MM, full = ar.width * 7 / 21;          // the print banner is 21 : 7 (js/buch-druck.css)
            const next = nextAfter(fig);
            if (h < full * 0.45 || h >= full || !next) return;
            const copy = fig.cloneNode(true);
            copy.classList.add('d-gequetscht');
            copy.style.top = (top - ar.top) + 'px';
            copy.querySelector('img').style.height = h + 'px';
            page.area.style.position = 'relative';
            page.area.appendChild(copy);
            breakToken.node = next;
            breakToken.offset = 0;
        }
    });

    // ---------- white space at the foot of a page: a picture or squared paper for notes ----------
    // Doc, 28.10.2026, paging through the Letter proof: "Guck mal immer, wenn nur eine halbe Seite ausgefüllt ist, dass man da
    // irgendwie noch coole Bilder reinmacht" - and where no picture fits: "persönliche Notizen … wirklich eine Karo-Seite".
    // It runs after Paged.js has set the pages, so nothing moves: every edition and format fills its own gaps. The pictures
    // come from js/buch-fotos.js: vorn (foreword, how-to) and luecken (per chapter file and section, else the whole chapter).
    // Page 2, under the imprint, shows all the books ("Das klar wird, hier gibt es noch viel mehr").
    const BUECHER = ['mathegy5', 'mathegy6', 'mathegy7', 'mathegy8', 'mathegy9', 'mathegy10', 'mathegy11', 'mathegy12', 'mathegy11lk', 'mathegy12lk',
        'mathe5', 'mathe6', 'mathe7', 'mathe8', 'mathe9', 'mathe10', 'mathe11', 'mathe12', 'mathe13', 'mathefos11', 'mathefos12'];   // as in js/labs-config.js
    function gapBox(area, cls, top, h) {
        const box = el('div', 'd-luecke ' + cls);
        box.style.top = top + 'px'; box.style.height = h + 'px';
        area.style.position = 'relative';
        area.appendChild(box);
        return box;
    }
    // photos side by side, as large as the box allows, captions below; null when they would be too small
    async function gapFotos(area, names, top, h, bottom) {
        const fs = names.map(n => Buch.fotoInfo(n)).filter(Boolean);
        if (!fs.length) return null;
        const imgs = await Promise.all(fs.map(f => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = f.src; })));
        if (imgs.some(i => !i)) return null;
        const W = area.getBoundingClientRect().width, gap = 6 * MM;
        const sumA = imgs.reduce((s, i) => s + i.naturalWidth / i.naturalHeight, 0);
        // a single photo with room beside it gets its caption there, so the photo may take the whole height of the gap
        const cw = 62 * MM, side = fs.length === 1 && W - Math.min(h, 95 * MM) * sumA >= cw + gap;
        let ih = side ? Math.min(h, 95 * MM) : Math.min(h - 9 * MM, (W - gap * (imgs.length - 1)) / sumA, 95 * MM);
        const box = gapBox(area, 'd-luecke-fotos', top, h);
        const figs = fs.map(f => box.appendChild(el('figure', side ? 'd-seite' : '', '<img src="' + f.src + '" alt="' + f.alt.replace(/"/g, '&quot;') + '">' +
            '<figcaption><b>' + f.alt + '</b><br>' + f.credit + '</figcaption>')));
        const size = () => figs.forEach((fig, k) => {
            const w = ih * imgs[k].naturalWidth / imgs[k].naturalHeight;
            if (side) { fig.firstChild.style.width = w + 'px'; fig.lastChild.style.width = cw + 'px'; }
            else fig.style.width = w + 'px';
            fig.firstChild.style.height = ih + 'px';
        });
        // the captions take what they need (a narrow photo wraps its caption into many lines): the photos give way until it fits
        let need = 0;
        for (let k = 0; k < 5; k++) {
            size();
            box.style.height = 'auto';
            need = box.offsetHeight;
            if (need <= h + 1) break;
            ih -= need - h;
        }
        // too small to be worth it - unless the photos already fill the width (a panorama is flat by nature)
        if (need > h + 1 || ih < (ih * sumA + gap * (imgs.length - 1) > W - 2 ? 28 : 34) * MM) { box.remove(); return null; }
        // at the foot (foreword), at the top when squared paper still fits below it, else in the middle of the gap
        box.style.height = need + 'px';
        box.style.top = (bottom ? top + h - need : h - need >= 80 * MM ? top : top + (h - need) / 2) + 'px';
        return box;
    }
    function gapNotes(area, top, h, afterLabs) {
        const head = 13 * MM, rows = Math.floor((h - head) / (5 * MM)), cols = Math.floor(area.getBoundingClientRect().width / (5 * MM));
        if (rows < 6) return;
        const box = gapBox(area, 'd-luecke-notiz', top, head + rows * 5 * MM);
        let lines = '';
        for (let x = 0; x <= cols; x++) lines += '<line x1="' + x * 5 + '" y1="0" x2="' + x * 5 + '" y2="' + rows * 5 + '"/>';
        for (let y = 0; y <= rows; y++) lines += '<line x1="0" y1="' + y * 5 + '" x2="' + cols * 5 + '" y2="' + y * 5 + '"/>';
        box.innerHTML = '<p class="d-notiz-h">' + tr('Meine Notizen', 'My notes', 'Mis notas', 'I miei appunti', 'Mes notes') +
            (afterLabs ? '<span>' + tr('Was hast du beim Üben online herausgefunden?', 'What did you find out while practising online?',
                '¿Qué has descubierto practicando en línea?', 'Che cosa hai scoperto esercitandoti online?', 'Qu’as-tu découvert en t’entraînant en ligne ?') + '</span>' : '') + '</p>' +
            // 0.2 mm more all round: the outer lines sit on the edge and were cut in half - right and bottom vanished (Doc, p. 85)
            '<svg viewBox="-0.2 -0.2 ' + (cols * 5 + 0.4) + ' ' + (rows * 5 + 0.4) + '" style="width:' + (cols * 5 + 0.4) + 'mm;height:' + (rows * 5 + 0.4) + 'mm">' + lines + '</svg>';
    }
    function gapBooks(area, top, h) {
        const lang = Buch.lang && Buch.lang !== 'de' ? '-' + Buch.lang : '', title = 9 * MM, rows = 3, cols = 7;
        const W = area.getBoundingClientRect().width;
        const ch = Math.min((h - title - 4 * MM) / rows - 3 * MM, (W / cols) * 1.25);
        if (ch < 22 * MM) return;
        const box = gapBox(area, 'd-luecke-buecher', top + (h - title - rows * (ch + 3 * MM)) / 2, title + rows * (ch + 3 * MM));
        box.innerHTML = '<p class="d-buecher-h">' + tr('Alle 21 Lehrbücher, kostenlos online', 'All 21 textbooks, free online', 'Los 21 libros de texto, gratis en línea',
            'Tutti i 21 libri di testo, gratis online', 'Les 21 manuels, gratuits en ligne') + ' · docalvers.de</p><div class="d-buecher"></div>';
        box.lastChild.style.setProperty('--h', ch + 'px');
        box.lastChild.innerHTML = BUECHER.map(b => '<img src="../../resources/og/buch-' + b + lang + '-cover.jpg" alt=""' + (b === Buch.book ? ' class="d-dieses"' : '') + '>').join('');
    }
    async function fillGaps() {
        await Buch.fotosReady;
        const F = window.BUCH_FOTOS || {}, vorn = F.vorn || {}, luecken = (F.luecken || {})[Buch.book] || {}, used = new Set();
        // the photos still free in a list, each entry a photo or a group side by side: the first that fits the gap wins
        const free = list => (list ? [].concat(list) : []).map(x => [].concat(x)).filter(ns => ns.every(n => !used.has(n)));
        // a box Paged.js split at its very start leaves an empty frame at the foot of the page (every Rückblick did -
        // Doc on p. 146: "eine leere Box, die sich mit dem Bild überschneidet"): gone
        document.querySelectorAll('.pagedjs_page [data-split-to]').forEach(e => { if (!contentNodes(e).length) e.style.display = 'none'; });
        for (const pg of document.querySelectorAll('.pagedjs_page')) {
            const area = pg.querySelector('.pagedjs_area');
            if (!area || pg.querySelector('.d-cover, .d-toc, .d-loes-kap, .d-gequetscht')) continue;
            const nodes = contentNodes(area);
            if (!nodes.length) continue;
            // 5 mm kept free above the page number
            const ar = area.getBoundingClientRect(), top = contentBottom(area) + 7 * MM, h = ar.bottom - 5 * MM - top;
            const at = top - ar.top, last = nodeEl(nodes[nodes.length - 1]);
            if (h < 38 * MM) continue;                                   // photos from 38 mm, squared paper from 70 mm (below)
            if (pg.querySelector('.d-impressum')) { gapBooks(area, at, h); continue; }
            let cands = [], bottom = false;
            if (pg.querySelector('.d-gruss')) { cands = free(vorn.gruss); bottom = true; }
            else if (pg.querySelector('.d-front')) cands = free(vorn.sogehts);
            else {
                const chap = last.closest('[data-datei]'), map = chap && luecken[chap.dataset.datei];
                // after "Mehr üben online" squared paper for what one found out there, a photo only where 'mehr' names one
                if (map && last.closest('.b-labs')) cands = free(map.mehr);
                else if (map) {
                    for (let e = last.closest('[data-stelle]'); e; e = e.parentElement && e.parentElement.closest('[data-stelle]')) cands.push(...free(map[e.dataset.stelle]));
                    cands.push(...free(map.kapitel));
                }
            }
            let box = null, names = null;
            for (const ns of cands) if ((box = await gapFotos(area, ns, at, h, bottom))) { names = ns; break; }
            if (box) {
                names.forEach(n => used.add(n));
                const below = box.offsetTop + box.offsetHeight + 8 * MM;            // squared paper under a photo at the top
                if (at + h - below >= 70 * MM && last.closest('[data-datei]')) gapNotes(area, below, at + h - below, !!last.closest('.b-labs'));
                continue;
            }
            if (h >= 70 * MM && last.closest('[data-datei]')) gapNotes(area, at, h, !!last.closest('.b-labs'));
        }
    }

    async function build() {
        const book = document.getElementById('d-book');
        // cover and how-to: already in druck.html, online they are the start page; contents next
        const tag = (sel, z) => { const e = book.querySelector(sel); if (e) e.dataset.ziel = z; };
        tag('.d-cover', 'index.html|start|');
        tag('.d-front', 'index.html|sogehts|');
        const gruss = await grusswort(), front = book.querySelector('.d-front'), imp = impressum();
        if (gruss && front) front.before(gruss);
        if (front) { front.before(imp); front.appendChild(onlineBuch()); }
        // page 1 is the first sheet after the cover (js/buch-druck.css .d-p1)
        (gruss || imp).classList.add('d-p1');
        const loesungen = tr('Lösungen', 'Solutions', 'Soluciones', 'Soluzioni', 'Solutions');
        const toc = el('section', 'd-toc');
        toc.appendChild(el('h1', 'd-toc-h', tr('Inhalt', 'Contents', 'Índice', 'Indice', 'Sommaire')));
        const list = el('ol', 'd-toc-list');
        B.chapters.forEach(c => list.appendChild(el('li', '', '<a href="#kap-' + c.file.replace(/\.html$/, '') + '"><span class="d-toc-k">' + c.k + '</span><span class="d-toc-t">' + c.title +
            '<small>' + c.lb + ' · ' + c.when + '</small></span></a>')));
        list.appendChild(el('li', 'd-toc-loes', '<a href="#loesungen"><span class="d-toc-k">L</span><span class="d-toc-t">' + loesungen + '</span></a>'));
        toc.appendChild(list);
        toc.dataset.ziel = 'index.html|kapitel|';
        book.appendChild(toc);

        const loes = el('section', 'd-loesungen'); loes.id = 'loesungen';
        loes.appendChild(el('h1', 'd-ktitle', loesungen));
        loes.appendChild(el('p', 'd-loes-intro', tr(
            'Lösungen zu den Aufgaben (nach ihrer Nummer im Kapitel) und zu den Selbsttests. Die Lösungswege der Beispiele stehen direkt im Text.',
            'Solutions to the exercises (by their number in the chapter) and to the self-checks. The worked solutions of the examples are in the text itself.',
            'Soluciones de los ejercicios (según su número en el capítulo) y de las autoevaluaciones. Las resoluciones de los ejemplos están directamente en el texto.',
            'Soluzioni degli esercizi (secondo il loro numero nel capitolo) e delle autoverifiche. Gli svolgimenti degli esempi si trovano direttamente nel testo.',
            'Solutions des exercices (selon leur numéro dans le chapitre) et des autoévaluations. Les résolutions des exemples figurent directement dans le texte.')));

        // every chapter is drawn and frozen before the next one is loaded: Chrome keeps only about 16 WebGL contexts
        // alive and drops the oldest, so a book with many 3D pictures came out with blank first ones (LK 12, 10.10.2026)
        await document.fonts.ready;
        await Buch.fotosReady;
        for (let i = 0; i < B.chapters.length; i++) {
            const c = B.chapters[i];
            say(tr('Kapitel ' + c.k + ' wird geladen und gezeichnet …', 'Loading and drawing chapter ' + c.k + ' …', 'Cargando y dibujando el capítulo ' + c.k + ' …',
                'Caricamento e disegno del capitolo ' + c.k + ' …', 'Chargement et dessin du chapitre ' + c.k + '…'));
            const sec = await chapter(c, i);
            book.appendChild(sec);
            Buch.render(sec, { print: true });
            await Buch.settled();                                          // widgets that load first (Three.js)
            await wait(700);                                               // widgets draw, KaTeX settles
            window.dispatchEvent(new Event('resize'));
            await wait(300);
            freezeCanvases(sec);
            fitTables(sec);
            const part = harvest(sec, c);
            if (part) loes.appendChild(part);
        }
        book.appendChild(loes);
        impressumFotos(imp, book);
        // Paged.js measures the pages: every photo has to be there with its real height first
        say(tr('Fotos werden geladen …', 'Loading photos …', 'Cargando fotos …', 'Caricamento delle foto …', 'Chargement des photos…'));
        await Promise.all(Array.from(book.querySelectorAll('img')).map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
        say(tr('Seiten werden gesetzt … (das dauert einen Moment)', 'Setting the pages … (this takes a moment)', 'Maquetando las páginas … (tarda un momento)',
            'Impaginazione in corso … (ci vuole un momento)', 'Mise en page… (cela prend un moment)'));
        const t0 = performance.now();
        if (window.Farbschema && Farbschema.freeze) Farbschema.freeze();     // Paged.js copies the sheets: nothing more to translate
        // the running head names the book (kapitel.js), e.g. "DOC ALVERS MATHE-LABOR · MATHEMATIK 12"
        const head = document.createElement('style');
        head.textContent = '@page { @top-right { content: "DOC ALVERS MATHE-LABOR · ' + String(B.short || '').toUpperCase().replace(/"/g, '') + '"; } }';
        // Letter: the same 178 mm text width as A4 (wider side margins), so widgets look the same and only the page breaks move
        if (LETTER) head.textContent += '@page { size: letter; margin: 17mm 18.95mm 19mm 18.95mm; }' +
            '.d-cover, .d-cover .b-titel { width: 215.9mm; height: 279.4mm; }';
        document.head.appendChild(head);
        // only the book goes onto the pages; the status bar stays outside
        const frag = document.createDocumentFragment();
        frag.appendChild(book);
        await window.PagedPolyfill.preview(frag, undefined, document.getElementById('d-pages'));
        await fillGaps();
        // pictures added after the setting have to be there before anyone prints (tools/kdp/kdp.mjs waits for d-ready)
        await Promise.all(Array.from(document.querySelectorAll('.d-luecke img, .d-gequetscht img')).map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
        const pages = document.querySelectorAll('.pagedjs_page').length;
        const dauer = Math.round((performance.now() - t0) / 1000);
        say(tr(pages + ' Seiten fertig in ' + dauer + ' s. Drucken: Strg/Cmd + P → „Als PDF speichern“.',
            pages + ' pages ready in ' + dauer + ' s. Print: Ctrl/Cmd + P → “Save as PDF”.',
            pages + ' páginas listas en ' + dauer + ' s. Imprimir: Ctrl/Cmd + P → «Guardar como PDF».',
            pages + ' pagine pronte in ' + dauer + ' s. Stampa: Ctrl/Cmd + P → «Salva come PDF».',
            pages + ' pages prêtes en ' + dauer + ' s. Imprimer\u00a0: Ctrl/Cmd + P → «\u00a0Enregistrer au format PDF\u00a0».'));
        document.body.classList.add('d-ready');
        // the local server's LOCAL badge is fixed and would land on every printed page: it moves into the status bar,
        // which Paged.js keeps off the paper (our own @media print rules do not survive Paged.js)
        const badge = document.getElementById('local-badge');
        if (badge) { badge.style.position = 'static'; badge.style.marginLeft = '10px'; document.querySelector('.d-bar')?.appendChild(badge); }
        window.__druckFertig = pages;
        if (OV) ovReady();
    }

    // ---------- overview mode: druck.html?uebersicht in a frame over the online book (js/buch.js, key O) ----------
    // Doc, 09.10.2026: "alle Seiten, die dann im PDF stehen werden … auf einen Blick … eine auswählen und reinspringen".
    // The sheets become tiles, as large as the window allows for all of them at once (+ and − make them bigger and
    // smaller); the reader's page glows gold, its chapter a little; a click jumps to the first block of that page online.
    const OV = new URLSearchParams(location.search).has('uebersicht');
    const host = () => { try { return window.parent !== window ? window.parent.BuchUebersicht : null; } catch (_) { return null; } };
    let ovScale = 1, pageW = 0, pageH = 0, picked = null;
    function ovLayout() {
        root.classList.toggle('d-ov-narrow', innerWidth <= 640);
        const box = document.querySelector('.pagedjs_pages');
        if (!box || !pageW) return;
        const n = box.querySelectorAll('.pagedjs_page').length, bar = document.querySelector('.d-bar');
        const PAD = 22, GAP = 12, R = pageH / pageW;
        const W = innerWidth - 2 * PAD, H = innerHeight - (bar ? bar.offsetHeight : 0) - 2 * PAD;
        let w = 0;
        for (let k = 1; k <= n; k++) {
            const r = Math.ceil(n / k);
            w = Math.max(w, Math.min((W - GAP * (k - 1)) / k, (H - GAP * (r - 1)) / r / R));
        }
        w = Math.min(W, Math.max(w, 56) * ovScale);                       // 56 px: below that a page is only a grey patch
        const cols = Math.max(1, Math.floor((W + GAP) / (w + GAP)));
        root.style.setProperty('--z', (w / pageW).toFixed(4));
        box.style.gridTemplateColumns = 'repeat(' + cols + ', ' + Math.floor(w) + 'px)';
        if (bild) bildGroesse(w);
    }
    function zeige(z) {
        z = String(z || '').replace(/"/g, '');
        const [f, s] = z.split('|');
        const pages = Array.from(document.querySelectorAll('.pagedjs_page'));
        pages.forEach(p => { p.classList.remove('d-ov-cur'); p.classList.toggle('d-ov-kap', !!f && p.dataset.ovZiel.startsWith(f + '|')); });
        // the page clicked last, when the reader is still where it led (its first block may have begun a page earlier)
        let hit = picked && picked.dataset.ovZiel === z ? picked : null;
        if (!hit) for (const sel of ['[data-ziel="' + z + '"]', '[data-ziel^="' + f + '|' + s + '|"]', '[data-ziel^="' + f + '|"]']) {
            const e = f && document.querySelector('.pagedjs_pages ' + sel);
            if (e) { hit = e.closest('.pagedjs_page'); break; }
        }
        // instant, as hin() in js/buch.js: buch.css scrolls smoothly, and across a hundred tiles that crawls
        if (hit) { hit.classList.add('d-ov-cur'); hit.scrollIntoView({ block: 'center', behavior: 'instant' }); }
    }
    function ovReady() {
        const pages = Array.from(document.querySelectorAll('.pagedjs_page'));
        if (!pages.length) return;
        const r = pages[0].getBoundingClientRect(); pageW = r.width; pageH = r.height;   // before the zoom
        let last = '';
        pages.forEach((p, i) => {
            const e = p.querySelector('[data-ziel]');
            p.dataset.ovZiel = last = e ? e.dataset.ziel : last;
            const c = B.chapters.find(c => last.startsWith(c.file + '|'));
            // the number printed on the sheet: the cover does not count (Doc reads the pages by these numbers)
            p.title = i ? tr('Seite', 'Page', 'Página', 'Pagina', 'Page') + ' ' + i + (c ? ' · ' + tr('Kapitel', 'Chapter', 'Capítulo', 'Capitolo', 'Chapitre') + ' ' + c.k + ' · ' + c.title : '')
                : tr('Einband', 'Cover', 'Cubierta', 'Copertina', 'Couverture');
            if (i) p.appendChild(el('span', 'd-ov-no', String(i)));
        });
        root.classList.add('d-ov-ready');
        ovLayout();
        say(pages.length + tr(' Seiten · Klick springt ins Online-Buch · + − Größe · O oder Esc schließt', ' pages · a click jumps into the online book · + − size · O or Esc closes',
            ' páginas · un clic salta al libro en línea · + − tamaño · O o Esc cierra', ' pagine · un clic salta al libro online · + − dimensione · O o Esc chiude',
            ' pages · un clic ouvre le livre en ligne · + − taille · O ou Échap ferme'));
        const h = host();
        zeige(h ? h.wo() : '');
        window.BuchDruckOv = { zeige };
        addEventListener('resize', ovLayout);
    }
    function vollbild() {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(() => { });
    }
    function ovSize(f) {
        ovScale = Math.min(6, Math.max(1, ovScale * f));
        ovLayout();
        const cur = document.querySelector('.pagedjs_page.d-ov-cur');
        if (cur) cur.scrollIntoView({ block: 'center', behavior: 'instant' });
    }

    // ---------- the overview from pictures (tools/buch-seiten/seitenbilder.mjs) ----------
    // Doc, 27.10.2026, on the phone: "Die lädt sehr langsam" - setting all 164 pages of Mathe 11 took ~40 s there. The
    // pages are rendered once into sprites on R2 (buch/seiten/<buch>/): s.webp holds all of them small, l-<k>.webp nine
    // at full size for bigger tiles (+). A tile carries the jump targets of its blocks as empty [data-ziel] elements and
    // the class of a set sheet, so layout, gold frame, numbers and the click work as on set pages. No pictures yet: build().
    let bild = null;
    const bildPos = (i, cols, rows) => (cols > 1 ? (i % cols) / (cols - 1) * 100 : 0) + '% ' + (rows > 1 ? Math.floor(i / cols) / (rows - 1) * 100 : 0) + '%';
    async function ovBilder() {
        const book = (here.match(/\/buch\/([^/]+)\/$/) || [])[1];
        if (!book || !Buch.media) return false;
        // the pictures of the book's own format, of the other one in <buch>-letter / <buch>-a4 (seitenbilder.mjs --letter / --a4)
        const base = Buch.media + 'seiten/' + book + (FORMAT === OWN ? '' : '-' + FORMAT) + '/';
        let m = null;
        try { const r = await fetch(base + 'seiten.json', { cache: 'no-cache' }); if (r.ok) m = await r.json(); } catch (_) { }
        if (!m || !Array.isArray(m.seiten) || !m.seiten.length) return false;
        const q = '?v=' + encodeURIComponent(m.v), small = 'url("' + base + 's.webp' + q + '")';
        say(tr('Seiten werden geladen …', 'Loading pages …', 'Cargando páginas …', 'Caricamento delle pagine …', 'Chargement des pages…'));
        // the tiles appear once the small sprite is there, not as white sheets filling in
        await new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = base + 's.webp' + q; });
        const box = el('div', 'pagedjs_pages');
        m.seiten.forEach((zs, i) => {
            const p = el('div', 'pagedjs_page d-ov-bild');
            p.dataset.i = i;
            p.style.width = m.w + 'px'; p.style.height = m.h + 'px';
            p.style.backgroundImage = small;
            p.style.backgroundSize = m.s.cols * 100 + '% ' + m.s.rows * 100 + '%';
            p.style.backgroundPosition = bildPos(i, m.s.cols, m.s.rows);
            zs.forEach(z => { const e = document.createElement('i'); e.hidden = true; e.dataset.ziel = z; p.appendChild(e); });
            box.appendChild(p);
        });
        document.getElementById('d-book').style.display = 'none';
        document.getElementById('d-pages').appendChild(box);
        bild = { m, base, q, small, big: false, t: 0 };
        addEventListener('scroll', nachladen, { passive: true });
        ovReady();
        return true;
    }
    // bigger than the small sprite on this screen: the visible tiles get their large picture, the small one stays beneath until it is there
    function bildGroesse(w) {
        bild.big = w * (window.devicePixelRatio || 1) > bild.m.s.w * 1.15;
        nachladen();
    }
    // only where the scroll comes to rest, half a screen ahead and behind: the smooth scroll to the gold page and a
    // flick on the phone pass dozens of tiles that need no large picture
    function nachladen() {
        clearTimeout(bild.t);
        bild.t = setTimeout(() => {
            if (bild.big) document.querySelectorAll('.d-ov-bild').forEach(p => {
                const r = p.getBoundingClientRect();
                if (r.bottom > -innerHeight / 2 && r.top < innerHeight * 1.5) gross(p);
            });
        }, 150);
    }
    function gross(p) {
        if (p.dataset.gross) return;
        p.dataset.gross = '1';
        const m = bild.m, i = +p.dataset.i, k = Math.floor(i / m.l.per), j = i % m.l.per;
        const rows = Math.ceil(Math.min(m.l.per, m.seiten.length - k * m.l.per) / m.l.cols);
        p.style.backgroundImage = 'url("' + bild.base + 'l-' + k + '.webp' + bild.q + '"), ' + bild.small;
        p.style.backgroundSize = m.l.cols * 100 + '% ' + rows * 100 + '%, ' + m.s.cols * 100 + '% ' + m.s.rows * 100 + '%';
        p.style.backgroundPosition = bildPos(j, m.l.cols, rows) + ', ' + bildPos(i, m.s.cols, m.s.rows);
    }

    if (OV) {
        document.documentElement.classList.add('d-ov');
        document.documentElement.classList.toggle('d-ov-narrow', innerWidth <= 640);   // already while it is built
        document.getElementById('d-book')?.classList.add('d-ov-src');            // hidden while it is built (js/buch-druck.css)
        document.getElementById('d-pages')?.classList.add('d-ov-pages');
        const bar = document.querySelector('.d-bar');
        if (bar) {
            bar.querySelector('b').textContent = tr('DRUCKAUSGABE · ALLE SEITEN', 'PRINT EDITION · ALL PAGES', 'EDICIÓN IMPRESA · TODAS LAS PÁGINAS', 'EDIZIONE A STAMPA · TUTTE LE PAGINE', 'ÉDITION IMPRIMÉE · TOUTES LES PAGES');
            if (status) status.classList.add('d-ov-hint');
            const btn = (txt, title, fn) => { const b = el('button', 'd-ov-btn', txt); b.type = 'button'; b.title = title; b.addEventListener('click', fn); bar.appendChild(b); };
            btn('−', tr('Kleiner (−)', 'Smaller (−)', 'Más pequeño (−)', 'Più piccolo (−)', 'Plus petit (−)'), () => ovSize(1 / 1.5));
            bar.lastChild.classList.add('d-ov-first');
            btn('+', tr('Größer (+)', 'Larger (+)', 'Más grande (+)', 'Più grande (+)', 'Plus grand (+)'), () => ovSize(1.5));
            // full screen: on the big screen the tiles get the whole of it (Doc, 28.10.2026: "gib mir auch in dieser Overview
            // Seite ein Fullscreen-Button"); in the online book the frame allows it (js/buch.js)
            if (document.fullscreenEnabled) {
                btn('', tr('Vollbild (F)', 'Full screen (F)', 'Pantalla completa (F)', 'Schermo intero (F)', 'Plein écran (F)'), vollbild);
                bar.lastChild.innerHTML = '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
                    '<path d="M1.5 5.5v-4h4M10.5 1.5h4v4M14.5 10.5v4h-4M5.5 14.5h-4v-4"/></svg>';
            }
            btn('×', tr('Schließen (O oder Esc)', 'Close (O or Esc)', 'Cerrar (O o Esc)', 'Chiudi (O o Esc)', 'Fermer (O ou Échap)'), () => { const h = host(); if (h) h.zu(); });
        }
        ovWait = document.body.appendChild(el('div', 'd-ov-wait', tr('Wird vorbereitet …', 'Getting ready …', 'Preparando …', 'Preparazione …', 'Préparation…')));
        // a click on a sheet jumps, beside the sheets closes; links on the sheets (QR, contents) do not navigate the frame
        document.addEventListener('click', e => {
            if (e.target.closest('.d-bar')) return;
            e.preventDefault(); e.stopPropagation();
            const p = e.target.closest('.pagedjs_page'), h = host();
            if (!p) { if (h) h.zu(); return; }
            const z = p.dataset.ovZiel; if (!z) return;
            picked = p;
            if (h) h.sprung(z);
            else { const [f, s] = z.split('|'); location.href = f + (s ? '#' + s : ''); }
        }, true);
        addEventListener('keydown', e => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'Escape' && document.fullscreenElement) return;                // Esc leaves full screen first
            if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') { e.preventDefault(); const h = host(); if (h) h.zu(); }
            else if ((e.key === 'f' || e.key === 'F') && document.fullscreenEnabled) vollbild();
            else if (e.key === '+' || e.key === '=') ovSize(1.5);
            else if (e.key === '-' || e.key === '−') ovSize(1 / 1.5);
        });
        // a sheet the mouse rests on shows large on the other half of the screen, as it stands in the PDF (Doc, 28.10.2026:
        // "dass beim Hover die Seite groß angezeigt wird, wie sie im PDF wäre"); the click still opens the online book
        if (matchMedia('(hover: hover)').matches) {
            // its place inline: Paged.js takes position: fixed in a sheet for an element to repeat on every page
            const lupe = document.body.appendChild(el('div', 'd-ov-lupe'));
            lupe.style.cssText = 'position: fixed; z-index: 50; pointer-events: none; display: none';
            let over = null, t = 0;
            const weg = () => { clearTimeout(t); over = null; lupe.style.display = 'none'; lupe.textContent = ''; };
            document.addEventListener('mouseover', e => {
                const p = e.target.closest('.pagedjs_pages .pagedjs_page');
                if (p === over) return;
                weg();
                if (!p || !pageW) return;
                over = p;
                t = setTimeout(() => {
                    if (bild && p.classList.contains('d-ov-bild')) gross(p);
                    const c = p.cloneNode(true), z = 0.8 * Math.min(innerHeight * 0.94 / pageH, innerWidth * 0.48 / pageW);
                    c.classList.remove('d-ov-cur', 'd-ov-kap');
                    c.style.zoom = z;
                    lupe.appendChild(c);
                    // right beside the sheet, towards the middle of the screen, never over it ("dichter an die Maus ran")
                    const r = p.getBoundingClientRect(), w = pageW * z, h = pageH * z, gap = 14;
                    const x = r.left + r.width / 2 < innerWidth / 2 ? Math.min(r.right + gap, innerWidth - w - 8) : Math.max(r.left - gap - w, 8);
                    lupe.style.left = x + 'px';
                    lupe.style.top = Math.max(8, Math.min(r.top + r.height / 2 - h / 2, innerHeight - h - 8)) + 'px';
                    lupe.style.display = 'block';
                }, 250);
            });
            document.documentElement.addEventListener('mouseleave', weg);
        }
    }

    // screen decoration (grey desk, gaps, shadows, status bar) only on screen: off while printing (js/buch-druck.css)
    const root = document.documentElement;
    root.classList.add('d-screen');
    const printing = on => root.classList.toggle('d-screen', !on);
    addEventListener('beforeprint', () => printing(true));
    addEventListener('afterprint', () => printing(false));
    const mq = matchMedia('print');
    if (mq.addEventListener) mq.addEventListener('change', e => printing(e.matches));
    document.getElementById('d-print')?.addEventListener('click', () => window.print());
    const start = () => build().catch(e => { say('Fehler: ' + e.message); console.error(e); });
    const loaded = () => { if (document.readyState === 'complete') start(); else window.addEventListener('load', start); };
    // the overview first tries the pictures: it need not wait for the page to load, nor set anything (&neu: set afresh)
    if (OV && !NEU) ovBilder().catch(e => { console.error(e); return false; }).then(ok => { if (!ok) loaded(); });
    else loaded();
})();
