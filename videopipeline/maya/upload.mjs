// Maya tour film - upload to YouTube (Doc, 25.09.2026: "push it up to YT").
// DRY=1 prints what would be sent and renders the thumbnail without touching the API.
// Visibility defaults to public (PRIVACY=private|unlisted to override).
import os from 'os';
import { uploadVideo } from '../lib/youtube.mjs';

const FILE = os.homedir() + '/Movies/videopipeline/maya/film/maya-tour-1440p.mp4';

// scene starts in the film (voice start - 0.5 s); YouTube wants every chapter >= 10 s, so the short
// "Eine Ziffer legen" (9 s) goes together with the twenties place
const chapters = [
    '0:00 Ein leeres Brett',
    '0:13 Die zwanzig Ziffern',
    '0:32 Ziffern legen – die Zwanziger-Stelle',
    '1:04 Übertrag',
    '1:24 Eine Zahl eintippen',
    '1:34 Der Pfeil',
    '1:48 Würfeln und legen',
    '2:10 Wie viele Stellen',
    '2:26 Kalender oder rein zwanzig',
    '2:46 Hochkant',
    '2:57 Farben',
].join('\n');

const id = await uploadVideo(FILE, {
    title: 'Maya-Zahlen: Punkt, Strich, Muschel – rechnen wie vor 2000 Jahren | Doc Alvers Mathe-Labor',
    description:
        'Die Maya kamen mit drei Zeichen aus: ein Punkt ist eins, ein Strich ist fünf, die Muschel ist null. ' +
        'Daraus bauten sie zwanzig Ziffern und ein Stellenwertsystem zur Basis 20 – mit einem Knick bei der ' +
        'dritten Stelle: 360 statt 400, weil ihr Kalenderjahr 18 mal 20 Tage hatte.\n\n' +
        'In drei Minuten durch das Maya-Rechenbrett: Ziffern legen, der Übertrag von 59 auf 60, eine Zahl ' +
        'eintippen, der Würfel stellt Aufgaben, und warum die 18 auf der Zwanziger-Stelle keinen Platz hat.\n\n' +
        'Selbst ausprobieren: 🧪 https://docalvers.de/maya.html · 🔬 https://docalvers.de\n\n' +
        'Stimme: Doc Alvers (KI-Stimmklon) · Bild: KI-generiert\n\n' +
        'Kapitel:\n' + chapters + '\n',
    tags: ['Maya', 'Maya-Zahlen', 'Zahlensystem', 'Stellenwertsystem', 'Basis 20', 'Vigesimalsystem',
        'Null', 'Maya-Kalender', 'Übertrag', 'Mathematik', 'Geschichte der Mathematik',
        'Doc Alvers', 'interaktiv', 'Unterricht', 'Visualisierung'],
    privacy: process.env.PRIVACY || 'public',
    synthetic: true,                                   // cloned voice + AI-animated face: YouTube's disclosure
    dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
