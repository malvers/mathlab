// "The Making of" opens its deck at once in fullscreen (Doc, 03.11.2026: "sofort, wenn man auf die Karte bei Büchern The
// Making of [klickt], soll das bitte sofort im Fullscreen-Modus kommen").
//
// A browser grants fullscreen only inside the click itself - on a new page it is gone. So the deck comes in a frame over
// this page, and the frame goes fullscreen in the same click; leaving the fullscreen (Esc) closes it, and the page stands
// where it was. Without element fullscreen (iPhone Safari), or with Cmd/Ctrl/Shift/Alt or the middle button, the link
// opens as before. Used by index.html (books view, a.book-kino) and the book title pages (a.b-kino); decks/deck.js counts
// the frame's fullscreen as its own (fsHost), so its play button and F do not ask for a second one.
(function () {
    const LINKS = 'a.b-kino, a.book-kino';
    const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
    document.addEventListener('click', function (e) {
        const a = e.target.closest && e.target.closest(LINKS);
        if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const box = document.createElement('div');
        const req = box.requestFullscreen || box.webkitRequestFullscreen;
        if (!req) return;
        e.preventDefault();
        box.className = 'deck-fullscreen';
        box.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#071630';   // the deck's --night
        const f = document.createElement('iframe');
        f.allow = 'fullscreen; autoplay; microphone';
        f.style.cssText = 'display:block;width:100%;height:100%;border:0';
        // always on the title slide with its play button, not where the tab stood last time
        const url = new URL(a.href, location.href);
        url.hash = '1';
        f.src = url.href;
        f.addEventListener('load', function () { try { f.contentWindow.focus(); } catch (err) { } });   // arrows go to the deck
        box.appendChild(f);
        document.body.appendChild(box);
        const close = function () {
            if (fsEl()) return;
            box.remove();
            ['fullscreenchange', 'webkitfullscreenchange'].forEach(t => document.removeEventListener(t, close));
        };
        ['fullscreenchange', 'webkitfullscreenchange'].forEach(t => document.addEventListener(t, close));
        // refused (a browser setting): the link as before
        Promise.resolve(req.call(box)).catch(function () { box.remove(); location.href = a.href; });
    });
})();
