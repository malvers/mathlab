/**
 * Shared coach box behaviour for every lab that uses #math-coach-box.
 *
 * The box floats over the canvas and can cover the artwork, so its title row
 * doubles as a collapse handle. The open/closed state is remembered per page
 * in localStorage — the lab opens the way it was left.
 *
 * Styling lives in lab-shell-minimal.css (.coach-title, .coach-toggle,
 * #math-coach-box.collapsed).
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

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
    else install();
    // Labs that build their coach box later still get the handle.
    window.addEventListener('load', install);
})();
