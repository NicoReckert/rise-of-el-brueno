import { TaskWindowRenderer } from "./task-window-renderer.class.js";

/**
 * Task window that displays and manages active tasks.
 */
export class TaskWindow {
    /**
     * Creates a new task banner instance.
     * @param {HTMLCanvasElement} canvas Rendering canvas.
     * @param {*} [entityImages=null] Optional entity images reference.
     * @param {Array} [tasks=[]] Initial tasks.
     * @param {number} [width=360] Banner width.
     * @param {number} [y=70] Vertical position.
     */
    constructor(canvas, entityImages = null, tasks = [], width = 360, y = 70) {
        this.renderer = new TaskWindowRenderer();
        this.initTaskCore(canvas, tasks, width, y);
        this.initTimingAndMotion();
        this.initVisualStyle();
        this.initBackground(entityImages);
        this.initSizeFromTasks();
    }

    /**
     * Initializes the core task window state.
     * @param {HTMLCanvasElement} canvas Rendering canvas.
     * @param {Array<string>} tasks Task texts.
     * @param {number} width Window width.
     * @param {number} y Vertical position.
     */
    initTaskCore(canvas, tasks, width, y) {
        this.canvas = canvas;
        this.tasks = tasks.map((text, i) => ({
            text,
            done: false,
            active: i === 0
        }));
        this.width = width;
        this.padding = 40;
        this.x = -this.width;
        this.targetX = 20;
        this.y = y;
        this.isOpen = false;
    }

    /**
     * Initializes timing and motion properties for the task window.
     */
    initTimingAndMotion() {
        this.lastUpdateTime = null;
        this.deltaTime = 1 / 60;
        this.speed = 15;
        this.canToggle = true;
    }

    /**
     * Initializes visual style settings for the task window.
     */
    initVisualStyle() {
        this.fontSize = 20;
        this.lineGap = 12;
        this.highlightActive = true;
        this.textOutline = true;
        this.activeAccentWidth = 4;
        this.activeAccentColor = "rgba(215,140,30,0.9)";
    }

    /**
     * Initializes the task window background.
     * @param {*} entityImages Optional entity images reference.
     */
    initBackground(entityImages) {
        this.bgImage = entityImages?.taskWindowBackground?.[0] ?? null;
        this.bgLoaded = !!this.bgImage;
        this.bgOverlayAlpha = 0.3;
    }

    /**
     * Calculates the window height based on the current tasks.
     */
    initSizeFromTasks() {
        const lineHeight = this.fontSize + this.lineGap;
        this.height = this.tasks.length * lineHeight + this.padding * 2;
    }

    /**
     * Toggles the open state of the task window.
     */
    toggle() {
        if (!this.canToggle) return;
        this.isOpen = !this.isOpen;
    }

    /**
     * Enables or disables toggling of the task window.
     * @param {boolean} enabled Toggle state.
     */
    setToggleEnabled(enabled) {
        this.canToggle = !!enabled;
    }

    /**
     * Sets the open state of the task window.
     * @param {boolean} open Desired open state.
     */
    setOpen(open) {
        if (!this.canToggle) return;
        this.isOpen = !!open;
    }

    /**
     * Marks a task as done.
     * @param {number} index Task index.
     */
    markDone(index) { if (this.tasks[index]) this.tasks[index].done = true; }

    /**
     * Sets the active task by index.
     * @param {number} index Task index.
     */
    setActive(index) { this.tasks.forEach((t, i) => (t.active = i === index)); }

    /**
     * Updates the task window position and timing.
     * @param {number} timestamp Frame timestamp.
     */
    update(timestamp) {
        this.updateDeltaTime(timestamp);
        const step = this.speed * this.deltaTime * 60;
        if (this.isOpen && this.x < this.targetX) {
            this.x += step;
            if (this.x > this.targetX) this.x = this.targetX;
        }
        else if (!this.isOpen && this.x > -this.width) {
            this.x -= step;
            if (this.x < -this.width) this.x = -this.width;
        }
    }

    /**
     * Updates the delta time based on the current timestamp.
     * @param {number} timestamp Frame timestamp.
     */
    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        this.deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
    }

    /**
     * Adds a new task to the task window.
     * @param {string} text Task text.
     * @param {{active?: boolean, done?: boolean}} [options]
     */
    addTask(text, { active = false, done = false } = {}) {
        const willBeActive = !!active;
        if (willBeActive) {
            this.tasks.forEach(t => (t.active = false));
        }
        this.tasks.push({ text, done, active: willBeActive });
    }

    /**
     * Draws the entity using its renderer.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    draw(ctx) {
        this.renderer.draw(this, ctx);
    }
}