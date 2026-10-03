/* A page inside a live tour ONLINE (docalvers.de, js/cyber-tour.js): the tour answers this page's database calls
 * from a pretend class in the browser (js/quiz-demo-backend.js) - nothing reaches the real database, and every
 * visitor has a class of their own. Anywhere else (the page on its own, in a deck, in the local tour with its
 * server) this does nothing. It has to be the page's FIRST script: every fetch after it goes through the tour.
 *
 * A backend that hands out storage (storageFor, js/buzzer-demo-backend.js - the Vorrechnen tour, 03.10.2026) gives
 * the page a storage of its own in memory, before any other script reads one: online the tour runs on docalvers.de,
 * the very origin of Doc's real board (its working, the buzzer's log for the Wiederholung, Solita's password), and
 * none of that may be read or written by a tour. js/cyber-tour.js keeps it (window.__tourStorage).
 */
(function () {
    try {
        var p = window.parent;
        if (p === window || !p.__tourBackend) return;
        window.fetch = p.__tourBackend.fetchFor(window);
        if (typeof p.__tourBackend.storageFor === 'function') {
            var st = p.__tourBackend.storageFor(window);
            Object.defineProperty(window, 'localStorage', { configurable: true, value: st.local });
            Object.defineProperty(window, 'sessionStorage', { configurable: true, value: st.session });
            window.__tourStorage = true;
        }
    } catch (e) { /* not in a tour, or a parent of another origin */ }
})();
