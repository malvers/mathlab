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
import android.os.ParcelUuid;
import android.util.Log;

import java.util.ArrayDeque;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

/**
 * The Bluetooth side of the Omron M400 Intelli IT (Doc, 24.11.2026), modelled on ScaleLink.
 *
 * Pairing, once: Doc holds the monitor's Bluetooth key until "P" blinks and taps "Omron koppeln". DocFit looks for a
 * "BLEsmart_..." with the blood pressure service, connects, bonds (Android asks once), then does Omron's own pairing
 * step: in pairing mode the monitor keeps a bond only after the app has stored a 16-byte key in it (24.11.2026, first
 * tries: without it the monitor dropped the bond again). The key is random, made once on the phone (MainActivity,
 * never in the code); the bytes follow the open-source omblepy (userx14/omblepy, protocol only, no code taken):
 * notifications on the unlock characteristic, 0x02 + 16 zero bytes until the answer 0x82 0x00 (Android finishes the
 * bond meanwhile), 0x00 + key -> 0x80 0x00, then "start" and "end transmission" on Omron's data channels. After that
 * the standard part: the clock read and set, the indications of 0x2A35 on - and the monitor counts as paired.
 *
 * After that, while the "Blutdruck" tab is open and DocFit is in front, DocFit waits for the paired monitor with
 * Android's own background connection (autoConnect), which also catches the monitor's directed advertising: after a
 * measurement, or a short press on its Bluetooth key, it connects. Each time the clock is read (to move the readings by
 * how far it was off) and set, then the indications go on and the monitor sends the readings it has not sent yet,
 * oldest first, and lets go. DocFit then waits again.
 *
 * Android allows one GATT operation at a time, so reads and writes go through a small queue. Everything runs on the
 * main thread; the Bluetooth callbacks only post into it. Every step goes to the log ("adb logcat -s DocFit").
 */
final class BpLink {
    enum Status { NO_PERMISSION, BLUETOOTH_OFF, IDLE, PAIR_SEARCH, PAIRING, PAIR_FAILED, WAITING, LOADING, DONE, BOND_LOST }

    interface Callback {
        void onBpStatus(Status status);

        /** the monitor is paired: keep its address */
        void onBpPaired(String address);

        /**
         * One reading from the monitor.
         *
         * @param clockLag how far the monitor's clock was behind the phone's before DocFit set it (ms, 0 = right)
         */
        void onBpReading(Bpm.Measurement m, long clockLag);

        /** the monitor let go after a transfer */
        void onBpTransferDone();
    }

    private static final String TAG = "DocFit";
    // read once per connection for the log only: the monitor's features and the User Data Service's user index
    private static final UUID FEATURE = Bpm.uuid16(0x2A49), UDS = Bpm.uuid16(0x181C), USER_INDEX = Bpm.uuid16(0x2A9A);
    // Omron's own service: the unlock characteristic (the key) and the first send channel; four receive channels
    private static final UUID OMRON = UUID.fromString("ecbe3980-c9a2-11e1-b1bd-0002a5d5c51b"),
            UNLOCK = UUID.fromString("b305b680-aee7-11e1-a730-0002a5d5c51b"),
            TX0 = UUID.fromString("db5b55e0-aee7-11e1-965e-0002a5d5c51b");
    private static final UUID[] TX = {TX0, UUID.fromString("e0b8a060-aee7-11e1-92f4-0002a5d5c51b"),
            UUID.fromString("0ae12b00-aee8-11e1-a192-0002a5d5c51b"),
            UUID.fromString("10e1ba60-aee8-11e1-89e5-0002a5d5c51b")};
    private static final UUID[] RX = {UUID.fromString("49123040-aee8-11e1-a74d-0002a5d5c51b"),
            UUID.fromString("4d0bf320-aee8-11e1-a0d9-0002a5d5c51b"),
            UUID.fromString("5128ce60-aee8-11e1-b84b-0002a5d5c51b"),
            UUID.fromString("560f1420-aee8-11e1-8184-0002a5d5c51b")};
    private static final int KEY_TRIES = 12;            // about 12 s for Android to finish the bond in between
    private static final long STEP_MS = 1_200;          // the wait for one answer of Omron's pairing step

    /** where Omron's own steps stand */
    private enum Step { NONE, KEY_MODE, KEY_SET, TX_START, TX_END, UNLOCK, CLK_START, CLK_READ, CLK_WRITE, CLK_END }
    private static final long PAIR_SEARCH_MS = 60_000;    // the "P" blinks a few minutes; a minute of looking is plenty
    private static final long PAIR_CONNECT_MS = 30_000;   // connecting + bonding (Doc confirms Android's question)
    private static final long OP_TIMEOUT_MS = 4_000;      // a read or write whose answer never comes
    private static final long REWAIT_MS = 3_000;          // after a transfer, before waiting for the monitor again
    private static final long QUIET_MS = 8_000;           // no reading for this long: the transfer is over

    private final Context context;
    private final Callback callback;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final BluetoothAdapter adapter;
    private final ArrayDeque<Op> ops = new ArrayDeque<>();
    private final TimeZone tz = TimeZone.getDefault();
    private boolean active, scanning, pairing, opBusy, receiverOn, subscribed, talking;
    private Step step = Step.NONE;
    private int keyTries, bondTries;
    private byte[] key;   // the 16-byte key stored in the monitor (MainActivity keeps it on the phone)
    private final Bpm.Frames frames = new Bpm.Frames();
    private String paired;   // the paired monitor's address, null = none
    private BluetoothGatt gatt;
    private Status status = Status.IDLE;
    private long clockLag;
    private int received, clockReads;

    /** One queued GATT operation: read or write a characteristic, or write a descriptor. */
    private static final class Op {
        final BluetoothGattCharacteristic ch;
        final BluetoothGattDescriptor desc;
        final byte[] value;   // null = read

        Op(BluetoothGattCharacteristic ch, BluetoothGattDescriptor desc, byte[] value) {
            this.ch = ch;
            this.desc = desc;
            this.value = value;
        }
    }

    BpLink(Context context, Callback callback) {
        this.context = context.getApplicationContext();
        this.callback = callback;
        BluetoothManager m = context.getSystemService(BluetoothManager.class);
        adapter = m == null ? null : m.getAdapter();
    }

    Status status() {
        return status;
    }

    boolean isActive() {
        return active;
    }

    /**
     * Pairing is under way. Android's own "Koppeln?" question puts DocFit into the background for a moment - a pairing
     * must survive that (24.11.2026, first try: the bond came, but DocFit had let go of the monitor meanwhile).
     */
    boolean isPairing() {
        return pairing;
    }

    int received() {
        return received;
    }

    /** The paired monitor's address (from DocFit's settings), or null to forget it. */
    void setPaired(String address) {
        boolean changed = address == null ? paired != null : !address.equals(paired);
        paired = address;
        if (changed && active && !pairing) {
            closeGatt();
            waitForMonitor();
        }
    }

    /** The 16 bytes DocFit stores in the monitor when pairing and shows it on each connection. */
    void setKey(byte[] key) {
        this.key = key == null || key.length != 16 ? null : key.clone();
    }

    /** Start: wait for the paired monitor (the Bluetooth permissions must be granted). */
    void start() {
        if (active) return;
        active = true;
        registerReceiver();
        waitForMonitor();
    }

    /** Stop waiting, looking and talking; readings already handed over are kept. */
    void stop() {
        if (!active) return;
        active = false;
        pairing = false;
        if (receiverOn) {
            context.unregisterReceiver(bluetoothState);
            receiverOn = false;
        }
        main.removeCallbacksAndMessages(null);
        stopScan();
        closeGatt();
        status = Status.IDLE;
    }

    /** "Omron koppeln": look for a monitor in pairing mode ("P" blinking). */
    void pair() {
        if (!active) return;
        closeGatt();
        main.removeCallbacksAndMessages(null);
        pairing = true;
        bondTries = 0;
        status = Status.IDLE;   // a lost bond is what a new pairing repairs
        if (!bluetoothOn()) return;
        BluetoothLeScanner scanner = adapter.getBluetoothLeScanner();
        if (scanner == null) {
            setStatus(Status.BLUETOOTH_OFF);
            return;
        }
        try {
            scanner.startScan(null, new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(),
                    scanCallback);
            scanning = true;
            Log.i(TAG, "omron: looking for a monitor in pairing mode");
            setStatus(Status.PAIR_SEARCH);
            main.postDelayed(pairGiveUp, PAIR_SEARCH_MS);
        } catch (SecurityException e) {
            setStatus(Status.NO_PERMISSION);
        } catch (IllegalStateException e) {
            setStatus(Status.BLUETOOTH_OFF);
        }
    }

    /** Stop pairing (the dialog was closed): back to waiting for the paired monitor, if there is one. */
    void cancelPairing() {
        if (!pairing) return;
        failPairing("cancelled");
    }

    private void setStatus(Status s) {
        status = s;
        callback.onBpStatus(s);
    }

    private boolean bluetoothOn() {
        if (adapter == null || !adapter.isEnabled()) {
            setStatus(Status.BLUETOOTH_OFF);
            return false;
        }
        return true;
    }

    private void registerReceiver() {
        if (receiverOn) return;
        IntentFilter f = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
        f.addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED);
        // protected broadcasts sent by the Bluetooth stack (not the system uid), so they must be EXPORTED to arrive
        if (Build.VERSION.SDK_INT >= 33) context.registerReceiver(bluetoothState, f, Context.RECEIVER_EXPORTED);
        else context.registerReceiver(bluetoothState, f);
        receiverOn = true;
    }

    // ---------- waiting for the paired monitor ----------

    private final Runnable rewait = this::waitForMonitor;

    @SuppressLint("MissingPermission")
    private void waitForMonitor() {
        main.removeCallbacks(rewait);
        if (!active || pairing || gatt != null || status == Status.BOND_LOST) return;
        if (paired == null) {
            setStatus(Status.IDLE);
            return;
        }
        if (!bluetoothOn()) return;
        try {
            BluetoothDevice d = adapter.getRemoteDevice(paired);
            // autoConnect: Android connects whenever the monitor shows up, however long that takes
            gatt = d.connectGatt(context, true, gattCallback, BluetoothDevice.TRANSPORT_LE);
        } catch (SecurityException | IllegalArgumentException e) {
            gatt = null;
        }
        if (gatt == null) {
            setStatus(Status.NO_PERMISSION);
            return;
        }
        if (status != Status.DONE) setStatus(Status.WAITING);
    }

    // ---------- pairing: the search ----------

    private final Runnable pairGiveUp = () -> failPairing("timeout");

    private void failPairing(String why) {
        Log.w(TAG, "omron: pairing failed (" + why + ")");
        boolean cancelled = "cancelled".equals(why);
        pairing = false;
        stopScan();
        closeGatt();
        main.removeCallbacks(pairGiveUp);
        setStatus(cancelled ? (paired == null ? Status.IDLE : Status.WAITING) : Status.PAIR_FAILED);
        if (paired != null) main.postDelayed(rewait, REWAIT_MS);
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
            main.post(() -> failPairing("scan failed " + code));
        }
    };

    @SuppressLint("MissingPermission")
    private void found(ScanResult r) {
        if (!active || !pairing || !scanning || gatt != null) return;
        ScanRecord rec = r.getScanRecord();
        String name = rec == null ? null : rec.getDeviceName();
        boolean bps = false;
        List<ParcelUuid> ids = rec == null ? null : rec.getServiceUuids();
        if (ids != null) for (ParcelUuid u : ids) if (Bpm.SERVICE.equals(u.getUuid())) bps = true;
        if (!Bpm.isOmronName(name) && !bps) return;
        Log.i(TAG, "omron: found " + name + " " + r.getDevice().getAddress() + " rssi " + r.getRssi());
        stopScan();
        main.removeCallbacks(pairGiveUp);
        main.postDelayed(pairGiveUp, PAIR_CONNECT_MS);
        setStatus(Status.PAIRING);
        try {
            gatt = r.getDevice().connectGatt(context, false, gattCallback, BluetoothDevice.TRANSPORT_LE);
        } catch (SecurityException e) {
            gatt = null;
        }
        if (gatt == null) failPairing("connect not started");
    }

    // ---------- the connection ----------

    @SuppressLint("MissingPermission")
    private void closeGatt() {
        main.removeCallbacks(opTimeout);
        main.removeCallbacks(quiet);
        main.removeCallbacks(stepTimeout);
        step = Step.NONE;
        if (gatt != null) {
            try {
                gatt.disconnect();
                gatt.close();
            } catch (SecurityException e) {
                // permission taken back mid-way: the connection is dead anyway
            }
        }
        gatt = null;
        ops.clear();
        opBusy = false;
        subscribed = false;
        talking = false;
    }

    private final BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt g, int st, int state) {
            main.post(() -> connectionChanged(g, st, state));
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt g, int st) {
            main.post(() -> servicesFound(g, st));
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt g, BluetoothGattDescriptor d, int st) {
            main.post(() -> done(g, d.getUuid(), d.getCharacteristic().getUuid(), null, st));
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt g, BluetoothGattCharacteristic c, int st) {
            main.post(() -> done(g, null, c.getUuid(), null, st));
        }

        /** Android 13 and later hand over the bytes directly. */
        @Override
        public void onCharacteristicRead(BluetoothGatt g, BluetoothGattCharacteristic c, byte[] value, int st) {
            byte[] v = value == null ? null : value.clone();
            main.post(() -> done(g, null, c.getUuid(), v, st));
        }

        /** Up to Android 12 the bytes sit in the characteristic (on 13+ the method above is called instead). */
        @Override
        @SuppressWarnings("deprecation")
        public void onCharacteristicRead(BluetoothGatt g, BluetoothGattCharacteristic c, int st) {
            if (Build.VERSION.SDK_INT >= 33) return;
            byte[] value = c.getValue();
            byte[] v = value == null ? null : value.clone();
            main.post(() -> done(g, null, c.getUuid(), v, st));
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt g, BluetoothGattCharacteristic c, byte[] value) {
            byte[] v = value.clone();
            UUID id = c.getUuid();
            main.post(() -> indicated(g, id, v));
        }

        @Override
        @SuppressWarnings("deprecation")
        public void onCharacteristicChanged(BluetoothGatt g, BluetoothGattCharacteristic c) {
            if (Build.VERSION.SDK_INT >= 33) return;
            byte[] value = c.getValue();
            if (value == null) return;
            byte[] v = value.clone();
            UUID id = c.getUuid();
            main.post(() -> indicated(g, id, v));
        }
    };

    @SuppressLint("MissingPermission")
    private void connectionChanged(BluetoothGatt g, int st, int state) {
        if (g != gatt) return;
        Log.i(TAG, "omron: connection state " + state + " status " + st);
        if (state == BluetoothProfile.STATE_CONNECTED && st == BluetoothGatt.GATT_SUCCESS) {
            received = 0;
            clockLag = 0;
            clockReads = 0;
            if (!pairing) setStatus(Status.LOADING);
            boolean ok;
            try {
                ok = g.discoverServices();
            } catch (SecurityException e) {
                ok = false;
            }
            if (!ok) lost();
        } else if (state == BluetoothProfile.STATE_DISCONNECTED || st != BluetoothGatt.GATT_SUCCESS) {
            lost();
        }
    }

    /** The monitor let go (or the link broke): pairing failed, or a transfer ended - then wait again. */
    private void lost() {
        boolean wasSubscribed = subscribed;
        closeGatt();
        if (pairing) {
            failPairing("connection lost");
            return;
        }
        if (wasSubscribed) {
            callback.onBpTransferDone();
            setStatus(Status.DONE);
        } else if (status == Status.LOADING) {
            setStatus(Status.WAITING);
        }
        main.postDelayed(rewait, REWAIT_MS);
    }

    @SuppressLint("MissingPermission")
    private void servicesFound(BluetoothGatt g, int st) {
        if (g != gatt) return;
        BluetoothGattService s = g.getService(Bpm.SERVICE);
        logServices(g);
        if (st != BluetoothGatt.GATT_SUCCESS || s == null || s.getCharacteristic(Bpm.MEASUREMENT) == null) {
            Log.w(TAG, "omron: no blood pressure service 0x1810 / measurement 0x2A35");
            if (pairing) failPairing("no blood pressure service");
            else lost();
            return;
        }
        BluetoothDevice d = g.getDevice();
        int bond;
        try {
            bond = d.getBondState();
        } catch (SecurityException e) {
            bond = BluetoothDevice.BOND_NONE;
        }
        if (pairing) {
            // bonded (perhaps an old bond the monitor no longer knows - then Android drops it and DocFit bonds anew):
            // Omron's step at once; not bonded: bond first, the receiver starts the step
            if (bond == BluetoothDevice.BOND_BONDED) omronPairing(g);
            else if (bond == BluetoothDevice.BOND_NONE) bond(g);
        } else if (bond == BluetoothDevice.BOND_BONDED) {
            talk(g);
        } else {
            // the bond is gone (removed in Android's settings?): only a new pairing ("P") helps - no waiting till then
            Log.w(TAG, "omron: paired monitor without bond");
            closeGatt();
            setStatus(Status.BOND_LOST);
        }
    }

    /** Asks Android to bond (Doc confirms once); twice at most per pairing. */
    @SuppressLint("MissingPermission")
    private void bond(BluetoothGatt g) {
        if (bondTries >= 2) {
            failPairing("bond refused twice");
            return;
        }
        bondTries++;
        boolean started;
        try {
            started = g.getDevice().createBond();
        } catch (SecurityException e) {
            started = false;
        }
        Log.i(TAG, "omron: bonding " + (started ? "started" : "not started") + " (try " + bondTries + ")");
    }

    // ---------- Omron's own pairing step ----------

    /** Turns notifications (or indications) of a characteristic on: Android's flag plus the CCCD write in the queue. */
    @SuppressLint("MissingPermission")
    private void listen(BluetoothGatt g, BluetoothGattCharacteristic c) {
        try {
            g.setCharacteristicNotification(c, true);
        } catch (SecurityException e) {
            return;
        }
        BluetoothGattDescriptor cccd = c.getDescriptor(Bpm.CCCD);
        if (cccd == null) return;
        boolean notify = (c.getProperties() & BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0;
        ops.add(new Op(null, cccd, notify ? BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                : BluetoothGattDescriptor.ENABLE_INDICATION_VALUE));
    }

    private BluetoothGattCharacteristic omronChar(BluetoothGatt g, UUID id) {
        BluetoothGattService s = g.getService(OMRON);
        return s == null ? null : s.getCharacteristic(id);
    }

    /** Pairing mode: ask the monitor to take a new key (repeated until it answers 0x82 0x00). */
    private void omronPairing(BluetoothGatt g) {
        if (g != gatt || step != Step.NONE || talking) return;
        BluetoothGattCharacteristic unlock = omronChar(g, UNLOCK);
        if (unlock == null || key == null) {
            Log.w(TAG, "omron: no unlock characteristic or no key - the standard part alone");
            talk(g);
            return;
        }
        step = Step.KEY_MODE;
        keyTries = 1;
        listen(g, unlock);
        ops.add(new Op(unlock, null, Bpm.keyModeRequest()));
        next();
        main.removeCallbacks(stepTimeout);
        main.postDelayed(stepTimeout, STEP_MS);
    }

    /** An answer on the unlock characteristic. */
    private void onUnlock(BluetoothGatt g, byte[] v) {
        Log.i(TAG, "omron: unlock answer " + Bpm.hex(v) + " in step " + step);
        BluetoothGattCharacteristic unlock = omronChar(g, UNLOCK);
        if (step == Step.KEY_MODE && Bpm.isAnswer(v, 0x82, 0x00)) {
            step = Step.KEY_SET;
            ops.add(new Op(unlock, null, Bpm.keyWrite(key)));
            next();
            main.removeCallbacks(stepTimeout);
            main.postDelayed(stepTimeout, 4 * STEP_MS);
        } else if (step == Step.KEY_SET) {
            main.removeCallbacks(stepTimeout);
            if (Bpm.isAnswer(v, 0x80, 0x00)) startTransmission(g);
            else failPairing("key refused");
        } else if (step == Step.UNLOCK) {
            main.removeCallbacks(stepTimeout);
            if (Bpm.isAnswer(v, 0x81, 0x00)) {
                setClock(g);
            } else {
                Log.w(TAG, "omron: the monitor does not know DocFit's key");
                step = Step.NONE;
                talkStandard(g);
            }
        }
        // KEY_MODE with another answer: the timeout asks again
    }

    /** After the key: "start transmission" and "end transmission" on Omron's channels, as its app does once. */
    private void startTransmission(BluetoothGatt g) {
        Log.i(TAG, "omron: key stored");
        BluetoothGattCharacteristic tx = omronChar(g, TX0);
        if (tx == null) {
            finishOmronPairing(g);
            return;
        }
        step = Step.TX_START;
        for (UUID id : RX) {
            BluetoothGattCharacteristic c = omronChar(g, id);
            if (c != null) listen(g, c);
        }
        ops.add(new Op(tx, null, Bpm.START_TRANSMISSION));
        next();
        main.removeCallbacks(stepTimeout);
        main.postDelayed(stepTimeout, 4 * STEP_MS);
    }

    /** An answer on one of Omron's receive channels. */
    private void onReceive(BluetoothGatt g, int channel, byte[] piece) {
        byte[] v = frames.add(channel, piece);
        if (v == null) return;
        Log.i(TAG, "omron: frame " + (step == Step.CLK_READ ? Bpm.hex(java.util.Arrays.copyOf(v, Math.min(6, v.length))) + "…"
                : Bpm.hex(v)) + " in step " + step + (Bpm.frameOk(v) ? "" : " (checksum wrong)"));
        if (step == Step.CLK_START && Bpm.isFrame(v, 0x80)) {
            step = Step.CLK_READ;
            send(g, Bpm.readCommand(Bpm.CLOCK_READ, Bpm.CLOCK_SIZE));
            restartStepTimeout(4 * STEP_MS);
        } else if (step == Step.CLK_READ) {
            byte[] old = Bpm.readData(v, Bpm.CLOCK_READ);
            byte[] block = Bpm.clockBlock(old, System.currentTimeMillis(), tz);
            if (block == null) {
                Log.w(TAG, "omron: clock block not readable - the clock stays");
                endClock(g);
                return;
            }
            step = Step.CLK_WRITE;
            send(g, Bpm.writeCommand(Bpm.CLOCK_WRITE, block));
            restartStepTimeout(4 * STEP_MS);
        } else if (step == Step.CLK_WRITE) {
            boolean ok = Bpm.frameOk(v) && (v[1] & 0xFF) == 0x81 && (v[2] & 0xFF) == 0xC0;
            Log.i(TAG, "omron: clock " + (ok ? "SET" : "not confirmed"));
            endClock(g);
        } else if (step == Step.CLK_END && Bpm.isFrame(v, 0x8F)) {
            main.removeCallbacks(stepTimeout);
            step = Step.NONE;
            talkStandard(g);
        } else if (step == Step.TX_START && Bpm.isFrame(v, 0x80)) {
            step = Step.TX_END;
            ops.add(new Op(omronChar(g, TX0), null, Bpm.END_TRANSMISSION));
            next();
            main.removeCallbacks(stepTimeout);
            main.postDelayed(stepTimeout, 4 * STEP_MS);
        } else if (step == Step.TX_END && Bpm.isFrame(v, 0x8F)) {
            main.removeCallbacks(stepTimeout);
            finishOmronPairing(g);
        }
    }

    /** Writes a frame to the send channels, 16 bytes each, in order. */
    private void send(BluetoothGatt g, byte[] frame) {
        byte[][] p = Bpm.pieces(frame);
        for (int i = 0; i < p.length && i < TX.length; i++) {
            BluetoothGattCharacteristic c = omronChar(g, TX[i]);
            if (c != null) ops.add(new Op(c, null, p[i]));
        }
        next();
    }

    private void restartStepTimeout(long ms) {
        main.removeCallbacks(stepTimeout);
        main.postDelayed(stepTimeout, ms);
    }

    /**
     * A normal connection, after the key: set the monitor's clock as Omron's app does - its standard clock (0x2A2B)
     * ignores writes (24./25.11.2026, both adjust reasons: 0x80) and the monitor shows "date and time not set" until an
     * app sets it. Start transmission, read the 16-byte clock block, write it back with the phone's time, end.
     */
    private void setClock(BluetoothGatt g) {
        if (omronChar(g, TX0) == null) {
            step = Step.NONE;
            talkStandard(g);
            return;
        }
        step = Step.CLK_START;
        for (UUID id : RX) {
            BluetoothGattCharacteristic c = omronChar(g, id);
            if (c != null) listen(g, c);
        }
        send(g, Bpm.START_TRANSMISSION);
        restartStepTimeout(4 * STEP_MS);
    }

    private void endClock(BluetoothGatt g) {
        step = Step.CLK_END;
        send(g, Bpm.END_TRANSMISSION);
        restartStepTimeout(4 * STEP_MS);
    }

    /** After the key and the first transmission: set the clock too (Omron's app does it when pairing), then the rest. */
    private void finishOmronPairing(BluetoothGatt g) {
        step = Step.NONE;
        setClock(g);
    }

    /** No answer in time: ask again for the key mode, give up, or go on without the optional steps. */
    private final Runnable stepTimeout = new Runnable() {
        @Override
        public void run() {
        BluetoothGatt g = gatt;
        if (g == null) return;
        switch (step) {
            case KEY_MODE:
                if (keyTries >= KEY_TRIES) {
                    failPairing("monitor never took a key");
                    return;
                }
                keyTries++;
                ops.add(new Op(omronChar(g, UNLOCK), null, Bpm.keyModeRequest()));
                next();
                main.postDelayed(this, STEP_MS);
                break;
            case KEY_SET:
                failPairing("no answer to the key");
                break;
            case TX_START:
            case TX_END:
                Log.w(TAG, "omron: no answer in " + step + " - going on");
                finishOmronPairing(g);
                break;
            case UNLOCK:
                Log.w(TAG, "omron: no answer to the unlock - going on");
                step = Step.NONE;
                talkStandard(g);
                break;
            case CLK_START:
            case CLK_READ:
            case CLK_WRITE:
                Log.w(TAG, "omron: no answer in " + step + " - ending the transmission");
                endClock(g);
                break;
            case CLK_END:
                Log.w(TAG, "omron: no answer to the end of the transmission - going on");
                step = Step.NONE;
                talkStandard(g);
                break;
            default:
                break;
        }
        }
    };

    /** The bond came (again) while pairing: the CCCD writes before it may have been refused - ask anew. */
    private void restartOmronPairing(BluetoothGatt g) {
        if (g != gatt || talking) return;
        main.removeCallbacks(stepTimeout);
        ops.clear();
        step = Step.NONE;
        omronPairing(g);
    }

    /** Which services and characteristics the monitor has, with their properties - for the log only. */
    private void logServices(BluetoothGatt g) {
        for (BluetoothGattService s : g.getServices()) {
            StringBuilder b = new StringBuilder("omron: service ").append(s.getUuid());
            for (BluetoothGattCharacteristic c : s.getCharacteristics()) {
                b.append("\n  ").append(c.getUuid()).append(" props 0x").append(Integer.toHexString(c.getProperties()));
            }
            Log.i(TAG, b.toString());
        }
    }

    /**
     * Bonded, on a normal connection: first show the monitor DocFit's key (as Omron's app does; no answer within a
     * moment and DocFit goes on), then the standard part.
     */
    private void talk(BluetoothGatt g) {
        if (g != gatt || talking || step != Step.NONE) return;
        BluetoothGattCharacteristic unlock = omronChar(g, UNLOCK);
        if (pairing || unlock == null || key == null) {
            talkStandard(g);
            return;
        }
        step = Step.UNLOCK;
        listen(g, unlock);
        ops.add(new Op(unlock, null, Bpm.unlock(key)));
        next();
        main.removeCallbacks(stepTimeout);
        main.postDelayed(stepTimeout, 2 * STEP_MS);
    }

    /** The standard part: read the clock, set it, switch the indications on - then the monitor sends. */
    @SuppressLint("MissingPermission")
    private void talkStandard(BluetoothGatt g) {
        if (g != gatt || talking) return;
        talking = true;
        BluetoothGattCharacteristic feature = g.getService(Bpm.SERVICE).getCharacteristic(FEATURE);
        if (feature != null) ops.add(new Op(feature, null, null));
        BluetoothGattService uds = g.getService(UDS);
        BluetoothGattCharacteristic index = uds == null ? null : uds.getCharacteristic(USER_INDEX);
        if (index != null) ops.add(new Op(index, null, null));
        BluetoothGattService ts = g.getService(Bpm.TIME_SERVICE);
        BluetoothGattCharacteristic clock = ts == null ? null : ts.getCharacteristic(Bpm.CURRENT_TIME);
        if (clock != null) {
            int p = clock.getProperties();
            boolean read = (p & BluetoothGattCharacteristic.PROPERTY_READ) != 0;
            if (read) ops.add(new Op(clock, null, null));
            if ((p & (BluetoothGattCharacteristic.PROPERTY_WRITE | BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE)) != 0) {
                // the bytes are made when it is sent (the exact second); the one byte here is the "adjust reason".
                // 24.11.2026: 0x01 answered 0x80 ("data field ignored") and the clock stayed unknown - so 0x00 first,
                // each followed by a read to see whether it took
                ops.add(new Op(clock, null, new byte[]{0x00}));
                if (read) ops.add(new Op(clock, null, null));
                ops.add(new Op(clock, null, new byte[]{0x01}));
                if (read) ops.add(new Op(clock, null, null));
            }
        } else {
            Log.i(TAG, "omron: no current time service - the clock stays as it is");
        }
        BluetoothGattCharacteristic m = g.getService(Bpm.SERVICE).getCharacteristic(Bpm.MEASUREMENT);
        try {
            g.setCharacteristicNotification(m, true);
        } catch (SecurityException e) {
            lost();
            return;
        }
        BluetoothGattDescriptor cccd = m.getDescriptor(Bpm.CCCD);
        if (cccd == null) {
            Log.w(TAG, "omron: measurement without CCCD");
            if (pairing) failPairing("no CCCD");
            else lost();
            return;
        }
        boolean indicate = (m.getProperties() & BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0;
        ops.add(new Op(null, cccd, indicate ? BluetoothGattDescriptor.ENABLE_INDICATION_VALUE
                : BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE));
        next();
    }

    // ---------- the queue ----------

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
                } else if (op.value == null) {
                    started = gatt.readCharacteristic(op.ch);
                } else {
                    byte[] value = Bpm.CURRENT_TIME.equals(op.ch.getUuid())
                            ? Bpm.currentTime(System.currentTimeMillis(), tz, op.value.length == 1 ? op.value[0] : 0x01)
                            : op.value;
                    int type = (op.ch.getProperties() & BluetoothGattCharacteristic.PROPERTY_WRITE) != 0
                            ? BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
                            : BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE;
                    if (Build.VERSION.SDK_INT >= 33) {
                        started = gatt.writeCharacteristic(op.ch, value, type) == BluetoothStatusCodes.SUCCESS;
                    } else {
                        op.ch.setWriteType(type);
                        op.ch.setValue(value);
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
                Log.w(TAG, "omron: operation not started");
            }
        }
    }

    private void done(BluetoothGatt g, UUID desc, UUID ch, byte[] read, int st) {
        if (g != gatt) return;
        main.removeCallbacks(opTimeout);
        opBusy = false;
        if ((FEATURE.equals(ch) || USER_INDEX.equals(ch)) && desc == null) {
            Log.i(TAG, "omron: read " + ch.toString().substring(4, 8) + " status " + st + " = " + Bpm.hex(read));
        } else if (Bpm.CURRENT_TIME.equals(ch) && desc == null) {
            if (read != null) {
                // only the first read says how far the clock was off before DocFit set it
                if (clockReads++ == 0) {
                    clockLag = st == BluetoothGatt.GATT_SUCCESS ? Bpm.clockLag(read, System.currentTimeMillis(), tz) : 0;
                }
                Log.i(TAG, "omron: clock read, status " + st + ", lag " + clockLag / 1000 + " s, " + Bpm.hex(read));
            } else {
                Log.i(TAG, "omron: clock set, status " + st);
            }
        } else if (Bpm.CCCD.equals(desc) && !Bpm.MEASUREMENT.equals(ch)) {
            Log.i(TAG, "omron: notifications of " + ch.toString().substring(0, 8) + " on, status " + st);
        } else if (Bpm.CCCD.equals(desc)) {
            Log.i(TAG, "omron: indications on, status " + st);
            if (st == BluetoothGatt.GATT_SUCCESS) {
                subscribed = true;
                if (pairing) {
                    pairing = false;
                    main.removeCallbacks(pairGiveUp);
                    paired = g.getDevice().getAddress();
                    callback.onBpPaired(paired);
                }
                setStatus(Status.LOADING);
                main.removeCallbacks(quiet);
                main.postDelayed(quiet, QUIET_MS);
            } else if (pairing) {
                failPairing("indications refused " + st);
                return;
            }
        }
        next();
    }

    private final Runnable opTimeout = () -> {
        opBusy = false;
        next();
    };

    /** Nothing more for a while: let go, so the monitor can switch off and DocFit waits for the next time. */
    private final Runnable quiet = () -> {
        if (gatt != null && subscribed) lost();
    };

    private void indicated(BluetoothGatt g, UUID id, byte[] value) {
        if (g != gatt) return;
        if (UNLOCK.equals(id)) {
            onUnlock(g, value);
            return;
        }
        for (int i = 0; i < RX.length; i++) {
            if (RX[i].equals(id)) {
                onReceive(g, i, value);
                return;
            }
        }
        if (!Bpm.MEASUREMENT.equals(id)) return;
        Bpm.Measurement m = Bpm.parse(value, tz);
        // the flags and the time stamp bytes for the log - the pressures and the pulse never
        String stamp = value.length >= 14 && (value[0] & 0x02) != 0
                ? Bpm.hex(java.util.Arrays.copyOfRange(value, 7, 14)) : "none";
        Log.i(TAG, "omron: reading " + (m == null ? "unreadable (" + value.length + " bytes)"
                : "user " + m.user + " status 0x" + Integer.toHexString(m.status))
                + " flags 0x" + Integer.toHexString(value.length > 0 ? value[0] & 0xFF : 0) + " time " + stamp);
        main.removeCallbacks(quiet);
        main.postDelayed(quiet, QUIET_MS);
        if (m == null) return;
        received++;
        callback.onBpReading(m, clockLag);
    }

    private final BroadcastReceiver bluetoothState = new BroadcastReceiver() {
        @Override
        @SuppressWarnings("deprecation")
        public void onReceive(Context c, Intent i) {
            if (BluetoothDevice.ACTION_BOND_STATE_CHANGED.equals(i.getAction())) {
                BluetoothDevice d = Build.VERSION.SDK_INT >= 33
                        ? i.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice.class)
                        : i.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                int state = i.getIntExtra(BluetoothDevice.EXTRA_BOND_STATE, BluetoothDevice.ERROR);
                if (d == null || gatt == null || !d.getAddress().equals(gatt.getDevice().getAddress())) return;
                Log.i(TAG, "omron: bond state " + state);
                BluetoothGatt g = gatt;
                if (state == BluetoothDevice.BOND_BONDED) {
                    // pairing: Omron's step is already asking (or starts now); else the normal talk
                    main.postDelayed(() -> {
                        if (pairing) restartOmronPairing(g);
                        else talk(g);
                    }, 500);
                } else if (state == BluetoothDevice.BOND_NONE) {
                    // pairing: an old bond the monitor no longer knew is gone - bond anew, Omron's step keeps asking
                    if (pairing) bond(g);
                    else lost();
                }
                return;
            }
            int state = i.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
            if (state == BluetoothAdapter.STATE_ON) {
                if (status == Status.BLUETOOTH_OFF) status = Status.IDLE;
                waitForMonitor();
            } else if (state == BluetoothAdapter.STATE_TURNING_OFF || state == BluetoothAdapter.STATE_OFF) {
                pairing = false;
                scanning = false;
                closeGatt();
                main.removeCallbacksAndMessages(null);
                setStatus(Status.BLUETOOTH_OFF);
            }
        }
    };
}
