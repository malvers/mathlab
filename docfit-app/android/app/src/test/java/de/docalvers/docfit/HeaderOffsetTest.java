package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/** The collapsing scale card (HeaderOffset): who gets a scroll step, where a half-pushed card settles. */
public class HeaderOffsetTest {
    private static HeaderOffset open(int range) {
        HeaderOffset h = new HeaderOffset();
        h.setRange(range);
        return h;
    }

    @Test
    public void scrollingUpPushesTheCardFirstThenTheListScrolls() {
        HeaderOffset h = open(300);
        assertEquals(120, h.beforeScroll(120));   // all of it moves the card
        assertEquals(-120, h.offset());
        assertEquals(180, h.beforeScroll(250));   // only what is left of the card; the list takes the other 70
        assertEquals(-300, h.offset());
        assertTrue(h.collapsed());
        assertEquals(0, h.beforeScroll(50));      // collapsed: everything goes to the list
        assertEquals(0, h.beforeScroll(-40));     // scrolling down: the list goes first
        assertEquals(-300, h.offset());
    }

    @Test
    public void theCardComesBackOnlyWhenTheListIsAtItsTop() {
        HeaderOffset h = open(300);
        h.set(-300);
        assertEquals(0, h.afterScroll(0));        // the list took it all
        assertEquals(-100, h.afterScroll(-100));  // the list stands at its top: the card comes down
        assertEquals(-200, h.offset());
        assertEquals(-200, h.afterScroll(-500));  // never further than open
        assertEquals(0, h.offset());
        assertEquals(0, h.afterScroll(30));
    }

    @Test
    public void aCollapsedCardStaysCollapsedWhenItsHeightChanges() {
        HeaderOffset h = open(300);
        h.set(-300);
        h.setRange(340);                          // e.g. a note appeared under the score
        assertEquals(-340, h.offset());
        h.set(-100);
        h.setRange(80);                           // a half-pushed card is only clamped
        assertEquals(-80, h.offset());
        h.setRange(0);
        assertEquals(0, h.offset());
        assertFalse(h.collapsed());
    }

    @Test
    public void theCompactBarFadesInOverTheLastPart() {
        HeaderOffset h = open(400);
        assertEquals(0f, h.progress(), 1e-6);
        h.set(-200);
        assertEquals(0.5f, h.progress(), 1e-6);
        assertEquals(0f, HeaderOffset.compactAlpha(0.5f), 1e-6);   // a readable card is never covered
        assertEquals(1f, HeaderOffset.compactAlpha(1f), 1e-6);
        assertTrue(HeaderOffset.compactAlpha(0.8f) > 0 && HeaderOffset.compactAlpha(0.8f) < 1);
    }
}
