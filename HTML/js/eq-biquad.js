/**
 * Parametric EQ from biquads - frequency response and the matching ffmpeg filter chain.
 *
 * The coefficients are Robert Bristow-Johnson's Audio EQ Cookbook, which is exactly what ffmpeg's
 * `equalizer`, `lowshelf` and `highshelf` filters compute (libavfilter/af_biquads.c, width given as
 * a Q factor). So a curve drawn or optimised here is the curve ffmpeg will actually play - which
 * is the whole point: the stimmklon page searches a filter with CMA-ES in the browser, and the
 * server then applies it to the real recording with ffmpeg.
 *
 * A filter is { typ: 'peaking' | 'lowshelf' | 'highshelf', f: Hz, g: dB, q: Q }.
 */
const EQBiquad = (() => {
    function koeff(fl, sr) {
        const A = Math.pow(10, fl.g / 40);
        const w0 = 2 * Math.PI * fl.f / sr;
        const cw = Math.cos(w0), sw = Math.sin(w0);
        const al = sw / (2 * fl.q);
        if (fl.typ === 'peaking') {
            return [1 + al * A, -2 * cw, 1 - al * A, 1 + al / A, -2 * cw, 1 - al / A];
        }
        const sA = 2 * Math.sqrt(A) * al;
        if (fl.typ === 'lowshelf') {
            return [A * ((A + 1) - (A - 1) * cw + sA), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - sA),
                (A + 1) + (A - 1) * cw + sA, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - sA];
        }
        if (fl.typ === 'highshelf') {
            return [A * ((A + 1) + (A - 1) * cw + sA), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - sA),
                (A + 1) - (A - 1) * cw + sA, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - sA];
        }
        throw new Error('unbekannter Filtertyp: ' + fl.typ);
    }

    // |H(e^jw)|^2 in dB for one biquad at one frequency
    function dB(k, f, sr) {
        const w = 2 * Math.PI * f / sr, c1 = Math.cos(w), s1 = Math.sin(w), c2 = Math.cos(2 * w), s2 = Math.sin(2 * w);
        const nr = k[0] + k[1] * c1 + k[2] * c2, ni = k[1] * s1 + k[2] * s2;
        const dr = k[3] + k[4] * c1 + k[5] * c2, di = k[4] * s1 + k[5] * s2;
        return 10 * Math.log10((nr * nr + ni * ni) / (dr * dr + di * di));
    }

    /** Response of a whole chain, in dB, at the given frequencies. */
    function kurve(filter, freqs, sr) {
        const out = new Float64Array(freqs.length);
        for (const fl of filter) {
            const k = koeff(fl, sr);
            for (let i = 0; i < freqs.length; i++) out[i] += dB(k, freqs[i], sr);
        }
        return out;
    }

    /** The same chain as an ffmpeg -af string. Numbers only - built here, never taken from text. */
    function ffmpegKette(filter) {
        const n = (x, d) => Number(x).toFixed(d);
        return filter.map(fl => {
            const name = fl.typ === 'peaking' ? 'equalizer' : fl.typ;
            return name + '=f=' + n(fl.f, 1) + ':t=q:w=' + n(fl.q, 4) + ':g=' + n(fl.g, 3);
        }).join(',');
    }

    return { koeff, dB, kurve, ffmpegKette };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = EQBiquad;
