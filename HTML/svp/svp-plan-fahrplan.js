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
    function fahrplanBtn(ref, subHeadL) {
        if (!P.notesAllowed()) return;          /* the run of the lesson is Doc's, not the class's */
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
    function markiere(b, text) { b.classList.toggle('has-fahr', !!svpFmtBar.textOf(text)); }

    // --- the sheet -------------------------------------------------------
    let box = null, blatt = null, feld = null, bild = null, mat = null, offen = null, timer = null;


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
        /* Die Ueberschrift und die Formatierleiste teilen sich die erste Zeile
           des Blattes; die Leiste zeigt sich nur, solange der Cursor im Text
           steht (svp-fahrplan.css). Die Farben sind die des Hauses, exakt,
           dazu das Navy der Schrift als Weg zurueck. */
        const kopf = document.createElement('div');
        kopf.className = 'fahr-head';
        kopf.appendChild(titel);
        blatt.appendChild(kopf);
        /* Eine echte Liste, kein Textfeld: dann setzt der Browser bei Enter von selbst
           den naechsten Punkt (Doc, 20.09.2026: "bullets"). */
        feld = document.createElement('ul');
        feld.className = 'fahr-list';
        feld.setAttribute('contenteditable', 'true');
        feld.setAttribute('role', 'textbox');
        feld.setAttribute('aria-label', 'Inhalte der Stunde');
        blatt.appendChild(feld);
        kopf.appendChild(svpFmtBar.build({
            target: feld,
            colors: [
                ['rgb(176, 36, 24)', 'Rot (\u03a5)'],
                ['rgb(121, 158, 49)', 'Gr\u00fcn (\u03c6)'],
                ['rgb(245, 194, 66)', 'Orange (\u03bb)'],
                ['#002060', 'Navy (Standard)']
            ],
            marker: 'rgba(245, 194, 66, 0.45)'
        }));
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
        box.appendChild(blatt);
        document.body.appendChild(box);

        feld.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(save, 600);      /* typing saves itself, like the notes field */
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
        });
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

    /* Zu gross ist die Schrift auch, wenn ein Wort seitlich hinauslaeuft. */
    function passt() {
        return blatt.scrollHeight <= grenze() &&
            blatt.scrollWidth <= blatt.clientWidth + 1;
    }

    function fitFont() {
        if (!blatt || !box || box.hidden) return;
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
        return [].map.call(feld.childNodes, function (n) {
            return svpFmtBar.clean(n);
        }).filter(function (z) { return svpFmtBar.textOf(z); });
    }

    function save() {
        clearTimeout(timer);
        if (!offen) return;
        const text = zeilen().join('\n');
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
            const li = document.createElement('li');
            /* through clean() also on the way in: older lines are plain text and pass
               as they are, a line from the cloud is trusted no further than a typed one */
            li.innerHTML = svpFmtBar.clean(t);
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
        feld.focus();
        /* Doc, 20.09.2026: "setz den cursor eine Zeile tiefer hinter den ersten bullet" -
           er steht also im ERSTEN Punkt, hinter dem, was dort schon steht. */
        const sel = window.getSelection();
        if (sel && feld.firstChild) {
            const r = document.createRange();
            r.selectNodeContents(feld.firstChild);
            r.collapse(false);
            sel.removeAllRanges();
            sel.addRange(r);
        }
    }

    function hide() {
        save();
        box.hidden = true;
        offen = null;
    }
});
