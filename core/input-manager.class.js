
export class InputManager {
    constructor(keyboard, uiManager) {
        this.keyboard = keyboard;
        this.uiManager = uiManager;
        this.init();
    }

    init() {
        this.listenKeyUp();
        this.listenKeyDown();
        this.disableContextMenuOnCanvas();
    }

    initMoveButtonVisuals(container) {
        if (!container) return;
        const buttons = container.querySelectorAll('.move-button');
        buttons.forEach(btn => this.bindMoveButtonVisuals(btn));
    }

    bindMoveButtonVisuals(btn) {
        if (!btn) return;
        const press = () => {
            btn.classList.add('hold');
            this.triggerPulse(btn);
        };
        const release = () => btn.classList.remove('hold');

        btn.addEventListener('touchstart', press);
        btn.addEventListener('mousedown', press);
        btn.addEventListener('touchend', release);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    }

    triggerPulse(button) {
        button.classList.remove('pulse');
        void button.offsetWidth;
        button.classList.add('pulse');
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

    listenCloseButton(onClick) {
        this.uiManager.dom.closeButton.addEventListener('click', onClick);
    }

    listenCloseCharactersOverlayButton(onClick) {
        this.uiManager.dom.closeCharactersOverlayButton.addEventListener('click', onClick);
    }

    listenMenuStoryButton(onClick) {
        this.uiManager.dom.menuStoryButton.addEventListener('click', onClick)
    }

    listenCloseStoryOverlayButton(onClick) {
        this.uiManager.dom.closeStoryOverlayButton.addEventListener('click', onClick);
    }

    listenMenuControlsButton(onClick) {
        this.uiManager.dom.menuControlsButton.addEventListener('click', onClick)
    }

    listenCloseControlsOverlayButton(onClick) {
        this.uiManager.dom.closeControlsOverlayButton.addEventListener('click', onClick);
    }

    listenMenuCreditsButton(onClick) {
        this.uiManager.dom.menuCreditsButton.addEventListener('click', onClick)
    }

    listenCloseCreditsOverlayButton(onClick) {
        this.uiManager.dom.closeCreditsOverlayButton.addEventListener('click', onClick);
    }

    disableContextMenuOnCanvas() {
        const canvas = this.uiManager.dom.canvas;
        if (!canvas) return;
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    listenEscapeKey(onEscape) {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                onEscape(event);
            }
        });
    }

    listenFullscreenToggleButton(onToggle) {
        const btn = this.uiManager.dom.fullscreenToggleButton;
        if (!btn) return;
        btn.addEventListener('click', onToggle);
    }

    listenRepeatLevelButton(onClick) {
        const btn = this.uiManager.dom.repeatLevelButton;
        if (!btn) return;
        btn.addEventListener('click', onClick);
    }

    listenPauseRestartButton(onClick) {
        const btn = this.uiManager.dom.pauseRestartButton;
        if (!btn) return;
        btn.addEventListener('click', onClick);
    }

    listenMenuLevelButton(onClick) {
        const btn = this.uiManager.dom.menuLevelButton;
        if (!btn) return;
        btn.addEventListener('click', onClick);
    }

    listenPauseMenuMainButton(onClick) {
        const btn = this.uiManager.dom.pauseMenuMainButton;
        if (!btn) return;
        btn.addEventListener('click', onClick);
    }

    listenMuteToggleButton(onToggle) {
        const btn = this.uiManager.dom.muteToggleButton;
        if (!btn) return;
        btn.addEventListener('click', onToggle);
    }
}