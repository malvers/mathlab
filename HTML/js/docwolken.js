/**
 * DocWolken - real satellite clouds on a 3D globe, played as a time-lapse of the last hours.
 *
 * Clouds: EUMETSAT "Geostationary Ring IR10.8 µm Image - Multimission", WMS layer
 * mumi:worldcloudmap_ir108 on view.eumetsat.int. One global picture every 3 hours, stitched
 * from the geostationary ring (Meteosat 0°, Meteosat IODC, GOES-East/-West, Himawari),
 * archive back to 2021, CORS open, no key, about ±80° latitude. The infrared channel measures
 * heat, so the clouds are there on the night side as well. One WMS GetMap per frame gives the
 * whole world as an equirectangular JPEG (EPSG:4326); only its grey value is kept, as a
 * one-channel texture (2 MB per frame at 2048×1024 instead of 8 MB RGBA).
 *
 * Why not RainViewer: its free API dropped the satellite layer (satellite.infrared is empty,
 * checked 14.11.2026). Why not NASA GIBS: its geostationary layers are 10-minute fresh but
 * cover only GOES and Himawari - Europe and Africa (Meteosat) are missing.
 *
 * Earth: NASA Blue Marble (day), Black Marble (city lights) and a water mask for the sun glint,
 * the copies three-globe ships on unpkg (version pinned, CORS open, as worldclock uses them).
 *
 * Rotation: CyberTrackball like every 3D lab, with its shared idle turn. The globe never moves;
 * the camera does, so the sun direction can stay in world = earth-fixed coordinates.
 */
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('[docwolken] ' + m); };

// ---------------------------------------------------------------- sources
const EUM_WMS = 'https://view.eumetsat.int/geoserver/wms';
const EUM_LAYER = 'mumi:worldcloudmap_ir108';
// layer-scoped capabilities: 6 KB instead of the 280 KB of the whole server
const EUM_CAPS = 'https://view.eumetsat.int/geoserver/mumi/worldcloudmap_ir108/ows?service=WMS&version=1.3.0&request=GetCapabilities';
const EARTH_IMG = 'https://unpkg.com/three-globe@2.27.0/example/img/';

const HOUR = 3600e3;
const STEP = 3 * HOUR;                 // the composite comes every 3 hours
const MAX_PARALLEL = 3;                // EUMETSAT delays more than ~20 requests per window
const REFRESH_MS = 10 * 60e3;          // look for a new frame every 10 minutes
const lowMemory = (navigator.deviceMemory || 8) <= 2;
const CLOUD_W = lowMemory ? 1024 : 2048;
const CLOUD_H = CLOUD_W / 2;

const SPEEDS = [0.5, 1, 2, 3, 6];      // hours of satellite time per second
const RANGES = [24, 48, 72];           // hours back from the newest frame
const VIEWS = [                        // quick jumps: [label, lat, lon]
    ['EUROPA', 50, 10], ['AFRIKA', 5, 20],
    ['ASIEN', 35, 95], ['AUSTRALIEN', -25, 135],
    ['AMERIKA', 20, -85], ['PAZIFIK', 0, -160],
];

// ---------------------------------------------------------------- state
let speedI = 2;
let rangeH = 48;
let playing = false;
let userTouchedTime = false;           // once the viewer scrubs or pauses, no more autoplay
let holdUntil = 0;                     // pause on the newest frame before the loop restarts
let viewT = 0;                         // the moment on screen (ms, UTC)
let latestT = 0;                       // newest frame the server announces
let frames = [];                       // the current range, ascending: {t, state, tex}
const cache = new Map();               // t -> frame, survives range changes
let active = 0;                        // requests in flight
const show = { clouds: true, dayNight: true, lights: true, spin: true, opacity: 1, clarity: 0.8 };
let cloudFade = 0;                     // fades the first frame in instead of popping it on

// ---------------------------------------------------------------- renderer, camera, controls
const canvas = document.getElementById('canvas');
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);   // the stage gradient (dark blue, never black) shows through
const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);

/** Unit vector of a place, matching THREE.SphereGeometry's UVs (u = 0 is 180° W, v = 1 north). */
function dirOf(latDeg, lonDeg) {
    const la = latDeg * Math.PI / 180, lo = lonDeg * Math.PI / 180;
    return new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
}

const START_DIST = 3.6;
camera.position.copy(dirOf(VIEWS[0][1], VIEWS[0][2]).multiplyScalar(START_DIST));
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);

const controls = CyberTrackball.make(TrackballControls, camera, canvas, { minDistance: 1.6, maxDistance: 9 });
controls.noPan = true;                 // a globe off-centre helps nobody
controls.autoRotate = show.spin;
controls.autoRotateSpeed = 0.5;        // one turn in two minutes (2.0 would be 30 s)

function resize() {
    const r = container.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole globe on a portrait phone: there the HORIZONTAL field is held at 35°
    const aspect = w / h;
    camera.fov = aspect < 1 ? Math.min(75, 2 * Math.atan(Math.tan(17.5 * Math.PI / 180) / aspect) * 180 / Math.PI) : 35;
    camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);
resize();

// ---------------------------------------------------------------- shaders
const VERT = /* glsl */`
    varying vec2 vUv;
    varying vec3 vN;
    varying vec3 vW;
    void main() {
        vUv = uv;
        vN = normalize(mat3(modelMatrix) * normal);
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
    }`;

// IR grey value -> cloud, shared by the cloud layer and the cloud shadows on the ground.
// Warm ground is dark, cold cloud tops are bright. The clear-sky ground gets colder (brighter)
// towards the poles, so the threshold rises with latitude - measured on a frame of 14.11.2026:
// the 5 % quantile is about 0.25 in the tropics, 0.31 at 30-60° and 0.44 at 60-75°.
// 'clarity' (the slider "Wolken-Deutlichkeit") leaves the threshold where it is (lowering it
// greyed out the cold continents at night) and makes the ramp steep instead, plus whiter tops
// and relief: a thin cloud turns white instead of laying a grey veil over the ground,
// and what stays below the threshold stays fully clear. Grey values are blended BEFORE the
// threshold, so between two frames a cloud grows or shrinks instead of showing up twice.
const CLOUD_FN = /* glsl */`
    uniform sampler2D cloudA, cloudB;
    uniform float mixAB, clarity;
    uniform vec2 texel;
    float cloudGrey(vec2 cuv) {
        return mix(texture2D(cloudA, cuv).r, texture2D(cloudB, cuv).r, mixAB);
    }
    float cloudBase(float lat) {
        return 0.26 + 0.19 * smoothstep(15.0, 70.0, abs(lat));
    }
    // bias: extra threshold for land on the night side - a winter night cools the continents
    // until they look like low cloud in the infrared (the US in November turned grey without it)
    float cloudAlpha(float g, float lat, float bias) {
        float lo = cloudBase(lat) + 0.05 + bias;
        float hi = lo + mix(0.20, 0.07, clarity);
        float a = smoothstep(lo, hi, g);
        return a * (1.0 - smoothstep(70.0, 78.0, abs(lat)));   // the ring ends near 80°, fade before the ragged edge
    }
    float landNightBias(float water, float ndl) {
        return (1.0 - water) * (1.0 - smoothstep(-0.25, 0.15, ndl)) * 0.035;
    }
    // the local east and north on the unit sphere (the data stops at 80°, so the pole never bites)
    vec3 eastAt(vec3 n) { return normalize(cross(vec3(0.0, 1.0, 0.0), n)); }
`;

const EARTH_FRAG = /* glsl */`
    uniform sampler2D dayTex, nightTex, waterTex;
    uniform vec3 sunDir;
    uniform float dayNight, lights, ready, shadow;
    varying vec2 vUv;
    varying vec3 vN;
    varying vec3 vW;
    ${CLOUD_FN}
    void main() {
        vec3 n = normalize(vN);
        vec3 v = normalize(cameraPosition - vW);
        float ndl = dot(n, sunDir);
        vec3 day = texture2D(dayTex, vUv).rgb;
        vec3 night = texture2D(nightTex, vUv).rgb;
        float water = texture2D(waterTex, vUv).r;

        // cloud shadow: the cloud that hides the sun from this spot stands TOWARDS the sun, at
        // height h / tan(elevation). h is exaggerated about four times (0.006 = 38 km) so the
        // shadow reads as depth on a globe, and capped where the sun is very low.
        float shade = 0.0;
        if (shadow > 0.0 && ndl > 0.0) {
            float lat = (vUv.y - 0.5) * 180.0;
            vec3 e = eastAt(n);
            vec3 no = cross(n, e);
            vec3 sT = sunDir - n * ndl;
            vec3 off = sT * min(0.006 / max(ndl, 0.05), 0.035);
            vec2 d = vec2(dot(off, e) / (6.2831853 * max(cos(radians(lat)), 0.2)), dot(off, no) / 3.1415927);
            vec2 cuv = vec2(vUv.x + d.x, 1.0 - (vUv.y + d.y));
            shade = cloudAlpha(cloudGrey(cuv), lat, 0.0) * shadow * smoothstep(0.0, 0.12, ndl);
        }

        float lit = mix(1.0, smoothstep(-0.10, 0.16, ndl), dayNight);
        vec3 dayCol = day * mix(1.0, 0.30 + 0.85 * max(ndl, 0.0), dayNight) * (1.0 - 0.55 * shade);
        vec3 h = normalize(sunDir + v);
        dayCol += vec3(1.0, 0.95, 0.85) * pow(max(dot(n, h), 0.0), 45.0) * water * 0.45 * dayNight * step(0.0, ndl) * (1.0 - shade);
        vec3 nightCol = day * vec3(0.05, 0.07, 0.12) + night * vec3(1.0, 0.85, 0.6) * 1.5 * lights;
        vec3 col = mix(nightCol, dayCol, lit);
        // a thin warm band along the terminator
        col += vec3(1.0, 0.45, 0.15) * exp(-pow(ndl / 0.07, 2.0)) * 0.12 * dayNight;
        // atmosphere seen edge-on: blue rim, brighter on the day side
        float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        col += vec3(0.30, 0.60, 1.00) * rim * 0.55 * mix(1.0, smoothstep(-0.3, 0.4, ndl), dayNight);
        gl_FragColor = vec4(col * ready, 1.0);
    }`;

const CLOUD_FRAG = /* glsl */`
    uniform sampler2D waterTex;
    uniform float opacity, dayNight;
    uniform vec3 sunDir;
    varying vec2 vUv;
    varying vec3 vN;
    varying vec3 vW;
    ${CLOUD_FN}
    void main() {
        float lat = (vUv.y - 0.5) * 180.0;
        vec2 cuv = vec2(vUv.x, 1.0 - vUv.y);           // DataTexture rows run north to south
        // four bilinear taps 0.75 texel off the centre: a small tent filter that rounds the JPEG's
        // 8x8 blocks (a steep threshold would trace them as squares when zoomed in), and the same
        // taps give the slope for the relief below
        vec2 o = texel * 0.75;
        float s1 = cloudGrey(cuv + vec2( o.x,  o.y));
        float s2 = cloudGrey(cuv + vec2(-o.x,  o.y));
        float s3 = cloudGrey(cuv + vec2( o.x, -o.y));
        float s4 = cloudGrey(cuv + vec2(-o.x, -o.y));
        float g = 0.25 * (s1 + s2 + s3 + s4);
        vec3 n = normalize(vN);
        float ndl = dot(n, sunDir);
        float a = cloudAlpha(g, lat, landNightBias(texture2D(waterTex, vUv).r, ndl));
        if (a < 0.002) discard;
        float base = cloudBase(lat);
        float white = mix(0.84, 0.93, clarity) + (1.0 - mix(0.84, 0.93, clarity)) * smoothstep(base + 0.08, base + 0.40, g);

        // relief: colder = higher, so the grey value is a height map; its slope tilts the normal
        // and the sun side of a cloud tower gets brighter, the lee side darker
        vec3 e = eastAt(n);
        vec3 no = cross(n, e);
        float gx = 0.5 * ((s1 + s3) - (s2 + s4));        // towards east
        float gy = 0.5 * ((s3 + s4) - (s1 + s2));        // towards north (rows run southwards)
        vec3 nb = normalize(n - 3.0 * clarity * (gx * e + gy * no));

        float dayMix = mix(1.0, smoothstep(-0.12, 0.18, ndl), dayNight);
        float dayLight = mix(1.0, min(1.1, mix(0.62, 0.78, clarity) + 0.5 * max(dot(nb, sunDir), 0.0)), dayNight);
        // the night side keeps its clouds: infrared sees them in the dark, so they stay a cool grey -
        // brighter with more clarity, but always darker than daylight so day and night still read
        vec3 nightCol = mix(vec3(0.25, 0.29, 0.40), vec3(0.40, 0.45, 0.58), clarity);
        vec3 col = mix(nightCol, vec3(dayLight), dayMix) * white;
        col += vec3(1.0, 0.55, 0.25) * exp(-pow(ndl / 0.08, 2.0)) * 0.08 * dayNight;
        gl_FragColor = vec4(col, a * opacity);
    }`;

// the glow outside the limb: a slightly bigger sphere, back faces, additive
const ATMO_VERT = /* glsl */`
    varying vec3 vNv;
    varying vec3 vPv;
    varying vec3 vNw;
    void main() {
        vNv = normalize(normalMatrix * normal);
        vec4 p = modelViewMatrix * vec4(position, 1.0);
        vPv = p.xyz;
        vNw = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * p;
    }`;
const ATMO_FRAG = /* glsl */`
    uniform vec3 sunDir;
    uniform float dayNight, edge;
    varying vec3 vNv;
    varying vec3 vPv;
    varying vec3 vNw;
    void main() {
        float d = -dot(normalize(vNv), normalize(-vPv));   // 0 at the outer edge, about 'edge' at the limb
        float i = pow(clamp(d / edge, 0.0, 1.0), 2.2);
        float sun = mix(1.0, smoothstep(-0.45, 0.35, dot(normalize(vNw), sunDir)), dayNight);
        gl_FragColor = vec4(vec3(0.30, 0.62, 1.0) * i * (0.15 + 0.85 * sun) * 0.9, 1.0);
    }`;

// ---------------------------------------------------------------- scene objects
const blank = new THREE.DataTexture(new Uint8Array([0]), 1, 1, THREE.RedFormat, THREE.UnsignedByteType);
blank.needsUpdate = true;
const sunDir = new THREE.Vector3(1, 0, 0);

const texLoader = new THREE.TextureLoader();
let earthTexturesLeft = 3;
function earthTex(name) {
    const t = texLoader.load(EARTH_IMG + name, () => {
        if (--earthTexturesLeft === 0) { earthU.ready.value = 1; dbg('Erde geladen'); }
    }, undefined, (e) => dbg('Erdtextur fehlt: ' + name + ' ' + (e && e.message || '')));
    t.anisotropy = maxAniso;
    return t;
}
// the cloud uniforms are shared objects: the earth reads the same frames for the cloud shadows
const cloudShared = {
    cloudA: { value: blank }, cloudB: { value: blank },
    mixAB: { value: 0 }, clarity: { value: 0.8 },
    texel: { value: new THREE.Vector2(1 / CLOUD_W, 1 / CLOUD_H) },
};
const cloudU = {
    ...cloudShared,
    waterTex: null,                    // filled below with the earth's own uniform object
    opacity: { value: 0 },
    sunDir: { value: sunDir }, dayNight: { value: 1 },
};
const earthU = {
    ...cloudShared,
    shadow: { value: 0 },
    dayTex: { value: earthTex('earth-blue-marble.jpg') },
    nightTex: { value: earthTex('earth-night.jpg') },
    waterTex: { value: earthTex('earth-water.png') },
    sunDir: { value: sunDir },
    dayNight: { value: 1 },
    lights: { value: 1 },
    ready: { value: 0 },
};
earthU.ready.value = 0.12;             // a dim ball while the pictures load, not a black hole
cloudU.waterTex = earthU.waterTex;     // land/sea mask for the night-side land bias
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 160, 80),
    new THREE.ShaderMaterial({ uniforms: earthU, vertexShader: VERT, fragmentShader: EARTH_FRAG }));
scene.add(earth);


const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.006, 160, 80),
    new THREE.ShaderMaterial({ uniforms: cloudU, vertexShader: VERT, fragmentShader: CLOUD_FRAG, transparent: true, depthWrite: false }));
scene.add(clouds);

const ATMO_SCALE = 1.07;
const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(ATMO_SCALE, 96, 48),
    new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sunDir }, dayNight: { value: 1 }, edge: { value: Math.sqrt(1 - 1 / (ATMO_SCALE * ATMO_SCALE)) } },
        vertexShader: ATMO_VERT, fragmentShader: ATMO_FRAG,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    }));
scene.add(atmo);

// ---------------------------------------------------------------- sun
/** Subsolar point (low-precision almanac formulas, about 0.01° - plenty for a terminator). */
function subsolar(t) {
    const rad = Math.PI / 180;
    const d = t / 86400e3 - 10957.5;   // days since J2000.0 (2000-01-01 12:00 UTC)
    const g = (357.529 + 0.98560028 * d) * rad;
    const q = 280.459 + 0.98564736 * d;
    const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
    const e = (23.439 - 0.00000036 * d) * rad;
    const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
    const dec = Math.asin(Math.sin(e) * Math.sin(L));
    const gmst = ((18.697374558 + 24.06570982441908 * d) % 24 + 24) % 24;
    const lon = ((ra / rad - gmst * 15) % 360 + 540) % 360 - 180;
    return { lat: dec / rad, lon };
}

// ---------------------------------------------------------------- frames
function isoUtc(t) { return new Date(t).toISOString().replace('.000Z', 'Z'); }

function frameUrl(t) {
    return EUM_WMS + '?service=WMS&version=1.3.0&request=GetMap&layers=' + EUM_LAYER +
        '&styles=&crs=EPSG:4326&bbox=-90,-180,90,180&width=' + CLOUD_W + '&height=' + CLOUD_H +
        '&format=image/jpeg&time=' + isoUtc(t);
}

/** The newest time the server lists. Falls back to the last 3-hour slot that is 3.5 h old. */
async function discoverLatest() {
    try {
        const res = await fetch(EUM_CAPS, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const xml = await res.text();
        const m = xml.match(/<Dimension[^>]*name="time"[^>]*>([^<]+)</);
        if (!m) throw new Error('keine Zeitachse');
        const spec = m[1].trim();
        const last = spec.split(',').pop().trim();
        const end = last.includes('/') ? last.split('/')[1] : last;
        const t = Date.parse(end);
        if (!isFinite(t)) throw new Error('Zeit unlesbar: ' + end);
        return t;
    } catch (e) {
        dbg('Capabilities fehlgeschlagen (' + e.message + ') - rechne die Zeit selbst');
        return Math.floor((Date.now() - 3.5 * HOUR) / STEP) * STEP;
    }
}

/** Keeps only the grey value: a one-channel texture, a quarter of the memory. */
function toTexture(img) {
    const w = img.naturalWidth, h = img.naturalHeight;
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    const rgba = cx.getImageData(0, 0, w, h).data;
    const grey = new Uint8Array(w * h);
    for (let i = 0, j = 0; i < grey.length; i++, j += 4) grey[i] = rgba[j];
    const tex = new THREE.DataTexture(grey, w, h, THREE.RedFormat, THREE.UnsignedByteType);
    tex.wrapS = THREE.RepeatWrapping;            // seamless across the date line
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    renderer.initTexture(tex);                   // upload now, not as a hitch during playback
    return tex;
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const timer = setTimeout(() => { img.src = ''; reject(new Error('Zeitüberschreitung')); }, 60e3);
        img.onload = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); reject(new Error('Serverfehler')); };
        img.src = url;
    });
}

async function loadFrame(f) {
    const t0 = performance.now();
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const img = await loadImage(frameUrl(f.t));
            f.tex = toTexture(img);
            f.state = 'ok';
            dbg('Bild ' + isoUtc(f.t) + ' in ' + Math.round(performance.now() - t0) + ' ms');
            return;
        } catch (e) {
            if (attempt === 0) await new Promise(r => setTimeout(r, 2000));
            else dbg('Bild ' + isoUtc(f.t) + ' fehlt: ' + e.message);
        }
    }
    f.state = 'miss';                            // the archive has gaps (e.g. 13.11. 21 UTC)
    f.rounds = (f.rounds || 0) + 1;
}

function pump() {
    while (active < MAX_PARALLEL) {
        let f = null;
        for (let i = frames.length - 1; i >= 0; i--) if (frames[i].state === 'wait') { f = frames[i]; break; }
        if (!f) return;
        f.state = 'load';
        active++;
        loadFrame(f).then(() => { active--; onFrameDone(); pump(); });
    }
}

function buildFrames() {
    const n = rangeH / 3 + 1;
    const list = [];
    for (let i = n - 1; i >= 0; i--) {
        const t = latestT - i * STEP;
        if (!cache.has(t)) cache.set(t, { t, state: 'wait', tex: null });
        list.push(cache.get(t));
    }
    frames = list;
    pump();
    refreshStatus();
}

/**
 * The playable window: from the newest loaded frame back through frames that are done
 * (loaded or missing) - it never jumps across one that is still on its way.
 */
function playable() {
    const ok = [];
    for (let i = frames.length - 1; i >= 0; i--) {
        const f = frames[i];
        if (f.state === 'ok') ok.unshift(f);
        else if (f.state !== 'miss') { if (ok.length) break; }
    }
    return ok;
}

function onFrameDone() {
    const ok = playable();
    if (ok.length) document.getElementById('dw-loading').classList.add('done');
    // until the viewer takes over, the globe shows the newest picture there is
    if (ok.length && !userTouchedTime && !playing) viewT = ok[ok.length - 1].t;
    const allDone = frames.every(f => f.state === 'ok' || f.state === 'miss');
    if (allDone && !userTouchedTime && !playing && ok.length > 1) {
        viewT = ok[0].t;
        setPlaying(true);
    }
    refreshStatus();
}

async function refreshLatest() {
    // a miss may have been a hiccup: give it two more rounds, then it counts as an archive gap
    let retry = false;
    frames.forEach(f => { if (f.state === 'miss' && f.rounds < 3) { f.state = 'wait'; retry = true; } });
    if (retry) pump();
    const t = await discoverLatest();
    if (t > latestT) {
        const wasAtNewest = !playing && frames.length && viewT >= latestT;
        latestT = t;
        dbg('neuestes Bild ' + isoUtc(t));
        buildFrames();
        if (wasAtNewest) viewT = latestT;
    }
}

// ---------------------------------------------------------------- playback
function setPlaying(on) {
    playing = on;
    holdUntil = 0;
    const b = document.getElementById('dw-play');
    b.innerHTML = on ? ICON.pause : ICON.play;
    b.setAttribute('aria-label', on ? 'Pause' : 'Abspielen');
    if (on) {
        const ok = playable();
        if (ok.length && viewT >= ok[ok.length - 1].t - 60e3) viewT = ok[0].t;   // replay from the start
    }
}

function stepFrame(dir) {
    const ok = playable();
    if (!ok.length) return;
    userTouchedTime = true;
    setPlaying(false);
    let target = null;
    if (dir > 0) target = ok.find(f => f.t > viewT + 60e3);
    else for (let i = ok.length - 1; i >= 0; i--) if (ok[i].t < viewT - 60e3) { target = ok[i]; break; }
    if (target) viewT = target.t;
}

function toNewest() {
    const ok = playable();
    if (!ok.length) return;
    userTouchedTime = true;
    setPlaying(false);
    viewT = ok[ok.length - 1].t;
}

function advance(dt) {
    const ok = playable();
    if (!ok.length) return;
    const t0 = ok[0].t, t1 = ok[ok.length - 1].t;
    if (playing && t1 > t0) {
        const now = performance.now();
        if (holdUntil) {
            if (now >= holdUntil) { holdUntil = 0; viewT = t0; }
        } else {
            viewT += dt * SPEEDS[speedI] * HOUR;
            if (viewT >= t1) { viewT = t1; holdUntil = now + 1500; }
        }
    }
    viewT = Math.min(t1, Math.max(t0, viewT));

    // the two frames around viewT and how far between them
    let a = ok[0], b = ok[0];
    for (let i = 0; i < ok.length; i++) {
        if (ok[i].t <= viewT) a = ok[i];
        if (ok[i].t >= viewT) { b = ok[i]; break; }
    }
    cloudU.cloudA.value = a.tex;
    cloudU.cloudB.value = b.tex;
    cloudU.mixAB.value = b.t > a.t ? (viewT - a.t) / (b.t - a.t) : 0;
}

// ---------------------------------------------------------------- UI
const SVG = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="' + d + '" fill="currentColor"/></svg>';
const ICON = {
    play: SVG('M7 4.5v15l13-7.5z'),
    pause: SVG('M6 4.5h4.2v15H6zM13.8 4.5H18v15h-4.2z'),
    prev: SVG('M6 5h2.4v14H6zM20 5v14L9.5 12z'),
    next: SVG('M15.6 5H18v14h-2.4zM4 5v14l10.5-7z'),
};

const fmtDay = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });
function dayLabel(d) {
    return fmtDay.format(d).replace('.', '') + ' ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.';
}
function zoneLabel(d) {
    try {
        const p = new Intl.DateTimeFormat('de-DE', { timeZoneName: 'short' }).formatToParts(d).find(x => x.type === 'timeZoneName');
        return p ? p.value : '';
    } catch (e) { return ''; }
}
function hm(d) { return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function agoText(ms) {
    const min = Math.max(0, Math.round(ms / 60e3));
    if (min < 60) return 'vor ' + min + ' min';
    const h = Math.floor(min / 60), m = min % 60;
    return h < 10 && m ? 'vor ' + h + ' h ' + m + ' min' : 'vor ' + h + ' h';
}

let lastShown = '';
function refreshTime() {
    if (!viewT) return;
    const shownT = Math.round(viewT / (5 * 60e3)) * 5 * 60e3;   // the clock ticks in 5-minute steps
    const ok = playable();
    const onFrame = ok.some(f => Math.abs(f.t - viewT) < 60e3);
    const key = shownT + '|' + onFrame + '|' + Math.floor(Date.now() / 60e3);
    if (key !== lastShown) {
        lastShown = key;
        const d = new Date(shownT);
        document.getElementById('dw-day').textContent = dayLabel(d);
        CyberClock.digits('dw-clock', hm(d));
        document.getElementById('dw-zone').textContent = zoneLabel(d);
        document.getElementById('dw-ago').textContent = (onFrame ? 'Satellitenbild · ' : 'überblendet · ') + agoText(Date.now() - viewT);
    }
    if (ok.length > 1) {
        const t0 = ok[0].t, t1 = ok[ok.length - 1].t;
        const v = Math.round((viewT - t0) / (t1 - t0) * 1000);
        if (scrub.value != v && !scrubbing) scrub.value = v;
    }
}

function refreshStatus() {
    const el = document.getElementById('dw-status');
    if (!el) return;
    const ok = frames.filter(f => f.state === 'ok').length;
    const miss = frames.filter(f => f.state === 'miss');
    const newest = playable().slice(-1)[0];
    let html = 'Bilder: <b>' + ok + '</b> von ' + frames.length + ' geladen';
    if (ok + miss.length < frames.length) html += ' …';
    if (miss.length) html += '<br><span class="dw-miss">fehlt im Archiv: ' + miss.map(f => { const d = new Date(f.t); return dayLabel(d) + ' ' + hm(d); }).join(', ') + '</span>';
    if (newest) { const d = new Date(newest.t); html += '<br>neuestes: ' + dayLabel(d) + ' ' + hm(d) + ' ' + zoneLabel(d); }
    el.innerHTML = html;
}

function sliderRef(id) {
    const group = document.getElementById(id).lastElementChild;
    return { input: group.querySelector('input'), display: group.querySelector('.val-display') };
}

const scrub = document.getElementById('dw-scrub');
let scrubbing = false;

function buildPanel() {
    CyberUI.createCard('ui-container', 'Zeitraffer',
        '<div class="dw-btn-grid" style="grid-template-columns: repeat(3, 1fr);">' +
        '<button type="button" class="cyber-btn" id="dw-prev" title="Voriges Satellitenbild (Pfeil links)" aria-label="Voriges Satellitenbild">' + ICON.prev + '</button>' +
        '<button type="button" class="cyber-btn" id="dw-now" title="Neuestes Bild">JETZT</button>' +
        '<button type="button" class="cyber-btn" id="dw-next" title="Nächstes Satellitenbild (Pfeil rechts)" aria-label="Nächstes Satellitenbild">' + ICON.next + '</button></div>' +
        '<div id="dw-speed"></div><div id="dw-range"></div>' +
        '<div class="dw-status" id="dw-status"></div>',
        '#f5c242');
    document.getElementById('dw-prev').addEventListener('click', () => stepFrame(-1));
    document.getElementById('dw-next').addEventListener('click', () => stepFrame(1));
    document.getElementById('dw-now').addEventListener('click', toNewest);
    CyberUI.createSlider('dw-speed', 'Tempo', 0, SPEEDS.length - 1, speedI, 1,
        v => { speedI = Math.min(SPEEDS.length - 1, Math.max(0, Math.round(v))); },
        'var(--neon-blue)', v => String(SPEEDS[Math.min(SPEEDS.length - 1, Math.max(0, Math.round(v)))]).replace('.', ',') + ' h pro s');
    CyberUI.createRadioGroup('dw-range', 'Zeitraum', RANGES.map(h => ({ label: 'letzte ' + h + ' h', value: h })), rangeH, (h) => {
        rangeH = h;
        buildFrames();
    });

    CyberUI.createCard('ui-container', 'Ansicht',
        '<div id="dw-checks"></div><div id="dw-clarity"></div><div id="dw-opacity"></div>' +
        '<div class="dw-btn-grid" id="dw-views"></div>',
        '#f5c242');
    CyberUI.createCheckbox('dw-checks', 'Wolken', show.clouds, on => { show.clouds = on; });
    CyberUI.createCheckbox('dw-checks', 'Tag und Nacht', show.dayNight, on => { show.dayNight = on; });
    CyberUI.createCheckbox('dw-checks', 'Stadtlichter', show.lights, on => { show.lights = on; });
    CyberUI.createCheckbox('dw-checks', 'Eigenrotation', show.spin, on => { show.spin = on; controls.autoRotate = on; });
    CyberUI.createSlider('dw-clarity', 'Wolken-Deutlichkeit', 0, 100, Math.round(show.clarity * 100), 1,
        v => { show.clarity = Math.min(1, Math.max(0, v / 100)); }, 'var(--neon-blue)', v => Math.round(v) + ' %');
    CyberUI.createSlider('dw-opacity', 'Wolken-Deckkraft', 0, 100, Math.round(show.opacity * 100), 1,
        v => { show.opacity = Math.min(1, Math.max(0, v / 100)); }, 'var(--neon-blue)', v => Math.round(v) + ' %');
    const views = document.getElementById('dw-views');
    VIEWS.forEach(([label, lat, lon]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cyber-btn';
        b.textContent = label;
        b.addEventListener('click', () => flyTo(lat, lon));
        views.appendChild(b);
    });

    CyberUI.createCard('ui-container', 'Was man sieht',
        '<div class="dw-info">Die Bilder kommen von <b>geostationären Wettersatelliten</b> – Meteosat über Afrika und ' +
        'dem Indischen Ozean, GOES über Amerika, Himawari über dem Pazifik. Sie stehen in 35.786 km Höhe still über dem ' +
        'Äquator und messen die <b>Wärmestrahlung</b> bei 10,8 µm. Kalt heißt hoch: hohe Wolken sind weiß, tiefe grau, ' +
        'warmer Boden und warmes Meer bleiben dunkel. Über den Polen sehen die Satelliten zu flach hin, dort endet das Bild. ' +
        'Schatten und Relief der Wolken sind aus der Helligkeit gerechnet und überhöht, damit man die Höhe sieht.</div>' +
        '<div class="dw-info">Quelle: <a href="https://view.eumetsat.int/" target="_blank" rel="noopener">EUMETSAT View</a>, ' +
        '„Geostationary Ring IR10.8 µm Image – Multimission“, alle 3 h, © EUMETSAT. Erde: NASA Blue Marble und Black Marble.</div>' +
        '<div class="dw-info">Ziehen dreht, Mausrad oder zwei Finger zoomen. Leertaste = Abspielen / Pause, ' +
        'Pfeile = Bild für Bild.</div>',
        '#f5c242');
}

// ---------------------------------------------------------------- camera flights
let flight = null;
function flyTo(lat, lon) {
    const from = camera.position.clone();
    const dist = from.length();
    const to = dirOf(lat, lon).multiplyScalar(dist);
    if (controls.stopSpin) controls.stopSpin();
    flight = { from, to, up0: camera.up.clone(), t0: performance.now(), ms: 1400, spin: controls.autoRotate };
    controls.autoRotate = false;
}
function stepFlight(now) {
    if (!flight) return;
    const k = Math.min(1, (now - flight.t0) / flight.ms);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;     // ease in-out
    const a = flight.from.clone().normalize(), b = flight.to.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(a, b);
    const qe = new THREE.Quaternion().slerp(q, e);
    camera.position.copy(a.applyQuaternion(qe).multiplyScalar(flight.from.length()));
    camera.up.copy(flight.up0).lerp(new THREE.Vector3(0, 1, 0), e).normalize();
    camera.lookAt(0, 0, 0);
    if (k >= 1) { controls.autoRotate = flight.spin && show.spin; flight = null; }
}

// ---------------------------------------------------------------- input
document.getElementById('dw-play').innerHTML = ICON.play;
document.getElementById('dw-play').addEventListener('click', () => { userTouchedTime = true; setPlaying(!playing); });
scrub.addEventListener('input', () => {
    const ok = playable();
    if (ok.length < 2) return;
    scrubbing = true;
    userTouchedTime = true;
    if (playing) setPlaying(false);
    viewT = ok[0].t + scrub.value / 1000 * (ok[ok.length - 1].t - ok[0].t);
});
scrub.addEventListener('change', () => { scrubbing = false; });
scrub.addEventListener('pointerup', () => { scrubbing = false; });

window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;          // never swallow browser shortcuts
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;
    if (e.code === 'Space') { e.preventDefault(); userTouchedTime = true; setPlaying(!playing); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepFrame(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepFrame(1); }
});

// ---------------------------------------------------------------- loop
let lastNow = performance.now();
function frame(now) {
    const dt = Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;

    advance(dt);
    if (playable().length) cloudFade = Math.min(1, cloudFade + dt / 1.2);
    cloudU.opacity.value = show.clouds ? show.opacity * cloudFade : 0;
    clouds.visible = cloudU.opacity.value > 0.001;
    cloudShared.clarity.value = show.clarity;
    earthU.shadow.value = cloudU.opacity.value * (0.4 + 0.6 * show.clarity);

    const s = subsolar(viewT || Date.now());
    sunDir.copy(dirOf(s.lat, s.lon));
    const dn = show.dayNight ? 1 : 0;
    earthU.dayNight.value = dn;
    cloudU.dayNight.value = dn;
    atmo.material.uniforms.dayNight.value = dn;
    earthU.lights.value = show.lights ? 1 : 0;

    stepFlight(now);
    controls.update();
    renderer.render(scene, camera);
    refreshTime();
    requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- start
buildPanel();
setPlaying(false);
requestAnimationFrame(frame);
(async () => {
    latestT = await discoverLatest();
    dbg('neuestes Bild laut Server: ' + isoUtc(latestT) + ', Auflösung ' + CLOUD_W + '×' + CLOUD_H);
    viewT = latestT;
    buildFrames();
    setInterval(refreshLatest, REFRESH_MS);
})();

// a small handle for headless checks (no UI of its own)
window.DocWolken = {
    state: () => ({
        latest: latestT ? isoUtc(latestT) : null,
        view: viewT ? isoUtc(viewT) : null,
        playing,
        frames: frames.map(f => ({ t: isoUtc(f.t), s: f.state })),
        earthReady: earthU.ready.value === 1,
        mix: cloudU.mixAB.value,
        opacity: cloudU.opacity.value,
        sun: subsolar(viewT || Date.now()),
    }),
    flyTo,
    setPlaying,
};
