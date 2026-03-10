import { LifeEnergyCharacterBar } from '../../classes/ui/life-energy-character-bar.class.js';
import { LifeEnergyBossBar } from '../../classes/ui/life-energy-boss-bar.class.js';
import { CoinBar } from '../../classes/ui/coin-bar.class.js';
import { BottleBar } from '../../classes/ui/bottle-bar.class.js';
import { DialogManager } from '../../classes/ui/dialog-manager.class.js';
import {
    createTownSpeechBubblesCharacter,
    createTownSpeechBubblesNayeli,
    createTownSpeechBubblesTadeo,
    createTownSpeechBubblesTadeoAfraid,
    createTownSpeechBubblesTadeoPanic,
    createTownSpeechBubblesTadeoHelp
} from './town-speech-bubbles.js';

/**
 * Creates town UI objects and dialog-related instances.
 * @param {Object} setup Town level setup.
 * @returns {Object} UI map.
 */
export function createTownUI(setup) {
    return {
        statusBar: new LifeEnergyCharacterBar(setup.entityImages),
        statusBar2: new LifeEnergyBossBar(setup.entityImages),
        coinBar: new CoinBar(setup.entityImages),
        bottleBar: new BottleBar(setup.entityImages),
        dialogManager: new DialogManager(setup.world, setup.world.keyboard),
        speechBubblesCharacter: createTownSpeechBubblesCharacter(setup.world.character, setup.world.audioManager),
        speechBubblesNayeli: createTownSpeechBubblesNayeli(setup.environment.nayeliSpirit),
        speechBubblesTadeo: createTownSpeechBubblesTadeo(setup.characters.tadeo),
        speechBubblesTadeoAfraid: createTownSpeechBubblesTadeoAfraid(setup.characters.tadeo),
        speechBubblesTadeoPanic: createTownSpeechBubblesTadeoPanic(setup.characters.tadeo),
        speechBubblesTadeoHelp: createTownSpeechBubblesTadeoHelp(setup.characters.tadeo)
    };
}