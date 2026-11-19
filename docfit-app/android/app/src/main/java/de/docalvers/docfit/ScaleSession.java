package de.docalvers.docfit;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * One connection to the Vitafit scale, from the greeting to the result (protocol: Vt701). Pure Java, no Bluetooth -
 * ScaleLink feeds it the notifications and writes whatever it answers, ScaleTest feeds it frames by hand.
 *
 * The course of a weigh-in: the scale streams the weight while it settles; the first stable weight is kept and
 * confirmed, which makes the scale measure the resistance; the resistance frame is confirmed and ends the weigh-in
 * with one result. Should the resistance not come (socks, stepped off early), the weight alone becomes the result
 * after {@link #IMPEDANCE_WAIT_MS} or when the connection drops. A resistance frame the scale could not measure
 * (0xFFFF, or any value outside BodyComposition's range) is confirmed too but ends the weigh-in with the weight alone
 * (ohm 0) - a reconnect within Weighings.SAME_WEIGH_IN_MS can still bring the resistance. Whatever the scale repeats
 * afterwards is ignored: one session gives at most one result.
 */
final class ScaleSession {
    enum Phase {
        /** connected, nobody on the scale yet */
        WAITING,
        /** the weight is coming in but has not settled */
        SETTLING,
        /** the weight is kept, the scale measures the resistance */
        IMPEDANCE,
        /** the result is out; everything else is ignored */
        DONE
    }

    /** How long to wait for the resistance after confirming the weight (openScale waits 6 s; a little margin). */
    static final long IMPEDANCE_WAIT_MS = 8000;
    /** Below this a "stable" weight is the empty scale, not a person (units of 10 g). */
    static final int MIN_CENTI_KG = 300;

    private Phase phase = Phase.WAITING;
    private int live;                // the latest weight while settling, units of 10 g
    private int kept = -1;           // the stable weight
    private long keptAt;
    private Weighings.Weighing result;

    Phase phase() {
        return phase;
    }

    /** The weight to show right now (units of 10 g): the kept one once stable, else the live one, 0 = none. */
    int shownWeight() {
        return kept >= 0 ? kept : live;
    }

    /** The frames to write once notifications are on. */
    List<byte[]> start() {
        return Vt701.hello();
    }

    /** One notification from the scale; returns the frames to write back (often none). */
    List<byte[]> onNotification(byte[] data, long now) {
        if (phase == Phase.DONE) return Collections.emptyList();
        List<byte[]> out = new ArrayList<>();
        for (byte[] f : Vt701.frames(data)) {
            if (phase == Phase.DONE) break;
            int kg = Vt701.weight(f);
            if (kg >= 0) {
                if (phase == Phase.IMPEDANCE) continue;             // weight already kept, repeats change nothing
                if (Vt701.isStable(f) && kg >= MIN_CENTI_KG) {
                    kept = kg;
                    keptAt = now;
                    phase = Phase.IMPEDANCE;
                    out.add(Vt701.ackWeight());
                } else {
                    live = kg;
                    phase = kg > 0 ? Phase.SETTLING : Phase.WAITING;
                }
                continue;
            }
            int ohm = Vt701.impedance(f);
            if (ohm > 0 && phase == Phase.IMPEDANCE) {             // a resistance without a kept weight means nothing
                out.add(Vt701.ackImpedance());                     // the scale expects it, measured or not
                finish(BodyComposition.isMeasured(ohm) ? ohm : 0, now);   // 0xFFFF = no skin contact: weight only
            }
        }
        return out;
    }

    /** Call now and then while waiting for the resistance: past the wait the weight alone becomes the result. */
    void tick(long now) {
        if (phase == Phase.IMPEDANCE && now - keptAt >= IMPEDANCE_WAIT_MS) finish(0, now);
    }

    /** The connection is gone: a kept weight is not lost, it becomes a result without resistance. */
    void connectionLost(long now) {
        if (phase == Phase.IMPEDANCE) finish(0, now);
    }

    /** The result, once: afterwards null again. */
    Weighings.Weighing takeResult() {
        Weighings.Weighing r = result;
        result = null;
        return r;
    }

    private void finish(int ohm, long now) {
        // the moment of the weigh-in is when the weight settled, not when the resistance came
        result = new Weighings.Weighing(keptAt != 0 ? keptAt : now, kept, ohm);
        phase = Phase.DONE;
    }
}
