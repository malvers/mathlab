// Fraktal demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Visibility defaults to public (PRIVACY=private|unlisted to override).
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('fraktal');
const FILE = `${OUT}/fraktal-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8') : '';

const id = await uploadVideo(FILE, {
  title: 'Warum steckt π im Apfelmännchen? — Fraktale zum Zusehen | Doc Alvers Mathe-Labor',
  description:
    'Eine Regel aus fünf Zeichen — quadrieren, c dazu, von vorn — und am Ende fällt die Kreiszahl heraus. ' +
    'Ohne Kreis, ohne Winkel, ohne Umfang.\n\n' +
    'Der Film fragt jeden Punkt der Ebene dieselbe Frage und macht aus den Antworten ein Bild: bleibt die Kette ' +
    'in der Nähe, ist der Punkt drin; läuft sie davon, zählt die Anzahl der Schritte — und genau diese Anzahl ist ' +
    'die Farbe. Dann geht es an den Rand, wo die Frage teuer wird, und in die Julia-Mengen, über die das ' +
    'Apfelmännchen Buch führt.\n\n' +
    'Der Kern: bei c = −0,75 senkrecht nach oben. Ein Zehntel daneben braucht die Folge 33 Schritte, ein ' +
    'Hundertstel 315, ein Tausendstel 3143, ein Millionstel 3 141 593. Schritte mal Abstand ergibt π, auf sieben ' +
    'Stellen. Der Film zeigt die Messung — und sagt dazu, dass er den Beweis nicht führt.\n\n' +
    'Ehrlich auch bei den eigenen Grenzen: das Labor rechnet mit 32 Bit und ist beim Zoomfaktor 200 000 am ' +
    'Anschlag. Der Rand geht weiter, unser Zahlensystem nicht.\n\n' +
    'Jede Zahl im Film ist exakt nachgerechnet, mit derselben Iteration, die das Labor rechnet.\n\n' +
    '🧪 https://docalvers.de/mandelbrot.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? 'Kapitel:\n' + chapters + '\n' : ''),
  tags: ['Fraktale', 'Mandelbrot', 'Apfelmännchen', 'Julia-Menge', 'Pi', 'Kreiszahl',
    'Iteration', 'komplexe Zahlen', 'Chaos', 'Selbstähnlichkeit', 'Zoom',
    'Mathematik', 'Physik', 'Doc Alvers', 'interaktiv', 'Unterricht', 'Visualisierung'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
