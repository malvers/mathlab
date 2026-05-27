// Reusable fixed-box clock (HH:MM:SS) — each digit gets its own fixed-width slot so the
// displayed time never shifts horizontally as it ticks. DOM-based; pairs with cyber-clock.css.
//
// Usage:
//   CyberClock.mount(el, { size:'1.3rem', digitColor:'#fff', colonColor:'#00d2ff', seconds:true });
//   CyberClock.set(el, '12:03:30');          // any string; non-digits are ignored
(function () {
    function mount(el, opts) {
        opts = opts || {};
        el.classList.add('cyber-clock');
        if (opts.size)       el.style.setProperty('--cc-size', opts.size);
        if (opts.digitColor) el.style.setProperty('--cc-digit', opts.digitColor);
        if (opts.colonColor) el.style.setProperty('--cc-colon', opts.colonColor);
        // group count: HH:MM (2), HH:MM:SS (3, default), or DD:HH:MM:SS (4, opts.days)
        const groups = opts.days ? 4 : (opts.seconds === false) ? 2 : 3;
        let html = '';
        for (let g = 0; g < groups; g++) {
            if (g > 0) html += '<span class="cc-sep">:</span>';
            html += '<span class="cc-d"></span><span class="cc-d"></span>';
        }
        el.innerHTML = html;
        el._ccDigits = el.querySelectorAll('.cc-d');              // cache for cheap updates
        return el;
    }
    function set(el, time) {
        const boxes = (el && el._ccDigits) || (el && el.querySelectorAll('.cc-d'));
        if (!boxes) return;
        const digits = String(time).replace(/\D/g, '');
        for (let i = 0; i < boxes.length; i++) boxes[i].textContent = digits[i] || '0';
    }
    window.CyberClock = { mount: mount, set: set };
})();
