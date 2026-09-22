// Stoffverteilungsplan renderer, part "material": material pills: icons, labels, viewer, tooltip.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        drawnIcon, matLabelEl, matIconEl, siteHref, lokalHref, keinMausfokus, equalizeMatPills,
        equalizeRefPills, setVideoReiter, isVideoEntry, isExerciseEntry, officeEdit,
        matDefaultLabel, openMat, renderMaterial, hideMatTip, showMatTip,
        festeLinks, festePillen
    });

    /* Adressen neben dem svp-Ordner: gerechnet wird gegen die Adresse DIESER
       Datei und nicht gegen die der Seite - die Plaene liegen in Unterordnern
       (svp/mathe/, svp/informatik/), und ein handgeschriebenes "../.." stimmt
       dann nur zufaellig. */
    function neben(pfad) {
        const me = document.querySelector('script[src*="svp-plan-material.js"]');
        const dir = me ? me.src.replace(/[^/]*$/, '') : location.href;
        return new URL(pfad, dir).href;
    }

    /* ---- Was in JEDER Stunde dieses Fachs gebraucht wird -----------------
       Die Formelsammlung haengt nicht an einer Woche, sondern am Fach (Doc,
       21.09.2026: "bau den auch in Mathe heute ein", "hier bitte auch!" -
       gezeigt auf die Zusatzmaterial-Zeile). Sie ist das einzige zugelassene
       Hilfsmittel im Abitur und gilt damit wirklich fuer jede Stunde.
       ALLES ANDERE gehoert in die Woche, in der es drankommt, und wird dort
       wie jedes Material eingetragen - Lab und Film standen kurz hier und sind
       wieder raus (Doc: "doch nicht ueberall! KW 39", "das Lab auch nicht!",
       "nur KW 39").
       Die Liste steht HIER, weil zwei Stellen sie brauchen: die Zeile im Plan
       und das Fahrplan-Blatt. */
    const FORMELN_URL = P.FORMELN_URL = 'https://www.iqb.hu-berlin.de/media/documents/' +
        'N_Mathematisch-naturwissenschaftliche_Formelsammlung.pdf';
    const FORMELN_ON = P.FORMELN_ON = ['mathe11', 'mathe12', 'mathe13'];

    /* Das Zeichen des Labors vor dem Lab-Link: das gelbe Kaestchen mit dem
       dunkelblauen Lambda aus resources/favicon.svg - GEZEICHNET, nicht als
       Bild geladen. serve.py tauscht /resources/favicon.svg lokal gegen das
       rote favicon-local.svg (das Reiter-Zeichen soll lokal von live zu
       unterscheiden sein), und genau dieses Rot kam in der Pille an (Doc,
       21.09.2026: "GELBES Lambda bitte"). Hier geht es nicht um den Reiter,
       sondern um das Zeichen des Labors - das ist immer gelb.
       Es traegt .mat-ico wie jedes andere Symbol: an dieser Klasse haengt die
       Geometrie der Pille (:has(> .mat-ico) in svp-viewer.css). Ohne sie fiel
       die Pille niedriger und schmaler aus als die der Woche (Doc: "beide
       Pillen unten so wie die anderen").
       Es steht an JEDEM Link ins eigene Labor, egal in welcher Woche er haengt
       (siehe istLab) - so ist ein Lab in der Materialzeile auf einen Blick von
       einem Foliensatz oder einem fremden Link zu unterscheiden. */
    function lambdaIcon() {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', 'mat-ico mat-ico-drawn mat-lambda');
        svg.setAttribute('viewBox', '0 0 64 64');
        svg.setAttribute('aria-hidden', 'true');
        const kasten = document.createElementNS(ns, 'rect');
        kasten.setAttribute('width', '64');
        kasten.setAttribute('height', '64');
        kasten.setAttribute('rx', '14');
        kasten.setAttribute('fill', 'rgb(245, 194, 66)');
        svg.appendChild(kasten);
        const g = document.createElementNS(ns, 'g');
        g.setAttribute('fill', 'none');
        g.setAttribute('stroke', 'rgb(14, 36, 78)');
        g.setAttribute('stroke-width', '9');
        g.setAttribute('stroke-linecap', 'round');
        ['M22 11 L46 53', 'M34.5 32.5 L18 53'].forEach(function (d) {
            const pfad = document.createElementNS(ns, 'path');
            pfad.setAttribute('d', d);
            g.appendChild(pfad);
        });
        svg.appendChild(g);
        return svg;
    }

    /* Das Symbol einer festen Pille. Die Formelsammlung ist ein Link ins Netz
       und bekommt den Pfeil der anderen Links (Doc, 21.09.2026: "bitte
       Formelsammlung mit Link Icon") - ihre Adresse endet auf .pdf, von allein
       haette matKind ihr das PDF-Programmsymbol gegeben. */
    function festesIcon(e) {
        if (e.icon === 'link') return drawnIcon('mat-ico-drawn mat-ico-link', LINK_PATH, 'rgb(120, 160, 220)');
        return null;   /* ohne icon: das Zeichen, das matKind gewaehlt hat */
    }

    function festeLinks() {
        const seite = location.pathname.replace(/.*\//, '').replace(/\.html$/, '');
        const raus = [];
        if (FORMELN_ON.indexOf(seite) >= 0) {
            raus.push({
                label: 'Formelsammlung', url: FORMELN_URL, icon: 'link',
                titel: 'Mathematisch-Naturwissenschaftliche Formelsammlung (IQB/KMK) - ' +
                    'das einzige zugelassene Hilfsmittel der Abiturpruefung'
            });
        }
        return raus;
    }

    /* Haengt die festen Pillen an ein Kaestchen. renderMaterial leert seinen
       Kasten bei jedem Lauf, deshalb wird das hier danach aufgerufen und nicht
       einmalig beim Bauen der Zeile.

       Gebaut werden sie von renderMaterial selbst - derselbe Weg wie fuer das
       Material der Woche (Doc, 21.09.2026: "nein! alle Pillen gleich,
       Formelsammlung ist ein Link"). Handgemachte Pillen waren schmaler und
       niedriger als die echten und fielen aus der Reihe, die equalizeMatPills
       ausmisst. Gerendert wird in einen Behelfskasten und dann umgehaengt:
       renderMaterial schreibt seinen Quelltext in dataset.src, und der von
       ref.matBlock ist das, was gespeichert wird - dort darf nichts Fremdes
       hinein. */
    function festePillen(ziel, ref) {
        const links = festeLinks();
        if (!links.length) return;
        const behelf = document.createElement('div');
        behelf.className = 'mat-block';
        renderMaterial(behelf, links.map(function (e) { return e.label + ' ' + e.url; }).join(' '), ref);
        const nach = {};
        links.forEach(function (e) { nach[e.label] = e; });
        Array.from(behelf.children).forEach(function (kind) {
            const a = kind.matches('a.mat-pill') ? kind : kind.querySelector('a.mat-pill');
            if (a) {
                a.classList.add('mat-fest');
                /* Zugeordnet wird ueber die Beschriftung, nicht ueber die
                   Reihenfolge: renderMaterial darf einen Eintrag auslassen. */
                const lbl = a.querySelector('.mat-label');
                const e = nach[((lbl || a).textContent || '').trim()];
                if (e) {
                    /* Das Symbol des festen Links statt des Dateityp-Zeichens
                       (Pfeil fuer die Formelsammlung, Lambda fuers Lab; der
                       Film behaelt sein YouTube-Zeichen). */
                    const zeichen = festesIcon(e);
                    const ico = zeichen && a.querySelector('.mat-ico, img, svg');
                    if (zeichen && ico) ico.replaceWith(zeichen);
                    else if (zeichen) a.insertBefore(zeichen, a.firstChild);
                    a.title = e.titel;
                }
            }
            ziel.appendChild(kind);
        });
    }

    // Renders the raw material text ("Label https://... Label2 https://...")
    // as compact link pills; text without any URL shows as a plain note.
    // The raw source is kept in data-src for edit mode.
    // File-type icon for a material pill; SharePoint share links carry the
    // app in the path (/:p:/ = PowerPoint, /:w:/ = Word, /:x:/ = Excel,
    // /:b:/ = PDF), otherwise the label/extension decides.
    /* A video file we can hand to the browser itself. Those get the built-in
       player in the viewer instead of an iframe - it needs no Microsoft round
       trip, carries no chrome, and plays where a frame would be refused. */
    const VIDEO_EXT = /\.(mp4|m4v|mov|webm)(\?|#|$)/i;
    function matVideoFile(url) { return VIDEO_EXT.test(url); }

    function matKind(url, label) {
        const l = ((label || '') + ' ' + url).toLowerCase();
        if (url.indexOf('/:p:/') >= 0 || l.indexOf('ppt') >= 0) return 'ppt';
        if (url.indexOf('/:w:/') >= 0 || l.indexOf('.doc') >= 0) return 'doc';
        if (url.indexOf('/:x:/') >= 0 || l.indexOf('.xls') >= 0) return 'xls';
        if (url.indexOf('/:b:/') >= 0 || l.indexOf('pdf') >= 0) return 'pdf';
        if (/youtu\.be\/|youtube\.com\//i.test(url)) return 'yt';
        /* SharePoint files a video share under /:v:/, the same way it uses
           /:p:/ for a deck; a plain file link is recognised by its ending. */
        if (url.indexOf('/:v:/') >= 0 || VIDEO_EXT.test(url)) return 'video';
        if (istLab(url)) return 'lab';
        return 'link';
    }

    /* Eine Seite aus dem eigenen Labor: docalvers.de/<name>.html, direkt unter
       der Wurzel - dort liegen die Labs. Aufgaben- und Testseiten liegen auch
       dort, tragen aber "test" im Namen; Foliensaetze liegen in /decks/,
       Aufgabenblaetter in /aufgaben/. Ein Lab-Link bekommt damit das Lambda
       statt des allgemeinen Pfeils. */
    function istLab(url) {
        url = String(url || '');
        if (!/^\//.test(url) && !/^https?:\/\/(?:www\.)?docalvers\.de\//i.test(url) &&
            !/^https?:\/\/localhost[:/]/i.test(url)) return false;
        let pfad;
        try { pfad = new URL(url, location.href).pathname; } catch (e) { return false; }
        if (!/^\/[\w-]+\.html$/i.test(pfad)) return false;
        return !/test/i.test(pfad) && !/^\/index\.html$/i.test(pfad);
    }

    /* Die Reihenfolge der Pillen in einer Zeile: erst die Foliensaetze und
       Dateien, dann die Labs, dann alles, was nur ein Link ist (Doc,
       21.09.2026: "bitte alle immer ordnen PPT labs links"). Das betrifft nur
       die ANZEIGE - gespeichert bleibt die Zeile so, wie Doc sie eingetragen
       hat (dataset.src wird in renderMaterial vor dem Sortieren gesetzt).
       Sortiert wird stabil: innerhalb einer Gruppe bleibt die eingetragene
       Reihenfolge stehen. Alles mit Programmsymbol (ppt/doc/xls/pdf) zaehlt
       zur ersten Gruppe - es ist eine Datei, die aufgemacht wird, kein Link.
       Die Filme stehen zwischen den Labs und den Links (Doc, 21.09.2026: "die
       hier auch sortieren" - gezeigt auf die Materialspalte im Fahrplan, wo
       alle Sorten nebeneinander haengen): sie gehoeren zum Stoff, fuehren aber
       wie ein Link aus dem Haus. */
    const MAT_RANG = { ppt: 0, doc: 0, xls: 0, pdf: 0, lab: 1, yt: 2, video: 2 };
    function matRang(en) {
        const rang = MAT_RANG[matKind(en.url || '', en.label || '')];
        return rang == null ? 3 : rang;   /* alles Uebrige ist ein blosser Link */
    }


    // App icons instead of emoji: emoji look different on every device and
    // grey out inside the pill. These are the macOS app icons the kids see on
    // their own machines — extracted from the installed apps into svp/icons/,
    // referenced only, never altered. The base is derived from this script's
    // own URL, so sub-folders (mathe/, informatik/, …) work too.
    const ICON_BASE = (function () {
        const src = (document.currentScript && document.currentScript.src) ||
            (function () {
                const list = document.getElementsByTagName('script');
                for (let i = list.length - 1; i >= 0; i--)
                    if (/svp-plan\.js/.test(list[i].src)) return list[i].src;
                return '';
            })();
        return src ? new URL('icons/', src).href : 'icons/';
    })();

    const YT_PATH = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 ' +
        '3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 ' +
        '5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 ' +
        '3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 ' +
        '12l-6.273 3.568z';

    // Praesentation (Leinwand mit Pfeil) — Strichsymbol fuer "in der App oeffnen",
    // damit der Menuepunkt zu den getippten Zeichen passt statt zum bunten Logo.
    const PRESENT_PATH = P.PRESENT_PATH = 'M3.5 4.5h17v11h-17z M12 15.5v3.5 M8.7 21.5 12 19l3.3 2.5';

    // Laptop = "von diesem Rechner" - das Symbol des Menuepunkts "Öffne lokal".
    const LAPTOP_PATH = P.LAPTOP_PATH = 'M4.5 5.5h15v10h-15z M2 18.5h20 M10 18.5h4';

    /* Film statt QuickTime-Symbol (Doc, 08.09.2026: "nimm bitte ein movie icon
       sonst zu Mac"). Die vier Buerosymbole sind Programmsymbole, weil jedes
       Kind sie im eigenen Dock hat - fuer eine Videodatei gibt es kein solches
       Programm, das auf Windows wie auf dem Mac gilt.
       ZWEITER ANLAUF: der erste Entwurf war ein Filmstreifen mit Loechern und
       Abspieldreieck - bei den 16 px, die nach dem Innenabstand von .mat-ico-drawn
       uebrig bleiben, wurden die Loecher zu dunkelblauem Matsch und das Zeichen
       wirkte neben dem YouTube-Symbol zu klein (Doc: "dunkelblau kaum sichtbar",
       "zu klein", "check YT icon"). Jetzt eine Kamera aus zwei VOLLEN Flaechen,
       ohne jede Aussparung, ueber die ganze Breite wie das YouTube-Zeichen. */
    const MOVIE_PATH =
        'M3.5 4.2h9A2.5 2.5 0 0 1 15 6.7v10.6a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 17.3V6.7' +
        'A2.5 2.5 0 0 1 3.5 4.2z ' +
        'M17 9.6l5.3-4A1 1 0 0 1 24 6.4v11.2a1 1 0 0 1-1.7.8L17 14.4z';

    // Plain link: drawn, not typed — the \u2197 character sits too high in its
    // line in most fonts, an SVG is centred by construction.
    const LINK_PATH = 'M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5v2H7v10h10v-3h2v5H5V5z';

    // fill = Farbe fuer eine Flaeche; strichbreite > 0 zeichnet stattdessen eine
    // Linie - so passt ein Symbol zu den duennen getippten Zeichen im Menue.
    function drawnIcon(cls, d, fill, strichbreite) {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', 'mat-ico ' + cls);
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        if (strichbreite) {
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', fill);
            path.setAttribute('stroke-width', strichbreite);
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
        } else {
            path.setAttribute('fill', fill);
        }
        svg.appendChild(path);
        return svg;
    }

    function matLabelEl(text) {
        const span = document.createElement('span');
        span.className = 'mat-label';
        span.textContent = text;
        return span;
    }

    function matIconEl(url, label) {
        const kind = matKind(url, label);
        /* no Mac app to take these from — brand/plain glyphs instead */
        if (kind === 'yt') return drawnIcon('mat-ico-drawn', YT_PATH, 'rgb(255, 0, 0)');
        if (kind === 'link') return drawnIcon('mat-ico-drawn mat-ico-link', LINK_PATH, 'rgb(120, 160, 220)');
        if (kind === 'lab') return lambdaIcon();
        /* Farbe kommt aus svp.css, nicht von hier: dunkelblau im hellen Thema
           (Doc, 08.09.2026), hell im dunklen - eine feste Farbe waere in einem
           der beiden Themen kaum zu sehen. */
        if (kind === 'video') return drawnIcon('mat-ico-drawn mat-ico-movie', MOVIE_PATH, 'currentColor');
        const img = document.createElement('img');
        img.className = 'mat-ico';
        img.src = ICON_BASE + kind + '.png';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        return img;
    }

    /* Abgabe-Knopf: ein Material-Eintrag, dessen Label mit "Upload" oder
       "Abgabe" beginnt, wird nicht als Material-Pille gezeichnet, sondern als
       Knopf zum Hochladen (Doc, 31.08.2026 - die Kids legen ihre PPTs in einen
       geteilten OneDrive-Ordner). Erkennung am Label, nicht an der URL: die
       Freigabe-Links von SharePoint sehen alle gleich aus, egal wofuer sie
       gedacht sind. */
    const UPLOAD_LABEL = /^\s*(upload|abgabe)\b/i;
    function isUploadEntry(en) { return UPLOAD_LABEL.test(en.label || ''); }

    /* Eigene Links zeigen im Material auf docalvers.de - auf Docs lokalem
       Server (serve.py, :8765) landet man damit auf der LIVE-Seite und testet
       nicht, was gerade gebaut wurde (Doc, 07.09.2026: "dies verweisen auch
       local auf docalvers"). Lokal wird der eigene Host deshalb abgeschnitten:
       serve.py liefert HTML/ als Wurzel, die absolute Pfadangabe passt also auf
       beiden Seiten. Fremde Hosts (SharePoint, YouTube) bleiben unberührt. */
    const IST_LOKAL = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname);
    function siteHref(url) {
        if (!IST_LOKAL) return url;
        return String(url == null ? '' : url)
            .replace(/^https?:\/\/(?:www\.)?docalvers\.de(?=\/|$)/i, '') || url;
    }

    /* Das Gegenstueck: von der LIVE-Seite aus dieselbe Seite vom eigenen Rechner
       holen (Doc, 22.09.2026: "gib mir bitte ein 'Öffne lokal' wenn ich eingeloggt
       bin"). Leer heisst: der Punkt gehoert nicht ins Menue - weil man ohnehin
       schon lokal ist oder weil der Link gar nicht hierher zeigt (SharePoint,
       YouTube: dort gibt es lokal nichts zu oeffnen). */
    const LOKAL_ORIGIN = 'http://localhost:8765';        /* serve.py, wie in svp-nav.js */
    function lokalHref(url) {
        if (IST_LOKAL) return '';
        try {
            const u = new URL(String(url == null ? '' : url), location.href);
            if (!/^(?:www\.)?docalvers\.de$/i.test(u.hostname)) return '';
            return LOKAL_ORIGIN + u.pathname + u.search + u.hash;
        } catch (e) { return ''; }
    }

    /* Textaufgaben-Blatt: liegt unter /aufgaben/ und wandert nicht in die
       Material-Zeile, sondern in die "Aufgaben"-Pille neben das Wochenquiz
       (Doc, 07.09.2026: "ein Drop wo drauf steht Aufgaben"). Erkennung an der
       URL - das Label darf der Plan frei benennen ("3 Textaufgaben").
       Ein zweiter, schwererer Aufgabensatz ("<fach>test<klasse>-<thema>-2.html",
       Doc 07.09.2026 nachmittags: "Aufgaben 1" / "Aufgaben 2") wandert aus
       demselben Grund in die Pille statt in die Material-Zeile - das gilt fuer
       jedes Fach, nicht nur fuer Mathe (Doc 08.09.2026, Info BGY 12). */
    /* Filme bekommen rechts einen eigenen Reiter, statt zwischen Decks und
       Arbeitsblaettern zu stehen (Doc, 08.09.2026: "da sollen die Videos aus
       Mat rein"). Sie werden NICHT getrennt gepflegt - beide Reiter lesen
       dieselbe Materialzeile, hier wird nur sortiert. Was ein Video ist,
       entscheidet dieselbe matKind() wie beim Symbol, damit Reiter und Symbol
       nie auseinanderlaufen. */
    /* Alle Materialpillen der SEITE gleich breit (Doc, 09.09.2026: "ich denke
       ueber die ganze Seite" - vorher galt das Mass nur innerhalb einer Woche,
       und die Pillen sprangen von Zeile zu Zeile). Gemessen statt fest
       verdrahtet, genau wie bei den Bereich-Pillen weiter unten: die breiteste
       gibt das Mass, schmaler ginge nur durch Abschneiden. ACHTUNG, nur im
       SICHTBAREN Zustand messbar - eine zugeklappte Woche und ein verborgener
       Reiter liefern lauter Nullen. Deshalb wird nach dem Aufklappen, nach
       jedem Reiterwechsel und nach jeder Materialaenderung neu gemessen, nicht
       nur beim Zeichnen. */
    /* Ein Klick soll den Reiter NICHT fokussieren. Sonst zieht der Browser
       seinen Fokusring darum, und der bleibt nach dem Klick stehen (Doc,
       08.09.2026: "irgendwie kommt der immer noch"). Das reine CSS reichte
       nicht - Chrome wertet den Klick je nach Vorgeschichte als
       Tastaturfokus. Die Tastatur bleibt unberuehrt: Tab fokussiert weiter
       und zeigt den Ring, nur die Maus tut es nicht mehr. */
    function keinMausfokus(ev) { ev.preventDefault(); }

    function equalizeMatPillsNow() {
        const pills = Array.prototype.slice.call(
            document.querySelectorAll('.mat-block a.mat-pill'));
        if (!pills.length) return;
        pills.forEach(function (p) { p.style.width = ''; });
        let w = 0;
        pills.forEach(function (p) {
            /* zugeklappte Woche oder verborgener Reiter: misst 0 und wuerde
               das Mass der ganzen Seite kaputtmessen */
            if (!p.offsetParent) return;
            w = Math.max(w, p.getBoundingClientRect().width);
        });
        /* Das Mass geht an ALLE Pillen, auch an die gerade verborgenen: so
           steht eine Woche schon im Moment des Aufklappens richtig da,
           statt erst nach dem naechsten Durchgang zu springen. */
        if (w) pills.forEach(function (p) { p.style.width = w + 'px'; });
    }
    /* Ein Durchgang je Bild statt einer je Aufruf: der Cloud-Abgleich ruft
       updateMaterial fuer JEDE Zeile auf, und seit das Mass die ganze Seite
       umfasst waere jeder dieser Aufrufe ein Lauf ueber alle Pillen. */
    let matEqualJob = 0;
    function equalizeMatPills() {
        if (matEqualJob) return;
        matEqualJob = requestAnimationFrame(function () {
            matEqualJob = 0;
            equalizeMatPillsNow();
        });
    }
    /* Bleibt als Name stehen, weil an den Aufrufstellen eine Woche gemeint ist
       - gemessen wird laengst die ganze Seite. */
    function equalizeRefPills() { equalizeMatPills(); }

    /* Zeigt oder versteckt den Videos-Reiter einer Woche. Wird an zwei Stellen
       gebraucht: beim Bauen der Reiter (die Zeile kann laengst Material haben)
       und bei jeder Materialaenderung. */
    function setVideoReiter(ref, anzahl, zusatz, aufgaben) {
        const p = ref && ref.rPanes;
        if (!p || !p.videos) return;
        /* Doc, 15.09.2026: "schreib immer noch klein dahinter wieviel" - the count
           after each tab name, always, (0) included. */
        const zahl = function (tab, n) {
            if (tab && tab.count && n != null) tab.count.textContent = '(' + n + ')';
        };
        zahl(p.videos, anzahl);
        zahl(p.zusatz, zusatz);
        /* Doc, 08.09.2026: "wenn keine vids da sind grey ... not selectable".
           Vorher war der Reiter versteckt - dann springt die Kopfzeile je nach
           Woche. Jetzt steht er immer da und ist nur gesperrt. */
        p.videos.btn.disabled = !anzahl;
        if (!anzahl && p.videos.btn.classList.contains('on') && ref.showRechts) ref.showRechts('zusatz');
        /* Der Aufgaben-Reiter folgt genau derselben Regel wie Videos: er steht
           immer da, ist aber gesperrt, wenn die Woche keine Aufgaben hat. */
        if (p.aufgaben) {
            zahl(p.aufgaben, aufgaben);
            p.aufgaben.btn.disabled = !aufgaben;
            if (!aufgaben && p.aufgaben.btn.classList.contains('on') && ref.showRechts) ref.showRechts('zusatz');
        }
    }

    function isVideoEntry(en) {
        const k = matKind(en.url || '', en.label || '');
        return k === 'video' || k === 'yt';
    }

    function isExerciseEntry(en) {
        /* Ein Eintrag, den der Plan "Aufgaben ..." nennt, gehoert in die Pille -
           unabhaengig vom Dateinamen (Doc 08.09.2026, Info 11: die Wochenblaetter
           heissen dort inf11test-<thema>.html, ohne die -2 der Mathe-Zweitsaetze).
           Nur die Mehrzahl zaehlt: ein einzelnes "Aufgabe"-Material bleibt in der
           Material-Zeile, wo es bisher steht. */
        if (/^\s*Aufgaben\b/i.test(en.label || '')) return true;
        return /\/aufgaben\//i.test(en.url || '') || /(?:^|\/)[\w-]*test[\w-]*-2\.html$/i.test(en.url || '');
    }

    // Default pill label when none was typed: derived from the link type.
    // Ein Office-Dokument in der Desktop-App oeffnen. Office registriert dafuer
    // eigene Protokolle; "ofe" heisst "open for edit", "u" leitet die Adresse ein.
    // Klappt mit einem Freigabelink genauso wie mit einem Pfad - Office loest ihn
    // selbst auf. Fuer alles ausser Word/Excel/PowerPoint gibt es kein Protokoll.
    const OFFICE_APP = {
        ppt: ['ms-powerpoint', 'PowerPoint'],
        doc: ['ms-word', 'Word'],
        xls: ['ms-excel', 'Excel']
    };
    function officeEdit(url, label, datei) {
        const app = OFFICE_APP[matKind(url, label)];
        /* Ohne Dateipfad geht es nicht: Office kann einen Freigabelink nicht
           aufloesen und meldet dann "Internetverbindung erforderlich". */
        if (!app || !datei) return null;
        return { href: app[0] + ':ofe|u|https://' + datei.replace(/^https?:\/\//, ''), name: app[1] };
    }

    function matDefaultLabel(url) {
        const l = url.toLowerCase();
        if (url.indexOf('/:p:/') >= 0 || l.indexOf('ppt') >= 0) return 'PPT';
        if (url.indexOf('/:w:/') >= 0 || l.indexOf('.doc') >= 0) return 'Doc';
        if (url.indexOf('/:x:/') >= 0 || l.indexOf('.xls') >= 0) return 'Excel';
        if (url.indexOf('/:b:/') >= 0 || l.indexOf('pdf') >= 0) return 'PDF';
        if (matKind(url, '') === 'yt') return 'Video';
        return 'Link';
    }

    // PowerPoint share links open as slideshow, not in the edit view:
    // Office for the web starts the deck (with animations) on &action=embedview.
    // action=embedview is OneDrive's own embed switch. It only works on a SHARE
    // link (/:p:/…) and lands on the WOPI frame — the one page in the redirect
    // chain that sets no frame-ancestors (the 302s before it do, so measure the
    // LAST response, not the first). A plain path into the drive is a download,
    // and with web=1 it opens SharePoint's own UI, which answers SAMEORIGIN —
    // both were tried on 06.09.2026, neither can be framed. Hence: share links.
    function matHref(url) {
        const isPpt = url.indexOf('/:p:/') >= 0 || /\.pptx?(\?|#|$)/i.test(url);
        if (!isPpt || /[?&]action=/.test(url)) return url;
        return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'action=embedview';
    }

    // A browser popup always keeps its address bar (anti-phishing, cannot be
    // switched off), so Office material is shown in an in-page viewer instead
    // — no window chrome at all. Kept as the fallback for everything the
    // viewer cannot frame, and behind the ↗ button of the viewer itself.
    function openMatWindow(url) {
        const w = Math.min(1280, Math.round(screen.availWidth * 0.8));
        const h = Math.min(820, Math.round(screen.availHeight * 0.85));
        const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - w) / 2));
        const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - h) / 2));
        const feat = 'popup=yes,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top +
            ',resizable=yes,scrollbars=yes';
        const win = window.open(matHref(url), 'svp-material', feat);
        if (win) { try { win.opener = null; } catch (e) { /* cross-origin: fine */ } win.focus(); }
    }

    // Only SharePoint/Office DOCUMENT links are framed: they are made for it
    // (action=embedview is OneDrive's own embed code). Foreign links — YouTube
    // and friends — refuse to be framed, so they keep their own window.
    // Two SharePoint shapes refuse it as well and must not be framed either
    // (Doc, 31.08.2026 — "refused to connect" on an upload folder):
    //   _layouts/… is the interactive web UI, never an embed;
    //   /:f:/ is a FOLDER share — it opens the same UI, and an upload needs
    //   the full window anyway.
    // And the share link must be scoped "anyone with the link": inside an iframe
    // the SharePoint cookie is third-party and gets blocked, so an org-internal
    // link lands on login.microsoftonline.com — which refuses framing, however
    // well signed in the viewer is (Doc, 06.09.2026, "refused to connect").
    function matEmbeddable(url) {
        if (/\/_layouts\//i.test(url) || /\/:f:\//.test(url)) return false;
        if (matVideoFile(url)) return true;          /* our own player, always frameable */
        /* A VIDEO share link (/:v:/) is the exception among the SharePoint
           shapes: measured 08.09.2026 on the live page, it answers "refused to
           connect" even with action=embedview, because OneDrive serves the
           Stream player from its own page instead of the WOPI frame that the
           document types land on. So it keeps its own window. Only a real
           video FILE gets the in-page player. */
        if (url.indexOf('/:v:/') >= 0) return false;
        /* A PDF share link (/:b:/) refuses as well — measured 17.09.2026 on an
           "anyone" link: it redirects to onedrive.aspx, which sends
           X-Frame-Options: SAMEORIGIN and frame-ancestors 'self' teams…, so the
           viewer showed "refused to connect". Own window, like /:v:/. */
        if (url.indexOf('/:b:/') >= 0) return false;
        return /\/:[pwx]:\//.test(url) || /sharepoint\.com|officeapps\.live\.com/i.test(url);
    }

    let matView = null;
    function closeMatView() {
        if (!matView) return;
        matView.remove();
        matView = null;
        document.removeEventListener('keydown', matViewKey, true);
    }
    function matViewKey(e) { if (e.key === 'Escape') closeMatView(); }

    function openMatView(url, label) {
        closeMatView();
        const wrap = document.createElement('div');
        wrap.className = 'mat-view-wrap';
        const box = document.createElement('div');
        box.className = 'mat-view';

        const head = document.createElement('div');
        head.className = 'mv-head';
        const title = document.createElement('span');
        title.className = 'mv-title';
        title.appendChild(matIconEl(url, label || ''));
        title.appendChild(matLabelEl(label || matDefaultLabel(url)));
        head.appendChild(title);

        const tools = document.createElement('span');
        tools.className = 'mv-tools';
        [['\u2197', 'In eigenem Fenster öffnen', function () { closeMatView(); openMatWindow(url); }],
         ['\u2715', 'Schließen (Esc)', closeMatView]
        ].forEach(function (def) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'mv-btn';
            b.textContent = def[0];
            b.title = def[1];
            b.setAttribute('aria-label', def[1]);
            b.addEventListener('click', def[2]);
            tools.appendChild(b);
        });
        head.appendChild(tools);
        box.appendChild(head);

        /* A plain video file is played by the browser itself - no iframe, no
           Microsoft, no waiting. The Office chrome bar is missing there, so the
           stage drops the extra strip it reserves for it. */
        const istVideo = matVideoFile(url);
        let frame;
        if (istVideo) {
            frame = document.createElement('video');
            frame.className = 'mv-frame mv-video';
            frame.src = url;
            frame.controls = true;
            frame.preload = 'metadata';
            frame.setAttribute('playsinline', '');
            frame.title = label || matDefaultLabel(url);
        } else {
            frame = document.createElement('iframe');
            frame.className = 'mv-frame';
            frame.src = matHref(url);
            frame.title = label || matDefaultLabel(url);
            frame.setAttribute('allowfullscreen', '');   /* the viewer's own \u26f6 */
            frame.setAttribute('allow', 'fullscreen');
        }
        /* The OneDrive player paints a black stage and leaves a hairline of it
           above and below the slide (its own rounding). The stage clips the
           frame, which is a few pixels taller and pulled up by half of that —
           so the deck starts right under our title row. */
        const stage = document.createElement('div');
        stage.className = 'mv-stage' + (istVideo ? ' mv-stage-video' : '');
        /* Die Office-Oberflaeche laedt nach dem Dokument noch von einem guten
           Dutzend Microsoft-Hosts nach; ohne Anzeige sieht das aus, als haenge
           es (Doc, 06.09.2026). Die Anzeige verschwindet, sobald der Rahmen
           laedt - auch im Fehlerfall, damit nie ein Kringel stehen bleibt. */
        const laedt = document.createElement('div');
        laedt.className = 'mv-laedt';
        laedt.textContent = 'Wird geladen …';
        const fertig = function () { laedt.remove(); };
        /* Only the Office frame needs the hint: it loads from a dozen Microsoft
           hosts and looks stuck meanwhile. The player brings its own progress. */
        if (!istVideo) {
            stage.appendChild(laedt);
            frame.addEventListener('load', fertig);
            frame.addEventListener('error', fertig);
            setTimeout(fertig, 20000);
        }
        stage.appendChild(frame);
        box.appendChild(stage);

        wrap.appendChild(box);
        /* Click on the backdrop closes, click inside does not. */
        wrap.addEventListener('click', function (e) { if (e.target === wrap) closeMatView(); });
        document.body.appendChild(wrap);
        document.addEventListener('keydown', matViewKey, true);
        matView = wrap;
    }

    // YouTube runs in the shared player the labs use — same frame-over-the-page
    // feeling as the material viewer, loaded on demand (js/video-lightbox.js,
    // one folder up from the svp root).
    function openVideo(url, label) {
        const play = function () {
            if (window.VideoLightbox) window.VideoLightbox.open(url, { title: label || 'Video' });
            else openMatWindow(url);                 /* loading failed: plain window */
        };
        if (window.VideoLightbox) { play(); return; }
        const me = document.currentScript ||
            Array.prototype.slice.call(document.getElementsByTagName('script'))
                .filter(function (t) { return /svp-plan\.js/.test(t.src); }).pop();
        const sc = document.createElement('script');
        sc.src = new URL('../js/video-lightbox.js', (me && me.src) || location.href).href;
        sc.onload = play;
        sc.onerror = function () { openMatWindow(url); };
        document.head.appendChild(sc);
    }

    function openMat(url, label) {
        if (matKind(url, label) === 'yt') openVideo(url, label);
        else if (matEmbeddable(url)) openMatView(url, label);
        else openMatWindow(url);
    }

    function renderMaterial(el, text, ref, skip) {
        text = text == null ? '' : String(text).trim();
        el.dataset.src = text;
        el.textContent = '';
        const entries = P.parseMat(text);
        if (!entries.length) { el.textContent = text; return; }
        entries.sort(function (a, b) { return matRang(a) - matRang(b); });
        entries.forEach(function (en) {
            if (skip && skip(en)) return;   /* drawn elsewhere (Aufgaben-Pille) */
            const label = en.label;
            const a = document.createElement('a');
            /* Der Abgabe-Knopf oeffnet IMMER einen echten Tab: der Upload
               braucht das volle SharePoint-Fenster, das kleine Material-
               Fenster (openMat) kann das nicht. */
            if (isUploadEntry(en)) {
                a.className = 'badge mat-upload';
                a.href = siteHref(en.url);
                a.target = '_blank';
                a.rel = 'noopener';
                a.title = 'Dateien hochladen — oeffnet OneDrive';
                const ico = document.createElement('span');
                ico.className = 'mat-upload-ico';
                ico.textContent = '\u2191';
                ico.setAttribute('aria-hidden', 'true');
                a.appendChild(ico);
                a.appendChild(matLabelEl(label));
                if (en.desc) wireMatTip(a, en.desc);
                /* Dasselbe ✕ wie an jeder Pille - eigener Wrapper, damit der
                   Knopf im Bearbeiten-Modus genauso entfernbar ist. */
                if (ref && P.CAN_EDIT_MAT) {
                    const wrapU = document.createElement('span');
                    wrapU.className = 'mat-pill-wrap';
                    const urlU = en.url;
                    const xU = document.createElement('button');
                    xU.type = 'button';
                    xU.className = 'mat-x';
                    xU.textContent = '✕';
                    xU.title = 'Abgabe-Knopf entfernen';
                    xU.setAttribute('aria-label', 'Abgabe-Knopf entfernen: ' + (label || urlU));
                    xU.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        P.removeMatEntry(ref, urlU);
                    });
                    wrapU.appendChild(a);
                    wrapU.appendChild(xU);
                    el.appendChild(wrapU);
                    return;
                }
                el.appendChild(a);
                return;
            }
            /* Wichtiges wird orange (Doc, 22.09.2026) - die Marke [[wichtig]]
               steht im Materialtext, die Farbe kommt aus svp-material.css. */
            a.className = 'badge b-green mat-pill' + (en.wichtig ? ' mat-wichtig' : '');
            a.href = siteHref(en.url);
            a.target = '_blank';
            a.rel = 'noopener';
            a.appendChild(matIconEl(en.url, label));
            a.appendChild(matLabelEl(label || matDefaultLabel(en.url)));
            /* Plain left click: own window. Cmd-/middle click keeps the
               browser's own behaviour (new tab with the untouched URL). */
            a.addEventListener('click', function (e) {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                openMat(en.url, label);
            });
            if (en.desc) wireMatTip(a, en.desc); /* pretty tooltip, no raw URL */
            else a.title = en.url;
            /* Owner: every pill carries its own ✕. Deliberately NOT tied to
               the edit mode — there the cell holds the raw text, and hunting
               a single URL in that string is no fun. */
            if (ref && P.CAN_EDIT_MAT) {
                const wrap = document.createElement('span');
                wrap.className = 'mat-pill-wrap';
                const url = en.url;
                const x = document.createElement('button');
                x.type = 'button';
                x.className = 'mat-x';
                x.textContent = '✕';
                x.title = 'Link entfernen';
                x.setAttribute('aria-label', 'Link entfernen: ' + (label || url));
                x.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    P.removeMatEntry(ref, url);
                });
                /* Single pill actions live in a context menu: right-click on
                   the desktop, long press on a tablet. Wired for the owner in
                   both modes (Doc, 09.09.2026) - outside the edit mode it is the
                   short list, and the browser's own menu never shows. Visitors
                   are not wired at all and keep the browser menu. */
                P.wirePillMenu(a, ref, url, label, en.datei);
                P.wirePillTouch(a, ref, en, true);
                wrap.appendChild(a);
                wrap.appendChild(x);
                el.appendChild(wrap);
                return;
            }
            P.wirePillTouch(a, null, en, false);
            el.appendChild(a);
        });
        const tail = P.matTail(text);
        if (tail) {
            const note = document.createElement('span');
            note.className = 'mat-note';
            note.textContent = tail;
            el.appendChild(note);
        }
    }

    // --- Description tooltip -------------------------------------------
    // The native title is tiny and would show the URL as well; this one shows
    // only the description, larger, in the panel look of the context menu.
    P.matTip = null;
    P.pillMenu = null;   /* hier oben, damit showMatTip es ohne TDZ lesen kann */
    function hideMatTip() {
        if (P.matTip) { P.matTip.remove(); P.matTip = null; }
    }
    function showMatTip(anchor, text, key) {
        if (P.pillMenu) return;  /* bei offenem Kontextmenue keine Beschreibung darueber */
        hideMatTip();
        const tip = document.createElement('div');
        tip.className = 'mat-tip';
        tip.dataset.for = key || '';
        tip.textContent = text;
        document.body.appendChild(tip);
        const r = anchor.getBoundingClientRect();
        const t = tip.getBoundingClientRect();
        let left = r.left + r.width / 2 - t.width / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - t.width - 8));
        let top = r.bottom + 8;
        if (top + t.height > window.innerHeight - 8) top = r.top - t.height - 8;
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        P.matTip = tip;
    }
    function wireMatTip(a, text) {
        a.addEventListener('mouseenter', function () { showMatTip(a, text); });
        a.addEventListener('mouseleave', hideMatTip);
        a.addEventListener('focus', function () { showMatTip(a, text); });
        a.addEventListener('blur', hideMatTip);
    }
    window.addEventListener('scroll', hideMatTip, true);
    document.addEventListener('touchstart', function (e) {
        if (P.matTip && !(e.target.closest && e.target.closest('.mat-pill'))) hideMatTip();
    }, { passive: true });
});
