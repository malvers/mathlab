#!/usr/bin/env node
// Puts a big binary online in the R2 bucket "media" instead of git: the three APKs, the background video, the ambient
// loop, the avatar model, the Pagode wiring photos. Doc, 17.09.2026: no rebuilt binaries in the repo; 27.09.2026
// (refactor audit): the ones still in git move out, the pages link to R2.
//
//     node tools/media_publish.mjs --setup                 # once, in a terminal: bucket "media", public r2.dev URL, CORS for GET
//     node tools/media_publish.mjs <file> [key]            # upload, read back, print the public URL
//     node tools/media_publish.mjs HTML/tracker/doc-alvers-tracker.apk        # key = path below HTML/ -> tracker/doc-alvers-tracker.apk
//
// After an APK rebuild: copy the APK nowhere, just publish it - the download links and tracker/version.json point here.
// wrangler needs a login once, in a terminal:  npx wrangler login
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';

const BUCKET = 'media';
const TYPES = {
    '.apk': 'application/vnd.android.package-archive', '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg',
    '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json',
};

function wrangler(args, { quiet = false } = {}) {
    const r = spawnSync('npx', ['--yes', 'wrangler', ...args], { encoding: 'utf8' });
    const out = (r.stdout || '') + (r.stderr || '');
    if (r.status !== 0 && !quiet) {
        if (/Not logged in|CLOUDFLARE_API_TOKEN|auth token has expired/i.test(out)) {
            console.error('wrangler ist nicht angemeldet - einmal im Terminal: npx wrangler login');
        } else console.error(out.trim().split('\n').slice(-6).join('\n'));
        process.exit(1);
    }
    return { ok: r.status === 0, out };
}

function publicBase() {
    const m = wrangler(['r2', 'bucket', 'dev-url', 'get', BUCKET]).out.match(/https:\/\/pub-[0-9a-f]+\.r2\.dev/);
    if (!m) { console.error('kein r2.dev-URL - erst: node tools/media_publish.mjs --setup'); process.exit(1); }
    return m[0] + '/';
}

function setup() {
    const made = wrangler(['r2', 'bucket', 'create', BUCKET], { quiet: true });
    console.log(made.ok ? 'Bucket angelegt: ' + BUCKET : 'Bucket ' + BUCKET + ' gibt es schon (oder: ' + made.out.trim().split('\n').pop() + ')');
    wrangler(['r2', 'bucket', 'dev-url', 'enable', BUCKET, '--force']);
    // the avatar model is fetched by three.js (GLTFLoader) from docalvers.de and localhost - that needs CORS for GET
    const cors = path.join(os.tmpdir(), 'media-cors.json');
    fs.writeFileSync(cors, JSON.stringify({
        rules: [{ allowed: { origins: ['*'], methods: ['GET', 'HEAD'], headers: ['*'] }, maxAgeSeconds: 3600 }],
    }));
    wrangler(['r2', 'bucket', 'cors', 'set', BUCKET, '--file', cors, '--force']);
    console.log('Öffentliche Adresse:', publicBase());
}

async function publish(file, key) {
    if (!fs.existsSync(file)) { console.error('Datei fehlt: ' + file); process.exit(1); }
    const rel = path.relative(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'HTML'), path.resolve(file));
    key = key || (rel.startsWith('..') ? path.basename(file) : rel.split(path.sep).join('/'));
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    // an APK is replaced by every build, the media files hardly ever - the cache may hold them for a day
    const cache = type === TYPES['.apk'] ? 'public, max-age=3600' : 'public, max-age=86400';
    wrangler(['r2', 'object', 'put', BUCKET + '/' + key, '--file', file, '--content-type', type, '--cache-control', cache, '--remote']);
    const url = publicBase() + key.split('/').map(encodeURIComponent).join('/');
    // read back before anything links here: same size as the local file, or the upload is not trusted
    const head = await fetch(url, { method: 'HEAD' });
    const size = Number(head.headers.get('content-length'));
    const local = fs.statSync(file).size;
    if (!head.ok || size !== local) { console.error('Rücklesen fehlgeschlagen: HTTP ' + head.status + ', ' + size + ' statt ' + local + ' Bytes'); process.exit(1); }
    console.log((local / 1048576).toFixed(2) + ' MB  ' + url);
    return url;
}

const [arg, key] = process.argv.slice(2);
if (!arg || arg === '--help') {
    console.log('node tools/media_publish.mjs --setup | <file> [key]');
} else if (arg === '--setup') {
    setup();
} else {
    await publish(arg, key);
}
