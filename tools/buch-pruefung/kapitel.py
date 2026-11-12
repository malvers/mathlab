"""What the chapters of the training book add around the sheets: lead, key box, widget, self-checks.

Every answer of a self-check carries a Python expression (py) that build.py evaluates, so a typo cannot survive the build.
Text markup as in textaufgaben.py: **fett**, $...$ for KaTeX, raw strings.
"""
import json

ABI = "Abitur · "
BLF = "BLF · "
VA = "Vergleichsarbeit · "
GL = "GK und LK"
LK = "Nur LK"
K10 = "Klasse 10"
K11 = "BGY Klasse 11"


def Q(text, ans, py, sol, ph="Ergebnis", tol=None):
    return dict(text=text, ans=ans, py=py, sol=sol, ph=ph, tol=tol)


def G(fns, x, y, pts=None, aria="Funktionsgraph", xl=None, yl=None):
    h = {"widget": "graph", "data-fns": json.dumps(fns), "data-x": x, "data-y": y, "data-h": "240", "data-aria": aria}
    if pts:
        h["data-pts"] = json.dumps(pts)
    if xl:
        h["data-xl"] = xl
    if yl:
        h["data-yl"] = yl
    return h


def L(book, name, what):
    return (book, name, what)


def W(name, title, help_, **attrs):
    return dict(name=name, title=title, help=help_, attrs={"data-" + k: v for k, v in attrs.items()})


def bar(*teile, aria=""):
    return "<div class=\"b-hero-art\" data-widget=\"beverteilung\" data-teile='%s'></div>" % json.dumps(teile, ensure_ascii=False)


TABELLE_ABI = """<div class="b-table-wrap"><table class="b-table">
    <tr><th>Jahr</th><th>Kurs</th><th>Teil A</th><th>Analysis</th><th>Geometrie / Algebra</th><th>Stochastik</th><th class="b-sum">Gesamt</th></tr>
    <tr><td>2021/22</td><td>GK</td><td>25</td><td>40</td><td>25</td><td>10</td><td class="b-sum">100</td></tr>
    <tr><td>2021/22</td><td>LK</td><td>30</td><td>50</td><td>25</td><td>15</td><td class="b-sum">120</td></tr>
    <tr><td>2022/23</td><td>GK</td><td>25</td><td>40</td><td>25</td><td>10</td><td class="b-sum">100</td></tr>
    <tr><td>2022/23</td><td>LK</td><td>30</td><td>50</td><td>25</td><td>15</td><td class="b-sum">120</td></tr>
    <tr><td>2023/24</td><td>GK</td><td>25</td><td>30</td><td>25</td><td>20</td><td class="b-sum">100</td></tr>
    <tr><td>2023/24</td><td>LK</td><td>30</td><td>40</td><td>25</td><td>25</td><td class="b-sum">120</td></tr>
    <tr><td>2024/25</td><td>GK</td><td>25</td><td>25</td><td>15</td><td>15</td><td class="b-sum">80</td></tr>
    <tr><td>2024/25</td><td>LK</td><td>30</td><td>30</td><td>20</td><td>20</td><td class="b-sum">100</td></tr>
</table></div>"""

UEBERBLICK_ABI = """<section class="b-sec" id="auftakt" data-toc="Auftakt" data-toc-k="A" data-toc-short="Auftakt" style="margin-top:0">
    <div class="b-hero">
        <div>
            <p class="b-kicker">KAPITEL 1 · ABITUR · ÜBERBLICK · GK UND LK</p>
            <h1>So ist das Abitur gebaut</h1>
            <p class="b-hero-lead">Wer weiß, wie die Prüfung gebaut ist, verschenkt keine Punkte. Dieses Kapitel fasst zusammen, was die Auswertung von 16 Abiturarbeiten aus vier Jahrgängen ergeben hat:
                wie die Punkte verteilt sind, welche Aufgabentypen immer wiederkommen und in welcher Reihenfolge sich das Üben lohnt.</p>
            <div class="b-chips"><span class="b-chip">16 ARBEITEN AUSGEWERTET</span><span class="b-chip">2021/22 BIS 2024/25</span></div>
        </div>
        <div class="b-hero-art" data-widget="beverteilung" data-teile='[["Teil A",25],["Analysis",25],["Geometrie oder Algebra",15],["Stochastik",15]]'></div>
    </div>
    <div class="b-text"><p>Die Leiste oben zeigt die Bewertungseinheiten (BE) im Grundkurs 2024/25, zusammen 80 BE.</p></div>
</section>

<section class="b-sec" id="aufbau" data-kind="le" data-toc="Teil A und Teil B" data-toc-k="1" data-toc-short="Aufbau">
    <div class="b-band"><span class="b-band-tag">AUFBAU</span><span class="b-band-sub">STAND DER LETZTEN JAHRGÄNGE</span></div>
    <h2><span class="b-no">1</span>Teil A und Teil B</h2>
    <div class="b-grid2">
        <div class="b-box">
            <div class="b-box-title">TEIL A · OHNE HILFSMITTEL</div>
            <div class="b-text"><p>Erlaubt sind nur Lineal und Geodreieck. Der Teil wird nach fester Zeit eingesammelt, erst danach kommt der Taschenrechner auf den Tisch.</p>
                <ul>
                    <li><b>Grundkurs:</b> 85 Minuten Arbeitszeit und 15 Minuten zum Lesen und Auswählen, 25 BE</li>
                    <li><b>Leistungskurs:</b> 95 und 15 Minuten, 30 BE</li>
                </ul>
                <p>Auf der letzten Seite kreuzt du an, welche Wahlaufgaben bewertet werden sollen. Wer das vergisst, verschenkt Punkte.</p></div>
        </div>
        <div class="b-box">
            <div class="b-box-title">TEIL B · MIT RECHNER UND FORMELSAMMLUNG</div>
            <div class="b-text"><p>Hilfsmittel sind Wörterbuch, Tabellen- und Formelsammlung, Zeichengeräte und ein grafikfähiger Taschenrechner mit oder ohne CAS.
                Die Gesamtzeit einschließlich Teil A beträgt 255 Minuten im Grundkurs und 300 Minuten im Leistungskurs.</p>
                <p>Alle drei Pflichtaufgaben sind zu lösen: Analysis, dann Analytische Geometrie oder Lineare Algebra, dann Stochastik. Welche der beiden mittleren Aufgaben du schreibst,
                    wählst du nicht selbst. Sie hängt von der Kennziffer ab, die deinem Kurs zugewiesen ist.</p></div>
        </div>
    </div>
</section>

<section class="b-sec" id="punkte" data-kind="le" data-toc="Punkte" data-toc-k="2" data-toc-short="Punkte">
    <div class="b-band"><span class="b-band-tag">PUNKTE</span><span class="b-band-sub">BEWERTUNGSEINHEITEN 2022 BIS 2025</span></div>
    <h2><span class="b-no">2</span>Wie sich die Punkte verteilen</h2>
    """ + TABELLE_ABI + """
    <div class="b-text"><p>In den ersten drei Jahrgängen zählte die Analysis fast die Hälfte aller Punkte. 2023/24 wurde zugunsten der Stochastik umverteilt, 2024/25 wurde die ganze Arbeit
        auf 80 BE im Grundkurs und 100 BE im Leistungskurs gekürzt. Pro Punkt bleibt also mehr Zeit.</p></div>
</section>

<section class="b-sec" id="typen" data-kind="le" data-toc="Was immer wiederkommt" data-toc-k="3" data-toc-short="Typen">
    <div class="b-band"><span class="b-band-tag">AUFGABENTYPEN</span><span class="b-band-sub">WAS IMMER WIEDERKOMMT</span></div>
    <h2><span class="b-no">3</span>Was immer wiederkommt</h2>
    <div class="b-grid2">
        <div class="b-box">
            <div class="b-box-title">TEIL A</div>
            <div class="b-text"><ul>
                <li>Fünf Ankreuzaufgaben mit je fünf Antworten, in allen 16 Arbeiten</li>
                <li>Ableiten und Integrieren im Kopf, Definitionsbereich, Grenzwerte</li>
                <li>Kurzaufgaben: Punktprobe, Fläche zwischen Parabeln, Pyramide, Vierfeldertafel</li>
                <li>Seit 2024/25 auch Graphen zuordnen</li>
            </ul></div>
        </div>
        <div class="b-box">
            <div class="b-box-title">TEIL B</div>
            <div class="b-text"><ul>
                <li>Analysis: ganzrationale Funktion dritten Grades, parallele Tangenten, Flächen teilen, Übergang ohne Knick</li>
                <li>Geometrie: Körper im Raum, Ebenengleichung, Neigung, Schattenwurf</li>
                <li>Lineare Algebra: Verflechtung, Kosten und Gewinn, Leontief im Leistungskurs</li>
                <li>Stochastik: Vierfeldertafel, Unabhängigkeit, Binomialverteilung, Hypothesentest</li>
            </ul></div>
        </div>
    </div>
    <div class="b-box b-merk">
        <div class="b-box-title">MERKE · DIE OPERATOREN</div>
        <div class="b-text">
            <p><b>Angeben, nennen:</b> Das Ergebnis genügt, ohne Rechenweg.</p>
            <p><b>Berechnen, bestimmen, ermitteln:</b> Der Weg gehört dazu, auch im Teil mit Rechner.</p>
            <p><b>Zeigen, nachweisen:</b> Das Ergebnis steht schon da, gefragt ist der lückenlose Weg dorthin.</p>
            <p><b>Begründen:</b> mit einem Argument aus der Mathematik, nicht mit einem Beispiel.</p>
            <p><b>Beurteilen:</b> Stellung nehmen und das Urteil begründen.</p>
            <p><b>Deuten:</b> Die Zahl bekommt ihre Bedeutung im Sachzusammenhang, mit Einheit.</p>
        </div>
    </div>
</section>

<section class="b-sec" id="plan" data-kind="rueckblick" data-toc="So übst du" data-toc-k="R" data-toc-short="So übst du">
    <div class="b-band"><span class="b-band-tag">SO ÜBST DU</span><span class="b-band-sub">DIE REIHENFOLGE LOHNT SICH</span></div>
    <div class="b-rueck"><div><h4>ZUERST ANALYSIS</h4><p>Sie trägt die meisten Punkte. Die Kapitel 3 bis 9 führen von der Kurvendiskussion bis zum Modellieren.</p></div>
        <div><p>Die mit <b>Nur LK</b> markierten Kapitel kannst du im Grundkurs überspringen.</p></div></div>
    <div class="b-rueck"><div><h4>DANN STOCHASTIK</h4><p>Sie ist am besten vorhersagbar. Vierfeldertafel, Binomialverteilung und Test laufen fast immer gleich ab.</p></div>
        <div><p>Die Kapitel 14 bis 16 decken alles ab.</p></div></div>
    <div class="b-rueck"><div><h4>DANN PFLICHTAUFGABE 2</h4><p>Geometrie in den Kapiteln 10 und 11 oder Lineare Algebra in den Kapiteln 12 und 13, je nach deiner Kennziffer.</p></div>
        <div><p>Frag deine Lehrkraft, wenn du nicht sicher bist, welche der beiden Aufgaben dich erwartet.</p></div></div>
    <div class="b-rueck"><div><h4>ZUM SCHLUSS</h4><p>Teil A in Kapitel 2 immer wieder zwischendurch. Die Generalprobe in Kapitel 17 läuft mit Uhr.</p></div>
        <div><p>Rechne die Generalprobe auf Papier, in einem Stück und ohne Lösungen.</p></div></div>
</section>"""

UEBERBLICK_BLF = """<section class="b-sec" id="auftakt" data-toc="Auftakt" data-toc-k="A" data-toc-short="Auftakt" style="margin-top:0">
    <div class="b-hero">
        <div>
            <p class="b-kicker">KAPITEL 18 · BLF · ÜBERBLICK · KLASSE 10</p>
            <h1>So ist die BLF gebaut</h1>
            <p class="b-hero-lead">Die Besondere Leistungsfeststellung schreiben alle Schülerinnen und Schüler der Klasse 10 am allgemeinbildenden Gymnasium, landesweit mit denselben Aufgaben.
                Die Note zählt doppelt so viel wie eine Klassenarbeit. Dieses Kapitel zeigt, was die Auswertung der letzten drei Jahrgänge ergeben hat.</p>
            <div class="b-chips"><span class="b-chip">90 MINUTEN</span><span class="b-chip">45 BE</span><span class="b-chip">2022/23 BIS 2024/25</span></div>
        </div>
        <div class="b-hero-art" data-widget="beverteilung" data-teile='[["Teil A",15],["Aufgabe 1",10],["Aufgabe 2",6],["Aufgabe 3",14]]'></div>
    </div>
    <div class="b-text"><p>Die Leiste oben zeigt die Bewertungseinheiten (BE) des Jahrgangs 2024/25, zusammen 45 BE.</p></div>
</section>

<section class="b-sec" id="aufbau" data-kind="le" data-toc="Teil A und Teil B" data-toc-k="1" data-toc-short="Aufbau">
    <div class="b-band"><span class="b-band-tag">AUFBAU</span><span class="b-band-sub">STAND DER LETZTEN DREI JAHRGÄNGE</span></div>
    <h2><span class="b-no">1</span>Teil A und Teil B</h2>
    <div class="b-grid2">
        <div class="b-box">
            <div class="b-box-title">TEIL A · OHNE HILFSMITTEL</div>
            <div class="b-text"><p>Erlaubt sind nur Zeichengeräte und das Wörterbuch. Du löst direkt auf dem Aufgabenblatt, nach 25 Minuten wird Teil A eingesammelt.</p>
                <ul>
                    <li><b>6 BE:</b> sechs Ankreuzaufgaben mit fünf Möglichkeiten, je 1 BE</li>
                    <li><b>9 BE:</b> kurze Aufgaben, der Rechenweg muss nachvollziehbar sein</li>
                </ul></div>
        </div>
        <div class="b-box">
            <div class="b-box-title">TEIL B · MIT MMS UND FORMELSAMMLUNG</div>
            <div class="b-text"><p>Für 30 BE bleiben rund 65 Minuten. Alle drei Aufgaben sind zu bearbeiten, es gibt keine Wahl.</p>
                <ul>
                    <li><b>Aufgabe 1:</b> eine Funktion</li>
                    <li><b>Aufgabe 2:</b> kurz, Trigonometrie oder Stochastik</li>
                    <li><b>Aufgabe 3:</b> eine lange Sachaufgabe rund um eine Stadt, quer durch alle Gebiete</li>
                </ul></div>
        </div>
    </div>
    <div class="b-box b-merk">
        <div class="b-box-title">MERKE · FORM UND NÄHERUNGSWERTE</div>
        <div class="b-text"><p>Für die Form gibt es höchstens 2 BE Abzug, und nur bei schweren oder gehäuften Verstößen.</p>
            <p>Wo ein exakter Wert erwartet wird, bringt ein richtiger Näherungswert trotzdem die volle Punktzahl.</p></div>
    </div>
</section>

<section class="b-sec" id="punkte" data-kind="le" data-toc="Punkte und Noten" data-toc-k="2" data-toc-short="Punkte">
    <div class="b-band"><span class="b-band-tag">PUNKTE</span><span class="b-band-sub">BEWERTUNGSEINHEITEN UND NOTENSKALA</span></div>
    <h2><span class="b-no">2</span>Punkte und Noten</h2>
    <div class="b-table-wrap"><table class="b-table">
        <tr><th>Jahr</th><th>Teil A</th><th>Aufgabe 1</th><th>Aufgabe 2</th><th>Aufgabe 3</th><th class="b-sum">Gesamt</th></tr>
        <tr><td>2022/23</td><td>6 + 9</td><td>9</td><td>6</td><td>15</td><td class="b-sum">45</td></tr>
        <tr><td>2023/24</td><td>6 + 9</td><td>8</td><td>7</td><td>15</td><td class="b-sum">45</td></tr>
        <tr><td>2024/25</td><td>6 + 9</td><td>10</td><td>6</td><td>14</td><td class="b-sum">45</td></tr>
    </table></div>
    <div class="b-table-wrap"><table class="b-table">
        <tr><th>BE</th><td>ab 41</td><td>34–40</td><td>27–33</td><td>18–26</td><td>9–17</td><td>bis 8</td></tr>
        <tr><th>Note</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>
    </table></div>
    <div class="b-text"><p>Die Notenskala stand so in den Hinweisen der Jahrgänge 2023/24 und 2024/25. Für eine Vier reichen 18 von 45 BE.</p></div>
</section>

<section class="b-sec" id="plan" data-kind="rueckblick" data-toc="So übst du" data-toc-k="R" data-toc-short="So übst du">
    <div class="b-band"><span class="b-band-tag">SO ÜBST DU</span><span class="b-band-sub">DIE REIHENFOLGE LOHNT SICH</span></div>
    <div class="b-rueck"><div><h4>ZUERST TEIL A</h4><p>Ohne Rechner gibt es keine zweite Chance. Die Kapitel 19 und 20 trainieren genau das.</p></div>
        <div><p>Stell dir bei beiden Kapiteln einen Wecker auf 25 Minuten.</p></div></div>
    <div class="b-rueck"><div><h4>DANN FUNKTIONEN UND TRIGONOMETRIE</h4><p>Sie tragen in Teil B die meisten Punkte: Kapitel 21 bis 23.</p></div>
        <div><p>Danach Körper in Kapitel 24 und Daten und Zufall in Kapitel 25.</p></div></div>
    <div class="b-rueck"><div><h4>ZUM SCHLUSS</h4><p>Die Generalprobe in Kapitel 26 läuft mit Uhr.</p></div>
        <div><p>Rechne sie auf Papier, in einem Stück und ohne Lösungen.</p></div></div>
</section>"""

UEBERBLICK_VA = """<section class="b-sec" id="auftakt" data-toc="Auftakt" data-toc-k="A" data-toc-short="Auftakt" style="margin-top:0">
    <div class="b-hero">
        <div>
            <p class="b-kicker">KAPITEL 27 · VERGLEICHSARBEIT · ÜBERBLICK · BGY KLASSE 11</p>
            <h1>So ist die Vergleichsarbeit gebaut</h1>
            <p class="b-hero-lead">Die Vergleichsarbeit schreiben alle Schülerinnen und Schüler der Klasse 11 am Beruflichen Gymnasium, landesweit am selben Tag mit denselben Aufgaben, 2027 am Freitag, 19. März.
                Sie wird wie eine Klassenarbeit benotet. Dieses Kapitel zeigt, was die Auswertung der letzten vier Jahrgänge ergeben hat.</p>
            <div class="b-chips"><span class="b-chip">90 MINUTEN</span><span class="b-chip">45 BE</span><span class="b-chip">2021/22 BIS 2024/25</span></div>
        </div>
        <div class="b-hero-art" data-widget="beverteilung" data-teile='[["Teil A",15],["Aufgabe 1",8],["Aufgabe 2",7],["Aufgabe 3",15]]'></div>
    </div>
    <div class="b-text"><p>Die Leiste oben zeigt die Bewertungseinheiten (BE) des Jahrgangs 2024/25, zusammen 45 BE. Aufbau und Hilfsmittel sind dieselben wie bei der BLF am Gymnasium in Teil 2 dieses Buchs.</p></div>
</section>

<section class="b-sec" id="aufbau" data-kind="le" data-toc="Teil A und Teil B" data-toc-k="1" data-toc-short="Aufbau">
    <div class="b-band"><span class="b-band-tag">AUFBAU</span><span class="b-band-sub">STAND DER LETZTEN VIER JAHRGÄNGE</span></div>
    <h2><span class="b-no">1</span>Teil A und Teil B</h2>
    <div class="b-grid2">
        <div class="b-box">
            <div class="b-box-title">TEIL A · OHNE HILFSMITTEL</div>
            <div class="b-text"><p>Erlaubt sind nur Zeichengeräte und das Wörterbuch. Du löst direkt auf dem Aufgabenblatt, nach 25 Minuten wird Teil A eingesammelt.</p>
                <ul>
                    <li><b>6 BE:</b> sechs Ankreuzaufgaben mit fünf Möglichkeiten, je 1 BE</li>
                    <li><b>9 BE:</b> zwei kurze Aufgaben, der Rechenweg muss nachvollziehbar sein</li>
                </ul></div>
        </div>
        <div class="b-box">
            <div class="b-box-title">TEIL B · MIT MMS UND FORMELSAMMLUNG</div>
            <div class="b-text"><p>Für 30 BE bleiben rund 65 Minuten. Alle drei Aufgaben sind zu bearbeiten, es gibt keine Wahl. Bis 2022/23 war statt des MMS der grafikfähige Taschenrechner erlaubt.</p>
                <ul>
                    <li><b>Aufgabe 1:</b> eine Funktion</li>
                    <li><b>Aufgabe 2:</b> ein Körper und eine Wahrscheinlichkeit, 2022/23 stattdessen Trigonometrie</li>
                    <li><b>Aufgabe 3:</b> eine lange Sachaufgabe aus Sachsen, quer durch alle Gebiete</li>
                </ul></div>
        </div>
    </div>
    <div class="b-box b-merk">
        <div class="b-box-title">MERKE · FORM UND NÄHERUNGSWERTE</div>
        <div class="b-text"><p>Für die Form gibt es höchstens 2 BE Abzug, und nur bei schweren oder gehäuften Verstößen.</p>
            <p>Wo ein exakter Wert erwartet wird, bringt ein richtiger Näherungswert trotzdem die volle Punktzahl.</p></div>
    </div>
</section>

<section class="b-sec" id="punkte" data-kind="le" data-toc="Punkte und Noten" data-toc-k="2" data-toc-short="Punkte">
    <div class="b-band"><span class="b-band-tag">PUNKTE</span><span class="b-band-sub">BEWERTUNGSEINHEITEN UND NOTENSKALA</span></div>
    <h2><span class="b-no">2</span>Punkte und Noten</h2>
    <div class="b-table-wrap"><table class="b-table">
        <tr><th>Jahr</th><th>Teil A</th><th>Aufgabe 1</th><th>Aufgabe 2</th><th>Aufgabe 3</th><th class="b-sum">Gesamt</th></tr>
        <tr><td>2021/22</td><td>6 + 9</td><td>7</td><td>7</td><td>16</td><td class="b-sum">45</td></tr>
        <tr><td>2022/23</td><td>6 + 9</td><td>8</td><td>7</td><td>15</td><td class="b-sum">45</td></tr>
        <tr><td>2023/24</td><td>6 + 9</td><td>8</td><td>8</td><td>14</td><td class="b-sum">45</td></tr>
        <tr><td>2024/25</td><td>6 + 9</td><td>8</td><td>7</td><td>15</td><td class="b-sum">45</td></tr>
    </table></div>
    <div class="b-table-wrap"><table class="b-table">
        <tr><th>BE</th><td>ab 39</td><td>32–38</td><td>25–31</td><td>18–24</td><td>9–17</td><td>bis 8</td></tr>
        <tr><th>Note</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>
    </table></div>
    <div class="b-text"><p>Die Notenskala stand so in den Hinweisen der Jahrgänge 2023/24 und 2024/25, etwas milder als bei der BLF. Für eine Vier reichen 18 von 45 BE.
        Die lange Sachaufgabe trägt jedes Jahr rund ein Drittel aller Punkte.</p></div>
</section>

<section class="b-sec" id="plan" data-kind="rueckblick" data-toc="So übst du" data-toc-k="R" data-toc-short="So übst du">
    <div class="b-band"><span class="b-band-tag">SO ÜBST DU</span><span class="b-band-sub">DIE REIHENFOLGE LOHNT SICH</span></div>
    <div class="b-rueck"><div><h4>ZUERST TEIL A</h4><p>Ohne Rechner gibt es keine zweite Chance. Die Kapitel 28 und 29 trainieren genau das.</p></div>
        <div><p>Stell dir bei beiden Kapiteln einen Wecker auf 25 Minuten.</p></div></div>
    <div class="b-rueck"><div><h4>DANN FUNKTIONEN UND GLEICHUNGSSYSTEME</h4><p>Sie tragen in Teil B die meisten Punkte: Kapitel 30, 31 und 34.</p></div>
        <div><p>Danach Trigonometrie und Körper in Kapitel 32 und Zufall in Kapitel 33.</p></div></div>
    <div class="b-rueck"><div><h4>ZUM SCHLUSS</h4><p>Die Generalprobe in Kapitel 35 läuft mit Uhr.</p></div>
        <div><p>Rechne sie auf Papier, in einem Stück und ohne Lösungen.</p></div></div>
</section>"""


BUCH = [
    dict(file="abi-ueberblick", k=1, title="So ist das Abitur gebaut", lb=ABI + "Überblick", when=GL,
         sub="Teil A und Teil B, Punkte, Aufgabentypen, Operatoren, Reihenfolge zum Üben", body=UEBERBLICK_ABI),

    dict(file="abi-teila", sheet="abitur-bgy-teila", k=2, title="Teil A: ohne Hilfsmittel", lb=ABI + "Teil A", when=GL,
         sub="Ankreuzen, Kurzaufgaben zu Fläche, Ebene, Pyramide, Ziehen ohne Zurücklegen",
         chips=["TEIL A", "OHNE HILFSMITTEL", "85 BIS 95 MINUTEN"],
         lead=r"Der erste Teil des Abiturs wird ohne Taschenrechner geschrieben und nach fester Zeit eingesammelt. Hier zählen Standardverfahren, die im Schlaf sitzen. Aufgabe 1 ist in allen 16 ausgewerteten Arbeiten derselbe Typ: Ankreuzen.",
         pruef=["Ableiten und Integrieren ohne Rechner, auch mit Produkt- und Kettenregel",
                "Definitionsbereich, Wertebereich, Graphen zuordnen",
                "Kurzaufgaben zu Fläche, Ebene und Pyramide",
                "Zufallsgrößen mit einfachen Brüchen"],
         hero=G(["(x+1)^2*(x-2)"], "-2.5,3.5", "-5.5,4", [[-1, 0], [2, 0], [1, -4]], "Graph einer Funktion dritten Grades mit doppelter Nullstelle"),
         checkin=[Q(r"$f(x) = x \cdot e^{2x}$. Wie groß ist $f'(0)$?", "1", "1", r"Produktregel: $f'(x) = (1 + 2x) \cdot e^{2x}$, also $f'(0) = 1$.", "f'(0) ="),
                  Q(r"Berechne $\int_{-1}^{1} x^3\,dx$.", "0", "1/4 - 1/4", r"Der Graph ist punktsymmetrisch zum Ursprung, die Grenzen liegen symmetrisch."),
                  Q(r"$X \sim B(10;\, 0{,}2)$. Wie groß ist $E(X)$?", "2", "10*0.2", r"$E(X) = n \cdot p = 10 \cdot 0{,}2 = 2$", "E(X) =")],
         merke=("MERKE · DAS SITZT OHNE RECHNER",
                [r"**Produktregel:** $(u \cdot v)' = u' \cdot v + u \cdot v'$. **Kettenregel:** $(e^{ax})' = a \cdot e^{ax}$.",
                 r"**Symmetrie:** Ist der Graph von $f$ punktsymmetrisch zum Ursprung, gilt $\int_{-a}^{a} f(x)\,dx = 0$.",
                 r"**Wurzel:** Unter der Wurzel steht nie etwas Negatives, daraus folgt der Definitionsbereich.",
                 r"**Pyramide:** $V = \frac{1}{3} \cdot G \cdot h$. **Erwartungswert:** $E(X) = \sum x_i \cdot P(X = x_i)$."]),
         methode=("STRATEGIE · ANKREUZEN",
                  ["Jede Ankreuzaufgabe zählt 1 BE, es gibt keine Teilpunkte und keinen Abzug. Lass deshalb nie ein Feld leer.",
                   "Streiche zuerst aus, was sicher falsch ist. Bei Ableitungen hilft oft eine Probe an der Stelle $x = 0$."]),
         widgets=[W("ableiten", "INTERAKTIV · ABLEITUNGSTRAINER", r"Wähle eine Aufgabenart und tippe die Ableitung ein, zum Beispiel `3x^2-4`. Der Trainer prüft an vielen Stellen, ob dein Term stimmt.".replace("`", ""))],
         repeat=[L("../mathe12/lb2-3.html", "ABLEITUNGSREGELN", "Mathematik 12 · Kapitel 2.3"),
                 L("../mathe13/lb3-1.html", "STAMMFUNKTIONEN", "Mathematik 13 · Kapitel 3.1"),
                 L("../mathe13/wp1-2.html", "EBENEN UND PUNKTPROBE", "Mathematik 13 · Kapitel W.2")],
         kern=[r"Erst prüfen, welche Regel gefragt ist. Bei Integralen zuerst auf Symmetrie schauen, das spart die Rechnung.",
               r"Kurzaufgaben sind Standardverfahren. Schreib den Ansatz hin, dann reichen wenige Zeilen.",
               r"Ziehen ohne Zurücklegen ändert bei jedem Zug die Wahrscheinlichkeit. Ein Baum bringt Ordnung."],
         test=[Q(r"$f(x) = x \cdot e^{-x}$. Wie groß ist $f'(1)$?", "0", "(1-1)*exp(-1)", r"$f'(x) = (1 - x) \cdot e^{-x}$, also $f'(1) = 0$.", "f'(1) ="),
               Q(r"Berechne $\int_{-3}^{3} (x^5 - 2x)\,dx$.", "0", "(3**6/6-3**2)-(3**6/6-3**2)", r"Der Integrand ist punktsymmetrisch, die Grenzen liegen symmetrisch."),
               Q(r"Eine gerade quadratische Pyramide hat die Grundkante $3$ cm und die Höhe $5$ cm. Wie groß ist ihr Volumen in cm³?", "15", "3*3*5/3", r"$V = \frac{1}{3} \cdot 9 \cdot 5 = 15$", "V ="),
               Q(r"Wie groß ist die Fläche zwischen $y = x^2$ und $y = x$?", "1/6", "1/2-1/3", r"Schnittstellen $0$ und $1$: $\int_0^1 (x - x^2)\,dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6}$", "A =")]),

    dict(file="abi-analysis", sheet="abitur-bgy-analysis", k=3, title="Analysis", lb=ABI + "Analysis", when=GL,
         sub="Funktionsuntersuchung, parallele Tangenten, e-Funktion im Sachkontext",
         chips=["PFLICHTAUFGABE 1", "MIT RECHNER"],
         lead=r"Pflichtaufgabe 1 trägt im Abitur die meisten Punkte. Sie beginnt fast immer mit einer ganzrationalen Funktion dritten Grades und endet in einem Sachzusammenhang. Wer das Schema beherrscht, sammelt hier die sichersten Punkte.",
         pruef=["Nullstellen, Hoch-, Tief- und Wendepunkte, Monotonie",
                "Tangenten, vor allem Paare paralleler Tangenten",
                "Exponentialfunktionen im Sachzusammenhang",
                "Begründen und Beurteilen, nicht nur rechnen"],
         hero=G(["x^3-6*x^2+9*x"], "-0.8,4.6", "-1.5,5.6", [[1, 4], [2, 2], [3, 0]], "Graph einer Funktion dritten Grades mit Hochpunkt, Wendepunkt und Tiefpunkt"),
         checkin=[Q(r"$f(x) = x^3 - 3x$. Wie groß ist $f'(2)$?", "9", "3*4-3", r"$f'(x) = 3x^2 - 3$, also $f'(2) = 9$.", "f'(2) ="),
                  Q(r"An welcher Stelle hat $f(x) = x^3 - 3x^2$ ihren Wendepunkt?", "1", "6/6", r"$f''(x) = 6x - 6 = 0$ für $x = 1$.", "x ="),
                  Q(r"Wie groß ist der Anstieg der Tangente an $f(x) = x^2$ in $x = 3$?", "6", "2*3", r"$f'(3) = 2 \cdot 3 = 6$", "m =")],
         merke=("MERKE · DAS SCHEMA DER FUNKTIONSUNTERSUCHUNG",
                [r"**Nullstellen:** $f(x) = 0$, oft hilft Ausklammern.",
                 r"**Extrempunkte:** $f'(x) = 0$. Ist $f''(x) < 0$, liegt ein Hochpunkt vor, ist $f''(x) > 0$, ein Tiefpunkt.",
                 r"**Wendepunkt:** $f''(x) = 0$ mit Vorzeichenwechsel von $f''$.",
                 r"**Tangente in $x_0$:** $y = f'(x_0) \cdot (x - x_0) + f(x_0)$."]),
         methode=("METHODE · AM STÄRKSTEN",
                  [r"„Am stärksten steigend“ oder „am stärksten fallend“ fragt nach dem Extremwert von $f'$, also nach einer Wendestelle von $f$."]),
         widgets=[W("kurve", "INTERAKTIV · EXTREMPUNKTE MIT F′ UND F″", r"Schalte $f'$ dazu: Wo der gestrichelte Graph die Achse schneidet, liegen die Extrempunkte von $f$. Mit den Reglern findest du auch Fälle ohne Extrempunkte.")],
         repeat=[L("../mathe12/lb2-4.html", "MONOTONIE, EXTREMA, WENDEPUNKTE", "Mathematik 12 · Kapitel 2.4"),
                 L("../mathe12/lb2-5.html", "GRAPHEN UNTERSUCHEN", "Mathematik 12 · Kapitel 2.5")],
         kern=[r"Ausklammern liefert die Nullstellen, $f'$ die Extrema, $f''$ den Wendepunkt.",
               r"Parallele Tangenten bedeuten gleiche Ableitung. Die Berührstellen liegen symmetrisch zur Wendestelle.",
               r"Produktregel, dann zerlegen: Der e-Faktor ist nie null, also entscheidet der andere Faktor."],
         test=[Q(r"$f(x) = x^3 - 3x^2$. An welcher Stelle liegt der Tiefpunkt?", "2", "6/3", r"$f'(x) = 3x^2 - 6x = 3x(x - 2)$ und $f''(2) = 6 > 0$.", "x ="),
               Q(r"Die Tangenten an $f(x) = x^3 - 3x^2$ in $x = -1$ und $x = 3$ sind parallel. Wie groß ist ihr Anstieg?", "9", "3*9-6*3", r"$f'(-1) = 3 + 6 = 9$ und $f'(3) = 27 - 18 = 9$", "m ="),
               Q(r"$c(t) = 10 \cdot t \cdot e^{-t}$. Zu welchem Zeitpunkt ist $c$ am größten?", "1", "1", r"$c'(t) = 10 \cdot e^{-t} \cdot (1 - t) = 0$ für $t = 1$.", "t ="),
               Q(r"Zu welchem Zeitpunkt nimmt dieselbe Funktion $c$ am stärksten ab?", "2", "2", r"$c''(t) = 10 \cdot e^{-t} \cdot (t - 2) = 0$ für $t = 2$, mit Vorzeichenwechsel.", "t =")]),

    dict(file="abi-analysis-lk", sheet="abitur-bgy-analysis-lk", k=4, title="Analysis im Leistungskurs", lb=ABI + "Analysis", when=LK,
         sub="e-Funktion mit Parameter, Sinus, Differenz zweier Modelle",
         chips=["PFLICHTAUFGABE 1", "LEISTUNGSKURS"],
         lead=r"Im Leistungskurs kommen Parameter dazu: Die Funktion steht nicht fest, sondern ist eine ganze Schar. Du rechnest in Abhängigkeit von $a$, und am Ende steht eine Ortskurve. Dazu kommen Sinusfunktionen und der Vergleich zweier Modelle.",
         pruef=[r"Exponentialfunktionen mit Parameter, Hoch- und Wendepunkte in Abhängigkeit von $a$",
                "Ortskurven der Extrempunkte", "Sinusfunktionen mit Parametern und Symmetrie",
                "Die Differenz zweier Funktionen untersuchen"],
         hero=G(["x*exp(1-0.5*x)", "x*exp(1-x)", "x*exp(1-2*x)", "x"], "-0.4,6", "-0.5,3.5", [[2, 2], [1, 1], [0.5, 0.5]], "Drei Graphen einer Schar, deren Hochpunkte auf der Geraden y gleich x liegen"),
         checkin=[Q(r"$f(x) = x \cdot e^{-x}$. An welcher Stelle liegt der Hochpunkt?", "1", "1", r"$f'(x) = (1 - x) \cdot e^{-x} = 0$", "x ="),
                  Q(r"Wie groß ist die Ableitung von $e^{-2x}$ an der Stelle $0$?", "-2", "-2", r"Kettenregel: $-2 \cdot e^{-2x}$, an der Stelle $0$ also $-2$.", "Wert"),
                  Q(r"Die Periode von $\sin(2x)$ ist $k \cdot \pi$. Wie groß ist $k$?", "1", "2/2", r"$p = \frac{2\pi}{2} = \pi$", "k =")],
         merke=("MERKE · RECHNEN MIT PARAMETER",
                [r"**Parameter:** $a$ behandelst du beim Ableiten wie eine Zahl, die Ergebnisse stehen in Abhängigkeit von $a$.",
                 r"**Ortskurve:** Aus $x = g(a)$ nach $a$ auflösen und in $y$ einsetzen. Dann angeben, welcher Teil der Kurve wirklich vorkommt.",
                 r"**Sinus:** $f(x) = A \cdot \sin(b \cdot x) + d$ hat die Periode $\frac{2\pi}{b}$ und den Wertebereich $[d - |A|;\, d + |A|]$.",
                 r"**Differenz:** $d(t) = N_B(t) - N_A(t)$ ableiten. Beim größten Unterschied gilt $N_A'(t) = N_B'(t)$."]),
         widgets=[W("schar", "INTERAKTIV · EINE FUNKTIONENSCHAR", r"Verschiebe den Parameter $a$. Die Extrempunkte aller Scharkurven liegen auf einer gemeinsamen Kurve, der Ortskurve."),
                  W("sinus", "INTERAKTIV · SINUS-WERKSTATT", r"Verändere die vier Parameter einzeln und beobachte, was mit der Kurve passiert. Gestrichelt: $\sin x$.")],
         repeat=[L("../mathe12lk/lb2-4.html", "PRODUKT- UND KETTENREGEL", "Mathematik 12 LK · Kapitel 2.4"),
                 L("../mathe13lk/lb7-1.html", "FUNKTIONENSCHAREN", "Mathematik 13 LK · Kapitel 7.1")],
         kern=[r"Mit $a$ rechnen wie mit einer Zahl. Weil $H_a\left(\frac{1}{a} \mid \frac{1}{a}\right)$ gilt, liegen alle Hochpunkte auf $y = x$.",
               r"Punktsymmetrie zum Wendepunkt ersetzt das Integral: Die Fläche ist das Rechteck aus Mittellinie und Periode.",
               r"Der Unterschied ist eine neue Funktion: ableiten, null setzen, Ränder prüfen."],
         test=[Q(r"$f_a(x) = x \cdot e^{1 - a \cdot x}$. Für welches $a$ liegt der Hochpunkt bei $x = 4$?", "0,25", "1/4", r"Der Hochpunkt liegt bei $x = \frac{1}{a}$.", "a ="),
               Q(r"$g_a(x) = x \cdot e^{-a \cdot x}$. Wo liegt die Wendestelle für $a = 1$?", "2", "2/1", r"$g_a''(x) = (a^2 x - 2a) \cdot e^{-ax} = 0$ für $x = \frac{2}{a}$.", "x ="),
               Q(r"$w(x) = 2 \cdot \sin(3x) + 5$. Wie groß ist der größte Funktionswert?", "7", "5+2", r"$5 + 2 = 7$", "y ="),
               Q(r"Die Periode von $4 \cdot \sin\left(\frac{x}{3}\right) + 1$ ist $k \cdot \pi$. Wie groß ist $k$?", "6", "2*3", r"$p = \frac{2\pi}{1/3} = 6\pi$", "k =")]),

    dict(file="abi-schar", sheet="abitur-bgy-schar", k=5, title="Funktionenscharen", lb=ABI + "Analysis", when=GL,
         sub="Nullstellen, Extrempunkte und Flächen in Abhängigkeit von t, Ortskurven",
         chips=["ANALYSIS", "MIT PARAMETER"],
         lead=r"Eine Funktionenschar ist eine ganze Familie von Graphen mit demselben Bauplan. Wer einmal allgemein rechnet, hat alle auf einmal erledigt. Die Prüfung fragt danach, was sich ändert, was gleich bleibt und wohin die Gipfel wandern.",
         pruef=[r"Nullstellen und Extrempunkte in Abhängigkeit von $t$",
                "Symmetrie der ganzen Schar nachweisen", "Ortskurven und gemeinsame Punkte",
                "Flächen mit Parameter und das Verhalten bei Verdopplung"],
         hero=G(["x^3-3*x", "x^3-6.75*x", "x^3-12*x"], "-4,4", "-18,18", [[-1, 2], [1, -2], [-1.5, 6.75], [1.5, -6.75], [-2, 16], [2, -16]], "Drei Graphen einer Schar mit ihren Extrempunkten"),
         checkin=[Q(r"$f_t(x) = x^2 - t^2$. Wie groß ist die positive Nullstelle für $t = 3$?", "3", "3", r"$x^2 = 9$", "x ="),
                  Q(r"$f(x) = x^3 - 12x$. Wie groß ist $f'(1)$?", "-9", "3-12", r"$f'(x) = 3x^2 - 12$", "f'(1) ="),
                  Q(r"Berechne $\int_0^2 x^3\,dx$.", "4", "2**4/4", r"$\frac{2^4}{4} = 4$")],
         merke=("MERKE · SCHAREN",
                [r"**$t$ ist eine Konstante:** Beim Ableiten nach $x$ bleibt $t$ stehen: $(3t^2 \cdot x)' = 3t^2$.",
                 r"**Ortskurve:** Aus $x(t)$ nach $t$ umstellen, in $y(t)$ einsetzen, dann den Geltungsbereich angeben.",
                 r"**Gemeinsamer Punkt:** Zwei Scharkurven gleichsetzen: $f_{t_1}(x) = f_{t_2}(x)$.",
                 r"**Fläche mit Parameter:** Die Grenzen hängen von $t$ ab, das Ergebnis also auch."]),
         widgets=[W("schar", "INTERAKTIV · EINE FUNKTIONENSCHAR", r"Verschiebe den Parameter $a$. Die Extrempunkte aller Scharkurven liegen auf einer gemeinsamen Kurve, der Ortskurve.")],
         repeat=[L("../mathe13/lb6.html", "WEITERE ANWENDUNGEN", "Mathematik 13 · Kapitel 6"),
                 L("../mathe13lk/lb7-1.html", "FUNKTIONENSCHAREN", "Mathematik 13 LK · Kapitel 7.1")],
         kern=[r"Allgemein rechnen wie mit Zahlen, $t > 0$ im Blick behalten.",
               r"Erst den Term der Ortskurve, dann ihren Geltungsbereich: Nicht jeder Punkt der Kurve kommt als Extrempunkt vor.",
               r"$A(t)$ wächst mit der vierten Potenz. Verdoppeln von $t$ heißt deshalb 16-fache Fläche."],
         test=[Q(r"$f_t(x) = x^3 - 3t^2 \cdot x$. Wie groß ist für $t = 2$ die $y$-Koordinate des Hochpunkts?", "16", "(-2)**3-3*4*(-2)", r"Hochpunkt bei $x = -t = -2$: $f_2(-2) = -8 + 24 = 16$", "y ="),
               Q(r"$g_t(x) = x^3 - t \cdot x$. Für welches $t$ hat die Tangente in $x = 1$ den Anstieg $0$?", "3", "3", r"$g_t'(1) = 3 - t = 0$", "t ="),
               Q(r"$h_t(x) = t \cdot x^2 - 2x$. An welcher Stelle liegt der Scheitel für $t = 4$?", "0,25", "2/(2*4)", r"$h_t'(x) = 2t \cdot x - 2 = 0$ ergibt $x = \frac{1}{t}$.", "x ="),
               Q(r"Es gilt $A(t) = \frac{9}{2} \cdot t^4$. Um welchen Faktor wächst die Fläche, wenn du $t$ verdreifachst?", "81", "3**4", r"$3^4 = 81$", "Faktor")]),

    dict(file="abi-integral", sheet="abitur-bgy-integral", k=6, title="Integralrechnung", lb=ABI + "Analysis", when=GL,
         sub="Flächen, Flächen teilen, Mittelwerte, Bestand aus der Änderungsrate",
         chips=["ANALYSIS", "FLÄCHEN UND MITTELWERTE"],
         lead=r"Das Integral rechnet Flächen unter der Achse negativ. Wer das vergisst, bekommt eine schöne Zahl und trotzdem keine Punkte. In diesem Kapitel geht es um echte Flächen, um das Teilen von Flächen und um Bestände aus einer Änderungsrate.",
         pruef=["Flächen mit der $x$-Achse und zwischen zwei Graphen",
                "Eine Fläche halbieren oder in einem Verhältnis teilen",
                "Mittelwert einer Funktion", "Gesamtmenge aus einer Änderungsrate"],
         hero=G(["-(x^2)+6*x-5", "x-1"], "-0.5,6", "-2,5", [[1, 0], [4, 3]], "Fläche zwischen Parabel und Gerade"),
         checkin=[Q(r"Berechne $\int_0^3 2x\,dx$.", "9", "3**2", r"$\left[x^2\right]_0^3 = 9$"),
                  Q(r"$F(x) = x^3$. Wie groß ist $F'(2)$?", "12", "3*4", r"$F'(x) = 3x^2$", "F'(2) ="),
                  Q(r"Wie groß ist die größere Nullstelle von $x^2 - x - 2$?", "2", "(1+3)/2", r"$(x - 2)(x + 1) = 0$", "x =")],
         merke=("MERKE · INTEGRALE",
                [r"**Hauptsatz:** $\int_a^b f(x)\,dx = F(b) - F(a)$.",
                 r"**Fläche mit der $x$-Achse:** An den Nullstellen zerlegen und die Beträge addieren.",
                 r"**Fläche zwischen Graphen:** $A = \int_a^b |f(x) - g(x)|\,dx$ zwischen den Schnittstellen.",
                 r"**Mittelwert:** $\overline{m} = \frac{1}{b - a} \int_a^b f(x)\,dx$."]),
         widgets=[W("integral", "INTERAKTIV · ORIENTIERTE FLÄCHE", r"Zieh die Grenzen $a$ und $b$. Gelbe Stücke liegen über der Achse und zählen positiv, rote darunter und zählen negativ. Vergleiche Integral und Fläche."),
                  W("zwischenflaeche", "INTERAKTIV · FLÄCHE ZWISCHEN ZWEI GRAPHEN", r"Das Widget bestimmt die Schnittstellen und integriert die Differenzfunktion von Schnittstelle zu Schnittstelle.")],
         repeat=[L("../mathe13/lb3-2.html", "DAS BESTIMMTE INTEGRAL", "Mathematik 13 · Kapitel 3.2"),
                 L("../mathe13/lb3-3.html", "FLÄCHENINHALTE", "Mathematik 13 · Kapitel 3.3")],
         kern=[r"Erst Nullstellen, dann Teilintegrale, dann Beträge. Das Integral allein verrechnet die Stücke.",
               r"Differenzfunktion integrieren. Beim Teilen setzt du die halbe Fläche gleich dem Integral bis zur gesuchten Stelle.",
               r"Das Integral der Leistung ist die Energie, der Überschuss ist die Fläche über der Verbrauchslinie."],
         test=[Q(r"Berechne $\int_{-1}^{1} (x^2 + 1)\,dx$.", "8/3", "2/3+2", r"$\left[\frac{x^3}{3} + x\right]_{-1}^{1} = \frac{4}{3} + \frac{4}{3} = \frac{8}{3}$", tol="0.01"),
               Q(r"Wie groß ist die Fläche zwischen $f(x) = x^2$ und $g(x) = 2x$?", "4/3", "4-8/3", r"Schnittstellen $0$ und $2$: $\int_0^2 (2x - x^2)\,dx = 4 - \frac{8}{3} = \frac{4}{3}$", "A =", "0.01"),
               Q(r"Wie groß ist der Mittelwert von $f(x) = x^2$ über $[0;\,3]$?", "3", "9/3", r"$\frac{1}{3} \cdot \frac{27}{3} = 3$", "m ="),
               Q(r"Wie groß ist die Fläche, die $f(x) = x^2 - 1$ mit der $x$-Achse einschließt?", "4/3", "2*(1-1/3)", r"$\left|\int_{-1}^{1} (x^2 - 1)\,dx\right| = \frac{4}{3}$", "A =", "0.01")]),

    dict(file="abi-extremwert", sheet="abitur-bgy-extremwert", k=7, title="Extremwertaufgaben", lb=ABI + "Analysis", when=GL,
         sub="Zielfunktion, Nebenbedingung, Randwerte, Optimum im Sachzusammenhang",
         chips=["ANALYSIS", "OPTIMIEREN"],
         lead=r"Das größte Rechteck, der sparsamste Behälter, das günstigste Kabel: Extremwertaufgaben laufen immer nach demselben Plan. Die Punkte gibt es für den Aufbau, also für Zielfunktion, Nebenbedingung und Definitionsbereich. Die Ableitung ist danach Handwerk.",
         pruef=["Zielfunktion und Nebenbedingung aufstellen", "Einen Term nachweisen, den die Aufgabe vorgibt",
                "Maximum oder Minimum nachweisen, auch am Rand", "Das Ergebnis im Sachzusammenhang vergleichen"],
         hero=G(["18*x-2*x^3"], "-0.4,3.4", "-4,28", [[1.732, 20.785]], "Graph der Zielfunktion A mit ihrem Maximum", "u", "A"),
         checkin=[Q(r"Ein Rechteck hat den Umfang $20$ und die Seite $a = 4$. Wie lang ist die andere Seite?", "6", "10-4", r"$a + b = 10$", "b ="),
                  Q(r"Für welches $x$ ist $A(x) = x \cdot (10 - x)$ am größten?", "5", "10/2", r"$A'(x) = 10 - 2x = 0$", "x ="),
                  Q(r"Wie groß ist die Ableitung von $\sqrt{x}$ an der Stelle $4$?", "0,25", "1/(2*2)", r"$\frac{1}{2\sqrt{x}}$ an der Stelle $4$ ergibt $\frac{1}{4}$.", "Wert")],
         merke=("MERKE · DIE FÜNF SCHRITTE",
                [r"**1. Zielgröße** benennen: Was soll groß oder klein werden?",
                 r"**2. Nebenbedingung** aufstellen: Was steht fest?",
                 r"**3. Zielfunktion** mit einer Variablen aufschreiben, dazu den Definitionsbereich.",
                 r"**4. Ableiten:** $f'(x) = 0$ lösen und mit $f''$ oder dem Vorzeichenwechsel nachweisen.",
                 r"**5. Ränder prüfen** und im Sachzusammenhang antworten, mit Einheit."]),
         widgets=[W("optimieren", "INTERAKTIV · OPTIMIEREN", r"Wähle ein Problem und verschiebe die Variable. Der Graph der Zielfunktion zeigt, wo das Optimum liegt. Erst probieren, dann mit $f' = 0$ rechnen.")],
         repeat=[L("../mathe12/lb2-6.html", "STECKBRIEFE UND EXTREMWERTPROBLEME", "Mathematik 12 · Kapitel 2.6"),
                 L("../mathe12lk/lb2-8.html", "EXTREMWERTPROBLEME", "Mathematik 12 LK · Kapitel 2.8")],
         kern=[r"Die Symmetrie macht aus zwei Variablen eine. Die Breite ist $2u$, die Höhe $f(u)$.",
               r"Die Nebenbedingung $a^2 \cdot h = V$ fällt beim Einsetzen weg. Danach zählt nur noch $O(a)$.",
               r"Zwei Abschnitte, zwei Preise: Die Kosten addieren sich, die Wurzel kommt von Pythagoras."],
         test=[Q(r"Ein Rechteck unter $f(x) = 12 - x^2$ hat die Fläche $A(u) = 24u - 2u^3$. Für welches $u$ ist $A$ maximal?", "2", "(24/6)**0.5", r"$A'(u) = 24 - 6u^2 = 0$", "u ="),
               Q(r"Wie groß ist diese größte Fläche?", "32", "24*2-2*8", r"$A(2) = 48 - 16 = 32$", "A ="),
               Q(r"Ein oben offener Behälter mit quadratischem Boden fasst $500$ cm³, also $O(a) = a^2 + \frac{2000}{a}$. Für welche Grundkante $a$ ist $O$ minimal?", "10", "1000**(1/3)", r"$O'(a) = 2a - \frac{2000}{a^2} = 0$ ergibt $a^3 = 1000$.", "a =", "0.001"),
               Q(r"Wie hoch ist dieser Behälter?", "5", "500/100", r"$h = \frac{500}{10^2} = 5$. Die Höhe ist wieder halb so groß wie die Grundkante.", "h =")]),

    dict(file="abi-modellieren", sheet="abitur-bgy-modellieren", k=8, title="Modellieren", lb=ABI + "Analysis", when=GL,
         sub="Steckbriefaufgaben, Übergang ohne Knick, was der Ableitungsgraph verrät",
         chips=["ANALYSIS", "STECKBRIEF"],
         lead=r"Hier läuft die Aufgabe rückwärts: Nicht die Funktion ist gegeben, sondern ihre Eigenschaften. Aus Sätzen werden Gleichungen, aus Gleichungen wird ein Funktionsterm. Und wo zwei Kurvenstücke aneinanderstoßen, muss der Übergang stimmen.",
         pruef=["Bedingungen in Gleichungen übersetzen", "Lineare Gleichungssysteme für die Koeffizienten lösen",
                "Knickfreie Übergänge nachweisen", "Anstiegswinkel, Gefälle in Prozent, Modellkritik"],
         hero=G(["(x<=10)*(20-x)+(x>10&&x<=20)*(0.05*x^2-2*x+25)+(x>20)*5"], "-1,27", "-1,22", [[10, 10], [20, 5]], "Profil einer Achterbahn aus Gerade, Parabelbogen und Bremsstrecke", "x", "h"),
         checkin=[Q(r"Der Graph von $f(x) = a \cdot x^2 + b$ geht durch $(0 \mid 3)$. Wie groß ist $b$?", "3", "3", r"$f(0) = b = 3$", "b ="),
                  Q(r"Eine Straße hat ein Gefälle von $10\,\%$. Wie groß ist der Betrag des Anstiegs?", "0,1", "10/100", r"$10\,\%$ heißt $10$ m Höhe auf $100$ m Strecke.", "|m| ="),
                  Q(r"Wie groß ist der Neigungswinkel einer Geraden mit dem Anstieg $1$ in Grad?", "45", "degrees(atan(1))", r"$\tan \alpha = 1$", "α =")],
         merke=("MERKE · AUS SÄTZEN WERDEN GLEICHUNGEN",
                [r"**Punkt auf dem Graphen:** $f(x_0) = y_0$.",
                 r"**Waagerechte Tangente, Extrempunkt:** zusätzlich $f'(x_0) = 0$.",
                 r"**Wendepunkt:** $f''(x_0) = 0$.",
                 r"**Ohne Sprung und ohne Knick:** An der Nahtstelle stimmen Funktionswert und Ableitung überein: $f(x_0) = g(x_0)$ und $f'(x_0) = g'(x_0)$.",
                 r"**Ohne Ruck:** Zusätzlich gilt $f''(x_0) = g''(x_0)$. Das verlangt die Prüfung nur, wenn es dasteht."]),
         widgets=[W("steckbrief", "INTERAKTIV · DER STECKBRIEF", r"Wähle die Art der Bedingungen und zieh die Punkte. Das Widget stellt das Gleichungssystem auf und löst es, die Kurve folgt sofort.")],
         repeat=[L("../mathe12/lb2-6.html", "STECKBRIEFE UND EXTREMWERTPROBLEME", "Mathematik 12 · Kapitel 2.6"),
                 L("../mathe12lk/lb2-7.html", "STECKBRIEFE UND REGRESSION", "Mathematik 12 LK · Kapitel 2.7")],
         kern=[r"Jede Eigenschaft gibt eine Gleichung, vier Unbekannte brauchen vier Gleichungen.",
               r"An jeder Nahtstelle zwei Bedingungen: gleicher Wert, gleicher Anstieg.",
               r"Am Graphen von $h'$ liest du die Steilheit ab. Stetiges $h'$ heißt nur: kein Knick. Die Krümmung kann trotzdem springen."],
         test=[Q(r"$f(x) = a x^3 + b x$ hat bei $(1 \mid 2)$ einen Hochpunkt. Wie groß ist $b$?", "3", "2-(-1)", r"$a + b = 2$ und $3a + b = 0$ ergeben $a = -1$ und $b = 3$.", "b ="),
               Q(r"$g(x) = x$ für $x \leq 2$ geht bei $x = 2$ knickfrei in $k(x) = a x^2 + c$ über. Wie groß ist $c$?", "1", "2-0.25*4", r"$k'(2) = 4a = 1$ ergibt $a = 0{,}25$, aus $k(2) = 2$ folgt $c = 1$.", "c ="),
               Q(r"Für welches $x$ gilt $h'(x) = -1$ bei $h(x) = 0{,}05x^2 - 2x + 25$?", "10", "1/0.1", r"$h'(x) = 0{,}1x - 2 = -1$", "x ="),
               Q(r"Wie groß ist der Neigungswinkel einer Bahn mit $h'(x) = -0{,}5$ in Grad, gerundet?", "27", "degrees(atan(0.5))", r"$\tan \alpha = 0{,}5$ ergibt $\alpha \approx 26{,}6°$.", "α =", "0.5")]),

    dict(file="abi-wachstum", sheet="abitur-bgy-wachstum", k=9, title="Wachstum und Zerfall", lb=ABI + "Analysis", when=GL,
         sub="Exponentialfunktionen, Halbwertszeit, begrenztes Wachstum, Modelle vergleichen",
         chips=["ANALYSIS", "E-FUNKTION"],
         lead=r"Radon im Keller, der Akku am Ladegerät, eine App auf dem Weg zum Erfolg: Hinter allen drei steckt die e-Funktion. Die Prüfung will sehen, dass du Konstanten aus Messwerten bestimmst und beurteilst, welches Modell zur Sache passt.",
         pruef=["Konstanten aus Messwerten bestimmen", "Halbwertszeit und Verdopplungszeit",
                "Begrenztes Wachstum und Verhalten für große Zeiten", "Änderungsraten und der Vergleich zweier Modelle"],
         hero=G(["100-80*exp(-0.1*x)", "100"], "-2,42", "-5,110", [[0, 20]], "Begrenztes Wachstum, der Ladezustand nähert sich der Schranke", "t", "L"),
         checkin=[Q(r"$A(t) = 100 \cdot e^{-0{,}5t}$. Wie groß ist $A(0)$?", "100", "100", r"$e^0 = 1$", "A(0) ="),
                  Q(r"Wie groß ist $\ln(e^3)$?", "3", "log(exp(3))", r"$\ln$ und $e$ heben sich auf."),
                  Q(r"Ein Bestand von $80$ halbiert sich alle $5$ Tage. Wie groß ist er nach $10$ Tagen?", "20", "80/4", r"Zweimal halbieren: $80 \to 40 \to 20$")],
         merke=("MERKE · E-FUNKTIONEN",
                [r"**Zerfall:** $A(t) = A_0 \cdot e^{-k \cdot t}$ mit $k > 0$. **Halbwertszeit:** $T = \frac{\ln 2}{k}$.",
                 r"**Begrenztes Wachstum:** $L(t) = S - c \cdot e^{-k \cdot t}$ nähert sich der Schranke $S$ und erreicht sie nie.",
                 r"**Exponentialgleichung:** Erst die e-Potenz allein stellen, dann logarithmieren.",
                 r"**Änderungsrate:** $L'(t)$, mit Einheit pro Zeiteinheit angeben."]),
         widgets=[W("wachstumsmodell", "INTERAKTIV · VIER WACHSTUMSMODELLE", r"Wähle ein Modell und verändere Anfangsbestand, Parameter und Schranke. Die Punkte sind die Bestände nach jedem Schritt.")],
         repeat=[L("../mathe11/lb3-2.html", "WACHSTUM UND ZERFALL", "Mathematik 11 · Kapitel 3.2"),
                 L("../mathe11/lb3-6.html", "UMKEHRFUNKTIONEN UND LOGARITHMUS", "Mathematik 11 · Kapitel 3.6")],
         kern=[r"Zwei Messwerte, zwei Unbekannte. Durch den ersten Wert teilen, dann logarithmieren.",
               r"Bei $t \to \infty$ fällt der e-Term weg, die Schranke bleibt übrig.",
               r"Beide Modelle treffen die Messwerte. Erst das Verhalten für große $t$ entscheidet, welches zur Sache passt."],
         test=[Q(r"Bei $e^{-0{,}1 \cdot t}$: Wie groß ist die Halbwertszeit, auf eine Stelle gerundet?", "6,9", "log(2)/0.1", r"$T = \frac{\ln 2}{0{,}1} \approx 6{,}9$", "T =", "0.05"),
               Q(r"$L(t) = 100 - 80 \cdot e^{-0{,}1t}$. Wie groß ist $L(0)$?", "20", "100-80", r"$100 - 80 = 20$", "L(0) ="),
               Q(r"Wie groß ist die Schranke von $S(t) = 500 - 400 \cdot e^{-0{,}2t}$?", "500", "500", r"Für $t \to \infty$ geht der e-Term gegen $0$.", "S ="),
               Q(r"$A(t) = 200 \cdot e^{-0{,}2t}$. Wann ist $A = 100$? Runde auf eine Stelle.", "3,5", "log(2)/0.2", r"$e^{-0{,}2t} = \frac{1}{2}$ ergibt $t = \frac{\ln 2}{0{,}2} \approx 3{,}5$.", "t =", "0.05")]),

    dict(file="abi-geometrie", sheet="abitur-bgy-geometrie", k=10, title="Analytische Geometrie", lb=ABI + "Analytische Geometrie", when=GL,
         sub="Körper im Raum, Ebene, Neigung, Abstand, Schattenwurf",
         chips=["PFLICHTAUFGABE 2", "VEKTOREN"],
         lead=r"Fast jede Geometrieaufgabe beginnt mit einem Körper aus Punkten: ein Haus, ein Zelt, ein Dach. Daraus entstehen Ebene, Neigung und Abstand. Und in drei von vier Jahrgängen fiel am Ende die Sonne schräg darauf: Schattenwurf.",
         pruef=["Längen, Nachweise an Vierecken, Volumen", "Geraden- und Ebenengleichungen",
                "Neigungswinkel und Abstand eines Punktes von einer Ebene", "Schatten per Richtungsvektor"],
         hero={"widget": "raum-hero", "data-h": "240"},
         checkin=[Q(r"Wie lang ist der Vektor $\begin{pmatrix}2\\-1\\2\end{pmatrix}$?", "3", "sqrt(9)", r"$\sqrt{4 + 1 + 4} = 3$", "Länge"),
                  Q(r"Berechne $\begin{pmatrix}1\\2\\3\end{pmatrix} \circ \begin{pmatrix}2\\-1\\0\end{pmatrix}$.", "0", "2-2", r"$2 - 2 + 0 = 0$, die Vektoren sind orthogonal."),
                  Q(r"Setze $P(1 \mid 2 \mid 3)$ in $x + y + z$ ein. Welcher Wert entsteht?", "6", "1+2+3", r"$1 + 2 + 3 = 6$, der Punkt liegt in $x + y + z = 6$.")],
         merke=("MERKE · RECHNEN IM RAUM",
                [r"**Rechteck:** Gegenüberliegende Seiten sind gleiche Vektoren, und benachbarte Seiten haben das Skalarprodukt $0$.",
                 r"**Neigung zweier Ebenen:** $\cos \alpha = \dfrac{|\vec{n}_1 \circ \vec{n}_2|}{|\vec{n}_1| \cdot |\vec{n}_2|}$. Für den Boden ist $\vec{n}_2 = (0, 0, 1)$.",
                 r"**Abstand von $E: ax + by + cz = d$:** $\dfrac{|a p_1 + b p_2 + c p_3 - d|}{\sqrt{a^2 + b^2 + c^2}}$.",
                 r"**Schatten:** Gerade $\vec{x} = \vec{p} + t \cdot \vec{s}$ durch den Punkt, dann $z = 0$ setzen."]),
         widgets=[W("ebene3d", "INTERAKTIV · EINE EBENE UND IHRE SPANNVEKTOREN", r"Ändere den Stützpunkt $A$ und die Spannvektoren $\vec{u}$ und $\vec{v}$. Schneidet die Ebene alle drei Achsen im Bild, siehst du ihr Spurdreieck.")],
         repeat=[L("../mathe13/wp1-2.html", "KOORDINATENGLEICHUNG UND LAGEBEZIEHUNGEN", "Mathematik 13 · Kapitel W.2"),
                 L("../mathe13/wp1-3.html", "SCHNITTWINKEL, PRISMEN, PYRAMIDEN", "Mathematik 13 · Kapitel W.3"),
                 L("../mathe12/lb5-2.html", "SKALARPRODUKT UND WINKEL", "Mathematik 12 · Kapitel 5.2")],
         kern=[r"Erst Vektoren aufstellen, dann Rechteck und Fläche. Das Gerätehaus ist ein Prisma mit einem Trapez als Querschnitt.",
               r"Der Normalenvektor trägt alles: Punktprobe, Neigung und Abstand.",
               r"Jeder Eckpunkt bekommt seine Gerade in Sonnenrichtung. Beim Schnitt mit dem Boden ist $z = 0$."],
         test=[Q(r"Der Punkt $P(2 \mid 0 \mid 4)$ wirft mit $\vec{s} = (1, 1, -2)$ einen Schatten auf $z = 0$. Wie groß ist dessen $x$-Koordinate?", "4", "2+2*1", r"$4 - 2t = 0$ ergibt $t = 2$, also $x = 2 + 2 = 4$.", "x ="),
               Q(r"Wie groß ist der Abstand von $P(1 \mid 2 \mid 5)$ zur Ebene $2x + y + 2z = 4$?", "10/3", "abs(2+2+10-4)/3", r"$\frac{|14 - 4|}{3} = \frac{10}{3}$", "d =", "0.01"),
               Q(r"Unter welchem Winkel in Grad ist die Ebene $y + z = 3$ gegen den Boden geneigt?", "45", "degrees(acos(1/sqrt(2)))", r"$\cos \alpha = \frac{1}{\sqrt{2}}$", "α ="),
               Q(r"Wie lang ist die Strecke von $A(1 \mid 1 \mid 1)$ nach $B(4 \mid 5 \mid 1)$?", "5", "sqrt(9+16)", r"$\sqrt{9 + 16} = 5$", "Länge")]),

    dict(file="abi-geometrie-lk", sheet="abitur-bgy-geometrie-lk", k=11, title="Geometrie im Leistungskurs", lb=ABI + "Analytische Geometrie", when=LK,
         sub="Walmdach, Kreuzprodukt, Winkel zwischen Gerade und Ebene, Ebenenschar",
         chips=["PFLICHTAUFGABE 2", "LEISTUNGSKURS"],
         lead=r"Im Leistungskurs wird der Körper schwerer und die Frage offener. Das Walmdach bringt Trapeze und Dreiecke, das Kreuzprodukt liefert ihre Flächen, und am Ende steht eine ganze Schar von Ebenen, die sich in einer Geraden treffen.",
         pruef=["Flächen mit dem Kreuzprodukt", "Winkel zwischen Gerade und Ebene", "Schnittpunkte und Teilverhältnisse",
                "Ebenenscharen und ihre gemeinsame Gerade"],
         hero={"widget": "raum-hero", "data-h": "240"},
         checkin=[Q(r"Wie groß ist die dritte Komponente von $(1, 0, 0) \times (0, 1, 0)$?", "1", "1*1-0", r"Das Kreuzprodukt ist $(0, 0, 1)$."),
                  Q(r"Wie lang ist der Vektor $(0, -24, 18)$?", "30", "sqrt(24**2+18**2)", r"$\sqrt{576 + 324} = 30$", "Länge"),
                  Q(r"Wie groß ist $\sin 30°$?", "0,5", "sin(radians(30))", r"$\frac{1}{2}$", "Wert")],
         merke=("MERKE · LEISTUNGSKURS",
                [r"**Kreuzprodukt:** $|\vec{a} \times \vec{b}|$ ist die Fläche des Parallelogramms, die Hälfte davon die des Dreiecks.",
                 r"**Gerade und Ebene:** $\sin \alpha = \dfrac{|\vec{u} \circ \vec{n}|}{|\vec{u}| \cdot |\vec{n}|}$, hier steht der Sinus.",
                 r"**Ebenenschar:** Enthält jede Ebene dieselbe Gerade, ordnest du nach $t$: Klammer und Rest sind beide null.",
                 r"**Trapez:** Ein Paar paralleler Seiten reicht. Beim Parallelogramm sind es zwei."]),
         widgets=[W("lot3d", "INTERAKTIV · LOT AUF EINE EBENE", r"Verändere Normalenvektor, Ebene und Punkt. Das Widget zeichnet das Lot und zeigt Lotfußpunkt und Abstand.")],
         repeat=[L("../mathe13lk/wp1-2.html", "LAGEBEZIEHUNGEN UND SCHNITTWINKEL", "Mathematik 13 LK · Kapitel W1.2"),
                 L("../mathe13lk/wp1-3.html", "ABSTÄNDE, PRISMEN, PYRAMIDEN", "Mathematik 13 LK · Kapitel W1.3")],
         kern=[r"Trapez und Dreiecke zerlegst du mit dem Kreuzprodukt.",
               r"Normalenvektor aus der Ebene, Richtungsvektor aus der Diagonale: Winkel mit dem Sinus, Schnittpunkt durch Einsetzen.",
               r"Nach $t$ sortieren zeigt die gemeinsame Gerade. Prüfe, ob wirklich jede Ebene der Schar vorkommt."],
         test=[Q(r"Ein Dreieck wird von $\vec{a} = (2, 0, 0)$ und $\vec{b} = (0, 3, 0)$ aufgespannt. Wie groß ist seine Fläche?", "3", "6/2", r"$|\vec{a} \times \vec{b}| = 6$, die Hälfte ist $3$.", "A ="),
               Q(r"Unter welchem Winkel in Grad trifft eine Gerade mit der Richtung $(0, 0, 1)$ die Ebene $z = 0$?", "90", "degrees(asin(1))", r"$\sin \alpha = 1$", "α ="),
               Q(r"Die Ebenen $E_t: t \cdot x + z = 2t + 1$ teilen eine Gerade. Welchen Wert hat $x$ auf ihr?", "2", "2", r"$t \cdot (x - 2) + z - 1 = 0$ gilt für jedes $t$ genau für $x = 2$, $z = 1$.", "x ="),
               Q(r"In welcher Ebene $E_t$ liegt $A(0 \mid 0 \mid 5)$?", "2", "(5-1)/2", r"$5 = 2t + 1$", "t =")]),

    dict(file="abi-matrizen", sheet="abitur-bgy-matrizen", k=12, title="Lineare Algebra", lb=ABI + "Lineare Algebra", when=GL,
         sub="Verflechtung, Rohstoffbedarf, Deckungsbeitrag, Gleichungssysteme ohne Lösung",
         chips=["PFLICHTAUFGABE 2", "MATRIZEN"],
         lead=r"Aus Rohstoffen werden Zwischenprodukte, aus Zwischenprodukten Endprodukte. Matrizen rechnen die ganze Fabrik in einem Schritt durch. Danach geht es ums Geld: Was kostet ein Stück, was bleibt übrig, und geht das Lager überhaupt auf?",
         pruef=["Matrizen aus dem Verflechtungsdiagramm ablesen", "Gesamtbedarf und Rohstoffbedarf berechnen",
                "Kosten, Deckungsbeitrag, Gewinn", "Überbestimmte Gleichungssysteme beurteilen"],
         hero={"svgfrom": "mathe13lk/wp2-2.html"},
         checkin=[Q(r"Wie groß ist die erste Komponente von $\begin{pmatrix}1 & 2\\3 & 4\end{pmatrix} \cdot \begin{pmatrix}1\\1\end{pmatrix}$?", "3", "1+2", r"$1 \cdot 1 + 2 \cdot 1 = 3$"),
                  Q(r"Wie viel kosten $3$ ME zu $2$ € und $4$ ME zu $1$ €, in Euro?", "10", "3*2+4*1", r"$6 + 4 = 10$", "Euro"),
                  Q(r"$x + y = 5$ und $x - y = 1$. Wie groß ist $x$?", "3", "6/2", r"Addieren: $2x = 6$", "x =")],
         merke=("MERKE · VERFLECHTUNG",
                [r"**Gesamtverflechtung:** $M_{RE} = M_{RZ} \cdot M_{ZE}$. Die Reihenfolge folgt dem Weg durch die Fabrik.",
                 r"**Bedarf:** $\vec{r} = M_{RE} \cdot \vec{e}$ für den Produktionsvektor $\vec{e}$.",
                 r"**Variable Kosten je Stück:** Rohstoffkosten, Fertigung der Zwischenprodukte und Fertigung der Endprodukte zusammen.",
                 r"**Deckungsbeitrag:** Erlös je Stück minus variable Kosten je Stück. **Gewinn:** Summe der Deckungsbeiträge minus Fixkosten.",
                 r"**Mehr Gleichungen als Unbekannte:** Zwei Gleichungen lösen und die Lösung in die restliche einsetzen."]),
         widgets=[W("matrixprodukt", "INTERAKTIV · ZEILE MAL SPALTE", r"Wähle die Typen und klicke ein Feld des Ergebnisses an: Die passende Zeile und Spalte leuchten auf. Vertausche die Reihenfolge und vergleiche."),
                  W("gauss", "INTERAKTIV · ZEILENUMFORMUNGEN", r"Wähle eine Umformung, die Zielzeile und den Faktor $k$ und führe sie aus. „Nächster Schritt“ schlägt eine sinnvolle Umformung vor.")],
         repeat=[L("../mathe11/lb4.html", "LINEARE GLEICHUNGSSYSTEME UND MATRIZEN", "Mathematik 11 · Kapitel 4"),
                 L("../mathe13lk/wp2-1.html", "MATRIZEN MULTIPLIZIEREN UND INVERTIEREN", "Mathematik 13 LK · Kapitel W2.1")],
         kern=[r"Spalten gehören zu dem, was hergestellt wird, Zeilen zu dem, was verbraucht wird.",
               r"Erst die Kosten je Stück, dann der Deckungsbeitrag, zuletzt die Fixkosten.",
               r"Drei Gleichungen, zwei Unbekannte: Die dritte Gleichung entscheidet, ob der Plan aufgeht."],
         test=[Q(r"Wie groß ist die erste Komponente von $\begin{pmatrix}2 & 1\\0 & 3\end{pmatrix} \cdot \begin{pmatrix}1\\2\end{pmatrix}$?", "4", "2+2", r"$2 \cdot 1 + 1 \cdot 2 = 4$"),
               Q(r"Ein Stück bringt $50$ € Erlös und hat $38$ € variable Kosten. Wie groß ist der Deckungsbeitrag in Euro?", "12", "50-38", r"$50 - 38 = 12$", "Euro"),
               Q(r"Bei $12$ € Deckungsbeitrag werden $100$ Stück verkauft, die Fixkosten sind $700$ €. Wie groß ist der Gewinn in Euro?", "500", "1200-700", r"$1200 - 700 = 500$", "Euro"),
               Q(r"$x + y = 3$, $x - y = 1$, $2x + y = c$. Für welches $c$ gibt es eine Lösung?", "5", "2*2+1", r"$x = 2$, $y = 1$ in die dritte Gleichung: $c = 5$.", "c =")]),

    dict(file="abi-leontief", sheet="abitur-bgy-leontief", k=13, title="Leontief-Modell", lb=ABI + "Lineare Algebra", when=LK,
         sub="Technologiematrix, Leontief-Inverse, Matrizen mit Parameter",
         chips=["PFLICHTAUFGABE 2", "LEISTUNGSKURS"],
         lead=r"Im Leontief-Modell beliefern sich die Sektoren einer Wirtschaft gegenseitig. Damit am Ende genug für den Konsum übrig bleibt, muss jeder Sektor mehr herstellen, als die Nachfrage zeigt. Wie viel mehr, verrät eine einzige Matrix.",
         pruef=["Technologiematrix aus der Tabelle bestimmen", "Endnachfrage und Produktion ineinander umrechnen",
                "Elemente der Leontief-Inverse deuten", "Determinante und Lösbarkeit bei Parametern"],
         hero={"svgfrom": "mathe13lk/wp2-1.html"},
         checkin=[Q(r"Wie groß ist $\det\begin{pmatrix}1 & 2\\3 & 4\end{pmatrix}$?", "-2", "4-6", r"$4 - 6 = -2$", "det ="),
                  Q(r"Es ist $a_{11} = 0{,}2$. Wie groß ist das Element oben links in $E - A$?", "0,8", "1-0.2", r"$1 - 0{,}2 = 0{,}8$"),
                  Q(r"Wie groß ist $1{,}25 \cdot 80$?", "100", "1.25*80", r"$100$")],
         merke=("MERKE · LEONTIEF",
                [r"**Technologiematrix:** $a_{ij} = \dfrac{x_{ij}}{x_j}$. Du teilst spaltenweise durch die Produktion des **empfangenden** Sektors.",
                 r"**Leontief-Gleichung:** $\vec{y} = (E - A) \cdot \vec{x}$ und damit $\vec{x} = (E - A)^{-1} \cdot \vec{y}$.",
                 r"**Leontief-Inverse:** $l_{ij}$ sagt, wie viel Sektor $i$ herstellen muss, damit Sektor $j$ eine ME mehr an den Konsum abgeben kann.",
                 r"**Determinante:** Ist $\det(A) \neq 0$, gibt es genau eine Lösung. Ist $\det(A) = 0$, gibt es keine oder unendlich viele."]),
         widgets=[W("leontief", "INTERAKTIV · EINE VOLKSWIRTSCHAFT MIT DREI SEKTOREN", r"Stelle die Endnachfrage ein. Das Widget berechnet die nötige Produktion mit der Leontief-Inverse und füllt die Input-Output-Tabelle."),
                  W("matrixinverse", "INTERAKTIV · GAUSS-JORDAN SCHRITT FÜR SCHRITT", r"Wähle eine Matrix und gehe Schritt für Schritt vor. Alle Brüche sind exakt. Bei der dritten Matrix siehst du, woran man eine nicht invertierbare Matrix erkennt.")],
         repeat=[L("../mathe13lk/wp2-1.html", "MATRIZEN MULTIPLIZIEREN UND INVERTIEREN", "Mathematik 13 LK · Kapitel W2.1"),
                 L("../mathe13lk/wp2-2.html", "VERFLECHTUNGEN UND DAS LEONTIEF-MODELL", "Mathematik 13 LK · Kapitel W2.2")],
         kern=[r"Jede Spalte der Tabelle teilst du durch die Gesamtproduktion dieses Sektors.",
               r"Die Inverse rechnet Nachfrage in Produktion um, ihre Zeilensummen zeigen die Wirkung von je einer ME mehr überall.",
               r"Determinante null heißt noch nicht unlösbar: Erst das Einsetzen entscheidet zwischen keiner und unendlich vielen Lösungen."],
         test=[Q(r"Sektor 1 liefert $50$ ME an Sektor 2, der insgesamt $100$ ME produziert. Wie groß ist $a_{12}$?", "0,5", "50/100", r"$a_{12} = \frac{50}{100}$", "a ="),
               Q(r"Es ist $(E - A)^{-1} = 2 \cdot E$ und $y_1 = 10$. Wie groß ist $x_1$?", "20", "2*10", r"$x_1 = 2 \cdot 10$", "x ="),
               Q(r"Für welches positive $k$ ist $\det\begin{pmatrix}k & 2\\2 & k\end{pmatrix} = 0$?", "2", "sqrt(4)", r"$k^2 - 4 = 0$", "k ="),
               Q(r"Wie groß ist die Determinante der Diagonalmatrix mit den Einträgen $2$, $3$ und $1$?", "6", "2*3*1", r"Bei einer Diagonalmatrix ist es das Produkt der Diagonale.", "det =")]),

    dict(file="abi-stochastik", sheet="abitur-bgy-stochastik", k=14, title="Stochastik", lb=ABI + "Stochastik", when=GL,
         sub="Vierfeldertafel, Unabhängigkeit, Binomialverteilung, Hypothesentest",
         chips=["PFLICHTAUFGABE 3", "AM BESTEN VORHERSAGBAR"],
         lead=r"Die Stochastikaufgabe läuft in fast jedem Jahrgang ähnlich ab: erst die Vierfeldertafel, dann die Unabhängigkeit, dann die Binomialverteilung und zum Schluss ein Test. Wer diese Reihenfolge kennt, weiß nach dem ersten Lesen, was kommt.",
         pruef=["Vierfeldertafel und bedingte Wahrscheinlichkeit", "Stochastische Unabhängigkeit prüfen",
                "Binomialverteilung: genau, höchstens, mindestens", "Einseitiger Hypothesentest mit Ablehnungsbereich"],
         hero={"widget": "histo-hero", "data-n": "12", "data-p": "0.25", "data-lo": "3", "data-hi": "3", "data-step": "1"},
         checkin=[Q(r"$P(A) = 0{,}6$ und $P(B) = 0{,}5$. Wie groß ist $P(A) \cdot P(B)$?", "0,3", "0.6*0.5", r"$0{,}6 \cdot 0{,}5 = 0{,}3$", "Wert"),
                  Q(r"$X \sim B(20;\, 0{,}25)$. Wie groß ist $\mu$?", "5", "20*0.25", r"$\mu = n \cdot p = 5$", "μ ="),
                  Q(r"Wie groß ist $\binom{4}{2}$?", "6", "comb(4,2)", r"$\frac{4 \cdot 3}{2} = 6$")],
         merke=("MERKE · STOCHASTIK",
                [r"**Bedingte Wahrscheinlichkeit:** $P_A(B) = \dfrac{P(A \cap B)}{P(A)}$.",
                 r"**Unabhängig:** $P(A \cap B) = P(A) \cdot P(B)$.",
                 r"**Binomialverteilung:** $P(X = k) = \binom{n}{k} \cdot p^k \cdot (1 - p)^{n - k}$ mit $\mu = n \cdot p$ und $\sigma = \sqrt{n \cdot p \cdot (1 - p)}$.",
                 r"**Linksseitiger Test:** Der Ablehnungsbereich ist $\{0, \ldots, k\}$ mit dem größten $k$, für das $P(X \leq k) \leq \alpha$ gilt."]),
         widgets=[W("vierfeld-trainer", "INTERAKTIV · VIERFELDERTAFELN ERGÄNZEN", r"Drei Werte stehen fest, ergänze die fehlenden Felder mit den Zeilen- und Spaltensummen. „Neue Tafel“ würfelt eine neue Aufgabe."),
                  W("binomial", "INTERAKTIV · DIE BINOMIALVERTEILUNG", r"Stelle $n$ und $p$ ein und wähle „genau“, „höchstens“, „mindestens“ oder „zwischen“. Die zugehörigen Säulen werden markiert, ihre Summe steht darunter.")],
         repeat=[L("../mathe12/lb1-1.html", "BEDINGTE WAHRSCHEINLICHKEIT", "Mathematik 12 · Kapitel 1.1"),
                 L("../mathe12/lb1-3.html", "DIE BINOMIALVERTEILUNG", "Mathematik 12 · Kapitel 1.3"),
                 L("../mathe13/lb4-2.html", "SIGNIFIKANZTESTS", "Mathematik 13 · Kapitel 4.2")],
         kern=[r"Tafel füllen, dann vergleichen: $P(S \cap G)$ gegen $P(S) \cdot P(G)$.",
               r"„Mindestens einer“ geht über das Gegenereignis, bei der gesuchten Anzahl hilft der Logarithmus.",
               r"Hypothese, Ablehnungsbereich, Entscheidung, Satz für den Veranstalter. Genau in dieser Reihenfolge."],
         test=[Q(r"$P(S) = 0{,}5$ und $P(S \cap G) = 0{,}2$. Wie groß ist $P_S(G)$?", "0,4", "0.2/0.5", r"$\frac{0{,}2}{0{,}5} = 0{,}4$", "P ="),
               Q(r"$X \sim B(16;\, 0{,}25)$. Wie groß ist $\sigma$? Runde auf zwei Stellen.", "1,73", "sqrt(16*0.25*0.75)", r"$\sqrt{3} \approx 1{,}73$", "σ =", "0.006"),
               Q(r"Wie groß ist die Wahrscheinlichkeit für mindestens einen Treffer bei $n = 2$ und $p = 0{,}5$?", "0,75", "1-0.5**2", r"$1 - 0{,}5^2 = 0{,}75$", "P ="),
               Q(r"Wie viele Lose mit $p = 0{,}25$ brauchst du mindestens für $P(X \geq 1) \geq 0{,}9$?", "9", "ceil(log(0.1)/log(0.75))", r"$0{,}75^n \leq 0{,}1$ gilt erst ab $n = 9$, denn $0{,}75^8 \approx 0{,}1001$.", "n =")]),

    dict(file="abi-erwartungswert", sheet="abitur-bgy-erwartungswert", k=15, title="Erwartungswert und faire Spiele", lb=ABI + "Stochastik", when=GL,
         sub="Verteilungen, Ziehen ohne Zurücklegen, Glücksrad, Terme deuten",
         chips=["STOCHASTIK", "OHNE BINOMIALVERTEILUNG"],
         lead=r"Nicht alles ist binomialverteilt. Sobald ohne Zurücklegen gezogen wird, ändern sich die Wahrscheinlichkeiten. Und beim Glücksrad stellt die Prüfung die Frage, die jeder Veranstalter stellt: Lohnt sich das, und für wen?",
         pruef=["Wahrscheinlichkeitsverteilung aufstellen", "Erwartungswert und Standardabweichung deuten",
                "Faire Spiele und Einsätze berechnen", "Terme einem Ereignis zuordnen"],
         hero={"widget": "histo-hero", "data-w": "5,15,9,1", "data-x0": "0", "data-lo": "1", "data-hi": "1", "data-step": "1"},
         checkin=[Q(r"Wie groß ist der Erwartungswert der Augenzahl eines Würfels?", "3,5", "21/6", r"$\frac{1 + 2 + \ldots + 6}{6} = 3{,}5$", "E ="),
                  Q(r"In einem Beutel liegen $5$ rote und $5$ blaue Kugeln. Wie groß ist $P(\text{rot})$?", "0,5", "5/10", r"$\frac{5}{10}$", "P ="),
                  Q(r"$3$ rote, $2$ blaue Kugeln, zweimal ziehen ohne Zurücklegen. Wie groß ist $P(\text{rot, rot})$?", "3/10", "3/5*2/4", r"$\frac{3}{5} \cdot \frac{2}{4} = \frac{3}{10}$", "P =")],
         merke=("MERKE · ZUFALLSGRÖSSEN",
                [r"**Erwartungswert:** $E(X) = \sum x_i \cdot P(X = x_i)$.",
                 r"**Varianz:** $V(X) = \sum (x_i - \mu)^2 \cdot P(X = x_i)$. **Standardabweichung:** $\sigma = \sqrt{V(X)}$.",
                 r"**Faires Spiel:** $E(G) = 0$, wobei $G$ der Gewinn ist, also Auszahlung minus Einsatz.",
                 r"**Viele Spiele:** Der zu erwartende Gewinn ist $n \cdot E(G)$, das Einzelspiel bleibt zufällig."]),
         widgets=[W("zufallsgroesse", "INTERAKTIV · ZUFALLSGRÖSSEN UND IHRE KENNZAHLEN", r"Wähle ein Beispiel. Spiele dann 10-, 100- oder 1000-mal und vergleiche den Mittelwert deiner Spiele mit dem Erwartungswert."),
                  W("fairesspiel", "INTERAKTIV · DAS SCHULFEST-SPIEL", "")],
         repeat=[L("../mathe12/lb1-2.html", "ZUFALLSGRÖSSEN", "Mathematik 12 · Kapitel 1.2"),
                 L("../mathegy10/lb2-2.html", "ERWARTUNGSWERT UND FAIRE SPIELE", "Mathematik GY 10 · Kapitel 2.2")],
         kern=[r"Baum zeichnen, Pfade zählen. Alle Wahrscheinlichkeiten zusammen müssen $1$ ergeben.",
               r"Gewinn ist Auszahlung minus Einsatz. Das Rad bestimmt nur, welche Auszahlung fällt.",
               r"Jeder Faktor im Term ist ein Spiel. Der Erwartungswert gilt auf lange Sicht, nie für ein einzelnes Spiel."],
         test=[Q(r"Ein Würfelspiel kostet $1$ €. Bei einer Sechs gibt es $a$ €, sonst nichts. Für welches $a$ ist das Spiel fair?", "6", "1/(1/6)", r"$\frac{a}{6} - 1 = 0$", "a ="),
               Q(r"$4$ rote, $6$ blaue Kugeln, zweimal ziehen ohne Zurücklegen. Wie groß ist $P(\text{rot, rot})$?", "2/15", "4/10*3/9", r"$\frac{4}{10} \cdot \frac{3}{9} = \frac{2}{15}$", "P ="),
               Q(r"Ein Rad zahlt mit $P = 0{,}25$ genau $4$ € aus, sonst nichts. Der Einsatz ist $2$ €. Wie groß ist $E(G)$ in Euro?", "-1", "0.25*4-2", r"$1 - 2 = -1$", "E(G) ="),
               Q(r"Bei $E(G) = -0{,}25$ € wird $400$-mal gespielt. Wie viel Euro nimmt der Veranstalter zu erwarten ein?", "100", "400*0.25", r"$400 \cdot 0{,}25 = 100$", "Euro")]),

    dict(file="abi-stochastik-lk", sheet="abitur-bgy-stochastik-lk", k=16, title="Stochastik im Leistungskurs", lb=ABI + "Stochastik", when=LK,
         sub="Mehrstufige Prüfungen, Bayes, Testen mit Fehlern 1. und 2. Art",
         chips=["PFLICHTAUFGABE 3", "LEISTUNGSKURS"],
         lead=r"Im Leistungskurs kommen die Fragen dazu, die auch in der Industrie gestellt werden: Woher stammt das defekte Teil? Wie oft irrt sich ein Test? Und wie viele Teile muss man prüfen, um sicher zu sein?",
         pruef=["Mehrstufige Vorgänge, genau eine und mindestens eine Beanstandung", "Der Satz von Bayes und die Rückwärtsfrage",
                "Mindestanzahl für eine Sicherheit", "Fehler 1. und 2. Art berechnen und deuten"],
         hero={"widget": "baum-hero"},
         checkin=[Q(r"Wie groß ist $0{,}9 \cdot 0{,}95$?", "0,855", "0.9*0.95", r"$0{,}855$"),
                  Q(r"Wie groß ist $1 - 0{,}855$?", "0,145", "1-0.855", r"$0{,}145$"),
                  Q(r"Wie groß ist $\sigma$ für $n = 200$ und $p = 0{,}85$? Runde auf zwei Stellen.", "5,05", "sqrt(200*0.85*0.15)", r"$\sqrt{25{,}5} \approx 5{,}05$", "σ =", "0.006")],
         merke=("MERKE · LEISTUNGSKURS",
                [r"**Mindestens einmal:** $P = 1 - P(\text{keinmal})$.",
                 r"**Bayes:** $P_B(A) = \dfrac{P(A) \cdot P_A(B)}{P(B)}$.",
                 r"**Fehler 1. Art:** $H_0$ stimmt und wird abgelehnt, seine Wahrscheinlichkeit ist höchstens $\alpha$.",
                 r"**Fehler 2. Art:** $H_0$ ist falsch und wird nicht abgelehnt. Für $\beta$ brauchst du das wahre $p$."]),
         widgets=[W("signifikanztest", "INTERAKTIV · DER SIGNIFIKANZTEST", r"Stelle $n$, $p_0$, die Richtung und $\alpha$ ein und lies den Ablehnungsbereich ab. Dann siehst du, wie groß die Fehler sind.")],
         repeat=[L("../mathe12lk/lb1-1.html", "BEDINGTE WAHRSCHEINLICHKEIT", "Mathematik 12 LK · Kapitel 1.1"),
                 L("../mathe13lk/lb5-2.html", "SIGNIFIKANZTESTS", "Mathematik 13 LK · Kapitel 5.2")],
         kern=[r"Alle Prüfungen bestehen ist ein einziger Pfad, die übrigen Fälle laufen über das Gegenereignis.",
               r"Die Rückwärtsfrage steht unter der Bedingung im Nenner: erst $P(\overline{S})$, dann der Anteil von Zulieferer 1.",
               r"Die Testrichtung folgt aus dem Verdacht. Der Ablehnungsbereich kommt aus $H_0$, der Fehler 2. Art aus dem wahren $p$."],
         test=[Q(r"Drei unabhängige Prüfungen werden je mit $0{,}9$ bestanden. Wie groß ist $P(\text{alle})$?", "0,729", "0.9**3", r"$0{,}9^3 = 0{,}729$", "P ="),
               Q(r"Wie groß ist die Wahrscheinlichkeit für mindestens eine Beanstandung?", "0,271", "1-0.9**3", r"$1 - 0{,}729 = 0{,}271$", "P ="),
               Q(r"Zulieferer 1 liefert $60\,\%$ mit $1\,\%$ Ausschuss, Zulieferer 2 den Rest mit $2\,\%$. Wie groß ist $P(\text{schadhaft})$?", "0,014", "0.6*0.01+0.4*0.02", r"$0{,}006 + 0{,}008 = 0{,}014$", "P ="),
               Q(r"Eine Zelle ist schadhaft. Wie groß ist die Wahrscheinlichkeit, dass sie von Zulieferer 2 stammt?", "4/7", "0.008/0.014", r"$\frac{0{,}008}{0{,}014} = \frac{4}{7}$", "P =", "0.005")]),

    dict(file="abi-simulation", sheet="abitur-bgy-simulation", k=17, title="Generalprobe Teil B", lb=ABI + "Generalprobe", when="Grundkurs",
         sub="Eine ganze Prüfung mit Zeit und Hilfsmitteln wie im Ernstfall: 25 + 15 + 15 BE",
         chips=["TEIL B", "55 BE", "155 MINUTEN"],
         lead=r"Jetzt zählt es: drei Pflichtaufgaben am Stück, wie im Abitur. Analysis 25 BE, Analytische Geometrie 15 BE, Stochastik 15 BE. Leg Formelsammlung und Rechner bereit, starte die Uhr und schau erst am Ende in die Lösungen.",
         pruef=["Alle drei Pflichtaufgaben in einem Durchgang", "Punkte in jeder Teilaufgabe, wie in der echten Prüfung",
                "Zeiteinteilung über die ganze Arbeit"],
         hero=G(["x^3-3*x^2-9*x+11"], "-3.5,5.5", "-20,20", [[-1, 16], [1, 0], [3, -16]], "Graph einer Funktion dritten Grades mit Hochpunkt, Wendepunkt und Tiefpunkt"),
         checkin=[Q(r"$255$ Minuten Gesamtzeit, Teil A dauert $100$ Minuten. Wie viele Minuten bleiben für Teil B?", "155", "255-100", r"$255 - 100 = 155$", "Minuten"),
                  Q(r"Wie viele BE hat dieser Teil B?", "55", "25+15+15", r"$25 + 15 + 15 = 55$", "BE"),
                  Q(r"Wie viele Minuten bleiben dir etwa je BE? Runde auf eine ganze Zahl.", "3", "155/55", r"$\frac{155}{55} \approx 2{,}8$, also knapp drei Minuten.", "Minuten", "0.5")],
         merke=("MERKE · SO GEHST DU VOR",
                [r"**Erst lesen:** Verschaffe dir einen Überblick über alle drei Aufgaben.",
                 r"**Sauber trennen:** Jede Aufgabe kommt auf einen eigenen Reinschriftbogen.",
                 r"**Ansatz hinschreiben:** Auch mit Rechner gehört der Weg dazu.",
                 r"**Festgefahren?** Teilaufgabe überspringen, ein möglichst sinnvolles Zwischenergebnis annehmen und weiterrechnen."]),
         widgets=[W("pruefungsuhr", "DEINE UHR · 155 MINUTEN", r"Starte die Uhr, wenn du beginnst. Sie läuft nur, solange diese Seite offen ist.", min=155)],
         kern=[r"Kurvenuntersuchung, Fläche und zum Schluss die Änderungsrate im Speicher.",
               r"Ein Normalenvektor beantwortet Ebene, Winkel und Abstand.",
               r"Vierfeldertafel, Unabhängigkeit, Binomialverteilung, Term deuten: die bekannte Reihenfolge."],
         test=[Q(r"Wie groß ist die Fläche unter $f(x) = x^2$ über $[0;\,3]$?", "9", "27/3", r"$\frac{27}{3} = 9$", "A ="),
               Q(r"Wie lang ist $(3, 0, 4)$?", "5", "sqrt(25)", r"$\sqrt{9 + 16} = 5$", "Länge"),
               Q(r"$P(E) = 0{,}6$, $P(R) = 0{,}25$. Wie groß ist $P(E \cap R)$ bei Unabhängigkeit?", "0,15", "0.6*0.25", r"$0{,}6 \cdot 0{,}25 = 0{,}15$", "P ="),
               Q(r"Wie viele Treffer erwartest du bei $n = 20$ und $p = 0{,}25$?", "5", "20*0.25", r"$\mu = 5$", "μ =")]),

    dict(file="blf-ueberblick", k=18, title="So ist die BLF gebaut", lb=BLF + "Überblick", when=K10,
         sub="90 Minuten, 45 BE, Teil A ohne Hilfsmittel, Teil B mit MMS, Notenskala", body=UEBERBLICK_BLF),

    dict(file="blf-teila", sheet="blf-gy-teila", k=19, title="Teil A, Satz 1", lb=BLF + "Teil A", when=K10,
         sub="Ankreuzen, Gerade und Kegel, Glücksrad ohne Rechner",
         chips=["TEIL A", "25 MINUTEN", "OHNE HILFSMITTEL"],
         lead=r"Die ersten 25 Minuten der BLF gehören dir allein, ohne Rechner und ohne Formelsammlung. Du löst direkt auf dem Aufgabenblatt. Potenzen, Einheiten, Prozent und Geraden sollten deshalb im Kopf sitzen.",
         pruef=["Sechs Ankreuzaufgaben mit je 1 BE", "Geradengleichungen und Pythagoras",
                "Rotationskörper ohne Rechner abschätzen", "Pfadregeln mit Brüchen"],
         hero=G(["-0.5*x+4"], "-3,9", "-1,6", [[-2, 5], [4, 2]], "Gerade durch zwei Punkte"),
         checkin=[Q(r"$a^3 \cdot a^2 = a^k$. Wie groß ist $k$?", "5", "3+2", r"Exponenten addieren.", "k ="),
                  Q(r"Wie viele Liter sind $1\ \mathrm{m}^3$?", "1000", "1000", r"$1\ \mathrm{m}^3 = 1000\ \mathrm{dm}^3 = 1000\ \ell$", "Liter"),
                  Q(r"Wie groß ist der Anstieg der Geraden durch $(0 \mid 1)$ und $(2 \mid 5)$?", "2", "4/2", r"$\frac{5 - 1}{2 - 0} = 2$", "m =")],
         merke=("MERKE · DAS SITZT OHNE RECHNER",
                [r"**Potenzen:** $a^m \cdot a^n = a^{m+n}$ und $\frac{a^m}{a^n} = a^{m-n}$.",
                 r"**Einheiten:** $1\ \mathrm{m}^3 = 1000\ \ell$ und $1\ \ell = 1\ \mathrm{dm}^3$.",
                 r"**Prozent:** Änderungen sind Faktoren. Erst $+10\,\%$, dann $-10\,\%$ ergibt $1{,}1 \cdot 0{,}9 = 0{,}99$.",
                 r"**Gerade:** $m = \frac{y_2 - y_1}{x_2 - x_1}$. **Kegel:** $V = \frac{1}{3} \pi r^2 h$.",
                 r"**Pfadregeln:** Längs eines Pfades multiplizieren, Pfade addieren."]),
         widgets=[W("gerade", "INTERAKTIV · EINE GERADE DURCH ZWEI PUNKTE", r"Zieh die beiden Punkte. Das grüne Dreieck zeigt $\Delta x$ und $\Delta y$, darunter stehen Steigung, y-Achsenabschnitt und Gleichung.")],
         repeat=[L("../mathegy9/lb1-1.html", "POTENZEN UND WURZELN", "Mathematik GY 9 · Kapitel 1.1"),
                 L("../mathegy9/lb3-3.html", "PYRAMIDE UND KREISKEGEL", "Mathematik GY 9 · Kapitel 3.3"),
                 L("../mathegy10/lb2-1.html", "ZUFALLSGRÖSSEN UND PFADREGELN", "Mathematik GY 10 · Kapitel 2.1")],
         kern=[r"Schritt für Schritt umformen und Falsches ausschließen. Prozent bleibt ein Faktor.",
               r"Erst die Gerade, daraus die Achsenschnittpunkte, dann Pythagoras und Kegel.",
               r"„Mindestens einmal“ läuft über das Gegenereignis, die Brüche bleiben Brüche."],
         test=[Q(r"$\frac{a^7 \cdot a^{-3}}{a^2} = a^k$. Wie groß ist $k$?", "2", "7-3-2", r"$7 - 3 - 2 = 2$", "k ="),
               Q(r"Ein Preis steigt um $20\,\%$ und sinkt danach um $20\,\%$. Mit welchem Faktor wird er multipliziert?", "0,96", "1.2*0.8", r"$1{,}2 \cdot 0{,}8 = 0{,}96$", "Faktor"),
               Q(r"Wie groß ist der Anstieg der Geraden durch $(0 \mid 2)$ und $(4 \mid 0)$?", "-0,5", "-2/4", r"$\frac{0 - 2}{4} = -0{,}5$", "m ="),
               Q(r"Ein Rad hat einen $90°$-Sektor. Wie groß ist die Wahrscheinlichkeit, ihn zweimal nacheinander zu treffen?", "1/16", "0.25**2", r"$\frac{1}{4} \cdot \frac{1}{4} = \frac{1}{16}$", "P =", "0.001")]),

    dict(file="blf-teila2", sheet="blf-gy-teila2", k=20, title="Teil A, Satz 2", lb=BLF + "Teil A", when=K10,
         sub="Trigonometrie, Kreis und Thales, Gleichungen ohne Rechner",
         chips=["TEIL A", "25 MINUTEN", "OHNE HILFSMITTEL"],
         lead=r"Der zweite Satz bringt die Themen, die im ersten fehlen: Sinus und Kosinus, Kreis und Sektor, Gleichungen mit Parameter. Rechne ihn an einem anderen Tag, wieder mit Wecker auf 25 Minuten.",
         pruef=["Sinus und Kosinus im rechtwinkligen Dreieck", "Kreis, Sektor und Bogen", "Formeln umstellen",
                "Anzahl der Lösungen einer quadratischen Gleichung"],
         hero={"widget": "dreieck-hero", "data-aria": "Allgemeines Dreieck mit der Höhe auf die Seite c"},
         checkin=[Q(r"Wie groß ist $\sin 30°$?", "0,5", "sin(radians(30))", r"$\frac{1}{2}$", "Wert"),
                  Q(r"Wie groß ist $\sqrt{3^2 + 4^2}$?", "5", "sqrt(25)", r"$\sqrt{25} = 5$"),
                  Q(r"$x^2 = 16$. Wie groß ist die positive Lösung?", "4", "4", r"$x = \pm 4$", "x =")],
         merke=("MERKE · KREIS, WINKEL, GLEICHUNGEN",
                [r"**Rechtwinkliges Dreieck:** $\sin \alpha = \frac{\text{Gegenkathete}}{\text{Hypotenuse}}$ und $\cos \alpha = \frac{\text{Ankathete}}{\text{Hypotenuse}}$.",
                 r"**Sektor:** $A = \pi r^2 \cdot \frac{\alpha}{360°}$. **Bogen:** $b = 2\pi r \cdot \frac{\alpha}{360°}$.",
                 r"**Thales:** Ein Winkel von $90°$ auf dem Kreis steht über einem Durchmesser.",
                 r"**Anzahl der Lösungen:** Bei $x^2 + px + q = 0$ entscheidet das Vorzeichen von $\left(\frac{p}{2}\right)^2 - q$."]),
         widgets=[W("trigo", "INTERAKTIV · SINUS, KOSINUS, TANGENS", r"Verändere den Winkel und beobachte, wie sich die drei Seitenverhältnisse ändern. Bei welchem Winkel sind Gegenkathete und Ankathete gleich lang?")],
         repeat=[L("../mathegy9/lb3-2.html", "TRIGONOMETRIE IM RECHTWINKLIGEN DREIECK", "Mathematik GY 9 · Kapitel 3.2"),
                 L("../mathegy9/lb2.html", "KREIS, ZYLINDER UND KUGEL", "Mathematik GY 9 · Kapitel 2"),
                 L("../mathegy9/lb1-4.html", "QUADRATISCHE GLEICHUNGEN", "Mathematik GY 9 · Kapitel 1.4")],
         kern=[r"Beim Gleichungssystem erfüllt jede falsche Antwort eine der Gleichungen. Prüfe immer beide.",
               r"Radius aus Pythagoras, Orthogonalität aus dem Skalarprodukt oder den Anstiegen, dann der Sektor als Viertelkreis.",
               r"Bei „keine Lösung“ entscheidet der Term unter der Wurzel."],
         test=[Q(r"Wie groß ist der größte Wert von $3 \cdot \sin x + 2$?", "5", "3+2", r"$3 + 2 = 5$", "y ="),
               Q(r"Ein Viertelkreis hat den Radius $6$. Seine Fläche ist $k \cdot \pi$. Wie groß ist $k$?", "9", "36/4", r"$\frac{36\pi}{4} = 9\pi$", "k ="),
               Q(r"$x = 2$ löst $x^2 + p \cdot x - 6 = 0$. Wie groß ist $p$?", "1", "(6-4)/2", r"$4 + 2p - 6 = 0$", "p ="),
               Q(r"Für welches $c$ hat $x^2 - 4x + c = 0$ genau eine Lösung?", "4", "2**2", r"$\left(\frac{4}{2}\right)^2 - c = 0$", "c =")]),

    dict(file="blf-funktionen", sheet="blf-gy-funktionen", k=21, title="Funktionen", lb=BLF + "Teil B", when=K10,
         sub="Parabeln verschieben, Potenzfunktion mit Polstelle, der Springbrunnen",
         chips=["TEIL B", "AUFGABE 1", "MIT MMS"],
         lead=r"Aufgabe 1 in Teil B ist fast immer eine Funktion. Am häufigsten eine Parabel, oft auch eine Potenzfunktion mit Polstelle. Du rechnest mit dem MMS, aber der Weg muss trotzdem erkennbar sein.",
         pruef=["Nullstellen, Scheitelpunkt, Wertebereich", "Verschieben und die neue Gleichung angeben",
                "Gemeinsame Punkte zweier Graphen, Abstand zweier Punkte", "Sachaufgaben mit Parabeln deuten"],
         hero=G(["-0.4*x^2+2*x+0.5"], "-0.5,6", "-0.5,3.6", [[2.5, 3]], "Parabel eines Wasserstrahls mit ihrem Scheitel", "x", "h"),
         checkin=[Q(r"Wo liegt der Scheitel von $y = (x - 2)^2 + 1$? Gib die $x$-Koordinate an.", "2", "2", r"$S(2 \mid 1)$", "x ="),
                  Q(r"Wie groß ist die positive Nullstelle von $x^2 - 9$?", "3", "3", r"$x^2 = 9$", "x ="),
                  Q(r"Wie groß ist der Abstand von $(0 \mid 0)$ und $(3 \mid 4)$?", "5", "5", r"$\sqrt{9 + 16} = 5$", "d =")],
         merke=("MERKE · FUNKTIONEN",
                [r"**Scheitelform:** $f(x) = a \cdot (x - d)^2 + e$ hat den Scheitel $S(d \mid e)$.",
                 r"**Verschieben:** Um $3$ nach links: $x$ durch $x + 3$ ersetzen. Um $2$ nach oben: $+2$ anhängen.",
                 r"**Polstelle:** Dort wird der Nenner null, die Stelle gehört nicht zum Definitionsbereich.",
                 r"**Abstand:** $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$."]),
         widgets=[W("parabel", "INTERAKTIV · PARABEL-WERKSTATT", r"Zieh den Scheitel oder nutze die Regler. Die gestrichelte Kurve ist die Normalparabel $y = x^2$."),
                  W("potenzfunktion", "INTERAKTIV · POTENZFUNKTIONEN", r"Wähle einen Exponenten. Mit „Verwandte zeigen“ erscheinen die Graphen mit derselben Art von Exponent dazu.")],
         repeat=[L("../mathegy9/lb1-2.html", "POTENZFUNKTIONEN", "Mathematik GY 9 · Kapitel 1.2"),
                 L("../mathegy9/lb1-3.html", "PARAMETER UND QUADRATISCHE FUNKTIONEN", "Mathematik GY 9 · Kapitel 1.3"),
                 L("../mathegy10/lb4-4.html", "FUNKTIONEN IM ÜBERBLICK", "Mathematik GY 10 · Kapitel 4.4")],
         kern=[r"Quadratisch ergänzen liefert die Scheitelform, aus ihr liest du alles ab.",
               r"Polstelle und Asymptote stehen in der Funktionsgleichung. Für Schnittpunkte setzt du gleich.",
               r"Scheitel ist die größte Höhe, Nullstelle der Auftreffpunkt. Immer mit Einheit antworten."],
         test=[Q(r"$f(x) = x^2 - 4x + 3$. Wie groß ist die $x$-Koordinate des Scheitels?", "2", "4/2", r"$f(x) = (x - 2)^2 - 1$", "x ="),
               Q(r"Wie groß ist der kleinste Funktionswert von $f(x) = x^2 - 4x + 3$?", "-1", "4-8+3", r"$f(2) = -1$", "y ="),
               Q(r"Wo liegt die Polstelle von $\frac{1}{(x + 3)^2}$?", "-3", "-3", r"Der Nenner wird null für $x = -3$.", "x ="),
               Q(r"$h(x) = -0{,}5x^2 + 2x$. Wie groß ist die größte Höhe?", "2", "-0.5*4+4", r"Scheitel bei $x = 2$: $h(2) = -2 + 4 = 2$", "h =")]),

    dict(file="blf-wachstum", sheet="blf-gy-wachstum", k=22, title="Wachstum und periodische Vorgänge", lb=BLF + "Teil B", when=K10,
         sub="Exponentialfunktionen, Riesenrad, abkühlender Tee",
         chips=["TEIL B", "MIT MMS"],
         lead=r"Algen wachsen, ein Riesenrad dreht sich, der Tee wird kalt. Exponentialfunktionen und Sinus tauchen in der BLF fast immer in solchen Sachaufgaben auf. Hier lernst du, die Zahlen im Funktionsterm zu lesen.",
         pruef=["Wachstumsfaktor und Prozentsatz deuten", "Zeitpunkte über Logarithmen bestimmen",
                "Periodische Vorgänge: Höhe, Periode, Zeitspannen", "Mittlere Änderung berechnen und deuten"],
         hero=G(["20-18*cos(3.14159*x/6)"], "-0.5,12.5", "-2,42", [[6, 38]], "Höhe einer Gondel im Riesenrad über eine Umdrehung", "t", "h"),
         checkin=[Q(r"$A(t) = 4 \cdot 1{,}35^t$. Um wie viel Prozent wächst $A$ pro Schritt?", "35", "(1.35-1)*100", r"Der Faktor $1{,}35$ bedeutet $+35\,\%$.", "Prozent"),
                  Q(r"Wie groß ist $\cos 0°$?", "1", "cos(0)", r"$1$", "Wert"),
                  Q(r"Welche Zahl $x$ löst $2^x = 8$?", "3", "log2(8)", r"$2^3 = 8$", "x =")],
         merke=("MERKE · WACHSTUM UND SCHWINGUNG",
                [r"**Exponentiell:** $A(t) = A_0 \cdot q^t$. Der Faktor $q = 1 + \frac{p}{100}$ gehört zum Prozentsatz $p$.",
                 r"**Logarithmus:** Aus $q^t = b$ folgt $t = \frac{\lg b}{\lg q}$.",
                 r"**Verdopplungszeit:** $q^t = 2$, sie hängt nicht vom Anfangswert ab.",
                 r"**Periodisch:** $h(t) = d - a \cdot \cos(b \cdot t)$ schwankt zwischen $d - a$ und $d + a$ mit der Periode $\frac{2\pi}{b}$."]),
         widgets=[W("wachstumsmodell", "INTERAKTIV · VIER WACHSTUMSMODELLE", r"Wähle ein Modell und verändere Anfangsbestand, Parameter und Schranke. Die Punkte sind die Bestände nach jedem Schritt."),
                  W("sinus", "INTERAKTIV · SINUS-WERKSTATT", r"Verändere die vier Parameter einzeln und beobachte, was mit der Kurve passiert. Gestrichelt: $\sin x$.")],
         repeat=[L("../mathegy10/lb1-1.html", "WACHSTUM UND EXPONENTIALFUNKTIONEN", "Mathematik GY 10 · Kapitel 1.1"),
                 L("../mathegy10/lb1-2.html", "PERIODISCHE VORGÄNGE", "Mathematik GY 10 · Kapitel 1.2"),
                 L("../mathegy10/lb4-2.html", "LOGARITHMUSFUNKTIONEN", "Mathematik GY 10 · Kapitel 4.2")],
         kern=[r"Der Faktor enthält den Prozentsatz, der Logarithmus holt die Zeit aus dem Exponenten.",
               r"Mitte plus oder minus Amplitude ergibt die Grenzen. Die Periode kommt aus dem Faktor vor $t$.",
               r"Die $20$ ist die Raumtemperatur: Nur der Unterschied zur Raumtemperatur fällt exponentiell."],
         test=[Q(r"$A(t) = 5 \cdot 2^t$. Wie groß ist $A(3)$?", "40", "5*8", r"$5 \cdot 8 = 40$", "A ="),
               Q(r"Nach wie vielen Schritten verdoppelt sich $q = 1{,}1$? Runde auf eine Stelle.", "7,3", "log(2)/log(1.1)", r"$t = \frac{\lg 2}{\lg 1{,}1} \approx 7{,}3$", "t =", "0.05"),
               Q(r"$h(t) = 15 - 12 \cdot \cos(t)$. Wie groß ist die größte Höhe?", "27", "15+12", r"$15 + 12 = 27$", "h ="),
               Q(r"Ein Rad braucht $8$ Minuten je Umdrehung. Wie groß ist seine Periode in Minuten?", "8", "8", r"Die Periode ist die Zeit für eine Umdrehung.", "p =")]),

    dict(file="blf-trigonometrie", sheet="blf-gy-trigonometrie", k=23, title="Trigonometrie", lb=BLF + "Teil B", when=K10,
         sub="Sinussatz, Kosinussatz, Flächeninhalt, Peilen und Fotografieren",
         chips=["TEIL B", "AUFGABE 2 ODER 3", "MIT MMS"],
         lead=r"Wie weit ist die Boje vom Ufer entfernt, und passt der Turm aufs Foto? Trigonometrie misst, was man nicht betreten kann. In der BLF zählt vor allem die richtige Wahl des Satzes und eine saubere Skizze.",
         pruef=["Sinussatz und Kosinussatz im allgemeinen Dreieck", "Flächeninhalt aus zwei Seiten und dem Winkel",
                "Vermessen mit Peilungen", "Winkel im Sachzusammenhang begründen"],
         hero={"widget": "dreieck-hero", "data-motiv": "vermessung", "data-aria": "Vermessung: eine Standlinie AB und die Winkel zur Spitze eines Turms"},
         checkin=[Q(r"Wie groß ist die Winkelsumme im Dreieck in Grad?", "180", "180", r"$180°$", "Grad"),
                  Q(r"Wie groß ist $\cos 60°$?", "0,5", "cos(radians(60))", r"$\frac{1}{2}$", "Wert"),
                  Q(r"$\alpha = 52°$ und $\beta = 71°$. Wie groß ist $\gamma$ in Grad?", "57", "180-52-71", r"$180° - 123° = 57°$", "γ =")],
         merke=("MERKE · DREIECKE",
                [r"**Sinussatz:** $\frac{a}{\sin \alpha} = \frac{b}{\sin \beta} = \frac{c}{\sin \gamma}$. Du brauchst ein Paar aus Seite und Gegenwinkel.",
                 r"**Kosinussatz:** $c^2 = a^2 + b^2 - 2ab \cdot \cos \gamma$. Du brauchst zwei Seiten und den Winkel dazwischen, oder alle drei Seiten.",
                 r"**Fläche:** $A = \frac{1}{2} \cdot a \cdot b \cdot \sin \gamma$.",
                 r"**Rechne nicht mit gerundeten Zwischenwerten**, sonst stimmt die letzte Stelle nicht mehr."]),
         widgets=[W("dreieckloeser", "INTERAKTIV · DER DREIECKSLÖSER", r"Wähle, was gegeben ist, und stell die Werte ein. Der Löser zeigt jeden Schritt mit dem passenden Satz und zeichnet das Dreieck, bei SSW auch ein zweites.")],
         repeat=[L("../mathegy10/lb3-1.html", "SINUSSATZ, KOSINUSSATZ, FLÄCHENINHALT", "Mathematik GY 10 · Kapitel 3.1"),
                 L("../mathegy10/lb3-2.html", "BERECHNUNGEN AN DREIECKEN UND KÖRPERN", "Mathematik GY 10 · Kapitel 3.2")],
         kern=[r"Zwei Seiten und der Winkel dazwischen: erst Kosinussatz, dann Sinussatz für die Winkel.",
               r"Die Grundlinie mit zwei Winkeln: Dritter Winkel, Sinussatz, dann die Höhe im rechtwinkligen Teildreieck.",
               r"Skizze mit Waagerechter durch die Kamera. Der Winkel wird von dort nach oben und unten gemessen."],
         test=[Q(r"Im Dreieck sind $a = 3$, $b = 4$ und $\gamma = 90°$. Wie groß ist $c$?", "5", "sqrt(25)", r"$c^2 = 9 + 16 - 0$", "c ="),
               Q(r"Es sind $a = 8$, $b = 3$ und $\gamma = 60°$. Wie groß ist $c$?", "7", "sqrt(64+9-24)", r"$c^2 = 64 + 9 - 24 = 49$", "c ="),
               Q(r"Wie groß ist die Fläche für $a = 6$, $b = 5$ und $\gamma = 30°$?", "7,5", "0.5*6*5*sin(radians(30))", r"$\frac{1}{2} \cdot 30 \cdot \frac{1}{2} = 7{,}5$", "A ="),
               Q(r"Ein Turm ist $30$ m entfernt, seine Spitze liegt $30$ m über dem Auge. Unter welchem Winkel in Grad erscheint sie?", "45", "degrees(atan(1))", r"$\tan \alpha = 1$", "α =")]),

    dict(file="blf-koerper", sheet="blf-gy-koerper", k=24, title="Körper und Flächen", lb=BLF + "Teil B", when=K10,
         sub="Gewächshaus, Glasdach, Eiswaffel: Volumen, Oberfläche, Vergleich",
         chips=["TEIL B", "MIT FORMELSAMMLUNG"],
         lead=r"Ein Gewächshaus, ein Glasdach, eine Eiswaffel: Körper sind in der BLF fast immer aus Alltagsdingen zusammengesetzt. Zerlege den Körper, such das rechtwinklige Dreieck und entscheide, ob das Ergebnis passt.",
         pruef=["Zusammengesetzte Querschnitte und Prismen", "Pyramide: Höhe aus der Seitenkante, Mantelfläche",
                "Kegel und Kugel vergleichen", "Auf- und Abrunden im Sachzusammenhang"],
         hero={"widget": "spitzkoerper", "data-hero": ""},
         checkin=[Q(r"Wie groß ist die Fläche eines Halbkreises mit $r = 2$? Gib $k$ in $k \cdot \pi$ an.", "2", "4/2", r"$\frac{1}{2} \cdot \pi \cdot 4 = 2\pi$", "k ="),
                  Q(r"Ein Quader ist $2$, $3$ und $4$ lang. Wie groß ist sein Volumen?", "24", "2*3*4", r"$2 \cdot 3 \cdot 4$", "V ="),
                  Q(r"Wie groß ist die Höhe im gleichseitigen Dreieck mit $a = 2$? Runde auf zwei Stellen.", "1,73", "sqrt(3)", r"$\sqrt{4 - 1} = \sqrt{3}$", "h =", "0.006")],
         merke=("MERKE · KÖRPER",
                [r"**Prisma:** $V = G \cdot h$. **Pyramide und Kegel:** $V = \frac{1}{3} \cdot G \cdot h$.",
                 r"**Kugel:** $V = \frac{4}{3} \pi r^3$. **Kegelmantel:** $M = \pi \cdot r \cdot s$.",
                 r"**Im Körper Pythagoras suchen:** Höhe, halbe Diagonale und Seitenkante bilden ein rechtwinkliges Dreieck.",
                 r"**Aufrunden:** Bei Rollen, Dosen oder Bussen zählt die nächste ganze Zahl, auch wenn sonst abgerundet würde."]),
         widgets=[W("spitzkoerper", "INTERAKTIV · PYRAMIDE UND KEGEL", r"Spitzkörper im Vergleich: Grundfläche, Höhe, Mantel und Volumen."),
                  W("pyramidekegel", "INTERAKTIV · DAS DREIECK IM KEGEL", r"Verändere Radius und Höhe. Höhe, Radius und Mantellinie bilden immer ein rechtwinkliges Dreieck.")],
         repeat=[L("../mathegy9/lb2.html", "KREIS, ZYLINDER UND KUGEL", "Mathematik GY 9 · Kapitel 2"),
                 L("../mathegy9/lb3-3.html", "PYRAMIDE UND KREISKEGEL", "Mathematik GY 9 · Kapitel 3.3")],
         kern=[r"Querschnitt zerlegen: Rechteck plus Halbkreis. Die Länge macht daraus das Volumen.",
               r"Erst die Diagonale des Bodens, dann Pythagoras für die Höhe.",
               r"Gleiche Volumina zu vergleichen geht ohne Rechner. Beim halben Eis steht das Volumen in der dritten Potenz der Höhe."],
         test=[Q(r"Ein Prisma hat den Querschnitt $10$ m² und ist $12$ m lang. Wie groß ist sein Volumen in m³?", "120", "10*12", r"$10 \cdot 12 = 120$", "V ="),
               Q(r"Eine Pyramide hat $G = 36$ und $h = 5$. Wie groß ist $V$?", "60", "36*5/3", r"$\frac{1}{3} \cdot 36 \cdot 5 = 60$", "V ="),
               Q(r"Eine Kugel hat $r = 3$. Das Volumen ist $k \cdot \pi$. Wie groß ist $k$?", "36", "4/3*27", r"$\frac{4}{3} \cdot 27 = 36$", "k ="),
               Q(r"Du brauchst $113$ m² Folie, eine Rolle hat $50$ m². Wie viele Rollen kaufst du?", "3", "ceil(113/50)", r"$2{,}26$ wird aufgerundet.", "Rollen")]),

    dict(file="blf-stochastik", sheet="blf-gy-stochastik", k=25, title="Daten und Zufall", lb=BLF + "Teil B", when=K10,
         sub="Kreisdiagramm, gewichtetes Mittel, Ziehen ohne Zurücklegen, faire Spiele",
         chips=["TEIL B", "AUFGABE 2", "MIT MMS"],
         lead=r"Wie kommst du zur Schule? Aus solchen Umfragen werden Kreisdiagramme und Mittelwerte. Dazu kommen Beutel, Kugeln und Würfelspiele. Die Frage dahinter ist oft dieselbe: Ist das Spiel fair?",
         pruef=["Relative Häufigkeiten und Kreisdiagramm", "Gewichtetes arithmetisches Mittel",
                "Ziehen mit und ohne Zurücklegen", "Erwartungswert und faire Spiele"],
         hero={"widget": "histo-hero", "data-n": "10", "data-p": "0.5", "data-lo": "5", "data-hi": "5", "data-step": "1"},
         checkin=[Q(r"$7$ von $28$ fahren Bus. Wie groß ist die relative Häufigkeit?", "0,25", "7/28", r"$\frac{7}{28} = \frac{1}{4}$", "h ="),
                  Q(r"Welcher Winkel gehört im Kreisdiagramm zu $25\,\%$, in Grad?", "90", "0.25*360", r"$0{,}25 \cdot 360° = 90°$", "Grad"),
                  Q(r"Wie groß ist die Wahrscheinlichkeit für einen Pasch bei zwei Würfeln?", "1/6", "6/36", r"$\frac{6}{36}$", "P =")],
         merke=("MERKE · DATEN UND ZUFALL",
                [r"**Winkel im Kreisdiagramm:** relative Häufigkeit mal $360°$.",
                 r"**Gewichtetes Mittel:** Jeder Wert zählt so oft, wie er vorkommt: $\overline{x} = \frac{\sum h_i \cdot x_i}{\sum h_i}$.",
                 r"**Ohne Zurücklegen:** Der Beutel wird kleiner, der Nenner sinkt beim zweiten Zug um eins.",
                 r"**Fair:** $E(G) = 0$ für den Gewinn $G$, also Auszahlung minus Einsatz."]),
         widgets=[W("mittelwerte", "INTERAKTIV · DREI MITTELWERTE", r"Zieh die Punkte und schalte den Ausreißer dazu. Welcher Wert bewegt sich stark, welcher kaum?"),
                  W("fairesspiel", "INTERAKTIV · DAS SCHULFEST-SPIEL", "")],
         repeat=[L("../mathegy9/lb4.html", "DATEN AUSWERTEN", "Mathematik GY 9 · Kapitel 4"),
                 L("../mathegy10/lb2-1.html", "ZUFALLSGRÖSSEN UND PFADREGELN", "Mathematik GY 10 · Kapitel 2.1"),
                 L("../mathegy10/lb2-2.html", "ERWARTUNGSWERT UND FAIRE SPIELE", "Mathematik GY 10 · Kapitel 2.2")],
         kern=[r"Relative Häufigkeiten ergeben zusammen immer $1$. Beim Mittel zählt jede Gruppe mit ihrer Größe.",
               r"Baum mit kleiner werdendem Nenner. Mit Zurücklegen bleibt der Anteil gleich und ist darum größer.",
               r"Erst alle Fälle zählen, dann $E(G)$ berechnen. Fair heißt null, nicht „fühlt sich gerecht an“."],
         test=[Q(r"$14$ von $28$ fahren Rad. Welcher Winkel gehört dazu, in Grad?", "180", "14/28*360", r"$\frac{1}{2} \cdot 360°$", "Grad"),
               Q(r"$10$ Personen brauchen $6$ Minuten, $30$ Personen $10$ Minuten. Wie groß ist das Mittel?", "9", "(60+300)/40", r"$\frac{60 + 300}{40} = 9$", "Minuten"),
               Q(r"$4$ rote, $2$ blaue Kugeln, zweimal ohne Zurücklegen. Wie groß ist $P(\text{rot, rot})$?", "2/5", "4/6*3/5", r"$\frac{4}{6} \cdot \frac{3}{5} = \frac{2}{5}$", "P ="),
               Q(r"Einsatz $1$ €, bei einem Pasch gibt es $a$ €, sonst nichts. Für welches $a$ ist das Spiel fair?", "6", "1/(1/6)", r"$\frac{a}{6} - 1 = 0$", "a =")]),

    dict(file="blf-simulation", sheet="blf-gy-simulation", k=26, title="Generalprobe Teil B", lb=BLF + "Generalprobe", when=K10,
         sub="Teil B mit Zeit und Hilfsmitteln wie im Ernstfall: 10 + 6 + 14 BE",
         chips=["TEIL B", "30 BE", "65 MINUTEN"],
         lead=r"Drei Aufgaben, 30 BE, rund 65 Minuten: Das ist Teil B der BLF. Leg MMS und Formelsammlung bereit, starte die Uhr und schau erst am Ende in die Lösungen.",
         pruef=["Alle drei Aufgaben in einem Durchgang", "Punkte in jeder Teilaufgabe, wie in der echten Prüfung",
                "Eine lange Sachaufgabe quer durch alle Gebiete"],
         hero=G(["x^2-6*x+5", "-((x-4)^2)+1"], "-0.5,7", "-4.5,6", [[2, -3], [5, 0]], "Zwei Parabeln, die sich in zwei Punkten schneiden"),
         checkin=[Q(r"$90$ Minuten Gesamtzeit, Teil A dauert $25$ Minuten. Wie viele Minuten bleiben für Teil B?", "65", "90-25", r"$90 - 25 = 65$", "Minuten"),
                  Q(r"Wie viele BE hat Teil B?", "30", "10+6+14", r"$10 + 6 + 14 = 30$", "BE"),
                  Q(r"Wie viele Minuten hast du je BE? Runde auf zwei Stellen.", "2,17", "65/30", r"$\frac{65}{30} \approx 2{,}17$", "Minuten", "0.006")],
         merke=("MERKE · SO GEHST DU VOR",
                [r"**Erst lesen:** Verschaffe dir einen Überblick über alle drei Aufgaben.",
                 r"**Rechenweg zeigen:** Auch mit dem MMS muss erkennbar sein, was du gerechnet hast.",
                 r"**Näherungswerte:** Ein richtiger Näherungswert bringt auch dort die volle Punktzahl, wo ein exakter Wert erwartet wird.",
                 r"**Einheiten:** Antworte im Sachzusammenhang, mit Einheit und sinnvoll gerundet."]),
         widgets=[W("pruefungsuhr", "DEINE UHR · 65 MINUTEN", r"Starte die Uhr, wenn du beginnst. Sie läuft nur, solange diese Seite offen ist.", min=65)],
         kern=[r"Nullstellen, Wertebereich, dann die Gerade durch die Schnittpunkte.",
               r"Kosinussatz, Flächenformel und ein Baum: zwei kurze Aufgaben, die nichts miteinander zu tun haben.",
               r"Prozent, Winkel, Volumen, Exponentialfunktion: quer durch alles, wie in jeder BLF."],
         test=[Q(r"Wie groß ist die kleinere Nullstelle von $x^2 - 6x + 5$?", "1", "(6-4)/2", r"$(x - 1)(x - 5) = 0$", "x ="),
               Q(r"$20\,\%$ von $35\,\%$ von $1000$ Gästen haben eine Jahreskarte. Wie viele sind das?", "70", "1000*0.35*0.2", r"$1000 \cdot 0{,}35 \cdot 0{,}2 = 70$", "Gäste"),
               Q(r"Eine Rutsche fällt $5$ m auf $5$ m waagerechter Strecke. Wie groß ist ihr Neigungswinkel in Grad?", "45", "degrees(atan(1))", r"$\tan \alpha = 1$", "α ="),
               Q(r"$C(t) = 0{,}6 \cdot 0{,}85^t$. Wie groß ist $C(0)$?", "0,6", "0.6", r"$0{,}85^0 = 1$", "C =")]),

    dict(file="va-ueberblick", k=27, title="So ist die Vergleichsarbeit gebaut", lb=VA + "Überblick", when=K11,
         sub="90 Minuten, 45 BE, Teil A ohne Hilfsmittel, Teil B mit MMS, Notenskala", body=UEBERBLICK_VA),

    dict(file="va-teila", sheet="va-bgy11-teila", k=28, title="Teil A, Satz 1", lb=VA + "Teil A", when=K11,
         sub="Ankreuzen, zwei parallele Geraden und eine Raute, die Tombola ohne Zurücklegen",
         chips=["TEIL A", "25 MINUTEN", "OHNE HILFSMITTEL"],
         lead=r"Die ersten 25 Minuten der Vergleichsarbeit schreibst du ohne Rechner und ohne Formelsammlung, direkt auf dem Aufgabenblatt. Danach wird Teil A eingesammelt. Prozent, Wurzeln, Geraden und Bäume müssen deshalb im Kopf sitzen.",
         pruef=["Sechs Ankreuzaufgaben mit je 1 BE", "Geraden durch zwei Punkte, Parallelen, Flächen im Koordinatensystem",
                "Prozent und Größen im Kopf", "Ein Baum ohne Zurücklegen, auch rückwärts gelesen"],
         hero=G(["0.5*x+2", "0.5*x-2"], "-5.5,5.5", "-3.5,3.5", [[-4, 0], [0, 2], [4, 0], [0, -2]], "Zwei parallele Geraden, ihre Achsenschnittpunkte bilden eine Raute"),
         checkin=[Q(r"Um wie viel Prozent sinkt ein Wert von $50$ auf $40$?", "20", "(50-40)/50*100", r"Die Änderung $10$ bezieht sich auf den alten Wert: $\frac{10}{50} = 20\,\%$", "Prozent"),
                  Q(r"Wie groß ist $\sqrt{2} \cdot \sqrt{8}$?", "4", "sqrt(2)*sqrt(8)", r"$\sqrt{2 \cdot 8} = \sqrt{16} = 4$"),
                  Q(r"Wie groß ist der Anstieg der Geraden durch $(-2 \mid 1)$ und $(2 \mid 3)$?", "0,5", "(3-1)/(2+2)", r"$\frac{3 - 1}{2 - (-2)} = \frac{2}{4} = 0{,}5$", "m =")],
         merke=("MERKE · DAS SITZT OHNE RECHNER",
                [r"**Prozent:** Eine Änderung bezieht sich immer auf den alten Wert: $\frac{\text{Änderung}}{\text{alter Wert}}$.",
                 r"**Wurzeln:** $\sqrt{a} \cdot \sqrt{b} = \sqrt{a \cdot b}$, aber $\sqrt{a} + \sqrt{b}$ ist **nicht** $\sqrt{a + b}$.",
                 r"**Einheiten:** $1\ \ell = 1\ \mathrm{dm}^3$. Ein Würfel mit $5$ dm Kantenlänge fasst $125\ \ell$.",
                 r"**Parallele Geraden** haben denselben Anstieg. **Raute:** $A = \frac{e \cdot f}{2}$ aus den beiden Diagonalen.",
                 r"**Ohne Zurücklegen:** Auf der zweiten Stufe ändern sich Zähler und Nenner. Die Äste eines Knotens ergeben zusammen $1$."]),
         methode=("STRATEGIE · ANKREUZEN",
                  ["Jede Ankreuzaufgabe zählt 1 BE, es gibt keine Teilpunkte und keinen Abzug. Lass deshalb nie ein Feld leer.",
                   "Streiche zuerst aus, was sicher falsch ist. Eine Probe mit einer einfachen Zahl entscheidet oft schneller als jede Umformung."]),
         widgets=[W("gerade", "INTERAKTIV · EINE GERADE DURCH ZWEI PUNKTE", r"Zieh die beiden Punkte. Das grüne Dreieck zeigt $\Delta x$ und $\Delta y$, darunter stehen Steigung, y-Achsenabschnitt und Gleichung.")],
         repeat=[L("../mathe11/lb2.html", "GLEICHUNGEN, FORMELN, FIGUREN", "Mathematik 11 · Kapitel 2"),
                 L("../mathe11/lb3-1.html", "FUNKTIONEN UND IHRE EIGENSCHAFTEN", "Mathematik 11 · Kapitel 3.1"),
                 L("../mathe11/lb1.html", "MEHRSTUFIGE ZUFALLSVERSUCHE", "Mathematik 11 · Kapitel 1")],
         kern=[r"Prozent bezieht sich auf den alten Wert, Wurzeln werden nur beim Multiplizieren zusammengefasst. Falsches zuerst ausschließen.",
               r"Gleicher Anstieg heißt parallel. Die Raute füllt genau die Hälfte des Rechtecks aus ihren Diagonalen.",
               r"Den Baum rückwärts lesen: Erst beide Stufen zusammen legen die Zahl der Lose fest. „Mindestens ein“ läuft über das Gegenereignis."],
         test=[Q(r"Ein Preis sinkt von $80$ € auf $60$ €. Um wie viel Prozent ist er gesunken?", "25", "20/80*100", r"$\frac{20}{80} = 25\,\%$, bezogen auf den alten Preis.", "Prozent"),
               Q(r"Die Gerade $h$ ist parallel zu $y = 2x + 1$ und geht durch $(3 \mid 2)$. Wie groß ist ihr $y$-Achsenabschnitt $n$?", "-4", "2-2*3", r"$2 = 2 \cdot 3 + n$, also $n = -4$.", "n ="),
               Q(r"Eine Raute hat die Diagonalen $6$ und $10$. Wie groß ist ihr Flächeninhalt?", "30", "6*10/2", r"$\frac{6 \cdot 10}{2} = 30$, die Hälfte des umschließenden Rechtecks.", "A ="),
               Q(r"$3$ rote und $2$ blaue Kugeln, zweimal ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für mindestens eine blaue?", "7/10", "1-3/5*2/4", r"Gegenereignis „zweimal rot“: $1 - \frac{3}{5} \cdot \frac{2}{4} = 1 - \frac{3}{10} = \frac{7}{10}$", "P =")]),

    dict(file="va-teila2", sheet="va-bgy11-teila2", k=29, title="Teil A, Satz 2", lb=VA + "Teil A", when=K11,
         sub="Noch sechsmal ankreuzen, die Exponentialfunktion zur Basis 2, Rechtecke unter einer Hyperbel",
         chips=["TEIL A", "25 MINUTEN", "OHNE HILFSMITTEL"],
         lead=r"Der zweite Satz bringt, was im ersten fehlt: Grundwert und Prozentsatz, Gleichungen mit zwei Lösungen, Sinus und Potenzen von 2. Rechne ihn an einem anderen Tag, wieder mit Wecker auf 25 Minuten.",
         pruef=["Grundwert, Prozentwert und Prozentsatz", "Potenzen von $2$ ohne Rechner, Graphen spiegeln und verschieben",
                r"Hyperbeln $y = \frac{k}{x}$ durch einen Punkt legen", "Zwei Gleichungen für zwei Unbekannte aus einem Sachtext"],
         hero=G(["2^x", "2^(-x)"], "-3.5,3.5", "-0.5,8.5", [[0, 1]], "Der Graph von 2 hoch x und sein Spiegelbild an der y-Achse"),
         checkin=[Q(r"$30\,\%$ einer Klasse sind $9$ Personen. Wie viele Personen hat die Klasse?", "30", "9/0.3", r"Grundwert $G = \frac{W}{p} = \frac{9}{0{,}3} = 30$", "Personen"),
                  Q(r"Wie groß ist $2^{-2}$?", "1/4", "2**-2", r"$2^{-2} = \frac{1}{2^2} = \frac{1}{4}$", "Wert"),
                  Q(r"Der Graph von $f(x) = \frac{k}{x}$ geht durch $(2 \mid 5)$. Wie groß ist $k$?", "10", "2*5", r"$5 = \frac{k}{2}$, also $k = 10$.", "k =")],
         merke=("MERKE · PROZENT, POTENZEN, HYPERBEL",
                [r"**Grundwert:** $G = \frac{W}{p}$. Sind $30\,\%$ genau $48$ Personen, ist $G = \frac{48}{0{,}3} = 160$.",
                 r"**Potenzen:** $2^{-n} = \frac{1}{2^n}$ und $2^{x + 2} = 2^2 \cdot 2^x = 4 \cdot 2^x$.",
                 r"**Spiegeln an der $y$-Achse:** $x$ durch $-x$ ersetzen. Aus $2^x$ wird $2^{-x} = \left(\frac{1}{2}\right)^x$.",
                 r"**Verschieben:** Ein Plus im Exponenten verschiebt nach **links**, ein Plus hinter der Potenz nach **oben**.",
                 r"**Hyperbel:** Bei $f(x) = \frac{k}{x}$ hat jedes Rechteck unter dem Graphen den Flächeninhalt $u \cdot \frac{k}{u} = k$."]),
         widgets=[W("potenzfunktion", "INTERAKTIV · POTENZFUNKTIONEN", r"Wähle einen Exponenten. Mit „Verwandte zeigen“ erscheinen die Graphen mit derselben Art von Exponent dazu. Die Hyperbel ist $x^{-1} = \frac{1}{x}$.", n="-1"),
                  W("expgleichung", r"INTERAKTIV · $a^x = b$ LÖSEN", r"Gib Basis und rechte Seite ein. Brüche und Kommazahlen gehen auch.")],
         repeat=[L("../mathe11/lb3-2.html", "WACHSTUM UND ZERFALL", "Mathematik 11 · Kapitel 3.2"),
                 L("../mathe11/lb3-7.html", "GRAPHEN UND PARAMETER", "Mathematik 11 · Kapitel 3.7"),
                 L("../mathe11/lb2.html", "GLEICHUNGEN, FORMELN, FIGUREN", "Mathematik 11 · Kapitel 2")],
         kern=[r"Grundwert, Prozentwert und Prozentsatz zuerst benennen. Bei „genau eine Aussage ist falsch“ hilft eine Probe an einer markanten Stelle.",
               r"$2^{x + 2}$ ist $4 \cdot 2^x$: einmal nach links verschoben, einmal gestreckt. Spiegeln an der $y$-Achse heißt $x$ durch $-x$ ersetzen.",
               r"Zwei Unbekannte brauchen zwei Gleichungen. Die negative Lösung passt zu keiner Länge und wird verworfen."],
         test=[Q(r"$15\,\%$ der Befragten sind $27$ Personen. Wie viele wurden befragt?", "180", "27/0.15", r"$G = \frac{27}{0{,}15} = 180$", "Personen"),
               Q(r"An welcher Stelle nimmt $f(x) = 2^x$ den Wert $32$ an?", "5", "log2(32)", r"$2^5 = 32$", "x ="),
               Q(r"$h(x) = 2^{x + 3}$ lässt sich als $h(x) = c \cdot 2^x$ schreiben. Wie groß ist $c$?", "8", "2**3", r"$2^{x + 3} = 2^3 \cdot 2^x = 8 \cdot 2^x$", "c ="),
               Q(r"Ein Rechteck unter dem Graphen von $f(x) = \frac{18}{x}$ hat die Ecke $Q(6 \mid 3)$. Wie groß ist sein Flächeninhalt?", "18", "6*3", r"$6 \cdot 3 = 18 = k$, für jeden Punkt $Q$ auf dem Graphen.", "A =")]),

    dict(file="va-funktionen", sheet="va-bgy11-funktionen", k=30, title="Funktionen", lb=VA + "Teil B", when=K11,
         sub="Parabel mit Dreieck und Senkrechter, Potenzfunktion und Gerade, der Brückenbogen",
         chips=["TEIL B", "AUFGABE 1", "MIT MMS"],
         lead=r"Aufgabe 1 in Teil B ist eine Funktion. In den letzten Jahrgängen war es eine Parabel in Scheitelform, eine Potenzfunktion dritten Grades oder eine verschobene Exponentialfunktion. Du rechnest mit dem MMS, aber der Weg muss trotzdem erkennbar sein.",
         pruef=["Scheitelpunkt, Wertebereich, Nullstellen", "Dreiecke und Geraden aus besonderen Punkten, auch senkrecht",
                "Gemeinsame Punkte von Graph und Gerade, Abstände", "Eine Parabel als Modell: Brückenbogen und Durchfahrtshöhe"],
         hero=G(["-0.5*(x-1)^2+8"], "-4,6", "-1,9", [[1, 8], [-3, 0], [5, 0]], "Nach unten geöffnete Parabel mit ihrem Scheitel und den beiden Nullstellen"),
         checkin=[Q(r"Wo liegt der Scheitel von $f(x) = -2 \cdot (x + 3)^2 + 1$? Gib die $x$-Koordinate an.", "-3", "-3", r"$(x + 3)$ verschiebt nach links: $S(-3 \mid 1)$.", "x ="),
                  Q(r"Eine Gerade hat den Anstieg $-2$. Welchen Anstieg hat eine Senkrechte zu ihr?", "0,5", "-1/(-2)", r"$m_2 = -\frac{1}{m_1} = -\frac{1}{-2} = \frac{1}{2}$", "m ="),
                  Q(r"Wie groß ist die Nullstelle von $f(x) = (x + 1)^3 - 8$?", "1", "8**(1/3)-1", r"$(x + 1)^3 = 8$, also $x + 1 = 2$.", "x =")],
         merke=("MERKE · FUNKTIONEN UND GERADEN",
                [r"**Scheitelform:** $f(x) = a \cdot (x - d)^2 + e$ hat den Scheitel $S(d \mid e)$. Ist $a < 0$, ist der Wertebereich $y \leq e$.",
                 r"**Senkrecht:** Zwei Geraden stehen senkrecht aufeinander, wenn $m_1 \cdot m_2 = -1$.",
                 r"**Gemeinsame Punkte:** Funktionsterme gleichsetzen. Eine Gleichung dritten Grades hat höchstens drei Lösungen.",
                 r"**Abstand:** $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$."]),
         widgets=[W("parabel", "INTERAKTIV · PARABEL-WERKSTATT", r"Zieh den Scheitel oder nutze die Regler. Die gestrichelte Kurve ist die Normalparabel $y = x^2$."),
                  W("potenzfunktion", "INTERAKTIV · POTENZFUNKTIONEN", r"Wähle einen Exponenten. Mit „Verwandte zeigen“ erscheinen die Graphen mit derselben Art von Exponent dazu.", n="3")],
         repeat=[L("../mathe11/lb3-3.html", "QUADRATISCHE FUNKTIONEN UND GLEICHUNGEN", "Mathematik 11 · Kapitel 3.3"),
                 L("../mathe11/lb3-1.html", "FUNKTIONEN UND IHRE EIGENSCHAFTEN", "Mathematik 11 · Kapitel 3.1"),
                 L("../mathe11/lb3-7.html", "GRAPHEN UND PARAMETER", "Mathematik 11 · Kapitel 3.7")],
         kern=[r"Aus der Scheitelform liest du Scheitel und Wertebereich ab. Für die Senkrechte wird der Anstieg umgekehrt und mit $-1$ multipliziert.",
               r"Gleichsetzen liefert die gemeinsamen Punkte, der Graph im MMS zeigt, wie viele es sind.",
               r"Der Ursprung unter dem Scheitel macht die Parabel symmetrisch. Gemessen wird dort, wo es eng wird, und über dem richtigen Wasserstand."],
         test=[Q(r"$f(x) = -(x - 2)^2 + 9$. Wie groß ist die größere Nullstelle?", "5", "2+3", r"$(x - 2)^2 = 9$, also $x = 2 \pm 3$.", "x ="),
               Q(r"Wie groß ist der Flächeninhalt des Dreiecks mit den Ecken $N_1(-1 \mid 0)$, $N_2(5 \mid 0)$ und $S(2 \mid 9)$?", "27", "6*9/2", r"Grundseite $6$, Höhe $9$: $\frac{6 \cdot 9}{2} = 27$", "A ="),
               Q(r"Eine Gerade hat den Anstieg $\frac{1}{3}$. Welchen Anstieg hat eine Senkrechte zu ihr?", "-3", "-1/(1/3)", r"$-\frac{1}{1/3} = -3$", "m ="),
               Q(r"Ein Bogen wird durch $b(x) = -\frac{1}{50}x^2 + 8$ beschrieben. Wie hoch ist er bei $x = 5$?", "7,5", "-25/50+8", r"$-\frac{25}{50} + 8 = 7{,}5$", "b =")]),

    dict(file="va-exponential", sheet="va-bgy11-exponential", k=31, title="Exponential-, Sinus- und Wurzelfunktionen", lb=VA + "Teil B", when=K11,
         sub="Exponentialfunktion mit Asymptote, ein Medikament wird abgebaut, Riesenrad mit Aussicht",
         chips=["TEIL B", "MIT MMS"],
         lead=r"In zwei der vier ausgewerteten Jahrgänge war Aufgabe 1 eine verschobene Exponentialfunktion. Eine Wurzel- und eine Sinusfunktion tauchten in der langen Sachaufgabe auf. Hier lernst du, die Zahlen im Funktionsterm zu lesen.",
         pruef=["Wertebereich, Monotonie und Asymptote", "Die Parameter $a$ und $b$ aus zwei Punkten",
                "Halbwertszeit und Uhrzeiten im Sachzusammenhang", r"Sinus und Wurzel deuten, beide Lösungen von $\sin z = c$ finden"],
         hero=G(["0.5*2^x-4", "-4"], "-4,5", "-5,9", [[3, 0], [0, -3.5]], "Eine verschobene Exponentialfunktion mit ihrer Asymptote"),
         checkin=[Q(r"$m(t) = 100 \cdot 0{,}8^t$. Um wie viel Prozent nimmt $m$ pro Stunde ab?", "20", "(1-0.8)*100", r"Der Faktor $0{,}8$ heißt: Es bleiben $80\,\%$, also $20\,\%$ weniger.", "Prozent"),
                  Q(r"Wie groß ist $\sin\left(\frac{\pi}{2}\right)$?", "1", "sin(pi/2)", r"$\sin 90° = 1$", "Wert"),
                  Q(r"Welche Zahl $x$ löst $2^x = 16$?", "4", "log2(16)", r"$2^4 = 16$", "x =")],
         merke=("MERKE · EXPONENTIAL, SINUS, WURZEL",
                [r"**Verschoben:** $f(x) = a \cdot 2^x + b$ mit $a > 0$ hat den Wertebereich $y > b$. Die Gerade $y = b$ ist Asymptote.",
                 r"**Abnahme:** $m(t) = a \cdot b^t$ mit $0 < b < 1$. Aus $20\,\%$ Abbau wird $b = 0{,}8$. **Halbwertszeit:** $b^t = \frac{1}{2}$.",
                 r"**Sinus:** $h(t) = a \cdot \sin(b \cdot t) + d$ schwankt zwischen $d - a$ und $d + a$, die kleinste Periode ist $\frac{2\pi}{b}$.",
                 r"**Zwei Lösungen:** Zu $\sin z = c$ gehört neben $z_1$ auch $\pi - z_1$. Das MMS rechnet dabei im Bogenmaß."]),
         widgets=[W("expgleichung", r"INTERAKTIV · $a^x = b$ LÖSEN", r"Gib Basis und rechte Seite ein. Brüche und Kommazahlen gehen auch."),
                  W("sinus", "INTERAKTIV · SINUS-WERKSTATT", r"Verändere die vier Parameter einzeln und beobachte, was mit der Kurve passiert. Gestrichelt: $\sin x$.")],
         repeat=[L("../mathe11/lb3-2.html", "WACHSTUM UND ZERFALL", "Mathematik 11 · Kapitel 3.2"),
                 L("../mathe11/lb3-4.html", "PERIODISCHE VORGÄNGE", "Mathematik 11 · Kapitel 3.4"),
                 L("../mathe11/lb3-6.html", "UMKEHRFUNKTIONEN UND LOGARITHMUS", "Mathematik 11 · Kapitel 3.6")],
         kern=[r"Die Zahl hinter der Potenz ist die Asymptote und gehört nicht zum Wertebereich. Bei zwei Punkten zuerst den mit $x = 0$ nehmen: $2^0 = 1$.",
               r"Zwei Messwerte durcheinander teilen ergibt $b^2$. Der Faktor ist das, was bleibt, die Halbwertszeit kommt aus $b^t = \frac{1}{2}$.",
               r"Amplitude und Mittellinie stehen im Term, die zweite Lösung kommt aus der Symmetrie. Die Wurzel wächst langsamer als ihr Argument."],
         test=[Q(r"$f(x) = 3 \cdot 2^x - 6$. Wie groß ist die Nullstelle?", "1", "log2(2)", r"$3 \cdot 2^x = 6$, also $2^x = 2$.", "x ="),
               Q(r"$g(x) = a \cdot 2^x + b$ geht durch $(0 \mid 3)$ und $(1 \mid 5)$. Wie groß ist $a$?", "2", "5-3", r"$a + b = 3$ und $2a + b = 5$, die Differenz ergibt $a = 2$.", "a ="),
               Q(r"Nach wie vielen Stunden ist bei $m(t) = 100 \cdot 0{,}8^t$ nur noch die Hälfte da? Runde auf eine Stelle.", "3,1", "log(0.5)/log(0.8)", r"$t = \frac{\lg 0{,}5}{\lg 0{,}8} \approx 3{,}1$", "t =", "0.05"),
               Q(r"$h(t) = 20 \cdot \sin\left(\frac{\pi}{10} t\right) + 25$. Wie groß ist die kleinste Periode?", "20", "2*pi/(pi/10)", r"$\frac{2\pi}{\pi/10} = 20$", "p =")]),

    dict(file="va-geometrie", sheet="va-bgy11-geometrie", k=32, title="Trigonometrie und Körper", lb=VA + "Teil B", when=K11,
         sub="Slipanlage in Kriebstein, Peilung zur Bastei, ein Turmdach in Görlitz",
         chips=["TEIL B", "AUFGABE 2 ODER 3", "MIT FORMELSAMMLUNG"],
         lead=r"Eine Rampe, eine Peilung, ein Dach: In der Vergleichsarbeit stecken Dreiecke und Körper in Aufgabe 2 und oft auch in der langen Sachaufgabe. Zerlege die Figur, such das rechtwinklige Dreieck und runde erst am Ende.",
         pruef=["Steigung in Prozent und Neigungswinkel", "Sinussatz und Kosinussatz im allgemeinen Dreieck",
                "Pyramide und Kegel: Höhe aus der Seitenkante, Mantelfläche", "Auf- und Abrunden im Sachzusammenhang"],
         hero={"widget": "dreieck-hero", "data-motiv": "vermessung", "data-aria": "Vermessung: eine Standlinie und die Winkel zur Spitze"},
         checkin=[Q(r"Eine Rampe steigt auf $10$ m waagerechter Länge um $1$ m. Wie groß ist ihre Steigung in Prozent?", "10", "1/10*100", r"$\frac{1}{10} = 10\,\%$", "Prozent"),
                  Q(r"Wie groß ist $\tan 45°$?", "1", "tan(radians(45))", r"Gegenkathete und Ankathete sind gleich lang.", "Wert"),
                  Q(r"Ein Quadrat hat die Seitenlänge $8$. Wie lang ist seine halbe Diagonale? Runde auf zwei Stellen.", "5,66", "4*sqrt(2)", r"$\frac{8\sqrt{2}}{2} = 4\sqrt{2} \approx 5{,}66$", "d =", "0.006")],
         merke=("MERKE · DREIECKE UND KÖRPER",
                [r"**Steigung:** $\frac{\text{Höhe}}{\text{waagerechte Länge}} = \tan \alpha$. $12{,}9\,\%$ Steigung sind **kein** Winkel von $12{,}9°$.",
                 r"**Sinussatz:** $\frac{a}{\sin \alpha} = \frac{b}{\sin \beta}$. **Kosinussatz:** $c^2 = a^2 + b^2 - 2ab \cdot \cos \gamma$.",
                 r"**Pyramide:** Höhe, halbe Diagonale und Seitenkante bilden ein rechtwinkliges Dreieck. **Kegelmantel:** $M = \pi \cdot r \cdot s$.",
                 r"**Aufrunden:** Fahrten, Eimer und Rollen werden aufgerundet, auch bei $7{,}1$."]),
         widgets=[W("dreieckloeser", "INTERAKTIV · DER DREIECKSLÖSER", r"Wähle, was gegeben ist, und stell die Werte ein. Der Löser zeigt jeden Schritt mit dem passenden Satz und zeichnet das Dreieck, bei SSW auch ein zweites."),
                  W("pyramidekegel", "INTERAKTIV · DAS DREIECK IM KEGEL", r"Verändere Radius und Höhe. Höhe, Radius und Mantellinie bilden immer ein rechtwinkliges Dreieck.")],
         repeat=[L("../mathe11/lb2.html", "GLEICHUNGEN, FORMELN, FIGUREN", "Mathematik 11 · Kapitel 2"),
                 L("../mathegy10/lb3-1.html", "SINUSSATZ, KOSINUSSATZ, FLÄCHENINHALT", "Mathematik GY 10 · Kapitel 3.1"),
                 L("../mathegy9/lb3-3.html", "PYRAMIDE UND KREISKEGEL", "Mathematik GY 9 · Kapitel 3.3")],
         kern=[r"Erst Pythagoras für die schräge Fläche, dann $\tan \alpha$. Die Steigung in Prozent ist $\tan \alpha$, nicht der Winkel.",
               r"Den Winkel bei $B$ aus den Höhenwinkeln, dann Sinussatz für die Strecke und das rechtwinklige Teildreieck für die Höhe.",
               r"Die halbe Diagonale führt von der Seitenkante zur Höhe. Für den Neigungswinkel der Dachfläche zählt die Mitte der Grundkante."],
         test=[Q(r"Eine Rampe steigt auf $20$ m waagerechter Länge um $3$ m. Wie groß ist ihr Neigungswinkel in Grad? Runde auf eine Stelle.", "8,5", "degrees(atan(3/20))", r"$\tan \alpha = 0{,}15$, also $\alpha \approx 8{,}5°$", "α =", "0.05"),
               Q(r"Es sind $a = 5$, $b = 8$ und $\gamma = 60°$. Wie groß ist $c$?", "7", "sqrt(25+64-80*cos(radians(60)))", r"$c^2 = 25 + 64 - 80 \cdot 0{,}5 = 49$", "c ="),
               Q(r"Eine quadratische Pyramide hat die Grundkante $6$ und die Seitenkante $\sqrt{34}$. Wie groß ist ihre Höhe?", "4", "sqrt(34-18)", r"Halbe Diagonale $3\sqrt{2}$, also $h^2 = 34 - 18 = 16$.", "h ="),
               Q(r"Du brauchst $63{,}2$ m² Beschichtung, ein Eimer reicht für $10$ m². Wie viele Eimer kaufst du?", "7", "ceil(63.2/10)", r"$6{,}32$ wird aufgerundet.", "Eimer")]),

    dict(file="va-stochastik", sheet="va-bgy11-stochastik", k=33, title="Mehrstufige Zufallsexperimente", lb=VA + "Teil B", when=K11,
         sub="Drei Lose mit derselben Chance, Tassen ohne Zurücklegen, die Mensa-Vierfeldertafel",
         chips=["TEIL B", "AUFGABE 2", "MIT MMS"],
         lead=r"Drei Lose, drei Tassen, eine Umfrage: In jeder der vier ausgewerteten Vergleichsarbeiten kam eine Wahrscheinlichkeit dran, meist mit „alle gleich“ und „genau eins“. Ein Baum oder eine Vierfeldertafel bringt Ordnung, bevor du rechnest.",
         pruef=["Pfadregeln bei unabhängigen Stufen", "Ziehen ohne Zurücklegen",
                "„Mindestens eins“ über das Gegenereignis", "Vierfeldertafel und die richtige Bezugsgruppe"],
         hero={"widget": "baum-hero"},
         checkin=[Q(r"Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für dreimal Kopf?", "1/8", "0.5**3", r"$\left(\frac{1}{2}\right)^3 = \frac{1}{8}$", "P ="),
                  Q(r"$5$ rote und $5$ blaue Kugeln. Nach einer roten wird ohne Zurücklegen eine zweite gezogen. Wie groß ist die Wahrscheinlichkeit, dass sie rot ist?", "4/9", "4/9", r"Es liegen noch $9$ Kugeln da, davon $4$ rote.", "P ="),
                  Q(r"$P(\text{Gewinn}) = 0{,}2$. Wie groß ist die Wahrscheinlichkeit für eine Niete?", "0,8", "1-0.2", r"Gegenereignis: $1 - 0{,}2 = 0{,}8$", "P =")],
         merke=("MERKE · MEHRSTUFIG",
                [r"**Pfadregeln:** Längs eines Pfades multiplizieren, mehrere Pfade addieren.",
                 r"**Mindestens eins:** $P = 1 - P(\text{keins})$. $3 \cdot 0{,}2$ zählt Pfade mehrfach.",
                 r"**Genau eins:** die Wahrscheinlichkeit eines Pfades mal die Zahl der Reihenfolgen, bei drei Stufen also mal $3$.",
                 r"**Ohne Zurücklegen:** Zähler und Nenner ändern sich von Zug zu Zug.",
                 r"**Bezugsgruppe:** Im Nenner steht die Gruppe, unter der gezählt wird. $\frac{180}{240}$ und $\frac{180}{244}$ fragen Verschiedenes."]),
         widgets=[W("baum", "INTERAKTIV · BAUMDIAGRAMM-WERKSTATT", r"Stelle die Urne ein, wähle mit oder ohne Zurücklegen und klicke rechts auf die Enden der Pfade. Die Werkstatt rechnet beide Pfadregeln vor."),
                  W("vierfeld-trainer", "INTERAKTIV · VIERFELDERTAFEL-TRAINER", r"Vier Felder sind gegeben (gelb). Fülle die anderen aus und prüfe. „Neue Tafel“ würfelt eine neue Aufgabe.")],
         repeat=[L("../mathe11/lb1.html", "WAHRSCHEINLICHKEITEN MEHRSTUFIGER ZUFALLSVERSUCHE", "Mathematik 11 · Kapitel 1"),
                 L("../mathegy10/lb2-1.html", "ZUFALLSGRÖSSEN UND PFADREGELN", "Mathematik GY 10 · Kapitel 2.1")],
         kern=[r"Bei unabhängigen Losen bleibt die Wahrscheinlichkeit gleich. „Mindestens einen“ rechnest du über „keinen“.",
               r"Ohne Zurücklegen wird der Nenner kleiner. Bei „genau eins“ und „alle verschieden“ zählen die Reihenfolgen mit.",
               r"Erst die Tafel vollständig füllen, dann für jeden Anteil die Bezugsgruppe benennen."],
         test=[Q(r"Jedes fünfte Los gewinnt. Wie groß ist die Wahrscheinlichkeit, mit zwei Losen mindestens einmal zu gewinnen?", "0,36", "1-0.8**2", r"$1 - 0{,}8^2 = 1 - 0{,}64 = 0{,}36$", "P ="),
               Q(r"Mit derselben Chance $0{,}2$: Wie groß ist die Wahrscheinlichkeit für genau einen Gewinn bei zwei Losen?", "0,32", "2*0.2*0.8", r"Zwei Reihenfolgen: $2 \cdot 0{,}2 \cdot 0{,}8 = 0{,}32$", "P ="),
               Q(r"$6$ von $12$ Tassen zeigen die Frauenkirche. Zwei werden ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit, dass beide sie zeigen?", "5/22", "6/12*5/11", r"$\frac{6}{12} \cdot \frac{5}{11} = \frac{30}{132} = \frac{5}{22}$", "P ="),
               Q(r"$180$ von $240$ Mensa-Essern sind zufrieden. Wie viel Prozent der Mensa-Esser sind das?", "75", "180/240*100", r"Bezugsgruppe sind die $240$ Mensa-Esser: $\frac{180}{240} = 75\,\%$", "Prozent")]),

    dict(file="va-lgs", sheet="va-bgy11-lgs", k=34, title="Lineare Gleichungssysteme", lb=VA + "Teil B", when=K11,
         sub="Raddampfer nach Pillnitz, Futter im Zoo Leipzig mit dem Gauß-Verfahren, ein Fahrradverleih mit freiem Parameter",
         chips=["TEIL B", "AUFGABE 3", "MIT MMS"],
         lead=r"Zwei Preise, zwei Anzahlen, eine Gesamteinnahme: In der langen Sachaufgabe stand in den letzten beiden Jahrgängen ein Gleichungssystem. Wer es sicher aufstellt, holt sich dort die ersten Punkte.",
         pruef=["Ein Gleichungssystem aus einem Sachtext aufstellen", "Lösen mit dem Gauß-Verfahren, mit Probe",
                "Lösungen im Sachzusammenhang deuten, auch in Prozent", "Systeme mit unendlich vielen Lösungen und einem Parameter"],
         hero=G(["-x+5", "0.5*x+2"], "-1,7", "-1,6", [[2, 3]], "Zwei Geraden schneiden sich: Der Schnittpunkt löst beide Gleichungen"),
         checkin=[Q(r"$x + y = 10$ und $x - y = 4$. Wie groß ist $x$?", "7", "(10+4)/2", r"Addieren: $2x = 14$", "x ="),
                  Q(r"Ein Kinderpreis von $9$ € wird um $20\,\%$ ermäßigt. Wie viel Euro kostet die Karte dann?", "7,2", "9*0.8", r"$80\,\%$ von $9$ €: $9 \cdot 0{,}8 = 7{,}20$ €", "€"),
                  Q(r"$2x + y = 7$ und $y = 3$. Wie groß ist $x$?", "2", "(7-3)/2", r"$2x = 4$", "x =")],
         merke=("MERKE · GLEICHUNGSSYSTEME",
                [r"**Aufstellen:** Eine Gleichung für die Anzahlen, eine für das Geld. Die Preise stehen als Faktoren vor den Anzahlen.",
                 r"**Gauß-Verfahren:** Durch Addieren von Vielfachen entsteht eine Dreiecksform, dann wird von unten nach oben eingesetzt.",
                 r"**Tabelle:** Die Spalte einer Sorte liefert die Koeffizienten ihrer Variablen.",
                 r"**Weniger Gleichungen als Unbekannte:** unendlich viele Lösungen, eine Unbekannte bleibt frei. Erst ganze, nicht negative Anzahlen schränken ein."]),
         widgets=[W("gauss", "INTERAKTIV · GAUSS-WERKSTATT", r"Wähle eine Umformung, Zielzeile, zweite Zeile und den Faktor $k$, dann „Ausführen“. Oder lass dir mit „Nächster Schritt“ den nächsten Gauß-Schritt zeigen. „Neues LGS“ würfelt ein System mit ganzzahliger Lösung.")],
         repeat=[L("../mathe11/lb4.html", "LINEARE GLEICHUNGSSYSTEME UND MATRIZEN", "Mathematik 11 · Kapitel 4"),
                 L("../mathe11/lb2.html", "GLEICHUNGEN, FORMELN, FIGUREN", "Mathematik 11 · Kapitel 2")],
         kern=[r"Eine Gleichung für die Personen, eine für das Geld. Um $20\,\%$ ermäßigt heißt mal $0{,}8$.",
               r"Die Tabelle spaltenweise lesen, dann Gauß. Die Probe in allen drei Gleichungen sichert die Lösung.",
               r"Zwei Gleichungen für drei Unbekannte: unendlich viele Lösungen. Ganze, nicht negative Anzahlen lassen nur wenige Flotten übrig."],
         test=[Q(r"$300$ Fahrgäste zahlen $18$ € oder $9$ €, zusammen $4\,500$ €. Wie viele zahlen $18$ €?", "200", "(4500-9*300)/9", r"$18x + 9 \cdot (300 - x) = 4500$, also $9x = 1800$.", "Anzahl"),
               Q(r"$x + y + z = 6$, $y + z = 5$ und $z = 2$. Wie groß ist $x$?", "1", "6-5", r"Von unten: $z = 2$, $y = 3$, $x = 1$.", "x ="),
               Q(r"Für den Fahrradverleih gilt $x + y + z = 60$ und $12x + 30y + 40z = 1\,440$. Wie viele E-Bikes $y$ sind es bei $z = 9$?", "26", "(1440-12*60-28*9)/18", r"$12$-mal die erste Gleichung abziehen: $18y + 28z = 720$, mit $z = 9$ also $18y = 468$.", "y ="),
               Q(r"Wie viel Euro kosten $4$ kg zu $2{,}40$ €, $5$ kg zu $1{,}80$ € und $2$ kg zu $3{,}00$ € zusammen?", "24,6", "2.4*4+1.8*5+3*2", r"$9{,}60 + 9{,}00 + 6{,}00 = 24{,}60$", "€")]),

    dict(file="va-simulation", sheet="va-bgy11-simulation", k=35, title="Generalprobe Teil B", lb=VA + "Generalprobe", when=K11,
         sub="Teil B mit Zeit und Hilfsmitteln wie im Ernstfall: 8 + 7 + 15 BE",
         chips=["TEIL B", "30 BE", "65 MINUTEN"],
         lead=r"Drei Aufgaben, 30 BE, rund 65 Minuten: Das ist Teil B der Vergleichsarbeit. Leg MMS und Formelsammlung bereit, starte die Uhr und schau erst am Ende in die Lösungen.",
         pruef=["Alle drei Aufgaben in einem Durchgang", "Punkte in jeder Teilaufgabe, wie in der echten Arbeit",
                "Eine lange Sachaufgabe aus Sachsen: Gleichungssystem, Parabel, Trigonometrie"],
         hero=G(["-0.5*x^2+2*x+6", "-x+6"], "-2.5,7", "-1.5,9", [[0, 6], [6, 0]], "Eine Parabel und die Gerade durch zwei ihrer Achsenschnittpunkte"),
         checkin=[Q(r"$90$ Minuten Gesamtzeit, Teil A dauert $25$ Minuten. Wie viele Minuten bleiben für Teil B?", "65", "90-25", r"$90 - 25 = 65$", "Minuten"),
                  Q(r"Wie viele BE hat dieser Teil B?", "30", "8+7+15", r"$8 + 7 + 15 = 30$", "BE"),
                  Q(r"Ab wie vielen von $45$ BE gibt es in der Vergleichsarbeit eine Vier?", "18", "18", r"Nach der Skala der letzten beiden Jahrgänge ergeben $18$ bis $24$ BE eine Vier.", "BE")],
         merke=("MERKE · SO GEHST DU VOR",
                [r"**Erst lesen:** Verschaffe dir einen Überblick über alle drei Aufgaben.",
                 r"**Rechenweg zeigen:** Auch mit dem MMS muss erkennbar sein, was du gerechnet hast.",
                 r"**Näherungswerte:** Ein richtiger Näherungswert bringt auch dort die volle Punktzahl, wo ein exakter Wert erwartet wird.",
                 r"**Einheiten:** Antworte im Sachzusammenhang, mit Einheit und sinnvoll gerundet."]),
         widgets=[W("pruefungsuhr", "DEINE UHR · 65 MINUTEN", r"Starte die Uhr, wenn du beginnst. Sie läuft nur, solange diese Seite offen ist.", min=65)],
         kern=[r"Scheitel und Nullstellen, dann die Gerade durch die Achsenschnittpunkte. Beim Berühren muss die Diskriminante null sein.",
               r"Zylinder plus Kegel, $5\,\%$ Verlust, dann abrunden. Ohne Zurücklegen ändert sich der zweite Bruch.",
               r"Gleichungssystem, Parabel, Durchfahrtsbreite und ein Kosinussatz mit $180° - 48°$: quer durch alles, wie in jeder Vergleichsarbeit."],
         test=[Q(r"Wie groß ist die größere Nullstelle von $-\frac{1}{2}x^2 + 2x + 6$?", "6", "(4+8)/2", r"$x^2 - 4x - 12 = 0$, also $(x - 6)(x + 2) = 0$.", "x ="),
               Q(r"$6$ Engel und $4$ Bergmänner, zwei ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zwei Bergmänner?", "2/15", "4/10*3/9", r"$\frac{4}{10} \cdot \frac{3}{9} = \frac{12}{90} = \frac{2}{15}$", "P ="),
               Q(r"Ein Boot ändert seine Fahrtrichtung um $48°$. Wie groß ist der Winkel im Dreieck an dieser Ecke in Grad?", "132", "180-48", r"$180° - 48° = 132°$", "Winkel"),
               Q(r"Ein Zylinder hat $r = 1$ cm und $h = 9$ cm. Sein Volumen ist $k \cdot \pi$ cm³. Wie groß ist $k$?", "9", "1*1*9", r"$\pi \cdot 1^2 \cdot 9 = 9\pi$", "k =")]),
]
