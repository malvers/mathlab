#!/usr/bin/env node
// Seal a built DocPoint deck behind a password - for any deck, the page opens through HTML/decks/deck-lock.js.
//
//     node tools/pptx/deck_seal.mjs HTML/decks/palliativversorgung.html
//
// The slides (and the narration/summary JSON, which repeat their content) leave the page and come back as one
// AES-GCM blob in <script id="sealed">; deck.js is replaced by deck-lock.js, which asks for the password,
// decrypts, puts the slides back and only then loads deck.js. Key: PBKDF2-SHA256 over the password.
//
// The password never enters the repo (Rule 21): it comes from DECK_PASSWORD or from the macOS Keychain,
// service "docpoint-deck-<deck name>" (security add-generic-password -a doc -s docpoint-deck-<name> -w ...).
// The same Web Crypto as in the browser, so both ends agree byte for byte.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ITER = 600000;
const file = process.argv[2];
if (!file) { console.error('usage: node deck_seal.mjs <deck.html>'); process.exit(2); }
const name = path.basename(file, '.html');
let html = fs.readFileSync(file, 'utf8');
if (html.includes('<script id="sealed"')) { console.error(file + ': already sealed'); process.exit(1); }

let pw = process.env.DECK_PASSWORD;
if (!pw) {
  try {
    pw = execFileSync('security', ['find-generic-password', '-s', 'docpoint-deck-' + name, '-w'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\n$/, '');
  } catch { }
}
if (!pw) { console.error('no password: set DECK_PASSWORD or the Keychain entry docpoint-deck-' + name); process.exit(1); }

// cut out exactly one piece of the page, assert it is there once
function take(re, what) {
  const all = [...html.matchAll(new RegExp(re.source, 'g'))];
  if (all.length !== 1) { console.error(file + ': ' + what + ' found ' + all.length + ' times'); process.exit(1); }
  return all[0];
}
const deck = take(/<div id="deck">([\s\S]*?)<\/div><\/div>\n<div id="bar">/, 'the slides');
const narr = take(/<script id="narration" type="application\/json">([\s\S]*?)<\/script>/, 'narration');
const summ = take(/<script id="summary" type="application\/json">([\s\S]*?)<\/script>/, 'summary');
take(/<script src="deck\.js"><\/script>/, 'deck.js');

const payload = new TextEncoder().encode(JSON.stringify({ slides: deck[1], narration: narr[1], summary: summ[1] }));
const { subtle } = globalThis.crypto;
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
const key = await subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base,
  { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv }, key, payload));
const b64 = (u) => Buffer.from(u).toString('base64');
const blob = JSON.stringify({ v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) });

html = html.replace(deck[0], '<div id="deck"></div></div>\n<div id="bar">')
  .replace(narr[0], '<script id="narration" type="application/json"></script>')
  .replace(summ[0], '<script id="summary" type="application/json">{}</script>')
  .replace('<script src="deck.js"></script>', '<script id="sealed" type="application/json">' + blob +
    '</script>\n<script src="deck-lock.js"></script>');
fs.writeFileSync(file, html);
console.log(file + '  versiegelt (' + Math.round(ct.length / 1024) + ' KB)');
