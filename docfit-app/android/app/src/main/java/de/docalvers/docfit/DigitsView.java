package de.docalvers.docfit;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.util.Log;
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
 * setTextSize, setGravity (horizontal). setFitWidth makes the drawn digits exactly as wide as the view (the stopwatch,
 * Doc, 20.11.2026: "Die Stoppuhr kann so breit wie die Buttons", then "noch nicht so breit ... von links Start bis
 * rechts Reset"): measured on the ink of the glyphs, not on their cells - a digit's cell has side bearings, so "00:00"
 * in cells is 3 % wider than its ink.
 */
final class DigitsView extends View {
    private static final float SEP_EM = 0.35f;   // separator cell in em, as CyberClock.digits (--cc-sw)

    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
    private final Rect digitBox = new Rect(), glyph = new Rect();
    private String text = "";
    private float size;                 // px as asked for; drawn smaller only when the text does not fit
    private int gravity = Gravity.CENTER_HORIZONTAL;
    private String fitTo;               // fill the width: the height is taken from this text (null = use size)
    private String fitShape;            // the shape the size below was found for ("00:00": every digit a 0)
    private int fitRoom = -1;
    private float fitPx, fitShift;      // size, and how far the cells start left of the ink
    private boolean fitLogged;

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

    /**
     * Draws the text with its ink exactly as wide as the view: the size is found for the text's shape - every digit
     * taken as "0", the widest, so "00:00" spans edge to edge and every other time of that shape keeps size and
     * cells (nothing jumps; a "1" simply stands narrower in its cell). "1:02:03" is another shape: from an hour on
     * the digits get smaller once. The height follows {@code reference} ("00:00"). Null switches it off.
     */
    void setFitWidth(String reference) {
        fitTo = reference;
        fitShape = null;
        requestLayout();
        invalidate();
    }

    /** The ink of {@code s} laid out in cells at the paint's size: {left, right} from the start of the first cell. */
    private float[] inkOf(String s) {
        float digit = digitCell(), separator = separatorCell(), x = 0;
        float l = Float.MAX_VALUE, r = -Float.MAX_VALUE;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            float a = advance(s, i, digit, separator);
            paint.getTextBounds(s, i, i + 1, glyph);
            if (!glyph.isEmpty()) {
                // centred in its cell (Paint.Align.CENTER moves the glyph back by half its advance)
                float origin = isDigit(c) || isSeparator(c) ? x + a / 2 - paint.measureText(s, i, i + 1) / 2 : x;
                l = Math.min(l, origin + glyph.left);
                r = Math.max(r, origin + glyph.right);
            }
            x += a;
        }
        return l <= r ? new float[]{l, r} : new float[]{0, x};
    }

    private static String shape(String s) {
        return s.replaceAll("[0-9]", "0");
    }

    /** The size at which the ink of {@code shape} is {@code room} px wide; sets the paint to it. */
    private float inkFit(String shape, int room) {
        float px = 100f;
        for (int step = 0; step < 3; step++) {   // the glyph bounds come in whole pixels: refine twice
            paint.setTextSize(px);
            float[] ink = inkOf(shape);
            float w = ink[1] - ink[0];
            if (w <= 0 || room <= 0) return size;
            px *= room / w;
        }
        paint.setTextSize(px);
        return px;
    }

    /** Size and shift for the text being shown, found once per shape and width. */
    private void fit(int room) {
        String sh = shape(text);
        if (sh.equals(fitShape) && room == fitRoom) return;
        fitPx = inkFit(sh, room);
        fitShift = -inkOf(sh)[0];
        fitShape = sh;
        fitRoom = room;
        fitLogged = false;
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

    private float advance(String s, int i, float digit, float separator) {
        char c = s.charAt(i);
        return isDigit(c) ? digit : isSeparator(c) ? separator : paint.measureText(s, i, i + 1);
    }

    /** Sets the paint to px and returns the width of the text in cells. */
    private float widthAt(float px) {
        paint.setTextSize(px);
        float digit = digitCell(), separator = separatorCell(), w = 0;
        for (int i = 0; i < text.length(); i++) w += advance(text, i, digit, separator);
        return w;
    }

    @Override
    protected void onMeasure(int widthSpec, int heightSpec) {
        if (fitTo != null && MeasureSpec.getMode(widthSpec) == MeasureSpec.EXACTLY) {
            int width = MeasureSpec.getSize(widthSpec);
            inkFit(shape(fitTo), width - getPaddingLeft() - getPaddingRight());
            paint.getTextBounds("0", 0, 1, digitBox);
            int h = (int) Math.ceil(digitBox.height() * 1.3f) + getPaddingTop() + getPaddingBottom();
            setMeasuredDimension(width, resolveSize(h, heightSpec));
            return;
        }
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
        float x;
        if (fitTo != null) {
            fit(room);
            paint.setTextSize(fitPx);
            x = left + fitShift;   // the ink of the shape starts at the left edge
        } else {
            float w = widthAt(size);
            if (w > room && room > 0) w = widthAt(size * room / w);   // too long: smaller, never cut
            int h = Gravity.getAbsoluteGravity(gravity, getLayoutDirection()) & Gravity.HORIZONTAL_GRAVITY_MASK;
            x = h == Gravity.LEFT ? left : h == Gravity.RIGHT ? left + room - w : left + (room - w) / 2f;
        }
        float digit = digitCell(), separator = separatorCell();
        // the baseline puts the digits' middle on the view's middle - the same line whatever the text holds
        paint.getTextBounds("0", 0, 1, digitBox);
        float y = top + high / 2f - digitBox.exactCenterY();
        if (fitTo != null && !fitLogged) logInk(x);
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            float a = advance(text, i, digit, separator);
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

    /** Once per shape: where the ink of the drawn text stands on the screen, for checking against the buttons. */
    private void logInk(float x) {
        fitLogged = true;
        float[] ink = inkOf(text);
        int[] at = new int[2];
        getLocationOnScreen(at);
        Log.i("DocFit", String.format(java.util.Locale.ROOT, "digits \"%s\" ink %.1f..%.1f px on screen, view %d..%d, size %.1f px",
                text, at[0] + x + ink[0], at[0] + x + ink[1], at[0], at[0] + getWidth(), fitPx));
    }
}
