const KEY_MAP = {
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    d: 'D',
    s: 'S',
    f: 'F',
    t: 'T',
    a: 'A',
    x: 'X'
};

const MOBILE_BUTTON_MAP = {
    'left-button': 'LEFT',
    'right-button': 'RIGHT',
    'jump-button': 'UP',
    'duck-button': 'DOWN',
    'throw-button': 'D',
    'action-button': 'F',
    'quest-log-button': 'T',
    'attack-button': 'A',
    'protect-button': 'S'
};

/**
 * Handles keyboard and mobile input state.
 */
export class Keyboard {
    /**
     * Creates a new Keyboard instance.
     */
    constructor() {
        this.initDirectionKeys();
        this.initActionKeys();
        this.bindMobileButtons();
    }

    /**
     * Initializes direction key states.
     * @returns {void}
     */
    initDirectionKeys() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
    }

    /**
     * Initializes action key states.
     * @returns {void}
     */
    initActionKeys() {
        this.D = false;
        this.J = false;
        this.S = false;
        this.F = false;
        this.T = false;
        this.A = false;
        this.X = false;
    }

    /**
     * Sets the specified key state to true.
     * @param {string} key Key identifier.
     * @returns {void}
     */
    setKeyTrue(key) {
        this.setKeyState(key, true);
    }

    /**
     * Sets the specified key state to false.
     * @param {string} key Key identifier.
     * @returns {void}
     */
    setKeyFalse(key) {
        this.setKeyState(key, false);
    }

    /**
     * Updates the state of a mapped key.
     * @param {string} key Input key identifier.
     * @param {boolean} value Key state.
     * @returns {void}
     */
    setKeyState(key, value) {
        const mappedKey = this.getMappedKey(key);
        if (!mappedKey) return;
        this[mappedKey] = value;
    }

    /**
     * Resolves the mapped key identifier from an input key.
     * @param {string} key Input key identifier.
     * @returns {string|null} Mapped key name or null if not mapped.
     */
    getMappedKey(key) {
        if (typeof key !== 'string') return null;
        const normalizedKey = key.length === 1 ? key.toLowerCase() : key;
        return KEY_MAP[normalizedKey] ?? null;
    }

    /**
     * Binds mobile button elements to their corresponding key states.
     * @returns {void}
     */
    bindMobileButtons() {
        Object.entries(MOBILE_BUTTON_MAP).forEach(([id, key]) => {
            this.bindMobileButton(id, key);
        });
    }

    /**
     * Binds a mobile button element to a key state.
     * @param {string} id DOM element id of the mobile button.
     * @param {string} key Key state property name.
     * @returns {void}
     */
    bindMobileButton(id, key) {
        const element = document.getElementById(id);
        if (!element) return;
        element.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this[key] = true;
        }, { passive: false });
        element.addEventListener('touchend', () => {
            this[key] = false;
        });
        element.addEventListener('touchcancel', () => {
            this[key] = false;
        });
    }

    /**
     * Triggers a virtual key press.
     * @param {string} key Key value.
     * @param {number} [duration=120] Press duration in milliseconds.
     * @returns {void}
     */
    triggerVirtualKeyPress(key, duration = 120) {
        const mappedKey = this.getMappedKey(key);
        if (!mappedKey) return;
        this[mappedKey] = true;
        window.dispatchEvent(new KeyboardEvent('keydown', {
            key: key.length === 1 ? key.toLowerCase() : key
        }));
        setTimeout(() => {
            this[mappedKey] = false;
            window.dispatchEvent(new KeyboardEvent('keyup', {
                key: key.length === 1 ? key.toLowerCase() : key
            }));
        }, duration);
    }
}