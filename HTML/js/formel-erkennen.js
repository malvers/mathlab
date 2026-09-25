// Recognising one handwritten line, and laying the result onto the strokes.
//
// The split of work is the whole point. Gemini answers WHAT is written; it does
// NOT answer WHERE — its bounding boxes were unreliable, which is what sank the
// earlier attempt in morpheus/ (see the note at the top of gemini-ocr.js). The
// WHERE comes from the strokes themselves (js/stroke-symbols.js), which know
// their own position and the order they were drawn in.
//
// So both sides produce a list in reading order: the symbols from the pen, the
// tokens from the model. Matching them is then an alignment of two lists, not a
// guess — and it costs no extra API call.
//
// The key below is Supabase's PUBLISHABLE anon key. It is client-safe by design
// and already public in this repo; the actual Gemini key lives server-side as a
// secret inside the edge function and never reaches the browser.

(function (root) {
    'use strict';

    const PROXY_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/gemini';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';

    // Same wording as equationocr.html: visible ink only, in reading order, and
    // explicitly no bounding boxes - we do not want them and would not trust them.
    const PROMPT =
        'This image shows a single printed or handwritten mathematical equation.\n\n' +
        'Return strict JSON, no markdown, no commentary:\n' +
        '{\n  "latex": "<full equation as LaTeX, no $ or \\\\( delimiters>",\n' +
        '  "tokens": [ "<LaTeX of single glyph>", ... ]\n}\n\n' +
        'RULES:\n' +
        '- tokens lists every VISIBLE INK glyph (letter, digit, operator like +/-/=/*, bracket, dot, accent, radical, integral, sum, Greek letter), in reading order.\n' +
        '- INCLUDE visible LaTeX commands that produce ink: \\\\sqrt, \\\\sum, \\\\int, \\\\frac (counts as one token — the fraction bar), \\\\pi, \\\\alpha, \\\\beta, etc.\n' +
        "- EXCLUDE LaTeX *structural* characters that produce NO ink: '^', '_', '{', '}', whitespace.\n" +
        '- Example: "E=mc^2" → tokens = ["E", "=", "m", "c", "2"].\n' +
        '- Example: "\\\\sqrt{x}+1" → tokens = ["\\\\sqrt", "x", "+", "1"].\n' +
        '- No bounding boxes. Just the labels.\n' +
        '- If empty/unreadable: { "latex": "(empty)", "tokens": [] }';

    // Render just the ink of these strokes, black on white, with a margin. The
    // page's own overlay (boxes, row bands, numbers) must not reach the model -
    // it would read the dashes as minus signs.
    function inkCanvas(strokes, idxs, opts) {
        const o = Object.assign({ margin: 24, maxSide: 1400 }, opts || {});
        const pts = [];
        idxs.forEach(i => { const s = strokes[i]; if (s) pts.push(...s.points); });
        if (!pts.length) return null;

        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const p of pts) {
            if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y;
            if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y;
        }
        const w = (x1 - x0) + o.margin * 2;
        const h = (y1 - y0) + o.margin * 2;
        // Scale down only if huge; upscaling adds nothing for OCR.
        const scale = Math.min(1, o.maxSide / Math.max(w, h));

        const c = document.createElement('canvas');
        c.width = Math.max(8, Math.round(w * scale));
        c.height = Math.max(8, Math.round(h * scale));
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.strokeStyle = '#000000';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        idxs.forEach(i => {
            const s = strokes[i];
            if (!s || s.points.length < 2) return;
            ctx.beginPath();
            s.points.forEach((p, k) => {
                const X = (p.x - x0 + o.margin) * scale, Y = (p.y - y0 + o.margin) * scale;
                k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
            });
            ctx.lineWidth = Math.max(1.5, (s.width || 3) * scale);
            ctx.stroke();
        });
        return c;
    }

    function unwrapLatex(s) {
        if (!s) return s;
        let t = String(s).trim();
        t = t.replace(/^\$\$?|\$\$?$/g, '').trim();
        t = t.replace(/^\\\[|\\\]$/g, '').replace(/^\\\(|\\\)$/g, '').trim();
        return t;
    }

    // One call per line. Returns { ok, latex, tokens, error, ms }.
    async function erkenneZeile(strokes, strokeIdxs, o) {
        const opts = Object.assign({ model: 'gemini-2.5-flash', thinking: false }, o || {});
        const c = inkCanvas(strokes, strokeIdxs);
        if (!c) return { ok: false, latex: '', tokens: [], error: 'keine Striche' };

        const b64 = c.toDataURL('image/png').split(',', 2)[1];
        const generationConfig = { temperature: 0, responseMimeType: 'application/json' };
        if (!opts.thinking) generationConfig.thinkingConfig = { thinkingBudget: 0 };

        const t0 = performance.now();
        let res, text;
        try {
            res = await fetch(PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON },
                body: JSON.stringify({
                    model: opts.model,
                    body: {
                        contents: [{ parts: [{ text: PROMPT }, { inlineData: { mimeType: 'image/png', data: b64 } }] }],
                        generationConfig,
                    },
                }),
            });
            text = await res.text();
        } catch (e) {
            return { ok: false, latex: '', tokens: [], error: 'Netz: ' + e.message, ms: Math.round(performance.now() - t0) };
        }
        const ms = Math.round(performance.now() - t0);

        let data;
        try { data = JSON.parse(text); }
        catch { return { ok: false, latex: '', tokens: [], error: `kein JSON (HTTP ${res.status})`, ms }; }
        if (!res.ok) return { ok: false, latex: '', tokens: [], error: data?.error?.message || ('HTTP ' + res.status), ms };

        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        let latex = '', tokens = [];
        try {
            const p = JSON.parse(raw);
            latex = unwrapLatex(p?.latex || '');
            tokens = Array.isArray(p?.tokens) ? p.tokens.map(t => String(t)) : [];
        } catch {
            latex = unwrapLatex(raw);                    // model ignored the schema
        }
        return { ok: true, latex, tokens, ms, usage: data?.usageMetadata || null };
    }

    // ── Laying tokens onto symbols ──────────────────────────────────────────
    // Both lists are in reading order, so the good case is a straight 1:1 walk.
    // When the counts differ, that difference is itself the diagnosis: more
    // symbols than tokens means the pen split a glyph, fewer means two glyphs
    // were written so close together that they fused. We mark it instead of
    // silently shifting everything by one.
    function ordneZu(symbols, tokens) {
        const n = Math.min(symbols.length, tokens.length);
        const paare = [];
        for (let i = 0; i < n; i++) paare.push({ symbol: symbols[i], token: tokens[i], sicher: true });

        const rest = { symboleOhneToken: [], tokensOhneSymbol: [] };
        for (let i = n; i < symbols.length; i++) rest.symboleOhneToken.push(symbols[i]);
        for (let i = n; i < tokens.length; i++) rest.tokensOhneSymbol.push(tokens[i]);

        const diff = symbols.length - tokens.length;
        return {
            paare,
            ...rest,
            passt: diff === 0,
            diagnose: diff === 0
                ? `${n} Zeichen, eins zu eins`
                : diff > 0
                    ? `${diff} Symbol(e) mehr als Zeichen — ein Zeichen ist in Striche zerfallen`
                    : `${-diff} Zeichen mehr als Symbole — zwei Zeichen sind zu einem verschmolzen`,
        };
    }

    const api = { erkenneZeile, ordneZu, inkCanvas, unwrapLatex, PROMPT };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.FormelErkennen = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
