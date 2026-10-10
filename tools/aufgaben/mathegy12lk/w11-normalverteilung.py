#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 11 (LB 6): Normalverteilte Zufallsgrößen - Dichte- und
Verteilungsfunktion, Erwartungswert, Varianz, Standardabweichung, Sigma-Regeln. Alle 20 Fragen neu.
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12lk
from statistics import NormalDist
import sympy as sp

Q = gy12lk(nr=11, slug='normalverteilung', thema='Normalverteilte Zufallsgrößen', lb='LB 6',
           blurb='Glockenkurve, Dichte- und Verteilungsfunktion, Kenngrößen, Sigma-Regeln, Wahrscheinlichkeiten mit dem CAS',
           comment='Blocks: Dichtefunktion (1-6), Verteilungsfunktion und Flächen (7, 8, 12), Sigma-Regeln (9-11, 13), Rechnen mit dem CAS (14, 16, 18, 19), Kenngrößen und Standardisierung (15, 17), Gauß (20). Mit Hilfsmitteln.')

Q.q(r'Wie lautet die Dichtefunktion einer normalverteilten Zufallsgröße mit dem Erwartungswert $\mu$ und der Standardabweichung $\sigma$?',
    [r'$\varphi(x) = \dfrac{1}{\sigma\sqrt{2\pi}}\,\mathrm{e}^{-\frac{(x - \mu)^2}{2\sigma^2}}$', r'$\varphi(x) = \mathrm{e}^{-\frac{(x - \mu)^2}{2\sigma^2}}$',
     r'$\varphi(x) = \dfrac{1}{\sigma\sqrt{2\pi}}\,\mathrm{e}^{-\frac{x - \mu}{2\sigma}}$', r'$\varphi(x) = \dfrac{1}{\sqrt{2\pi}}\,\mathrm{e}^{-\frac{(x - \mu)^2}{2}}$'],
    [r'Der Faktor $\tfrac{1}{\sigma\sqrt{2\pi}}$ sorgt dafür, dass die Fläche unter der Kurve $1$ ist.',
     r'Im Exponenten steht das Quadrat $(x - \mu)^2$, so ist die Kurve symmetrisch zu $x = \mu$. Ohne $\mu$ und $\sigma$ ist es nur die Standardnormalverteilung.'])

Q.q(r'Wo hat die Dichtefunktion $\varphi_{\mu;\sigma}$ ihr Maximum?',
    [r'bei $x = \mu$', r'bei $x = \mu \pm \sigma$', r'bei $x = 0$', r'bei $x = \sigma$'],
    [r'Der Exponent $-\tfrac{(x - \mu)^2}{2\sigma^2}$ ist am größten, nämlich $0$, für $x = \mu$.',
     r'Dort ist $\varphi(\mu) = \tfrac{1}{\sigma\sqrt{2\pi}}$; nach beiden Seiten fällt die Glocke symmetrisch ab.'])

Q.q(r'Wo liegen die Wendestellen der Glockenkurve $\varphi_{\mu;\sigma}$?',
    [r'bei $x = \mu \pm \sigma$', r'bei $x = \mu \pm 2\sigma$', r'bei $x = \mu$', r'bei $x = \mu \pm \sigma^2$'],
    [r'$\varphi^{\prime\prime}(x) = 0$ führt auf $(x - \mu)^2 = \sigma^2$.',
     r'Also $x = \mu \pm \sigma$: Die Standardabweichung ist der Abstand der Wendestellen vom Maximum.'])

Q.q(r'Welchen Wert hat $\int_{-\infty}^{\infty} \varphi_{\mu;\sigma}(x)\,\mathrm{d}x$?',
    [r'$1$', r'$\mu$', r'$\sigma$', r'$\tfrac12$'],
    [r'$\int_{-\infty}^{\infty} \varphi(x)\,\mathrm{d}x = P(-\infty < X < \infty)$.',
     r'Das ist die Wahrscheinlichkeit des sicheren Ereignisses, also $1$.'])

Q.q(r'Wie ändert sich die Glockenkurve, wenn $\sigma$ größer wird und $\mu$ gleich bleibt?',
    [r'Sie wird breiter und flacher.', r'Sie wird schmaler und höher.', r'Sie verschiebt sich nach rechts.', r'Sie bleibt gleich, nur die Fläche wächst.'],
    [r'Die Wendestellen $\mu \pm \sigma$ rücken nach außen, das Maximum $\tfrac{1}{\sigma\sqrt{2\pi}}$ wird kleiner.',
     r'Die Fläche bleibt $1$; eine Verschiebung bewirkt nur $\mu$.'])

Q.q(r'$X$ ist normalverteilt. Wie groß ist $P(X = 5)$?',
    [r'$0$', r'$\varphi(5)$', r'$F(5)$', r'$\tfrac12$'],
    [r'Bei einer stetigen Zufallsgröße sind Wahrscheinlichkeiten Flächen: $P(X = 5) = \int_5^5 \varphi(x)\,\mathrm{d}x$.',
     r'Ein Integral über ein Intervall der Breite $0$ ist $0$. $\varphi(5)$ ist eine Dichte, keine Wahrscheinlichkeit. Deshalb ist auch $P(X \le 5) = P(X < 5)$.'])

Q.q(r'Was gibt die Verteilungsfunktion $F(x) = \int_{-\infty}^{x} \varphi(t)\,\mathrm{d}t$ an?',
    [r'$P(X \le x)$', r'$P(X = x)$', r'$P(X \ge x)$', r'die Höhe der Glockenkurve an der Stelle $x$'],
    [r'$F(x)$ ist die Fläche unter der Glocke links von $x$.',
     r'Das ist die Wahrscheinlichkeit $P(X \le x)$; $F$ steigt von $0$ bis $1$ und ist eine Stammfunktion von $\varphi$.'])

Q.q(r'Wie berechnet man $P(a \le X \le b)$ mit der Verteilungsfunktion $F$?',
    [r'$F(b) - F(a)$', r'$F(a) - F(b)$', r'$F(b) + F(a)$', r'$\varphi(b) - \varphi(a)$'],
    [r'$P(a \le X \le b) = \int_a^b \varphi(x)\,\mathrm{d}x$.',
     r'Nach dem Hauptsatz ist das $F(b) - F(a)$, denn $F$ ist eine Stammfunktion von $\varphi$.'])

Q.q(r'Wie groß ist $P(\mu - \sigma \le X \le \mu + \sigma)$ bei jeder Normalverteilung ungefähr?',
    [r'$68{,}3\,\%$', r'$95{,}4\,\%$', r'$99{,}7\,\%$', r'$50\,\%$'],
    [r'Standardisiert: $P(-1 \le Z \le 1) = 2\,\Phi(1) - 1$.',
     r'$\approx 0{,}683$, unabhängig von $\mu$ und $\sigma$. $95{,}4\,\%$ gehört zu $2\sigma$, $99{,}7\,\%$ zu $3\sigma$.'])

Q.q(r'Wie groß ist $P(\mu - 2\sigma \le X \le \mu + 2\sigma)$ ungefähr?',
    [r'$95{,}4\,\%$', r'$68{,}3\,\%$', r'$99{,}7\,\%$', r'$90\,\%$'],
    [r'$2\,\Phi(2) - 1 \approx 0{,}954$.',
     r'In der $2\sigma$-Umgebung liegen also etwa $95\,\%$ aller Werte.'])

Q.q(r'Die Körpergröße erwachsener Männer sei normalverteilt mit $\mu = 180$ cm und $\sigma = 7$ cm. Wie groß ist $P(173 \le X \le 187)$ ungefähr?',
    [r'$68{,}3\,\%$', r'$95{,}4\,\%$', r'$34{,}1\,\%$', r'$7\,\%$'],
    [r'$173 = \mu - \sigma$ und $187 = \mu + \sigma$.',
     r'Das ist die $1\sigma$-Umgebung: $\approx 68{,}3\,\%$. $34{,}1\,\%$ ist nur eine Hälfte davon.'])

Q.q(r'$X$ ist normalverteilt mit dem Erwartungswert $\mu$. Wie groß ist $P(X \le \mu)$?',
    [r'$0{,}5$', r'$0$', r'$0{,}683$', r'Das hängt von $\sigma$ ab.'],
    [r'Die Glockenkurve ist symmetrisch zu $x = \mu$.',
     r'Links von $\mu$ liegt genau die halbe Fläche: $F(\mu) = 0{,}5$ für jedes $\sigma$.'])

Q.q(r'Wie groß ist $P(X > \mu + 2\sigma)$ ungefähr?',
    [r'$2{,}3\,\%$', r'$4{,}6\,\%$', r'$5\,\%$', r'$15{,}9\,\%$'],
    [r'Außerhalb der $2\sigma$-Umgebung liegen $1 - 0{,}954 = 0{,}046$.',
     r'Wegen der Symmetrie die Hälfte davon rechts: $\approx 2{,}3\,\%$. $15{,}9\,\%$ gehört zu $X > \mu + \sigma$.'])

Q.q(r'Eine Maschine füllt Packungen mit normalverteiltem Inhalt, $\mu = 500$ g, $\sigma = 4$ g. Berechne mit dem CAS $P(X \le 505)$.',
    [r'$\approx 89{,}4\,\%$', r'$\approx 10{,}6\,\%$', r'$\approx 78{,}9\,\%$', r'$\approx 62{,}5\,\%$'],
    [r'Standardisiert: $z = \tfrac{505 - 500}{4} = 1{,}25$, also $P(X \le 505) = \Phi(1{,}25)$.',
     r'$\Phi(1{,}25) \approx 0{,}894$. $10{,}6\,\%$ wäre $P(X > 505)$, $78{,}9\,\%$ wäre $P(495 \le X \le 505)$.'])

Q.q(r'$X$ ist normalverteilt mit $\mu$ und $\sigma$. Welche Verteilung hat $Z = \dfrac{X - \mu}{\sigma}$?',
    [r'die Standardnormalverteilung mit $\mu = 0$ und $\sigma = 1$', r'die Normalverteilung mit $\mu$ und $\sigma = 1$',
     r'die Binomialverteilung', r'die Gleichverteilung auf $[0;\ 1]$'],
    [r'Subtrahieren von $\mu$ verschiebt die Glocke zur Mitte $0$, Teilen durch $\sigma$ macht die Breite $1$.',
     r'$Z$ ist standardnormalverteilt; seine Verteilungsfunktion heißt $\Phi$, und $P(X \le x) = \Phi\!\left(\tfrac{x - \mu}{\sigma}\right)$.'])

Q.q(r'Beim Abfüllen ist $\mu = 500$ g. Wie groß muss $\sigma$ sein, damit $P(X \le 520) = 0{,}9$ gilt?',
    [r'$\sigma \approx 15{,}6$ g', r'$\sigma \approx 25{,}6$ g', r'$\sigma \approx 10{,}0$ g', r'$\sigma \approx 7{,}8$ g'],
    [r'$\Phi\!\left(\tfrac{20}{\sigma}\right) = 0{,}9$ gibt $\tfrac{20}{\sigma} \approx 1{,}2816$ (CAS: inverse Normalverteilung).',
     r'$\sigma \approx \tfrac{20}{1{,}2816} \approx 15{,}6$ g. Mit $\tfrac{20}{2}$ käme die $2\sigma$-Regel heraus, die zu $97{,}7\,\%$ gehört.'])

Q.q(r'$X$ ist normalverteilt mit $\mu = 10$ und $\sigma = 3$. Wie groß ist die Varianz $V(X)$?',
    [r'$9$', r'$3$', r'$10$', r'$\sqrt3$'],
    [r'Die Varianz ist das Quadrat der Standardabweichung: $V(X) = \sigma^2$.',
     r'$3^2 = 9$. Der Erwartungswert $E(X) = 10$ ist die Lage der Glocke.'])

Q.q(r'Die Körpergröße sei normalverteilt mit $\mu = 180$ cm und $\sigma = 7$ cm. Ab welcher Größe gehört man zu den größten $5\,\%$?',
    [r'$\approx 191{,}5$ cm', r'$\approx 194$ cm', r'$\approx 187$ cm', r'$\approx 193{,}7$ cm'],
    [r'Gesucht ist $x$ mit $P(X \le x) = 0{,}95$; das $95\,\%$-Quantil von $Z$ ist $\approx 1{,}645$.',
     r'$x \approx 180 + 1{,}645 \cdot 7 \approx 191{,}5$ cm. $193{,}7$ cm gehört zu $1{,}96\,\sigma$, also zu $2{,}5\,\%$ auf einer Seite.'])

Q.q(r'$X$ ist normalverteilt mit $\mu = 180$, und es gilt $P(X \le 170) = 0{,}08$. Wie groß ist $P(X \ge 190)$?',
    [r'$0{,}08$', r'$0{,}92$', r'$0{,}84$', r'$0{,}16$'],
    [r'$170$ und $190$ liegen symmetrisch zu $\mu = 180$.',
     r'Wegen der Symmetrie der Glocke ist $P(X \ge 190) = P(X \le 170) = 0{,}08$, ohne $\sigma$ zu kennen.'])

Q.q(r'Welcher Geldschein zeigte die Glockenkurve neben dem Bild ihres Namensgebers?',
    [r'der 10-DM-Schein mit Carl Friedrich Gauß', r'der 100-DM-Schein mit Clara Schumann', r'der 5-Euro-Schein', r'der 20-DM-Schein mit Annette von Droste-Hülshoff'],
    [r'Die Normalverteilung heißt nach Carl Friedrich Gauß (1777–1855) auch Gauß-Verteilung.',
     r'Der 10-DM-Schein der letzten Serie (im Umlauf ab 16.04.1991) zeigte Gauß, die Glockenkurve und historische Gebäude Göttingens (Quelle: Planet Wissen, WDR, Geschichte der D-Mark).'])


def check():
    Z = NormalDist()
    x, mu = sp.symbols('x mu', real=True)
    s = sp.symbols('sigma', positive=True)
    phi = 1/(s*sp.sqrt(2*sp.pi)) * sp.exp(-(x - mu)**2/(2*s**2))
    assert sp.simplify(sp.integrate(phi.subs({mu: 0, s: 1}), (x, -sp.oo, sp.oo))) == 1
    assert sp.solve(sp.diff(phi, x), x) == [mu]
    assert set(sp.solve(sp.simplify(sp.diff(phi, x, 2) / phi), x)) == {mu - s, mu + s}
    assert round(2*Z.cdf(1) - 1, 3) == 0.683 and round(2*Z.cdf(2) - 1, 3) == 0.954 and round(2*Z.cdf(3) - 1, 3) == 0.997
    assert round(1 - Z.cdf(2), 3) == 0.023 and round(1 - Z.cdf(1), 3) == 0.159
    P = NormalDist(500, 4)
    assert round(P.cdf(505), 3) == 0.894 and round(1 - P.cdf(505), 3) == 0.106 and round(P.cdf(505) - P.cdf(495), 3) == 0.789
    z90 = Z.inv_cdf(0.9)
    assert round(z90, 4) == 1.2816 and round(20 / z90, 1) == 15.6
    assert round(NormalDist(500, 20 / z90).cdf(520), 6) == 0.9 and round(Z.cdf(2), 3) == 0.977
    K = NormalDist(180, 7)
    assert round(K.inv_cdf(0.95), 1) == 191.5 and round(180 + Z.inv_cdf(0.975)*7, 1) == 193.7
    assert round(K.cdf(187) - K.cdf(173), 3) == 0.683
    s2 = NormalDist(180, 7.1)
    assert abs(s2.cdf(170) - (1 - s2.cdf(190))) < 1e-12
    assert 3**2 == 9


Q.verify(check)
Q.save()
