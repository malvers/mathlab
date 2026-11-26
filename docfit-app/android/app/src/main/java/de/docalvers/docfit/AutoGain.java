package de.docalvers.docfit;

/**
 * Lifts quiet speech before it reaches the recognizer (Doc, 26.11.2026: "ich hatte auch den Eindruck, dass ich sehr
 * laut sprechen muss"). The small German model is sure of a word only when it comes in loud enough: on the silent
 * samples at a quarter of the level "DocFit Start" / "Start" were heard 16 of 30 times, at a tenth 10 of 30. With this
 * gain: 28 and 18 of 30, and at the full level still 29 of 30 - false commands 0 everywhere.
 *
 * A peak envelope: it jumps up with every louder block (no block is ever pushed over TARGET, so speech never clips)
 * and falls by half in about 2.3 s. The gain brings the envelope to TARGET, at least 1 (never quieter) and at most
 * MAX_GAIN - a higher gain also lifts a noisy room and then costs more than it brings (measured with 8: in noise the
 * hits fell from 22 to 17 of 30). The loudness check (LoudnessMeter) gets the samples before the gain, so its ratios
 * stay as they were. Pure Java, tested in AutoGainTest.
 */
final class AutoGain {
    static final double TARGET = 12000;     // peak the speech is brought to (about -9 dBFS)
    static final double MAX_GAIN = 4;
    static final double DECAY = 0.97;       // per 100 ms
    private static final int BLOCK = 1600;  // 100 ms at 16 kHz
    private double env;

    /** Applies the gain to the first {@code n} samples of {@code buf} in place and returns the gain used. */
    double apply(short[] buf, int n) {
        if (n <= 0) return 1;
        int peak = 0;
        for (int i = 0; i < n; i++) peak = Math.max(peak, Math.abs((int) buf[i]));
        env = Math.max(peak, env * Math.pow(DECAY, n / (double) BLOCK));
        double gain = env > 0 ? Math.max(1, Math.min(MAX_GAIN, TARGET / env)) : MAX_GAIN;
        if (gain == 1) return 1;
        for (int i = 0; i < n; i++) {
            long v = Math.round(buf[i] * gain);
            buf[i] = (short) Math.max(Short.MIN_VALUE, Math.min(Short.MAX_VALUE, v));
        }
        return gain;
    }
}
