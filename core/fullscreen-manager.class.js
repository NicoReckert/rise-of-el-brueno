export class FullscreenManager {

    isFullscreenActive() {
        return !!document.fullscreenElement;
    }

    setFullscreen(element) {
        if (!element) return;
        this.enterFullscreen(element);
    }

    enterFullscreen(element) {
        const el = element;
        const req =
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.msRequestFullscreen;
        if (!req) return;
        try {
            const result = req.call(el, { navigationUI: "hide" });
            if (result && typeof result.catch === "function") {
                result.catch(() => { });
            }
        } catch {

        }
    }

    initFullscreenClassToggle(target = document.body, onChange) {
        document.addEventListener("fullscreenchange", () => {
            const active = !!document.fullscreenElement;
            target.classList.toggle("fullscreen-active", active);
            if (typeof onChange === 'function') {
                onChange(active);
            }
        });
    }

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

    toggleFullscreen(element) {
        if (this.isFullscreenActive()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen(element);
        }
    }
}
