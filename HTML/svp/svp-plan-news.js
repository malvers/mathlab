// Stoffverteilungsplan renderer, part "news": was diese Woche dran ist und wann
// die naechsten Vortraege sind - beides laeuft im Neuigkeiten-Band unter der
// Navileiste (Doc, 20.09.2026: "bring da welche Themen die Woche dran sind und
// welche Vortraege wann sind").
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
//
// Der Plan ist fertig gebaut, wenn dieser Teil laeuft; das Band kommt erst mit
// svp-nav.js danach. Deshalb legt der Plan seine Zeilen in window.svpNewsLokal
// ab UND ruft window.svpNews, wenn es das schon gibt - wer zuerst da ist,
// wartet auf den anderen.
window.svpPlanParts.push(function (P) {
    Object.assign(P, { newsTalks });

    /* Wie viele Vortragstermine mitlaufen. Drei sind ein Ausblick, alles
       weitere waere die Vortragsliste, und die hat ihre eigene Seite. */
    const TERMINE = 3;

    /* "Mo 05.10." - kurz, weil im Band jedes Zeichen Laufzeit kostet. */
    const tag = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });

    let woche = [];
    let talks = [];

    function melde() {
        const alle = woche.concat(talks);
        window.svpNewsLokal = alle;
        if (window.svpNews) window.svpNews.lokal(alle);
    }

    function heuteIso() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
            '-' + String(d.getDate()).padStart(2, '0');
    }

    /* Das Thema einer Zeile so, wie es auf dem Schirm steht - also mit Docs
       Aenderungen, nicht mit dem Stand aus der HTML-Datei. */
    function thema(ref) {
        const t = ref.topicSpan ? ref.topicSpan.textContent.trim() : '';
        return t.replace(/\s+/g, ' ');
    }

    /* Diese Woche, und wenn die nicht im Plan steht (Ferien, Schuljahresrand),
       die naechste, die kommt. Die Zeile sagt selbst, welcher Fall es ist. */
    function wocheSetzen() {
        const now = P.isoWeek(new Date());
        const treffer = P.rendered.find(function (r) { return P.weekOf(r) === String(now); });
        const naechste = treffer ? null : P.rendered
            .filter(function (r) { return r.topicSpan && Number(P.weekOf(r)) > now; })
            .sort(function (a, b) { return Number(P.weekOf(a)) - Number(P.weekOf(b)); })[0];
        const ref = treffer || naechste;
        if (!ref || !thema(ref)) { woche = []; return; }
        const kw = P.weekOf(ref);
        woche = [{
            quelle: treffer ? 'Stoff der Woche' : 'Stoff demnächst',
            text: thema(ref),
            klick: function (e) { e.preventDefault(); P.gotoWeek(kw); }
        }];
    }

    /* svp-plan-talks.js kennt die Termine (sie stehen in der Cloud und kommen
       erst nach dem Rendern an) und reicht sie hier herein:
       [{ iso: '2026-10-05', label: 'FOG25-2', text: '3 · Titel' }, ...] */
    function newsTalks(liste) {
        const ab = heuteIso();
        talks = (liste || [])
            .filter(function (t) { return t && t.iso && t.text && t.iso >= ab; })
            .sort(function (a, b) { return a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0; })
            .slice(0, TERMINE)
            .map(function (t) {
                const d = new Date(t.iso + 'T12:00:00');
                const kw = P.isoWeek(d);
                return {
                    quelle: 'Vorträge',
                    /* Doc, 20.09.2026: "bei Vortraegen ein IBB logo" - die
                       Bildmarke aus ibb-logo.svg, ohne den Schriftzug: der
                       wird bei 14 px zu Matsch (icons/ibb.svg). */
                    logo: 'icons/ibb.svg',
                    /* Intl schreibt "Mo., 05.10." - der Punkt hinter dem Tag
                       ist im Band nur Rauschen. */
                    text: tag.format(d).replace('.,', '') + ' · ' +
                        (t.label ? t.label + ' · ' : '') + t.text,
                    klick: function (e) { e.preventDefault(); P.gotoWeek(kw); }
                };
            });
        melde();
    }

    /* Pruefhaken: die Vortragstermine kommen sonst nur aus der Cloud, also
       nur mit Anmeldung - damit laesst sich das Band auch ohne pruefen
       (Konsole: svpNewsPlan.talks([{iso, label, text}])). */
    window.svpNewsPlan = { talks: newsTalks, woche: function () { wocheSetzen(); melde(); } };

    wocheSetzen();
    melde();

    /* In der Gruppen-Ansicht (?g=) traegt eine Zeile die Woche ihres Termins,
       und die steht erst, wenn die Untis-Daten da sind - genau wie bei der
       Markierung der laufenden Woche wird deshalb einmal nachgefasst. */
    setTimeout(function () { wocheSetzen(); melde(); }, 1600);
});
