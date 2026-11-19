package de.docalvers.docfit;

/**
 * How loud the microphone was over the last ten seconds, in 10 ms frames, so Commands can check that "DocFit" was
 * said on its own and not inside a sentence (Commands.Loudness). Times are seconds of the audio stream since the
 * listener started, the same clock as Vosk's word times. Pure Java, tested in CommandsTest.
 */
final class LoudnessMeter implements Commands.Loudness {
    static final int RATE = 16000, FRAME = RATE / 100;   // 10 ms
    private final double[] frames;                        // mean square per frame, a ring
    private long count;                                   // frames recorded so far
    private double sum;                                   // squares of the frame being filled
    private int filled;                                   // samples in it

    LoudnessMeter(int seconds) {
        frames = new double[seconds * 100];
    }

    void add(short[] buf, int n) {
        for (int i = 0; i < n; i++) {
            double v = buf[i];
            sum += v * v;
            if (++filled == FRAME) {
                frames[(int) (count % frames.length)] = sum / FRAME;
                count++;
                sum = 0;
                filled = 0;
            }
        }
    }

    /** RMS between two moments; only what is still in the ring and already recorded counts, 0 if none of it is. */
    @Override
    public double rms(double from, double to) {
        long a = Math.max((long) Math.floor(from * 100), Math.max(0, count - frames.length));
        long b = Math.min((long) Math.ceil(to * 100), count);
        if (b <= a) return 0;
        double s = 0;
        for (long f = a; f < b; f++) s += frames[(int) (f % frames.length)];
        return Math.sqrt(s / (b - a));
    }
}
