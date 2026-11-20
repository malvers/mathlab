package de.docalvers.docfit;

/**
 * The run the big stopwatch shows while it stands still: the last stopped one, or none - then it reads 00:00 (Doc,
 * 19.11.2026: "wenn ich stoppe, sollte es dann auch noch eine Taste geben ... wenn ich das unten lösche ... dann sollte
 * die Zahl oben auch verschwinden"). "Reset" (until 20.11.2026 "Zurücksetzen") clears it, so does deleting that run
 * from the list ("ZEITEN"); "Rückgängig" brings it back. Start and duration together name the run, so a deleted entry is recognised even when
 * another run happens to have the same duration. Pure Java, tested in LastRunTest.
 */
final class LastRun {
    static final LastRun NONE = new LastRun(0, -1);

    final long start, duration;   // start: wall clock in ms; duration in ms, below 0 = nothing shown

    LastRun(long start, long duration) {
        this.start = start;
        this.duration = duration;
    }

    static LastRun of(Entries.Entry e) {
        return new LastRun(e.start, e.duration);
    }

    boolean shown() {
        return duration >= 0;
    }

    /** Whether this list entry is the run on the display. */
    boolean is(Entries.Entry e) {
        return shown() && e.start == start && e.duration == duration;
    }

    /** "Reset" works only while the stopwatch stands still and shows a run. */
    static boolean canReset(boolean running, LastRun last) {
        return !running && last.shown();
    }

    /** The display after a list entry was deleted: empty if it showed that run, unchanged otherwise. */
    LastRun afterDelete(Entries.Entry gone) {
        return is(gone) ? NONE : this;
    }

    /**
     * The display after "Rückgängig" brought a deleted entry back ({@code before}: the display before the delete). The
     * run returns only if the delete had taken it off the display and nothing took its place since (no new start).
     */
    LastRun afterUndo(Entries.Entry back, LastRun before, boolean running) {
        return !running && !shown() && before.is(back) ? before : this;
    }

    /**
     * Before 19.11.2026 only the duration was stored. The run shown was always the newest entry (a stop puts it on top,
     * an undo back in its place), so if the newest entry does not match, it was deleted - then nothing is shown.
     */
    static LastRun upgrade(long duration, Entries.Entry newest) {
        if (duration < 0 || newest == null || newest.duration != duration) return NONE;
        return of(newest);
    }
}
