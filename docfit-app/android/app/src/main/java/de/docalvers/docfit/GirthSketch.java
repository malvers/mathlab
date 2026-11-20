package de.docalvers.docfit;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.View;

/**
 * Where waist and hip are measured, as a small line sketch under the two fields (Doc, 20.11.2026: "machen wir unten
 * drunter noch ein kleines Bild von der Figur, wo genau man das misst ... so eine Art Skizze"): a torso from the front
 * like a tailor's dummy, the tape for "Bauch" through the navel (midway between the lowest rib and the top of the hip
 * bone) and for "Hüfte" around the widest part of the buttocks, each with its word. Drawn here, no picture from
 * anywhere; the colours come from the scheme (Palette), so it reads in Blau, Grau and Hell.
 */
final class GirthSketch extends View {
    // the torso in its own units: x from -29 to 29 around the middle, y from 0 (neck) to 140 (thighs)
    private static final float H = 140, BODY = 29;
    private static final float WAIST_Y = 70, WAIST_SAG = 6, WAIST_HALF = 26;   // tape ends, how far it sags in front
    private static final float HIP_Y = 101, HIP_SAG = 6, HIP_HALF = 33;

    private final Paint body = new Paint(Paint.ANTI_ALIAS_FLAG), fill = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint navel = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint waist = new Paint(Paint.ANTI_ALIAS_FLAG), hip = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint waistText = new Paint(Paint.ANTI_ALIAS_FLAG), hipText = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Path outline = new Path(), tape = new Path();
    private final String waistWord, hipWord;

    GirthSketch(Context context, Typeface face, int bodyColor, int waistColor, int hipColor, String waistWord,
                String hipWord) {
        super(context);
        this.waistWord = waistWord;
        this.hipWord = hipWord;
        body.setStyle(Paint.Style.STROKE);
        body.setStrokeJoin(Paint.Join.ROUND);
        body.setColor(bodyColor);
        fill.setStyle(Paint.Style.FILL);
        fill.setColor((bodyColor & 0x00FFFFFF) | 0x1F000000);   // a faint body in the same colour
        navel.setStyle(Paint.Style.FILL);
        navel.setColor(bodyColor);
        for (Paint p : new Paint[]{waist, hip}) {
            p.setStyle(Paint.Style.STROKE);
            p.setStrokeCap(Paint.Cap.ROUND);
        }
        waist.setColor(waistColor);
        hip.setColor(hipColor);
        float sp = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 12, getResources().getDisplayMetrics());
        for (Paint p : new Paint[]{waistText, hipText}) {
            p.setTypeface(face);
            p.setTextSize(sp);
        }
        waistText.setColor(waistColor);
        hipText.setColor(hipColor);
        setContentDescription("Skizze: " + waistWord + " in Höhe des Nabels, zwischen unterster Rippe und Beckenkamm; "
                + hipWord + " an der breitesten Stelle des Gesäßes");
    }

    @Override
    protected void onDraw(Canvas c) {
        float pad = getResources().getDisplayMetrics().density * 4;
        float u = (getHeight() - 2 * pad) / H;   // px per unit
        if (u <= 0) return;
        float gap = 5 * u;
        float label = Math.max(waistText.measureText(waistWord), hipText.measureText(hipWord));
        // body, tapes and words together stand in the middle
        float cx = getWidth() / 2f - (gap + label) / 2f, top = pad;

        body.setStrokeWidth(Math.max(1.5f, 1.3f * u));
        waist.setStrokeWidth(Math.max(2f, 2f * u));
        hip.setStrokeWidth(Math.max(2f, 2f * u));
        torso(cx, top, u);
        c.drawPath(outline, fill);
        c.drawPath(outline, body);

        drawTape(c, cx, top, u, WAIST_Y, WAIST_SAG, WAIST_HALF, waist);
        drawTape(c, cx, top, u, HIP_Y, HIP_SAG, HIP_HALF, hip);
        // the navel, just above the middle of the waist tape: the tape goes through it
        c.drawCircle(cx, top + (WAIST_Y + WAIST_SAG / 2 - 4) * u, Math.max(1.5f, 1.2f * u), navel);
        float tx = cx + HIP_HALF * u + gap;
        c.drawText(waistWord, tx, top + WAIST_Y * u - (waistText.ascent() + waistText.descent()) / 2, waistText);
        c.drawText(hipWord, tx, top + HIP_Y * u - (hipText.ascent() + hipText.descent()) / 2, hipText);
    }

    /** A tape around the body seen from the front: its ends at the sides, a little lower in front. */
    private void drawTape(Canvas c, float cx, float top, float u, float y, float sag, float half, Paint p) {
        tape.reset();
        tape.moveTo(cx - half * u, top + y * u);
        tape.quadTo(cx, top + (y + sag) * u, cx + half * u, top + y * u);
        c.drawPath(tape, p);
    }

    /** The outline of the torso: the right half point by point, the left half its mirror image. */
    private void torso(float cx, float top, float u) {
        // right side from the neck down to the thigh, then the inside of the leg up to the crotch; each row is a
        // cubic Bezier: control 1, control 2, end
        float[][] right = {
                {8, 13, 16, 14, 24, 16},          // neck to shoulder
                {29, 17, 31, 22, 29, 30},         // round of the shoulder
                {27, 40, 26, 50, 23, 60},         // side of the chest
                {21, 68, 21, 74, 23, 82},         // waist, narrowest at the navel
                {26, 89, BODY, 95, BODY, 102},    // hip, widest at the buttocks
                {BODY, 113, 27, 125, 24, H},      // outside of the thigh
        };
        outline.reset();
        outline.moveTo(cx + 6 * u, top);
        outline.lineTo(cx + 6 * u, top + 9 * u);
        for (float[] k : right) {
            outline.cubicTo(cx + k[0] * u, top + k[1] * u, cx + k[2] * u, top + k[3] * u, cx + k[4] * u, top + k[5] * u);
        }
        outline.lineTo(cx + 3 * u, top + H * u);
        outline.cubicTo(cx + 3 * u, top + 130 * u, cx + 2 * u, top + 122 * u, cx, top + 118 * u);   // inner leg
        outline.cubicTo(cx - 2 * u, top + 122 * u, cx - 3 * u, top + 130 * u, cx - 3 * u, top + H * u);
        outline.lineTo(cx - 24 * u, top + H * u);
        // back up the left side: the same curves mirrored and in reverse order
        for (int i = right.length - 1; i >= 0; i--) {
            float[] k = right[i];
            float[] prev = i == 0 ? new float[]{6, 9} : new float[]{right[i - 1][4], right[i - 1][5]};
            outline.cubicTo(cx - k[2] * u, top + k[3] * u, cx - k[0] * u, top + k[1] * u, cx - prev[0] * u, top + prev[1] * u);
        }
        outline.lineTo(cx - 6 * u, top);
        outline.close();
    }
}
