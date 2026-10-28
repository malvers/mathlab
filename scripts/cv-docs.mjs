/* Encrypt the document scans behind the "Dokumente" button of HTML/cv.html.

   Input:  the prepared web JPEGs – pages 1400 px wide, the first page of each
           document also as <page>-thumb.jpg (360 px) – in
           ~/PRIVAT MRA/Bewerbungen/cv-docs-web. They never enter this public repo.
   Output: HTML/resources/cv-docs/<name>.bin and key.json.
   The password comes from the macOS Keychain (service "docalvers-cv-dokumente")
   and is never printed.

   Scheme: one random data key K (AES-GCM-256) seals every file as
   "CVD1" | iv 12 | ciphertext+tag. key.json holds K wrapped with
   PBKDF2-SHA256(password) and a check blob that tells the page whether a key
   remembered on a device still fits. The iv is an HMAC of the file's bytes, so
   an unchanged scan gives an unchanged .bin (no churn in git). K stays the same
   while the password still opens key.json; a new password makes a new K, which
   locks every remembered device again.

   Run: node scripts/cv-docs.mjs [source dir] [output dir]
   With an output dir (e.g. HTML/resources/real-salary for the-real-salary.html) the same key
   seals another folder – .jpg and .json files – so a device that has opened the CV documents
   opens that page too. key.json stays in cv-docs and is never replaced from there. */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createCipheriv, createDecipheriv, createHmac, randomBytes, pbkdf2Sync } from "node:crypto";
import { homedir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = process.argv[2] || join(homedir(), "PRIVAT MRA/Bewerbungen/cv-docs-web");
const KEY_DIR = join(dirname(fileURLToPath(import.meta.url)), "../HTML/resources/cv-docs");
const OUT = process.argv[3] ? resolve(process.argv[3]) : KEY_DIR;
const KEY_FILE = join(KEY_DIR, "key.json");
const SEALS = /\.(jpg|json)$/;
const ITER = 600000;
const MAGIC = Buffer.from("CVD1");

function seal(key, iv, plain) {
  const c = createCipheriv("aes-256-gcm", key, iv);
  return Buffer.concat([c.update(plain), c.final(), c.getAuthTag()]);
}

function unseal(key, iv, data) {
  const d = createDecipheriv("aes-256-gcm", key, iv);
  d.setAuthTag(data.subarray(data.length - 16));
  return Buffer.concat([d.update(data.subarray(0, data.length - 16)), d.final()]);
}

let pw;
try {
  pw = execFileSync("security", ["find-generic-password", "-s", "docalvers-cv-dokumente", "-w"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).replace(/\n$/, "");
} catch {
  console.error("Kein Passwort im Schlüsselbund (Dienst „docalvers-cv-dokumente“).");
  process.exit(1);
}

/* the data key: reuse it while the password still opens key.json */
let K = null;
let keyFile = null;
if (existsSync(KEY_FILE)) {
  keyFile = JSON.parse(readFileSync(KEY_FILE, "utf8"));
  try {
    const kek = pbkdf2Sync(pw, Buffer.from(keyFile.salt, "base64"), keyFile.iter, 32, "sha256");
    K = unseal(kek, Buffer.from(keyFile.iv, "base64"), Buffer.from(keyFile.key, "base64"));
  } catch {
    console.log("Neues Passwort → neuer Schlüssel, gemerkte Geräte fragen wieder nach dem Passwort.");
  }
}
if (!K && OUT !== KEY_DIR) {
  /* a new key here would lock the CV documents out of their own scans */
  console.error("Der Schlüssel der CV-Dokumente passt nicht – erst node scripts/cv-docs.mjs ohne Ausgabeordner.");
  process.exit(1);
}
if (!K) {
  K = randomBytes(32);
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const civ = randomBytes(12);
  const kek = pbkdf2Sync(pw, salt, ITER, 32, "sha256");
  keyFile = {
    v: 1, iter: ITER,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    key: seal(kek, iv, K).toString("base64"),
    check: Buffer.concat([civ, seal(K, civ, Buffer.from("cv-docs"))]).toString("base64")
  };
  writeFileSync(KEY_FILE, JSON.stringify(keyFile, null, 2) + "\n");
}

const macKey = createHmac("sha256", K).update("cv-docs iv").digest();
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter((f) => SEALS.test(f)).sort();
const names = files.map((f) => f.replace(SEALS, ""));
let written = 0;
for (const [i, name] of names.entries()) {
  const plain = readFileSync(join(SRC, files[i]));
  const iv = createHmac("sha256", macKey).update(plain).digest().subarray(0, 12);
  const bin = Buffer.concat([MAGIC, iv, seal(K, iv, plain)]);
  const target = join(OUT, name + ".bin");
  if (existsSync(target) && readFileSync(target).equals(bin)) continue;
  writeFileSync(target, bin);
  written++;
}

const stale = readdirSync(OUT).filter((f) => f.endsWith(".bin") && !names.includes(f.slice(0, -4)));
console.log(`${names.length} Dateien, ${written} neu geschrieben.`);
if (stale.length) console.log("Ohne Quelle (nicht gelöscht): " + stale.join(", "));
