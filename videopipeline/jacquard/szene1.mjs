// Szene 1, nur Optik: der Webstuhl steht still, die Kamera fährt langsam auf.
// Kein Ton, keine Untertitel — es geht allein um das Bild.
//   node videopipeline/jacquard/szene1.mjs
// record-cdp, nicht record: Playwrights recordVideo legt die Seite unskaliert in die
// linke obere Ecke des groesseren Rahmens. Der CDP-Screencast fuellt das Bild.
import { runScenes } from '../lib/record-cdp.mjs';
import fs from 'fs';
import os from 'os';

const OUT = process.env.OUT || `${os.homedir()}/Movies/videopipeline/jacquard`;
fs.mkdirSync(OUT, { recursive: true });

const wait = (page, ms) => page.waitForTimeout(ms);

await runScenes([{
    name: 'szene1',
    url: 'http://localhost:8765/jacquard.html',
    async run(page, { mark }) {
        // erst warten, bis das Lab wirklich steht — sonst sind die ersten Sekunden leer
        // controls und S sind mit let/const deklariert — die liegen nicht auf window
        await page.waitForFunction(
            'typeof controls !== "undefined" && controls && typeof S !== "undefined" && S.n > 0',
            null, { timeout: 20000 });
        // Seitenleiste zu: im Film soll die Maschine stehen, nicht die Regler
        await page.evaluate(() => toggleSidebar());
        await wait(page, 700);

        // Startzustand hart setzen — das Lab merkt sich sonst die letzte Sitzung
        await page.evaluate(() => {
            localStorage.clear();
            S.design = 'stoff';
            S.threads = 90;
            S.winX = 0.30; S.winY = 0.20; S.winW = 0.26; S.winH = 0.30;
            S.speed = 0;                       // Tempo ganz links: die Maschine steht
            rebuildPattern();
            reset();
            // ein Stück Tuch ist schon fertig, sonst steht die Maschine im Leeren
            for (let k = 0; k < Math.floor(S.rows * 0.45); k++) weaveRowInstant();
            S.sel = 0; S.shedT = 0; S.swapT = 0; S.reedU = 0;
            for (let i = 0; i < S.n; i++) S.lift[i] = 0;
            // nah an Karte und Litzen
            controls.setLookAt(4.4, 5.6, 5.6, 2.0, 3.0, -2.2, false);
        });
        mark('gesetzt');
        await wait(page, 2600);

        // eine einzige, sehr langsame Fahrt nach hinten
        await page.evaluate(() => {
            controls.smoothTime = 3.6;
            controls.setLookAt(3.5, 9.2, 19.0, 3.5, 0, 0, true);
        });
        mark('fahrt');
        await wait(page, 10500);
        mark('ende');
    },
}], { outDir: OUT, viewport: { width: 1280, height: 720 }, upscale: 2 });

console.log('Rohmaterial:', OUT + '/szene1.mp4');
