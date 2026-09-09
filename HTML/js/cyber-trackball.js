/**
 * CyberTrackball — the one trackball feel for every 3D lab.
 *
 * The numbers below are the reference tuning from orbitals.html and
 * koerper.html. They are deliberately NOT configurable: a lab whose rotation
 * feels different from the others is a bug, not a feature. Only the camera
 * distance limits differ per lab, because scene scale does.
 *
 * `staticMoving: false` plus `dynamicDampingFactor: 0.14` is the part that
 * matters most — without damping every mouse jitter goes straight to the
 * camera. The render loop must call `controls.update()` on every frame for
 * the damping to settle.
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
 */
const CyberTrackball = {

    /** The reference feel. Do not retune per lab. */
    TUNING: {
        rotateSpeed: 1.3,
        zoomSpeed: 1.05,
        panSpeed: 0.32,
        staticMoving: false,
        dynamicDampingFactor: 0.14,
    },

    /**
     * Stage width the tuning above was made for — the average of the two
     * reference labs (koerper ~860 px, orbitals ~990 px at Doc's window).
     *
     * TrackballControls normalises a drag against HALF the canvas width, so
     * rotateSpeed and panSpeed are per-canvas, not per-pixel: measured, the
     * same 100 px gesture turned the camera 53.7 deg in koerper (858 px) but
     * 77.7 deg in vektoren (593 px, the theory column eats the stage) —
     * exactly the inverse width ratio. Scaling both speeds with the canvas
     * gives every lab the same degrees per pixel, and it is what makes a
     * narrow phone stage usable at all.
     */
    REFERENCE_WIDTH: 920,

    /** Speed limits, so a collapsed or oversized stage cannot go silly. */
    SCALE_RANGE: [0.5, 2.0],

    /**
     * Apply the standard tuning to an existing TrackballControls instance.
     * `minDistance` / `maxDistance` are the per-lab exception and are only
     * touched when given.
     */
    tune(controls, opts = {}) {
        Object.assign(controls, CyberTrackball.TUNING);
        if (opts.minDistance !== undefined) controls.minDistance = opts.minDistance;
        if (opts.maxDistance !== undefined) controls.maxDistance = opts.maxDistance;

        // Re-derive the width-dependent speeds whenever the stage is measured.
        // handleResize() is what every lab already calls on window resize, so
        // hooking it keeps the feel right across layout changes too.
        const scaleToWidth = () => {
            const w = controls.screen && controls.screen.width;
            if (!(w > 0)) return;                       // stage still collapsed
            const [lo, hi] = CyberTrackball.SCALE_RANGE;
            const f = Math.max(lo, Math.min(hi, w / CyberTrackball.REFERENCE_WIDTH));
            controls.rotateSpeed = CyberTrackball.TUNING.rotateSpeed * f;
            controls.panSpeed = CyberTrackball.TUNING.panSpeed * f;
            // zoomSpeed stays put: the wheel delta is not screen-normalised
        };
        if (typeof controls.handleResize === 'function') {
            const measure = controls.handleResize.bind(controls);
            controls.handleResize = () => { measure(); scaleToWidth(); };
            controls.handleResize();                    // cheap, safe to call twice
        }
        return controls;
    },

    /** Build a TrackballControls with the standard tuning already applied. */
    make(TrackballControls, camera, domElement, opts = {}) {
        return CyberTrackball.tune(new TrackballControls(camera, domElement), opts);
    },
};

window.CyberTrackball = CyberTrackball;
