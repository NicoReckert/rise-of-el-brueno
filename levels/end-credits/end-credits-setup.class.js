import { endCreditsEvents } from "../../events/end-credits-events.js";

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
        this.video = this.allVideos.end_credits_bg_video || null;
    }
}