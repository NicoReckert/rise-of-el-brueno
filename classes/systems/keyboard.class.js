export class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false
    D = false;
    J = false;
    S = false;
    F = false;
    T = false;
    A = false;
    S = false;

    constructor() {
        this.mobileButtonMakeTrueOrFalse();
    }

    setKeyFalse(key) {
        if (key === 'ArrowLeft') this.LEFT = false;
        if (key === 'ArrowRight') this.RIGHT = false;
        if (key === 'ArrowUp') this.UP = false;
        if (key === 'ArrowDown') this.DOWN = false;
        if (key === 'd') this.D = false;
        // if (key === 'j') this.J = false;
        if (key === 's') this.S = false;
        if (key === 'f') this.F = false;
        if (key === 't') this.T = false;
        if (key === 'a') this.A = false;
        if (key === 's') this.S = false;
    }

    setKeyTrue(key) {
        if (key === 'ArrowLeft') this.LEFT = true;
        if (key === 'ArrowRight') this.RIGHT = true;
        if (key === 'ArrowUp') this.UP = true;
        if (key === 'ArrowDown') this.DOWN = true;
        if (key === 'd') this.D = true;
        // if (key === 'j') this.J = true;
        if (key === 's') this.S = true;
        if (key === 'f') this.F = true;
        if (key === 't') this.T = true;
        if (key === 'a') this.A = true;
        if (key === 's') this.S = true;
    }

    mobileButtonMakeTrueOrFalse() {
        document.getElementById('left-button').addEventListener('touchstart', () => {
            this.LEFT = true;
        });
        document.getElementById('left-button').addEventListener('touchend', () => {
            this.LEFT = false;
        });
        document.getElementById('right-button').addEventListener('touchstart', () => {
            this.RIGHT = true;
        });
        document.getElementById('right-button').addEventListener('touchend', () => {
            this.RIGHT = false;
        });
        document.getElementById('jump-button').addEventListener('touchstart', () => {
            this.UP = true;
        });
        document.getElementById('jump-button').addEventListener('touchend', () => {
            this.UP = false;
        });
        document.getElementById('throw-button').addEventListener('touchstart', () => {
            this.D = true;
        });
        document.getElementById('throw-button').addEventListener('touchend', () => {
            this.D = false;
        });
        document.getElementById('action-button').addEventListener('touchstart', () => {
            this.F = true;
        });
        document.getElementById('action-button').addEventListener('touchend', () => {
            this.F = false;
        });
        document.getElementById('log-button').addEventListener('touchstart', () => {
            this.T = true;
        });
        document.getElementById('log-button').addEventListener('touchend', () => {
            this.T = false;
        });
        document.getElementById('attack-button').addEventListener('touchstart', () => {
            this.A = true;
        });
        document.getElementById('attack-button').addEventListener('touchend', () => {
            this.A = false;
        });

    }
}