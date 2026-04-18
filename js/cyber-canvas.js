/**
 * CyberCanvas Engine v1.0.0
 * Modular coordinate system and grid rendering engine for Cyber-Labor.
 */
class CyberCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.dpr = window.devicePixelRatio || 1;
        this.view = {
            minX: -5,
            maxX: 5,
            minY: -5,
            maxY: 5
        };
        this.onResize = null;
    }

    /**
     * Initialize the canvas and view bounds.
     * @param {string} canvasId - The ID of the canvas element.
     * @param {object} viewConfig - Optional initial view bounds.
     */
    init(canvasId, viewConfig = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`CyberCanvas: Canvas with ID "${canvasId}" not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.view = { ...this.view, ...viewConfig };

        window.addEventListener('resize', () => this.resize());
        this.resize();
        
        console.log("⚛️ CyberCanvas Engine Initialized");
    }

    /**
     * Set the view bounds.
     * @param {object} view - Bounds {minX, maxX, minY, maxY}
     */
    setView(view) {
        this.view = { ...this.view, ...view };
    }

    /**
     * Handle canvas resizing and DPI scaling.
     */
    resize() {
        if (!this.canvas) return;

        // Use container size or window size
        const parent = this.canvas.parentElement;
        this.width = parent ? parent.clientWidth : window.innerWidth;
        this.height = parent ? parent.clientHeight : window.innerHeight;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        this.ctx.scale(this.dpr, this.dpr);

        if (this.onResize) this.onResize();
    }

    /**
     * Map math X coordinate to screen X coordinate.
     */
    mapX(x) {
        return (x - this.view.minX) / (this.view.maxX - this.view.minX) * this.width;
    }

    /**
     * Map math Y coordinate to screen Y coordinate.
     */
    mapY(y) {
        return this.height - (y - this.view.minY) / (this.view.maxY - this.view.minY) * this.height;
    }

    /**
     * Map screen X back to math X.
     */
    unmapX(px) {
        return this.view.minX + (px / this.width) * (this.view.maxX - this.view.minX);
    }

    /**
     * Map screen Y back to math Y.
     */
    unmapY(py) {
        return this.view.minY + ((this.height - py) / this.height) * (this.view.maxY - this.view.minY);
    }

    /**
     * Draw a standard cyber-grid.
     */
    drawGrid(options = {}) {
        const ctx = this.ctx;
        if (!ctx) return;

        const mainColor = options.mainColor || 'rgba(0, 210, 255, 0.4)';
        const gridColor = options.gridColor || 'rgba(255, 255, 255, 0.05)';

        // 1. Background Hint (Optional)
        if (options.vignette) {
            const grad = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.width / 1.2);
            grad.addColorStop(0, 'rgba(5, 11, 24, 0)');
            grad.addColorStop(1, 'rgba(0, 210, 255, 0.03)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        // 2. Adaptive Vertical Grid
        for (let x = Math.ceil(this.view.minX); x <= Math.floor(this.view.maxX); x++) {
            const px = this.mapX(x);
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, this.height);
            ctx.stroke();
        }

        // 3. Adaptive Horizontal Grid
        for (let y = Math.ceil(this.view.minY); y <= Math.floor(this.view.maxY); y++) {
            const py = this.mapY(y);
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(this.width, py);
            ctx.stroke();
        }

        // 4. Main Axes
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = options.glow ? 10 : 0;
        ctx.shadowColor = mainColor;

        const xAxis = this.mapY(0);
        ctx.beginPath();
        ctx.moveTo(0, xAxis);
        ctx.lineTo(this.width, xAxis);
        ctx.stroke();

        const yAxis = this.mapX(0);
        ctx.beginPath();
        ctx.moveTo(yAxis, 0);
        ctx.lineTo(yAxis, this.height);
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    /**
     * Utility to clear the canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

// Export as a singleton or just a global instance for ease of use in simple scripts
const CyberCanvasInstance = new CyberCanvas();
