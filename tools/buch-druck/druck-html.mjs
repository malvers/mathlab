/**
 * druck-html.mjs — the print edition (druck.html) of every translated textbook, made from the German one.
 * Doc, 27.10.2026: "für alle die Bücher … das Grußwort und auch den PDF Download Button" - the PDF of a book is built
 * from its print edition (tools/buch-seiten/seitenbilder.mjs), and until now only the German books had one.
 *
 *     node tools/buch-druck/druck-html.mjs mathe11-en [mathe11-fr …]     these translated books
 *     node tools/buch-druck/druck-html.mjs --alle                          every translation whose German book has a print edition
 *
 * From the German druck.html (HTML/buch/<buch>/): the frame - head, status bar, the order of things. From the translated
 * book: the cover of its start page (index.html; the kicker gets "· PRINT EDITION" as the German one gets "· DRUCKAUSGABE"),
 * the page title, and the scripts its pages load, in their order - the dictionaries js/buch-<lang>.js and js/buch-<lang>/*.js
 * included. "So arbeitest du mit diesem Buch" is translated here (FRONT): the German books differ only in the clause of its
 * first sentence (CLAUSE), so a new German clause stops this script until it has its four translations.
 * The book's kapitel.js loses "druck: false": the overview (O) and the PDF button of js/buch.js are on from then on.
 * The fixed texts of the pages themselves (contents, solutions, chapter heads) are in js/buch-druck.js.
 * Afterwards: node tools/buch-seiten/seitenbilder.mjs --alle (after the push) makes the page pictures and the PDFs.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const BUCH = path.join(ROOT, 'HTML/buch');
const LANGS = ['en', 'es', 'it', 'fr'];
const NB = ' ';                                           // French: no-break space before : ; ! ? and inside « »

const LVL = n => '<span class="b-lvl" data-lvl="' + n + '" style="display:inline-block;vertical-align:-1px"></span>';

// the words of the frame
const UI = {
    en: { bar: 'PRINT EDITION', wait: 'Getting ready …', print: 'Print / save as PDF', title: 'Print edition' },
    es: { bar: 'EDICIÓN IMPRESA', wait: 'Preparando …', print: 'Imprimir / guardar como PDF', title: 'Edición impresa' },
    it: { bar: 'EDIZIONE A STAMPA', wait: 'Preparazione …', print: 'Stampa / salva come PDF', title: 'Edizione a stampa' },
    fr: { bar: 'ÉDITION IMPRIMÉE', wait: 'Préparation…', print: 'Imprimer / enregistrer en PDF', title: 'Édition imprimée' },
};

// "So arbeitest du mit diesem Buch", in the terms the translated start pages use (#sogehts, the glossaries in tools/buch-*)
const FRONT = {
    en: c => ['How to use this book',
        'This book exists twice: as an online book in which you can ' + c + ', and as the print edition in your hands. Every chapter ' +
        'begins with a <b>QR code</b> that takes you straight to its interactive version. The figures in this book show the interactive ' +
        'elements in their starting state.',
        'Every chapter has the same structure: an <b>opener</b> with learning goals and a check-in, <b>explorations</b> to try out in groups, ' +
        '<b>units</b> with a starter, key-point box, examples, exercises and “Test yourself!”, plus <b>Review · Deepen · Connect</b>, ' +
        'an <b>excursion</b>, a <b>look back</b> and a <b>test</b>.',
        'Exercises come in three levels: ' + LVL(1) + ' basic, ' + LVL(2) + ' intermediate, ' + LVL(3) + ' advanced. The solutions to all ' +
        'exercises and self-checks are in the appendix; the worked solutions of the examples are right in the text.',
        'Whatever is in an orange <b>key-point box</b>, you need to know. Everything else helps you to understand it.'],
    es: c => ['Cómo usar este libro',
        'Este libro existe dos veces: como libro en línea, en el que puedes ' + c + ', y como edición impresa en tus manos. Cada capítulo ' +
        'empieza con un <b>código QR</b> que lleva directamente a su versión interactiva. Los gráficos de este cuaderno muestran los ' +
        'elementos interactivos en su estado inicial.',
        'Todos los capítulos tienen la misma estructura: una <b>introducción</b> con los objetivos y un check-in, <b>exploraciones</b> para ' +
        'probar en grupo, <b>lecciones</b> con un inicio, el recuadro «Recuerda», ejemplos, ejercicios y «¡Ponte a prueba!», además ' +
        '<b>Repasar · Profundizar · Relacionar</b>, una <b>excursión</b>, un <b>repaso final</b> y un <b>test</b>.',
        'Los ejercicios tienen tres niveles: ' + LVL(1) + ' básico, ' + LVL(2) + ' intermedio, ' + LVL(3) + ' avanzado. Las soluciones de todos ' +
        'los ejercicios y autoevaluaciones están en el anexo; las resoluciones de los ejemplos, directamente en el texto.',
        'Lo que está en un recuadro naranja <b>«Recuerda»</b> tienes que saberlo. Todo lo demás te ayuda a entenderlo.'],
    it: c => ['Come usare questo libro',
        'Questo libro esiste due volte: come libro online, in cui puoi ' + c + ', e come edizione a stampa nelle tue mani. Ogni capitolo ' +
        'comincia con un <b>codice QR</b> che porta direttamente alla sua versione interattiva. Le figure di questo volume mostrano gli ' +
        'elementi interattivi nel loro stato iniziale.',
        'Tutti i capitoli hanno la stessa struttura: un’<b>introduzione</b> con gli obiettivi e un check-in, <b>esplorazioni</b> da provare in ' +
        'gruppo, <b>lezioni</b> con un avvio, il riquadro «Ricorda», esempi, esercizi e «Mettiti alla prova!», poi ' +
        '<b>Ripassare · Approfondire · Collegare</b>, un’<b>escursione</b>, un <b>riepilogo</b> e un <b>test</b>.',
        'Gli esercizi hanno tre livelli: ' + LVL(1) + ' base, ' + LVL(2) + ' intermedio, ' + LVL(3) + ' avanzato. Le soluzioni di tutti gli ' +
        'esercizi e delle autoverifiche sono in appendice; gli svolgimenti degli esempi, direttamente nel testo.',
        'Quello che sta in un riquadro arancione <b>«Ricorda»</b> devi saperlo. Tutto il resto ti aiuta a capirlo.'],
    fr: c => ['Comment utiliser ce manuel',
        'Ce manuel existe en deux versions' + NB + ': un livre en ligne, dans lequel tu peux ' + c + ', et l’édition imprimée que tu tiens ' +
        'entre tes mains. Chaque chapitre commence par un <b>QR code</b> qui mène directement à sa version interactive. Les figures de ' +
        'ce manuel montrent les éléments interactifs dans leur état de départ.',
        'Tous les chapitres ont la même structure' + NB + ': une <b>introduction</b> avec les objectifs et un check-in, des <b>explorations</b> ' +
        'à essayer en groupe, des <b>leçons</b> avec une mise en route, l’encadré «' + NB + 'À retenir' + NB + '», des exemples, des exercices ' +
        'et «' + NB + 'Teste-toi' + NB + '!' + NB + '», puis <b>Réviser · Approfondir · Relier</b>, une <b>excursion</b>, un <b>bilan</b> et un <b>test</b>.',
        'Les exercices ont trois niveaux' + NB + ': ' + LVL(1) + ' base, ' + LVL(2) + ' intermédiaire, ' + LVL(3) + ' avancé. Les solutions de ' +
        'tous les exercices et des autoévaluations se trouvent en annexe' + NB + '; les résolutions des exemples, directement dans le texte.',
        'Ce qui est dans un encadré orange <b>«' + NB + 'À retenir' + NB + '»</b>, tu dois le savoir. Tout le reste t’aide à le comprendre.'],
};
// the clause of the German first sentence: "… als Online-Buch, in dem du <clause> kannst, und als Druckausgabe …"
const CLAUSE = {
    'jede Formel ausprobieren, jeden Graphen verschieben und jeden Zufallsversuch tausendmal laufen lassen': {
        en: 'try out every formula, drag every graph and run every random experiment a thousand times',
        es: 'probar cada fórmula, mover cada gráfica y repetir mil veces cada experimento aleatorio',
        it: 'provare ogni formula, spostare ogni grafico e ripetere mille volte ogni esperimento casuale',
        fr: 'essayer chaque formule, déplacer chaque courbe et relancer mille fois chaque expérience aléatoire',
    },
    'an jedem Dreieck ziehen, jede Sinuskurve verformen und jeden Kredit durchrechnen': {
        en: 'pull at every triangle, reshape every sine curve and work through every loan',
        es: 'tirar de cada triángulo, deformar cada curva sinusoidal y calcular cada préstamo',
        it: 'tirare ogni triangolo, deformare ogni sinusoide e calcolare ogni prestito',
        fr: 'tirer sur chaque triangle, déformer chaque sinusoïde et calculer chaque crédit',
    },
    'jede Rechnung Schritt für Schritt aufdecken, jeden Würfel falten und jede Figur spiegeln': {
        en: 'uncover every calculation step by step, fold every cube and reflect every figure',
        es: 'descubrir cada cálculo paso a paso, plegar cada cubo y reflejar cada figura',
        it: 'scoprire ogni calcolo passo dopo passo, piegare ogni cubo e costruire la simmetrica di ogni figura',
        fr: 'découvrir chaque calcul pas à pas, plier chaque cube et construire le symétrique de chaque figure',
    },
    'jede Formel ausprobieren, jedes Dreieck verziehen und jeden Zufallsversuch hundertmal laufen lassen': {
        en: 'try out every formula, stretch every triangle and run every random experiment a hundred times',
        es: 'probar cada fórmula, deformar cada triángulo y repetir cien veces cada experimento aleatorio',
        it: 'provare ogni formula, deformare ogni triangolo e ripetere cento volte ogni esperimento casuale',
        fr: 'essayer chaque formule, déformer chaque triangle et relancer cent fois chaque expérience aléatoire',
    },
    'jede Formel ausprobieren, jeden Graphen verschieben und jeden Körper im Raum drehen': {
        en: 'try out every formula, drag every graph and turn every solid in space',
        es: 'probar cada fórmula, mover cada gráfica y girar cada cuerpo en el espacio',
        it: 'provare ogni formula, spostare ogni grafico e ruotare ogni solido nello spazio',
        fr: 'essayer chaque formule, déplacer chaque courbe et faire tourner chaque solide dans l’espace',
    },
    // BGY 13 LK (28.10.2026, English by Taussky)
    'jede Formel ausprobieren, jeden Graphen verschieben, jeden Körper im Raum drehen und jeden Zufallsversuch tausendmal laufen lassen': {
        en: 'try out every formula, drag every graph, turn every solid in space and run every random experiment a thousand times',
        es: 'probar cada fórmula, mover cada gráfica, girar cada cuerpo en el espacio y repetir mil veces cada experimento aleatorio',
        it: 'provare ogni formula, spostare ogni grafico, ruotare ogni solido nello spazio e ripetere mille volte ogni esperimento casuale',
        fr: 'essayer chaque formule, déplacer chaque courbe, faire tourner chaque solide dans l’espace et relancer mille fois chaque expérience aléatoire',
    },
    'jeden Term als Rechenbaum aufbauen, jedes Glücksrad tausendmal drehen und jedes Dreieck strecken': {
        en: 'build every term as a calculation tree, spin every wheel of fortune a thousand times and stretch every triangle',
        es: 'construir cada término como árbol de cálculo, girar mil veces cada ruleta y estirar cada triángulo',
        it: 'costruire ogni termine come albero di calcolo, far girare mille volte ogni ruota della fortuna e allungare ogni triangolo',
        fr: 'construire chaque terme comme un arbre de calcul, faire tourner mille fois chaque roue de la fortune et étirer chaque triangle',
    },
};

// the <div class="b-titel…"> block of a page, by counting its divs
function titelBlock(html, file) {
    const i = html.indexOf('<div class="b-titel');
    if (i < 0) throw new Error(file + ': kein Einband (.b-titel)');
    let depth = 0;
    for (const m of html.slice(i).matchAll(/<(\/?)div\b[^>]*>/g)) {
        depth += m[1] ? -1 : 1;
        if (depth === 0) return html.slice(i, i + m.index + m[0].length);
    }
    throw new Error(file + ': Einband nicht geschlossen');
}
const scripts = html => [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

function make(book) {
    const [, base, lang] = book.match(/^(.+)-(en|es|it|fr)$/) || [];
    if (!base) throw new Error(book + ': kein übersetztes Buch (<buch>-en|es|it|fr)');
    const dir = path.join(BUCH, book), gerFile = path.join(BUCH, base, 'druck.html');
    if (!existsSync(gerFile)) throw new Error(book + ': das deutsche Buch ' + base + ' hat keine Druckausgabe');
    const ger = readFileSync(gerFile, 'utf8');
    const index = readFileSync(path.join(dir, 'index.html'), 'utf8');
    const kapFile = path.join(dir, 'kapitel.js'), kap = readFileSync(kapFile, 'utf8');
    const ctx = { window: {} };
    vm.runInNewContext(kap, ctx);
    const B = ctx.window.BUCH;

    // the scripts, in the order the book's own pages load them: start page first, then every chapter
    const skip = /farbschema\.js|labs-icons\.js|apple-emoji\.js|katex|auto-render|^kapitel\.js$/;
    const order = [];
    for (const f of ['index.html', ...B.chapters.map(c => c.file)]) {
        for (const s of scripts(readFileSync(path.join(dir, f), 'utf8'))) if (!skip.test(s) && !order.includes(s)) order.push(s);
    }
    if (!order.includes('../../js/buch-' + lang + '.js') || !order.includes('../../js/buch.js')) throw new Error(book + ': buch-' + lang + '.js oder buch.js fehlt');
    // every widget the German print edition loads must be there (with its dictionary, when one exists)
    for (const s of scripts(ger)) {
        if (skip.test(s) || /qrcode|paged|buch-druck/.test(s) || order.includes(s)) continue;
        order.push(s);
        const dict = s.replace(/\/buch-([^/]+)\.js$/, '/buch-' + lang + '/$1.js');
        if (dict !== s && existsSync(path.join(BUCH, book, dict))) order.push(dict);
    }

    // "So arbeitest du mit diesem Buch": the German clause decides which first sentence
    const front = ger.match(/<section class="d-front">[\s\S]*?<\/section>/);
    const clause = front && front[0].replace(/\s+/g, ' ').match(/als Online-Buch, in dem du (.+?) kannst, und als Druckausgabe/);
    if (!clause || !CLAUSE[clause[1]]) throw new Error(base + ': neuer Satz in „So arbeitest du“, bitte in CLAUSE übersetzen: ' + (clause ? clause[1] : '?'));
    const [h1, ...ps] = FRONT[lang](CLAUSE[clause[1]][lang]);
    const frontHtml = '<section class="d-front">\n        <h1>' + h1 + '</h1>\n        <div class="b-text">\n' +
        ps.map(p => '            <p>' + p + '</p>\n').join('') + '        </div>\n    </section>';

    // the cover of the start page, marked as the print edition
    const cover = titelBlock(index, book + '/index.html').replace(/(<p class="b-titel-kicker">)([^<]*)(<\/p>)/,
        (m, a, k, b) => a + k + ' · ' + UI[lang].bar + b);
    const title = (index.match(/<title>([^<]*)<\/title>/) || [])[1] || B.title;
    const pageTitle = title.includes(' | ') ? title.replace(' | ', ' · ' + UI[lang].title + ' | ') : title + ' · ' + UI[lang].title;

    let out = ger
        .replace(/<html lang="de"/, '<html lang="' + lang + '"')
        .replace(/<title>[^<]*<\/title>/, () => '<title>' + pageTitle + '</title>')
        .replace(/<b>DRUCKAUSGABE<\/b>/, () => '<b>' + UI[lang].bar + '</b>')
        .replace(/<span id="d-status">[^<]*<\/span>/, () => '<span id="d-status">' + UI[lang].wait + '</span>')
        .replace(/(id="d-print">)[^<]*(<\/button>)/, (m, x, y) => x + UI[lang].print + y)
        .replace(titelBlock(ger, base + '/druck.html'), () => cover)          // functions: no $-patterns from the content
        .replace(/<section class="d-front">[\s\S]*?<\/section>/, () => frontHtml);
    // the scripts between the KaTeX and qrcode/labs-icons lines and Paged.js: kapitel.js, then the book's own order
    const a = out.indexOf('<script src="kapitel.js"></script>'), b = out.indexOf('<script>window.PagedConfig');
    if (a < 0 || b < 0) throw new Error(base + '/druck.html: Aufbau unerwartet (kapitel.js / PagedConfig)');
    out = out.slice(0, a) + '<script src="kapitel.js"></script>\n' + order.map(s => '<script src="' + s + '"></script>\n').join('') + out.slice(b);
    writeFileSync(path.join(dir, 'druck.html'), out);

    // the book has a print edition now: overview (O) and PDF button on
    // the sentence in the head comment, wherever the comment wraps it
    const gap = '\\s+(?:\\*\\s+)?';
    const said = new RegExp('No' + gap + 'print' + gap + 'edition(?:' + gap + 'yet)?(?:' + gap + '\\(Doc:' + gap + '"Druck' + gap + 'lassen' + gap + 'wir' + gap + 'erstmal"\\))?:' +
        gap + ['druck:', 'false', 'hides', 'the', 'page', 'overview', '\\(O\\)', 'in', 'js/buch\\.js\\.'].join(gap));
    const kapNew = kap.replace(/\n\s*druck: false,[^\n]*/, '').replace(said, 'Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.');
    if (kapNew !== kap) writeFileSync(kapFile, kapNew);
    return { book, scripts: order.length, flag: kapNew !== kap };
}

const args = process.argv.slice(2);
const todo = args.includes('--alle')
    ? readdirSync(BUCH).filter(b => /-(en|es|it|fr)$/.test(b) && existsSync(path.join(BUCH, b.replace(/-(en|es|it|fr)$/, ''), 'druck.html'))
        && existsSync(path.join(BUCH, b, 'index.html'))).sort()
    : args.filter(a => !a.startsWith('--'));
if (!todo.length) { console.error('node tools/buch-druck/druck-html.mjs <buch>-<sprache> [… ] | --alle'); process.exit(1); }
let failed = 0;
for (const book of todo) {
    try { const r = make(book); console.log(r.book + ': druck.html (' + r.scripts + ' Skripte)' + (r.flag ? ', druck: false entfernt' : '')); }
    catch (e) { failed++; console.error(e.message); }
}
process.exit(failed ? 1 : 0);
