import { endCreditsEvents } from "../../events/end-credits/end-credits-events.js";

/**
 * Represents the end credits setup.
 */
export class EndCreditsSetup {
    /**
     * Creates an end credits setup instance.
     * @param {Object} world World object.
     */
    constructor(world) {
        this.world = world;
        this.allVideos = world.allVideos;
        this.endCreditsEvents = endCreditsEvents;
        this.video = document.getElementById('end-credits-video');
        this.sourceVideo = this.allVideos.end_credits_bg_video || null;
        if (this.video && this.sourceVideo?.dataset?.src) {
            this.video.src = this.sourceVideo.dataset.src;
            this.video.load();
        }
    }
}