import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { createNayelisHouseLevel } from './nayelis-house-level.js';
import { nayelisHouseEvents } from '../../events/nayelis-house-level-events.js';

export class NayelisHouseLevelSetup {
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
        this.nayelisHouseLevel = createNayelisHouseLevel();
        this.nayelisHouseEvents = nayelisHouseEvents;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.characters = {
            nayeli: new AnimatedEntity(this.entityImages, 'nayeli', 180, 180, 800, 485)
        };
        this.speechBubbles = {
            // bubbleStable1: new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.world.character, 'info'),
            // bubbleStable2: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech')
        };
        this.sounds = {
            notificationSound: this.allAudios.notificationSound,
            nayelisMusic: this.allAudios.nayelisMusic,
            nayelisSpeakSound: this.allAudios.nayelisSpeakSound
        };

        this.video = this.allVideos.nayelis_house_video || null;
    }
}