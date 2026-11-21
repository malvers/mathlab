package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Iterator;

/**
 * The shared test values of the phone and the web (Doc, 21.11.2026: the web's docfit-core.js with the SAME formulas as
 * the app). This test computes body values, fitness score, tile zones and girth ratios with the app's classes for a
 * grid of made-up people (no one's real data) and compares them with docfit-app/test/core-vectors.json; the web's
 * node test (docfit-app/test/test_core_vectors.mjs) compares HTML/docfit/docfit-core.js with the same file.
 *
 * A change of a formula on the phone therefore fails here first. Then, deliberately:
 *     DOCFIT_WRITE_VECTORS=1 ./gradlew testDebugUnitTest --tests de.docalvers.docfit.CoreVectorsTest
 * writes the file anew - and docfit-core.js has to follow until its node test is green again.
 */
public class CoreVectorsTest {
    /** 15.06.2026 12:00 UTC - mid-year, so the year (and with it the age) is the same in every time zone */
    static final long WHEN = 1_781_524_800_000L;
    private static final File FILE = new File("../../test/core-vectors.json");

    @Test
    public void appAndWebComputeTheSame() throws Exception {
        JSONObject now = compute();
        if ("1".equals(System.getenv("DOCFIT_WRITE_VECTORS")) || !FILE.exists()) {
            Files.write(FILE.toPath(), (now.toString(1) + "\n").getBytes(StandardCharsets.UTF_8));
            return;
        }
        JSONObject stored = new JSONObject(new String(Files.readAllBytes(FILE.toPath()), StandardCharsets.UTF_8));
        same("", stored, now);
    }

    static JSONObject compute() throws Exception {
        JSONArray body = new JSONArray();
        int[][] people = {{180, 'm'}, {165, 'w'}};
        int[] ages = {30, 50, 70};
        int[] centiKg = {5500, 7000, 8500, 11000};
        int[] ohms = {0, 65535, 120, 350, 500, 650, 900};
        for (int[] pp : people) {
            for (int age : ages) {
                Profile p = new Profile(pp[0], 2026 - age, (char) pp[1]);
                for (int kg : centiKg) {
                    for (int ohm : ohms) {
                        Weighings.Weighing w = new Weighings.Weighing(WHEN, kg, ohm);
                        BodyComposition bc = BodyComposition.of(w, p);
                        FitnessScore fit = FitnessScore.of(w, p);
                        JSONObject in = new JSONObject().put("heightCm", pp[0]).put("birthYear", 2026 - age)
                                .put("sex", String.valueOf((char) pp[1])).put("time", WHEN).put("centiKg", kg)
                                .put("ohm", ohm);
                        JSONObject out = new JSONObject()
                                .put("bmi", num(bc.bmi)).put("fat", num(bc.fatPercent)).put("water", num(bc.waterPercent))
                                .put("muscle", num(bc.muscleKg)).put("gallagher", num(bc.gallagherPercent))
                                .put("implausible", bc.fatImplausible).put("score", fit.score)
                                .put("scoreWord", FitnessScore.word(fit.score)).put("scoreText", fit.text)
                                .put("fatScale", scale(Ranges.fat(bc.fatPercent, p.sex, age)))
                                .put("waterScale", scale(Ranges.water(bc.waterPercent, p.sex)))
                                .put("muscleScale", scale(Ranges.muscle(bc.muscleKg, p.heightCm, p.sex)))
                                .put("bmiScale", scale(Double.isNaN(bc.bmi) ? null : Ranges.bmi(bc.bmi)))
                                .put("weightScale", scale(Ranges.weight(w.kg(), p.heightCm)));
                        body.put(new JSONObject().put("in", in).put("out", out));
                    }
                }
            }
        }
        JSONArray girths = new JSONArray();
        int[] waists = {0, 760, 820, 960, 1080};
        int[] hips = {0, 980, 1040};
        for (int[] pp : people) {
            for (int waist : waists) {
                for (int hip : hips) {
                    char sex = (char) pp[1];
                    int whtr = Girths.waistToHeight(waist, pp[0]), whr = Girths.waistToHip(waist, hip);
                    JSONObject in = new JSONObject().put("heightCm", pp[0]).put("sex", String.valueOf(sex))
                            .put("waistMm", waist).put("hipMm", hip);
                    JSONObject out = new JSONObject().put("whtr", whtr).put("whr", whr)
                            .put("waistCm", Girths.cm(waist)).put("whtrText", Girths.ratio(whtr))
                            .put("waistScale", scale(Ranges.waist(waist, sex)))
                            .put("whtrScale", scale(Ranges.waistToHeight(whtr)))
                            .put("whrScale", scale(Ranges.waistToHip(whr, sex)));
                    girths.put(new JSONObject().put("in", in).put("out", out));
                }
            }
        }
        JSONArray parse = new JSONArray();
        for (String typed : new String[]{"", "94", "94,5", "94.55", "94,5 cm", "49,9", "200", "200,1", "abc", "1.2.3"}) {
            parse.put(new JSONObject().put("in", typed).put("out", Girths.parseMm(typed)));
        }
        JSONArray times = new JSONArray();
        for (long ms : new long[]{0, 999, 59_999, 61_000, 3_599_999, 3_600_000, 3_723_456}) {
            times.put(new JSONObject().put("in", ms).put("out", Times.duration(ms)));
        }
        JSONArray bp = new JSONArray();
        int[][] readings = {{115, 75}, {125, 82}, {135, 88}, {150, 95}, {170, 105}, {185, 115}, {118, 92}, {165, 70}};
        for (int[] r : readings) {
            bp.put(new JSONObject().put("in", new JSONArray().put(r[0]).put(r[1]))
                    .put("out", Pressures.category(r[0], r[1]).word)
                    .put("check", Pressures.check(r[0], r[1], 64) == null ? JSONObject.NULL : Pressures.check(r[0], r[1], 64)));
        }
        JSONArray glu = new JSONArray();
        for (int mg : new int[]{18, 64, 99, 100, 125, 126, 139, 140, 199, 200, 630}) {
            for (String ctx : Glucoses.CONTEXTS) {
                glu.put(new JSONObject().put("mgdl", mg).put("context", ctx)
                        .put("category", Glucoses.category(mg, ctx).name()).put("both", Glucoses.both(mg)));
            }
        }
        JSONArray typed = new JSONArray();
        for (String t : new String[]{"5,6", "5.4", "101", "34,9", "35", "0,5", "1", "650", "17", "", "abc", "7,25"}) {
            double v = Glucoses.parse(t);
            String unit = Double.isNaN(v) ? Glucoses.MMOL : Glucoses.detectUnit(v);
            String why = Glucoses.check(v, unit);
            typed.put(new JSONObject().put("in", t).put("value", num(v)).put("unit", unit)
                    .put("check", why == null ? JSONObject.NULL : why)
                    .put("mgdl", why == null ? Glucoses.toMgdl(v, unit) : JSONObject.NULL)
                    .put("mgdlAsMmol", why == null ? Glucoses.toMgdl(v, Glucoses.MMOL.equals(unit) ? Glucoses.MGDL : Glucoses.MMOL)
                            : JSONObject.NULL));
        }
        // the fasting mode: day, hours and banner (the device's time zone - node runs in the same one), the hints
        JSONArray fasts = new JSONArray();
        java.util.TimeZone tz = java.util.TimeZone.getDefault();
        long[] starts = {WHEN - 5 * 3_600_000L, WHEN + 20 * 3_600_000L};
        long[] afters = {0, 3_600_000L, 11 * 3_600_000L, 30 * 3_600_000L, 62 * 3_600_000L, 5 * 86_400_000L + 7_200_000L};
        for (long st : starts) {
            for (int planned : new int[]{0, 5}) {
                for (long after : afters) {
                    Fasts.Fast f = new Fasts.Fast("x", st, 0, planned, "");
                    long now = st + after;
                    fasts.put(new JSONObject().put("start", st).put("planned", planned).put("now", now)
                            .put("day", Fasts.dayOf(f, now, tz)).put("hours", Fasts.hours(f, now))
                            .put("banner", Fasts.banner(f, now, tz)));
                }
            }
        }
        JSONArray safety = new JSONArray();
        for (int sys : new int[]{0, 85, 90, 95, 100, 120}) {
            for (int mg : new int[]{0, 55, 60, 65, 70, 95}) {
                safety.put(new JSONObject().put("sys", sys).put("glu", mg).put("level", Fasts.safety(sys, mg).name()));
            }
        }
        return new JSONObject().put("note", "generated by CoreVectorsTest (made-up values) - do not edit by hand")
                .put("fasts", fasts).put("fastSafety", safety)
                .put("body", body).put("girths", girths).put("parseMm", parse).put("duration", times).put("bp", bp)
                .put("glucose", glu).put("glucoseTyped", typed);
    }

    private static Object num(double v) {
        return Double.isNaN(v) ? JSONObject.NULL : v;
    }

    private static Object scale(Ranges.Scale s) throws Exception {
        if (s == null) return JSONObject.NULL;
        JSONArray bands = new JSONArray();
        for (int i = 0; i < s.bands.length; i++) {
            Ranges.Band b = s.bands[i];
            bands.put(new JSONObject().put("from", b.from).put("to", b.to).put("zone", b.zone.name())
                    .put("word", b.word).put("span", s.span(i)));
        }
        return new JSONObject().put("min", s.min).put("max", s.max).put("value", num(s.value)).put("note", s.note)
                .put("unit", s.unit).put("decimals", s.decimals).put("bands", bands)
                .put("zone", s.zone() == null ? JSONObject.NULL : s.zone().name())
                .put("word", s.word() == null ? JSONObject.NULL : s.word())
                .put("at", s.hasValue() ? (double) s.at(s.value) : JSONObject.NULL);
    }

    /** Deep comparison: strings, booleans and integers exactly, other numbers to 1e-9. */
    private static void same(String path, Object a, Object b) throws Exception {
        if (a instanceof JSONObject && b instanceof JSONObject) {
            JSONObject x = (JSONObject) a, y = (JSONObject) b;
            assertEquals(path + ": keys", x.length(), y.length());
            for (Iterator<String> it = x.keys(); it.hasNext(); ) {
                String k = it.next();
                assertTrue(path + "." + k + " missing", y.has(k));
                same(path + "." + k, x.get(k), y.get(k));
            }
        } else if (a instanceof JSONArray && b instanceof JSONArray) {
            JSONArray x = (JSONArray) a, y = (JSONArray) b;
            assertEquals(path + ": length", x.length(), y.length());
            for (int i = 0; i < x.length(); i++) same(path + "[" + i + "]", x.get(i), y.get(i));
        } else if (a instanceof Number && b instanceof Number) {
            assertEquals(path, ((Number) a).doubleValue(), ((Number) b).doubleValue(), 1e-9);
        } else if (!String.valueOf(a).equals(String.valueOf(b))) {
            fail(path + ": stored " + a + ", now " + b + " - a formula changed? See the class comment.");
        }
    }
}
