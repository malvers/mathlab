import { NARRATION, SCENES, OUT } from './demo.mjs';
import { synthScenes } from '../lib/tts.mjs';
import { runScenes } from '../lib/record-cdp.mjs';
await synthScenes(NARRATION, { outDir: OUT });
await runScenes(SCENES, { outDir: OUT });
console.log('GRA RECORD DONE');
