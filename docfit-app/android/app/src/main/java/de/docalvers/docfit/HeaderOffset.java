package de.docalvers.docfit;

/**
 * The arithmetic of CollapsingHeader, pure Java so it is unit-tested (HeaderOffsetTest): how far the header is pushed
 * up - 0 = open, -range = collapsed - and who gets a scroll step, the header or the list below it.
 *
 * Scrolling the list up, the header goes first until it is collapsed, then the list scrolls. Scrolling down, the list
 * goes first; only what it cannot take any more (it stands at its top) brings the header back. The same rule as
 * Material's AppBarLayout with "scroll|exitUntilCollapsed" (no snapping: a card taller than the screen must stop
 * anywhere, like a page).
 */
final class HeaderOffset {
    private int range, offset;

    int range() {
        return range;
    }

    int offset() {
        return offset;
    }

    /** A new height to give way (the header grew or shrank): a collapsed header stays collapsed, else it is clamped. */
    void setRange(int r) {
        boolean wasCollapsed = collapsed();
        range = Math.max(0, r);
        offset = wasCollapsed ? -range : clamp(offset);
    }

    void set(int o) {
        offset = clamp(o);
    }

    private int clamp(int o) {
        return Math.max(-range, Math.min(0, o));
    }

    boolean collapsed() {
        return range > 0 && offset == -range;
    }

    /**
     * The list is about to scroll by {@code dy} (> 0 = its content moves up): the header takes what it can first.
     * Returns the part it took.
     */
    int beforeScroll(int dy) {
        if (dy <= 0) return 0;
        int used = Math.min(dy, offset + range);
        offset -= used;
        return used;
    }

    /** The part of a scroll the list could not take ({@code dy} < 0 = it stands at its top): the header comes back. */
    int afterScroll(int dyUnconsumed) {
        if (dyUnconsumed >= 0) return 0;
        int used = Math.max(dyUnconsumed, offset);
        offset -= used;
        return used;
    }

    /** 0 = open, 1 = collapsed. */
    float progress() {
        return range == 0 ? 0 : -offset / (float) range;
    }

    /** The compact bar fades in over the last part of the way, so it never covers a header that is still readable. */
    static float compactAlpha(float progress) {
        return Math.max(0f, Math.min(1f, (progress - 0.55f) / 0.45f));
    }
}
