package de.docalvers.docstep;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.View;

/**
 * The pill from DocNote, here for the motion instead of the voice: while DocStep listens, the bars follow the
 * phone's movement, newest on the right.
 *   idle       - grey and flat
 *   waiting    - yellow rim breathing: recording, but nobody walks yet (standing, phone going in)
 *   walking    - green rim breathing, the steps show as bars
 */
public class PillView extends View {
    private static final int PHI = 0xFF799E31, LAMBDA = 0xFFF5C242;
    private static final int MUTED = 0xFF5A5A5A, CARD = 0xFF1E1E1E;
    private static final int BARS = 40;

    static final int IDLE = 0, WAITING = 1, WALKING = 2;

    private final float[] levels = new float[BARS];
    private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint rim = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint bar = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF box = new RectF();
    private final float density;
    private int state = IDLE;

    public PillView(Context c) {
        super(c);
        density = c.getResources().getDisplayMetrics().density;
        fill.setColor(CARD);
        rim.setStyle(Paint.Style.STROKE);
        bar.setStrokeCap(Paint.Cap.ROUND);
    }

    /** One new bar, 0..1. */
    void push(float level) {
        System.arraycopy(levels, 1, levels, 0, BARS - 1);
        levels[BARS - 1] = Math.max(0, Math.min(1, level));
    }

    void setState(int s) {
        state = s;
        if (s == IDLE) java.util.Arrays.fill(levels, 0);
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        long now = System.currentTimeMillis();
        int color = state == WALKING ? PHI : state == WAITING ? LAMBDA : MUTED;

        float w = getWidth(), h = getHeight();
        float stroke = 3 * density;
        box.set(stroke, stroke, w - stroke, h - stroke);
        float r = box.height() / 2;
        canvas.drawRoundRect(box, r, r, fill);

        // the rim breathes once every 1.6 s while walking, slowly every 4 s while waiting
        float alpha;
        if (state == WALKING) alpha = 0.55f + 0.45f * (float) Math.sin(now / 1600.0 * 2 * Math.PI);
        else if (state == WAITING) alpha = 0.35f + 0.3f * (float) Math.sin(now / 4000.0 * 2 * Math.PI);
        else alpha = 0.6f;
        rim.setStrokeWidth(stroke);
        rim.setColor(color);
        rim.setAlpha(Math.round(255 * alpha));
        canvas.drawRoundRect(box, r, r, rim);

        // the bars between the rounded ends
        float left = box.left + r * 0.8f, right = box.right - r * 0.8f;
        float step = (right - left) / BARS;
        float mid = box.centerY(), maxHalf = box.height() * 0.36f, minHalf = 2 * density;
        bar.setStrokeWidth(Math.max(2 * density, step * 0.55f));
        bar.setColor(state == IDLE ? MUTED : color);
        for (int i = 0; i < BARS; i++) {
            float half = minHalf + levels[i] * (maxHalf - minHalf);
            float x = left + step * (i + 0.5f);
            bar.setAlpha(state != IDLE ? 140 + Math.round(115f * i / BARS) : 120);
            canvas.drawLine(x, mid - half, x, mid + half, bar);
        }

        if (state != IDLE) postInvalidateOnAnimation();
    }
}
