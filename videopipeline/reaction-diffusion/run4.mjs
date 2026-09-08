// Reaction-Diffusion demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Public by default (PRIVACY=private|unlisted overrides). The cached OAuth token only
// carries the youtube.upload scope, so visibility can be SET here but not changed
// afterwards — get it right before the upload, not after.
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('reaction-diffusion');
const FILE = `${OUT}/reaction-diffusion-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8').trim() : '';

const id = await uploadVideo(FILE, {
  title: 'Niemand hat das gezeichnet — wie ein Muster ohne Bauplan entsteht | Doc Alvers Mathe-Labor',
  description:
    'Ein dunkles Feld, in der Mitte ein einziger Tropfen. Mehr ist nicht da. Ein paar Sekunden ' +
    'später füllt ein Labyrinth den ganzen Rahmen — und niemand hat es gezeichnet. Es gibt keine ' +
    'Vorlage und keine Stelle im Programm, an der steht, wie das Ergebnis aussehen soll.\n\n' +
    'Dahinter stecken zwei Stoffe und vier Regeln, mehr nicht: Farbe frisst Nahrung und macht ' +
    'daraus mehr Farbe, Farbe zerfällt, Nahrung wird nachgefüllt, beide verlaufen. Zwei Regler ' +
    'stellen ein, wie schnell nachkommt und wie schnell zerfällt — und ein Fingerbreit auf dem ' +
    'Regler trennt Punkte von Streifen. Der weitaus größere Teil der Skala macht übrigens gar ' +
    'nichts: Muster sind die Ausnahme, nicht die Regel.\n\n' +
    'Warum wird daraus überhaupt ein Muster und nicht überall dasselbe Einerlei? Weil dort, wo ' +
    'Farbe entsteht, sofort mehr davon entsteht — auf ganz kurze Strecke — während dieselbe ' +
    'Stelle Nahrung aus einem viel größeren Umkreis absaugt und sie damit allen Nachbarn wegnimmt. ' +
    'Nah verstärken, weit bremsen. Daraus wird ein Abstand, und ein Abstand, der sich überall ' +
    'wiederholt, ist ein Muster.\n\n' +
    'Und dann wird die Behauptung geprüft, indem der Unterschied weggenommen wird: Die Farbe wird ' +
    'plötzlich schneller gemacht. Eine Sekunde passiert nichts — dann fällt alles in sich zusammen. ' +
    'Mit einer Merkwürdigkeit, die beim Bauen des Films erst nachgemessen werden musste: Schiebt ' +
    'man den Regler langsam höher statt plötzlich, gewöhnt sich das Muster daran und hält noch weit ' +
    'darüber aus. Kaputt geht es nur, wenn man es überrascht.\n\n' +
    'Alan Turing hat das 1952 nicht beobachtet, sondern hergeleitet, in einer Arbeit über die ' +
    'chemische Grundlage der Formbildung. Bis so etwas wirklich im Reagenzglas gelang, vergingen ' +
    'achtunddreißig Jahre. Was im Labor rechnet, ist übrigens nicht sein eigenes Modell, sondern ' +
    'die Reaktion von Gray und Scott, dreißig Jahre jünger.\n\n' +
    'Alles im Film läuft live im Browser — nichts ist animiert, alles gerechnet. Zum Selberzüchten:\n\n' +
    '🧪 https://docalvers.de/reaction-diffusion.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? chapters + '\n' : ''),
  tags: ['Turing-Muster', 'Reaction-Diffusion', 'Gray-Scott', 'Musterbildung', 'Selbstorganisation',
    'Alan Turing', 'Morphogenese', 'Aktivator Inhibitor', 'Diffusion', 'Autokatalyse',
    'Simulation', 'Mathematik', 'Biologie', 'Doc Alvers', 'interaktiv', 'Unterricht'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
