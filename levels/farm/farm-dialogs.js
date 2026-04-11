import { bubbleStep, pauseStep } from '../../utils/dialog-step-helpers.js';

/**
 * Registers farm dialogs.
 * @param {*} setup Setup object.
 * @returns {void}
 */
export function registerFarmDialogs(setup) {
    registerCharacterDialogs(setup);
}

/**
 * Registers character dialogs.
 * @param {*} setup Setup object.
 * @returns {{part01: *, part02: *, part03: *, part04: *}}
 */
function registerCharacterDialogs(setup) {
    const part01 = setup.dialogManager.addDialog('character:01', characterDialogsPart01(setup));
    const part02 = setup.dialogManager.addDialog('character:02', characterDialogsPart02(setup));
    const part03 = setup.dialogManager.addDialog('character:03', characterDialogsPart03(setup));
    const part04 = setup.dialogManager.addDialog('character:04', characterDialogsPart04(setup));
    return { part01, part02, part03, part04 };
}

/**
 * Creates character dialog part 01.
 * @param {*} setup Setup object.
 * @returns {Array<*>}
 */
function characterDialogsPart01(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubbles[0], duration: 4500 }),
        bubbleStep({ bubble: setup.speechBubbles[1], duration: 4500 }),
    ];
}

/**
 * Creates character dialog part 02.
 * @param {*} setup Setup object.
 * @returns {Array<*>}
 */
function characterDialogsPart02(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubbles[2], duration: 5000 }),
        bubbleStep({ bubble: setup.speechBubbles[3], duration: 5000 }),
        pauseStep(1000),
        bubbleStep({ bubble: setup.speechBubbles[4], duration: 5000 })
    ];
}

/**
 * Creates character dialog part 03.
 * @param {*} setup Setup object.
 * @returns {Array<*>}
 */
function characterDialogsPart03(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubbles[5], duration: 5000 }),
        bubbleStep({ bubble: setup.speechBubbles[6], duration: 5000 }),
        bubbleStep({ bubble: setup.speechBubbles[7], duration: 5000 })
    ];
}

/**
 * Creates character dialog part 04.
 * @param {*} setup Setup object.
 * @returns {Array<*>}
 */
function characterDialogsPart04(setup) {
    return [
        bubbleStep({ bubble: setup.speechBubbles[8], duration: 5000 }),
        bubbleStep({ bubble: setup.speechBubbles[9], duration: 5000 }),
        bubbleStep({ bubble: setup.speechBubbles[10], duration: 5000 }),
        bubbleStep({ bubble: setup.speechBubbles[7], duration: 5000 })
    ];
}