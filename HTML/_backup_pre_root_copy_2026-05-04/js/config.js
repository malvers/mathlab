// js/config.js

// --- VARIANTS ---
const variants = [
    { BAC: 70, ACB: 30, BAD: 80, ABD: 60, target: 20 }, // 0: Classic
    { BAC: 60, ACB: 40, BAD: 80, ABD: 50, target: 30 }, // 1: Variant 2
    { BAC: 50, ACB: 50, BAD: 80, ABD: 60, target: 30 }  // 2: Variant 3
];

let currentVariant = 0;

// --- STORYLINES (checkbox reveal order) ---
const storylineGeo = [
    'cb_AB', 'cb_BAC', 'cb_AC', 'cb_ACB', 'cb_ABC', 'cb_AD',
    'cb_ABD', 'cb_BD', 'cb_DBC', 'cb_ADB', 'cb_CD', 'cb_DCA',
    'cb_DE', 'cb_AEB', 'cb_EP', 'cb_P', 'cb_AEP', 'cb_BEP'
];

const storylineTri = [
    'cb_AB', 'cb_BAC', 'cb_AC', 'cb_ACB', 'cb_ABC', 'cb_AD',
    'cb_ABD', 'cb_BD', 'cb_DBC', 'cb_ADB', 'cb_CD', 'cb_DCA',
    'cb_tri_ABD', 'cb_tri_ABC', 'cb_tri_BCD'
];

// --- APP STATE ---
let storyline = storylineGeo;
let currentStep = 0;