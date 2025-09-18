let canvas;
let world;
let keyboard = new Keyboard();
let characterImages;
let npcImages;

async function init() {
    canvas = document.getElementById('canvas');
    characterImages = await preloadManifestImages(characterImageManifest);
    npcImages = await preloadManifestImages(npcImageManifest);
    world = new World(canvas, keyboard, characterImages, npcImages);
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