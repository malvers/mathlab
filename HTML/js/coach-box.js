/**
 * Shared coach box behaviour for every lab that uses #math-coach-box.
 *
 * The box floats over the canvas and can cover the artwork, so its title row
 * doubles as a collapse handle. The open/closed state is remembered per page
 * in localStorage — the lab opens the way it was left.
 *
 * Styling lives in lab-shell-minimal.css (.coach-title, .coach-toggle,
 * #math-coach-box.collapsed).
 *
 * Opt-in per lab, as attributes on #math-coach-box:
 *   data-scroll  the box never grows past the stage; a long text scrolls inside
 *   data-copy    a copy button in the title row puts the text on the clipboard -
 *                box.copyText = () => '...' lets the lab hand over a text of its own
 *                (Doc, 18.10.2026, Politik-Arena: "einen Kopierbutton ... irgendwo hinschicken")
 */
(function () {
    const KEY = 'coach-collapsed:' + location.pathname;

    function read() {
        try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }

    function write(v) {
        try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* private mode */ }
    }

    function install() {
        const box = document.getElementById('math-coach-box');
        const title = box && box.querySelector('.coach-title');
        if (!box || !title || box.dataset.collapsible === '1') return;
        box.dataset.collapsible = '1';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'coach-toggle';
        btn.setAttribute('aria-controls', 'coach-content');
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"' +
            ' stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
        title.appendChild(btn);
        if (box.hasAttribute('data-copy')) addCopy(box, title, btn);

        const apply = (collapsed) => {
            box.classList.toggle('collapsed', collapsed);
            btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            btn.title = collapsed ? 'Hinweis aufklappen' : 'Hinweis einklappen';
            btn.setAttribute('aria-label', btn.title);
        };

        const toggle = () => { const c = !box.classList.contains('collapsed'); apply(c); write(c); };
        title.addEventListener('click', toggle);
        btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

        apply(read());
    }

    const COPY_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"' +
        ' stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/>' +
        '<path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    const DONE_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6"' +
        ' stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>';

    function addCopy(box, title, before) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'coach-copy';
        btn.title = 'Text kopieren';
        btn.setAttribute('aria-label', btn.title);
        btn.innerHTML = COPY_ICON;
        title.insertBefore(btn, before);
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const content = document.getElementById('coach-content');
            const text = typeof box.copyText === 'function' ? box.copyText() : (content ? content.innerText : '');
            let ok = false;
            try { await navigator.clipboard.writeText(text); ok = true; } catch (err) {
                // no clipboard API (plain http on another host): the old way
                const ta = document.createElement('textarea');
                ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select();
                try { ok = document.execCommand('copy'); } catch (x) { ok = false; }
                ta.remove();
            }
            if (window.DebugWindow) DebugWindow.log('[coach] copy ' + (ok ? 'ok' : 'failed') + ', ' + text.length + ' chars');
            btn.innerHTML = ok ? DONE_ICON : COPY_ICON;
            btn.title = ok ? 'Kopiert' : 'Kopieren hat nicht geklappt';
            setTimeout(() => { btn.innerHTML = COPY_ICON; btn.title = 'Text kopieren'; }, 1400);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
    else install();
    // Labs that build their coach box later still get the handle.
    window.addEventListener('load', install);
})();
