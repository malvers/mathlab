/**
 * dice3d.js - real rounded dice with numbers on their faces, turned by hand.
 *
 * One small WebGL stage per die. Rotation is the shared SGI trackball
 * (js/cyber-trackball.js, loaded as a classic script before this module);
 * a tap without dragging calls onTap. Used by wuerfelspiel.html (the lab)
 * and wuerfel3d.html (a single die inside the Würfelspiel deck).
 *
 * The page tells the die what to show through `source()`, called every frame:
 *     { faces: [6 numbers in net order], tints: [6 CSS colours],
 *       idx: face on top, fin: face it will land on, rolling: bool,
 *       p: roll progress 0..1, anim: id of the running roll or 0 }
 * Net order is the T-shaped net of the lab and the deck: three faces on top,
 * then the column under the middle one.
 *
 * Needs an importmap for "three" and "three/addons/" (three.js 0.160, like every 3D lab).
 */
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const log = m => { try { if (window.DebugWindow) DebugWindow.log('🎲 3D ' + m); } catch (e) { } };

// Box materials run +x, -x, +y, -y, +z, -z. The net: top1 is the lid (+y), col1 its
// opposite (-y), top0/top2 the sides (-x/+x), col0 the front (+z), col2 the back (-z).
const NET_TO_MAT = [1, 2, 0, 4, 3, 5];
const MAT_TO_NET = [2, 0, 1, 4, 3, 5];
const Y = new THREE.Vector3(0, 1, 0);

// Normal, texture "up" and texture "right" of every box face, measured on a plain box
const FRAMES = (() => {
    const ref = new THREE.BoxGeometry(1, 1, 1);
    const pos = ref.attributes.position, uv = ref.attributes.uv, nor = ref.attributes.normal;
    return ref.groups.map(g => {
        const ids = [0, 1, 2].map(k => ref.index.getX(g.start + k));
        const P = ids.map(i => new THREE.Vector3().fromBufferAttribute(pos, i));
        const U = ids.map(i => new THREE.Vector2().fromBufferAttribute(uv, i));
        const e1 = P[1].clone().sub(P[0]), e2 = P[2].clone().sub(P[0]);
        const d1 = U[1].clone().sub(U[0]), d2 = U[2].clone().sub(U[0]);
        const r = 1 / (d1.x * d2.y - d2.x * d1.y);
        const up = e2.clone().multiplyScalar(d1.x).sub(e1.clone().multiplyScalar(d2.x)).multiplyScalar(r).normalize();
        const right = e1.clone().multiplyScalar(d2.y).sub(e2.clone().multiplyScalar(d1.y)).multiplyScalar(r).normalize();
        return { n: new THREE.Vector3().fromBufferAttribute(nor, ids[0]), up, right };
    });
})();

// Orientation that puts net face idx on top, its number upright for the viewer in front
const TOP_Q = [0, 1, 2, 3, 4, 5].map(idx => {
    const f = FRAMES[NET_TO_MAT[idx]];
    const E = new THREE.Matrix4().makeBasis(f.up, f.n, new THREE.Vector3().crossVectors(f.up, f.n));
    const t1 = new THREE.Vector3(0, 0, -1), t2 = new THREE.Vector3(0, 1, 0);
    const T = new THREE.Matrix4().makeBasis(t1, t2, new THREE.Vector3().crossVectors(t1, t2));
    return new THREE.Quaternion().setFromRotationMatrix(T.multiply(E.transpose()));
});

// Turn every face picture in quarter steps so it stands upright where the die comes to
// rest: side faces read with world up, the lid reads away from the viewer.
// Texture.rotation t shows the picture's up along -sin(t)*right + cos(t)*up.
function uprightFaces(materials, restQ) {
    const inv = restQ.clone().invert();
    materials.forEach((mat, i) => {
        if (!mat.map) return;
        const f = FRAMES[i];
        const ny = f.n.clone().applyQuaternion(restQ).y;
        const want = (ny > 0.7 ? new THREE.Vector3(0, 0, -1) : ny < -0.7 ? new THREE.Vector3(0, 0, 1) : Y.clone()).applyQuaternion(inv);
        let best = 0, bestDot = -2;
        for (let k = 0; k < 4; k++) {
            const t = k * Math.PI / 2;
            const d = f.right.clone().multiplyScalar(-Math.sin(t)).add(f.up.clone().multiplyScalar(Math.cos(t))).dot(want);
            if (d > bestDot) { bestDot = d; best = t; }
        }
        mat.map.center.set(0.5, 0.5);
        mat.map.rotation = best;
    });
}

// dark = the lab (saturated colours, white numbers), light = the deck (pastel tints, ink numbers)
// The light rig belongs to the style: pastel faces wash out to white under the lab's light.
const STYLES = {
    dark: { shade: 'rgba(8, 18, 38, 0.30)', frame: 'rgba(255, 255, 255, 0.22)', ink: '#ffffff', inkShadow: 'rgba(0, 0, 0, 0.30)',
            light: { ambient: 0.5, hemi: 0.6, head: 2.2, env: 0.9, clearcoat: 0.55 } },
    light: { shade: null, frame: 'rgba(14, 36, 78, 0.16)', ink: '#0E244E', inkShadow: null,
             light: { ambient: 0.35, hemi: 0.35, head: 1.5, env: 0.42, clearcoat: 0.35 } }
};

let fontGen = 0;
document.fonts.load('300px KaTeX_Main').then(() => { fontGen++; }).catch(() => { });

function faceTexture(value, color, style) {
    const st = STYLES[style] || STYLES.dark;
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = color;
    g.fillRect(0, 0, 512, 512);
    if (st.shade) { g.fillStyle = st.shade; g.fillRect(0, 0, 512, 512); }
    g.strokeStyle = st.frame;
    g.lineWidth = 9;
    g.beginPath();
    g.roundRect(74, 74, 364, 364, 56);
    g.stroke();
    const txt = String(value);
    g.font = '300px KaTeX_Main, "Times New Roman", serif';
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    if (st.inkShadow) { g.fillStyle = st.inkShadow; g.fillText(txt, 263, 365); }
    g.fillStyle = st.ink;
    g.fillText(txt, 256, 358);
    if (value === 6 || value === 9) g.fillRect(196, 392, 120, 16);   // like real dice: a bar below 6 and 9
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
}

const HOME = new THREE.Vector3(2.3, 3.2, 3.9).normalize().multiplyScalar(4.5);
const SHADOW_FADE = 20 * Math.PI / 180;                  // turned this far from home, the floor shadow is gone

export class DieView {
    /**
     * @param parent   element the WebGL canvas goes into
     * @param opts     { source, onTap, style: 'dark'|'light', fill: canvas fills `parent` }
     */
    constructor(parent, opts) {
        this.source = opts.source;
        this.onTap = opts.onTap;
        this.style = opts.style || 'dark';
        this.fill = !!opts.fill;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setClearColor(0x000000, 0);
        const dom = this.dom = this.renderer.domElement;
        dom.className = 'ws-die3d';
        parent.appendChild(dom);

        this.scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

        this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
        this.camera.position.copy(HOME);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);

        // Doc 16.09.2026 "Licht ist nicht so dolle": a light fixed in the world leaves every side
        // turned away from it nearly black. The key light rides with the camera (a head lamp,
        // a little above and right of the eye), so whatever side faces the viewer is lit;
        // soft light from all around keeps the far sides readable.
        const rig = (STYLES[this.style] || STYLES.dark).light;
        this.scene.add(new THREE.AmbientLight(0xffffff, rig.ambient));
        this.scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb0cc, rig.hemi));
        const head = new THREE.DirectionalLight(0xffffff, rig.head);
        head.position.set(1.4, 2.0, 0);
        this.camera.add(head);

        this.materials = [0, 1, 2, 3, 4, 5].map(() => new THREE.MeshPhysicalMaterial({
            roughness: 0.34, metalness: 0.0, clearcoat: rig.clearcoat, clearcoatRoughness: 0.28, envMapIntensity: rig.env,
            emissive: new THREE.Color(0xf5c242), emissiveIntensity: 0
        }));
        this.mesh = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 6, 0.17), this.materials);
        this.scene.add(this.mesh);

        // soft contact shadow under the die
        const sc = document.createElement('canvas');
        sc.width = sc.height = 128;
        const sg = sc.getContext('2d');
        const grad = sg.createRadialGradient(64, 64, 4, 64, 64, 62);
        grad.addColorStop(0, this.style === 'light' ? 'rgba(14, 36, 78, 0.35)' : 'rgba(0, 0, 0, 0.55)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sg.fillStyle = grad;
        sg.fillRect(0, 0, 128, 128);
        this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.position.y = -0.52;
        this.scene.add(this.shadow);

        this.controls = CyberTrackball.make(TrackballControls, this.camera, dom, { minDistance: 3.2, maxDistance: 10 });
        this.controls.noPan = true;

        // a tap rolls, a drag turns
        let down = null;
        dom.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
        dom.addEventListener('pointerup', e => {
            if (!down) return;
            const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
            if (moved < 6 && performance.now() - down.t < 350 && this.onTap) this.onTap();
            down = null;
        });

        this.sig = '';
        this.size = 0;
        this.anim = 0;
        this.rollAnim = 0;
        this.restIdx = -1;
        this.restQ = TOP_Q[1].clone();
        this.glow = false;
        this.used = !!this.fill;

        if (this.fill) {
            dom.style.width = '100%';
            dom.style.height = '100%';
            dom.style.display = 'block';
            const fit = () => {
                const r = parent.getBoundingClientRect();
                const s = Math.max(24, Math.round(Math.min(r.width, r.height)));
                this.renderer.setSize(Math.round(r.width), Math.round(r.height), false);
                this.camera.aspect = r.width / Math.max(1, r.height);
                this.camera.updateProjectionMatrix();
                this.size = s;
            };
            new ResizeObserver(fit).observe(parent);
            fit();
        } else {
            dom.hidden = true;
        }
        VIEWS.add(this);
    }

    /** Lab: put the die at (x, y) in CSS px of the parent, `size` px square. */
    place(x, y, size, opts = {}) {
        this.used = true;
        const s = Math.max(24, Math.round(size));
        if (s !== this.size) {
            this.size = s;
            this.renderer.setSize(s, s, true);
            this.camera.aspect = 1;
            this.camera.updateProjectionMatrix();
        }
        this.dom.style.left = Math.round(x - s / 2) + 'px';
        this.dom.style.top = Math.round(y - s / 2) + 'px';
        this.dom.hidden = false;
        this.glow = !!opts.glow;
    }

    syncFaces(src) {
        const sig = fontGen + '|' + src.faces.join(',') + '|' + src.tints.join(';');
        if (sig === this.sig) return;
        this.sig = sig;
        this.materials.forEach((mat, i) => {
            const net = MAT_TO_NET[i];
            if (mat.map) mat.map.dispose();
            mat.map = faceTexture(src.faces[net], src.tints[net], this.style);
            mat.needsUpdate = true;
        });
        uprightFaces(this.materials, this.restQ);
    }

    frame(now) {
        const src = this.source ? this.source() : null;
        if (!src) return;
        this.syncFaces(src);

        // a new roll: the camera glides home so the result is read from the front
        if (src.anim && src.anim !== this.anim) {
            this.anim = src.anim;
            this.camFrom = this.camera.position.clone();
            this.upFrom = this.camera.up.clone();
            this.camT0 = now;
            if (this.controls.stopSpin) this.controls.stopSpin();
        }
        if (this.camT0 != null) {
            const u = Math.min(1, (now - this.camT0) / 450), e = u * u * (3 - 2 * u);
            const len = this.camFrom.length() + (HOME.length() - this.camFrom.length()) * e;
            this.camera.position.copy(this.camFrom).lerp(HOME, e).setLength(len);
            this.camera.up.copy(this.upFrom).lerp(Y, e).normalize();
            this.camera.lookAt(0, 0, 0);
            if (u >= 1) this.camT0 = null;
        }

        // the moment the die starts tumbling: pick where it lands (result on top, a random
        // quarter turn so other sides show) and stand its pictures upright for that pose
        if (src.rolling && this.rollAnim !== src.anim) {
            this.rollAnim = src.anim;
            const yaw = new THREE.Quaternion().setFromAxisAngle(Y, Math.floor(Math.random() * 4) * Math.PI / 2);
            this.restQ = yaw.multiply(TOP_Q[src.fin] || TOP_Q[1]);
            this.restIdx = src.fin;
            uprightFaces(this.materials, this.restQ);
            const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            this.spin = { axis, angle: (5 + Math.random() * 4) * Math.PI };
        } else if (!src.rolling && !src.anim && src.idx !== this.restIdx) {
            // no roll running and the die changed (new dice, reset): rest on the idle face
            this.restIdx = src.idx;
            this.restQ = (TOP_Q[src.idx] || TOP_Q[1]).clone();
            uprightFaces(this.materials, this.restQ);
        }

        if (src.rolling && this.spin) {
            const left = Math.pow(1 - src.p, 2);
            const q = new THREE.Quaternion().setFromAxisAngle(this.spin.axis, this.spin.angle * left);
            this.mesh.quaternion.copy(q.multiply(this.restQ));
            this.mesh.position.y = Math.abs(Math.sin(src.p * Math.PI * 2.5)) * (1 - src.p) * 0.5;
        } else {
            this.mesh.quaternion.copy(this.restQ);
            this.mesh.position.y = 0;
        }
        // The contact shadow is a floor, and a floor only belongs to the resting view: turned freely by hand it showed as
        // a dark patch beside or behind the die (Doc, 17.09.2026: "der Würfel hat einen Schattenboden ... das ist bei
        // freien Drehen nicht so gut"). It fades out within SHADOW_FADE of the home view and comes back when a roll
        // glides the camera home.
        const off = Math.max(this.camera.position.angleTo(HOME), this.camera.up.angleTo(Y));
        const near = Math.max(0, 1 - off / SHADOW_FADE);
        this.shadow.material.opacity = (1 - this.mesh.position.y) * near * near * (3 - 2 * near);
        this.materials.forEach(mat => { mat.emissiveIntensity = this.glow ? 0.16 : 0; });

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    refreshFaces() { this.sig = ''; }
}

// one loop for every die on the page; hidden dice cost nothing
const VIEWS = new Set();
function loop(now) {
    VIEWS.forEach(v => { if (!v.dom.hidden) v.frame(now); });
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

export function refreshAllFaces() {
    fontGen++;
    VIEWS.forEach(v => v.refreshFaces());
}

log('dice3d.js geladen (three ' + THREE.REVISION + ')');
