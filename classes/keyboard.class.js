class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    D = false;

    constructor() {
        this.mobileButtonMakeTrueOrFalse();
    }

    setKeyFalse(key) {
        if (key === 'ArrowLeft') this.LEFT = false;
        if (key === 'ArrowRight') this.RIGHT = false;
        if (key === 'ArrowRight') this.SPACE = false;
        if (key === 'd') this.D = false;
    }

    setKeyTrue(key) {
        if (key === 'ArrowLeft') this.LEFT = true;
        if (key === 'ArrowRight') this.RIGHT = true;
        if (key === 'ArrowUp') this.UP = true;
        if (key === 'd') this.D = true;
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
    }
}