// Shared renderer for the Stoffverteilungsplan pages.
// Each page defines window.PLAN (array of week rows / holiday rows)
// and window.BADGE (type -> [cssClass, label]) before including this script.
// Week rows may carry details: ['bullet', ...] — rendered as an expandable sub-row.
// Edit mode (togglePlanEdit): cells become contenteditable; changes are saved
// to localStorage per page and re-applied on load. resetPlanEdits() clears them.
(function () {
    const tbody = document.querySelector('#plan-table tbody');
    if (!tbody || !window.PLAN || !window.BADGE) return;

    // Badge pills deep-link into the Lehrplan PDF (#page=N) when the page
    // provides LB_INFO with a page number for that type (rows + legend).
    function lbPdfLink(key) {
        const info = window.LB_INFO && window.LB_INFO[key];
        return (info && info.page && window.LB_INFO.pdf)
            ? window.LB_INFO.pdf + '#page=' + info.page : null;
    }

    function linkBadge(el, key) {
        const href = lbPdfLink(key);
        if (!href) return;
        el.classList.add('badge-link');
        el.title = 'Lehrplan (PDF) an dieser Stelle öffnen';
        el.addEventListener('click', function (e) {
            e.stopPropagation(); // keep the row's detail toggle untouched
            window.open(href, '_blank');
        });
    }

    // Material column (links to OneDrive slides etc.) is injected centrally
    // so the per-page table headers stay untouched.
    /* Die Werkzeugleiste gehoert direkt unter den Kopf, nicht zwischen die
       Lernbereich-Karten und die Tabelle — zentral umgehaengt, damit keine
       Plan-Seite angefasst werden muss. */
    (function liftToolbar() {
        const bar = document.querySelector('.toolbar');
        const cards = document.querySelector('.meta-cards');
        if (bar && cards && cards.parentNode) cards.parentNode.insertBefore(bar, cards);
    })();

    /* Kopf und Werkzeugleiste bleiben beim Scrollen stehen, der Plan (Karten
       plus Tabelle) zieht darunter weg. Zentral verpackt — keine Plan-Seite
       muss dafuer angefasst werden. */
    (function stickHead() {
        const head = document.querySelector('header.page-head');
        if (!head || !head.parentNode) return;
        const bar2 = document.querySelector('.toolbar');
        const box = document.createElement('div');
        box.className = 'plan-sticky';
        head.parentNode.insertBefore(box, head);
        box.appendChild(head);
        if (bar2) box.appendChild(bar2);

        /* The table head sticks right below the bar, so it needs its height. */
        const sync = function () {
            document.documentElement.style.setProperty('--sticky-h', box.offsetHeight + 'px');
        };
        const mark = function () {
            box.classList.toggle('stuck', box.getBoundingClientRect().top <= 1);
        };
        sync(); mark();
        if (window.ResizeObserver) new ResizeObserver(sync).observe(box);
        window.addEventListener('resize', function () { sync(); mark(); });
        window.addEventListener('scroll', mark, { passive: true });
    })();

    const headRow = document.querySelector('#plan-table thead tr');
    if (headRow) {
        const matTh = document.createElement('th');
        matTh.textContent = 'Zusatzmaterial';
        headRow.appendChild(matTh);
        /* Leading column for the shift arrows — empty header, only visible
           while the shift mode is on (see setShiftMode). */
        const shTh = document.createElement('th');
        shTh.className = 'shift-col';
        headRow.insertBefore(shTh, headRow.firstChild);
        /* tag the Woche header so its column can shrink with its cells */
        [...headRow.children].forEach(function (th) {
            const t = th.textContent.trim();
            if (t === 'Woche') th.classList.add('date-col');
            if (t === 'Bemerkungen') th.classList.add('remark-col');
            if (/^Ustd/.test(t)) th.classList.add('ustd-col');
            if (/^Thema/.test(t)) th.classList.add('topic-col');
        });
    }

    // Renders the raw material text ("Label https://... Label2 https://...")
    // as compact link pills; text without any URL shows as a plain note.
    // The raw source is kept in data-src for edit mode.
    // File-type icon for a material pill; SharePoint share links carry the
    // app in the path (/:p:/ = PowerPoint, /:w:/ = Word, /:x:/ = Excel,
    // /:b:/ = PDF), otherwise the label/extension decides.
    function matKind(url, label) {
        const l = ((label || '') + ' ' + url).toLowerCase();
        if (url.indexOf('/:p:/') >= 0 || l.indexOf('ppt') >= 0) return 'ppt';
        if (url.indexOf('/:w:/') >= 0 || l.indexOf('.doc') >= 0) return 'doc';
        if (url.indexOf('/:x:/') >= 0 || l.indexOf('.xls') >= 0) return 'xls';
        if (url.indexOf('/:b:/') >= 0 || l.indexOf('pdf') >= 0) return 'pdf';
        if (/youtu\.be\/|youtube\.com\//i.test(url)) return 'yt';
        return 'link';
    }

    // App icons instead of emoji: emoji look different on every device and
    // grey out inside the pill. These are the macOS app icons the kids see on
    // their own machines — extracted from the installed apps into svp/icons/,
    // referenced only, never altered. The base is derived from this script's
    // own URL, so sub-folders (mathe/, informatik/, …) work too.
    const ICON_BASE = (function () {
        const src = (document.currentScript && document.currentScript.src) ||
            (function () {
                const list = document.getElementsByTagName('script');
                for (let i = list.length - 1; i >= 0; i--)
                    if (/svp-plan\.js/.test(list[i].src)) return list[i].src;
                return '';
            })();
        return src ? new URL('icons/', src).href : 'icons/';
    })();

    const YT_PATH = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 ' +
        '3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 ' +
        '5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 ' +
        '3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 ' +
        '12l-6.273 3.568z';

    // Plain link: drawn, not typed — the \u2197 character sits too high in its
    // line in most fonts, an SVG is centred by construction.
    const LINK_PATH = 'M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5v2H7v10h10v-3h2v5H5V5z';

    function drawnIcon(cls, d, fill) {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', 'mat-ico ' + cls);
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', fill);
        svg.appendChild(path);
        return svg;
    }

    function matLabelEl(text) {
        const span = document.createElement('span');
        span.className = 'mat-label';
        span.textContent = text;
        return span;
    }

    function matIconEl(url, label) {
        const kind = matKind(url, label);
        /* no Mac app to take these from — brand/plain glyphs instead */
        if (kind === 'yt') return drawnIcon('mat-ico-drawn', YT_PATH, 'rgb(255, 0, 0)');
        if (kind === 'link') return drawnIcon('mat-ico-drawn', LINK_PATH, 'rgb(120, 160, 220)');
        const img = document.createElement('img');
        img.className = 'mat-ico';
        img.src = ICON_BASE + kind + '.png';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        return img;
    }

    // Default pill label when none was typed: derived from the link type.
    function matDefaultLabel(url) {
        const l = url.toLowerCase();
        if (url.indexOf('/:p:/') >= 0 || l.indexOf('ppt') >= 0) return 'PPT';
        if (url.indexOf('/:w:/') >= 0 || l.indexOf('.doc') >= 0) return 'Doc';
        if (url.indexOf('/:x:/') >= 0 || l.indexOf('.xls') >= 0) return 'Excel';
        if (url.indexOf('/:b:/') >= 0 || l.indexOf('pdf') >= 0) return 'PDF';
        if (matKind(url, '') === 'yt') return 'Video';
        return 'Link';
    }

    // PowerPoint share links open as slideshow, not in the edit view:
    // Office for the web starts the deck (with animations) on &action=embedview.
    function matHref(url) {
        const isPpt = url.indexOf('/:p:/') >= 0 || /\.pptx?(\?|#|$)/i.test(url);
        if (!isPpt || /[?&]action=/.test(url)) return url;
        return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'action=embedview';
    }

    // A browser popup always keeps its address bar (anti-phishing, cannot be
    // switched off), so Office material is shown in an in-page viewer instead
    // — no window chrome at all. Kept as the fallback for everything the
    // viewer cannot frame, and behind the ↗ button of the viewer itself.
    function openMatWindow(url) {
        const w = Math.min(1280, Math.round(screen.availWidth * 0.8));
        const h = Math.min(820, Math.round(screen.availHeight * 0.85));
        const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - w) / 2));
        const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - h) / 2));
        const feat = 'popup=yes,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top +
            ',resizable=yes,scrollbars=yes';
        const win = window.open(matHref(url), 'svp-material', feat);
        if (win) { try { win.opener = null; } catch (e) { /* cross-origin: fine */ } win.focus(); }
    }

    // Only SharePoint/Office links are framed: they are made for it
    // (action=embedview is OneDrive's own embed code). Foreign links — YouTube
    // and friends — refuse to be framed, so they keep their own window.
    function matEmbeddable(url) {
        return /\/:[pwxbf]:\//.test(url) || /sharepoint\.com|officeapps\.live\.com/i.test(url);
    }

    let matView = null;
    function closeMatView() {
        if (!matView) return;
        matView.remove();
        matView = null;
        document.removeEventListener('keydown', matViewKey, true);
    }
    function matViewKey(e) { if (e.key === 'Escape') closeMatView(); }

    function openMatView(url, label) {
        closeMatView();
        const wrap = document.createElement('div');
        wrap.className = 'mat-view-wrap';
        const box = document.createElement('div');
        box.className = 'mat-view';

        const head = document.createElement('div');
        head.className = 'mv-head';
        const title = document.createElement('span');
        title.className = 'mv-title';
        title.appendChild(matIconEl(url, label || ''));
        title.appendChild(matLabelEl(label || matDefaultLabel(url)));
        head.appendChild(title);

        const tools = document.createElement('span');
        tools.className = 'mv-tools';
        [['\u2197', 'In eigenem Fenster öffnen', function () { closeMatView(); openMatWindow(url); }],
         ['\u2715', 'Schließen (Esc)', closeMatView]
        ].forEach(function (def) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'mv-btn';
            b.textContent = def[0];
            b.title = def[1];
            b.setAttribute('aria-label', def[1]);
            b.addEventListener('click', def[2]);
            tools.appendChild(b);
        });
        head.appendChild(tools);
        box.appendChild(head);

        const frame = document.createElement('iframe');
        frame.className = 'mv-frame';
        frame.src = matHref(url);
        frame.title = label || matDefaultLabel(url);
        frame.setAttribute('allowfullscreen', '');   /* the viewer's own \u26f6 */
        frame.setAttribute('allow', 'fullscreen');
        box.appendChild(frame);

        wrap.appendChild(box);
        /* Click on the backdrop closes, click inside does not. */
        wrap.addEventListener('click', function (e) { if (e.target === wrap) closeMatView(); });
        document.body.appendChild(wrap);
        document.addEventListener('keydown', matViewKey, true);
        matView = wrap;
    }

    // YouTube runs in the shared player the labs use — same frame-over-the-page
    // feeling as the material viewer, loaded on demand (js/video-lightbox.js,
    // one folder up from the svp root).
    function openVideo(url, label) {
        const play = function () {
            if (window.VideoLightbox) window.VideoLightbox.open(url, { title: label || 'Video' });
            else openMatWindow(url);                 /* loading failed: plain window */
        };
        if (window.VideoLightbox) { play(); return; }
        const me = document.currentScript ||
            Array.prototype.slice.call(document.getElementsByTagName('script'))
                .filter(function (t) { return /svp-plan\.js/.test(t.src); }).pop();
        const sc = document.createElement('script');
        sc.src = new URL('../js/video-lightbox.js', (me && me.src) || location.href).href;
        sc.onload = play;
        sc.onerror = function () { openMatWindow(url); };
        document.head.appendChild(sc);
    }

    function openMat(url, label) {
        if (matKind(url, label) === 'yt') openVideo(url, label);
        else if (matEmbeddable(url)) openMatView(url, label);
        else openMatWindow(url);
    }

    function renderMaterial(el, text, ref) {
        text = text == null ? '' : String(text).trim();
        el.dataset.src = text;
        el.textContent = '';
        const entries = parseMat(text);
        if (!entries.length) { el.textContent = text; return; }
        entries.forEach(function (en) {
            const label = en.label;
            const a = document.createElement('a');
            a.className = 'badge b-green mat-pill';
            a.href = en.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.appendChild(matIconEl(en.url, label));
            a.appendChild(matLabelEl(label || matDefaultLabel(en.url)));
            /* Plain left click: own window. Cmd-/middle click keeps the
               browser's own behaviour (new tab with the untouched URL). */
            a.addEventListener('click', function (e) {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                openMat(en.url, label);
            });
            if (en.desc) wireMatTip(a, en.desc); /* pretty tooltip, no raw URL */
            else a.title = en.url;
            /* Owner: every pill carries its own ✕. Deliberately NOT tied to
               the edit mode — there the cell holds the raw text, and hunting
               a single URL in that string is no fun. */
            if (ref && CAN_EDIT_MAT) {
                const wrap = document.createElement('span');
                wrap.className = 'mat-pill-wrap';
                const url = en.url;
                const x = document.createElement('button');
                x.type = 'button';
                x.className = 'mat-x';
                x.textContent = '✕';
                x.title = 'Link entfernen';
                x.setAttribute('aria-label', 'Link entfernen: ' + (label || url));
                x.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    removeMatEntry(ref, url);
                });
                /* Single pill actions live in a context menu: right-click on
                   the desktop, long press on a tablet. Only while editing, so a
                   normal right-click still gets the browser's own menu. */
                wirePillMenu(a, ref, url, label);
                wirePillTouch(a, ref, en, true);
                wrap.appendChild(a);
                wrap.appendChild(x);
                el.appendChild(wrap);
                return;
            }
            wirePillTouch(a, null, en, false);
            el.appendChild(a);
        });
        const tail = matTail(text);
        if (tail) {
            const note = document.createElement('span');
            note.className = 'mat-note';
            note.textContent = tail;
            el.appendChild(note);
        }
    }

    // --- Description tooltip -------------------------------------------
    // The native title is tiny and would show the URL as well; this one shows
    // only the description, larger, in the panel look of the context menu.
    let matTip = null;
    function hideMatTip() {
        if (matTip) { matTip.remove(); matTip = null; }
    }
    function showMatTip(anchor, text, key) {
        hideMatTip();
        const tip = document.createElement('div');
        tip.className = 'mat-tip';
        tip.dataset.for = key || '';
        tip.textContent = text;
        document.body.appendChild(tip);
        const r = anchor.getBoundingClientRect();
        const t = tip.getBoundingClientRect();
        let left = r.left + r.width / 2 - t.width / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - t.width - 8));
        let top = r.bottom + 8;
        if (top + t.height > window.innerHeight - 8) top = r.top - t.height - 8;
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        matTip = tip;
    }
    function wireMatTip(a, text) {
        a.addEventListener('mouseenter', function () { showMatTip(a, text); });
        a.addEventListener('mouseleave', hideMatTip);
        a.addEventListener('focus', function () { showMatTip(a, text); });
        a.addEventListener('blur', hideMatTip);
    }
    window.addEventListener('scroll', hideMatTip, true);
    document.addEventListener('touchstart', function (e) {
        if (matTip && !(e.target.closest && e.target.closest('.mat-pill'))) hideMatTip();
    }, { passive: true });

    // --- Material quick-add (per week row, owner only) -------------------
    // A small + button in each material cell opens an inline input to paste
    // "Label https://..."; links can also be dragged onto the cell. Both are
    // wired only when the owner session exists — visitors just see pills.
    const CAN_EDIT_MAT = !!(window.svpAuth && svpAuth.hasSession());

    // Renders a ref's material state: pills into the sub-row block, a compact
    // Material lives in the expandable sub-row; the week row itself stays
    // clean (the ▸ chevron already shows there is something to unfold).
    function updateMaterial(ref, text) {
        text = text == null ? '' : String(text).trim();
        ref.matTd.dataset.src = text;
        renderMaterial(ref.matBlock, text, ref);
        ref.matTd.textContent = '';
        if (text) {
            if (!ref.matBlock.parentNode) ref.ensureSubRow().side.appendChild(ref.matBlock);
        } else if (ref.matBlock.parentNode) {
            ref.matBlock.remove();
        }
        decorateMatCell(ref);
    }

    // Drop a single link from a week (the ✕ inside its pill).
    function removeMatEntry(ref, url) {
        saveMaterial(ref, matToSrc(parseMat(ref.matTd.dataset.src || '')
            .filter(en => en.url !== url)));
    }

    function saveMaterial(ref, src) {
        src = (src || '').trim();
        updateMaterial(ref, src);
        if (src) ref.openSubRow();
        if (!saved[ref.i]) saved[ref.i] = {};
        if (src) saved[ref.i].material = src;
        else delete saved[ref.i].material;
        localStorage.setItem(KEY, JSON.stringify(saved));
        localStorage.setItem(TS_KEY, new Date().toISOString());
        pushRemote();
    }

    // Pretty modal (no native dialogs): add a link with optional label,
    // existing links are listed and removable via X.
    let matModal = null;
    function closeMatModal() {
        if (matModal) { matModal.remove(); matModal = null; }
    }

    // editUrl (optional): preselect that entry for editing right away.
    function openMatModal(ref, editUrl) {
        closeMatModal();
        const planRow = planRows[ref.i] || {};
        const wrap = document.createElement('div');
        wrap.className = 'mat-modal-wrap';
        const box = document.createElement('div');
        box.className = 'mat-modal';

        const title = document.createElement('div');
        title.className = 'mm-title';
        title.textContent = 'Material · Woche ' + (planRow.nr || '') + ' · ' +
            ref.dateTd.textContent.trim();
        box.appendChild(title);

        // Current entries, parsed from the raw source.
        const entries = parseMat(ref.matTd.dataset.src || '');
        function persist() { saveMaterial(ref, matToSrc(entries)); }

        // Input fields (created first — the pill list below writes into them).
        const labIn = document.createElement('input');
        labIn.type = 'text';
        labIn.placeholder = 'Label (optional, z. B. „Einstieg KI“)';
        labIn.setAttribute('aria-label', 'Label für den Link');
        const descIn = document.createElement('textarea');
        descIn.rows = 2;
        descIn.placeholder = 'Beschreibung (optional, erscheint als Tooltip)';
        descIn.setAttribute('aria-label', 'Beschreibung des Links');
        const urlIn = document.createElement('input');
        urlIn.type = 'url';
        urlIn.placeholder = 'https://… Link oder kopierte Woche einfügen';
        urlIn.setAttribute('aria-label', 'Link-Adresse');

        // Clicking a pill loads its attributes into the fields for editing
        // (it does NOT open the link); the primary button then updates it.
        let editIdx = null;
        if (entries.length) {
            const list = document.createElement('div');
            list.className = 'mm-list';
            entries.forEach(function (en, idx) {
                const item = document.createElement('div');
                item.className = 'mm-item';
                const pill = document.createElement('span');
                pill.className = 'badge b-green mat-pill';
                pill.title = en.url;
                pill.appendChild(matIconEl(en.url, en.label));
                pill.appendChild(matLabelEl(en.label || matDefaultLabel(en.url)));
                function selectForEdit() {
                    editIdx = idx;
                    labIn.value = en.label;
                    descIn.value = en.desc || '';
                    urlIn.value = en.url;
                    ok.textContent = 'Speichern';
                    list.querySelectorAll('.mm-item').forEach(el => el.classList.remove('sel'));
                    item.classList.add('sel');
                    labIn.focus();
                }
                pill.addEventListener('click', selectForEdit);
                if (editUrl && en.url === editUrl) item.dataset.preselect = '1';
                const del = document.createElement('button');
                del.type = 'button';
                del.className = 'mm-del';
                del.textContent = '✕';
                del.title = 'Link entfernen';
                del.setAttribute('aria-label', 'Link entfernen');
                del.addEventListener('click', function () {
                    entries.splice(idx, 1);
                    persist();
                    openMatModal(ref); /* rebuild with fresh list */
                });
                item.appendChild(pill);
                item.appendChild(del);
                list.appendChild(item);
            });
            box.appendChild(list);
        }
        box.appendChild(labIn);
        box.appendChild(descIn);
        box.appendChild(urlIn);

        const btns = document.createElement('div');
        btns.className = 'mm-btns';
        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'mm-btn';
        cancel.textContent = 'Abbrechen';
        cancel.addEventListener('click', closeMatModal);
        const ok = document.createElement('button');
        ok.type = 'button';
        ok.className = 'mm-btn primary';
        ok.textContent = 'Hinzufügen';
        function add() {
            /* A whole copied week can be dropped in here at once — that is the
               way across browsers/devices, where localStorage does not reach:
               "Label https://a Label2 https://b" */
            const multi = parseMat(urlIn.value);
            if (multi.length > 1 && editIdx == null) {
                const seen = new Set(entries.map(en => en.url));
                multi.forEach(function (en) {
                    if (seen.has(en.url)) return;
                    seen.add(en.url);
                    entries.push(en);
                });
                persist();
                closeMatModal();
                return;
            }
            let url = urlIn.value.trim();
            // Bare domains ("docalvers.de/…") get https:// prepended — the
            // stored format needs the scheme (entries are split on it).
            if (url && !/^https?:\/\//i.test(url) && /^[\w-]+(\.[\w-]+)+([/?#]|$)/.test(url))
                url = 'https://' + url;
            if (!/^https?:\/\//.test(url)) {
                urlIn.classList.add('bad');
                urlIn.focus();
                return;
            }
            const en = { label: labIn.value.trim(), url: url, desc: descIn.value.trim() };
            if (editIdx != null) entries[editIdx] = en; /* update selected */
            else entries.push(en);
            persist();
            closeMatModal();
        }
        ok.addEventListener('click', add);
        btns.appendChild(cancel);
        btns.appendChild(ok);
        box.appendChild(btns);

        wrap.addEventListener('click', function (e) {
            if (e.target === wrap) closeMatModal();
        });
        wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMatModal();
            if (e.key === 'Enter' && e.target !== descIn) add(); /* textarea keeps Enter */
        });
        wrap.appendChild(box);
        document.body.appendChild(wrap);
        matModal = wrap;
        urlIn.focus();
        const pre = wrap.querySelector('.mm-item[data-preselect] .mat-pill');
        if (pre) pre.click(); /* after mount, so focus() lands in the DOM */
    }

    // --- Material clipboard (per week, across plans) ---------------------
    // Copy takes the whole material of one week; paste puts it into another
    // week — also in a different Jahrgangsstufe, because the clipboard lives
    // in localStorage and every plan page shares the same origin.
    const CLIP_KEY = 'svp-mat-clip';
    const matRefs = [];

    function planLabel() {
        const h1 = document.querySelector('h1');
        return (h1 ? h1.textContent : document.title).replace(/\s+/g, ' ').trim();
    }

    // "Label https://a «Beschreibung» Label2 https://b" <-> [{label, url, desc}, ...]
    // The description follows its URL in guillemets, so old plans without
    // one still parse and the raw text stays readable in mails and notes.
    const DESC_RE = /^\s*«([^»]*)»\s*/;
    function parseMat(src) {
        const out = [];
        const parts = (src || '').split(/(https?:\/\/[^\s]+)/);
        for (let k = 1; k < parts.length; k += 2) {
            let pre = parts[k - 1];
            const m = pre.match(DESC_RE);
            if (m && out.length) { out[out.length - 1].desc = m[1].trim(); pre = pre.slice(m[0].length); }
            out.push({
                label: pre.replace(/[\s|:,;·–-]+$/, '').trim(),
                url: parts[k],
                desc: ''
            });
        }
        const tail = parts.length > 1 ? parts[parts.length - 1].match(DESC_RE) : null;
        if (tail && out.length) out[out.length - 1].desc = tail[1].trim();
        return out;
    }

    // Free text after the last link (kept as a muted note behind the pills).
    function matTail(src) {
        const parts = (src || '').split(/(https?:\/\/[^\s]+)/);
        if (parts.length === 1) return '';
        return parts[parts.length - 1].replace(DESC_RE, '').trim();
    }

    function matToSrc(entries) {
        return entries.map(en => (en.label ? en.label + ' ' : '') + en.url +
            (en.desc ? ' «' + en.desc.replace(/[«»]/g, '') + '»' : '')).join(' ');
    }

    function readClip() {
        try {
            const clip = JSON.parse(localStorage.getItem(CLIP_KEY) || 'null');
            return clip && clip.src ? clip : null;
        } catch (e) { return null; }
    }

    // short visual confirmation right on the button
    function flashBtn(btn, text) {
        const old = btn.textContent;
        btn.textContent = text;
        btn.classList.add('done');
        setTimeout(function () {
            btn.textContent = old;
            btn.classList.remove('done');
        }, 900);
    }

    function copyMaterial(ref, btn) {
        const src = (ref.matTd.dataset.src || '').trim();
        if (!src) return;
        const planRow = planRows[ref.i] || {};
        localStorage.setItem(CLIP_KEY, JSON.stringify({
            src: src,
            from: planLabel() + ' · Woche ' + (planRow.nr || (ref.i + 1)),
            n: parseMat(src).length,
            ts: new Date().toISOString()
        }));
        /* second copy into the system clipboard: from there it can go into a
           mail, a note or — via the + dialog — into another browser */
        if (navigator.clipboard) navigator.clipboard.writeText(src).catch(function () {});
        flashBtn(btn, '✓');
        refreshMatButtons();
    }

    // --- Per-pill menu ---------------------------------------------------
    // The week-level 📋 copies everything at once; this copies one link, so it
    // can travel into another week (or another plan) on its own.
    function copyOneMat(ref, url, label) {
        const en = parseMat(ref.matTd.dataset.src || '').find(e => e.url === url)
            || { label: label, url: url, desc: '' };
        const src = matToSrc([en]);
        const planRow = planRows[ref.i] || {};
        localStorage.setItem(CLIP_KEY, JSON.stringify({
            src: src,
            from: planLabel() + ' · Woche ' + (planRow.nr || (ref.i + 1)),
            n: 1,
            ts: new Date().toISOString()
        }));
        if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
        refreshMatButtons();
    }

    let pillMenu = null;
    function closePillMenu() {
        if (pillMenu && pillMenu.parentNode) pillMenu.parentNode.removeChild(pillMenu);
        pillMenu = null;
    }

    function openPillMenu(x, y, ref, url, label) {
        closePillMenu();
        const menu = document.createElement('div');
        menu.className = 'mat-ctx';
        const titel = document.createElement('div');
        titel.className = 'mat-ctx-title';
        titel.textContent = label || matDefaultLabel(url);
        menu.appendChild(titel);
        [['⧉', 'Kopieren', function () { copyOneMat(ref, url, label); }, 'ctx-ico-gross'],
         ['↗', 'Öffnen', function () { openMat(url, label); }, ''],
         ['✎', 'Bearbeiten', function () { openMatModal(ref, url); }, ''],
         ['✕', 'Entfernen', function () { removeMatEntry(ref, url); }, '']
        ].forEach(function (def) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'mat-ctx-item';
            const ico = document.createElement('span');
            ico.className = 'ctx-ico ' + (def[3] || '');
            ico.textContent = def[0];      /* same glyphs as the row toolbar */
            b.appendChild(ico);
            b.appendChild(document.createTextNode(def[1]));
            b.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closePillMenu();
                def[2]();
            });
            menu.appendChild(b);
        });
        document.body.appendChild(menu);
        /* keep it inside the window */
        const r = menu.getBoundingClientRect();
        const left = Math.min(x, window.innerWidth - r.width - 8);
        const top = Math.min(y, window.innerHeight - r.height - 8);
        menu.style.left = Math.max(8, left) + 'px';
        menu.style.top = Math.max(8, top) + 'px';
        pillMenu = menu;
    }

    document.addEventListener('click', function (e) {
        if (pillMenu && !pillMenu.contains(e.target)) closePillMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePillMenu(); });
    window.addEventListener('scroll', closePillMenu, true);

    function wirePillMenu(a, ref, url, label) {
        a.addEventListener('contextmenu', function (e) {
            if (!document.body.classList.contains('editing')) return; /* native menu */
            e.preventDefault();
            e.stopPropagation();
            openPillMenu(e.clientX, e.clientY, ref, url, label);
        });
    }

    // Touch gestures on a pill (Doc's rule for the pad):
    //   short tap  -> description tooltip (if the link has one, else navigate)
    //   long press -> open the link; while editing: the pill context menu
    // The timer is cancelled by moving the finger or lifting early.
    function wirePillTouch(a, ref, en, editable) {
        let timer = null, moved = false, fired = false;
        a.addEventListener('touchstart', function (e) {
            moved = false; fired = false;
            const t = e.touches[0];
            timer = setTimeout(function () {
                timer = null;
                if (moved) return;
                fired = true;
                hideMatTip();
                if (editable && document.body.classList.contains('editing'))
                    openPillMenu(t.clientX, t.clientY, ref, en.url, en.label);
                else openMat(en.url, en.label);
            }, 500);
        }, { passive: true });
        a.addEventListener('touchmove', function () { moved = true; }, { passive: true });
        ['touchend', 'touchcancel'].forEach(function (ev) {
            a.addEventListener(ev, function (e) {
                if (timer) { clearTimeout(timer); timer = null; }
                if (moved) return;
                if (fired) { e.preventDefault(); return; }       /* long press handled */
                if (!en.desc) return;                            /* short tap: navigate */
                e.preventDefault();                              /* short tap: tooltip */
                if (matTip && matTip.dataset.for === en.url) hideMatTip();
                else showMatTip(a, en.desc, en.url);
            });
        });
    }

    function applyPaste(ref, clip, mode) {
        const incoming = parseMat(clip.src);
        let entries;
        if (mode === 'replace') {
            entries = incoming;
        } else {
            entries = parseMat(ref.matTd.dataset.src || '');
            const seen = new Set(entries.map(en => en.url));
            incoming.forEach(function (en) {
                if (seen.has(en.url)) return;   /* same link twice makes no sense */
                seen.add(en.url);
                entries.push(en);
            });
        }
        saveMaterial(ref, matToSrc(entries));
        refreshMatButtons();
    }

    // Paste always appends silently: nothing is lost, duplicates are
    // filtered in applyPaste, and single links can be removed via their x.
    function pasteMaterial(ref) {
        const clip = readClip();
        if (!clip) return;
        applyPaste(ref, clip, 'append');
    }

    // Copy only where there is something to copy, paste only while the
    // clipboard holds something — so an untouched plan looks as before.
    function updateMatButtons(ref) {
        const clip = readClip();
        const copy = ref.matTd.querySelector('.mat-copy');
        const paste = ref.matTd.querySelector('.mat-paste');
        if (copy) copy.hidden = !(ref.matTd.dataset.src || '').trim();
        if (paste) {
            paste.hidden = !clip;
            if (clip) paste.title = 'Material aus „' + clip.from + '“ einfügen (' +
                clip.n + (clip.n === 1 ? ' Link' : ' Links') + ')';
        }
    }

    function refreshMatButtons() {
        matRefs.forEach(updateMatButtons);
    }

    /* a second tab may fill the clipboard — keep the buttons in sync */
    window.addEventListener('storage', function (e) {
        if (e.key === CLIP_KEY) refreshMatButtons();
    });

    function decorateMatCell(ref) {
        if (!CAN_EDIT_MAT || !ref.matTd) return;
        if (matRefs.indexOf(ref) < 0) matRefs.push(ref);
        if (!ref.matTd.querySelector('.mat-add')) {
            const copy = document.createElement('span');
            copy.className = 'mat-act mat-copy';
            copy.textContent = '⧉';
            copy.title = 'Materialien dieser Woche kopieren';
            copy.addEventListener('click', function (e) {
                e.stopPropagation();
                copyMaterial(ref, copy);
            });
            ref.matTd.appendChild(copy);

            const paste = document.createElement('span');
            paste.className = 'mat-act mat-paste';
            paste.textContent = '⇩';
            paste.addEventListener('click', function (e) {
                e.stopPropagation();
                pasteMaterial(ref);
            });
            ref.matTd.appendChild(paste);

            const btn = document.createElement('span');
            btn.className = 'mat-add';
            btn.textContent = '+';
            btn.title = 'Link einfügen (oder Link hierher ziehen)';
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                openMatModal(ref);
            });
            ref.matTd.appendChild(btn);
        }
        updateMatButtons(ref);
    }

    // --- Drag&drop tracing via the central DebugWindow (?debug) ----------
    // Loads js/debug-window.js on demand; site root serves HTML/ so the
    // absolute path works on localhost:8765 and docalvers.de alike.
    const MAT_DEBUG = new URLSearchParams(location.search).has('debug');
    let dbgQueue = [];
    function dbg(msg) {
        if (!MAT_DEBUG) return;
        if (window.DebugWindow) DebugWindow.log(msg);
        else if (dbgQueue) dbgQueue.push(msg);
    }
    if (MAT_DEBUG) {
        const s = document.createElement('script');
        s.src = '/js/debug-window.js';
        s.onload = function () {
            DebugWindow.init();
            dbgQueue.forEach(function (m) { DebugWindow.log(m); });
            dbgQueue = null;
        };
        document.head.appendChild(s);
        dbg('svp material: eingeloggt=' + CAN_EDIT_MAT + ' · Zeilen=' + window.PLAN.length);
        let lastDocLog = 0;
        document.addEventListener('dragover', function (e) {
            const now = Date.now();
            if (now - lastDocLog < 1000) return;
            lastDocLog = now;
            const t = e.target;
            dbg('doc dragover über <' + t.tagName.toLowerCase() +
                (t.className ? ' .' + String(t.className).split(' ')[0] : '') + '>');
        });
        document.addEventListener('drop', function (e) {
            dbg('doc drop über <' + e.target.tagName.toLowerCase() + '> types=' +
                Array.from(e.dataTransfer.types).join(','));
        }, true);
    }

    // Brief inline feedback under the cell when a drop cannot be used.
    function matToast(td, msg) {
        const old = td.querySelector('.mat-toast');
        if (old) old.remove();
        const t = document.createElement('span');
        t.className = 'mat-toast';
        t.textContent = msg;
        td.appendChild(t);
        setTimeout(function () { t.remove(); }, 3000);
    }

    function wireMaterialDrop(ref) {
        if (!CAN_EDIT_MAT) return;
        const td = ref.matTd;
        td.addEventListener('dragenter', function (e) {
            dbg('Zelle ' + ref.i + ' dragenter · types=' +
                Array.from(e.dataTransfer.types).join(','));
        });
        td.addEventListener('dragover', function (e) {
            e.preventDefault();
            td.classList.add('drop');
        });
        td.addEventListener('dragleave', function () { td.classList.remove('drop'); });
        td.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            td.classList.remove('drop');
            const uri = e.dataTransfer.getData('text/uri-list');
            const plain = e.dataTransfer.getData('text/plain');
            dbg('Zelle ' + ref.i + ' DROP · uri="' + uri + '" · plain="' + plain +
                '" · files=' + (e.dataTransfer.files ? e.dataTransfer.files.length : 0));
            const url = (uri || plain || '').split('\n')[0].trim();
            if (!/^https?:\/\//.test(url)) {
                // A file drag (OneDrive tile, Finder) carries no share URL.
                matToast(td, e.dataTransfer.files && e.dataTransfer.files.length
                    ? 'Datei-Drop geht nicht — bitte den LINK ziehen (oder + nutzen)'
                    : 'Kein Link erkannt — bitte eine https://…-Adresse ziehen');
                return;
            }
            saveMaterial(ref, (td.dataset.src || '') + ' ' + url);
        });
    }

    const KEY = 'svp-edits:' + location.pathname;
    let skipUnloadSave = false; /* set by doReset()/applyShift(), see the beforeunload handler */
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }

    // Per-row references for edit mode and persistence.
    const rendered = [];
    const lbCells = {};   /* row index -> Bereich cell wrapper (pill + WU chip) */

    // The table is not always as long as the page's PLAN: shiftPlan() can push
    // content past the last week, and those extra weeks live only in the edits
    // object. planRows is PLAN padded out to cover them, so index i means the
    // same row everywhere (render, edits, shift).
    const planRows = window.PLAN.slice();
    Object.keys(saved).forEach(function (k) {
        const i = Number(k);
        if (!Number.isInteger(i) || i < 0) return;
        while (planRows.length <= i) planRows.push(null);
    });
    for (let j = 0; j < planRows.length; j++) {
        if (!planRows[j]) {
            planRows[j] = { nr: 0, kw: '', date: '', type: 'org', u: '', topic: '', remark: '', details: [] };
        }
    }

    // --- LaTeX support ---------------------------------------------------
    // Formulas in PLAN strings use $...$ (KaTeX inline math). KaTeX is loaded
    // on demand, only when a page actually contains math. Edit mode always
    // shows and saves the raw $...$ source (see setEditable).
    const KATEX = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min';
    const mathEls = new Set();

    function renderMathInto(el) {
        const src = el.dataset.src || '';
        if (!window.katex) { el.textContent = src; return; }
        el.textContent = '';
        src.split(/\$([^$]+)\$/).forEach((part, idx) => {
            if (!part) return;
            if (idx % 2 === 0) {
                el.appendChild(document.createTextNode(part));
            } else {
                const span = document.createElement('span');
                try { katex.render(part, span, { throwOnError: false }); }
                catch (e) { span.textContent = '$' + part + '$'; }
                el.appendChild(span);
            }
        });
    }

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
    let building = false;

    // Sets text that may contain $...$ math; keeps the raw source in data-src.
    /* The Woche column reads better (and much narrower) on two lines:
       "17.–21." / "08.26", and for a range across months "31.08.–" / "04.09.26".
       The break is a <br>, so textContent still yields the original string and
       saving the cell is unaffected. */
    function setDateText(el, text) {
        const t = String(text == null ? '' : text).trim();
        el.textContent = '';
        const m = t.match(/^(\d{1,2}\.[–-]\d{1,2}\.)(\d{1,2}\.\d{2})$/)
            || t.match(/^(\d{1,2}\.\d{1,2}\.[–-])(\d{1,2}\.\d{1,2}\.\d{2})$/);
        if (!m) { el.textContent = t; return; }
        el.appendChild(document.createTextNode(m[1]));
        el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(m[2]));
    }

    function setMathText(el, text) {
        text = text == null ? '' : String(text);
        el.dataset.src = text;
        if (text.includes('$')) {
            if (!building) { mathEls.add(el); ensureKatex(); }
            renderMathInto(el);
        } else {
            mathEls.delete(el);
            el.textContent = text;
        }
    }

    function buildDetailList(ul, items) {
        ul.textContent = '';
        for (const item of items) {
            const li = document.createElement('li');
            setMathText(li, item);
            ul.appendChild(li);
        }
    }

    // --- Print export ------------------------------------------------------
    // Printing a plan page produces a clean, light SVP document (Raleway),
    // built fresh from PLAN + local edits on every print: header block,
    // Lernbereich banners (from the meta cards) and one row per week.
    document.body.classList.add('has-export');
    (function loadRaleway() {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&display=swap';
        document.head.appendChild(l);
    })();

    // Lernbereich meta per type, read off the meta cards — shared by both
    // exports (Stoffverteilungsplan banner rows and Modulablaufplan blocks).
    function lbMeta() {
        const out = {};
        document.querySelectorAll('.meta-card[data-lb]').forEach(card => {
            out[card.dataset.lb] = {
                k: card.querySelector('.k') ? card.querySelector('.k').textContent : '',
                v: card.querySelector('.v') ? card.querySelector('.v').textContent : '',
                vu: card.querySelector('.vu') ? card.querySelector('.vu').textContent : ''
            };
        });
        return out;
    }

    function buildExport() {
        building = true;
        const old = document.getElementById('svp-export');
        if (old) old.remove();
        const ex = document.createElement('div');
        ex.id = 'svp-export';

        const h1 = document.querySelector('h1');
        const sub = document.querySelector('.page-head .subtitle');
        const head = document.createElement('header');
        head.innerHTML =
            '<div class="x-doc">Stoffverteilungsplan · Schuljahr 2026/27</div>' +
            '<div class="x-title"></div>' +
            '<div class="x-sub"></div>' +
            '<div class="x-meta">Name: Dr. Michael R. Alvers · IBB Berufliche Schulen Dresden · Stand: ' +
            new Date().toLocaleDateString('de-DE') + '</div>';
        head.querySelector('.x-title').textContent = h1 ? h1.textContent : 'Stoffverteilungsplan';
        head.querySelector('.x-sub').textContent =
            sub ? sub.textContent.replace(/\s+/g, ' ').trim() : '';
        ex.appendChild(head);

        // Lernbereich meta (banner text per type) from the meta cards.
        const metaByType = lbMeta();

        // Ziele column (Vorlage: Inhalte | Ziele | Bemerkungen) — only when
        // the page's PLAN rows carry ziel fields (derived from the Lerninhalte).
        const hasZiele = planRows.some(function (r, i) { return r.ziel || (saved[i] || {}).ziel; });
        const cols = hasZiele ? 6 : 5;

        const table = document.createElement('table');
        table.innerHTML =
            '<thead><tr><th>KW</th><th>Woche</th><th>Ustd.</th>' +
            '<th>Unterrichtsinhalte</th>' + (hasZiele ? '<th>Ziele</th>' : '') +
            '<th>Bemerkungen</th></tr></thead>';
        const xbody = document.createElement('tbody');
        const seenLb = new Set();

        /* planRows, not window.PLAN: a shift can push content into weeks that
           exist only in the edits — those must reach the paper too. */
        planRows.forEach((row, i) => {
            const ov = saved[i] || {};
            if (ov.ferien || row.ferien) {
                const tr = document.createElement('tr');
                tr.className = 'x-fer';
                const td = document.createElement('td');
                td.colSpan = cols;
                td.textContent = ov.ferien || row.ferien;
                tr.appendChild(td);
                xbody.appendChild(tr);
                return;
            }
            const rowType = ov.type || row.type || 'org';
            const [badgeClass] = window.BADGE[rowType] || window.BADGE.org;

            // First week of a Lernbereich: banner row with name + Ustd.
            if (metaByType[rowType] && !seenLb.has(rowType)) {
                seenLb.add(rowType);
                const m = metaByType[rowType];
                const tr = document.createElement('tr');
                tr.className = 'x-lb ' + badgeClass;
                const td = document.createElement('td');
                td.colSpan = cols;
                td.textContent = m.k + ' · ' + m.v + (m.vu ? ' · ' + m.vu : '');
                tr.appendChild(td);
                xbody.appendChild(tr);
            }

            const tr = document.createElement('tr');
            tr.className = 'x-week ' + badgeClass;
            const kw = document.createElement('td');
            kw.className = 'x-kw';
            kw.textContent = ov.kw != null ? ov.kw : row.kw;
            const date = document.createElement('td');
            date.className = 'x-date';
            // Drop the trailing year (17.–21.08.26 → 17.–21.08.; the school year
            // is in the header) and set start/end on their own lines, so the
            // column stays as narrow as one date.
            const dtxt = String(ov.date != null ? ov.date : row.date).replace(/\.\d{2}$/, '.');
            const dash = dtxt.indexOf('–');
            if (dash > -1) {
                const a = document.createElement('span');
                a.textContent = dtxt.slice(0, dash + 1);
                const b = document.createElement('span');
                b.textContent = dtxt.slice(dash + 1);
                date.appendChild(a);
                date.appendChild(b);
            } else {
                date.textContent = dtxt;
            }
            const u = document.createElement('td');
            u.className = 'x-u';
            // Ustd. like "7/13" or "19–20/24" break after the slash, same idea
            // as the date: two short lines instead of one wide column.
            const utxt = String(ov.u != null ? ov.u : (row.u || ''));
            const slash = utxt.indexOf('/');
            if (slash > -1) {
                const a = document.createElement('span');
                a.textContent = utxt.slice(0, slash + 1);
                const b = document.createElement('span');
                b.textContent = utxt.slice(slash + 1);
                u.appendChild(a);
                u.appendChild(b);
            } else {
                u.textContent = utxt;
            }
            const inh = document.createElement('td');
            inh.className = 'x-inh';
            const strong = document.createElement('b');
            setMathText(strong, ov.topic != null ? ov.topic : row.topic);
            inh.appendChild(strong);
            const items = ov.details || row.details;
            if (items && items.length) {
                const ul = document.createElement('ul');
                buildDetailList(ul, items);
                inh.appendChild(ul);
            }
            const cells = [kw, date, u, inh];
            if (hasZiele) {
                // Ziel cell: leading Lernziel verb (Kennen/Beherrschen/…) bold,
                // like in the official template.
                const ziel = document.createElement('td');
                ziel.className = 'x-ziel';
                const text = ov.ziel != null ? ov.ziel : (row.ziel || '');
                const sp = text.indexOf(' ');
                if (sp > 0) {
                    const b = document.createElement('b');
                    b.textContent = text.slice(0, sp);
                    ziel.appendChild(b);
                    ziel.appendChild(document.createTextNode(text.slice(sp)));
                } else {
                    ziel.textContent = text;
                }
                cells.push(ziel);
            }
            const rem = document.createElement('td');
            rem.className = 'x-rem';
            setMathText(rem, ov.remark != null ? ov.remark : row.remark);
            cells.push(rem);
            cells.forEach(td => tr.appendChild(td));
            xbody.appendChild(tr);
        });

        table.appendChild(xbody);
        ex.appendChild(table);
        document.body.appendChild(ex);
        building = false;
    }

    // --- Modulablaufplan (MAP) export --------------------------------------
    // Second export next to the Stoffverteilungsplan print: the IBB
    // "Modulablaufplan" form (A4 landscape, IBB logo as running page head,
    // seven fixed columns, "Erstellt (Datum):" as running foot). It is built
    // from the same PLAN + local edits, so both documents can never drift.
    //
    // The form wants per module block: date range, Lehrplaninhalte, the
    // planned methods/media, planned UE and possible Leistungsnachweise. PLAN
    // rows carry the first two directly; the rest is derived (see below) and
    // can be overridden per page via window.MAP or per row via row.mth /
    // row.med / row.lnw. The last two columns ("Offene Fragen", "Stand der
    // Bearbeitung") stay empty on purpose — they are filled in by hand.

    const MAP_CFG = window.MAP || {};

    // Where svp-plan.js lives — used to resolve the IBB logo independent of
    // how deep the plan page sits below /svp/.
    const SVP_DIR = (function () {
        const s = document.currentScript;
        return s ? s.src.replace(/[^/]*$/, '') : '../';
    })();

    // Media defaults per Fach, used when neither page nor row names any.
    const MAP_MEDIEN = {
        Mathematik: ['IQB-Formelsammlung', 'GTR mit CAS', 'GeoGebra', 'Erklärvideos', 'Alte Abiturprüfungen'],
        Informatik: ['PC-Kabinett', 'Beamer / Whiteboard', 'Arbeitsblätter', 'Lernvideos, Online-Tutorials'],
        Informationssysteme: ['PC-Kabinett', 'Beamer / Whiteboard', 'Arbeitsblätter', 'Lernvideos, Online-Tutorials'],
        Wirtschaft: ['Gesetzes- und Vertragstexte', 'Fallbeispiele', 'Beamer / Whiteboard', 'Arbeitsblätter']
    };
    const MAP_MEDIEN_DEFAULT = ['Beamer / Whiteboard', 'Arbeitsblätter', 'Lehrbuch'];

    // Method defaults per row type — the form repeats these per block, same as
    // the original document does.
    const MAP_METHODEN = {
        org: ['Organisation, Auswertung, Beratung'],
        lk: ['Leistungsermittlung und Auswertung']
    };
    const MAP_METHODEN_DEFAULT = [
        'Unterrichtsgespräch, Lehrervortrag',
        'Übungs- und Sicherungsphasen',
        'Partner- und Gruppenarbeit'
    ];

    // Remark clauses naming one of these count as Leistungsnachweis and move
    // into that column; everything else stays a note in the Modul column.
    const LNW_RE = /(Klausur|Leistungskontrolle|Kontrolle|Kurztest|Test\b|Beleg|Komplexe Leistung|Praktische Leistung|Vortrag|Präsentation|Projektarbeit|Portfolio|Vorabitur|Abiturprüfung|Prüfung|Note)/i;

    function pad2(n) { return String(n).length < 2 ? '0' + n : String(n); }

    // "17.–21.08.26" / "31.08.–04.09.26" / "23.12.2026–02.01.2027" -> the two
    // end points as DD.MM.YY. Month and year of the start are taken from the
    // end date when the source leaves them out.
    function mapDates(text) {
        const m = String(text || '').match(
            /(\d{1,2})\.(?:(\d{1,2})\.)?(\d{2,4})?\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{2,4})?/);
        if (!m) return null;
        const yy = y => (y ? y.slice(-2) : '');
        const eMon = m[5], eYear = m[6] || m[3];
        return [
            pad2(m[1]) + '.' + pad2(m[2] || eMon) + '.' + yy(m[3] || eYear),
            pad2(m[4]) + '.' + pad2(eMon) + '.' + yy(eYear)
        ];
    }

    // "1–4/36" -> 4, "7/13" -> 1: the Ustd. column counts lessons, the MAP
    // column counts them per block.
    function mapUE(u) {
        const range = String(u || '').split('/')[0].trim();
        const m = range.match(/^(\d+)\s*[–—-]\s*(\d+)$/);
        if (m) return Number(m[2]) - Number(m[1]) + 1;
        return /^\d+$/.test(range) ? 1 : 0;
    }

    // Fach and Klassenstufe for the head block, derived from the page title
    // ("Mathematik · Berufliches Gymnasium · Jahrgangsstufe 13" + "Grundkurs"
    // from the subtitle) unless window.MAP names them.
    function mapFach() {
        if (MAP_CFG.fach) return MAP_CFG.fach;
        const h1 = document.querySelector('h1');
        let fach = h1 ? h1.textContent.split('·')[0].trim() : 'Fach';
        const sub = document.querySelector('.page-head .subtitle');
        const st = sub ? sub.textContent : '';
        if (/Grundkurs/.test(st)) fach += ' Grundkurs';
        else if (/Leistungskurs/.test(st)) fach += ' Leistungskurs';
        return fach;
    }

    function mapKlasse() {
        if (MAP_CFG.klasse) return MAP_CFG.klasse;
        const h1 = document.querySelector('h1');
        const m = (h1 ? h1.textContent : '').match(/(?:Jahrgangs|Klassen)stufe\s*(\d+)|Klasse\s*(\d+)/);
        return m ? (m[1] || m[2]) : '';
    }

    function mapMedienDefault() {
        if (MAP_CFG.medien) return MAP_CFG.medien;
        const fach = mapFach().split(' ')[0];
        return MAP_MEDIEN[fach] || MAP_MEDIEN_DEFAULT;
    }

    // Material links of a row are Medieneinsatz too: their labels join the
    // media list (the URLs themselves have no place on a printed form).
    function mapMaterialLabels(src) {
        const out = [];
        String(src || '').split(/(https?:\/\/\S+)/).forEach(function (part, i) {
            if (i % 2) return;                 /* odd parts are the URLs */
            const label = part.trim();
            if (label) out.push(label);
        });
        return out;
    }

    // PLAN rows -> MAP blocks: consecutive weeks on the same topic become one
    // block (that is what the form calls a Modul), holidays stay single rows.
    function mapBlocks() {
        const blocks = [];
        planRows.forEach(function (row, i) {
            const ov = saved[i] || {};
            if (ov.ferien || row.ferien) {
                const text = ov.ferien || row.ferien;
                blocks.push({ ferien: text.split('·')[0].trim(), dates: mapDates(text) });
                return;
            }
            const date = String(ov.date != null ? ov.date : row.date);
            const dates = mapDates(date) || [date, ''];
            const topic = ov.topic != null ? ov.topic : row.topic;
            const prev = blocks[blocks.length - 1];
            if (prev && !prev.ferien && prev.type === (ov.type || row.type) && prev.topic === topic) {
                prev.d1 = dates[1];
                prev.ue += mapUE(ov.u != null ? ov.u : row.u);
                (ov.details || row.details || []).forEach(function (d) {
                    if (prev.details.indexOf(d) < 0) prev.details.push(d);
                });
                return;
            }
            blocks.push({
                type: ov.type || row.type,
                d0: dates[0],
                d1: dates[1],
                topic: topic,
                ue: mapUE(ov.u != null ? ov.u : row.u),
                details: (ov.details || row.details || []).slice(),
                remark: ov.remark != null ? ov.remark : (row.remark || ''),
                material: ov.material != null ? ov.material : (row.material || ''),
                mth: ov.mth != null ? ov.mth : row.mth,
                med: ov.med != null ? ov.med : row.med,
                lnw: ov.lnw != null ? ov.lnw : row.lnw
            });
        });
        return blocks;
    }

    function mapList(parent, caption, items) {
        const cap = document.createElement('div');
        cap.className = 'm-cap';
        cap.textContent = caption;
        parent.appendChild(cap);
        const ul = document.createElement('ul');
        items.forEach(function (t) {
            const li = document.createElement('li');
            setMathText(li, t);
            ul.appendChild(li);
        });
        parent.appendChild(ul);
    }

    function buildMap(track) {
        building = !track; /* ?map preview may load KaTeX, print must not */
        const old = document.getElementById('svp-map');
        if (old) old.remove();

        const doc = document.createElement('div');
        doc.id = 'svp-map';

        // Everything lives in ONE table: thead (IBB logo) and tfoot
        // ("Erstellt (Datum):") repeat automatically on every printed page,
        // which is how the original form does its running head and foot.
        const table = document.createElement('table');
        const cg = document.createElement('colgroup');
        // Column widths of the original form, as a share of the type area.
        [7.75, 24.9, 35.9, 6.99, 11.97, 6.98, 7.53].forEach(function (w) {
            const col = document.createElement('col');
            col.style.width = w + '%';
            cg.appendChild(col);
        });
        table.appendChild(cg);

        const thead = document.createElement('thead');
        const lr = document.createElement('tr');
        lr.className = 'm-runhead';
        const lt = document.createElement('td');
        lt.colSpan = 7;
        const logo = document.createElement('img');
        logo.className = 'm-logo';
        logo.src = SVP_DIR + 'ibb-logo.svg';
        logo.alt = 'IBB Berufliche Schulen';
        lt.appendChild(logo);
        lr.appendChild(lt);
        thead.appendChild(lr);
        table.appendChild(thead);

        const tfoot = document.createElement('tfoot');
        const fr = document.createElement('tr');
        fr.className = 'm-runfoot';
        const ft = document.createElement('td');
        ft.colSpan = 7;
        ft.textContent = 'Erstellt (Datum):';
        fr.appendChild(ft);
        tfoot.appendChild(fr);
        table.appendChild(tfoot);

        const tb = document.createElement('tbody');

        // Head block — plain rows, so it appears on the first page only.
        function metaRow(cls, build) {
            const tr = document.createElement('tr');
            tr.className = 'm-meta ' + cls;
            const td = document.createElement('td');
            td.colSpan = 7;
            build(td);
            tr.appendChild(td);
            tb.appendChild(tr);
        }
        metaRow('m-title', function (td) {
            const wrap = document.createElement('div');
            const sp = document.createElement('span');
            sp.textContent = 'Modulablaufplan SJ 2026/27';
            wrap.appendChild(sp);
            td.appendChild(wrap);
        });
        metaRow('m-fach', function (td) { td.textContent = 'Fach: ' + mapFach(); });
        metaRow('m-klasse', function (td) { td.textContent = 'Klassenstufe: ' + mapKlasse(); });

        // Column titles as a normal row: the original form does not repeat
        // them on the following pages.
        const hr = document.createElement('tr');
        hr.className = 'm-head';
        [['Datum/', 'Woche'], ['Modul', 'Lernbereich / Lehrplaninhalte'],
         ['Unterrichtsinhalte', '(mögliche Methoden/ Medieneinsatz)'],
         ['Geplante', 'UE'], ['Mögliche', 'Leistungs-', 'nachweise'],
         ['Offene', 'Fragen'], ['Stand der', 'Bearbeitung']].forEach(function (lines, idx) {
            const th = document.createElement('td');
            if (idx >= 3) th.className = 'm-c';
            lines.forEach(function (t) {
                const d = document.createElement('div');
                d.textContent = t;
                th.appendChild(d);
            });
            hr.appendChild(th);
        });
        tb.appendChild(hr);

        const meta = lbMeta();
        const medienDefault = mapMedienDefault();

        mapBlocks().forEach(function (b) {
            const tr = document.createElement('tr');

            const dt = document.createElement('td');
            dt.className = 'm-date';
            const dates = b.ferien ? (b.dates || []) : [b.d0, b.d1];
            (dates || []).forEach(function (d) {
                if (!d) return;
                const s = document.createElement('div');
                s.textContent = d;
                dt.appendChild(s);
            });
            tr.appendChild(dt);

            const mod = document.createElement('td');
            mod.className = 'm-mod';

            if (b.ferien) {
                const f = document.createElement('div');
                f.textContent = b.ferien;
                mod.appendChild(f);
                tr.appendChild(mod);
                for (let i = 0; i < 5; i++) tr.appendChild(document.createElement('td'));
                tb.appendChild(tr);
                return;
            }

            // Modul column: Lernbereich (from the meta card, else the badge
            // label), the week's Lehrplan topic, then the content bullets.
            const lb = meta[b.type];
            const head1 = document.createElement('b');
            head1.textContent = lb
                ? (lb.k + (lb.v ? ' · ' + lb.v : ''))
                : (window.BADGE[b.type] ? window.BADGE[b.type][1] : '');
            mod.appendChild(head1);
            const head2 = document.createElement('b');
            setMathText(head2, b.topic);
            mod.appendChild(head2);
            if (b.details.length) {
                const ul = document.createElement('ul');
                b.details.forEach(function (d) {
                    const li = document.createElement('li');
                    setMathText(li, d);
                    ul.appendChild(li);
                });
                mod.appendChild(ul);
            }

            // Remark clauses split: Leistungsnachweise to their own column,
            // the rest stays here as a note.
            const lnw = [], note = [];
            String(b.remark).split(/\s*[·;]\s*/).forEach(function (part) {
                if (!part.trim()) return;
                (LNW_RE.test(part) ? lnw : note).push(part.trim());
            });
            if (b.type === 'lk') lnw.unshift(b.topic);
            if (b.lnw) { lnw.length = 0; lnw.push(b.lnw); }
            if (note.length) {
                const n = document.createElement('div');
                n.className = 'm-note';
                setMathText(n, note.join(' · '));
                mod.appendChild(n);
            }
            tr.appendChild(mod);

            const inh = document.createElement('td');
            inh.className = 'm-inh';
            mapList(inh, 'Methoden:',
                b.mth || MAP_CFG.methoden || MAP_METHODEN[b.type] || MAP_METHODEN_DEFAULT);
            mapList(inh, 'Medien:',
                b.med || medienDefault.concat(mapMaterialLabels(b.material)));
            tr.appendChild(inh);

            const ue = document.createElement('td');
            ue.className = 'm-c';
            ue.textContent = b.ue ? String(b.ue) : '';
            tr.appendChild(ue);

            const ln = document.createElement('td');
            ln.className = 'm-lnw';
            setMathText(ln, lnw.join(' · '));
            tr.appendChild(ln);

            tr.appendChild(document.createElement('td')); /* Offene Fragen */
            tr.appendChild(document.createElement('td')); /* Stand der Bearbeitung */
            tb.appendChild(tr);
        });

        table.appendChild(tb);
        doc.appendChild(table);
        document.body.appendChild(doc);
        building = false;
    }

    function mapTitle() {
        return exportTitle().replace(/^SVP /, 'MAP ');
    }

    // Toolbar gets the second export button next to "Drucken" — centrally, so
    // no plan page has to be touched.
    var mapMode = false;
    (function addMapButton() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const btn = document.createElement('button');
        btn.className = 'action';
        btn.textContent = 'Modulablaufplan';
        btn.title = 'IBB-Modulablaufplan (Querformat) drucken / als PDF sichern';
        btn.addEventListener('click', function () {
            withEditGate(function () {
                mapMode = true;
                window.print();
            });
        });
        const first = bar.querySelector('button.action');
        if (first) bar.insertBefore(btn, first.nextSibling);
        else bar.appendChild(btn);
    })();

    // Password-gate the plain "Drucken" button too — centrally, overriding the
    // inline onclick="window.print()" every plan page ships with.
    (function gatePrintButton() {
        document.querySelectorAll('.toolbar button').forEach(function (b) {
            if (b.textContent.trim() === 'Drucken') {
                b.onclick = null; /* drop the inline handler */
                b.addEventListener('click', function () {
                    withEditGate(function () { window.print(); });
                });
            }
        });
    })();

    // Both output actions live in one "Export" dropdown instead of two loose
    // buttons. The existing buttons are moved into the menu, so their handlers
    // (and the edit gate on them) stay exactly as they are.
    (function buildExportMenu() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const items = [...bar.querySelectorAll('button')].filter(function (b) {
            const t = b.textContent.trim();
            return t === 'Drucken' || t === 'Modulablaufplan';
        });
        if (!items.length) return;

        const drop = document.createElement('div');
        drop.className = 'export-drop';
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'action export-toggle';
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = 'Export <span class="export-caret">▾</span>';
        const menu = document.createElement('div');
        menu.className = 'export-menu';
        menu.hidden = true;

        bar.insertBefore(drop, items[0]);
        items.forEach(function (b) {
            b.classList.add('export-item');
            /* the print dialog is also the way to a PDF — say so, the pages
               themselves keep their plain "Drucken" markup */
            if (b.textContent.trim() === 'Drucken') b.textContent = 'Drucken / PDF';
            menu.appendChild(b);
        });
        drop.appendChild(toggle);
        drop.appendChild(menu);

        function open(on) {
            menu.hidden = !on;
            toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
            toggle.classList.toggle('on', !!on);
        }
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            open(menu.hidden);
        });
        menu.addEventListener('click', function () { open(false); });
        document.addEventListener('click', function (e) {
            if (!drop.contains(e.target)) open(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') open(false);
        });
    })();

    // ?map — on-screen preview of the form (also what headless print uses).
    if (/[?&]map\b/.test(location.search)) {
        buildMap(true);
        document.body.classList.add('map-print', 'map-preview');
        document.title = mapTitle(); /* also names the PDF in headless print */
    }

    // The PDF file name comes from document.title, so swap in a clean one for
    // the duration of the print: "SVP Informatik OS Kl 9 SJ 2026-27".
    // Schulform abbreviations are the ones the Lehrpläne use (OS/BGY/FOS).
    const SHORT = [
        [/Berufliches Gymnasium/g, 'BGY'],
        [/Fachoberschule/g, 'FOS'],
        [/Oberschule/g, 'OS'],
        [/Jahrgangsstufe/g, 'Jgst'],
        [/Klassenstufe/g, 'Kl'],
        [/Klasse/g, 'Kl']
    ];

    function exportTitle() {
        const h1 = document.querySelector('h1');
        let name = h1 ? h1.textContent : 'Stoffverteilungsplan';
        for (const [re, rep] of SHORT) name = name.replace(re, rep);
        name = name.replace(/·/g, ' ').replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
        return 'SVP ' + name + ' SJ 2026-27';
    }

    let pageTitle = document.title;

    window.addEventListener('beforeprint', function () {
        pageTitle = document.title;
        if (mapMode) {
            buildMap();
            document.body.classList.add('map-print');
            document.title = mapTitle();
        } else {
            buildExport();
            document.title = exportTitle();
        }
    });

    // Drop the export again afterwards — the live page keeps a light DOM.
    window.addEventListener('afterprint', function () {
        document.title = pageTitle;
        if (!document.body.classList.contains('map-preview')) {
            document.body.classList.remove('map-print');
            const mp = document.getElementById('svp-map');
            if (mp) mp.remove();
        }
        mapMode = false;
        const ex = document.getElementById('svp-export');
        if (ex) ex.remove();
    });

    // Open/closed state of the week sub-rows is remembered per page and
    // browser (same idea as the LB panels). Not touched while editing —
    // edit mode force-opens everything only temporarily.
    const OPEN_KEY = 'svp-week-open:' + location.pathname;
    let openWeeks;
    try { openWeeks = new Set(JSON.parse(localStorage.getItem(OPEN_KEY) || '[]')); }
    catch (e) { openWeeks = new Set(); }
    function syncOpenWeeks() {
        if (document.body.classList.contains('editing')) return;
        openWeeks.clear();
        document.querySelectorAll('tr.expandable.open[data-i]').forEach(function (row) {
            openWeeks.add(Number(row.dataset.i));
        });
        try { localStorage.setItem(OPEN_KEY, JSON.stringify([...openWeeks])); } catch (e) { }
    }

    // Snapshot for the restore pass: syncOpenWeeks rebuilds the live set from
    // the DOM, which is still incomplete while the table is being built.
    const initialOpen = new Set(openWeeks);

    planRows.forEach((row, i) => {
        const ov = saved[i] || {};
        const tr = document.createElement('tr');
        tr.dataset.i = i;

        if (row.ferien) {
            tr.className = 'ferien';
            const td = document.createElement('td');
            td.colSpan = 8;
            td.textContent = ov.ferien || row.ferien;
            tr.appendChild(td);
            tbody.appendChild(tr);
            rendered.push({ i, ferienTd: td });
            return;
        }

        /* Shift arrows, first cell of the row. Built for every week, shown
           only in shift mode; the ▲ additionally only when the week above is
           free (setShiftMode decides, it needs helpers defined further down). */
        const shiftTd = document.createElement('td');
        shiftTd.className = 'shift-col';
        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'shift-btn';
        upBtn.textContent = '▲';
        upBtn.title = 'Diese Woche auf die freie Woche davor ziehen';
        upBtn.setAttribute('aria-label', 'Woche eine Woche früher');
        upBtn.hidden = true;
        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'shift-btn';
        downBtn.textContent = '▼';
        downBtn.title = 'Diese Woche und alles danach eine Woche nach hinten schieben';
        downBtn.setAttribute('aria-label', 'Woche eine Woche später');
        upBtn.addEventListener('click', function (e) { e.stopPropagation(); runShift(i, -1); });
        downBtn.addEventListener('click', function (e) { e.stopPropagation(); runShift(i, 1); });
        shiftTd.appendChild(upBtn);
        shiftTd.appendChild(downBtn);
        tr.appendChild(shiftTd);

        /* type belongs to the edits too — a shift moves the Bereich along with
           the topic, otherwise the badges stay behind on the old week. */
        const rowType = ov.type || row.type || 'org';
        const [badgeClass, badgeLabel] = window.BADGE[rowType] || window.BADGE.org;
        const tds = [];
        const values = [
            ['num', String(ov.nr != null ? ov.nr : row.nr)],
            ['num', String(ov.kw != null ? ov.kw : row.kw)],
            ['date', ov.date != null ? ov.date : row.date],
            ['', null],
            ['num', ov.u != null ? ov.u : row.u],
            ['topic', null],
            ['remark', ov.remark != null ? ov.remark : row.remark]
        ];
        values.forEach(([cls, text], idx) => {
            const td = document.createElement('td');
            if (cls) td.className = cls;
            if (idx === 3) {
                td.classList.add('lb');
                const span = document.createElement('span');
                span.className = 'badge ' + badgeClass;
                span.textContent = badgeLabel;
                linkBadge(span, rowType);
                /* Pille und WebUntis-Chip stecken in einem inline-grid, damit
                   beide exakt gleich breit sind - das Grid ist so breit wie
                   sein breitestes Kind, und beide Kinder fuellen es aus. */
                const cell = document.createElement('div');
                cell.className = 'lb-cell';
                cell.appendChild(span);
                td.appendChild(cell);
                lbCells[i] = cell;
            } else if (idx === 2) {
                setDateText(td, text);
            } else if (idx === 4) {
                td.classList.add('ustd');
                td.textContent = text;
            } else if (idx !== 5 && idx !== 6) {
                td.textContent = text;
            }
            tds.push(td);
            tr.appendChild(td);
        });
        setMathText(tds[6], values[6][1]);

        // Material cell (week row): only a compact 📎 marker + quick-add;
        // the pills themselves live in the expandable sub-row (more room).
        const matTd = document.createElement('td');
        matTd.className = 'mat';
        tr.appendChild(matTd);

        // Topic cell: optional chevron + editable text span.
        const topicSpan = document.createElement('span');
        topicSpan.className = 'topic-text';
        setMathText(topicSpan, ov.topic != null ? ov.topic : row.topic);
        tds[5].appendChild(topicSpan);
        tbody.appendChild(tr);

        const ref = {
            i, dateTd: tds[2], uTd: tds[4], topicSpan, remarkTd: tds[6], matTd, ul: null,
            lbTd: tds[3], lbCell: lbCells[i],
            /* structural fields: never edited by hand, but carried through every
               save so a shifted plan keeps its Bereich, Nummer and KW */
            type: rowType, nr: ov.nr != null ? ov.nr : row.nr, kw: ov.kw != null ? ov.kw : row.kw,
            upBtn: upBtn
        };

        // Expandable sub-row, created on demand: bullets under the topic
        // column, materials in the free area under Bemerkungen/Material.
        let detailTr = null, subMain = null, subSide = null;
        function ensureSubRow() {
            if (detailTr) return { main: subMain, side: subSide };
            detailTr = document.createElement('tr');
            detailTr.className = 'detail-row';
            // Empty spacer under columns 1-5 so the content sits under the topic column.
            const spacer = document.createElement('td');
            spacer.colSpan = 5;
            detailTr.appendChild(spacer);
            subMain = document.createElement('td');
            subMain.colSpan = 1;
            detailTr.appendChild(subMain);
            subSide = document.createElement('td');
            subSide.colSpan = 2;
            subSide.className = 'sub-side';
            detailTr.appendChild(subSide);
            tr.after(detailTr);
            tr.classList.add('expandable');
            const chev = document.createElement('span');
            chev.className = 'chev';
            chev.textContent = '▸';
            tds[5].insertBefore(chev, topicSpan);
            return { main: subMain, side: subSide };
        }
        ref.ensureSubRow = ensureSubRow;
        ref.openSubRow = function () {
            if (!detailTr) return;
            tr.classList.add('open');
            detailTr.classList.add('open');
            syncOpenWeeks();
        };

        tr.addEventListener('click', () => {
            if (document.body.classList.contains('editing')) return;
            if (!detailTr) return;
            tr.classList.toggle('open');
            detailTr.classList.toggle('open');
            syncOpenWeeks();
        });

        const detailItems = ov.details || row.details;
        if (detailItems && detailItems.length) {
            const ul = document.createElement('ul');
            buildDetailList(ul, detailItems);
            ensureSubRow().main.appendChild(ul);
            ref.ul = ul;
        }

        ref.matBlock = document.createElement('div');
        ref.matBlock.className = 'mat-block';
        updateMaterial(ref, ov.material != null ? ov.material : row.material);
        wireMaterialDrop(ref);
        if (initialOpen.has(i)) ref.openSubRow(); /* restore remembered state */
        rendered.push(ref);
    });

    /* Alle Bereich-Pillen gleich breit. Ohne das misst jede Zeile ihre eigene
       Breite aus - "LB 1" schmal, "LEISTUNG" breit - und die Spalte springt.
       Mass ist die breiteste Zelle: schmaler ginge nur, indem man den laengsten
       Text abschneidet. Erst nach dem Laden von Orbitron messen, vorher steht
       dort die Ersatzschrift mit anderen Breiten. */
    function equalizeLbCells() {
        const cells = Object.keys(lbCells).map(k => lbCells[k]);
        if (!cells.length) return;
        cells.forEach(c => { c.style.width = ''; });
        let w = 0;
        cells.forEach(c => { w = Math.max(w, c.getBoundingClientRect().width); });
        if (w) cells.forEach(c => { c.style.width = w + 'px'; });
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(equalizeLbCells);
    } else {
        equalizeLbCells();
    }
    window.addEventListener('resize', equalizeLbCells);

    /* WebUntis-Status unter der Bereich-Pille.
       WebUntis hat kein CORS, der Browser kommt also nie selbst dran. Die
       Daten liefert tools/webuntis.js status als <plan>.untis.json neben der
       Seite - ein Eintrag je Kalenderwoche, ein Punkt je Stunde. Fehlt die
       Datei (jede Seite ohne Kurs-Zuordnung), bleibt alles wie vorher. */
    function untisTitle(entries, generated) {
        const lines = entries.map(e => {
            const d = String(e.date);
            const day = d.slice(6, 8) + '.' + d.slice(4, 6) + '.';
            return (e.klasse || '') + ' ' + day + ' ' + e.start + ' — ' +
                (e.written ? 'eingetragen: ' + e.text : 'noch nichts im Klassenbuch');
        });
        if (generated) {
            const g = new Date(generated);
            lines.push('Stand ' + g.toLocaleDateString('de-DE') + ' ' +
                g.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) +
                ' — im Bearbeiten-Modus klicken: Stundeninhalt eintragen');
        }
        return lines.join('\n');
    }

    /* Untis-Logo statt des Kuerzels "WU": weisses U mit Strahlenkranz, die
       orange Kachel ist der Chip selbst. Geometrie am Original abgemessen
       (Strahlen im 22,5-Grad-Raster, aussen alle auf gleichem Radius, die
       waagerechten laenger und dicker). Der Ausschnitt ist flacher als das
       Original - die oberen und unteren Strahlen fallen dabei weg, genau wie
       im Logo selbst schon oben und unten abgeschnitten wird. */
    function untisMark() {
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'u-mark');
        /* Der Ausschnitt sitzt eng um das U - flacher wird das Zeichen nur
           durch Beschneiden oben/unten, nie durch Stauchen. Der Rahmen ist
           gegenueber dem Zeichen um knapp ein Viertel aufgeweitet: das laesst
           U und Strahlen im gleich grossen Chip kleiner erscheinen, ohne sie
           zu verzerren. */
        svg.setAttribute('viewBox', '-25.8 0.2 271.6 113.6');
        svg.setAttribute('aria-hidden', 'true');
        function path(cls, d) {
            const el = document.createElementNS(NS, 'path');
            el.setAttribute('class', cls);
            el.setAttribute('d', d);
            svg.appendChild(el);
        }
        path('u-rays-major', 'M190.5 55L216 55M29.5 55L4 55');
        path('u-rays-minor',
            'M191.3 21.3L207.9 14.4M28.7 21.3L12.1 14.4' +
            'M28.7 88.7L12.1 95.6M191.3 88.7L207.9 95.6');
        path('u-letter', 'M85 15.5V64a25.5 25.5 0 0 0 51 0V15.5');
        return svg;
    }

    /* ---- WebUntis schreiben -----------------------------------------------
       Bis 29.08.2026 hat der Chip WebUntis nur geoeffnet und Doc hat den
       Stundeninhalt von Hand hinuebergetippt. Jetzt traegt der Klick ihn direkt
       ein. Der Browser kommt an WebUntis nie selbst heran - kein CORS, und der
       Untis-App-Schluessel darf nicht in eine oeffentliche Seite (Regel 18).
       Dazwischen steht die Edge Function 'webuntis', die serverseitig genau das
       tut, was tools/webuntis.js lokal tut. */

    const UNTIS_MAX = 250;          /* WebUntis kappt laengere Texte ohnehin */

    async function untisCall(body) {
        if (!window.svpAuth || !svpAuth.hasSession()) throw new Error('Nicht angemeldet — bitte neu einloggen.');
        await svpAuth.ensureFreshToken();
        const res = await fetch(svpAuth.DB_URL + '/functions/v1/webuntis', {
            method: 'POST',
            headers: {
                apikey: svpAuth.DB_KEY,
                Authorization: 'Bearer ' + svpAuth.session.access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { const e = new Error(data.error || ('HTTP ' + res.status)); e.data = data; throw e; }
        return data;
    }

    /* Eine Klassenbuch-Zeile aus der Planzeile: Thema (Lernbereich, Ustd.): Schritte.
       Muss Zeichen fuer Zeichen dieselbe Regel sein wie topicText() in
       tools/webuntis.js - sonst haelt der eine Weg fuer eine Aenderung, was der
       andere geschrieben hat, und der Ueberschreibschutz schlaegt grundlos an. */
    /* Abkuerzungen fuer das WebUntis-Klassenbuch. Nur 250 Zeichen passen dort
       hinein, und die Schritte einer Woche sind schnell laenger - lieber
       "Wdh." schreiben als einen ganzen Schritt weglassen.
       WICHTIG: sie greifen NUR, wenn der volle Text nicht passt. Was hineinpasst,
       bleibt ausgeschrieben - ein Klassenbuch im Telegrammstil will niemand lesen.
       Die Liste ist die EINZIGE Quelle: tools/webuntis.js liest sie aus dieser
       Datei heraus, damit beide Wege zeichengleich schreiben.
       Reihenfolge egal - es wird nach Laenge sortiert angewandt, damit
       "Datenbankmanagementsystem" vor "Datenbank" drankommt. */
    window.SVP_ABBREV = [
        /* Mehrwortiges zuerst gedacht, sortiert wird ohnehin */
        ['Künstliche Intelligenz', 'KI'], ['Künstlicher Intelligenz', 'KI'],
        ['Schülerinnen und Schüler', 'SuS'],
        ['zum Beispiel', 'z. B.'], ['unter anderem', 'u. a.'],
        ['beziehungsweise', 'bzw.'], ['und so weiter', 'usw.'],
        /* Informatik-Fachwoerter */
        ['Datenbankmanagementsystem', 'DBMS'], ['Datenbankmanagementsysteme', 'DBMS'],
        ['Datenbanksystem', 'DBS'], ['Datenbanksysteme', 'DBS'],
        ['Datenbankanbindung', 'DB-Anbindung'],
        ['Datenbanken', 'DBs'], ['Datenbank', 'DB'],
        ['Informationssystem', 'IS'], ['Informationssysteme', 'IS'],
        ['Informationsmanagement', 'Info-Mgmt.'],
        ['Betriebssystem', 'BS'], ['Betriebssysteme', 'BS'],
        ['Tabellenkalkulation', 'TK'],
        ['Datensicherheit', 'Datensich.'], ['Datenschutz', 'DS'],
        ['Algorithmus', 'Alg.'], ['Algorithmen', 'Alg.'],
        ['Implementierung', 'Impl.'], ['implementieren', 'impl.'],
        ['Modellierung', 'Modell.'], ['Programmierung', 'Progr.'],
        ['Dokumentation', 'Doku'], ['Präsentation', 'Präs.'], ['Präsentationen', 'Präs.'],
        ['Verarbeitung', 'Verarb.'], ['Automatisierung', 'Autom.'],
        ['Automatisierte', 'Autom.'], ['Automatisierten', 'Autom.'],
        ['Automatisiertes', 'Autom.'], ['automatisierte', 'autom.'],
        /* Schul- und Planwoerter */
        ['Klassenarbeit', 'KA'], ['Klassenarbeiten', 'KAs'],
        ['Wiederholung', 'Wdh.'], ['Wiederholungen', 'Wdh.'],
        ['Lernbereich', 'LB'], ['Wahlbereich', 'WB'],
        ['Leistungsnachweis', 'LNW'], ['Leistungsnachweise', 'LNW'],
        ['Abiturvorbereitung', 'Abi-Vorb.'],
        ['Schuljahresplanung', 'SJ-Planung'], ['Schuljahresauftakt', 'SJ-Auftakt'],
        ['Organisatorisches', 'Orga'], ['Organisation', 'Orga'],
        ['Konsultationen', 'Konsult.'], ['Konsultation', 'Konsult.'],
        ['Hilfsmittel', 'Hilfsm.'], ['Vermischte', 'Verm.'],
        ['Auswertung', 'Ausw.'], ['Bewertung', 'Bew.'],
        ['Vertiefung', 'Vertief.'], ['Einführung', 'Einf.'],
        ['Grundlagen', 'Grdl.'], ['Überblick', 'Überbl.'], ['Ausblick', 'Ausbl.'],
        ['Abschluss', 'Abschl.'], ['Jahresrückblick', 'Jahresrückbl.'],
        /* Allgemeines */
        ['Eigenschaften', 'Eig.'], ['Anwendungen', 'Anw.'], ['Anwendung', 'Anw.'],
        ['Beispielen', 'Bsp.'], ['Beispiele', 'Bsp.'], ['Beispiel', 'Bsp.'],
        ['Aufgaben', 'Aufg.'], ['Aufgabe', 'Aufg.'],
        ['Funktionen', 'Fkt.'], ['Funktion', 'Fkt.'],
        ['Gleichungen', 'Gl.'], ['Gleichung', 'Gl.'],
        ['Informationen', 'Infos'], ['Information', 'Info'],
        ['vergleichen', 'vgl.'], ['Vergleich', 'Vgl.']
    ];

    /* Ein Wort nur als GANZES Wort ersetzen - sonst wuerde "Datenbank" mitten
       in "Datenbankanbindung" zuschlagen. \b hilft hier nicht: es kennt nur
       ASCII, und "Überblick" faengt mit einem Nicht-Wort-Zeichen an. */
    let abbrevRules = null;
    function untisAbbrev(t) {
        if (!abbrevRules) {
            abbrevRules = window.SVP_ABBREV
                .slice()
                .sort((a, b) => b[0].length - a[0].length)
                .map(([long, short]) => [
                    new RegExp('(?<!\\p{L})' + long.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?!\\p{L})', 'gu'),
                    short
                ]);
        }
        for (const [re, short] of abbrevRules) t = t.replace(re, short);
        return t;
    }

    function untisTopicText(i) {
        const c = contentOf(i);
        const lb = (window.BADGE[c.type] || [])[1];
        const head = [lb, c.u].filter(Boolean).join(', ');
        const base = ((c.topic || '') + (head ? ' (' + head + ')' : '')).replace(/\s+/g, ' ').trim();
        const details = (c.details || []).filter(Boolean)
            .map(d => String(d).replace(/\s+/g, ' ').trim());
        return untisFit(base, details);
    }

    /* Auf 250 Zeichen bringen, in drei Stufen - jede greift erst, wenn die
       vorige nicht gereicht hat, damit so wenig wie moeglich verlorengeht:
         1. voller Text, ausgeschrieben
         2. Abkuerzungen (Wiederholung -> Wdh.) - kostet Lesbarkeit, kein Inhalt
         3. ganze Schritte vom Ende weglassen, " …" sagt, dass noch etwas kommt
       Frueher schnitt ein hartes slice(250) mitten im Wort ab.
       Muss zeichengleich zu topicText() in tools/webuntis.js bleiben. */
    function untisFit(base, details) {
        const build = (b, d, n) => n ? b + ': ' + d.slice(0, n).join(' · ') : b;

        const full = build(base, details, details.length);
        if (full.length <= UNTIS_MAX) return full;                 /* 1 */

        const aBase = untisAbbrev(base), aDet = details.map(untisAbbrev);
        const aFull = build(aBase, aDet, aDet.length);
        if (aFull.length <= UNTIS_MAX) return aFull;               /* 2 */

        let t = aBase, used = 0;                                   /* 3 */
        for (let k = 0; k < aDet.length; k++) {
            const cand = build(aBase, aDet, k + 1);
            if (cand.length > UNTIS_MAX) break;
            t = cand; used = k + 1;
        }
        if (used < aDet.length) t += ' …';
        /* Notnagel: schon das Thema allein ist zu lang - an der letzten
           Wortgrenze kappen, nicht im Wort. */
        if (t.length > UNTIS_MAX) {
            t = t.slice(0, UNTIS_MAX - 2);
            t = t.slice(0, Math.max(t.lastIndexOf(' '), 1)).trim() + ' …';
        }
        return t;
    }

    const WDAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    function untisDay(ymd) {
        const d = new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8));
        return WDAY[d.getDay()] + ' ' + ymd.slice(6, 8) + '.' + ymd.slice(4, 6) + '.';
    }

    /* Dialog fuer eine Kalenderwoche: Text links, die Stunden dieser Woche
       rechts. Der Stand kommt LIVE aus WebUntis, nicht aus der .untis.json -
       die ist nur der Aufhaenger (Datumsbereich + Klassen der Seite) und kann
       Tage alt sein. */
    /* Dialog fuer eine Kalenderwoche: eine Editbox und "Send now". Mehr soll
       da nicht stehen (Doc, 30.08.2026) - der Stundeninhalt wird eingetippt
       oder liegt schon fertig da, und dann geht er raus. Die Stunden, in die
       geschrieben wird, stehen als eine Zeile darunter; angekreuzt wird nur
       dort, wo schon etwas ANDERES drinsteht - eine Handkorrektur in WebUntis
       darf nie stillschweigend sterben. Der Stand kommt live aus WebUntis,
       nicht aus der .untis.json - die ist nur der Aufhaenger (Datumsbereich +
       Klassen der Seite) und kann Tage alt sein. */
    function untisDialog(ref, entries, chip, data, url) {
        const dates = entries.map(e => e.date).sort();
        const from = dates[0], to = dates[dates.length - 1];
        const classes = (data && data.classes) || [];

        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card untis-card">' +
            '  <div class="svp-gate-title">WebUntis &middot; Klassenbuch</div>' +
            '  <div class="svp-gate-sub">KW ' + ref.kw + ' &middot; ' + untisDay(from) +
            (from !== to ? '&ndash;' + untisDay(to) : '') + '</div>' +
            '  <textarea id="untis-text" class="untis-text" rows="4" aria-label="Stundeninhalt"' +
            '            maxlength="' + UNTIS_MAX + '"></textarea>' +
            '  <div class="untis-count"><span id="untis-n">0</span>/' + UNTIS_MAX + '</div>' +
            '  <div class="untis-targets" id="untis-targets">Stunden werden geladen &hellip;</div>' +
            '  <div class="svp-gate-row">' +
            '    <button type="button" class="action secondary" id="untis-cancel">Abbrechen</button>' +
            '    <button type="button" class="action" id="untis-go" disabled>Send now</button>' +
            '  </div>' +
            '  <div class="svp-gate-err" id="untis-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);

        const ta = overlay.querySelector('#untis-text');
        const counter = overlay.querySelector('#untis-n');
        const targets = overlay.querySelector('#untis-targets');
        const err = overlay.querySelector('#untis-err');
        const go = overlay.querySelector('#untis-go');

        ta.value = untisTopicText(ref.i);
        const countUp = () => { counter.textContent = String(ta.value.length); };
        countUp();
        ta.addEventListener('input', countUp);

        function close() {
            document.removeEventListener('keydown', onKey, true);
            overlay.remove();
        }
        function onKey(ev) {
            if (ev.key === 'Escape') { ev.preventDefault(); close(); }
            /* Cmd/Ctrl+Enter schickt los - Enter allein gehoert der Textarea. */
            else if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey) && !go.disabled) { ev.preventDefault(); send(); }
        }
        document.addEventListener('keydown', onKey, true);
        overlay.querySelector('#untis-cancel').addEventListener('click', close);
        overlay.addEventListener('click', ev => { if (ev.target === overlay) close(); });

        function label(l) { return l.klassen.join(',') + ' ' + untisDay(l.date) + ' ' + l.start; }

        /* Eine Zeile je Stunde nur dort, wo es etwas zu entscheiden gibt.
           Freie Stunden zaehlt eine einzige Zeile zusammen. */
        let free = [], busy = [], locked = [];
        untisCall({ action: 'lessons', from: from, to: to }).then(res => {
            const mine = (res.lessons || []).filter(l =>
                !classes.length || l.klassen.some(k => classes.indexOf(k) >= 0));
            if (!mine.length) { targets.textContent = 'Keine passende Stunde in dieser Woche.'; return; }
            locked = mine.filter(l => !l.writable);
            free = mine.filter(l => l.writable && !l.topic.trim());
            busy = mine.filter(l => l.writable && l.topic.trim());
            targets.textContent = '';

            if (free.length) {
                const line = document.createElement('div');
                line.className = 'untis-go-line';
                line.textContent = '→ ' + free.map(label).join('  ·  ');
                targets.appendChild(line);
            }
            /* Belegte Stunden: nur mit ausdruecklichem Haken ueberschreiben. */
            busy.forEach(l => {
                const row = document.createElement('label');
                row.className = 'untis-row';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                const txt = document.createElement('span');
                txt.className = 'untis-state is-set';
                txt.textContent = label(l) + ' — steht: ' + l.topic;
                row.appendChild(cb); row.appendChild(txt);
                targets.appendChild(row);
                l._cb = cb; l._state = txt;
            });
            locked.forEach(l => {
                const row = document.createElement('div');
                row.className = 'untis-row is-locked';
                row.textContent = label(l) + ' — kein Schreibrecht';
                targets.appendChild(row);
            });
            if (!free.length && !busy.length) targets.appendChild(document.createTextNode('Nichts zu schreiben.'));
            go.disabled = false;
        }).catch(e => { targets.textContent = ''; err.textContent = e.message; });

        async function send() {
            const text = ta.value.replace(/\s+/g, ' ').trim();
            if (!text) { err.textContent = 'Text ist leer.'; return; }
            const picked = free.concat(busy.filter(l => l._cb && l._cb.checked));
            if (!picked.length) {
                err.textContent = busy.length
                    ? 'Alle Stunden sind belegt — zum Überschreiben ankreuzen.'
                    : 'Keine Stunde zum Schreiben.';
                return;
            }
            go.disabled = true;
            err.textContent = 'Schicke …';
            let done = 0, failed = [];
            for (const l of picked) {
                try {
                    /* force nur, wo Doc den Haken gesetzt hat. */
                    const res = await untisCall({
                        action: 'write', ttId: l.ttId, topic: text, force: !!l.topic.trim()
                    });
                    l.topic = res.stored || text;
                    if (l._state) { l._state.textContent = label(l) + ' — eingetragen ✓'; l._state.className = 'untis-state is-ok'; }
                    if (l._cb) { l._cb.checked = false; l._cb.disabled = true; }
                    /* Chip-Stand mitziehen, damit er nicht bis zum naechsten
                       tools/webuntis.js status veraltet dasteht. */
                    const hit = entries.find(e => e.date === l.date && e.start === l.start);
                    if (hit) { hit.written = true; hit.text = l.topic; }
                    untisEchoPut(l.date, l.start, l.topic);   /* ueberlebt den Reload */
                    done++;
                } catch (e) {
                    failed.push(label(l) + ': ' + e.message);
                }
            }
            free = free.filter(l => !l.topic.trim());
            const anyWritten = entries.some(e => e.written);
            chip.className = 'untis-chip ' +
                (entries.every(e => e.written) ? 'is-full' : anyWritten ? 'is-part' : 'is-none');
            chip.title = untisTitle(entries, data.generated);
            if (failed.length) { err.textContent = failed.join(' | '); go.disabled = false; return; }
            err.textContent = done + ' Stunde' + (done === 1 ? '' : 'n') + ' eingetragen ✓';
            setTimeout(close, 900);   /* Erfolg kurz zeigen, dann aus dem Weg */
        }
        go.addEventListener('click', send);
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
    }

    /* ---- Lokales Echo des Chip-Stands ------------------------------------
       Der Chip liest <plan>.untis.json - eine Datei, die nur
       "tools/webuntis.js status" auf Docs Rechner erzeugt. Was der Dialog
       gerade nach WebUntis geschrieben hat, steht dort noch nicht drin: der
       Chip wurde im Moment des Sendens orange und war nach dem naechsten
       Reload wieder weiss (Doc, 30.08.2026 - der Text stand da laengst drin).
       Der Browser kann die Datei nicht schreiben, also merkt sich die Seite
       ihre eigenen Schreibvorgaenge lokal und legt sie darueber.
       Aufraeum-Regel: sobald die Datei JUENGER ist als das Echo, gewinnt die
       Datei und das Echo fliegt raus. Sonst wuerde eine Stunde, die Doc in
       WebUntis wieder geleert hat, hier ewig als eingetragen leuchten. */
    const UNTIS_ECHO_KEY = 'svp-untis-echo:' + location.pathname;

    function untisEchoLoad() {
        try { return JSON.parse(localStorage.getItem(UNTIS_ECHO_KEY)) || {}; } catch (e) { return {}; }
    }
    function untisEchoPut(date, start, text) {
        const map = untisEchoLoad();
        map[date + ' ' + start] = { text: text, ts: Date.now() };
        try { localStorage.setItem(UNTIS_ECHO_KEY, JSON.stringify(map)); } catch (e) { }
    }
    function untisEchoMerge(data) {
        const map = untisEchoLoad();
        const fileTs = data.generated ? Date.parse(data.generated) : 0;
        let dirty = false;
        for (const kw of Object.keys(data.weeks || {})) {
            for (const e of data.weeks[kw]) {
                const key = e.date + ' ' + e.start, rec = map[key];
                if (!rec) continue;
                if (fileTs && fileTs > rec.ts) { delete map[key]; dirty = true; continue; }
                e.written = true;
                e.text = rec.text;
            }
        }
        if (dirty) { try { localStorage.setItem(UNTIS_ECHO_KEY, JSON.stringify(map)); } catch (e) { } }
    }

    function decorateUntis(data) {
        untisEchoMerge(data);
        const weeks = (data && data.weeks) || {};
        const url = data && data.webuntis;
        for (const r of rendered) {
            if (!r.lbTd) continue;
            const entries = weeks[String(r.kw)];
            if (!entries || !entries.length) continue;
            const done = entries.filter(e => e.written).length;
            const chip = document.createElement('span');
            chip.className = 'untis-chip ' +
                (done === entries.length ? 'is-full' : done ? 'is-part' : 'is-none');
            chip.appendChild(untisMark());
            chip.title = untisTitle(entries, data.generated);
            chip.addEventListener('click', function (ev) {
                ev.stopPropagation(); /* not the row's detail toggle */
                /* Der Chip zeigt immer an, handelt aber nur im Bearbeiten. */
                if (!document.body.classList.contains('editing')) return;
                untisDialog(r, entries, chip, data, url);
            });
            (r.lbCell || r.lbTd).appendChild(chip);
        }
        /* Die Chips kommen erst nach dem Rendern dazu und koennen eine Zelle
           breiter machen - also nochmal ausgleichen. */
        equalizeLbCells();
    }

    (function loadUntis() {
        const src = location.pathname.replace(/\.html$/, '.untis.json');
        if (src === location.pathname) return;
        fetch(src, { cache: 'no-store' })
            .then(res => (res.ok ? res.json() : null))
            .then(data => { if (data) decorateUntis(data); })
            .catch(() => { /* keine Statusdatei: Plan bleibt unverändert */ });
    })();

    // Legend: replace the static dot list with the same pills as the
    // Bereich column, generated from the page's BADGE definition.
    const legend = document.querySelector('.toolbar .legend');
    if (legend) {
        legend.textContent = '';
        for (const key in window.BADGE) {
            const [cls, label] = window.BADGE[key];
            const alts = window.ALT_BADGES && window.ALT_BADGES[key];

            // Bereich with variants (window.ALT_BADGES[key] = [[label, pdfPage],
            // ...]): one pill with a caret that opens a dropdown — chosen
            // variant first, then the alternatives, each deep-linking into the
            // Lehrplan PDF.
            if (alts && window.LB_INFO && window.LB_INFO.pdf) {
                const wrap = document.createElement('span');
                wrap.className = 'badge-drop';

                const pill = document.createElement('span');
                pill.className = 'badge ' + cls;
                pill.textContent = label + ' ▾';
                pill.title = 'Varianten anzeigen';
                pill.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const wasOpen = wrap.classList.contains('open');
                    document.querySelectorAll('.badge-drop.open')
                        .forEach(d => d.classList.remove('open'));
                    wrap.classList.toggle('open', !wasOpen);
                });
                wrap.appendChild(pill);

                const menu = document.createElement('div');
                menu.className = 'drop-menu';
                const entries = [[label + ' ✓', lbPdfLink(key) || window.LB_INFO.pdf, true]].concat(
                    alts.map(([l, p]) => [l, window.LB_INFO.pdf + '#page=' + p, false]));
                for (const [entryLabel, href, chosen] of entries) {
                    const item = document.createElement('span');
                    item.className = 'badge badge-link ' + cls + (chosen ? ' chosen' : '');
                    item.textContent = entryLabel;
                    item.title = (chosen ? 'Gewählte Variante' : 'Nicht gewählte Variante') +
                        ' — Lehrplan (PDF) an dieser Stelle öffnen';
                    item.addEventListener('click', function () { window.open(href, '_blank'); });
                    menu.appendChild(item);
                }
                wrap.appendChild(menu);
                legend.appendChild(wrap);
                continue;
            }

            const pill = document.createElement('span');
            pill.className = 'badge ' + cls;
            pill.textContent = label;
            linkBadge(pill, key);
            legend.appendChild(pill);
        }

        // Any click outside closes open variant dropdowns.
        document.addEventListener('click', function () {
            document.querySelectorAll('.badge-drop.open')
                .forEach(d => d.classList.remove('open'));
        });
    }

    function setAllDetails(open) {
        document.querySelectorAll('tr.detail-row').forEach(r => {
            r.classList.toggle('open', open);
            r.previousElementSibling.classList.toggle('open', open);
        });
        syncOpenWeeks();
    }

    // Toolbar helper: expand/collapse all detail rows at once.
    window.togglePlanDetails = function () {
        const rows = Array.from(document.querySelectorAll('tr.detail-row'));
        setAllDetails(rows.some(r => !r.classList.contains('open')));
    };

    // Cells that may contain $...$ math (detail lis queried live — edit mode
    // can add new ones via Enter inside the contenteditable ul).
    function eachMathCandidate(fn) {
        for (const r of rendered) {
            if (r.topicSpan) fn(r.topicSpan);
            if (r.remarkTd) fn(r.remarkTd);
            if (r.ul) r.ul.querySelectorAll('li').forEach(fn);
        }
    }

    function setEditable(on) {
        const flag = on ? 'true' : 'false';
        for (const r of rendered) {
            // Material is deliberately NOT edited as raw text here: the pills
            // in the sub-row have their own ✕ while editing, and new links go
            // through the + dialog. A long SharePoint URL in this cell used to
            // blow the table far past the window.
            for (const el of [r.ferienTd, r.dateTd, r.uTd, r.topicSpan, r.remarkTd, r.ul]) {
                if (el) el.setAttribute('contenteditable', flag);
            }
        }
        // While editing show the raw $...$ source; on exit re-render from the
        // (possibly edited) text. saveEdits runs before this, so it saves raw.
        eachMathCandidate(el => {
            if (on) {
                if (el.dataset.src != null) el.textContent = el.dataset.src;
            } else {
                setMathText(el, el.textContent);
            }
        });
    }

    function saveEdits() {
        const out = {};
        for (const r of rendered) {
            if (r.ferienTd) {
                out[r.i] = { ferien: r.ferienTd.textContent.trim() };
            } else {
                const entry = {
                    nr: r.nr,
                    kw: r.kw,
                    type: r.type,
                    date: r.dateTd.textContent.trim(),
                    u: r.uTd.textContent.trim(),
                    topic: r.topicSpan.textContent.trim(),
                    remark: r.remarkTd.textContent.trim()
                };
                /* Material and Bullets are always written, even when empty:
                   a missing key means "not overridden", and the renderer would
                   fall back to the page's PLAN — so an emptied week would get
                   the original row's bullets back (that is what hid the ▲). */
                entry.material = r.matTd ? (r.matTd.dataset.src || '').trim() : '';
                /* same for the MAP-only fields: no form owns them, so carry
                   over whatever a shift last put there */
                const vorher = saved[r.i] || {};
                ['ziel', 'mth', 'med', 'lnw'].forEach(function (k) {
                    if (vorher[k] != null) entry[k] = vorher[k];
                });
                entry.details = r.ul
                    ? Array.from(r.ul.querySelectorAll('li'))
                        .map(li => li.textContent.trim())
                        .filter(t => t.length)
                    : [];  /* no sub-row rendered = no bullets on screen */
                out[r.i] = entry;
            }
        }
        localStorage.setItem(KEY, JSON.stringify(out));
        localStorage.setItem(TS_KEY, new Date().toISOString());
        pushRemote();
    }

    // --- Edit gate: "✎ Bearbeiten" asks for the SVP passphrase once per ---
    // browser. Same rule as svp-gate.js: only the SHA-256 hash lives in the
    // code (public repo), never the passphrase itself.
    const EDIT_HASH = '517ac27fb0b499ddd50da49532cc40d47d4d36a9a49a43e1558f16eec5cbeda4';
    const EDIT_KEY = 'svp-edit-gate';

    function editUnlocked() {
        try { return localStorage.getItem(EDIT_KEY) === EDIT_HASH; } catch (e) { return false; }
    }

    async function editSha256hex(text) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Styled dialog (never a native prompt), reusing the svp-gate overlay CSS.
    function askEditPwd(onOk) {
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">Doc Alvers &middot; SVP</div>' +
            '  <div class="svp-gate-sub">Bitte Passwort eingeben</div>' +
            '  <input type="password" id="svp-edit-pwd" aria-label="Passwort" autocomplete="current-password">' +
            '  <button type="button" class="action" id="svp-edit-go">Freischalten</button>' +
            '  <div class="svp-gate-err" id="svp-edit-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);

        const input = overlay.querySelector('#svp-edit-pwd');
        const err = overlay.querySelector('#svp-edit-err');

        async function tryUnlock() {
            const hex = await editSha256hex(input.value);
            if (hex === EDIT_HASH) {
                try { localStorage.setItem(EDIT_KEY, EDIT_HASH); } catch (e) { }
                overlay.remove();
                onOk();
            } else {
                err.textContent = 'Leider nein — nochmal probieren.';
                input.value = '';
                input.focus();
            }
        }

        overlay.querySelector('#svp-edit-go').addEventListener('click', tryUnlock);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
        // Click on the dark backdrop (not the card) cancels.
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        input.focus();
    }

    // Run fn immediately if unlocked, otherwise after a successful password.
    function withEditGate(fn) {
        if (editUnlocked()) fn(); else askEditPwd(fn);
    }

    /* After a login from the edit button the page reloads (material tools and cloud
       save are wired at load time) and continues straight into edit mode. */
    const EDIT_AFTER_LOGIN = 'svp-edit-after-login';

    window.togglePlanEdit = function (btn) {
        if (!document.body.classList.contains('editing') && window.svpAuth && !svpAuth.hasSession()) {
            svpAuth.loginDialog(function () {
                try { sessionStorage.setItem(EDIT_AFTER_LOGIN, '1'); } catch (e) { }
                location.reload();
            });
            return;
        }
        if (!document.body.classList.contains('editing') && !editUnlocked()) {
            askEditPwd(() => window.togglePlanEdit(btn));
            return;
        }
        const editing = document.body.classList.toggle('editing');
        if (editing) {
            setAllDetails(true);
        } else {
            saveEdits();
        }
        setEditable(editing);
        if (!editing) setShiftMode(false); /* the arrows belong to edit mode */
        if (btn) btn.textContent = editing ? '✔ Speichern' : '✎ Bearbeiten';
        if (cancelBtn) cancelBtn.hidden = !editing;
    };

    /* "Abbrechen": leave edit mode WITHOUT saving. Nothing was written yet —
       saveEdits only runs on "Speichern" — so a reload restores the last saved
       state. The unload guard has to stay quiet, otherwise the safety net would
       persist exactly the changes we are throwing away. */
    let cancelBtn = null;
    (function () {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const editBtn = [...bar.querySelectorAll('button')]
            .find(function (b) { return /Bearbeiten/.test(b.textContent); });
        cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'action secondary plan-cancel';
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.title = 'Bearbeiten beenden und Änderungen verwerfen';
        cancelBtn.hidden = true;
        cancelBtn.addEventListener('click', function () {
            skipUnloadSave = true;
            location.reload();
        });
        if (editBtn) bar.insertBefore(cancelBtn, editBtn.nextSibling);
        else bar.appendChild(cancelBtn);
        /* came back from the login dialog → continue into edit mode */
        let resume = false;
        try { resume = sessionStorage.getItem(EDIT_AFTER_LOGIN) === '1'; sessionStorage.removeItem(EDIT_AFTER_LOGIN); } catch (e) { }
        if (resume && editBtn && window.svpAuth && svpAuth.hasSession()) window.togglePlanEdit(editBtn);
    })();

    // Two-click confirm (no native dialogs): first click arms the button, second click resets.
    // Reset throws away every edit of this page — dates, topics, remarks,
    // bullets AND the material links, locally and (when logged in) in the
    // cloud, without any way back. So: only reachable in edit mode, and
    // guarded by two dialogs, the second one asking to type the word out.
    function doReset() {
        skipUnloadSave = true; /* mute the beforeunload safety net, see below */
        localStorage.removeItem(KEY);
        localStorage.removeItem(TS_KEY);
        const done = () => location.reload();
        if (window.svpAuth && svpAuth.hasSession()) {
            svpAuth.api('svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname), { method: 'DELETE' })
                .catch(() => {}).then(done, done);
        } else done();
    }

    // What exactly is at stake? Counted from the stored edits object.
    function resetScope() {
        let wochen = 0, links = 0, felder = 0;
        for (const k in saved) {
            const e = saved[k] || {};
            const keys = Object.keys(e);
            if (!keys.length) continue;
            wochen++;
            felder += keys.length;
            links += ((e.material || '').match(/https?:\/\//g) || []).length;
        }
        return { wochen, links, felder };
    }

    // Shared shell for both warning dialogs (same look as the material modal).
    function dangerDialog(titel, bauInhalt) {
        closeMatModal();
        const wrap = document.createElement('div');
        wrap.className = 'mat-modal-wrap';
        const box = document.createElement('div');
        box.className = 'mat-modal mm-danger';
        const h = document.createElement('div');
        h.className = 'mm-title mm-warn';
        h.textContent = titel;
        box.appendChild(h);
        bauInhalt(box, function close() { closeMatModal(); });
        wrap.addEventListener('click', e => { if (e.target === wrap) closeMatModal(); });
        wrap.addEventListener('keydown', e => { if (e.key === 'Escape') closeMatModal(); });
        wrap.appendChild(box);
        document.body.appendChild(wrap);
        matModal = wrap;
        return box;
    }

    function resetSchritt2() {
        const WORT = 'LÖSCHEN';
        dangerDialog('⚠ Letzte Warnung', function (box) {
            const info = document.createElement('div');
            info.className = 'mm-info';
            info.innerHTML = 'Das lässt sich <b>nicht</b> rückgängig machen — es gibt keine ältere Version.' +
                (window.svpAuth && svpAuth.hasSession()
                    ? '<br>Du bist angemeldet: die Löschung wirkt auch auf deinen anderen Geräten.'
                    : '<br>Du bist abgemeldet: gelöscht wird nur dieser Browser.');
            box.appendChild(info);

            const frage = document.createElement('div');
            frage.className = 'mm-info';
            frage.innerHTML = 'Tippe <b>' + WORT + '</b>, um es wirklich zu tun.';
            box.appendChild(frage);

            const eingabe = document.createElement('input');
            eingabe.type = 'text';
            eingabe.setAttribute('aria-label', 'Zum Bestätigen ' + WORT + ' eintippen');
            eingabe.placeholder = WORT;
            box.appendChild(eingabe);

            const btns = document.createElement('div');
            btns.className = 'mm-btns';
            const ab = document.createElement('button');
            ab.type = 'button';
            ab.className = 'mm-btn';
            ab.textContent = 'Abbrechen';
            ab.addEventListener('click', closeMatModal);
            const ok = document.createElement('button');
            ok.type = 'button';
            ok.className = 'mm-btn danger';
            ok.textContent = 'Endgültig löschen';
            ok.disabled = true;
            const pruefe = () => { ok.disabled = eingabe.value.trim().toUpperCase() !== WORT; };
            eingabe.addEventListener('input', pruefe);
            eingabe.addEventListener('keydown', e => { if (e.key === 'Enter' && !ok.disabled) doReset(); });
            ok.addEventListener('click', doReset);
            btns.appendChild(ab);
            btns.appendChild(ok);
            box.appendChild(btns);
            setTimeout(() => eingabe.focus(), 0);
        });
    }

    window.resetPlanEdits = function () {
        const s = resetScope();
        dangerDialog('⚠ Alle Änderungen dieser Seite verwerfen?', function (box) {
            const info = document.createElement('div');
            info.className = 'mm-info';
            info.innerHTML = s.wochen
                ? 'Betroffen: <b>' + s.wochen + (s.wochen === 1 ? ' geänderte Woche' : ' geänderte Wochen') +
                  '</b> mit ' + s.felder + ' bearbeiteten Feldern' +
                  (s.links ? ' und <b>' + s.links + (s.links === 1 ? ' Material-Link' : ' Material-Links') + '</b>' : '') +
                  '.<br>Danach steht der Plan wieder auf dem einprogrammierten Stand.'
                : 'Auf dieser Seite ist nichts gespeichert — es gibt nichts zu verwerfen.';
            box.appendChild(info);

            const btns = document.createElement('div');
            btns.className = 'mm-btns';
            const ab = document.createElement('button');
            ab.type = 'button';
            ab.className = 'mm-btn';
            ab.textContent = 'Abbrechen';
            ab.addEventListener('click', closeMatModal);
            btns.appendChild(ab);
            if (s.wochen) {
                const weiter = document.createElement('button');
                weiter.type = 'button';
                weiter.className = 'mm-btn danger';
                weiter.textContent = 'Weiter …';
                weiter.addEventListener('click', resetSchritt2);
                btns.appendChild(weiter);
            }
            box.appendChild(btns);
        });
    };

    /* The button lives in each page's toolbar; tagging it here keeps the
       pages untouched. CSS shows it only while editing. */
    document.querySelectorAll('button[onclick*="resetPlanEdits"]')
        .forEach(b => b.classList.add('plan-reset'));

    // --- Verschieben: move the plan's contents by whole weeks --------------
    // Klassenfahrt, Praktikum, Ausfall: the calendar stays where it is — KW,
    // Datum and the date-bound remarks belong to the week, not to the subject
    // matter. Only the content travels. Whatever is pushed past the last week
    // is appended as extra weeks; that stuff lands in the next school year,
    // and saying so out loud beats dropping it silently.

    /* Remarks are a mixed bag: some describe the calendar ("Mi 18.11. Buß- und
       Bettag", "nur Mo/Di", "Fr 09.07. letzter Schultag"), others the content
       ("LB 2 abgeschlossen", "Termin nach Klausurplan"). Calendar ones stay on
       their week, the rest travels with the topic. Split first: a remark that
       carries both halves ("nur Mi–Fr; Termin nach Klausurplan") is classified
       per part, otherwise the calendar half would pin the content half down and
       shifting back would not restore the original. */
    const CAL_REMARK = /\d{1,2}\.\d{1,2}\.|ferien|unterrichtsfrei|feiertag|zeugnis|schultag|^nur\s/i;
    const NEXT_YEAR = '→ nächstes Schuljahr';

    function effVal(i, key) {
        const ov = saved[i] || {}, row = planRows[i] || {};
        return ov[key] != null ? ov[key] : row[key];
    }
    function isFerienRow(i) { return !!effVal(i, 'ferien'); }

    function weekSlots() {
        const out = [];
        for (let i = 0; i < planRows.length; i++) if (!isFerienRow(i)) out.push(i);
        return out;
    }

    function splitRemark(text) {
        const teile = String(text || '').split(/\s*[·;]\s*/).map(function (t) { return t.trim(); });
        const bleibt = [], wandert = [];
        teile.forEach(function (t) { if (t) (CAL_REMARK.test(t) ? bleibt : wandert).push(t); });
        return { bleibt: bleibt.join(' · '), wandert: wandert.join(' · ') };
    }

    function contentOf(i) {
        const ov = saved[i] || {}, row = planRows[i] || {};
        return {
            type: effVal(i, 'type') || 'org',
            u: effVal(i, 'u') || '',
            topic: effVal(i, 'topic') || '',
            remark: effVal(i, 'remark') || '',
            details: (ov.details || row.details || []).slice(),
            material: (ov.material != null ? ov.material : row.material) || '',
            /* MAP-only fields (Modulablaufplan): not shown in the table, but
               they describe the content, so they travel with it */
            ziel: effVal(i, 'ziel'),
            mth: effVal(i, 'mth'),
            med: effVal(i, 'med'),
            lnw: effVal(i, 'lnw')
        };
    }
    /* A freed week is really empty: every field is cleared, nothing of the
       old content stays visible and nothing can creep back from the page's
       PLAN (a missing key would mean "not overridden"). */
    function emptyContent() {
        return {
            type: 'org', u: '', topic: '', remark: '', details: [], material: '',
            ziel: '', mth: '', med: '', lnw: ''
        };
    }
    function isEmptyContent(c) {
        if (!c) return true;
        return !(c.details || []).length && !c.material && !c.u && !c.remark &&
            (!c.topic || c.topic === '—' || c.topic === '-');
    }

    // Fired by the dialog. Either way the *selected* week is the one that
    // moves: delta > 0 pushes it (and everything after it) to a later week and
    // frees its slot, delta < 0 pulls it back onto the free week(s) in front of
    // it. Returns null on success, else a reason to show in the dialog.
    function applyShift(fromIndex, delta) {
        const slots = weekSlots();
        const pos = slots.indexOf(fromIndex);
        if (pos < 0 || !delta) return 'Woche nicht gefunden.';

        const teile = slots.map(function (i) { return splitRemark(contentOf(i).remark); });
        const stay = teile.map(function (t) { return t.bleibt; });
        const moving = slots.map(function (i, k) {
            const c = contentOf(i);
            c.remark = teile[k].wandert;
            return c;
        });

        let next;
        if (delta > 0) {
            next = moving.slice(0, pos);
            for (let d = 0; d < delta; d++) next.push(emptyContent());
            next = next.concat(moving.slice(pos));
        } else {
            /* Pulling up swallows the weeks in front of the cursor — only
               allowed when they are empty, otherwise a topic would quietly
               disappear. */
            const raus = -delta;
            if (pos - raus < 0) return 'Davor liegen nicht genug Wochen.';
            for (let d = 1; d <= raus; d++) {
                if (!isEmptyContent(moving[pos - d])) {
                    return 'Die Woche davor ist nicht leer — dorthin l\u00e4sst sich nichts hochziehen.';
                }
            }
            next = moving.slice(0, pos - raus).concat(moving.slice(pos));
            while (next.length < moving.length) next.push(emptyContent());
        }

        /* Content ran past the last week: grow the table. Those rows exist only
           in the edits object, planRows covers them on the next load. */
        let angehaengt = 0;
        while (next.length > slots.length) {
            const idx = planRows.length;
            planRows.push({ nr: 0, kw: '', date: NEXT_YEAR, type: 'org', u: '', topic: '', remark: '', details: [] });
            slots.push(idx);
            angehaengt++;
        }

        let nr = 0;
        slots.forEach(function (i, k) {
            const c = next[k] || emptyContent();
            const remark = [stay[k] || '', c.remark || ''].filter(Boolean).join(' · ');
            const entry = {
                nr: ++nr,
                kw: effVal(i, 'kw') != null ? effVal(i, 'kw') : '',
                date: effVal(i, 'date') != null ? effVal(i, 'date') : '',
                type: c.type,
                u: c.u,
                topic: c.topic,
                remark: remark,
                details: c.details
            };
            entry.material = c.material || '';
            /* always written, even empty — see emptyContent() */
            ['ziel', 'mth', 'med', 'lnw'].forEach(function (k) {
                entry[k] = c[k] != null ? c[k] : '';
            });
            saved[i] = entry;
        });

        /* Undo case: trailing extra weeks that ended up empty go away again. */
        for (let i = planRows.length - 1; i >= window.PLAN.length; i--) {
            if (isEmptyContent(saved[i])) delete saved[i]; else break;
        }

        localStorage.setItem(KEY, JSON.stringify(saved));
        localStorage.setItem(TS_KEY, new Date().toISOString());
        skipUnloadSave = true; /* the reload must not resurrect the old table */
        const done = function () { location.reload(); };
        const p = pushRemote();
        if (p && p.then) p.then(done, done); else done();
        return null;
    }

    /* Is the week before this one free? Only then may a week be pulled up. */
    function freeSlotBefore(i) {
        const slots = weekSlots();
        const pos = slots.indexOf(i);
        return pos > 0 && isEmptyContent(contentOf(slots[pos - 1]));
    }

    let shiftMode = false;

    /* The arrows live in an extra leading column. It is part of the table all
       the time (simpler than rebuilding rows), so switching the mode only
       toggles visibility — plus the colSpans of the rows that span everything:
       holiday rows and the spacer of the detail rows. */
    function setShiftMode(on) {
        shiftMode = !!on;
        document.body.classList.toggle('shifting', shiftMode);
        document.querySelectorAll('#plan-table tr.ferien > td')
            .forEach(function (td) { td.colSpan = shiftMode ? 9 : 8; });
        document.querySelectorAll('#plan-table tr.detail-row > td:first-child')
            .forEach(function (td) { td.colSpan = shiftMode ? 6 : 5; });
        rendered.forEach(function (r) {
            if (r.upBtn) r.upBtn.hidden = !(shiftMode && freeSlotBefore(r.i));
        });
        if (shiftBtn) shiftBtn.classList.toggle('on', shiftMode);
        if (!shiftMode) setShiftMsg('');
    }

    let shiftMsgEl = null;
    function setShiftMsg(text) {
        if (!shiftMsgEl) return;
        shiftMsgEl.textContent = text || '';
        shiftMsgEl.hidden = !text;
    }

    function runShift(i, delta) {
        const grund = applyShift(i, delta);
        if (grund) setShiftMsg(grund); /* applyShift reloads on success */
    }

    /* Same deal as the reset button: only reachable in edit mode, and built
       here so the plan pages themselves stay untouched. */
    let shiftBtn = null;
    (function () {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        shiftBtn = document.createElement('button');
        shiftBtn.type = 'button';
        shiftBtn.className = 'action plan-shift';
        /* tiny stacked ▲▼ instead of an arrow glyph — same symbols as the
           column, so the button shows what it switches on */
        shiftBtn.innerHTML = '<span class="shift-ico"><i>▲</i><i>▼</i></span>Verschieben';
        shiftBtn.title = 'Wochen verschieben: Pfeile vor der Nr.';
        shiftBtn.addEventListener('click', function () { setShiftMode(!shiftMode); });
        shiftMsgEl = document.createElement('span');
        shiftMsgEl.className = 'shift-msg';
        shiftMsgEl.hidden = true;
        const reset = bar.querySelector('button.plan-reset');
        if (reset) { bar.insertBefore(shiftBtn, reset); bar.insertBefore(shiftMsgEl, reset); }
        else { bar.appendChild(shiftBtn); bar.appendChild(shiftMsgEl); }
    })();

    function structurallyDiffers(map) {
        for (const k in map) if (Number(k) >= planRows.length) return true;
        for (const r of rendered) {
            if (r.ferienTd) continue;
            const ov = map[r.i] || {};
            if (ov.type && ov.type !== r.type) return true;
            if (ov.nr != null && String(ov.nr) !== String(r.nr)) return true;
        }
        return false;
    }

    // Safety net: persist pending edits when the tab closes mid-edit.
    // Skipped while resetting/shifting: those reload out of edit mode, and
    // saving there would write the old table straight back (locally and to the
    // cloud) — which is what made "Zurücksetzen" a no-op.
    window.addEventListener('beforeunload', () => {
        if (skipUnloadSave) return;
        if (document.body.classList.contains('editing')) saveEdits();
    });

    // --- Supabase sync (table svp_plan_edits, RLS owner-only) ------------
    // Reuses the svp-session login from notes.html (shared svp-auth.js).
    // Logged out: local-only, exactly as before. Logged in: whole edits
    // object is synced per page, last write wins by timestamp (TS_KEY).
    const TS_KEY = 'svp-edits-ts:' + location.pathname;
    const cloudEl = document.createElement(window.svpAuth && svpAuth.hasSession() ? 'span' : 'a');
    cloudEl.className = 'cloud';
    (function () {
        if (cloudEl.tagName === 'A') {
            cloudEl.href = '../notes.html';
            cloudEl.textContent = '☁ lokal';
            cloudEl.title = 'Edits nur in diesem Browser — für Cloud-Sync über die Notizen-Seite anmelden';
        }
        // Deliberately NOT placed in the quick-nav any more (Doc, 23.08.2026):
        // the status pill said little that the Login/Logout pill does not
        // already tell. The element stays alive so setCloud() keeps working —
        // appending it somewhere is all it takes to bring the display back.
    })();

    function setCloud(text, ok) {
        if (cloudEl.tagName === 'A') return; /* logged out: keep the login hint */
        cloudEl.textContent = text;
        cloudEl.classList.toggle('on', !!ok);
    }

    // Re-applies an edits object to the already rendered table (remote wins).
    function applyEdits(map) {
        /* Badges, numbers and the row count are baked into the DOM at render
           time, so a structurally different state — someone shifted the plan on
           another device — needs a real reload, not a text update. */
        if (structurallyDiffers(map)) { skipUnloadSave = true; location.reload(); return; }
        for (const r of rendered) {
            const ov = map[r.i] || {};
            const row = planRows[r.i] || {};
            if (r.ferienTd) {
                r.ferienTd.textContent = ov.ferien || row.ferien;
                continue;
            }
            setDateText(r.dateTd, ov.date != null ? ov.date : row.date);
            r.uTd.textContent = ov.u != null ? ov.u : row.u;
            setMathText(r.topicSpan, ov.topic != null ? ov.topic : row.topic);
            setMathText(r.remarkTd, ov.remark != null ? ov.remark : row.remark);
            if (r.matTd) updateMaterial(r, ov.material != null ? ov.material : row.material);
            if (r.ul) buildDetailList(r.ul, ov.details || row.details || []);
        }
    }

    function pushRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return null;
        const ts = localStorage.getItem(TS_KEY) || new Date().toISOString();
        return svpAuth.api('svp_plan_edits', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify([{
                page: location.pathname,
                edits: JSON.parse(localStorage.getItem(KEY) || '{}'),
                ts: ts
            }])
        }).then(res => setCloud(res.ok ? '☁ synchron' : '☁ Fehler: HTTP ' + res.status, res.ok))
            .catch(e => setCloud('☁ ' + e.message, false));
    }

    /* Read-only fetch without login: plan edits are public to READ
       (RLS: select for anon), writing still needs the owner session.
       So every visitor sees the current plan state. */
    async function fetchPublicEdits(page) {
        const res = await fetch(svpAuth.DB_URL + '/rest/v1/svp_plan_edits?page=eq.' +
            encodeURIComponent(page) + '&select=edits,ts', {
            headers: { apikey: svpAuth.DB_KEY, Authorization: 'Bearer ' + svpAuth.DB_KEY }
        });
        if (!res.ok) return null;
        const rows = await res.json();
        return rows.length ? rows[0] : null;
    }

    async function syncFromRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        try {
            const res = await svpAuth.api(
                'svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname) + '&select=edits,ts');
            if (!res.ok) { setCloud('☁ Fehler: HTTP ' + res.status, false); return; }
            const rows = await res.json();
            const localTs = Date.parse(localStorage.getItem(TS_KEY) || '') || 0;
            if (!rows.length) {
                /* nothing in the cloud yet — seed it from local edits if any */
                if (localStorage.getItem(KEY)) pushRemote();
                else setCloud('☁ synchron', true);
                return;
            }
            const remoteTs = Date.parse(rows[0].ts) || 0;
            if (remoteTs > localTs) {
                saved = rows[0].edits || {};
                localStorage.setItem(KEY, JSON.stringify(saved));
                localStorage.setItem(TS_KEY, rows[0].ts);
                applyEdits(saved);
                setCloud('☁ synchron', true);
            } else if (localTs > remoteTs) {
                pushRemote(); /* offline edits from this browser win */
            } else {
                setCloud('☁ synchron', true);
            }
        } catch (e) { setCloud('☁ ' + e.message, false); }
    }

    if (window.svpAuth && svpAuth.hasSession()) {
        syncFromRemote();
    } else if (window.svpAuth) {
        /* visitor without login: apply the published plan state read-only */
        (async function () {
            try {
                const row = await fetchPublicEdits(location.pathname);
                if (!row) return;
                const localTs = Date.parse(localStorage.getItem(TS_KEY) || '') || 0;
                if ((Date.parse(row.ts) || 0) > localTs) {
                    saved = row.edits || {};
                    localStorage.setItem(KEY, JSON.stringify(saved));
                    localStorage.setItem(TS_KEY, row.ts);
                    applyEdits(saved);
                }
            } catch (e) { /* offline: local state stays */ }
        })();
    }

    // The LB info panel and the bridge panel are mutually exclusive —
    // opening one closes the other (hooks set by the two blocks below).
    let closeLbPanel = null, closeBridgePanel = null;

    // --- Lernbereich info panels -----------------------------------------
    // Meta cards carrying data-lb open a shared summary panel below the
    // card row: bullets from the page's LB_INFO, week stats computed from
    // PLAN, and a deep link into the Lehrplan PDF (#page=N).
    (function () {
        const cards = document.querySelectorAll('.meta-card[data-lb]');
        const grid = document.querySelector('.meta-cards');
        if (!cards.length || !grid || !window.LB_INFO) return;

        const panel = document.createElement('div');
        panel.className = 'lb-panel';
        panel.hidden = true;
        grid.insertAdjacentElement('afterend', panel);
        let openKey = null;

        // Which card is open is remembered per page, per browser.
        const STORE_KEY = 'svp-lb-open:' + location.pathname;
        function remember(key) {
            try {
                if (key) localStorage.setItem(STORE_KEY, key);
                else localStorage.removeItem(STORE_KEY);
            } catch (e) { }
        }

        // Chevron marks the cards as expandable, matching the plan rows.
        cards.forEach(card => {
            card.classList.add('expandable');
            const chev = document.createElement('span');
            chev.className = 'chev';
            chev.textContent = '▸';
            card.insertBefore(chev, card.firstChild);
        });

        closeLbPanel = function () {
            openKey = null;
            panel.hidden = true;
            cards.forEach(c => c.classList.remove('open'));
        };

        function statsFor(key) {
            const rows = window.PLAN.filter(r => r.type === key);
            if (!rows.length) return '';
            const first = rows[0], last = rows[rows.length - 1];
            if (rows.length === 1) return 'Im Plan: Woche ' + first.nr + ' (' + first.date + ')';
            return 'Im Plan: ' + rows.length + ' Wochen, von Woche ' + first.nr + ' (' + first.date +
                ') bis Woche ' + last.nr + ' (' + last.date + ')';
        }

        function showCard(card) {
            const key = card.dataset.lb;
            openKey = key;
            if (closeBridgePanel) closeBridgePanel();
            cards.forEach(c => c.classList.toggle('open', c === card));
            const info = window.LB_INFO[key] || {};
            panel.textContent = '';

            const title = document.createElement('div');
            title.className = 'lb-panel-title';
            const kEl = card.querySelector('.k');
            const vEl = card.querySelector('.v');
            title.textContent = (kEl ? kEl.textContent + ' — ' : '') + (vEl ? vEl.textContent : '');
            panel.appendChild(title);

            const ul = document.createElement('ul');
            (info.bullets || []).forEach(b => {
                const li = document.createElement('li');
                setMathText(li, b);
                ul.appendChild(li);
            });
            panel.appendChild(ul);

            const foot = document.createElement('div');
            foot.className = 'lb-panel-foot';
            foot.textContent = statsFor(key);
            if (window.LB_INFO.pdf) {
                const a = document.createElement('a');
                const pg = info.page || window.LB_INFO.page;
                a.href = window.LB_INFO.pdf + (pg ? '#page=' + pg : '');
                a.target = '_blank';
                a.rel = 'noopener';
                a.textContent = 'im Lehrplan (PDF)';
                foot.appendChild(document.createTextNode(' · '));
                foot.appendChild(a);
            }
            panel.appendChild(foot);
            panel.hidden = false;
        }

        cards.forEach(card => card.addEventListener('click', () => {
            if (openKey === card.dataset.lb) {
                closeLbPanel();
                remember(null);
                return;
            }
            showCard(card);
            remember(card.dataset.lb);
        }));

        // Nothing opens by default — restore the card left open last time.
        let stored = null;
        try { stored = localStorage.getItem(STORE_KEY); } catch (e) { }
        if (stored) {
            const card = [...cards].find(c => c.dataset.lb === stored);
            if (card) showCard(card);
        }
    })();

    // --- Bridge card (cross-subject links, free-form editable) ------------
    // Pages define window.BRIDGE = { label, sub, html } to get an extra meta
    // card whose panel is always-editable rich text (like the notes page):
    // auto-save to localStorage, cloud sync via the svp_plan_edits table
    // under the pseudo page '<path>#bridge'. Last write wins by timestamp.
    (function () {
        const grid = document.querySelector('.meta-cards');
        if (!window.BRIDGE || !grid) return;
        const BKEY = 'svp-bridge:' + location.pathname;
        const BTS = BKEY + ':ts';
        const PAGE = location.pathname + '#bridge';

        const card = document.createElement('div');
        card.className = 'meta-card bridge-card';
        const k = document.createElement('div');
        k.className = 'k c-green';
        k.textContent = window.BRIDGE.label || 'Bridge';
        const v = document.createElement('div');
        v.className = 'v';
        v.textContent = window.BRIDGE.sub || 'Verzahnung der Fächer';
        card.appendChild(k);
        card.appendChild(v);
        grid.appendChild(card);

        const panel = document.createElement('div');
        panel.className = 'lb-panel bridge-panel';
        panel.hidden = true;
        grid.insertAdjacentElement('afterend', panel);

        // Hint sits at the top right of the box (before the editable body).
        const foot = document.createElement('div');
        foot.className = 'lb-panel-foot bridge-hint';
        const HINT = '✎ frei editierbar — speichert automatisch';
        foot.textContent = HINT;
        panel.appendChild(foot);

        const body = document.createElement('div');
        body.className = 'bridge-body';
        body.setAttribute('contenteditable', 'true');
        body.innerHTML = localStorage.getItem(BKEY) || window.BRIDGE.html || '';
        panel.appendChild(body);

        closeBridgePanel = function () {
            panel.hidden = true;
            card.classList.remove('open');
        };

        card.addEventListener('click', () => {
            panel.hidden = !panel.hidden;
            card.classList.toggle('open', !panel.hidden);
            if (!panel.hidden && closeLbPanel) closeLbPanel();
        });

        function pushBridge() {
            if (!window.svpAuth || !svpAuth.hasSession()) return;
            svpAuth.api('svp_plan_edits', {
                method: 'POST',
                headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify([{
                    page: PAGE,
                    edits: { html: localStorage.getItem(BKEY) || '' },
                    ts: localStorage.getItem(BTS) || new Date().toISOString()
                }])
            }).then(res => { foot.textContent = HINT + (res.ok ? ' · ☁ synchron' : ' · ☁ Fehler HTTP ' + res.status); })
                .catch(() => {});
        }

        let timer = null;
        body.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                localStorage.setItem(BKEY, body.innerHTML);
                localStorage.setItem(BTS, new Date().toISOString());
                pushBridge();
            }, 600);
        });

        (async function pullBridge() {
            if (!window.svpAuth) return;
            if (!svpAuth.hasSession()) {
                /* visitor without login: read-only pull of the bridge text */
                try {
                    const row = await fetchPublicEdits(PAGE);
                    const localTs = Date.parse(localStorage.getItem(BTS) || '') || 0;
                    if (row && (Date.parse(row.ts) || 0) > localTs) {
                        localStorage.setItem(BKEY, row.edits.html || '');
                        localStorage.setItem(BTS, row.ts);
                        body.innerHTML = row.edits.html || '';
                    }
                } catch (e) { /* offline: local copy stays */ }
                return;
            }
            try {
                const res = await svpAuth.api(
                    'svp_plan_edits?page=eq.' + encodeURIComponent(PAGE) + '&select=edits,ts');
                if (!res.ok) return;
                const rows = await res.json();
                const localTs = Date.parse(localStorage.getItem(BTS) || '') || 0;
                if (!rows.length) {
                    if (localStorage.getItem(BKEY)) pushBridge();
                    return;
                }
                const remoteTs = Date.parse(rows[0].ts) || 0;
                if (remoteTs > localTs) {
                    localStorage.setItem(BKEY, rows[0].edits.html || '');
                    localStorage.setItem(BTS, rows[0].ts);
                    body.innerHTML = rows[0].edits.html || '';
                    foot.textContent = HINT + ' · ☁ synchron';
                } else if (localTs > remoteTs) {
                    pushBridge();
                } else {
                    foot.textContent = HINT + ' · ☁ synchron';
                }
            } catch (e) { /* offline: local copy stays */ }
        })();
    })();
})();
