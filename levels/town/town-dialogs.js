import { bubbleStep, pauseStep, callbackStep } from '../../utils/dialog-step-helpers.js';

/**
 * Registers all dialog groups for the town level.
 * @param {Object} setup Town level setup reference.
 * @returns {void}
 */
export function registerTownDialogs(setup) {
    registerCharacterDialogs(setup);
    registerNayeliSpiritDialogs(setup);
    registerNayeliSpiritEchoDialogs(setup);
    registerSollitaSpiritEchoDialogs(setup);
    registerTadeoDialogs(setup);
    registerTadeoSpiritEchoDialogs(setup);
    registerCharacterEndSceneDialogs(setup);
    registerSollitaEndSceneDialogs(setup);
}

/**
 * Registers dialog steps for the main character.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Registered dialog instance.
 */
function registerCharacterDialogs(setup) {
    return setup.dialogManager.addDialog('character:01', [
        bubbleStep({ bubble: setup.speechBubblesCharacter[0], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[1], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[2], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[3], duration: 4500 })
    ]);
}

/**
 * Registers Nayeli spirit dialogs.
 * @param {Object} setup Dialog setup.
 * @returns {*} Registered dialog.
 */
function registerNayeliSpiritDialogs(setup) {
    return setup.dialogManager.addDialog('nayeliSpirit:01', [
        bubbleStep({ bubble: setup.speechBubblesNayeliSpirit[0], duration: 1000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesNayeliSpirit[1], duration: 2000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesNayeliSpirit[2], duration: 1500, yOffset: 20 }),
        pauseStep(1000),
        callbackStep(() => { setup.sounds.voNayeliSpirit02.play(); }),
        bubbleStep({ bubble: setup.speechBubblesNayeliSpirit[3], duration: 1500, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesNayeliSpirit[4], duration: 2500, yOffset: 20 })
    ]);
}

/**
 * Registers Nayeli spirit echo dialogs.
 * @param {Object} setup Dialog setup.
 * @returns {*} Registered dialog.
 */
function registerNayeliSpiritEchoDialogs(setup) {
    return setup.dialogManager.addDialog('nayeliSpiritEcho:01', [
        bubbleStep({ bubble: setup.speechBubblesNayeliSpiritEcho[0], duration: 1000, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesNayeliSpiritEcho[1], duration: 2000, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesNayeliSpiritEcho[2], duration: 1500, yOffset: 10 })
    ]);
}

/**
 * Registers Sollita spirit echo dialogs.
 * @param {Object} setup Dialog setup.
 * @returns {*} Registered dialog.
 */
function registerSollitaSpiritEchoDialogs(setup) {
    return setup.dialogManager.addDialog('sollitaSpiritEcho:01', [
        bubbleStep({ bubble: setup.speechBubblesSollitaSpiritEcho[0], duration: 1000, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesSollitaSpiritEcho[1], duration: 1500, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesSollitaSpiritEcho[2], duration: 1000, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesSollitaSpiritEcho[3], duration: 1000, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesSollitaSpiritEcho[4], duration: 1500, yOffset: 10 })
    ]);
}

/**
 * Registers dialog steps for Tadeo.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Registered dialog instance.
 */
function registerTadeoDialogs(setup) {
    return setup.dialogManager.addDialog('tadeo:01', [
        bubbleStep({ bubble: setup.speechBubblesTadeo[0], duration: 1000, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesTadeo[1], duration: 600, yOffset: 10 }),
        bubbleStep({ bubble: setup.speechBubblesTadeo[2], duration: 1500, yOffset: 10 })
    ]);
}

/**
 * Registers Tadeo spirit echo dialogs.
 * @param {Object} setup Dialog setup.
 * @returns {*} Registered dialog.
 */
function registerTadeoSpiritEchoDialogs(setup) {
    return setup.dialogManager.addDialog('tadeoSpiritEcho:01', [
        bubbleStep({ bubble: setup.speechBubblesTadeoSpiritEcho[0], duration: 800, yOffset: 0 }),
        bubbleStep({ bubble: setup.speechBubblesTadeoSpiritEcho[1], duration: 1400, yOffset: 0 }),
        bubbleStep({ bubble: setup.speechBubblesTadeoSpiritEcho[2], duration: 400, yOffset: 0 }),
        bubbleStep({ bubble: setup.speechBubblesTadeoSpiritEcho[3], duration: 1400, yOffset: 0 }),
        bubbleStep({ bubble: setup.speechBubblesTadeoSpiritEcho[4], duration: 1000, yOffset: 0 })
    ])
}

/**
 * Registers the end scene dialogs for the character.
 * @param {Object} setup Dialog setup.
 * @returns {{part01: *, part02: *}} Registered dialog parts.
 */
function registerCharacterEndSceneDialogs(setup) {
    const part01 = setup.dialogManager.addDialog('character:endScene:part01', characterEndSceneDialogsPart01(setup));
    const part02 = setup.dialogManager.addDialog('character:endScene:part02', characterEndSceneDialogsPart02(setup));
    return { part01, part02 };
}

/**
 * Creates and registers the first part of the character end scene dialogs.
 * @param {Object} setup Dialog setup.
 * @returns {*} Registered dialog.
 */
function characterEndSceneDialogsPart01(setup) {
    return [
        pauseStep(2000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[4], duration: 4500, yOffset: 30}),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[5], duration: 4500, yOffset: 30}),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[6], duration: 4500, yOffset: 30}),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[7], duration: 4500, yOffset: 30}),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubblesCharacter[8], duration: 4500, yOffset: 30})
    ];
}

/**
 * Creates and registers the second part of the character end scene dialogs.
 * @param {Object} setup Dialog setup.
 * @returns {*} Registered dialog.
 */
function characterEndSceneDialogsPart02(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubblesCharacter[9], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[10], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubblesCharacter[11], duration: 4500 })
    ];
}

/**
 * Registers the end scene dialogs for Sollita.
 * @param {Object} setup Dialog setup.
 * @returns {*} Result of dialog registration.
 */
function registerSollitaEndSceneDialogs(setup) {
    return setup.dialogManager.addDialog('sollita:endScene', [
        ...sollitaEndSceneDialogsPart01(setup),
        ...sollitaEndSceneDialogsPart02(setup)
    ]);
}

/**
 * Creates the first part of Sollita end scene dialog steps.
 * @param {Object} setup Dialog setup.
 * @returns {Array} Dialog steps.
 */
function sollitaEndSceneDialogsPart01(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubblesSollita[0], duration: 2000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[1], duration: 2500, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[2], duration: 2500, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[3], duration: 2500, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[4], duration: 5000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[5], duration: 2200, yOffset: 20 }),
    ];
}

/**
 * Creates the second part of Sollita end scene dialog steps.
 * @param {Object} setup Dialog setup.
 * @returns {Array} Dialog steps.
 */
function sollitaEndSceneDialogsPart02(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubblesSollita[6], duration: 3200, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[7], duration: 3000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[8], duration: 3000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[9], duration: 4000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[10], duration: 4000, yOffset: 20 }),
        bubbleStep({ bubble: setup.speechBubblesSollita[11], duration: 5000, yOffset: 20 })
    ];
}