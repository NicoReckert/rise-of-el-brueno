import { uiManagerDomMethods } from './ui-manager-dom.methods.js';
import { uiManagerScreenMethods } from './ui-manager-screen.methods.js';
import { uiManagerOverlayMethods } from './ui-manager-overlay.methods.js';
import { uiManagerRenderMethods } from './ui-manager-render.methods.js';

/**
 * Manages UI elements and DOM interactions.
 */
export class UIManager {
    /**
     * Creates a new UIManager instance.
     */
    constructor() {
        this.dom = {};
        this.cacheDom();
    }
}

/**
 * Extends UIManager with DOM, screen, overlay, and render methods.
 */
Object.assign(
    UIManager.prototype,
    uiManagerDomMethods,
    uiManagerScreenMethods,
    uiManagerOverlayMethods,
    uiManagerRenderMethods
);