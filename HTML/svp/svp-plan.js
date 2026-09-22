// Shared renderer for the Stoffverteilungsplan pages.
// Each page defines window.PLAN (array of week rows / holiday rows)
// and window.BADGE (type -> [cssClass, label]) before including this script.
// Week rows may carry details: ['bullet', ...] — rendered as an expandable sub-row.
// Edit mode (togglePlanEdit): cells become contenteditable; changes are saved
// to localStorage per page and re-applied on load. resetPlanEdits() clears them.
//
// The renderer lives in parts: svp-plan-<part>.js, next to this file. This file
// only loads them - the pages keep their one <script src="svp-plan.js">.
// A part does not run when it loads: it hands its code to svpPlanParts, and
// svp-plan-run.js runs all parts in one go, in the order below. So the plan is
// still built in one piece, and no callback can fire between two parts.
// Inside a part a bare name is the part's own; P.name belongs to another part
// (or is state several parts change). What a part shares it sets on P.
(function () {
    const PARTS = [
        'core',             // group view (?g=), page head and foot, Lehrplan menu, table head
        'material',         // material pills: icons, labels, viewer, tooltip
        'aufgaben',         // week quiz, "Aufgaben" menu, red test button and its list
        'gdw',              // "Gedanke der Woche": preview in the week row, full page on click
        'fahrplan',         // the run of a lesson, in a frameless sheet behind the stack
        'talks',            // the "Vortrag: Nr · Titel" line of a week
        'material-edit',    // editing material: dialog, clipboard, pill menu, drag and drop
        'state',            // stored edits and notes (localStorage), the merged plan rows
        'text',             // formulas (KaTeX), inline marks, dates, the bullet list of a week
        'export',           // the export view of the plan
        'forms',            // print forms: MAP and Formular
        'menus',            // export, Vortraege and group menus, print titles
        'rows',             // open weeks, holiday folds, the table rows themselves
        'untis-text',       // class book texts: abbreviations, 250-character fit (also read by tools/webuntis.js)
        'untis',            // WebUntis: chips, dates, the class book dialog
        'cards',            // Lernbereich pills inside the cards
        'search',           // search in the plan
        'keys',             // all weeks open/closed, ?kw= jump, current week, keyboard
        'edit',             // edit mode: gate, save, cancel, reset
        'shift',            // moving the content by a week ("Verschieben")
        'sync',             // cloud sync of edits and notes
        'panels',           // Lernbereich panels and the bridge panel of the cards
        'news',             // diese Woche und die naechsten Vortraege ins Neuigkeiten-Band
        'run'
    ];
    const me = document.currentScript;
    const dir = me ? me.src.replace(/[^/]*$/, '') : '';
    window.svpPlanParts = [];
    /* document.write keeps the parts parser-blocking and in order, exactly as
       the single file was: svp-nav.js, the next tag on every page, still runs
       after the whole plan. */
    /* Die gemeinsame Faltung liegt VOR den Teilen: die Suche (Teil "search")
       benutzt sie, und svp-suche.js unter dem Laufband dieselbe Datei. */
    document.write('<script src="' + dir + 'svp-falten.js"><\/script>'
        + PARTS.map(function (p) {
            return '<script src="' + dir + 'svp-plan-' + p + '.js"><\/script>';
        }).join(''));
})();
