// BB84 demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Visibility defaults to private (PRIVACY=unlisted|public to override).
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('bb84');
const FILE = `${OUT}/bb84-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8') : '';

const id = await uploadVideo(FILE, {
  title: 'BB84 — ein Schlüssel, den man nicht abhören kann | Doc Alvers Mathe-Labor',
  description:
    'Heute mitschneiden, in zwanzig Jahren entschlüsseln — genau dagegen hilft BB84. Alice schickt einzelne ' +
    'Photonen, Bob misst mit einer zufällig gewählten Basis, und wer dazwischen lauscht, muss messen und neu ' +
    'senden. Genau das zerstört jedes vierte gemeinsame Bit und verrät die Lauscherin. Im Lab: Lehrmodus mit ' +
    'allen Fällen, Sifting, die Testbit-Falle mit 1 − (3/4)^m und tausend Durchläufe, die die 25 % wirklich messen.\n\n' +
    '🧪 https://docalvers.de/bb84.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? 'Kapitel: ' + chapters + '\n' : ''),
  tags: ['BB84', 'Quantenkryptografie', 'Quantum Key Distribution', 'QKD', 'Bennett', 'Brassard',
    'Photon', 'Polarisation', 'Verschlüsselung', 'One-Time-Pad', 'Shannon', 'Shor',
    'Physik', 'Informatik', 'Doc Alvers', 'interaktiv', 'Unterricht'],
  privacy: process.env.PRIVACY || 'private',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
