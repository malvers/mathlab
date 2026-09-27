// Loads a classic script, as a promise: await ladeSkript('js/vendor/supabase.min.js').
// Refactor audit 27.09.2026 (Doc's step 5): the same six lines lived in buzzer.js, vorrechnen-tafel.js,
// decks/tafel.html, cv.html and svp/notes.html (as loadScript). One copy now. It is a plain global, so its
// <script> tag has to come before the scripts that call it. decks/deck-ink.js keeps its own loadScript: the
// generated decks load it on their own, without this file.
function ladeSkript(src) {
    return new Promise(function (ok, fehler) {
        const s = document.createElement('script');
        s.src = src;
        s.onload = ok;
        s.onerror = function () { fehler(new Error(src + ' fehlt')); };
        document.head.appendChild(s);
    });
}
window.ladeSkript = ladeSkript;
