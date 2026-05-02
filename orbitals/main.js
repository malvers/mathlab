import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  ORBITAL_TYPES,
  getValueAtPhiAndTheta,
  getLatexForOrbital,
} from "./orbital-math.js";

const autoRotateClock = new THREE.Clock();

const SCALE = 130;
const BG = 0x000028;
/** Referenz-Kameradistanz; 1.0× = diese Distanz (Standardansicht: Orbital gut sichtbar groß). */
const BASE_REF_CAMERA_DISTANCE = 480;
/** … Y₄,₀ 1,7; Y₄,±₁ 0,7 (|Y| gleich für ±m); Y₄,₋₂ Y₄,₋₃ 2,3; Y₄,₋₄ 2,1; L=3-Defaults: Y₃,₋₁ 0,75; Y₃,₀ 1,9; Y₃,₁ 2,5; Y₃,₃ 2,3; … bis Y₃,₋₂: 2,4; sonst 1,0. */
const ZOOM_DEFAULT_BIS_L3M_MINUS2 = 2.4;
const ZOOM_DEFAULT_L3M_MINUS1 = 0.75;
const ZOOM_DEFAULT_L3M_0 = 1.9;
const ZOOM_DEFAULT_L3M_PLUS1 = 2.5;
const ZOOM_DEFAULT_L3M_PLUS3 = 2.3;
const ZOOM_DEFAULT_L4M_MINUS4 = 2.1;
const ZOOM_DEFAULT_L4M_MINUS3 = 2.3;
const ZOOM_DEFAULT_L4M_MINUS2 = 2.3;
const ZOOM_DEFAULT_L4M_MINUS1 = 0.7;
const ZOOM_DEFAULT_L4M_0 = 1.7;
/** Y₅,₋₁: starker Rückzug (sonst riesig im Bild); nötig: Kamera weit / hohe maxDistance. */
const ZOOM_DEFAULT_L5M_MINUS1 = 0.05;
const ORBITAL_INDEX_BIS_L3M_MINUS2 = ORBITAL_TYPES.findIndex((t) => t.id === "L3M_MINUS2");
const ORBITAL_INDEX_L3M_MINUS1 = ORBITAL_TYPES.findIndex((t) => t.id === "L3M_MINUS1");
const ORBITAL_INDEX_L3M_0 = ORBITAL_TYPES.findIndex((t) => t.id === "L3M_0");
const ORBITAL_INDEX_L3M_PLUS1 = ORBITAL_TYPES.findIndex((t) => t.id === "L3M_PLUS1");
const ORBITAL_INDEX_L3M_PLUS3 = ORBITAL_TYPES.findIndex((t) => t.id === "L3M_PLUS3");
const ORBITAL_INDEX_L4M_MINUS4 = ORBITAL_TYPES.findIndex((t) => t.id === "L4M_MINUS4");
const ORBITAL_INDEX_L4M_MINUS3 = ORBITAL_TYPES.findIndex((t) => t.id === "L4M_MINUS3");
const ORBITAL_INDEX_L4M_MINUS2 = ORBITAL_TYPES.findIndex((t) => t.id === "L4M_MINUS2");
const ORBITAL_INDEX_L4M_MINUS1 = ORBITAL_TYPES.findIndex((t) => t.id === "L4M_MINUS1");
const ORBITAL_INDEX_L4M_PLUS1 = ORBITAL_TYPES.findIndex((t) => t.id === "L4M_PLUS1");
const ORBITAL_INDEX_L4M_0 = ORBITAL_TYPES.findIndex((t) => t.id === "L4M_0");
const ORBITAL_INDEX_L5M_MINUS1 = ORBITAL_TYPES.findIndex((t) => t.id === "L5M_MINUS1");

function defaultCameraDistance(orbitalIndex) {
  if (ORBITAL_INDEX_BIS_L3M_MINUS2 >= 0 && orbitalIndex <= ORBITAL_INDEX_BIS_L3M_MINUS2) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_BIS_L3M_MINUS2;
  }
  if (ORBITAL_INDEX_L3M_MINUS1 >= 0 && orbitalIndex === ORBITAL_INDEX_L3M_MINUS1) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L3M_MINUS1;
  }
  if (ORBITAL_INDEX_L3M_0 >= 0 && orbitalIndex === ORBITAL_INDEX_L3M_0) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L3M_0;
  }
  if (ORBITAL_INDEX_L3M_PLUS1 >= 0 && orbitalIndex === ORBITAL_INDEX_L3M_PLUS1) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L3M_PLUS1;
  }
  if (ORBITAL_INDEX_L3M_PLUS3 >= 0 && orbitalIndex === ORBITAL_INDEX_L3M_PLUS3) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L3M_PLUS3;
  }
  if (ORBITAL_INDEX_L4M_MINUS4 >= 0 && orbitalIndex === ORBITAL_INDEX_L4M_MINUS4) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L4M_MINUS4;
  }
  if (ORBITAL_INDEX_L4M_MINUS3 >= 0 && orbitalIndex === ORBITAL_INDEX_L4M_MINUS3) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L4M_MINUS3;
  }
  if (ORBITAL_INDEX_L4M_MINUS2 >= 0 && orbitalIndex === ORBITAL_INDEX_L4M_MINUS2) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L4M_MINUS2;
  }
  if (ORBITAL_INDEX_L4M_MINUS1 >= 0 && orbitalIndex === ORBITAL_INDEX_L4M_MINUS1) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L4M_MINUS1;
  }
  if (ORBITAL_INDEX_L4M_PLUS1 >= 0 && orbitalIndex === ORBITAL_INDEX_L4M_PLUS1) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L4M_MINUS1;
  }
  if (ORBITAL_INDEX_L4M_0 >= 0 && orbitalIndex === ORBITAL_INDEX_L4M_0) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L4M_0;
  }
  if (ORBITAL_INDEX_L5M_MINUS1 >= 0 && orbitalIndex === ORBITAL_INDEX_L5M_MINUS1) {
    return BASE_REF_CAMERA_DISTANCE / ZOOM_DEFAULT_L5M_MINUS1;
  }
  return BASE_REF_CAMERA_DISTANCE;
}

function applyDefaultCameraForCurrentOrbital() {
  if (!camera || !controls) return;
  const z = defaultCameraDistance(state.orbitalIndex);
  camera.up.set(0, 1, 0);
  camera.position.set(0, 0, z);
  controls.target.set(0, 0, 0);
  controls.update();
}
/** Pos. Phase: Cyan; neg. Phase bleibt Gold (#f9c247) */
const PHASE_POS = new THREE.Color(0x06b6d4);
const PHASE_NEG = new THREE.Color(0xf9c247);
const PHASE_NODE = new THREE.Color(0xe1eaf6);
const state = {
  orbitalIndex: 0,
  resolution: 180,
  specular: 32,
  opacity: 1,
  autoRotate: false,
  ambientOn: true,
  pointLightOn: true,
};

let lastFormulaZfKatex = "";

let scene, camera, renderer, controls;
let meshGroup, orbitalMesh;
let ambientLight;
/** Punktlichter an der Kamera: wandern nicht getrennt von der Blickrichtung (kein „mitdrehendes“ Studio-Licht in der Welt). */
let pointLight, pointFillLight;
let pmremGenerator;

/** Regler „Specular“: hoher Wert → glatter / mehr Glanz (niedrigere roughness). */
function roughnessFromSpecular(s) {
  const t = (Math.max(1, Math.min(256, s)) - 1) / 255;
  return THREE.MathUtils.lerp(0.5, 0.07, t);
}

function createOrbitalMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: roughnessFromSpecular(state.specular),
    metalness: 0.06,
    clearcoat: 0.72,
    clearcoatRoughness: 0.16,
    envMapIntensity: 0.58,
    transparent: state.opacity < 1,
    opacity: state.opacity,
    side: THREE.FrontSide,
  });
}

function vertexColorForSample(orbitalId, val, target) {
  const a = Math.abs(val);
  if (a < 1e-14) {
    return target.copy(PHASE_NODE);
  }
  return target.copy(val > 0 ? PHASE_POS : PHASE_NEG);
}

function buildGeometry(orbitalId, resolution) {
  const PI = Math.PI;
  const twoPI = 2 * PI;
  /** Polarwinkel θ ∈ [0,π] von der z-Achse, Azimut φ ∈ [0,2π) — wie in polarToCartesian / Y_lm. */
  const rows = resolution + 1;
  const cols = resolution;
  const positions = new Float32Array(rows * cols * 3);
  const colors = new Float32Array(rows * cols * 3);
  const tmpCol = new THREE.Color();

  let p = 0;
  let ci = 0;
  for (let i = 0; i <= resolution; i++) {
    const theta = (i / resolution) * PI;
    for (let j = 0; j < cols; j++) {
      const phi = (j / cols) * twoPI;
      const val = getValueAtPhiAndTheta(orbitalId, phi, theta);
      const r = Math.abs(val);
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      positions[p++] = x * SCALE;
      positions[p++] = y * SCALE;
      positions[p++] = z * SCALE;
      vertexColorForSample(orbitalId, val, tmpCol);
      colors[ci++] = tmpCol.r;
      colors[ci++] = tmpCol.g;
      colors[ci++] = tmpCol.b;
    }
  }

  const indices = [];
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const p1 = i * cols + j;
      const p2 = i * cols + ((j + 1) % cols);
      const p3 = (i + 1) * cols + j;
      const p4 = (i + 1) * cols + ((j + 1) % cols);
      indices.push(p1, p3, p2, p2, p3, p4);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function disposeMesh() {
  if (orbitalMesh) {
    orbitalMesh.geometry.dispose();
    orbitalMesh.material.dispose();
    meshGroup.remove(orbitalMesh);
    orbitalMesh = null;
  }
}

function rebuildOrbital() {
  const id = ORBITAL_TYPES[state.orbitalIndex].id;
  disposeMesh();
  const geo = buildGeometry(id, state.resolution);
  const mat = createOrbitalMaterial();
  orbitalMesh = new THREE.Mesh(geo, mat);
  meshGroup.add(orbitalMesh);
  applyDefaultCameraForCurrentOrbital();
  renderFormula(id);
  updateStats();
}

function renderFormula(orbitalId) {
  const el = document.getElementById("formula-tex");
  if (!el) return;
  const tex = getLatexForOrbital(orbitalId);
  if (window.katex) {
    try {
      katex.render(tex, el, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      el.textContent = tex;
    }
  } else {
    el.textContent = tex;
  }
}

/** Zoomzeile per KaTeX unter der Gleichung: \( \text{ZOOM}~… \). */
function renderFormulaZfKatex() {
  const el = document.getElementById("formula-zf");
  if (!el) return;
  const zf = cameraZoomFactor();
  const zfDe = zf.toFixed(2).replace(".", ",");
  const tex = `\\text{ZOOM}~\\text{${zfDe}}`;
  if (tex === lastFormulaZfKatex) return;
  lastFormulaZfKatex = tex;
  if (window.katex) {
    try {
      katex.render(tex, el, { throwOnError: false, displayMode: true });
    } catch {
      el.textContent = `ZOOM ${zfDe}`;
    }
  } else {
    el.textContent = `ZOOM ${zfDe}`;
  }
}

function cameraDistance() {
  if (!camera || !controls) return defaultCameraDistance(state.orbitalIndex);
  return camera.position.distanceTo(controls.target);
}

function cameraZoomFactor() {
  const d = cameraDistance();
  if (d < 1e-6) return 1;
  return BASE_REF_CAMERA_DISTANCE / d;
}

function resetCameraView() {
  if (!camera || !controls) return;
  applyDefaultCameraForCurrentOrbital();
}

function updateStats() {
  renderFormulaZfKatex();
  const zoomEl = document.getElementById("stats-zoom");
  const metaEl = document.getElementById("stats");
  if (!zoomEl && !metaEl) return;

  const d = cameraDistance();
  const zf = cameraZoomFactor();
  const zoomText = `Zoomfaktor ${zf.toFixed(2)}× · Referenz ${BASE_REF_CAMERA_DISTANCE} · Distanz ${d.toFixed(0)} · nur Bildschirmansicht, kein Maßstab und nicht vergleichbar mit Lehrbuch- oder anderen Abbildungen.`;

  if (zoomEl) zoomEl.textContent = zoomText;

  if (!orbitalMesh) {
    if (metaEl) metaEl.textContent = "";
    return;
  }

  const geo = orbitalMesh.geometry;
  const pos = geo.getAttribute("position");
  const idx = geo.getIndex();
  const verts = pos ? pos.count : 0;
  const tris = idx ? idx.count / 3 : 0;
  const id = ORBITAL_TYPES[state.orbitalIndex].id;
  const rest = [
    `${ORBITAL_TYPES[state.orbitalIndex].label} (${id})`,
    `Auflösung: ${state.resolution}`,
    `Punkte: ${verts.toLocaleString()}`,
    `Dreiecke: ${Math.floor(tris).toLocaleString()}`,
    `Specular: ${state.specular}`,
    `Opacity: ${state.opacity.toFixed(2)}`,
  ].join(" · ");

  if (metaEl) metaEl.textContent = rest;
}

function initThree() {
  const container = document.getElementById("canvas-wrap");
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);

  camera = new THREE.PerspectiveCamera(44, container.clientWidth / container.clientHeight, 0.1, 15000);
  camera.position.set(0, 0, BASE_REF_CAMERA_DISTANCE);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);

  pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envScene = new RoomEnvironment(renderer);
  scene.environment = pmremGenerator.fromScene(envScene, 0.04).texture;
  envScene.dispose();

  controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 1.3;
  controls.zoomSpeed = 1.05;
  controls.panSpeed = 0.32;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.14;
  controls.minDistance = 140;
  controls.maxDistance = 12000;
  controls.target.set(0, 0, 0);

  meshGroup = new THREE.Group();
  scene.add(meshGroup);

  ambientLight = new THREE.AmbientLight(0xf9f6ff, 0.48);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0xf9c247, 2.0, 0, 0);
  pointLight.position.set(0, 55, 250);
  camera.add(pointLight);

  pointFillLight = new THREE.PointLight(0xe1eaf6, 1.15, 0, 0);
  pointFillLight.position.set(-110, 40, 200);
  camera.add(pointFillLight);

  scene.add(new THREE.HemisphereLight(0xe1eaf6, 0x0a0d18, 0.36));

  window.addEventListener("resize", onResize);
}

function onResize() {
  const container = document.getElementById("canvas-wrap");
  if (!container || !camera || !renderer) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (controls) controls.handleResize();
}

function syncLights() {
  ambientLight.visible = state.ambientOn;
  if (pointLight) pointLight.visible = state.pointLightOn;
  if (pointFillLight) pointFillLight.visible = state.pointLightOn;
}

function tick() {
  requestAnimationFrame(tick);
  const dt = autoRotateClock.getDelta();
  if (state.autoRotate && meshGroup) {
    meshGroup.rotation.y += dt * 0.5;
  }
  controls.update();
  updateStats();
  renderer.render(scene, camera);
}

function fillOrbitalSelect() {
  const sel = document.getElementById("orbital-select");
  ORBITAL_TYPES.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${t.label} — ${t.id}`;
    sel.appendChild(opt);
  });
  sel.value = "0";
}

function wireUi() {
  document.getElementById("orbital-select").addEventListener("change", (e) => {
    state.orbitalIndex = Number(e.target.value);
    rebuildOrbital();
  });

  const res = document.getElementById("resolution");
  const resVal = document.getElementById("resolution-value");
  res.addEventListener("input", () => {
    state.resolution = Math.max(10, Math.min(1000, Number(res.value)));
    resVal.textContent = String(state.resolution);
    rebuildOrbital();
  });

  document.getElementById("specular").addEventListener("input", (e) => {
    state.specular = Math.max(1, Math.min(256, Number(e.target.value)));
    document.getElementById("specular-value").textContent = String(state.specular);
    if (orbitalMesh) {
      orbitalMesh.material.roughness = roughnessFromSpecular(state.specular);
      orbitalMesh.material.needsUpdate = true;
    }
    updateStats();
  });

  document.getElementById("opacity").addEventListener("input", (e) => {
    state.opacity = Math.max(0.1, Math.min(1, Number(e.target.value)));
    document.getElementById("opacity-value").textContent = state.opacity.toFixed(2);
    if (orbitalMesh) {
      orbitalMesh.material.opacity = state.opacity;
      orbitalMesh.material.transparent = state.opacity < 1;
      orbitalMesh.material.needsUpdate = true;
    }
    updateStats();
  });

  document.getElementById("toggle-rotate").addEventListener("click", () => {
    state.autoRotate = !state.autoRotate;
  });

  document.getElementById("toggle-ambient").addEventListener("change", (e) => {
    state.ambientOn = e.target.checked;
    syncLights();
  });

  document.getElementById("toggle-point").addEventListener("change", (e) => {
    state.pointLightOn = e.target.checked;
    syncLights();
  });

  document.getElementById("help-toggle").addEventListener("click", () => {
    const panel = document.getElementById("help-panel");
    panel.hidden = !panel.hidden;
  });

  window.addEventListener("keydown", (ev) => {
    if (ev.target.matches("input, select, textarea")) return;
    switch (ev.code) {
      case "ArrowUp": {
        ev.preventDefault();
        state.orbitalIndex = (state.orbitalIndex + 1) % ORBITAL_TYPES.length;
        document.getElementById("orbital-select").value = String(state.orbitalIndex);
        rebuildOrbital();
        break;
      }
      case "ArrowDown": {
        ev.preventDefault();
        state.orbitalIndex = (state.orbitalIndex - 1 + ORBITAL_TYPES.length) % ORBITAL_TYPES.length;
        document.getElementById("orbital-select").value = String(state.orbitalIndex);
        rebuildOrbital();
        break;
      }
      case "ArrowLeft": {
        ev.preventDefault();
        const step = ev.shiftKey ? 10 : 1;
        state.resolution = Math.max(10, state.resolution - step);
        document.getElementById("resolution").value = String(state.resolution);
        document.getElementById("resolution-value").textContent = String(state.resolution);
        rebuildOrbital();
        break;
      }
      case "ArrowRight": {
        ev.preventDefault();
        const step = ev.shiftKey ? 10 : 1;
        state.resolution = Math.min(1000, state.resolution + step);
        document.getElementById("resolution").value = String(state.resolution);
        document.getElementById("resolution-value").textContent = String(state.resolution);
        rebuildOrbital();
        break;
      }
      case "Space": {
        ev.preventDefault();
        state.autoRotate = !state.autoRotate;
        break;
      }
      case "Escape": {
        meshGroup.rotation.set(0, 0, 0);
        state.autoRotate = false;
        resetCameraView();
        break;
      }
      case "Digit1":
      case "Digit2":
      case "Digit3":
      case "Digit4":
      case "Digit5":
      case "Digit6":
      case "Digit7":
      case "Digit8":
      case "Digit9": {
        const n = Number(ev.code.replace("Digit", ""));
        state.resolution = n * 100;
        document.getElementById("resolution").value = String(state.resolution);
        document.getElementById("resolution-value").textContent = String(state.resolution);
        rebuildOrbital();
        break;
      }
      case "Digit0": {
        state.resolution = 10;
        document.getElementById("resolution").value = "10";
        document.getElementById("resolution-value").textContent = "10";
        rebuildOrbital();
        break;
      }
      case "KeyH": {
        const panel = document.getElementById("help-panel");
        panel.hidden = !panel.hidden;
        break;
      }
      default:
        break;
    }
  });
}

fillOrbitalSelect();
wireUi();
initThree();
document.getElementById("resolution").value = String(state.resolution);
document.getElementById("resolution-value").textContent = String(state.resolution);
document.getElementById("specular").value = String(state.specular);
document.getElementById("specular-value").textContent = String(state.specular);
document.getElementById("opacity").value = String(state.opacity);
document.getElementById("opacity-value").textContent = state.opacity.toFixed(2);
document.getElementById("toggle-ambient").checked = true;
document.getElementById("toggle-point").checked = true;
syncLights();
rebuildOrbital();
tick();
