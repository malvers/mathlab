// Worldclock demo video — reference implementation of the pipeline (produced weltzeituhr-demo.mp4).
// Run steps individually (comment in/out): record → check frames/marks → adjust cuts → assemble.
import { runScenes } from '../lib/record.mjs';
import { synthScenes } from '../lib/tts.mjs';
import { makeTalks } from '../lib/did.mjs';
import { buildScenes, compose } from '../lib/assemble.mjs';

const OUT = process.env.OUT || '/tmp/wcvideo';
const BASE = 'https://docalvers.de/worldclock/worldclock.html';
const PORTRAIT = new URL('../../HTML/resources/team/team_02.png', import.meta.url).pathname;

// ---------- 1) narration (SSML where pronunciation matters) ----------
const NARRATION = {
  s1: 'Willkommen zur Welt-Zeit-Uhr im Doc Alvers Mathe-Labor. Vierundzwanzig Städte, eine für jede Zeitzone, kreisen um den Nordpol. Die Karte dreht sich einmal am Tag — wie die Erde selbst. Orange heißt Sommerzeit, grau heißt Normalzeit.',
  s2: 'Und die Zeit kann man hier anfassen: Zieh am Ring, und alle Uhren der Welt drehen mit — sogar der Mond schaukelt mit. Loslassen, und alles federt zurück ins Jetzt.',
  s3: 'Ein Klick, und aus der Karte wird ein echter Globus. Fliegen wir nach Tokio: Foto, Einwohnerzahl aus Wikipedia — und das Wetter dort, live, mit Temperatur und Windrichtung.',
  s4: 'Deine Stadt ist nicht im Ring? Kein Problem. Tipp Kathmandu — die Uhr findet jeden Ort der Welt, holt sich seine Zeitzone und zeigt sofort die Ortszeit.',
  s5: 'Und jetzt das Beste: Ein Tastendruck — und die Uhr wird zum Planetarium. Zweitausendfünfhundert Sterne, achtundachtzig Sternbilder, die Milchstraße — alles live berechnet für genau diesen Ort und diesen Moment.',
  s6: 'Such dir ein Sternbild: Skorpion. Der ganze Himmel schwingt, bis es genau im Süden steht — und darüber legt sich die historische Sternkarte von 1822.',
  s7: '<speak>Drücken wir auf die Tube: tausendfache Zeit. Die Sterne ziehen ihre Bahnen, die Satelliten-Tabelle zählt runter — und wenn die Raumstation aufgeht, bremst die Zeit von selbst, damit du den Überflug genießen kannst. Da ist sie: die <say-as interpret-as="characters">ISS</say-as>.</speak>',
  s8: '<speak>Zurück im Jetzt. Die Welt-Zeit-Uhr: Uhr, Globus und Planetarium in einem — im Doc Alvers Mathe-Labor, auf doc alvers punkt <say-as interpret-as="characters">de</say-as>. Probier sie aus.</speak>',
};

// helper: the search input is repositioned by the draw loop every frame → focus it directly
async function searchType(page, jiggle, text) {
  await jiggle();
  await page.waitForFunction(() => !!document.getElementById('wc-search'));
  await page.evaluate(() => document.getElementById('wc-search').focus());
  await page.keyboard.type(text, { delay: 110 });
}
async function pickRow(page, re) {
  const row = re ? page.locator('#wc-search-drop div', { hasText: re }).first()
                 : page.locator('#wc-search-drop div').first();
  if (await row.count()) await row.dispatchEvent('mousedown'); else await page.keyboard.press('Enter');
}

// ---------- 2) scenes (choreography) ----------
const SCENES = [
  { name: 's1', url: BASE + '?lang=de', run: async (p, { jiggle }) => {   // opening beauty shot
      for (let i = 0; i < 4; i++) { await p.waitForTimeout(3500); await jiggle(); }
      await p.waitForTimeout(2000);
  } },
  { name: 's2', url: BASE + '?lang=de', run: async (p, { mark, jiggle }) => {   // select Dresden, drag the ring
      await p.waitForTimeout(3000);
      await searchType(p, jiggle, 'Dresden'); await p.waitForTimeout(700); await pickRow(p); mark('city');
      await p.waitForTimeout(1800);
      const cx = 640, cy = 350, r = 280; let a = Math.PI * 0.75;
      await p.mouse.move(cx + r * Math.cos(a), cy + r * Math.sin(a));
      await p.mouse.down(); mark('dragstart');
      for (let i = 0; i < 50; i++) { a += Math.PI * 0.011; await p.mouse.move(cx + r * Math.cos(a), cy + r * Math.sin(a)); await p.waitForTimeout(70); }
      await p.mouse.up(); mark('release');
      await p.waitForTimeout(2500); await jiggle(); await p.waitForTimeout(2500);
  } },
  { name: 's3', url: BASE + '?lang=de&globe=1', run: async (p, { mark, jiggle }) => {   // globe → Tokio + wiki/weather
      await p.waitForTimeout(6000);
      await searchType(p, jiggle, 'Tokio'); await p.waitForTimeout(600); await pickRow(p); mark('pick');
      for (let i = 0; i < 3; i++) { await p.waitForTimeout(3000); await jiggle(); }
  } },
  { name: 's4', url: BASE + '?lang=de&globe=1', run: async (p, { mark, jiggle }) => {   // world search via Nominatim
      await p.waitForTimeout(5000);
      await searchType(p, jiggle, 'Kathmandu'); await p.waitForTimeout(2200); await pickRow(p, /Kathmandu/i); mark('pick');
      for (let i = 0; i < 3; i++) { await p.waitForTimeout(2800); await jiggle(); }
  } },
  { name: 's5', url: BASE + '?lang=de', run: async (p, { mark, jiggle }) => {   // clock → planetarium crossfade
      await p.waitForTimeout(4500); await p.keyboard.press('s'); mark('sky');
      for (let i = 0; i < 3; i++) { await p.waitForTimeout(3300); await jiggle(); }
  } },
  { name: 's6', url: BASE + '?lang=de', run: async (p, { mark, jiggle }) => {   // Skorpion + Jamieson plate
      await p.waitForTimeout(2500); await p.keyboard.press('s'); await p.waitForTimeout(2500);
      await p.keyboard.press('f'); mark('search');
      await p.keyboard.type('Skorpion', { delay: 130 }); await p.waitForTimeout(600);
      await p.keyboard.press('Enter'); mark('enter');
      for (let i = 0; i < 3; i++) { await p.waitForTimeout(3200); await jiggle(); }
  } },
  { name: 's7', url: BASE + '?lang=de', run: async (p, { mark }) => {   // time-lapse until a GOOD ISS pass, zoom-follow it
      await p.waitForTimeout(2500); await p.keyboard.press('s'); await p.waitForTimeout(2500);
      await p.evaluate(() => {   // in-page camera rig: ease zoom/pan so the ISS stays centred
        const D2R = Math.PI / 180;
        window.__issInfo = () => {
          const sat = SAT_TLE[0];
          const rec = sat._rec || (sat._rec = satellite.twoline2satrec(sat.l1, sat.l2));
          const obs = { longitude: skyLon * D2R, latitude: skyLat * D2R, height: 0.1 };
          const ms = getDisplayTime().getTime();
          const at = (t) => {
            let pv; try { pv = satellite.propagate(rec, new Date(t)); } catch (_) { return null; }
            if (!pv || !pv.position) return null;
            const la = satellite.ecfToLookAngles(obs, satellite.eciToEcf(pv.position, satellite.gstime(new Date(t))));
            return [la.elevation / D2R, la.azimuth / D2R];
          };
          const now = at(ms); if (!now) return null;
          let maxEl = now[0];
          for (let dt = 60000; dt <= 720000; dt += 60000) { const e = at(ms + dt); if (!e || e[0] <= 0) break; maxEl = Math.max(maxEl, e[0]); }
          return { alt: now[0], az: now[1], maxEl };
        };
        window.__camTarget = null;
        const tick = () => {
          const t = window.__camTarget;
          if (t) {
            skyZoom += (t.z - skyZoom) * 0.055;
            const info = window.__issInfo();
            if (info && info.alt > 0) {
              const pp = (typeof projPersp !== 'undefined') ? projPersp : 0;
              const altR = info.alt * D2R, azR = info.az * D2R;
              const re = (Math.PI / 2 - altR) / (Math.PI / 2), ro = Math.cos(altR);
              const rr = (re * (1 - pp) + ro * pp) * Math.max(innerWidth, innerHeight) * 0.62 * skyZoom;
              skyPanX += (rr * Math.sin(azR) - skyPanX) * 0.08;
              skyPanY += (rr * Math.cos(azR) - skyPanY) * 0.08;
            }
          } else { skyZoom += (1 - skyZoom) * 0.06; skyPanX *= 0.94; skyPanY *= 0.94; }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await p.keyboard.press(' '); mark('lapse');
      for (let i = 0; i < 1400; i++) {   // up to ~6 min; skip passes below 20° max elevation
        await p.waitForTimeout(250);
        if (i % 12 === 0) await p.mouse.move(400 + (i % 24), 690);
        const st = await p.evaluate(() => {
          const cap = (document.getElementById('sky-info-slomo') || {}).textContent || '';
          const iss = /flyby.*iss/i.test(cap);
          const info = iss && window.__issInfo ? window.__issInfo() : null;
          return { iss, alt: info ? info.alt : null, maxEl: info ? info.maxEl : null };
        }).catch(() => ({ iss: false }));
        if (st.iss && st.alt > 1 && st.maxEl >= 20) {
          mark('isspass maxEl=' + st.maxEl.toFixed(0));
          await p.waitForTimeout(1200);
          await p.evaluate(() => { window.__camTarget = { z: 3.4 }; }); mark('zoomin');
          await p.waitForTimeout(9000);
          await p.evaluate(() => { window.__camTarget = null; }); mark('zoomout');
          await p.waitForTimeout(3500); mark('end'); break;
        }
      }
  } },
  { name: 's8', url: BASE + '?lang=de', run: async (p, { mark, jiggle }) => {   // planetarium → clock, branding outro
      await p.waitForTimeout(2500); await p.keyboard.press('s'); await p.waitForTimeout(3500);
      await p.keyboard.press('s'); mark('back');
      await p.waitForTimeout(1500); await jiggle(); await p.waitForTimeout(5500);
  } },
];

// ---------- 3) run the steps ----------
// await synthScenes(NARRATION, { outDir: OUT });
// await runScenes(SCENES, { outDir: OUT });
//
// 4) pick cut windows from the sN.json marks, verify with frame extraction (watch for
//    stray satellite captions in s7!), then:
// buildScenes([
//   { name: 'scene1', src: `${OUT}/s1.webm`, segments: [[6.5, 21]],                              len: 14.5, audio: `${OUT}/s1.mp3` },
//   { name: 'scene2', src: `${OUT}/s2.webm`, segments: [[8, 16], [31, 37.5]],                    len: 14.5, audio: `${OUT}/s2.mp3` },
//   { name: 'scene3', src: `${OUT}/s3.webm`, segments: [[6, 22.5]],                              len: 16.5, audio: `${OUT}/s3.mp3` },
//   { name: 'scene4', src: `${OUT}/s4.webm`, segments: [[8, 23]],                                len: 15,   audio: `${OUT}/s4.mp3` },
//   { name: 'scene5', src: `${OUT}/s5.webm`, segments: [[3.5, 17]],                              len: 13.5, audio: `${OUT}/s5.mp3` },
//   { name: 'scene6', src: `${OUT}/s6.webm`, segments: [[4, 19.5]],                              len: 15.5, audio: `${OUT}/s6.mp3` },
//   { name: 'scene7', src: `${OUT}/s7.webm`, segments: [[7.5, 11], [221.5, 236]],                len: 18,   audio: `${OUT}/s7.mp3` },  // B = around the isspass mark
//   { name: 'scene8', src: `${OUT}/s8.webm`, segments: [[5, 15]],                                len: 10,   audio: `${OUT}/s8.mp3` },
// ], { outDir: OUT });
//
// 5) Solita bubbles on intro / highlight / outro (at = scene offset + 0.5):
// const talks = await makeTalks(PORTRAIT, [`${OUT}/s1.mp3`, `${OUT}/s7.mp3`, `${OUT}/s8.mp3`], { outDir: OUT });
// compose(['scene1','scene2','scene3','scene4','scene5','scene6','scene7','scene8'],
//   [{ talk: `${OUT}/talk_s1.mp4`, at: 0.5 }, { talk: `${OUT}/talk_s7.mp4`, at: 90.10 }, { talk: `${OUT}/talk_s8.mp4`, at: 108.10 }],
//   { outDir: OUT, out: `${OUT}/weltzeituhr-demo.mp4` });
