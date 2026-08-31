// Fourier demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Visibility defaults to public (PRIVACY=private|unlisted to override).
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('fourier');
const FILE = `${OUT}/fourier-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8') : '';

const id = await uploadVideo(FILE, {
  title: 'Wie viele Kreise ist ein Quadrat? — Fourier zum Zusehen | Doc Alvers Mathe-Labor',
  description:
    'Jede geschlossene Zeichnung ist eine Summe rotierender Kreise. Die Frage ist nie ob — sondern wie viele.\n\n' +
    'Eine Musiknote entsteht aus zwei, drei, zehn, tausend Kreisen. Dann kommt das Quadrat und macht alles kaputt: ' +
    'bei zwei Kreisen bewegt sich der Stift überhaupt nicht, bei drei stecken 98,6 % der Energie im Bild — und auf ' +
    'dem Schirm steht ein Kreis. Vier Kreise später hat sich immer noch nichts geändert, weil die Symmetrie des ' +
    'Quadrats Löcher ins Spektrum schlägt. Und die Ecke wird nie eine: die Abweichung fällt wie 1/N, halb so rund ' +
    'kostet doppelt so viele Kreise.\n\n' +
    'Am Ende steht, wozu das gut ist: 1000 Punkte sind 2000 Zahlen, 20 Kreise sind 40 — fünfzig zu eins. ' +
    'Genau das machen JPEG und MP3.\n\n' +
    'Alle Prozentzahlen im Film sind gemessen, nicht behauptet: das Energie-Feld unten links rechnet live aus den ' +
    'Fourier-Koeffizienten des Labors.\n\n' +
    '🧪 https://docalvers.de/fourier.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? 'Kapitel: ' + chapters + '\n' : ''),
  tags: ['Fourier', 'Fourier-Transformation', 'Fourierreihe', 'DFT', 'FFT', 'Epizykel',
    'Kreise', 'Spektrum', 'Frequenz', 'JPEG', 'MP3', 'Datenkompression',
    'Mathematik', 'Physik', 'Doc Alvers', 'interaktiv', 'Unterricht', 'Visualisierung'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
