// Stoffverteilungsplan renderer, part "material-edit": editing material: dialog, clipboard, pill menu, drag and drop.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        updateMaterial, removeMatEntry, closeMatModal, parseMat, matTail, wirePillMenu,
        wirePillTouch, decorateMatCell, wireMaterialDrop
    });

    // Renders a ref's material state: pills into the sub-row block, a compact
    // Material lives in the expandable sub-row; the week row itself stays
    // clean (the ▸ chevron already shows there is something to unfold).
    function updateMaterial(ref, text) {
        text = text == null ? '' : String(text).trim();
        ref.matTd.dataset.src = text;
        const alle = parseMat(text);
        const ex = alle.filter(P.isExerciseEntry);
        /* Beide Reiter lesen DIESELBE Zeile, nur mit umgekehrtem Filter -
           dadurch gibt es nichts doppelt zu pflegen. */
        P.renderMaterial(ref.matBlock, text, ref, en => P.isExerciseEntry(en) || P.isVideoEntry(en));
        /* Doc, 21.09.2026 ("hier bitte auch!", gezeigt auf die Zusatzmaterial-
           Zeile): hinter dem Material der Woche stehen die Links, die zum Fach
           gehoeren - Formelsammlung, Lab. Danach, weil renderMaterial seinen
           Kasten jedes Mal leert. Sie zaehlen nicht in den Reiter: der Zaehler
           unten rechnet mit den Eintraegen der Woche, nicht mit diesen. */
        P.festePillen(ref.matBlock, ref);
        /* Zusatzmaterial steht in drei Spalten - Labs, ppt/pdf, Links (Doc,
           22.09.2026). Erst jetzt, weil die festen Pillen mit einsortiert
           werden; Videos und Aufgaben behalten ihre laufende Reihe. */
        P.matSpalten(ref.matBlock);
        P.renderMaterial(ref.vidBlock, text, ref, en => !P.isVideoEntry(en));
        ref.matTd.textContent = '';
        /* Doc, 20.09.2026: "weg bitte ... wir brauchen Platz" - die Aufgaben-Pille
           ist aus der Wochenzeile raus. Die Aufgaben der Woche stehen jetzt im
           eigenen Reiter der Aufklappzeile (fillAufgabenPane), zusammen mit
           Zusatzmaterial und Videos. In der Zeile bleiben der rote Knopf und die
           Klammer mit der Material-Anzahl. */
        const n = alle.length - ex.length;
        /* Red button in the week row, data driven (row.redBtn). It sizes to its
           own label; the invisible copy of the Aufgaben pill that used to widen
           it went out with the pill. */
        if (ref.redBtn) {
            const rb = document.createElement('button');
            rb.type = 'button';
            const cfg = typeof ref.redBtn === 'string' ? { label: ref.redBtn } : ref.redBtn;
            /* Rot nur fuer Klassenarbeit und Klausur, sonst Orange mit Navy -
               die Regel steht an einer Stelle (P.pruefArt). */
            const art = P.pruefArt(cfg);
            rb.className = 'red-btn' + (art === 'klausur' ? '' : ' nachweis');
            const lbl = document.createElement('span');
            lbl.textContent = cfg.label;
            rb.appendChild(lbl);
            rb.addEventListener('click', function (e) { e.stopPropagation(); });
            if (cfg.items && cfg.items.length) {
                rb.setAttribute('aria-haspopup', 'dialog');
                rb.setAttribute('aria-expanded', 'false');
                rb.addEventListener('click', function () {
                    const wasOpen = P.redListOpen && P.redListOpen.btn === rb;
                    P.closeRedList();
                    if (wasOpen) return;
                    /* built once per week, reused across re-renders of the row */
                    if (!ref.redList) ref.redList = P.buildRedList(cfg.title || cfg.label, cfg.items, art);
                    ref.redList.hidden = false;
                    P.redListOpen = { panel: ref.redList, btn: rb };
                    rb.setAttribute('aria-expanded', 'true');
                    P.placeRedList();
                });
            }
            ref.matTd.appendChild(rb);
            ref.redBtnEl = rb;
            P.watchRedBtn(ref);
        }
        const hasMat = !!text && (n > 0 || !alle.length || matTail(text));
        /* Doc, 20.09.2026: "macht den clip weg bitte" - die Bueroklammer mit der
           Material-Anzahl ist aus der Wochenzeile raus; rechts steht dort jetzt
           das Vorschaubild der Woche. Dass die Zeile etwas zu zeigen hat,
           verraet weiter der Pfeil links. */
        /* "Gedanke der Woche" of this week - the cell was emptied above, so it goes back
           on every rebuild (svp-plan-gdw.js adds it only once per cell). */
        P.gdwThumb(ref);
        const vids = alle.filter(P.isVideoEntry).length;
        if (hasMat) {
            const sub = ref.ensureSubRow();
            const ziel = sub.panes || null;
            if (!ref.matBlock.parentNode) (ziel ? ziel.zusatz.pane : sub.side).appendChild(ref.matBlock);
            if (ziel && !ref.vidBlock.parentNode) ziel.videos.pane.appendChild(ref.vidBlock);
        } else if (ref.matBlock.parentNode) {
            ref.matBlock.remove();
            if (ref.vidBlock.parentNode) ref.vidBlock.remove();
        }
        /* Ohne Film bleibt rechts nur "Zusatzmaterial" stehen - ein leerer Reiter
           waere in den allermeisten Wochen nur Rauschen. Steht ausserhalb des
           Material-Zweigs: eine Woche ganz ohne Material laeuft da nicht hinein
           und behielte sonst einen Reiter, hinter dem nichts liegt. Verschwindet
           der letzte Film, waehrend der Reiter offen ist, springt die Anzeige
           zurueck, sonst zeigt die Haelfte ins Leere. */
        /* what the Zusatzmaterial tab holds: no exercises, no films; free text alone
           still counts as one, like the paperclip */
        const zusatz = alle.filter(en => !P.isExerciseEntry(en) && !P.isVideoEntry(en)).length
            || (matTail(text) ? 1 : 0);
        P.setVideoReiter(ref, vids, zusatz, P.fillAufgabenPane(ref, text, ex));
        decorateMatCell(ref);
        /* renderMaterial builds every pill from scratch, so the width measured
           earlier is gone by now. Without this the pills are equally wide only
           until the next update - and the cloud sync runs one after every
           render (Doc, 09.09.2026: "hier immer alle gleichbreit"). Costs
           nothing on a folded week: equalizeMatPills leaves at once when the
           block is not visible. */
        P.equalizeRefPills(ref);
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
        if (!P.saved[ref.i]) P.saved[ref.i] = {};
        if (src) P.saved[ref.i].material = src;
        else delete P.saved[ref.i].material;
        localStorage.setItem(P.KEY, JSON.stringify(P.saved));
        localStorage.setItem(P.TS_KEY, new Date().toISOString());
        P.pushRemote();
    }

    // Pretty modal (no native dialogs): add a link with optional label,
    // existing links are listed and removable via X.
    P.matModal = null;
    function closeMatModal() {
        if (P.matModal) { P.matModal.remove(); P.matModal = null; }
    }

    // editUrl (optional): preselect that entry for editing right away.
    function openMatModal(ref, editUrl) {
        closeMatModal();
        const planRow = P.planRows[ref.i] || {};
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
                pill.appendChild(P.matIconEl(en.url, en.label));
                pill.appendChild(P.matLabelEl(en.label || P.matDefaultLabel(en.url)));
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
        P.matModal = wrap;
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
    /* Optionaler Anhang hinter einem Link: der Pfad der Datei im Laufwerk, ohne
       Schema - "https://" davor waere ein zweiter Link und damit eine zweite
       Pille. Damit kann das Kontextmenue die Datei in der Desktop-App oeffnen;
       ein Freigabelink taugt dafuer nicht, den kann Office nicht aufloesen. */
    const DATEI_RE = /^\s*\[\[datei:([^\]]*)\]\]\s*/;
    /* Markiert eine Pille als wichtig - sie wird dann orange gezeichnet
       (Doc, 22.09.2026). Steht wie [[datei:…]] hinter dem Link und ist
       unsichtbar; alte Zeilen ohne die Marke bleiben, wie sie sind. */
    const WICHTIG_RE = /^\s*\[\[wichtig\]\]\s*/;

    /* Frisst fuehrende «Beschreibung», [[datei:…]] und [[wichtig]] in beliebiger
       Reihenfolge - deshalb so viele Durchgaenge wie es Anhaenge gibt. */
    function nimmAnhang(text) {
        const a = { desc: '', datei: '', wichtig: false, rest: text };
        for (let i = 0; i < 3; i++) {
            let m = a.rest.match(DESC_RE);
            if (m) { a.desc = m[1].trim(); a.rest = a.rest.slice(m[0].length); continue; }
            m = a.rest.match(DATEI_RE);
            if (m) { a.datei = m[1].trim(); a.rest = a.rest.slice(m[0].length); continue; }
            m = a.rest.match(WICHTIG_RE);
            if (m) { a.wichtig = true; a.rest = a.rest.slice(m[0].length); continue; }
            break;
        }
        return a;
    }
    function parseMat(src) {
        const out = [];
        const parts = (src || '').split(/(https?:\/\/[^\s]+)/);
        for (let k = 1; k < parts.length; k += 2) {
            let pre = parts[k - 1];
            if (out.length) {
                const a = nimmAnhang(pre);
                const vor = out[out.length - 1];
                if (a.desc) vor.desc = a.desc;
                if (a.datei) vor.datei = a.datei;
                if (a.wichtig) vor.wichtig = true;
                pre = a.rest;
            }
            out.push({
                label: pre.replace(/[\s|:,;·–-]+$/, '').trim(),
                url: parts[k],
                desc: '',
                datei: '',
                wichtig: false
            });
        }
        if (parts.length > 1 && out.length) {
            const a = nimmAnhang(parts[parts.length - 1]);
            const letzt = out[out.length - 1];
            if (a.desc) letzt.desc = a.desc;
            if (a.datei) letzt.datei = a.datei;
            if (a.wichtig) letzt.wichtig = true;
        }
        return out;
    }

    // Free text after the last link (kept as a muted note behind the pills).
    function matTail(src) {
        const parts = (src || '').split(/(https?:\/\/[^\s]+)/);
        if (parts.length === 1) return '';
        return nimmAnhang(parts[parts.length - 1]).rest.trim();
    }

    function matToSrc(entries) {
        return entries.map(en => (en.label ? en.label + ' ' : '') + en.url +
            (en.desc ? ' «' + en.desc.replace(/[«»]/g, '') + '»' : '') +
            (en.datei ? ' [[datei:' + en.datei.replace(/[\[\]]/g, '') + ']]' : '') +
            (en.wichtig ? ' [[wichtig]]' : '')).join(' ');
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
        const planRow = P.planRows[ref.i] || {};
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
        const planRow = P.planRows[ref.i] || {};
        localStorage.setItem(CLIP_KEY, JSON.stringify({
            src: src,
            from: planLabel() + ' · Woche ' + (planRow.nr || (ref.i + 1)),
            n: 1,
            ts: new Date().toISOString()
        }));
        if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
        refreshMatButtons();
    }

    function closePillMenu() {
        if (P.pillMenu && P.pillMenu.parentNode) P.pillMenu.parentNode.removeChild(P.pillMenu);
        P.pillMenu = null;
    }

    function openPillMenu(x, y, ref, url, label, datei) {
        closePillMenu();
        P.hideMatTip();          /* sonst steht die Beschreibung im Menue (Doc, 06.09.2026) */
        const menu = document.createElement('div');
        menu.className = 'mat-ctx';
        const titel = document.createElement('div');
        titel.className = 'mat-ctx-title';
        titel.textContent = label || P.matDefaultLabel(url);
        menu.appendChild(titel);
        const desktop = P.officeEdit(url, label, datei);
        /* Outside the edit mode the menu is the short list: open, copy, and
           the desktop app. Changing or removing the entry stays an edit-mode
           action - the cell holds the raw text only there. */
        const editing = !!(ref && ref.tr && ref.tr.classList.contains('wk-edit'));
        const punkte = [
            ['⧉', 'Kopieren', function () { copyOneMat(ref, url, label); }, 'ctx-ico-gross'],
            ['↗', 'Öffnen', function () { P.openMat(url, label); }, '']];
        /* "Öffne lokal" nur fuer Angemeldete und nur fuer eigene Seiten (Doc,
           22.09.2026). Es geht in einen ECHTEN Tab, nicht in das kleine
           Material-Fenster: lokal wird geprueft, was gerade gebaut wurde, und
           dazu gehoeren Hart-Neuladen und die Entwicklerwerkzeuge. */
        const lokal = P.CAN_EDIT_MAT ? P.lokalHref(url) : '';
        if (lokal) punkte.push([P.drawnIcon('ctx-ico-svg', P.LAPTOP_PATH, 'currentColor', 1.7),
            'Öffne lokal',
            function () { window.open(lokal, '_blank', 'noopener'); }, '']);
        if (desktop) punkte.push([P.drawnIcon('ctx-ico-svg', P.PRESENT_PATH, 'currentColor', 1.7),
            'Bearbeiten in ' + desktop.name,
            function () { location.href = desktop.href; }, '']);
        if (editing) {
            punkte.push(['✎', 'Bearbeiten', function () { openMatModal(ref, url); }, '']);
            punkte.push(['✕', 'Entfernen', function () { removeMatEntry(ref, url); }, '']);
        }
        punkte.forEach(function (def) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'mat-ctx-item';
            if (typeof def[0] === 'string') {
                const ico = document.createElement('span');
                ico.className = 'ctx-ico ' + (def[3] || '');
                ico.textContent = def[0];  /* same glyphs as the row toolbar */
                b.appendChild(ico);
            } else {
                const ico = document.createElement('span');
                ico.className = 'ctx-ico ' + (def[3] || '');
                ico.appendChild(def[0]);   /* App-Symbol statt Zeichen */
                b.appendChild(ico);
            }
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
        P.pillMenu = menu;
    }

    document.addEventListener('click', function (e) {
        if (P.pillMenu && !P.pillMenu.contains(e.target)) closePillMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePillMenu(); });
    window.addEventListener('scroll', closePillMenu, true);

    /* Owner only (see renderMaterial): the browser menu is suppressed in both
       modes, the item list adapts to the mode inside openPillMenu. */
    function wirePillMenu(a, ref, url, label, datei) {
        a.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openPillMenu(e.clientX, e.clientY, ref, url, label, datei);
        });
    }

    // Touch gestures on a pill (Doc's rule for the pad):
    //   short tap  -> description tooltip (if the link has one, else navigate)
    //   long press -> open the link; for the owner: the pill context menu
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
                P.hideMatTip();
                if (editable) openPillMenu(t.clientX, t.clientY, ref, en.url, en.label, en.datei);
                else P.openMat(en.url, en.label);
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
                if (P.matTip && P.matTip.dataset.for === en.url) P.hideMatTip();
                else P.showMatTip(a, en.desc, en.url);
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
        const strip = ref.matTools;
        if (!strip) return;          /* Aufklappzeile noch nicht gebaut */
        const copy = strip.querySelector('.mat-copy');
        const paste = strip.querySelector('.mat-paste');
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

    /* ⧉, ⇩ und + stehen seit dem 09.09.2026 NICHT mehr in der Wochenzeile,
       sondern in der Zusatzmaterial-Zeile der Aufklappzeile (Doc: "runter
       damit"). Grund: in der Wochenzeile nahmen sie der Themenspalte 60 px,
       zusammen mit dem Untis-Chip 116 px - lange Titel brachen dann um und die
       Zeile wurde beim Umschalten 17 px hoeher. Unten ist auf jeder
       Fensterbreite Platz, und sie stehen bei den Pillen, auf die sie wirken. */
    function decorateMatCell(ref) {
        if (!P.CAN_EDIT_MAT || !ref.matTd) return;
        if (matRefs.indexOf(ref) < 0) matRefs.push(ref);
        const strip = ref.matTools;
        if (!strip) return;          /* kommt beim Bauen der Aufklappzeile nach */
        if (!strip.querySelector('.mat-add')) {
            const copy = document.createElement('span');
            copy.className = 'mat-act mat-copy';
            copy.textContent = '⧉';
            copy.title = 'Materialien dieser Woche kopieren';
            copy.addEventListener('click', function (e) {
                e.stopPropagation();
                copyMaterial(ref, copy);
            });
            strip.appendChild(copy);

            const paste = document.createElement('span');
            paste.className = 'mat-act mat-paste';
            paste.textContent = '⇩';
            paste.addEventListener('click', function (e) {
                e.stopPropagation();
                pasteMaterial(ref);
            });
            strip.appendChild(paste);

            const btn = document.createElement('span');
            btn.className = 'mat-add';
            btn.textContent = '+';
            btn.title = 'Link einfügen (oder Link hierher ziehen)';
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                openMatModal(ref);
            });
            strip.appendChild(btn);
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
        dbg('svp material: eingeloggt=' + P.CAN_EDIT_MAT + ' · Zeilen=' + window.PLAN.length);
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
        if (!P.CAN_EDIT_MAT) return;
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
});
