package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * What the big stopwatch shows after a stop (LastRun): "Reset", deleting the shown run from the list, undoing
 * that delete, and the upgrade from the old preferences that held only the duration.
 */
public class LastRunTest {
    private static final Entries.Entry RUN = new Entries.Entry(1_000_000L, 462_000L);          // 07:42
    private static final Entries.Entry OTHER = new Entries.Entry(2_000_000L, 120_500L);        // 02:00
    private static final Entries.Entry SAME_TIME = new Entries.Entry(3_000_000L, 462_000L);    // also 07:42

    @Test
    public void nothingShownReadsAsNone() {
        assertFalse(LastRun.NONE.shown());
        assertFalse(new LastRun(0, -1).shown());
        assertTrue(LastRun.of(RUN).shown());
        assertTrue(new LastRun(5, 0).shown());   // a run under a second still is a run (shows 00:00 in orange)
    }

    @Test
    public void resetOnlyWhenStoppedAndShowingARun() {
        LastRun shown = LastRun.of(RUN);
        assertTrue(LastRun.canReset(false, shown));
        assertFalse(LastRun.canReset(true, shown));            // running
        assertFalse(LastRun.canReset(false, LastRun.NONE));    // already 00:00
        assertFalse(LastRun.canReset(true, LastRun.NONE));
    }

    @Test
    public void runIsRecognisedByStartAndDuration() {
        LastRun shown = LastRun.of(RUN);
        assertTrue(shown.is(RUN));
        assertTrue(shown.is(new Entries.Entry(RUN.start, RUN.duration)));
        assertFalse(shown.is(OTHER));
        assertFalse(shown.is(SAME_TIME));                      // same duration, another run
        assertFalse(LastRun.NONE.is(new Entries.Entry(0, -1)));
    }

    @Test
    public void deletingTheShownRunClearsTheDisplay() {
        LastRun shown = LastRun.of(RUN);
        assertFalse(shown.afterDelete(RUN).shown());
    }

    @Test
    public void deletingAnotherRunKeepsTheDisplay() {
        LastRun shown = LastRun.of(RUN);
        assertSame(shown, shown.afterDelete(OTHER));
        assertSame(shown, shown.afterDelete(SAME_TIME));
        assertSame(LastRun.NONE, LastRun.NONE.afterDelete(RUN));
    }

    @Test
    public void undoBringsTheRunBack() {
        LastRun before = LastRun.of(RUN);
        LastRun after = before.afterDelete(RUN);
        LastRun back = after.afterUndo(RUN, before, false);
        assertTrue(back.is(RUN));
        assertEquals(RUN.duration, back.duration);
    }

    @Test
    public void undoOfAnotherRunLeavesTheDisplayAlone() {
        LastRun before = LastRun.of(RUN);
        LastRun after = before.afterDelete(OTHER);
        assertSame(after, after.afterUndo(OTHER, before, false));
        // the display had been reset before OTHER was deleted: undo must not bring anything back
        assertSame(LastRun.NONE, LastRun.NONE.afterUndo(OTHER, LastRun.NONE, false));
    }

    @Test
    public void undoDoesNotOverwriteANewerRun() {
        LastRun before = LastRun.of(RUN);
        LastRun after = before.afterDelete(RUN);
        assertSame(after, after.afterUndo(RUN, before, true));            // a new run is going
        LastRun newer = LastRun.of(OTHER);                                // a new run has stopped meanwhile
        assertSame(newer, newer.afterUndo(RUN, before, false));
    }

    @Test
    public void upgradeFindsTheShownRunOnTop() {
        LastRun up = LastRun.upgrade(RUN.duration, RUN);
        assertTrue(up.is(RUN));
    }

    @Test
    public void upgradeClearsARunThatWasAlreadyDeleted() {
        assertFalse(LastRun.upgrade(RUN.duration, OTHER).shown());   // the shown run is gone from the list
        assertFalse(LastRun.upgrade(RUN.duration, null).shown());    // the list is empty
        assertFalse(LastRun.upgrade(-1, RUN).shown());               // nothing was shown
    }
}
