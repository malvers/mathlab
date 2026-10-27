/* buch.js — behaviour of the interactive textbook pages (HTML/buch/…), shared by every chapter.
 *
 * A chapter page is plain HTML; this file turns its markup into the book:
 *   section.b-sec[id][data-toc]          → entry in the chapter list (left) and the pill strip (narrow screens)
 *   .b-tasks > .b-task[data-lvl]         → numbered task with level mark, "Tipp" / "Lösung" buttons for .b-hint / .b-sol
 *   .b-check > .b-q[data-ans] / [data-mc]→ self-check: answer field (fraction, decimal comma or percent) or choice
 *   a.b-lab[data-lab]                    → lab card with the lab's own icon from js/labs-icons.js (without: the book icon)
 *   [data-widget="name"]                 → interactive widget registered with Buch.widget(name, init)
 * Maths: $…$ and $$…$$ via KaTeX auto-render (loaded by the page, fires 'katex-ready').
 * Solved self-checks are remembered per browser (localStorage, wrapped - the page works without it).
 * Debug window (js/debug-window.js) only with ?debug in the address.
 * English editions (buch/<book>-en/, <html lang="en">): t(de, en) picks the words of this file, numbers get a decimal
 * point; the widget modules are translated by js/buch-en.js, which those pages load before this file.
 * Spanish editions (buch/<book>-es/, <html lang="es">, package ES0, 12.10.2026): t(de, en, es) picks the third word,
 * numbers keep the decimal comma; the widget modules are translated by js/buch-es.js. Buch.en stays true only for English.
 * Italian editions (buch/<book>-it/, <html lang="it">, package IT0, 18.10.2026): t(de, en, es, it) picks the fourth word
 * (a missing Italian falls back to German), numbers keep the decimal comma, the widget modules are translated by js/buch-it.js.
 * French editions (buch/<book>-fr/, <html lang="fr">, package FR0, 22.10.2026): t(de, en, es, it, fr) picks the fifth word
 * (a missing French falls back to German), numbers keep the decimal comma, the widget modules are translated by js/buch-fr.js.
 */
(function () {
    'use strict';

    // the language of the page: German books as before, English editions (Doc, 10.10.2026: "übersetz unser 1. Buch ins EN")
    // and Spanish editions (Doc, 12.10.2026: "übersetze bitte drei Bücher ins Spanische"): Buch.lang = 'de' | 'en' | 'es'
    // and Italian editions (Doc, 18.10.2026: "Bitte in Italienisch"): Buch.lang = 'de' | 'en' | 'es' | 'it'
    // and French editions (Doc, 22.10.2026: "mach die Übersetzung der Bücher in Französisch"): Buch.lang = … | 'fr'
    const LANG = /^en/i.test(document.documentElement.lang || '') ? 'en' : /^es/i.test(document.documentElement.lang || '') ? 'es' : /^it/i.test(document.documentElement.lang || '') ? 'it' :
        /^fr/i.test(document.documentElement.lang || '') ? 'fr' : 'de';
    const EN = LANG === 'en', ES = LANG === 'es', IT = LANG === 'it', FR = LANG === 'fr';
    // a word without its Spanish (Italian, French) falls back to German, never to English
    const t = (de, en, es, it, fr) => EN ? en : ES && es !== undefined ? es : IT && it !== undefined ? it : FR && fr !== undefined ? fr : de;

    // The debug window only on request: ?debug in the address (Doc, 09.10.2026: "im Moment brauchen wir es ja nicht").
    // Loaded from beside this file; its own autostart (DOMContentLoaded) may already be past, so start it here.
    const ME = document.currentScript && document.currentScript.src;
    if (ME && new URLSearchParams(location.search).has('debug')) {
        const sc = document.createElement('script');
        sc.src = ME.replace(/buch\.js(\?.*)?$/, 'debug-window.js');
        sc.onload = () => { try { DebugWindow.init(); dbg('debug window on'); } catch (_) { } };
        document.head.appendChild(sc);
    }

    function dbg(msg) {
        try { if (typeof DebugWindow !== 'undefined' && DebugWindow.log) DebugWindow.log('[buch] ' + msg); } catch (_) { }
    }

    // ---------- numbers ----------
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }

    // exact fractions for probabilities read off a tree (integers only)
    class Frac {
        constructor(n, d = 1) {
            if (d < 0) { n = -n; d = -d; }
            const g = gcd(n, d);
            this.n = n / g; this.d = d / g;
        }
        mul(o) { return new Frac(this.n * o.n, this.d * o.d); }
        add(o) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
        sub(o) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
        get value() { return this.n / this.d; }
        tex() { return this.d === 1 ? String(this.n) : '\\tfrac{' + this.n + '}{' + this.d + '}'; }
        texBig() { return this.d === 1 ? String(this.n) : '\\dfrac{' + this.n + '}{' + this.d + '}'; }
    }

    // German number: comma, up to `digits` decimals, trailing zeros dropped (English editions: decimal point; Spanish: comma)
    function fmt(x, digits = 4) {
        if (!isFinite(x)) return '–';
        let s = Number(x).toFixed(digits);
        if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
        return EN ? s : s.replace('.', ',');
    }
    // the same inside TeX: the comma must not add space ({,})
    function texNum(x, digits = 4) { return fmt(x, digits).replace(',', '{,}'); }
    // terms in TeX: signed number "+ 2{,}5" / "- 2{,}5" (empty for 0; first = no plus in front)
    function sg(v, d = 2, first = false) {
        if (Math.abs(v) < 1e-12) return '';
        const s = texNum(Math.abs(v), d);
        if (first) return (v < 0 ? '-' : '') + s;
        return v < 0 ? ' - ' + s : ' + ' + s;
    }
    // coefficient in front of a variable: 1 → "", −1 → "-", else the number
    function co(v, d = 2) { return Math.abs(v - 1) < 1e-9 ? '' : Math.abs(v + 1) < 1e-9 ? '-' : texNum(v, d); }
    // signed term with a variable: "+ x", "- 2{,}5x", empty for 0
    function sgx(v, x, d = 2) { if (Math.abs(v) < 1e-12) return ''; const a = Math.abs(v); return (v < 0 ? ' - ' : ' + ') + (Math.abs(a - 1) < 1e-9 ? '' : texNum(a, d)) + x; }
    // a term in JS notation ("x^2", "2^x", "sin(x)") as a function of x
    function compile(expr) {
        const e = String(expr).replace(/\^/g, '**');
        // eslint-disable-next-line no-new-func
        return new Function('x', 'with (Math) { return (' + e + '); }');
    }
    function pct(x, digits = 1) { return fmt(x * 100, digits) + (EN ? '%' : ' %'); }

    // what a student types: "1/36", "0,25", "25 %", "≈ 0.49", "1 / 3"
    function parseAnswer(raw) {
        if (raw == null) return NaN;
        let s = String(raw).trim().replace(/[≈~\s]/g, '').replace(/−/g, '-');
        if (!s) return NaN;
        // what pupils write around the number: "x = 5", "+24", "€40", "60°", "40 €", "12 cm²", "80 km/h" - the number
        // counts, not its unit (second check of 12.10.2026, note X1: correct answers with a unit were marked wrong)
        s = s.replace(/^[a-zA-Z][a-zA-Z0-9_]*=/, '').replace(/^\+/, '').replace(/^€/, '');
        let percent = false;
        if (s.endsWith('%')) { percent = true; s = s.slice(0, -1); }
        const unit = s.match(/^(.*\d)([a-zA-ZäöüÄÖÜß°€²³µ\/.]{1,12})$/);
        if (unit && !/^e-?\d/i.test(unit[2])) s = unit[1];
        if (EN && /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');   // English "1,500" is fifteen hundred
        s = s.replace(/,/g, '.');
        let v;
        const m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
        if (m) v = parseFloat(m[1]) / parseFloat(m[2]);
        else if (/^-?\d*\.?\d+(e-?\d+)?$/i.test(s)) v = parseFloat(s);
        else return NaN;
        return percent ? v / 100 : v;
    }
    function matches(raw, expected, tol) {
        const v = parseAnswer(raw), e = parseAnswer(expected);
        if (isNaN(v) || isNaN(e)) return false;
        if (tol == null) tol = (Number.isInteger(e) && !String(expected).includes('/')) ? 0 : 0.005;
        const near = (a, b) => Math.abs(a - b) <= tol + 1e-12;
        if (near(v, e)) return true;
        // "25" and "25 %" both mean 25 percent when only one side carries the % sign
        const rp = /%\s*$/.test(String(raw).trim()), ep = /%\s*$/.test(String(expected).trim());
        return rp !== ep && (rp ? near(v * 100, e) : near(v, e * 100));
    }

    // ---------- storage (never required) ----------
    const KEY = 'buch:' + location.pathname.replace(/^.*\/buch\//, '');
    function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } }
    function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { } }
    const state = load();

    // ---------- icons (plain geometry, SVG) ----------
    const ICON = {
        ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
        bad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
        // a page of the lab that belongs to the book (practice sheets, applications, a sister book): an open book with a tick
        // (Doc, 24.10.2026, on "Mehr üben online": "ein Icon entwickeln, was auf einen Link im Buch deutet")
        buch: '<svg class="b-ic-buch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.5 5 8.5 4.5 3 4.5v13c5.5 0 7.5.5 9 2 1.5-1.5 3.5-2 9-2v-13c-5.5 0-7.5.5-9 2z"/><path d="M12 6.5v13"/><path d="M14.8 11.6l1.9 1.9 3.3-3.6"/></svg>'
    };

    // ---------- maths ----------
    const MATH_OPTS = {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false
    };
    function math(el) {
        if (!el) return;
        if (typeof window.renderMathInElement === 'function') {
            try { window.renderMathInElement(el, MATH_OPTS); } catch (e) { dbg('katex ' + e.message); }
        }
    }
    window.addEventListener('katex-ready', () => math(document.querySelector('.b-main')));

    // ---------- tasks ----------
    function buildTasks(root) {
        root.querySelectorAll('.b-tasks').forEach(list => {
            let no = parseInt(list.dataset.start || '1', 10);
            list.querySelectorAll(':scope > .b-task').forEach(task => {
                const q = task.querySelector(':scope > .b-task-q');
                const hint = task.querySelector(':scope > .b-hint');
                const sol = task.querySelector(':scope > .b-sol');
                const head = document.createElement('div');
                head.className = 'b-task-head';
                const num = document.createElement('div');
                num.className = 'b-task-no'; num.textContent = no++;
                head.appendChild(num);
                const lvl = document.createElement('span');
                lvl.className = 'b-lvl'; lvl.dataset.lvl = task.dataset.lvl || '1';
                lvl.title = (EN ? ['', 'Basic', 'Intermediate', 'Advanced'] : ES ? ['', 'Básico', 'Intermedio', 'Avanzado'] : IT ? ['', 'Base', 'Intermedio', 'Avanzato'] :
                    FR ? ['', 'Base', 'Intermédiaire', 'Avancé'] : ['', 'Grundlage', 'Mittel', 'Anspruchsvoll'])[+lvl.dataset.lvl] || '';
                lvl.setAttribute('aria-label', t('Niveau: ', 'Level: ', 'Nivel: ', 'Livello: ', 'Niveau : ') + lvl.title);
                head.appendChild(lvl);
                task.insertBefore(head, q);
                if (q) head.appendChild(q);
                if (!hint && !sol) return;
                const acts = document.createElement('div');
                acts.className = 'b-acts';
                task.insertBefore(acts, hint || sol);
                [[hint, t('Tipp', 'Hint', 'Pista', 'Suggerimento', 'Indice'), 'b-hintbtn'], [sol, t('Lösung', 'Solution', 'Solución', 'Soluzione', 'Solution'), '']].forEach(([box, label, cls]) => {
                    if (!box) return;
                    box.classList.add('b-reveal');
                    const b = document.createElement('button');
                    b.type = 'button'; b.className = 'b-btn ' + cls; b.textContent = label;
                    b.addEventListener('click', () => {
                        const open = box.classList.toggle('open');
                        b.classList.toggle('open', open);
                    });
                    acts.appendChild(b);
                });
                // the reveals go after the buttons, hint before solution
                if (hint) task.appendChild(hint);
                if (sol) task.appendChild(sol);
            });
        });
    }

    // ---------- reveals outside a task (worked examples): own buttons, no number ----------
    function buildLoose(root) {
        root.querySelectorAll('.b-hint:not(.b-reveal), .b-sol:not(.b-reveal)').forEach(box => {
            if (box.closest('.b-task, .b-q')) return;
            box.classList.add('b-reveal', 'b-loose');
            // hint and solution side by side share one button row
            let prev = box.previousElementSibling;
            while (prev && prev.classList.contains('b-loose')) prev = prev.previousElementSibling;
            let acts = prev && prev.classList.contains('b-acts') ? prev : null;
            if (!acts) {
                acts = document.createElement('div');
                acts.className = 'b-acts b-acts-loose';
                box.parentNode.insertBefore(acts, box);
            }
            const isHint = box.classList.contains('b-hint');
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'b-btn' + (isHint ? ' b-hintbtn' : '');
            b.textContent = isHint ? t('Tipp', 'Hint', 'Pista', 'Suggerimento', 'Indice') : t('Lösung zeigen', 'Show solution', 'Ver solución', 'Mostra la soluzione', 'Voir la solution');
            b.addEventListener('click', () => b.classList.toggle('open', box.classList.toggle('open')));
            acts.appendChild(b);
        });
    }

    // ---------- self-checks ----------
    function buildChecks(root) {
        root.querySelectorAll('.b-check').forEach((box, bi) => {
            const id = box.dataset.check || ('c' + bi);
            const qs = Array.from(box.querySelectorAll('.b-q'));
            const title = box.querySelector('.b-box-title');
            let score = null;
            if (title && qs.length) {
                score = document.createElement('span');
                score.className = 'b-check-score';
                title.appendChild(score);
            }
            function updateScore() {
                if (!score) return;
                const done = qs.filter((_, i) => state[id + ':' + i]).length;
                score.textContent = done + ' / ' + qs.length;
                score.classList.toggle('full', done === qs.length);
            }
            qs.forEach((q, i) => {
                const sk = id + ':' + i;
                const sol = q.querySelector(':scope > .b-sol');
                if (sol) sol.classList.add('b-reveal');
                let tries = 0;
                function showSol() { if (sol) sol.classList.add('open'); }
                function solved(val) {
                    state[sk] = val == null ? 1 : val; save(state); updateScore(); showSol();
                }
                if (q.dataset.mc != null) {
                    const btns = Array.from(q.querySelectorAll('.b-mc > button'));
                    const right = parseInt(q.dataset.mc, 10);
                    btns.forEach((b, bi2) => {
                        b.type = 'button';
                        b.addEventListener('click', () => {
                            if (bi2 === right) {
                                btns.forEach(x => x.classList.remove('bad'));
                                b.classList.add('ok'); solved(1);
                            } else {
                                b.classList.add('bad'); tries++;
                                if (tries >= 2) { btns[right].classList.add('ok'); showSol(); }
                            }
                        });
                    });
                    if (state[sk]) { btns[right] && btns[right].classList.add('ok'); showSol(); }
                    return;
                }
                if (q.dataset.ans == null) return;
                if (PRINT) {                                                       // paper: a line to write on
                    const line = document.createElement('div');
                    line.className = 'b-answer'; line.textContent = (q.dataset.label || t('Ergebnis', 'Answer', 'Resultado', 'Risultato', 'Résultat')) + ':';
                    q.insertBefore(line, sol || null);
                    return;
                }
                const row = document.createElement('div');
                row.className = 'b-ask';
                const inId = 'b-in-' + id + '-' + i;
                row.innerHTML =
                    '<label for="' + inId + '">' + (q.dataset.label || t('Ergebnis', 'Answer', 'Resultado', 'Risultato', 'Résultat')) + '</label>' +
                    '<input class="b-in" id="' + inId + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="' + (q.dataset.ph || t('z. B. 3/10', 'e.g. 3/10', 'p. ej. 3/10', 'per es. 3/10', 'p. ex. 3/10')) + '">' +
                    '<button type="button" class="b-btn">' + t('Prüfen', 'Check', 'Comprobar', 'Verifica', 'Vérifier') + '</button>' +
                    '<span class="b-fb" aria-live="polite"></span>';
                q.insertBefore(row, sol || null);
                const input = row.querySelector('input'), btn = row.querySelector('button'), fb = row.querySelector('.b-fb');
                function check() {
                    if (!input.value.trim()) return;
                    const ok = matches(input.value, q.dataset.ans, q.dataset.tol != null ? parseFloat(q.dataset.tol) : null);
                    input.classList.toggle('ok', ok); input.classList.toggle('bad', !ok);
                    fb.className = 'b-fb ' + (ok ? 'ok' : 'bad');
                    if (ok) { fb.innerHTML = ICON.ok + t(' richtig', ' correct', ' correcto', ' corretto', ' correct'); solved(input.value); dbg('check ' + sk + ' ok'); return; }
                    tries++;
                    fb.innerHTML = ICON.bad + (tries >= 2 && sol ? t(' noch nicht – schau dir die Lösung an', ' not yet – have a look at the solution', ' todavía no – mira la solución', ' non ancora – guarda la soluzione', ' pas encore – regarde la solution') : t(' noch nicht – versuch es noch einmal', ' not yet – try again', ' todavía no – inténtalo otra vez', ' non ancora – riprova', ' pas encore – réessaie'));
                    if (tries >= 2) showSol();
                }
                btn.addEventListener('click', check);
                input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
                if (state[sk]) {
                    input.value = typeof state[sk] === 'string' ? state[sk] : '';
                    input.classList.add('ok'); fb.className = 'b-fb ok'; fb.innerHTML = ICON.ok + t(' richtig', ' correct', ' correcto', ' corretto', ' correct'); showSol();
                }
            });
            updateScore();
        });
    }

    // ---------- lab cards ----------
    function buildLabs(root) {
        root.querySelectorAll('a.b-lab').forEach(a => {
            a.target = '_blank'; a.rel = 'noopener';
            const slot = a.querySelector('.b-lab-icon');
            if (slot && !slot.innerHTML.trim()) {
                const icons = (typeof LAB_ICONS !== 'undefined') ? LAB_ICONS : null;
                slot.innerHTML = (icons && icons[a.dataset.lab]) || ICON.buch;
            }
        });
    }

    // ---------- photos (js/buch-fotos.js): one list for every book and every language ----------
    // Doc, 24.10.2026: "Bilder aus der Lebensrealität … das wünsche ich mir wirklich sehr"; 25.10.: the translations
    // get them too, so the photos are placed by this code, not written into each chapter file.
    const BOOK = ((location.pathname.match(/\/buch\/([^/]+)\//) || [])[1] || '').replace(/-(en|es|it|fr)$/, '');
    // the photos live in Cloudflare R2 (bucket "media", folder buch/fotos/), not in git: free delivery, 10 GB
    // (Doc, 25.10.2026: "warum nicht R2?" - "ja! Toll!"); upload: node tools/media_publish.mjs <file> buch/fotos/<name>.jpg
    // The pictures of the print pages for the overview sit beside them (buch/seiten/, js/buch-druck.js).
    const MEDIA = 'https://pub-5e3b331002a14e5a8532e12ebae95bf9.r2.dev/buch/';
    const FOTO_DIR = MEDIA + 'fotos/';
    const fotosReady = new Promise(done => {
        if (window.BUCH_FOTOS || !ME) { done(); return; }
        const sc = document.createElement('script');
        sc.src = ME.replace(/buch\.js(\?.*)?$/, 'buch-fotos.js');
        sc.onload = sc.onerror = () => done();
        document.head.appendChild(sc);
    });
    function fotos(root, file, print) {
        const F = window.BUCH_FOTOS, list = F && F.books[BOOK] && F.books[BOOK][file];
        if (!list) return;
        list.forEach(p => {
            const f = F.fotos[p.foto], at = root.querySelector(p.at);
            if (!f || !at || at.dataset.foto === p.foto) return;
            at.dataset.foto = p.foto;
            const fig = document.createElement('figure');
            fig.className = 'b-foto ' + (p.wide ? 'b-foto-breit' : 'b-foto-rechts');
            if (!p.wide) fig.style.width = (p.w || 40) + '%';
            const lic = f.license === 'public domain' ? t('gemeinfrei', 'public domain', 'dominio público', 'pubblico dominio', 'domaine public') : f.license;
            const alt = ((f.alt && (f.alt[LANG] || f.alt.de)) || '').replace(/"/g, '&quot;');
            // "Bild", not "Foto": photos, paintings and engravings alike; an unknown artist is left out
            fig.innerHTML = '<img src="' + FOTO_DIR + p.foto + '.jpg" alt="' + alt + '"' + (print ? '' : ' loading="lazy"') + (p.pos ? ' style="object-position:' + p.pos + '"' : '') + '>' +
                '<figcaption>' + t('Bild: ', 'Image: ', 'Imagen: ', 'Immagine: ', 'Image : ') + (f.artist ? f.artist + ' · ' : '') + lic +
                ' · <a href="' + f.page + '" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption>';
            if (p.put === 'after') at.after(fig);
            else { at.prepend(fig); at.classList.add('b-mit-foto'); }
        });
    }

    // ---------- chapter list + strip + scroll progress ----------
    function buildToc() {
        const secs = Array.from(document.querySelectorAll('section.b-sec[id][data-toc]'));
        const toc = document.querySelector('.b-toc-list');
        const strip = document.querySelector('.b-strip');
        const links = [];
        secs.forEach(s => {
            const k = s.dataset.tocK || '';
            const label = s.dataset.toc;
            if (toc) {
                const a = document.createElement('a');
                a.href = '#' + s.id;
                a.innerHTML = '<span class="b-toc-k">' + k + '</span><span>' + label + '</span>';
                toc.appendChild(a); links.push([s, a]);
            }
            if (strip) {
                const p = document.createElement('a');
                p.href = '#' + s.id; p.textContent = s.dataset.tocShort || label;
                strip.appendChild(p); links.push([s, p]);
            }
        });
        const bar = document.querySelector('.b-progress');
        let current = null;
        function onScroll() {
            const head = document.querySelector('.b-top');
            const off = (head ? head.offsetHeight : 0) + 90;
            let cur = secs[0] || null;
            secs.forEach(s => { if (s.getBoundingClientRect().top - off <= 0) cur = s; });
            if (cur !== current) {
                current = cur;
                links.forEach(([s, a]) => a.classList.toggle('active', s === cur));
                const pill = links.find(([s, a]) => s === cur && a.parentElement === strip);
                if (pill && strip && strip.offsetParent !== null) {
                    const a = pill[1];
                    strip.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
                }
            }
            if (bar) {
                const max = document.documentElement.scrollHeight - innerHeight;
                bar.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%';
            }
        }
        addEventListener('scroll', onScroll, { passive: true });
        addEventListener('resize', onScroll);
        onScroll();
    }

    // ---------- small controls for widgets ----------
    // slider row: label, range, live value; returns { input, get, set }
    let rangeNo = 0;
    function range(parent, o) {
        const id = 'b-r' + (++rangeNo);
        const row = document.createElement('div');
        row.className = 'b-range';
        row.innerHTML = '<label for="' + id + '">' + o.label + '</label>' +
            '<input class="b-slider" id="' + id + '" type="range" min="' + o.min + '" max="' + o.max + '" step="' + (o.step || 0.1) + '">' +
            '<output></output>';
        parent.appendChild(row);
        const input = row.querySelector('input'), out = row.querySelector('output');
        const show = () => { out.innerHTML = o.fmt ? o.fmt(+input.value) : fmt(+input.value, 2); };
        input.value = o.value; show();
        input.addEventListener('input', () => { show(); if (o.onInput) o.onInput(+input.value); });
        return { input, get: () => +input.value, set: v => { input.value = v; show(); } };
    }
    // segmented choice: items [[value, label]], returns { get, set }
    function seg(parent, items, value, onPick, aria) {
        const box = document.createElement('div');
        box.className = 'b-seg'; box.setAttribute('role', 'group'); if (aria) box.setAttribute('aria-label', aria);
        box.innerHTML = items.map(([v, l]) => '<button type="button" data-v="' + v + '">' + l + '</button>').join('');
        parent.appendChild(box);
        let cur = value;
        const mark = () => box.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === String(cur)));
        box.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            cur = b.dataset.v; mark(); if (onPick) onPick(cur);
        });
        mark();
        return { el: box, get: () => cur, set: v => { cur = v; mark(); } };
    }
    function div(parent, cls, html) {
        const d = document.createElement('div'); if (cls) d.className = cls; if (html != null) d.innerHTML = html;
        parent.appendChild(d); return d;
    }

    // ---------- the book: chapter list (window.BUCH from the book folder's kapitel.js) ----------
    function buildBook() {
        const B = window.BUCH; if (!B || !B.chapters) return;
        const file = (location.pathname.split('/').pop() || 'index.html');
        const i = B.chapters.findIndex(c => c.file === file);
        const top = document.querySelector('.b-top-book');
        if (top && top.tagName !== 'A') {
            const a = document.createElement('a');
            a.className = 'b-top-book'; a.href = 'index.html'; a.textContent = top.textContent;
            a.title = t('Inhaltsverzeichnis des Buches', 'Contents of the book', 'Índice del libro', 'Indice del libro', 'Sommaire du manuel');
            top.replaceWith(a);
        }
        if (i < 0) return;
        const prev = B.chapters[i - 1], next = B.chapters[i + 1];
        const nav = document.createElement('nav');
        nav.className = 'b-chapnav'; nav.setAttribute('aria-label', t('Blättern', 'Turn the page', 'Pasar página', 'Sfoglia le pagine', 'Changer de chapitre'));
        const card = (c, dir) => c
            ? '<a class="b-chapcard ' + dir + '" href="' + c.file + '"><span class="b-chapcard-k">' + (dir === 'prev' ? t('← ZURÜCK', '← BACK', '← ATRÁS', '← INDIETRO', '← PRÉCÉDENT') : t('WEITER →', 'NEXT →', 'SIGUIENTE →', 'AVANTI →', 'SUIVANT →')) +
              t(' · KAPITEL ', ' · CHAPTER ', ' · CAPÍTULO ', ' · CAPITOLO ', ' · CHAPITRE ') + c.k + '</span><span class="b-chapcard-t">' + c.title + '</span></a>'
            : '<a class="b-chapcard ' + dir + '" href="index.html"><span class="b-chapcard-k">' + (dir === 'prev' ? '← ' : '') + t('INHALT', 'CONTENTS', 'ÍNDICE', 'INDICE', 'SOMMAIRE') + (dir === 'next' ? ' →' : '') +
              '</span><span class="b-chapcard-t">' + t('Alle Kapitel', 'All chapters', 'Todos los capítulos', 'Tutti i capitoli', 'Tous les chapitres') + '</span></a>';
        nav.innerHTML = card(prev, 'prev') + card(next, 'next');
        const foot = document.querySelector('.b-foot');
        if (foot) foot.parentNode.insertBefore(nav, foot); else document.querySelector('.b-main').appendChild(nav);
    }

    // the table of contents: chapter cards grouped by Lernbereich, with the solved self-checks of this browser
    function buildIndex() {
        const B = window.BUCH, box = document.querySelector('.b-chapters');
        if (!B || !box) return;
        const folder = location.pathname.replace(/^.*\/buch\//, '').replace(/[^/]*$/, '');
        let html = '', last = '';
        B.chapters.forEach(c => {
            if (c.lb !== last) { html += '<p class="b-lbhead">' + c.lb.toUpperCase() + '</p>'; last = c.lb; }
            let solved = 0;
            try { solved = Object.keys(JSON.parse(localStorage.getItem('buch:' + folder + c.file) || '{}')).length; } catch (_) { }
            html += '<a class="b-chap" href="' + c.file + '"><span class="b-chap-k">' + c.k + '<small>' + t('KAPITEL', 'CHAPTER', 'CAPÍTULO', 'CAPITOLO', 'CHAPITRE') + '</small></span>' +
                '<span><span class="b-chap-t">' + c.title + '</span><span class="b-chap-s">' + c.sub + '</span></span>' +
                '<span class="b-chap-m">' + c.when.toUpperCase() + (c.ustd ? '<br>' + c.ustd + t(' USTD.', ' LESSONS', ' SESIONES', ' ORE', ' HEURES') : '') +
                (solved ? '<br><span class="b-done">' + solved + t(' GELÖST', ' SOLVED', ' RESUELTOS', ' RISOLTI', ' RÉSOLUS') + '</span>' : '') + '</span></a>';
        });
        box.innerHTML = html;
    }

    // ---------- overview of the print pages: O (or the grid pill in the header) ----------
    // Doc, 09.10.2026: "wie in den Decks auf O … alle Seiten, die dann im PDF stehen werden … auf einen Blick … eine
    // auswählen und reinspringen". The pages exist only once Paged.js has set the print edition, so the overview is
    // druck.html?uebersicht in a frame over the book (built on the first O, a few seconds, kept for the next one).
    // Every block of a section carries data-ziel="file|section|n" - set here and in js/buch-druck.js from the same
    // source order, so a printed page knows where its first block lives online and the book knows where the reader is.
    function ziele(root, file) {
        root.querySelectorAll('.b-sec[id]').forEach(s => Array.from(s.children).forEach((ch, n) => { ch.dataset.ziel = file + '|' + s.id + '|' + n; }));
    }
    const FILE = location.pathname.split('/').pop() || 'index.html';
    function headOffset() {
        const top = document.querySelector('.b-top'), strip = document.querySelector('.b-strip');
        return (top ? top.offsetHeight : 0) + (strip && strip.offsetParent !== null ? strip.offsetHeight : 0);
    }
    // where the reader is: the first block not yet scrolled away under the header
    function wo() {
        const off = headOffset() + 10;
        const e = Array.from(document.querySelectorAll('.b-main [data-ziel]')).find(x => x.getBoundingClientRect().bottom > off);
        return e ? e.dataset.ziel : FILE + '||';
    }
    function hin(ziel) {
        const [f, s, n] = ziel.split('|');
        let e = n ? document.querySelector('[data-ziel="' + ziel.replace(/"/g, '') + '"]') : null;
        if (!e && s) e = document.getElementById(s);
        // instant: the page scrolls smoothly (buch.css), a jump across half a chapter would crawl
        scrollTo({ top: e ? Math.max(0, e.getBoundingClientRect().top + scrollY - headOffset() - 14) : 0, behavior: 'instant' });
    }
    // a jump into another chapter: the hash gets the section, sessionStorage the exact block
    function sprung(ziel) {
        const f = ziel.split('|')[0];
        if (f === FILE) { zu(); hin(ziel); return; }
        try { sessionStorage.setItem('buch-sprung', ziel); } catch (_) { }
        const s = ziel.split('|')[1];
        location.href = f + (s ? '#' + s : '');
    }
    let ov = null, frame = null, ovBtn = null;
    function auf() {
        if (!ov) {
            ov = document.createElement('div');
            ov.className = 'b-ov';
            frame = document.createElement('iframe');
            frame.title = t('Alle Seiten der Druckausgabe', 'All pages of the print edition', 'Todas las páginas de la edición impresa', 'Tutte le pagine dell’edizione a stampa', 'Toutes les pages de l’édition imprimée');
            frame.src = 'druck.html?uebersicht';
            ov.appendChild(frame);
            document.body.appendChild(ov);
        }
        ov.hidden = false;
        document.documentElement.classList.add('b-ov-open');
        const w = frame.contentWindow;
        if (w && w.BuchDruckOv) w.BuchDruckOv.zeige(wo());              // already built: mark the reader's page at once
        frame.focus();
    }
    function zu() {
        if (!ov || ov.hidden) return;
        ov.hidden = true;
        document.documentElement.classList.remove('b-ov-open');
        if (ovBtn) ovBtn.focus({ preventScroll: true });
    }
    function buildOverview() {
        const top = document.querySelector('.b-top');
        // a book without its print edition yet (kapitel.js: druck: false, e.g. the English edition) has no overview
        if (!top || !window.BUCH || window.BUCH.druck === false) return;
        ovBtn = document.createElement('button');
        ovBtn.type = 'button'; ovBtn.className = 'b-ovbtn';
        ovBtn.title = t('Alle Seiten der Druckausgabe (O)', 'All pages of the print edition (O)', 'Todas las páginas de la edición impresa (O)', 'Tutte le pagine dell’edizione a stampa (O)', 'Toutes les pages de l’édition imprimée (O)');
        ovBtn.setAttribute('aria-label', t('Alle Seiten der Druckausgabe', 'All pages of the print edition', 'Todas las páginas de la edición impresa', 'Tutte le pagine dell’edizione a stampa', 'Toutes les pages de l’édition imprimée'));
        ovBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
            '<rect x="2.5" y="2.5" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="2.5" width="8.5" height="8.5" rx="1.2"/>' +
            '<rect x="2.5" y="13" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="13" width="8.5" height="8.5" rx="1.2"/></svg><span class="b-ovbtn-l">' + t('Seiten', 'Pages', 'Páginas', 'Pagine', 'Pages') + '</span>';
        const book = top.querySelector('.b-top-book');
        if (book) book.after(ovBtn); else top.appendChild(ovBtn);
        ovBtn.addEventListener('click', () => { if (ov && !ov.hidden) zu(); else auf(); });
        addEventListener('keydown', e => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
            if (e.key === 'o' || e.key === 'O') { e.preventDefault(); if (ov && !ov.hidden) zu(); else auf(); }
            else if (e.key === 'Escape' && ov && !ov.hidden) zu();
        });
        // the frame calls back: where the reader is, close, jump
        window.BuchUebersicht = { wo, zu, sprung };
        // arrived from the overview of another chapter: to the exact block, once the page stands
        let ziel = null;
        try { ziel = sessionStorage.getItem('buch-sprung'); sessionStorage.removeItem('buch-sprung'); } catch (_) { }
        if (ziel && ziel.split('|')[0] === FILE) {
            requestAnimationFrame(() => hin(ziel));
            addEventListener('load', () => hin(ziel), { once: true });
        }
    }

    // ---------- "PDF" in the header: the print edition as a finished PDF from R2 ----------
    // Doc, 27.10.2026: a pupil saved druck.html as a PDF herself and got a blank page after every page - Safari, and every
    // browser on an iPad or iPhone, breaks an A4 sheet in two on Letter paper. tools/buch-seiten/seitenbilder.mjs makes the
    // PDF with Chrome after every change of the book. Its pill sits in the header beside "Seiten", on every page of the book
    // (Doc: "den Button da oben hin"); on the start page it replaces "Als PDF drucken", which stays while there is no PDF.
    function buildPdf() {
        const top = document.querySelector('.b-top');
        const book = (location.pathname.match(/\/buch\/([^/]+)\//) || [])[1];
        if (!top || !book || !window.BUCH || window.BUCH.druck === false) return;
        const base = MEDIA + 'seiten/' + book + '/';
        fetch(base + 'seiten.json').then(r => r.ok ? r.json() : null).then(m => {
            if (!m || !m.pdf) return;
            const a = document.createElement('a');
            a.className = 'b-ovbtn b-pdfbtn';
            a.href = base + m.pdf.datei + '?v=' + encodeURIComponent(m.v);
            a.target = '_blank'; a.rel = 'noopener';
            a.title = t('PDF herunterladen', 'Download PDF', 'Descargar PDF', 'Scarica PDF', 'Télécharger le PDF') + ' · ' +
                m.seiten.length + ' ' + t('Seiten', 'pages', 'páginas', 'pagine', 'pages') + ' · ' + Math.max(1, Math.round(m.pdf.bytes / 1048576)) + ' MB · ' +
                t('Stand', 'as of', 'versión del', 'aggiornato al', 'version du') + ' ' + new Date(m.erstellt).toLocaleDateString(t('de-DE', 'en-GB', 'es-ES', 'it-IT', 'fr-FR'));
            a.setAttribute('aria-label', t('PDF herunterladen', 'Download PDF', 'Descargar PDF', 'Scarica PDF', 'Télécharger le PDF'));
            a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M12 3.5v11.5"/><path d="M7 10.5l5 5 5-5"/><path d="M4 16.5v3.5h16v-3.5"/></svg><span class="b-ovbtn-l">PDF</span>';
            // left of "Seiten", right of the book's name
            const seiten = top.querySelector('.b-ovbtn:not(.b-pdfbtn)'), name = top.querySelector('.b-top-book');
            if (seiten) seiten.before(a); else if (name) name.after(a); else top.appendChild(a);
            const old = document.querySelector('.b-start-acts a.b-btn[href="druck.html"]');
            if (old) old.remove();
        }).catch(() => { });
    }

    // ---------- Solita in the header, as in the decks (Doc, 09.10.2026): js/buch-solita.js loads the shared box itself ----------
    function buildSolita() {
        if (!ME || !document.querySelector('.b-top') || document.querySelector('script[src*="buch-solita.js"]')) return;
        const sc = document.createElement('script');
        sc.src = ME.replace(/buch\.js(\?.*)?$/, 'buch-solita.js');
        document.head.appendChild(sc);
    }
    // ---------- "Fehler melden", the red button in Solita's line (Doc, 09./10.10.2026): js/buch-feedback.js, spoken reports into the database ----------
    function buildFeedback() {
        if (!ME || !document.querySelector('.b-top') || document.querySelector('script[src*="buch-feedback.js"]')) return;
        const sc = document.createElement('script');
        sc.src = ME.replace(/buch\.js(\?.*)?$/, 'buch-feedback.js');
        document.head.appendChild(sc);
    }

    // ---------- widgets ----------
    const widgets = {};
    function widget(name, init) { widgets[name] = init; }
    function buildWidgets(root) {
        root.querySelectorAll('[data-widget]').forEach(el => {
            const init = widgets[el.dataset.widget];
            if (!init) { dbg('unknown widget ' + el.dataset.widget); return; }
            try { init(el); } catch (e) { dbg('widget ' + el.dataset.widget + ': ' + e.message); }
        });
    }

    // builds tasks, self-checks, examples, lab cards, widgets and maths inside root - also for content loaded later
    // (the print edition, js/buch-druck.js, fetches all chapters into one page and renders them with this)
    let PRINT = false;
    // widgets that load something first (Three.js for the vector chapters) hand in a promise; the print edition
    // waits for all of them before it freezes the canvases (js/buch-druck.js)
    const pending = [];
    function later(p) { pending.push(Promise.resolve(p).catch(e => dbg('later: ' + e.message))); return p; }
    function settled() { return Promise.all(pending.splice(0)); }
    function render(root, opt = {}) {
        PRINT = !!opt.print;
        buildTasks(root);
        buildChecks(root);
        buildLoose(root);
        buildLabs(root);
        buildWidgets(root);
        math(root);
    }
    function start() {
        if (document.body.classList.contains('b-print')) return;                // the print page renders itself
        const main = document.querySelector('.b-main') || document.body;
        ziele(main, FILE);                                                       // before render: the source order
        render(main);
        fotosReady.then(() => fotos(main, FILE));
        buildToc();
        buildBook();
        buildIndex();
        buildOverview();
        buildPdf();
        buildSolita();
        buildFeedback();
        dbg('ready ' + KEY);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    window.Buch = { en: EN, lang: LANG, t, widget, math, Frac, gcd, fmt, texNum, pct, parseAnswer, matches, dbg, icon: ICON, range, seg, div, render, ziele, later, settled, printing: () => PRINT, sg, co, sgx, compile, fotos, fotosReady, media: MEDIA };
})();
