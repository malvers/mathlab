#!/usr/bin/env node
// Puts a live tour's voice online: Solita's MP3s and the texts she spoke go to the R2 bucket "tours", where the tour
// pages on docalvers.de find them (HTML/js/cyber-tour.js, MEDIA_BASE). Doc, 19.09.2026: "ja das zuerst ... R2".
//
//     node tools/tour_publish.mjs --setup          # once: bucket "tours", public r2.dev URL, CORS for GET
//     node tools/tour_publish.mjs wuerfelspiel     # ~/Movies/videopipeline/wuerfelspiel/sN.mp3 + tour.json
//
// Run it again after every new take (run1.mjs): the MP3s are replaced, tour.json gets a new version, and the pages
// ask for sN.mp3?v=<version> - nobody hears an old take out of a cache. The audio never goes into git: it changes
// with every take (Doc, 17.09.2026: no rebuilt binaries in the repo).
//
// wrangler needs a login once, in a terminal:  npx wrangler login
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const BUCKET = 'tours';

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
    // the pages fetch() the MP3s (the stage directions are found in the decoded audio) - from docalvers.de and localhost
    const cors = path.join(os.tmpdir(), 'tours-cors.json');
    fs.writeFileSync(cors, JSON.stringify({
        rules: [{ allowed: { origins: ['*'], methods: ['GET', 'HEAD'], headers: ['*'] }, maxAgeSeconds: 3600 }],
    }));
    wrangler(['r2', 'bucket', 'cors', 'set', BUCKET, '--file', cors, '--force']);
    const url = wrangler(['r2', 'bucket', 'dev-url', 'get', BUCKET]).out.match(/https:\/\/pub-[0-9a-f]+\.r2\.dev/);
    console.log('Öffentliche Adresse:', url ? url[0] : '(nicht gefunden - wrangler r2 bucket dev-url get ' + BUCKET + ')');
    console.log('-> als MEDIA_BASE in HTML/js/cyber-tour.js eintragen, mit / am Ende.');
}

function publish(tour) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(tour)) { console.error('Aufruf: node tools/tour_publish.mjs <tour-id> | --setup'); process.exit(1); }
    const work = path.join(os.homedir(), 'Movies', 'videopipeline', tour);
    const texts = JSON.parse(fs.readFileSync(path.join(work, 'texts.json'), 'utf8'));   // what run1 really spoke
    const ids = Object.keys(texts);
    const missing = ids.filter((id) => !fs.existsSync(path.join(work, id + '.mp3')));
    if (missing.length) { console.error('Es fehlen Tonspuren:', missing.join(' ')); process.exit(1); }
    for (const id of ids) {
        wrangler(['r2', 'object', 'put', BUCKET + '/' + tour + '/' + id + '.mp3', '--file', path.join(work, id + '.mp3'),
            '--content-type', 'audio/mpeg', '--cache-control', 'public, max-age=86400', '--remote']);
        process.stdout.write(id + ' ');
    }
    const manifest = path.join(os.tmpdir(), 'tour-' + tour + '.json');
    fs.writeFileSync(manifest, JSON.stringify({ version: new Date().toISOString(), texts }));
    wrangler(['r2', 'object', 'put', BUCKET + '/' + tour + '/tour.json', '--file', manifest,
        '--content-type', 'application/json; charset=utf-8', '--cache-control', 'no-cache', '--remote']);
    console.log('\n' + ids.length + ' Tonspuren + tour.json in ' + BUCKET + '/' + tour + '/');
}

const arg = process.argv[2] || '';
if (arg === '--setup') setup(); else publish(arg);
