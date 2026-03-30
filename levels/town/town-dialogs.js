import { bubbleStep, pauseStep, callbackStep } from '../../utils/dialog-step-helpers.js';

/**
 * Registers all dialog groups for the town level.
 * @param {Object} setup Town level setup reference.
 * @returns {void}
 */
export function registerTownDialogs(setup) {
    registerCharacterDialogs(setup);
    registerNayeliDialogs(setup);
    registerTadeoDialogs(setup);
    registerCharacterEndSceneDialogs(setup);
}

/**
 * Registers dialog steps for the main character.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Registered dialog instance.
 */
function registerCharacterDialogs(setup) {
    return setup.dialogManager.addDialog([
        bubbleStep({ bubble: setup.speechBubblesCharacter[0], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[1], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[2], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[3], duration: 4500 })
    ]);
}

/**
 * Registers dialog steps for Nayeli.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Registered dialog instance.
 */
function registerNayeliDialogs(setup) {
    return setup.dialogManager.addDialog([
        bubbleStep({ bubble: setup.speechBubblesNayeli[0], duration: 1000, yOffset: -40 }),
        bubbleStep({ bubble: setup.speechBubblesNayeli[1], duration: 2000, yOffset: -40 }),
        bubbleStep({ bubble: setup.speechBubblesNayeli[2], duration: 1500, yOffset: -40 }),
        pauseStep(1000),
        callbackStep(() => { setup.sounds.voNayeliSpirit02.play(); }),
        bubbleStep({ bubble: setup.speechBubblesNayeli[3], duration: 1500, yOffset: -40 }),
        bubbleStep({ bubble: setup.speechBubblesNayeli[4], duration: 2500, yOffset: -40 })
    ]);
}

/**
 * Registers dialog steps for Tadeo.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Registered dialog instance.
 */
function registerTadeoDialogs(setup) {
    return setup.dialogManager.addDialog([
        bubbleStep({ bubble: setup.speechBubblesTadeo[0], duration: 1000, yOffset: -40 }),
        bubbleStep({ bubble: setup.speechBubblesTadeo[1], duration: 600, yOffset: -40 }),
        bubbleStep({ bubble: setup.speechBubblesTadeo[2], duration: 1500, yOffset: -40 })
    ]);
}

/**
 * Registers character end scene dialogs.
 * @param {Object} setup Setup object.
 * @returns {Object} Dialog reference.
 */
function registerCharacterEndSceneDialogs(setup) {
    return setup.dialogManager.addDialog([
        pauseStep(2000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[4], duration: 4500, yOffset: -65 }),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[5], duration: 4500, yOffset: -65 }),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[6], duration: 4500, yOffset: -65 }),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[7], duration: 4500, yOffset: -65 }),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[8], duration: 4500, yOffset: -65 }),
        pauseStep(2000)
    ]);
}