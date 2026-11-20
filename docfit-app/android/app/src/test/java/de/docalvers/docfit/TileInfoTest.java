package de.docalvers.docfit;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/** The texts of the detail sheets (TileInfo): every value has them all, with its source, short and calm. */
public class TileInfoTest {
    @Test
    public void everyValueHasEveryPart() {
        for (TileInfo.Key k : TileInfo.Key.values()) {
            TileInfo t = TileInfo.of(k);
            for (String part : new String[]{t.title, t.what, t.how, t.moves, t.why, t.source}) {
                assertFalse(k + " empty part", part == null || part.trim().isEmpty());
                assertTrue(k + " too long: " + part, part.length() <= 420);   // short paragraphs
            }
        }
    }

    @Test
    public void sourcesAndHonestLimits() {
        assertTrue(TileInfo.of(TileInfo.Key.FAT).source.contains("Gallagher"));
        assertTrue(TileInfo.of(TileInfo.Key.FAT).source.contains("ACE"));
        assertTrue(TileInfo.of(TileInfo.Key.MUSCLE).source.contains("Janssen"));
        assertTrue(TileInfo.of(TileInfo.Key.BMI).source.contains("WHO"));
        assertTrue(TileInfo.of(TileInfo.Key.WAIST).source.contains("WHO"));
        assertTrue(TileInfo.of(TileInfo.Key.WHTR).source.contains("Ashwell"));
        assertTrue(TileInfo.of(TileInfo.Key.WHR).source.contains("WHO"));
        assertTrue(TileInfo.of(TileInfo.Key.WATER).why.contains("ärztlichen Grenzwert gibt es nicht"));
        assertTrue(TileInfo.of(TileInfo.Key.HIP).why.contains("Hüfte allein wird nicht bewertet"));
        assertTrue(TileInfo.of(TileInfo.Key.FAT).how.contains("Geschätzt"));
        assertTrue(TileInfo.LEGEND.contains("ohne Farbe: kein eigener Grenzwert"));
    }

    @Test
    public void onlyTheGirthsAreTypedIn() {
        assertTrue(TileInfo.typedIn(TileInfo.Key.WAIST));
        assertTrue(TileInfo.typedIn(TileInfo.Key.HIP));
        assertFalse(TileInfo.typedIn(TileInfo.Key.FAT));
        assertFalse(TileInfo.typedIn(TileInfo.Key.WEIGHT));
    }

    @Test
    public void noAlarmWords() {
        for (TileInfo.Key k : TileInfo.Key.values()) {
            TileInfo t = TileInfo.of(k);
            String all = (t.what + t.how + t.moves + t.why).toLowerCase(java.util.Locale.GERMAN);
            for (String bad : new String[]{"gefährlich", "tödlich", "lebensgefahr", "alarm"}) {
                assertFalse(k + ": " + bad, all.contains(bad));
            }
        }
    }
}
