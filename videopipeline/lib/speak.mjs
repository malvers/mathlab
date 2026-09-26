// Solita speaks a script, scene by scene, into ~/Movies/videopipeline/<project>/sN.mp3 - incrementally.
//
// The loop of wuerfelspiel/run1.mjs and mission-control/run1.mjs, taken out for the third user (the Trigonometrie tour,
// 26.09.2026) instead of copied a third time. Those two still carry their own copy and work as they are.
//
// Why incremental: the Studio voice has a hard quota (HTTP 429 "RESOURCE_EXHAUSTED" after a couple of full runs), so
// only scenes whose text changed are sent again, and durations + texts are written after EVERY scene - a scene already
// paid for is never lost because a later one threw. The scenes go one by one with a gap: a burst locks Solita's live
// voice (DocPad, decks, solita.html) for everyone for a minute (measured 16.09.2026).
//
// texts.json is what was really spoken - tools/tourkritik.py serves it as the subtitles, tools/tour_publish.mjs puts it
// online. force: true (FORCE=1) speaks everything again, e.g. after a new rate (the text did not change, the tempo did).
import fs from 'fs';
import { synthScenes } from './tts.mjs';
import { workDir } from './paths.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const read = (f, fallback) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return fallback; } };

export async function speakScenes(project, NARRATION, { rate = 0.96, gap = 5, force = false } = {}) {
    const OUT = workDir(project);
    const oldText = force ? {} : read(`${OUT}/texts.json`, {});
    const durs = read(`${OUT}/durs.json`, {});
    const done = { ...oldText };
    const todo = Object.entries(NARRATION).filter(([k, v]) =>
        v !== oldText[k] || !durs[k] || !fs.existsSync(`${OUT}/${k}.mp3`));

    const chars = todo.reduce((a, [, v]) => a + v.replace(/<[^>]+>/g, '').length, 0);
    console.log(todo.length ? `neu zu sprechen: ${todo.map(([k]) => k).join(' ')} (${chars} Zeichen)`
                            : 'nichts zu tun — alle Szenen sind aktuell.');

    for (const [k, v] of todo) {
        // on 429 the voice is exhausted for everyone for about a minute: wait, then try again
        for (let attempt = 1; ; attempt++) {
            try {
                await synthScenes({ [k]: v }, {
                    outDir: OUT, rate,
                    onScene: (name, sec) => {               // persist after every paid-for scene
                        durs[name] = sec;
                        done[name] = NARRATION[name];
                        // texts.json in the scene order of the script, and only its scenes: a scene taken out of the
                        // script is no longer published (tour_publish.mjs reads the ids from here)
                        const ordered = {};
                        Object.keys(NARRATION).forEach((id) => { if (id in done) ordered[id] = done[id]; });
                        fs.writeFileSync(`${OUT}/durs.json`, JSON.stringify(durs));
                        fs.writeFileSync(`${OUT}/texts.json`, JSON.stringify(ordered));
                    },
                });
                break;
            } catch (e) {
                const quota = /429|RESOURCE_EXHAUSTED|exhausted|quota/i.test(e.message);
                if (!quota || attempt >= 6) throw e;
                console.log(`${k}: Kontingent erschöpft (Versuch ${attempt}) — warte 60 s`);
                await sleep(60000);
            }
        }
        if (todo[todo.length - 1][0] !== k) await sleep(gap * 1000);
    }

    const order = Object.keys(NARRATION);
    const missing = order.filter((k) => !durs[k]);
    if (missing.length) console.log('FEHLEN NOCH:', missing.join(' '));
    const total = order.reduce((a, k) => a + (durs[k] || 0), 0);
    console.log('---');
    for (const k of order) console.log(k.padEnd(4), (durs[k] || 0).toFixed(1) + 's');
    console.log('Sprache gesamt', total.toFixed(1), 's über', order.length, 'Szenen.');
    return { dir: OUT, durs, total };
}
