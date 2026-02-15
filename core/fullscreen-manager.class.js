export class FullscreenManager {
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
}
