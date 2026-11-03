// Ein Lehrbuch für 49 Cent — Solita speaks narration.mjs into ~/Movies/videopipeline/mathe11-lehrbuch/sN.mp3 (+ texts.json
// for the subtitles). Incremental: only changed scenes cost a request. Then:
//
//     python3 -u tools/tourkritik.py mathe11-lehrbuch 8773   ->   http://127.0.0.1:8773/tours/mathe11-lehrbuch.html?critics
//     node tools/tour_publish.mjs mathe11-lehrbuch           (online, on Doc's word)
//
// RATE: 0.96 as the other tours (Doc, 19.09.2026: "96 % probieren"). A new rate needs FORCE=1.
import { speakScenes } from '../lib/speak.mjs';
import { NARRATION } from './narration.mjs';

await speakScenes('mathe11-lehrbuch', NARRATION, {
    rate: Number(process.env.RATE || 0.96),
    gap: Number(process.env.GAP || 5),
    force: !!process.env.FORCE,
});
