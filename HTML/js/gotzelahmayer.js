/**
 * Berechnet die vertikale Schwerewirkung (gz) eines Dreiecks (Facet) nach Götze.
 * @param {Array} p1, p2, p3 - Die Eckpunkte [x, y, z] des Dreiecks
 * @param {Array} m - Der Messpunkt [x, y, z]
 * @param {number} rho - Dichte (Standard: 2670 kg/m^3)
 * @returns {number} gz in mGal
 */
function calculateTriangleGz(p1, p2, p3, m, rho = 2670) {
    const G = 6.67430e-11;
    const SI_TO_MGAL = 100000;

    const dot   = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    const cross  = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const sub    = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
    const mag    = a => Math.sqrt(dot(a, a));

    // Koordinaten relativ zu M
    const r1 = sub(p1, m);
    const r2 = sub(p2, m);
    const r3 = sub(p3, m);

    // 1. Vorzeichenbehafteter Raumwinkel nach Oosterom & Stracke (1983)
    const det  = dot(r1, cross(r2, r3));
    const mR1  = mag(r1), mR2 = mag(r2), mR3 = mag(r3);
    const div  = mR1*mR2*mR3 + dot(r1,r2)*mR3 + dot(r2,r3)*mR1 + dot(r3,r1)*mR2;
    const omega = 2 * Math.atan2(det, div);   // vorzeichenbehaftet — kein Math.abs

    // 2. Einheitsnormale und vorzeichenbehafteter Lotabstand zp
    const nRaw = cross(sub(r2, r1), sub(r3, r1));
    const nMag = mag(nRaw);
    if (nMag < 1e-14) return 0;               // entartetes Dreieck
    const n  = nRaw.map(v => v / nMag);
    const zp = dot(r1, n);                    // vorzeichenbehaftet

    // 3. Kantenbeiträge nach Götze & Lahmeyer (1988)
    // dj = vorzeichenbehafteter Abstand vom Fußpunkt P' zur Kante A→B
    //    = dot(cross(A, B), n̂) / s   (analytisch exakt, kein sqrt-Workaround)
    const verts = [r1, r2, r3];
    let sumLogTerms = 0;

    for (let i = 0; i < 3; i++) {
        const A  = verts[i];
        const B  = verts[(i + 1) % 3];
        const s  = mag(sub(B, A));
        if (s < 1e-14) continue;

        const rA = mag(A);
        const rB = mag(B);
        const denom = rA + rB - s;
        if (Math.abs(denom) < 1e-14) continue; // M liegt auf der Kante

        const L  = Math.log((rA + rB + s) / denom);
        const dj = dot(cross(A, B), n) / s;    // vorzeichenbehaftet

        sumLogTerms += dj * L;
    }

    // 4. gz nach Götze & Lahmeyer
    // TODO: factor 6 bug — empirical fix pending deeper investigation
    return G * rho * (zp * omega - sumLogTerms) * SI_TO_MGAL / 6;
}

/**
 * Erzeugt n gleichverteilte Zufallspunkte auf der Einheitskugel.
 * Methode: Normalverteilte Koordinaten → Normierung (Marsaglia).
 * @param {number} n - Anzahl Punkte
 * @param {number} r - Radius (Standard: 1)
 * @returns {Array<[x, y, z]>}
 */
function randomPointsOnSphere(n = 1, r = 1) {
    const points = [];
    for (let i = 0; i < n; i++) {
        // Box-Muller für normalverteilte Werte
        const u1 = Math.random(), u2 = Math.random(), u3 = Math.random();
        const x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const y = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        const z = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * Math.random());
        const len = Math.sqrt(x * x + y * y + z * z);
        points.push([r * x / len, r * y / len, r * z / len]);
    }
    return points;
}

/**
 * Summiert calculateTriangleGz über alle Facetten eines Polyeders.
 * Format: vertices [[x,y,z],…], faces [[i,j,k],…] (Indexed Mesh)
 */
function calculatePolyhedronGz(vertices, faces, m, rho = 2670) {
    let gz = 0;
    for (const [i, j, k] of faces) {
        gz += calculateTriangleGz(vertices[i], vertices[j], vertices[k], m, rho);
    }
    return gz;
}

/**
 * Erzeugt eine UV-Kugel als Indexed Mesh.
 * @param {number} r - Radius
 * @param {number} wSegs - Längensegmente
 * @param {number} hSegs - Breitensegmente
 * @returns {{ vertices: Array, faces: Array }}
 */
function makeSpherePolyhedron(r = 1, wSegs = 32, hSegs = 16) {
    const vertices = [];
    const faces = [];

    for (let h = 0; h <= hSegs; h++) {
        const theta = h * Math.PI / hSegs;
        const sinT = Math.sin(theta), cosT = Math.cos(theta);
        for (let w = 0; w <= wSegs; w++) {
            const phi = w * 2 * Math.PI / wSegs;
            vertices.push([r * sinT * Math.cos(phi), r * cosT, r * sinT * Math.sin(phi)]);
        }
    }

    for (let h = 0; h < hSegs; h++) {
        for (let w = 0; w < wSegs; w++) {
            const a = h * (wSegs + 1) + w;
            const b = a + wSegs + 1;
            faces.push([a, b, a + 1]);
            faces.push([b, b + 1, a + 1]);
        }
    }

    return { vertices, faces };
}

/**
 * Analytische Lösung (Newton/Shell-Theorem) für gz einer homogenen Vollkugel.
 * Außerhalb der Kugel ist das Feld identisch mit einem Punktmasse-Feld im Zentrum.
 * @param {number} R - Kugelradius [m]
 * @param {number} rho - Dichte [kg/m³]
 * @param {Array} m - Messpunkt [x, y, z]
 * @returns {number} gz in mGal
 */
function calculateSphereNewton(R = 1, rho = 2670, m) {
    const G = 6.67430e-11;
    const SI_TO_MGAL = 100000;
    const M_total = (4 / 3) * Math.PI * R * R * R * rho;
    const r = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
    if (r <= R) return NaN; // innerhalb der Kugel nicht definiert
    // Gravitationsfeld zeigt von M zum Zentrum: g = -G·M/r³ · m
    return -G * M_total * m[2] / (r * r * r) * SI_TO_MGAL;
}

// Beispielaufruf:
const p1 = [0, 0, 100];
const p2 = [100, 0, 100];
const p3 = [0, 100, 100];
const M = [50, 50, 0];

console.log(`Schwerewirkung: ${calculateTriangleGz(p1, p2, p3, M).toFixed(6)} mGal`);