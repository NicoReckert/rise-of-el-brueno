import { FullscreenManager } from "./fullscreen-manager.class.js";
import { stopTitleMusic } from "../script.js";

export class InputManager {
    constructor(uiManager, keyboard) {
        this.uiManager = uiManager;
        this.keyboard = keyboard;
        this.fullscreenManager = new FullscreenManager();
        this.init();
    }

    init() {
        this.listenKeyUp();
        this.listenKeyDown();
    }

    listenKeyUp() {
        window.addEventListener('keyup', (event) => {
            this.keyboard?.setKeyFalse(event.key);
        });

    }

    listenKeyDown() {
        window.addEventListener('keydown', (event) => {
            this.keyboard?.setKeyTrue(event.key);
        });
    }

    listenStartButton(onStartGame) {
        document.getElementById('start-button').addEventListener('click', () => {
            onStartGame();
            this.uiManager.showGameScreen();
            this.fullscreenManager.setFullscreen();
            stopTitleMusic();
        });
    }








}