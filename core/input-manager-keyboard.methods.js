export const inputManagerKeyboardMethods = {

    /**
     * Initializes input event listeners.
     */
    init() {
        this.listenKeyUp();
        this.listenKeyDown();
        this.disableContextMenuOnCanvas();
    },

    /**
     * Binds an event listener to the window object.
     * @param {string} type Event type.
     * @param {Function} handler Event handler function.
     */
    bindWindowEvent(type, handler) {
        if (!type || !handler) return;
        window.addEventListener(type, handler);
    },

    /**
     * Registers the keyup event listener and updates keyboard state.
     */
    listenKeyUp() {
        this.bindWindowEvent('keyup', (event) => {
            this.keyboard?.setKeyFalse(event.key);
        });
    },

    /**
     * Registers the keydown event listener and updates keyboard state.
     */
    listenKeyDown() {
        this.bindWindowEvent('keydown', (event) => {
            this.keyboard?.setKeyTrue(event.key);
        });
    },

    /**
     * Registers a keydown listener for the Escape key.
     * @param {Function} onEscape Callback triggered when the Escape key is pressed.
     */
    listenEscapeKey(onEscape) {
        this.bindWindowEvent('keydown', (event) => {
            if (event.key !== 'Escape') return;
            onEscape(event);
        });
    },

    /**
     * Disables the context menu on the canvas element.
     */
    disableContextMenuOnCanvas() {
        const canvas = this.uiManager.dom.canvas;
        if (!canvas) return;
        canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    }
}