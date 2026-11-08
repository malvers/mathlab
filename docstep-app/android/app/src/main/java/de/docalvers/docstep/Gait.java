package de.docalvers.docstep;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * The gait maths, plain Java without Android, so the tests run on the Mac (./gradlew test).
 *
 * Method: Frank, Mannor, Precup, "Activity and Gait Recognition with Time-Delay Embeddings" (AAAI 2010)
 * and their ECML PKDD 2011 demo, which Doc saw in Athens. A walk becomes a cloud of points by time-delay
 * embedding (Takens), PCA turns it into a person's template, and "geometric template matching" (GTM) scores
 * a new walk by how well each of its small steps through that space goes the same way as the steps of the
 * template's nearest points. Their reference code (HumanSense, MIT licence, C++ with OpenCV) is not used;
 * this is a fresh implementation of the published algorithm.
 *
 * Pipeline: raw accelerometer (any rate, uneven timestamps) -> box-averaged to RATE -> two channels that do
 * not depend on how the phone sits in the pocket (acceleration along gravity, and the size of the rest) ->
 * only the stretches where somebody walks -> embedding -> template / score.
 */
final class Gait {
    private Gait() {
    }

    static final double G = 9.80665;

    /** Analysis rate after resampling (Hz). The paper ran at about 25 Hz on a 2009 phone. */
    static final double RATE = 25;
    /** Embedding dimension m and delay tau (samples): one point spans (M-1)*TAU/RATE = 0.88 s, about a stride. */
    static final int M = 12, TAU = 2;
    /** Dimensions kept after PCA and nearest neighbours per step, as in the paper (p = 6 there, n = 4). */
    static final int P = 8, K = 4;

    /**
     * A person counts as recognised when the best template scores at least this. Chosen on the public WISDM
     * walking data (36 people, phone in the trouser pocket, 20 Hz): equal error rate there at about 0.55-0.56.
     * A first guess for the Pixel, whose sensor is cleaner: check it with Doc's own walks (the result screen
     * shows the raw score).
     */
    static final double THRESHOLD = 0.56;
    /** Width of the logistic step from score to confidence around THRESHOLD. */
    static final double CONF_WIDTH = 0.04;
    /** Softmax temperature between enrolled people (two equal scores give each 50 %). */
    static final double SHARE_TEMP = 0.03;

    // walking detector: 2.56 s windows every 0.5 s, enough movement and a clear rhythm of 0.3-1.5 s
    static final double WIN_S = 2.56, HOP_S = 0.5, STD_MIN = 1.0, AC_MIN = 0.4, LAG_MIN_S = 0.3, LAG_MAX_S = 1.5;
    static final double MIN_RUN_S = 4.0, TRIM_S = 0.5;

    // ---------------------------------------------------------------- resampling

    /**
     * Box-averages uneven samples into bins of 1/rate centred on k/rate (seconds after the first sample); an
     * empty bin is interpolated linearly between its filled neighbours. Times in nanoseconds (SensorEvent).
     */
    static float[] resample(long[] tNanos, float[] v, int n, double rate) {
        if (n == 0) return new float[0];
        long t0 = tNanos[0];
        int bins = (int) Math.floor((tNanos[n - 1] - t0) / 1e9 * rate) + 1;
        double[] sum = new double[bins];
        int[] count = new int[bins];
        for (int i = 0; i < n; i++) {
            int b = (int) Math.round((tNanos[i] - t0) / 1e9 * rate);
            if (b < 0) b = 0;
            if (b >= bins) b = bins - 1;
            sum[b] += v[i];
            count[b]++;
        }
        float[] out = new float[bins];
        int prev = -1;
        for (int b = 0; b < bins; b++) {
            if (count[b] == 0) continue;
            out[b] = (float) (sum[b] / count[b]);
            if (prev >= 0 && b - prev > 1) {
                for (int k = prev + 1; k < b; k++) {
                    float w = (k - prev) / (float) (b - prev);
                    out[k] = out[prev] * (1 - w) + out[b] * w;
                }
            } else if (prev < 0) {
                Arrays.fill(out, 0, b, out[b]);
            }
            prev = b;
        }
        return out;
    }

    /** The three axes resampled to RATE: [3][samples]. */
    static float[][] resample3(long[] t, float[] x, float[] y, float[] z, int n) {
        return new float[][]{resample(t, x, n, RATE), resample(t, y, n, RATE), resample(t, z, n, RATE)};
    }

    // ---------------------------------------------------------------- channels

    /** |a| - g per sample. */
    static float[] magnitude(float[][] xyz) {
        int n = xyz[0].length;
        float[] m = new float[n];
        for (int i = 0; i < n; i++) {
            double x = xyz[0][i], y = xyz[1][i], z = xyz[2][i];
            m[i] = (float) (Math.sqrt(x * x + y * y + z * z) - G);
        }
        return m;
    }

    /**
     * Two channels independent of how the phone lies in the pocket: the acceleration along gravity (gravity =
     * moving average over 1 s) minus g, and the size of what is left (sideways and forwards together).
     * On WISDM these two beat the plain magnitude a little (top-1 0.75 against 0.69 for 36 people).
     */
    static float[][] channels(float[][] xyz) {
        int n = xyz[0].length;
        int w = Math.max(1, (int) Math.round(RATE));
        float[][] g = new float[3][];
        for (int a = 0; a < 3; a++) g[a] = movingAverage(xyz[a], w);
        float[] vert = new float[n], hor = new float[n];
        for (int i = 0; i < n; i++) {
            double gx = g[0][i], gy = g[1][i], gz = g[2][i];
            double norm = Math.sqrt(gx * gx + gy * gy + gz * gz);
            if (norm < 1e-6) norm = 1e-6;
            gx /= norm;
            gy /= norm;
            gz /= norm;
            double x = xyz[0][i], y = xyz[1][i], z = xyz[2][i];
            double v = x * gx + y * gy + z * gz;
            double hx = x - v * gx, hy = y - v * gy, hz = z - v * gz;
            vert[i] = (float) (v - G);
            hor[i] = (float) Math.sqrt(hx * hx + hy * hy + hz * hz);
        }
        return new float[][]{vert, hor};
    }

    /** Centred moving average of width w, shrinking at the ends. */
    static float[] movingAverage(float[] x, int w) {
        int n = x.length;
        double[] c = new double[n + 1];
        for (int i = 0; i < n; i++) c[i + 1] = c[i] + x[i];
        float[] out = new float[n];
        int left = w / 2, right = w - 1 - left;
        for (int i = 0; i < n; i++) {
            int a = Math.max(0, i - left), b = Math.min(n, i + right + 1);
            out[i] = (float) ((c[b] - c[a]) / (b - a));
        }
        return out;
    }

    // ---------------------------------------------------------------- walking detection

    /**
     * Where somebody walks: [start, end) sample ranges. A window counts when the movement is strong enough
     * (standard deviation of |a| at least STD_MIN m/s^2) and repeats itself (normalised autocorrelation at
     * least AC_MIN at some lag between 0.3 and 1.5 s: a step or a stride). Runs shorter than MIN_RUN_S are
     * dropped, and TRIM_S is cut at both ends of each run (starting, stopping, the phone going in).
     */
    static List<int[]> walking(float[] mag) {
        int n = mag.length;
        int win = (int) Math.round(WIN_S * RATE), hop = Math.max(1, (int) Math.round(HOP_S * RATE));
        int lagLo = (int) Math.round(LAG_MIN_S * RATE), lagHi = (int) Math.round(LAG_MAX_S * RATE);
        boolean[] on = new boolean[n];
        double[] w = new double[win];
        for (int start = 0; start + win <= n; start += hop) {
            double mean = 0;
            for (int i = 0; i < win; i++) mean += mag[start + i];
            mean /= win;
            double e = 0;
            for (int i = 0; i < win; i++) {
                w[i] = mag[start + i] - mean;
                e += w[i] * w[i];
            }
            if (Math.sqrt(e / win) < STD_MIN) continue;
            double best = -1;
            for (int lag = lagLo; lag <= Math.min(lagHi, win - 1); lag++) {
                double r = 0;
                for (int i = 0; i + lag < win; i++) r += w[i] * w[i + lag];
                r = r / e * win / (win - lag);
                if (r > best) best = r;
            }
            if (best < AC_MIN) continue;
            int c0 = start + win / 2 - hop / 2;
            for (int i = Math.max(0, c0); i < Math.min(n, c0 + hop); i++) on[i] = true;
        }
        List<int[]> runs = new ArrayList<>();
        int trim = (int) Math.round(TRIM_S * RATE), minRun = (int) Math.round(MIN_RUN_S * RATE);
        for (int i = 0; i < n; ) {
            if (!on[i]) {
                i++;
                continue;
            }
            int j = i;
            while (j < n && on[j]) j++;
            int a = i + trim, b = j - trim;
            if (b - a >= minRun) runs.add(new int[]{a, b});
            i = j;
        }
        return runs;
    }

    /** Seconds of walking in these ranges. */
    static double seconds(List<int[]> runs) {
        int s = 0;
        for (int[] r : runs) s += r[1] - r[0];
        return s / RATE;
    }

    /** The walking parts of a recording ([3][n] at RATE) as channel segments, each [channels][length]. */
    static List<float[][]> segments(float[][] xyz) {
        float[][] ch = channels(xyz);
        List<float[][]> out = new ArrayList<>();
        for (int[] r : walking(magnitude(xyz))) {
            float[][] s = new float[ch.length][];
            for (int c = 0; c < ch.length; c++) s[c] = Arrays.copyOfRange(ch[c], r[0], r[1]);
            out.add(s);
        }
        return out;
    }

    // ---------------------------------------------------------------- embedding, template, GTM

    /** Time-delay embedding of one segment: rows are points, each M*TAU-lagged values per channel. */
    static double[][] embed(float[][] seg) {
        int len = seg[0].length - (M - 1) * TAU;
        if (len < 2) return new double[0][];
        int ch = seg.length;
        double[][] pts = new double[len][M * ch];
        for (int i = 0; i < len; i++)
            for (int c = 0; c < ch; c++)
                for (int k = 0; k < M; k++) pts[i][c * M + k] = seg[c][i + k * TAU];
        return pts;
    }

    /** One walk of one person as a cloud of points in its own PCA space, with the step to each next point. */
    static final class Template {
        final double[] mean;
        final double[][] basis;     // [P][dim]
        final double[][] points;    // points that have a successor in the same segment, in model space
        final double[][] steps;     // the step from each of those points to its successor

        Template(List<float[][]> segs) {
            List<double[][]> embedded = new ArrayList<>();
            int total = 0;
            for (float[][] s : segs) {
                double[][] e = embed(s);
                if (e.length >= 2) {
                    embedded.add(e);
                    total += e.length;
                }
            }
            if (total < 2 * P) throw new IllegalArgumentException("too little walking for a template");
            int dim = embedded.get(0)[0].length;
            mean = new double[dim];
            for (double[][] e : embedded) for (double[] p : e) for (int d = 0; d < dim; d++) mean[d] += p[d];
            for (int d = 0; d < dim; d++) mean[d] /= total;
            double[][] cov = new double[dim][dim];
            for (double[][] e : embedded)
                for (double[] p : e)
                    for (int a = 0; a < dim; a++) {
                        double da = p[a] - mean[a];
                        for (int b = a; b < dim; b++) cov[a][b] += da * (p[b] - mean[b]);
                    }
            for (int a = 0; a < dim; a++)
                for (int b = a; b < dim; b++) {
                    cov[a][b] /= (total - 1);
                    cov[b][a] = cov[a][b];
                }
            basis = topEigenvectors(cov, Math.min(P, dim));
            int keep = total - embedded.size();
            points = new double[keep][];
            steps = new double[keep][];
            int k = 0;
            for (double[][] e : embedded) {
                double[] prev = project(e[0]);
                for (int i = 1; i < e.length; i++) {
                    double[] cur = project(e[i]);
                    points[k] = prev;
                    steps[k] = minus(cur, prev);
                    k++;
                    prev = cur;
                }
            }
        }

        double[] project(double[] x) {
            double[] out = new double[basis.length];
            for (int j = 0; j < basis.length; j++) {
                double s = 0;
                for (int d = 0; d < x.length; d++) s += (x[d] - mean[d]) * basis[j][d];
                out[j] = s;
            }
            return out;
        }

        /**
         * GTM score of a walk against this template, in [-1, 1]: for each step v of the walk, the mean step u
         * of the K nearest template points, scored u.v / max(|u|^2, |v|^2) (as in the reference code), averaged.
         * 1 means every step goes exactly the same way and length as the template's.
         */
        double score(List<float[][]> segs) {
            double sum = 0;
            int count = 0;
            int[] nn = new int[K];
            double[] nd = new double[K];
            for (float[][] s : segs) {
                double[][] e = embed(s);
                if (e.length < 2) continue;
                double[] prev = project(e[0]);
                for (int i = 1; i < e.length; i++) {
                    double[] cur = project(e[i]);
                    nearest(prev, nn, nd);
                    double[] u = new double[prev.length];
                    for (int idx : nn) for (int d = 0; d < u.length; d++) u[d] += steps[idx][d] / K;
                    double dot = 0, uu = 0, vv = 0;
                    for (int d = 0; d < u.length; d++) {
                        double v = cur[d] - prev[d];
                        dot += u[d] * v;
                        uu += u[d] * u[d];
                        vv += v * v;
                    }
                    double mx = Math.max(uu, vv);
                    if (mx > 0) {
                        sum += dot / mx;
                        count++;
                    }
                    prev = cur;
                }
            }
            return count == 0 ? -1 : sum / count;
        }

        /** The K nearest template points by brute force (a template has under 2000 points). */
        private void nearest(double[] q, int[] nn, double[] nd) {
            Arrays.fill(nd, Double.MAX_VALUE);
            Arrays.fill(nn, 0);
            for (int i = 0; i < points.length; i++) {
                double[] p = points[i];
                double d = 0;
                for (int j = 0; j < q.length && d < nd[K - 1]; j++) {
                    double t = p[j] - q[j];
                    d += t * t;
                }
                if (d >= nd[K - 1]) continue;
                int at = K - 1;
                while (at > 0 && nd[at - 1] > d) {
                    nd[at] = nd[at - 1];
                    nn[at] = nn[at - 1];
                    at--;
                }
                nd[at] = d;
                nn[at] = i;
            }
        }
    }

    // ---------------------------------------------------------------- people and the decision

    /** A person with one template per learned walk. */
    static final class Person {
        final String name;
        final List<Template> templates = new ArrayList<>();

        Person(String name) {
            this.name = name;
        }

        /** The best of the person's walks: a second walk (other shoes, other pocket) can only help. */
        double score(List<float[][]> segs) {
            double best = -1;
            for (Template t : templates) best = Math.max(best, t.score(segs));
            return best;
        }
    }

    /** What recognition says. */
    static final class Result {
        final String name;              // the best person, also when not recognised
        final boolean known;            // score >= THRESHOLD
        final double score, confidence; // raw GTM score, and 0..1 for the screen
        final String second;            // runner-up or null
        final double secondScore;

        Result(String name, boolean known, double score, double confidence, String second, double secondScore) {
            this.name = name;
            this.known = known;
            this.score = score;
            this.confidence = confidence;
            this.second = second;
            this.secondScore = secondScore;
        }
    }

    /**
     * The best person and how sure: confidence = P(enrolled at all) x P(this one rather than the others), the
     * first a logistic step around THRESHOLD, the second a softmax over everybody's scores. Below THRESHOLD
     * the walk is "Unbekannt" (known = false). Returns null without people or walking.
     */
    static Result recognise(List<Person> people, List<float[][]> segs) {
        if (people.isEmpty() || segs.isEmpty()) return null;
        double[] s = new double[people.size()];
        int best = -1, second = -1;
        for (int i = 0; i < s.length; i++) {
            s[i] = people.get(i).score(segs);
            if (best < 0 || s[i] > s[best]) {
                second = best;
                best = i;
            } else if (second < 0 || s[i] > s[second]) {
                second = i;
            }
        }
        double absolute = 1 / (1 + Math.exp(-(s[best] - THRESHOLD) / CONF_WIDTH));
        double z = 0;
        for (double v : s) z += Math.exp((v - s[best]) / SHARE_TEMP);
        double share = 1 / z;
        return new Result(people.get(best).name, s[best] >= THRESHOLD, s[best], absolute * share,
                second < 0 ? null : people.get(second).name, second < 0 ? Double.NaN : s[second]);
    }

    // ---------------------------------------------------------------- small linear algebra

    static double[] minus(double[] a, double[] b) {
        double[] r = new double[a.length];
        for (int i = 0; i < a.length; i++) r[i] = a[i] - b[i];
        return r;
    }

    /** The k eigenvectors of a symmetric matrix with the largest eigenvalues (cyclic Jacobi), as rows. */
    static double[][] topEigenvectors(double[][] sym, int k) {
        int n = sym.length;
        double[][] a = new double[n][];
        for (int i = 0; i < n; i++) a[i] = sym[i].clone();
        double[][] v = new double[n][n];
        for (int i = 0; i < n; i++) v[i][i] = 1;
        for (int sweep = 0; sweep < 100; sweep++) {
            double off = 0;
            for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) off += a[i][j] * a[i][j];
            if (off < 1e-20) break;
            for (int p = 0; p < n; p++)
                for (int q = p + 1; q < n; q++) {
                    if (Math.abs(a[p][q]) < 1e-300) continue;
                    double theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
                    double t = Math.signum(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
                    if (theta == 0) t = 1;
                    double c = 1 / Math.sqrt(t * t + 1), s = t * c;
                    for (int r = 0; r < n; r++) {
                        double arp = a[r][p], arq = a[r][q];
                        a[r][p] = c * arp - s * arq;
                        a[r][q] = s * arp + c * arq;
                    }
                    for (int r = 0; r < n; r++) {
                        double apr = a[p][r], aqr = a[q][r];
                        a[p][r] = c * apr - s * aqr;
                        a[q][r] = s * apr + c * aqr;
                    }
                    for (int r = 0; r < n; r++) {
                        double vrp = v[r][p], vrq = v[r][q];
                        v[r][p] = c * vrp - s * vrq;
                        v[r][q] = s * vrp + c * vrq;
                    }
                }
        }
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        final double[][] fa = a;
        Arrays.sort(order, (x, y) -> Double.compare(fa[y][y], fa[x][x]));
        double[][] out = new double[k][n];
        for (int j = 0; j < k; j++) for (int i = 0; i < n; i++) out[j][i] = v[i][order[j]];
        return out;
    }
}
