// A formatting bar for a contenteditable: optional smileys to type, bold, italic, underline, a few
// text colours, a marker and "Tx" to take it all off again. Shared, so every rich box in the SVP looks and behaves the
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
    /* The one kind of picture a stored line may carry (29.09.2026): ours, from /svp/emo/, by its path - no
       other address, no other attribute gets through clean(). */
    const EMO_SRC = /^\/svp\/emo\/[a-z0-9-]+\.(webp|png)$/;
    /* Doc, 29.09.2026: a second level in a list ("die zweite Ebene nach innen schieben") - a stored line carries
       its level as leading tabs, at most EBENEN_MAX; zeile() reads one, mitEbene() writes one. Older code shows
       such a line unindented, and what it saves loses the tabs, never the text. */
    const EBENEN_MAX = 2;
    function zeile(line) {
        const s = String(line || ''), n = /^\t*/.exec(s)[0].length;
        return { ebene: Math.min(EBENEN_MAX, n), html: s.slice(n) };
    }
    function mitEbene(html, ebene) {
        return '\t'.repeat(Math.max(0, Math.min(EBENEN_MAX, ebene | 0))) + html;
    }
    /* Doc, 29.09.2026: "ein Icon für Font-Size. Also klein, mittel, groß" - small and large as em of the text
       around (the Fahrplan sheet shrinks its own size to fit, these go along); medium is the text's own size,
       no span at all. Only these two come through clean(). */
    const GROESSEN = [['klein', '0.75em', 9], ['normal', '', 12.5], ['groß', '1.35em', 16]];
    const GROESSEN_OK = ['0.75em', '1.35em'];
    /* an A, drawn (not a font glyph), at the size it stands for */
    function aSvg(px) {
        return '<svg viewBox="0 0 24 24" width="' + px + '" height="' + px + '" aria-hidden="true" focusable="false">' +
            '<path d="M4 21 12 3 20 21M7.5 14.5h9" fill="none" stroke="currentColor" stroke-width="2.6"' +
            ' stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    /* Lucide "indent-increase" / "indent-decrease" (ISC, lucide-static 1.48.0) */
    const EINZUG_SVG = function (pfeil) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor"' +
            ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H11"/><path d="M21 12H11"/>' +
            '<path d="M21 19H11"/><path d="' + pfeil + '"/></g></svg>';
    };
    function bildHtml(src, name) {
        const img = document.createElement('img');
        img.className = 'fmtbar-bild';
        img.setAttribute('src', src);
        img.setAttribute('alt', name || '');
        return img.outerHTML;
    }

    /* opts.eineReihe: everything in one row - indent and pictures inline instead of in a second row
       opts.groessen: three A after U - small, the text's own size, large (GROESSEN)
       opts.emojis:   ['😀', ...] - one button each, in front of B, typing it at the caret
       opts.colors:   [[css colour, name], ...] - one dot per entry, in this order
       opts.marker:   background colour of the marker button (omit for no marker)
       opts.target:   the contenteditable the bar works on; the marks light up while the
                      selection in it carries them
       Returns the bar element. */
    function build(opts) {
        opts = opts || {};
        const bar = document.createElement('div');
        bar.className = 'fmtbar' + (opts.eineReihe ? ' eine-reihe' : '');
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

        /* Doc, 29.09.2026 (Fahrplan): "vor das Bold, einfach ein paar übliche Smileys, die cool sind" - each
           button shows the character it types (content, not an icon); insertText keeps undo and the caret */
        (opts.emojis || []).forEach(function (e) {
            mk('<span class="fmtbar-emoji">' + e + '</span>', e + ' einfügen', '', function () { exec('insertText', e); })
                .classList.add('fmtbar-emo');
        });
        mk('<b>B</b>', 'Fett (Cmd+B)', 'bold', mark('bold'));
        mk('<i>I</i>', 'Kursiv (Cmd+I)', 'italic', mark('italic'));
        const uKnopf = mk('<u>U</u>', 'Unterstrichen (Cmd+U)', 'underline', mark('underline'));
        /* font sizes (opts.groessen): three A right after the marks */
        let hinterU = uKnopf;
        if (opts.groessen) {
            const gruppe = document.createElement('div');
            gruppe.className = 'fmtbar-groessen';
            GROESSEN.forEach(function (g) {
                gruppe.appendChild(mk(aSvg(g[2]), 'Schrift ' + g[0], '', function () { groesse(g[1]); }));
            });
            bar.insertBefore(gruppe, uKnopf.nextSibling);
            hinterU = gruppe;
        }
        /* The selection - or, with only the caret, its whole point - at a size. execCommand marks the stretch
           with <font size="7">, the one thing that splits marks and points correctly; each such mark becomes our
           span (for the text's own size: nothing), and sizes inside it give way. Saved like typing. */
        function groesse(wert) {
            const t = opts.target, sel = window.getSelection();
            if (!t || !sel.rangeCount || !t.contains(sel.anchorNode)) return;
            if (sel.isCollapsed) {
                let el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode;
                while (el && el.parentNode !== t) el = el.parentNode;
                if (!el) return;
                const r = document.createRange();
                r.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(r);
            }
            exec('styleWithCSS', false);
            exec('fontSize', '7');
            t.querySelectorAll('font[size="7"]').forEach(function (f) {
                f.querySelectorAll('[style]').forEach(function (e) { e.style.fontSize = ''; });
                f.querySelectorAll('font[size]').forEach(function (e) { e.removeAttribute('size'); });
                if (wert) {
                    const sp = document.createElement('span');
                    sp.style.fontSize = wert;
                    while (f.firstChild) sp.appendChild(f.firstChild);
                    f.replaceWith(sp);
                } else {
                    f.replaceWith.apply(f, [].slice.call(f.childNodes));
                }
            });
            t.dispatchEvent(new Event('input', { bubbles: true }));
        }
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
        /* Doc, 29.09.2026: the cow "genauso groß wie die anderen ... als Smiley, als Icon Bild einfügen" -
           opts.bilder, our own little pictures (EMO_SRC), in a second row right under Tx; a tap puts the
           picture at the caret, as tall as the letters (.fmtbar-bild) */
        /* Doc, 29.09.2026: "unter dem B ein Indent-Button. Und einen Outdent-Button" - opts.einzug {rein, raus},
           the caller knows its list; in the second row, the first one right under B: past the smileys (28 px and
           4 px of gap each) and the 8 px of air before B */
        if (opts.einzug) {
            const einzug = document.createElement('div');
            einzug.className = 'fmtbar-einzug';
            const n = (opts.emojis || []).length;
            if (!opts.eineReihe) einzug.style.left = (n ? n * 32 + 8 : 0) + 'px';
            einzug.appendChild(mk(EINZUG_SVG('m3 8 4 4-4 4'), 'Einrücken (Tab)', '', opts.einzug.rein));
            einzug.appendChild(mk(EINZUG_SVG('m7 8-4 4 4 4'), 'Ausrücken (Shift+Tab)', '', opts.einzug.raus));
            /* in one row (opts.eineReihe) right after U, with the marks; else in the second row */
            if (opts.eineReihe) bar.insertBefore(einzug, hinterU.nextSibling); else bar.appendChild(einzug);
        }
        const bilder = (opts.bilder || []).filter(function (b) { return EMO_SRC.test(b[0]); });
        if (bilder.length) {
            /* hung under the bar, not wrapped into it: a row break would make the bar as wide as its row and
               push it under the title ("alles ist ein bisschen verschoben") */
            const reihe = document.createElement('div');
            reihe.className = 'fmtbar-bilder';
            bilder.forEach(function (b) {
                reihe.appendChild(mk('<img src="' + b[0] + '" alt="">', b[1] + ' einfügen', '', function () {
                    exec('insertHTML', bildHtml(b[0], b[1]));
                }));
            });
            bar.appendChild(reihe);
        }

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
            /* our own little pictures, rebuilt from their path alone; any other picture goes */
            if (tag === 'IMG') {
                const src = n.getAttribute('src') || '';
                if (EMO_SRC.test(src)) {
                    const t = document.createElement('template');
                    t.innerHTML = bildHtml(src, n.getAttribute('alt') || '');
                    to.appendChild(t.content.firstChild);
                }
                return;
            }
            /* The colour may sit on any element: execCommand puts it on the <b> that is
               already there rather than opening a span of its own (<font color> is what
               it makes without styleWithCSS). Whatever carries it, it comes out as a span
               inside the mark. */
            const color = (n.style && n.style.color) || n.getAttribute('color') || '';
            const bg = (n.style && n.style.backgroundColor) || '';
            /* a font size only if it is one of ours (GROESSEN, 29.09.2026) - pasted sizes still go */
            const fs = (n.style && GROESSEN_OK.indexOf(n.style.fontSize) >= 0) ? n.style.fontSize : '';
            let outer = null, inner = null;
            if (MARKS[tag]) outer = inner = document.createElement(MARKS[tag]);
            if (color || bg || fs) {
                const sp = document.createElement('span');
                if (color) sp.style.color = color;
                if (bg) sp.style.backgroundColor = bg;
                if (fs) sp.style.fontSize = fs;
                if (outer) outer.appendChild(sp); else outer = sp;
                inner = sp;
            }
            if (outer) { walk(n, inner); to.appendChild(outer); } else walk(n, to);
        });
    }

    /* The bare text of a stored line - for "is there anything in it". */
    function textOf(html) {
        /* a line with only one of our pictures in it is not empty (29.09.2026) - it counts as its alt text */
        return String(html || '').replace(/<img\b[^>]*\balt="([^"]+)"[^>]*>/gi, ' $1 ').replace(/<img\b[^>]*>/gi, ' \u25aa ')
            .replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00a0/g, ' ').trim();
    }

    /* The same HTML, structure and all, with nothing in it that runs: paragraphs, lists, marks, colours and
       plain links stay, every other tag goes with its content (script, style, iframe, img ...) and of the
       attributes only href (http, https, mailto or a plain path) and the two colours come through. For text
       that is stored as HTML and set as HTML again for every visitor - the bridge panel of a plan page
       (audit 27.09.2026). clean() above is not the tool for it: it makes one line of everything. */
    const SAFE_TAGS = {
        DIV: 1, P: 1, BR: 1, HR: 1, UL: 1, OL: 1, LI: 1, B: 1, STRONG: 1, I: 1, EM: 1, U: 1, S: 1, STRIKE: 1,
        SPAN: 1, FONT: 1, A: 1, H1: 1, H2: 1, H3: 1, H4: 1, BLOCKQUOTE: 1, SUB: 1, SUP: 1, CODE: 1, PRE: 1
    };
    function safe(src) {
        const t = document.createElement('template');
        t.innerHTML = String(src || '');
        const out = document.createElement('div');
        (function copy(from, to) {
            [].forEach.call(from.childNodes, function (n) {
                if (n.nodeType === 3) { to.appendChild(document.createTextNode(n.nodeValue)); return; }
                if (n.nodeType !== 1 || !SAFE_TAGS[n.nodeName]) return;
                const e = document.createElement(n.nodeName.toLowerCase());
                const color = (n.style && n.style.color) || n.getAttribute('color') || '';
                const bg = (n.style && n.style.backgroundColor) || '';
                if (color) e.style.color = color;
                if (bg) e.style.backgroundColor = bg;
                if (n.nodeName === 'A') {
                    /* control characters and blanks go first: the browser drops them when it reads a URL,
                       so "java\nscript:" would run - here it must read as the scheme it is */
                    const href = (n.getAttribute('href') || '').replace(/[\u0000- ]/g, '');
                    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(href);
                    if (href && (!scheme || /^(https?|mailto)$/i.test(scheme[1]))) {
                        e.setAttribute('href', href);
                        e.setAttribute('rel', 'noopener');
                    }
                }
                copy(n, e);
                to.appendChild(e);
            });
        })(t.content, out);
        return out.innerHTML;
    }

    window.svpFmtBar = { build: build, clean: clean, safe: safe, textOf: textOf, zeile: zeile, mitEbene: mitEbene, EBENEN_MAX: EBENEN_MAX };
})();
