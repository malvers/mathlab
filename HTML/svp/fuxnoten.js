/* fuxnoten.js - "Noten → FuxNoten" (Doc, 06.11.2026: the grades of a Mission Control test go into
   the FuxNoten grade book, are seen there first and saved only on his click).

   Runs inside FuxNoten (https://<school>.fuxnoten.online/scoring/...). Mission Control
   (svp/leistungstest.html, button "Noten → FuxNoten") leaves the grades in this browser's
   localStorage and offers a short bookmarklet; that opens a small popup of Mission Control's own
   site (svp/fuxnoten-bruecke.html), which hands over this file and then the grades by postMessage.
   No clipboard (a clipboard history would keep names and grades), no server: nothing leaves the
   browser.

   Never overwrites, never guesses: the grade book must be the test's class, each name must hit
   exactly one pupil, the target cell must be empty and not locked, the grade a whole 1-6. Any
   other row is stopped, and saving stays off until Doc unticks it. Saving goes through
   FuxNoten's own cell logic - focusin, value, focusout, as typing does, so its history, undo and
   the password dialog of locked grades stay in force - one cell after the other. Then the page
   is fetched again and every saved cell read back from the database. */
(function () {
    'use strict';
    var ORIGIN = 'http://localhost:8765';   /* Mission Control's site - leistungstest.html puts its own in */
    var BRIDGE = ORIGIN + '/svp/fuxnoten-bruecke.html';
    var ID = 'svp-fux';

    var old = document.getElementById(ID);
    if (old) old.remove();
    clearMarks();

    var $ = window.jQuery;
    var book = document.getElementById('scoring-table-fixed') ? readBook(document) : null;
    var data = null;           /* the payload of Mission Control */
    var rows = [];             /* data.rows + { on, hits, state, sent, back } */
    var col = '';              /* id_grade of the chosen column */
    var busy = false, armed = 0, popup = null;

    /* --- panel ---------------------------------------------------------------------------- */
    if (!document.getElementById(ID + '-font')) {
        var f = document.createElement('link');
        f.id = ID + '-font';
        f.rel = 'stylesheet';
        f.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
        document.head.appendChild(f);
    }
    var css = document.getElementById(ID + '-css') || document.createElement('style');
    css.id = ID + '-css';
    css.textContent =
        '#svp-fux{position:fixed;top:12px;right:12px;z-index:2147483000;box-sizing:border-box;' +
        'width:min(600px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;padding:14px 16px 16px;' +
        'background:rgb(14,36,78);color:#fff;border:2px solid rgb(245,194,66);border-radius:12px;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.45);font:13px/1.5 Orbitron,system-ui,sans-serif;letter-spacing:.02em;text-align:left}' +
        '#svp-fux *{box-sizing:border-box;font-family:inherit}' +
        '#svp-fux .h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}' +
        '#svp-fux .h b{font-size:15px;color:rgb(245,194,66);letter-spacing:.06em}' +
        '#svp-fux button{font:inherit;font-size:12px;letter-spacing:.05em;color:#fff;background:transparent;' +
        'border:1px solid rgba(255,255,255,.45);border-radius:8px;padding:7px 12px;cursor:pointer}' +
        '#svp-fux button:disabled{opacity:.4;cursor:default}' +
        '#svp-fux .x{border:none;font-size:18px;padding:2px 8px;line-height:1}' +
        '#svp-fux .go{display:block;width:100%;margin-top:12px;padding:11px;font-size:13px;font-weight:700;' +
        'background:rgb(121,158,49);border-color:rgb(121,158,49)}' +
        '#svp-fux .go.armed{background:rgb(176,36,24);border-color:rgb(176,36,24)}' +
        '#svp-fux .msg{margin:6px 0;color:rgba(255,255,255,.85)}' +
        '#svp-fux .msg.warn,#svp-fux .bad{color:rgb(255,150,135)}' +
        '#svp-fux .ok{color:rgb(170,215,90)}' +
        '#svp-fux .note{color:rgb(245,194,66);font-weight:700}' +
        '#svp-fux select{font:inherit;font-size:12px;width:100%;margin:4px 0 8px;padding:7px;border-radius:8px;' +
        'background:#fff;color:rgb(14,36,78);border:none}' +
        '#svp-fux table{width:100%;border-collapse:collapse;margin-top:6px;font-size:12px}' +
        '#svp-fux td,#svp-fux th{padding:4px 6px;border-bottom:1px solid rgba(255,255,255,.15);vertical-align:top}' +
        '#svp-fux th{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.6);text-align:left}' +
        '#svp-fux .rest{margin-top:10px;font-size:12px;color:rgba(255,255,255,.75)}' +
        '#svp-fux input[type=checkbox]{width:16px;height:16px;margin:0}';
    document.head.appendChild(css);

    var panel = document.createElement('div');
    panel.id = ID;
    panel.innerHTML = '<div class="h"><b>Noten → FuxNoten</b><button type="button" class="x" title="Schließen">✕</button></div>' +
        '<div class="msg"></div><div class="body"></div>';
    document.body.appendChild(panel);
    var elMsg = panel.querySelector('.msg'), elBody = panel.querySelector('.body');
    panel.querySelector('.x').addEventListener('click', function () {
        if (busy) return;
        window.removeEventListener('message', onMessage);
        clearMarks();
        panel.remove();
    });
    function msg(text, warn) { elMsg.textContent = text; elMsg.className = 'msg' + (warn ? ' warn' : ''); }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    if (!book) {
        msg('Erst das Notenbuch öffnen: Benotung → Sekundarstufe I → Klasse → Fach. Dann das Lesezeichen noch einmal klicken.', true);
        return;
    }
    if (!$) { msg('Diese FuxNoten-Seite hat kein jQuery – so ist das Lesezeichen nicht gebaut. Nichts geändert.', true); return; }

    /* --- the grades from Mission Control, through the bridge ------------------------------ */
    window.addEventListener('message', onMessage);
    function fetchData() {
        msg('Hole die Noten aus Mission Control …');
        popup = window.open(BRIDGE + '?an=' + encodeURIComponent(location.origin), 'svpfuxbruecke', 'width=460,height=200');
        if (!popup) {
            msg('Der Browser hat das kleine Fenster blockiert. Bitte unten klicken.', true);
            elBody.innerHTML = '<button type="button" class="again">Noten aus Mission Control holen</button>';
            elBody.querySelector('.again').addEventListener('click', fetchData);
        }
    }
    function onMessage(ev) {
        if (ev.origin !== ORIGIN || !ev.data || ev.data.kind !== 'svp-fuxnoten') return;
        var p = ev.data.payload;
        if (!p) {
            msg('In Mission Control liegen keine Noten bereit. Dort beim Test „Noten → FuxNoten“ klicken, dann hier das Lesezeichen noch einmal.', true);
            return;
        }
        if (!valid(p)) { msg('Die Daten aus Mission Control sehen nicht richtig aus. Nichts geändert.', true); return; }
        data = p;
        rows = p.rows.map(function (r) { return { name: r.name, note: String(r.note), score: r.score, total: r.total, b: r.b, pct: r.pct, on: true }; });
        match();
        render();
    }
    function valid(p) {
        return typeof p === 'object' && typeof p.klasse === 'string' && Array.isArray(p.rows) && p.rows.length > 0 &&
            p.rows.length <= 80 && p.rows.every(function (r) {
                return r && typeof r.name === 'string' && r.name.trim() && (typeof r.note === 'string' || typeof r.note === 'number');
            });
    }

    /* --- the grade book -------------------------------------------------------------------- */
    function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
    function readBook(doc) {
        var t = doc.getElementById('scoring-table-fixed');
        var heads = t.querySelectorAll('thead tr');
        var title = heads[0] && heads[0].cells[0] ? text(heads[0].cells[0]) : '';
        /* the section of each column (first head row, spread by colspan) and its number (second) */
        var sec = [], num = [];
        if (heads[0]) [].forEach.call(heads[0].cells, function (c) {
            for (var i = 0; i < (c.colSpan || 1); i++) sec.push((text(c).match(/^[^)]*\)?/) || [''])[0]);
        });
        if (heads[1]) [].forEach.call(heads[1].cells, function (c) { num.push(text(c)); });
        var pupils = [], cols = {}, order = [];
        [].forEach.call(t.querySelectorAll('tbody tr'), function (tr) {
            var ln = tr.querySelector('.student-name'), fn = tr.querySelector('.student-firstname');
            if (!ln || !fn) return;
            var p = { nr: text(tr.querySelector('.student-order')), last: text(ln), first: text(fn), cells: {} };
            [].forEach.call(tr.cells, function (td, k) {
                var inp = td.querySelector('input');
                if (!inp || !/^grade_\d+_\d+$/.test(inp.id)) return;   /* not the half-year grade (grade_s_p_g) */
                var g = inp.id.split('_')[2];
                p.cells[g] = inp;
                if (!cols[g]) { cols[g] = { id: g, label: (sec[k] || 'Spalte') + ' – ' + (num[k] || '?') }; order.push(g); }
            });
            pupils.push(p);
        });
        return { title: title, klasse: (title.split('/')[0] || '').trim(), pupils: pupils, cols: cols, order: order };
    }
    function norm(s) {
        return String(s || '').normalize('NFC').toLowerCase().replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim();
    }
    /* a row hits a pupil by "Vorname Nachname"; a list kept as "Vorname N." by first name and
       initial - in both cases exactly one pupil, and no pupil for two rows */
    function match() {
        rows.forEach(function (r) {
            var n = norm(r.name);
            var hits = book.pupils.filter(function (p) { return norm(p.first + ' ' + p.last) === n; });
            var m = /^(.+) (\S)\.$/.exec(r.name.trim());
            if (!hits.length && m) {
                hits = book.pupils.filter(function (p) { return norm(p.first) === norm(m[1]) && norm(p.last).charAt(0) === norm(m[2]); });
            }
            r.hits = hits;
        });
        rows.forEach(function (r) {
            r.twice = r.hits.length === 1 && rows.some(function (o) { return o !== r && o.hits.length === 1 && o.hits[0] === r.hits[0]; });
        });
    }
    function same(v, note) {
        var a = String(v == null ? '' : v).trim().replace(',', '.');
        return a === String(note) || (a !== '' && parseFloat(a) === Number(note) && /^\d+(\.0+)?$/.test(a));
    }
    function classOk() { return norm(book.klasse) === norm(data.klasse); }
    /* the state of one row for the chosen column */
    function stateOf(r) {
        if (r.back != null) return same(r.back, r.note) ? ['ok', 'gespeichert, zurückgelesen ✓'] : ['bad', 'zurückgelesen: „' + r.back + '“ ✗'];
        if (r.sent) return ['', 'gespeichert …'];
        if (!r.on) return ['', 'nicht dabei'];
        if (!/^[1-6]$/.test(r.note)) return ['bad', 'keine Note 1–6'];
        if (!r.hits.length) return ['bad', 'nicht im Notenbuch'];
        if (r.hits.length > 1 || r.twice) return ['bad', 'nicht eindeutig'];
        if (!col) return ['', 'Spalte wählen'];
        var inp = r.hits[0].cells[col];
        if (!inp) return ['bad', 'keine Zelle'];
        if (Number($(inp).data('grade_block')) === 1) return ['bad', 'Zelle gesperrt'];
        var v = inp.value.trim();
        if (v && same(v, r.note)) return ['ok', 'steht schon da ✓'];
        if (v) return ['bad', 'Zelle hat schon „' + v + '“ – bleibt'];
        return ['ready', 'wird ' + r.note];
    }

    /* --- view ------------------------------------------------------------------------------ */
    function dayText(iso) {
        var p = String(iso || '').split('-');
        return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : '';
    }
    function render() {
        clearMarks();
        var hit = {};
        rows.forEach(function (r) { if (r.hits.length === 1) hit[r.hits[0].nr + '|' + r.hits[0].last] = 1; });
        var rest = book.pupils.filter(function (p) { return !hit[p.nr + '|' + p.last]; });
        var h = '<div class="msg">' + esc(data.test || 'Test') + ', Klasse ' + esc(data.klasse) + (data.tag ? ', ' + dayText(data.tag) : '') +
            ': <b>' + rows.length + ' Noten</b> aus Mission Control' +
            (data.scale && data.scale.length ? ' (Notenspiegel ' + data.scale.join('/') + ' %)' : '') + '.</div>';
        h += classOk() ? '<div class="ok">Notenbuch: ' + esc(book.title) + ' ✓</div>'
            : '<div class="bad"><b>STOPP:</b> Das Notenbuch ist „' + esc(book.title) + '“, die Noten sind für ' +
              esc(data.klasse) + '. Erst das richtige Notenbuch öffnen.</div>';
        h += '<label style="display:block;margin-top:10px">Spalte in FuxNoten<select class="col"><option value="">– bitte wählen –</option>' +
            book.order.map(function (g) {
                var n = book.pupils.filter(function (p) { return p.cells[g] && p.cells[g].value.trim(); }).length;
                return '<option value="' + g + '"' + (g === col ? ' selected' : '') + '>' + esc(book.cols[g].label) +
                    (n ? ' (' + n + ' belegt)' : ' (leer)') + '</option>';
            }).join('') + '</select></label>';
        h += '<table><tr><th></th><th>Mission Control</th><th>Notenbuch</th><th>Ergebnis</th><th>Note</th><th>Zelle</th></tr>';
        rows.forEach(function (r, i) {
            var st = stateOf(r), p = r.hits.length === 1 ? r.hits[0] : null;
            var res = r.total ? r.score + '/' + r.total + (r.b != null ? ' + B ' + r.b : '') + (r.pct != null ? ' = ' + r.pct + ' %' : '') : '';
            h += '<tr><td><input type="checkbox" data-i="' + i + '"' + (r.on ? ' checked' : '') + (busy || r.sent ? ' disabled' : '') + '></td>' +
                '<td>' + esc(r.name) + '</td><td>' + (p ? esc(p.nr + ' ' + p.first + ' ' + p.last) : '<span class="bad">—</span>') + '</td>' +
                '<td>' + esc(res) + '</td><td class="note">' + esc(r.note) + '</td>' +
                '<td class="' + (st[0] === 'ready' ? '' : st[0]) + '">' + esc(st[1]) + '</td></tr>';
        });
        h += '</table>';
        if (rest.length) {
            h += '<div class="rest">Im Notenbuch ohne Note aus Mission Control (bleiben leer): ' +
                rest.map(function (p) { return esc(p.nr + ' ' + p.first + ' ' + p.last); }).join(', ') + '</div>';
        }
        var ready = rows.filter(function (r) { return stateOf(r)[0] === 'ready'; });
        var blocked = rows.filter(function (r) { return r.on && !r.sent && r.back == null && stateOf(r)[0] === 'bad'; });
        var why = !classOk() ? 'Falsches Notenbuch' : !col ? 'Erst die Spalte wählen'
            : blocked.length ? blocked.length + ' Zeile' + (blocked.length === 1 ? '' : 'n') + ' rot: klären oder Haken weg'
            : !ready.length ? 'Nichts zu speichern' : '';
        var label = why || (armed ? 'Wirklich ' + ready.length + ' Noten in „' + book.cols[col].label + '“ speichern? Noch einmal klicken'
            : ready.length + ' Noten speichern');
        if (!busy && !rows.some(function (r) { return r.sent; })) {
            h += '<button type="button" class="go' + (armed && !why ? ' armed' : '') + '"' + (why ? ' disabled' : '') + '>' + esc(label) + '</button>';
        }
        elBody.innerHTML = h;
        if (!busy && !rows.some(function (r) { return r.sent; })) {
            msg(col ? 'Noch nichts gespeichert. Die Vorschau steht grau in den Zellen.' : 'Noch nichts gespeichert. Erst die Spalte wählen.');
        }
        mark();
        var sel = elBody.querySelector('.col');
        sel.disabled = busy || rows.some(function (r) { return r.sent; });
        sel.addEventListener('change', function () { col = sel.value; armed = 0; render(); });
        [].forEach.call(elBody.querySelectorAll('input[type=checkbox]'), function (c) {
            c.addEventListener('change', function () { rows[+c.dataset.i].on = c.checked; armed = 0; render(); });
        });
        var go = elBody.querySelector('.go');
        if (go) go.addEventListener('click', function () {
            if (why) return;
            if (!armed) {
                armed = setTimeout(function () { armed = 0; render(); }, 5000);
                render();
                return;
            }
            clearTimeout(armed);
            armed = 0;
            save(ready);
        });
    }
    /* preview in the grade book: the grade grey in the empty cell (a placeholder, never a value),
       a frame in the row's colour */
    function mark() {
        if (!col) return;
        rows.forEach(function (r) {
            if (r.hits.length !== 1 || !r.on) return;
            var inp = r.hits[0].cells[col];
            if (!inp) return;
            var st = stateOf(r)[0], td = inp.closest('td') || inp;
            td.setAttribute('data-svp-fux', '1');
            td.style.outline = '3px solid ' + (st === 'ready' ? 'rgb(245,194,66)' : st === 'ok' ? 'rgb(121,158,49)' : st === 'bad' ? 'rgb(176,36,24)' : 'transparent');
            td.style.outlineOffset = '-3px';
            if (st === 'ready' && !inp.value) { inp.setAttribute('data-svp-fux-ph', inp.getAttribute('placeholder') || ''); inp.placeholder = r.note; }
        });
    }

    /* --- saving and reading back -------------------------------------------------------------- */
    function idle(done) {
        var t0 = Date.now();
        (function poll() {
            if (!$.active || Date.now() - t0 > 20000) return setTimeout(done, 150);
            setTimeout(poll, 100);
        })();
    }
    function save(list) {
        busy = true;
        clearMarks();
        var i = 0;
        (function next() {
            if (i >= list.length) { msg('Gespeichert. Lese jede Zelle aus FuxNoten zurück …'); idle(readBack); return; }
            var r = list[i++], inp = r.hits[0].cells[col];
            msg('Speichere ' + i + ' von ' + list.length + ' …');
            $(inp).trigger('focusin');      /* FuxNoten notes the old value (empty) ... */
            inp.value = r.note;
            $(inp).trigger('focusout');     /* ... and saves the new one through its own path */
            r.sent = true;
            render();
            idle(next);
        })();
    }
    function readBack() {
        fetch(location.href, { credentials: 'same-origin', cache: 'no-store' })
            .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');
                rows.forEach(function (r) {
                    if (!r.sent) return;
                    var e = doc.getElementById(r.hits[0].cells[col].id);
                    r.back = e ? (e.getAttribute('value') || '').trim() : '(fehlt)';
                });
                busy = false;
                var sent = rows.filter(function (r) { return r.sent; });
                var good = sent.filter(function (r) { return same(r.back, r.note); }).length;
                render();
                msg(good === sent.length ? 'Zurückgelesen aus FuxNoten: ' + good + ' von ' + sent.length + ' Noten stimmen ✓'
                    : 'Zurückgelesen: nur ' + good + ' von ' + sent.length + ' stimmen – die roten Zeilen bitte ansehen.', good !== sent.length);
            })
            .catch(function (e) {
                busy = false;
                render();
                msg('Zurücklesen ging nicht (' + e.message + '). Bitte die Seite neu laden und das Lesezeichen noch einmal klicken.', true);
            });
    }
    function clearMarks() {
        [].forEach.call(document.querySelectorAll('[data-svp-fux]'), function (td) {
            td.style.outline = '';
            td.style.outlineOffset = '';
            td.removeAttribute('data-svp-fux');
        });
        [].forEach.call(document.querySelectorAll('[data-svp-fux-ph]'), function (inp) {
            var ph = inp.getAttribute('data-svp-fux-ph');
            if (ph) inp.placeholder = ph; else inp.removeAttribute('placeholder');
            inp.removeAttribute('data-svp-fux-ph');
        });
    }

    /* brought by the short bookmarklet: the bridge that delivered this code sends the grades next */
    if (window.__svpFuxLoader) { window.__svpFuxLoader = false; msg('Hole die Noten aus Mission Control …'); }
    else fetchData();
})();
