
export class InputManager {
    constructor(keyboard, uiManager) {
        this.keyboard = keyboard;
        this.uiManager = uiManager;
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
        this.uiManager.dom.startButton.addEventListener('click', () => {
            onStartGame();
        });
    }


    listenNextLevelButton(onStartNextLevel) {
        this.uiManager.dom.nextLevelButton.addEventListener('click', () => {
            onStartNextLevel();
        });
    }

    listenPauseToggleButton(onTogglePause) {
        this.uiManager.dom.pauseToggleButton.addEventListener('click', () => {
            onTogglePause();
        });
    }

    listenPauseResumeButton(onTogglePause) {
        this.uiManager.dom.pauseResumeButton.addEventListener('click', () => {
            onTogglePause();
        });
    }

    listenWelcomeButton(onStartIntro) {
        this.uiManager.dom.welcomeButton.addEventListener("click", () => {
            onStartIntro();
        });
    }

    listenMenuCharactersButton(onClick) {
        this.uiManager.dom.menuCharactersButton.addEventListener('click', () => {
            onClick();
        })
    }

    listenSmallCardBox(onClick) {
        this.uiManager.dom.smallCardBox.addEventListener('click', onClick);
    }
}