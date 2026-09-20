#!/usr/bin/env node
// Puts the "Gedanke der Woche" pages online: one full-size picture per school week goes to the R2 bucket "gdw",
// where the plan pages find it (HTML/svp/svp-plan-gdw.js, GDW_BASE). Doc, 20.09.2026: "R2 Vorschlag ist toll!".
//
//     node tools/gdw_publish.mjs --setup       # once: bucket "gdw", public r2.dev URL, CORS for GET
//     node tools/gdw_publish.mjs <ordner>      # every NN.webp in <ordner> (the rendered slides)
//
// The small preview pictures live in the repo (HTML/svp/gdw/, ~7 KB each) because every week row shows one.
// The full-size ones are fetched on click only and stay out of git: they are rebuilt whenever Doc rearranges
// the deck (Doc, 17.09.2026: no rebuilt binaries in the repo).
//
// wrangler needs a login once, in a terminal:  npx wrangler login
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const BUCKET = 'gdw';

function wrangler(args, { quiet = false } = {}) {
    const r = spawnSync('npx', ['--yes', 'wrangler', ...args], { encoding: 'utf8' });
    const out = (r.stdout || '') + (r.stderr || '');
    if (r.status !== 0 && !quiet) {
        if (/Not logged in|CLOUDFLARE_API_TOKEN|auth token has expired/i.test(out)) {
            console.error('wrangler ist nicht angemeldet — einmal im Terminal: npx wrangler login');
        } else console.error(out.trim().split('\n').slice(-6).join('\n'));
        process.exit(1);
    }
    return { ok: r.status === 0, out };
}

function setup() {
    const made = wrangler(['r2', 'bucket', 'create', BUCKET], { quiet: true });
    console.log(made.ok ? 'Bucket angelegt: ' + BUCKET : 'Bucket ' + BUCKET + ' gibt es schon (oder: ' + made.out.trim().split('\n').pop() + ')');
    wrangler(['r2', 'bucket', 'dev-url', 'enable', BUCKET, '--force']);
    // the plan pages show the picture in an <img>, from docalvers.de and from localhost
    const cors = path.join(os.tmpdir(), 'gdw-cors.json');
    fs.writeFileSync(cors, JSON.stringify({
        rules: [{ allowed: { origins: ['*'], methods: ['GET', 'HEAD'], headers: ['*'] }, maxAgeSeconds: 3600 }],
    }));
    wrangler(['r2', 'bucket', 'cors', 'set', BUCKET, '--file', cors, '--force']);
    const url = wrangler(['r2', 'bucket', 'dev-url', 'get', BUCKET]).out.match(/https:\/\/pub-[0-9a-f]+\.r2\.dev/);
    console.log('Öffentliche Adresse:', url ? url[0] : '(nicht gefunden - wrangler r2 bucket dev-url get ' + BUCKET + ')');
    console.log('-> als GDW_BASE in HTML/svp/svp-plan-gdw.js eintragen, mit / am Ende.');
}

function publish(dir) {
    if (!dir || !fs.existsSync(dir)) {
        console.error('Aufruf: node tools/gdw_publish.mjs <ordner mit NN.webp> | --setup');
        process.exit(1);
    }
    const pics = fs.readdirSync(dir).filter((f) => /^\d+\.webp$/.test(f)).sort();
    if (!pics.length) { console.error('Keine NN.webp in ' + dir); process.exit(1); }
    for (const f of pics) {
        // a year's worth of thoughts never changes once it is up, so it may sit in the cache for a long time
        wrangler(['r2', 'object', 'put', BUCKET + '/' + f, '--file', path.join(dir, f),
            '--content-type', 'image/webp', '--cache-control', 'public, max-age=31536000', '--remote']);
        process.stdout.write(f.replace('.webp', '') + ' ');
    }
    console.log('\n' + pics.length + ' Bilder in ' + BUCKET + '/');
}

const arg = process.argv[2] || '';
if (arg === '--setup') setup(); else publish(arg);
