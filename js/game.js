let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.setLevel(level2);
}

window.addEventListener('keydown', (event) => {
    keyboard.setKeyTrue(event.key);
});

window.addEventListener('keyup', (event) => {
    keyboard.setKeyFalse(event.key);
});

function setFullscreen() {
    canvas = document.getElementById('all-content');
    canvas.requestFullscreen({ navigationUI: "hide" });
}