package de.docalvers.docfit;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;

/**
 * Numbers that do not jump - DocFit's counterpart of the web's CyberClock.digits (HTML/js/cyber-clock.js). Orbitron is
 * proportional (a "1" is half as wide as a "0"), so a running time in a TextView wobbles (Doc, 19.11.2026: "nimm bitte
 * Zahlen-Widget, die Zahlen springen da hin und her").
 *
 * Every digit sits centred in its own cell as wide as the font's widest digit, ":" "," "." centred in a narrower fixed
 * cell, every other character (units, spaces, "–") at its own width. One line, centred vertically on the digits; a text
 * too long for the view is drawn smaller instead of being cut. Used like a TextView: setText, setTextColor,
 * setTextSize, setGravity (horizontal).
 */
final class DigitsView extends View {
    private static final float SEP_EM = 0.35f;   // separator cell in em, as CyberClock.digits (--cc-sw)

    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
    private final Rect digitBox = new Rect();
    private String text = "";
    private float size;                 // px as asked for; drawn smaller only when the text does not fit
    private int gravity = Gravity.CENTER_HORIZONTAL;

    DigitsView(Context context, Typeface face, float sp, int color) {
        super(context);
        paint.setTypeface(face);
        paint.setColor(color);
        setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
    }

    void setText(String s) {
        if (s == null) s = "";
        if (s.equals(text)) return;
        float before = widthAt(size);
        text = s;
        setContentDescription(s);
        if (widthAt(size) != before) requestLayout();   // only matters for wrap_content
        invalidate();
    }

    void setTextColor(int color) {
        if (paint.getColor() == color) return;
        paint.setColor(color);
        invalidate();
    }

    void setTextSize(int unit, float value) {
        size = TypedValue.applyDimension(unit, value, getResources().getDisplayMetrics());
        requestLayout();
        invalidate();
    }

    void setGravity(int g) {
        gravity = g;
        invalidate();
    }

    private static boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    private static boolean isSeparator(char c) {
        return c == ':' || c == ',' || c == '.';
    }

    /** The cell of the widest digit at the paint's current size. */
    private float digitCell() {
        float cell = 0;
        for (char d = '0'; d <= '9'; d++) cell = Math.max(cell, paint.measureText(String.valueOf(d)));
        return cell;
    }

    private float separatorCell() {
        return Math.max(SEP_EM * paint.getTextSize(), paint.measureText(":"));
    }

    private float advance(int i, float digit, float separator) {
        char c = text.charAt(i);
        return isDigit(c) ? digit : isSeparator(c) ? separator : paint.measureText(text, i, i + 1);
    }

    /** Sets the paint to px and returns the width of the text in cells. */
    private float widthAt(float px) {
        paint.setTextSize(px);
        float digit = digitCell(), separator = separatorCell(), w = 0;
        for (int i = 0; i < text.length(); i++) w += advance(i, digit, separator);
        return w;
    }

    @Override
    protected void onMeasure(int widthSpec, int heightSpec) {
        int w = (int) Math.ceil(widthAt(size)) + getPaddingLeft() + getPaddingRight();
        Paint.FontMetrics fm = paint.getFontMetrics();
        int h = (int) Math.ceil(fm.descent - fm.ascent) + getPaddingTop() + getPaddingBottom();
        setMeasuredDimension(resolveSize(w, widthSpec), resolveSize(h, heightSpec));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (text.isEmpty()) return;
        int left = getPaddingLeft(), room = getWidth() - left - getPaddingRight();
        int top = getPaddingTop(), high = getHeight() - top - getPaddingBottom();
        float w = widthAt(size);
        if (w > room && room > 0) w = widthAt(size * room / w);   // too long: smaller, never cut
        float digit = digitCell(), separator = separatorCell();
        // the baseline puts the digits' middle on the view's middle - the same line whatever the text holds
        paint.getTextBounds("0", 0, 1, digitBox);
        float y = top + high / 2f - digitBox.exactCenterY();
        int h = Gravity.getAbsoluteGravity(gravity, getLayoutDirection()) & Gravity.HORIZONTAL_GRAVITY_MASK;
        float x = h == Gravity.LEFT ? left : h == Gravity.RIGHT ? left + room - w : left + (room - w) / 2f;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            float a = advance(i, digit, separator);
            if (isDigit(c) || isSeparator(c)) {
                paint.setTextAlign(Paint.Align.CENTER);    // centred in its fixed cell
                canvas.drawText(text, i, i + 1, x + a / 2, y, paint);
            } else {
                paint.setTextAlign(Paint.Align.LEFT);
                canvas.drawText(text, i, i + 1, x, y, paint);
            }
            x += a;
        }
    }
}
