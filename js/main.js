// js/main.js

document.getElementById('variant-select').addEventListener('change', function(e) {
    currentVariant = parseInt(e.target.value);
    const v = variants[currentVariant];

    document.getElementById('txt_BAC').innerText = v.BAC + "°";
    document.getElementById('txt_ACB').innerText = v.ACB + "°";
    document.getElementById('txt_ABD').innerText = v.ABD + "°";
    document.getElementById('txt_ABC').innerText = (180 - v.BAC - v.ACB) + "°";
    document.getElementById('txt_DBC').innerText = ((180 - v.BAC - v.ACB) - v.ABD) + "°";
    document.getElementById('txt_ADB').innerText = (180 - v.BAD - v.ABD) + "°";

    if (currentVariant === 0) {
        document.getElementById('phase5-geo').style.display = 'block';
        document.getElementById('phase5-tri').style.display = 'none';
        storyline = storylineGeo;
    } else {
        document.getElementById('phase5-geo').style.display = 'none';
        document.getElementById('phase5-tri').style.display = 'block';
        storyline = storylineTri;
    }

    currentStep = storyline.length;
    applyStep();
});

document.getElementById('btn_next').addEventListener('click', () => { if (currentStep < storyline.length) { currentStep++; applyStep(); } });
document.getElementById('btn_prev').addEventListener('click', () => { if (currentStep > 0) { currentStep--; applyStep(); } });
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') document.getElementById('btn_next').click();
    else if (event.key === 'ArrowLeft') document.getElementById('btn_prev').click();
});

document.getElementById('cb_all').addEventListener('change', function(e) {
    currentStep = e.target.checked ? storyline.length : 0;
    applyStep();
});

document.getElementById('cb_calc_all').addEventListener('change', function(e) {
    const isChecked = e.target.checked;
    ['cb_DAC', 'cb_ABC', 'cb_DBC', 'cb_ADB', 'cb_AEB', 'cb_AEP', 'cb_BEP'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).checked = isChecked;
    });
    draw(); // Wird aus draw.js geholt
});

document.querySelectorAll('.calc-box input[type="checkbox"]').forEach(cb => { cb.addEventListener('change', draw); });

function updateUI() {
    document.getElementById('btn_prev').disabled = (currentStep === 0);
    document.getElementById('btn_next').disabled = (currentStep === storyline.length);
    document.getElementById('step-counter').innerText = `${currentStep}/${storyline.length}`;
    document.getElementById('cb_all').checked = (currentStep === storyline.length);
    updateExplanation(); // Wird aus explanations.js geholt
}

function applyStep() {
    // 1. Sichtbare Checkboxen zurücksetzen
    document.querySelectorAll('.calc-box input[type="checkbox"]').forEach(cb => cb.checked = false);

    // 2. NEU: Versteckte Logik-Checkboxen zwingend zurücksetzen!
    ['cb_BAD', 'cb_F', 'cb_DAC', 'cb_BC'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).checked = false;
    });

    // 3. Storyline (Schritte) anwenden
    storyline.forEach((id, index) => {
        if (index < currentStep && document.getElementById(id)) document.getElementById(id).checked = true;
    });

    // 4. Abhängigkeiten setzen (Wenn Winkel da, dann auch Linie)
    if (document.getElementById('cb_ABC').checked) document.getElementById('cb_BC').checked = true;
    if (document.getElementById('cb_AD').checked) document.getElementById('cb_BAD').checked = true;
    if (document.getElementById('cb_BD').checked) document.getElementById('cb_F').checked = true;
    if (document.getElementById('cb_ADB').checked) document.getElementById('cb_DAC').checked = true;

    updateUI();
    draw();
}

// Initialer Start-Befehl
window.addEventListener('resize', draw);
updateUI();
draw();