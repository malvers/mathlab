package de.docalvers.docmitschrift;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.view.View;

/**
 * The pill in the lower half of the screen (Doc, 05.11.2026: "sonst ist man irritiert, passiert da jetzt
 * was oder nicht"). While recording, its rim breathes in green and the bars inside move with the voice,
 * newest on the right, so a silent or dead microphone shows at once. Stopped, it lies grey and flat.
 */
public class PillView extends View {
    private static final int PHI = 0xFF799E31, LAMBDA = 0xFFF5C242, MUTED = 0xFF5A5A5A, CARD = 0xFF1E1E1E;
    private static final int BARS = 40;
    private static final long SAMPLE_MS = 70;
    private static final long QUIET_MS = 15_000;        // this long without sound: the bars turn yellow

    private final float[] levels = new float[BARS];
    private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint rim = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint bar = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint label = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF box = new RectF();
    private final float density;
    private long lastSample;
    private long lastSound = System.currentTimeMillis();

    public PillView(Context c, Typeface font) {
        super(c);
        density = c.getResources().getDisplayMetrics().density;
        fill.setColor(CARD);
        rim.setStyle(Paint.Style.STROKE);
        bar.setStrokeCap(Paint.Cap.ROUND);
        label.setTypeface(font);
        label.setTextAlign(Paint.Align.CENTER);
        label.setTextSize(13 * c.getResources().getDisplayMetrics().scaledDensity);
        label.setColor(0xFF9A9A9A);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        boolean on = AufnahmeService.recording;
        long now = System.currentTimeMillis();
        if (on && now - lastSample >= SAMPLE_MS) {
            lastSample = now;
            System.arraycopy(levels, 1, levels, 0, BARS - 1);
            float level = AufnahmeService.level();
            levels[BARS - 1] = level;
            if (level > 0.25f) lastSound = now;
        }
        if (!on) {
            java.util.Arrays.fill(levels, 0);
            lastSound = now;
        }
        boolean quiet = on && now - lastSound > QUIET_MS;
        int color = !on ? MUTED : quiet ? LAMBDA : PHI;

        float w = getWidth(), h = getHeight() - 28 * density;
        float stroke = 3 * density;
        box.set(stroke, stroke, w - stroke, h - stroke);
        float r = box.height() / 2;
        canvas.drawRoundRect(box, r, r, fill);

        // the rim breathes once every 1.6 s while recording
        float breath = on ? 0.55f + 0.45f * (float) Math.sin(now / 1600.0 * 2 * Math.PI) : 1f;
        rim.setStrokeWidth(stroke);
        rim.setColor(color);
        rim.setAlpha(Math.round(255 * (on ? breath : 0.6f)));
        canvas.drawRoundRect(box, r, r, rim);

        // the bars between the rounded ends
        float left = box.left + r * 0.8f, right = box.right - r * 0.8f;
        float step = (right - left) / BARS;
        float mid = box.centerY(), maxHalf = box.height() * 0.36f, minHalf = 2 * density;
        bar.setStrokeWidth(Math.max(2 * density, step * 0.55f));
        bar.setColor(color);
        for (int i = 0; i < BARS; i++) {
            float half = minHalf + levels[i] * (maxHalf - minHalf);
            float x = left + step * (i + 0.5f);
            bar.setAlpha(on ? 140 + Math.round(115f * i / BARS) : 120);
            canvas.drawLine(x, mid - half, x, mid + half, bar);
        }

        String text = !on ? "Keine Aufnahme" : quiet ? "Nimmt auf · gerade still" : "Nimmt auf";
        canvas.drawText(text, w / 2, getHeight() - 6 * density, label);

        postInvalidateOnAnimation();
    }
}
