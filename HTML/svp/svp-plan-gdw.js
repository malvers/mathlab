// Stoffverteilungsplan renderer, part "gdw": the "Gedanke der Woche" of a school week.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
//
// Every school week of 2026/27 carries one thought (HTML/svp/gdw.json, keyed by school week, with its
// calendar week). The week row shows it as a small picture; a click opens the full page. The six weeks
// before a holiday carry a big one (Doc, 20.09.2026: "Vor den Ferien jeweils eine Große Weisheit").
//
// The small pictures sit next to this file (gdw/NN.webp, ~7 KB) because every row shows one. The full-size
// page is fetched from R2 on click only - it is rebuilt whenever Doc rearranges the deck, and rebuilt
// binaries stay out of the repo: tools/gdw_publish.mjs puts them there.
(function () {
    const me = document.currentScript;
    const DIR = me ? me.src.replace(/[^/]*$/, '') : '';
    const GDW_BASE = 'https://pub-3679488924b04b6e9118c6684b8c23e1.r2.dev/';

    window.svpPlanParts.push(function (P) {
        Object.assign(P, { gdwThumb });

        /* every key the page listens for belongs in the central help (svp-nav.js) */
        window.svpKeys = (window.svpKeys || []).concat([
            [['\u2190', '\u2192'], 'Bei offenem Gedanken der Woche: eine Woche zur\u00fcck oder weiter']
        ]);

        /* The plan knows its calendar week, gdw.json is written per school week - so the
           thoughts are indexed by KW here. The school year runs KW 34-52 and KW 1-27, no
           calendar week appears twice. */
        let byKw = null;
        let weeks = [];          /* die Schulwochen der Reihe nach - fuer die Pfeiltasten */
        const waiting = [];
        fetch(DIR + 'gdw.json')
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) {
                byKw = {};
                if (j) Object.keys(j).forEach(function (sw) {
                    const e = j[sw];
                    e.sw = +sw;
                    byKw[e.kw] = e;
                });
                weeks = Object.keys(j || {}).map(Number).sort(function (a, b) { return a - b; })
                    .map(function (n) { return j[String(n)]; });
                waiting.splice(0).forEach(place);
                /* ?gdw=<Schulwoche> opens that thought right away - a link to a single one,
                   the same idea as the plan's ?kw= jump */
                const want = new URLSearchParams(location.search).get('gdw');
                if (want && j && j[want]) open(j[want]);
            })
            .catch(function () { byKw = {}; });      /* offline: the plan simply shows no thought */

        /* Called at the end of every material cell rebuild. The cell is emptied and built
           again on each update (render, then the cloud sync), so this has to be idempotent -
           it adds nothing that is already there. */
        function gdwThumb(ref) {
            if (!byKw) {
                if (waiting.indexOf(ref) < 0) waiting.push(ref);
                return;
            }
            place(ref);
        }

        function place(ref) {
            const td = ref && ref.matTd;
            if (!td || !ref.kw) return;
            const e = byKw[ref.kw];
            if (!e || td.querySelector('.gdw-thumb')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gdw-thumb' + (e.gross ? ' gdw-gross' : '');
            btn.title = caption(e) + ' — anklicken';
            const img = document.createElement('img');
            img.src = DIR + 'gdw/' + e.bild + '.webp';
            img.alt = '';
            img.loading = 'lazy';
            btn.appendChild(img);
            btn.addEventListener('click', function (ev) {
                ev.stopPropagation();                /* the row click would fold the week open */
                open(e);
            });
            td.appendChild(btn);    /* alone at the right end of the week row since 20.09.2026 */
        }

        function caption(e) {
            /* gdw.json carries the whole word ("Weihnachtsferien") - gluing "ferien" onto
               "Weihnachten" here gave "Weihnachtenferien" (Doc, 20.09.2026) */
            const wer = e.gross ? 'Große Weisheit vor den ' + e.gross : 'Gedanke der Woche';
            return wer + ' · ' + e.sw + '. Schulwoche' + (e.titel ? ' · ' + e.titel : '');
        }

        // --- the full page ---------------------------------------------------
        let box = null;
        function ensureBox() {
            if (box) return box;
            box = document.createElement('div');
            box.className = 'gdw-box';
            box.hidden = true;
            const img = document.createElement('img');
            const close = document.createElement('button');
            close.type = 'button';
            close.className = 'gdw-close';
            close.setAttribute('aria-label', 'Schließen');
            close.textContent = '×';
            box.appendChild(close);
            box.appendChild(img);
            document.body.appendChild(box);
            box.img = img;
            box.addEventListener('click', function (ev) {
                if (ev.target === box || ev.target === close) hide();
            });
            /* Capture phase on purpose: the plan itself walks its rows with the arrow
               keys (svp-plan-keys.js). While a thought is open the keys belong to it,
               so they are taken here before the plan's listener sees them - otherwise
               the marked row wanders along underneath (Doc, 20.09.2026: "Wenn eine
               Weisheit offen ist und ich die Pfeiltasten nutze, sollen die Weisheiten
               durchklicken"). */
            document.addEventListener('keydown', function (ev) {
                if (box.hidden) return;
                if (ev.key === 'Escape') { hide(); return; }
                const dir = (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') ? 1
                    : (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') ? -1 : 0;
                if (!dir) return;
                ev.preventDefault();
                ev.stopPropagation();
                step(dir);
            }, true);
            return box;
        }

        let shown = null;

        /* Every school week carries a thought, so week by week and thought by thought
           are the same step. At the ends it simply stops. */
        function step(dir) {
            const i = weeks.indexOf(shown);
            if (i < 0) return;
            const next = weeks[i + dir];
            if (next) open(next);
        }

        function open(e) {
            const b = ensureBox();
            shown = e;
            b.img.src = GDW_BASE + e.bild + '.webp';
            b.img.alt = e.titel || 'Gedanke der Woche';
            b.hidden = false;
        }

        function hide() {
            box.hidden = true;
            box.img.src = '';                        /* a 70 KB picture need not stay in memory */
        }
    });
})();
