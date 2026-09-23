#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 25 (LB 4): Gebrochenrationale Funktionen I - Definitionsbereich,
Polstellen und hebbare Lücken, Verhalten im Unendlichen, achsenparallele Asymptoten.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=25, slug='gebrochenrational1', thema='Gebrochenrationale Funktionen I', lb='LB 4',
          blurb='Definitionsbereich, Polstellen und Lücken, Verhalten im Unendlichen, Asymptoten',
          comment='Blocks: Definitionsbereich (1-5), Polstellen und hebbare Lücken (6-10), Verhalten im Unendlichen (11-15), Asymptoten und Kurvenverlauf (16-20). GTR ohne CAS.')


# ------------------------------------------------------------- figures ----
def fig_pol():
    f = lambda x: 1.0 / (x - 2)
    p = S.Plot((-2.4, 6.4), (-5.2, 5.2), w=520, h=330)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.seg((2, -5.2), (2, 5.2), S.MUTED, 1.4, dash="6 4")
    p.curve(f, -2.3, 1.78, S.RED, 2.2)
    p.curve(f, 2.22, 6.3, S.RED, 2.2)
    return p.svg("Graph von f mit der senkrechten Asymptote x gleich 2")


def fig_hyperbel():
    f = lambda x: (3 * x - 2) / (x + 1)
    p = S.Plot((-6.4, 4.4), (-4.6, 9.4), w=520, h=340)
    p.axes(1, 2, xlabel="x", ylabel="y")
    p.seg((-1, -4.6), (-1, 9.4), S.MUTED, 1.4, dash="6 4")
    p.seg((-6.4, 3), (4.4, 3), S.MUTED, 1.4, dash="6 4")
    p.curve(f, -6.3, -1.2, S.RED, 2.2)
    p.curve(f, -0.8, 4.3, S.RED, 2.2)
    return p.svg("Graph mit den Asymptoten x gleich minus 1 und y gleich 3")


# ------------------------------------------------------- Definitionsbereich ----
Q.q(r'Bestimme den Definitionsbereich von $f(x) = \dfrac{5}{x-3}$.',
    [r'$D = \mathbb{R} \setminus \{3\}$', r'$D = \mathbb{R} \setminus \{-3\}$', r'$D = \mathbb{R} \setminus \{0\}$', r'$D = \mathbb{R} \setminus \{5\}$'],
    [r'Verboten ist nur, was den Nenner null macht: $x - 3 = 0$, also $x = 3$.',
     r'$D = \mathbb{R} \setminus \{3\}$',
     r'Falle: das Vorzeichen drehen. Aus $x - 3 = 0$ folgt $x = +3$, nicht $x = -3$.'])

Q.q(r'Bestimme den Definitionsbereich von $f(x) = \dfrac{2x}{x^2-9}$.',
    [r'$D = \mathbb{R} \setminus \{-3;\,3\}$', r'$D = \mathbb{R} \setminus \{3\}$', r'$D = \mathbb{R} \setminus \{9\}$', r'$D = \mathbb{R} \setminus \{0;\,3\}$'],
    [r'Nenner null setzen: $x^2 - 9 = 0$, also $x^2 = 9$.',
     r'Eine quadratische Gleichung hat hier zwei Lösungen: $x = 3$ und $x = -3$.',
     r'Falle: nur die positive Wurzel nehmen. Der Zähler darf null werden - $x = 0$ ist erlaubt.'])

Q.q(r'Bestimme den Definitionsbereich von $f(x) = \dfrac{3x}{x^2+1}$.',
    [r'$D = \mathbb{R}$', r'$D = \mathbb{R} \setminus \{-1;\,1\}$', r'$D = \mathbb{R} \setminus \{-1\}$', r'$D = \mathbb{R} \setminus \{0\}$'],
    [r'$x^2 + 1 = 0$ hätte $x^2 = -1$ zur Folge - das hat keine reelle Lösung.',
     r'Der Nenner ist für jedes $x$ mindestens $1$, also $D = \mathbb{R}$.',
     r'Merke: $x^2 + 1$ ist eine Summe, keine Differenz - hier gibt es nichts wegzukürzen.'])

Q.q(r'Bestimme den Definitionsbereich von $f(x) = \dfrac{x-1}{x^2-5x+6}$.',
    [r'$D = \mathbb{R} \setminus \{2;\,3\}$', r'$D = \mathbb{R} \setminus \{-2;\,-3\}$', r'$D = \mathbb{R} \setminus \{1\}$', r'$D = \mathbb{R} \setminus \{5;\,6\}$'],
    [r'Nenner null: $x^2 - 5x + 6 = 0$. Satz von Vieta: Summe $5$, Produkt $6$.',
     r'Also $x = 2$ und $x = 3$; Probe: $2 + 3 = 5$ und $2 \cdot 3 = 6$.',
     r'Falle: $x = 1$ ist die Nullstelle des Zählers - die gehört zum Definitionsbereich dazu.'])

Q.q(r'Bestimme den Definitionsbereich von $f(x) = \dfrac{x+4}{x^2+2x}$.',
    [r'$D = \mathbb{R} \setminus \{-2;\,0\}$', r'$D = \mathbb{R} \setminus \{2;\,0\}$', r'$D = \mathbb{R} \setminus \{-2\}$', r'$D = \mathbb{R} \setminus \{-4\}$'],
    [r'Ausklammern: $x^2 + 2x = x \cdot (x + 2)$.',
     r'Ein Produkt ist null, wenn ein Faktor null ist: $x = 0$ oder $x = -2$.',
     r'Falle: die Lösung $x = 0$ übersehen, weil sie beim Ausklammern so unscheinbar aussieht.'])

# ------------------------------------------- Polstellen und hebbare Lücken ----
Q.q(r'Was passiert bei $f(x) = \dfrac{x^2-16}{x-4}$ an der Stelle $x = 4$?',
    [r'hebbare Lücke bei $L(4 \mid 8)$', r'Polstelle bei $x = 4$', r'Nullstelle bei $x = 4$', r'hebbare Lücke bei $L(4 \mid 0)$'],
    [r'$x = 4$ gehört nicht zu $D$, denn der Nenner wird null. Also erst kürzen.',
     r'$\dfrac{x^2-16}{x-4} = \dfrac{(x-4)(x+4)}{x-4} = x + 4$ für $x \neq 4$.',
     r'Der Faktor $(x-4)$ kürzt sich weg: hebbare Lücke. Der Lückenwert ist $4 + 4 = 8$, also $L(4 \mid 8)$.'])

Q.q(r'Untersuche $f(x) = \dfrac{x-2}{(x-2)(x+3)}$ auf Polstellen und Lücken.',
    [r'hebbare Lücke bei $x = 2$, Polstelle bei $x = -3$', r'Polstellen bei $x = 2$ und $x = -3$', r'hebbare Lücken bei $x = 2$ und $x = -3$', r'Polstelle bei $x = 2$, hebbare Lücke bei $x = -3$'],
    [r'$D = \mathbb{R} \setminus \{-3;\,2\}$ - beide Nullstellen des Nenners fehlen zunächst.',
     r'Kürzen: $f(x) = \dfrac{1}{x+3}$ für $x \neq 2$. Der Faktor $(x-2)$ verschwindet, $(x+3)$ bleibt stehen.',
     r'Gekürzter Faktor bedeutet hebbare Lücke, stehengebliebener Faktor bedeutet Polstelle.'])

Q.q(r'Wie verhält sich $f(x) = \dfrac{1}{x-2}$ links und rechts der Polstelle?',
    [r'für $x \to 2^{-}$ gilt $f(x) \to -\infty$, für $x \to 2^{+}$ gilt $f(x) \to +\infty$',
     r'auf beiden Seiten gilt $f(x) \to +\infty$',
     r'auf beiden Seiten gilt $f(x) \to -\infty$',
     r'auf beiden Seiten gilt $f(x) \to 0$'],
    [r'Für $x$ knapp unter $2$ ist $x - 2$ eine sehr kleine negative Zahl, der Kehrwert also stark negativ: $f(1{,}9) = -10$.',
     r'Für $x$ knapp über $2$ ist $x - 2$ klein und positiv: $f(2{,}1) = 10$.',
     r'Der Nennerfaktor steht in ungerader Ordnung - Polstelle mit Vorzeichenwechsel.'],
    fig=fig_pol(), figcap=r'Graph von $f(x) = \dfrac{1}{x-2}$ mit der senkrechten Asymptote $x = 2$')

Q.q(r'Wie verhält sich $f(x) = \dfrac{1}{(x+1)^2}$ an der Stelle $x = -1$?',
    [r'auf beiden Seiten gilt $f(x) \to +\infty$ - Polstelle ohne Vorzeichenwechsel',
     r'links $f(x) \to -\infty$, rechts $f(x) \to +\infty$ - Polstelle mit Vorzeichenwechsel',
     r'auf beiden Seiten gilt $f(x) \to -\infty$',
     r'es liegt eine hebbare Lücke vor'],
    [r'$(x+1)^2$ ist für jedes $x \neq -1$ positiv, also ist auch $f(x)$ immer positiv.',
     r'$f(-1{,}1) = \dfrac{1}{0{,}01} = 100$ und $f(-0{,}9) = 100$ - beide Seiten laufen nach oben.',
     r'Gerade Ordnung des Nennerfaktors bedeutet: kein Vorzeichenwechsel.'])

Q.q(r'Untersuche $f(x) = \dfrac{x+3}{x^2-9}$ an den Stellen $x = -3$ und $x = 3$.',
    [r'hebbare Lücke $L\left(-3 \mid -\dfrac{1}{6}\right)$, Polstelle bei $x = 3$',
     r'Polstellen bei $x = -3$ und $x = 3$',
     r'hebbare Lücke $L(-3 \mid 0)$, Polstelle bei $x = 3$',
     r'Polstelle bei $x = -3$, hebbare Lücke bei $x = 3$'],
    [r'Dritte binomische Formel: $x^2 - 9 = (x-3)(x+3)$, also $f(x) = \dfrac{x+3}{(x-3)(x+3)}$.',
     r'Kürzen: $f(x) = \dfrac{1}{x-3}$ für $x \neq -3$. Bei $x = -3$ bleibt eine hebbare Lücke.',
     r'Lückenwert: $\dfrac{1}{-3-3} = -\dfrac{1}{6}$. Bei $x = 3$ steht der Faktor noch im Nenner: Polstelle.'])

# ------------------------------------------------- Verhalten im Unendlichen ----
Q.q(r'Welchem Wert nähert sich $f(x) = \dfrac{2x+1}{x-3}$ für $x \to \pm\infty$?',
    [r'$f(x) \to 2$', r'$f(x) \to 0$', r'$f(x) \to \pm\infty$', r'$f(x) \to -\dfrac{1}{3}$'],
    [r'Zählergrad und Nennergrad sind beide $1$ - dann entscheiden die Leitkoeffizienten.',
     r'$\dfrac{2x+1}{x-3} = \dfrac{2 + \frac{1}{x}}{1 - \frac{3}{x}} \to \dfrac{2}{1} = 2$, denn $\dfrac{1}{x} \to 0$.',
     r'Kontrolle mit dem GTR: $f(1000) \approx 2{,}007$. Der Wert $-\dfrac{1}{3}$ ist $f(0)$, nicht der Grenzwert.'])

Q.q(r'Welchem Wert nähert sich $f(x) = \dfrac{3x}{x^2+1}$ für $x \to \pm\infty$?',
    [r'$f(x) \to 0$', r'$f(x) \to 3$', r'$f(x) \to 1$', r'$f(x) \to \pm\infty$'],
    [r'Der Nennergrad $2$ ist größer als der Zählergrad $1$: Der Nenner wächst schneller.',
     r'$f(100) = \dfrac{300}{10001} \approx 0{,}03$ und $f(1000) \approx 0{,}003$.',
     r'Zählergrad kleiner als Nennergrad bedeutet immer: Grenzwert $0$.'])

Q.q(r'Wie verhält sich $f(x) = \dfrac{x^2+1}{x-1}$ für $x \to +\infty$?',
    [r'$f(x) \to +\infty$ - es gibt keine waagerechte Asymptote', r'$f(x) \to 1$', r'$f(x) \to 0$', r'$f(x) \to -\infty$'],
    [r'Der Zählergrad $2$ ist größer als der Nennergrad $1$: Der Zähler gewinnt.',
     r'$f(100) = \dfrac{10001}{99} \approx 101$ und $f(1000) \approx 1002$ - die Werte wachsen über alle Grenzen.',
     r'Eine waagerechte Asymptote gibt es nur, wenn der Zählergrad höchstens so groß ist wie der Nennergrad.'])

Q.q(r'Welche dieser Funktionen hat die waagerechte Asymptote $y = 0$?',
    [r'$f(x) = \dfrac{5}{x^2+3}$', r'$f(x) = \dfrac{3x^2}{x^2+1}$', r'$f(x) = \dfrac{2x+1}{x-3}$', r'$f(x) = \dfrac{x^2}{x+1}$'],
    [r'Gefragt ist: Zählergrad kleiner als Nennergrad.',
     r'Bei $\dfrac{5}{x^2+3}$ ist der Zählergrad $0$ und der Nennergrad $2$ - Grenzwert $0$.',
     r'Die anderen haben die Grenzwerte $3$ bzw. $2$ bzw. gar keinen (Zählergrad größer).'])

Q.q(r'Wovon hängt es ab, ob der Graph von $f(x) = \dfrac{z(x)}{n(x)}$ eine waagerechte Asymptote hat?',
    [r'vom Vergleich der Grade von $z$ und $n$: Zählergrad $\leq$ Nennergrad',
     r'von der Anzahl der Nullstellen des Nenners',
     r'davon, ob sich der Bruch kürzen lässt',
     r'vom Vorzeichen des Leitkoeffizienten im Zähler'],
    [r'Zählergrad kleiner als Nennergrad: Asymptote $y = 0$.',
     r'Zählergrad gleich Nennergrad: Asymptote $y = \dfrac{\text{Leitkoeffizient von } z}{\text{Leitkoeffizient von } n}$.',
     r'Zählergrad größer als Nennergrad: keine waagerechte Asymptote. Die Nennernullstellen liefern die senkrechten Asymptoten - eine andere Frage.'])

# -------------------------------------------- Asymptoten und Kurvenverlauf ----
Q.q(r'Welche achsenparallelen Asymptoten hat der Graph von $f(x) = \dfrac{3x-2}{x+1}$?',
    [r'$x = -1$ und $y = 3$', r'$x = 1$ und $y = 3$', r'$x = -1$ und $y = -2$', r'$x = -1$ und $y = 0$'],
    [r'Senkrechte Asymptote an der Polstelle: $x + 1 = 0$, also $x = -1$.',
     r'Waagerechte Asymptote: gleicher Grad, Leitkoeffizienten $3$ und $1$, also $y = 3$.',
     r'Falle: $y = -2$ ist der Zähler bei $x = 0$, nicht der Grenzwert im Unendlichen.'],
    fig=fig_hyperbel(), figcap=r'Graph von $f(x) = \dfrac{3x-2}{x+1}$ mit beiden Asymptoten')

Q.q(r'Welche Asymptoten hat der Graph von $f(x) = 3 + \dfrac{1}{x+2}$?',
    [r'$x = -2$ und $y = 3$', r'$x = 2$ und $y = 3$', r'$x = -2$ und $y = 0$', r'$x = 3$ und $y = -2$'],
    [r'Der Bruch $\dfrac{1}{x+2}$ ist für $x = -2$ nicht definiert: senkrechte Asymptote $x = -2$.',
     r'Für $x \to \pm\infty$ wird $\dfrac{1}{x+2}$ beliebig klein, also $f(x) \to 3$.',
     r'Der Graph ist die um $2$ nach links und $3$ nach oben verschobene Hyperbel $y = \dfrac{1}{x}$.'])

Q.q(r'Der GTR zeigt einen Graphen mit der senkrechten Asymptote $x = 1$ und der waagerechten Asymptote $y = -2$. Welche Funktionsgleichung passt?',
    [r'$f(x) = \dfrac{-2x+3}{x-1}$', r'$f(x) = \dfrac{2x+3}{x-1}$', r'$f(x) = \dfrac{-2x+3}{x+1}$', r'$f(x) = \dfrac{x-2}{x-1}$'],
    [r'Senkrechte Asymptote $x = 1$: Der Nenner muss bei $x = 1$ null werden, also $x - 1$.',
     r'Waagerechte Asymptote $y = -2$: Die Leitkoeffizienten müssen sich zu $-2$ verhalten, also Zähler $-2x + \ldots$',
     r'Probe: $f(1000) = \dfrac{-1997}{999} \approx -2{,}0$. Bei $\dfrac{x-2}{x-1}$ wäre die Asymptote $y = 1$.'])

Q.q(r'Ein Betrieb hat Fixkosten von $4000$ € und $12$ € variable Kosten je Stück. Die Stückkosten sind $k(x) = \dfrac{4000 + 12x}{x}$ (in €, $x > 0$). Welchem Wert nähern sich die Stückkosten bei sehr großer Stückzahl?',
    [r'$12$ € - die Gerade $y = 12$ ist waagerechte Asymptote und wird nie erreicht',
     r'$0$ € - die Stückkosten verschwinden',
     r'$4000$ € - die Fixkosten bleiben übrig',
     r'$4012$ € - Fixkosten plus variable Kosten'],
    [r'Umformen: $k(x) = \dfrac{4000}{x} + \dfrac{12x}{x} = 12 + \dfrac{4000}{x}$.',
     r'Für große $x$ wird $\dfrac{4000}{x}$ beliebig klein: $k(1000) = 16$, $k(10\,000) = 12{,}4$.',
     r'Die Fixkosten verteilen sich auf immer mehr Stücke (Fixkostendegression), aber $12$ € je Stück bleiben immer.'])

Q.q(r'Untersuche $f(x) = \dfrac{x^2-9}{x^2-3x}$ vollständig auf Definitionslücken und Asymptoten.',
    [r'$D = \mathbb{R} \setminus \{0;\,3\}$, hebbare Lücke $L(3 \mid 2)$, Polstelle $x = 0$, waagerechte Asymptote $y = 1$',
     r'$D = \mathbb{R} \setminus \{0;\,3\}$, Polstellen $x = 0$ und $x = 3$, waagerechte Asymptote $y = 1$',
     r'$D = \mathbb{R} \setminus \{3\}$, hebbare Lücke $L(3 \mid 2)$, waagerechte Asymptote $y = 0$',
     r'$D = \mathbb{R} \setminus \{0;\,3\}$, hebbare Lücke $L(3 \mid 0)$, Polstelle $x = 0$, keine waagerechte Asymptote'],
    [r'Nenner: $x^2 - 3x = x(x-3)$, also $D = \mathbb{R} \setminus \{0;\,3\}$.',
     r'Zähler: $x^2 - 9 = (x-3)(x+3)$. Kürzen ergibt $f(x) = \dfrac{x+3}{x}$ für $x \neq 3$.',
     r'Lückenwert: $\dfrac{3+3}{3} = 2$, also $L(3 \mid 2)$. Bei $x = 0$ bleibt eine Polstelle.',
     r'Gleicher Grad in Zähler und Nenner, beide Leitkoeffizienten $1$: waagerechte Asymptote $y = 1$.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x = sp.symbols('x', real=True)
    z = lambda a, b: sp.simplify(a - b) == 0
    # Q1-5: Definitionsbereiche = Nullstellen der Nenner
    assert sp.solve(x - 3, x) == [3]
    assert sorted(sp.solve(x**2 - 9, x)) == [-3, 3]
    assert sp.solve(x**2 + 1, x) == [] and all((v**2 + 1) >= 1 for v in (-5, 0, 5))
    assert sorted(sp.solve(x**2 - 5 * x + 6, x)) == [2, 3] and 2 + 3 == 5 and 2 * 3 == 6
    assert sorted(sp.solve(x**2 + 2 * x, x)) == [-2, 0] and z(x**2 + 2 * x, x * (x + 2))
    # Q6: (x^2-16)/(x-4) kürzt zu x+4, Lücke L(4|8)
    assert z(sp.cancel((x**2 - 16) / (x - 4)), x + 4) and sp.limit((x**2 - 16) / (x - 4), x, 4) == 8
    # Q7: (x-2)/((x-2)(x+3)) -> 1/(x+3), Pol bei -3
    g = (x - 2) / ((x - 2) * (x + 3))
    assert z(sp.cancel(g), 1 / (x + 3)) and sp.limit(g, x, 2) == F(1, 5)
    assert sp.limit(g, x, -3, '+') == sp.oo and sp.limit(g, x, -3, '-') == -sp.oo
    # Q8: 1/(x-2) - Pol mit Vorzeichenwechsel
    h = 1 / (x - 2)
    assert sp.limit(h, x, 2, '-') == -sp.oo and sp.limit(h, x, 2, '+') == sp.oo
    assert h.subs(x, F(19, 10)) == -10 and h.subs(x, F(21, 10)) == 10
    # Q9: 1/(x+1)^2 - Pol ohne Vorzeichenwechsel
    k = 1 / (x + 1)**2
    assert sp.limit(k, x, -1, '-') == sp.oo and sp.limit(k, x, -1, '+') == sp.oo
    assert k.subs(x, F(-11, 10)) == 100 and k.subs(x, F(-9, 10)) == 100
    # Q10: (x+3)/(x^2-9) -> 1/(x-3), Lücke bei -3 mit Wert -1/6, Pol bei 3
    m = (x + 3) / (x**2 - 9)
    assert z(sp.cancel(m), 1 / (x - 3)) and sp.limit(m, x, -3) == F(-1, 6)
    assert sp.limit(m, x, 3, '+') == sp.oo and sp.limit(m, x, 3, '-') == -sp.oo
    assert z(x**2 - 9, (x - 3) * (x + 3))
    # Q11: (2x+1)/(x-3) -> 2
    a = (2 * x + 1) / (x - 3)
    assert sp.limit(a, x, sp.oo) == 2 and sp.limit(a, x, -sp.oo) == 2
    assert abs(float(a.subs(x, 1000)) - 2.007) < 0.0005 and a.subs(x, 0) == F(-1, 3)
    # Q12: 3x/(x^2+1) -> 0
    b = 3 * x / (x**2 + 1)
    assert sp.limit(b, x, sp.oo) == 0 and b.subs(x, 100) == F(300, 10001)
    assert abs(float(b.subs(x, 100)) - 0.03) < 0.0005 and abs(float(b.subs(x, 1000)) - 0.003) < 0.0005
    # Q13: (x^2+1)/(x-1) -> unendlich
    c = (x**2 + 1) / (x - 1)
    assert sp.limit(c, x, sp.oo) == sp.oo and c.subs(x, 100) == F(10001, 99)
    assert abs(float(c.subs(x, 100)) - 101) < 1 and abs(float(c.subs(x, 1000)) - 1002) < 1
    # Q14: nur 5/(x^2+3) hat den Grenzwert 0
    assert sp.limit(5 / (x**2 + 3), x, sp.oo) == 0
    assert sp.limit(3 * x**2 / (x**2 + 1), x, sp.oo) == 3
    assert sp.limit((2 * x + 1) / (x - 3), x, sp.oo) == 2 and sp.limit(x**2 / (x + 1), x, sp.oo) == sp.oo
    # Q16: (3x-2)/(x+1): Pol x=-1, Asymptote y=3
    d = (3 * x - 2) / (x + 1)
    assert sp.solve(x + 1, x) == [-1] and sp.limit(d, x, sp.oo) == 3 and (3 * 0 - 2) == -2
    # Q17: 3 + 1/(x+2)
    e = 3 + 1 / (x + 2)
    assert sp.limit(e, x, sp.oo) == 3 and sp.limit(e, x, -2, '+') == sp.oo
    # Q18: (-2x+3)/(x-1) hat Pol x=1 und Asymptote y=-2
    p = (-2 * x + 3) / (x - 1)
    assert sp.limit(p, x, sp.oo) == -2 and sp.solve(x - 1, x) == [1]
    assert p.subs(x, 1000) == F(-1997, 999) and abs(float(p.subs(x, 1000)) + 2.0) < 0.002
    assert sp.limit((2 * x + 3) / (x - 1), x, sp.oo) == 2 and sp.limit((x - 2) / (x - 1), x, sp.oo) == 1
    assert sp.limit((-2 * x + 3) / (x + 1), x, sp.oo) == -2 and sp.solve(x + 1, x) == [-1]
    # Q19: k(x) = (4000+12x)/x -> 12
    kk = (4000 + 12 * x) / x
    assert z(kk, 12 + 4000 / x) and sp.limit(kk, x, sp.oo) == 12
    assert kk.subs(x, 1000) == 16 and kk.subs(x, 10000) == F(62, 5) and F(62, 5) == F(124, 10)
    # Q20: (x^2-9)/(x^2-3x) -> (x+3)/x, Lücke L(3|2), Pol 0, Asymptote y=1
    n = (x**2 - 9) / (x**2 - 3 * x)
    assert z(sp.cancel(n), (x + 3) / x) and sp.limit(n, x, 3) == 2
    assert sp.limit(n, x, 0, '+') == sp.oo and sp.limit(n, x, 0, '-') == -sp.oo
    assert sp.limit(n, x, sp.oo) == 1 and sorted(sp.solve(x**2 - 3 * x, x)) == [0, 3]


Q.verify(check)
Q.save()
