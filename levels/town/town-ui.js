import { LifeEnergyCharacterBar } from '../../classes/ui/life-energy-character-bar.class.js';
import { LifeEnergyBossBar } from '../../classes/ui/life-energy-boss-bar.class.js';
import { CoinBar } from '../../classes/ui/coin-bar.class.js';
import { BottleBar } from '../../classes/ui/bottle-bar.class.js';
import { DialogManager } from '../../classes/ui/dialog-manager.class.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';
import { CutsceneIndicator } from '../../classes/ui/cutscene-indicator.class.js';
import { getControlById } from '../../config/controls-config.js';
import {
    createTownSpeechBubblesCharacter,
    createTownSpeechBubblesNayeliSpirit,
    createTownSpeechBubblesNayeliSpiritEcho,
    createTownSpeechBubblesSollita,
    createTownSpeechBubblesSollitaSpiritEcho,
    createTownSpeechBubblesTadeo,
    createTownSpeechBubblesTadeoAfraid,
    createTownSpeechBubblesTadeoPanic,
    createTownSpeechBubblesTadeoHelp,
    createTownSpeechBubblesTadeoEncourage,
    createTownSpeechBubblesTadeoSpiritEcho,
    createTownSpeechBubblesJuanito,
    createTownSpeechBubblesPollito,
    createTownSpeechBubblesLola,
    createTownSpeechBubblesSoul
} from './town-speech-bubbles.js';

/**
 * Creates the town UI.
 * @param {Object} setup Setup object.
 * @returns {Object} UI components.
 */
export function createTownUI(setup) {
    return {
        ...createTownBarsAndDialog(setup),
        ...createTownSpeechBubbles(setup),
        ...createTownHollowHints(setup),
        ...createCutsceneIndicator(setup)
    };
}

/**
 * Creates town UI bars and dialog manager.
 * @param {Object} setup Setup object.
 * @returns {Object} UI components.
 */
function createTownBarsAndDialog(setup) {
    return {
        statusBarCharacter: new LifeEnergyCharacterBar(setup.entityImages),
        statusBarEndboss: new LifeEnergyBossBar(setup.entityImages),
        coinBar: new CoinBar(setup.entityImages),
        bottleBar: new BottleBar(setup.entityImages),
        dialogManager: new DialogManager(setup.world, setup.world.keyboard),
    };
}

/**
 * Creates the town speech bubble collection.
 * @param {Object} setup Setup object.
 * @returns {Object} Town speech bubble collection.
 */
function createTownSpeechBubbles(setup) {
    return {
        ...createTownSpeechBubblesCharacterGroup(setup),
        ...createTownSpeechBubblesTadeoGroup(setup),
        ...createTownSpeechBubblesSpiritGroup(setup)
    };
}

/**
 * Creates the character speech bubble collection.
 * @param {Object} setup Setup object.
 * @returns {Object} Character speech bubble collection.
 */
function createTownSpeechBubblesCharacterGroup(setup) {
    return {
        speechBubblesCharacter: createTownSpeechBubblesCharacter(setup.world.character, setup.world.audioManager),
        speechBubblesNayeliSpirit: createTownSpeechBubblesNayeliSpirit(setup.environment.nayeliSpirit),
        speechBubblesNayeliSpiritEcho: createTownSpeechBubblesNayeliSpiritEcho(setup.environment.nayeliSpiritEcho),
        speechBubblesSollita: createTownSpeechBubblesSollita(setup.characters.sollita),
        speechBubblesSollitaSpiritEcho: createTownSpeechBubblesSollitaSpiritEcho(setup.environment.sollitaSpiritEcho)
    };
}

/**
 * Creates the Tadeo speech bubble collection.
 * @param {Object} setup Setup object.
 * @returns {Object} Tadeo speech bubble collection.
 */
function createTownSpeechBubblesTadeoGroup(setup) {
    return {
        speechBubblesTadeo: createTownSpeechBubblesTadeo(setup.characters.tadeo),
        speechBubblesTadeoAfraid: createTownSpeechBubblesTadeoAfraid(setup.characters.tadeo),
        speechBubblesTadeoPanic: createTownSpeechBubblesTadeoPanic(setup.characters.tadeo),
        speechBubblesTadeoHelp: createTownSpeechBubblesTadeoHelp(setup.characters.tadeo),
        speechBubblesTadeoEncourage: createTownSpeechBubblesTadeoEncourage(setup.characters.tadeo),
        speechBubblesTadeoSpiritEcho: createTownSpeechBubblesTadeoSpiritEcho(setup.environment.tadeoSpiritEcho)
    };
}

/**
 * Creates the spirit speech bubble collection.
 * @param {Object} setup Setup object.
 * @returns {Object} Spirit speech bubble collection.
 */
function createTownSpeechBubblesSpiritGroup(setup) {
    return {
        speechBubblesJuanito: createTownSpeechBubblesJuanito(setup.environment.juanitoSpirit),
        speechBubblesPollito: createTownSpeechBubblesPollito(setup.environment.pollitoSpirit),
        speechBubblesLola: createTownSpeechBubblesLola(setup.environment.lolaSpirit),
        speechBubblesSoul: createTownSpeechBubblesSoul(setup.characters.soul)
    };
}

/**
 * Creates town hollow hints.
 * @returns {Object} Hint configuration.
 */
function createTownHollowHints(setup) {
    return {
        hints: [
            new HollowHint("Betreten", setup.world.character, 100, 'desert', { control: getControlById('interact') }),
            new HollowHint("Folgen", setup.characters.tadeo, 100, 'desert'),
            new HollowHint("Checkpoint", setup.world.character, 100, 'desert')
        ]
    };
}

/**
 * Creates the cutscene indicator.
 * @param {Object} setup Setup data.
 * @returns {{cutsceneIndicator: *}} Cutscene indicator object.
 */
function createCutsceneIndicator(setup) {
    return {
        cutsceneIndicator: new CutsceneIndicator(setup.world)
    };
}