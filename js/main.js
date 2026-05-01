// js/main.js

function isChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

const splitter = document.getElementById('main-splitter');
const infoPanel = document.getElementById('info-panel');

const variantSelect = document.getElementById('variant-select');
if (variantSelect) {
    variantSelect.addEventListener('change', function(e) {
        currentVariant = parseInt(e.target.value);
        const v = variants[currentVariant];

        ['txt_BAC', 'txt_ACB', 'txt_ABD', 'txt_ABC', 'txt_DBC', 'txt_ADB'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'txt_BAC') el.innerText = v.BAC + "°";
                if (id === 'txt_ACB') el.innerText = v.ACB + "°";
                if (id === 'txt_ABD') el.innerText = v.ABD + "°";
                if (id === 'txt_ABC') el.innerText = (180 - v.BAC - v.ACB) + "°";
                if (id === 'txt_DBC') el.innerText = ((180 - v.BAC - v.ACB) - v.ABD) + "°";
                if (id === 'txt_ADB') el.innerText = (180 - v.BAD - v.ABD) + "°";
            }
        });

        const phase5Geo = document.getElementById('phase5-geo');
        const phase5Tri = document.getElementById('phase5-tri');

        if (currentVariant === 0) {
            if (phase5Geo) phase5Geo.style.display = 'block';
            if (phase5Tri) phase5Tri.style.display = 'none';
            storyline = storylineGeo;
        } else {
            if (phase5Geo) phase5Geo.style.display = 'none';
            if (phase5Tri) phase5Tri.style.display = 'block';
            storyline = storylineTri;
        }

        currentStep = storyline.length;
        applyStep();
    });
}

const btnNext = document.getElementById('btn_next');
if (btnNext) btnNext.addEventListener('click', () => { if (currentStep < storyline.length) { currentStep++; applyStep(); } });

const btnPrev = document.getElementById('btn_prev');
if (btnPrev) btnPrev.addEventListener('click', () => { if (currentStep > 0) { currentStep--; applyStep(); } });

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' && btnNext) btnNext.click();
    else if (event.key === 'ArrowLeft' && btnPrev) btnPrev.click();
});

const cbAll = document.getElementById('cb_all');
if (cbAll) {
    cbAll.addEventListener('change', function(e) {
        currentStep = e.target.checked ? storyline.length : 0;
        applyStep();
    });
}

const cbCalcAll = document.getElementById('cb_calc_all');
if (cbCalcAll) {
    cbCalcAll.addEventListener('change', function(e) {
        const isChecked = e.target.checked;
        ['cb_DAC', 'cb_ABC', 'cb_DBC', 'cb_ADB', 'cb_AEB', 'cb_AEP', 'cb_BEP'].forEach(id => {
            if(document.getElementById(id)) document.getElementById(id).checked = isChecked;
        });
        draw();
    });
}

document.querySelectorAll('.cyber-checkbox').forEach(cb => { cb.addEventListener('change', draw); });

function updateUI() {
    const btnPrev = document.getElementById('btn_prev');
    if (btnPrev) btnPrev.disabled = (currentStep === 0);
    
    const btnNext = document.getElementById('btn_next');
    if (btnNext) btnNext.disabled = (currentStep === storyline.length);
    
    const stepCounter = document.getElementById('step-counter');
    if (stepCounter) stepCounter.innerText = `${currentStep}/${storyline.length}`;
    
    const cbAll = document.getElementById('cb_all');
    if (cbAll) cbAll.checked = (currentStep === storyline.length);
    
    if (typeof updateExplanation === 'function') updateExplanation();
}

function applyStep() {
    document.querySelectorAll('.cyber-checkbox').forEach(cb => cb.checked = false);

    ['cb_BAD', 'cb_F', 'cb_DAC', 'cb_BC'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).checked = false;
    });

    storyline.forEach((id, index) => {
        if (index < currentStep && document.getElementById(id)) document.getElementById(id).checked = true;
    });

    const cbABC = document.getElementById('cb_ABC');
    const cbBC = document.getElementById('cb_BC');
    if (cbABC && cbABC.checked && cbBC) cbBC.checked = true;
    
    const cbAD = document.getElementById('cb_AD');
    const cbBAD = document.getElementById('cb_BAD');
    if (cbAD && cbAD.checked && cbBAD) cbBAD.checked = true;
    
    const cbBD = document.getElementById('cb_BD');
    const cbF = document.getElementById('cb_F');
    if (cbBD && cbBD.checked && cbF) cbF.checked = true;
    
    const cbADB = document.getElementById('cb_ADB');
    const cbDAC = document.getElementById('cb_DAC');
    if (cbADB && cbADB.checked && cbDAC) cbDAC.checked = true;

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