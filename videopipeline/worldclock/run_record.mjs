// One-shot runner: regenerate s1+s8 narration (new spelling), then record all scenes in Retina.
import { runScenes } from '../lib/record-cdp.mjs';
import demo from './demo_scenes.mjs';

const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/wc1440';
await runScenes(demo.SCENES, { outDir: OUT });
console.log('RECORD DONE');
