#!/usr/bin/env node
/* Internal CLI that publishes one finished lab demo to Doc Alvers' own YouTube channel.
 *
 * It is the last step of the video pipeline: a lab is recorded headlessly (lib/record-cdp.mjs),
 * narrated (lib/tts.mjs), cut together (lib/assemble.mjs) — and this command hands the finished mp4
 * to the YouTube Data API v3. One video per invocation, always started by hand.
 *
 *   node youtube-upload.mjs --auth                     one-time OAuth consent (opens the browser)
 *   node youtube-upload.mjs videos/intro-1440p.mp4 --meta [--privacy private] [--dry-run]
 *   node youtube-upload.mjs <file> --title "…" --description-file <path> --tags "a,b,c"
 *
 * --meta takes title, description and tags from videos/youtube-metadaten.md, where every finished
 * video already has its section — that file is the single place the wording is maintained.
 *
 * Scope used: https://www.googleapis.com/auth/youtube.upload (upload only, nothing else).
 * Credentials: ~/.config/docalvers-videos/client_secret.json, token cached alongside with mode 0600.
 * Default visibility is "private" — the API forces it anyway until the compliance review is passed.
 */
import fs from 'fs';
import path from 'path';
import { authorize, uploadVideo } from './lib/youtube.mjs';
import { VIDEO_LIB } from './lib/paths.mjs';

const META_FILE = path.join(VIDEO_LIB, 'youtube-metadaten.md');

function parseArgs(argv) {
  const out = { flags: new Set(), opts: {}, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--auth' || a === '--meta' || a === '--dry-run') out.flags.add(a.replace(/^--/, ''));
    else if (a.startsWith('--')) out.opts[a.slice(2)] = argv[++i];
    else out.file = a;
  }
  return out;
}

/* One section per video in youtube-metadaten.md:
     ## <filename> (optional note)
     **Titel:** …
     **Beschreibung:** … (may run over several lines)
     **Tags:** a, b, c                                          */
function metaFor(basename) {
  if (!fs.existsSync(META_FILE)) throw new Error('Metadata file missing: ' + META_FILE);
  const text = fs.readFileSync(META_FILE, 'utf8');
  const start = text.split('\n').findIndex((l) => l.startsWith('## ') && l.includes(basename));
  if (start < 0) throw new Error('No section "## ' + basename + '" in ' + META_FILE);
  const lines = text.split('\n').slice(start + 1);
  const end = lines.findIndex((l) => l.startsWith('## '));
  const block = (end < 0 ? lines : lines.slice(0, end));

  const field = (label) => {
    const i = block.findIndex((l) => l.startsWith('**' + label + ':**'));
    if (i < 0) return '';
    const rest = [block[i].slice(('**' + label + ':**').length).trim()];
    for (let j = i + 1; j < block.length && !block[j].startsWith('**'); j++) rest.push(block[j]);
    return rest.join('\n').trim();
  };
  const tags = field('Tags');
  return {
    title: field('Titel'),
    description: field('Beschreibung'),
    tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
  };
}

const args = parseArgs(process.argv.slice(2));

if (args.flags.has('auth')) {
  await authorize();
  console.log('✓ access granted — token stored in ~/.config/docalvers-videos/token.json');
  process.exit(0);
}

if (!args.file) {
  console.error('Usage: node youtube-upload.mjs <video.mp4> --meta [--privacy private] [--dry-run]');
  console.error('       node youtube-upload.mjs --auth          (one time)');
  process.exit(1);
}

const file = path.resolve(args.file);
if (!fs.existsSync(file)) { console.error('File not found: ' + file); process.exit(1); }

const meta = args.flags.has('meta')
  ? metaFor(path.basename(file))
  : {
      title: args.opts.title || '',
      description: args.opts['description-file']
        ? fs.readFileSync(args.opts['description-file'], 'utf8')
        : (args.opts.description || ''),
      tags: (args.opts.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    };

if (!meta.title) { console.error('No title — pass either --meta or --title.'); process.exit(1); }
if (meta.title.length > 100) { console.error('Title too long (100 characters max).'); process.exit(1); }

const privacy = args.opts.privacy || 'private';
if (!['private', 'unlisted', 'public'].includes(privacy)) {
  console.error('--privacy must be private, unlisted or public.');
  process.exit(1);
}

const id = await uploadVideo(file, { ...meta, privacy, dryRun: args.flags.has('dry-run') });
if (id) console.log('   Studio: https://studio.youtube.com/video/' + id + '/edit');
