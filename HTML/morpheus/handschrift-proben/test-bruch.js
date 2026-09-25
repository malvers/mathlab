// A fraction the way Doc wrote it: m1 m2 over r2, with F = in front and G after.
const S = require('/Users/malvers/IdeaProjects/forloop/HTML/js/stroke-symbols.js');
let clock = 0;
const stroke = (pts, pause = 250) => { clock += pause;
  const points = pts.map((p,i)=>({x:p[0],y:p[1],t:clock+i*8})); clock += pts.length*8;
  return { points, width: 3 }; };
const line=(x0,y0,x1,y1,n=8)=>Array.from({length:n},(_,i)=>{const f=i/(n-1);return [x0+(x1-x0)*f,y0+(y1-y0)*f];});
const blob=(cx,cy,w,h)=>[[cx-w/2,cy+h/2],[cx-w/3,cy-h/2],[cx,cy+h/4],[cx+w/3,cy-h/2],[cx+w/2,cy+h/2]];

// F = m1m2 / r2 G     bar spans x 300..600, numerator above, denominator below
const st = [
  stroke(blob(120, 300, 55, 90)),                 // F
  stroke(line(190, 285, 245, 285)), stroke(line(190, 310, 245, 310), 130),  // =
  stroke(blob(330, 255, 60, 70)),                 // m1  (numerator)
  stroke(line(375, 240, 375, 285), 300),          // 1  (300 ms: Doc's real minimum between two glyphs is 238, measured 25.09.)
  stroke(blob(470, 255, 60, 70), 260),            // m2
  stroke(line(515, 240, 515, 285), 300),          // 2
  stroke(line(300, 320, 600, 322), 300),          // ← the fraction bar
  stroke(blob(400, 390, 45, 60), 280),            // r   (denominator)
  stroke(line(455, 360, 455, 400), 150),          // 2
  stroke(blob(680, 300, 60, 95), 300),            // G
];
const { symbols, lines } = S.analyse(st);
console.log(`${st.length} Striche -> ${symbols.length} Symbole, ${lines.length} Zeile(n)`);
lines.forEach(l => {
  console.log(' Zeile ' + l.lineIdx + ':');
  l.symbols.forEach(s => console.log(
    `   Lese-Nr ${s.readIdx}  x ${Math.round(s.bbox.x)}..${Math.round(s.bbox.x+s.bbox.w)}` +
    `  y ${Math.round(s.bbox.y)}  ${s.bruch ? '<-- BRUCHSTRICH' : ''}`));
});
const erwartet = ['F','=','\\frac','m','1','m','2','r','2','G'];
console.log(`\nErwartete Tokens (${erwartet.length}): ${erwartet.join(' ')}`);
console.log(`Symbole: ${symbols.length}  ->  ${symbols.length === erwartet.length ? 'ZAHL PASST' : 'weicht ab'}`);
console.log('Reihenfolge stimmt mit \\frac{Zähler}{Nenner}?  ' +
  (lines[0] && lines[0].symbols[2] && lines[0].symbols[2].bruch ? 'Bruchstrich an Position 2 - ja' : 'nein'));
