#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 2 / KW 35 (LB 1): limits - behaviour at infinity,
horizontal asymptotes, models in context. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=2, slug='grenzwerte-unendlich', thema='Grenzwerte im Unendlichen', lb='LB 1',
         blurb='Verhalten für große x, waagerechte Asymptoten, Langzeitverhalten',
         comment='Blocks: power and rational functions (1-8), asymptotes (9-12), exponential, log and sine (13-17), context (18-20).')

# ------------------------------------------- power and rational functions ----
Q.q(r'Wie verhält sich $f(x) = \dfrac{1}{x}$ für $x \to \infty$?',
    [r'$f(x) \to 0$', r'$f(x) \to \infty$', r'$f(x) \to 1$', r'Es gibt keinen Grenzwert.'],
    [r'Für große $x$ wird der Nenner immer größer, der Bruch immer kleiner.',
     r'Wertetabelle: $f(10) = 0{,}1$, $f(1000) = 0{,}001$.',
     r'Also $\lim\limits_{x \to \infty} \dfrac{1}{x} = 0$.'])

Q.q(r'Bestimme $\lim\limits_{x \to \infty} \dfrac{3x + 1}{x}$.',
    [r'3', r'1', r'0', r'$\infty$'],
    [r'Zähler und Nenner durch $x$ teilen: $\dfrac{3x + 1}{x} = 3 + \dfrac{1}{x}$.',
     r'Der Summand $\dfrac{1}{x}$ geht gegen null.',
     r'Grenzwert: 3.'])

Q.q(r'Bestimme $\lim\limits_{x \to \infty} \dfrac{2x^2 - 5}{x^2 + 1}$.',
    [r'2', r'−5', r'$\infty$', r'0'],
    [r'Zähler und Nenner durch die höchste Potenz $x^2$ teilen.',
     r'$\dfrac{2 - \frac{5}{x^2}}{1 + \frac{1}{x^2}} \to \dfrac{2 - 0}{1 + 0}$',
     r'Gleicher Grad oben und unten: Der Grenzwert ist der Quotient der Leitkoeffizienten, hier 2.'])

Q.q(r'Bestimme $\lim\limits_{x \to \infty} \dfrac{4x}{x^2 + 1}$.',
    [r'0', r'4', r'$\infty$', r'1'],
    [r'Durch $x^2$ teilen: $\dfrac{\frac{4}{x}}{1 + \frac{1}{x^2}}$.',
     r'Der Zähler geht gegen null, der Nenner gegen eins.',
     r'Der Nennergrad ist größer als der Zählergrad, also Grenzwert 0.'])

Q.q(r'Wie verhält sich $f(x) = x^3 - 100x^2$ für $x \to \infty$?',
    [r'$f(x) \to \infty$', r'$f(x) \to -\infty$', r'$f(x) \to 0$', r'$f(x) \to -100$'],
    [r'Für das Verhalten im Unendlichen entscheidet der Summand mit der höchsten Potenz.',
     r'$f(x) = x^2 \cdot (x - 100)$: Für $x > 100$ sind beide Faktoren positiv und wachsen.',
     r'Also $f(x) \to \infty$, auch wenn der Graph zunächst fällt.'])

Q.q(r'Wie verhält sich $f(x) = -2x^4 + x$ für $x \to \infty$ und für $x \to -\infty$?',
    [r'In beiden Fällen $f(x) \to -\infty$.', r'In beiden Fällen $f(x) \to \infty$.',
     r'$f(x) \to -\infty$ für $x \to \infty$, $f(x) \to \infty$ für $x \to -\infty$.',
     r'In beiden Fällen $f(x) \to 0$.'],
    [r'Entscheidend ist $-2x^4$.',
     r'Der Exponent ist gerade, also ist $x^4$ für große positive und große negative $x$ groß und positiv.',
     r'Mit dem Faktor −2 geht $f(x)$ auf beiden Seiten gegen $-\infty$.'])

Q.q(r'Wie verhält sich $f(x) = x^3$ für $x \to -\infty$?',
    [r'$f(x) \to -\infty$', r'$f(x) \to \infty$', r'$f(x) \to 0$', r'$f(x) \to -1$'],
    [r'Ungerader Exponent: Das Vorzeichen bleibt erhalten.',
     r'$(-10)^3 = -1000$, $(-100)^3 = -1\,000\,000$.',
     r'Also $f(x) \to -\infty$.'])

Q.q(r'Die Folge $a_n = \dfrac{n + 1}{n}$ aus Klasse 10 gehört zur Funktion $f(x) = \dfrac{x + 1}{x}$. Wogegen strebt sie?',
    [r'1', r'0', r'2', r'$\infty$'],
    [r'$\dfrac{n + 1}{n} = 1 + \dfrac{1}{n}$',
     r'$\dfrac{1}{n}$ wird beliebig klein.',
     r'Grenzwert 1; die Folgenglieder liegen alle knapp darüber.'])

# ------------------------------------------------------------ asymptotes ----
Q.q(r'Welche waagerechte Asymptote hat der Graph von $f(x) = \dfrac{6x + 1}{2x - 3}$?',
    [r'$y = 3$', r'$y = 6$', r'$y = -\dfrac{1}{3}$', r'$x = \dfrac{3}{2}$'],
    [r'Gleicher Grad in Zähler und Nenner: Quotient der Leitkoeffizienten.',
     r'$\dfrac{6}{2} = 3$, also $y = 3$.',
     r'$x = \dfrac{3}{2}$ ist eine senkrechte Asymptote, keine waagerechte.'])

Q.q(r'Welche waagerechte Asymptote hat $f(x) = 2 + \dfrac{1}{x^2}$?',
    [r'$y = 2$', r'$y = 0$', r'$y = 3$', r'Es gibt keine.'],
    [r'$\dfrac{1}{x^2} \to 0$ für $x \to \pm\infty$.',
     r'Also $f(x) \to 2$.',
     r'Der Graph nähert sich der Geraden $y = 2$ von oben.'])

Q.q(r'Welche Funktion hat für $x \to \infty$ die $x$-Achse als Asymptote?',
    [r'$f(x) = \dfrac{3}{x + 1}$', r'$f(x) = \dfrac{x}{x + 1}$', r'$f(x) = \dfrac{x^2}{x + 1}$', r'$f(x) = 3x$'],
    [r'Die $x$-Achse ist die Gerade $y = 0$; gesucht ist also $f(x) \to 0$.',
     r'$\dfrac{3}{x + 1}$: Zählergrad kleiner als Nennergrad, Grenzwert 0.',
     r'$\dfrac{x}{x + 1} \to 1$, die anderen beiden wachsen über alle Grenzen.'])

Q.q(r'Nähert sich ein Graph seiner waagerechten Asymptote immer nur von einer Seite?',
    [r'Nein, er kann sie auch schneiden, z. B. $f(x) = \dfrac{\sin x}{x}$.',
     r'Ja, ein Graph schneidet seine Asymptote nie.',
     r'Ja, immer von oben.', r'Nein, eine Asymptote gibt es nur bei Polstellen.'],
    [r'Asymptote heißt nur: Für $x \to \infty$ wird der Abstand beliebig klein.',
     r'$\dfrac{\sin x}{x}$ pendelt um die $x$-Achse und schneidet sie unendlich oft.',
     r'Trotzdem gilt $\dfrac{\sin x}{x} \to 0$.'])

# --------------------------------------------- exponential, log and sine ----
Q.q(r'Wie verhält sich $f(x) = e^x$ für $x \to -\infty$?',
    [r'$f(x) \to 0$', r'$f(x) \to -\infty$', r'$f(x) \to 1$', r'$f(x) \to e$'],
    [r'$e^{-x} = \dfrac{1}{e^x}$ und $e^x$ wächst für $x \to \infty$ über alle Grenzen.',
     r'Für $x \to -\infty$ wird $e^x$ also beliebig klein, bleibt aber positiv.',
     r'Die $x$-Achse ist waagerechte Asymptote.'])

Q.q(r'Bestimme $\lim\limits_{x \to \infty} \left(5 - 2e^{-x}\right)$.',
    [r'5', r'3', r'$-\infty$', r'7'],
    [r'$e^{-x} \to 0$ für $x \to \infty$.',
     r'Also $5 - 2 \cdot 0 = 5$.',
     r'Der Graph nähert sich $y = 5$ von unten.'])

Q.q(r'Wie verhält sich $f(x) = x \cdot e^{-x}$ für $x \to \infty$?',
    [r'$f(x) \to 0$', r'$f(x) \to \infty$', r'$f(x) \to 1$', r'Es gibt keinen Grenzwert.'],
    [r'$f(x) = \dfrac{x}{e^x}$: Zähler und Nenner wachsen.',
     r'Die Exponentialfunktion wächst schneller als jede Potenz: $\dfrac{10}{e^{10}} \approx 0{,}000\,45$.',
     r'Also $f(x) \to 0$.'])

Q.q(r'Wie verhält sich $f(x) = \ln x$ für $x \to \infty$?',
    [r'$f(x) \to \infty$, aber sehr langsam.', r'$f(x) \to 0$', r'$f(x)$ nähert sich einer Asymptote.',
     r'$f(x) \to e$'],
    [r'$\ln x$ ist die Umkehrfunktion von $e^x$.',
     r'Jeder Wert wird erreicht: $\ln x = 100$ für $x = e^{100}$.',
     r'Also keine Asymptote, $f(x) \to \infty$, nur sehr langsam.'])

Q.q(r'Hat $f(x) = \sin x$ für $x \to \infty$ einen Grenzwert?',
    [r'Nein, die Werte pendeln immer zwischen −1 und 1.', r'Ja, 0.', r'Ja, 1.', r'Ja, $\infty$.'],
    [r'Ein Grenzwert verlangt, dass sich die Werte einer festen Zahl beliebig nähern.',
     r'$\sin x$ nimmt in jeder Periode wieder 1 und −1 an.',
     r'Deshalb existiert $\lim\limits_{x \to \infty} \sin x$ nicht.'])

# --------------------------------------------------------------- context ----
Q.q(r'Die Konzentration eines Medikaments im Blut ist $c(t) = \dfrac{8t}{t^2 + 4}$ (in mg/l, $t$ in Stunden). Was gilt langfristig?',
    [r'$c(t) \to 0$: Das Medikament wird abgebaut.', r'$c(t) \to 8$', r'$c(t) \to 2$', r'$c(t) \to \infty$'],
    [r'Zählergrad 1 ist kleiner als Nennergrad 2.',
     r'Also $c(t) \to 0$ für $t \to \infty$.',
     r'Im Sachzusammenhang: Nach langer Zeit ist praktisch nichts mehr im Blut.'])

Q.q(r'Ein Tee kühlt nach $T(t) = 20 + 70 \cdot e^{-0{,}1t}$ ab ($T$ in °C, $t$ in Minuten). Welche Temperatur erreicht er langfristig?',
    [r'20 °C', r'90 °C', r'70 °C', r'0 °C'],
    [r'$e^{-0{,}1t} \to 0$ für $t \to \infty$.',
     r'$T(t) \to 20 + 70 \cdot 0 = 20$.',
     r'Der Tee nimmt die Raumtemperatur an; zu Beginn hat er $T(0) = 90$ °C.'])

Q.q(r'Ein Bestand wächst nach $N(t) = \dfrac{500}{1 + 9e^{-0{,}5t}}$. Welcher Grenze nähert er sich?',
    [r'500', r'50', r'$\infty$', r'450'],
    [r'$e^{-0{,}5t} \to 0$, also geht der Nenner gegen 1.',
     r'$N(t) \to \dfrac{500}{1} = 500$.',
     r'Startwert ist $N(0) = \dfrac{500}{10} = 50$: beschränktes Wachstum.'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    L = lambda e, to=sp.oo: sp.limit(e, x, to)
    assert L(1 / x) == 0
    assert L((3 * x + 1) / x) == 3
    assert L((2 * x ** 2 - 5) / (x ** 2 + 1)) == 2
    assert L(4 * x / (x ** 2 + 1)) == 0
    assert L(x ** 3 - 100 * x ** 2) == sp.oo
    assert L(-2 * x ** 4 + x) == -sp.oo and L(-2 * x ** 4 + x, -sp.oo) == -sp.oo
    assert L(x ** 3, -sp.oo) == -sp.oo
    assert L((x + 1) / x) == 1
    assert L((6 * x + 1) / (2 * x - 3)) == 3
    assert L(2 + 1 / x ** 2) == 2
    assert L(3 / (x + 1)) == 0 and L(x / (x + 1)) == 1
    assert L(sp.sin(x) / x) == 0
    assert L(sp.exp(x), -sp.oo) == 0
    assert L(5 - 2 * sp.exp(-x)) == 5
    assert L(x * sp.exp(-x)) == 0
    assert abs(10 / sp.exp(10).evalf() - 0.000454) < 1e-5
    assert L(sp.log(x)) == sp.oo
    assert L(8 * x / (x ** 2 + 4)) == 0
    assert L(20 + 70 * sp.exp(-x / 10)) == 20
    assert L(500 / (1 + 9 * sp.exp(-x / 2))) == 500 and (500 / (1 + 9 * sp.exp(0))) == 50


Q.verify(check)
Q.save()
