
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





    processGameInput(game, timestamp) {
        if (game.isKeysStopp) return;
        this.handleDuck(game);
        game.character.isMovingLeft = false;
        game.character.isMovingRight = false;
        if (this.duckIsBlocking(game.character)) {
            this.handleTaskWindowToggle(game);
            this.handleDeath(game);
            return;
        }
        this.handleHorizontalInput(game, timestamp);
        this.handleJumpAndJetpack(game);
        this.handleTaskWindowToggle(game);
        this.handleCombatInput(game, timestamp);
        this.handleDeath(game);
    }

    handleHorizontalInput(game, timestamp) {
        const kb = this.keyboard;
        const char = game.character;
        const now = timestamp;
        if (kb.LEFT) {
            if (char.isProtect) char.isProtect = false;

            if (char.isAttack) {
                if (now < game.attackCommitUntil) {
                    char.isMovingLeft = false;
                    return;
                }
            }
            char.isMovingLeft = true;
        }
        if (kb.RIGHT) {
            if (char.isProtect) char.isProtect = false;

            if (char.isAttack) {
                if (now < game.attackCommitUntil) {
                    char.isMovingRight = false;
                    return;
                }
            }
            char.isMovingRight = true;
        }
    }

    handleJumpAndJetpack(game) {
        const kb = this.keyboard;
        const char = game.character;

        // normaler Jump
        if (kb.UP && !char.isAboveGround() && !char.isFlying && !char.isJumping) {
            if (char.isAttack || char.isProtect) {
                char.isAttack = false;
                char.isProtect = false;
            }
            char.isJumping = true;
            char.speedY = 25;
            game.audioManager.playOneShot('jumpSound');
        }

        // Jetpack hoch
        if (kb.UP && char.isAboveGround() && char.isFlying) {
            char.moveUp();
        }

        // Jetpack runter / landen
        if (kb.DOWN && char.isAboveGround() && char.isFlying) {
            if (char.y + 10 == 130) {
                this.stopJetpack(game);
            } else {
                char.moveDown();
            }
        }

        // Jetpack aktivieren
        if (kb.J) {
            char.moveFly();
            game.backgroundMusic.pause();
            game.backgroundMusic.currentTime = 0;
            game.playEndbossMusic("stop");
            game.jetPackMusic.play();
            game.jetPackSound.play();
        }
    }

    stopJetpack(game) {
        const kb = this.keyboard;
        const char = game.character;

        kb.J = false;
        char.isFlying = false;
        game.jetPackMusic.pause();
        game.jetPackMusic.currentTime = 0;
        game.jetPackSound.pause();
        game.jetPackSound.currentTime = 0;

        if (game.townLevelSetup.endbossMusicIsPlayed) {
            game.playEndbossMusic("play");
        } else {
            game.backgroundMusic.play();
        }

        char.y = 130;
        char.moveStop();
    }

    handleTaskWindowToggle(game) {
        const kb = this.keyboard;
        if (kb.T && !game.tKeyPressed) {
            game.taskWindow.toggle();
            game.tKeyPressed = true;
        }
        if (!kb.T) {
            game.tKeyPressed = false;
        }
    }

    handleCombatInput(game, timestamp) {
        const kb = this.keyboard;
        const char = game.character;

        if (kb.A && !char.isAttack && !char.isMovingLeft && !char.isMovingRight) {
            char.isAttack = true;
            game.attackStartTime = timestamp;
            game.attackCommitUntil = timestamp + 180;
            const setup = game.getCurrentSetup?.();
            setup?.sounds?.attackSound?.play();
        }

        if (kb.S && !char.isProtect && !char.isMovingLeft && !char.isMovingRight) {
            char.isProtect = true;
        }

        if (!kb.S && char.isProtect) {
            char.isProtect = false;
        }
    }

    handleDeath(game) {
        if (game.character.isDead) {
            game.character.animationDead();
        }
    }


    handleDuck(game) {
        const kb = this.keyboard;
        const char = game.character;
        const canDuck =
            !char.isAboveGround() &&
            !char.isFlying &&
            !char.isJumping &&
            !char.isAttack &&
            !char.isProtect;
        if (kb.DOWN && canDuck) {
            if (!char.duckState) {
                char.duckState = 'enter';
                char.frameIndex = 0;
                char.sheetIndex = 0;
                char.animationFinished = false;
                char.lastFrameTime = null;
            }
            return;
        }
        if (!kb.DOWN && this.duckIsActive(char)) {
            this.startDuckExit(char);
        }
    }
    duckIsActive(char) {
        return char.duckState === 'enter' || char.duckState === 'loop';
    }

    duckIsBlocking(char) {
        return char.duckState === 'enter' || char.duckState === 'exit';
    }

    startDuckExit(char) {
        if (!this.duckIsActive(char)) return;
        char.duckState = 'exit';
        char.frameIndex = 0;
        char.sheetIndex = 0;
        char.animationFinished = false;
        char.lastFrameTime = null;
    }
}