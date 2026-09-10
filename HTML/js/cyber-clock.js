// THE fixed-slot digits widget of the site — every digit gets its own fixed-width slot, so
// nothing shifts horizontally as values change. DOM-based; pairs with cyber-clock.css.
// Three faces, one file (Doc, 10.09.2026: no second copy anywhere):
//   CyberClock.mount(el, opts) / set(el, '12:03:30')     clock HH:MM:SS (worldclock, tracker)
//   CyberClock.mountNum(el, opts) / setNum(el, 12.5)     right-aligned stats (tracker)
//   CyberClock.digits(el, value, opts)                   anything else: lab telemetry, counters,
//                                                        score columns ("26/33"), stopwatches
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
    // ---- General DIGITS (replaces CyberUI.updateNumberWidget from the Easter holidays).
    //      `value`: a number (formatted with opts.decimals, or opts.thousands → "45.000") or a
    //      ready string ("12:05", "26/33"). Every digit gets a slot, every other glyph
    //      (: . , / - —) a separator slot. opts.minDigits pads the integer part on the LEFT
    //      with blank slots, so 7 and 1234 are the same width and a table column stands
    //      digit under digit, slash under slash. `el` may be an element or an id.
    //      Look = CSS variables (--cc-size, --cc-dw, --cc-h, --cc-sw, --cc-digit, --cc-shadow,
    //      --cc-weight): set them in the page's CSS, or per call via opts.style
    //      { size, digitWidth, height, sepWidth, color, shadow } — inline wins. The labs get
    //      their neon look centrally from cyber-lab-overrides.css. ----
    function digits(el, value, opts) {
        if (typeof el === 'string') el = document.getElementById(el);
        if (!el) return;
        opts = opts || {};
        el.classList.add('cyber-clock', 'cyber-digits');
        let s;
        if (value == null) s = '';
        else if (typeof value === 'number') {
            s = opts.thousands ? Math.floor(value).toLocaleString('de-DE')
                               : value.toFixed(opts.decimals || 0);
        } else s = String(value);
        // blank slots before the integer part — not with thousands, whose dots are separators
        let pad = 0;
        if (opts.minDigits && !opts.thousands) {
            const intDigits = s.split(/[.,]/)[0].replace(/\D/g, '').length;
            pad = Math.max(0, opts.minDigits - intDigits);
        }
        let html = '';
        for (let i = 0; i < pad; i++) html += '<span class="cc-d"></span>';
        for (const ch of s) {
            html += /[0-9]/.test(ch) ? '<span class="cc-d">' + ch + '</span>'
                : '<span class="cc-sep">' + ch.replace(/[&<>"]/g, function (c) {
                    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
                }) + '</span>';
        }
        el.innerHTML = html;
        const st = opts.style;
        if (st) {
            if (st.size)       el.style.setProperty('--cc-size', st.size);
            if (st.digitWidth) el.style.setProperty('--cc-dw', st.digitWidth);
            if (st.height)     el.style.setProperty('--cc-h', st.height);
            if (st.sepWidth)   el.style.setProperty('--cc-sw', st.sepWidth);
            if (st.color)      el.style.setProperty('--cc-digit', st.color);
            if (st.shadow)     el.style.setProperty('--cc-shadow', st.shadow);
        }
    }
    window.CyberClock = { mount: mount, set: set, mountNum: mountNum, setNum: setNum, digits: digits };
})();
