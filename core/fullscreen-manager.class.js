/**
 * Manages entering, exiting, and tracking fullscreen state.
 */
export class FullscreenManager {

    /**
     * Checks whether fullscreen mode is active.
     * @returns {boolean} True if fullscreen mode is active.
     */
    isFullscreenActive() {
        return !!document.fullscreenElement;
    }

    /**
     * Requests fullscreen mode for the given element.
     * @param {HTMLElement} element Target element.
     * @returns {void}
     */
    setFullscreen(element) {
        if (!element) return;
        this.enterFullscreen(element);
    }

    /**
     * Attempts to enter fullscreen mode for the given element.
     * @param {HTMLElement} element Target element.
     * @returns {void}
     */
    enterFullscreen(element) {
        const el = element;
        const req = this.getFullscreenRequest(el);
        if (!req) return;
        this.callFullscreenRequest(req, el);
    }

    /**
     * Returns the fullscreen request method supported by the element.
     * @param {HTMLElement} el Target element.
     * @returns {Function|undefined} Fullscreen request function.
     */
    getFullscreenRequest(el) {
        return (
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.msRequestFullscreen
        );
    }

    /**
     * Calls the fullscreen request method on the element.
     * @param {Function} req Fullscreen request function.
     * @param {HTMLElement} el Target element.
     * @returns {void}
     */
    callFullscreenRequest(req, el) {
        try {
            const result = req.call(el, { navigationUI: "hide" });
            this.catchFullscreenError(result);
        } catch { }
    }

    /**
     * Handles a possible fullscreen request promise rejection.
     * @param {*} result Result returned by the fullscreen request.
     * @returns {void}
     */
    catchFullscreenError(result) {
        if (result && typeof result.catch === "function") {
            result.catch(() => { });
        }
    }

    /**
     * Initializes a fullscreen change listener that toggles a CSS class.
     * @param {HTMLElement} [target=document.body] Target element.
     * @param {Function} [onChange] Optional change callback.
     * @returns {void}
     */
    initFullscreenClassToggle(target = document.body, onChange) {
        document.addEventListener("fullscreenchange", () => {
            const active = !!document.fullscreenElement;
            target.classList.toggle("fullscreen-active", active);
            if (typeof onChange === 'function') {
                onChange(active);
            }
        });
    }

    /**
     * Exits fullscreen mode if supported.
     * @returns {void}
     */
    exitFullscreen() {
        const exit =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen;
        if (!exit) return;
        try {
            const result = exit.call(document);
            if (result && typeof result.catch === "function") {
                result.catch(() => { });
            }
        } catch {
        }
    }

    /**
     * Toggles fullscreen mode for the given element.
     * @param {HTMLElement} element Target element.
     * @returns {void}
     */
    toggleFullscreen(element) {
        if (this.isFullscreenActive()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen(element);
        }
    }
}