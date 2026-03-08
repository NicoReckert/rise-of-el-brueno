/**
 * Manages registered video elements and related playback handling.
 */
export class VideoManager {
    /**
     * Creates a new video manager instance.
     */
    constructor() {
        this.videos = {};
    }

    /**
     * Adds multiple videos to the manager.
     * @param {Object<string, HTMLVideoElement>} map Video map.
     * @returns {void}
     */
    addVideos(map) {
        Object.assign(this.videos, map);
    }

    /**
     * Returns a registered video by name.
     * @param {string} name Video identifier.
     * @returns {HTMLVideoElement|undefined} Video element.
     */
    get(name) {
        return this.videos[name];
    }

    /**
     * Plays a registered video with optional settings.
     * @param {string} name Video identifier.
     * @param {Object} [opts={}] Playback options.
     * @param {boolean} [opts.loop] Loop playback.
     * @param {boolean} [opts.muted] Mute playback.
     * @returns {void}
     */
    play(name, opts = {}) {
        const v = this.videos[name];
        if (!v) return;
        if (opts.loop !== undefined) v.loop = opts.loop;
        if (opts.muted !== undefined) v.muted = opts.muted;
        v.play().catch(() => { });
    }
}
