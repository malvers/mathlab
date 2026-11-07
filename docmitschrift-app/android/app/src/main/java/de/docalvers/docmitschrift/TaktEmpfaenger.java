package de.docalvers.docmitschrift;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * The alarm at the edges of the recording windows (and once an hour for a fresh timetable), and the
 * phone's restart, which wipes all alarms. While the service runs it gets the tick and decides itself.
 * When Android has ended it but Doc wants DocMitschrift ready, a lesson starting finds no running
 * service: then a loud notification asks Doc to tap - Android only lets the microphone start from a
 * tap (on the app or on a notification), never from the background.
 */
public class TaktEmpfaenger extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        if (AufnahmeService.running) {
            c.startService(new Intent(c, AufnahmeService.class).setAction(AufnahmeService.ACTION_TICK));
            return;
        }
        if (!AufnahmeService.prefs(c).getBoolean("bereit", false)) return;
        AufnahmeService.askToStart(c);
        AufnahmeService.schedule(c);
    }
}
