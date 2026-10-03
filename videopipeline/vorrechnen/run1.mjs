// Vorrechnen tour - Solita speaks narration.mjs into ~/Movies/videopipeline/vorrechnen/sN.mp3 (+ texts.json for the
// subtitles). Incremental: only changed scenes cost a request. Then:
//
//     python3 -u tools/tourkritik.py vorrechnen   ->   http://localhost:8769/tours/vorrechnen.html?critics
//     node tools/tour_publish.mjs vorrechnen        (online, on Doc's word)
//
// RATE: 0.96 as the other tours (Doc, 19.09.2026: "96 % probieren"). A new rate needs FORCE=1.
import { speakScenes } from '../lib/speak.mjs';
import { NARRATION } from './narration.mjs';

await speakScenes('vorrechnen', NARRATION, {
    rate: Number(process.env.RATE || 0.96),
    gap: Number(process.env.GAP || 5),
    force: !!process.env.FORCE,
});
