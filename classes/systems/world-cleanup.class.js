/**
 * Handles world cleanup and resource disposal.
 */
export class WorldCleanup {
    /**
     * Creates a new instance.
     * @param {Object} world World instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Destroys the world and cleans up resources.
     */
    destroy() {
        this.pauseAndStopLoop();
        this.clearCanvas();
        this.stopAllSounds();
        this.world.removeAllVideos?.();
        this.world.cleanupControllers?.();
        this.world.cleanupSetups?.();
        this.world.cleanupWorldRefs?.();
    }

    /**
     * Pauses and stops the main loop.
     */
    pauseAndStopLoop() {
        const world = this.world;
        world.paused = true;
        if (world.frameId) {
            cancelAnimationFrame(world.frameId);
            world.frameId = null;
        }
    }

    /**
     * Clears the canvas.
     */
    clearCanvas() {
        const world = this.world;
        if (!world.ctx || !world.canvas) return;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    /**
     * Stops all active sounds.
     */
    stopAllSounds() {
        const manager = this.world.audioManager;
        if (!manager || !manager.audios) return;
        Object.values(manager.audios)
            .forEach(sound => this.stopSound(sound));
    }

    /**
     * Stops a sound and resets its playback position.
     * @param {HTMLMediaElement} sound Audio element to stop.
     */
    stopSound(sound) {
        if (!sound || sound.paused) return;
        try {
            sound.pause();
            sound.currentTime = 0;
        } catch (e) {
        }
    }
}