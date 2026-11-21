package de.docalvers.docfit;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.TreeMap;

/**
 * The fasts recorded in DocFit (Fasts) for the fasting page (web/fasting/), in the page's own shape, so they stand as
 * cards next to the fasts from the workbook and in the comparison from day 1 (Doc, 21.11.2026). Built from the live
 * measurements of one person: per calendar day the morning weight (the first weigh-in of the day) with its body fat
 * and waist, the first blood pressure and pulse, the first fasting glucose ("nüchtern", in mg/dL - the page's unit).
 * Pure Java, tested in FastLiveTest.
 *
 * Shape: {"fasts": [{id, label, start, end (ISO dates), endSure (false while it runs), color: null (the page gives it
 * one), quote, days, live: true, summary: {metric: {start: {date, value, offset}, end: …}}, coverage: {metric: {days,
 * first}}, evidence}], "days": {"YYYY-MM-DD": {"v": {weight, fat, belly, sys, dia, pulse, sugar}}}}.
 */
final class FastLive {
    static final String[] METRICS = {"weight", "fat", "belly", "sys", "dia", "pulse", "sugar"};
    private static final String[] MONTHS = {"Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
            "September", "Oktober", "November", "Dezember"};

    private FastLive() {
    }

    static String iso(long t, TimeZone tz) {
        Calendar c = Calendar.getInstance(tz, Locale.GERMANY);
        c.setTimeInMillis(t);
        return String.format(Locale.ROOT, "%04d-%02d-%02d", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1,
                c.get(Calendar.DAY_OF_MONTH));
    }

    /** the values of one calendar day: the first measurement of each kind on that day */
    static TreeMap<String, JSONObject> days(List<Weighings.Weighing> weighings, Profile p,
                                           List<Pressures.Reading> bps, List<Glucoses.Reading> glus, TimeZone tz)
            throws JSONException {
        TreeMap<String, JSONObject> out = new TreeMap<>();
        TreeMap<String, Long> firstWeigh = new TreeMap<>(), firstBp = new TreeMap<>(), firstGlu = new TreeMap<>();
        for (Weighings.Weighing w : weighings) {
            String d = iso(w.time, tz);
            if (firstWeigh.containsKey(d) && firstWeigh.get(d) <= w.time) continue;
            firstWeigh.put(d, w.time);
            JSONObject v = values(out, d);
            v.put("weight", Math.round(w.kg() * 100) / 100.0);
            BodyComposition bc = BodyComposition.of(w, p);
            if (!Double.isNaN(bc.fatPercent) && !bc.fatImplausible) v.put("fat", Math.round(bc.fatPercent * 10) / 10.0);
            else v.remove("fat");
            if (w.waistMm > 0) v.put("belly", w.waistMm / 10.0);
            else v.remove("belly");
        }
        for (Pressures.Reading b : bps) {
            String d = iso(b.time, tz);
            if (firstBp.containsKey(d) && firstBp.get(d) <= b.time) continue;
            firstBp.put(d, b.time);
            JSONObject v = values(out, d);
            v.put("sys", b.sys).put("dia", b.dia);
            if (b.pulse > 0) v.put("pulse", b.pulse);
            else v.remove("pulse");
        }
        for (Glucoses.Reading g : glus) {
            if (!"fasting".equals(g.context)) continue;
            String d = iso(g.time, tz);
            if (firstGlu.containsKey(d) && firstGlu.get(d) <= g.time) continue;
            firstGlu.put(d, g.time);
            values(out, d).put("sugar", g.mgdl);
        }
        return out;
    }

    private static JSONObject values(TreeMap<String, JSONObject> days, String d) throws JSONException {
        JSONObject day = days.get(d);
        if (day == null) {
            day = new JSONObject().put("v", new JSONObject());
            days.put(d, day);
        }
        return day.getJSONObject("v");
    }

    /** One fast as a card of the page. */
    static JSONObject fast(Fasts.Fast f, TreeMap<String, JSONObject> days, long now, TimeZone tz)
            throws JSONException {
        long last = f.open() ? now : Math.max(f.start, f.end - 1);
        int n = Math.max(1, Fasts.dayOf(f, last, tz));
        List<String> dates = new ArrayList<>();
        for (int i = 0; i < n; i++) dates.add(iso(Fasts.midnight(f.start, tz) + i * 86_400_000L + 3_600_000L * 12, tz));
        Calendar c = Calendar.getInstance(tz, Locale.GERMANY);
        c.setTimeInMillis(f.start);
        JSONObject summary = new JSONObject(), coverage = new JSONObject();
        for (String m : METRICS) {
            String first = null, lastDate = null;
            Object firstV = null, lastV = null;
            int count = 0;
            for (String d : dates) {
                JSONObject day = days.get(d);
                if (day == null || !day.getJSONObject("v").has(m)) continue;
                Object v = day.getJSONObject("v").get(m);
                if (first == null) {
                    first = d;
                    firstV = v;
                }
                lastDate = d;
                lastV = v;
                count++;
            }
            if (count == 0) continue;
            int firstNo = dates.indexOf(first) + 1, lastNo = dates.indexOf(lastDate) + 1;
            summary.put(m, new JSONObject()
                    .put("start", new JSONObject().put("date", first).put("value", firstV).put("offset", firstNo - 1))
                    .put("end", new JSONObject().put("date", lastDate).put("value", lastV).put("offset", lastNo - n)));
            coverage.put(m, new JSONObject().put("days", count).put("first", first));
        }
        return new JSONObject()
                .put("id", "live-" + f.id)
                .put("label", MONTHS[c.get(Calendar.MONTH)] + " " + c.get(Calendar.YEAR))
                .put("start", dates.get(0))
                .put("end", dates.get(dates.size() - 1))
                .put("endSure", !f.open())
                .put("color", JSONObject.NULL)
                .put("quote", f.note)
                .put("days", n)
                .put("live", true)
                .put("summary", summary)
                .put("coverage", coverage)
                .put("evidence", f.open() ? "läuft – DocFit-Messungen" : "DocFit-Messungen");
    }

    /** All fasts of one person and the days of her measurements, for DocFitApp.liveFasts(). */
    static JSONObject build(List<Fasts.Fast> fasts, List<Weighings.Weighing> weighings, Profile p,
                            List<Pressures.Reading> bps, List<Glucoses.Reading> glus, long now, TimeZone tz)
            throws JSONException {
        TreeMap<String, JSONObject> days = days(weighings, p, bps, glus, tz);
        org.json.JSONArray arr = new org.json.JSONArray();
        for (Fasts.Fast f : fasts) arr.put(fast(f, days, now, tz));
        JSONObject d = new JSONObject();
        for (String k : days.keySet()) d.put(k, days.get(k));
        return new JSONObject().put("fasts", arr).put("days", d);
    }
}
