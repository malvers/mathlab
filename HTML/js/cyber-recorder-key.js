(function () {
    if (window.__cyberRecorderKeyInstalled) return;
    window.__cyberRecorderKeyInstalled = true;

    function getRecorderSrc() {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            const src = scripts[i].getAttribute('src');
            if (src && src.includes('cyber-recorder-key')) {
                return new URL(src, document.baseURI).href
                    .replace(/cyber-recorder-key\.js.*$/, 'cyber-recorder.js');
            }
        }
        return 'js/cyber-recorder.js';
    }

    function getLabName() {
        return window.location.pathname.split('/').pop().replace('.html', '');
    }

    function getRecordingsBase() {
        return new URL('.', document.baseURI).href + 'recordings/';
    }

    function loadRecorder(cb) {
        if (window.CyberRecorder) { cb(); return; }
        const s = document.createElement('script');
        // Cache-Buster: erzwingt frisches Laden bei jedem Aufruf
        s.src = getRecorderSrc() + '?v=' + Date.now();
        s.onload = cb;
        document.head.appendChild(s);
    }

    function xhrGet(url, type, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = type;
        xhr.onload = () => { if (xhr.status === 0 || xhr.status === 200) cb(xhr.response); else cb(null); };
        xhr.onerror = () => cb(null);
        xhr.send();
    }

    // Shift+R → admin recorder
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'R') {
            loadRecorder(() => CyberRecorder.show());
        }
    });

    // Click handler for the static play button in the mini-rail
    window.__cyberPlayRecording = function () {
        const labName = getLabName();
        const base = getRecordingsBase();
        xhrGet(base + 'index.json', 'json', index => {
            if (!index || !index[labName]) {
                alert('Kein Recording für dieses Lab gefunden.');
                return;
            }
            const recordingUrl = base + index[labName];
            loadRecorder(() => {
                CyberRecorder.init();
                xhrGet(recordingUrl, 'arraybuffer', buf => {
                    if (!buf) { alert('Recording konnte nicht geladen werden.'); return; }
                    const fakeEvt = { target: { files: [new File([buf], 'script.recording')], value: '' } };
                    CyberRecorder.importScript(fakeEvt);
                    setTimeout(() => CyberRecorder.play(), 200);
                });
            });
        });
    };
})();
