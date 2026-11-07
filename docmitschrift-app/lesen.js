/* DocMitschrift pages (mitschrift_seite.py puts this file into every page it builds): every section folds
   away and can go into the trash (Doc, 07.11.2026: "dass man die einzelnen löschen und einklappen kann").
   Folding is remembered in this browser only - a convenience, the page works without it. The trash is
   kept by the server in daten/<tag>.papierkorb.jsonl: nothing is ever deleted, "Rückgängig" and
   "Zurückholen" bring a section back. */
(function () {
    'use strict';
    var KEY = 'docnote.mitschrift.zu';          // sections folded away
    var PARTS = 'docnote.mitschrift.teile';     // parts (Zusammenfassung, Im Gespräch, Transcript ...) opened or closed by hand
    var toastTimer = 0;

    function readStore(k) {
        try { return JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { return {}; }
    }
    function writeStore(k, o) {
        try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) { /* private window: not remembered */ }
    }
    function readFolded() { return readStore(KEY); }
    function writeFolded(o) { writeStore(KEY, o); }
    function sections() { return Array.prototype.slice.call(document.querySelectorAll('.abschnitt')); }
    function shown() { return sections().filter(function (s) { return !s.hidden; }); }
    function keyOf(s) { return s.dataset.tag + '/' + s.dataset.id; }
    function partKey(d) { return keyOf(d.closest('.abschnitt')) + '/' + d.dataset.teil; }
    function wordingOf(s) { return s.querySelector('details[data-teil="wortlaut"]'); }

    /* a part opened or closed: remembered as it is now (the lists start open, the wording closed) */
    function rememberPart(d) {
        var o = readStore(PARTS);
        o[partKey(d)] = d.open ? 1 : 0;
        writeStore(PARTS, o);
    }

    /* ---- folding */
    function fold(s, closed, remember) {
        s.classList.toggle('zu', closed);
        s.querySelector('.klapp').setAttribute('aria-expanded', String(!closed));
        if (remember) {
            var o = readFolded();
            if (closed) o[keyOf(s)] = 1; else delete o[keyOf(s)];
            writeFolded(o);
        }
    }

    /* the two tools follow what is on the page: "Alle zuklappen" while one is open, "Transcript öffnen"
       while one wording is closed */
    function syncTools() {
        var vis = shown();
        var all = document.querySelector('[data-alle]'), words = document.querySelector('[data-wortlaut]');
        var anyOpen = vis.some(function (s) { return !s.classList.contains('zu'); });
        all.textContent = anyOpen || !vis.length ? 'Alle zuklappen' : 'Alle aufklappen';
        var det = vis.map(wordingOf).filter(Boolean);
        var allWords = det.length && det.every(function (d) { return d.open; }) &&
            vis.every(function (s) { return !s.classList.contains('zu') || !wordingOf(s); });
        words.textContent = allWords ? 'Transcript schließen' : 'Transcript öffnen';
        all.disabled = words.disabled = !vis.length;
        if (!det.length) words.disabled = true;
    }

    /* ---- the trash */
    function send(s, aktion) {
        return fetch('/__mitschrift/papierkorb', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag: s.dataset.tag, id: s.dataset.id, aktion: aktion })
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (j) {
                if (!res.ok || !j.ok) throw new Error(j.fehler || ('Fehler ' + res.status));
                return j;
            });
        });
    }

    function renderTrash() {
        var korb = document.querySelector('.korb'), list = korb.querySelector('ul');
        var gone = sections().filter(function (s) { return s.hidden; });
        list.textContent = '';
        gone.forEach(function (s) {
            var li = document.createElement('li'), name = document.createElement('span'), b = document.createElement('button');
            name.textContent = s.dataset.titel;
            b.type = 'button'; b.className = 'knopf'; b.textContent = 'Zurückholen';
            b.dataset.zurueck = s.id;
            li.appendChild(name); li.appendChild(b); list.appendChild(li);
        });
        korb.querySelector('.anzahl').textContent = gone.length ? '(' + gone.length + ')' : '';
        korb.hidden = !gone.length;
        var leer = document.querySelector('[data-leer]');
        if (sections().length) leer.hidden = shown().length > 0;
        syncTools();
    }

    function toast(text, undo) {
        var t = document.querySelector('.toast'), b = t.querySelector('.toast-zurueck');
        t.querySelector('.toast-text').textContent = text;
        b.hidden = !undo;
        b.dataset.zurueck = undo ? undo.id : '';
        t.classList.add('da');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.classList.remove('da'); }, undo ? 9000 : 6000);
    }
    function hideToast() { clearTimeout(toastTimer); document.querySelector('.toast').classList.remove('da'); }

    function trash(s) {
        s.hidden = true;
        renderTrash();
        send(s, 'weg').then(function () {
            toast('„' + s.dataset.titel + '“ liegt im Papierkorb.', s);
        }).catch(function (e) {
            s.hidden = false;
            renderTrash();
            toast('Nicht in den Papierkorb gelegt: ' + e.message);
        });
    }

    function restore(s) {
        if (!s) return;
        s.hidden = false;
        renderTrash();
        hideToast();
        send(s, 'zurueck').then(function () {
            s.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }).catch(function (e) {
            s.hidden = true;
            renderTrash();
            toast('Nicht zurückgeholt: ' + e.message);
        });
    }

    /* ---- wiring */
    document.addEventListener('click', function (ev) {
        var t = ev.target;
        var sum = t.closest('details.teil > summary');
        if (sum) {                                  // the browser toggles it, then it is remembered
            var part = sum.parentNode;
            return setTimeout(function () { rememberPart(part); syncTools(); }, 0);
        }
        var k = t.closest('.klapp');
        if (k) {
            var s = k.closest('.abschnitt');
            fold(s, !s.classList.contains('zu'), true);
            return syncTools();
        }
        var w = t.closest('.weg');
        if (w) return trash(w.closest('.abschnitt'));
        var z = t.closest('[data-zurueck]');
        if (z && z.dataset.zurueck) return restore(document.getElementById(z.dataset.zurueck));
        if (t.closest('[data-alle]')) {
            var close = shown().some(function (s) { return !s.classList.contains('zu'); });
            shown().forEach(function (s) { fold(s, close, true); });
            return syncTools();
        }
        if (t.closest('[data-wortlaut]')) {
            var open = t.closest('[data-wortlaut]').textContent === 'Transcript öffnen';
            shown().forEach(function (s) {
                var d = wordingOf(s);
                if (!d) return;
                if (open) fold(s, false, true);
                d.open = open;
                rememberPart(d);
            });
            return syncTools();
        }
    });
    document.addEventListener('toggle', syncTools, true);   // a single wording opened by hand

    /* ← and → go to the day (week) before or after, like the ‹ › pills - only where a pill leads somewhere
       (Doc, 07.11.2026: "die Pfeiltasten könnten hier auch von Tag zu Tag springen") */
    document.addEventListener('keydown', function (ev) {
        if (ev.altKey || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.defaultPrevented) return;
        var el = ev.target;
        if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
        var dir = ev.key === 'ArrowLeft' ? 'zurueck' : ev.key === 'ArrowRight' ? 'vor' : '';
        var a = dir && document.querySelector('a[data-nav="' + dir + '"]');
        if (!a) return;
        ev.preventDefault();
        location.href = a.href;
    });

    /* a tool keeps the width of its longer word, so the row stays put when its word changes */
    function keepWidth(sel, words) {
        var b = document.querySelector(sel), was = b.textContent, w = 0;
        words.forEach(function (x) { b.textContent = x; w = Math.max(w, b.getBoundingClientRect().width); });
        b.textContent = was;
        b.style.minWidth = Math.ceil(w) + 'px';
    }
    keepWidth('[data-alle]', ['Alle zuklappen', 'Alle aufklappen']);
    keepWidth('[data-wortlaut]', ['Transcript öffnen', 'Transcript schließen']);

    var saved = readFolded(), parts = readStore(PARTS);
    sections().forEach(function (s) { if (saved[keyOf(s)]) fold(s, true, false); });
    Array.prototype.forEach.call(document.querySelectorAll('details.teil:not([data-fest])'), function (d) {
        var k = partKey(d);                         // &wortlaut=1 (data-fest) opens the wording whatever was kept
        if (k in parts) d.open = !!parts[k];
    });
    renderTrash();
})();
