// German speech for school formulas: TeX is tidied before Speech Rule Engine reads it, its words are tidied after.
// Draft for the listening test (Doc, 17.09.2026: "Latex vorlesen ist ein Projekt") - later moves into the deck shell.
(function (root) {
  // before SRE: TeX it reads badly
  const PRE = [
    [/\^\s*\{?\\circ\}?/g, '\\text{ Grad}'],                 // 90^\circ read as "9 0 hoch verknüpft mit"
    // partial derivative: "Bruch mit Zähler partielle Ableitung v und Nenner partielle Ableitung t" (Navier-Stokes, 17.09.2026)
    [/\\d?frac\s*\{\s*\\partial\s*([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{\s*\\partial\s*([^{}]*)\}/g,
     (m, f, x) => '\\text{ die partielle Ableitung von } ' + f + ' \\text{ nach } ' + x],
    [/\\Delta\b/g, '\\text{ Delta }'],
    [/(\\(?:rho|mu|lambda|sigma|eta|nu))\s*\\left\s*\(/g, '$1 \\cdot \\left('],   // a constant times a bracket, not "rho von ..."                     // upright Delta was read as "normales Dreieck"
    [/\\textbf\s*\{/g, '\\text{'],                          // bold is for the eye only - but text stays text
    [/\\(?:mathbf|boldsymbol|bm)\s*\{/g, '{'],
    // a matrix is spoken entry by entry ("die 1 mal 2 Zeilenmatrize 1 minus 2" ran the entries together, Doc 17.09.2026).
    // PAUSE becomes a comma afterwards - punctuation inside \text is read out by SRE ("Komma", "Doppelpunkt")
    [/\\begin\{([pbvB]?matrix)\}([\s\S]*?)\\end\{\1\}/g, (m, env, body) => {
      const rows = body.split(/\\\\/).map(r => r.split('&').map(c => c.trim())).filter(r => r.some(c => c));
      const list = cells => cells.length < 2 ? cells.join('')
        : cells.slice(0, -1).join(' \\text{ PAUSE } ') + ' \\text{ und } ' + cells[cells.length - 1];
      if (rows.length === 1 || rows.every(r => r.length === 1))
        return '\\text{ die Matrix mit } ' + list(rows.length === 1 ? rows[0] : rows.map(r => r[0])) + ' \\text{ PAUSE }';
      return '\\text{ die ' + rows.length + ' mal ' + rows[0].length + ' Matrix PAUSE }'
        + rows.map((r, i) => ' \\text{ Zeile ' + (i + 1) + ' PAUSE } ' + list(r)).join(' \\text{ PAUSE }') + ' \\text{ PAUSE }';
    }],
  ];
  const ZIFFER = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  // after SRE: its German, smoothed for listening
  const POST = [
    // P(...) of events: no spoken brackets, \mid is a condition, not "teilt"
    // (alone, "P(A \cap B)" comes out as "P mal Klammer auf ..." - same thing, P of an event)
    [/\bP (?:von|mal) Klammer auf (.+?) Klammer zu/g, (m, e) => 'P von ' + e.replace(/\bteilt\b/g, 'unter der Bedingung')],
    [/\bDurchschnitt\b/g, 'geschnitten'],
    [/\bVereinigung\b/g, 'vereinigt'],
    [/\bbeinahe gleich\b/g, 'ungefähr'],
    // an index is a name, not a number: "x Index 1 Komma 2" was heard as one comma two (Doc, 17.09.2026)
    [/\bIndex (\d)\b(?: Komma (\d)\b)?/g, (m, a, b) => 'Index ' + ZIFFER[a] + (b ? ' Komma ' + ZIFFER[b] : '')],
    [/\bmy\b/g, 'mü'],
    [/\bnabla\b/g, 'Nabla'],
    [/\bfett(?:e|es|er|en)?\s+/g, ''],
    [/\bPfeil nach rechts\b/g, 'nach'],
    [/\bKlammer auf (\S+(?: nach \S+)+) Klammer zu/g, '$1'],   // a path through a tree: Start nach 5 nach 2
    [/\beckige Klammer auf (.+?) Strichpunkt (.+?) eckige Klammer zu/g, 'Intervall von $1 bis $2'],
    [/(\S+) ⃗/g, 'Vektor $1'],
    [/([Mm])atrize\b/g, '$1atrix'],
    // a lone 1 gets bent by the voice after "von", "bis", "mit": "von einem bis einem Komma 5" (Doc: "Nooooo pls!")
    [/(^|\s)1(?=\s|,|$)/g, '$1eins'],
    [/\s*\bPAUSE\b\s*/g, ', '],
    [/(?:,\s*)+/g, ', '],
    [/,\s*$/, ''],
    [/\s+/g, ' '],
  ];
  // A formula cut into its terms at the top level: "4 \cdot \frac{1}{6} = \frac{2}{3}" -> 4 | \cdot | \frac{1}{6} | = | ...
  // Brackets, braces, \left..\right and environments keep their inside together. A leading + or - belongs to its term.
  // For lighting up the term Solita is saying (Doc, 17.09.2026: "die jeweiligen Terme orange ... wenn sie spricht").
  const OPS = ['\\approx', '\\cdot', '\\times', '\\pm', '\\geq', '\\leq', '\\neq', '\\ge', '\\le', '=', '+', '-', '<', '>'];
  function splitTerms(tex) {
    const t = String(tex), out = [];
    let depth = 0, cur = '', i = 0;
    const push = (x, op) => { if (x.trim()) out.push({ tex: x.trim(), op: op }); };
    const word = (k) => /[a-zA-Z]/.test(t[k] || '');
    while (i < t.length) {
      if (t[i] === '\\' && '{}[]()|,; '.includes(t[i + 1] || '')) { cur += t.slice(i, i + 2); i += 2; continue; }
      const env = /^\\(begin|end)\{[^}]*\}/.exec(t.slice(i));
      if (env) { depth += env[1] === 'begin' ? 1 : -1; cur += env[0]; i += env[0].length; continue; }
      if (t.startsWith('\\left', i) && !word(i + 5)) { depth++; cur += '\\left'; i += 5; continue; }
      if (t.startsWith('\\right', i) && !word(i + 6)) { depth--; cur += '\\right'; i += 6; continue; }
      const c = t[i];
      if (depth === 0) {
        const op = OPS.find(o => t.startsWith(o, i) && !(o[0] === '\\' && word(i + o.length)));
        if (op && !((op === '-' || op === '+') && !cur.trim())) {
          push(cur, false); push(op, true); cur = ''; i += op.length; continue;
        }
      }
      if ('{(['.includes(c)) depth++;
      else if ('})]'.includes(c)) depth--;
      cur += c; i++;
    }
    push(cur, false);
    return out;
  }
  function tidyTex(tex) { return PRE.reduce((t, [a, b]) => t.replace(a, b), String(tex)); }
  function tidySpeech(words) { return POST.reduce((t, [a, b]) => t.replace(a, b), String(words)).trim(); }
  root.LatexSpeech = { tidyTex, tidySpeech, splitTerms };
})(typeof window !== 'undefined' ? window : globalThis);
