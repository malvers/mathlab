import fs from 'fs';
import { compose } from '../lib/assemble.mjs';
import { recordOutros } from '../lib/outro.mjs';
const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/9bba6ce1-dbf3-407e-a2f2-fce1f718abcc/scratchpad/orb';
const MUSIC = '/Users/malvers/IdeaProjects/forloop/HTML/resources/Infinity_6min.m4a';
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/orbitals.html' });
compose(['orb_s1','orb_s2','orb_s3','orb_s4','orb_s5','orb_s6','orb_s7','orb_s8'],
  [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/atomorbitale-demo-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.12 } });
