package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Two people on one scale: whose a result is by weight (Weighings.whose), where a moved weigh-in lands in the other
 * list (Weighings.indexFor), and the lines that name the person (ScaleTexts). Made-up weights - a test man around
 * 85 kg and a test woman around 60 kg; nobody real.
 */
public class PersonsTest {
    private static final long T = 1_795_000_000_000L, HOUR = 3_600_000L;

    private static Weighings.Weighing kg(double kg) {
        return new Weighings.Weighing(T, (int) Math.round(kg * 100), 0);
    }

    @Test
    public void nearestWithinFiveKilos() {
        Weighings.Weighing man = kg(85), woman = kg(60);
        assertEquals(Weighings.DOC, Weighings.whose(man, woman, kg(84.2)));
        assertEquals(Weighings.OTHER, Weighings.whose(man, woman, kg(61.3)));
        assertEquals(Weighings.DOC, Weighings.whose(man, woman, kg(90.0)));     // exactly 5 kg: still near
        assertEquals(Weighings.ASK, Weighings.whose(man, woman, kg(90.01)));    // near neither
        assertEquals(Weighings.ASK, Weighings.whose(man, woman, kg(72.5)));     // right between: ask
        assertEquals(Weighings.ASK, Weighings.whose(man, woman, kg(40)));
    }

    @Test
    public void withinBothTheNearerOneATieIsDocs() {
        Weighings.Weighing a = kg(70), b = kg(74);
        assertEquals(Weighings.DOC, Weighings.whose(a, b, kg(71.9)));
        assertEquals(Weighings.OTHER, Weighings.whose(a, b, kg(72.1)));
        assertEquals(Weighings.DOC, Weighings.whose(a, b, kg(72.0)));           // a tie
    }

    @Test
    public void emptyListsFirstOfAllIsDocs() {
        assertEquals(Weighings.DOC, Weighings.whose((Weighings.Weighing) null, null, kg(50)));       // the very first weigh-in
        assertEquals(Weighings.DOC, Weighings.whose(kg(85), null, kg(83)));
        assertEquals(Weighings.ASK, Weighings.whose(kg(85), null, kg(60)));     // far from the only one there is
        assertEquals(Weighings.OTHER, Weighings.whose((Weighings.Weighing) null, kg(60), kg(61)));
        assertEquals(Weighings.ASK, Weighings.whose((Weighings.Weighing) null, kg(60), kg(85)));
    }

    @Test
    public void onlyPeopleSwitchedOnCount() {
        Weighings.Weighing[] newest = {kg(85), kg(60)};
        boolean[] both = {true, true}, docOnly = {true, false}, otherOnly = {false, true};
        assertEquals(Weighings.OTHER, Weighings.whose(newest, both, kg(61)));
        assertEquals(Weighings.ASK, Weighings.whose(newest, docOnly, kg(61)));    // far from the only one on: ask
        assertEquals(Weighings.DOC, Weighings.whose(newest, docOnly, kg(84)));
        assertEquals(Weighings.OTHER, Weighings.whose(newest, otherOnly, kg(61)));
        assertEquals(Weighings.ASK, Weighings.whose(newest, otherOnly, kg(84)));  // her data is kept, but she is off
        assertEquals(Weighings.OTHER, Weighings.whose(new Weighings.Weighing[]{kg(85), null}, otherOnly, kg(84)));
        assertEquals(Weighings.DOC, Weighings.whose(newest, new boolean[]{false, false}, kg(84)));
        assertEquals(1, Weighings.countOn(docOnly));
        assertEquals(2, Weighings.countOn(both));
        assertEquals(1, Weighings.firstOn(otherOnly));
        assertEquals(0, Weighings.firstOn(new boolean[]{false, false}));
        assertEquals("Ist das Doc?", ScaleTexts.askOne("Doc"));
        assertTrue(ScaleTexts.askOneText(kg(61)).startsWith(Times.kg(61)));
    }

    @Test
    public void movedWeighInGoesInByTime() {
        List<Weighings.Weighing> list = new ArrayList<>();   // newest first
        list.add(new Weighings.Weighing(T + 3 * HOUR, 8500, 0));
        list.add(new Weighings.Weighing(T + HOUR, 8520, 0));
        assertEquals(0, Weighings.indexFor(list, T + 4 * HOUR));
        assertEquals(1, Weighings.indexFor(list, T + 2 * HOUR));
        assertEquals(2, Weighings.indexFor(list, T));
        assertEquals(0, Weighings.indexFor(new ArrayList<>(), T));
    }

    @Test
    public void linesNameThePerson() {
        assertEquals("Doc oder Gast?", ScaleTexts.askTitle("Doc", "Gast"));
        assertEquals("Gast: " + ScaleTexts.SAVED, ScaleTexts.doneFor("Gast", Weighings.Added.NEW,
                new Weighings.Weighing(T, 6000, 500)));
        assertEquals("Doc: " + ScaleTexts.SAVED_WEIGHT_ONLY, ScaleTexts.doneFor("Doc", Weighings.Added.NEW, kg(85)));
        String ask = ScaleTexts.ask(kg(72.5));
        assertTrue(ask, ask.startsWith(Times.kg(72.5)));
        assertTrue(ask, ask.contains("Keiner"));
        String move = ScaleTexts.moveQuestion(kg(60), "Doc");
        assertTrue(move, move.startsWith(Times.kg(60)));
        assertTrue(move, move.endsWith("zu Doc verschieben?"));
    }
}
