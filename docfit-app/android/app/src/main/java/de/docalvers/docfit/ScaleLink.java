package de.docalvers.docfit;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.BluetoothStatusCodes;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Log;

import java.util.ArrayDeque;
import java.util.UUID;

/**
 * The Bluetooth side of the scale: while the "Waage" tab is open it looks for a device whose name starts with
 * "Vitafit", connects, switches the notifications on and hands everything the scale says to a ScaleSession, whose
 * answers it writes back. After a result it lets go of the scale and, after a pause, looks again - the scale wakes up
 * only when somebody steps on it. No pairing: the scale talks to any phone that connects.
 *
 * Android allows one GATT operation at a time, so writes go through a small queue. Everything runs on the main
 * thread; the Bluetooth callbacks only post into it.
 */
final class ScaleLink {
    enum Status { NO_PERMISSION, BLUETOOTH_OFF, SEARCHING, CONNECTING, WAITING, SETTLING, IMPEDANCE, DONE }

    interface Callback {
        /** @param centiKg the weight to show with the status (live or kept), 0 = none */
        void onScaleStatus(Status status, int centiKg);

        void onScaleResult(Weighings.Weighing w);
    }

    private static final String TAG = "DocFit";
    private static final long CONNECT_TIMEOUT_MS = 12_000;
    private static final long RETRY_MS = 3_000;          // after a failed connection
    private static final long AFTER_RESULT_MS = 15_000;  // the scale stays awake a little after stepping off
    private static final long OP_TIMEOUT_MS = 2_500;     // a write whose confirmation never comes
    private static final long SCAN_GAP_MS = 6_500;       // Android drops scans started more than 5 times in 30 s
    private static final long TICK_MS = 500;

    private final Context context;
    private final Callback callback;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final BluetoothAdapter adapter;
    private final ArrayDeque<Op> ops = new ArrayDeque<>();
    private boolean active, scanning, opBusy, receiverOn;
    private long lastScanStart = -SCAN_GAP_MS;
    private BluetoothGatt gatt;
    private BluetoothGattCharacteristic writeChar;
    private ScaleSession session;
    private Status status = Status.SEARCHING;
    private int statusWeight;

    /** One queued GATT write: a characteristic or a descriptor with its bytes. */
    private static final class Op {
        final BluetoothGattCharacteristic ch;
        final BluetoothGattDescriptor desc;
        final byte[] value;

        Op(BluetoothGattCharacteristic ch, BluetoothGattDescriptor desc, byte[] value) {
            this.ch = ch;
            this.desc = desc;
            this.value = value;
        }
    }

    ScaleLink(Context context, Callback callback) {
        this.context = context.getApplicationContext();
        this.callback = callback;
        BluetoothManager m = context.getSystemService(BluetoothManager.class);
        adapter = m == null ? null : m.getAdapter();
    }

    Status status() {
        return status;
    }

    int statusWeight() {
        return statusWeight;
    }

    boolean isActive() {
        return active;
    }

    /** Start looking for the scale (the Bluetooth permissions must be granted). */
    void start() {
        if (active) return;
        active = true;
        IntentFilter f = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
        // a protected broadcast sent by the Bluetooth stack (not the system uid), so it must be EXPORTED to arrive
        if (Build.VERSION.SDK_INT >= 33) context.registerReceiver(bluetoothState, f, Context.RECEIVER_EXPORTED);
        else context.registerReceiver(bluetoothState, f);
        receiverOn = true;
        scan();
    }

    /** Stop looking and let go of the scale; a weight already kept is not lost. */
    void stop() {
        if (!active) return;
        active = false;
        if (receiverOn) {
            context.unregisterReceiver(bluetoothState);
            receiverOn = false;
        }
        main.removeCallbacks(rescan);
        stopScan();
        if (gatt != null) drop(0);
    }

    private void setStatus(Status s, int centiKg) {
        status = s;
        statusWeight = centiKg;
        callback.onScaleStatus(s, centiKg);
    }

    // ---------- looking for the scale ----------

    private final Runnable rescan = this::scan;

    private void retry(long afterMs) {
        main.removeCallbacks(rescan);
        if (active) main.postDelayed(rescan, afterMs);
    }

    @SuppressLint("MissingPermission")
    private void scan() {
        main.removeCallbacks(rescan);
        if (!active || scanning || gatt != null) return;
        if (adapter == null || !adapter.isEnabled()) {
            setStatus(Status.BLUETOOTH_OFF, 0);
            return;
        }
        if (status != Status.DONE) setStatus(Status.SEARCHING, 0);
        long wait = lastScanStart + SCAN_GAP_MS - SystemClock.elapsedRealtime();
        if (wait > 0) {
            main.postDelayed(rescan, wait);
            return;
        }
        BluetoothLeScanner scanner = adapter.getBluetoothLeScanner();
        if (scanner == null) {
            setStatus(Status.BLUETOOTH_OFF, 0);
            return;
        }
        try {
            // no filter: the name only starts with "Vitafit", and the screen stays on while DocFit is open
            scanner.startScan(null, new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(), scanCallback);
            scanning = true;
            lastScanStart = SystemClock.elapsedRealtime();
            setStatus(Status.SEARCHING, 0);
        } catch (SecurityException e) {
            setStatus(Status.NO_PERMISSION, 0);
        } catch (IllegalStateException e) {
            setStatus(Status.BLUETOOTH_OFF, 0);
        }
    }

    @SuppressLint("MissingPermission")
    private void stopScan() {
        if (!scanning) return;
        scanning = false;
        try {
            BluetoothLeScanner scanner = adapter.getBluetoothLeScanner();
            if (scanner != null) scanner.stopScan(scanCallback);
        } catch (SecurityException | IllegalStateException e) {
            // Bluetooth went off or the permission was taken back: nothing left to stop
        }
    }

    private final ScanCallback scanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int type, ScanResult r) {
            main.post(() -> found(r));
        }

        @Override
        public void onScanFailed(int code) {
            Log.w(TAG, "scan failed " + code);
            main.post(() -> {
                scanning = false;
                retry(RETRY_MS);
            });
        }
    };

    @SuppressLint("MissingPermission")
    private void found(ScanResult r) {
        if (!active || !scanning || gatt != null) return;
        ScanRecord rec = r.getScanRecord();
        String name = rec == null ? null : rec.getDeviceName();
        if (name == null) {
            try {
                name = r.getDevice().getName();
            } catch (SecurityException e) {
                name = null;
            }
        }
        if (!Vt701.isScaleName(name)) return;
        stopScan();
        connect(r.getDevice());
    }

    // ---------- the connection ----------

    @SuppressLint("MissingPermission")
    private void connect(BluetoothDevice device) {
        session = new ScaleSession();
        setStatus(Status.CONNECTING, 0);
        try {
            gatt = device.connectGatt(context, false, gattCallback, BluetoothDevice.TRANSPORT_LE);
        } catch (SecurityException e) {
            gatt = null;
        }
        if (gatt == null) {
            session = null;
            retry(RETRY_MS);
            return;
        }
        main.postDelayed(connectTimeout, CONNECT_TIMEOUT_MS);
    }

    private final Runnable connectTimeout = () -> {
        if (gatt != null && writeChar == null) drop(RETRY_MS);
    };

    /** Ends the connection; a kept weight becomes a result; looks again after the pause. */
    private void drop(long rescanAfter) {
        if (session != null) {
            session.connectionLost(System.currentTimeMillis());
            if (deliver()) rescanAfter = AFTER_RESULT_MS;
            if (session.phase() == ScaleSession.Phase.DONE) rescanAfter = Math.max(rescanAfter, AFTER_RESULT_MS);
        }
        closeGatt();
        if (status != Status.DONE && status != Status.BLUETOOTH_OFF) setStatus(Status.SEARCHING, 0);
        retry(rescanAfter);
    }

    @SuppressLint("MissingPermission")
    private void closeGatt() {
        main.removeCallbacks(connectTimeout);
        main.removeCallbacks(opTimeout);
        main.removeCallbacks(tick);
        main.removeCallbacks(letGo);
        if (gatt != null) {
            try {
                gatt.disconnect();
                gatt.close();
            } catch (SecurityException e) {
                // permission taken back mid-way: the connection is dead anyway
            }
        }
        gatt = null;
        writeChar = null;
        session = null;
        ops.clear();
        opBusy = false;
    }

    private final BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt g, int st, int state) {
            main.post(() -> connectionChanged(g, st, state));
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt g, int st) {
            main.post(() -> servicesFound(g));
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt g, BluetoothGattDescriptor d, int st) {
            main.post(() -> written(g));
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt g, BluetoothGattCharacteristic c, int st) {
            main.post(() -> written(g));
        }

        /** Android 13 and later hand over the bytes directly. */
        @Override
        public void onCharacteristicChanged(BluetoothGatt g, BluetoothGattCharacteristic c, byte[] value) {
            byte[] v = value.clone();
            UUID id = c.getUuid();
            main.post(() -> notified(g, id, v));
        }

        /** Up to Android 12 the bytes sit in the characteristic (on 13+ the method above is called instead). */
        @Override
        @SuppressWarnings("deprecation")
        public void onCharacteristicChanged(BluetoothGatt g, BluetoothGattCharacteristic c) {
            if (Build.VERSION.SDK_INT >= 33) return;
            byte[] value = c.getValue();
            if (value == null) return;
            byte[] v = value.clone();
            UUID id = c.getUuid();
            main.post(() -> notified(g, id, v));
        }
    };

    @SuppressLint("MissingPermission")
    private void connectionChanged(BluetoothGatt g, int st, int state) {
        if (g != gatt) return;
        if (state == BluetoothProfile.STATE_CONNECTED && st == BluetoothGatt.GATT_SUCCESS) {
            boolean ok;
            try {
                ok = g.discoverServices();
            } catch (SecurityException e) {
                ok = false;
            }
            if (!ok) drop(RETRY_MS);
        } else if (state == BluetoothProfile.STATE_DISCONNECTED || st != BluetoothGatt.GATT_SUCCESS) {
            drop(RETRY_MS);   // the scale went to sleep, or the link broke
        }
    }

    @SuppressLint("MissingPermission")
    private void servicesFound(BluetoothGatt g) {
        if (g != gatt || session == null) return;
        BluetoothGattService s = g.getService(Vt701.SERVICE);
        BluetoothGattCharacteristic notify = s == null ? null : s.getCharacteristic(Vt701.NOTIFY);
        BluetoothGattCharacteristic write = s == null ? null : s.getCharacteristic(Vt701.WRITE);
        if (notify == null || write == null) {
            Log.w(TAG, "a Vitafit without service 0xFFF0 - not the VT701 protocol");
            drop(AFTER_RESULT_MS);
            return;
        }
        main.removeCallbacks(connectTimeout);
        writeChar = write;
        try {
            g.setCharacteristicNotification(notify, true);
        } catch (SecurityException e) {
            drop(RETRY_MS);
            return;
        }
        BluetoothGattDescriptor cccd = notify.getDescriptor(Vt701.CCCD);
        if (cccd != null) {
            boolean canNotify = (notify.getProperties() & BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0;
            ops.add(new Op(null, cccd, canNotify ? BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                    : BluetoothGattDescriptor.ENABLE_INDICATION_VALUE));
        }
        for (byte[] f : session.start()) ops.add(new Op(write, null, f));
        setStatus(Status.WAITING, 0);
        next();
    }

    // ---------- the write queue ----------

    @SuppressLint("MissingPermission")
    @SuppressWarnings("deprecation")
    private void next() {
        while (!opBusy && gatt != null && !ops.isEmpty()) {
            Op op = ops.poll();
            boolean started;
            try {
                if (op.desc != null) {
                    if (Build.VERSION.SDK_INT >= 33) {
                        started = gatt.writeDescriptor(op.desc, op.value) == BluetoothStatusCodes.SUCCESS;
                    } else {
                        op.desc.setValue(op.value);
                        started = gatt.writeDescriptor(op.desc);
                    }
                } else {
                    int type = (op.ch.getProperties() & BluetoothGattCharacteristic.PROPERTY_WRITE) != 0
                            ? BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
                            : BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE;
                    if (Build.VERSION.SDK_INT >= 33) {
                        started = gatt.writeCharacteristic(op.ch, op.value, type) == BluetoothStatusCodes.SUCCESS;
                    } else {
                        op.ch.setWriteType(type);
                        op.ch.setValue(op.value);
                        started = gatt.writeCharacteristic(op.ch);
                    }
                }
            } catch (SecurityException e) {
                started = false;
            }
            if (started) {
                opBusy = true;
                main.postDelayed(opTimeout, OP_TIMEOUT_MS);
            } else {
                Log.w(TAG, "write not started");
            }
        }
    }

    private void written(BluetoothGatt g) {
        if (g != gatt) return;
        main.removeCallbacks(opTimeout);
        opBusy = false;
        next();
    }

    private final Runnable opTimeout = () -> {
        opBusy = false;
        next();
    };

    // ---------- what the scale says ----------

    private void notified(BluetoothGatt g, UUID id, byte[] value) {
        if (g != gatt || session == null || writeChar == null || !Vt701.NOTIFY.equals(id)) return;
        for (byte[] f : session.onNotification(value, System.currentTimeMillis())) ops.add(new Op(writeChar, null, f));
        next();
        afterStep();
    }

    /** While waiting for the resistance: checks the wait, so the weight alone is saved if nothing comes. */
    private final Runnable tick = () -> {
        if (session == null) return;
        session.tick(System.currentTimeMillis());
        afterStep();
    };

    /** Lets the last confirmation go out before letting go of the scale. */
    private final Runnable letGo = () -> {
        if (gatt != null) drop(AFTER_RESULT_MS);
    };

    private void afterStep() {
        if (session == null) return;
        if (deliver()) {
            main.removeCallbacks(tick);
            main.postDelayed(letGo, 800);
            return;
        }
        switch (session.phase()) {
            case WAITING:
                setStatus(Status.WAITING, 0);
                break;
            case SETTLING:
                setStatus(Status.SETTLING, session.shownWeight());
                break;
            case IMPEDANCE:
                setStatus(Status.IMPEDANCE, session.shownWeight());
                main.removeCallbacks(tick);
                main.postDelayed(tick, TICK_MS);
                break;
            default:
                break;
        }
    }

    /** Hands a finished result to the screen; true if there was one. */
    private boolean deliver() {
        Weighings.Weighing r = session == null ? null : session.takeResult();
        if (r == null) return false;
        callback.onScaleResult(r);
        setStatus(Status.DONE, r.centiKg);
        return true;
    }

    private final BroadcastReceiver bluetoothState = new BroadcastReceiver() {
        @Override
        public void onReceive(Context c, Intent i) {
            int state = i.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
            if (state == BluetoothAdapter.STATE_ON) {
                if (status == Status.BLUETOOTH_OFF) status = Status.SEARCHING;
                scan();
            } else if (state == BluetoothAdapter.STATE_TURNING_OFF || state == BluetoothAdapter.STATE_OFF) {
                scanning = false;
                if (session != null) {
                    session.connectionLost(System.currentTimeMillis());
                    deliver();
                }
                closeGatt();
                main.removeCallbacks(rescan);
                setStatus(Status.BLUETOOTH_OFF, 0);
            }
        }
    };
}
