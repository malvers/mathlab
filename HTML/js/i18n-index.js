/**
 * i18n extension for Index/Dashboard page — LOADER.
 * The dictionaries live in one file per language (i18n-index-<lang>.js);
 * this loader document.writes ONLY the active language's file, saving ~90%
 * of the old 9-in-1 bundle (156 KB) on every index/tools page view.
 * Language switching always reloads the page (see CyberUI.cycleCyberLabLang),
 * so a single language per page load is sufficient.
 * Must load AFTER i18n.js (which resolves CyberI18n.current).
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index.js");
        return;
    }
    var lang = CyberI18n.current || 'de';
    // Derive the path prefix from this script's own src so subdirectory pages work too.
    var src = document.currentScript && document.currentScript.src;
    var base = src ? src.replace(/i18n-index\.js.*$/, '') : 'js/';
    /* eslint-disable-next-line no-document-write -- synchronous by design: inline scripts
       further down the page read translations at parse time, so the dict must block. */
    document.write('<script src="' + base + 'i18n-index-' + lang + '.js"><\/script>');
})();
