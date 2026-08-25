/* fuzzy-engine.js — character-trigram fuzzy full-text search with a per-character heat-map.
 *
 * Re-creation of Doc Alvers' 2003 "Fuzzy Search Test" (Win32). Measured on the original
 * screenshot: the heat is per CHARACTER, not per word — every character gets as much colour
 * as query trigrams cover it (0..3), with a short spill-over into the 1–2 neighbouring
 * characters, and trigrams run over the whole text including the spaces between words
 * ("n w" from "designation will"). That yields contiguous blobs whose intensity peaks in
 * the middle of a matching phrase, exactly like the 2003 tool.
 *
 * Ranking: windows of |query tokens| consecutive words, scored by the (multiset-capped)
 * share of the query's word trigrams they contain — 100 % for an exact match, still high
 * with typos.
 *
 * Optional IDF mode weights every trigram by its rarity, so frequent fragments ("tha",
 * "as ", "on ") stop dominating heat and ranking.
 *
 * No DOM access — usable as classic <script> (window.FuzzyEngine) and in Node (tests).
 *
 *   const eng = FuzzyEngine.build(text);
 *   const res = eng.search('that designation will do as', { idf: false, maxHits: 60 });
 *   res.charHeat[p] → 0..1 heat of character p (Float32Array, buffer reused per search)
 *   res.hits[j]     → { tok, k, score, start, end } ranked windows (char offsets)
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FuzzyEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WORD_RE = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
  const NON_WORD_RE = /[^\p{L}\p{N}'’]/gu;
  // Smoothing of the per-character coverage (0..3 covering trigrams): triangular kernel of
  // radius R — measured on the 2003 screenshot, the red fades to white over ~8–10 characters
  // and neighbouring matches merge into one hill ("that he will die at" peaks on "will").
  const R = 4;
  const KERNEL = [];
  for (let d = -R; d <= R; d++) KERNEL.push(1 - Math.abs(d) / (R + 1));
  const HEAT_NORM = 3 * KERNEL.reduce((a, b) => a + b, 0); // heat of a character deep inside a long match
  const foldCache = new Map();

  // Lower-case + strip diacritics ONE code unit at a time, so offsets stay identical to the source.
  function foldChar(ch) {
    let f = foldCache.get(ch);
    if (f !== undefined) return f;
    let l = ch.toLowerCase();
    if (l.length !== 1) l = ch;
    const d = l.normalize('NFD');
    f = (d.length > 1 && /^[\p{L}\p{N}][\u0300-\u036f]+$/u.test(d)) ? d[0] : l;
    foldCache.set(ch, f);
    return f;
  }

  function fold(text) {
    return text.replace(/[A-Z]+/g, (m) => m.toLowerCase()).replace(/[^\x00-\x7f]/g, foldChar);
  }

  // Trigrams of a (folded) word padded with one space on each side: "hat" → " ha", "hat", "at ".
  function trigramsOf(word) {
    const p = ' ' + word + ' ';
    const out = new Array(p.length - 2);
    for (let i = 0; i < out.length; i++) out[i] = p.substr(i, 3);
    return out;
  }

  // Numeric key of the trigram starting at position p (3 UTF-16 code units → exact double).
  function rawKey(s, p) {
    return s.charCodeAt(p) * 4294967296 + s.charCodeAt(p + 1) * 65536 + s.charCodeAt(p + 2);
  }

  function tokenize(folded) {
    const starts = [];
    const ends = [];
    const words = [];
    for (const m of folded.matchAll(WORD_RE)) {
      starts.push(m.index);
      ends.push(m.index + m[0].length);
      words.push(m[0]);
    }
    return { starts, ends, words };
  }

  function build(text) {
    const t0 = now();
    const folded = fold(text);
    const tk = tokenize(folded);
    const N = tk.words.length;
    const tokStart = Int32Array.from(tk.starts);
    const tokEnd = Int32Array.from(tk.ends);
    const tokType = new Int32Array(N);

    // ---- word level: types, padded-word trigrams, document frequency (for ranking) ----
    const typeId = new Map();
    const typeWord = [];
    const typeCount = [];
    for (let i = 0; i < N; i++) {
      const w = tk.words[i];
      let id = typeId.get(w);
      if (id === undefined) {
        id = typeWord.length;
        typeId.set(w, id);
        typeWord.push(w);
        typeCount.push(0);
      }
      typeCount[id]++;
      tokType[i] = id;
    }
    const T = typeWord.length;

    const triId = new Map();
    const df = [];
    const typeTris = new Array(T);
    for (let ty = 0; ty < T; ty++) {
      const tris = trigramsOf(typeWord[ty]);
      const ids = new Int32Array(tris.length);
      const seen = new Set();
      for (let j = 0; j < tris.length; j++) {
        let id = triId.get(tris[j]);
        if (id === undefined) {
          id = df.length;
          triId.set(tris[j], id);
          df.push(0);
        }
        ids[j] = id;
        if (!seen.has(id)) {
          seen.add(id);
          df[id] += typeCount[ty];
        }
      }
      typeTris[ty] = ids;
    }
    const G = df.length;
    const idf = new Float32Array(G);
    for (let g = 0; g < G; g++) idf[g] = Math.log((N + 1) / (df[g] + 1));
    const unknownIdf = Math.log(N + 1); // a query trigram absent from the corpus (df = 0)

    // ---- character level: trigram id at every text position (for the heat-map) ----
    // Punctuation and line breaks count as spaces, so "Mall," still matches "ll ".
    const matchText = folded.replace(NON_WORD_RE, ' ');
    const L = matchText.length;
    const rawId = new Map();
    const rawDf = [];
    const triAt = new Int32Array(Math.max(0, L - 2));
    for (let p = 0; p + 2 < L; p++) {
      const key = rawKey(matchText, p);
      let id = rawId.get(key);
      if (id === undefined) {
        id = rawDf.length;
        rawId.set(key, id);
        rawDf.push(0);
      }
      rawDf[id]++;
      triAt[p] = id;
    }
    const PAD = R + 2;
    const mBuf = new Float32Array(L + 2 * PAD);  // trigram weight per start position (zero-padded)
    const cBuf = new Float32Array(L + 2 * PAD);  // coverage per character (zero-padded)
    const sBuf = new Float32Array(L + 2 * PAD);  // first box-sum pass
    const charHeat = new Float32Array(L);        // reused result buffer

    const engine = {
      text, folded, N, T, G,
      tokStart, tokEnd, tokType, typeWord, typeCount, typeTris, idf, df,
      buildMs: now() - t0,
      search: null,
      tokenAt: null,
      snippetRange: null,
    };

    // ---- search -----------------------------------------------------------------------------
    engine.search = function search(query, opts) {
      opts = opts || {};
      const useIdf = !!opts.idf;
      const maxHits = opts.maxHits || 60;
      const minScore = opts.minScore != null ? opts.minScore : 0.2;
      const t1 = now();
      const qFolded = fold(query || '');
      const qTokens = tokenize(qFolded).words;
      const empty = { qTokens, k: 0, charHeat: null, hits: [], ms: 0, candidates: 0 };
      if (!qTokens.length || N === 0) return empty;

      // ---- heat-map: weight per raw trigram of the whole query string (cross-word included) ----
      // No boundary padding (as in 2003): the last character of a match is covered by one trigram
      // only, so every match ends in a natural 3-character ramp. Very short queries get padded,
      // otherwise "as" would have no trigram at all.
      let qRaw = qFolded.replace(NON_WORD_RE, ' ').replace(/\s+/g, ' ').trim();
      if (qRaw.length < 4) qRaw = ' ' + qRaw + ' ';
      const qw = new Float32Array(rawDf.length);
      const qIds = [];
      let maxW = 0;
      for (let p = 0; p + 2 < qRaw.length; p++) {
        const id = rawId.get(rawKey(qRaw, p));
        if (id === undefined) continue;
        const v = useIdf ? Math.log((L + 1) / (rawDf[id] + 1)) : 1;
        if (qw[id] === 0) qIds.push(id);
        qw[id] = Math.max(qw[id], v);
        maxW = Math.max(maxW, v);
      }
      if (useIdf && maxW > 0) for (const id of qIds) qw[id] /= maxW;

      // Normalise per query: the peak the query reaches against ITSELF is 1.0. A 2-letter query
      // has only two trigrams (max coverage 2, further diluted by the smoothing) and would
      // otherwise never get past pale pink; for long queries this equals the generic HEAT_NORM.
      let normQ = 0;
      {
        const n = qRaw.length;
        const mq = new Float32Array(n + 2 * PAD), cq = new Float32Array(n + 2 * PAD);
        for (let p = 0; p + 2 < n; p++) {
          const id = rawId.get(rawKey(qRaw, p));
          mq[p + PAD] = id === undefined ? 0 : qw[id];
        }
        for (let p = 0; p < n; p++) cq[p + PAD] = mq[p + PAD] + mq[p + PAD - 1] + mq[p + PAD - 2];
        for (let p = 0; p < n; p++) {
          let h = 0;
          for (let d = -R; d <= R; d++) h += KERNEL[d + R] * cq[p + PAD + d];
          if (h > normQ) normQ = h;
        }
        if (normQ <= 0) normQ = HEAT_NORM;
      }

      // m[p] = weight of the trigram starting at p → coverage c[p] = m[p] + m[p-1] + m[p-2] (0..3)
      // → heat = triangular smoothing of the coverage, 1.0 at the level of an exact query match.
      const m = mBuf, c = cBuf;
      for (let p = 0; p + 2 < L; p++) m[p + PAD] = qw[triAt[p]];
      for (let p = Math.max(0, L - 2); p < L; p++) m[p + PAD] = 0;
      for (let p = 0; p < L; p++) c[p + PAD] = m[p + PAD] + m[p + PAD - 1] + m[p + PAD - 2];
      // Triangle of radius R = box(R+1) ∗ box(R+1) / (R+1): two running-sum passes instead of 2R+1 taps.
      const W = R + 1, HALF = R >> 1; // box [p-HALF, p-HALF+W-1]; two passes centre the result
      const s = sBuf;
      let acc = 0;
      for (let p = 0; p < L + 2 * PAD; p++) {
        acc += c[p];
        if (p >= W) acc -= c[p - W];
        s[p] = acc; // box ending at p, i.e. centred at p - HALF
      }
      acc = 0;
      for (let p = 0; p < L + 2 * PAD; p++) {
        acc += s[p];
        if (p >= W) acc -= s[p - W];
        const q = p - 2 * HALF - PAD; // centre of the composite window
        if (q >= 0 && q < L) charHeat[q] = acc >= normQ * W ? 1 : acc / (normQ * W);
      }

      // ---- ranking: query word-trigram multiset + total weight ----
      const cQ = new Int32Array(G);
      const wt = (g) => (useIdf ? idf[g] : 1);
      let qTotal = 0;
      for (const qt of qTokens) {
        for (const tri of trigramsOf(qt)) {
          const g = triId.get(tri);
          if (g !== undefined) cQ[g]++;
          qTotal += g === undefined ? (useIdf ? unknownIdf : 1) : wt(g);
        }
      }

      // Sliding window of k tokens: score = capped weighted recall of the query's trigrams.
      const k = qTokens.length;
      const cW = new Int32Array(G);
      let num = 0;
      const scores = new Float32Array(N);
      const add = (ty) => {
        const ids = typeTris[ty];
        for (let j = 0; j < ids.length; j++) {
          const g = ids[j];
          if (cQ[g] > 0) { cW[g]++; if (cW[g] <= cQ[g]) num += wt(g); }
        }
      };
      const remove = (ty) => {
        const ids = typeTris[ty];
        for (let j = 0; j < ids.length; j++) {
          const g = ids[j];
          if (cQ[g] > 0) { if (cW[g] <= cQ[g]) num -= wt(g); cW[g]--; }
        }
      };
      for (let i = 0; i < N; i++) {
        add(tokType[i]);
        if (i >= k) remove(tokType[i - k]);
        if (i >= k - 1) scores[i - k + 1] = num / qTotal;
      }

      // Best non-overlapping windows.
      const cands = [];
      for (let i = 0; i + k <= N; i++) if (scores[i] >= minScore) cands.push(i);
      cands.sort((a, b) => (scores[b] - scores[a]) || (a - b));
      const taken = new Uint8Array(N);
      const hits = [];
      for (let c = 0; c < cands.length && hits.length < maxHits; c++) {
        const i = cands[c];
        let free = true;
        for (let j = i; j < i + k; j++) if (taken[j]) { free = false; break; }
        if (!free) continue;
        for (let j = i; j < i + k; j++) taken[j] = 1;
        hits.push({ tok: i, k, score: Math.min(1, scores[i]), start: tokStart[i], end: tokEnd[i + k - 1] });
      }
      return { qTokens, k, charHeat, hits, ms: now() - t1, candidates: cands.length };
    };

    // Index of the first token whose start >= pos (binary search).
    engine.tokenAt = function tokenAt(pos) {
      let lo = 0, hi = N;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tokStart[mid] < pos) lo = mid + 1; else hi = mid;
      }
      return lo;
    };

    // Context window around a hit, trimmed to word boundaries: { from, to, cutLeft, cutRight }.
    engine.snippetRange = function snippetRange(hit, ctx) {
      ctx = ctx || 90;
      let from = Math.max(0, hit.start - ctx);
      let to = Math.min(text.length, hit.end + ctx);
      if (from > 0) {
        const sp = text.indexOf(' ', from);
        if (sp !== -1 && sp < hit.start) from = sp + 1;
      }
      if (to < text.length) {
        const sp = text.lastIndexOf(' ', to);
        if (sp !== -1 && sp > hit.end) to = sp;
      }
      return { from, to, cutLeft: from > 0, cutRight: to < text.length };
    };

    return engine;
  }

  function now() {
    return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  return { build, fold, trigramsOf, WORD_RE, KERNEL };
});
