// Stoffverteilungsplan renderer, part "fahrplan": the run of the lesson, per week.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
//
// A stack of three lines sits in front of the "Inhalt" tab; it opens a frameless sheet you can
// type into (Doc, 20.09.2026: "gib mir vor Inhalt eine Hamburger stack ohne Rahmen. AUf click
// eine Rahmenlosen Dlg mit Edit möglichkeit: da soll der 'Fahrplan' der Stunde rein" - and, on
// how it should feel: "so wie GDW nur mit Edit Capa").
//
// The text is kept per week in the browser, next to the plan's own edits. It belongs to the
// teacher, so the stack shows only for a signed-in session, exactly like the Notizen tab.
//
// A line may carry bold, italic, underline and a colour (Doc, 23.09.2026: "wenn ich in der
// Editbox bin paar Farben Bold etc."): the bar over the list is the shared one from
// svp-fmtbar.js, and what is stored is one line of tame HTML per point - svpFmtBar.clean()
// keeps the marks and throws everything else out, so a paste never smuggles fonts in.
window.svpPlanParts.push(function (P) {
    Object.assign(P, { fahrplanBtn, fahrplanOf, fahrplaene, replaceFahrplaene, markFahrplaene });

    const KEY = 'svp-plan-fahrplan:' + location.pathname;
    let plaene = {};
    try { plaene = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { plaene = {}; }

    function textOf(i) { return plaene[i] || ''; }
    function fahrplanOf(i) { return textOf(i); }
    function fahrplaene() { return plaene; }

    /* After a cloud pull the stacks have to say again which weeks carry a plan. */
    function markFahrplaene() {
        (P.rendered || []).forEach(function (r) {
            if (r.fahrBtn) markiere(r.fahrBtn, textOf(r.i));
        });
    }

    /* "Verschieben" rebuilds every week from scratch - the run of a lesson travels with its
       week, exactly like the notes do, otherwise it would stay behind on the wrong date. */
    function replaceFahrplaene(map) {
        plaene = {};
        for (const k in map) if (map[k]) plaene[k] = map[k];
        try { localStorage.setItem(KEY, JSON.stringify(plaene)); } catch (e) { /* voll oder gesperrt */ }
    }
    function store(i, text) {
        if (text) plaene[i] = text; else delete plaene[i];
        try { localStorage.setItem(KEY, JSON.stringify(plaene)); } catch (e) { /* voll oder gesperrt */ }
        /* Doc, 20.09.2026: "so behandeln wie Notizen" - also auch in die Cloud, damit
           der Fahrplan nicht in dem Browser liegen bleibt, in dem er getippt wurde. */
        if (P.pushFahrplan) P.pushFahrplan();
    }

    /* The stack in front of the tabs. Called while the sub-row is being built, so it lands
       before everything else in that half - "vor Inhalt". */
    /* Doc, 29.09.2026: "mach den sichtbar für die Kids aber block edit!" - the class gets the stack too, usable only
       where a week has a Fahrplan (markiere), and the sheet opens for them to read only (bearbeiten, save). */
    function fahrplanBtn(ref, subHeadL) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'fahr-btn';
        b.title = 'Fahrplan der Stunde';
        b.setAttribute('aria-label', 'Fahrplan der Stunde');
        b.innerHTML = '<svg viewBox="0 0 16 12" aria-hidden="true">'
            + '<path d="M1 1.5h14M1 6h14M1 10.5h14"/></svg>';
        b.addEventListener('mousedown', P.keinMausfokus);
        b.addEventListener('click', function (ev) {
            ev.stopPropagation();               /* the row click would fold the week away */
            open(ref);
        });
        markiere(b, textOf(ref.i));
        ref.fahrBtn = b;
        subHeadL.insertBefore(b, subHeadL.firstChild);
    }

    /* A week that has a run of its own says so - like "Notizen" turning green when something
       stands in it (Doc, 07.09.2026). */
    function markiere(b, text) {
        const hat = !!svpFmtBar.textOf(text);
        b.classList.toggle('has-fahr', hat);
        /* the class sees the stack in every week, greyed out and dead where there is none yet - like the Videos tab
           of a week without a film (Doc, 05.10.2026: "man könnte ihn zeigen, aber grayed out") */
        if (!P.notesAllowed()) b.disabled = !hat;
    }

    // --- the sheet -------------------------------------------------------
    let box = null, blatt = null, leiste = null, feld = null, bild = null, mat = null, offen = null, timer = null;


    function ensureBox() {
        if (box) return box;
        box = document.createElement('div');
        box.className = 'fahr-box';
        box.hidden = true;
        blatt = document.createElement('div');
        blatt.className = 'fahr-sheet';
        /* Feste Ueberschrift, nicht editierbar - sie steht auf jedem Fahrplan und gehoert
           nicht in den Text (Doc, 20.09.2026: "Schreib Du als Ueberschrift immer Inhalte"). */
        const titel = document.createElement('p');
        titel.className = 'fahr-title';
        titel.textContent = 'Inhalte';
        /* Die erste Zeile des Blattes: die Ueberschrift (die Formatierleiste steht seit
           29.09.2026 in einem eigenen Panel ueber dem Blatt, siehe unten). */
        const kopf = document.createElement('div');
        kopf.className = 'fahr-head';
        kopf.appendChild(titel);
        blatt.appendChild(kopf);
        /* Eine echte Liste, kein Textfeld: dann setzt der Browser bei Enter von selbst
           den naechsten Punkt (Doc, 20.09.2026: "bullets"). */
        feld = document.createElement('ul');
        feld.className = 'fahr-list' + (P.notesAllowed() ? '' : ' nur-lesen');   /* the class reads (29.09.2026) */
        /* Doc, 24.09.2026: "wenn ich das aufmache bitte nicht im Edit" - the sheet opens as a
           sheet to READ; a click into it turns it into one to write in (bearbeiten below).
           It stays focusable with tabindex, because the focus is also what keeps the keys off
           the plan behind it: the plan walks its rows with the arrows and folds weeks on Enter. */
        feld.setAttribute('contenteditable', 'false');
        feld.setAttribute('tabindex', '-1');
        feld.setAttribute('role', 'textbox');
        feld.setAttribute('aria-label', 'Inhalte der Stunde');
        blatt.appendChild(feld);
        /* Doc, 29.09.2026: "über dem Fahrplanpanel, wenn man im Edit-Mode ist, ein Panel gleicher Breite ...
           viel flacher und packe all die Icons da oben rein. Und wenn Edit vorbei ist, wird das Panel
           ausgeblendet" - the bar left the sheet's head for a flat panel of its own over the sheet, all in one
           row (eineReihe); it shows while the sheet is written in (svp-fahrplan.css, .fahr-leiste) */
        leiste = document.createElement('div');
        leiste.className = 'fahr-leiste';
        /* the tools are the shared set (svpFmtBar.WERKZEUGE: smileys, sizes, colours, marker, the cow - the notes
           take the same, 02.10.2026); the sheet adds its own indent, a level per point */
        leiste.appendChild(svpFmtBar.build(Object.assign({}, svpFmtBar.WERKZEUGE, {
            target: feld,
            eineReihe: true,
            einzug: { rein: function () { einzug(1); }, raus: function () { einzug(-1); } }   // indent, outdent (29.09.2026)
        })));
        /* Doc, 28.09.2026: "bau mir den klein bitte oben links neben den GDW", then "Rück Inhalte ein und mach
           es vor Inhalte so hoch wie Inhalte" - the gong of svp-gong.js in front of the title, as tall as its
           letters; a click rings it at once */
        if (window.svpGong) {
            const gongKnopf = document.createElement('button');
            gongKnopf.type = 'button';
            gongKnopf.className = 'fahr-gong';
            gongKnopf.title = 'Gong';
            gongKnopf.setAttribute('aria-label', 'Gong');
            gongKnopf.innerHTML = svpGong.ICON;
            gongKnopf.addEventListener('click', function (ev) { ev.stopPropagation(); svpGong.test(); });
            kopf.insertBefore(gongKnopf, titel);
        }
        /* Der Gedanke der Woche in der Ecke: derselbe Klick wie in der Wochenzeile
           (Doc, 20.09.2026: "mach rechts oben ein thumb vom GDW"). */
        bild = document.createElement('button');
        bild.type = 'button';
        bild.className = 'fahr-gdw';
        bild.hidden = true;
        bild.addEventListener('click', function (ev) {
            ev.stopPropagation();
            const e = P.gdwEntry(offen);
            if (e) P.gdwOpen(e);
        });
        blatt.appendChild(bild);
        /* Das Zusatzmaterial der Woche unter dem Gedanken, am unteren Blattrand
           (Doc, 21.09.2026: "bring mir da bitte die Zusatzmat unter den GDW
           unten buendig"): im Unterricht steht der Fahrplan offen, und das
           Material ist der naechste Griff - es soll nicht hinter dem Blatt
           liegen. Gebaut wird es mit demselben renderMaterial wie die Spalte
           im Plan, nur in ein anderes Kaestchen. */
        mat = document.createElement('div');
        mat.className = 'fahr-mat mat-block';
        mat.hidden = true;
        blatt.appendChild(mat);
        /* the panel hangs over the sheet in a stack of the two: the sheet stays where it is when it shows */
        const stapel = document.createElement('div');
        stapel.className = 'fahr-stapel';
        stapel.append(leiste, blatt);
        box.appendChild(stapel);
        document.body.appendChild(box);

        feld.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(save, 600);      /* typing saves itself, like the notes field */
            [].forEach.call(feld.children, svpFmtBar.punktGroesse);   /* a point small as a whole: its lines too */
            fitFont();                          /* mehr Text -> kleinere Schrift */
        });
        /* Eingefuegt wird nur der Text: was aus einer Mail oder einem Deck kommt,
           bringt sonst seine Schrift, Groesse und Farbe mit auf das Blatt. */
        feld.addEventListener('paste', function (ev) {
            ev.preventDefault();
            const cb = ev.clipboardData;
            document.execCommand('insertText', false, cb ? (cb.getData('text/plain') || '') : '');
        });
        /* typing must not reach the plan: it walks its rows with the arrow keys and folds
           weeks on Enter */
        feld.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') { hide(); return; }
            ev.stopPropagation();
            /* Tab and Shift+Tab indent and outdent like the two buttons (29.09.2026) - before, Tab left the sheet */
            if (ev.key === 'Tab' && feld.getAttribute('contenteditable') === 'true') {
                ev.preventDefault();
                einzug(ev.shiftKey ? -1 : 1);
            }
        });
        /* Into the text = into edit mode. The caret goes where the finger or the mouse went,
           not to the end: on a sheet of ten points, being thrown back to the first one is
           worse than no caret at all. Without a hit (the browsers spell the call differently)
           it falls back to the end of the first point - the place Doc asked for on 20.09.2026. */
        feld.addEventListener('mousedown', bearbeiten);
        feld.addEventListener('touchstart', bearbeiten, { passive: true });
        box.addEventListener('click', function (ev) { if (ev.target === box) hide(); });
        window.addEventListener('resize', fitFont);
        return box;
    }

    /* ---- Die Schrift passt sich dem Text an ------------------------------
       Das Blatt waechst mit dem Text, aber nur bis zu seiner max-height; was
       dann noch dazukommt, wird nicht weggescrollt, sondern kleiner
       geschrieben (Doc, 21.09.2026: "mach das max size und die Schrift
       kleiner, wenn ich mehr schreibe", "nur wenn es so gebraucht wird
       kleiner geht").
       Gemessen wird am Blatt selbst (overflow: auto): solange es unter seiner
       max-height bleibt, waechst es einfach mit und hier ist nichts zu tun.
       Erst wenn es anstoesst und ueberlaeuft, wird der Grad zurueckgenommen -
       per Halbierung statt in Ein-Pixel-Schritten, das sind sieben Messungen
       statt dreissig. Beim Loeschen laeuft es andersherum: der Grad geht auf
       das Mass aus dem CSS zurueck, das bleibt die Obergrenze.
       Gerechnet wird direkt im Tastendruck, ohne requestAnimationFrame: dessen
       Nummer diente als Sperre, und blieb ein Bild aus (Hintergrund-Reiter),
       blieb die Sperre stehen und die Schrift fuer immer, wie sie war -
       gemessen am 21.09.2026 im kopflosen Chrome. Die eine Messung im
       Normalfall ("passt") kostet nichts. */
    const MIN_PX = 14;
    /* Das Blatt soll nicht bis an seine Grenze wachsen - darueber und darunter
       bleibt Luft (Doc, 21.09.2026: "schau den Abstand oben und unten: die
       Schrift muss schon hier kleiner"). Deshalb wird NICHT gegen die aktuelle
       Hoehe des Blattes gemessen: solange es mitwaechst, laeuft dort nie etwas
       ueber, und der Grad bliebe stehen, bis es randvoll ist. Gemessen wird
       gegen seine max-height abzueglich dieses Polsters. */
    const LUFT = 64;

    function grenze() {
        const m = parseFloat(getComputedStyle(blatt).maxHeight);
        return (isFinite(m) ? m : window.innerHeight) - LUFT;
    }

    /* Only the TEXT column counts (Doc, 25.09.2026: "Fahrplan ist die Schrift ploetzlich
       klein?"): measured on the whole sheet, a tall right column - the thought of the week
       plus eight pills - never fit a low window, and the type went down to MIN_PX however
       short the text was. The list itself is stretched to the row height, so the bottom of
       its last point is what the text really needs. Too big is also a word running out
       sideways. */
    function passt() {
        const letzter = feld.lastElementChild;
        const unten = letzter ? letzter.offsetTop + letzter.offsetHeight : feld.offsetTop;
        return unten + parseFloat(getComputedStyle(blatt).paddingBottom) <= grenze() &&
            blatt.scrollWidth <= blatt.clientWidth + 1;
    }

    /* The right column has to fit as well, but it is not text - smaller type does nothing
       for it. So the picture gives way: it gets narrower (aspect-ratio keeps it whole, no
       crop) until picture and pills fit under the max-height; before, the pills slid up
       over it. Below BILD_MIN it is no picture any more and goes, and the pills then take
       the whole column, up into the head row. On the phone the column stands under the
       text and the sheet scrolls - nothing to do there. */
    const BILD_BREITE = 154, BILD_ASPEKT = 1.445, BILD_MIN = 60;
    function fitSide() {
        bild.style.width = '';
        bild.style.display = '';
        mat.style.gridRow = '';
        const cs = getComputedStyle(blatt);
        if (cs.gridTemplateColumns.split(' ').length < 2) return;
        if (bild.hidden) { mat.style.gridRow = '1 / span 3'; return; }
        const innen = grenze() + LUFT - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const matH = mat.hidden ? 0 : mat.offsetHeight + parseFloat(getComputedStyle(mat).marginTop);
        const breite = Math.min(BILD_BREITE, (innen - matH) / BILD_ASPEKT);
        if (breite >= BILD_BREITE) return;
        if (breite < BILD_MIN) { bild.style.display = 'none'; mat.style.gridRow = '1 / span 3'; }
        else bild.style.width = breite.toFixed(1) + 'px';
    }

    function fitFont() {
        if (!blatt || !box || box.hidden) return;
        fitSide();
        blatt.style.fontSize = '';                      /* erst zurueck auf das CSS-Mass */
        const basis = parseFloat(getComputedStyle(blatt).fontSize) || 46;
        if (passt()) return;                            /* alles da, nichts zu tun */
        let klein = MIN_PX, gross = basis, best = MIN_PX;
        for (let n = 0; n < 7 && gross - klein > 0.5; n++) {
            const mitte = (klein + gross) / 2;
            blatt.style.fontSize = mitte + 'px';
            if (passt()) { best = mitte; klein = mitte; } else gross = mitte;
        }
        blatt.style.fontSize = best.toFixed(1) + 'px';
    }

    /* One line per bullet - that is what is stored, the list is only how it is shown.
       Each line is tame HTML: the marks and colours stay, all else goes (svpFmtBar.clean). */
    function zeilen() {
        /* Reads the direct children, whatever the browser made of them while typing -
           a stray <div> or a bare text node counts as its own point, same as an <li>. */
        /* a point's level (data-ebene, einzug) goes in front of its line as tabs (svpFmtBar.mitEbene) */
        return [].map.call(feld.childNodes, function (n) {
            const z = svpFmtBar.clean(n);
            return svpFmtBar.textOf(z) ? svpFmtBar.mitEbene(z, n.dataset ? +n.dataset.ebene || 0 : 0) : '';
        }).filter(Boolean);
    }

    /* Doc, 29.09.2026: "wenn du eine Bullet-List hast, die zweite Ebene nach innen schieben" - every point the
       selection touches one level in (1) or out (-1), up to svpFmtBar.EBENEN_MAX; a new point made with Enter
       takes its level along (the browser copies the point). Saved like typing: through the input event. */
    function einzug(schritt) {
        if (!feld || feld.getAttribute('contenteditable') !== 'true') return;
        const sel = window.getSelection();
        if (!sel.rangeCount || !feld.contains(sel.anchorNode)) return;
        const r = sel.getRangeAt(0);
        [].forEach.call(feld.children, function (li) {
            if (!r.intersectsNode(li)) return;
            const e = Math.max(0, Math.min(svpFmtBar.EBENEN_MAX, (+li.dataset.ebene || 0) + schritt));
            if (e) li.dataset.ebene = String(e); else delete li.dataset.ebene;
        });
        feld.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function save() {
        clearTimeout(timer);
        if (!offen || !P.notesAllowed()) return;
        const text = zeilen().join('\n');
        /* Reading is now the normal case, and closing a sheet that was only read must not
           write anything - it would push the same text into the cloud on every peek. */
        if (text === textOf(offen.i)) return;
        store(offen.i, text);
        if (offen.fahrBtn) markiere(offen.fahrBtn, text);
    }

    function open(ref) {
        const b = ensureBox();
        offen = ref;
        const zn = textOf(ref.i).split('\n').filter(Boolean);
        feld.textContent = '';
        /* an empty plan still needs one point, otherwise the cursor has nowhere to sit */
        (zn.length ? zn : ['']).forEach(function (t) {
            const li = document.createElement('li'), z = svpFmtBar.zeile(t);
            /* through clean() also on the way in: older lines are plain text and pass
               as they are, a line from the cloud is trusted no further than a typed one */
            li.innerHTML = svpFmtBar.clean(z.html);
            if (z.ebene) li.dataset.ebene = String(z.ebene);        // its level (einzug)
            svpFmtBar.punktGroesse(li);                              // small or large as a whole: its lines too
            feld.appendChild(li);
        });
        /* das Bild der Woche in die Ecke - ohne Gedanken bleibt die Ecke leer */
        const gd = P.gdwEntry(ref);
        bild.hidden = !gd;
        bild.innerHTML = '';
        if (gd) {
            const im = document.createElement('img');
            im.src = P.gdwThumbSrc(gd);
            im.alt = '';
            bild.appendChild(im);
            bild.title = 'Gedanke der Woche \u2014 anklicken';
        }
        /* Der Quelltext des Materials steht in der Spalte des Plans (dataset.src
           setzt renderMaterial dort) - damit zeigt das Blatt auch, was Doc
           gerade erst eingetragen hat, und nicht den Stand aus der HTML-Datei.
           Die Aufgaben-Pille bleibt draussen, die hat ihren eigenen Knopf. */
        const matSrc = ref.matBlock ? (ref.matBlock.dataset.src || '') : '';
        mat.textContent = '';
        if (matSrc) {
            P.renderMaterial(mat, matSrc, ref, function (en) { return P.isExerciseEntry(en); });
        }
        /* Was in jeder Stunde dieses Fachs gebraucht wird - Formelsammlung und
           Lab - haengt darunter. Die Liste steht bei den Material-Funktionen
           (svp-plan-material.js), damit die Zeile im Plan und dieses Blatt
           dieselbe nehmen. */
        P.festePillen(mat, ref);
        mat.hidden = !mat.childNodes.length;
        b.hidden = false;
        fitFont();                  /* sofort, nicht erst im naechsten Bild */
        /* Focus, but no caret and no edit mode: the sheet is there to be read, and the focus
           only keeps Escape and the arrow keys away from the plan. The caret follows the first
           click (bearbeiten), where Doc's wish from 20.09.2026 lives on - "setz den cursor
           eine Zeile tiefer hinter den ersten bullet" is what happens when a click cannot be
           resolved to a place in the text. */
        feld.setAttribute('contenteditable', 'false');
        feld.focus();
        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();
    }

    /* From reading to writing. Called by the first click into the text; every further click
       finds it editable already and runs through. */
    function bearbeiten(ev) {
        if (!P.notesAllowed()) return;                   /* the class reads, only Doc writes (29.09.2026) */
        if (feld.getAttribute('contenteditable') === 'true') return;
        feld.setAttribute('contenteditable', 'true');
        feld.focus();
        const punkt = ev.touches ? ev.touches[0] : ev;
        let r = null;
        if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(punkt.clientX, punkt.clientY);
        else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(punkt.clientX, punkt.clientY);
            if (pos) { r = document.createRange(); r.setStart(pos.offsetNode, pos.offset); r.collapse(true); }
        }
        if (!r && feld.firstChild) { r = document.createRange(); r.selectNodeContents(feld.firstChild); r.collapse(false); }
        const sel = window.getSelection();
        if (r && sel) { sel.removeAllRanges(); sel.addRange(r); }
    }

    function hide() {
        save();
        feld.setAttribute('contenteditable', 'false');   /* the next sheet opens to read again */
        box.hidden = true;
        offen = null;
    }
});
