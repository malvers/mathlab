/**
 * svp-falten.js — die gemeinsame Faltung fuer alle Suchen der svp-Seiten.
 *
 * Zwei Woerter sind dasselbe Wort, wenn sie sich nur in Gross- und
 * Kleinschreibung, in Umlauten oder in Akzenten unterscheiden: "Würfel",
 * "wuerfel" und "WÜRFEL" muessen einander finden.
 *
 * Die Reihenfolge ist die Falle, nicht das Rezept: ZUERST die Umlaute
 * ausschreiben, DANN die restlichen Akzente abwerfen. Umgekehrt wird aus
 * "würfel" ein "wurfel", und das findet "wuerfel" nie wieder.
 *
 * Stand hier, weil es drei Suchen brauchen: die Plansuche in einer Seite
 * (svp-plan-search.js), die Suche ueber alle Plaene unter dem Laufband
 * (svp-suche.js) und die Notizen. Eine Kopie mehr, und eine davon waere
 * irgendwann die mit der falschen Reihenfolge.
 */
(function () {
    const UML = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'å': 'aa' };

    function falten(value) {
        return String(value == null ? '' : value)
            .normalize('NFC')            /* macOS liefert Umlaute auch zerlegt */
            .toLowerCase()
            .replace(/[äöüßæœå]/g, function (ch) { return UML[ch]; })
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '');
    }

    /* Dieselbe Faltung Zeichen fuer Zeichen, damit eine Stelle im gefalteten
       Text auf den urspruenglichen Text zurueckgerechnet werden kann: at[k] ist
       die Stelle, an der das gefaltete Zeichen k begann ("Würfel" faltet sich zu
       "wuerfel", sieben Zeichen ueber sechs). Nur so kann eine Suche ihren
       Treffer im DOM anmalen, ohne den Text anzufassen. */
    function faltenMap(src) {
        let folded = '';
        const at = [];
        for (let i = 0; i < src.length; i++) {
            const piece = falten(src[i]);
            for (let k = 0; k < piece.length; k++) at.push(i);
            folded += piece;
        }
        at.push(src.length);
        return { folded: folded, at: at };
    }

    window.svpFalten = falten;
    window.svpFaltenMap = faltenMap;
})();
