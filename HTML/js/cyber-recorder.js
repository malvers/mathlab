/**
 * Cyber-Binary Codec
 * Compresses macro events into a compact ArrayBuffer format.
 */
class CyberBinaryCodec {
    static ENCODER = new TextEncoder();
    static DECODER = new TextDecoder();

    static EVENT_TYPES = {
        'meta_init': 0,
        'mousedown': 1,
        'mousemove': 2,
        'mouseup': 3,
        'click': 4,
        'input': 5,
        'change': 6
    };
    
    // Reverse mapping for decoding
    static get REVERSE_TYPES() {
        if (!this._reverse) {
            this._reverse = {};
            for (let k in this.EVENT_TYPES) this._reverse[this.EVENT_TYPES[k]] = k;
        }
        return this._reverse;
    }

    static encode(events) {
        let totalBytes = 0;
        const encodedStrings = new Map();

        for (const ev of events) {
            totalBytes += 5; // type (1) + t (4)
            if (ev.type === 'meta_init') {
                totalBytes += 4; // width (2) + height (2)
            } else if (ev.type.startsWith('mouse') || ev.type === 'click') {
                totalBytes += 4; // clientX (2) + clientY (2)
            } else if (ev.type === 'input' || ev.type === 'change') {
                const pathBytes = this.ENCODER.encode(ev.targetPath || "");
                encodedStrings.set(ev, { pathBytes });
                totalBytes += 2 + pathBytes.length; // pathLen (2) + pathBytes
                
                totalBytes += 1; // isBoolean (1)
                if (typeof ev.value === 'boolean') {
                    totalBytes += 1; // booleanValue (1)
                } else {
                    const valBytes = this.ENCODER.encode(String(ev.value || ""));
                    encodedStrings.get(ev).valBytes = valBytes;
                    totalBytes += 2 + valBytes.length; // valLen (2) + valBytes
                }
            }
        }

        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);
        let offset = 0;

        for (const ev of events) {
            view.setUint8(offset, this.EVENT_TYPES[ev.type]); offset += 1;
            view.setUint32(offset, ev.t, true); offset += 4; // little endian

            if (ev.type === 'meta_init') {
                view.setUint16(offset, ev.width, true); offset += 2;
                view.setUint16(offset, ev.height, true); offset += 2;
            } else if (ev.type.startsWith('mouse') || ev.type === 'click') {
                view.setUint16(offset, ev.clientX, true); offset += 2;
                view.setUint16(offset, ev.clientY, true); offset += 2;
            } else if (ev.type === 'input' || ev.type === 'change') {
                const cached = encodedStrings.get(ev);
                view.setUint16(offset, cached.pathBytes.length, true); offset += 2;
                new Uint8Array(buffer).set(cached.pathBytes, offset); offset += cached.pathBytes.length;
                
                if (typeof ev.value === 'boolean') {
                    view.setUint8(offset, 1); offset += 1; // isBoolean = 1
                    view.setUint8(offset, ev.value ? 1 : 0); offset += 1;
                } else {
                    view.setUint8(offset, 0); offset += 1; // isBoolean = 0
                    view.setUint16(offset, cached.valBytes.length, true); offset += 2;
                    new Uint8Array(buffer).set(cached.valBytes, offset); offset += cached.valBytes.length;
                }
            }
        }
        return buffer;
    }

    static decode(buffer) {
        const view = new DataView(buffer);
        const events = [];
        let offset = 0;

        while (offset < buffer.byteLength) {
            const typeId = view.getUint8(offset); offset += 1;
            const type = this.REVERSE_TYPES[typeId];
            const t = view.getUint32(offset, true); offset += 4;
            
            const ev = { type, t };

            if (type === 'meta_init') {
                ev.width = view.getUint16(offset, true); offset += 2;
                ev.height = view.getUint16(offset, true); offset += 2;
            } else if (type.startsWith('mouse') || type === 'click') {
                ev.clientX = view.getUint16(offset, true); offset += 2;
                ev.clientY = view.getUint16(offset, true); offset += 2;
            } else if (type === 'input' || type === 'change') {
                const pathLen = view.getUint16(offset, true); offset += 2;
                const pathBytes = new Uint8Array(buffer, offset, pathLen);
                ev.targetPath = this.DECODER.decode(pathBytes); offset += pathLen;
                
                const isBoolean = view.getUint8(offset); offset += 1;
                if (isBoolean === 1) {
                    ev.value = view.getUint8(offset) === 1; offset += 1;
                } else {
                    const valLen = view.getUint16(offset, true); offset += 2;
                    const valBytes = new Uint8Array(buffer, offset, valLen);
                    ev.value = this.DECODER.decode(valBytes); offset += valLen;
                }
            }
            events.push(ev);
        }
        return events;
    }
}

/**
 * Cyber-Recorder Engine
 * Generic macro recording and replay for Doc Alvers Laboratories.
 */
class CyberRecorderEngine {
    constructor() {
        this.events = [];
        this.startTime = 0;
        this.mode = 'idle'; // 'idle', 'recording', 'playing'
        this.lastMouseTime = 0;
        this.ghostCursor = null;
        this.ui = null;
        this.playTimers = [];
        
        this.boundHandleEvent = this.handleEvent.bind(this);
    }

    init() {
        this.injectUI();
        this.injectGhostCursor();
        console.log("⚛️ Cyber-Recorder Engine initialized.");
    }

    injectUI() {
        if (document.getElementById('cyber-recorder-ui')) return;
        
        const ui = document.createElement('div');
        ui.id = 'cyber-recorder-ui';
        ui.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 15, 30, 0.95);
            border: 1px solid rgba(0, 210, 255, 0.4);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            gap: 10px;
            z-index: 1000000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            font-family: Orbitron, sans-serif;
            color: #fff;
            align-items: center;
        `;
        
        const title = document.createElement('div');
        title.innerText = "RECORDER";
        title.style.fontSize = "0.7rem";
        title.style.color = "rgba(0, 210, 255, 0.8)";
        title.style.marginRight = "5px";
        ui.appendChild(title);

        const btnStyle = `
            background: rgba(0, 210, 255, 0.1);
            border: 1px solid rgba(0, 210, 255, 0.4);
            color: #00d2ff;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.8rem;
            transition: all 0.2s;
        `;

        const btnRec = document.createElement('button');
        btnRec.innerText = "⏺";
        btnRec.title = "Aufnahme starten";
        btnRec.style.cssText = btnStyle;
        btnRec.onclick = () => this.startRecording();
        
        const btnStop = document.createElement('button');
        btnStop.innerText = "⏹";
        btnStop.title = "Stopp";
        btnStop.style.cssText = btnStyle;
        btnStop.onclick = () => this.stop();
        
        const btnPlay = document.createElement('button');
        btnPlay.innerText = "▶️";
        btnPlay.title = "Abspielen";
        btnPlay.style.cssText = btnStyle;
        btnPlay.onclick = () => this.play();
        
        const btnImport = document.createElement('button');
        btnImport.innerText = "📂";
        btnImport.title = ".bin Datei laden";
        btnImport.style.cssText = btnStyle;
        btnImport.onclick = () => document.getElementById('cyber-recorder-file-input').click();
        
        const btnExport = document.createElement('button');
        btnExport.innerText = "💾";
        btnExport.title = "Export als binäre .bin Datei";
        btnExport.style.cssText = btnStyle;
        btnExport.onclick = () => this.exportScript();
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'cyber-recorder-file-input';
        fileInput.accept = '.bin'; // Mac OS erkennt .bin nativ, wodurch der Filter klappt!
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => this.importScript(e);

        ui.appendChild(btnRec);
        ui.appendChild(btnStop);
        ui.appendChild(btnPlay);
        ui.appendChild(btnImport);
        ui.appendChild(btnExport);
        ui.appendChild(fileInput);

        this.ui = ui;
        document.body.appendChild(ui);
        
        this.btnRec = btnRec;
        this.btnPlay = btnPlay;

        // Add Drag & Drop fallback!
        document.body.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        document.body.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length > 0) {
                e.preventDefault();
                // Pass the file to our import logic
                const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } };
                this.importScript(fakeEvent);
            }
        });
    }

    injectGhostCursor() {
        if (document.getElementById('cyber-ghost-cursor')) return;
        const cursor = document.createElement('div');
        cursor.id = 'cyber-ghost-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgba(0, 210, 255, 0.6);
            border: 2px solid #00d2ff;
            box-shadow: 0 0 10px #00d2ff;
            pointer-events: none;
            z-index: 9999999;
            transform: translate(-50%, -50%);
            display: none;
            transition: width 0.1s, height 0.1s;
        `;
        document.body.appendChild(cursor);
        this.ghostCursor = cursor;
    }

    startRecording() {
        if (this.mode !== 'idle') return;
        this.mode = 'recording';
        this.events = [];
        this.startTime = performance.now();
        this.lastMouseTime = 0;
        
        this.btnRec.style.background = "rgba(255, 0, 0, 0.3)";
        this.btnRec.style.color = "#ff4444";
        this.btnRec.style.borderColor = "#ff4444";

        document.addEventListener('mousedown', this.boundHandleEvent, true);
        document.addEventListener('mousemove', this.boundHandleEvent, true);
        document.addEventListener('mouseup', this.boundHandleEvent, true);
        document.addEventListener('click', this.boundHandleEvent, true);
        document.addEventListener('input', this.boundHandleEvent, true);
        document.addEventListener('change', this.boundHandleEvent, true);
        
        console.log("⏺ Recording started...");
        
        // Record initial window size
        this.events.push({
            type: 'meta_init',
            t: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    stop() {
        if (this.mode === 'recording') {
            document.removeEventListener('mousedown', this.boundHandleEvent, true);
            document.removeEventListener('mousemove', this.boundHandleEvent, true);
            document.removeEventListener('mouseup', this.boundHandleEvent, true);
            document.removeEventListener('click', this.boundHandleEvent, true);
            document.removeEventListener('input', this.boundHandleEvent, true);
            document.removeEventListener('change', this.boundHandleEvent, true);
            
            this.btnRec.style.background = "rgba(0, 210, 255, 0.1)";
            this.btnRec.style.color = "#00d2ff";
            this.btnRec.style.borderColor = "rgba(0, 210, 255, 0.4)";
            
            console.log(`⏹ Recording stopped. Recorded ${this.events.length} events.`);
        } else if (this.mode === 'playing') {
            this.playTimers.forEach(t => clearTimeout(t));
            this.playTimers = [];
            this.ghostCursor.style.display = 'none';
            this.btnPlay.style.background = "rgba(0, 210, 255, 0.1)";
            console.log("⏹ Playback aborted.");
        }
        this.mode = 'idle';
    }

    handleEvent(e) {
        if (this.mode !== 'recording') return;
        
        // Ignore events on the recorder UI itself
        if (e.target && e.target.closest && e.target.closest('#cyber-recorder-ui')) return;

        const t = performance.now() - this.startTime;
        const ev = { type: e.type, t: Math.round(t) };

        if (e.type.startsWith('mouse') || e.type === 'click') {
            // Throttle mousemove to ~30fps (33ms)
            if (e.type === 'mousemove') {
                if (t - this.lastMouseTime < 33) return;
                this.lastMouseTime = t;
            }
            ev.clientX = Math.max(0, Math.round(e.clientX));
            ev.clientY = Math.max(0, Math.round(e.clientY));
        }

        if (e.type === 'input' || e.type === 'change') {
            ev.targetPath = this.getCssPath(e.target);
            if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                ev.value = e.target.checked;
            } else {
                ev.value = e.target.value;
            }
        }

        this.events.push(ev);
    }

    getCssPath(el) {
        if (!(el instanceof Element)) return '';
        const path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += ":nth-of-type("+nth+")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }

    play() {
        if (this.mode !== 'idle' || this.events.length === 0) {
            if (this.events.length === 0) alert("Bitte lade oder erstelle zuerst ein Skript!");
            return;
        }
        this.mode = 'playing';
        this.playTimers = [];
        this.btnPlay.style.background = "rgba(0, 255, 0, 0.3)";
        this.ghostCursor.style.display = 'block';
        
        console.log("▶️ Playing script...");

        this.events.forEach((ev, index) => {
            const timer = setTimeout(() => {
                this.executeEvent(ev);
                
                // If it's the last event, stop playing
                if (index === this.events.length - 1) {
                    this.stop();
                }
            }, ev.t);
            this.playTimers.push(timer);
        });
    }

    executeEvent(ev) {
        if (ev.type.startsWith('mouse') || ev.type === 'click') {
            this.ghostCursor.style.left = ev.clientX + 'px';
            this.ghostCursor.style.top = ev.clientY + 'px';
            
            if (ev.type === 'mousedown') {
                this.ghostCursor.style.width = '12px';
                this.ghostCursor.style.height = '12px';
                this.ghostCursor.style.background = 'rgba(255, 100, 0, 0.8)';
            } else if (ev.type === 'mouseup') {
                this.ghostCursor.style.width = '16px';
                this.ghostCursor.style.height = '16px';
                this.ghostCursor.style.background = 'rgba(0, 210, 255, 0.6)';
            }
            
            // Re-dispatch event onto the element underneath
            // Temporarily hide ghost cursor so we don't pick it up
            this.ghostCursor.style.display = 'none';
            const target = document.elementFromPoint(ev.clientX, ev.clientY) || document.body;
            this.ghostCursor.style.display = 'block';

            const synthEvent = new MouseEvent(ev.type, {
                clientX: ev.clientX,
                clientY: ev.clientY,
                bubbles: true,
                cancelable: true,
                view: window
            });
            target.dispatchEvent(synthEvent);
        } else if (ev.type === 'input' || ev.type === 'change') {
            if (ev.targetPath) {
                const target = document.querySelector(ev.targetPath);
                if (target) {
                    if (target.type === 'checkbox' || target.type === 'radio') {
                        target.checked = ev.value;
                    } else {
                        target.value = ev.value;
                    }
                    target.dispatchEvent(new Event(ev.type, { bubbles: true }));
                }
            }
        } else if (ev.type === 'meta_init') {
            if (Math.abs(ev.width - window.innerWidth) > 50 || Math.abs(ev.height - window.innerHeight) > 50) {
                console.warn(`[CyberRecorder] Window size mismatch! Recorded at ${ev.width}x${ev.height}, current is ${window.innerWidth}x${window.innerHeight}. Replay might be slightly off for absolute clicks.`);
            }
        }
    }

    exportScript() {
        if (this.events.length === 0) {
            alert("Noch keine Events aufgezeichnet.");
            return;
        }
        
        try {
            const buffer = CyberBinaryCodec.encode(this.events);
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `cyber-demo-${Date.now()}.bin`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`[CyberRecorder] Binärdatei erfolgreich generiert (${buffer.byteLength} Bytes).`);
        } catch (e) {
            console.error("Export Error:", e);
            alert("Fehler beim Exportieren!");
        }
    }

    importScript(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const buffer = event.target.result;
                this.events = CyberBinaryCodec.decode(buffer);
                console.log(`[CyberRecorder] Script erfolgreich geladen. ${this.events.length} Events gefunden.`);
                
                // Show brief confirmation
                const oldColor = this.btnPlay.style.color;
                this.btnPlay.style.color = "#00ff00";
                setTimeout(() => this.btnPlay.style.color = oldColor, 1000);
            } catch (err) {
                console.error("Import Error:", err);
                alert("Fehler beim Laden der Datei! Bist du sicher, dass es ein gültiges Cyber-Skript ist?");
            }
        };
        reader.readAsArrayBuffer(file);
        
        // Reset input so the same file can be selected again
        e.target.value = '';
    }     e.target.value = '';
    }
}

// Global instance
window.CyberRecorder = new CyberRecorderEngine();
