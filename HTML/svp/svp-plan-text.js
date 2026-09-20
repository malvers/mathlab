// Stoffverteilungsplan renderer, part "text": formulas (KaTeX), inline marks, dates, the bullet list of a week.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        markPlain, srcOf, paintSrc, buildMarkTools, datumLang, setDateText, setMathText,
        buildDetailList, notesTextOf, setNotesText
    });

    // --- LaTeX support ---------------------------------------------------
    // Formulas in PLAN strings use $...$ (KaTeX inline math). KaTeX is loaded
    // on demand, only when a page actually contains math. Edit mode always
    // shows and saves the raw $...$ source (see setEditable).
    const KATEX = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min';
    const mathEls = new Set();

    /* --- Inline marks in the Inhalt bullets -------------------------------
       Doc, 06.09.2026: "fuer Inhalt, dass ich Sachen hervorheben kann". A
       bullet stays a plain string - shift, MAP, Untis and print all keep
       working on it - and carries its formatting as a handful of whitelisted
       tags inside that string. Everything else stays literal: the parser only
       ever recognises these six, so an old bullet with a stray "<" renders
       exactly as it always did. */
    const MARK_RE = /<(\/?)(b|i|u|c1|c2|c3)>/g;
    const MARK_EL = {
        b: ['b', ''], i: ['i', ''], u: ['u', ''],
        c1: ['span', 'hl-l'], c2: ['span', 'hl-y'], c3: ['span', 'hl-p']
    };
    /* the way back: DOM element -> mark tag, for reading an edited bullet out */
    const MARK_OF = { B: 'b', STRONG: 'b', I: 'i', EM: 'i', U: 'u' };
    const MARK_CLS = { 'hl-l': 'c1', 'hl-y': 'c2', 'hl-p': 'c3' };

    function markTagOf(el) {
        if (el.classList) {
            for (const c in MARK_CLS) if (el.classList.contains(c)) return MARK_CLS[c];
        }
        return MARK_OF[el.tagName] || '';
    }

    /* The text without its marks - what the Untis box and every length check
       have to see. */
    function markPlain(s) { return String(s == null ? '' : s).replace(MARK_RE, ''); }

    /* Serialise an edited element back into its source string. */
    function srcOf(el) {
        let out = '';
        el.childNodes.forEach(function (n) {
            if (n.nodeType === 3) { out += n.nodeValue; return; }
            if (n.nodeType !== 1) return;
            if (n.tagName === 'BR') { out += ' '; return; }
            const t = markTagOf(n);
            out += t ? '<' + t + '>' + srcOf(n) + '</' + t + '>' : srcOf(n);
        });
        return out;
    }

    /* Text between two marks: KaTeX for $...$, unless raw is set - that is
       what edit mode wants (formatting visible, formulas as typed). */
    function appendText(parent, text, raw) {
        if (!text) return;
        if (raw || !window.katex || !text.includes('$')) {
            parent.appendChild(document.createTextNode(text));
            return;
        }
        text.split(/\$([^$]+)\$/).forEach(function (part, idx) {
            if (!part) return;
            if (idx % 2 === 0) {
                parent.appendChild(document.createTextNode(part));
            } else {
                const span = document.createElement('span');
                try { katex.render(part, span, { throwOnError: false }); }
                catch (e) { span.textContent = '$' + part + '$'; }
                parent.appendChild(span);
            }
        });
    }

    /* Paint a source string into an element. */
    function paintSrc(el, src, raw) {
        el.textContent = '';
        const stack = [el], open = [];
        let last = 0, m;
        MARK_RE.lastIndex = 0;
        while ((m = MARK_RE.exec(src))) {
            appendText(stack[stack.length - 1], src.slice(last, m.index), raw);
            last = MARK_RE.lastIndex;
            if (m[1]) {
                /* an unmatched </b> is text, not a command */
                if (open[open.length - 1] === m[2]) { open.pop(); stack.pop(); }
                else appendText(stack[stack.length - 1], m[0], raw);
            } else {
                const def = MARK_EL[m[2]];
                const e = document.createElement(def[0]);
                if (def[1]) e.className = def[1];
                stack[stack.length - 1].appendChild(e);
                stack.push(e);
                open.push(m[2]);
            }
        }
        appendText(stack[stack.length - 1], src.slice(last), raw);
    }

    function renderMathInto(el) { paintSrc(el, el.dataset.src || '', false); }

    /* The little strip next to the sub-row tabs: it wraps the selected part of
       a bullet in a mark. Bullets only - the Notizen are plain text, so the
       strip hides itself on that tab (CSS). */
    const MARK_TOOLS = [
        ['b', 'B', 'fett'],
        ['i', 'I', 'kursiv'],
        ['c1', '\u25cf', 'orange'],
        ['c2', '\u25cf', 'rot'],
        ['c3', '\u25cf', 'gruen'],
        ['', '\u2715', 'Formatierung entfernen']
    ];

    function liOf(n) {
        let e = n && n.nodeType === 1 ? n : (n ? n.parentNode : null);
        while (e && e.tagName !== 'LI') e = e.parentNode;
        return e;
    }

    /* Grow the range over every mark it already fills completely. Without this
       a second colour would nest inside the first (the old one survives just
       outside the selection) and "off" would leave its wrappers behind. */
    function growOverMarks(range, li) {
        let host = range.commonAncestorContainer;
        if (host && host.nodeType === 3) host = host.parentNode;
        while (host && host !== li && markTagOf(host)) {
            const full = document.createRange();
            full.selectNodeContents(host);
            if (range.compareBoundaryPoints(Range.START_TO_START, full) > 0 ||
                range.compareBoundaryPoints(Range.END_TO_END, full) < 0) break;
            range.selectNode(host);
            host = host.parentNode;
        }
    }

    function markSelection(ul, tag) {
        const sel = window.getSelection();
        if (!ul || !sel || !sel.rangeCount || sel.isCollapsed) return;
        const range = sel.getRangeAt(0).cloneRange();
        /* One bullet at a time: a selection across two <li> would have to be
           cut into two marks, and the wrap would tear the list apart. */
        const li = liOf(range.startContainer);
        if (!li || li !== liOf(range.endContainer) || !ul.contains(li)) return;
        growOverMarks(range, li);
        const frag = range.extractContents();
        let node;
        if (!tag) {
            node = document.createTextNode(frag.textContent);
        } else {
            const def = MARK_EL[tag];
            /* a second colour replaces the first instead of nesting in it */
            const kind = def[1] ? 'c' : tag;
            frag.querySelectorAll('*').forEach(function (e) {
                const t = markTagOf(e);
                if (!t || (MARK_EL[t][1] ? 'c' : t) !== kind) return;
                while (e.firstChild) e.parentNode.insertBefore(e.firstChild, e);
                e.remove();
            });
            node = document.createElement(def[0]);
            if (def[1]) node.className = def[1];
            node.appendChild(frag);
        }
        range.insertNode(node);
        /* A drag can put a boundary at the very end of the text before a mark,
           which makes that mark only PARTLY selected: extractContents then
           clones it into the fragment and leaves an empty shell behind. */
        li.querySelectorAll('*').forEach(function (e) {
            if (markTagOf(e) && !e.textContent) e.remove();
        });
        /* keep the text selected, so a second style can follow right away */
        sel.removeAllRanges();
        const r = document.createRange();
        r.selectNodeContents(node);
        sel.addRange(r);
    }

    function buildMarkTools(ref) {
        const box = document.createElement('span');
        box.className = 'sub-tools';
        MARK_TOOLS.forEach(function (t) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'sub-tool' + (t[0] ? ' tool-' + t[0] : ' tool-off');
            b.textContent = t[1];
            b.title = t[2];
            /* the button must not steal the selection it is about to format */
            b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
            b.addEventListener('click', function (ev) {
                ev.stopPropagation();
                markSelection(ref.ul, t[0]);
            });
            box.appendChild(b);
        });
        return box;
    }

    /* Auch ausserhalb des Plans steht Mathematik im Text - das Neuigkeiten-Band
       setzt seine Formeln damit genauso wie eine Planzeile (Doc, 20.09.2026:
       "alles was Math ist bitte LaTeX"). Eine Quelle fuer beide. */
    window.svpMath = { append: appendText, ensure: ensureKatex };

    function ensureKatex() {
        if (window.katex || document.getElementById('katex-js')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = KATEX + '.css';
        document.head.appendChild(link);
        const s = document.createElement('script');
        s.id = 'katex-js';
        s.src = KATEX + '.js';
        s.onload = () => {
            if (document.body.classList.contains('editing')) return;
            mathEls.forEach(el => { if (el.isConnected) renderMathInto(el); });
        };
        document.head.appendChild(s);
    }

    // While the print export is being built its cells are transient: they must
    // not be tracked for re-render and must not kick off a KaTeX load, which
    // would stall the print dialog on a network request.
    P.building = false;

    // Sets text that may contain $...$ math; keeps the raw source in data-src.
    /* The Woche column reads better (and much narrower) on two lines:
       "17.–21." / "08.26", and for a range across months "31.08.–" / "04.09.26".
       The break is a <br>, so textContent still yields the original string and
       saving the cell is unaffected. */
    /* Der Monat gehoert in BEIDE Haelften (Doc, 09.09.2026: "manchmal fehlt
       09."). In den Plandateien steht die deutsche Kurzform "14.–18.09.26",
       sobald beide Tage im selben Monat liegen - ueber einen Monatswechsel
       hinweg steht er ohnehin zweimal da ("28.09.–02.10.26"), und genau dieser
       Wechsel sah aus wie zwei verschiedene Schreibweisen. Ausgeschrieben wird
       erst beim Anzeigen: die Plandateien bleiben, wie sie sind. */
    function datumLang(t) {
        const m = t.match(/^(\d{1,2})\.[\u2013-](\d{1,2})\.(\d{1,2})\.(\d{2})$/);
        return m ? m[1] + '.' + m[3] + '.\u2013' + m[2] + '.' + m[3] + '.' + m[4] : t;
    }

    function setDateText(el, text) {
        const roh = String(text == null ? '' : text).trim();
        /* Gespeichert wird der rohe Text, nicht der ausgeschriebene - sonst
           schriebe das erste Speichern die lange Form in die Overrides und in
           die Cloud, und die Plandateien waeren nicht mehr die Quelle. */
        el.dataset.src = roh;
        const t = datumLang(roh);
        el.textContent = '';
        const m = t.match(/^(\d{1,2}\.[–-]\d{1,2}\.)(\d{1,2}\.\d{2})$/)
            || t.match(/^(\d{1,2}\.\d{1,2}\.[–-])(\d{1,2}\.\d{1,2}\.\d{2})$/);
        /* Was kein Datum ist, darf umbrechen. Sonst zwingt ein einziger langer
           Text die GANZE Spalte auf seine Breite - "→ nächstes Schuljahr" in
           der verschobenen Zeile machte aus 77px gut das Doppelte, und jede
           Woche darüber bekam die Lücke ab (Doc, 31.08.2026). */
        el.classList.toggle('date-wrap', !m);
        if (!m) { el.textContent = t; return; }
        el.appendChild(document.createTextNode(m[1]));
        el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(m[2]));
    }

    function setMathText(el, text) {
        text = text == null ? '' : String(text);
        el.dataset.src = text;
        if (text.includes('$')) {
            if (!P.building) { mathEls.add(el); ensureKatex(); }
        } else {
            mathEls.delete(el);
        }
        renderMathInto(el);
    }

    function buildDetailList(ul, items) {
        ul.textContent = '';
        for (const item of items) {
            const li = document.createElement('li');
            setMathText(li, item);
            ul.appendChild(li);
        }
    }

    /* Notes are plain multi-line text. Reading uses innerText so the line
       breaks the browser put into the contenteditable div survive; writing
       goes through textContent, the CSS keeps the whitespace. */
    function notesTextOf(el) {
        return String(el.innerText || '').replace(/\u00a0/g, ' ').replace(/\s+$/, '');
    }
    function setNotesText(el, text) { el.textContent = text || ''; }
});
