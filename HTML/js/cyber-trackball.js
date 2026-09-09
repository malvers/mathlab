/**
 * CyberTrackball — the SGI trackball feel for every 3D lab.
 *
 * This is a rebuild of what Silicon Graphics shipped around 1994, because
 * three.js' own TrackballControls is not a trackball at all. Its rotation is
 * flat: the axis is always perpendicular to the drag inside the screen plane
 * and the angle is proportional to the pixel distance. There is no ball, so
 * there is no foreshortening near the silhouette and — the part you feel most
 * — no roll. You can never twist the model around the view axis by dragging
 * near the edge, and every gesture is a little bit "screen", never "object".
 *
 * The two SGI originals this follows:
 *
 *   1. Gavin Bell's trackball.c, the one in the SGI OpenGL demos. A ball of
 *      radius 0.8 with a HYPERBOLIC SHEET draped over it: inside r/sqrt(2)
 *      the cursor sits on the sphere, outside it slides onto a hyperbola
 *      z = (r*r/2)/d that joins the sphere tangentially. Shoemake's Arcball
 *      (1992) had a hard edge there, and Bell smoothed it out — that seam is
 *      exactly where a virtual trackball normally starts to feel wrong.
 *
 *   2. Open Inventor's examiner viewer, which projects with the same surface
 *      (SbSphereSheetProjector, sphere radius 0.8f, ortho(-1,1,-1,1,-1,1))
 *      and then does two things three.js does not:
 *        - it takes the SHORTEST ARC between the two projected vectors and
 *          inverts it onto the camera, so grabbing the ball at the cursor and
 *          dragging really does carry that point along, 1:1, no damping lag;
 *        - it SPINS. Let go while still moving and the model keeps turning at
 *          the speed you threw it, until the next click. That is the SGI
 *          signature and it is most of "it felt natural".
 *
 * Where this deviates from the sources, and why:
 *
 *   - Inventor normalises x and y each against their own viewport side, so on
 *     a non-square stage its ball is an ellipse and a horizontal drag is less
 *     sensitive than a vertical one. Fine on a 1994 workstation window, wrong
 *     on vektoren's narrow theory column. Here both axes are divided by half
 *     the SHORT side, so the ball is a circle inscribed in the stage.
 *   - Coin normalises the throw to "the rotation of a 200 ms drag" and then
 *     applies it once per frame, which makes the spin rate depend on the frame
 *     rate. Here the throw keeps the angular velocity of the release gesture
 *     and is integrated over real time, so it looks the same at 30 and 120 Hz.
 *
 * Note that the ball is as big as the stage, so a smaller stage means a
 * smaller ball and therefore more degrees per pixel. That is the metaphor
 * doing its job — the ball you see is the ball you turn — and it replaces the
 * old REFERENCE_WIDTH scaling of rotateSpeed, which only existed because the
 * flat controller had no ball to be sized by. Pan is still three.js' and still
 * needs that scaling.
 *
 * Zoom, pan, touch pinch, reset and the change/start/end events all stay with
 * three.js. Only the rotation is ours.
 *
 * Usage — pass the constructor, because pages get it in different ways
 * (window.THREE, a module-local THREE object, or a bare import):
 *
 *     const controls = CyberTrackball.make(
 *         THREE.TrackballControls, camera, renderer.domElement,
 *         { minDistance: 1.2, maxDistance: 40 });
 *
 * For controls that already exist, apply the tuning in place:
 *
 *     CyberTrackball.tune(controls, { minDistance: 4, maxDistance: 140 });
 *
 * `controls.autoRotate` / `controls.autoRotateSpeed` are the shared idle turn,
 * in OrbitControls' units. The stage is measured by a ResizeObserver, so no
 * page needs to call `handleResize()` itself any more.
 *
 * Per-lab escape hatches: `controls.noRotate` (three.js' own flag) is
 * honoured, `controls.noSpin = true` keeps the throw from ever starting, and
 * `controls.stopSpin()` halts one that is running — call it from a camera
 * reset so the fresh view does not drift away.
 */
const CyberTrackball = {

    /**
     * Ball radius, in stage units where 1.0 is half the short side of the
     * stage. 0.8 is SGI's number twice over: TRACKBALLSIZE in trackball.c and
     * the sphere radius of the examiner viewer's spin projector. It leaves a
     * ring of hyperbolic sheet inside the stage, which is the roll zone.
     */
    BALL_RADIUS: 0.8,

    /** Rotation gain. 1.0 is the honest ball — the grabbed point tracks the
     *  cursor. Do not retune per lab; a lab that turns differently is a bug. */
    GAIN: 1.0,

    /**
     * Axis the idle rotation turns about, in world space. World Y, because a
     * slow idle turn about anything else looks drunk.
     */
    AUTO_ROTATE_AXIS: [0, 1, 0],

    /** The throw, straight out of the examiner viewer's doSpin(). */
    SPIN: {
        /** Samples of pointer history the throw is measured over. */
        samples: 3,
        /** s — the pointer must still have been moving this recently on release. */
        releaseWindow: 0.100,
        /** s — those samples must span less than this, or it was not a flick. */
        maxSpan: 0.300,
        /** rad per 200 ms — below this the gesture was a stop, not a throw. */
        minAngle: 0.01,
        /** 1/s. 0 is SGI: it spins until the next click. */
        decay: 0,
    },

    /**
     * Idle rotation, in the units OrbitControls used, so pages that came from
     * it keep their pace: 2.0 is one turn in 30 s. Switch it on per lab with
     * `controls.autoRotate = true` and optionally `controls.autoRotateSpeed`.
     * It pauses while the pointer is down and is integrated over real time, so
     * it does not speed up on a fast display.
     */
    AUTO_ROTATE_SPEED: 2.0,

    /** The reference feel for everything three.js still owns. */
    TUNING: {
        // rotateSpeed is deliberately absent: three.js' rotateCamera is
        // switched off below, so the property would only mislead.
        zoomSpeed: 1.05,
        panSpeed: 0.32,
        staticMoving: false,
        dynamicDampingFactor: 0.14,
    },

    /**
     * Stage width the pan tuning was made for — the average of the two
     * reference labs (koerper ~860 px, orbitals ~990 px at Doc's window).
     * three.js normalises a pan against the canvas, not against pixels, so
     * without this a narrow stage pans at a different rate.
     */
    REFERENCE_WIDTH: 920,

    /** Pan speed limits, so a collapsed or oversized stage cannot go silly. */
    SCALE_RANGE: [0.5, 2.0],

    /**
     * Apply the standard tuning and the SGI rotation to an existing
     * TrackballControls instance. `minDistance` / `maxDistance` are the
     * per-lab exception and are only touched when given.
     */
    tune(controls, opts = {}) {
        Object.assign(controls, CyberTrackball.TUNING);
        if (opts.minDistance !== undefined) controls.minDistance = opts.minDistance;
        if (opts.maxDistance !== undefined) controls.maxDistance = opts.maxDistance;

        // Re-derive the width-dependent pan speed whenever the stage is
        // measured. handleResize() is what every lab already calls on window
        // resize, so hooking it keeps the feel right across layout changes.
        const scaleToWidth = () => {
            const w = controls.screen && controls.screen.width;
            if (!(w > 0)) return;                       // stage still collapsed
            const [lo, hi] = CyberTrackball.SCALE_RANGE;
            const f = Math.max(lo, Math.min(hi, w / CyberTrackball.REFERENCE_WIDTH));
            controls.panSpeed = CyberTrackball.TUNING.panSpeed * f;
            // zoomSpeed stays put: the wheel delta is not screen-normalised
        };
        if (typeof controls.handleResize === 'function') {
            const measure = controls.handleResize.bind(controls);
            controls.handleResize = () => { measure(); scaleToWidth(); };
            controls.handleResize();                    // cheap, safe to call twice
        }

        if (!controls._cyberBall) attachBall(controls, opts.domElement);
        return controls;
    },

    /** Build a TrackballControls with the standard tuning already applied. */
    make(TrackballControls, camera, domElement, opts = {}) {
        const controls = new TrackballControls(camera, domElement);
        return CyberTrackball.tune(controls, { ...opts, domElement });
    },
};


// --- The ball itself ------------------------------------------------------

/** Seconds, monotonic. */
function now() {
    return performance.now() / 1000;
}

/**
 * Bell's tb_project_to_sphere: a sphere of radius r near the middle, a
 * hyperbolic sheet further out, meeting tangentially at d = r/sqrt(2) so the
 * surface has no seam to snag on.
 */
function projectToBall(nx, ny, r) {
    const d = Math.sqrt(nx * nx + ny * ny);
    let z;
    if (d < r * Math.SQRT1_2) {
        z = Math.sqrt(r * r - d * d);               // on the sphere
    } else {
        const t = r * Math.SQRT1_2;
        z = t * t / d;                              // on the hyperbolic sheet
    }
    return [nx, ny, z];
}

/**
 * The shortest arc taking a onto b, the way Inventor's SbRotation(v1, v2)
 * does it. Bell's trackball.c instead derives the angle from the chord,
 * 2*asin(|p1-p2|/2r), which agrees exactly on the sphere but overshoots out on
 * the sheet; the arc is the one that keeps the grabbed point under the cursor.
 */
function shortestArc(a, b) {
    const cx = a[1] * b[2] - a[2] * b[1];
    const cy = a[2] * b[0] - a[0] * b[2];
    const cz = a[0] * b[1] - a[1] * b[0];
    const s = Math.sqrt(cx * cx + cy * cy + cz * cz);
    if (s < 1e-9) return null;                      // no motion, or exactly antipodal
    const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return { axis: [cx / s, cy / s, cz / s], angle: Math.atan2(s, dot) };
}

/**
 * Camera basis in world space: z out of the screen towards the camera, x to
 * the right, y up. The ball lives in this frame — Inventor sets the
 * projector's working space to the camera orientation for the same reason.
 */
function cameraBasis(controls) {
    const cam = controls.object, t = controls.target;
    let zx = cam.position.x - t.x, zy = cam.position.y - t.y, zz = cam.position.z - t.z;
    const zl = Math.sqrt(zx * zx + zy * zy + zz * zz);
    if (zl < 1e-9) return null;
    zx /= zl; zy /= zl; zz /= zl;

    const u = cam.up;
    let xx = u.y * zz - u.z * zy, xy = u.z * zx - u.x * zz, xz = u.x * zy - u.y * zx;
    const xl = Math.sqrt(xx * xx + xy * xy + xz * xz);
    if (xl < 1e-6) return null;                     // looking straight along up
    xx /= xl; xy /= xl; xz /= xl;

    return {
        x: [xx, xy, xz],
        y: [zy * xz - zz * xy, zz * xx - zx * xz, zx * xy - zy * xx],
        z: [zx, zy, zz],
    };
}

/** Camera-space vector to world space. */
function toWorld(basis, a) {
    return [
        basis.x[0] * a[0] + basis.y[0] * a[1] + basis.z[0] * a[2],
        basis.x[1] * a[0] + basis.y[1] * a[1] + basis.z[1] * a[2],
        basis.x[2] * a[0] + basis.y[2] * a[1] + basis.z[2] * a[2],
    ];
}

/**
 * Turn the camera about a world axis through the target, Rodrigues style.
 * This is Inventor's reorientCamera: the focal point stays put and the whole
 * camera frame — eye vector and up — swings around it.
 */
function turnCamera(controls, axis, angle) {
    const cam = controls.object, t = controls.target;
    const c = Math.cos(angle), s = Math.sin(angle), k = 1 - c;
    const kx = axis[0], ky = axis[1], kz = axis[2];

    const spin = (x, y, z) => {
        const dot = kx * x + ky * y + kz * z;
        return [
            x * c + (ky * z - kz * y) * s + kx * dot * k,
            y * c + (kz * x - kx * z) * s + ky * dot * k,
            z * c + (kx * y - ky * x) * s + kz * dot * k,
        ];
    };

    const e = spin(cam.position.x - t.x, cam.position.y - t.y, cam.position.z - t.z);
    cam.position.set(t.x + e[0], t.y + e[1], t.z + e[2]);
    const up = spin(cam.up.x, cam.up.y, cam.up.z);
    cam.up.set(up[0], up[1], up[2]);
    cam.lookAt(t);
}

/**
 * Replace three.js' flat rotation with the ball, and hang the throw off the
 * update loop. Everything else on the instance is left alone.
 */
function attachBall(controls, domElement) {
    const dom = domElement || controls.domElement;
    if (!dom) return;                               // nothing to listen on
    controls._cyberBall = true;

    const doc = dom.ownerDocument || document;
    const st = {
        pointers: new Set(),
        dragging: false,
        last: null,                                 // last normalised point
        log: [],                                    // newest first: { p, t }
        axis: null,                                 // world spin axis, null = at rest
        omega: 0,                                   // rad/s
        clock: 0,
        seen: null,                                 // where we last left the camera
    };

    /**
     * Remember where we left the camera, so that a lab moving it behind our
     * back can be told apart from our own turning. Every camera reset in the
     * labs — Escape in orbitals, the reset buttons in koerper and gravitation —
     * writes camera.position directly, and a spin still running would then
     * quietly drift the fresh view away. Noticing it here means no lab has to
     * remember to call stopSpin().
     */
    const remember = () => {
        const p = controls.object.position;
        st.seen = [p.x, p.y, p.z];
    };
    const movedElsewhere = () => {
        if (!st.seen) return false;
        const p = controls.object.position;
        const dx = p.x - st.seen[0], dy = p.y - st.seen[1], dz = p.z - st.seen[2];
        const scale = Math.max(1, st.seen[0] ** 2 + st.seen[1] ** 2 + st.seen[2] ** 2);
        return (dx * dx + dy * dy + dz * dz) > 1e-10 * scale;
    };

    /**
     * Pointer to ball coordinates. Both axes are divided by half the short
     * side, so the ball is a circle inscribed in the stage rather than
     * Inventor's viewport-shaped ellipse. y is flipped: screen y grows down.
     */
    const normalise = (ev) => {
        const s = controls.screen;
        if (!s || !(s.width > 0) || !(s.height > 0)) return null;
        const k = 0.5 * Math.min(s.width, s.height);
        return [
            (ev.pageX - s.left - s.width * 0.5) / k,
            (s.top + s.height * 0.5 - ev.pageY) / k,
        ];
    };

    const stopSpin = () => { st.axis = null; st.omega = 0; };

    /** One drag step: turn the camera by the inverse of the ball's rotation. */
    const drag = (from, to) => {
        const basis = cameraBasis(controls);
        if (!basis) return;
        const r = CyberTrackball.BALL_RADIUS;
        const arc = shortestArc(
            projectToBall(from[0], from[1], r),
            projectToBall(to[0], to[1], r));
        if (!arc) return;
        // The ball turns by +angle under the cursor, so the camera goes the
        // other way — Inventor writes this as r.invert() before reorientCamera.
        turnCamera(controls, toWorld(basis, arc.axis), -arc.angle * CyberTrackball.GAIN);
        remember();
    };

    /** doSpin(): decide whether the release was a throw, and how fast. */
    const startSpin = () => {
        const S = CyberTrackball.SPIN;
        const L = st.log;
        if (controls.noSpin || L.length < S.samples) return;
        if (now() - L[0].t >= S.releaseWindow) return;      // pointer had already stopped
        const span = L[0].t - L[S.samples - 1].t;
        if (!(span > 0) || span >= S.maxSpan) return;       // too slow to be a flick

        const basis = cameraBasis(controls);
        if (!basis) return;
        const r = CyberTrackball.BALL_RADIUS;
        const oldest = L[S.samples - 1].p, newest = L[0].p;
        const arc = shortestArc(
            projectToBall(oldest[0], oldest[1], r),
            projectToBall(newest[0], newest[1], r));
        if (!arc) return;
        if (arc.angle * (0.200 / span) <= S.minAngle) return;   // Coin's own test

        st.axis = toWorld(basis, arc.axis);
        st.omega = arc.angle / span;                // carry on at the release speed
        st.clock = now();
        remember();
    };

    const onPointerDown = (ev) => {
        st.pointers.add(ev.pointerId);
        stopSpin();                                 // a click always parks the model
        if (st.pointers.size > 1) { st.dragging = false; return; }   // pinch is three.js'
        if (controls.enabled === false || controls.noRotate) return;
        if (ev.pointerType === 'mouse' && ev.button !== 0) return;   // pan/dolly are three.js'
        const p = normalise(ev);
        if (!p) return;
        st.dragging = true;
        st.last = p;
        st.log = [{ p, t: now() }];
    };

    const onPointerMove = (ev) => {
        if (!st.dragging) return;
        if (controls.enabled === false || controls.noRotate) return;
        const p = normalise(ev);
        if (!p) return;
        drag(st.last, p);
        st.last = p;
        st.log.unshift({ p, t: now() });
        if (st.log.length > CyberTrackball.SPIN.samples) {
            st.log.length = CyberTrackball.SPIN.samples;
        }
    };

    const onPointerUp = (ev) => {
        st.pointers.delete(ev.pointerId);
        if (!st.dragging) return;
        st.dragging = false;
        startSpin();
    };

    // TrackballControls only knows the stage size it was told about, and
    // unlike OrbitControls it needs handleResize() whenever that changes.
    // Watching the element here means no page has to remember to call it —
    // and a stage that starts hidden (vektoren's figures) picks up its size
    // the moment it is shown.
    let observer = null;
    if (typeof ResizeObserver === 'function' && typeof controls.handleResize === 'function') {
        observer = new ResizeObserver(() => controls.handleResize());
        observer.observe(dom);
    }

    dom.addEventListener('pointerdown', onPointerDown);
    doc.addEventListener('pointermove', onPointerMove);
    doc.addEventListener('pointerup', onPointerUp);
    doc.addEventListener('pointercancel', onPointerUp);

    // three.js' own rotation is off from here on; ours has already run by the
    // time update() is called, so update() only has to zoom, pan and clamp.
    controls.rotateCamera = function () {};

    const baseUpdate = controls.update.bind(controls);
    controls.update = function () {
        const t = now();

        if (st.axis && movedElsewhere()) stopSpin();     // the lab repositioned us
        if (st.axis) {
            let dt = t - st.clock;
            st.clock = t;
            if (dt > 0.1) dt = 0.1;                 // tab was in the background
            const decay = CyberTrackball.SPIN.decay;
            if (decay > 0) st.omega *= Math.exp(-decay * dt);
            if (st.omega < 1e-4) stopSpin();
            else turnCamera(controls, st.axis, -st.omega * dt);
        }

        // Idle rotation. OrbitControls turned 2*PI/60/60 rad per frame, so at
        // 60 Hz its speed 1.0 is 2*PI/60 rad per second; matching that keeps
        // every lab turning at the pace it always did. It pauses under the
        // pointer, exactly as OrbitControls paused while dragging.
        if (controls.autoRotate && !st.dragging) {
            let dt = t - (st.autoClock ?? t);
            if (dt > 0.1) dt = 0.1;
            const speed = controls.autoRotateSpeed ?? CyberTrackball.AUTO_ROTATE_SPEED;
            // Negative about world Y: OrbitControls' autoRotate lowered the
            // azimuth, which walks the camera the other way round.
            turnCamera(controls, CyberTrackball.AUTO_ROTATE_AXIS,
                       -(Math.PI * 2 / 60) * speed * dt);
        }
        st.autoClock = t;

        baseUpdate();
        remember();
    };

    const baseReset = controls.reset.bind(controls);
    controls.reset = function () { stopSpin(); baseReset(); };

    const baseDispose = controls.dispose.bind(controls);
    controls.dispose = function () {
        stopSpin();
        if (observer) { observer.disconnect(); observer = null; }
        dom.removeEventListener('pointerdown', onPointerDown);
        doc.removeEventListener('pointermove', onPointerMove);
        doc.removeEventListener('pointerup', onPointerUp);
        doc.removeEventListener('pointercancel', onPointerUp);
        baseDispose();
    };

    /** Park the model — call this from a camera reset. */
    controls.stopSpin = stopSpin;
    controls.isSpinning = () => st.axis !== null;
}

window.CyberTrackball = CyberTrackball;
