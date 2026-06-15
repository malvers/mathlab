package de.docalvers.tracker;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

// In-app APK self-update for the sideloaded Tracker (no Play Store). The web compares the installed
// versionCode (getInfo) against version.json on the server; if newer it calls installApk(url), which
// downloads the APK to the app cache and launches Android's package installer. Android still shows its
// own "install?" confirm (+ a one-time "allow this source") — unavoidable without Play Store /
// device-owner; this only removes the manual download / file-manager hassle.
@CapacitorPlugin(name = "AppUpdate")
public class AppUpdatePlugin extends Plugin {

    // Installed app version → the web compares it against version.json on the server.
    @PluginMethod
    public void getInfo(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            Context ctx = getContext();
            PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            long vc = (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P)
                ? pi.getLongVersionCode() : (long) pi.versionCode;
            ret.put("versionCode", vc);
            ret.put("versionName", pi.versionName);
        } catch (Exception e) {
            ret.put("versionCode", 0);
            ret.put("versionName", "");
        }
        call.resolve(ret);
    }

    // Download the APK at `url`, then hand it to the system package installer.
    @PluginMethod
    public void installApk(final PluginCall call) {
        final String url = call.getString("url");
        if (url == null || url.isEmpty()) { call.reject("no url"); return; }
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    final Context ctx = getContext();
                    File dir = new File(ctx.getCacheDir(), "updates");
                    if (!dir.exists()) dir.mkdirs();
                    final File apk = new File(dir, "update.apk");
                    if (apk.exists()) apk.delete();

                    HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                    c.setConnectTimeout(20000);
                    c.setReadTimeout(60000);
                    c.setInstanceFollowRedirects(true);
                    c.connect();
                    if (c.getResponseCode() / 100 != 2) { call.reject("http " + c.getResponseCode()); return; }
                    InputStream in = c.getInputStream();
                    FileOutputStream out = new FileOutputStream(apk);
                    byte[] buf = new byte[8192];
                    int r;
                    while ((r = in.read(buf)) != -1) out.write(buf, 0, r);
                    out.flush(); out.close(); in.close();
                    c.disconnect();

                    final Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".fileprovider", apk);
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                Intent i = new Intent(Intent.ACTION_VIEW);
                                i.setDataAndType(uri, "application/vnd.android.package-archive");
                                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                getActivity().startActivity(i);
                                call.resolve();
                            } catch (Exception e) {
                                call.reject("installer: " + e.getMessage());
                            }
                        }
                    });
                } catch (Exception e) {
                    call.reject("download failed: " + e.getMessage());
                }
            }
        }).start();
    }
}
