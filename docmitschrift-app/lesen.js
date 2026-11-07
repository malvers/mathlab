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

    /* Live reload (local server, tools/live_reload.py) watches the trash and the edits too, so a change made
       elsewhere shows up by itself. Our own writes must not count as one: no reload while a write is under way,
       its "Rückgängig" still shows or a question is open, and afterwards what is on disk becomes the new ground. */
    var writing = 0;
    window.__liveReloadBusy = function () {
        return writing > 0 || !!document.querySelector('.toast.da, dialog[open]');
    };
    function post(url, data) {
        writing++;
        return fetch(url, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (j) {
                if (!res.ok || !j.ok) throw new Error(j.fehler || ('Fehler ' + res.status));
                return j;
            });
        }).finally(function () {
            var again = window.__liveReload && window.__liveReload.rebase();
            Promise.resolve(again).catch(function () { }).then(function () { writing--; });
        });
    }

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
        return post('/__mitschrift/papierkorb', { tag: s.dataset.tag, id: s.dataset.id, aktion: aktion });
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

    var toastUndo = null;                           // what "Rückgängig" in the toast does
    function toast(text, undo) {
        var t = document.querySelector('.toast'), b = t.querySelector('.toast-zurueck');
        t.querySelector('.toast-text').textContent = text;
        toastUndo = undo || null;
        b.hidden = !undo;
        t.classList.add('da');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.classList.remove('da'); }, undo ? 9000 : 6000);
    }
    function hideToast() { clearTimeout(toastTimer); document.querySelector('.toast').classList.remove('da'); }

    function trash(s) {
        s.hidden = true;
        renderTrash();
        send(s, 'weg').then(function () {
            toast('„' + s.dataset.titel + '“ liegt im Papierkorb.', function () { restore(s); });
        }).catch(function (e) {
            s.hidden = false;
            renderTrash();
            toast('Nicht in den Papierkorb gelegt: ' + e.message);
        });
    }

    /* A whole section asks first (Doc, 07.11.2026: "Wenn ich ein ganzes Gespräch löschen will, bitte vorher
       eine Rückfrage. Denn da wäre ja dann auch Transkript und alles weg.") - a dialog of the page's own,
       Esc or a click beside it cancels, the safe button has the focus. */
    function ask(text) {
        var d = document.querySelector('dialog.frage');
        d.querySelector('#frage-text').textContent = text;
        return new Promise(function (resolve) {
            function done(v) {
                d.removeEventListener('click', onClick);
                d.removeEventListener('cancel', onCancel);
                if (d.open) d.close();
                resolve(v);
            }
            function onClick(ev) {
                var b = ev.target.closest('[data-frage]');
                if (b) return done(b.dataset.frage === 'ja');
                if (ev.target === d) done(false);       // the backdrop
            }
            function onCancel(ev) { ev.preventDefault(); done(false); }
            d.addEventListener('click', onClick);
            d.addEventListener('cancel', onCancel);
            d.showModal();
            d.querySelector('[data-frage="nein"]').focus();
        });
    }

    function askTrash(s) {
        var zeit = s.querySelector('.zeit'), art = s.querySelector('.art');
        var z = zeit ? zeit.textContent : '', a = art ? art.textContent : '';
        var what = a === 'Gespräch' ? 'Gespräch ' + z
            : /^\d\d:\d\d/.test(z) ? 'Stunde ' + z + (a ? ' · ' + a : '') : '„' + z + '“';
        var withs = s.querySelector('details[data-teil="stoff"]') ? 'mit Zusammenfassung und Transcript' : 'mit Transcript';
        ask(what + ' ' + withs + ' in den Papierkorb legen?').then(function (ok) { if (ok) trash(s); });
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

    /* ---- Doc rewrites a Zusammenfassung in place (Doc, 07.11.2026: "lass mich die Zusammenfassung dann bitte
       editieren" - "ob man das Editieren in Place machen kann"): the list itself is editable and looks as it
       does when read. Enter makes a new point, Tab moves a point under the topic above, Shift-Tab back out;
       leaving the list or Cmd-Enter saves, Esc throws away what was typed since clicking in. The server keeps
       every version (daten/<tag>.bearbeitet.jsonl); "Automatische Fassung" brings the page's own back. */
    var editing = null;                             // { ul, html, tree } while Doc writes in a list

    function plain(el) { return (el ? el.textContent : '').replace(/\s+/g, ' ').trim(); }
    function ownText(li) {                          // the words of a point without its sub-list
        var c = li.cloneNode(true), sub = c.querySelectorAll('ul, ol');
        Array.prototype.forEach.call(sub, function (x) { x.remove(); });
        return plain(c);
    }
    function treeOf(ul) {
        var tree = [];
        Array.prototype.forEach.call(ul.childNodes, function (n) {
            if (n.nodeType === 1 && n.tagName === 'LI') {
                var under = [];
                Array.prototype.forEach.call(n.querySelectorAll('li'), function (x) { var w = ownText(x); if (w) under.push(w); });
                var title = ownText(n);
                if (title) tree.push([title, under]);
                else under.forEach(function (u) { tree.push([u, []]); });
            } else if (n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName)) {
                var into = tree.length ? tree[tree.length - 1][1] : null;    // a stray sub-list: under the topic before
                Array.prototype.forEach.call(n.querySelectorAll('li'), function (x) {
                    var w = ownText(x); if (!w) return;
                    if (into) into.push(w); else tree.push([w, []]);
                });
            } else {
                var w = plain(n);
                if (w) tree.push([w, []]);
            }
        });
        return tree;
    }
    function drawTree(ul, tree, byHand) {
        ul.textContent = '';
        tree.forEach(function (it) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(it[0]));
            if (it[1].length) {
                var sub = document.createElement('ul');
                it[1].forEach(function (u) { var x = document.createElement('li'); x.textContent = u; sub.appendChild(x); });
                li.appendChild(sub);
            }
            ul.appendChild(li);
        });
        ul.toggleAttribute('data-von-hand', byHand);
        var row = ul.parentNode.querySelector('.bearbeiten');
        if (byHand && !row) {
            row = document.createElement('div'); row.className = 'bearbeiten';
            row.innerHTML = '<span class="von-hand">von Hand</span>'
                + '<button type="button" class="knopf klein" data-automatisch>Automatische Fassung</button>';
            ul.parentNode.insertBefore(row, ul.nextSibling);
        }
        if (!byHand && row) row.remove();
    }

    function sendTree(ul, tree) {
        var s = ul.closest('.abschnitt');
        return post('/__mitschrift/zusammenfassung', { tag: s.dataset.tag, id: s.dataset.id, gliederung: tree })
            .then(function (j) { drawTree(ul, j.gliederung, j.von_hand); return j; });
    }

    function beginEdit(ul) {
        if (editing && editing.ul === ul) return;
        editing = { ul: ul, html: ul.innerHTML, tree: treeOf(ul), byHand: ul.hasAttribute('data-von-hand') };
    }
    function endEdit(keep) {
        var e = editing;
        editing = null;
        if (!e) return;
        if (!keep) { e.ul.innerHTML = e.html; return; }
        var tree = treeOf(e.ul);
        if (JSON.stringify(tree) === JSON.stringify(e.tree)) return;
        var before = e.byHand ? e.tree : null;
        sendTree(e.ul, tree).then(function () {
            toast('Zusammenfassung gespeichert.', function () {
                sendTree(e.ul, before).then(function () { toast('Vorige Fassung wieder da.'); });
            });
        }).catch(function (err) {
            e.ul.innerHTML = e.html;
            toast('Nicht gespeichert: ' + err.message);
        });
    }

    function caretLi(ul) {
        var sel = window.getSelection();
        var n = sel.rangeCount ? sel.anchorNode : null;
        var li = n && (n.nodeType === 1 ? n : n.parentNode).closest('li');
        return li && ul.contains(li) ? li : null;
    }
    function keepCaret(fn) {
        var sel = window.getSelection(), node = sel.anchorNode, off = sel.anchorOffset;
        fn();
        try { if (node && document.contains(node)) sel.collapse(node, off); } catch (e) { /* caret lost: harmless */ }
    }
    function indent(ul, li) {                       // a topic becomes a point of the topic above
        var prev = li.previousElementSibling;
        if (li.parentNode !== ul || !prev) return;
        keepCaret(function () {
            var sub = prev.querySelector(':scope > ul');
            if (!sub) { sub = document.createElement('ul'); prev.appendChild(sub); }
            var own = li.querySelector(':scope > ul');
            sub.appendChild(li);
            if (own) { Array.prototype.slice.call(own.children).forEach(function (x) { sub.appendChild(x); }); own.remove(); }
        });
    }
    function outdent(ul, li) {                      // a point becomes a topic; the points after it go with it
        var sub = li.parentNode;
        if (sub === ul) return;
        var topic = sub.closest('li');
        if (!topic || !ul.contains(topic)) return;
        keepCaret(function () {
            var after = [];
            for (var n = li.nextElementSibling; n; n = n.nextElementSibling) after.push(n);
            ul.insertBefore(li, topic.nextSibling);
            if (after.length) {
                var own = document.createElement('ul');
                after.forEach(function (x) { own.appendChild(x); });
                li.appendChild(own);
            }
            if (!sub.children.length) sub.remove();
        });
    }

    function wireEditor(ul) {
        ul.setAttribute('contenteditable', 'true');
        ul.setAttribute('spellcheck', 'true');
        ul.setAttribute('aria-label', 'Zusammenfassung – zum Bearbeiten hineinklicken');
        ul.addEventListener('focusin', function () { beginEdit(ul); });
        ul.addEventListener('focusout', function (ev) {
            if (!ul.contains(ev.relatedTarget)) endEdit(true);
        });
        ul.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') { ev.preventDefault(); endEdit(false); ul.blur(); return; }
            if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); ul.blur(); return; }
            if (ev.key === 'Tab') {
                ev.preventDefault();
                var li = caretLi(ul);
                if (li) (ev.shiftKey ? outdent : indent)(ul, li);
            }
        });
        ul.addEventListener('input', function () {   // the browser copies colours into spans when lines merge
            Array.prototype.forEach.call(ul.querySelectorAll('[style]'), function (x) { x.removeAttribute('style'); });
            Array.prototype.forEach.call(ul.querySelectorAll('span, font, b, strong, i, em'), function (x) {
                while (x.firstChild) x.parentNode.insertBefore(x.firstChild, x);
                x.remove();
            });
        });
        ul.addEventListener('paste', function (ev) {  // words only, no colours or fonts from elsewhere
            ev.preventDefault();
            document.execCommand('insertText', false, (ev.clipboardData || window.clipboardData).getData('text/plain'));
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
        var auto = t.closest('[data-automatisch]');
        if (auto) {
            var list = auto.closest('.teil').querySelector('.themen');
            return sendTree(list, null).then(function () { toast('Wieder die automatische Zusammenfassung.'); })
                .catch(function (e) { toast('Nicht zurückgesetzt: ' + e.message); });
        }
        var w = t.closest('.weg');
        if (w) return askTrash(w.closest('.abschnitt'));
        if (t.closest('.toast-zurueck')) {
            var u = toastUndo;
            hideToast();
            return u && u();
        }
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
        if (document.querySelector('dialog[open]')) return;
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
    Array.prototype.forEach.call(document.querySelectorAll('.themen'), wireEditor);
    renderTrash();
})();
