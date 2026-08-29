// Kovarianz demo — step 2: one continuous take of the whole lab.
//
// The order follows the plot in HTML/drehbuch/kovarianz.html: round cloud →
// stretch → tilt → rho → drag the ellipse → principal axes → rotate → det = 0
// → translate → uniform cloud → parallels → warp → finale.
//
// A fresh browser context has an empty localStorage, so the lab starts from its
// defaults; the setup below only switches off what the narration introduces later.
//
// Every action fires inside a measured silence from run1 (cues.json) - those gaps
// are the stage directions written into the SSML. When a scene has no gap long
// enough, FALLBACK gives the fraction of the scene to act at instead.
import fs from 'fs';
import { runScenes } from '../lib/record-cdp.mjs';
import { frameWatch } from '../lib/framecheck.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('kovarianz');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const cues = JSON.parse(fs.readFileSync(`${OUT}/cues.json`, 'utf8'));

const AIR = 1600;                 // breathing room after every scene's narration
const EXTRA = {                   // scenes whose animation needs more than the words
    s6: 1500, s8: 2000, s13: 1000, s14: 2500,
};
// VP_SPEED=8 runs the same choreography in a fraction of the time - a dry run that
// proves every selector still exists before the real take is committed to disk.
// VP_SHOTS=1 additionally drops a PNG at the start of every scene.
const SPEED = Number(process.env.VP_SPEED || 1);
const SHOTS = !!process.env.VP_SHOTS;
// VP_CHECK=1 walks the choreography without recording and reports whether every
// scene still fits on the stage. Run this before committing to a full take:
//     VP_CHECK=1 VP_SPEED=6 node kovarianz/run2.mjs
const CHECK = !!process.env.VP_CHECK;
// stats.s1 is the large semi-axis in world units; past MAXAXIS the drawn ellipse
// leaves the stage (the lab scales the unit circle to min(w,h)/7)
const watch = frameWatch({
    probe: () => stats.s1, limit: 145, probeLabel: 'Halbachse',
});

// where to act when the voice has no measured gap (fraction of the narration)
const FALLBACK = { s9: 0.38, s11: 0.34 };

await runScenes([
    {
        name: 'main', url: 'https://docalvers.de/kovarianz.html?lang=de',
        run: async (p, { mark }) => {
            // ---------- timing helpers ----------
            let t0 = 0, deadline = 0, key = '';
            const scene = async (k) => {
                if (key) await watch.take(p, key);
                mark(k); key = k; t0 = Date.now();
                deadline = t0 + (durs[k] * 1000 + AIR + (EXTRA[k] || 0)) / SPEED;
                if (SHOTS) await p.screenshot({ path: `${OUT}/shot_${k}.png` });
            };
            const at = async (ms) => { const w = t0 + ms / SPEED - Date.now(); if (w > 20) await p.waitForTimeout(w); };
            // absolute ms of the i-th measured pause of the current scene
            const cue = (i, frac) => {
                const c = (cues[key] || [])[i];
                if (c != null) return c * 1000;
                return (frac ?? FALLBACK[key] ?? 0.4) * durs[key] * 1000;
            };
            const rest = async () => { const w = deadline - Date.now(); if (w > 20) await p.waitForTimeout(w); };
            const tick = (ms) => p.waitForTimeout(Math.max(15, ms / SPEED));
            const safe = async (label, fn) => {
                try { await fn(); } catch (e) { mark('SKIP ' + label + ': ' + e.message.slice(0, 60)); }
            };

            // ---------- lab helpers ----------
            // Animate A towards a target matrix. Going through render() keeps the
            // point cloud, the read-out and the matrix grid in step.
            const morph = (target, ms = 1400) => p.evaluate(([t, ms]) => new Promise((res) => {
                const from = S.m.map((r) => r.slice());
                const start = performance.now();
                (function step() {
                    const u = Math.min(1, (performance.now() - start) / ms);
                    const e = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);   // ease in-out
                    for (let r = 0; r < 2; r++)
                        for (let c = 0; c < 3; c++)
                            if (t[r][c] != null) S.m[r][c] = from[r][c] + (t[r][c] - from[r][c]) * e;
                    render();
                    u < 1 ? requestAnimationFrame(step) : res();
                })();
            }), [target, ms / SPEED]);

            // Rotate the CURRENT map instead of replacing it: A' = R(theta) A.
            // The lab's own rotate() overwrites A with a pure rotation, which would
            // make the cloud round again - and then nothing would dance in scene 8.
            const spin = (deg, ms) => p.evaluate(([deg, ms]) => new Promise((res) => {
                const A = S.m.map((r) => r.slice());
                const start = performance.now();
                (function step() {
                    const u = Math.min(1, (performance.now() - start) / ms);
                    const a = deg * Math.PI / 180 * u, c = Math.cos(a), s = Math.sin(a);
                    S.m[0][0] = c * A[0][0] - s * A[1][0];
                    S.m[0][1] = c * A[0][1] - s * A[1][1];
                    S.m[1][0] = s * A[0][0] + c * A[1][0];
                    S.m[1][1] = s * A[0][1] + c * A[1][1];
                    render();
                    u < 1 ? requestAnimationFrame(step) : res();
                })();
            }), [deg, ms / SPEED]);

            const flag = (k, box, on) => p.evaluate(([k, box, on]) => {
                if (S[k] === on) return;
                S[k] = on;
                const b = document.getElementById(box);
                if (b) b.checked = on;
                render();
            }, [k, box, on]);

            // straight from the lab's own statistics - the panel is KaTeX markup
            const readout = () => p.evaluate(() => ({
                rho: stats.rho, det: stats.det, s1: stats.s1, s2: stats.s2,
            }));
            const fmt = (o) => Object.entries(o)
                .map(([k, v]) => `${k}=${Number(v).toFixed(3)}`).join('  ');

            // page coordinates of one of the two ellipse handles
            const handlePos = (opposite = false) => p.evaluate((opp) => {
                const id = (handleId + (opp ? NCIRC / 2 : 0)) % NCIRC;
                const s = toScreen(apply(circle[id]));
                const r = document.getElementById('canvas').getBoundingClientRect();
                return { x: s[0] + r.left, y: s[1] + r.top };
            }, opposite);

            // a point on the stage that is NOT a handle, so the drag shifts the plane
            const emptySpot = () => p.evaluate(() => {
                const r = document.getElementById('canvas').getBoundingClientRect();
                return { x: r.left + r.width * 0.24, y: r.top + r.height * 0.80 };
            });

            const dragTo = async (from, to, steps = 26, ms = 40) => {
                await p.mouse.move(from.x, from.y);
                await tick(180);
                await p.mouse.down();
                for (let i = 1; i <= steps; i++) {
                    await p.mouse.move(from.x + (to.x - from.x) * i / steps,
                                      from.y + (to.y - from.y) * i / steps);
                    await tick(ms);
                }
                await p.mouse.up();
            };

            const selectCell = (r, c) => p.evaluate(([r, c]) => {
                S.selRow = r; S.selCol = c; render();
            }, [r, c]);

            // ---------- setup: the stage the narration expects ----------
            await p.waitForFunction(() => typeof render === 'function' && Array.isArray(pts));
            await p.evaluate(() => {
                resetAll();
                S.dist = 'gauss'; S.n = 4000; buildCloud();
                S.showDots = true; S.showCircle = true; S.homogen = true;
                S.showCov = false;          // scene 7 turns the principal axes on
                S.showVectors = false;      // deliberately left out of this film
                S.showParallels = false;    // scene 12
                S.warp = false;             // scene 13
                for (const [id, k] of [['c-dots', 'showDots'], ['c-circle', 'showCircle'],
                    ['c-cov', 'showCov'], ['c-vec', 'showVectors'], ['c-par', 'showParallels'],
                    ['c-hom', 'homogen'], ['c-warp', 'warp']]) {
                    const b = document.getElementById(id); if (b) b.checked = S[k];
                }
                buildMatrix(); render();
            });
            await p.mouse.move(640, 400);
            await tick(900);

            // ---------- 1 · the cloud has a shape ----------
            await scene('s1');
            await rest();

            // ---------- 2 · the zero point ----------
            await scene('s2');
            await at(1200); await p.mouse.move(1140, 300);      // glance at the panel
            await at(4000); await p.mouse.move(1140, 380);
            await rest();

            // ---------- 3 · stretch, and the squared surprise ----------
            await scene('s3');
            await selectCell(0, 0);
            await at(4200); await morph([[2, 0, 0], [0, 1, 0]], 1500);   // on "von eins auf zwei"
            await rest();

            // ---------- 4 · the off-diagonal wakes up ----------
            await scene('s4');
            await selectCell(0, 1);
            await at(3600); await morph([[2, 0.75, 0], [0.3, 1, 0]], 1600);   // on "legt sich schräg"
            await rest();

            // ---------- 5 · rho, the tilt without units ----------
            await scene('s5');
            await at(cue(0) - 2600); await morph([[1.8, 1.3, 0], [0.5, 0.95, 0]], 1500);
            await safe('rho', async () => console.log('  s5 nach Kippen: ' + fmt(await readout())));
            await at(durs.s5 * 1000 * 0.86); await morph([[2, 0, 0], [0, 1, 0]], 1400);   // "zurück auf null"
            await rest();

            // ---------- 6 · the ellipse IS the matrix ----------
            await scene('s6');
            await at(cue(0) - 900);
            await safe('drag ellipse', async () => {
                const h = await handlePos();
                await dragTo(h, { x: h.x + 130, y: h.y - 95 }, 30, 45);
            });
            await rest();

            // ---------- 7 · the principal axes, i.e. PCA ----------
            await scene('s7');
            await at(2100); await flag('showCov', 'c-cov', true);   // on "zwei Achsen erscheinen"
            await rest();

            // ---------- 8 · rotating: the numbers lie, the axes do not ----------
            await scene('s8');
            const before = await readout();
            await at(cue(0));
            const T = (durs.s8 * 1000 - cue(0)) + 1200;
            // sample mid-rotation, not after the full turn: a full 360 deg puts A back
            // where it started, so comparing start and end would prove nothing
            const spinning = spin(360, T);
            await p.waitForTimeout(T * 0.4 / SPEED);
            const mid = await readout();
            await spinning;
            await safe('spin check', async () => {
                console.log('  s8 vor Drehung:  ' + fmt(before));
                console.log('  s8 bei ~144 Grad: ' + fmt(mid));
                const axes = Math.max(Math.abs(mid.s1 - before.s1), Math.abs(mid.s2 - before.s2));
                const rho = Math.abs(mid.rho - before.rho);
                console.log(`  s8 Achsen-Drift ${axes.toFixed(4)} · rho-Aenderung ${rho.toFixed(4)}`);
                console.log('  s8 ' + (axes < 0.5 && rho > 0.05
                    ? 'Behauptung haelt: Achsen stehen, die Eintraege tanzen.'
                    : 'ACHTUNG - der Text stimmt so nicht!'));
            });
            await rest();

            // ---------- 9 · det A = 0, the cloud dies ----------
            await scene('s9');
            await selectCell(1, 0);
            await at(cue(0, 0.36));
            // second row made proportional to the first -> rank 1 -> Sigma singular
            await morph([[2, 1.1, 0], [1.0, 0.55, 0]], 2600);
            await safe('det', async () => console.log('  s9 nach Kollaps: ' + fmt(await readout())));
            await rest();

            // ---------- 10 · shifting does not change Sigma ----------
            await scene('s10');
            await morph([[1.7, 0.8, 0], [0.35, 1.15, 0]], 1200);       // out of the singular state
            await at(3200);                                     // on "ich schiebe die Wolke"
            await safe('shift', async () => {
                const e = await emptySpot();
                await dragTo(e, { x: e.x + 260, y: e.y - 170 }, 26, 45);
            });
            await rest();

            // ---------- 11 · same ellipse, different cloud ----------
            await scene('s11');
            await at(cue(0, 0.32)); await p.evaluate(() => setDist('equal'));
            await rest();

            // ---------- 12 · why "linear" is the word that matters ----------
            await scene('s12');
            await at(3800); await flag('showParallels', 'c-par', true);   // on "vier Geraden"
            await at(cue(0)); await morph([[1.15, -0.75, 0], [0.9, 1.3, 0]], 1900);
            await rest();

            // ---------- 13 · warping space: where Sigma stops being true ----------
            await scene('s13');
            await at(cue(0)); await flag('warp', 'c-warp', true);   // in the gap after "verbiege den Raum"
            await rest();

            // ---------- 14 · finale ----------
            await scene('s14');
            await at(cue(0));
            await flag('warp', 'c-warp', false);
            await flag('showParallels', 'c-par', false);
            await p.evaluate(() => { setDist('gauss'); resetAll(); });
            for (let i = 1; i <= 3; i++) {
                await at(cue(i, 0.25 + i * 0.2));
                await p.evaluate(() => randomMatrix());
            }
            await rest();

            await watch.take(p, key);
            mark('end');
        }
    }
], { outDir: OUT, viewport: { width: 1280, height: 720 }, record: !CHECK });

const ok = watch.report();
if (CHECK) {
    console.log(ok ? '\nProbelauf sauber — die Aufnahme kann laufen.'
                   : '\nProbelauf beanstandet — erst korrigieren, dann aufnehmen.');
    process.exit(ok ? 0 : 1);
}
