/* A page inside a live tour ONLINE (docalvers.de, js/cyber-tour.js): the tour answers this page's database calls
 * from a pretend class in the browser (js/quiz-demo-backend.js) - nothing reaches the real database, and every
 * visitor has a class of their own. Anywhere else (the page on its own, in a deck, in the local tour with its
 * server) this does nothing. It has to be the page's FIRST script: every fetch after it goes through the tour.
 */
(function () {
    try {
        var p = window.parent;
        if (p !== window && p.__tourBackend) window.fetch = p.__tourBackend.fetchFor(window);
    } catch (e) { /* not in a tour, or a parent of another origin */ }
})();
