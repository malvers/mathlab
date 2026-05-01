/**
 * CYBER-LABOR GLOBAL i18n DICTIONARY
 * Supports: Addition, Subtraction, Multiplication, Division
 * Languages: DE (German), EN (English), ES (Spanish)
 */

const CyberI18n = {
    // Current active language
    current: 'en',

    // Dictionary
    translations: {
        de: {
            ui: {
                next: "WEITER",
                prev: "ZURÜCK",
                reset: "LABOR RESET",
                step: "SCHRITT",
                coach_title: "Math Coach"
            },
            units: {
                ones: "Einer",
                tens: "Zehner",
                hundreds: "Hunderter",
                thousands: "Tausender"
            },
            arithmetic: {
                add: {
                    title: "SCHRIFTLICHE ADDITION",
                    ready: "Bereit für die Addition von {a} und {b}. Wir rechnen von rechts nach links.",
                    focus: "Wir betrachten die {unit}.",
                    calc: "Wir addieren {d1} + {d2} {c} = {sum}.",
                    carry: "Wir notieren {digit} und übertragen {newCarry}.",
                    complete: "Berechnung abgeschlossen! Das Ergebnis ist {result}."
                },
                sub: {
                    title: "SCHRIFTLICHE SUBTRAKTION",
                    ready: "Bereit für die Subtraktion: {a} - {b}.",
                    borrow: "Wir borgen uns 10, da {d1} kleiner als {d2} ist.",
                    calc: "Wir rechnen ({d1} + 10) - {d2} = {result}.",
                    complete: "Berechnung abgeschlossen! Das Ergebnis ist {result}."
                },
                mult: {
                    title: "SCHRIFTLICHE MULTIPLIKATION",
                    ready: "Bereit für die Multiplikation: {a} · {b}.",
                    digit_step: "Wir multiplizieren {d} mit {factor}.",
                    complete: "Multiplikation abgeschlossen! Das Ergebnis ist {result}."
                },
                div: {
                    title: "SCHRIFTLICHE DIVISION",
                    ready: "Bereit für die Division: {a} : {b}.",
                    fit: "Wie oft passt {b} in {val}?",
                    rem: "Rest {rem} wird notiert.",
                    complete: "Division abgeschlossen! Das Ergebnis ist {result}."
                }
            }
        },
        en: {
            ui: {
                next: "NEXT",
                prev: "BACK",
                reset: "RESET LAB",
                step: "STEP",
                coach_title: "Math Coach"
            },
            units: {
                ones: "ones",
                tens: "tens",
                hundreds: "hundreds",
                thousands: "thousands"
            },
            arithmetic: {
                add: {
                    title: "WRITTEN ADDITION",
                    ready: "Ready to add {a} and {b}. Calculating from right to left.",
                    focus: "Looking at the {unit}.",
                    calc: "Adding {d1} + {d2} {c} = {sum}.",
                    carry: "Writing down {digit} and carrying {newCarry}.",
                    complete: "Calculation finished! The result is {result}."
                },
                sub: {
                    title: "WRITTEN SUBTRACTION",
                    ready: "Ready for subtraction: {a} - {b}.",
                    borrow: "Borrowing 10 because {d1} is smaller than {d2}.",
                    calc: "Calculating ({d1} + 10) - {d2} = {result}.",
                    complete: "Calculation finished! The result is {result}."
                },
                mult: {
                    title: "WRITTEN MULTIPLICATION",
                    ready: "Ready for multiplication: {a} · {b}.",
                    digit_step: "Multiplying {d} by {factor}.",
                    complete: "Multiplication finished! The result is {result}."
                },
                div: {
                    title: "WRITTEN DIVISION",
                    ready: "Ready for division: {a} : {b}.",
                    fit: "How many times does {b} fit into {val}?",
                    rem: "Remainder {rem} is noted.",
                    complete: "Division finished! The result is {result}."
                }
            }
        },
        es: {
            ui: {
                next: "CONTINUAR",
                prev: "VOLVER",
                reset: "REINICIAR",
                step: "PASO",
                coach_title: "Entrenador de Mates"
            },
            units: {
                ones: "unidades",
                tens: "decenas",
                hundreds: "centenas",
                thousands: "millares"
            },
            arithmetic: {
                add: {
                    title: "SUMA ESCRITA",
                    ready: "Listo para sumar {a} y {b}. Calculando de derecha a izquierda.",
                    focus: "Mirando las {unit}.",
                    calc: "Sumando {d1} + {d2} {c} = {sum}.",
                    carry: "Anotamos {digit} y llevamos {newCarry}.",
                    complete: "¡Cálculo finalizado! El resultado es {result}."
                },
                sub: {
                    title: "RESTA ESCRITA",
                    ready: "Listo para restar: {a} - {b}.",
                    borrow: "Pedimos prestado 10 porque {d1} es menor que {d2}.",
                    calc: "Calculando ({d1} + 10) - {d2} = {result}.",
                    complete: "¡Cálculo finalizado! El resultado es {result}."
                },
                mult: {
                    title: "MULTIPLICACIÓN ESCRITA",
                    ready: "Listo para multiplicar: {a} · {b}.",
                    digit_step: "Multiplicamos {d} por {factor}.",
                    complete: "¡Multiplicación finalizada! El resultado es {result}."
                },
                div: {
                    title: "DIVISIÓN ESCRITA",
                    ready: "Listo para dividir: {a} : {b}.",
                    fit: "¿Cuántas veces cabe {b} en {val}?",
                    rem: "Se anota el resto {rem}.",
                    complete: "¡División finalizada! El resultado es {result}."
                }
            }
        }
    },

    // Helper to get a translation
    get: function (key, replacements = {}) {
        const parts = key.split('.');
        let result = this.translations[this.current];

        for (let part of parts) {
            if (result && result[part]) {
                result = result[part];
            } else {
                return key; // Fallback to key name
            }
        }

        // Replace placeholders
        Object.keys(replacements).forEach(placeholder => {
            result = result.replace(`{${placeholder}}`, replacements[placeholder]);
        });

        return result;
    }
};
