// Stoffverteilungsplan renderer, part "forms": print forms: MAP and Formular.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        buildMap, mapTitle, buildForm, formTitle
    });

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
    const SVP_DIR = P.SVP_DIR = (function () {
        const s = document.currentScript;
        return s ? s.src.replace(/[^/]*$/, '') : '../';
    })();

    /* Logos fuer die Druckformulare. buildMap()/buildForm() laufen erst in
       beforeprint - ein dort frisch erzeugtes <img> laedt zu spaet und bleibt
       im PDF leer (Doc, 01.09.2026). Darum die SVGs einmal beim Laden der
       Seite holen und im Kopf INLINE einsetzen; solange das noch laeuft (oder
       wenn es fehlschlaegt), bleibt es beim <img> wie bisher - der liegt dann
       wenigstens im Bildcache. */
    const LOGO_SVG = {};
    ['ibb-logo.svg', 'ibb-gym-obs-logo.svg'].forEach(function (file) {
        const pre = new Image();
        pre.src = SVP_DIR + file;
        fetch(SVP_DIR + file)
            .then(function (r) { return r.ok ? r.text() : null; })
            .then(function (t) { if (t) LOGO_SVG[file] = t; })
            .catch(function () { /* offline: der <img>-Weg bleibt */ });
    });

    function logoNode(file, alt, cls) {
        if (LOGO_SVG[file]) {
            const box = document.createElement('span');
            box.className = cls;
            box.innerHTML = LOGO_SVG[file];
            const svg = box.querySelector('svg');
            if (svg) svg.setAttribute('aria-label', alt);
            return box;
        }
        const img = document.createElement('img');
        img.className = cls;
        img.src = SVP_DIR + file;
        img.alt = alt;
        return img;
    }

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
        P.planRows.forEach(function (row, i) {
            const ov = P.saved[i] || {};
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
            P.setMathText(li, t);
            ul.appendChild(li);
        });
        parent.appendChild(ul);
    }

    function buildMap(track) {
        P.building = !track; /* ?map preview may load KaTeX, print must not */
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
        lt.appendChild(logoNode('ibb-logo.svg', 'IBB Berufliche Schulen', 'm-logo'));
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

        const meta = P.lbMeta();
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
            P.setMathText(head2, b.topic);
            mod.appendChild(head2);
            if (b.details.length) {
                const ul = document.createElement('ul');
                b.details.forEach(function (d) {
                    const li = document.createElement('li');
                    P.setMathText(li, d);
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
                P.setMathText(n, note.join(' · '));
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
            P.setMathText(ln, lnw.join(' · '));
            tr.appendChild(ln);

            tr.appendChild(document.createElement('td')); /* Offene Fragen */
            tr.appendChild(document.createElement('td')); /* Stand der Bearbeitung */
            tb.appendChild(tr);
        });

        table.appendChild(tb);
        doc.appendChild(table);
        document.body.appendChild(doc);
        P.building = false;
    }

    function mapTitle() {
        return P.exportTitle().replace(/^SVP /, 'MAP ');
    }

    /* --- Stoffverteilungsplan nach der Schul-Vorlage (FORM export) ---------
       Dritter Export neben "Drucken / PDF" und "Modulablaufplan": das
       Campus-Formular "Stoffverteilungsplan 2026/2027" (Word-Vorlage) —
       A4 quer, sechs Spalten in den Breiten des Originals, EINE ZEILE JE
       WOCHE (nicht je Modulblock, dafuer ist der MAP da). Gebaut aus
       denselben PLAN-Zeilen + lokalen Edits, damit nichts auseinanderlaeuft.

       Die Vorlage fuehrt in Spalte 1 zusaetzlich eine A/B-Woche. Die Plandaten
       kennen keine A/B-Woche, deshalb steht dort nur KW/SW. */
    function formLbShort(k) {
        const m = String(k || '').match(/Lernbereich\s*(\d+)/);
        if (m) return 'LB ' + m[1];
        if (/Wahlbereich/.test(k || '')) return 'WB';
        return k || '';
    }

    function buildForm(track) {
        P.building = !track;              /* ?form preview may load KaTeX, print must not */
        const old = document.getElementById('svp-form');
        if (old) old.remove();

        const doc = document.createElement('div');
        doc.id = 'svp-form';

        const table = document.createElement('table');
        const cg = document.createElement('colgroup');
        // Column widths of the Word template, as a share of the type area.
        [5.29, 9.14, 11.47, 19.45, 27.79, 26.86].forEach(function (w) {
            const col = document.createElement('col');
            col.style.width = w + '%';
            cg.appendChild(col);
        });
        table.appendChild(cg);

        // Running head (title left, IBB logo right) — the Word page header,
        // repeated on every printed page because it sits in the thead.
        const thead = document.createElement('thead');
        const rh = document.createElement('tr');
        rh.className = 'f-runhead';
        const rt = document.createElement('td');
        rt.colSpan = 6;
        const wrap = document.createElement('div');
        const ttl = document.createElement('span');
        ttl.textContent = 'Stoffverteilungsplan 2026/2027';
        /* Das Logo der Vorlage: IBB Gymnasium & Oberschule. Es steckte als
           Vektor-EMF im Word-Kopf und liegt jetzt als SVG daneben. */
        wrap.appendChild(ttl);
        wrap.appendChild(logoNode('ibb-gym-obs-logo.svg',
            'IBB Gymnasium & Oberschule', 'f-logo'));
        rt.appendChild(wrap);
        rh.appendChild(rt);
        thead.appendChild(rh);
        table.appendChild(thead);

        const tb = document.createElement('tbody');

        // Head block — plain rows, so it stays on the first page.
        function metaRow(cls, text) {
            const tr = document.createElement('tr');
            tr.className = 'f-meta ' + cls;
            const td = document.createElement('td');
            td.colSpan = 6;
            td.textContent = text;
            tr.appendChild(td);
            tb.appendChild(tr);
        }
        metaRow('f-fach', 'Fach: ' + mapFach());
        const klasse = mapKlasse();
        metaRow('f-klasse', (klasse ? 'Klassenstufe: ' + klasse + ' · ' : '') +
            'Lehrkraft: Dr. Michael R. Alvers');

        // Column titles as a normal row — the template does not repeat them.
        const hr = document.createElement('tr');
        hr.className = 'f-head';
        ['KW/ SW', 'Datum', 'Modul', 'Lernbereich',
         'Ziele / Inhalte / Didaktischer Schwerpunkt', 'LNW / Bemerkungen']
        .forEach(function (t) {
            const th = document.createElement('td');
            th.textContent = t;
            hr.appendChild(th);
        });
        tb.appendChild(hr);

        const meta = P.lbMeta();
        let sw = 0;                     /* Schulwoche: Ferienzeilen zaehlen nicht mit */

        /* planRows, not window.PLAN — a shift can push content into weeks that
           exist only in the edits; those must reach the paper too. */
        P.planRows.forEach(function (row, i) {
            const ov = P.saved[i] || {};
            const tr = document.createElement('tr');

            const kw = document.createElement('td');
            kw.className = 'f-kw';
            const date = document.createElement('td');
            date.className = 'f-date';
            // Drop the trailing year (17.–21.08.26 -> 17.–21.08.), the school
            // year is in the running head.
            date.textContent = String(ov.date != null ? ov.date : row.date)
                .replace(/\.\d{2}$/, '.');

            const ferien = ov.ferien || row.ferien;
            if (ferien) {
                kw.textContent = (ov.kw != null ? ov.kw : (row.kw || '')) || '';
                tr.appendChild(kw);
                tr.appendChild(date);
                const td = document.createElement('td');
                td.className = 'f-fer';
                td.colSpan = 4;
                td.textContent = String(ferien).split('·')[0].trim();
                tr.appendChild(td);
                tb.appendChild(tr);
                return;
            }

            sw += 1;
            kw.textContent = (ov.kw != null ? ov.kw : row.kw) + '/' + sw;
            tr.appendChild(kw);
            tr.appendChild(date);

            const type = ov.type || row.type || 'org';
            const lb = meta[type];

            const mod = document.createElement('td');
            mod.className = 'f-mod';
            mod.textContent = lb ? formLbShort(lb.k) : '';
            tr.appendChild(mod);

            const lbc = document.createElement('td');
            lbc.className = 'f-lb';
            if (lb) {
                const n = document.createElement('div');
                n.textContent = lb.v;
                lbc.appendChild(n);
            }
            const utxt = String(ov.u != null ? ov.u : (row.u || ''));
            if (utxt) {
                const u = document.createElement('div');
                u.className = 'f-u';
                u.textContent = utxt + ' Unterrichtsstunden';
                lbc.appendChild(u);
            }
            tr.appendChild(lbc);

            const inh = document.createElement('td');
            inh.className = 'f-inh';
            const b = document.createElement('b');
            P.setMathText(b, ov.topic != null ? ov.topic : row.topic);
            inh.appendChild(b);
            const ziel = ov.ziel != null ? ov.ziel : (row.ziel || '');
            if (ziel) {
                const z = document.createElement('div');
                z.className = 'f-ziel';
                P.setMathText(z, ziel);
                inh.appendChild(z);
            }
            const items = ov.details || row.details;
            if (items && items.length) {
                const ul = document.createElement('ul');
                P.buildDetailList(ul, items);
                inh.appendChild(ul);
            }
            tr.appendChild(inh);

            // Remark column: Leistungsnachweise first (the clauses the MAP
            // pulls out too), the rest of the remark underneath.
            const rem = document.createElement('td');
            rem.className = 'f-rem';
            const rtext = String(ov.remark != null ? ov.remark : (row.remark || ''));
            const lnw = [], note = [];
            rtext.split(/\s*[·;]\s*/).forEach(function (part) {
                if (!part.trim()) return;
                (LNW_RE.test(part) ? lnw : note).push(part.trim());
            });
            const own = ov.lnw != null ? ov.lnw : row.lnw;
            if (own) { lnw.length = 0; lnw.push(own); }
            if (lnw.length) {
                const l = document.createElement('div');
                l.className = 'f-lnw';
                P.setMathText(l, lnw.join(' · '));
                rem.appendChild(l);
            }
            if (note.length) {
                const n = document.createElement('div');
                P.setMathText(n, note.join(' · '));
                rem.appendChild(n);
            }
            tr.appendChild(rem);
            tb.appendChild(tr);
        });

        table.appendChild(tb);
        doc.appendChild(table);
        document.body.appendChild(doc);
        P.building = false;
    }

    function formTitle() {
        return P.exportTitle().replace(/^SVP /, 'SVP Formular ');
    }

    // Toolbar gets the second export button next to "Drucken" — centrally, so
    // no plan page has to be touched.
    P.mapMode = false;
    (function addMapButton() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const btn = document.createElement('button');
        btn.className = 'action';
        btn.textContent = 'Modulablaufplan';
        btn.title = 'IBB-Modulablaufplan (Querformat) drucken / als PDF sichern';
        btn.addEventListener('click', function () {
            P.withEditGate(function () {
                P.mapMode = true;
                window.print();
            });
        });
        const first = bar.querySelector('button.action');
        if (first) bar.insertBefore(btn, first.nextSibling);
        else bar.appendChild(btn);
    })();

    // Dritter Ausgabe-Knopf: der Stoffverteilungsplan im Campus-Formular.
    P.formMode = false;
    (function addFormButton() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const btn = document.createElement('button');
        btn.className = 'action';
        btn.textContent = 'Stoffverteilungsplan';
        btn.title = 'Campus-Formular "Stoffverteilungsplan" (Querformat) drucken / als PDF sichern';
        btn.addEventListener('click', function () {
            P.withEditGate(function () {
                P.formMode = true;
                window.print();
            });
        });
        const items = [...bar.querySelectorAll('button.action')];
        const map = items.find(function (x) { return x.textContent.trim() === 'Modulablaufplan'; });
        if (map) bar.insertBefore(btn, map.nextSibling);
        else bar.appendChild(btn);
    })();
});
