/**
 * svp-suche.js — Suche ueber ALLE Plaene, eine Zeile unter dem Laufband.
 *
 * Die Suche in der Werkzeugleiste (svp-plan-search.js) sieht nur ihre eigene
 * Seite - daher "1 von 48". Diese hier antwortet auf die andere Frage: "in
 * welcher Woche welchen Fachs kommt das vor?" (Doc, 22.09.2026).
 *
 * Woher die Daten kommen - der ganze Trick steht in zwei Zeilen:
 *   statisch  -> plan-suchindex.json (tools/build-plan-suchindex.mjs liest die
 *                window.PLAN aller Planseiten; nur beim Aendern einer Plan-HTML
 *                neu zu bauen)
 *   lebendig  -> svp_plan_edits, EIN Request ohne page-Filter holt den
 *                aktuellen Stand ALLER Plaene (die Tabelle ist anon-lesbar).
 * Was Doc im Browser aendert, ist damit sofort auffindbar, ohne dass irgendwer
 * einen Index neu baut. Fehlt die Cloud (offline, abgemeldet), sucht die Zeile
 * im Plan-Stand weiter und sagt es in der Fusszeile.
 *
 * Ein Treffer zeigt nicht den Inhalt, sondern fuehrt hin: der Klick geht auf
 * <plan>?kw=<woche>&q=<wort>. Den Rest machen Teile, die es schon gibt - ?kw=
 * klappt die Woche auf und scrollt sie in die Mitte (svp-plan-keys.js), ?q=
 * fuellt das Suchfeld der Seite, malt den Treffer an und holt den richtigen
 * Reiter nach vorn (svp-plan-search.js). Diese Liste muss also keine
 * Planinhalte nachbauen.
 *
 * Aufgehaengt wird die Zeile von svp-nav.js - dort, wo auch das Laufband
 * entsteht, also nur auf Planseiten.
 */
(function () {
    const script = document.currentScript;
    const base = (script && script.dataset.base) || '';
    const head = document.querySelector('.plan-sticky');
    if (!head || !window.svpFalten) return;
    const falten = window.svpFalten;

    const MIN = 2;          /* ab zwei Zeichen - ein einzelner Buchstabe trifft alles */
    const MAX_ZEILEN = 60;  /* mehr liest niemand; der Rest steht als Zahl darunter */

    /* ---- die Zeile selbst ------------------------------------------------- */
    const box = document.createElement('div');
    box.className = 'nav-suche';
    const feld = document.createElement('input');
    feld.type = 'search';
    feld.id = 'svp-suche';
    feld.className = 'svp-search nav-suche-feld';
    feld.placeholder = 'Alle Plaene durchsuchen …';
    feld.autocomplete = 'off';
    feld.setAttribute('aria-label', 'Ueber alle Stoffverteilungsplaene suchen');
    feld.title = 'Sucht in allen Plaenen: Woche, Bereich, Thema, Stichpunkte und Material';
    const zahl = document.createElement('span');
    zahl.className = 'svp-search-count nav-suche-zahl';
    const drop = document.createElement('div');
    drop.className = 'suche-drop';
    drop.hidden = true;
    drop.setAttribute('role', 'listbox');
    box.appendChild(feld);
    box.appendChild(zahl);
    box.appendChild(drop);
    /* Unter das Laufband, nicht hinein: der Dock blendet sich selbst aus, wenn
       es keine Nachrichten gibt (svp-news.css) - die Suchzeile soll aber immer
       da sein. */
    const dock = head.querySelector('.nav-news-dock');
    head.insertBefore(box, dock ? dock.nextSibling : head.firstChild);

    /* ---- Daten ----------------------------------------------------------- */
    let daten = null;     /* { plaene, stand, cloud } - erst nach dem ersten Tippen */
    let filme = {};       /* Film-Kennung -> { titel, kanal }, aus film-titel.json */
    let laden = null;     /* das laufende Versprechen, damit nur einmal geladen wird */

    /* Die Felder heissen im Index wie im Plan gelesen, in der Cloud wie im
       Quelltext gespeichert - hier treffen sie sich. */
    const CLOUD_FELD = { topic: 'thema', date: 'datum', type: 'typ', details: 'punkte' };

    const CLOUD_FRIST = 8000;   /* danach lieber der Plan-Stand als ein haengendes Feld */

    /* Ein Request fuer alle Plaene - aber GEZIELT nach ihren Adressen gefragt
       (page=in.(...)), nicht "gib mir die ganze Tabelle". Gemessen am
       22.09.2026: eine Seite kostet 1,2 s und 37 KB; die ungefilterte Abfrage
       lief in 20 s nicht durch und liess die Zeile auf "laedt …" stehen. Die
       Frist bricht sie notfalls ab - dann sucht die Zeile im Plan-Stand und
       sagt es in der Fusszeile, statt zu haengen. */
    async function holeCloud(pfade) {
        if (!window.svpAuth || !svpAuth.DB_URL || !svpAuth.DB_KEY || !pfade.length) return null;
        const liste = pfade.map(function (p) { return '"' + p + '"'; }).join(',');
        const url = svpAuth.DB_URL + '/rest/v1/svp_plan_edits?select=page,edits&page=in.('
            + encodeURIComponent(liste) + ')';
        const abbruch = new AbortController();
        const uhr = setTimeout(function () { abbruch.abort(); }, CLOUD_FRIST);
        try {
            const res = await fetch(url, {
                signal: abbruch.signal,
                headers: { apikey: svpAuth.DB_KEY, Authorization: 'Bearer ' + svpAuth.DB_KEY }
            });
            if (!res.ok) return null;
            const rows = await res.json();
            const map = {};
            rows.forEach(function (r) { if (r && r.page) map[r.page] = r.edits || {}; });
            return map;
        } catch (e) { return null; }   /* offline, zu langsam - der Plan-Stand reicht */
        finally { clearTimeout(uhr); }
    }

    function holen() {
        if (laden) return laden;
        laden = (async function () {
            const res = await fetch(base + 'plan-suchindex.json');
            if (!res.ok) throw new Error('kein Index');
            const idx = await res.json();
            /* Die Filmtitel kommen aus derselben kleinen Datei wie in der
               Planseite (tools/build-film-titel.mjs) - fehlt sie, sucht die
               Zeile eben ohne sie weiter. */
            try {
                const fr = await fetch(base + 'film-titel.json');
                if (fr.ok) filme = (await fr.json()).filme || {};
            } catch (e) { filme = {}; }
            idx.plaene.forEach(function (p) { p.pfad = new URL(p.href, base).pathname; });
            const cloud = await holeCloud(idx.plaene.map(function (p) { return p.pfad; }));
            idx.plaene.forEach(function (p) {
                const ov = cloud ? (cloud[p.pfad] || {}) : {};
                p.wochen.forEach(function (w) { ruesten(p, w, ov[String(w.i)]); });
            });
            daten = { plaene: idx.plaene, stand: idx.gebaut, cloud: !!cloud };
            return daten;
        })().catch(function (e) { laden = null; throw e; });
        return laden;
    }

    /* Eine Woche fuer die Suche vorbereiten: Cloud ueber Index legen (dieselbe
       Regel wie im Plan - was gespeichert ist, gewinnt), dann EINMAL falten.
       Gefaltet wird getrennt nach Feldern, damit die Trefferliste sagen kann,
       WO es getroffen hat - und die Teile zusammen sind der Heuhaufen. */
    function ruesten(p, w, ov) {
        if (ov) {
            Object.keys(ov).forEach(function (k) {
                if (ov[k] == null) return;
                w[CLOUD_FELD[k] || k] = ov[k];
            });
        }
        /* Eine geleerte Woche zeigt nichts - dann darf sie auch nichts finden. */
        if (w.leer) { w.thema = ''; w.punkte = []; w.material = ''; }
        w.wo = [w.nr ? 'SW ' + w.nr : '', w.kw ? 'KW ' + w.kw : '', w.datum || ''].filter(Boolean).join(' · ');
        /* Der Bereich wird als PILLE gesucht, wie er im Plan steht ("LB 1"),
           nicht als Schluessel ("lb1"). Hat die Cloud den Typ geaendert, gilt
           ihre Marke - die Tabelle dazu kommt aus dem Index mit. */
        const bereich = (p.marken && p.marken[w.typ]) || w.bereich || '';
        w._plan = falten(p.kurz + ' ' + p.lang);
        w._woche = falten([w.wo, w.u ? w.u + ' Ustd' : '', bereich, w.ferien || ''].join(' '));
        w._thema = falten(w.thema || '');
        w._punkte = falten((w.punkte || []).join(' \n '));
        w._material = falten(matWorte(w.material || ''));
        w._hay = [w._plan, w._woche, w._thema, w._punkte, w._material].join('\n');
    }

    /* Aus der Materialzeile zaehlt, was ein Mensch dort liest: Beschriftungen,
       die Beschreibung «...» und Dateinamen - nicht die rohen Adressen.
       Dieselbe Regel wie vtDateiname in svp-plan-search.js: ein
       SharePoint-Freigabelink endet auf einem Zufalls-Token ohne Punkt, und der
       wuerde jede Buchstabenfolge treffen. Aendert sich die Regel dort, gehoert
       sie hier mit geaendert. */
    function dateiname(pfad) {
        let s = String(pfad == null ? '' : pfad).split(/[?#]/)[0].replace(/\/+$/, '');
        s = s.slice(s.lastIndexOf('/') + 1);
        try { s = decodeURIComponent(s); } catch (e) { /* kaputt kodiert - roh nehmen */ }
        if (!/\.[a-z0-9]{2,5}$/i.test(s) || s.length > 80) return '';
        return s.replace(/[._-]+/g, ' ');
    }

    /* Ein Film traegt seinen echten Titel nicht in der Zeile - er steht bei
       YouTube und kommt aus film-titel.json (Doc, 22.09.2026: "Game wird nur
       einmal gefunden"). Adressen selbst bleiben draussen, nur Dateinamen und
       Titel gehen in den Heuhaufen. */
    function filmId(u) {
        let m = String(u || '').match(/youtu\.be\/([\w-]{6,})/i);
        if (m) return m[1];
        m = String(u || '').match(/[?&]v=([\w-]{6,})/i);
        return m ? m[1] : '';
    }

    function matWorte(src) {
        return String(src == null ? '' : src)
            .replace(/\[\[datei:([^\]]*)\]\]/g, function (_, p) { return ' ' + dateiname(p) + ' '; })
            .replace(/\[\[wichtig\]\]/g, ' ')
            .replace(/«([^»]*)»/g, ' $1 ')
            .replace(/https?:\/\/\S+/g, function (u) {
                const f = filme[filmId(u)];
                return ' ' + (f ? (f.titel || '') + ' ' + (f.kanal || '') : dateiname(u)) + ' ';
            })
            .replace(/\s+/g, ' ').trim();
    }

    /* ---- Suchen ----------------------------------------------------------- */
    function suchen(terms) {
        const out = [];
        for (const p of daten.plaene) {
            for (const w of p.wochen) {
                if (!terms.every(function (t) { return w._hay.includes(t); })) continue;
                out.push({ p: p, w: w, marken: marken(w, terms) });
            }
        }
        return out;
    }

    /* Wo hat es getroffen? Nur zum Lesen der Liste, darum hoechstens zwei
       Marken und die naechstliegende zuerst. */
    function marken(w, terms) {
        const out = [];
        [[w._thema, 'Thema'], [w._punkte, 'Stichpunkt'], [w._material, 'Material'],
         [w._woche, 'Woche'], [w._plan, 'Plan']].forEach(function (paar) {
            if (out.length >= 2 || !paar[0]) return;
            if (terms.some(function (t) { return paar[0].includes(t); })) out.push(paar[1]);
        });
        return out;
    }

    /* Ein Treffer im Stoff wiegt schwerer als einer in der Woche oder im Namen
       des Plans. Stabil sortiert, also bleibt die Plan-Reihenfolge stehen. */
    function rang(t) {
        return t.marken.some(function (m) { return m === 'Thema' || m === 'Stichpunkt' || m === 'Material'; }) ? 0 : 1;
    }

    /* ---- Anzeigen -------------------------------------------------------- */
    /* Den Treffer im Text anmalen: die Faltung rechnet die Stelle im gefalteten
       Text auf den echten Text zurueck (svp-falten.js) - deshalb steht sie
       zentral. Ohne das waere "Würfel" bei der Suche nach "wuerfel" ein Treffer,
       den man in der Zeile nicht wiederfindet. */
    function malen(text, terms) {
        const frag = document.createDocumentFragment();
        const fm = window.svpFaltenMap(String(text || ''));
        const stellen = [];
        terms.forEach(function (t) {
            for (let k = fm.folded.indexOf(t); k !== -1; k = fm.folded.indexOf(t, k + t.length)) {
                stellen.push([fm.at[k], fm.at[k + t.length]]);
            }
        });
        stellen.sort(function (a, b) { return a[0] - b[0]; });
        let pos = 0;
        stellen.forEach(function (s) {
            if (s[0] < pos) return;   /* ueberlappt den vorigen Treffer */
            if (s[0] > pos) frag.appendChild(document.createTextNode(text.slice(pos, s[0])));
            const m = document.createElement('mark');
            m.textContent = text.slice(s[0], s[1]);
            frag.appendChild(m);
            pos = s[1];
        });
        frag.appendChild(document.createTextNode(text.slice(pos)));
        return frag;
    }

    function zeichnen(treffer, q, terms) {
        drop.textContent = '';
        if (!treffer.length) {
            const leer = document.createElement('div');
            leer.className = 'suche-leer';
            leer.textContent = 'Nichts gefunden';
            drop.appendChild(leer);
            drop.appendChild(fuss(0));
            drop.hidden = false;
            return;
        }
        let letzter = null;
        treffer.slice(0, MAX_ZEILEN).forEach(function (t) {
            if (t.p !== letzter) {
                const kopf = document.createElement('div');
                kopf.className = 'suche-kopf';
                const pille = document.createElement('span');
                pille.className = 'badge b-grey suche-pille';
                pille.textContent = t.p.kurz;
                const lang = document.createElement('span');
                lang.className = 'suche-lang';
                lang.textContent = t.p.lang;
                kopf.appendChild(pille);
                kopf.appendChild(lang);
                drop.appendChild(kopf);
                letzter = t.p;
            }
            const a = document.createElement('a');
            a.className = 'suche-zeile';
            a.setAttribute('role', 'option');
            /* ?q= gibt der Seite das Wort mit, damit sie es selbst anmalt - aber
               nur, wenn sie es auch finden KANN. Steckt der Treffer allein im
               Namen des Plans ("Mathematik Klasse 12"), fuehrt ?q= dort zu null
               Treffern und die Seite filtert alle Wochen weg, auch die
               gesuchte. Dann nur springen. */
            const findbar = t.marken.some(function (m) { return m !== 'Plan'; });
            const frage = [t.w.kw ? 'kw=' + t.w.kw : '', findbar ? 'q=' + encodeURIComponent(q) : '']
                .filter(Boolean).join('&');
            a.href = base + t.p.href + (frage ? '?' + frage : '');
            const wo = document.createElement('span');
            wo.className = 'suche-wo';
            wo.appendChild(malen(t.w.wo, terms));
            const txt = document.createElement('span');
            txt.className = 'suche-thema';
            txt.appendChild(malen(t.w.thema || t.w.ferien || '(ohne Thema)', terms));
            const mk = document.createElement('span');
            mk.className = 'suche-mark';
            mk.textContent = t.marken.join(' · ');
            a.appendChild(wo);
            a.appendChild(txt);
            a.appendChild(mk);
            drop.appendChild(a);
        });
        drop.appendChild(fuss(treffer.length));
        drop.hidden = false;
    }

    /* Die Fusszeile sagt, wie frisch die Antwort ist - der Plan-Stand ist
       gebaut, die Inhalte sind live. Ohne diese Zeile waere ein alter Index
       nicht von einem aktuellen zu unterscheiden. */
    function fuss(n) {
        const f = document.createElement('div');
        f.className = 'suche-fuss';
        const rest = n > MAX_ZEILEN ? ('… und ' + (n - MAX_ZEILEN) + ' weitere · ') : '';
        f.textContent = rest + 'Plan-Stand ' + (daten.stand || '?') + ' · Inhalte '
            + (daten.cloud ? 'live aus der Cloud' : 'nur aus dem Plan-Stand (Cloud nicht erreichbar)');
        return f;
    }

    function zu() { drop.hidden = true; drop.textContent = ''; }

    /* ---- Lauf ------------------------------------------------------------ */
    let lauf = 0;   /* nur die Antwort auf die letzte Eingabe darf zeichnen */
    async function suchlauf() {
        const q = feld.value.trim();
        const terms = falten(q).split(/\s+/).filter(Boolean);
        if (!terms.length || falten(q).replace(/\s+/g, '').length < MIN) {
            zahl.textContent = '';
            zahl.classList.remove('none');
            zu();
            return;
        }
        const meins = ++lauf;
        if (!daten) {
            zahl.textContent = 'lädt …';
            try { await holen(); } catch (e) {
                zahl.textContent = 'kein Index';
                return;
            }
            if (meins !== lauf) return;   /* inzwischen weitergetippt */
        }
        const treffer = suchen(terms);
        /* Wer "mathematik klasse 12" tippt, trifft ueber den Plannamen jede
           Woche, in der irgendwo eine 12 steht. Darum zuerst die Wochen, in
           denen das Wort im Stoff steht, dann der Rest - die Reihenfolge der
           Plaene und Wochen bleibt innerhalb einer Gruppe erhalten. */
        treffer.sort(function (a, b) { return rang(a) - rang(b); });
        const plaene = new Set(treffer.map(function (t) { return t.p.kurz; })).size;
        zahl.textContent = treffer.length
            ? treffer.length + ' in ' + plaene + (plaene === 1 ? ' Plan' : ' Plänen')
            : 'nichts';
        zahl.classList.toggle('none', !treffer.length);
        zeichnen(treffer, q, terms);
    }

    /* ---- Bedienung ------------------------------------------------------- */
    feld.addEventListener('input', suchlauf);
    feld.addEventListener('search', suchlauf);   /* das eingebaute ✕ */
    feld.addEventListener('focus', function () { if (feld.value.trim()) suchlauf(); });
    feld.addEventListener('keydown', function (e) {
        /* Die Wochenzeilen des Plans hoeren selbst auf Tasten - hier nicht. */
        e.stopPropagation();
        const zeilen = [...drop.querySelectorAll('.suche-zeile')];
        const jetzt = zeilen.findIndex(function (z) { return z.classList.contains('an'); });
        if (e.key === 'Escape') { feld.value = ''; suchlauf(); return; }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (!zeilen.length) return;
            e.preventDefault();
            const naechste = e.key === 'ArrowDown'
                ? Math.min(jetzt + 1, zeilen.length - 1)
                : Math.max(jetzt - 1, 0);
            zeilen.forEach(function (z) { z.classList.remove('an'); });
            zeilen[naechste].classList.add('an');
            zeilen[naechste].scrollIntoView({ block: 'nearest' });
            return;
        }
        if (e.key === 'Enter') {
            const ziel = jetzt >= 0 ? zeilen[jetzt] : zeilen[0];
            if (ziel) { e.preventDefault(); location.href = ziel.href; }
        }
    });
    document.addEventListener('click', function (e) {
        if (!box.contains(e.target)) zu();
    });
})();
