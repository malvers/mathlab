const REC_SVG = {
    record: `<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>`,
    stop:   `<svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor"/></svg>`,
    play:   `<svg width="20" height="20" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>`,
    load:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>`,
    save:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
};

class CyberContainerCodec {
    static MAGIC = 0x435245_43; // "CREC"
    static VERSION = 1;

    static async encodeWithAudio(events, audioBlob = null) {
        const eventBuffer = CyberBinaryCodec.encode(events);
        const audioData = audioBlob && audioBlob.size > 0
            ? new Uint8Array(await audioBlob.arrayBuffer())
            : new Uint8Array(0);

        const totalSize = 4 + 1 + 4 + eventBuffer.byteLength + 4 + audioData.length;
        const container = new ArrayBuffer(totalSize);
        const view = new DataView(container);
        const bytes = new Uint8Array(container);

        let offset = 0;
        view.setUint32(offset, this.MAGIC, true); offset += 4;
        view.setUint8(offset, this.VERSION); offset += 1;
        view.setUint32(offset, eventBuffer.byteLength, true); offset += 4;
        bytes.set(new Uint8Array(eventBuffer), offset); offset += eventBuffer.byteLength;
        view.setUint32(offset, audioData.length, true); offset += 4;
        if (audioData.length > 0) bytes.set(audioData, offset);

        return container;
    }

    static decodeContainer(buffer) {
        const view = new DataView(buffer);
        if (buffer.byteLength < 9) throw new Error("Invalid container: too small");

        let offset = 0;
        const magic = view.getUint32(offset, true); offset += 4;
        if (magic !== this.MAGIC) throw new Error("Invalid container: wrong magic bytes");

        const version = view.getUint8(offset); offset += 1;
        if (version !== this.VERSION) throw new Error("Unsupported container version: " + version);

        const eventsLen = view.getUint32(offset, true); offset += 4;
        const eventBuffer = buffer.slice(offset, offset + eventsLen);
        offset += eventsLen;

        const audioLen = view.getUint32(offset, true); offset += 4;
        const audioBuffer = audioLen > 0 ? buffer.slice(offset, offset + audioLen) : null;

        return {
            events: CyberBinaryCodec.decode(eventBuffer),
            audio: audioBuffer
        };
    }
}

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

        this.recordAudio = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioBlob = null;
        this.audioElement = null;
        this.audioCheckbox = null;
    }

    init() {
        this.injectUI();
        this.injectGhostCursor();
        console.log("⚛️ Cyber-Recorder Engine initialized.");
    }

    addDebugLog(msg) {
        if (!this.debugBox) return;
        const timestamp = new Date().toLocaleTimeString('de-DE');
        const line = `[${timestamp}] ${msg}\n`;
        this.debugBox.textContent += line;
        // Auto-scroll to bottom
        setTimeout(() => {
            this.debugBox.scrollTop = this.debugBox.scrollHeight;
        }, 0);
        console.log(msg);
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
            display: none;
            gap: 10px;
            z-index: 1000000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            font-family: Orbitron, sans-serif;
            color: #fff;
            align-items: center;
        `;
        
        if (!document.getElementById('cyber-recorder-style')) {
            const s = document.createElement('style');
            s.id = 'cyber-recorder-style';
            s.textContent = `@keyframes rec-blink{0%,100%{opacity:1}50%{opacity:0}}.rec-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff3333;animation:rec-blink .7s ease-in-out infinite;vertical-align:middle;margin-right:6px;flex-shrink:0}`;
            document.head.appendChild(s);
        }

        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        `;

        const title = document.createElement('div');
        title.innerText = "RECORDER";
        title.style.cssText = `
            font-size: 0.7rem;
            color: rgba(0, 210, 255, 0.8);
            letter-spacing: 1px;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            cursor: pointer;
            user-select: none;
        `;
        title.onclick = () => {
            if (!this.debugContainer) return;
            const visible = this.debugContainer.style.display === 'flex';
            this.debugContainer.style.display = visible ? 'none' : 'flex';
        };
        titleContainer.appendChild(title);

        // Create debug box first so it's available for audioBtn
        const debugContainer = document.createElement('div');
        debugContainer.id = 'cyber-recorder-debug-container';
        debugContainer.style.cssText = `
            position: fixed;
            top: 20px;
            bottom: 100px;
            right: 20px;
            background: rgba(0, 40, 60, 0.95);
            border: 1px solid rgba(0, 210, 255, 0.3);
            border-radius: 6px;
            display: none;
            flex-direction: column;
            width: 1100px;
            max-width: calc(100vw - 40px);
            z-index: 999999;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            overflow: hidden;
        `;

        const debugHeader = document.createElement('div');
        debugHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(0, 210, 255, 0.2);
            flex-shrink: 0;
        `;

        const debugTitle = document.createElement('span');
        debugTitle.textContent = '🎤 Debug';
        debugTitle.style.cssText = `
            font-size: 0.7rem;
            color: rgba(0, 210, 255, 0.9);
            font-family: 'Courier New', monospace;
            font-weight: bold;
        `;

        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        copyBtn.title = 'Logs kopieren';
        copyBtn.style.cssText = `
            background: rgba(0, 210, 255, 0.1);
            border: 1px solid rgba(0, 210, 255, 0.3);
            color: #00d2ff;
            border-radius: 3px;
            padding: 4px 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        `;
        copyBtn.onmouseover = () => {
            copyBtn.style.background = 'rgba(0, 255, 136, 0.2)';
            copyBtn.style.borderColor = '#00ff88';
            copyBtn.style.color = '#00ff88';
        };
        copyBtn.onmouseout = () => {
            copyBtn.style.background = 'rgba(0, 210, 255, 0.1)';
            copyBtn.style.borderColor = 'rgba(0, 210, 255, 0.3)';
            copyBtn.style.color = '#00d2ff';
        };
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(debugBox.textContent).then(() => {
                copyBtn.style.color = '#00ff88';
                setTimeout(() => {
                    copyBtn.style.color = '#00d2ff';
                }, 500);
            });
        };

        const micSelect = document.createElement('select');
        micSelect.title = 'Mikrofon auswählen';
        micSelect.style.cssText = `
            background: rgba(0, 40, 60, 0.9);
            border: 1px solid rgba(0, 210, 255, 0.3);
            color: #00d2ff;
            border-radius: 3px;
            padding: 2px 4px;
            font-size: 0.6rem;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            flex: 1;
            margin: 0 6px;
            max-width: 200px;
        `;
        micSelect.onchange = (e) => {
            this.selectedDeviceId = e.target.value;
            this.addDebugLog(`🎤 Gerät gewählt: ${e.target.options[e.target.selectedIndex].text}`);
        };
        this.micSelect = micSelect;

        this._refreshMicList = () => {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const mics = devices.filter(d => d.kind === 'audioinput');
                micSelect.innerHTML = '';
                mics.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d.deviceId;
                    opt.textContent = d.label || `Mikrofon ${d.deviceId.slice(0,6)}`;
                    if (d.deviceId === this.selectedDeviceId) opt.selected = true;
                    micSelect.appendChild(opt);
                });
                if (mics.length === 0) {
                    const opt = document.createElement('option');
                    opt.textContent = '(Erst Record drücken)';
                    micSelect.appendChild(opt);
                }
            });
        };
        this._refreshMicList();

        debugHeader.appendChild(debugTitle);
        debugHeader.appendChild(micSelect);
        debugHeader.appendChild(copyBtn);

        const debugBox = document.createElement('div');
        debugBox.id = 'cyber-recorder-debug';
        debugBox.style.cssText = `
            padding: 12px;
            font-size: 0.75rem;
            color: #ffffff;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            word-break: break-all;
            line-height: 1.4;
            overflow-y: auto;
            flex: 1;
        `;

        debugContainer.appendChild(debugHeader);
        debugContainer.appendChild(debugBox);
        this.debugBox = debugBox;
        this.debugContainer = debugContainer;
        document.body.appendChild(debugContainer);

        const audioBtn = document.createElement('button');
        audioBtn.id = 'cyber-recorder-audio-toggle';
        audioBtn.title = 'Ton aufnehmen';
        audioBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
        audioBtn.style.cssText = `
            background: rgba(0, 210, 255, 0.1);
            border: 1px solid rgba(0, 210, 255, 0.4);
            color: #00d2ff;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.8rem;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        `;

        const setAudioBtnState = (enabled) => {
            if (enabled) {
                audioBtn.style.background = 'rgba(0, 255, 136, 0.2)';
                audioBtn.style.borderColor = '#00ff88';
                audioBtn.style.color = '#00ff88';
                audioBtn.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.3)';
            } else {
                audioBtn.style.background = 'rgba(0, 210, 255, 0.1)';
                audioBtn.style.borderColor = 'rgba(0, 210, 255, 0.4)';
                audioBtn.style.color = '#00d2ff';
                audioBtn.style.boxShadow = 'none';
            }
        };

        audioBtn.onclick = () => {
            this.recordAudio = !this.recordAudio;
            setAudioBtnState(this.recordAudio);
            if (this.debugContainer) {
                this.debugContainer.style.display = this.recordAudio ? 'flex' : 'none';
                if (this.recordAudio && this.debugBox) {
                    this.debugBox.textContent = '🎤 Audio Debug Log\n' + '='.repeat(30) + '\n';
                }
            }
        };

        titleContainer.appendChild(audioBtn);
        this.audioCheckbox = audioBtn;
        this.audioBtnSetState = setAudioBtnState;
        this.recordAudio = true;
        setAudioBtnState(true);
        // Show debug panel from the start when mic is on by default
        if (this.debugContainer) this.debugContainer.style.display = 'flex';

        ui.appendChild(titleContainer);
        this.titleEl = title;

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
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const btnRec = document.createElement('button');
        btnRec.innerHTML = REC_SVG.record;
        btnRec.title = "Aufnahme starten / stoppen";
        btnRec.style.cssText = btnStyle;
        btnRec.onclick = () => {
            if (this.mode === 'recording') this.stop();
            else this.startRecording();
        };
        
        const btnPlay = document.createElement('button');
        btnPlay.innerHTML = REC_SVG.play;
        btnPlay.title = "Abspielen / stoppen";
        btnPlay.style.cssText = btnStyle;
        btnPlay.onclick = () => {
            if (this.mode === 'playing') this.stop();
            else this.play();
        };
        
        const btnImport = document.createElement('button');
        btnImport.innerHTML = REC_SVG.load;
        btnImport.title = ".recording Datei laden";
        btnImport.style.cssText = btnStyle;
        btnImport.onclick = () => document.getElementById('cyber-recorder-file-input').click();
        
        const btnExport = document.createElement('button');
        btnExport.innerHTML = REC_SVG.save;
        btnExport.title = "Export als .recording Datei";
        btnExport.style.cssText = btnStyle;
        btnExport.onclick = () => this.exportScript();

        const btnAudioExport = document.createElement('button');
        btnAudioExport.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
        btnAudioExport.title = "Raw Audio herunterladen (.webm)";
        btnAudioExport.style.cssText = btnStyle;
        btnAudioExport.id = 'cyber-recorder-audio-export-btn';
        btnAudioExport.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("[AudioExport] Button clicked", { audioBlob: this.audioBlob?.size });
            this.exportAudioMp3();
        };
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'cyber-recorder-file-input';
        fileInput.accept = '.recording,.mls';
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => this.importScript(e);

        ui.appendChild(btnRec);
        ui.appendChild(btnPlay);
        ui.appendChild(btnExport);
        ui.appendChild(btnAudioExport);
        ui.appendChild(btnImport);
        ui.appendChild(fileInput);

        this.ui = ui;
        document.body.appendChild(ui);

        this.btnRec = btnRec;
        this.btnPlay = btnPlay;
        this.btnImport = btnImport;
        this.btnExport = btnExport;

        // Debug box: show when mic is on (default), hidden when mic off
        if (this.debugContainer) this.debugContainer.style.display = this.recordAudio ? 'flex' : 'none';

        // Match debug container width to recorder UI
        requestAnimationFrame(() => {
            if (this.ui && this.debugContainer) {
                const w = this.ui.getBoundingClientRect().width;
                if (w > 0) this.debugContainer.style.width = w + 'px';
            }
        });

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
        
        this.titleEl.innerHTML = '<span class="rec-dot"></span>RECORDING';
        this.titleEl.style.color = '#ff4444';

        this.btnRec.innerHTML = REC_SVG.stop;
        this.btnRec.style.background = "rgba(255, 0, 0, 0.3)";
        this.btnRec.style.color = "#ff4444";
        this.btnRec.style.borderColor = "#ff4444";

        this.btnPlay.style.opacity = "0.3";
        this.btnPlay.style.pointerEvents = "none";
        this.btnImport.style.opacity = "0.3";
        this.btnImport.style.pointerEvents = "none";
        this.btnExport.style.opacity = "0.3";
        this.btnExport.style.pointerEvents = "none";

        const startMouseRecording = () => {
            this.startTime = performance.now();
            this.lastMouseTime = 0;
            this.events = [];
            this.events.push({
                type: 'meta_init',
                t: 0,
                width: window.innerWidth,
                height: window.innerHeight
            });

            // Snapshot initial values of all form controls as t=0 change events,
            // so Replay restores them before playing the user's edits.
            let snapped = 0;
            document.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.closest('#cyber-recorder-ui')) return;
                const path = this.getCssPath(el);
                if (!path) return;
                const ev = { type: 'change', t: 0, targetPath: path };
                if (el.type === 'checkbox' || el.type === 'radio') {
                    ev.value = el.checked;
                } else {
                    ev.value = el.value;
                }
                this.events.push(ev);
                snapped++;
            });
            if (snapped > 0) this.addDebugLog(`📸 Snapshot: ${snapped} form controls @ t=0`);
            document.addEventListener('mousedown', this.boundHandleEvent, true);
            document.addEventListener('mousemove', this.boundHandleEvent, true);
            document.addEventListener('mouseup', this.boundHandleEvent, true);
            document.addEventListener('click', this.boundHandleEvent, true);
            document.addEventListener('input', this.boundHandleEvent, true);
            document.addEventListener('change', this.boundHandleEvent, true);
            this.addDebugLog('🎯 Listeners installed (mouse+input+change)');
            // Extra probes: parallel listeners on multiple levels to see where events stop
            this._probeBody = (e) => this.addDebugLog(`🔬 body ${e.type} <${e.target?.tagName}#${e.target?.id || '-'}>="${e.target?.value}"`);
            this._probeWin = (e) => this.addDebugLog(`🌐 win ${e.type} <${e.target?.tagName}#${e.target?.id || '-'}>="${e.target?.value}"`);
            this._probeFocus = (e) => this.addDebugLog(`👁 ${e.type} <${e.target?.tagName}#${e.target?.id || '-'}>`);
            document.body.addEventListener('input', this._probeBody, true);
            document.body.addEventListener('change', this._probeBody, true);
            window.addEventListener('input', this._probeWin, true);
            window.addEventListener('change', this._probeWin, true);
            window.addEventListener('keydown', this._probeFocus, true);
            window.addEventListener('focus', this._probeFocus, true);
            window.addEventListener('focusin', this._probeFocus, true);
            console.log("⏺ Mouse recording started...");
        };

        // Start audio recording if enabled — mouse recording starts after mic granted
        if (this.recordAudio) {
            this.addDebugLog("📡 Requesting microphone...");
            this.audioChunks = [];
            this.audioBlob = null;

            // Grey out mic button while waiting for permission
            if (this.audioCheckbox) {
                this.audioCheckbox.style.opacity = '0.4';
                this.audioCheckbox.style.pointerEvents = 'none';
                this.audioCheckbox.style.background = 'rgba(100,100,100,0.2)';
                this.audioCheckbox.style.borderColor = 'rgba(150,150,150,0.4)';
                this.audioCheckbox.style.color = '#888';
                this.audioCheckbox.style.boxShadow = 'none';
            }

            const audioConstraints = this.selectedDeviceId
                ? { deviceId: { exact: this.selectedDeviceId } }
                : true;
            navigator.mediaDevices.getUserMedia({ audio: audioConstraints })
                .then((stream) => {
                    startMouseRecording();
                    const track = stream.getAudioTracks()[0];
                    const settings = track.getSettings();
                    this.addDebugLog(`✅ Stream: ${track.label}`);
                    this.addDebugLog(`   device: ${settings.deviceId?.slice(0,8)}... ${settings.sampleRate}Hz`);
                    // Refresh mic list now that we have permission
                    if (this._refreshMicList) this._refreshMicList();

                    // Restore mic button to green (permission granted)
                    if (this.audioCheckbox && this.audioBtnSetState) {
                        this.audioCheckbox.style.opacity = '1';
                        this.audioCheckbox.style.pointerEvents = 'auto';
                        this.audioBtnSetState(true);
                    }
                    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                        ? 'audio/webm;codecs=opus' : 'audio/webm';
                    this.addDebugLog(`   codec: ${mimeType}`);
                    this.mediaRecorder = new MediaRecorder(stream, { mimeType });

                    this.mediaRecorder.onerror = (e) => {
                        this.addDebugLog(`❌ MediaRecorder error: ${e.error}`);
                    };

                    this.mediaRecorder.ondataavailable = (e) => {
                        this.addDebugLog(`📦 ondataavailable: ${e.data.size} bytes`);
                        if (e.data.size > 0) {
                            this.audioChunks.push(e.data);
                            const total = this.audioChunks.reduce((a,b) => a + b.size, 0);
                            this.addDebugLog(`  → Total: ${this.audioChunks.length} chunks, ${total} bytes`);
                        }
                    };

                    this.mediaRecorder.onstop = () => {
                        const totalSize = this.audioChunks.reduce((a,b) => a + b.size, 0);
                        this.addDebugLog(`⏹️ onstop fired. ${this.audioChunks.length} chunks, ${totalSize} bytes`);
                        if (totalSize > 0) {
                            this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                            this.addDebugLog(`✅ Blob created: ${this.audioBlob.size} bytes`);
                        } else {
                            this.addDebugLog(`⚠️ No audio data collected!`);
                        }
                        stream.getTracks().forEach(track => {
                            this.addDebugLog(`🛑 Stopping track: ${track.kind}`);
                            track.stop();
                        });
                    };

                    this.mediaRecorder.start();
                    this.addDebugLog("🎤 Recording started!");
                })
                .catch((err) => {
                    this.addDebugLog(`❌ Mic error: ${err.name}`);
                    this.addDebugLog(`   ${err.message}`);
                    this.recordAudio = false;
                    if (this.audioBtnSetState) this.audioBtnSetState(false);
                    if (this.audioCheckbox) {
                        this.audioCheckbox.style.opacity = '1';
                        this.audioCheckbox.style.pointerEvents = 'auto';
                    }
                    // Start mouse recording even without mic
                    startMouseRecording();
                    alert(`Mikrofonzugriff verweigert: ${err.message}`);
                });
        } else {
            // No audio — start mouse recording immediately
            startMouseRecording();
        }
    }

    stop() {
        if (this.mode === 'recording') {
            document.removeEventListener('mousedown', this.boundHandleEvent, true);
            document.removeEventListener('mousemove', this.boundHandleEvent, true);
            document.removeEventListener('mouseup', this.boundHandleEvent, true);
            document.removeEventListener('click', this.boundHandleEvent, true);
            document.removeEventListener('input', this.boundHandleEvent, true);
            document.removeEventListener('change', this.boundHandleEvent, true);
            if (this._probeBody) {
                document.body.removeEventListener('input', this._probeBody, true);
                document.body.removeEventListener('change', this._probeBody, true);
                window.removeEventListener('input', this._probeWin, true);
                window.removeEventListener('change', this._probeWin, true);
                window.removeEventListener('keydown', this._probeFocus, true);
                window.removeEventListener('focus', this._probeFocus, true);
                window.removeEventListener('focusin', this._probeFocus, true);
                this._probeBody = this._probeWin = this._probeFocus = null;
            }

            this.addDebugLog(`🔍 mediaRecorder: ${this.mediaRecorder ? 'exists' : 'null'}, state: ${this.mediaRecorder?.state}`);

            if (this.mediaRecorder) {
                if (this.mediaRecorder.state === 'recording') {
                    this.addDebugLog(`📥 Requesting final audio data...`);
                    this.mediaRecorder.requestData();
                    this.mediaRecorder.stop();
                    this.addDebugLog(`⏹️ MediaRecorder stopped.`);
                } else {
                    this.addDebugLog(`⚠️ MediaRecorder state: ${this.mediaRecorder.state}`);
                }
            } else {
                this.addDebugLog(`❌ mediaRecorder is null!`);
            }

            console.log(`⏹ Recording stopped. Recorded ${this.events.length} events.`);
        } else if (this.mode === 'playing') {
            this.playTimers.forEach(t => clearTimeout(t));
            this.playTimers = [];
            this.ghostCursor.style.display = 'none';
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement = null;
            }
            console.log("⏹ Playback aborted.");
        }
        
        if (this.abortHandler) {
            document.removeEventListener('keydown', this.abortHandler);
            this.abortHandler = null;
        }
        
        this.mode = 'idle';
        if (this.ui && !this.userPlayMode) this.ui.style.display = 'flex';
        // user-mode playback ended → keep UI hidden, reset flag for next admin use
        this.userPlayMode = false;

        this.titleEl.textContent = 'RECORDER';
        this.titleEl.style.color = 'rgba(0, 210, 255, 0.8)';

        this.btnRec.innerHTML = REC_SVG.record;
        this.btnRec.style.background = "rgba(0, 210, 255, 0.1)";
        this.btnRec.style.color = "#00d2ff";
        this.btnRec.style.borderColor = "rgba(0, 210, 255, 0.4)";
        this.btnRec.style.opacity = "1";
        this.btnRec.style.pointerEvents = "auto";

        this.btnPlay.innerHTML = REC_SVG.play;
        this.btnPlay.style.opacity = "1";
        this.btnPlay.style.pointerEvents = "auto";

        this.btnImport.style.opacity = "1";
        this.btnImport.style.pointerEvents = "auto";
        this.btnExport.style.opacity = "1";
        this.btnExport.style.pointerEvents = "auto";

        this._updatePlayBtn();
    }

    _updatePlayBtn() {
        const ready = this.events.length > 0;
        const svg = this.btnPlay.querySelector('svg');
        if (svg) svg.style.color = ready ? '#00ff88' : '#00d2ff';
        this.btnPlay.style.color = ready ? '#00ff88' : '#00d2ff';
        this.btnPlay.style.borderColor = 'rgba(0,210,255,0.4)';
        this.btnPlay.style.background = 'rgba(0,210,255,0.1)';
    }

    handleEvent(e) {
        if (this.mode !== 'recording') return;

        // Ignore events on the recorder UI itself
        if (e.target && e.target.closest && e.target.closest('#cyber-recorder-ui')) return;

        // Do not record mouse events while SHIFT is pressed
        if (e.shiftKey && (e.type.startsWith('mouse') || e.type === 'click')) {
            return;
        }

        // DEBUG: log input/change/click events to verify they reach the recorder
        if (e.type === 'input' || e.type === 'change') {
            this.addDebugLog(`📝 ${e.type} <${e.target?.tagName}#${e.target?.id || '-'}> = "${e.target?.value}"`);
        }
        if (e.type === 'click' || e.type === 'mousedown') {
            const cls = e.target?.className ? '.' + String(e.target.className).split(' ')[0] : '';
            this.addDebugLog(`🖱  ${e.type} <${e.target?.tagName}#${e.target?.id || '-'}${cls}> @${Math.round(e.clientX)},${Math.round(e.clientY)}`);
        }

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
        
        this.btnPlay.innerHTML = REC_SVG.stop;
        this.btnPlay.style.background = "rgba(0, 255, 0, 0.3)";
        
        this.btnRec.style.opacity = "0.3";
        this.btnRec.style.pointerEvents = "none";
        this.btnImport.style.opacity = "0.3";
        this.btnImport.style.pointerEvents = "none";
        this.btnExport.style.opacity = "0.3";
        this.btnExport.style.pointerEvents = "none";

        this.ghostCursor.style.display = 'block';
        this.ui.style.display = 'none';

        console.log("▶️ Playing script... (Press ESC to abort)");

        this.abortHandler = (e) => {
            if (e.key === 'Escape') this.stop();
        };
        document.addEventListener('keydown', this.abortHandler);

        // Start audio playback if available
        if (this.audioBlob && this.audioBlob.size > 0) {
            this.addDebugLog(`▶️ Playing ${this.audioBlob.size} bytes...`);
            const audioUrl = URL.createObjectURL(this.audioBlob);
            this.audioElement = new Audio(audioUrl);

            // Ensure audio is in DOM for some browsers
            this.audioElement.style.display = 'none';
            document.body.appendChild(this.audioElement);

            this.audioElement.onerror = (err) => {
                this.addDebugLog(`❌ Audio error: ${err.error?.message || err}`);
            };
            this.audioElement.onplay = () => {
                this.addDebugLog(`🔊 Audio playing!`);
            };
            this.audioElement.onended = () => {
                this.addDebugLog(`⏹️ Audio ended`);
            };
            this.audioElement.volume = 1.0;
            this.audioElement.autoplay = false;

            const playPromise = this.audioElement.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.addDebugLog(`✅ Play promise resolved`);
                    })
                    .catch((err) => {
                        this.addDebugLog(`❌ Play error: ${err.name}: ${err.message}`);
                    });
            }
        } else if (this.recordAudio) {
            this.addDebugLog(`⚠️ No audio blob found!`);
        }

        this.events.forEach((ev, index) => {
            const timer = setTimeout(() => {
                this.executeEvent(ev);

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
                        // Place caret at the end so the new value isn't visually selected.
                        if (typeof target.setSelectionRange === 'function') {
                            try {
                                const len = String(ev.value ?? '').length;
                                target.setSelectionRange(len, len);
                            } catch (_) {}
                        }
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

    async exportScript() {
        if (this.events.length === 0) {
            alert("Noch keine Events aufgezeichnet.");
            return;
        }

        try {
            const containerBuffer = await CyberContainerCodec.encodeWithAudio(this.events, this.audioBlob);
            const blob = new Blob([containerBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            const now = new Date();
            const yyyy = now.getFullYear();
            const mm  = String(now.getMonth() + 1).padStart(2, '0');
            const dd  = String(now.getDate()).padStart(2, '0');
            const hh  = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            const ss  = String(now.getSeconds()).padStart(2, '0');

            let labName = "lab";
            const filePart = window.location.pathname.split('/').pop();
            if (filePart) labName = filePart.replace('.html', '');

            const a = document.createElement('a');
            a.href = url;
            a.download = `${labName} ${yyyy}-${mm}-${dd} ${hh}-${min}-${ss}.recording`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const audioInfo = this.audioBlob ? ` + ${Math.round(this.audioBlob.size / 1024)}KB Audio` : '';
            this.addDebugLog(`✅ .recording gespeichert (${Math.round(containerBuffer.byteLength / 1024)}KB${audioInfo})`);
        } catch (e) {
            console.error("Export Error:", e);
            this.addDebugLog(`❌ Export Fehler: ${e.message}`);
            alert("Fehler: " + e.message);
        }
    }

    exportAudioMp3() {
        if (!this.audioBlob || this.audioBlob.size === 0) {
            alert("Kein Audio aufgezeichnet.");
            return;
        }

        const doExport = () => {
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm   = String(now.getMonth() + 1).padStart(2, '0');
            const dd   = String(now.getDate()).padStart(2, '0');
            const hh   = String(now.getHours()).padStart(2, '0');
            const min  = String(now.getMinutes()).padStart(2, '0');
            const ss   = String(now.getSeconds()).padStart(2, '0');

            let labName = "lab";
            const filePart = window.location.pathname.split('/').pop();
            if (filePart) labName = filePart.replace('.html', '');
            const baseName = `audio ${labName} ${yyyy}-${mm}-${dd} ${hh}-${min}-${ss}`;

            this.addDebugLog(`🎵 Konvertiere zu MP3...`);

            const audioCtx = new AudioContext();
            this.audioBlob.arrayBuffer().then(buf => {
                audioCtx.decodeAudioData(buf, (decoded) => {
                    const sampleRate = decoded.sampleRate;
                    const numChannels = decoded.numberOfChannels;
                    const length = decoded.length;
                    this.addDebugLog(`🎚 Decoded: ${numChannels}ch, ${sampleRate}Hz, ${length} samples`);

                    // Mix all channels to mono
                    const mono = new Float32Array(length);
                    for (let c = 0; c < numChannels; c++) {
                        const ch = decoded.getChannelData(c);
                        for (let i = 0; i < length; i++) mono[i] += ch[i];
                    }
                    if (numChannels > 1) {
                        for (let i = 0; i < length; i++) mono[i] /= numChannels;
                    }

                    const mp3enc = new lamejs.Mp3Encoder(1, sampleRate, 128);
                    const blockSize = 1152;
                    const mp3Data = [];

                    for (let i = 0; i < mono.length; i += blockSize) {
                        const chunk = mono.subarray(i, i + blockSize);
                        const int16 = new Int16Array(chunk.length);
                        for (let j = 0; j < chunk.length; j++) {
                            const s = Math.max(-1, Math.min(1, chunk[j]));
                            int16[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        }
                        const encoded = mp3enc.encodeBuffer(int16);
                        if (encoded.length > 0) mp3Data.push(new Int8Array(encoded));
                    }

                    const flushed = mp3enc.flush();
                    if (flushed.length > 0) mp3Data.push(new Int8Array(flushed));

                    const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
                    const url = URL.createObjectURL(mp3Blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${baseName}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    this.addDebugLog(`✅ MP3 gespeichert: ${Math.round(mp3Blob.size / 1024)}KB`);
                }, (err) => {
                    this.addDebugLog(`❌ Decode-Fehler: ${err.message}`);
                    alert("Audio-Dekodierung fehlgeschlagen: " + err.message);
                });
            });
        };

        if (window.lamejs) {
            doExport();
        } else {
            this.addDebugLog(`📦 Lade lamejs...`);
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js';
            s.onload = () => { this.addDebugLog(`✅ lamejs geladen`); doExport(); };
            s.onerror = () => { this.addDebugLog(`❌ lamejs konnte nicht geladen werden`); };
            document.head.appendChild(s);
        }
    }

    exportAudio() { this.exportAudioMp3(); }

    importScript(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const buffer = event.target.result;
                let events, audio;

                try {
                    const containerData = CyberContainerCodec.decodeContainer(buffer);
                    events = containerData.events;
                    audio = containerData.audio;
                } catch (containerErr) {
                    events = CyberBinaryCodec.decode(buffer);
                    audio = null;
                }

                this.events = events;
                if (audio) {
                    this.audioBlob = new Blob([audio], { type: 'audio/webm' });
                    console.log(`[CyberRecorder] Script geladen: ${this.events.length} Events + Audio (${Math.round(this.audioBlob.size / 1024)}KB).`);
                } else {
                    this.audioBlob = null;
                    console.log(`[CyberRecorder] Script erfolgreich geladen. ${this.events.length} Events gefunden.`);
                }

                this._updatePlayBtn();
            } catch (err) {
                console.error("Import Error:", err);
                alert("Fehler beim Laden der Datei! Bist du sicher, dass es ein gültiges Cyber-Skript ist?");
            }
        };
        reader.readAsArrayBuffer(file);
        
        // Reset input so the same file can be selected again
        e.target.value = '';
    }
}

// Global instance
const _rec = new CyberRecorderEngine();

_rec.show = function() {
    this.init();
    if (this.ui) this.ui.style.display = 'flex';
};

_rec.toggle = function() {
    if (!this.ui) { this.show(); return; }
    this.ui.style.display = this.ui.style.display === 'none' ? 'flex' : 'none';
};

window.CyberRecorder = _rec;
