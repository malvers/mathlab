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
            html += '<span class="cc-d"></span><span class="cc-d"></span>'; // each digit = its own fixed slot
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
    // ---- Fixed-slot NUMBER variant (stats: KM/H, KM, HÖHE) — right-aligned, NO leading
    //      zeros (blank slots on the left), so the value never jitters as digits change.
    //      `intSlots` integer slots + an optional "." + `decimals` fractional slots. ----
    function mountNum(el, opts) {
        opts = opts || {};
        el.classList.add('cyber-clock', 'cyber-num');
        if (opts.size)       el.style.setProperty('--cc-size', opts.size);
        if (opts.digitColor) el.style.setProperty('--cc-digit', opts.digitColor);
        if (opts.font)       el.style.setProperty('--cc-font', opts.font); // e.g. 'Arial' (default Orbitron)
        const intN = opts.intSlots || 3;
        const decN = opts.decimals || 0;
        const sep  = opts.decimalSep || '.'; // decimal separator glyph (e.g. ',' for German)
        let html = '';
        for (let i = 0; i < intN; i++) html += '<span class="cc-d"></span>';
        if (decN > 0) {
            html += '<span class="cc-dot">' + sep + '</span>';
            for (let i = 0; i < decN; i++) html += '<span class="cc-d"></span>';
        }
        el.innerHTML = html;
        el._ccDigits = el.querySelectorAll('.cc-d'); // intN + decN boxes, in order
        el._ccIntN = intN;
        el._ccDecN = decN;
        return el;
    }
    function setNum(el, value) {
        const boxes = el && el._ccDigits;
        if (!boxes) return;
        const intN = el._ccIntN, decN = el._ccDecN;
        if (value == null || isNaN(value)) { for (let i = 0; i < boxes.length; i++) boxes[i].textContent = ''; return; }
        const s = Number(value).toFixed(decN);
        const dot = s.indexOf('.');
        const intPart = dot < 0 ? s : s.slice(0, dot);
        const decPart = dot < 0 ? '' : s.slice(dot + 1);
        // integer slots → fill from the right; COLLAPSE the empty leading slots (display:none)
        // so the VISIBLE number (and its label) centre in the tile — no reserved left padding,
        // no leading zeros. Same digit count = same width → still no jitter; only a count change
        // re-centres symmetrically.
        for (let i = 0; i < intN; i++) {
            const idx = intPart.length - intN + i;
            if (idx >= 0) { boxes[i].textContent = intPart[idx]; boxes[i].style.display = ''; }
            else { boxes[i].textContent = ''; boxes[i].style.display = 'none'; }
        }
        // fractional slots → left-aligned. Also restore display: a prior dash-fallback (callers that
        // hide all slots and show one '–') may have left these display:none — int slots get un-hidden
        // above, so do the same here or the decimal digit stays invisible (Doc: "33," bug, 2026-06-19).
        for (let i = 0; i < decN; i++) { boxes[intN + i].textContent = decPart[i] || '0'; boxes[intN + i].style.display = ''; }
    }
    window.CyberClock = { mount: mount, set: set, mountNum: mountNum, setNum: setNum };
})();
