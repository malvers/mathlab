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
    const headRow = document.querySelector('#plan-table thead tr');
    if (headRow) {
        const matTh = document.createElement('th');
        matTh.textContent = 'Material';
        headRow.appendChild(matTh);
    }

    // Renders the raw material text ("Label https://... Label2 https://...")
    // as compact link pills; text without any URL shows as a plain note.
    // The raw source is kept in data-src for edit mode.
    // File-type icon for a material pill; SharePoint share links carry the
    // app in the path (/:p:/ = PowerPoint, /:w:/ = Word, /:x:/ = Excel,
    // /:b:/ = PDF), otherwise the label/extension decides.
    function matIcon(url, label) {
        const l = (label + ' ' + url).toLowerCase();
        if (url.indexOf('/:p:/') >= 0 || l.indexOf('ppt') >= 0) return '📽 ';
        if (url.indexOf('/:w:/') >= 0 || l.indexOf('.doc') >= 0) return '📄 ';
        if (url.indexOf('/:x:/') >= 0 || l.indexOf('.xls') >= 0) return '📊 ';
        if (url.indexOf('/:b:/') >= 0 || l.indexOf('pdf') >= 0) return '📕 ';
        return '🔗 ';
    }

    // Default pill label when none was typed: derived from the link type.
    function matDefaultLabel(url) {
        const l = url.toLowerCase();
        if (url.indexOf('/:p:/') >= 0 || l.indexOf('ppt') >= 0) return 'PPT';
        if (url.indexOf('/:w:/') >= 0 || l.indexOf('.doc') >= 0) return 'Doc';
        if (url.indexOf('/:x:/') >= 0 || l.indexOf('.xls') >= 0) return 'Excel';
        if (url.indexOf('/:b:/') >= 0 || l.indexOf('pdf') >= 0) return 'PDF';
        return 'Link';
    }

    function renderMaterial(el, text, ref) {
        text = text == null ? '' : String(text).trim();
        el.dataset.src = text;
        el.textContent = '';
        const parts = text.split(/(https?:\/\/[^\s]+)/);
        if (parts.length === 1) { el.textContent = text; return; }
        for (let k = 1; k < parts.length; k += 2) {
            const label = parts[k - 1].replace(/[\s|:,;·–-]+$/, '').trim();
            const a = document.createElement('a');
            a.className = 'badge b-green mat-pill';
            a.href = parts[k];
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = matIcon(parts[k], label) + (label || matDefaultLabel(parts[k]));
            a.title = parts[k];
            /* Owner: every pill carries its own ✕. Deliberately NOT tied to
               the edit mode — there the cell holds the raw text, and hunting
               a single URL in that string is no fun. */
            if (ref && CAN_EDIT_MAT) {
                const wrap = document.createElement('span');
                wrap.className = 'mat-pill-wrap';
                const url = parts[k];
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
                wrap.appendChild(a);
                wrap.appendChild(x);
                el.appendChild(wrap);
                continue;
            }
            el.appendChild(a);
        }
        const tail = parts[parts.length - 1].trim();
        if (tail) {
            const note = document.createElement('span');
            note.className = 'mat-note';
            note.textContent = tail;
            el.appendChild(note);
        }
    }

    // --- Material quick-add (per week row, owner only) -------------------
    // A small + button in each material cell opens an inline input to paste
    // "Label https://..."; links can also be dragged onto the cell. Both are
    // wired only when the owner session exists — visitors just see pills.
    const CAN_EDIT_MAT = !!(window.svpAuth && svpAuth.hasSession());

    // Renders a ref's material state: pills into the sub-row block, a compact
    // 📎 marker (with link count) into the week row cell.
    function updateMaterial(ref, text) {
        text = text == null ? '' : String(text).trim();
        ref.matTd.dataset.src = text;
        renderMaterial(ref.matBlock, text, ref);
        ref.matTd.textContent = '';
        if (text) {
            const n = (text.match(/https?:\/\//g) || []).length;
            const flag = document.createElement('span');
            flag.className = 'mat-flag';
            flag.textContent = '📎' + (n > 1 ? ' ' + n : '');
            flag.title = 'Material — Zeile aufklappen';
            ref.matTd.appendChild(flag);
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

    function openMatModal(ref) {
        closeMatModal();
        const planRow = window.PLAN[ref.i] || {};
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
        const entries = [];
        const parts = (ref.matTd.dataset.src || '').split(/(https?:\/\/[^\s]+)/);
        for (let k = 1; k < parts.length; k += 2) {
            entries.push({
                label: parts[k - 1].replace(/[\s|:,;·–-]+$/, '').trim(),
                url: parts[k]
            });
        }
        function persist() {
            saveMaterial(ref, entries
                .map(en => (en.label ? en.label + ' ' : '') + en.url).join(' '));
        }

        // Input fields (created first — the pill list below writes into them).
        const labIn = document.createElement('input');
        labIn.type = 'text';
        labIn.placeholder = 'Label (optional, z. B. „Einstieg KI“)';
        labIn.setAttribute('aria-label', 'Label für den Link');
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
                pill.textContent = matIcon(en.url, en.label) + (en.label || matDefaultLabel(en.url));
                pill.addEventListener('click', function () {
                    editIdx = idx;
                    labIn.value = en.label;
                    urlIn.value = en.url;
                    ok.textContent = 'Speichern';
                    list.querySelectorAll('.mm-item').forEach(el => el.classList.remove('sel'));
                    item.classList.add('sel');
                    labIn.focus();
                });
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
            const en = { label: labIn.value.trim(), url: url };
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
            if (e.key === 'Enter') add();
        });
        wrap.appendChild(box);
        document.body.appendChild(wrap);
        matModal = wrap;
        urlIn.focus();
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

    // "Label https://a Label2 https://b" <-> [{label, url}, ...]
    function parseMat(src) {
        const out = [];
        const parts = (src || '').split(/(https?:\/\/[^\s]+)/);
        for (let k = 1; k < parts.length; k += 2) {
            out.push({
                label: parts[k - 1].replace(/[\s|:,;·–-]+$/, '').trim(),
                url: parts[k]
            });
        }
        return out;
    }

    function matToSrc(entries) {
        return entries.map(en => (en.label ? en.label + ' ' : '') + en.url).join(' ');
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
        const planRow = window.PLAN[ref.i] || {};
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

    // Pretty dialog (no native confirm): only asked when the target week
    // already carries material — otherwise pasting is unambiguous.
    function askPaste(ref, clip) {
        closeMatModal();
        const have = parseMat(ref.matTd.dataset.src || '').length;
        const planRow = window.PLAN[ref.i] || {};
        const wrap = document.createElement('div');
        wrap.className = 'mat-modal-wrap';
        const box = document.createElement('div');
        box.className = 'mat-modal';

        const title = document.createElement('div');
        title.className = 'mm-title';
        title.textContent = 'Material einfügen · Woche ' + (planRow.nr || '') + ' · ' +
            ref.dateTd.textContent.trim();
        box.appendChild(title);

        const info = document.createElement('div');
        info.className = 'mm-info';
        info.textContent = clip.n + (clip.n === 1 ? ' Link' : ' Links') + ' aus „' + clip.from +
            '“ — diese Woche hat schon ' + have + (have === 1 ? ' Link.' : ' Links.');
        box.appendChild(info);

        const list = document.createElement('div');
        list.className = 'mm-list';
        parseMat(clip.src).forEach(function (en) {
            const pill = document.createElement('span');
            pill.className = 'badge b-green mat-pill';
            pill.title = en.url;
            pill.textContent = matIcon(en.url, en.label) + (en.label || matDefaultLabel(en.url));
            list.appendChild(pill);
        });
        box.appendChild(list);

        const btns = document.createElement('div');
        btns.className = 'mm-btns';
        [['Abbrechen', null, ''],
         ['Ersetzen', 'replace', ''],
         ['Anhängen', 'append', ' primary']].forEach(function (def) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'mm-btn' + def[2];
            b.textContent = def[0];
            b.addEventListener('click', function () {
                if (def[1]) applyPaste(ref, clip, def[1]);
                closeMatModal();
            });
            btns.appendChild(b);
        });
        box.appendChild(btns);

        wrap.addEventListener('click', function (e) {
            if (e.target === wrap) closeMatModal();
        });
        wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMatModal();
        });
        wrap.appendChild(box);
        document.body.appendChild(wrap);
        matModal = wrap;
        wrap.querySelector('.mm-btn.primary').focus();
    }

    function pasteMaterial(ref) {
        const clip = readClip();
        if (!clip) return;
        if (!parseMat(ref.matTd.dataset.src || '').length) applyPaste(ref, clip, 'append');
        else askPaste(ref, clip);
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
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }

    // Per-row references for edit mode and persistence.
    const rendered = [];

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
        const hasZiele = window.PLAN.some(r => r.ziel);
        const cols = hasZiele ? 6 : 5;

        const table = document.createElement('table');
        table.innerHTML =
            '<thead><tr><th>KW</th><th>Woche</th><th>Ustd.</th>' +
            '<th>Unterrichtsinhalte</th>' + (hasZiele ? '<th>Ziele</th>' : '') +
            '<th>Bemerkungen</th></tr></thead>';
        const xbody = document.createElement('tbody');
        const seenLb = new Set();

        window.PLAN.forEach((row, i) => {
            const ov = saved[i] || {};
            if (row.ferien) {
                const tr = document.createElement('tr');
                tr.className = 'x-fer';
                const td = document.createElement('td');
                td.colSpan = cols;
                td.textContent = ov.ferien || row.ferien;
                tr.appendChild(td);
                xbody.appendChild(tr);
                return;
            }
            const [badgeClass] = window.BADGE[row.type];

            // First week of a Lernbereich: banner row with name + Ustd.
            if (metaByType[row.type] && !seenLb.has(row.type)) {
                seenLb.add(row.type);
                const m = metaByType[row.type];
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
            kw.textContent = row.kw;
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
        window.PLAN.forEach(function (row, i) {
            const ov = saved[i] || {};
            if (row.ferien) {
                const text = ov.ferien || row.ferien;
                blocks.push({ ferien: text.split('·')[0].trim(), dates: mapDates(text) });
                return;
            }
            const date = String(ov.date != null ? ov.date : row.date);
            const dates = mapDates(date) || [date, ''];
            const topic = ov.topic != null ? ov.topic : row.topic;
            const prev = blocks[blocks.length - 1];
            if (prev && !prev.ferien && prev.type === row.type && prev.topic === topic) {
                prev.d1 = dates[1];
                prev.ue += mapUE(ov.u != null ? ov.u : row.u);
                (ov.details || row.details || []).forEach(function (d) {
                    if (prev.details.indexOf(d) < 0) prev.details.push(d);
                });
                return;
            }
            blocks.push({
                type: row.type,
                d0: dates[0],
                d1: dates[1],
                topic: topic,
                ue: mapUE(ov.u != null ? ov.u : row.u),
                details: (ov.details || row.details || []).slice(),
                remark: ov.remark != null ? ov.remark : (row.remark || ''),
                material: ov.material != null ? ov.material : (row.material || ''),
                mth: row.mth,
                med: row.med,
                lnw: row.lnw
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

    window.PLAN.forEach((row, i) => {
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

        const [badgeClass, badgeLabel] = window.BADGE[row.type];
        const tds = [];
        const values = [
            ['num', String(row.nr)],
            ['num', String(row.kw)],
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
                const span = document.createElement('span');
                span.className = 'badge ' + badgeClass;
                span.textContent = badgeLabel;
                linkBadge(span, row.type);
                td.appendChild(span);
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

        const ref = { i, dateTd: tds[2], uTd: tds[4], topicSpan, remarkTd: tds[6], matTd, ul: null };

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
                    date: r.dateTd.textContent.trim(),
                    u: r.uTd.textContent.trim(),
                    topic: r.topicSpan.textContent.trim(),
                    remark: r.remarkTd.textContent.trim()
                };
                /* material is maintained by the pills/+ dialog, not by this
                   form; keep whatever is currently attached to the row so a
                   plain save does not drop it */
                if (r.matTd && (r.matTd.dataset.src || '').trim()) {
                    entry.material = r.matTd.dataset.src.trim();
                }
                if (r.ul) {
                    entry.details = Array.from(r.ul.querySelectorAll('li'))
                        .map(li => li.textContent.trim())
                        .filter(t => t.length);
                }
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

    window.togglePlanEdit = function (btn) {
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
        if (btn) btn.textContent = editing ? '✔ Fertig' : '✎ Bearbeiten';
    };

    // Two-click confirm (no native dialogs): first click arms the button, second click resets.
    window.resetPlanEdits = function (btn) {
        if (btn && !btn.dataset.armed) {
            btn.dataset.armed = '1';
            const original = btn.textContent;
            btn.textContent = 'Wirklich? Nochmal klicken';
            setTimeout(() => {
                delete btn.dataset.armed;
                btn.textContent = original;
            }, 3000);
            return;
        }
        localStorage.removeItem(KEY);
        localStorage.removeItem(TS_KEY);
        const done = () => location.reload();
        if (window.svpAuth && svpAuth.hasSession()) {
            svpAuth.api('svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname), { method: 'DELETE' })
                .catch(() => {}).then(done, done);
        } else done();
    };

    // Safety net: persist pending edits when the tab closes mid-edit.
    window.addEventListener('beforeunload', () => {
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
        for (const r of rendered) {
            const ov = map[r.i] || {};
            const row = window.PLAN[r.i];
            if (r.ferienTd) {
                r.ferienTd.textContent = ov.ferien || row.ferien;
                continue;
            }
            r.dateTd.textContent = ov.date != null ? ov.date : row.date;
            r.uTd.textContent = ov.u != null ? ov.u : row.u;
            setMathText(r.topicSpan, ov.topic != null ? ov.topic : row.topic);
            setMathText(r.remarkTd, ov.remark != null ? ov.remark : row.remark);
            if (r.matTd) updateMaterial(r, ov.material != null ? ov.material : row.material);
            if (r.ul) buildDetailList(r.ul, ov.details || row.details || []);
        }
    }

    function pushRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        const ts = localStorage.getItem(TS_KEY) || new Date().toISOString();
        svpAuth.api('svp_plan_edits', {
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
