package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

/**
 * The fasting mode's pure parts (Fasts): the agreed JSON (null end and plan, note only where typed), a fast as a time
 * range, its day number and hours, the banner text, and the safety hint at its limits. Made-up moments only.
 */
public class FastsTest {
    private static final TimeZone BERLIN = TimeZone.getTimeZone("Europe/Berlin");
    private static final long H = 3_600_000L;

    private static long at(int y, int m, int d, int h, int min) {
        Calendar c = Calendar.getInstance(BERLIN);
        c.clear();
        c.set(y, m - 1, d, h, min);
        return c.getTimeInMillis();
    }

    @Test
    public void agreedJsonWithNullsAndOptionalNote() throws Exception {
        List<Fasts.Fast> rows = new ArrayList<>();
        rows.add(new Fasts.Fast("a1", at(2026, 11, 21, 18, 0), 0, 5, ""));
        rows.add(new Fasts.Fast("b2", at(2026, 10, 1, 8, 0), at(2026, 10, 8, 8, 0), 0, " sieben Tage "));
        String saved = Fasts.format(rows);
        JSONArray a = new JSONArray(saved);
        JSONObject open = a.getJSONObject(0), done = a.getJSONObject(1);
        assertTrue(open.isNull("end"));
        assertEquals(5, open.getInt("plannedDays"));
        assertFalse(open.has("note"));
        assertEquals(4, open.length());                        // id, start, end, plannedDays
        assertTrue(done.isNull("plannedDays"));
        assertEquals("sieben Tage", done.getString("note"));
        assertEquals("a1", open.getString("id"));
        List<Fasts.Fast> back = Fasts.parse(saved);
        assertEquals(2, back.size());
        assertTrue(back.get(0).open());
        assertEquals(5, back.get(0).plannedDays);
        assertEquals(0, back.get(1).plannedDays);
        assertEquals(at(2026, 10, 8, 8, 0), back.get(1).end);
    }

    @Test
    public void newestStartFirstAndBrokenRowsSkipped() {
        List<Fasts.Fast> l = Fasts.parse("[{\"id\":\"x\",\"start\":1000,\"end\":null,\"plannedDays\":null},"
                + "{\"start\":5},{\"id\":\"y\",\"start\":9000,\"end\":12000,\"plannedDays\":7}]");
        assertEquals(2, l.size());
        assertEquals("y", l.get(0).id);
        assertTrue(Fasts.parse("kaputt").isEmpty());
        assertTrue(new Fasts.Fast(null, 1, 0, 0, null).id.length() >= 32);   // a new fast gets a UUID
    }

    @Test
    public void aFastIsATimeRange() {
        Fasts.Fast done = new Fasts.Fast("d", 1000, 5000, 0, "");
        assertFalse(done.contains(999));
        assertTrue(done.contains(1000));
        assertTrue(done.contains(4999));
        assertFalse(done.contains(5000));
        Fasts.Fast open = new Fasts.Fast("o", 1000, 0, 0, "");
        assertTrue(open.contains(Long.MAX_VALUE / 2));
        // editing the start moves measurements in or out by their time alone
        Fasts.Fast later = new Fasts.Fast("d", 3000, 5000, 0, "");
        assertFalse(later.contains(2000));
    }

    @Test
    public void dayHoursAndBanner() {
        Fasts.Fast f = new Fasts.Fast("f", at(2026, 11, 21, 18, 0), 0, 5, "");
        long now = at(2026, 11, 24, 8, 0);                      // the evening of the 21st is day 1
        assertEquals(4, Fasts.dayOf(f, now, BERLIN));
        assertEquals(62, Fasts.hours(f, now));
        assertEquals("Fasten · Tag 4 von 5 · 62 h", Fasts.banner(f, now, BERLIN));
        assertEquals("Fasten · Tag 1 · 0 h",
                Fasts.banner(new Fasts.Fast("g", at(2026, 11, 21, 18, 0), 0, 0, ""), at(2026, 11, 21, 18, 30), BERLIN));
        // across the change to winter time the day count stays right
        Fasts.Fast dst = new Fasts.Fast("h", at(2026, 10, 24, 20, 0), 0, 0, "");
        assertEquals(3, Fasts.dayOf(dst, at(2026, 10, 26, 7, 0), BERLIN));
        assertEquals(36, Fasts.hours(dst, at(2026, 10, 26, 7, 0)));
        assertEquals(10 * H / H, Fasts.hours(new Fasts.Fast("e", 0, 10 * H, 0, ""), 99 * H));   // ended: up to its end
    }

    @Test
    public void safetyHintAtItsLimits() {
        assertEquals(Fasts.Level.NONE, Fasts.safety(0, 0));
        assertEquals(Fasts.Level.NONE, Fasts.safety(100, 70));
        assertEquals(Fasts.Level.ORANGE, Fasts.safety(99, 0));
        assertEquals(Fasts.Level.ORANGE, Fasts.safety(0, 69));
        assertEquals(Fasts.Level.RED, Fasts.safety(89, 80));
        assertEquals(Fasts.Level.RED, Fasts.safety(120, 59));
        assertEquals(Fasts.Level.ORANGE, Fasts.safety(90, 60));
    }
}
