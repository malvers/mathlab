// Render-mode detection for the draw20 stack.
//
// One source of truth answering: "what state is the rendering pipeline in?"
//
//   'stift'  — user has drawn strokes and extracted outlines (stiftContours
//              has entries). Stift takes precedence over PNG presets.
//   'formel' — a PNG handwriting preset is loaded into pix (no stift).
//   'symbol' — only a LaTeX render exists (single glyph, no PNG counterpart).
//   'empty'  — nothing to render.
//
// Pure function — no closure state, no globals read. Callers pass in the
// DOM nodes / getters; this keeps it testable and decoupled from the
// render factory.

function draw20DetectRenderMode({ pix, tex, getLatexCanvas, getStiftContours }) {
    const hasPng = !!(pix && pix.complete && pix.naturalWidth);
    const sc = (typeof getStiftContours === 'function') ? getStiftContours() : null;
    const hasStift = !!(sc && sc.length);
    const lc = (typeof getLatexCanvas === 'function') ? getLatexCanvas() : null;
    const hasLatex = !!(lc && tex && tex.complete && tex.naturalWidth);
    if (hasStift) return 'stift';
    if (hasPng) return 'formel';
    if (hasLatex) return 'symbol';
    return 'empty';
}

if (typeof window !== 'undefined') {
    window.draw20DetectRenderMode = draw20DetectRenderMode;
}
