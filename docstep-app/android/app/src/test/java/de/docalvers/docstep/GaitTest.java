package de.docalvers.docstep;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

public class GaitTest {
    @Rule
    public TemporaryFolder tmp = new TemporaryFolder();

    @Test
    public void resampleRecoversASineFromUnevenSamples() {
        int n = 3000;
        long[] t = new long[n];
        float[] v = new float[n];
        java.util.Random r = new java.util.Random(5);
        long now = 0;
        for (int i = 0; i < n; i++) {
            now += 8_000_000 + r.nextInt(4_000_000);
            t[i] = now;
            v[i] = (float) Math.sin(2 * Math.PI * 1.5 * (now - t[0]) / 1e9);
        }
        float[] out = Gait.resample(t, v, n, Gait.RATE);
        assertEquals((t[n - 1] - t[0]) / 1e9 * Gait.RATE, out.length, 1.5);
        double err = 0;
        for (int k = 5; k < out.length - 5; k++) err = Math.max(err, Math.abs(out[k] - Math.sin(2 * Math.PI * 1.5 * k / Gait.RATE)));
        assertTrue("max error " + err, err < 0.1);
    }

    @Test
    public void resampleFillsGapsByInterpolation() {
        long[] t = {0, 40_000_000, 400_000_000};
        float[] v = {0, 1, 10};
        float[] out = Gait.resample(t, v, 3, Gait.RATE);
        assertEquals(11, out.length);
        assertEquals(1f, out[1], 1e-6);
        assertEquals(6f, out[6], 1e-4);     // 1 + (10 - 1) * 5/9 between bins 1 and 10
        assertEquals(10f, out[10], 1e-6);
    }

    @Test
    public void eigenvectorsSolveTheSymmetricProblem() {
        double[][] a = {{4, 1, 0.5}, {1, 3, 0.2}, {0.5, 0.2, 1}};
        double[][] v = Gait.topEigenvectors(a, 3);
        double last = Double.MAX_VALUE;
        for (double[] e : v) {
            double[] ae = new double[3];
            for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) ae[i] += a[i][j] * e[j];
            double lambda = 0;
            for (int i = 0; i < 3; i++) lambda += ae[i] * e[i];
            for (int i = 0; i < 3; i++) assertEquals(lambda * e[i], ae[i], 1e-9);
            assertTrue("sorted by size", lambda <= last + 1e-12);
            last = lambda;
        }
    }

    @Test
    public void walkingIsFoundAndStandingIsNot() {
        float[][] xyz = Synth.ANNA.record(1, 6, 20).atRate();
        List<int[]> runs = Gait.walking(Gait.magnitude(xyz));
        double walked = Gait.seconds(runs);
        assertTrue("walked " + walked, walked > 16 && walked <= 20.5);
        for (int[] run : runs) {
            assertTrue("starts after standing: " + run[0] / Gait.RATE, run[0] / Gait.RATE > 5.0);
            assertTrue("ends before standing: " + run[1] / Gait.RATE, run[1] / Gait.RATE < 27.0);
        }
        float[][] still = Synth.ANNA.record(2, 15, 0).atRate();
        assertTrue(Gait.walking(Gait.magnitude(still)).isEmpty());
    }

    @Test
    public void channelsDoNotDependOnThePocket() {
        // the same walk with two phone orientations gives the same channels
        Synth s = Synth.BERT;
        float[][] a = Gait.channels(s.record(9, 2, 10).atRate());
        java.util.Random r = new java.util.Random(77);
        float[][] xyz = s.record(9, 2, 10).atRate();
        double[][] rot = Synth.randomRotation(r);
        float[][] turned = new float[3][xyz[0].length];
        for (int i = 0; i < xyz[0].length; i++)
            for (int j = 0; j < 3; j++)
                turned[j][i] = (float) (rot[j][0] * xyz[0][i] + rot[j][1] * xyz[1][i] + rot[j][2] * xyz[2][i]);
        float[][] b = Gait.channels(turned);
        for (int c = 0; c < 2; c++) for (int i = 0; i < a[c].length; i++) assertEquals(a[c][i], b[c][i], 1e-3);
    }

    /** Learn three people from a 30 s walk each, then recognise new 12 s walks (new pocket orientation each time). */
    @Test
    public void recognisesEnrolledPeopleAndRejectsAStranger() {
        Synth[] enrolled = {Synth.ANNA, Synth.BERT, Synth.CARL};
        List<Gait.Person> people = new ArrayList<>();
        for (Synth s : enrolled) {
            Gait.Person p = new Gait.Person(s.name);
            p.templates.add(new Gait.Template(Gait.segments(s.record(100 + s.name.hashCode(), 3, 33).atRate())));
            people.add(p);
        }
        int trials = 6;
        double minGenuine = 1, maxStranger = -1;
        for (Synth s : enrolled) {
            for (int k = 0; k < trials; k++) {
                List<float[][]> walk = Gait.segments(s.record(1000 + 31L * k + s.name.hashCode(), 3, 14).atRate());
                Gait.Result r = Gait.recognise(people, walk);
                assertNotNull(r);
                report(s.name, r);
                assertEquals(s.name, r.name);
                assertTrue(s.name + " known, score " + r.score, r.known);
                assertTrue(r.confidence > 0.5);
                minGenuine = Math.min(minGenuine, r.score);
            }
        }
        for (int k = 0; k < trials; k++) {
            List<float[][]> walk = Gait.segments(Synth.DORA.record(5000 + k, 3, 14).atRate());
            Gait.Result r = Gait.recognise(people, walk);
            assertNotNull(r);
            report("Dora (stranger)", r);
            assertFalse("stranger taken for " + r.name + ", score " + r.score, r.known);
            assertTrue(r.confidence < 0.5);
            maxStranger = Math.max(maxStranger, r.score);
        }
        System.out.printf(Locale.ROOT, "lowest genuine score %.3f, highest stranger score %.3f, threshold %.2f%n",
                minGenuine, maxStranger, Gait.THRESHOLD);
    }

    @Test
    public void noWalkingGivesNoResult() {
        List<Gait.Person> people = new ArrayList<>();
        Gait.Person p = new Gait.Person("Anna");
        p.templates.add(new Gait.Template(Gait.segments(Synth.ANNA.record(3, 3, 33).atRate())));
        people.add(p);
        assertTrue(Gait.segments(Synth.ANNA.record(4, 10, 0).atRate()).isEmpty());
        assertEquals(null, Gait.recognise(people, new ArrayList<>()));
    }

    @Test
    public void storeKeepsWalksAndDeletesAPerson() throws Exception {
        File dir = new File(tmp.getRoot(), "walks");
        float[][] a = Synth.ANNA.record(7, 3, 33).atRate();
        float[][] b = Synth.BERT.record(8, 3, 33).atRate();
        Store.save(dir, new Store.Walk("Anna", 1000, (float) Gait.RATE, a));
        Store.save(dir, new Store.Walk("Bert", 2000, (float) Gait.RATE, b));
        Store.save(dir, new Store.Walk("Anna", 3000, (float) Gait.RATE, b));
        List<Store.Walk> all = Store.all(dir);
        assertEquals(3, all.size());
        assertEquals("Anna", all.get(0).name);
        assertTrue(Arrays.equals(a[2], all.get(0).xyz[2]));
        assertEquals(Arrays.asList("Anna", "Bert"), new ArrayList<>(Store.byName(all).keySet()));
        List<Gait.Person> people = Store.people(all);
        assertEquals(2, people.size());
        assertEquals(2, people.get(0).templates.size());
        assertEquals(2, Store.delete(dir, "Anna"));
        assertEquals(1, Store.all(dir).size());
    }

    private static void report(String who, Gait.Result r) {
        System.out.printf(Locale.ROOT, "%-16s -> %-5s known=%-5b score=%.3f conf=%.2f second=%s %.3f%n",
                who, r.name, r.known, r.score, r.confidence, r.second, r.secondScore);
    }
}
