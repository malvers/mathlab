package de.docalvers.docfit;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.View;

import java.util.Calendar;
import java.util.List;
import java.util.Locale;

/**
 * The course of a value in its detail sheet (Doc, 20.11.2026: "natürlich der Verlauf ... so wie beim Fasten"): the
 * zones of its scale as faint bands behind (φ green, λ orange, Υ red, as in the tiles), dashed goal lines with their
 * labels (the waist), the points joined by a line over time, the newest one ringed, the dates of the first and the
 * last weigh-in below and a few values at the left. Drawn on a Canvas in Orbitron and the scheme's colours - no
 * library, no WebView. History works out the data.
 */
final class HistoryChart extends View {
    private final Paint zone = new Paint(Paint.ANTI_ALIAS_FLAG), line = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint dot = new Paint(Paint.ANTI_ALIAS_FLAG), ring = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint grid = new Paint(Paint.ANTI_ALIAS_FLAG), label = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint goal = new Paint(Paint.ANTI_ALIAS_FLAG), goalText = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Path path = new Path();
    // a second series in its own colour, e.g. the diastolic under the systolic (Verlauf tab, Doc 26.11.2026)
    private final Paint line2 = new Paint(Paint.ANTI_ALIAS_FLAG), dot2 = new Paint(Paint.ANTI_ALIAS_FLAG);
    private List<History.Point> second;
    private final int good, border, high;
    private List<History.Point> points;
    private Ranges.Scale scale;
    private List<History.Goal> goals;
    private int decimals;

    HistoryChart(Context context, Typeface face, int lineColor, int textColor, int mutedColor, int cardColor,
                 int good, int border, int high) {
        super(context);
        this.good = good;
        this.border = border;
        this.high = high;
        float d = getResources().getDisplayMetrics().density;
        float sp = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 10, getResources().getDisplayMetrics());
        line.setStyle(Paint.Style.STROKE);
        line.setStrokeWidth(2 * d);
        line.setStrokeJoin(Paint.Join.ROUND);
        line.setColor(lineColor);
        dot.setColor(lineColor);
        ring.setStyle(Paint.Style.STROKE);
        ring.setStrokeWidth(2 * d);
        ring.setColor(textColor);
        grid.setColor((mutedColor & 0x00FFFFFF) | 0x33000000);
        grid.setStrokeWidth(Math.max(1, d));
        label.setColor(mutedColor);
        label.setTypeface(face);
        label.setTextSize(sp);
        goal.setStyle(Paint.Style.STROKE);
        goal.setStrokeWidth(1.5f * d);
        goal.setColor(textColor);
        goal.setPathEffect(new DashPathEffect(new float[]{6 * d, 4 * d}, 0));
        goalText.setColor(textColor);
        goalText.setTypeface(face);
        goalText.setTextSize(sp);
        goalText.setTextAlign(Paint.Align.RIGHT);
        // the goal labels stand on a strip of the card colour, so they read over line and zones
        zone.setColor(cardColor);
    }

    /** A second series, drawn like the first in {@code color} and taken into both axes; null for none. */
    void setSecond(List<History.Point> points, int color) {
        second = points == null || points.isEmpty() ? null : points;
        float d = getResources().getDisplayMetrics().density;
        line2.setStyle(Paint.Style.STROKE);
        line2.setStrokeWidth(2 * d);
        line2.setStrokeJoin(Paint.Join.ROUND);
        line2.setColor(color);
        dot2.setColor(color);
        invalidate();
    }

    void setData(List<History.Point> points, Ranges.Scale scale, List<History.Goal> goals, int decimals) {
        this.points = points;
        this.scale = scale;
        this.goals = goals;
        this.decimals = decimals;
        StringBuilder s = new StringBuilder("Verlauf:");
        for (History.Point p : points) s.append(' ').append(number(p.value));
        setContentDescription(s);
        invalidate();
    }

    private String number(double v) {
        return String.format(Locale.GERMANY, "%." + decimals + "f", v);
    }

    private static String date(long t) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(t);
        return String.format(Locale.GERMANY, "%02d.%02d.", c.get(Calendar.DAY_OF_MONTH), c.get(Calendar.MONTH) + 1);
    }

    private int zoneColor(Ranges.Zone z) {
        return z == Ranges.Zone.GOOD ? good : z == Ranges.Zone.BORDER ? border : high;
    }

    @Override
    protected void onDraw(Canvas c) {
        if (points == null || points.isEmpty()) return;
        float d = getResources().getDisplayMetrics().density;
        List<History.Point> all = points;
        if (second != null) {
            all = new java.util.ArrayList<>(points);
            all.addAll(second);
        }
        double[] yr = History.yRange(all, goals, History.minSpan(decimals));
        double lo = yr[0], hi = yr[1];
        // room for the values at the left and the dates below
        float left = Math.max(label.measureText(number(hi)), label.measureText(number(lo))) + 6 * d;
        float right = getWidth() - 4 * d, top = 4 * d, bottom = getHeight() - label.getTextSize() - 8 * d;
        float w = right - left, h = bottom - top;
        if (w <= 0 || h <= 0) return;

        // the zones, faint, only where they fall into the axis
        if (scale != null) {
            int keep = zone.getColor();
            for (Ranges.Band b : scale.bands) {
                double a = Math.max(b.from, lo), z = Math.min(b.to, hi);
                if (z <= a) continue;
                zone.setColor((zoneColor(b.zone) & 0x00FFFFFF) | 0x2E000000);
                c.drawRect(left, y(z, lo, hi, top, h), right, y(a, lo, hi, top, h), zone);
            }
            zone.setColor(keep);
        }
        // three values on the axis
        for (int i = 0; i <= 2; i++) {
            double v = lo + (hi - lo) * (0.1 + 0.4 * i);
            float y = y(v, lo, hi, top, h);
            c.drawLine(left, y, right, y, grid);
            label.setTextAlign(Paint.Align.RIGHT);
            c.drawText(number(v), left - 4 * d, y + label.getTextSize() / 3, label);
        }
        // the goal lines with their labels at the right
        for (History.Goal g : goals) {
            float y = y(g.value, lo, hi, top, h);
            c.drawLine(left, y, right, y, goal);
            float tw = goalText.measureText(g.label);
            c.drawRect(right - tw - 4 * d, y - goalText.getTextSize() - 3 * d, right, y - 2 * d, zone);
            c.drawText(g.label, right - 2 * d, y - 4 * d, goalText);
        }
        // the points over time (both series on one time axis); a single moment stands in the middle
        long t0 = Long.MAX_VALUE, t1 = Long.MIN_VALUE;
        for (History.Point p : all) {
            t0 = Math.min(t0, p.time);
            t1 = Math.max(t1, p.time);
        }
        float r = 3.5f * d;
        if (second != null) series(c, second, line2, dot2, t0, t1, lo, hi, left, top, w, h, r);
        float[] last = series(c, points, line, dot, t0, t1, lo, hi, left, top, w, h, r);
        c.drawCircle(last[0], last[1], r + 2 * d, ring);   // the newest
        // the dates below
        float base = getHeight() - 2 * d;
        label.setTextAlign(t1 == t0 ? Paint.Align.CENTER : Paint.Align.LEFT);
        c.drawText(date(t0), t1 == t0 ? left + w / 2 : left, base, label);
        if (t1 != t0) {
            label.setTextAlign(Paint.Align.RIGHT);
            c.drawText(date(t1), right, base, label);
        }
    }

    /** One series: the line, then its points; returns where its newest point stands. */
    private float[] series(Canvas c, List<History.Point> pts, Paint ln, Paint dt, long t0, long t1, double lo, double hi,
                           float left, float top, float w, float h, float r) {
        path.reset();
        float lx = 0, ly = 0;
        for (int i = 0; i < pts.size(); i++) {
            History.Point p = pts.get(i);
            float x = t1 == t0 ? left + w / 2 : left + r + (w - 2 * r) * (p.time - t0) / (float) (t1 - t0);
            float y = y(p.value, lo, hi, top, h);
            if (i == 0) path.moveTo(x, y);
            else path.lineTo(x, y);
            lx = x;
            ly = y;
        }
        c.drawPath(path, ln);
        for (History.Point p : pts) {
            float x = t1 == t0 ? left + w / 2 : left + r + (w - 2 * r) * (p.time - t0) / (float) (t1 - t0);
            c.drawCircle(x, y(p.value, lo, hi, top, h), r, dt);
        }
        return new float[]{lx, ly};
    }

    private static float y(double v, double lo, double hi, float top, float h) {
        return top + (float) ((hi - v) / (hi - lo)) * h;
    }
}
