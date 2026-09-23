// A formatting bar for a contenteditable: bold, italic, underline, a few text colours, a marker
// and "Tx" to take it all off again. Shared, so every rich box in the SVP looks and behaves the
// same (Doc, 23.09.2026, for the Fahrplan sheet: "wenn ich in der Editbox bin paar Farben Bold
// etc."). notes.html still carries an older twin of this bar inline.
//
// Everything goes through document.execCommand - deprecated on paper, but every browser keeps
// it, and it is the only thing that knows how to split a <b> at the caret. Cmd+B/I/U work in a
// contenteditable without our help; the bar is for the mouse and for the colours.
//
// What is stored must be tame: clean() walks a node and keeps only the four marks and coloured
// spans, everything else (pasted fonts, sizes, links, nested lists) is unwrapped and its text
// stays. Callers store what clean() returns and put it back with innerHTML.
(function () {
    'use strict';

    /* The tags a stored line may carry, and what they are normalised to. */
    const MARKS = { B: 'b', STRONG: 'b', I: 'i', EM: 'i', U: 'u', S: 's', STRIKE: 's', DEL: 's' };

    /* opts.colors:   [[css colour, name], ...] - one dot per entry, in this order
       opts.marker:   background colour of the marker button (omit for no marker)
       opts.target:   the contenteditable the bar works on; the marks light up while the
                      selection in it carries them
       Returns the bar element. */
    function build(opts) {
        opts = opts || {};
        const bar = document.createElement('div');
        bar.className = 'fmtbar';
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', 'Formatierung');

        function mk(html, title, cmd, fn) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'fmtbar-btn';
            b.innerHTML = html;
            b.title = title;
            b.setAttribute('aria-label', title);
            if (cmd) b.dataset.cmd = cmd;
            /* mousedown is swallowed so the selection in the text survives the click */
            b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
            b.addEventListener('click', function (ev) { ev.preventDefault(); fn(); state(); });
            bar.appendChild(b);
            return b;
        }
        /* Marks as tags (<b>), colours as spans with a style - clean() reads both, but
           the tags keep the stored lines short. */
        function mark(cmd) {
            return function () {
                exec('styleWithCSS', false);
                exec(cmd);
            };
        }
        function colour(cmd, value) {
            return function () {
                exec('styleWithCSS', true);
                exec(cmd, value);
            };
        }
        function exec(cmd, value) {
            try { document.execCommand(cmd, false, value === undefined ? null : value); } catch (e) { /* not in an editable */ }
        }

        mk('<b>B</b>', 'Fett (Cmd+B)', 'bold', mark('bold'));
        mk('<i>I</i>', 'Kursiv (Cmd+I)', 'italic', mark('italic'));
        mk('<u>U</u>', 'Unterstrichen (Cmd+U)', 'underline', mark('underline'));
        (opts.colors || []).forEach(function (c) {
            mk('<span class="fmtbar-dot" style="background:' + c[0] + '"></span>',
                'Textfarbe ' + c[1], '', colour('foreColor', c[0]));
        });
        if (opts.marker) {
            mk('<span class="fmtbar-mark" style="background:' + opts.marker + '">M</span>',
                'Marker', '', colour('hiliteColor', opts.marker));
        }
        mk('Tx', 'Formatierung entfernen', '', function () {
            exec('removeFormat');
            exec('unlink');
        });

        /* Which marks the selection carries - only while the caret sits in our box, the
           bar of a closed sheet must not read a selection elsewhere on the page. */
        function state() {
            const inside = opts.target && document.activeElement === opts.target;
            bar.querySelectorAll('[data-cmd]').forEach(function (b) {
                let on = false;
                if (inside) { try { on = document.queryCommandState(b.dataset.cmd); } catch (e) { /* no editable */ } }
                b.classList.toggle('on', on);
            });
        }
        if (opts.target) document.addEventListener('selectionchange', state);
        return bar;
    }

    /* The tame copy of a node's content (or of an HTML string) as an HTML string:
       marks and coloured spans stay, everything else is unwrapped, line breaks
       become spaces - a stored line is one line. Parsing goes through a
       <template>, its content is inert: no image loads, no script runs. */
    function clean(src) {
        let root = src;
        if (typeof src === 'string') {
            const t = document.createElement('template');
            t.innerHTML = src;
            root = t.content;
        }
        const out = document.createElement('div');
        if (root.nodeType === 3) out.appendChild(document.createTextNode(root.nodeValue));
        else walk(root, out);
        return out.innerHTML.replace(/^(\s|&nbsp;)+|(\s|&nbsp;)+$/g, '');
    }

    function walk(from, to) {
        [].forEach.call(from.childNodes, function (n) {
            if (n.nodeType === 3) {
                to.appendChild(document.createTextNode(n.nodeValue.replace(/[\r\n]+/g, ' ')));
                return;
            }
            if (n.nodeType !== 1) return;
            const tag = n.nodeName;
            if (tag === 'BR') {
                to.appendChild(document.createTextNode(' '));
                return;
            }
            /* The colour may sit on any element: execCommand puts it on the <b> that is
               already there rather than opening a span of its own (<font color> is what
               it makes without styleWithCSS). Whatever carries it, it comes out as a span
               inside the mark. */
            const color = (n.style && n.style.color) || n.getAttribute('color') || '';
            const bg = (n.style && n.style.backgroundColor) || '';
            let outer = null, inner = null;
            if (MARKS[tag]) outer = inner = document.createElement(MARKS[tag]);
            if (color || bg) {
                const sp = document.createElement('span');
                if (color) sp.style.color = color;
                if (bg) sp.style.backgroundColor = bg;
                if (outer) outer.appendChild(sp); else outer = sp;
                inner = sp;
            }
            if (outer) { walk(n, inner); to.appendChild(outer); } else walk(n, to);
        });
    }

    /* The bare text of a stored line - for "is there anything in it". */
    function textOf(html) {
        return String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00a0/g, ' ').trim();
    }

    window.svpFmtBar = { build: build, clean: clean, textOf: textOf };
})();
