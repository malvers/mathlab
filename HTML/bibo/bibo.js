// DocBibo - prototype step 1: the lending page of the school library (textbooks, room KES 205).
// Scan the label barcode (or type / USB-scan the number) -> the book -> say or type the pupil's name ->
// "Ausleihen" for four weeks. Scanning a lent book shows its loan and takes it back.
// Storage is localStorage on this device only (prototype, invented demo data, see bibo-demo.js).
// Scanning: the browser's own BarcodeDetector where it reads Code 128 (Chrome on Android, macOS), else ZXing
// (@zxing/browser, loaded on demand). Speech: the shared engine js/solita-listen.js (Web Speech, de-DE).
(() => {
    'use strict';
    const $ = id => document.getElementById(id);
    const KEY = 'docbibo-v1';
    const LOAN_DAYS = 28;      // the default proposal: four weeks
    const SOON_DAYS = 3;       // "bald fällig" up to this many days before the due date
    const ZXING_URL = 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.2.1/umd/zxing-browser.min.js';
    const ZXING_SRI = 'sha384-HRtzk9lZgkbSgvUyQrnfC/GxiXZgwaNyD7hC9wcXlsBpDhkS80ISl73juef2FRuf';
    const params = new URLSearchParams(location.search);
    const FORCE_ZXING = params.has('zxing');   // ?zxing - try the iPhone path in Chrome too

    function dbg(m) { if (window.DebugWindow) try { window.DebugWindow.log('[bibo] ' + m); } catch (e) { } }
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // Material Icons / Material Symbols (Apache 2.0, https://fonts.google.com/icons)
    const ICON = {
        check: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        close: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
    };

    /* ---------- dates: local calendar days as "YYYY-MM-DD" ---------- */
    const pad = n => String(n).padStart(2, '0');
    const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const today = () => iso(new Date());
    const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
    const daysFrom = (a, b) => Math.round((Date.UTC(...b.split('-').map((v, i) => i === 1 ? v - 1 : +v)) -
        Date.UTC(...a.split('-').map((v, i) => i === 1 ? v - 1 : +v))) / 864e5);
    const fmtLong = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    const fmtShort = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' });
    const longDate = s => fmtLong.format(parse(s));
    const shortDate = s => fmtShort.format(parse(s));   // de-DE: "15.12."
    function dueInfo(due) {
        const n = daysFrom(today(), due);
        if (n < 0) return { cls: 'over', badge: 'überfällig', rel: n === -1 ? 'seit gestern' : 'seit ' + (-n) + ' Tagen' };
        if (n <= SOON_DAYS) return { cls: 'soon', badge: 'bald fällig', rel: n === 0 ? 'heute' : n === 1 ? 'morgen' : 'in ' + n + ' Tagen' };
        return { cls: 'fine', badge: '', rel: 'in ' + n + ' Tagen' };
    }

    /* ---------- storage: one JSON object in localStorage, everything wrapped (private mode, blocked storage) ---------- */
    let db = null;
    let storeOk = true;
    const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    function seed() {
        const d = window.BIBO_DEMO, t = today();
        const students = d.students.map((s, i) => ({ id: 's' + (i + 1), name: s[0], cls: s[1] }));
        const byName = n => (students.find(s => s.name === n) || {}).id;
        const loans = d.loans.map((l, i) => ({ id: 'l' + (i + 1), book: l[0], student: byName(l[1]), out: addDays(t, -l[2]), due: addDays(t, l[3]), back: null }));
        return { v: 1, demo: d.version, seeded: t, books: JSON.parse(JSON.stringify(d.books)), students, loans };
    }
    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) { const x = JSON.parse(raw); if (x && x.v === 1 && x.books && x.students && x.loans) return x; }
        } catch (e) { dbg('load: ' + e.message); }
        return seed();
    }
    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(db)); storeOk = true; }
        catch (e) { storeOk = false; dbg('save: ' + e.message); }
        $('storeWarn').hidden = storeOk;
    }
    const student = id => db.students.find(s => s.id === id);
    const openLoan = num => db.loans.find(l => l.book === num && !l.back);
    const openLoans = () => db.loans.filter(l => !l.back);
    const loansOf = sid => db.loans.filter(l => l.student === sid && !l.back).length;
    const who = s => s ? s.name + ' (' + s.cls + ')' : 'unbekannt';
    const bookTitle = num => (db.books[num] || {}).title || 'Unbekanntes Buch';

    /* ---------- fuzzy name matching: what speech recognition hears is rarely spelled like the class list ---------- */
    const Fuzzy = (() => {
        const STOP = new Set(['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'aus', 'von', 'vom', 'fuer', 'an',
            'und', 'mit', 'klasse', 'schueler', 'schuelerin', 'frau', 'herr', 'bitte', 'buch', 'ist', 'heisst', 'name', 'ich',
            'er', 'sie', 'es', 'zu', 'in', 'im', 'am', 'fuers', 'kurs']);
        const NUM = { zehn: '10', elf: '11', elfte: '11', zwoelf: '12', zwoelfte: '12', dreizehn: '13', dreizehnte: '13' };
        const norm = s => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
            .normalize('NFD').replace(/[̀-ͯ]/g, '');
        // Kölner Phonetik: German names that sound alike get the same digits (Meier / Maier / Mayer -> 67)
        function koeln(word) {
            const s = String(word).toUpperCase().replace(/Ä/g, 'A').replace(/Ö/g, 'O').replace(/Ü/g, 'U').replace(/ß/g, 'S').replace(/[^A-Z]/g, '');
            let out = '';
            for (let i = 0; i < s.length; i++) {
                const c = s[i], p = s[i - 1] || '', n = s[i + 1] || '';
                let d = '';
                if ('AEIJOUY'.includes(c)) d = '0';
                else if (c === 'H') d = '';
                else if (c === 'B') d = '1';
                else if (c === 'P') d = n === 'H' ? '3' : '1';
                else if (c === 'D' || c === 'T') d = 'CSZ'.includes(n) && n ? '8' : '2';
                else if ('FVW'.includes(c)) d = '3';
                else if ('GKQ'.includes(c)) d = '4';
                else if (c === 'C') {
                    if (i === 0) d = 'AHKLOQRUX'.includes(n) && n ? '4' : '8';
                    else d = 'AHKOQUX'.includes(n) && n && !'SZ'.includes(p) ? '4' : '8';
                } else if (c === 'X') d = 'CKQ'.includes(p) && p ? '8' : '48';
                else if (c === 'L') d = '5';
                else if (c === 'M' || c === 'N') d = '6';
                else if (c === 'R') d = '7';
                else if (c === 'S' || c === 'Z') d = '8';
                out += d;
            }
            let r = '';
            for (const ch of out) if (ch !== r[r.length - 1]) r += ch;
            return r ? r[0] + r.slice(1).replace(/0/g, '') : '';
        }
        function jaroWinkler(a, b) {
            if (a === b) return 1;
            if (!a.length || !b.length) return 0;
            const win = Math.max(0, Math.floor(Math.max(a.length, b.length) / 2) - 1);
            const ma = new Array(a.length).fill(false), mb = new Array(b.length).fill(false);
            let m = 0;
            for (let i = 0; i < a.length; i++) {
                for (let j = Math.max(0, i - win); j < Math.min(b.length, i + win + 1); j++) {
                    if (!mb[j] && a[i] === b[j]) { ma[i] = mb[j] = true; m++; break; }
                }
            }
            if (!m) return 0;
            let t = 0, k = 0;
            for (let i = 0; i < a.length; i++) if (ma[i]) { while (!mb[k]) k++; if (a[i] !== b[k]) t++; k++; }
            const jaro = (m / a.length + m / b.length + (m - t / 2) / m) / 3;
            let l = 0;
            while (l < 4 && a[l] === b[l]) l++;
            return jaro + l * 0.1 * (1 - jaro);
        }
        function tokenSim(q, n) {
            if (q === n) return 1;
            let s = jaroWinkler(q, n);
            const pq = q.length >= 3 ? koeln(q) : '', pn = koeln(n);   // one or two typed letters: spelling only
            if (pq && pq === pn) s = Math.max(s, pq.length >= 2 ? 0.93 : 0.82);   // one digit (Mia = Noah = 6) says little
            else if (pq && pn) s = Math.max(s, 0.88 * jaroWinkler(pq, pn));
            if (n.startsWith(q)) s = Math.max(s, 0.72 + 0.28 * q.length / n.length);   // typing the start of a name
            return s;
        }
        // -> [{ id, score, exact }] best first; exact = every part of the name was heard (nearly) as written
        function rank(text, students) {
            const raw = norm(text).split(/[^a-z0-9]+/).filter(Boolean);
            let cls = null;
            const q = [];
            for (const t of raw) {
                const num = /^\d+$/.test(t) ? t : NUM[t];
                if (num) { cls = num; continue; }
                if (t === 'fo' || t === 'fos') { cls = 'fo'; continue; }
                if (!STOP.has(t)) q.push(t);
            }
            if (!q.length) return [];
            const qx = q.slice();
            for (let i = 0; i + 1 < q.length; i++) qx.push(q[i] + q[i + 1]);   // "bei spiel" -> "beispiel"
            const out = students.map(s => {
                const parts = norm(s.name).split(/[^a-z]+/).filter(Boolean);
                const best = parts.map(p => Math.max(...qx.map(x => tokenSim(x, p))));
                const mean = best.reduce((a, b) => a + b, 0) / best.length, max = Math.max(...best);
                let score = q.length >= 2 ? 0.6 * mean + 0.4 * max : 0.35 * mean + 0.65 * max;
                if (cls && norm(s.cls).includes(cls)) score += 0.04;
                return { id: s.id, score, exact: q.length >= 2 && best.every(b => b >= 0.97) };
            });
            return out.filter(r => r.score >= 0.6).sort((a, b) => b.score - a.score);
        }
        return { rank, koeln, jaroWinkler, norm };
    })();

    /* ---------- scanning ---------- */
    const Scan = (() => {
        const WANT = ['code_128', 'code_39', 'itf', 'ean_13', 'ean_8'];
        let engine = null, detector = null, reader = null, zxLoad = null;
        let stream = null, track = null, video = null, running = false, busy = false, lastTry = 0, raf = 0, onHit = null, onIsbn = null;
        const c0 = document.createElement('canvas'), c90 = document.createElement('canvas');

        function loadZxing() {
            if (window.ZXingBrowser) return Promise.resolve();
            if (!zxLoad) zxLoad = new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = ZXING_URL; s.integrity = ZXING_SRI; s.crossOrigin = 'anonymous';
                s.onload = () => res();
                s.onerror = () => { zxLoad = null; rej(new Error('Die Scan-Bibliothek ließ sich nicht laden (offline?).')); };
                document.head.appendChild(s);
            });
            return zxLoad;
        }
        async function pick() {
            if (engine) return engine;
            if (!FORCE_ZXING && 'BarcodeDetector' in window) {
                try {
                    const have = await window.BarcodeDetector.getSupportedFormats();
                    if (have.includes('code_128')) {
                        detector = new window.BarcodeDetector({ formats: WANT.filter(f => have.includes(f)) });
                        return (engine = 'bd');
                    }
                } catch (e) { dbg('BarcodeDetector: ' + e.message); }
            }
            await loadZxing();
            return (engine = 'zx');
        }
        function zxReader() {
            if (!reader) {
                const Z = window.ZXingBrowser, F = Z.BarcodeFormat;
                // DecodeHintType.POSSIBLE_FORMATS = 2, TRY_HARDER = 3 (the browser bundle does not export the enum)
                reader = new Z.BrowserMultiFormatReader(new Map([[2, [F.CODE_128, F.CODE_39, F.ITF, F.EAN_13, F.EAN_8]], [3, true]]));
            }
            return reader;
        }
        // draw a picture (video frame or photo) at most `max` px long; rotated: the same turned by 90 degrees,
        // because ZXing only reads bars that stand upright in the picture
        function draw(src, w, h, max, rot) {
            const k = Math.min(1, max / Math.max(w, h)), W = Math.round(w * k), H = Math.round(h * k);
            const c = rot ? c90 : c0;
            c.width = rot ? H : W; c.height = rot ? W : H;
            const g = c.getContext('2d', { willReadFrequently: true });
            g.setTransform(1, 0, 0, 1, 0, 0);
            if (rot) { g.translate(H, 0); g.rotate(Math.PI / 2); }
            g.drawImage(src, 0, 0, W, H);
            return c;
        }
        function zxTry(canvas) {
            try {
                const r = zxReader().decodeFromCanvas(canvas);
                return [{ format: String(window.ZXingBrowser.BarcodeFormat[r.getBarcodeFormat()] || '').toLowerCase(), value: r.getText() }];
            } catch (e) { return []; }
        }
        function zxDetect(src, w, h, sizes) {
            for (const max of sizes) for (const rot of [false, true]) {
                const hits = zxTry(draw(src, w, h, max, rot));
                if (hits.length) return hits;
            }
            return [];
        }
        async function bdDetect(src) {
            const r = await detector.detect(src);
            return r.map(x => ({ format: x.format, value: x.rawValue }));
        }
        const isIsbn = h => /^ean_13$/.test(h.format) && /^97[89]/.test(h.value);
        function choose(hits) {
            const good = hits.filter(h => !isIsbn(h) && h.value);
            if (good.length) return good[0].value.trim();
            if (hits.length && onIsbn) onIsbn();
            return null;
        }

        async function tick() {
            if (!running) return;
            raf = requestAnimationFrame(tick);
            const now = performance.now();
            if (busy || now - lastTry < (engine === 'bd' ? 120 : 180) || video.readyState < 2 || !video.videoWidth) return;
            busy = true; lastTry = now;
            try {
                const hits = engine === 'bd' ? await bdDetect(video) : zxDetect(video, video.videoWidth, video.videoHeight, [960]);
                const v = running && choose(hits);
                if (v) { const cb = onHit; stop(); cb(v, engine); }
            } catch (e) { dbg('detect: ' + e.message); }
            finally { busy = false; }
        }
        async function start(videoEl, hit, isbn) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error(window.isSecureContext ? 'Dieses Gerät gibt keine Kamera frei.' : 'Die Kamera geht nur über https oder localhost.');
            }
            video = videoEl; onHit = hit; onIsbn = isbn;
            await pick();
            stream = await navigator.mediaDevices.getUserMedia({
                audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            track = stream.getVideoTracks()[0];
            const caps = track.getCapabilities ? track.getCapabilities() : {};
            try { await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }); } catch (e) { }
            video.srcObject = stream;
            video.muted = true;
            video.setAttribute('playsinline', '');
            await video.play();
            running = true;
            tick();   // may find the code (and stop) before the caller has even seen this return value
            return { engine, torch: !!caps.torch };
        }
        function stop() {
            running = false;
            cancelAnimationFrame(raf);
            if (stream) stream.getTracks().forEach(t => t.stop());
            stream = null; track = null;
            if (video) video.srcObject = null;
        }
        async function torch(on) { if (track) await track.applyConstraints({ advanced: [{ torch: on }] }); }
        // a photo (file from the camera app or a URL): the browser's detector first, then ZXing in a few sizes
        async function decodeImage(src) {
            const img = new Image();
            const url = typeof src === 'string' ? src : URL.createObjectURL(src);
            img.src = url;
            try { await img.decode(); } finally { if (typeof src !== 'string') setTimeout(() => URL.revokeObjectURL(url), 0); }
            await pick();
            let hits = [];
            if (engine === 'bd') { try { hits = await bdDetect(img); } catch (e) { dbg('photo bd: ' + e.message); } }
            let used = engine;
            if (!hits.length) {
                await loadZxing();
                hits = zxDetect(img, img.naturalWidth, img.naturalHeight, [1280, 1920, 800, 4096]);
                used = 'zx';
            }
            const good = hits.filter(h => !isIsbn(h));
            return { value: good.length ? good[0].value.trim() : null, isbn: !good.length && hits.length > 0, engine: used };
        }
        return { start, stop, torch, decodeImage, pick, get running() { return running; }, get engine() { return engine; }, loadZxing };
    })();
    const ENGINE_NAME = { bd: 'Erkennung des Browsers', zx: 'ZXing' };

    /* ---------- flow state ---------- */
    const state = { book: null, student: null, due: null, last: null };

    function resetFlow() {
        state.book = null; state.student = null; state.due = null;
        $('bookInfo').hidden = true; $('bookInfo').innerHTML = '';
        $('whoCard').hidden = true; $('returnCard').hidden = true;
        $('nameInput').value = ''; $('hits').innerHTML = ''; nameStatus('');
        if (ear && ear.active) ear.stop();
    }

    function openBook(raw) {
        const num = String(raw || '').replace(/\D/g, '');
        if (!num) { scanStatus('Bitte eine Buchnummer eingeben.', 'err'); return; }
        stopScan();
        hideDone();
        resetFlow();
        $('numInput').value = '';
        scanStatus('');
        state.book = num;
        const b = db.books[num];
        const info = $('bookInfo');
        info.hidden = false;
        if (!b) {
            info.innerHTML =
                '<div class="book-head"><p class="book-title">Nr. ' + esc(num) + ' ist noch nicht im Katalog</p>' + closeBtn() + '</div>' +
                '<p class="note">Kurz eintragen, dann geht es mit der Ausleihe weiter.</p>' +
                '<form id="newBook" class="new-book" autocomplete="off">' +
                '<input id="nbTitle" class="field" type="text" required placeholder="Titel" aria-label="Titel des Buches">' +
                '<div class="two"><input id="nbSubject" class="field" type="text" placeholder="Fach" aria-label="Fach">' +
                '<input id="nbGrade" class="field" type="text" inputmode="numeric" placeholder="Klasse" aria-label="Klassenstufe"></div>' +
                '<button class="big go" type="submit">Anlegen</button></form>';
            $('newBook').onsubmit = e => {
                e.preventDefault();
                const title = $('nbTitle').value.trim();
                if (!title) { $('nbTitle').focus(); return; }
                db.books[num] = { title, subject: $('nbSubject').value.trim(), grade: $('nbGrade').value.trim() };
                save();
                dbg('book added ' + num);
                openBook(num);
            };
            setTimeout(() => { const f = $('nbTitle'); if (f) f.focus(); }, 50);
            reveal($('bookCard'));
            return;
        }
        const loan = openLoan(num);
        info.innerHTML =
            '<div class="book-head"><p class="book-title">' + esc(b.title) + '</p>' + closeBtn() + '</div>' +
            '<p class="book-meta">' + [b.subject, b.grade ? 'Klasse ' + b.grade : '', 'Nr. ' + num].filter(Boolean).map(esc).join(' • ') + '</p>' +
            '<p class="state ' + (loan ? 'lent' : 'free') + '">' + (loan ? 'ausgeliehen' : 'im Regal') + '</p>';
        if (loan) showReturn(loan); else showWho();
    }
    const closeBtn = () => '<button class="x" type="button" id="bookClose" aria-label="Buch abwählen">' + ICON.close + '</button>';

    function showWho() {
        state.due = addDays(today(), LOAN_DAYS);
        $('whoCard').hidden = false;
        $('micBtn').hidden = !SR_OK;
        $('nameInput').placeholder = SR_OK ? 'oder Namen tippen' : 'Namen tippen (oder Tastatur-Mikrofon)';
        renderChosen();
        renderDue();
        reveal($('whoCard'));
    }

    function showReturn(loan) {
        const s = student(loan.student), d = dueInfo(loan.due);
        $('returnCard').hidden = false;
        $('retWho').textContent = who(s);
        $('retDates').innerHTML = 'seit ' + esc(longDate(loan.out)) + '<br>fällig ' + esc(longDate(loan.due)) +
            ' <span class="rel">(' + esc(d.rel) + ')</span>' + (d.badge ? ' <span class="badge ' + d.cls + '">' + d.badge + '</span>' : '');
        reveal($('returnCard'));
    }

    /* the card that just appeared is scrolled into view on the phone (one column) */
    function reveal(el) {
        if (window.matchMedia('(min-width: 900px)').matches) return;
        requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            if (r.top < 0 || r.bottom > innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* ---------- names ---------- */
    let ear = null;
    const SR_OK = !!(window.SpeechRecognition || window.webkitSpeechRecognition) && !!window.SolitaListen;
    let lastHits = [];
    function nameStatus(msg, cls) { const el = $('nameStatus'); el.textContent = msg || ''; el.className = 'status' + (cls ? ' ' + cls : ''); }
    function showHits(text, allowAuto) {
        lastHits = Fuzzy.rank(text, db.students).slice(0, 3);
        const ul = $('hits');
        ul.innerHTML = lastHits.map(h => {
            const s = student(h.id), n = loansOf(h.id);
            return '<li><button type="button" class="hit" data-id="' + h.id + '" aria-pressed="' + (state.student === h.id) + '">' +
                '<span class="hit-name">' + esc(s.name) + '</span><span class="hit-cls">' + esc(s.cls) +
                (n ? ' • ' + n + (n === 1 ? ' Buch' : ' Bücher') + ' ausgeliehen' : '') + '</span></button></li>';
        }).join('');
        if (text.trim() && !lastHits.length) nameStatus('Kein Treffer – nochmal sagen oder anders tippen.');
        else if (!(ear && ear.active)) nameStatus('');
        // a clear winner (every part of the name heard as written, nobody else like that) is chosen at once
        if (allowAuto && lastHits.length && lastHits[0].exact && !(lastHits[1] && lastHits[1].exact)) choose(lastHits[0].id);
    }
    function choose(id) {
        state.student = id;
        if (ear && ear.active) ear.stop();
        for (const b of $('hits').querySelectorAll('.hit')) b.setAttribute('aria-pressed', String(b.dataset.id === id));
        renderChosen();
    }
    function renderChosen() {
        const s = state.student && student(state.student);
        $('lendBtn').disabled = !s;
        $('chosen').innerHTML = s ? 'An <b>' + esc(s.name) + '</b> (' + esc(s.cls) + ')' : 'Noch kein Name gewählt.';
        $('chosen').classList.toggle('empty', !s);
    }
    function setMic(on) {
        $('micBtn').classList.toggle('on', on);
        $('micLabel').textContent = on ? 'Ich höre zu …' : 'Namen sagen';
        $('micBtn').setAttribute('aria-label', on ? 'Zuhören beenden' : 'Namen sagen');
    }
    let gotFinal = false;
    function heard(t, final) {
        $('nameInput').value = t;
        if (final) { gotFinal = true; setMic(false); }
        showHits(t, final && !state.student);   // a name tapped while still listening stays chosen
    }
    function listen() {
        if (ear && ear.active) { ear.stop(); return; }
        if (!SR_OK) { nameStatus('Spracheingabe geht hier nicht – Namen tippen oder das Mikrofon der Tastatur nutzen.', 'err'); $('nameInput').focus(); return; }
        if (!ear) ear = window.SolitaListen({
            lang: 'de-DE',
            silenceMs: 1800,   // a name is short: finished after 1.8 s of quiet
            onState: st => {
                if (st === 'unsupported') { nameStatus('Spracheingabe geht hier nicht – bitte tippen.', 'err'); setMic(false); return; }
                setMic(st === 'listening');
                if (st === 'listening') nameStatus('Namen sagen, z. B. „Mia Beispiel“.');
                if (st === 'idle' && !gotFinal) nameStatus('Nichts verstanden – nochmal tippen und sagen, oder Namen eintippen.', 'err');
            },
            onPartial: t => { if (t) heard(t, false); },
            onFinal: t => heard(t, true),
            log: dbg
        });
        gotFinal = false;
        state.student = null;
        renderChosen();
        $('nameInput').value = '';
        $('hits').innerHTML = '';
        ear.start();
    }

    /* ---------- due date ---------- */
    function renderDue() {
        const n = daysFrom(today(), state.due);
        $('dueDate').textContent = longDate(state.due);
        $('dueRel').textContent = n === 0 ? 'heute' : n === 1 ? 'morgen' : 'in ' + n + ' Tagen';
        $('dueMinus').disabled = n <= 1;
        for (const b of $('dueChips').children) b.setAttribute('aria-pressed', String(Number(b.dataset.days) === n));
        $('lendLabel').textContent = 'Ausleihen bis ' + shortDate(state.due);
    }

    /* ---------- lend / return / undo ---------- */
    function vibrate() { try { navigator.vibrate && navigator.vibrate(60); } catch (e) { } }
    function lend() {
        if (!state.book || !state.student || openLoan(state.book)) return;
        const l = { id: newId('l'), book: state.book, student: state.student, out: today(), due: state.due, back: null };
        db.loans.push(l);
        save();
        vibrate();
        dbg('lent ' + l.book + ' to ' + l.student + ' until ' + l.due);
        resetFlow();
        showDone('lend', l);
        renderLoans(l.id);
    }
    function giveBack() {
        const l = state.book && openLoan(state.book);
        if (!l) return;
        l.back = today();
        save();
        vibrate();
        dbg('returned ' + l.book);
        resetFlow();
        showDone('return', l);
        renderLoans();
    }
    function undo() {
        const d = state.last;
        if (!d) return;
        if (d.kind === 'lend') db.loans = db.loans.filter(l => l.id !== d.loan.id);
        else { const l = db.loans.find(x => x.id === d.loan.id); if (l) l.back = null; }
        save();
        hideDone();
        renderLoans();
        openBook(d.loan.book);
    }
    function showDone(kind, l) {
        state.last = { kind, loan: l };
        const s = student(l.student);
        $('doneTitle').textContent = kind === 'lend' ? 'Ausgeliehen' : 'Zurückgegeben';
        $('doneText').innerHTML = '<b>' + esc(bookTitle(l.book)) + '</b> <span class="muted">Nr. ' + esc(l.book) + '</span><br>' +
            (kind === 'lend' ? 'an ' + esc(who(s)) + '<br>bis <b>' + esc(longDate(l.due)) + '</b>'
                : 'von ' + esc(who(s)) + ' – steht wieder im Regal');
        $('doneCard').hidden = false;
        $('doneCard').classList.remove('pop'); void $('doneCard').offsetWidth; $('doneCard').classList.add('pop');
        reveal($('doneCard'));
    }
    function hideDone() { $('doneCard').hidden = true; }

    /* ---------- overview ---------- */
    function renderLoans(flashId) {
        const list = openLoans().sort((a, b) => a.due.localeCompare(b.due) || bookTitle(a.book).localeCompare(bookTitle(b.book)));
        let over = 0, soon = 0;
        $('loans').innerHTML = list.map(l => {
            const d = dueInfo(l.due), s = student(l.student);
            if (d.cls === 'over') over++; else if (d.cls === 'soon') soon++;
            return '<li><button type="button" class="loan ' + d.cls + (l.id === flashId ? ' flash' : '') + '" data-book="' + esc(l.book) + '">' +
                '<span class="loan-main"><span class="loan-title">' + esc(bookTitle(l.book)) + '</span>' +
                '<span class="loan-who">' + esc(who(s)) + ' • Nr. ' + esc(l.book) + '</span></span>' +
                '<span class="loan-due"><span class="loan-date">' + esc(shortDate(l.due)) + '</span>' +
                (d.badge ? '<span class="badge ' + d.cls + '">' + d.badge + '</span>' : '<span class="loan-rel">' + esc(d.rel) + '</span>') +
                '</span></button></li>';
        }).join('') || '<li class="empty">Gerade ist nichts ausgeliehen.</li>';
        $('loanCount').textContent = list.length;
        $('loanSum').innerHTML = [
            over ? '<span class="badge over">' + over + ' überfällig</span>' : '',
            soon ? '<span class="badge soon">' + soon + ' bald fällig</span>' : ''
        ].join(' ');
    }

    /* ---------- scanner UI ---------- */
    function scanStatus(msg, cls) { const el = $('scanHint'); el.textContent = msg || ''; el.className = 'status' + (cls ? ' ' + cls : ''); }
    let torchOn = false, isbnHintAt = 0;
    async function startScan() {
        hideDone();
        $('scanner').hidden = false;
        $('scanBtn').hidden = true;
        $('torchBtn').hidden = true;
        scanStatus('Kamera startet …');
        reveal($('bookCard'));
        try {
            const r = await Scan.start($('video'), (value, engine) => {
                vibrate();
                dbg('scanned ' + value + ' via ' + engine);
                openBook(value);
            }, () => {
                const now = Date.now();
                if (now - isbnHintAt > 2500) { isbnHintAt = now; scanStatus('Das ist die ISBN – bitte den Aufkleber der Bibliothek scannen.', 'err'); }
            });
            $('engine').textContent = ENGINE_NAME[r.engine];
            if (!Scan.running) return;   // the first frame already had the code
            torchOn = false;
            $('torchBtn').hidden = !r.torch;
            $('torchBtn').setAttribute('aria-pressed', 'false');
            scanStatus('Barcode des Aufklebers in den Rahmen halten.');
        } catch (e) {
            dbg('camera: ' + (e.name || '') + ' ' + e.message);
            stopScan();
            const msg = e.name === 'NotAllowedError' ? 'Die Kamera ist nicht erlaubt – in den Browser-Einstellungen freigeben, oder Foto bzw. Nummer nehmen.'
                : e.name === 'NotFoundError' ? 'Keine Kamera gefunden – Foto oder Nummer nehmen.' : e.message;
            scanStatus(msg, 'err');
        }
    }
    function stopScan() {
        Scan.stop();
        $('scanner').hidden = true;
        $('scanBtn').hidden = false;
    }
    async function photoChosen(file) {
        if (!file) return;
        stopScan();
        scanStatus('Foto wird gelesen …');
        try {
            const r = await Scan.decodeImage(file);
            $('engine').textContent = ENGINE_NAME[r.engine];
            dbg('photo: ' + (r.value || '-') + ' via ' + r.engine);
            if (r.value) { vibrate(); openBook(r.value); }
            else scanStatus(r.isbn ? 'Auf dem Foto ist nur die ISBN – bitte den Aufkleber der Bibliothek fotografieren.'
                : 'Auf dem Foto war kein Barcode zu lesen – näher ran, gerade halten, oder Nummer eintippen.', 'err');
        } catch (e) { scanStatus(e.message, 'err'); }
    }

    /* ---------- colour scheme: Blau / Grau / Hell like the Stoffverteilungsplan and DocDo (key svp-theme) ---------- */
    const THEMES = ['dark', 'grey', 'light'];
    function applyTheme(t, store) {
        const root = document.documentElement;
        root.classList.toggle('svp-light', t === 'light');
        root.classList.toggle('svp-grey', t === 'grey');
        for (const b of $('themeSeg').children) b.setAttribute('aria-checked', String(b.dataset.theme === t));
        const m = document.querySelector('meta[name=theme-color]');
        if (m) m.content = getComputedStyle(document.body).backgroundColor;
        if (store) try { localStorage.setItem('svp-theme', t); } catch (e) { }
    }
    function showSettings(on) { $('settings').hidden = !on; $('gearBtn').setAttribute('aria-expanded', String(on)); }

    /* ---------- own confirm dialog, never the browser's confirm() ---------- */
    function confirmDlg(text, yes) {
        return new Promise(res => {
            $('dlgText').textContent = text;
            $('dlgYes').textContent = yes;
            $('dlg').hidden = false;
            $('dlgNo').focus();
            const done = v => { $('dlg').hidden = true; document.removeEventListener('keydown', key, true); res(v); };
            const key = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
            document.addEventListener('keydown', key, true);
            $('dlgNo').onclick = () => done(false);
            $('dlgYes').onclick = () => done(true);
        });
    }

    /* ---------- wiring ---------- */
    function init() {
        db = load();
        try { localStorage.setItem(KEY + '-probe', '1'); localStorage.removeItem(KEY + '-probe'); } catch (e) { storeOk = false; }
        save();

        let t = null;
        try { t = localStorage.getItem('svp-theme'); } catch (e) { }
        if (!THEMES.includes(t)) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        applyTheme(t, false);
        $('themeSeg').onclick = e => { const b = e.target.closest('button'); if (b) applyTheme(b.dataset.theme, true); };
        $('gearBtn').onclick = () => showSettings($('settings').hidden);
        document.addEventListener('pointerdown', e => {
            if (!$('settings').hidden && !e.target.closest('#settings, #gearBtn')) showSettings(false);
        });

        $('scanBtn').onclick = startScan;
        $('stopBtn').onclick = () => { stopScan(); scanStatus(''); };
        $('torchBtn').onclick = async () => {
            torchOn = !torchOn;
            try { await Scan.torch(torchOn); $('torchBtn').setAttribute('aria-pressed', String(torchOn)); } catch (e) { torchOn = false; }
        };
        $('photoBtn').onclick = () => $('photoInput').click();
        $('photoInput').onchange = e => { photoChosen(e.target.files && e.target.files[0]); e.target.value = ''; };
        $('numForm').onsubmit = e => { e.preventDefault(); openBook($('numInput').value); };
        $('bookCard').addEventListener('click', e => { if (e.target.closest('#bookClose')) { resetFlow(); hideDone(); } });

        $('micBtn').onclick = listen;
        $('nameInput').addEventListener('input', e => {
            if (ear && ear.active) ear.stop();
            state.student = null; renderChosen();
            showHits(e.target.value, false);
        });
        $('nameInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); if (lastHits.length) choose(lastHits[0].id); }
        });
        $('hits').addEventListener('click', e => { const b = e.target.closest('.hit'); if (b) choose(b.dataset.id); });
        $('dueChips').addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            state.due = addDays(today(), Number(b.dataset.days)); renderDue();
        });
        $('dueMinus').onclick = () => { state.due = addDays(state.due, -1); renderDue(); };
        $('duePlus').onclick = () => { state.due = addDays(state.due, 1); renderDue(); };
        $('lendBtn').onclick = lend;
        $('returnBtn').onclick = giveBack;
        $('undoBtn').onclick = undo;
        $('nextBtn').onclick = startScan;
        $('loans').addEventListener('click', e => { const b = e.target.closest('.loan'); if (b) openBook(b.dataset.book); });
        $('resetBtn').onclick = async () => {
            if (!(await confirmDlg('Alle Ausleihen und neu angelegten Bücher löschen und die Demo-Daten neu laden?', 'Zurücksetzen'))) return;
            db = seed(); save(); resetFlow(); hideDone(); stopScan(); scanStatus(''); renderLoans();
            dbg('demo reset');
        };

        // a USB hand scanner types the digits plus Enter like a keyboard: caught here when no field has the focus
        document.addEventListener('keydown', e => {
            if (e.ctrlKey || e.metaKey || e.altKey || !$('dlg').hidden) return;
            if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
            if (/^\d$/.test(e.key)) { e.preventDefault(); $('numInput').value += e.key; }
            else if (e.key === 'Enter' && $('numInput').value) { e.preventDefault(); openBook($('numInput').value); }
            else if (e.key === 'Escape') { showSettings(false); if (Scan.running) stopScan(); }
        });
        // the camera never keeps running in the background
        document.addEventListener('visibilitychange', () => { if (document.hidden && Scan.running) { stopScan(); scanStatus(''); } });

        renderLoans();
        // iPhone and other browsers without the detector: fetch ZXing early, so the first scan starts at once
        if (FORCE_ZXING || !('BarcodeDetector' in window)) setTimeout(() => Scan.loadZxing().catch(() => { }), 800);

        if ('serviceWorker' in navigator && window.isSecureContext && !params.has('nosw')) {
            navigator.serviceWorker.register('sw.js').catch(e => dbg('service worker: ' + e.message));
        }
    }

    // hooks for the head-less tests and for Doc's debug console
    window.DocBibo = {
        rank: (text) => Fuzzy.rank(text, db.students).map(r => ({ name: student(r.id).name, score: +r.score.toFixed(3), exact: r.exact })),
        heard: (text) => heard(text, true),
        decodeImage: (src) => Scan.decodeImage(src),
        openBook: (num) => openBook(num),
        koeln: Fuzzy.koeln,
        get db() { return db; }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
