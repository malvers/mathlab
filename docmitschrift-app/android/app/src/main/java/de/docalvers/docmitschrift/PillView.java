package de.docalvers.docmitschrift;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.View;

/**
 * The pill under the Start button (Doc, 05.11.2026: "sonst ist man irritiert, passiert da jetzt was oder
 * nicht"). It speaks without words (Doc, 06.11.2026: "kein Text drunter ... sehr lean"):
 *   stopped        - grey and flat
 *   ready          - yellow rim breathing slowly, flat bars: waiting for the next lesson in the timetable
 *   recording      - green rim breathing, the bars move with the voice, newest on the right
 *   quiet (15 s)   - rim and bars yellow, so a silent or dead microphone shows at once
 *   problem        - red rim; the bars turn red too when the recording itself is broken, but keep
 *                    moving green when only the bridge to the Mac is down (the pieces wait on the phone)
 */
public class PillView extends View {
    private static final int PHI = 0xFF799E31, LAMBDA = 0xFFF5C242, UPSILON = 0xFFB02418;
    private static final int MUTED = 0xFF5A5A5A, CARD = 0xFF1E1E1E;
    private static final int BARS = 40;
    private static final long SAMPLE_MS = 70;
    private static final long QUIET_MS = 15_000;        // this long without sound: the bars turn yellow

    private final float[] levels = new float[BARS];
    private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint rim = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint bar = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF box = new RectF();
    private final float density;
    private long lastSample;
    private long lastSound = System.currentTimeMillis();

    public PillView(Context c) {
        super(c);
        density = c.getResources().getDisplayMetrics().density;
        fill.setColor(CARD);
        rim.setStyle(Paint.Style.STROKE);
        bar.setStrokeCap(Paint.Cap.ROUND);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        boolean ready = AufnahmeService.running;
        boolean on = AufnahmeService.recording;
        boolean broken = !AufnahmeService.problem.isEmpty();
        boolean trouble = broken || !Bruecke.problem.isEmpty();
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
        int state = on ? (quiet ? LAMBDA : PHI) : ready ? LAMBDA : MUTED;
        int color = trouble ? UPSILON : state;

        float w = getWidth(), h = getHeight();
        float stroke = 3 * density;
        box.set(stroke, stroke, w - stroke, h - stroke);
        float r = box.height() / 2;
        canvas.drawRoundRect(box, r, r, fill);

        // the rim breathes: once every 1.6 s while recording, slowly every 4 s while waiting for a lesson
        float alpha;
        if (trouble) alpha = 1f;
        else if (on) alpha = 0.55f + 0.45f * (float) Math.sin(now / 1600.0 * 2 * Math.PI);
        else if (ready) alpha = 0.35f + 0.3f * (float) Math.sin(now / 4000.0 * 2 * Math.PI);
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
        bar.setColor(broken ? UPSILON : on ? state : MUTED);
        for (int i = 0; i < BARS; i++) {
            float half = minHalf + levels[i] * (maxHalf - minHalf);
            float x = left + step * (i + 0.5f);
            bar.setAlpha(on ? 140 + Math.round(115f * i / BARS) : 120);
            canvas.drawLine(x, mid - half, x, mid + half, bar);
        }

        postInvalidateOnAnimation();
    }
}
