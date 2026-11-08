package de.docalvers.docstep;

import java.util.Random;

/**
 * Synthetic "people" for the tests: a walk is a few harmonics of the step frequency up and down, a stride
 * component (half the step frequency) sideways, some forwards, with a drifting rhythm, step-to-step amplitude
 * changes and sensor noise. The phone sits in the pocket in a random orientation that differs from walk to
 * walk, samples come at about 100 Hz with uneven timestamps, like SensorEvent.
 */
final class Synth {
    final String name;
    final double stepHz;
    final double[] up, upPhase;         // vertical harmonics 1..n of the step frequency
    final double stride, stridePhase;   // vertical at half the step frequency (left and right leg differ)
    final double[] fwd, fwdPhase;       // forwards harmonics
    final double sway, swayPhase;       // sideways at half the step frequency

    Synth(String name, long seed, double stepHz, double[] up, double stride, double[] fwd, double sway) {
        this.name = name;
        this.stepHz = stepHz;
        this.up = up;
        this.stride = stride;
        this.fwd = fwd;
        this.sway = sway;
        Random r = new Random(seed);
        upPhase = new double[up.length];
        for (int i = 0; i < up.length; i++) upPhase[i] = r.nextDouble() * 2 * Math.PI;
        fwdPhase = new double[fwd.length];
        for (int i = 0; i < fwd.length; i++) fwdPhase[i] = r.nextDouble() * 2 * Math.PI;
        stridePhase = r.nextDouble() * 2 * Math.PI;
        swayPhase = r.nextDouble() * 2 * Math.PI;
    }

    /** Raw samples: t in ns, x, y, z in m/s^2 including gravity. */
    static final class Raw {
        final long[] t;
        final float[] x, y, z;
        final int n;

        Raw(int cap) {
            t = new long[cap];
            x = new float[cap];
            y = new float[cap];
            z = new float[cap];
            n = cap;
        }

        float[][] atRate() {
            return Gait.resample3(t, x, y, z, n);
        }
    }

    /** standS of standing, walkS of walking, standS of standing again. */
    Raw record(long seed, double standS, double walkS) {
        Random r = new Random(seed);
        double[][] rot = randomRotation(r);
        double total = 2 * standS + walkS;
        int n = (int) (total * 100);
        Raw raw = new Raw(n);
        long t = 1_000_000_000L + r.nextInt(1000) * 1_000_000L;
        double phase = r.nextDouble() * 4 * Math.PI, drift = 0, amp = 1, ampTarget = 1;
        double sec = 0;
        for (int i = 0; i < n; i++) {
            double dt = 0.010 + (r.nextDouble() - 0.5) * 0.004;      // 8-12 ms
            sec += dt;
            t += Math.round(dt * 1e9);
            boolean walking = sec > standS && sec < standS + walkS;
            double v = 0, f = 0, s = 0;
            if (walking) {
                drift = 0.995 * drift + 0.002 * r.nextGaussian();     // slowly wandering rhythm, a few percent
                phase += 2 * Math.PI * stepHz * (1 + drift) * dt;
                if (r.nextDouble() < dt * stepHz) ampTarget = 1 + 0.12 * r.nextGaussian();
                amp += (ampTarget - amp) * 0.05;
                for (int k = 0; k < up.length; k++) v += up[k] * Math.cos((k + 1) * phase + upPhase[k]);
                v += stride * Math.cos(phase / 2 + stridePhase);
                for (int k = 0; k < fwd.length; k++) f += fwd[k] * Math.cos((k + 1) * phase + fwdPhase[k]);
                s = sway * Math.cos(phase / 2 + swayPhase);
                v *= amp;
                f *= amp;
                s *= amp;
            }
            double noise = walking ? 0.35 : 0.04;
            // world frame: z up (gravity + vertical), x forwards, y sideways
            double wx = f + noise * r.nextGaussian();
            double wy = s + noise * r.nextGaussian();
            double wz = Gait.G + v + noise * r.nextGaussian();
            raw.t[i] = t;
            raw.x[i] = (float) (rot[0][0] * wx + rot[1][0] * wy + rot[2][0] * wz);
            raw.y[i] = (float) (rot[0][1] * wx + rot[1][1] * wy + rot[2][1] * wz);
            raw.z[i] = (float) (rot[0][2] * wx + rot[1][2] * wy + rot[2][2] * wz);
        }
        return raw;
    }

    /** A random rotation matrix (the phone's orientation in the pocket). */
    static double[][] randomRotation(Random r) {
        double a = r.nextDouble() * 2 * Math.PI, b = Math.acos(2 * r.nextDouble() - 1), c = r.nextDouble() * 2 * Math.PI;
        double ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
        return new double[][]{
                {ca * cc - sa * cb * sc, -ca * sc - sa * cb * cc, sa * sb},
                {sa * cc + ca * cb * sc, -sa * sc + ca * cb * cc, -ca * sb},
                {sb * sc, sb * cc, cb}};
    }

    // three enrolled people and one nobody has seen
    static final Synth ANNA = new Synth("Anna", 11, 1.80, new double[]{2.5, 1.2, 0.6, 0.3}, 0.8, new double[]{1.5, 0.7}, 0.6);
    static final Synth BERT = new Synth("Bert", 22, 2.00, new double[]{1.8, 2.0, 0.4, 0.5}, 0.3, new double[]{0.8, 1.4}, 1.0);
    static final Synth CARL = new Synth("Carl", 33, 1.65, new double[]{3.2, 0.5, 1.0, 0.2}, 1.2, new double[]{2.0, 0.3}, 0.4);
    static final Synth DORA = new Synth("Dora", 44, 2.30, new double[]{1.0, 1.0, 1.5, 0.8}, 0.1, new double[]{0.5, 0.5}, 1.5);
}
