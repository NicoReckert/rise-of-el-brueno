class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;

    constructor() {

    }

    setKeyFalse(key) {
        if (key === 'ArrowLeft') this.LEFT = false;
        if (key === 'ArrowRight') this.RIGHT = false;
        if (key === 'ArrowRight') this.SPACE = false;
    }

    setKeyTrue(key) {
        if (key === 'ArrowLeft') this.LEFT = true;
        if (key === 'ArrowRight') this.RIGHT = true;
        if (key === 'ArrowUp') this.UP = true;
    }
}