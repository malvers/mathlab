package de.docalvers.docruf;

import android.content.Context;
import android.content.SharedPreferences;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.media.AudioRecordingConfiguration;
import android.os.Build;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 * Which microphone DocCall hears Doc through, shown in the settings (Doc, 08.11.2026).
 * "Next" is what the next answer will use: a USB receiver DocCall opens itself (UsbMic), otherwise what Android
 * gives the recognition - a Bluetooth microphone only when it is the call device, else the phone's own.
 * "Heard" is measured while Doc answers, from the recording Android really runs, and kept with its time - so a
 * wrong guess shows up at once.
 * The names are DocNote's (AufnahmeService: "Telefon Mic", "DJI Mic BT", "DJI Adapter") - change both together.
 */
final class Mic {
    static final String PHONE = "Telefon Mic";
    static final String SILENT = " · kein Ton";   // Android holds the recording but passes no sound (another app has the mic)
    private static final String PREFS = "mikro";

    private Mic() {
    }

    /** The microphone the next answer will use. */
    static String next(Context c) {
        AudioDeviceInfo usb = UsbMic.find(c);
        if (usb != null) return label(usb);
        if (Build.VERSION.SDK_INT >= 31) {
            AudioDeviceInfo call = c.getSystemService(AudioManager.class).getCommunicationDevice();
            if (call != null && isBluetooth(call.getType())) return label(call);
        }
        return PHONE;
    }

    /** The audio sessions recording right now; taken when listening starts, so the recognizer's new one stands out. */
    static Set<Integer> sessions(Context c) {
        Set<Integer> s = new HashSet<>();
        for (AudioRecordingConfiguration r : c.getSystemService(AudioManager.class).getActiveRecordingConfigurations()) {
            s.add(r.getClientAudioSessionId());
        }
        return s;
    }

    /** The microphone the recognition really records from (a session that was not there before), or null. */
    static String recognizer(Context c, Set<Integer> before) {
        for (AudioRecordingConfiguration r : c.getSystemService(AudioManager.class).getActiveRecordingConfigurations()) {
            if (before.contains(r.getClientAudioSessionId())) continue;
            AudioDeviceInfo d = r.getAudioDevice();
            if (d == null) continue;
            boolean silenced = Build.VERSION.SDK_INT >= 29 && r.isClientSilenced();
            return label(d) + (silenced ? SILENT : "");
        }
        return null;
    }

    /** Short name of a microphone, as DocNote writes it. */
    static String label(AudioDeviceInfo d) {
        if (d == null) return PHONE;
        String name = name(d);
        switch (d.getType()) {
            case AudioDeviceInfo.TYPE_USB_DEVICE:
            case AudioDeviceInfo.TYPE_USB_HEADSET:
            case AudioDeviceInfo.TYPE_USB_ACCESSORY: {
                String n = name.toLowerCase(Locale.ROOT);
                return n.contains("wireless mic") || n.contains("dji") ? "DJI Adapter" : "USB" + (name.isEmpty() ? "" : " · " + name);
            }
            case AudioDeviceInfo.TYPE_BLUETOOTH_SCO:
            case AudioDeviceInfo.TYPE_BLE_HEADSET:
                return name.toLowerCase(Locale.ROOT).contains("dji") ? "DJI Mic BT" : "BT" + (name.isEmpty() ? "" : " · " + name);
            case AudioDeviceInfo.TYPE_WIRED_HEADSET:
                return "Headset";
            default:
                return PHONE;
        }
    }

    private static boolean isBluetooth(int type) {
        return type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO || type == AudioDeviceInfo.TYPE_BLE_HEADSET;
    }

    /** The device's own name, without Android's "USB-Audio - " in front. */
    private static String name(AudioDeviceInfo d) {
        String n = d.getProductName() == null ? "" : d.getProductName().toString().trim();
        return n.startsWith("USB-Audio - ") ? n.substring("USB-Audio - ".length()).trim() : n;
    }

    // ---- what really heard him last time

    static void heard(Context c, String label) {
        prefs(c).edit().putString("heard", label).putLong("at", System.currentTimeMillis()).apply();
    }

    static String lastHeard(Context c) {
        return prefs(c).getString("heard", "");
    }

    static long lastHeardAt(Context c) {
        return prefs(c).getLong("at", 0);
    }

    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
