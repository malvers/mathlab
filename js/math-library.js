/**
 * Cyber-Labor Math Library v1.0.0
 * Centralized function definitions for educational modules.
 * Includes f(x), f'(x), f''(x) and TeX representations.
 */
const MathLibrary = {
    functions: {
        kubisch: {
            id: 'kubisch',
            name: 'Kubische Funktion',
            f: x => 0.25 * (x * x * x - 3 * x),
            df: x => 0.25 * (3 * x * x - 3),
            ddf: x => 1.5 * x,
            tex: 'f(x) = \\frac{1}{4}(x^3 - 3x)',
            tex_short: '\\frac{1}{4}(x^3-3x)'
        },
        parabel: {
            id: 'parabel',
            name: 'Normalparabel',
            f: x => x * x,
            df: x => 2 * x,
            ddf: x => 2,
            tex: 'f(x) = x^2',
            tex_short: 'x^2'
        },
        sinus: {
            id: 'sinus',
            name: 'Sinus-Welle',
            f: x => Math.sin(x),
            df: x => Math.cos(x),
            ddf: x => -Math.sin(x),
            tex: 'f(x) = \\sin(x)',
            tex_short: '\\sin(x)'
        },
        cosinus: {
            id: 'cosinus',
            name: 'Cosinus-Welle',
            f: x => Math.cos(x),
            df: x => -Math.sin(x),
            ddf: x => -Math.cos(x),
            tex: 'f(x) = \\cos(x)',
            tex_short: '\\cos(x)'
        },
        exponential: {
            id: 'exponential',
            name: 'Exponentialfunktion',
            f: x => Math.exp(0.5 * x),
            df: x => 0.5 * Math.exp(0.5 * x),
            ddf: x => 0.25 * Math.exp(0.5 * x),
            tex: 'f(x) = e^{0.5x}',
            tex_short: 'e^{0.5x}'
        },
        ln: {
            id: 'ln',
            name: 'Logarithmus',
            f: x => x > 0 ? Math.log(x) : -5,
            df: x => x > 0 ? 1/x : 0,
            ddf: x => x > 0 ? -1/(x*x) : 0,
            tex: 'f(x) = \\ln(x)',
            tex_short: '\\ln(x)'
        }
    },

    get(id) {
        return this.functions[id] || this.functions.parabel;
    },

    getAll() {
        return Object.values(this.functions);
    }
};
