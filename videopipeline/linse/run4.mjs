// Linse demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Visibility defaults to private (PRIVACY=unlisted|public to override).
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('linse');
const FILE = `${OUT}/linse-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8') : '';

const id = await uploadVideo(FILE, {
  title: 'Ein Klotz Glas wird zur Linse — Evolution statt Formel | Doc Alvers Mathe-Labor',
  description:
    'Niemand hat diesem Programm gezeigt, wie eine Linse aussieht. Es kennt einen rechteckigen Glasklotz, ' +
    'zwölf Lichtstrahlen und eine einzige Frage: wie weit daneben?\n\n' +
    'Am Anfang verfehlen die Strahlen den Brennpunkt um 104 Pixel. Nach hundert Runden — zweitausend geprüfte ' +
    'Formen — laufen alle zwölf durch einen Punkt. Und dann passiert das Interessante: die Evolution wirft ihre ' +
    'fertige Linse weg und baut eine dünnere, von 179 auf 68 Pixel. Warum? Weil die Bewertung nicht nur die ' +
    'Schärfe zählt, sondern auch den Weg durchs Glas. Erst scharf, dann sparsam — man bekommt genau das, was ' +
    'man misst.\n\n' +
    'Zum Schluss fängt der Brennpunkt an zu wandern, über die ganze Höhe der Linse. Ein normales Rechenverfahren ' +
    'wäre hier fertig und ratlos. Dieses läuft einfach weiter und bleibt unter sechs Pixeln hinter dem Ziel.\n\n' +
    'Das Verfahren heißt CMA-ES. Es will nichts, es versteht nichts — es würfelt und behält, was besser misst.\n\n' +
    'Alle Zahlen im Film sind am laufenden Labor gemessen: das Feld oben im Bild rechnet den Strahlfehler live ' +
    'aus den Punkten der Linse, mit der Brechungsroutine des Labors selbst.\n\n' +
    '🧪 https://docalvers.de/LensStandalone/cmaes_java.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? 'Kapitel: ' + chapters + '\n' : ''),
  tags: ['CMA-ES', 'Evolutionsstrategie', 'Optimierung', 'Linse', 'Optik', 'Brechung',
    'Snellius', 'Brennpunkt', 'Evolution', 'Algorithmus', 'Fitnessfunktion',
    'Mathematik', 'Physik', 'Informatik', 'Doc Alvers', 'interaktiv', 'Unterricht', 'Visualisierung'],
  privacy: process.env.PRIVACY || 'private',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
