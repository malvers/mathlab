// A music bed of any length, built from the seamless first part of Infinity_6min.m4a.
//
// The file has two parts in different styles; the break sits at 181.845 s (the energy
// above 13 kHz drops from 3-5 % to 0.1 % there). Part 1 repeats after exactly 64 bars
// at 107.58 BPM, which gives a loop that is musical rather than merely gapless:
//
//   loopStart 21.220159 s   loopEnd 163.997937 s   length 142.777778 s
//
// Those two points were found by maximising the waveform correlation of a +-1.5 s
// window around them (0.598, against 0.404 for the best of 400 random splices).
// A 50 ms equal-power crossfade at the seam puts the sample step at the 96th
// percentile of the signal's own steps - inaudible. Without it: 99.55th, a click.
//
// The intro fades in over the first 21 s, so it belongs at the front exactly once
// and never inside the loop.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { MUSIC } from './paths.mjs';

export const LOOP_START = 21.220159;
export const LOOP_END = 163.997937;
export const LOOP_LEN = LOOP_END - LOOP_START;     // 142.777778 s, 64 bars
export const PART2_AT = 181.8452;                  // where the second style begins
const XFADE = 0.05;

const ff = (args) => execFileSync('ffmpeg', ['-nostdin', '-hide_banner', '-v', 'error', '-y', ...args]);

/**
 * Render a bed of `seconds` length into `out`.
 *
 * Structure: [0 … loopEnd] once — that keeps the original fade-in and the first
 * pass untouched — then as many [loopStart … loopEnd] bodies as needed, each
 * joined to the previous with a short crossfade at the loop point.
 *
 * @param {number} seconds  target length
 * @param {string} out      destination .m4a
 * @param {string} [src]    source file (defaults to the project bed)
 */
export function buildBed(seconds, out, src = MUSIC) {
    if (!(seconds > 0)) throw new Error('buildBed: seconds must be positive');

    // how many loop bodies after the opening [0 … loopEnd]
    const n = Math.max(0, Math.ceil((seconds - LOOP_END) / (LOOP_LEN - XFADE)));

    if (n === 0) {
        ff(['-i', src, '-t', String(seconds), '-c:a', 'aac', '-b:a', '160k', out]);
        return out;
    }

    const parts = [`[0:a]atrim=0:${LOOP_END},asetpts=N/SR/TB[p0]`];
    for (let i = 1; i <= n; i++) {
        parts.push(`[0:a]atrim=${LOOP_START}:${LOOP_END},asetpts=N/SR/TB[p${i}]`);
    }
    // chain the crossfades: p0 x p1 -> c1, c1 x p2 -> c2, …
    for (let i = 1; i <= n; i++) {
        const a = i === 1 ? 'p0' : `c${i - 1}`;
        const b = `p${i}`;
        const o = i === n ? 'bed' : `c${i}`;
        parts.push(`[${a}][${b}]acrossfade=d=${XFADE}:c1=tri:c2=tri[${o}]`);
    }

    ff(['-i', src, '-filter_complex', parts.join(';'), '-map', '[bed]',
        '-t', String(seconds), '-c:a', 'aac', '-b:a', '160k', out]);
    return out;
}

/** Cut the second, differently styled part into its own file. */
export function extractPart2(out, src = MUSIC) {
    ff(['-i', src, '-ss', String(PART2_AT), '-c:a', 'aac', '-b:a', '160k', out]);
    return out;
}

// node lib/musicbed.mjs 420 /tmp/bed.m4a
if (import.meta.url === `file://${process.argv[1]}`) {
    const [secs, out] = process.argv.slice(2);
    if (!secs || !out) { console.error('usage: node musicbed.mjs <seconds> <out.m4a>'); process.exit(1); }
    buildBed(+secs, out);
    const d = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
        '-of', 'csv=p=0', out]).toString().trim();
    console.log(`Bett ${(+d).toFixed(1)} s -> ${out}`);
    if (!fs.existsSync(out)) process.exit(1);
}
