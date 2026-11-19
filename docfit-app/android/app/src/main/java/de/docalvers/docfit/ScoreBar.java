package de.docalvers.docfit;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Shader;
import android.view.View;

/**
 * The fitness score (FitnessScore) as ten segments from Υ red (1) over λ orange to φ green (10): the segments up to the
 * score are lit, the rest stay dim, so the bar reads at a glance and its colour says how good it is.
 */
final class ScoreBar extends View {
    private final int[] colors;
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF seg = new RectF();
    private int score;   // 0..10, 0 = nothing lit

    ScoreBar(Context context, int low, int mid, int high) {
        super(context);
        colors = new int[]{low, mid, high};
    }

    void setScore(int s) {
        s = Math.max(0, Math.min(10, s));
        if (s == score) return;
        score = s;
        setContentDescription(s == 0 ? "" : s + " von 10");
        invalidate();
    }

    /** The colour of a score on the bar (1 = low, 10 = high), for the number and the word next to it. */
    static int colorFor(int score, int low, int mid, int high) {
        float t = Math.max(0, Math.min(9, score - 1)) / 9f;
        return t < 0.5f ? mix(low, mid, t * 2) : mix(mid, high, (t - 0.5f) * 2);
    }

    private static int mix(int a, int b, float t) {
        int r = 0xFF000000;
        for (int shift = 0; shift < 24; shift += 8) {
            int ca = (a >> shift) & 0xFF, cb = (b >> shift) & 0xFF;
            r |= Math.round(ca + (cb - ca) * t) << shift;
        }
        return r;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        paint.setShader(new LinearGradient(0, 0, w, 0, colors, null, Shader.TileMode.CLAMP));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        float w = getWidth(), h = getHeight();
        float gap = h * 0.35f, cell = (w - 9 * gap) / 10, radius = h / 2;
        for (int i = 0; i < 10; i++) {
            float x = i * (cell + gap);
            seg.set(x, 0, x + cell, h);
            paint.setAlpha(i < score ? 255 : 46);
            canvas.drawRoundRect(seg, radius, radius, paint);
        }
    }
}
