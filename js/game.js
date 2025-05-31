let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.setLevel(level1);
}

window.addEventListener('keydown', (event) => { 
    keyboard.setKeyTrue(event.key);
});

window.addEventListener('keyup', (event) => {
    keyboard.setKeyFalse(event.key);
});