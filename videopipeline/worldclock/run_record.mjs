// One-shot runner: regenerate s1+s8 narration (new spelling), then record all scenes in Retina.
import { runScenes } from '../lib/record-cdp.mjs';
import demo from './demo_scenes.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('wc1440');
await runScenes(demo.SCENES, { outDir: OUT });
console.log('RECORD DONE');
