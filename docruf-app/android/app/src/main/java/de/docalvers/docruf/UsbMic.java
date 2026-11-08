package de.docalvers.docruf;

import android.content.Context;
import android.media.AudioDeviceInfo;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.system.ErrnoException;
import android.system.Os;
import android.system.OsConstants;
import android.system.StructPollfd;
import android.util.Log;

import java.io.IOException;

/**
 * A microphone on USB, like the DJI receiver (Doc, 08.11.2026), only offers 48 kHz stereo; Google's recognition
 * opens it at 16 kHz mono and hears nothing ("Nichts gehört"). So DocCall listens to the receiver itself - 48 kHz,
 * folded to mono, low-pass filtered and thinned to 16 kHz PCM16 - and hands that to the recognizer through a pipe
 * (RecognizerIntent.EXTRA_AUDIO_SOURCE, Android 13+). One recording runs for the whole answer; every sentence gets
 * its own pipe, and closing it tells the recognizer the sentence is over.
 */
final class UsbMic {
    static final int RATE = 16000;
    private static final int IN_RATE = 48000, FACTOR = IN_RATE / RATE;
    private static final int TAPS = 47;          // low-pass before thinning, so nothing above 8 kHz folds back
    private static final float CUTOFF = 7000f;
    private static final float[] FIR = lowPass();

    private final AudioRecord rec;
    private final int channels;
    private final Thread pump;
    private volatile boolean running = true;
    private ParcelFileDescriptor read, write;    // the current sentence's pipe; guarded by `this`

    // filter state, pump thread only
    private final float[] hist = new float[TAPS];
    private int pos, phase;
    private float energyL, energyR;

    /** The first microphone on USB, or null; only from Android 13 on, where the recognizer takes a pipe. */
    static AudioDeviceInfo find(Context c) {
        if (Build.VERSION.SDK_INT < 33) return null;
        for (AudioDeviceInfo d : c.getSystemService(AudioManager.class).getDevices(AudioManager.GET_DEVICES_INPUTS)) {
            int t = d.getType();
            if (t == AudioDeviceInfo.TYPE_USB_DEVICE || t == AudioDeviceInfo.TYPE_USB_HEADSET
                    || t == AudioDeviceInfo.TYPE_USB_ACCESSORY) return d;
        }
        return null;
    }

    /** Starts listening to the USB microphone; null when there is none or it will not open (then Google's own path). */
    static UsbMic open(Context c) {
        AudioDeviceInfo dev = find(c);
        if (dev == null) return null;
        for (int mask : new int[]{AudioFormat.CHANNEL_IN_STEREO, AudioFormat.CHANNEL_IN_MONO}) {
            AudioRecord r = null;
            try {
                int min = AudioRecord.getMinBufferSize(IN_RATE, mask, AudioFormat.ENCODING_PCM_16BIT);
                if (min <= 0) continue;
                r = new AudioRecord.Builder()
                        .setAudioSource(MediaRecorder.AudioSource.VOICE_RECOGNITION)
                        .setAudioFormat(new AudioFormat.Builder().setSampleRate(IN_RATE).setChannelMask(mask)
                                .setEncoding(AudioFormat.ENCODING_PCM_16BIT).build())
                        .setBufferSizeInBytes(Math.max(min * 4, IN_RATE * 4 / 5))   // at least 200 ms
                        .build();
                if (r.getState() != AudioRecord.STATE_INITIALIZED) {
                    r.release();
                    continue;
                }
                r.setPreferredDevice(dev);
                r.startRecording();
                AudioDeviceInfo routed = r.getRoutedDevice();
                Log.d(RufService.TAG, "usb mic " + dev.getProductName() + " ch=" + (mask == AudioFormat.CHANNEL_IN_STEREO ? 2 : 1)
                        + " routed=" + (routed == null ? "?" : routed.getProductName() + "/" + routed.getType()));
                return new UsbMic(r, mask == AudioFormat.CHANNEL_IN_STEREO ? 2 : 1);
            } catch (RuntimeException e) {
                Log.d(RufService.TAG, "usb mic failed: " + e);
                if (r != null) r.release();
            }
        }
        return null;
    }

    private UsbMic(AudioRecord rec, int channels) {
        this.rec = rec;
        this.channels = channels;
        pump = new Thread(this::run, "docruf-usb-mic");
        pump.start();
    }

    /** A fresh pipe for the next sentence; the old one is closed. The read end goes to the recognizer. */
    synchronized ParcelFileDescriptor next() {
        closePipe();
        try {
            ParcelFileDescriptor[] p = ParcelFileDescriptor.createPipe();
            read = p[0];
            write = p[1];
        } catch (IOException e) {
            Log.d(RufService.TAG, "usb mic pipe: " + e);
        }
        return read;
    }

    void stop() {
        running = false;
        try {
            rec.stop();   // wakes the pump from its read
        } catch (IllegalStateException ignored) {
        }
        try {
            pump.join(500);
        } catch (InterruptedException ignored) {
        }
        rec.release();
        synchronized (this) {
            closePipe();
        }
    }

    private void closePipe() {
        try {
            if (write != null) write.close();
            if (read != null) read.close();
        } catch (IOException ignored) {
        }
        write = null;
        read = null;
    }

    private void run() {
        short[] in = new short[IN_RATE / 50 * channels];   // 20 ms
        short[] out16 = new short[RATE / 50];
        byte[] bytes = new byte[out16.length * 2];
        int peak = 0;
        long logAt = System.currentTimeMillis() + 1000;
        while (running) {
            int n = rec.read(in, 0, in.length);
            if (n < 0) break;
            int m = 0;
            for (int i = 0; i + channels <= n; i += channels) {
                float x = channels == 2 ? fold(in[i], in[i + 1]) : in[i];
                hist[pos] = x;
                pos = (pos + 1) % TAPS;
                if (++phase < FACTOR) continue;
                phase = 0;
                float y = 0;
                for (int k = 0; k < TAPS; k++) y += FIR[k] * hist[(pos + k) % TAPS];
                short s = (short) Math.max(-32768, Math.min(32767, Math.round(y)));
                peak = Math.max(peak, Math.abs(s));
                out16[m++] = s;
            }
            for (int i = 0; i < m; i++) {
                bytes[2 * i] = (byte) out16[i];
                bytes[2 * i + 1] = (byte) (out16[i] >> 8);
            }
            send(bytes, m * 2);
            if (System.currentTimeMillis() > logAt) {
                Log.d(RufService.TAG, "usb mic peak " + peak);
                peak = 0;
                logAt += 1000;
            }
        }
    }

    /**
     * Stereo to mono: both sides averaged when both carry sound; when one side is (nearly) silent - the DJI
     * receiver can put one transmitter per side - only the louder side, so the voice does not lose half its level.
     */
    private float fold(short l, short r) {
        energyL = 0.999f * energyL + 0.001f * l * l;
        energyR = 0.999f * energyR + 0.001f * r * r;
        if (energyR < 0.1f * energyL) return l;
        if (energyL < 0.1f * energyR) return r;
        return (l + r) * 0.5f;
    }

    /** Never blocks: when the recognizer is not reading (between sentences, or done) the audio is dropped. */
    private synchronized void send(byte[] b, int len) {
        if (write == null || len == 0) return;
        try {
            StructPollfd p = new StructPollfd();
            p.fd = write.getFileDescriptor();
            p.events = (short) OsConstants.POLLOUT;
            if (Os.poll(new StructPollfd[]{p}, 0) <= 0) return;
            if ((p.revents & (OsConstants.POLLERR | OsConstants.POLLHUP)) != 0) {
                closePipe();
                return;
            }
            Os.write(p.fd, b, 0, len);
        } catch (ErrnoException | IOException e) {
            closePipe();   // the recognizer closed its end: this sentence is over
        }
    }

    /** Windowed-sinc low-pass (Blackman), gain 1. */
    private static float[] lowPass() {
        float[] h = new float[TAPS];
        double fc = CUTOFF / IN_RATE, sum = 0;
        int mid = TAPS / 2;
        for (int i = 0; i < TAPS; i++) {
            int k = i - mid;
            double sinc = k == 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * k) / (Math.PI * k);
            double w = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / (TAPS - 1)) + 0.08 * Math.cos(4 * Math.PI * i / (TAPS - 1));
            h[i] = (float) (sinc * w);
            sum += h[i];
        }
        for (int i = 0; i < TAPS; i++) h[i] /= (float) sum;
        return h;
    }
}
