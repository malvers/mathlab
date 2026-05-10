(function () {
    if (window.__cyberRecorderKeyInstalled) return;
    window.__cyberRecorderKeyInstalled = true;

    console.log('[cyber-recorder-key] script loaded');

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
        s.src = getRecorderSrc();
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

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'R') {
            loadRecorder(() => CyberRecorder.show());
        }
    });

    const labName = getLabName();
    const base = getRecordingsBase();

    function addPlayBtn() {
        const miniRail = document.getElementById('mini-rail');
        if (!miniRail) {
            console.log('[cyber-recorder-key] mini-rail not found');
            return false;
        }
        if (miniRail.querySelector('#cyber-play-btn')) {
            console.log('[cyber-recorder-key] play btn already there');
            return true;
        }

        const btn = document.createElement('button');
        btn.id = 'cyber-play-btn';
        btn.className = 'nav-btn';
        btn.title = 'Erklärung abspielen';
        btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>`;
        btn.style.color = '#00ff88';

        btn.onclick = () => {
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

        const hamburger = miniRail.firstElementChild;
        miniRail.insertBefore(btn, hamburger ? hamburger.nextSibling : miniRail.firstChild);
        console.log('[cyber-recorder-key] play btn inserted, mini-rail children:', miniRail.children.length);
        return true;
    }

    // Try multiple times: now, on DOMContentLoaded, on load, and after a short delay
    function tryInsert() {
        if (addPlayBtn()) return;
    }

    tryInsert();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInsert);
    }
    window.addEventListener('load', () => {
        tryInsert();
        // re-check after consistency hooks may have run
        setTimeout(tryInsert, 100);
        setTimeout(tryInsert, 500);
        setTimeout(tryInsert, 1500);
    });
})();
