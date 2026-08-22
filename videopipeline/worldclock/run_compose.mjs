import { compose } from '../lib/assemble.mjs';
import { recordOutros } from '../lib/outro.mjs';
const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/wc1440';
const MUSIC = '/Users/malvers/IdeaProjects/forloop/HTML/resources/Infinity_6min.m4a';
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/worldclock/worldclock.html' });
compose(['scene1','scene2','scene3','scene4','scene5','scene6','scene7','scene8'],
  [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/weltzeituhr-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
