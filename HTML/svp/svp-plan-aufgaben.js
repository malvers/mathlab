// Stoffverteilungsplan renderer, part "aufgaben": week quiz, "Aufgaben" menu, red test button and its list.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        quizSource, buildQuizBtn, buildAufgabenCell, fillAufgabenPane, watchRedBtn,
        closeRedList, placeRedList, buildRedList
    });

    // --- Material quick-add (per week row, owner only) -------------------
    // A small + button in each material cell opens an inline input to paste
    // "Label https://..."; links can also be dragged onto the cell. Both are
    // wired only when the owner session exists — visitors just see pills.
    const CAN_EDIT_MAT = P.CAN_EDIT_MAT = !!(window.svpAuth && svpAuth.hasSession());

    // --- Exercise button per week (global, data driven) ------------------
    // A week row may carry quiz: { href, text, label } (or just a URL string).
    // Every plan gets the button for free; it only shows up where the plan
    // HTML names an exercise set, so untouched weeks look exactly as before.
    /* An override may carry its own quiz - also null, meaning "no exercises in
       this week". Only a missing key falls back to the page's own PLAN. */
    function quizSource(ov, row) {
        return Object.prototype.hasOwnProperty.call(ov || {}, 'quiz') ? { quiz: ov.quiz } : row;
    }

    function buildQuizBtn(row) {
        const q = row && row.quiz;
        if (!q) return null;
        const href = typeof q === 'string' ? q : q.href;
        if (!href) return null;
        const note = typeof q === 'string' ? '' : (q.text || '');
        const wrap = document.createElement('span');
        wrap.className = 'quiz-cell';
        const a = document.createElement('a');
        a.className = 'quiz-btn';
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = (typeof q === 'string' ? '' : q.label) || 'Aufgaben';
        a.title = note || 'Aufgaben zum Thema dieser Woche';
        /* the week row toggles on click - the button must not unfold it */
        a.addEventListener('click', function (e) { e.stopPropagation(); });
        wrap.appendChild(a);
        if (note) {
            const txt = document.createElement('span');
            txt.className = 'quiz-note';
            txt.textContent = note;
            wrap.appendChild(txt);
        }
        return wrap;
    }

    // --- "Aufgaben" pill: quiz set + Textaufgaben sheet in one dropdown ----
    // One pill in the material column that opens a menu with the week's
    // exercise set ("20 Aufgaben", from row.quiz) and every Textaufgaben sheet
    // from the material (URL under /aufgaben/). ALWAYS the dropdown, even with
    // the quiz alone - one look in every week and every plan, Mathe and
    // Informatik alike (Doc, 07.09.2026: "das soll immer so sein").
    // The menu is position:fixed: the table-wrap scrolls sideways
    // (overflow-x:auto) and would clip an absolute menu on the last rows.
    let aufgDropWired = false;
    function closeAufgDrops() {
        document.querySelectorAll('.aufg-drop.open').forEach(function (d) {
            d.classList.remove('open');
            const pill = d.querySelector('a.quiz-btn');
            if (pill) pill.setAttribute('aria-expanded', 'false');
        });
    }
    /* Scrolling does NOT close the menu: the browser may scroll the pill into
       view right after the click, and that scroll event arrives after the menu
       opened (measured 04.09.2026 on the Vortraege menu). The menu follows the
       pill instead, which also covers the sideways scroll of the table-wrap. */
    function placeAufgDrops() {
        document.querySelectorAll('.aufg-drop.open').forEach(function (d) { if (d._place) d._place(); });
    }
    function wireAufgDrops() {
        if (aufgDropWired) return;
        aufgDropWired = true;
        document.addEventListener('click', closeAufgDrops);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAufgDrops(); });
        window.addEventListener('scroll', placeAufgDrops, true);
        window.addEventListener('resize', placeAufgDrops);
    }
    function aufgLink(item) {
        const a = document.createElement('a');
        a.className = 'quiz-btn';
        a.href = P.siteHref(item.href);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = item.label;
        a.title = item.title || '';
        a.addEventListener('click', function (e) { e.stopPropagation(); closeAufgDrops(); });
        return a;
    }
    function buildAufgabenCell(ref, ex) {
        const q = ref.quizBtn ? ref.quizBtn.querySelector('a.quiz-btn') : null;
        if (!q && !ex.length) return null;
        const items = [];
        if (q) items.push({ label: q.textContent, href: q.getAttribute('href'), title: q.title });
        ex.forEach(function (en) {
            items.push({ label: en.label || 'Textaufgaben', href: en.url,
                         title: en.desc || 'Textaufgaben zum Thema dieser Woche', url: en.url });
        });
        const cell = document.createElement('span');
        cell.className = 'quiz-cell';

        wireAufgDrops();
        const wrap = document.createElement('span');
        wrap.className = 'badge-drop aufg-drop';
        const pill = document.createElement('a');
        pill.className = 'quiz-btn';
        pill.href = '#';
        pill.setAttribute('role', 'button');
        pill.setAttribute('aria-haspopup', 'true');
        pill.setAttribute('aria-expanded', 'false');
        pill.textContent = 'Aufgaben \u25BE';
        pill.title = items.length + ' Aufgabensätze zum Thema dieser Woche';
        const menu = document.createElement('div');
        menu.className = 'drop-menu';
        /* Doc, 09.09.2026: "rechtsbuendig" - das Menue haengt mit seiner RECHTEN
           Kante an der rechten Kante der Pille, nicht mit der linken an der
           linken: es steht am rechten Rand der Tabelle und lief sonst ueber die
           Themenspalte. position:fixed, also zaehlt right vom Fensterrand. */
        wrap._place = function () {
            const r = pill.getBoundingClientRect();
            menu.style.left = 'auto';
            /* clientWidth, nicht innerWidth: innerWidth zaehlt die Scrollleiste
               mit, das Menue haenge sonst um deren Breite daneben (gemessen). */
            menu.style.right =
                Math.round(document.documentElement.clientWidth - r.right) + 'px';
            menu.style.top = Math.round(r.bottom + 6) + 'px';
        };
        pill.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const wasOpen = wrap.classList.contains('open');
            closeAufgDrops();
            if (wasOpen) return;
            wrap._place();
            wrap.classList.add('open');
            pill.setAttribute('aria-expanded', 'true');
        });
        menu.addEventListener('click', function (e) { e.stopPropagation(); });
        items.forEach(function (item) {
            const a = aufgLink(item);
            /* Owner: the sheet entries carry the same ✕ as every material pill. */
            if (item.url && ref && CAN_EDIT_MAT) {
                const w = document.createElement('span');
                w.className = 'mat-pill-wrap';
                const x = document.createElement('button');
                x.type = 'button';
                x.className = 'mat-x';
                x.textContent = '✕';
                x.title = 'Aus dieser Woche entfernen';
                x.setAttribute('aria-label', 'Entfernen: ' + item.label);
                x.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    P.removeMatEntry(ref, item.url);
                });
                w.appendChild(a);
                w.appendChild(x);
                menu.appendChild(w);
                return;
            }
            menu.appendChild(a);
        });
        wrap.appendChild(pill);
        wrap.appendChild(menu);
        cell.appendChild(wrap);
        /* the caption behind the old button (row.quiz.text) stays behind the pill */
        const note = ref.quizBtn ? ref.quizBtn.querySelector('.quiz-note') : null;
        if (note) cell.appendChild(note.cloneNode(true));
        return cell;
    }

    // --- "Aufgaben" tab in the unfolded week -----------------------------
    // Doc, 20.09.2026: the same exercises the pill offers also live in their
    // own tab next to Zusatzmaterial and Videos. Same source, one place: the
    // week quiz (row.quiz) plus every exercise sheet from the material line.
    // Returns how many there are - that is the count behind the tab name.
    function quizPill(q) {
        /* Inside the pane the quiz stands next to the material pills, so it
           wears the same pill - a quiz-btn there would look like a second
           kind of thing. */
        const a = document.createElement('a');
        a.className = 'badge b-green mat-pill';
        a.href = q.getAttribute('href');
        a.target = '_blank';
        a.rel = 'noopener';
        a.title = q.title || 'Aufgaben zum Thema dieser Woche';
        a.appendChild(P.matIconEl(a.href, q.textContent));
        a.appendChild(P.matLabelEl(q.textContent));
        /* the week row toggles on click - the pill must not fold it */
        a.addEventListener('click', function (e) { e.stopPropagation(); });
        return a;
    }
    function fillAufgabenPane(ref, text, ex) {
        const q = ref && ref.quizBtn ? ref.quizBtn.querySelector('a.quiz-btn') : null;
        const n = (ex ? ex.length : 0) + (q ? 1 : 0);
        const panes = ref && ref.rPanes;
        if (!panes || !panes.aufgaben) return n;   /* week not unfolded yet */
        if (!ref.aufgBlock) {
            /* built here, not in the row part: the sub-row can come into
               being before or after updateMaterial, and both ways lead here */
            ref.aufgBlock = document.createElement('div');
            ref.aufgBlock.className = 'mat-block';
        }
        /* renderMaterial drops the raw line into the block when nothing
           parses - in this pane that would print the whole material text of
           the week, so a week without sheets is emptied by hand. */
        if (ex && ex.length) {
            P.renderMaterial(ref.aufgBlock, text, ref, function (en) { return !P.isExerciseEntry(en); });
        } else {
            ref.aufgBlock.textContent = '';
            ref.aufgBlock.dataset.src = text == null ? '' : String(text).trim();
        }
        /* the week's own exercise set first, the sheets behind it - the same
           order the pill menu uses */
        if (q) ref.aufgBlock.insertBefore(quizPill(q), ref.aufgBlock.firstChild);
        if (!ref.aufgBlock.parentNode) panes.aufgaben.pane.appendChild(ref.aufgBlock);
        return n;
    }

    /* Doc, 18.09.2026: "zwischen Text und Aufgaben zentriert in x" - the red
       button (row.redBtn) floats out of the flow, centered in the gap between
       the end of the topic text and whatever follows it in the cell: since the
       Aufgaben pill left the row (20.09.2026) that is the material clip, or the
       right edge of the cell in a week without material. If the gap is too
       narrow (phone), it falls back into the flow. Re-placed when a column
       changes width, on resize and once the fonts have loaded. */
    const redBtnRefs = new Set();
    let redBtnRO = null;
    function placeRedBtns() {
        redBtnRefs.forEach(function (ref) {
            const rb = ref.redBtnEl;
            if (!rb || !rb.isConnected) { redBtnRefs.delete(ref); return; }
            /* measure with the button out of the flow: the pill then sits where
               it stays once the button floats */
            rb.classList.add('floating');
            rb.style.transform = '';   /* measure the plain static position */
            const td = ref.matTd.getBoundingClientRect();
            /* .topic-text is a block as wide as the cell (line clamp) - the
               text itself ends where its Range ends, clipped to the cell */
            const rg = document.createRange();
            rg.selectNodeContents(ref.topicSpan);
            const textR = Math.min(rg.getBoundingClientRect().right,
                                   ref.topicSpan.getBoundingClientRect().right);
            const next = rb.nextElementSibling;
            const endL = next ? next.getBoundingClientRect().left
                              : td.right - parseFloat(getComputedStyle(ref.matTd).paddingRight);
            const w = rb.offsetWidth;
            if (!td.width || endL - textR < w + 24) {
                rb.classList.remove('floating');
                return;
            }
            /* The cell is not positioned (see svp.css), so the button keeps its
               static position and the transform carries it from there - it
               follows its row whenever a week above opens or closes. */
            const at = rb.getBoundingClientRect();
            const dx = Math.round((textR + endL) / 2 - w / 2 - at.left);
            /* same vertical middle as the pill */
            let dy = 0;
            if (next) {
                const nb = next.getBoundingClientRect();
                dy = nb.top + nb.height / 2 - at.height / 2 - at.top;
            }
            rb.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        });
    }
    function watchRedBtn(ref) {
        if (!redBtnRO) {
            redBtnRO = new ResizeObserver(placeRedBtns);
            window.addEventListener('resize', placeRedBtns);
            if (document.fonts) document.fonts.ready.then(placeRedBtns);
        }
        redBtnRefs.add(ref);
        /* the topic cell changes width whenever the columns rebalance */
        redBtnRO.observe(ref.topicSpan.parentNode);
        requestAnimationFrame(placeRedBtns);
    }

    /* Doc, 18.09.2026: "eine Liste von 30 Punkten unter den butt ... gib mir
       ein x" - row.redBtn = { label, title, items } opens a numbered list under
       the button, closed by its ✕, Escape or a click outside. The panel hangs
       on <body> with position:fixed (the table-wrap scrolls sideways and would
       clip it) and follows the button while the page scrolls. Items may carry
       $...$ formulas (KaTeX via setMathText). */
    P.redListOpen = null;          /* { panel, btn } of the open list */
    let redListWired = false;
    function closeRedList() {
        if (!P.redListOpen) return;
        P.redListOpen.panel.hidden = true;
        P.redListOpen.btn.setAttribute('aria-expanded', 'false');
        P.redListOpen = null;
    }
    function placeRedList() {
        if (!P.redListOpen) return;
        const p = P.redListOpen.panel, btn = P.redListOpen.btn;
        if (!btn.isConnected) { closeRedList(); return; }   /* row was re-rendered */
        const r = btn.getBoundingClientRect();
        const vw = document.documentElement.clientWidth, vh = window.innerHeight;
        const w = p.offsetWidth;
        p.style.left = Math.round(Math.max(16, Math.min(r.left + r.width / 2 - w / 2, vw - w - 16))) + 'px';
        /* under the button; only when there is clearly more room above, over it */
        const below = vh - r.bottom - 22, above = r.top - 22;
        if (below >= 280 || below >= above) {
            p.style.top = Math.round(r.bottom + 6) + 'px';
            p.style.bottom = 'auto';
            p.style.maxHeight = Math.round(Math.max(160, below)) + 'px';
        } else {
            p.style.top = 'auto';
            p.style.bottom = Math.round(vh - r.top + 6) + 'px';
            p.style.maxHeight = Math.round(above) + 'px';
        }
    }
    function buildRedList(title, items) {
        if (!redListWired) {
            redListWired = true;
            document.addEventListener('click', closeRedList);
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeRedList(); });
            window.addEventListener('scroll', placeRedList, true);
            window.addEventListener('resize', placeRedList);
        }
        const panel = document.createElement('div');
        panel.className = 'red-list';
        panel.hidden = true;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', title);
        const head = document.createElement('div');
        head.className = 'red-list-head';
        const h = document.createElement('span');
        h.textContent = title;
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'red-list-x';
        x.textContent = '\u2715';
        x.title = 'Schließen';
        x.setAttribute('aria-label', 'Schließen');
        x.addEventListener('click', closeRedList);
        head.append(h, x);
        /* an item is a string or { q, a }: the answer folds out under the
           question (Doc, 18.09.2026: "aufklappbar drunter die Loesungen") */
        const ol = document.createElement('ol');
        items.forEach(function (it) {
            const li = document.createElement('li');
            const q = document.createElement('div');
            P.setMathText(q, typeof it === 'string' ? it : it.q);
            li.appendChild(q);
            if (it && it.a) {
                const sol = document.createElement('details');
                sol.className = 'red-list-sol';
                const sum = document.createElement('summary');
                sum.textContent = 'Lösung';
                const ans = document.createElement('div');
                P.setMathText(ans, it.a);
                sol.append(sum, ans);
                li.appendChild(sol);
            }
            ol.appendChild(li);
        });
        panel.append(head, ol);
        /* clicks inside must not reach the document (closes) or the row (folds) */
        panel.addEventListener('click', function (e) { e.stopPropagation(); });
        document.body.appendChild(panel);
        return panel;
    }
});
