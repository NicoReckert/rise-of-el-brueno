import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { createNayelisHouseLevel } from './nayelis-house-level.js';
import { nayelisHouseEvents } from '../../events/nayelis-house-level-events.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';
import { SpeechBubble } from '../../classes/ui/speech-bubble.class.js';
import { DialogManager } from '../../classes/ui/dialog-manager.class.js';
import { bubbleStep } from '../../utils/dialog-step-helpers.js';
import { CutsceneIndicator } from '../../classes/ui/cutscene-indicator.class.js';

/**
 * Sets up Nayeli's house level.
 */
export class NayelisHouseLevelSetup {
    /**
     * Creates a new house level setup instance.
     * @param {Object} world World reference.
     */
    constructor(world) {
        this.world = world;
        this.initAll();
    }

    /**
     * Initializes all setup parts.
     * @returns {void}
     */
    initAll() {
        this.initAssets();
        this.initHouseData();
        this.initCharacters();
        this.initSpeechBubbles();
        this.initSounds();
        this.initVideo();
        this.initState();
        this.initHints();
        this.initDialogs();
    }

    /**
     * Initializes asset references.
     * @returns {void}
     */
    initAssets() {
        this.entityImages = this.world.entityImages;
        this.levelImages = this.world.levelImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
    }

    /**
     * Initializes house data.
     * @returns {void}
     */
    initHouseData() {
        this.nayelisHouseLevel = createNayelisHouseLevel({ levelImages: this.levelImages });
        this.nayelisHouseEvents = nayelisHouseEvents;
        this.popupTexts = [];
        this.cutsceneIndicator = new CutsceneIndicator(this.world);
    }

    /**
     * Initializes characters.
     * @returns {void}
     */
    initCharacters() {
        this.characters = this.createCharacters();
    }

    /**
     * Initializes speech bubbles.
     * @returns {void}
     */
    initSpeechBubbles() {
        this.speechBubblesCharacter = this.createSpeechBubblesCharacter(this.world.character);
        this.speechBubblesNayeli = this.createSpeechBubblesNayeli(this.characters.nayeli);
    }

    /**
     * Initializes sounds.
     * @returns {void}
     */
    initSounds() {
        this.sounds = this.createSounds();
    }

    /**
     * Initializes video reference.
     * @returns {void}
     */
    initVideo() {
        this.video = this.allVideos.nayelis_house_bg_video || null;
    }

    /**
     * Initializes state.
     * @returns {void}
     */
    initState() {
        this.comeFromNewWeapon = false;
    }

    /**
     * Initializes hints.
     * @returns {void}
     */
    initHints() {
        this.hints = this.createHints();
    }

    /**
     * Initializes dialogs.
     * @returns {void}
     */
    initDialogs() {
        this.dialogManager = new DialogManager(this.world, this.world.keyboard);
        this.registerCharacterDialogs();
        this.registerNayeliDialogs();
    }

    /**
     * Creates the house level character instances.
     * @returns {Object} Character map.
     */
    createCharacters() {
        return {
            nayeli: new AnimatedEntity(this.entityImages, 'nayeli', 180, 180, 800, 485)
        };
    }

    /**
     * Creates the house level sound references.
     * @returns {Object} Sound map.
     */
    createSounds() {
        return {
            nayeliThemeMusic: this.allAudios.nayeliThemeMusic,
            voNayeliSpeak01: this.allAudios.voNayeliSpeak01,
            voNayeliSpeak02: this.allAudios.voNayeliSpeak02
        };
    }

    /**
     * Creates hint instances.
     * @returns {Array<Object>} Hint instances.
     */
    createHints() {
        return [
            new HollowHint("Verlassen", this.world.character, 100, 'desert')
        ];
    }

    /**
     * Creates speech bubbles for the character.
     * @param {*} character Character instance.
     * @returns {Array} Speech bubble instances.
     */
    createSpeechBubblesCharacter(character) {
        return [
            new SpeechBubble("Ich werde euch nicht enttäuschen.", character, 'speech', { audioManager: this.world.audioManager }),
            new SpeechBubble("Ich werde stark genug sein,", character, 'speech', { audioManager: this.world.audioManager }),
            new SpeechBubble("um die zu beschützen, die ich liebe.", character, 'speech', { audioManager: this.world.audioManager })
        ];
    }

    /**
     * Creates speech bubbles for Nayeli.
     * @param {*} nayeli Nayeli instance.
     * @returns {Array} Speech bubble instances.
     */
    createSpeechBubblesNayeli(nayeli) {
        return [
            ...this.speechBubblesNayeliPart01(nayeli),
            ...this.speechBubblesNayeliPart02(nayeli)
        ];
    }

    /**
     * Creates the first part of speech bubbles for Nayeli.
     * @param {*} nayeli Nayeli instance.
     * @returns {Array} Speech bubble instances.
     */
    speechBubblesNayeliPart01(nayeli) {
        return [
            new SpeechBubble("Willkommen, Brünö.", nayeli, 'speech'),
            new SpeechBubble("Ich habe dich erwartet.", nayeli, 'speech'),
            new SpeechBubble("Der Sturm hat deine Kraft geprüft,", nayeli, 'speech'),
            new SpeechBubble("doch dein Herz blieb ungebrochen.", nayeli, 'speech'),
            new SpeechBubble("Vor dir liegt das Schwert unserer Ahnen.", nayeli, 'speech'),
            new SpeechBubble("Mehr als Stahl…", nayeli, 'speech'),
            new SpeechBubble("...mehr als eine Klinge.", nayeli, 'speech'),
            new SpeechBubble("In ihm ruhen Mut, Weisheit...", nayeli, 'speech'),
            new SpeechBubble("...und die Hoffnung unserer Vorfahren.", nayeli, 'speech'),
            new SpeechBubble("Nimm es an, Brünö.", nayeli, 'speech')
        ];
    }

    /**
     * Creates the second part of speech bubbles for Nayeli.
     * @param {*} nayeli Nayeli instance.
     * @returns {Array} Speech bubble instances.
     */
    speechBubblesNayeliPart02(nayeli) {
        return [
            new SpeechBubble("Dann tritt hinaus, Brünö.", nayeli, 'speech'),
            new SpeechBubble("Du trägst nun mehr als ein Schwert.", nayeli, 'speech'),
            new SpeechBubble("Du trägst das Licht unserer Ahnen.", nayeli, 'speech')
        ];
    }

    /**
     * Registers character dialogs.
     * @returns {*} Registered dialog.
     */
    registerCharacterDialogs() {
        return this.dialogManager.addDialog('character:01', [
            bubbleStep({ bubble: this.speechBubblesCharacter[0], duration: 3000 }),
            bubbleStep({ bubble: this.speechBubblesCharacter[1], duration: 2500 }),
            bubbleStep({ bubble: this.speechBubblesCharacter[2], duration: 3000 })
        ]);
    }

    /**
     * Registers Nayeli dialogs.
     * @returns {{part01: *, part02: *}} Registered dialog parts.
     */
    registerNayeliDialogs() {
        const part01 = this.dialogManager.addDialog('nayeli:01', this.nayeliDialogsPart01());
        const part02 = this.dialogManager.addDialog('nayeli:02', this.nayeliDialogsPart02());
        return { part01, part02 };
    }

    /**
     * Creates the first part of Nayeli dialog steps.
     * @returns {Array} Dialog steps.
     */
    nayeliDialogsPart01() {
        return [
            bubbleStep({ bubble: this.speechBubblesNayeli[0], duration: 2000, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[1], duration: 2000, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[2], duration: 2000, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[3], duration: 3000, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[4], duration: 2500, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[5], duration: 1800, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[6], duration: 1800, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[7], duration: 2500, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[8], duration: 3200, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[9], duration: 3000, yOffset: 20 })
        ];
    }

    /**
     * Creates the second part of Nayeli dialog steps.
     * @returns {Array} Dialog steps.
     */
    nayeliDialogsPart02() {
        return [
            bubbleStep({ bubble: this.speechBubblesNayeli[10], duration: 2500, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[11], duration: 3000, yOffset: 20 }),
            bubbleStep({ bubble: this.speechBubblesNayeli[12], duration: 4000, yOffset: 20 })
        ];
    }
}