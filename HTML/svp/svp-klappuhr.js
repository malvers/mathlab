/* Klappuhr in the school-year box (Doc, 01.10.2026). svp-nav.js builds the
   empty .ny-datum / .ny-uhr columns and loads the shared widget
   (js/klappuhr.js) and then this file; here the cards are mounted and the
   box decides whether they fit beside the title. Colours and sizes in the
   box: svp-klappuhr.css. */
(function () {
    const year = document.querySelector('.nav-year');
    const datum = year && year.querySelector('.ny-datum');
    const uhr = year && year.querySelector('.ny-uhr');
    const mitte = year && year.querySelector('.ny-mitte');
    if (!datum || !uhr || !mitte || !window.Klappuhr) return;

    // The cards are the shared widget (js/klappuhr.js, loaded first by
    // svp-nav.js); this file only places them in the box.
    Klappuhr.mount(datum, 'datumkurz');
    Klappuhr.mount(uhr, 'uhrzehn');

    /* Doc, 01.10.2026: "Macht die auf, wenn man oben im Stoffverteilungsplan
       entweder auf Datum oder die Uhr klickt" - date and clock open the big
       clock page (klappuhr.html) in a new tab, the plan stays open. */
    const gross = new URL('../klappuhr.html', document.currentScript.src).href;
    [datum, uhr].forEach(function (e) {
        e.setAttribute('role', 'link');
        e.tabIndex = 0;
        e.addEventListener('click', () => window.open(gross, '_blank'));
        e.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') window.open(gross, '_blank');
        });
    });

    /* Wide box: date | title | clock in one row. Too narrow for that (the
       title on one line plus the wider flap group on both sides): .ny-eng puts
       the flaps in a row under the title. Measured, not a fixed breakpoint -
       the title width depends on the font and on the viewport. */
    let breite = -1;
    function passe() {
        const w = year.clientWidth;
        if (!w) return;                       // box hidden on this page
        year.classList.remove('ny-eng');
        year.classList.add('ny-messen');
        const cs = getComputedStyle(year);
        const innen = w - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const gap = parseFloat(cs.columnGap) || 0;
        const seite = Math.max(datum.offsetWidth, uhr.offsetWidth);
        const passt = mitte.offsetWidth + 2 * (seite + gap) <= innen;
        year.classList.remove('ny-messen');
        year.classList.toggle('ny-eng', !passt);
    }
    if (window.ResizeObserver) {
        new ResizeObserver(function () {
            if (year.clientWidth === breite) return;
            breite = year.clientWidth;
            passe();
        }).observe(year);
    }
    passe();
    // Orbitron may arrive after the first measurement and widens the title.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(passe);
})();
