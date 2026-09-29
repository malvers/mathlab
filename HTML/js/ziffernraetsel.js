// Ziffernrätsel-Labor (Doc, 29.09.2026: "SEND + MORE = MONEY mach ein Lab bitte, dass alle Schritte genau erklärt
// werden. Bau auch wie in Decks Solita ein, die pro Step Fragen noch gründlicher erklären kann. Bis runter
// Grundschullevel" - and: "halte das Lab offen für andere Aufgaben (siehe Vorrechnen)").
// The puzzles are Vorrechnen's block "Knobeln · Ziffernrätsel" (js/vorrechnen-aufgaben-knobeln.js: task, column
// layout, steps, explanation, source) - one source for both. A puzzle with detailed steps of its own
// (js/ziffernraetsel-schritte.js) is explained down to primary-school level; every other one walks through
// Vorrechnen's steps and its long explanation, with the solution from the solver below. Solita (js/solita-frage.js)
// gets the step on screen and explains it further.
(function () {
    const BLOCK = BLOECKE.find(b => b.titel === 'Knobeln · Ziffernrätsel');
    const LISTE = BLOCK ? AUFGABEN.slice(BLOCK.ab, BLOCK.bis) : [];
    const TEX = Object.fromEntries(LISTE.map(a => [a[0], a[1]]));
    // Vorrechnen writes the place value small over every letter (\overset ... \vphantom); the board here has its own
    // row of place values, so the explanation column takes the task without them
    const OHNE_STELLEN = /\\overset\{\\color\{#8a93a3\}\\scriptstyle (?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}\{((?:[^{}]|\{[^{}]*\})*?)\\vphantom\{\\mathrm\{A\}\}\}/g;
    const TEX_SCHLICHT = Object.fromEntries(LISTE.map(a => [a[0], a[1].replace(OHNE_STELLEN, '$1')]));
    const IDS = LISTE.map(a => a[0]);
    const START = 'k-money';
    const DETAIL = window.ZIFFERNRAETSEL_SCHRITTE || {};
    // the products have no column layout (SCHEMATA) - their name for the tab
    const NAMEN = { 'k-mal6': 'A · 6 = 4A', 'k-neun': 'AB · 9 = A0B', 'k-1089': 'ABCD · 9 = DCBA' };
    const STELLE = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender'];
    const BASIS_KEY = 'ziffernraetsel-grundlagen';

    function dbg(msg) { if (window.DebugWindow && window.DebugWindow.log) window.DebugWindow.log('[ziffernraetsel] ' + msg); }
    function name(id) {
        const s = SCHEMATA[id];
        return s ? s.zeilen.join(' + ') + ' = ' + s.ergebnis : (NAMEN[id] || id);
    }
    function mathe(el) {
        if (!window.renderMathInElement) return;
        renderMathInElement(el, {
            delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
            throwOnError: false,
        });
    }

    // ---- solver: every digit assignment of a column sum (SCHEMATA) ---------------------------------------------
    // Letters are tried from the right column leftwards; as soon as all letters of the last k+1 columns have a
    // digit, those columns must add up already (mod 10^(k+1)) - that cuts SEND + MORE = MONEY to a few thousand tries.
    // No number of two digits or more starts with 0.
    const geloest = {};
    function loese(id) {
        if (geloest[id]) return geloest[id];
        const s = SCHEMATA[id];
        if (!s) return (geloest[id] = []);
        const woerter = s.zeilen.concat([s.ergebnis]);
        const spalten = Math.max(...woerter.map(w => w.length));
        const buchst = [], bis = [];
        for (let k = 0; k < spalten; k++) {
            woerter.forEach(w => {
                const ch = w[w.length - 1 - k];
                if (ch && /[A-Z]/.test(ch) && buchst.indexOf(ch) < 0) buchst.push(ch);
            });
            bis[k] = buchst.length - 1;
        }
        const vorne = new Set(woerter.filter(w => w.length > 1 && /[A-Z]/.test(w[0])).map(w => w[0]));
        const wert = {}, belegt = [], raus = [];
        function zahl(w, k) {                          // the last k+1 digits of a word
            let v = 0;
            for (let i = Math.max(0, w.length - 1 - k); i < w.length; i++) v = v * 10 + (/\d/.test(w[i]) ? +w[i] : wert[w[i]]);
            return v;
        }
        function passt(k) {
            const m = Math.pow(10, k + 1);
            const summe = s.zeilen.reduce((a, w) => a + zahl(w, k), 0);
            return summe % m === zahl(s.ergebnis, k) % m;
        }
        (function suche(i) {
            if (i === buchst.length) {
                const k = spalten - 1;
                if (s.zeilen.reduce((a, w) => a + zahl(w, k), 0) === zahl(s.ergebnis, k)) raus.push(Object.assign({}, wert));
                return;
            }
            const ch = buchst[i];
            for (let d = 0; d <= 9; d++) {
                if (belegt[d] || (d === 0 && vorne.has(ch))) continue;
                belegt[d] = true; wert[ch] = d;
                let ok = true;
                for (let k = 0; k < spalten && ok; k++) if (bis[k] === i && !passt(k)) ok = false;
                if (ok) suche(i + 1);
                belegt[d] = false;
            }
            delete wert[ch];
        })(0);
        dbg(id + ': ' + raus.length + ' Lösung(en)');
        return (geloest[id] = raus);
    }

    // ---- the steps of a puzzle -----------------------------------------------------------------------------------
    const REGELN = '<p>Jeder Buchstabe steht für eine Ziffer von 0 bis 9. Gleiche Buchstaben sind gleiche Ziffern, ' +
        'verschiedene Buchstaben verschiedene Ziffern, und vorne steht nie eine 0.</p>';
    // Vorrechnen's explanations come with the operation behind the line it is applied to already (umformungenVorziehen,
    // js/vorrechnen-aufgaben.js - Doc, 29.09.2026: "Bitte IMMER so machen! Auch in der EB!"); here "$$equation |
    // operation$$" only gets the lab's bar, and paragraphs at blank lines
    function vorrechnenText(t) {
        return String(t).split(/\n\s*\n/).map(p =>
            '<p>' + p.replace(/\$\$([^$]+)\$\$/g, (m, inner) => {
                const teil = inner.split(' | ');
                return '$$' + (teil.length === 2 ? teil[0] + ' ' + OP + teil[1] : inner) + '$$';
            }) + '</p>').join('');
    }
    // Equations one under the other stand aligned (Doc, 29.09.2026: "bitte schön aligned"): a run of display formulas
    // with nothing but space between them, each with an "=", becomes ONE aligned block - the "=" one under the other,
    // the operation behind its bar in a column of its own. The operation is written "\qquad \big|\; op" (Vorrechnen's
    // " | " is turned into that). A run with a formula without "=" stays as it is.
    const OP = '\\qquad \\big|\\; ';
    function gleichTeilen(tex) {                     // at the first "=" outside braces
        let tiefe = 0;
        for (let i = 0; i < tex.length; i++) {
            const c = tex[i];
            if (c === '{') tiefe++;
            else if (c === '}') tiefe--;
            else if (c === '=' && tiefe === 0) return [tex.slice(0, i), tex.slice(i + 1)];
        }
        return null;
    }
    function ausrichten(html) {
        return String(html).replace(/\$\$[^$]+\$\$(?:\s*\$\$[^$]+\$\$)+/g, lauf => {
            const zeilen = lauf.match(/\$\$[^$]+\$\$/g).map(b => {
                const tex = b.slice(2, -2).trim();
                const k = tex.indexOf(OP.trim());
                const gl = k < 0 ? tex : tex.slice(0, k).trim(), op = k < 0 ? '' : tex.slice(k + OP.trim().length).trim();
                const teile = gleichTeilen(gl);
                return teile ? { l: teile[0].trim(), r: teile[1].trim(), op } : null;
            });
            if (zeilen.some(z => !z)) return lauf;
            return '$$\\begin{aligned}' + zeilen.map(z => z.l + ' &= ' + z.r + (z.op ? ' &&\\big|\\; ' + z.op : '')   /* the last line: no bar */).join(' \\\\ ') +
                '\\end{aligned}$$';
        });
    }
    function probe(id, w) {                           // the sum with digits, as on paper
        const s = SCHEMATA[id];
        const z = wort => wort.split('').map(ch => /\d/.test(ch) ? ch : w[ch]).join('');
        const zeilen = s.zeilen.map((wort, i) => (i === s.zeilen.length - 1 ? s.zeichen + '\\;' : '') + z(wort));
        return '$$\\begin{array}{r} ' + zeilen.join('\\\\ ') + '\\\\ \\hline ' + z(s.ergebnis) + ' \\end{array}$$';
    }
    const schritteCache = {};
    function schritte(id) {
        if (schritteCache[id]) return schritteCache[id];
        if (DETAIL[id]) return (schritteCache[id] = DETAIL[id]);
        const liste = [{
            titel: 'Das Rätsel',
            html: '$$' + TEX_SCHLICHT[id] + '$$' + REGELN +
                // {WER}: Solita or Doc, whoever is chosen in the question box (Doc, 29.09.2026: "Doc erklärt dir jeden
                // Schritt genauer", and not "aus Vorrechnen" - that means nothing to the class)
                '<p class="v-aha">Hier gehen wir die Rechnung Schritt für Schritt durch. {WER} erklärt ' +
                'dir jeden Schritt genauer – so einfach, wie du es brauchst.</p>',
        }];
        // one step, one operation: the equation before it with the operation behind it, the new one below - aligned
        // (Doc, 29.09.2026: the operation behind the line it is applied to); step 1 starts from the task itself
        const L = LOESUNGEN[id] || [];
        L.forEach((z, k) => {
            const m = /^([A-Z])=(\d)$/.exec(z[0].replace(/\s/g, ''));
            // step 1 starts from the task's equation - without the question after the comma ("M+A+T+H = ?")
            const vorher = k === 0 ? TEX_SCHLICHT[id].split(',\\quad')[0] : L[k - 1][0];
            liste.push({
                titel: 'Schritt ' + (k + 1),
                html: '$$' + vorher + ' ' + OP + z[1] + '$$$$' + z[0] + '$$',
                setzt: m ? { [m[1]]: +m[2] } : null,
            });
        });
        if (ERKLAERUNGEN[id]) liste.push({ titel: 'Ausführlich erklärt', html: vorrechnenText(ERKLAERUNGEN[id]) });
        const l = loese(id);
        if (l.length === 1) {
            liste.push({
                titel: 'Die Lösung', setzt: l[0],
                html: '<p>Mit den Ziffern gerechnet:</p>' + probe(id, l[0]) +
                    '<p>Die Werte: ' + Object.keys(l[0]).sort().map(b => '$' + b + '=' + l[0][b] + '$').join(', ') + '.</p>',
            });
        }
        return (schritteCache[id] = liste);
    }

    // ---- state -------------------------------------------------------------------------------------------------
    let mitBasis = true;
    try { mitBasis = localStorage.getItem(BASIS_KEY) !== 'aus'; } catch (e) { }
    let id = START, pos = 0;                        // pos: index in the steps shown (sichtbar)
    function sichtbar() {
        return schritte(id).map((s, i) => ({ s, i })).filter(x => mitBasis || !x.s.basis);
    }
    // what is known after full step i: letters, carries, and what this step added
    function stand(bisI) {
        const alle = schritte(id), werte = {}, ueber = {};
        for (let i = 0; i <= bisI; i++) {
            Object.assign(werte, alle[i].setzt || {});
            Object.assign(ueber, alle[i].uebertrag || {});
        }
        return { werte, ueber, neu: alle[bisI].setzt || {} };
    }

    // ---- DOM ---------------------------------------------------------------------------------------------------
    const brettEl = document.getElementById('zr-brett');
    const leisteEl = document.getElementById('zr-leiste');
    const navEl = document.getElementById('zr-nav');
    const docEl = document.getElementById('v-doc');


    docEl.innerHTML =
        '<div class="v-doc-card zr-aufgabe"><div class="zr-tex"></div><div class="zr-quelle"></div></div>' +
        '<div class="v-doc-card zr-schritt"><h3><span class="zr-titel"></span><span class="zr-nr"></span>' +
        '<button type="button" class="zr-vorlesen" title="Vorlesen" aria-label="Schritt vorlesen">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6"/><path d="M18 6.8a7.5 7.5 0 0 1 0 10.4"/></svg>' +
        '</button></h3><div class="v-doc-body zr-text"></div></div>' +
        '<div class="v-doc-card zr-solita"><h3>Frag Solita</h3><div class="zr-sf"></div></div>';
    const texEl = docEl.querySelector('.zr-tex');
    const quelleEl = docEl.querySelector('.zr-quelle');
    const nrEl = docEl.querySelector('.zr-nr');
    const titelEl = docEl.querySelector('.zr-titel');
    const textEl = docEl.querySelector('.zr-text');

    // ---- Solita: the whole lab once, and with every question exactly what is on screen --------------------------
    // As a deck sends the slide, the lab sends its two halves: the board on the left and the explanation column on the
    // right, as they stand at this moment (Doc, 29.09.2026: "die muss zwingend die linke Seite sehen", "die Frage im
    // Kontext des gesamten Labs und der momentanen Situation"). Asked about "die kleine 10 über der 4" and "die 1 über
    // dem A" she had answered nonsense - nothing had told her that the small grey numbers are place values.
    // window.zrKontext() shows exactly what goes out.
    const SYSTEM = 'DAS LABOR. Im Ziffernrätsel-Labor lösen Schülerinnen und Schüler Buchstabenrätsel wie ' +
        'SEND + MORE = MONEY Schritt für Schritt, bis hinunter auf Grundschulniveau. Regeln: Jeder Buchstabe ist eine ' +
        'Ziffer, gleiche Buchstaben gleiche Ziffern, verschiedene Buchstaben verschiedene Ziffern, vorne nie eine 0.\n' +
        'SO SIEHT DER BILDSCHIRM AUS. Links die Tafel: Bei einer Plusaufgabe steht die Rechnung untereinander wie auf ' +
        'Papier. Ganz oben über jeder Spalte steht klein und grau ihr Stellenwert (1, 10, 100 und so weiter) – das sind ' +
        'keine Ziffern des Rätsels und keine Überträge. Eine Reihe darunter stehen, ebenfalls klein, die schon ' +
        'gefundenen Überträge, jeweils über der Spalte, in die sie hineinkommen. Dann die Zeilen, ein Strich und das ' +
        'Ergebnis. Die Spalte, um die es im Schritt geht, leuchtet orange; ein gefundener Buchstabe zeigt seine Ziffer, ' +
        'ein gerade gefundener ist hervorgehoben. Bei einem Produkt steht die Aufgabe als Formel auf der Tafel, der ' +
        'Stellenwert klein über jedem Buchstaben. Unter der Tafel die Ziffernleiste 0 bis 9: unter jeder vergebenen ' +
        'Ziffer der Buchstabe, der sie hat. Darunter die Schrittpunkte zum Blättern und der Schalter „Grundlagen ' +
        'erklären“, der die Grundlagen-Schritte ein- oder ausblendet. Rechts die Erklärspalte: oben die Aufgabe mit ' +
        'Quelle, darunter der Schritt, der gerade dran ist, mit Nummer, Titel und Text, ganz unten diese Frage-Box. Am ' +
        'linken Rand lassen sich die anderen Rätsel wählen.\n' +
        'SO ANTWORTEST DU. Mit jeder Frage bekommst du, was in diesem Moment zu sehen ist: links die Tafel, rechts die ' +
        'Erklärspalte. Antworte genau im Blick darauf. Fragt jemand nach etwas, das man sieht – eine kleine Zahl über ' +
        'einem Buchstaben, die orange Spalte, eine Ziffer in der Leiste –, such es in der Beschreibung und erkläre es an ' +
        'genau dieser Stelle. Erkläre den Schritt gründlicher und langsamer als der Text: mit konkreten Zahlen, einem ' +
        'kleinen Beispiel oder einem Bild aus dem Alltag. Wer es einfacher haben möchte, bekommt es so erklärt, dass es ' +
        'auch Schülerinnen und Schüler der Grundschule verstehen: Stellenwerte, Einer, Zehner, Übertrag und Plusrechnen ' +
        '– setz nichts voraus. Verrate keine Ziffern aus späteren Schritten, außer jemand fragt ausdrücklich danach. ' +
        'Höchstens sechs Sätze.';
    function klartext(html) { return String(html).replace(/<\/(p|li|tr)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim(); }
    // a letter on the board with the digit it shows, if it is found already
    function mitWert(ch, st) { return /\d/.test(ch) || !(ch in st.werte) ? ch : ch + ' (zeigt ' + st.werte[ch] + ')'; }
    function tafel(st, spalte) {
        const s = SCHEMATA[id];
        if (!s) {
            return 'Die Aufgabe als Formel: $' + TEX_SCHLICHT[id] + '$\n' +
                'Klein und grau über jedem Buchstaben und jeder Ziffer: ihr Stellenwert, 1 über der Einerstelle, 10 über ' +
                'der Zehnerstelle, 100 über der Hunderterstelle und so weiter' +
                (/10\^\{/.test(TEX[id]) ? ', hier als Zehnerpotenz geschrieben (10^3 für 1000)' : '') + '.';
        }
        const n = Math.max(...s.zeilen.concat([s.ergebnis]).map(w => w.length));
        const zeilen = ['Die Rechnung untereinander: ' + s.zeilen.map((w, r) => (r ? s.zeichen + ' ' : '') + w).join(' / ') +
            ' / Strich / ' + s.ergebnis, 'Die Spalten, von rechts:'];
        for (let k = 0; k < n; k++) {
            const oben = s.zeilen.map(w => w[w.length - 1 - k]).filter(Boolean).map(ch => mitWert(ch, st));
            const unten = s.ergebnis[s.ergebnis.length - 1 - k];
            zeilen.push('- ' + (STELLE[k] ? STELLE[k] + 'spalte' : 'Spalte ' + (k + 1)) + (k === spalte ? ' (leuchtet orange)' : '') +
                ': klein darüber der Stellenwert ' + 10 ** k +
                (k in st.ueber ? ', darunter klein der Übertrag ' + st.ueber[k] : '') + '; ' +
                (oben.join(' ' + s.zeichen + ' ') || 'oben leer') + ' ergibt ' + (unten ? mitWert(unten, st) : 'nichts'));
        }
        return zeilen.join('\n');
    }
    function leiste(st) {
        const wer = {};
        Object.keys(st.werte).forEach(b => { wer[st.werte[b]] = b; });
        const vergeben = [], frei = [];
        for (let d = 0; d <= 9; d++) (d in wer ? vergeben : frei).push(d in wer ? d + ' hat ' + wer[d] + (wer[d] in st.neu ? ' (gerade gefunden)' : '') : d);
        return 'Ziffernleiste: ' + (vergeben.length ? 'vergeben ' + vergeben.join(', ') : 'noch keine Ziffer vergeben') +
            (frei.length ? '; frei ' + frei.join(', ') : '');
    }
    function kontext() {
        const vis = sichtbar(), cur = vis[pos], st = stand(cur.i);
        const quelle = QUELLEN[id] || '';
        return 'Rätsel: ' + name(id) + '\n' +
            'Die Schritte (Grundlagen-Schritte ' + (mitBasis ? 'eingeblendet' : 'ausgeblendet') + '): ' +
            vis.map((x, k) => (k + 1) + '. ' + x.s.titel).join(' · ') + '\n\n' +
            'LINKS, DIE TAFEL - so steht sie jetzt da:\n' +
            tafel(st, typeof cur.s.spalte === 'number' ? cur.s.spalte : -1) + '\n' + leiste(st) + '\n\n' +
            'RECHTS, DIE ERKLÄRSPALTE:\n' +
            'Oben die Aufgabe: $' + TEX_SCHLICHT[id] + '$' + (quelle ? ' – Quelle: ' + quelle : '') + '\n' +
            'Darunter, gerade dran: Schritt ' + (pos + 1) + ' von ' + vis.length + ', „' + cur.s.titel + '“:\n' +
            klartext(mitWer(cur.s.html));
    }
    window.zrKontext = kontext;
    const solita = window.SolitaFrage ? SolitaFrage.mount(docEl.querySelector('.zr-sf'), {
        kontext, system: SYSTEM,
        ueberschrift: docEl.querySelector('.zr-solita > h3'),     // "Frag Solita" / "Frag Doc"
        vorschlaege: [
            { label: 'Genauer erklären', frage: 'Erklär mir diesen Schritt bitte genauer.' },
            { label: 'Noch einfacher', frage: 'Erklär mir diesen Schritt bitte noch einfacher – so, dass man es schon in der Grundschule versteht.' },
        ],
    }) : null;
    docEl.querySelector('.zr-vorlesen').addEventListener('click', () => {
        const cur = sichtbar()[pos];
        if (solita) solita.vorlesen(mitWer(cur.s.sprich || cur.s.html));
    });

    // ---- drawing -----------------------------------------------------------------------------------------------
    function zelle(ch, k, st, spalte) {
        const d = document.createElement('div');
        d.className = 'zr-z';
        if (k === spalte) d.classList.add('hot');
        if (/\d/.test(ch)) { d.classList.add('fest'); d.dataset.d = ch; d.innerHTML = '<span class="zr-d">' + ch + '</span>'; return d; }
        d.dataset.b = ch;                              // letter and digit for the hover light (zeigeGleiche)
        if (ch in st.werte) d.dataset.d = st.werte[ch];
        if (ch in st.werte) {
            d.classList.add('bekannt');
            if (ch in st.neu) d.classList.add('neu');
            d.innerHTML = '<span class="zr-b">' + ch + '</span><span class="zr-d">' + st.werte[ch] + '</span>';
        } else d.innerHTML = '<span class="zr-b gross">' + ch + '</span>';
        return d;
    }
    function leer(cls) { const d = document.createElement('div'); d.className = cls || 'zr-leer'; return d; }
    function zeichneBrett(schritt, st) {
        brettEl.textContent = '';
        const s = SCHEMATA[id];
        if (!s) {                                     // a product: the task itself, the strip shows the digits
            brettEl.className = 'zr-brett zr-formel';
            brettEl.parentNode.classList.add('formel');
            brettEl.innerHTML = '$$' + TEX[id] + '$$';
            mathe(brettEl);
            return;
        }
        brettEl.className = 'zr-brett';
        brettEl.parentNode.classList.remove('formel');
        const woerter = s.zeilen.concat([s.ergebnis]);
        const n = Math.max(...woerter.map(w => w.length));
        const spalte = typeof schritt.spalte === 'number' ? schritt.spalte : -1;
        // on the common parent: the digit strip below takes the board's width (Doc, 29.09.2026: "bitte breiter")
        brettEl.parentNode.style.setProperty('--cols', n + 1);
        brettEl.parentNode.style.setProperty('--rows', s.zeilen.length + 1);
        // place values, small and grey, as Vorrechnen writes them (Doc, 28.09.2026: "ganz klein drüber 10 1")
        brettEl.appendChild(leer('zr-luft'));
        for (let k = n - 1; k >= 0; k--) {
            const d = leer('zr-stelle' + (k === spalte ? ' hot' : ''));
            d.textContent = Math.pow(10, k);
            d.title = STELLE[k] || '';
            brettEl.appendChild(d);
        }
        // carries: a carry INTO column k stands above it
        brettEl.appendChild(leer('zr-luft'));
        for (let k = n - 1; k >= 0; k--) {
            const d = leer('zr-ueber' + (k === spalte ? ' hot' : ''));
            if (k in st.ueber) { d.textContent = st.ueber[k]; if (st.ueber[k] === 0) d.classList.add('null'); }
            brettEl.appendChild(d);
        }
        s.zeilen.forEach((w, r) => {
            const zeichen = leer('zr-zeichen');
            if (r === s.zeilen.length - 1) zeichen.textContent = s.zeichen === '+' ? '+' : s.zeichen;
            brettEl.appendChild(zeichen);
            for (let k = n - 1; k >= 0; k--) {
                const ch = w[w.length - 1 - k];
                brettEl.appendChild(ch ? zelle(ch, k, st, spalte) : leer('zr-leer' + (k === spalte ? ' hot' : '')));
            }
        });
        const strich = leer('zr-strich');
        brettEl.appendChild(strich);
        brettEl.appendChild(leer());
        for (let k = n - 1; k >= 0; k--) {
            const ch = s.ergebnis[s.ergebnis.length - 1 - k];
            brettEl.appendChild(ch ? zelle(ch, k, st, spalte) : leer('zr-leer' + (k === spalte ? ' hot' : '')));
        }
    }
    function zeichneLeiste(st) {
        leisteEl.textContent = '';
        const wer = {};
        Object.keys(st.werte).forEach(b => { wer[st.werte[b]] = b; });
        for (let d = 0; d <= 9; d++) {
            const f = document.createElement('div');
            f.className = 'zr-f' + (d in wer ? ' weg' : '') + (d in wer && wer[d] in st.neu ? ' neu' : '');
            // the digit in a square, the letter that has it in a pill of its own below (Doc, 29.09.2026: "Quadratisch ...
            // die Buchstaben in eigene Pillen drunter")
            f.innerHTML = '<span class="zr-fq"><span class="zr-fd">' + d + '</span></span><span class="zr-fp">' + (wer[d] || '') + '</span>';
            f.title = d in wer ? d + ' gehört ' + wer[d] : d + ' ist noch frei';
            f.dataset.d = d;
            if (d in wer) f.dataset.b = wer[d];
            leisteEl.appendChild(f);
        }
    }
    // |<  ‹  ●●●●  ›  >|  - to the start, a step back, the steps, a step on, to the solution (Doc, 29.09.2026: "<< oooooo >>"
    // ... "oder |< (schön!)" - in place of the buttons "Von vorn" and "Lösung" in the side panel)
    // filled triangles with soft corners, a bar for start and end (Doc, 29.09.2026: "bitte schöne gefüllte icons")
    const SVG = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
    function knopf(ziel, label, pfad, aus) {
        return '<button type="button" class="zr-pfeil" data-ziel="' + ziel + '" title="' + label + '" aria-label="' + label + '"' +
            (aus ? ' disabled' : '') + '>' + SVG + pfad + '</svg></button>';
    }
    function zeichneNav(vis) {
        const erst = pos === 0, letzt = pos === vis.length - 1;
        navEl.innerHTML =
            knopf('start', 'Zum Anfang', '<path d="M5.5 5v14"/><path d="M19 5.5 9.5 12 19 18.5z"/>', erst) +
            knopf('-1', 'Schritt zurück', '<path d="M16.5 5.5 7 12l9.5 6.5z"/>', erst) +
            '<div class="zr-punkte"></div>' +
            knopf('1', 'Nächster Schritt', '<path d="M7.5 5.5 17 12l-9.5 6.5z"/>', letzt) +
            knopf('ende', 'Zur Lösung', '<path d="M18.5 5v14"/><path d="M5 5.5 14.5 12 5 18.5z"/>', letzt);
        const punkte = navEl.querySelector('.zr-punkte');
        vis.forEach((x, k) => {
            const p = document.createElement('button');
            p.type = 'button';
            p.className = 'zr-punkt' + (k === pos ? ' an' : '') + (k < pos ? ' fertig' : '') + (x.s.basis ? ' basis' : '');
            p.dataset.k = k;
            p.title = (k + 1) + ' · ' + x.s.titel;
            p.setAttribute('aria-label', 'Schritt ' + (k + 1) + ': ' + x.s.titel);
            punkte.appendChild(p);
        });
    }
    // Hover light (Doc, 29.09.2026: "Buchstaben/Zahlen hover hilite"): a letter or a digit under the pointer lights up
    // everywhere it stands - every E on the board, and the E's digit in the strip; a digit in the strip lights up its
    // letter on the board. The board is redrawn every step, so this listens on the stage around it.
    const mitte = brettEl.parentNode;
    function zeigeGleiche(el) {
        mitte.querySelectorAll('.hilite').forEach(x => x.classList.remove('hilite'));
        if (!el) return;
        const b = el.dataset.b, d = el.dataset.d;
        mitte.querySelectorAll('[data-b], [data-d]').forEach(x => {
            if ((b && x.dataset.b === b) || (d !== undefined && x.dataset.d === d)) x.classList.add('hilite');
        });
    }
    mitte.addEventListener('pointerover', e => zeigeGleiche(e.target.closest('[data-b], [data-d]')));
    mitte.addEventListener('pointerleave', () => zeigeGleiche(null));

    navEl.addEventListener('click', e => {
        const p = e.target.closest('.zr-punkt'), a = e.target.closest('.zr-pfeil');
        if (p) geh(+p.dataset.k);
        else if (a && !a.disabled) {
            const z = a.dataset.ziel;
            geh(z === 'start' ? 0 : z === 'ende' ? sichtbar().length - 1 : pos + +z);
        }
    });

    function zeichne() {
        const vis = sichtbar();
        pos = Math.max(0, Math.min(pos, vis.length - 1));
        const cur = vis[pos], st = stand(cur.i);
        if (liste) liste.querySelectorAll('.zr-karte').forEach(b => {
            const an = b.dataset.id === id;
            b.classList.toggle('an', an);
            b.setAttribute('aria-pressed', String(an));
            if (an) karteImPanel(b);
        });
        zeichneBrett(cur.s, st);
        zeichneLeiste(st);
        zeichneNav(vis);
        texEl.innerHTML = '$$' + TEX_SCHLICHT[id] + '$$';
        quelleEl.textContent = QUELLEN[id] || '';
        quelleEl.hidden = !QUELLEN[id];
        nrEl.textContent = (pos + 1) + ' / ' + vis.length;
        titelEl.textContent = cur.s.titel;
        textEl.innerHTML = ausrichten(mitWer(cur.s.html));
        mathe(texEl); mathe(textEl);
        passeFormeln(docEl);
        karteInsBild(docEl.querySelector('.zr-schritt'));
        try { history.replaceState(null, '', '?r=' + encodeURIComponent(id) + '&s=' + (pos + 1)); } catch (e) { }
    }
    // The step card into view - by scrolling the explanation column ONLY. scrollIntoView scrolled every ancestor,
    // the page itself too (overflow: hidden does not stop it): the whole lab slid left and up, the side panel was cut
    // off and the branding lay over the task (Doc, 29.09.2026, screenshot). On a narrow screen the column does not
    // scroll by itself - nothing to do then.
    function karteInsBild(karte) {
        if (!karte || docEl.scrollHeight <= docEl.clientHeight + 1) return;
        const r = karte.getBoundingClientRect(), v = docEl.getBoundingClientRect();
        if (r.top < v.top || r.top > v.bottom - 80) docEl.scrollTop += r.top - v.top - 12;
    }
    // A display formula wider than the column is set smaller until it fits, down to 60 % - never a scrollbar under
    // it, never a cut-off operation (Doc, 29.09.2026, puzzle 3: "| Stell..." cut off; "scroll immer weg"). Below 80 %
    // an aligned block breaks its lines instead, as in LaTeX: the left side alone, "= right side | operation" under
    // it (puzzle 9: "A·11+B·11+C·11 = A·100+B·10+C | -A·11-B·10-C").
    function brechen(tex) {
        const m = /^\\begin\{aligned\}([\s\S]*)\\end\{aligned\}$/.exec(String(tex).trim());
        if (!m) return null;
        const breit = r => r.replace(/\\mkern-?[\d.]+mu/g, '').replace(/\\(?:mathrm|textrm|textup|text)\{([^{}]*)\}/g, '$1')
            .replace(/\\[a-zA-Z]+/g, 'x').replace(/[{}&\s]/g, '').length;
        // one long line breaks the whole block, every line the same way - a short line left unbroken kept the left
        // column as wide as its own left side and pushed the broken ones and their operations out to the right
        const zeilen = m[1].split(' \\\\ ');
        if (!zeilen.some(r => r.indexOf(' &= ') > 0 && breit(r) > 22)) return tex;
        return '\\begin{aligned}' + zeilen.map(r => {
            const i = r.indexOf(' &= ');
            return i > 0 ? '& ' + r.slice(0, i) + ' \\\\ &= ' + r.slice(i + 4) : r;
        }).join(' \\\\ ') + '\\end{aligned}';
    }
    function passe(d, darfBrechen) {
        const k = d.querySelector(':scope > .katex');
        if (!k) return;
        k.style.fontSize = '';
        if (!d.clientWidth) return;                     // not on screen: measured when it is
        const start = parseFloat(getComputedStyle(k).fontSize);
        let f = start;
        while (k.scrollWidth > d.clientWidth + 1 && f > start * 0.6) { f -= start * 0.03; k.style.fontSize = f + 'px'; }
        if (!darfBrechen || f >= start * 0.8 || !window.katex) return;
        const ann = d.querySelector('annotation');
        const alt = ann && ann.textContent, neu = alt && brechen(alt);
        if (!neu || neu === alt) return;
        const tmp = document.createElement('div');
        katex.render(neu, tmp, { displayMode: true, throwOnError: false });
        const nd = tmp.firstElementChild;
        if (!nd) return;
        d.replaceWith(nd);
        passe(nd, false);
    }
    function passeFormeln(el) { el.querySelectorAll('.katex-display').forEach(d => passe(d, true)); }
    if (window.ResizeObserver) new ResizeObserver(() => passeFormeln(docEl)).observe(docEl);
    document.fonts.ready.then(() => passeFormeln(docEl));
    // the chosen puzzle card into view: the side panel's own scroll box moves, the page never does
    function karteImPanel(b) {
        let box = b.parentElement;
        while (box && box !== document.body) {
            const oy = getComputedStyle(box).overflowY;
            if ((oy === 'auto' || oy === 'scroll') && box.scrollHeight > box.clientHeight + 1) break;
            box = box.parentElement;
        }
        if (!box || box === document.body) return;
        const r = b.getBoundingClientRect(), v = box.getBoundingClientRect();
        if (r.top < v.top) box.scrollTop += r.top - v.top - 8;
        else if (r.bottom > v.bottom) box.scrollTop += r.bottom - v.bottom + 8;
    }
    // who explains - Solita or Doc, as chosen in the question box
    function mitWer(html) { return String(html).replace(/\{WER\}/g, window.SolitaFrage && SolitaFrage.wer ? SolitaFrage.wer() : 'Solita'); }
    document.addEventListener('solita-wer', () => { if (typeof zeichne === 'function' && textEl.childNodes.length) zeichne(); });
    function geh(k) {
        const vis = sichtbar();
        if (k < 0 || k >= vis.length || k === pos) return;
        pos = k;
        if (solita) solita.stop();
        zeichne();
    }
    function waehle(neu, k) {
        if (IDS.indexOf(neu) < 0) return;
        if (neu !== id && solita) solita.leeren();   // another puzzle: the talk about the old one goes
        id = neu; pos = k || 0;
        zeichne();
    }

    // ---- side panel: the puzzles as cards (Doc, 29.09.2026: "mach für die verschiedenen Aufgaben bitte im Sideboard
    // Cards" - in place of the tab strip, where the first puzzles hid behind a scroll) ----------------------------------
    let liste = null;
    function karten() {
        CyberUI.createCard('ui-container', 'Rätsel', '<div id="zr-liste" class="zr-liste"></div>', 'rgb(245, 194, 66)');
        liste = document.getElementById('zr-liste');
        IDS.forEach((rid, k) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'zr-karte'; b.dataset.id = rid;
            const n = schritte(rid).length;
            b.innerHTML = '<span class="zr-karte-nr">' + (k + 1) + '</span>' +
                // thin spaces around + and =: the name keeps to one line more often
                '<span class="zr-karte-name">' + name(rid).replace(/ ([+=·]) /g, '\u2009$1\u2009') + '</span>' +
                '<span class="zr-karte-info">' + n + ' Schritte' + (DETAIL[rid] ? ' · ausführlich' : '') + '</span>';
            liste.appendChild(b);
        });
        // a name that does not fit on one line is set smaller, down to 11 px - measured again whenever the panel
        // changes width (opened, closed, zoomed) and once the LaTeX font has arrived
        function fitNames() {
            liste.querySelectorAll('.zr-karte-name').forEach(el => {
                el.style.fontSize = '';
                if (!el.clientWidth) return;           // panel closed: measured when it opens
                let f = parseFloat(getComputedStyle(el).fontSize);
                while (el.scrollWidth > el.clientWidth + 0.5 && f > 11) { f -= 0.5; el.style.fontSize = f + 'px'; }
            });
        }
        if (window.ResizeObserver) new ResizeObserver(fitNames).observe(liste);
        document.fonts.ready.then(fitNames);
        liste.addEventListener('click', e => {
            const b = e.target.closest('.zr-karte');
            if (!b) return;
            b.blur();                                 // the arrow keys go on to the steps
            waehle(b.dataset.id, 0);
        });
    }

    // ---- basics on/off: under the step bar (Doc, 29.09.2026: "Ohne Schritte unter die Nav Leiste") ---------------
    CyberUI.createCheckbox('zr-grund', 'Grundlagen erklären', mitBasis, an => {
        const cur = sichtbar()[pos];
        mitBasis = an;
        try { localStorage.setItem(BASIS_KEY, an ? 'an' : 'aus'); } catch (e) { }
        // stay on the same step if it is still shown, else on the next one that is
        const vis = sichtbar();
        const k = vis.findIndex(x => x.i >= cur.i);
        pos = k < 0 ? vis.length - 1 : k;
        zeichne();
    });
    karten();

    // keyboard: a step forward / back (never inside a text field, never with a modifier - Cmd-Shift-R stays free)
    document.addEventListener('keydown', e => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown') { geh(pos + 1); e.preventDefault(); }
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') { geh(pos - 1); e.preventDefault(); }
        // up / down: the puzzle before or after, as the cards stand in the side panel (Doc, 29.09.2026: "gib mir arrow
        // up/d um in den Gleichungen zu wechseln")
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const i = IDS.indexOf(id) + (e.key === 'ArrowDown' ? 1 : -1);
            if (i >= 0 && i < IDS.length) waehle(IDS[i], 0);
            e.preventDefault();
        }
    });

    // deep link ?r=k-money&s=6
    const q = new URLSearchParams(location.search);
    id = IDS.indexOf(q.get('r')) >= 0 ? q.get('r') : (IDS.indexOf(START) >= 0 ? START : IDS[0]);
    pos = Math.max(0, (parseInt(q.get('s'), 10) || 1) - 1);
    zeichne();
    window.addEventListener('katex-ready', zeichne);
    window.Ziffernraetsel = { loese, schritte, get id() { return id; }, get pos() { return pos; } };   // debug
})();
