export class FullscreenManager {
    constructor() {

    }

    setFullscreen() {
        this.enterFullscreen();
    }

    enterFullscreen() {
        const content = document.getElementById('canvas-button-box');
        if (content.requestFullscreen) {
            content.requestFullscreen({ navigationUI: "hide" }).catch(() => { });
        }
    }


}