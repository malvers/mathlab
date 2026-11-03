/* js/buch-sw/analysis.js — Swahili for the widgets of js/buch-analysis.js.
 * Loaded by the Swahili editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw2-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('analysis', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // schar, gewinn; the helpers of the module that check.mjs reads (the task generators of the derivative and integral trainers, the box and the pen): BGY 12 has them too
        "Funktionenschar": "Familia ya fanksheni", "Ortskurve der Extrempunkte zeigen": "Onyesha njia ya nukta za kugeuka", "Funktionenschar mit Ortskurve": "Familia ya fanksheni pamoja na njia ya nukta", "Parameter $a$": "Kigezo $a$",
        "Verkaufspreis $p$ (€ pro Stück)": "Bei ya kuuza $p$ (€ kwa kipande)", "x in Stück": "x kwa vipande", "Kosten, Erlös und Gewinn": "Gharama, mapato na faida",
        "Karton mit ausgeschnittenen Ecken": "Kisanduku chenye kona zilizokatwa", "Gehege an einer Mauer": "Uzio kando ya ukuta", "Mauer": "Ukuta",
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // schar, gewinn
        ["Hochpunkt", "Nukta ya juu"],
        ["Tiefpunkt", "Nukta ya chini"],
        ["keine Extrempunkte", "hakuna nukta za kugeuka"],
        ["Ortskurve aller Extrempunkte (violett): $", "Njia ya nukta za kugeuka zote (zambarau): $"],
        ["Für $a \\le 0$ gibt es keine Extrempunkte: $f_a'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.", "Kwa $a \\le 0$ hakuna nukta za kugeuka: basi $f_a'(x) = 3x^2 - a$ haina sifuri yenye mabadiliko ya ishara."],
        ["Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.", "Kila parabola ya familia inapita nukta ya asili, kwa sababu $f_a(0) = 0$ kwa kila $a$."],
        ["Gewinnschwelle bei $x \\approx ", "Kizingiti cha faida kwenye $x \\approx "],
        ["$, Gewinngrenze bei $x \\approx ", "$, kikomo cha faida kwenye $x \\approx "],
        ["$ Stück.", "$ (vipande)."],
        ["Gewinn ab $x \\approx ", "Faida kuanzia $x \\approx "],
        ["Bei diesem Preis wird nie Gewinn gemacht.", "Kwa bei hii hakuna faida kamwe."],
        ["Gewinnmaximum: $G'(x) = 0$ bei $x \\approx ", "Faida kubwa zaidi: $G'(x) = 0$ kwenye $x \\approx "],
        ["$ Stück, $G \\approx ", "$ (vipande), $G \\approx "],
        ["Kein positives Gewinnmaximum.", "Hakuna faida kubwa zaidi iliyo chanya."],
        // the rules of the task generators (helpers of the module)
        ["Potenzregel $(x^n)' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.", "Kanuni ya vipeo $(x^n)' = n\\,x^{n-1}$ na kanuni ya kizidishi: kizidishi kinabaki."],
        ["Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.", "Kanuni ya jumla: kila kipengele kinanyambuliwa peke yake. Kipengele kisichobadilika kinapotea."],
        ["Die Potenzregel gilt auch für rationale Exponenten: $(x^r)' = r\\,x^{r-1}$.", "Kanuni ya vipeo inatumika pia kwa vipeo vilivyo sehemu: $(x^r)' = r\\,x^{r-1}$."],
        ["$(\\sin x)' = \\cos x$, und $(c \\cdot x)' = c$.", "$(\\sin x)' = \\cos x$, na $(c \\cdot x)' = c$."],
        ["$(\\mathrm{e}^x)' = \\mathrm{e}^x$ und $(\\sin x)' = \\cos x$.", "$(\\mathrm{e}^x)' = \\mathrm{e}^x$ na $(\\sin x)' = \\cos x$."],
        ["Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.", "Kanuni ya jumla; $\\mathrm{e}^x$ inabaki $\\mathrm{e}^x$ inaponyambuliwa."],
        ["Produktregel $(u \\cdot v)' = u'v + uv'$ mit $u = ", "Kanuni ya zao $(u \\cdot v)' = u'v + uv'$ pamoja na $u = "],
        ["Produktregel mit $u = ", "Kanuni ya zao pamoja na $u = "],
        ["$(\\cos x)' = -\\sin x$, also $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$.", "$(\\cos x)' = -\\sin x$, kwa hiyo $\\int \\sin x\\,\\mathrm{d}x = -\\cos x + C$."],
        ["$(\\sin x)' = \\cos x$, also $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$.", "$(\\sin x)' = \\cos x$, kwa hiyo $\\int \\cos x\\,\\mathrm{d}x = \\sin x + C$."],
        ["$\\sqrt{x} = x^{\\frac12}$, also $(\\sqrt{x})' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$.", "$\\sqrt{x} = x^{\\frac12}$, kwa hiyo $(\\sqrt{x})' = \\tfrac12 x^{-\\frac12} = \\dfrac{1}{2\\sqrt{x}}$."],
        ["$\\tfrac{1}{x^2} = x^{-2}$, also $(x^{-2})' = -2x^{-3}$.", "$\\tfrac{1}{x^2} = x^{-2}$, kwa hiyo $(x^{-2})' = -2x^{-3}$."],
        ["$\\tfrac{1}{x} = x^{-1}$, also $(x^{-1})' = -x^{-2} = -\\dfrac{1}{x^2}$.", "$\\tfrac{1}{x} = x^{-1}$, kwa hiyo $(x^{-1})' = -x^{-2} = -\\dfrac{1}{x^2}$."],
        ["Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.", "Kanuni ya vipeo kinyume: ongeza kipeo kwa 1, gawanya kwa kipeo kipya, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$."],
        ["Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.", "Kanuni ya jumla na ya kizidishi: kila kipengele kinaunganishwa peke yake, kizidishi kinabaki. Konstanti $a$ ina fanksheni asili $ax$."],
        ["$\\sqrt{x} = x^{\\frac12}$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.", "$\\sqrt{x} = x^{\\frac12}$: kipeo $\\tfrac12 + 1 = \\tfrac32$, kugawanya kwa $\\tfrac32$ ni kuzidisha kwa $\\tfrac23$."],
        ["$\\tfrac{1}{x^2} = x^{-2}$: Exponent $-1$, durch $-1$ teilen, also $-x^{-1} = -\\tfrac1x$.", "$\\tfrac{1}{x^2} = x^{-2}$: kipeo $-1$, gawanya kwa $-1$, yaani $-x^{-1} = -\\tfrac1x$."],
        ["$\\tfrac{1}{\\sqrt{x}} = x^{-\\frac12}$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.", "$\\tfrac{1}{\\sqrt{x}} = x^{-\\frac12}$: kipeo $\\tfrac12$, kugawanya kwa $\\tfrac12$ ni kuzidisha mara mbili."],
        ["Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.", "Kanuni ya vipeo inatumika kwa kila kipeo $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$."],
        ["$\\mathrm{e}^x$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.", "$\\mathrm{e}^x$ ni kinyambuo chake chenyewe, kwa hiyo pia ni fanksheni asili yake yenyewe."],
        ["Die Lücke der Potenzregel: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Für $x > 0$ reicht $\\ln x$.", "Pengo la kanuni ya vipeo: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Kwa $x > 0$ inatosha $\\ln x$."],
        ["Lineare Verkettung: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.", "Mnyororo wa mstari: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Ukaguzi: kanuni ya mnyororo inatoa kizidishi $a$, na $\\tfrac1a$ inakifuta."],
        ["$\\int \\sin(ax+b)\\,\\mathrm{d}x = -\\tfrac1a \\cos(ax+b) + C$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.", "$\\int \\sin(ax+b)\\,\\mathrm{d}x = -\\tfrac1a \\cos(ax+b) + C$: kwanza fanksheni asili ya $\\sin$, kisha gawanya kwa kinyambuo cha ndani $a$."],
        ["$\\int (ax+b)^n\\,\\mathrm{d}x = \\dfrac{(ax+b)^{n+1}}{a\\,(n+1)} + C$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.", "$\\int (ax+b)^n\\,\\mathrm{d}x = \\dfrac{(ax+b)^{n+1}}{a\\,(n+1)} + C$: kanuni ya vipeo kwa mabano, kisha gawanya kwa kinyambuo cha ndani."],
    ],
    rule: [
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    ]
});
