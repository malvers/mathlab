// Block "Beschleunigte Bewegung · quadratische Funktionen" - week 46 of Mathe BGY 11, the plan's "Gleichmäßig beschleunigte
// Bewegungen I: quadratische Funktionen" (Doc, 30.09.2026: "Mach Tafeln und Vorrechnen für das SJ bitte ... immer an
// den schon vorhandenen Aufgaben orientieren!", "pro Woche immer 20 Aufgaben ... wir haben 5 x 45 min"). Twenty tasks,
// easy to hard, after the week's quiz (mathetest11-quadratisch.html): the fall s = g/2 t² with g ≈ 10, v = g t, a car
// from rest, zeros by the square root and by factoring out, vertex form by completing the square, a parabola through a
// point, the ball h(t) = -5t² + 20t. Without the pq formula - that is next week's. Quantities of physics are positive:
// "(t>0)" behind the task.
// Every step checked with sympy (the same solutions as the task, a term the same value), every formula with KaTeX.
(function () {
    const ab = AUFGABEN.length;
    AUFGABEN.push(
        ['q-fall',          's=\\frac{10}{2}\\cdot 3^2',                  's'],
        ['q-geschwindigkeit', '30=10\\cdot t',                            't'],
        ['q-auto',          's=\\frac{4}{2}\\cdot 5^2',                   's'],
        ['q-nullstellen',   'x^2-9=0',                                    'x'],
        ['q-normalform',    '(x-2)^2-5',                                  ''],
        ['q-hoehe',         'h=-5\\cdot 2^2+20\\cdot 2',                  'h'],
        ['q-fallzeit',      '45=5t^2\\quad(t>0)',                         't'],
        ['q-bremsweg',      '20^2=2\\cdot 8\\cdot s',                     's'],
        ['q-streckfaktor',  '12=a\\cdot 2^2',                             'a'],
        ['q-nach-a',        's=\\frac{a}{2}t^2',                          'a'],
        ['q-boden',         '-5t^2+20t=0',                                't'],
        ['q-doppelt',       '\\frac{a}{2}\\cdot(2t)^2',                   ''],
        ['q-scheitel-plus', 'x^2+8x+15',                                  ''],
        ['q-scheitel-minus', 'x^2-6x+11',                                 ''],
        ['q-durch-punkt',   '10=a(3-1)^2+2',                              'a'],
        ['q-verschoben',    '(x-3)^2-4=0',                                'x'],
        ['q-nach-t',        's=\\frac{a}{2}t^2\\quad(t>0)',               't'],
        ['q-einholen',      '2t^2=8t\\quad(t>0)',                         't'],
        ['q-scheitel-faktor', '2x^2-8x+5',                                ''],
        ['q-wurf',          '-5t^2+20t',                                  ''],
    );
    wochenBlock('quadratisch', ab);
    Object.assign(LOESUNGEN, {
        'q-fall':            [['s=5\\cdot 9', '\\text{ausrechnen}'], ['s=45', '\\text{ausrechnen}']],
        'q-geschwindigkeit': [['t=3', ':10']],
        'q-auto':            [['s=2\\cdot 25', '\\text{ausrechnen}'], ['s=50', '\\text{ausrechnen}']],
        'q-nullstellen':     [['x^2=9', '+9'], ['x_1=3\\quad x_2=-3', '\\sqrt{\\;}']],
        'q-normalform':      [['=x^2-4x+4-5', '\\text{binomische Formel}'], ['=x^2-4x-1', '\\text{zusammenfassen}']],
        'q-hoehe':           [['h=-20+40', '\\text{ausrechnen}'], ['h=20', '\\text{zusammenfassen}']],
        'q-fallzeit':        [['9=t^2', ':5'], ['t=3', '\\sqrt{\\;}']],
        'q-bremsweg':        [['400=16s', '\\text{ausrechnen}'], ['s=25', ':16']],
        'q-streckfaktor':    [['12=4a', '\\text{ausrechnen}'], ['a=3', ':4']],
        'q-nach-a':          [['2s=at^2', '\\cdot 2'], ['a=\\frac{2s}{t^2}', ':t^2']],
        'q-boden':           [['-5t(t-4)=0', '\\text{ausklammern}'], ['t_1=0\\quad t_2=4', '\\text{Nullprodukt}']],
        'q-doppelt':         [['=\\frac{a}{2}\\cdot 4t^2', '\\text{Potenzgesetz}'], ['=4\\cdot\\frac{a}{2}t^2', '\\text{umstellen}']],
        'q-scheitel-plus':   [['=x^2+8x+16-1', '\\text{quadratische Ergänzung}'], ['=(x+4)^2-1', '\\text{binomische Formel}']],
        'q-scheitel-minus':  [['=x^2-6x+9+2', '\\text{quadratische Ergänzung}'], ['=(x-3)^2+2', '\\text{binomische Formel}']],
        'q-durch-punkt':     [['10=4a+2', '\\text{ausrechnen}'], ['8=4a', '-2'], ['a=2', ':4']],
        'q-verschoben':      [['(x-3)^2=4', '+4'], ['x-3=2\\;\\vee\\;x-3=-2', '\\sqrt{\\;}'], ['x_1=5\\quad x_2=1', '+3']],
        'q-nach-t':          [['2s=at^2', '\\cdot 2'], ['t^2=\\frac{2s}{a}', ':a'], ['t=\\sqrt{\\frac{2s}{a}}', '\\sqrt{\\;}']],
        'q-einholen':        [['2t^2-8t=0', '-8t'], ['2t(t-4)=0', '\\text{ausklammern}'], ['t=4', '\\text{Nullprodukt},\\ t>0']],
        'q-scheitel-faktor': [['=2(x^2-4x)+5', '\\text{ausklammern}'], ['=2(x^2-4x+4-4)+5', '\\text{quadratische Ergänzung}'],
                              ['=2(x-2)^2-8+5', '\\text{binomische Formel}'], ['=2(x-2)^2-3', '\\text{zusammenfassen}']],
        'q-wurf':            [['=-5(t^2-4t)', '\\text{ausklammern}'], ['=-5(t^2-4t+4-4)', '\\text{quadratische Ergänzung}'],
                              ['=-5((t-2)^2-4)', '\\text{binomische Formel}'], ['=-5(t-2)^2+20', '\\text{ausmultiplizieren}']],
    });
    Object.assign(ERKLAERUNGEN, {
        'q-doppelt':
            'Doppelte Zeit, vierfacher Weg: das $t$ steht im Quadrat, also $(2t)^2=4t^2$.' +
            '\n\nMit Zahlen, $a=10$: in $1$ s fällt ein Stein $5$ m, in $2$ s schon $20$ m – nicht $10$ m.',
        'q-einholen':
            'Das Auto startet aus dem Stand ($s=2t^2$), der Läufer läuft gleichmäßig ($s=8t$). Gleichsetzen heißt: gleicher Ort.' +
            '\n\n$t=0$ ist der gemeinsame Start – eingeholt wird er nach $4$ s, bei $s=2\\cdot 16=32$ m.' +
            '\n\nNicht durch $t$ teilen, ohne nachzudenken: dabei geht die Lösung $t=0$ verloren. Hier ist das gewollt, sonst oft ein Fehler.',
        'q-wurf':
            'Die Scheitelform verrät den höchsten Punkt: $h(t)=-5(t-2)^2+20$ ist bei $t=2$ am größten, dort $20$ m.' +
            '\n\nFür jedes andere $t$ wird von $20$ etwas abgezogen, denn $-5(t-2)^2\\le 0$.' +
            '\n\nProbe: $h(2)=-5\\cdot 4+20\\cdot 2=-20+40=20$.',
    });
    aufgabenTexte({
        'q-fall':        'Freier Fall, $s=\\frac{g}{2}t^2$ mit $g\\approx 10\\ \\mathrm{m/s^2}$: welche Strecke fällt ein Stein in $3$ s?',
        'q-geschwindigkeit': 'Beim freien Fall gilt $v=g\\cdot t$ mit $g\\approx 10\\ \\mathrm{m/s^2}$. Nach welcher Zeit ist der Stein $30$ m/s schnell?',
        'q-auto':        'Ein Auto beschleunigt aus dem Stand mit $a=4\\ \\mathrm{m/s^2}$. Welche Strecke legt es in $5$ s zurück?',
        'q-nullstellen': 'Welche Nullstellen hat $f(x)=x^2-9$?',
        'q-normalform':  'Wandle $f(x)=(x-2)^2-5$ in die Normalform um.',
        'q-hoehe':       'Ein Ball fliegt gemäß $h(t)=-5t^2+20t$ (in m). Wie hoch ist er nach $2$ s?',
        'q-fallzeit':    'Ein Stein fällt $45$ m tief, $s=5t^2$. Wie lange fällt er?',
        'q-bremsweg':    'Ein Auto bremst von $20$ m/s mit $a=8\\ \\mathrm{m/s^2}$: $v^2=2as$. Wie lang ist der Bremsweg?',
        'q-streckfaktor': 'Die Parabel $y=ax^2$ geht durch den Punkt $(2\\mid 12)$. Wie groß ist $a$?',
        'q-nach-a':      'Stelle $s=\\frac{a}{2}t^2$ nach der Beschleunigung um.',
        'q-boden':       'Der Ball mit $h(t)=-5t^2+20t$: wann ist er am Boden?',
        'q-doppelt':     'Die Fallzeit wird verdoppelt. Wie ändert sich der Weg $s=\\frac{a}{2}t^2$?',
        'q-scheitel-plus': 'Wo liegt der Scheitel von $f(x)=x^2+8x+15$? Bringe den Term in die Scheitelform.',
        'q-scheitel-minus': 'Wo liegt der Scheitel von $f(x)=x^2-6x+11$? Bringe den Term in die Scheitelform.',
        'q-durch-punkt': 'Eine Parabel mit dem Scheitel $(1\\mid 2)$ geht durch $(3\\mid 10)$: $y=a(x-1)^2+2$. Wie groß ist $a$?',
        'q-verschoben':  'Welche Nullstellen hat $f(x)=(x-3)^2-4$?',
        'q-nach-t':      'Stelle $s=\\frac{a}{2}t^2$ nach der Zeit um.',
        'q-einholen':    'Ein Auto startet aus dem Stand ($s=2t^2$), ein Läufer läuft gleichmäßig ($s=8t$). Wann holt das Auto ihn ein?',
        'q-scheitel-faktor': 'Bringe $f(x)=2x^2-8x+5$ in die Scheitelform.',
        'q-wurf':        'Wie hoch fliegt der Ball mit $h(t)=-5t^2+20t$ höchstens? Bringe den Term in die Scheitelform.',
    });
})();
