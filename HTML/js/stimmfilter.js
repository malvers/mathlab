/**
 * Stimmfilter - CMA-ES searches the EQ that gives the voice clone Doc's timbre.
 *
 * Doc, 24.09.2026: "CMAES optimiert die Filter bis Identität". The target comes from
 * tools/stimmvergleich.py (ziel.json): per text pair, Doc's long-term spectrum minus the clone's,
 * in third octaves, weighted 1/f so every octave counts the same, flat below 350 Hz (pitch, not
 * timbre). Several pairs let the page train on some texts and test on the others. A filter adds H(f) to the clone;
 * the cost is the weighted RMS of what is left, with one free overall offset (loudness).
 *
 * The chain is two shelves and four bell filters - 16 numbers, few enough for CMA-ES and a
 * chain ffmpeg can play one to one (js/eq-biquad.js). Every parameter lives in (-inf, inf) and
 * is squashed into its range with a logistic curve, so CMA-ES needs no box constraints; the
 * start point is "no filter at all": every gain at 0 dB.
 *
 * Uses the central CMA-ES (js/cmaes-logic.js), the same one cmaes, irisvis and neuroaddierer run.
 */
const Stimmfilter = (() => {
    const CMA = (typeof CMAES !== 'undefined') ? CMAES : require('./cmaes-logic.js').CMAES;
    const EQ = (typeof EQBiquad !== 'undefined') ? EQBiquad : require('./eq-biquad.js');

    const sig = x => 1 / (1 + Math.exp(-x));
    const logit = u => Math.log(u / (1 - u));
    const logab = (u, a, b) => a * Math.pow(b / a, u);
    const invLog = (v, a, b) => logit(Math.log(v / a) / Math.log(b / a));
    const lin = (u, a, b) => a + (b - a) * u;

    const G = 12;                       // +-dB any single filter may do
    const GLOCKEN = [250, 800, 2500, 7000];   // where the four bells start - spread, or CMA-ES has to untangle them first
    const STRAFE = 0.0005;              // tiny: keeps two filters from cancelling each other out for nothing
    // The free offset makes "lift everything by 7 dB" cost nothing in the arithmetic - but on the
    // real recording it clips (the clone already peaks at -1.9 dB). The filter should change the
    // SHAPE, not the loudness: its weighted mean lift is penalised, and whatever remains is paid
    // back by a volume stage at the end of the ffmpeg chain.
    const MITTEL_STRAFE = 0.02;

    /** 16 free numbers -> the filter chain. */
    function dekodiere(x) {
        const u = x.map(sig), kette = [
            { typ: 'lowshelf', f: logab(u[0], 60, 600), g: lin(u[1], -G, G), q: 0.707 },
            { typ: 'highshelf', f: logab(u[2], 1500, 11000), g: lin(u[3], -G, G), q: 0.707 },
        ];
        for (let k = 0; k < 4; k++) {
            kette.push({ typ: 'peaking', f: logab(u[4 + 3 * k], 100, 11000), g: lin(u[5 + 3 * k], -G, G),
                q: logab(u[6 + 3 * k], 0.4, 4) });
        }
        return kette;
    }

    /** Where the search begins: every gain 0 dB - the unfiltered clone. */
    function start() {
        const x = [invLog(150, 60, 600), 0, invLog(5000, 1500, 11000), 0];
        for (const f of GLOCKEN) x.push(invLog(f, 100, 11000), 0, invLog(1, 0.4, 4));
        return x;
    }

    /** { rms: what is left of the timbre gap in dB, f: that plus the small penalty, c: offset } */
    function bewerte(x, ziel) {
        const kette = dekodiere(x);
        const H = EQ.kurve(kette, ziel.freq, ziel.sr);
        let sg = 0, sr = 0;
        for (let i = 0; i < H.length; i++) { const g = ziel.gewicht[i]; sg += g; sr += g * (ziel.ziel[i] - H[i]); }
        const c = sr / sg;
        let e = 0;
        for (let i = 0; i < H.length; i++) { const r = ziel.ziel[i] - H[i] - c; e += ziel.gewicht[i] * r * r; }
        const rms = Math.sqrt(e / sg);
        let strafe = 0, mittel = 0;
        for (const fl of kette) strafe += fl.g * fl.g;
        for (let i = 0; i < H.length; i++) mittel += ziel.gewicht[i] * H[i];
        mittel /= sg;
        return { rms, f: rms + STRAFE * strafe + MITTEL_STRAFE * mittel * mittel, c, mittel, kette, H };
    }

    /** One search run; call schritt() once per generation (the page does it in a timer, a
     *  test in a plain loop). */
    class Suche {
        constructor(ziel, sigma = 0.8) {
            this.ziel = ziel;
            this.es = new CMA(start(), sigma);
            this.gen = 0;
            this.verlauf = [];
            this.best = bewerte(start(), ziel);
            this.anfang = this.best.rms;
        }
        schritt() {
            const X = this.es.ask();
            const B = X.map(x => bewerte(x, this.ziel));
            this.es.tell(X, B.map(b => b.f));
            this.gen++;
            for (const b of B) if (b.f < this.best.f) this.best = b;
            this.verlauf.push(this.best.rms);
            return this.best;
        }
        fertig() { return !!this.es.stop(); }
    }

    /** The target for a set of text pairs: their curves averaged, longer readings weighing more.
     *  One pair = train or test on exactly that text. */
    function zielFuer(daten, ids, art = 'ziel') {
        const n = daten.freq.length, z = new Float64Array(n);
        let summe = 0;
        for (const id of ids) {
            const p = daten.paare[id], w = p.dauer_doc_s;
            for (let i = 0; i < n; i++) z[i] += w * p[art][i];
            summe += w;
        }
        for (let i = 0; i < n; i++) z[i] /= summe;
        return { sr: daten.sr, freq: daten.freq, gewicht: daten.gewicht, ziel: z };
    }

    /** The chain for ffmpeg, with the mean lift paid back so the result cannot clip. */
    function ffmpegKette(best) {
        return EQ.ffmpegKette(best.kette) + ',volume=' + (-best.mittel).toFixed(2) + 'dB';
    }

    return { dekodiere, start, bewerte, Suche, zielFuer, ffmpegKette };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Stimmfilter;
