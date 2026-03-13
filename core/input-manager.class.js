import { inputManagerKeyboardMethods } from "./input-manager-keyboard.methods.js";
import { inputManagerButtonMethods } from "./input-manager-button.methods.js";
import { inputManagerVisualMethods } from "./input-manager-visual.methods.js";

/**
 * Manages keyboard and UI input initialization.
 */
export class InputManager {
    /**
     * Creates a new InputManager instance.
     * @param {Object} keyboard Keyboard input handler.
     * @param {Object} uiManager UI manager instance.
     */
    constructor(keyboard, uiManager) {
        this.keyboard = keyboard;
        this.uiManager = uiManager;
        this.init();
    }
}

/**
 * Extends the InputManager prototype with keyboard, button, and visual input methods.
 */
Object.assign(
    InputManager.prototype,
    inputManagerKeyboardMethods,
    inputManagerButtonMethods,
    inputManagerVisualMethods
);