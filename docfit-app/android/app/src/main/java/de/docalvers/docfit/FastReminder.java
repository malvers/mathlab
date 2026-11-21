package de.docalvers.docfit;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import java.util.Calendar;

/**
 * The morning reminder while a fast runs (Doc, 21.11.2026): a notification "Wiegen + Blutzucker nüchtern" at the time
 * set under the gear (default 07:00, "fastRemind" on/off and "fastRemindAt" in minutes after midnight). Only while
 * somebody's fast is open; no Solita, nothing leaves the phone. An inexact alarm (no exact-alarm permission needed) is
 * set for the next morning and sets the following one when it rings; DocFit sets it again whenever it is opened (after
 * a restart of the phone alarms are gone until then).
 */
public final class FastReminder extends BroadcastReceiver {
    static final String CHANNEL = "fasten";
    static final int DEFAULT_MINUTE = 7 * 60;
    private static final int ID = 7001;
    private static final String[] SLOTS = {"", "2"};

    @Override
    public void onReceive(Context context, Intent intent) {
        if (anyFastOpen(context) && on(context)) notifyNow(context);
        schedule(context);
    }

    static boolean on(Context context) {
        return prefs(context).getBoolean("fastRemind", true);
    }

    static int minute(Context context) {
        return prefs(context).getInt("fastRemindAt", DEFAULT_MINUTE);
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences("docfit", Context.MODE_PRIVATE);
    }

    static boolean anyFastOpen(Context context) {
        for (String slot : SLOTS) if (new Fasts(context, slot).active() != null) return true;
        return false;
    }

    /** The next alarm (or none while nobody fasts or the reminder is off). */
    static void schedule(Context context) {
        AlarmManager am = context.getSystemService(AlarmManager.class);
        if (am == null) return;
        PendingIntent pi = PendingIntent.getBroadcast(context, ID, new Intent(context, FastReminder.class),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        am.cancel(pi);
        if (!on(context) || !anyFastOpen(context)) return;
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next(System.currentTimeMillis(), minute(context)), pi);
    }

    /** The next moment at {@code minuteOfDay} after {@code now} (today if still ahead, else tomorrow). */
    static long next(long now, int minuteOfDay) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(now);
        c.set(Calendar.HOUR_OF_DAY, minuteOfDay / 60);
        c.set(Calendar.MINUTE, minuteOfDay % 60);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        if (c.getTimeInMillis() <= now) c.add(Calendar.DAY_OF_MONTH, 1);
        return c.getTimeInMillis();
    }

    private static void notifyNow(Context context) {
        if (Build.VERSION.SDK_INT >= 33 && context.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) return;
        NotificationManager nm = context.getSystemService(NotificationManager.class);
        if (nm == null) return;
        nm.createNotificationChannel(new NotificationChannel(CHANNEL, "Fasten", NotificationManager.IMPORTANCE_DEFAULT));
        PendingIntent open = PendingIntent.getActivity(context, ID, new Intent(context, MainActivity.class),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification n = new Notification.Builder(context, CHANNEL)
                .setSmallIcon(R.drawable.ic_tab_scale)
                .setContentTitle("DocFit · Fasten")
                .setContentText("Wiegen + Blutzucker nüchtern")
                .setContentIntent(open)
                .setAutoCancel(true)
                .build();
        nm.notify(ID, n);
    }
}
