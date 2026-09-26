// Trigonometrie film - upload to YouTube (Doc, 26.09.2026: "Push it to YT! Und gib mir den Link"). Pattern: maya/upload.mjs.
// DRY=1 prints what would be sent and renders the thumbnail without touching the API.
// Visibility defaults to public (PRIVACY=private|unlisted to override).
import fs from 'fs';
import os from 'os';
import { uploadVideo } from '../lib/youtube.mjs';

const DIR = os.homedir() + '/Movies/videopipeline/trigonometrie/film';
const FILE = DIR + '/trigonometrie-1440p.mp4';

// chapters as film.mjs measured them (scene mark = voice start - 0.5 s); the end titles are shorter than the 10 s
// YouTube wants for a chapter, so they stay part of the last one
const chapters = fs.readFileSync(DIR + '/chapters.txt', 'utf8').trim().split('\n').filter((l) => !/Abspann$/.test(l)).join('\n');

const id = await uploadVideo(FILE, {
    title: 'Trigonometrie — vom rechtwinkligen Dreieck zur Sinuskurve | Doc Alvers Mathe-Labor',
    description:
        'Sinus, Kosinus, Tangens: In der neunten Klasse beginnen sie im rechtwinkligen Dreieck, am Ende beschreiben ' +
        'sie Wellen. In knapp fünf Minuten durch alle elf Kapitel des Trigonometrie-Labors – warum im Dreieck nur der ' +
        'Winkel zählt, der Einheitskreis, das Bogenmaß, wie sich aus dem Kreis die Sinuskurve abrollt, der Kosinus als ' +
        'verschobener Sinus, die Gleichung sin x = ½, die Parameter a, b, c und d mit einem Rätsel, die Tageslänge in ' +
        'Dresden als Sinus-Modell, der Tangens und seine Polstelle, Sinus- und Kosinussatz mit dem Fall zweier Dreiecke ' +
        '– und als Ausblick die Ableitung.\n\n' +
        'Selbst ausprobieren: 🧪 https://docalvers.de/trigonometrie.html · 🔬 https://docalvers.de\n\n' +
        'Stimme: Solita (KI-Stimme)\n\n' +
        'Kapitel:\n' + chapters + '\n',
    tags: ['Trigonometrie', 'Sinus', 'Kosinus', 'Tangens', 'Einheitskreis', 'Bogenmaß', 'Sinuskurve',
        'Sinusfunktion', 'Sinussatz', 'Kosinussatz', 'Ableitung', 'rechtwinkliges Dreieck', 'Klasse 9', 'Klasse 10',
        'Mathematik', 'Doc Alvers', 'interaktiv', 'Unterricht', 'Visualisierung'],
    privacy: process.env.PRIVACY || 'public',
    synthetic: true,                                   // Solita's synthetic voice: YouTube's disclosure, as with Maya
    thumbnail: { at: 104 },                            // the sine curve rolled out, P back at 360°
    dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
