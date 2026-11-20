package de.docalvers.docfit;

import android.animation.ValueAnimator;
import android.content.Context;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.widget.OverScroller;

import androidx.annotation.NonNull;
import androidx.core.view.NestedScrollingParent3;
import androidx.core.view.NestedScrollingParentHelper;
import androidx.core.view.ViewCompat;
import androidx.recyclerview.widget.RecyclerView;

/**
 * A header that makes room for its list (Doc, 20.11.2026: "Wenn ich nach oben scrolle, müssen wir das intelligenter
 * machen, so dass ich unten die einzelnen Daten sehen kann"). Four children, top to bottom:
 * - the header (the big scale card), pushed up while the list is scrolled up, until only a strip as high as the
 *   compact bar is left - and pulled down again once the list is back at its top;
 * - the tail (the "MESSUNGEN · Profil" row), always right under the header, so it stays in sight;
 * - the content (the list), filling the rest;
 * - the compact bar, pinned at the top and drawn over the header's last strip, fading in as the header goes.
 * The whole tab scrolls as one page: a drag on the list reaches the header through RecyclerView's nested scrolling
 * (androidx.core), a drag (or fling) on the header itself is handled here and goes on into the list once the header is
 * collapsed - so the list is reachable even when the card is taller than the screen (Doc, 20.11.2026: "Auf Waage kann
 * ich jetzt überhaupt nicht mehr scrollen"). The header stays where the finger leaves it, like a page. The rule is
 * HeaderOffset (unit-tested) - no Material library, no theme change.
 */
final class CollapsingHeader extends ViewGroup implements NestedScrollingParent3 {
    private static final long SETTLE_MS = 220;

    private final NestedScrollingParentHelper helper = new NestedScrollingParentHelper(this);
    private final HeaderOffset off = new HeaderOffset();
    private final View header, tail, content, compact;
    private final RecyclerView list;
    private ValueAnimator settle;
    // a drag that starts on the header, the tail or the compact bar
    private final int touchSlop, minFling, maxFling;
    private final OverScroller flinger;
    private VelocityTracker velocity;
    private float downY, lastY;
    private boolean dragging, onList;
    private int flingY;

    /** @param list the RecyclerView inside {@code content}: a drag on the header goes on into it */
    CollapsingHeader(Context context, View header, View tail, View content, RecyclerView list, View compact) {
        super(context);
        this.header = header;
        this.tail = tail;
        this.content = content;
        this.list = list;
        this.compact = compact;
        ViewConfiguration vc = ViewConfiguration.get(context);
        touchSlop = vc.getScaledTouchSlop();
        minFling = vc.getScaledMinimumFlingVelocity();
        maxFling = vc.getScaledMaximumFlingVelocity();
        flinger = new OverScroller(context);
        // the order is the drawing order: the compact bar on top
        addView(header);
        addView(tail);
        addView(content);
        addView(compact);
        compact.setVisibility(INVISIBLE);
    }

    /** Opens or collapses the header, e.g. open for a new weigh-in; before the first layout there is nothing to move. */
    void setOpen(boolean open, boolean animate) {
        settleTo(open ? 0 : -off.range(), animate);
    }

    boolean isCollapsed() {
        return off.collapsed();
    }

    @Override
    protected LayoutParams generateDefaultLayoutParams() {
        return new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
    }

    @Override
    protected void onMeasure(int widthSpec, int heightSpec) {
        int w = MeasureSpec.getSize(widthSpec), h = MeasureSpec.getSize(heightSpec);
        int exact = MeasureSpec.makeMeasureSpec(w, MeasureSpec.EXACTLY);
        int free = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
        header.measure(exact, free);
        tail.measure(exact, free);
        compact.measure(exact, free);
        // the list is as high as the room left when the header is collapsed: open, its lower end is out of sight
        int pinned = compact.getMeasuredHeight() + tail.getMeasuredHeight();
        content.measure(exact, MeasureSpec.makeMeasureSpec(Math.max(0, h - pinned), MeasureSpec.EXACTLY));
        setMeasuredDimension(w, h);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        int w = r - l, hh = header.getMeasuredHeight(), th = tail.getMeasuredHeight();
        header.layout(0, 0, w, hh);
        tail.layout(0, hh, w, hh + th);
        content.layout(0, hh + th, w, hh + th + content.getMeasuredHeight());
        compact.layout(0, 0, w, compact.getMeasuredHeight());
        off.setRange(hh - compact.getMeasuredHeight());
        apply();
    }

    private void apply() {
        float y = off.offset();
        header.setTranslationY(y);
        tail.setTranslationY(y);
        content.setTranslationY(y);
        float a = HeaderOffset.compactAlpha(off.progress());
        compact.setAlpha(a);
        compact.setVisibility(a > 0 ? VISIBLE : INVISIBLE);   // invisible: no taps on a bar that is not there
    }

    private void settleTo(int target, boolean animate) {
        if (settle != null) settle.cancel();
        settle = null;
        if (!animate || off.offset() == target) {
            off.set(target);
            apply();
            return;
        }
        settle = ValueAnimator.ofInt(off.offset(), target);
        settle.setDuration(SETTLE_MS);
        settle.setInterpolator(new DecelerateInterpolator());
        settle.addUpdateListener(a -> {
            off.set((int) a.getAnimatedValue());
            apply();
        });
        settle.start();
    }

    // ---------- a drag on the header: the header first, then the list ----------

    /**
     * One scroll step of {@code dy} px (> 0 = the page moves up): up, the header goes first, then the list; down, the
     * list goes first, then the header comes back. Returns whether anything moved.
     */
    private boolean scrollStep(int dy) {
        int moved;
        if (dy > 0) {
            moved = off.beforeScroll(dy);
            int rest = dy - moved;
            if (rest > 0) {
                int before = list.computeVerticalScrollOffset();
                list.scrollBy(0, rest);
                moved += list.computeVerticalScrollOffset() - before;
            }
        } else {
            int before = list.computeVerticalScrollOffset();
            list.scrollBy(0, dy);
            int listed = list.computeVerticalScrollOffset() - before;   // <= 0
            moved = -listed - off.afterScroll(dy - listed);
        }
        apply();
        return moved != 0;
    }

    private boolean onList(MotionEvent e) {
        return e.getY() >= content.getTop() + content.getTranslationY();
    }

    private void stopFling() {
        flinger.forceFinished(true);
        removeCallbacks(fling);
    }

    private final Runnable fling = new Runnable() {
        @Override
        public void run() {
            if (!flinger.computeScrollOffset()) return;
            int y = flinger.getCurrY(), dy = y - flingY;
            flingY = y;
            if (dy != 0 && !scrollStep(dy)) {   // the page is at its end
                flinger.forceFinished(true);
                return;
            }
            postOnAnimation(this);
        }
    };

    private void track(MotionEvent e) {
        if (velocity == null) velocity = VelocityTracker.obtain();
        velocity.addMovement(e);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent e) {
        switch (e.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                stopFling();
                if (settle != null) settle.cancel();
                downY = lastY = e.getY();
                dragging = false;
                onList = onList(e);   // the list scrolls itself and tells us (nested scrolling)
                if (velocity != null) velocity.clear();
                track(e);
                break;
            case MotionEvent.ACTION_MOVE:
                track(e);
                if (!onList && !dragging && Math.abs(e.getY() - downY) > touchSlop) {
                    dragging = true;
                    lastY = e.getY();
                    getParent().requestDisallowInterceptTouchEvent(true);
                    return true;   // taken from the tile or button under the finger
                }
                break;
            default:
                break;
        }
        return dragging;
    }

    @Override
    public boolean onTouchEvent(MotionEvent e) {
        track(e);
        switch (e.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                return true;   // a drag that starts on plain header space
            case MotionEvent.ACTION_MOVE:
                if (!dragging && Math.abs(e.getY() - downY) > touchSlop) {
                    dragging = true;
                    lastY = e.getY();
                    getParent().requestDisallowInterceptTouchEvent(true);
                }
                if (dragging) {
                    int dy = Math.round(lastY - e.getY());
                    if (dy != 0) {
                        scrollStep(dy);
                        lastY -= dy;
                    }
                }
                return true;
            case MotionEvent.ACTION_UP:
                if (dragging && velocity != null) {
                    velocity.computeCurrentVelocity(1000, maxFling);
                    int vy = Math.round(-velocity.getYVelocity());
                    if (Math.abs(vy) > minFling) {
                        flingY = 0;
                        flinger.fling(0, 0, 0, vy, 0, 0, Integer.MIN_VALUE / 2, Integer.MAX_VALUE / 2);
                        postOnAnimation(fling);
                    }
                }
                dragging = false;
                return true;
            case MotionEvent.ACTION_CANCEL:
                dragging = false;
                return true;
            default:
                return true;
        }
    }

    // ---------- nested scrolling: the list asks before and tells after every scroll step ----------

    @Override
    public boolean onStartNestedScroll(@NonNull View child, @NonNull View target, int axes, int type) {
        if ((axes & ViewCompat.SCROLL_AXIS_VERTICAL) == 0) return false;
        if (settle != null) settle.cancel();
        settle = null;
        stopFling();
        return true;
    }

    @Override
    public void onNestedScrollAccepted(@NonNull View child, @NonNull View target, int axes, int type) {
        helper.onNestedScrollAccepted(child, target, axes, type);
    }

    @Override
    public void onStopNestedScroll(@NonNull View target, int type) {
        helper.onStopNestedScroll(target, type);   // no snapping: the header stays where the finger left it
    }

    @Override
    public void onNestedPreScroll(@NonNull View target, int dx, int dy, @NonNull int[] consumed, int type) {
        int used = off.beforeScroll(dy);
        if (used != 0) {
            consumed[1] += used;
            apply();
        }
    }

    @Override
    public void onNestedScroll(@NonNull View target, int dxConsumed, int dyConsumed, int dxUnconsumed,
                               int dyUnconsumed, int type, @NonNull int[] consumed) {
        int used = off.afterScroll(dyUnconsumed);
        if (used != 0) {
            consumed[1] += used;
            apply();
        }
    }

    @Override
    public void onNestedScroll(@NonNull View target, int dxConsumed, int dyConsumed, int dxUnconsumed,
                               int dyUnconsumed, int type) {
        onNestedScroll(target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, type, new int[2]);
    }

    // the older callbacks without a type are touch scrolls

    @Override
    public boolean onStartNestedScroll(@NonNull View child, @NonNull View target, int axes) {
        return onStartNestedScroll(child, target, axes, ViewCompat.TYPE_TOUCH);
    }

    @Override
    public void onNestedScrollAccepted(@NonNull View child, @NonNull View target, int axes) {
        onNestedScrollAccepted(child, target, axes, ViewCompat.TYPE_TOUCH);
    }

    @Override
    public void onStopNestedScroll(@NonNull View target) {
        onStopNestedScroll(target, ViewCompat.TYPE_TOUCH);
    }

    @Override
    public void onNestedScroll(@NonNull View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed) {
        onNestedScroll(target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, ViewCompat.TYPE_TOUCH);
    }

    @Override
    public void onNestedPreScroll(@NonNull View target, int dx, int dy, @NonNull int[] consumed) {
        onNestedPreScroll(target, dx, dy, consumed, ViewCompat.TYPE_TOUCH);
    }

    @Override
    public boolean onNestedFling(@NonNull View target, float velocityX, float velocityY, boolean consumed) {
        return false;
    }

    @Override
    public boolean onNestedPreFling(@NonNull View target, float velocityX, float velocityY) {
        return false;
    }

    @Override
    public int getNestedScrollAxes() {
        return helper.getNestedScrollAxes();
    }
}
