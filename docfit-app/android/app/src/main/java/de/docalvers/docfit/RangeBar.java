package de.docalvers.docfit;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.View;

/**
 * The small "slider" in a tile (Doc, 20.11.2026: "in jede Kachel so einen kleinen Slider, wie der Wert zu
 * interpretieren ist"): the zones of a Ranges.Scale as a thin bar - φ green good, λ orange borderline, Υ red high, in the
 * scheme's shades (Palette) - and a round marker where the value stands. The value's own zone is drawn full, the
 * others a little faded, so the eye goes to the right place. Without a value only the zones.
 */
final class RangeBar extends View {
    private final int good, border, high;
    private final Paint zone = new Paint(Paint.ANTI_ALIAS_FLAG), mark = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint ring = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF r = new RectF();
    private Ranges.Scale scale;

    RangeBar(Context context, int good, int border, int high, int markColor, int ringColor) {
        super(context);
        this.good = good;
        this.border = border;
        this.high = high;
        mark.setColor(markColor);
        ring.setColor(ringColor);
        ring.setStyle(Paint.Style.STROKE);
    }

    void setScale(Ranges.Scale s) {
        scale = s;
        setVisibility(s == null ? INVISIBLE : VISIBLE);   // keeps its room, so the tiles of a row stay alike
        invalidate();
    }

    private int color(Ranges.Zone z) {
        return z == Ranges.Zone.GOOD ? good : z == Ranges.Zone.BORDER ? border : high;
    }

    @Override
    protected void onDraw(Canvas c) {
        if (scale == null) return;
        float density = getResources().getDisplayMetrics().density;
        float h = getHeight(), radius = h * 0.42f, inset = radius + density;   // room for the marker at both ends
        float w = getWidth() - 2 * inset, thick = Math.max(3 * density, h * 0.34f), gap = 1.5f * density;
        float top = (h - thick) / 2;
        Ranges.Zone current = scale.zone();
        for (int i = 0; i < scale.bands.length; i++) {
            Ranges.Band b = scale.bands[i];
            float x0 = inset + scale.at(b.from) * w + (i == 0 ? 0 : gap / 2);
            float x1 = inset + scale.at(b.to) * w - (i == scale.bands.length - 1 ? 0 : gap / 2);
            if (x1 <= x0) continue;
            zone.setColor(color(b.zone));
            zone.setAlpha(current == null || current == b.zone ? 255 : 110);
            r.set(x0, top, x1, top + thick);
            c.drawRoundRect(r, thick / 2, thick / 2, zone);
        }
        if (!scale.hasValue()) return;
        float x = inset + scale.at(scale.value) * w;
        ring.setStrokeWidth(Math.max(1.5f, 2 * density));
        c.drawCircle(x, h / 2, radius, mark);
        c.drawCircle(x, h / 2, radius, ring);
    }
}
