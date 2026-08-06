/* Generate the five CV PDFs (DE/EN/ES/FR/IT) from HTML/cv.html.
   Output: ~/Downloads/cv-pdfs/cv-michael-alvers-<lang>.pdf
   The footer (name + doc title + "page X of Y") is drawn into the real page
   margin by Chrome's footerTemplate – it can never collide with content.

   Normal use: double-click scripts/cv-pdfs.command (installs tooling on
   first run). Requires the local server on :8765 (serve-8765.py). */
import puppeteer from "puppeteer-core";
import { mkdirSync, globSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));

/* Chrome for Testing lives next to this script (installed by cv-pdfs.command);
   CHROME_PATH env var overrides. */
const CHROME = process.env.CHROME_PATH || globSync(join(DIR,
  "chrome/*/chrome-mac-*/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"))[0];
if (!CHROME) {
  console.error("Chrome for Testing fehlt – bitte über scripts/cv-pdfs.command starten (macht das Setup).");
  process.exit(1);
}

try {
  await fetch("http://localhost:8765/cv.html", { method: "HEAD" });
} catch {
  console.error("Lokaler Server antwortet nicht – bitte serve-8765.py (Port 8765) starten.");
  process.exit(1);
}

const OUT = join(homedir(), "Downloads", "cv-pdfs");
mkdirSync(OUT, { recursive: true });

const LANGS = {
  de: { doc: "Lebenslauf",       page: (n, t) => `Seite ${n} von ${t}` },
  en: { doc: "Curriculum Vitae", page: (n, t) => `Page ${n} of ${t}` },
  es: { doc: "Currículum Vítae", page: (n, t) => `Página ${n} de ${t}` },
  fr: { doc: "Curriculum Vitae", page: (n, t) => `Page ${n} sur ${t}` },
  it: { doc: "Curriculum Vitae", page: (n, t) => `Pagina ${n} di ${t}` },
};

/* Chrome header/footer templates cannot use webfonts – system sans only.
   pageNumber/totalPages spans are substituted by Chrome itself. */
function footerTemplate(lang) {
  const { doc, page } = LANGS[lang];
  const pageHtml = page('<span class="pageNumber"></span>', '<span class="totalPages"></span>');
  return `<div style="width:100%; text-align:center; font-family:Helvetica,Arial,sans-serif;
    font-size:7px; color:#8a9097; letter-spacing:1.4px;">
    Dr. Michael R. Alvers &nbsp;&middot;&nbsp; ${doc} &nbsp;&middot;&nbsp; docalvers.de &nbsp;&middot;&nbsp; ${pageHtml}</div>`;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  pipe: true, /* CDP over stdio – no debug port needed */
  args: [
    "--user-data-dir=" + join(OUT, ".chrome-profile"),
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
  ],
});

try {
  const page = await browser.newPage();
  for (const lang of Object.keys(LANGS)) {
    /* ?pdf=1 hides the in-page print footer – Chrome's template replaces it */
    await page.goto(`http://localhost:8765/cv.html?lang=${lang}&pdf=1`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready); /* Orbitron loaded */
    const path = join(OUT, `cv-michael-alvers-${lang}.pdf`);
    await page.pdf({
      path,
      format: "A4",
      printBackground: false,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: footerTemplate(lang),
      margin: { top: "12mm", right: "15mm", bottom: "18mm", left: "15mm" },
    });
    console.log("OK", path);
  }
} finally {
  await browser.close();
}
