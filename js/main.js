// js/main.js

function isChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

function updateUI() {
    document.getElementById('btn_prev').disabled = (currentStep === 0);
    document.getElementById('btn_next').disabled = (currentStep === storyline.length);
    document.getElementById('step-counter').innerText = `${currentStep}/${storyline.length}`;
    document.getElementById('cb_all').checked = (currentStep === storyline.length);
    updateExplanation();
}

function applyStep() {
    document.querySelectorAll('.calc-box input[type="checkbox"]').forEach(cb => cb.checked = false);

    ['cb_BAD', 'cb_F', 'cb_DAC', 'cb_BC'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).checked = false;
    });

    storyline.forEach((id, index) => {
        if (index < currentStep && document.getElementById(id)) document.getElementById(id).checked = true;
    });

    if (document.getElementById('cb_ABC').checked) document.getElementById('cb_BC').checked = true;
    if (document.getElementById('cb_AD').checked) document.getElementById('cb_BAD').checked = true;
    if (document.getElementById('cb_BD').checked) document.getElementById('cb_F').checked = true;
    if (document.getElementById('cb_ADB').checked) document.getElementById('cb_DAC').checked = true;

    updateUI();
    draw();
}

// Initialer Start-Befehl
updateUI();
draw();