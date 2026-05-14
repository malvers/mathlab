// Shared constants + helpers for the draw20 stack.
// Plain globals — loaded before draw20.js (and any draw20-* submodule).

const DRAW20_DEFAULT_LATEX = 'E=mc^2';
const DRAW20_DEFAULT_PRESET = 0;
const DRAW20_INK_COLOR = '#F4C430';

// 20 maximally-distinguishable colours — RED-FREE on purpose so orphans
// (rendered in a saturated knallrot with glow) cannot be confused with
// any paired-region colour. Indexed by matchId — PNG outer #N and LaTeX
// outer #N share the same palette slot, so paired regions match in hue.
const DRAW20_REGION_PALETTE = [
    '#3cb44b', // green
    '#4363d8', // blue
    '#f58231', // orange
    '#911eb4', // purple
    '#42d4f4', // cyan
    '#f032e6', // magenta
    '#bfef45', // lime
    '#469990', // teal
    '#dcbeff', // lavender
    '#9A6324', // brown
    '#aaffc3', // mint
    '#808000', // olive
    '#ffd8b1', // apricot
    '#E040FB', // bright violet (replaces navy — too close to dark-blue bg)
    '#a9a9a9', // gray
    '#1abc9c', // turquoise
    '#7B68EE', // slate blue (replaces red)
    '#A1887F', // light warm brown (replaces maroon)
    '#85C1E9', // sky blue (replaces pumpkin)
    '#3D9970', // forest green (replaces pink)
];
const DRAW20_ORPHAN_COLOR = '#FF1744';
const DRAW20_ORPHAN_GLOW = 'drop-shadow(0 0 3px #FF1744)';

function draw20PaletteColor(i) {
    const n = DRAW20_REGION_PALETTE.length;
    return DRAW20_REGION_PALETTE[((i % n) + n) % n];
}
