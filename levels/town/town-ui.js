import { LifeEnergyCharacterBar } from '../../classes/ui/life-energy-character-bar.class.js';
import { LifeEnergyBossBar } from '../../classes/ui/life-energy-boss-bar.class.js';
import { CoinBar } from '../../classes/ui/coin-bar.class.js';
import { BottleBar } from '../../classes/ui/bottle-bar.class.js';
import { DialogManager } from '../../classes/ui/dialog-manager.class.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';
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
        ...createTownHollowHints(setup)
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
    }
}

/**
 * Creates town speech bubbles and related UI components.
 * @param {Object} setup Setup object.
 * @returns {Object} UI components.
 */
function createTownSpeechBubbles(setup) {
    return {
        speechBubblesCharacter: createTownSpeechBubblesCharacter(setup.world.character, setup.world.audioManager),
        speechBubblesNayeliSpirit: createTownSpeechBubblesNayeliSpirit(setup.environment.nayeliSpirit),
        speechBubblesNayeliSpiritEcho: createTownSpeechBubblesNayeliSpiritEcho(setup.environment.nayeliSpiritEcho),
        speechBubblesSollita: createTownSpeechBubblesSollita(setup.characters.sollita),
        speechBubblesSollitaSpiritEcho: createTownSpeechBubblesSollitaSpiritEcho(setup.environment.sollitaSpiritEcho),
        speechBubblesTadeo: createTownSpeechBubblesTadeo(setup.characters.tadeo),
        speechBubblesTadeoAfraid: createTownSpeechBubblesTadeoAfraid(setup.characters.tadeo),
        speechBubblesTadeoPanic: createTownSpeechBubblesTadeoPanic(setup.characters.tadeo),
        speechBubblesTadeoHelp: createTownSpeechBubblesTadeoHelp(setup.characters.tadeo),
        speechBubblesTadeoSpiritEcho: createTownSpeechBubblesTadeoSpiritEcho(setup.environment.tadeoSpiritEcho), 
        speechBubblesJuanito: createTownSpeechBubblesJuanito(setup.environment.juanitoSpirit),
        speechBubblesPollito: createTownSpeechBubblesPollito(setup.environment.pollitoSpirit),
        speechBubblesLola: createTownSpeechBubblesLola(setup.environment.lolaSpirit),
        speechBubblesSoul: createTownSpeechBubblesSoul(setup.characters.soul)
    }
}

/**
 * Creates town hollow hints.
 * @returns {Object} Hint configuration.
 */
function createTownHollowHints(setup) {
    return {
        hints: [
            new HollowHint("Betreten", setup.world.character, 100, 'desert')
        ]
    }
}