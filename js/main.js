// js/main.js

function isChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

const splitter = document.getElementById('main-splitter');
const infoPanel = document.getElementById('info-panel');

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
    draw();
});

document.querySelectorAll('.calc-box input[type="checkbox"]').forEach(cb => { cb.addEventListener('change', draw); });

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

window.addEventListener('resize', () => {
    if (infoPanel) {
        infoPanel.style.width = '';
        infoPanel.style.minWidth = '';
        infoPanel.style.height = '';
        infoPanel.style.flex = '';
    }
    const cc = document.getElementById('canvas-container');
    if (cc) cc.style.height = '';
    draw();
});
updateUI();
draw();
requestAnimationFrame(() => draw());

// --- SPLITTER LOGIK ---
let isSplitting = false;

if (splitter) {
    splitter.addEventListener('pointerdown', (e) => {
        isSplitting = true;
        splitter.classList.add('active');
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('pointermove', (e) => {
        if (!isSplitting) return;

        const isMobile = window.innerWidth <= 1100;

        if (isMobile) {
            let newPercentage = (e.clientY / window.innerHeight) * 100;
            newPercentage = Math.max(50, Math.min(newPercentage, 90));
            document.getElementById('canvas-container').style.height = `${newPercentage}vh`;
            if (infoPanel) {
                infoPanel.style.height = `auto`; // rely on flex
                infoPanel.style.flex = `1 1 0%`; // let CSS do the layout
            }
        } else if (infoPanel) {
            const newWidth = e.clientX;
            const clampedWidth = Math.max(250, Math.min(newWidth, window.innerWidth * 0.5));
            infoPanel.style.width = `${clampedWidth}px`;
            infoPanel.style.minWidth = `${clampedWidth}px`;
        }
        draw();
    });

    document.addEventListener('pointerup', () => {
        if (isSplitting) {
            isSplitting = false;
            splitter.classList.remove('active');
            document.body.style.userSelect = '';
            draw();
        }
    });
}