/**
 * CyberCanvas Engine v2.2.0 (Multitouch Focal Zoom Edition)
 * Decoupled Input & Rendering with Pinch-to-Zoom.
 * Built for zero-latency interactive laboratories.
 */
class CyberCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.dpr = window.devicePixelRatio || 1;
        this.view = { minX: -5, maxX: 5, minY: -5, maxY: 5 };
        
        // Callbacks
        this.onResize = null;
        this.onMouseDown = null;
        this.onMouseMove = null;
        this.onMouseUp = null;
        this.onContextMenu = null;
        
        // State
        this.isInitialized = false;
        this.showAxes = true;
        this.showLabels = true;
        this.showGrid = true;
        this.showTelemetry = true;
        
        this.isDragging = false;
        this.needsRedraw = true;
        
        // --- INPUT STATE (RAW) ---
        this.currentMousePos = { x: 0, y: 0, clientX: 0, clientY: 0 };
        this.lastDragPos = { clientX: 0, clientY: 0 };
        this.hasNewInput = false;

        // --- ZOOM & TOUCH STATE ---
        this.zoomIntent = { factor: 1, focalX: 0, focalY: 0 };
        this.touchPoints = [];
        this.lastPinchDist = 0;

        // --- MATH STATE ---
        this.mathX = 0;
        this.mathY = 0;

        // Telemetry Cache
        this.telePane = null;
        this.teleX = null;
        this.teleY = null;

        // Visibility Flags
        this.showAxes = true;
        this.showLabels = false; // Disabled by default for global stability

        // Listener Tracking
        this.activeListeners = [];
    }

    init(canvasId, viewConfig = {}, options = {}) {
        this.cleanup();

        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return console.error(`CyberCanvas: "${canvasId}" not found.`);
        this.ctx = this.canvas.getContext('2d');

        this.view = { ...this.view, ...viewConfig };
        this.showTelemetry = options.showTelemetry !== false;
        
        // ZOOM LIMITS (v2.3)
        this.limits = {
            minRangeY: options.minRangeY || 0.001,
            maxRangeY: options.maxRangeY || Infinity
        };
        this.allowPan = options.allowPan !== false;
        this.allowZoom = options.allowZoom !== false;
        
        // Allow initial visibility overrides via options
        if (options.showAxes !== undefined) this.showAxes = options.showAxes;
        if (options.showLabels !== undefined) this.showLabels = options.showLabels;
        if (options.showGrid !== undefined) this.showGrid = options.showGrid;

        // Prevent default browser zoom on iPad
        this.canvas.style.touchAction = 'none';

        // Listeners
        this.addListener(window, 'resize', () => this.resize());
        this.addListener(this.canvas, 'mousedown', (e) => this.handleMouseDown(e));
        this.addListener(window, 'mousemove', (e) => this.handleMouseMove(e), { passive: true });
        this.addListener(window, 'mouseup', (e) => this.handleMouseUp(e));
        this.addListener(this.canvas, 'wheel', (e) => this.handleWheel(e), { passive: false });
        
        // Touch Support (iPad)
        this.addListener(this.canvas, 'touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.addListener(this.canvas, 'touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.addListener(this.canvas, 'touchend', (e) => this.handleTouchEnd(e));

        this.addListener(this.canvas, 'mouseenter', () => this.setTeleOpacity(1));
        this.addListener(this.canvas, 'mouseleave', () => this.setTeleOpacity(0.3));

        // Right-Click Context Menu
        this.addListener(this.canvas, 'contextmenu', (e) => {
            e.preventDefault();
            if (this.onContextMenu) this.onContextMenu(e);
        });

        this.resize();
        if (this.showTelemetry) this.injectTelemetryPane();
        
        this.isInitialized = true;
        this.startLoop();

        console.log("⚛️ CyberCanvas Engine v2.2 (ZOOM) Initialized");
    }

    addListener(target, type, fn, options = {}) {
        target.addEventListener(type, fn, options);
        this.activeListeners.push({ target, type, fn, options });
    }

    cleanup() {
        this.activeListeners.forEach(l => l.target.removeEventListener(l.type, l.fn, l.options));
        this.activeListeners = [];
        if (this.telePane) { this.telePane.remove(); this.telePane = null; }
        this.isInitialized = false;
    }

    startLoop() {
        const frame = () => {
            if (!this.isInitialized) return;

            // 1. Process Input Math (Panning & Zoom)
            if (this.hasNewInput || this.zoomIntent.factor !== 1) {
                this.processInputMath();
                this.hasNewInput = false;
            }

            // 2. Render
            if (this.needsRedraw || this.isDragging) {
                if (this.onResize) this.onResize();
                this.needsRedraw = false;
            }

            this.updateTelemetryDOM();
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    processInputMath() {
        // --- ZOOM MATH (Uniform Focal Point) ---
        if (this.zoomIntent.factor !== 1) {
            const factor = this.zoomIntent.factor;
            const fx = this.zoomIntent.focalX;
            const fy = this.zoomIntent.focalY;

            const mx = this.unmapX(fx);
            const my = this.unmapY(fy);

            // Rescale range uniformly to maintain 1:1 parity
            let newRangeY = (this.view.maxY - this.view.minY) * factor;
            
            // Apply Constraints
            newRangeY = Math.max(this.limits.minRangeY, Math.min(this.limits.maxRangeY, newRangeY));
            
            const aspect = this.width / this.height;
            const newRangeX = newRangeY * aspect;

            this.view.minX = mx - (fx / this.width) * newRangeX;
            this.view.maxX = this.view.minX + newRangeX;
            this.view.minY = my - ((this.height - fy) / this.height) * newRangeY;
            this.view.maxY = this.view.minY + newRangeY;

            this.zoomIntent.factor = 1;
            this.needsRedraw = true;
        }

        // --- PANNING MATH ---
        const mx = this.currentMousePos.x;
        const my = this.currentMousePos.y;
        this.mathX = this.unmapX(mx);
        this.mathY = this.unmapY(my);

        if (this.isDragging) {
            const dx = this.currentMousePos.clientX - this.lastDragPos.clientX;
            const dy = this.currentMousePos.clientY - this.lastDragPos.clientY;
            
            const rangeX = this.view.maxX - this.view.minX;
            const rangeY = this.view.maxY - this.view.minY;

            const moveX = (dx / this.width) * rangeX;
            const moveY = (dy / this.height) * rangeY;

            this.view.minX -= moveX;
            this.view.maxX -= moveX;
            this.view.minY += moveY;
            this.view.maxY += moveY;

            this.lastDragPos.clientX = this.currentMousePos.clientX;
            this.lastDragPos.clientY = this.currentMousePos.clientY;
        }
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.width = parent ? parent.clientWidth : window.innerWidth;
        this.height = parent ? parent.clientHeight : window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        
        // ASPRECT RATIO SYNC: Maintain 1:1 units
        const currentYRange = this.view.maxY - this.view.minY;
        const aspect = this.width / this.height;
        const targetXRange = currentYRange * aspect;
        
        // Center the new X range around the current center
        const centerX = (this.view.minX + this.view.maxX) / 2;
        this.view.minX = centerX - targetXRange / 2;
        this.view.maxX = centerX + targetXRange / 2;

        this.ctx.resetTransform();
        this.ctx.scale(this.dpr, this.dpr);
        this.needsRedraw = true;
    }

    resetView(minY = -10, maxY = 10) {
        this.view.minY = minY;
        this.view.maxY = maxY;
        this.view.minX = -1; // Temporary, resize() will fix it
        this.view.maxX = 1;
        
        // Ensure we center at X=0
        const currentYRange = this.view.maxY - this.view.minY;
        const aspect = this.width / this.height;
        const targetXRange = currentYRange * aspect;
        
        this.view.minX = -targetXRange / 2;
        this.view.maxX = targetXRange / 2;
        
        this.needsRedraw = true;
    }

    // --- EVENT HANDLERS ---

    handleMouseDown(e) {
        if (this.onMouseDown) {
            const rect = this.canvas.getBoundingClientRect();
            const pos = {
                x: this.unmapX(e.clientX - rect.left),
                y: this.unmapY(e.clientY - rect.top)
            };
            this.onMouseDown(pos);
        }

        if (!this.allowPan) return;
        this.isDragging = true;
        this.lastDragPos.clientX = e.clientX;
        this.lastDragPos.clientY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.currentMousePos.x = e.clientX - rect.left;
        this.currentMousePos.y = e.clientY - rect.top;
        this.currentMousePos.clientX = e.clientX;
        this.currentMousePos.clientY = e.clientY;
        this.hasNewInput = true;

        if (this.onMouseMove) {
            const pos = {
                x: this.unmapX(this.currentMousePos.x),
                y: this.unmapY(this.currentMousePos.y)
            };
            this.onMouseMove(pos);
        }
    }

    handleMouseUp() {
        if (this.onMouseUp) this.onMouseUp();
        
        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = 'crosshair';
            this.needsRedraw = true;
        }
    }

    handleWheel(e) {
        if (!this.allowZoom) return;
        e.preventDefault(); // Prevent page scroll
        const rect = this.canvas.getBoundingClientRect();
        const factor = e.deltaY > 0 ? 1.1 : 0.9;
        this.zoomIntent.factor = factor;
        this.zoomIntent.focalX = e.clientX - rect.left;
        this.zoomIntent.focalY = e.clientY - rect.top;
    }

    // --- TOUCH HANDLERS (IPAD) ---

    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touchPos = {
            x: this.unmapX(e.touches[0].clientX - rect.left),
            y: this.unmapY(e.touches[0].clientY - rect.top)
        };

        if (this.onMouseDown) this.onMouseDown(touchPos);

        if (e.touches.length === 1 && this.allowPan) {
            this.isDragging = true;
            this.lastDragPos.clientX = e.touches[0].clientX;
            this.lastDragPos.clientY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            this.isDragging = false; // Stop panning, start pinching
            this.lastPinchDist = this.getTouchDist(e.touches);
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        
        if (this.onMouseMove) {
            const touchPos = {
                x: this.unmapX(e.touches[0].clientX - rect.left),
                y: this.unmapY(e.touches[0].clientY - rect.top)
            };
            this.onMouseMove(touchPos);
        }

        if (e.touches.length === 1 && this.isDragging) {
            const touch = e.touches[0];
            this.currentMousePos.x = touch.clientX - rect.left;
            this.currentMousePos.y = touch.clientY - rect.top;
            this.currentMousePos.clientX = touch.clientX;
            this.currentMousePos.clientY = touch.clientY;
            this.hasNewInput = true;
        } else if (e.touches.length === 2) {
            const dist = this.getTouchDist(e.touches);
            const factor = this.lastPinchDist / dist;
            
            // Focal point is midpoint of touches
            const focalX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            const focalY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

            this.zoomIntent.factor = factor;
            this.zoomIntent.focalX = focalX;
            this.zoomIntent.focalY = focalY;
            this.lastPinchDist = dist;
        }
    }

    handleTouchEnd(e) {
        this.handleMouseUp();
        if (e.touches.length < 2) this.lastPinchDist = 0;
    }

    getTouchDist(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // --- MAPPING ---
    mapX(x) { return (x - this.view.minX) / (this.view.maxX - this.view.minX) * this.width; }
    mapY(y) { return this.height - (y - this.view.minY) / (this.view.maxY - this.view.minY) * this.height; }
    unmapX(px) { return this.view.minX + (px / this.width) * (this.view.maxX - this.view.minX); }
    unmapY(py) { return this.view.minY + ((this.height - py) / this.height) * (this.view.maxY - this.view.minY); }

    drawGrid(options = {}) {
        const ctx = this.ctx;
        this.clear();
        const mainColor = options.mainColor || 'rgba(0, 210, 255, 0.5)';
        const gridColor = options.gridColor || 'rgba(255, 255, 255, 0.1)';
        const textColor = 'rgba(255, 255, 255, 0.4)';

        if (options.vignette) {
            const grad = ctx.createRadialGradient(this.width/2, this.height/2, 0, this.width/2, this.height/2, this.width/1.2);
            grad.addColorStop(0, 'rgba(5, 11, 24, 0)');
            grad.addColorStop(1, 'rgba(0, 210, 255, 0.03)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // --- GRID LINES & LABELS ---
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.font = '12px Orbitron, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';

        const step = this.getStepSize();

        // Vertical lines & X labels
        for (let x = Math.floor(this.view.minX / step) * step; x <= this.view.maxX; x += step) {
            const px = this.mapX(x);
            if (this.showGrid) {
                ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, this.height); ctx.stroke();
            }

            if (this.showLabels && Math.abs(x) > 0.001) {
                const py = this.mapY(0);
                const labelY = Math.min(Math.max(py + 15, 20), this.height - 10);
                ctx.fillText(x.toFixed(x % 1 === 0 ? 0 : 1), px, labelY);
            }
        }

        // Horizontal lines & Y labels
        ctx.textAlign = 'right';
        for (let y = Math.floor(this.view.minY / step) * step; y <= this.view.maxY; y += step) {
            const py = this.mapY(y);
            if (this.showGrid) {
                ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(this.width, py); ctx.stroke();
            }

            if (this.showLabels && Math.abs(y) > 0.001) {
                const px = this.mapX(0);
                const labelX = Math.min(Math.max(px - 10, 40), this.width - 10);
                ctx.fillText(y.toFixed(y % 1 === 0 ? 0 : 1), labelX, py + 4);
            }
        }

        // --- MAIN AXES ---
        if (this.showAxes) {
            ctx.strokeStyle = mainColor;
            ctx.lineWidth = 2;
            ctx.shadowBlur = options.glow ? 10 : 0;
            ctx.shadowColor = mainColor;
            
            const xA = this.mapY(0);
            ctx.beginPath(); ctx.moveTo(0, xA); ctx.lineTo(this.width, xA); ctx.stroke();
            
            const yA = this.mapX(0);
            ctx.beginPath(); ctx.moveTo(yA, 0); ctx.lineTo(yA, this.height); ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    getStepSize() {
        const range = this.view.maxX - this.view.minX;
        if (range < 8) return 0.5;
        if (range < 25) return 1;
        if (range < 60) return 2;
        if (range < 120) return 5;
        return 10;
    }

    clear() { this.ctx.clearRect(0, 0, this.width, this.height); }

    injectTelemetryPane() {
        const parent = this.canvas.parentElement;
        if (!parent) return;
        this.telePane = document.createElement('div');
        this.telePane.className = 'cyber-telemetry-pane';
        this.telePane.innerHTML = `
            <div class="telemetry-card">
                <div class="telemetry-row"><span class="label">X_COORD</span><span class="value" id="tele-x">0.00</span></div>
                <div class="telemetry-row"><span class="label">Y_COORD</span><span class="value" id="tele-y">0.00</span></div>
            </div>`;
        parent.appendChild(this.telePane);
        this.teleX = document.getElementById('tele-x');
        this.teleY = document.getElementById('tele-y');
    }

    updateTelemetryDOM() {
        if (!this.telePane) return;
        this.telePane.style.display = this.showTelemetry ? 'block' : 'none';
        if (!this.showTelemetry || !this.teleX) return;
        this.teleX.innerText = this.mathX.toFixed(2);
        this.teleY.innerText = this.mathY.toFixed(2);
    }

    setTeleOpacity(val) {
        if (this.telePane) this.telePane.style.opacity = val;
    }
}

const CyberCanvasInstance = new CyberCanvas();
