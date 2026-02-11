export class FullscreenManager {
    constructor() {

    }

    setFullscreen() {
        this.enterFullscreen();
    }

    enterFullscreen(element) {
        const content = element;
        if (content.requestFullscreen) {
            content.requestFullscreen({ navigationUI: "hide" }).catch(() => { });
        }
    }


}