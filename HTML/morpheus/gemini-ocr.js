// Gemini-API OCR module for handwritten / printed math equations.
//
// Pure logic — no DOM references except the optional input canvas. The
// equationocr.html UI (debug window, cost tracker, overlay rendering)
// stays in that file; this module owns ONLY the network call + image
// preprocessing + response parsing.
//
// Public API
// ──────────
//   geminiPrepareCanvas(canvas, scalePct)        → { canvas, dataURL, b64, w, h }
//   geminiUnwrapLatex(s)                          → string (strips $/\\(/\\[ delimiters)
//   geminiRecognize({ canvas, apiKey, model,
//                     scalePct?, prompt?, dbg? }) → Promise<Result>
//
// Result shape:
//   {
//     ok: boolean,
//     latex: string,
//     tokens: [{ label: string, box_2d: [ymin, xmin, ymax, xmax] }, ...],
//     // NOTE: tokens[].box_2d coordinates from Gemini are NOT reliable
//     //       (per project experience). Use labels only; treat boxes
//     //       as best-effort / experimental.
//     rawText: string,         // raw model response text
//     usage: object | null,    // Gemini usageMetadata (for cost-tracking)
//     status: number,          // HTTP status
//     error: string | null,    // populated when ok===false
//   }

(function () {

// Bounding boxes from Gemini were unreliable in practice — they often
// landed centered or off the actual glyph ink. We don't ask for them
// any more. Instead we request a per-glyph TOKEN LIST (just labels, no
// boxes) so we still get the character-level breakdown for matching
// against the LaTeX target — without spending tokens on bad coordinates.
const DEFAULT_PROMPT =
    "This image shows a single printed or handwritten mathematical equation.\n" +
    "\n" +
    "Return strict JSON, no markdown, no commentary:\n" +
    "{\n" +
    "  \"latex\": \"<full equation as LaTeX, no $ or \\\\( delimiters>\",\n" +
    "  \"tokens\": [ \"<LaTeX of single glyph>\", ... ]\n" +
    "}\n" +
    "\n" +
    "RULES:\n" +
    "- tokens lists every visible glyph (character, digit, operator, bracket, accent), in reading order.\n" +
    "- No bounding boxes. Just the labels.\n" +
    "- If empty/unreadable: { \"latex\": \"(empty)\", \"tokens\": [] }";

// Single-glyph prompt — used by per-object recognition where we send a
// CROP of one drawn glyph and just need its LaTeX label.
const SINGLE_GLYPH_PROMPT =
    "This image shows a single mathematical glyph (one character, digit,\n" +
    "operator, bracket, or accent — possibly multi-stroke like + = E).\n" +
    "\n" +
    "Return strict JSON, no markdown, no commentary:\n" +
    "{ \"label\": \"<LaTeX of the glyph, no $ delimiters>\" }\n" +
    "\n" +
    "If unreadable / empty: { \"label\": \"?\" }";

// Context-aware single-glyph prompt. We already know the full LaTeX of the
// equation (from a prior whole-canvas call) AND the deduplicated token
// list. Forcing the model to pick from that exact list closes the door
// on hallucinations like "a"→"g".
function singleGlyphContextualPrompt(fullLatex, tokens) {
    const safeEq = String(fullLatex || '').replace(/"/g, '\\"').slice(0, 200);
    // Build the allowed-label list (deduped, in reading order, as JSON-safe
    // strings so the model sees brackets/backslashes clearly).
    const list = Array.isArray(tokens) ? tokens : [];
    const seen = new Set();
    const uniq = [];
    for (const t of list) {
        const s = String(t || '').trim();
        if (!s || seen.has(s)) continue;
        seen.add(s); uniq.push(s);
    }
    const allowedJson = '[' + uniq.map(s => JSON.stringify(s)).join(', ') + ']';
    return (
        "This image shows ONE single glyph from a known LaTeX equation.\n" +
        "\n" +
        `Full equation: ${safeEq}\n` +
        `Allowed labels (you MUST return exactly one of these): ${allowedJson}\n` +
        "\n" +
        "Return strict JSON, no markdown, no commentary:\n" +
        "{ \"label\": \"<one entry from the allowed list>\" }\n" +
        "\n" +
        "Rules:\n" +
        "- The label MUST be a verbatim entry from the allowed list above — no other strings.\n" +
        "- Do NOT invent characters. If unclear, pick the closest match from the list.\n" +
        "- Only if nothing in the list is even remotely plausible: { \"label\": \"?\" }"
    );
}

// Crop a rectangle of a source canvas onto a fresh canvas with optional
// padding (px) added on every side. Background filled white so the OCR
// preprocessing in geminiPrepareCanvas() sees a clean binary image.
function geminiCropCanvas(srcCanvas, bbox, padding) {
    const pad = (typeof padding === 'number') ? padding : 0;
    const sx = Math.max(0, Math.floor(bbox.x - pad));
    const sy = Math.max(0, Math.floor(bbox.y - pad));
    const sw = Math.min(srcCanvas.width  - sx, Math.ceil(bbox.w + pad * 2));
    const sh = Math.min(srcCanvas.height - sy, Math.ceil(bbox.h + pad * 2));
    const out = document.createElement('canvas');
    out.width = Math.max(1, sw);
    out.height = Math.max(1, sh);
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(srcCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
    return out;
}

// Strip LaTeX math delimiters that Gemini sometimes wraps around the output.
function geminiUnwrapLatex(latex) {
    if (!latex) return latex;
    const s = String(latex).trim();
    if (s.startsWith('$$') && s.endsWith('$$')) return s.slice(2, -2).trim();
    if (s.startsWith('$')  && s.endsWith('$'))  return s.slice(1, -1).trim();
    if (s.startsWith('\\(') && s.endsWith('\\)')) return s.slice(2, -2).trim();
    if (s.startsWith('\\[') && s.endsWith('\\]')) return s.slice(2, -2).trim();
    return s;
}

// Downsample the source canvas and convert to plain b/w so Gemini sees a
// clean high-contrast OCR image (the live UI canvas is dark-blue + neon
// green, which confused the model). Returns the offscreen canvas, its data
// URL, and the bare base64 payload (ready for inlineData).
function geminiPrepareCanvas(srcCanvas, scalePct) {
    const pct = (typeof scalePct === 'number' && scalePct > 0) ? scalePct : 100;
    const w = Math.round(srcCanvas.width  * pct / 100);
    const h = Math.round(srcCanvas.height * pct / 100);
    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    const ctx = tmp.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(srcCanvas, 0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h);
    const px = id.data;
    for (let i = 0; i < px.length; i += 4) {
        const brightness = (px[i] + px[i + 1] + px[i + 2]) / 3;
        if (brightness > 60) { px[i] = px[i + 1] = px[i + 2] = 0; }
        else                 { px[i] = px[i + 1] = px[i + 2] = 255; }
        px[i + 3] = 255;
    }
    ctx.putImageData(id, 0, 0);
    const dataURL = tmp.toDataURL('image/png');
    const b64 = dataURL.split(',', 2)[1];
    return { canvas: tmp, dataURL, b64, w, h };
}

// Main entry. Sends the (preprocessed) canvas to Gemini and returns a
// structured Result. Never throws — error info lives in `result.error` /
// `result.ok`.
async function geminiRecognize(opts) {
    const {
        canvas,
        apiKey,
        model,
        scalePct = 100,
        prompt = DEFAULT_PROMPT,
        dbg = () => {},
    } = opts || {};

    const fail = (msg, extra = {}) => Object.assign({
        ok: false, latex: '', tokens: [], rawText: '',
        usage: null, status: 0, error: msg,
    }, extra);

    if (!canvas) return fail('canvas missing');
    if (!apiKey) return fail('apiKey missing');
    if (!model) return fail('model missing');

    const prep = geminiPrepareCanvas(canvas, scalePct);
    dbg(`▾ canvas ${canvas.width}×${canvas.height} → ${prep.w}×${prep.h} (${scalePct}%) + b/w`);
    dbg(`▶ Gemini ${model} (key: …${apiKey.slice(-4)}, b64: ${prep.b64.length} chars)`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const body = {
        contents: [{
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: prep.b64 } },
            ],
        }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json' },
    };

    let res, text;
    const t0 = performance.now();
    try {
        dbg(`  → fetch POST ${model}:generateContent`);
        res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        dbg(`  ← HTTP ${res.status} ${res.statusText} (${Math.round(performance.now() - t0)}ms)`);
        text = await res.text();
        dbg(`  body: ${text.slice(0, 240)}`);
    } catch (err) {
        return fail(`fetch failed: ${err.message}`);
    }

    let data;
    try { data = JSON.parse(text); }
    catch (e) {
        return fail(`invalid JSON (${res.status})`, { status: res.status, rawText: text });
    }
    if (!res.ok) {
        const msg = data?.error?.message || `HTTP ${res.status}`;
        return fail(msg, { status: res.status, rawText: text, usage: data?.usageMetadata || null });
    }

    const usage = data?.usageMetadata || null;
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    dbg(`  raw: ${raw.slice(0, 200)}`);

    // Parse the model's JSON answer.
    let latex = '(leer)';
    let tokens = [];
    try {
        const parsed = JSON.parse(raw);
        latex = typeof parsed?.latex === 'string' && parsed.latex.trim()
            ? geminiUnwrapLatex(parsed.latex) : '(leer)';
        tokens = Array.isArray(parsed?.tokens) ? parsed.tokens : [];
        dbg(`  parsed: latex="${latex.slice(0, 80)}", tokens=${tokens.length}`);
    } catch (e) {
        dbg(`  ⚠ JSON schema parse failed, fallback to raw text`);
        latex = geminiUnwrapLatex(raw || '(leer)');
    }

    return {
        ok: true,
        latex, tokens, rawText: raw,
        usage, status: res.status, error: null,
    };
}

// Expose globally (no-module pattern used by the rest of the morpheus stack).
if (typeof window !== 'undefined') {
    window.geminiUnwrapLatex     = geminiUnwrapLatex;
    window.geminiPrepareCanvas   = geminiPrepareCanvas;
    window.geminiCropCanvas      = geminiCropCanvas;
    window.geminiRecognize       = geminiRecognize;
    window.GEMINI_DEFAULT_PROMPT = DEFAULT_PROMPT;
    window.SINGLE_GLYPH_PROMPT   = SINGLE_GLYPH_PROMPT;
    window.singleGlyphContextualPrompt = singleGlyphContextualPrompt;
}

})();
