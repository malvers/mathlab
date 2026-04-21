/**
 * Cyber-Labor Resolution Guard v5.5.0
 * Safely warns the user when the screen is too small for logical operations.
 * Architecture: Isolated Overlay System (High Z-Index Coverage)
 */
const CyberGuard = {
    init(limit = 1024) {
        if (document.getElementById('cyber-guard-overlay')) return;
        
        this.injectStyles(limit);
        this.injectHTML();
        console.log(`⚛️ CyberGuard initialized (Trigger: <${limit}px)`);
    },

    injectStyles(limit) {
        const style = document.createElement('style');
        style.id = 'cyber-guard-styles';
        style.textContent = `
            /* NAMESPACED OVERLAY SYSTEM - ZERO GLOBAL INTERFERENCE */
            #cyber-guard-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(5, 11, 24, 0.98);
                backdrop-filter: blur(25px);
                z-index: 1000000;
                display: none;
                flex-direction: column;
                align-items: center;
                color: white;
                font-family: 'Orbitron', sans-serif;
                text-align: center;
                box-sizing: border-box;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .guard-inner {
                margin: auto;
                padding: 40px 20px 80px 20px; /* Strong bottom padding for smiley safety */
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: min-content;
                width: 100%;
                box-sizing: border-box;
                transform: translateY(-8vh); /* Shift entire content 10% higher */
            }

            @media (max-width: ${limit}px) {
                #cyber-guard-overlay {
                    display: flex !important;
                }
            }

            .guard-icon {
                font-size: clamp(3rem, 12vh, 5.5rem);
                color: #ffde00;
                margin-bottom: clamp(10px, 1.5vh, 20px);
                animation: guard-pulse 2s infinite;
                text-shadow: 0 0 30px rgba(255, 222, 0, 0.4);
            }

            .guard-title {
                font-size: clamp(1.1rem, 3.8vh, 1.8rem);
                letter-spacing: 4px;
                color: #ffde00;
                text-transform: uppercase;
                margin-bottom: clamp(5px, 1.5vh, 12px);
                text-shadow: 0 0 10px rgba(255, 222, 0, 0.2);
            }

            .guard-msg {
                font-size: clamp(0.8rem, 2.5vh, 1.15rem);
                color: rgba(255,255,255,0.9);
                max-width: 600px;
                line-height: 1.5;
            }

            @keyframes guard-pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }

            /* MOBILE RESPONSIVENESS */
            @media (max-width: 500px) {
                .guard-title { letter-spacing: 2px; }
                .guard-inner { padding: 30px 15px 60px 15px; }
                .guard-msg .guard-smiley { font-size: clamp(2rem, 8vh, 4rem) !important; margin-top: 15px !important; }
            }
        `;
        document.head.appendChild(style);
    },

    injectHTML() {
        const overlay = document.createElement('div');
        overlay.id = 'cyber-guard-overlay';
        overlay.innerHTML = `
            <div class="guard-inner">
                <div class="guard-icon">⚠️</div>
                <div class="guard-title">AUFLÖSUNG ZU GERING</div>
                <div class="guard-msg">
                    Ihr Bildschirm ist für die komplexen mathematischen Werkzeuge zu klein.<br><br>
                    Bitte nutzen Sie ein <b>Tablet</b> oder einen Bildschirm mit mindestens <b>1024 x 768</b> Auflösung.<br><br>
                    Wir bedauern diese Unannehmlichkeit!
                    <div class="guard-smiley" style="font-size: clamp(2rem, 8vh, 5rem); margin-top: 10px; color: #ffde00; opacity: 0.8; text-shadow: 0 0 20px rgba(255, 222, 0, 0.3);">☹️</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
};
