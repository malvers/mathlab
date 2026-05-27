// worldclock-cityinfo.js — City info box (Wikipedia/Wikidata): fetch summary + image + population, position it.
// Globals used: formatPopulation (worldclock-util.js), window.useGlobe, the #city-info-* DOM. No shared worldclock state.
// Extracted from worldclock.js (Phase 1 refactor) — behaviour unchanged.

let cityInfoCurrentName = null;
let cityInfoFetchToken = 0;
const CITY_INFO_OVERRIDES = {
    "Kairo": "Kairo",
    "Bombay": "Mumbai",
    "Tokio": "Tokio",
    "Bagdad": "Bagdad",
    "Rio": "Rio de Janeiro",
    "Neuseeland": "Neuseeland",
    "Salomon-Inseln": "Salomonen",
    "Salomonische Inseln": "Salomonen",
    "Salomon inseln": "Salomonen",
    "San Francisco": "San Francisco",
    "Santa Fé": "Santa Fe (New Mexico)",
    "Azoren": "Azoren",
    "Kapverden": "Kap Verde",
    "Samoa": "Samoa",
    "Honolulu": "Honolulu",
    "Dawson": "Dawson City",
    "Karachi": "Karatschi",
    "Baku": "Baku",
    "Caracas": "Caracas",
    "Shanghai": "Shanghai",
    "Bangkok": "Bangkok",
    "Sydney": "Sydney",
    "Dakar": "Dakar",
    "Dresden": "Dresden",
    "New York": "New York City",
    "Chicago": "Chicago"
};

function fetchWikidataPopulation(qid) {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}&property=P1082&format=json&origin=*`;
    return fetch(url)
        .then(r => r.json())
        .then(d => {
            const claims = d.claims && d.claims.P1082;
            if (!claims || !claims.length) return null;
            // Pick most recent (largest pointInTime), else last entry
            let best = null, bestTime = '';
            for (const c of claims) {
                const amount = c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value && c.mainsnak.datavalue.value.amount;
                if (!amount) continue;
                let time = '';
                if (c.qualifiers && c.qualifiers.P585 && c.qualifiers.P585.length) {
                    time = c.qualifiers.P585[0].datavalue.value.time || '';
                }
                if (best === null || time > bestTime) {
                    best = parseFloat(amount);
                    bestTime = time;
                }
            }
            return best;
        })
        .catch(() => null);
}

function showCityInfo(cityName) {
    if (!window.useGlobe) { hideCityInfo(); return; }
    const cleanName = cityName.replace(/\n/g, ' ').trim();
    if (cityInfoCurrentName === cleanName) {
        const box = document.getElementById('city-info-box');
        box.style.display = 'flex';
        requestAnimationFrame(updateCityInfoBoxPosition);
        return;
    }
    cityInfoCurrentName = cleanName;
    const token = ++cityInfoFetchToken;

    const box = document.getElementById('city-info-box');
    const titleEl = document.getElementById('city-info-title');
    const extractEl = document.getElementById('city-info-extract');
    const loadingEl = document.getElementById('city-info-loading');
    const popEl = document.getElementById('city-info-pop');
    const imgWrap = document.getElementById('city-info-img-wrap');
    const imgEl = document.getElementById('city-info-img');

    box.style.display = 'flex';
    setTimeout(updateCityInfoBoxPosition, 0);
    titleEl.textContent = cleanName.toUpperCase();
    extractEl.textContent = '';
    popEl.textContent = '';
    popEl.style.display = 'none';
    loadingEl.style.display = 'block';
    imgWrap.style.display = 'none';
    const sourceElInit = document.getElementById('city-info-source');
    if (sourceElInit) sourceElInit.style.display = 'none';

    const query = CITY_INFO_OVERRIDES[cleanName] || cleanName;
    const deUrl = `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

    Promise.allSettled([
        fetch(deUrl).then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch(enUrl).then(r => r.ok ? r.json() : Promise.reject(r.status))
    ]).then(results => {
        if (token !== cityInfoFetchToken) return; // stale
        loadingEl.style.display = 'none';
        const de = results[0].status === 'fulfilled' ? results[0].value : null;
        const en = results[1].status === 'fulfilled' ? results[1].value : null;
        const primary = de || en;
        if (!primary) {
            extractEl.textContent = 'Info nicht verfügbar (Wikipedia).';
            return;
        }
        if (primary.title) titleEl.textContent = primary.title.toUpperCase();
        extractEl.textContent = primary.extract || 'Keine Beschreibung verfügbar.';

        // Prefer EN image (often skyline/landmark), fallback to DE
        let imgSrc = null;
        const enImg = en && (en.originalimage || en.thumbnail);
        const deImg = de && (de.originalimage || de.thumbnail);
        const img = enImg || deImg;
        if (img && img.source) imgSrc = img.source;
        const sourceEl = document.getElementById('city-info-source');
        if (imgSrc) {
            imgEl.src = imgSrc;
            imgWrap.style.display = 'block';
            const pageUrl = de?.content_urls?.desktop?.page || en?.content_urls?.desktop?.page;
            if (sourceEl && pageUrl) {
                sourceEl.href = pageUrl;
                sourceEl.style.display = 'block';
            } else if (sourceEl) {
                sourceEl.style.display = 'none';
            }
        } else if (sourceEl) {
            sourceEl.style.display = 'none';
        }

        // Try Wikidata for population
        const qid = (de && de.wikibase_item) || (en && en.wikibase_item);
        if (qid) {
            fetchWikidataPopulation(qid).then(pop => {
                if (token !== cityInfoFetchToken) return;
                if (pop) {
                    popEl.textContent = `EINWOHNER: ${formatPopulation(pop)}`;
                    popEl.style.display = 'block';
                }
            });
        }
    });
}

function hideCityInfo() {
    cityInfoCurrentName = null;
    const box = document.getElementById('city-info-box');
    if (box) box.style.display = 'none';
}

function updateCityInfoBoxPosition() {
    const box = document.getElementById('city-info-box');
    const canvasEl = document.getElementById('canvas');
    if (!box || !canvasEl) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const w = canvasRect.width;
    const h = canvasRect.height;
    const size = Math.min(w, h) * 0.8;
    const r = size / 2;
    const cx = w / 2;

    // Responsive Box-Breite zur Uhr-Größe
    const clamp = (lo, v, hi) => Math.max(lo, Math.min(hi, v));
    const boxWidth = clamp(160, r * 0.62, 340);
    box.style.width = boxWidth + 'px';

    // Responsive Schriftgrößen
    const titleSize = clamp(11, r * 0.042, 20);
    const popSize = clamp(9, r * 0.032, 16);
    const extractSize = clamp(10, r * 0.034, 16);
    const imgHeight = clamp(60, r * 0.36, 200);

    const titleEl = document.getElementById('city-info-title');
    const popEl = document.getElementById('city-info-pop');
    const extractEl = document.getElementById('city-info-extract');
    const loadingEl = document.getElementById('city-info-loading');
    const imgWrap = document.getElementById('city-info-img-wrap');

    if (titleEl) titleEl.style.fontSize = titleSize + 'px';
    if (popEl) popEl.style.fontSize = popSize + 'px';
    if (extractEl) {
        extractEl.style.fontSize = extractSize + 'px';
        extractEl.style.maxHeight = (h * 0.55) + 'px';
    }
    if (loadingEl) loadingEl.style.fontSize = extractSize + 'px';
    if (imgWrap) imgWrap.style.height = imgHeight + 'px';

    // Position der "18" auf dem Stundenring (links, bei 9-Uhr-Position)
    // angle für i=18: (12-18)*(2PI/24) - PI/2 = -PI  →  cos = -1
    // tx = cos(-PI) * (r * 1.15 - r * 0.022) = -r * 1.128
    const hourLabelInset = r * 0.022;
    const eighteenX = canvasRect.left + cx - (r * 1.15 - hourLabelInset);

    // Box rechts-Kante 40px links der "18"
    const newLeft = eighteenX - 40 - boxWidth;
    box.style.left = Math.max(0, newLeft) + 'px';
}
