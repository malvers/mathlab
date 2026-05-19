// Shared formula registry for the morpheus labs (morph.html, equationocr.html).
// Each entry: { latex, title }. Title is shown as tooltip; latex is rendered
// via KaTeX. The simple list maps 1:1 to presets/formula-N.png by array index.
window.MORPHEUS_FORMULAS = [
    { latex: 'E=mc^2',                                                                title: 'Einstein' },
    { latex: '\\frac{a}{b}',                                                          title: 'Bruch' },
    { latex: 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}',                                   title: 'Quadratische Formel' },
    { latex: 'e^{i\\pi}+1=0',                                                         title: 'Eulersche Identität' },
    { latex: 'a^2+b^2=c^2',                                                           title: 'Pythagoras' },
    { latex: 'e^x=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}',                              title: 'Taylor e^x' },
    { latex: '\\int_{-\\infty}^{\\infty}e^{-x^2}dx=\\sqrt{\\pi}',                     title: 'Gauss-Integral' },
    { latex: '\\binom{n}{k}=\\frac{n!}{k!(n-k)!}',                                    title: 'Binomialkoeffizient' },
    { latex: '\\frac{d}{dx}x^n=nx^{n-1}',                                             title: 'Potenzregel' },
    { latex: '\\int_a^b f(x)\\,dx',                                                   title: 'Bestimmtes Integral' },
    { latex: 'F=G\\frac{m_1 m_2}{r^2}',                                               title: 'Newton Gravitation' },
    { latex: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi=\\hat{H}\\Psi',               title: 'Schrödinger' },
    { latex: '\\nabla\\cdot E=\\frac{\\rho}{\\varepsilon_0}',                         title: 'Maxwell (Gauß)' },
    { latex: '\\nabla\\times B=\\mu_0 J+\\mu_0\\varepsilon_0\\frac{\\partial E}{\\partial t}', title: 'Maxwell (Ampère)' }
];

// Complex formulas — rendered live via KaTeX + html2canvas onto the
// draw-canvas. No preset PNGs needed.
window.MORPHEUS_COMPLEX_FORMULAS = [
    { latex: '\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s}',                                                                          title: 'Riemann ζ' },
    { latex: '(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi=0',                                                                         title: 'Dirac' },
    { latex: 'f(a)=\\frac{1}{2\\pi i}\\oint_\\gamma\\frac{f(z)}{z-a}\\,dz',                                                              title: 'Cauchy-Integral' },
    { latex: 'R_{\\mu\\nu}-\\tfrac{1}{2}g_{\\mu\\nu}R+\\Lambda g_{\\mu\\nu}=\\frac{8\\pi G}{c^4}T_{\\mu\\nu}',                          title: 'Einstein-Feldgleichungen' },
    { latex: '\\rho\\!\\left(\\frac{\\partial\\mathbf{v}}{\\partial t}+\\mathbf{v}\\!\\cdot\\!\\nabla\\mathbf{v}\\right)=-\\nabla p+\\mu\\nabla^2\\mathbf{v}+\\mathbf{f}', title: 'Navier–Stokes' }
];
