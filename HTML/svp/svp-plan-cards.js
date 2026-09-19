// Stoffverteilungsplan renderer, part "cards": Lernbereich pills inside the cards.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    /* Bereich-Pillen: jede steht seit dem 09.09.2026 IN ihrer Lernbereich-
       Karte (Doc: "mach die Pillen da hin"), nicht mehr in einer eigenen Zeile
       ueber der Trennlinie. Die Karten tragen data-lb mit denselben Schluesseln
       wie window.BADGE, jede Pille findet ihre Karte also von allein.
       Pillen ohne Karte (ORGA, UEBUNG) fallen ganz weg - "ORGA oben weg" (Doc).
       Die statische Punkte-Liste in der Werkzeugleiste wird damit ueberfluessig
       und verschwindet; der Lehrplan-Knopf zieht in buildPlanSearch an das
       rechte Ende der Werkzeugleiste, hinter das Suchfeld. */
    const legend = P.legend = document.querySelector('.toolbar .legend');
    if (legend) legend.remove();

    (function badgesIntoCards() {
        for (const key in window.BADGE) {
            const card = document.querySelector('.meta-card[data-lb="' + key + '"]');
            if (!card) continue;                    // ORGA & Co: keine Karte, keine Pille
            const head = card.querySelector('.k') || card;
            const [cls, label] = window.BADGE[key];
            const alts = window.ALT_BADGES && window.ALT_BADGES[key];

            /* Doc, 19.09.2026: "schreib LB 2 und in die Pille PDF" - the card
               head shows the short name (the badge label), the pill says what it
               opens. The long name stays in data-full for the exports (lbMeta). */
            if (head !== card) {
                head.dataset.full = head.textContent.trim();
                head.textContent = label;
            }

            // Bereich with variants (window.ALT_BADGES[key] = [[label, pdfPage],
            // ...]): one pill with a caret that opens a dropdown - chosen
            // variant first, then the alternatives, each deep-linking into the
            // Lehrplan PDF.
            if (alts && window.LB_INFO && window.LB_INFO.pdf) {
                const wrap = document.createElement('span');
                wrap.className = 'badge-drop';

                const pill = document.createElement('span');
                pill.className = 'badge ' + cls;
                pill.textContent = 'PDF \u25be';
                pill.title = 'Varianten anzeigen';
                pill.addEventListener('click', function (e) {
                    e.stopPropagation();            /* nicht die Karte aufklappen */
                    const wasOpen = wrap.classList.contains('open');
                    document.querySelectorAll('.badge-drop.open')
                        .forEach(d => d.classList.remove('open'));
                    wrap.classList.toggle('open', !wasOpen);
                });
                wrap.appendChild(pill);

                const menu = document.createElement('div');
                menu.className = 'drop-menu';
                const entries = [[label + ' \u2713', P.lbPdfLink(key) || window.LB_INFO.pdf, true]].concat(
                    alts.map(([l, p]) => [l, window.LB_INFO.pdf + '#page=' + p, false]));
                for (const [entryLabel, href, chosen] of entries) {
                    const item = document.createElement('span');
                    item.className = 'badge badge-link ' + cls + (chosen ? ' chosen' : '');
                    item.textContent = entryLabel;
                    item.title = (chosen ? 'Gew\u00e4hlte Variante' : 'Nicht gew\u00e4hlte Variante') +
                        ' \u2014 Lehrplan (PDF) an dieser Stelle \u00f6ffnen';
                    item.addEventListener('click', function (e) {
                        e.stopPropagation();
                        window.open(href, '_blank');
                    });
                    menu.appendChild(item);
                }
                wrap.appendChild(menu);
                head.appendChild(wrap);
                continue;
            }

            if (!P.lbPdfLink(key)) continue;          /* no PDF page known: no pill */
            const pill = document.createElement('span');
            pill.className = 'badge ' + cls;
            pill.textContent = 'PDF';
            P.linkBadge(pill, key);                   /* stoppt den Klick selbst */
            head.appendChild(pill);
        }

        // Any click outside closes open variant dropdowns.
        document.addEventListener('click', function () {
            document.querySelectorAll('.badge-drop.open')
                .forEach(d => d.classList.remove('open'));
        });
    })();
});
