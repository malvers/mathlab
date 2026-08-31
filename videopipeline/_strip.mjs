/* The repo file is the source; the artifact host brings its own doctype,
   head, body and reset - so those come off and nothing else changes. */
import { readFileSync, writeFileSync } from 'fs';
const SRC = '/Users/malvers/IdeaProjects/forloop/HTML/drehbuch/fourier.html';
const OUT = '/private/tmp/claude-501/-Users-malvers-IdeaProjects-forloop/fbf5b96b-2547-46c7-8e08-dd1296998866/scratchpad/fourier-drehbuch.html';
const src = readFileSync(SRC, 'utf8');
const title = src.match(/<title>[\s\S]*?<\/title>/)[0];
const fonts = src.match(/<link rel="preconnect"[\s\S]*?family=Orbitron[^>]*>/)[0];
const style = src.slice(src.indexOf('<style>', src.indexOf('</title>')));
const css   = style.slice(0, style.indexOf('</style>') + 8);
const body  = src.slice(src.indexOf('<body>') + 6, src.lastIndexOf('</body>'));
writeFileSync(OUT, [title, fonts, css, body.trim(), ''].join('\n'));
console.log('written', readFileSync(OUT, 'utf8').length, 'bytes');
