// Die ganze Klasse im Blick (Mission Control) — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Visibility defaults to public (PRIVACY=private|unlisted to override) - Doc's standing rule.
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('mission-control');
const FILE = `${OUT}/mission-control-voice-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8') : '';

const id = await uploadVideo(FILE, {
  title: 'Die ganze Klasse im Blick — Online-Test mit Sperre und Mission Control | Doc Alvers Mathe-Labor',
  description:
    'Eine Klasse schreibt einen Online-Test auf dem Fon, und die Lehrkraft sieht live, was zählt: wer arbeitet, ' +
    'wer gerade nicht im Test ist und wer schon fertig ist. Links die Lehrkraft, rechts eine Schülerin, beides ' +
    'gleichzeitig.\n\n' +
    'Nach dem Vorbild des sächsischen Kompetenztests: Der Test startet im Vollbild, wo das Gerät es kann. Wer ihn ' +
    'verlässt, sieht einen roten Sperrschirm, und die Lehrkraft sieht es in ihrer Übersicht. Gesperrt wird der ' +
    'Test, nicht das Gerät, und ein zweites Gerät unter dem Tisch sieht niemand. Der Film sagt das ehrlich.\n\n' +
    'Die Lehrkraft kann einen Test abbrechen und den Abbruch zurücknehmen. Nach der Abgabe stehen Punkte und Note ' +
    'sofort da, Frage für Frage, und für die ganze Klasse gibt es eine Live-Auswertung ohne Namen.\n\n' +
    'Datenschutz: Die Schülerinnen und Schüler bekommen nur einen Decknamen und einen Zettel-Code. Auf dem Server ' +
    'liegen nur Codes, keine Namen; wer hinter einem Code steckt, weiß allein der Rechner der Lehrkraft.\n\n' +
    'Gezeigt wird die Vorführklasse mit berühmten Wissenschaftlerinnen und Wissenschaftlern als Namen. Für den Film ' +
    'sind Wartezeiten verkürzt: Das Lebenszeichen der Testseite kommt hier alle 3 statt alle 15 Sekunden.\n\n' +
    '🧪 https://docalvers.de/svp/leistungstest.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? 'Kapitel:\n' + chapters + '\n' : ''),
  tags: ['Online-Test', 'Leistungstest', 'Kompetenztest', 'Schule', 'Lehrkraft', 'Unterricht', 'Informatik',
    'Datenschutz', 'Pseudonymisierung', 'Klassenarbeit', 'digitale Schule', 'Mission Control', 'Doc Alvers'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
