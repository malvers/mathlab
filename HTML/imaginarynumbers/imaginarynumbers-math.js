(function (global) {
    /**
     * Principal branch of √(x + iy): Re(√z) ≥ 0; for negative real axis, Im(√z) > 0.
     */
    function principalComplexSqrt(re, im) {
        const r = Math.hypot(re, im);
        if (r === 0) return { re: 0, im: 0 };
        const u = Math.sqrt((r + re) / 2);
        let v;
        if (u > 1e-12) {
            v = im / (2 * u);
        } else {
            v = (im >= 0 ? 1 : -1) * Math.sqrt((r - re) / 2);
        }
        return { re: u, im: v };
    }

    /** r aus z: Hauptwert-Wurzel oder Quadrat — für Canvas, Overlays, Sidebar. */
    function mapRFromZ(re, im, zMapMode) {
        if (zMapMode === 'square') {
            return { re: re * re - im * im, im: 2 * re * im };
        }
        return principalComplexSqrt(re, im);
    }

    function multiplyComplex(re1, im1, re2, im2) {
        return {
            re: re1 * re2 - im1 * im2,
            im: re1 * im2 + im1 * re2,
        };
    }

    /** Immer zwei Nachkommastellen (z. B. 1.00, 0.00) — für Overlays und Sidebar. */
    function fmtNum(v) {
        if (typeof v !== 'number' || !Number.isFinite(v)) return '0.00';
        const n = Math.round(v * 100) / 100;
        return n.toFixed(2);
    }

    global.ImaginaryNumbersMath = {
        principalComplexSqrt,
        mapRFromZ,
        multiplyComplex,
        fmtNum
    };
})(typeof window !== 'undefined' ? window : globalThis);
