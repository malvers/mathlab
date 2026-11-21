package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.json.JSONObject;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

/**
 * A fast recorded in DocFit as a card of the fasting page (FastLive): the first measurement of each day, fasting
 * glucose only, the summary from the first to the last day with a value, the coverage, and an open fast up to today.
 * The test man (180 cm, born 1990) and made-up values - nobody real.
 */
public class FastLiveTest {
    private static final TimeZone BERLIN = TimeZone.getTimeZone("Europe/Berlin");
    private static final Profile MAN = new Profile(180, 1990, Profile.MALE);

    private static long at(int d, int h, int min) {
        Calendar c = Calendar.getInstance(BERLIN);
        c.clear();
        c.set(2026, Calendar.NOVEMBER, d, h, min);
        return c.getTimeInMillis();
    }

    @Test
    public void cardFromLiveMeasurements() throws Exception {
        List<Weighings.Weighing> w = new ArrayList<>();
        w.add(new Weighings.Weighing(at(23, 19, 0), 8350, 0));           // evening: not the morning weight
        w.add(new Weighings.Weighing(at(23, 7, 10), 8400, 500));
        w.add(new Weighings.Weighing(at(22, 7, 5), 8500, 0, 950, 0));    // waist typed in
        List<Pressures.Reading> b = new ArrayList<>();
        b.add(new Pressures.Reading(at(22, 7, 30), 118, 76, 58, Pressures.HAND, ""));
        List<Glucoses.Reading> g = new ArrayList<>();
        g.add(new Glucoses.Reading(at(23, 7, 20), 81, "fasting", Glucoses.HAND, ""));
        g.add(new Glucoses.Reading(at(22, 12, 0), 140, "after_meal_2h", Glucoses.HAND, ""));   // not fasting
        List<Fasts.Fast> f = new ArrayList<>();
        f.add(new Fasts.Fast("abc", at(21, 18, 0), 0, 5, "Probe"));

        JSONObject out = FastLive.build(f, w, MAN, b, g, at(23, 20, 0), BERLIN);
        JSONObject days = out.getJSONObject("days");
        assertEquals(84.0, days.getJSONObject("2026-11-23").getJSONObject("v").getDouble("weight"), 1e-9);
        assertTrue(days.getJSONObject("2026-11-23").getJSONObject("v").has("fat"));   // the morning one had a resistance
        assertEquals(81, days.getJSONObject("2026-11-23").getJSONObject("v").getInt("sugar"));
        assertEquals(95.0, days.getJSONObject("2026-11-22").getJSONObject("v").getDouble("belly"), 1e-9);
        assertEquals(118, days.getJSONObject("2026-11-22").getJSONObject("v").getInt("sys"));
        assertFalse(days.getJSONObject("2026-11-22").getJSONObject("v").has("sugar"));

        JSONObject card = out.getJSONArray("fasts").getJSONObject(0);
        assertEquals("live-abc", card.getString("id"));
        assertEquals("November 2026", card.getString("label"));
        assertEquals("2026-11-21", card.getString("start"));
        assertEquals("2026-11-23", card.getString("end"));          // open: up to today
        assertEquals(3, card.getInt("days"));
        assertFalse(card.getBoolean("endSure"));
        assertTrue(card.getBoolean("live"));
        assertEquals("Probe", card.getString("quote"));
        JSONObject weight = card.getJSONObject("summary").getJSONObject("weight");
        assertEquals("2026-11-22", weight.getJSONObject("start").getString("date"));
        assertEquals(1, weight.getJSONObject("start").getInt("offset"));     // day 2 instead of day 1
        assertEquals(84.0, weight.getJSONObject("end").getDouble("value"), 1e-9);
        assertEquals(2, card.getJSONObject("coverage").getJSONObject("weight").getInt("days"));
        assertFalse(card.getJSONObject("summary").has("pulse") && card.getJSONObject("coverage")
                .getJSONObject("pulse").getInt("days") != 1);
    }

    @Test
    public void endedFastEndsOnItsLastDay() throws Exception {
        List<Fasts.Fast> f = new ArrayList<>();
        f.add(new Fasts.Fast("x", at(1, 8, 0), at(6, 8, 0), 5, ""));       // 1st 08:00 to 6th 08:00
        JSONObject card = FastLive.build(f, new ArrayList<>(), MAN, new ArrayList<>(), new ArrayList<>(), at(20, 12, 0),
                BERLIN).getJSONArray("fasts").getJSONObject(0);
        assertEquals("2026-11-01", card.getString("start"));
        assertEquals("2026-11-06", card.getString("end"));
        assertEquals(6, card.getInt("days"));
        assertTrue(card.getBoolean("endSure"));
        assertEquals(0, card.getJSONObject("summary").length());
    }
}
