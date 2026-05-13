// Binary morphology on the contour-extraction grid.
//
// Why: hand-drawn glyphs frequently break into multiple strokes ('m' written
// as two arcs, 'k' as three, etc.). Topology-aware contour extraction then
// reports them as separate regions, which inflates the object count and
// breaks the user↔target Hungarian matching. Morphological closing
// (dilate → erode) bridges gaps up to 2r pixels without growing the
// overall outline, because the erosion pulls the boundary back.
//
// The visible draw-canvas pixels are NEVER touched — only the binary grid
// used for marching-squares contour tracing.
//
// Implementation note: dilation/erosion use a *box* structuring element of
// side 2r+1 (not a disk). Box morphology is separable: one horizontal pass
// then one vertical pass, each O(W·H) via a sliding-window count. For our
// 1000×1000 grid that's ~2M ops per pass, ~8M ops total per close — runs in
// a few ms.

function boxDilate(grid, W, H, r) {
    if (r <= 0) return grid;
    const tmp = new Uint8Array(W * H);

    // Horizontal pass: pixel ON if any pixel in horizontal window of width 2r+1 is ON.
    for (let y = 0; y < H; y++) {
        const row = y * W;
        let onCount = 0;
        for (let xx = 0; xx <= r && xx < W; xx++) {
            if (grid[row + xx]) onCount++;
        }
        tmp[row] = onCount > 0 ? 1 : 0;
        for (let x = 1; x < W; x++) {
            const xR = x + r, xL = x - r - 1;
            if (xR < W && grid[row + xR]) onCount++;
            if (xL >= 0 && grid[row + xL]) onCount--;
            tmp[row + x] = onCount > 0 ? 1 : 0;
        }
    }

    // Vertical pass on tmp.
    const out = new Uint8Array(W * H);
    for (let x = 0; x < W; x++) {
        let onCount = 0;
        for (let yy = 0; yy <= r && yy < H; yy++) {
            if (tmp[yy * W + x]) onCount++;
        }
        out[x] = onCount > 0 ? 1 : 0;
        for (let y = 1; y < H; y++) {
            const yR = y + r, yL = y - r - 1;
            if (yR < H && tmp[yR * W + x]) onCount++;
            if (yL >= 0 && tmp[yL * W + x]) onCount--;
            out[y * W + x] = onCount > 0 ? 1 : 0;
        }
    }
    return out;
}

function boxErode(grid, W, H, r) {
    if (r <= 0) return grid;
    // OOB treated as ON (replicate boundary) — prevents canvas-edge shrinkage.
    const tmp = new Uint8Array(W * H);

    for (let y = 0; y < H; y++) {
        const row = y * W;
        let offCount = 0;
        for (let xx = 0; xx <= r && xx < W; xx++) {
            if (!grid[row + xx]) offCount++;
        }
        tmp[row] = offCount === 0 ? 1 : 0;
        for (let x = 1; x < W; x++) {
            const xR = x + r, xL = x - r - 1;
            if (xR < W && !grid[row + xR]) offCount++;
            if (xL >= 0 && !grid[row + xL]) offCount--;
            tmp[row + x] = offCount === 0 ? 1 : 0;
        }
    }

    const out = new Uint8Array(W * H);
    for (let x = 0; x < W; x++) {
        let offCount = 0;
        for (let yy = 0; yy <= r && yy < H; yy++) {
            if (!tmp[yy * W + x]) offCount++;
        }
        out[x] = offCount === 0 ? 1 : 0;
        for (let y = 1; y < H; y++) {
            const yR = y + r, yL = y - r - 1;
            if (yR < H && !tmp[yR * W + x]) offCount++;
            if (yL >= 0 && !tmp[yL * W + x]) offCount--;
            out[y * W + x] = offCount === 0 ? 1 : 0;
        }
    }
    return out;
}

// Morphological closing: bridges gaps ≤ 2r px without growing the outline.
function morphClose(grid, W, H, r) {
    if (r <= 0) return grid;
    return boxErode(boxDilate(grid, W, H, r), W, H, r);
}
