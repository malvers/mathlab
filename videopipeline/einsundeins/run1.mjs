import demo from './demo.mjs';
import { synthScenes } from '../lib/tts.mjs';
import { runScenes } from '../lib/record-cdp.mjs';
await synthScenes(demo.NARRATION, { outDir: demo.OUT });
await runScenes(demo.SCENES, { outDir: demo.OUT });
console.log('E1 RECORD DONE');
