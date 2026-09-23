#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 39 (Exkurs, Wahlbereich 1): Zentralprojektion - Projektionszentrum,
Bildebene, Fluchtpunkte und Horizont, Ein- und Zweipunktperspektive, Abgrenzung zur
Parallelprojektion, Beispiele aus Malerei und Technik, Rechnen mit dem Strahlensatz und
mit Bildkoordinaten. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
import svgfig as S

Q = fos12(nr=39, slug='zentralprojektion', thema='Zentralprojektion', lb='Exkurs',
          blurb='Fluchtpunkte, Eigenschaften, Perspektive in Kunst und Technik',
          comment='Blocks: Begriffe und Eigenschaften (1-5), Kunst und Technik (6-8), Strahlensatz und Verkürzung (9-13), Bildkoordinaten und Fluchtpunkte (14-20). Alles ohne CAS.')


# ------------------------------------------------------------------ figures ----
def fig_schienen():
    """Railway in one-point perspective: rails and sleepers meet at F on the horizon.
    Depth z maps to y = hy + 180/z and half width 130/z, so every sleeper end lies on the rails."""
    c = S.Canvas(520, 300)
    hy = 110.0
    fx = 260.0
    c.line(20, hy, 500, hy, S.MUTED, 1.2, dash="6 4")
    c.text(496, hy - 8, "Horizont", 12, S.MUTED, "end")
    z = 1.0
    while z < 9:
        y = hy + 180.0 / z
        half = 130.0 / z
        c.line(fx - half, y, fx + half, y, "#8A96AE", max(0.7, 3.2 / z), cap="butt")
        z += 0.3
    for x0 in (130.0, 390.0):
        c.line(x0, hy + 180.0, fx, hy, S.INK, 2.0)
    c.circle(fx, hy, 4.2, S.RED)
    c.text(fx + 10, hy - 9, "F", 14, S.RED, "start", italic=True)
    return c.svg("Schienen in Einpunktperspektive")


def fig_strahlensatz():
    """Side view of the projection: eye O on the ground line, image plane at d = 1 m,
    a person of 1.80 m at a = 6 m; the ray to the head crosses the plane at h = 0.30 m."""
    c = S.Canvas(520, 250)
    ox, oy, sc = 50.0, 190.0, 62.0
    d, a, hgt = 1.0, 6.0, 1.8
    bx, px = ox + d * sc, ox + a * sc
    ptop = oy - hgt * sc
    hi = hgt * d / a
    c.line(ox, oy, px + 40, oy, S.MUTED, 1.2)
    c.line(bx, 40, bx, oy + 14, S.INK, 1.4, dash="6 4")
    c.text(bx, 32, "Bildebene", 12, S.INK)
    c.line(ox, oy, px, ptop, S.RED, 1.6)
    c.line(px, oy, px, ptop, S.GREEN, 4.0)
    c.circle(px, ptop, 3.6, S.GREEN)
    c.text(px + 10, ptop + 4, "P", 14, S.GREEN, "start", italic=True)
    c.line(bx, oy, bx, oy - hi * sc, S.ORANGE, 4.0)
    c.circle(bx, oy - hi * sc, 3.6, S.ORANGE)
    c.text(bx + 9, oy - hi * sc - 6, "P′", 14, S.ORANGE, "start", italic=True)
    c.circle(ox, oy, 4.2, S.INK)
    c.text(ox, oy + 20, "O (Auge)", 12, S.INK)
    c.text(px + 12, (oy + ptop) / 2 + 4, "h", 14, S.GREEN, "start", italic=True)
    c.text(px + 24, (oy + ptop) / 2 + 4, "= $1{,}80$ m", 12, S.GREEN, "start", tex=True)
    c.text(bx + 9, oy - hi * sc / 2 + 5, "h′ = ?", 12, S.ORANGE, "start", italic=True)
    y1 = oy + 34
    c.arrow(ox, y1, bx, y1, S.MUTED)
    c.arrow(bx, y1, ox, y1, S.MUTED)
    c.text((ox + bx) / 2, y1 + 16, "d = $1$ m", 11.5, S.MUTED, tex=True)
    y2 = oy + 52
    c.arrow(ox, y2, px, y2, S.MUTED)
    c.arrow(px, y2, ox, y2, S.MUTED)
    c.text((ox + px) / 2, y2 - 6, "a = $6$ m", 11.5, S.MUTED, tex=True)
    return c.svg("Strahlensatz an der Zentralprojektion, Seitenansicht")


def fig_schienenbild():
    """Picture coordinates (cm) of the two rails in a photo - the student finds F."""
    p = S.Plot((-1, 11), (-1, 9), w=520, h=340)
    p.grid(1, 1)
    p.axes(xstep=1, ystep=1, xlabel="x", ylabel="y", origin=None, defer_labels=True)
    p.seg((0, 0), (2, 4), S.RED, 2.2)
    p.seg((10, 0), (7, 4), S.RED, 2.2)
    p.point(0, 0, "A(0|0)", "below-right")
    p.point(2, 4, "B(2|4)", "left")
    p.point(10, 0, "C(10|0)", "above-right")
    p.point(7, 4, "D(7|4)", "right")
    p.draw_labels()
    return p.svg("Bilder der beiden Schienen im Foto")


# ------------------------------------------------ Begriffe und Eigenschaften ----
Q.q(r'Bei der Zentralprojektion mit dem Projektionszentrum $O$ (dem Auge) und einer Bildebene: Was ist das Bild $P^{\prime}$ eines Punktes $P$?',
    [r'der Schnittpunkt der Geraden $OP$ (des Projektionsstrahls) mit der Bildebene',
     r'der Fußpunkt des Lots von $P$ auf die Bildebene',
     r'der Schnittpunkt der Parallelen zur Blickrichtung durch $P$ mit der Bildebene',
     r'der Spiegelpunkt von $P$ an der Bildebene'],
    [r'Alle Projektionsstrahlen gehen durch den einen Punkt $O$ - daher der Name Zentralprojektion.',
     r'Das Lot bzw. die Parallelen zur Blickrichtung gehören zur Parallelprojektion (senkrechte bzw. schräge).',
     r'Merkbild: eine Glasscheibe (Bildebene) vor dem Auge, jeder Punkt wird dort markiert, wo der Sehstrahl die Scheibe durchstößt.'])

Q.q(r'Die Abbildung zeigt Schienen in Einpunktperspektive. Welche Aussage über parallele Geraden gilt bei der Zentralprojektion?',
    [r'Alle Geraden einer Parallelschar, die nicht parallel zur Bildebene verläuft, haben im Bild denselben Fluchtpunkt $F$.',
     r'Parallele Geraden bleiben im Bild immer parallel.',
     r'Jede Gerade hat ihren eigenen Fluchtpunkt, unabhängig von ihrer Richtung.',
     r'Parallele Geraden werden als Kreisbögen abgebildet.'],
    [r'Die Schienen sind in Wirklichkeit parallel, im Bild laufen sie auf den Fluchtpunkt $F$ zu.',
     r'$F$ ist das Bild des „unendlich fernen“ Punktes der Schar - der Projektionsstrahl zu ihm ist die Parallele zur Schar durch $O$.',
     r'Geraden bleiben Geraden (Geradentreue), nur Parallelität, Längen und Winkel gehen verloren.'],
    fig=fig_schienen(), figcap='Schienen in Einpunktperspektive: Die parallelen Schienen und die Enden der Schwellen laufen auf den Fluchtpunkt F auf dem Horizont zu.')

Q.q(r'Wo liegen die Fluchtpunkte aller waagerechten Geraden?',
    [r'auf dem Horizont - der waagerechten Bildgeraden in Augenhöhe des Betrachters',
     r'alle im Hauptpunkt $H$',
     r'auf der Standlinie am unteren Bildrand',
     r'im Projektionszentrum $O$'],
    [r'Fluchtpunkt einer Richtung: Parallele durch $O$ mit der Bildebene schneiden. Für waagerechte Richtungen liegt diese Parallele in der waagerechten Ebene durch das Auge.',
     r'Diese Ebene schneidet die Bildebene in einer Geraden auf Augenhöhe - dem Horizont.',
     r'Nur die Tiefenlinien (senkrecht zur Bildebene) fluchten im Hauptpunkt $H$, dem Lotfußpunkt von $O$ auf der Bildebene; $H$ liegt selbst auf dem Horizont.'])

Q.q(r'Ein Würfel wird so fotografiert, dass eine Seitenfläche parallel zur Bildebene liegt. Welche Perspektive entsteht?',
    [r'Einpunktperspektive (Frontalperspektive): Nur die Tiefenkanten laufen auf einen Fluchtpunkt zu, die waagerechten und senkrechten Kanten bleiben parallel.',
     r'Zweipunktperspektive (Übereckperspektive) mit zwei Fluchtpunkten auf dem Horizont',
     r'Dreipunktperspektive mit einem dritten Fluchtpunkt über oder unter dem Horizont',
     r'Parallelperspektive (Schrägbild) - Fotos haben nie Fluchtpunkte'],
    [r'Die Kanten der vorderen Fläche sind parallel zur Bildebene und behalten ihre Richtung.',
     r'Die vier Tiefenkanten stehen senkrecht auf der Bildebene und fluchten im Hauptpunkt.',
     r'Zwei Fluchtpunkte entstehen, wenn der Würfel „über Eck“ steht; ein dritter, wenn die Kamera nach oben oder unten gekippt wird (stürzende Linien).'])

Q.q(r'Worin unterscheidet sich das Schrägbild (Parallelprojektion) aus dem Mathematikunterricht von der Zentralprojektion?',
    [r'Die Projektionsstrahlen sind parallel: Parallele Kanten bleiben parallel, gleich lange parallele Kanten bleiben gleich lang - keine Verkürzung mit dem Abstand.',
     r'Beim Schrägbild gibt es zwei Fluchtpunkte statt einem.',
     r'Das Schrägbild ist eine Zentralprojektion mit sehr kleiner Distanz $d$.',
     r'Beim Schrägbild werden Geraden zu Kurven.'],
    [r'Bei der Parallelprojektion liegt das Projektionszentrum sozusagen unendlich weit weg - alle Strahlen haben dieselbe Richtung.',
     r'Deshalb gibt es keine Fluchtpunkte, und Teilverhältnisse (z. B. Mittelpunkte) bleiben erhalten.',
     r'Die Zentralprojektion wirkt dafür natürlicher: Fernes erscheint kleiner, wie beim Sehen und Fotografieren.'])

# --------------------------------------------------------- Kunst und Technik ----
Q.q(r'Wer führte um $1420$ in Florenz mit einer bemalten Tafel und einem Spiegel am Baptisterium die perspektivische Konstruktion vor und gilt als Entdecker der Zentralperspektive in der Malerei?',
    [r'Filippo Brunelleschi', r'Albrecht Dürer', r'Leonardo da Vinci', r'Euklid'],
    [r'Brunelleschi, der Baumeister der Florentiner Domkuppel, zeigte mit seinem Spiegelversuch, dass die Konstruktion mit dem Wirklichen übereinstimmt.',
     r'Leon Battista Alberti schrieb $1435$ mit „De pictura“ die erste Theorie dazu (das Bild als „offenes Fenster“); Masaccios Dreifaltigkeitsfresko (um $1427$) gilt als erstes Gemälde mit konstruierter Perspektive.',
     r'Dürer brachte die Lehre $1525$ nach Deutschland, Leonardo nutzte sie z. B. im „Abendmahl“ - beide kamen später.'])

Q.q(r'In Albrecht Dürers Holzschnitt „Der Zeichner der Laute“ ($1525$) läuft ein Faden von einem Haken an der Wand durch einen Rahmen zu Punkten der Laute. Was bedeutet diese Anordnung mathematisch?',
    [r'Der Haken ist das Projektionszentrum, der Faden der Projektionsstrahl und der Rahmen die Bildebene - markiert wird der Durchstoßpunkt des Strahls durch die Bildebene.',
     r'Der Faden misst die wahre Länge jeder Kante, die dann maßstäblich übertragen wird.',
     r'Der Faden markiert den Horizont im Rahmen.',
     r'Der Haken ist der Fluchtpunkt aller Kanten der Laute.'],
    [r'Punkt für Punkt wird so das Bild eines Gegenstands als Zentralprojektion konstruiert - eine mechanische „Kamera“ ohne Linse.',
     r'Wahre Längen bleiben bei der Zentralprojektion gerade nicht erhalten; Fluchtpunkt und Horizont liegen in der Bildebene, nicht an der Wand.',
     r'Dürer beschrieb mehrere solcher Geräte in der „Underweysung der Messung“ ($1525$).'])

Q.q(r'Warum werden Bauzeichnungen und technische Zeichnungen (Dreitafelprojektion, Schrägbild) in der Regel nicht in Zentralprojektion angefertigt?',
    [r'Weil bei der Zentralprojektion Längen, Parallelität und Teilverhältnisse verloren gehen - Maße lassen sich nicht direkt abgreifen; die Parallelprojektion ist maßstäblich.',
     r'Weil Zentralprojektionen nur mit Computern berechenbar sind.',
     r'Weil der räumliche Eindruck bei der Parallelprojektion stärker ist.',
     r'Weil es bei der Zentralprojektion keine Verkürzung gibt.'],
    [r'In der Dreitafelprojektion (Grund-, Auf-, Seitenriss) kann jede Länge mit dem Lineal gemessen werden.',
     r'Die Zentralprojektion wird dagegen für Renderings, Fotos und Computergrafik genutzt, wo der natürliche Eindruck zählt - dort ist Fernes kleiner.',
     r'Das Auge und jede Kamera arbeiten als Zentralprojektion: Lochkamera und Objektiv sind das Projektionszentrum.'])

# ------------------------------------------------ Strahlensatz und Verkürzung ----
Q.q(r'Ein Mensch von $1{,}80\,\mathrm{m}$ Größe steht $a = 6\,\mathrm{m}$ vom Auge $O$ entfernt. Die Bildebene (eine Glasscheibe) hat vom Auge den Abstand $d = 1\,\mathrm{m}$. Wie groß ist sein Bild auf der Scheibe?',
    [r'$h^{\prime} = 0{,}30\,\mathrm{m}$', r'$h^{\prime} = 0{,}60\,\mathrm{m}$', r'$h^{\prime} = 0{,}18\,\mathrm{m}$', r'$h^{\prime} = 10{,}8\,\mathrm{m}$'],
    [r'Strahlensatz an den beiden ähnlichen Dreiecken: $\dfrac{h^{\prime}}{h} = \dfrac{d}{a}$.',
     r'$h^{\prime} = h \cdot \dfrac{d}{a} = 1{,}80 \cdot \dfrac{1}{6} = 0{,}30\,\mathrm{m}$.',
     r'Falle: $\dfrac{a}{d}$ statt $\dfrac{d}{a}$ ergäbe $10{,}8\,\mathrm{m}$ - ein Bild, das größer ist als der Mensch.'],
    fig=fig_strahlensatz(), figcap='Seitenansicht: Auge O, Bildebene im Abstand d = 1 m, Person im Abstand a = 6 m. Der Sehstrahl zum Kopf durchstößt die Bildebene in P′.')

Q.q(r'Ein Gegenstand entfernt sich vom Auge auf den doppelten Abstand; die Bildebene bleibt, wo sie ist. Wie ändert sich die Höhe seines Bildes?',
    [r'Sie halbiert sich.', r'Sie viertelt sich.', r'Sie bleibt gleich.', r'Sie verdoppelt sich.'],
    [r'$h^{\prime} = \dfrac{h \cdot d}{a}$ - die Bildhöhe ist umgekehrt proportional zum Abstand $a$.',
     r'Aus $a$ wird $2a$: $\dfrac{h \cdot d}{2a} = \dfrac{1}{2} \cdot h^{\prime}$.',
     r'Der Flächeninhalt des Bildes viertelt sich, weil sich Höhe und Breite halbieren.'])

Q.q(r'Zwei gleich hohe Laternen ($4\,\mathrm{m}$) stehen $10\,\mathrm{m}$ und $40\,\mathrm{m}$ vom Auge entfernt, die Bildebene hat den Abstand $d = 0{,}5\,\mathrm{m}$. Wie hoch sind die beiden Bilder?',
    [r'$20\,\mathrm{cm}$ und $5\,\mathrm{cm}$', r'$20\,\mathrm{cm}$ und $10\,\mathrm{cm}$', r'beide $20\,\mathrm{cm}$', r'$40\,\mathrm{cm}$ und $10\,\mathrm{cm}$'],
    [r'Nahe Laterne: $4 \cdot \dfrac{0{,}5}{10} = 0{,}2\,\mathrm{m} = 20\,\mathrm{cm}$.',
     r'Ferne Laterne: $4 \cdot \dfrac{0{,}5}{40} = 0{,}05\,\mathrm{m} = 5\,\mathrm{cm}$.',
     r'Vierfacher Abstand, ein Viertel der Bildhöhe - das ist die perspektivische Verkürzung.'])

Q.q(r'Lochkamera: Das Loch (Projektionszentrum) ist $d = 50\,\mathrm{mm}$ vom Sensor entfernt. Ein $12\,\mathrm{m}$ hoher Baum erscheint auf dem Sensor $24\,\mathrm{mm}$ hoch. Wie weit ist der Baum von der Kamera entfernt?',
    [r'$25\,\mathrm{m}$', r'$5{,}76\,\mathrm{m}$', r'$12{,}5\,\mathrm{m}$', r'$50\,\mathrm{m}$'],
    [r'$\dfrac{h^{\prime}}{h} = \dfrac{d}{a}$ nach $a$ umstellen: $a = \dfrac{h \cdot d}{h^{\prime}}$.',
     r'$a = \dfrac{12\,\mathrm{m} \cdot 50\,\mathrm{mm}}{24\,\mathrm{mm}} = 25\,\mathrm{m}$ - die Millimeter kürzen sich.',
     r'Probe: $12 \cdot \dfrac{0{,}05}{25} = 0{,}024\,\mathrm{m} = 24\,\mathrm{mm}$.'])

Q.q(r'Entlang einer geraden Straße, die senkrecht von der Bildebene wegführt, stehen Pfähle im Abstand von $2\,\mathrm{m}$, alle $3\,\mathrm{m}$ seitlich neben der Blickachse. Der erste Pfahl steht $4\,\mathrm{m}$ vom Auge entfernt, die Bildebene hat den Abstand $d = 1\,\mathrm{m}$. Wie weit seitlich vom Hauptpunkt liegen die Bilder der ersten drei Pfähle?',
    [r'$75\,\mathrm{cm}$, $50\,\mathrm{cm}$, $37{,}5\,\mathrm{cm}$',
     r'$75\,\mathrm{cm}$, $50\,\mathrm{cm}$, $25\,\mathrm{cm}$',
     r'$75\,\mathrm{cm}$, $37{,}5\,\mathrm{cm}$, $25\,\mathrm{cm}$',
     r'alle drei $75\,\mathrm{cm}$'],
    [r'Seitlicher Abstand im Bild: $x^{\prime} = x \cdot \dfrac{d}{z}$ mit den Tiefen $z = 4$, $6$, $8\,\mathrm{m}$.',
     r'$3 \cdot \dfrac{1}{4} = 0{,}75$, $3 \cdot \dfrac{1}{6} = 0{,}5$, $3 \cdot \dfrac{1}{8} = 0{,}375\,\mathrm{m}$.',
     r'Die Abstände im Bild schrumpfen ($25\,\mathrm{cm}$, dann $12{,}5\,\mathrm{cm}$) - so entsteht der Eindruck der Tiefe. Gleiche Bildabstände hätte nur die Parallelprojektion.'])

# ---------------------------------------- Bildkoordinaten und Fluchtpunkte ----
Q.q(r'Projektionszentrum $O(0|0|0)$, Bildebene $z = 4$. Welches Bild hat der Punkt $P(6|3|12)$?',
    [r'$P^{\prime}(2|1|4)$', r'$P^{\prime}(6|3|4)$', r'$P^{\prime}(24|12|4)$', r'$P^{\prime}(1{,}5|0{,}75|4)$'],
    [r'Projektionsstrahl: $\vec x = t \cdot ' + vec(6, 3, 12) + r'$; er trifft $z = 4$ für $12t = 4$, also $t = \dfrac{1}{3}$.',
     r'$P^{\prime} = \dfrac{1}{3} \cdot (6|3|12) = (2|1|4)$.',
     r'Allgemein: $x^{\prime} = \dfrac{d \cdot x}{z}$, $y^{\prime} = \dfrac{d \cdot y}{z}$. Nur $z = 4$ zu setzen ($6|3|4$) wäre die senkrechte Parallelprojektion.'])

Q.q(r'Projektionszentrum $O(0|0|0)$, Bildebene $z = 4$. Welches Bild hat der Punkt $Q(-8|2|16)$?',
    [r'$Q^{\prime}(-2|0{,}5|4)$', r'$Q^{\prime}(2|-0{,}5|4)$', r'$Q^{\prime}(-8|2|4)$', r'$Q^{\prime}(-4|1|4)$'],
    [r'$t = \dfrac{d}{z} = \dfrac{4}{16} = \dfrac{1}{4}$.',
     r'$x^{\prime} = -8 \cdot \dfrac{1}{4} = -2$, $y^{\prime} = 2 \cdot \dfrac{1}{4} = 0{,}5$, $z^{\prime} = 4$.',
     r'Das Vorzeichen bleibt erhalten: Links bleibt links - anders als bei der Lochkamera, wo das Bild hinter dem Loch auf dem Kopf steht.'])

Q.q(r'Projektionszentrum $O(0|0|0)$, Bildebene $z = 4$. Ein Punkt mit der Tiefe $z = 20$ hat das Bild $P^{\prime}(3|1|4)$. Wie lautet der Punkt?',
    [r'$P(15|5|20)$', r'$P(3|1|20)$', r'$P(60|20|20)$', r'$P(0{,}6|0{,}2|20)$'],
    [r'Alle Punkte des Strahls $\vec x = t \cdot ' + vec(3, 1, 4) + r'$ haben dasselbe Bild $P^{\prime}$.',
     r'Tiefe $20$: $4t = 20$, also $t = 5$ und $P = 5 \cdot (3|1|4) = (15|5|20)$.',
     r'Probe: $\dfrac{4 \cdot 15}{20} = 3$, $\dfrac{4 \cdot 5}{20} = 1$. Ohne die Tiefe wäre der Punkt aus dem Bild nicht rekonstruierbar.'])

Q.q(r'Projektionszentrum $O(0|0|0)$, Bildebene $z = 4$. In welchem Punkt der Bildebene laufen die Bilder aller Geraden mit dem Richtungsvektor $\vec v = ' + vec(1, 1, 2) + r'$ zusammen (Fluchtpunkt)?',
    [r'$F(2|2|4)$', r'$F(1|1|4)$', r'$F(4|4|4)$', r'$F(0|0|4)$'],
    [r'Der Fluchtpunkt ist das Bild des fernen Punktes der Richtung: Parallele zu $\vec v$ durch $O$ mit der Bildebene schneiden.',
     r'$t \cdot ' + vec(1, 1, 2) + r'$ trifft $z = 4$ für $t = 2$: $F(2|2|4)$.',
     r'Rechnerisch: Für $P + t\vec v$ ist $x^{\prime} = \dfrac{4\,(p_1 + t)}{p_3 + 2t} \to \dfrac{4}{2} = 2$ für $t \to \infty$ - unabhängig von $P$, deshalb haben alle Geraden der Schar denselben Fluchtpunkt.'])

Q.q(r'Auf einem Foto (Koordinaten in $\mathrm{cm}$) verläuft das Bild der linken Schiene durch $A(0|0)$ und $B(2|4)$, das der rechten durch $C(10|0)$ und $D(7|4)$. Wo liegt der Fluchtpunkt $F$?',
    [r'$F(4|8)$', r'$F(5|10)$', r'$F(4|6)$', r'$F(5|8)$'],
    [r'Linke Schiene: $y = 2x$. Rechte Schiene: Anstieg $\dfrac{4 - 0}{7 - 10} = -\dfrac{4}{3}$, also $y = -\dfrac{4}{3}\,(x - 10)$.',
     r'Gleichsetzen: $2x = -\dfrac{4}{3}x + \dfrac{40}{3}$, mal $3$: $6x = -4x + 40$, $x = 4$, $y = 8$.',
     r'Der Horizont des Fotos ist also die Gerade $y = 8$ - die Augenhöhe der Kamera im Bild.'],
    fig=fig_schienenbild(), figcap='Bildkoordinaten in cm: die Bilder der linken (A, B) und der rechten Schiene (C, D).')

Q.q(r'Ein Fotograf (Augenhöhe $1{,}60\,\mathrm{m}$, Bildebene $d = 1\,\mathrm{m}$) fotografiert eine $4\,\mathrm{m}$ hohe Laterne in $8\,\mathrm{m}$ Entfernung auf ebenem Boden. Wie weit liegen Spitze und Fußpunkt der Laterne im Bild über bzw. unter dem Horizont?',
    [r'Spitze $30\,\mathrm{cm}$ über, Fußpunkt $20\,\mathrm{cm}$ unter dem Horizont',
     r'Spitze $50\,\mathrm{cm}$ über, Fußpunkt genau auf dem Horizont',
     r'Spitze $30\,\mathrm{cm}$ über, Fußpunkt $30\,\mathrm{cm}$ unter dem Horizont',
     r'Spitze $24\,\mathrm{cm}$ über, Fußpunkt $16\,\mathrm{cm}$ unter dem Horizont'],
    [r'Höhen relativ zur Augenhöhe: Spitze $4 - 1{,}6 = 2{,}4\,\mathrm{m}$ darüber, Fußpunkt $1{,}6\,\mathrm{m}$ darunter.',
     r'Mit dem Faktor $\dfrac{d}{a} = \dfrac{1}{8}$: $2{,}4 \cdot \dfrac{1}{8} = 0{,}30\,\mathrm{m}$ über, $1{,}6 \cdot \dfrac{1}{8} = 0{,}20\,\mathrm{m}$ unter dem Horizont.',
     r'Probe: Bildhöhe insgesamt $0{,}5\,\mathrm{m} = 4 \cdot \dfrac{1}{8}$. Alle Punkte in Augenhöhe liegen im Bild auf dem Horizont, egal wie weit weg.'])

Q.q(r'Projektionszentrum $O(0|0|0)$, Bildebene $z = 4$, Strecke von $A(4|0|4)$ nach $B(4|0|12)$ mit dem Mittelpunkt $M(4|0|8)$. Ist das Bild $M^{\prime}$ der Mittelpunkt der Bildstrecke $A^{\prime}B^{\prime}$?',
    [r'nein - $M^{\prime}(2|0|4)$, aber der Mittelpunkt von $A^{\prime}(4|0|4)$ und $B^{\prime}\!\left(\dfrac{4}{3}\,\middle|\,0\,\middle|\,4\right)$ liegt bei $x = \dfrac{8}{3}$; Teilverhältnisse bleiben bei der Zentralprojektion nicht erhalten',
     r'ja - Geraden werden auf Geraden abgebildet, also auch Mittelpunkte auf Mittelpunkte',
     r'ja - beide liegen bei $x = 2$',
     r'nein - $M$ hat gar kein Bild, weil der Strahl $OM$ die Bildebene nicht trifft'],
    [r'$A^{\prime}$: $t = \dfrac{4}{4} = 1$, also $A^{\prime}(4|0|4)$. $B^{\prime}$: $t = \dfrac{4}{12} = \dfrac{1}{3}$, also $B^{\prime}\!\left(\dfrac{4}{3}\,\middle|\,0\,\middle|\,4\right)$. $M^{\prime}$: $t = \dfrac{4}{8} = \dfrac{1}{2}$, also $M^{\prime}(2|0|4)$.',
     r'Mitte von $A^{\prime}B^{\prime}$: $\dfrac{1}{2}\left(4 + \dfrac{4}{3}\right) = \dfrac{8}{3} \approx 2{,}67 \ne 2$.',
     r'Die hintere Hälfte der Strecke wird stärker verkürzt als die vordere - genau das sieht man bei den Schwellen in der Schienen-Abbildung. Bei der Parallelprojektion bliebe der Mittelpunkt erhalten.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    t, p1, p3 = sp.symbols('t p1 p3', real=True)
    img = lambda P, d: tuple(F(d) * F(c) / F(P[2]) for c in P[:2]) + (F(d),)
    # 9: 1.80 * 1/6 = 0.30; distractors 0.18 (1/10), 10.8 (a/d)
    assert F(180, 100) * F(1, 6) == F(3, 10) and F(180, 100) / 10 == F(18, 100) and F(180, 100) * 6 == F(108, 10)
    assert F(3, 10) * 2 == F(6, 10)
    # 10: h' ~ 1/a
    assert F(1, 2 * 6) == F(1, 6) / 2 and (F(1, 2)) ** 2 == F(1, 4)
    # 11: lamps
    assert 4 * F(1, 2) / 10 == F(1, 5) and 4 * F(1, 2) / 40 == F(1, 20) and F(1, 5) / F(1, 20) == 4
    # 12: pinhole camera
    assert F(12 * 50, 24) == 25 and F(12 * 24, 50) == F(576, 100) and 12 * F(5, 100) / 25 == F(24, 1000)
    # 13: posts at z = 4, 6, 8
    xs = [3 * F(1, z) for z in (4, 6, 8)]
    assert xs == [F(3, 4), F(1, 2), F(3, 8)] and xs[0] - xs[1] == F(1, 4) and xs[1] - xs[2] == F(1, 8)
    # 14-16: image coordinates with d = 4
    assert img((6, 3, 12), 4) == (2, 1, 4) and F(4, 12) == F(1, 3)
    assert img((-8, 2, 16), 4) == (-2, F(1, 2), 4)
    assert img((15, 5, 20), 4) == (3, 1, 4) and F(20, 4) == 5
    # 17: vanishing point of direction (1,1,2) is (2,2,4), independent of the point
    assert sp.limit(4 * (p1 + t) / (p3 + 2 * t), t, sp.oo) == 2 and 2 * 2 == 4
    # 18: rails in the photo meet at (4|8)
    x, y = sp.symbols('x y')
    sol = sp.solve([sp.Eq(y, 2 * x), sp.Eq(y, -sp.Rational(4, 3) * (x - 10))], [x, y])
    assert sol == {x: 4, y: 8} and F(4 - 0, 7 - 10) == -F(4, 3) and 2 * 2 == 4 and -F(4, 3) * (7 - 10) == 4
    # 19: lamp post
    assert (4 - F(16, 10)) * F(1, 8) == F(3, 10) and F(16, 10) * F(1, 8) == F(2, 10) and F(3, 10) + F(2, 10) == 4 * F(1, 8)
    # 20: midpoint not preserved
    A, B, M = img((4, 0, 4), 4), img((4, 0, 12), 4), img((4, 0, 8), 4)
    assert A == (4, 0, 4) and B == (F(4, 3), 0, 4) and M == (2, 0, 4)
    assert (A[0] + B[0]) / 2 == F(8, 3) != M[0] and abs(F(8, 3) - F(267, 100)) < F(1, 100)
    # figure numbers: every sleeper end lies on the rail line through (130, 290) and (260, 110)
    for z in (1.0, 2.0, 4.0):
        xl, yl = 260 - 130 / z, 110 + 180 / z
        assert abs((yl - 110) / (xl - 260) - (290 - 110) / (130 - 260)) < 1e-9
    assert abs(1.8 * 1 / 6 - 0.3) < 1e-12


Q.verify(check)
Q.save()
