// js/explanations.js

function updateExplanation() {
    const box = document.getElementById('explanation-box');
    const title = document.getElementById('exp-title');
    const text = document.getElementById('exp-text');
    const v = variants[currentVariant];

    // Nichts anzeigen bei Schritt 0
    if (currentStep === 0) {
        box.style.display = 'none';
        return;
    }

    box.style.display = 'flex';

    // Phase 1: Rechtes Dreieck
    if (currentStep === 1) {
        title.innerText = "SCHRITT 1: Die Basis";
        text.innerHTML = "Wir beginnen unsere Konstruktion mit einer horizontalen Basislinie <b>AB</b>.";
    } else if (currentStep === 2) {
        title.innerText = "SCHRITT 2: Der erste Winkel";
        text.innerHTML = `Vom Punkt A aus tragen wir den ersten vorgegebenen Winkel ab: <br><br> $$ \\angle BAC = ${v.BAC}^\\circ $$`;
    } else if (currentStep === 3) {
        title.innerText = "SCHRITT 3: Die Diagonale";
        text.innerHTML = "Wir ziehen die Diagonale von A aus. Irgendwo auf dieser Linie wird später unser Punkt C liegen.";
    } else if (currentStep === 4) {
        title.innerText = "SCHRITT 4: Der Zielpunkt C";
        text.innerHTML = `Wir wissen, dass der Winkel an der Spitze C vorgegeben ist mit:<br><br> $$ \\angle ACB = ${v.ACB}^\\circ $$`;
    } else if (currentStep === 5) {
        title.innerText = "SCHRITT 5: Basiswinkel B berechnen";
        text.innerHTML = `Da die Innenwinkelsumme im Dreieck ABC immer \\( 180^\\circ \\) beträgt, können wir den Winkel unten rechts berechnen:<br><br> $$ \\angle ABC = 180^\\circ - ${v.BAC}^\\circ - ${v.ACB}^\\circ = \\mathbf{${180 - v.BAC - v.ACB}^\\circ} $$`;
    } else if (currentStep === 6) {
        title.innerText = "SCHRITT 6: Der linke Schenkel";
        text.innerHTML = `Der gesamte Basiswinkel links ist mit \\( ${v.BAD}^\\circ \\) vorgegeben. Wir ziehen den linken Schenkel <b>AD</b>.`;

    // Phase 2: Linkes Dreieck
    } else if (currentStep === 7) {
        title.innerText = "SCHRITT 7: Der innere Winkel bei B";
        text.innerHTML = `Von der rechten Seite aus tragen wir den nächsten vorgegebenen Winkel ab:<br><br> $$ \\angle ABD = ${v.ABD}^\\circ $$`;
    } else if (currentStep === 8) {
        title.innerText = "SCHRITT 8: Die zweite Diagonale";
        text.innerHTML = "Wir ziehen die Linie BD. Dort, wo sie den Schenkel AD trifft, entsteht unsere letzte Ecke: Der Punkt <b>D</b>. Die beiden Diagonalen kreuzen sich im Punkt <b>F</b>.";

    // Phase 3 & 4
    } else if (currentStep === 9) {
        const angABC = 180 - v.BAC - v.ACB;
        title.innerText = "SCHRITT 9: Der Restwinkel bei B";
        text.innerHTML = `Da der gesamte rechte Winkel \\( ${angABC}^\\circ \\) beträgt und der innere Teil \\( ${v.ABD}^\\circ \\) groß ist, bleibt für den Rest:<br><br> $$ \\angle DBC = ${angABC}^\\circ - ${v.ABD}^\\circ = \\mathbf{${angABC - v.ABD}^\\circ} $$`;
    } else if (currentStep === 10) {
        const angADB = 180 - v.BAD - v.ABD;
        title.innerText = "SCHRITT 10: Der Winkel bei D";
        text.innerHTML = `Wir betrachten das linke Dreieck ABD. Über die Innenwinkelsumme finden wir:<br><br> $$ \\angle ADB = 180^\\circ - ${v.BAD}^\\circ - ${v.ABD}^\\circ = \\mathbf{${angADB}^\\circ} $$`;
    } else if (currentStep === 11) {
        title.innerText = "SCHRITT 11: Die Ziel-Linie";
        text.innerHTML = "Wir verbinden die Eckpunkte C und D. Dadurch entstehen ganz neue Dreiecke im oberen Bereich.";
    } else if (currentStep === 12) {
        title.innerText = "SCHRITT 12: Das Rätsel";
        text.innerHTML = "Hier ist die große Frage dieser Aufgabe: Wie groß ist der orange markierte Winkel <b>DCA</b>?<br><br><i>Mit der einfachen Innenwinkelsumme kommen wir hier nicht weiter. Wir brauchen eine clevere Strategie!</i>";

    // Phase 5: Lösung
    } else if (currentStep > 12) {
        if (currentVariant === 0) { // Geometrisch
            if (currentStep === 13) {
                title.innerText = "SCHRITT 13: Das große Dreieck";
                text.innerHTML = "Wir verlängern AD und BC zur Spitze <b>E</b>. Es entsteht ein riesiges, gleichschenkliges Dreieck.";
            } else if (currentStep === 14) {
                title.innerText = "SCHRITT 14: Der Spitzenwinkel";
                text.innerHTML = "Die Innenwinkelsumme im großen Dreieck liefert uns den Winkel an der Spitze E:<br><br> $$ \\angle AEB = 180^\\circ - 80^\\circ - 80^\\circ = \\mathbf{20^\\circ} $$";
            } else if (currentStep === 15) {
                title.innerText = "SCHRITT 15: Die Symmetrieachse";
                text.innerHTML = "Wir fällen die vertikale Symmetrieachse von E exakt zur Mitte der Basislinie AB.";
            } else if (currentStep === 16) {
                title.innerText = "SCHRITT 16: Schnittpunkt P";
                text.innerHTML = "Der Schnittpunkt <b>P</b> mit der Diagonale BD ist der geometrische Schlüssel zum Finden kongruenter Dreiecke.";
            } else if (currentStep >= 17) {
                title.innerText = "SCHRITT 17 & 18: Die Lösung";
                text.innerHTML = "Die Achse halbiert die Spitze in zwei exakte \\( 10^\\circ \\)-Winkel.<br><br>Durch eine Kette von Kongruenzbeweisen (Gleichseitige Dreiecke um Punkt P) lässt sich zeigen, dass CD parallel zu AB verlaufen muss. Daraus folgt zwingend:<br><br> $$ \\angle DCA = \\mathbf{20^\\circ} $$";
            }
        } else { // Trigonometrisch
            const angADB = 180 - v.BAD - v.ABD;
            if (currentStep === 13) {
                title.innerText = "SCHRITT 13: Sinussatz im \\( \\Delta ABD \\)";
                text.innerHTML = `Wir nutzen den Sinussatz im grünen Dreieck ABD:<br><br> $$ \\frac{BD}{\\sin(${v.BAD}^\\circ)} = \\frac{AB}{\\sin(${angADB}^\\circ)} $$ <br>Daraus folgt für BD:<br> $$ BD = AB \\cdot \\frac{\\sin(${v.BAD}^\\circ)}{\\sin(${angADB}^\\circ)} $$`;
            } else if (currentStep === 14) {
                title.innerText = "SCHRITT 14: Sinussatz im \\( \\Delta ABC \\)";
                text.innerHTML = `Im blauen Dreieck ABC gilt analog:<br><br> $$ \\frac{BC}{\\sin(${v.BAC}^\\circ)} = \\frac{AB}{\\sin(${v.ACB}^\\circ)} $$ <br>Daraus folgt für BC:<br> $$ BC = AB \\cdot \\frac{\\sin(${v.BAC}^\\circ)}{\\sin(${v.ACB}^\\circ)} $$`;
            } else if (currentStep >= 15) {
                title.innerText = "SCHRITT 15: Das Finale im \\( \\Delta BCD \\)";
                text.innerHTML = `Im lila Dreieck BCD kennen wir nun das Längenverhältnis von BC zu BD (die Seite AB kürzt sich heraus).<br><br>Wendet man den Sinussatz ein drittes Mal im \\( \\Delta BCD \\) an und löst nach dem gesuchten Winkel auf, erhalten wir mathematisch exakt:<br><br> $$ \\angle DCA = \\mathbf{${v.target}^\\circ} $$`;
            }
        }
    }

    // LaTeX Renderer anstoßen
    if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById('explanation-box')]).catch((err) => console.log(err));
    }
}