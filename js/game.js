let canvas;
let world;
let keyboard = new Keyboard();
let characterImages;
let npcImages;

async function init() {
    canvas = document.getElementById('canvas');
    characterImages = await preloadManifestImages(characterImageManifest);
    npcImages = await preloadManifestImages(npcImageManifest);
    allAudios = await preloadManifestAudio(audioManifest);
    world = new World(canvas, keyboard, characterImages, npcImages, allAudios);
    createTownLevel(npcImages);
    listenStartButton();
}

window.addEventListener('keydown', (event) => {
    keyboard.setKeyTrue(event.key);
});

window.addEventListener('keyup', (event) => {
    keyboard.setKeyFalse(event.key);
});

function setFullscreen() {
    const content = document.getElementById('canvas-button-box');
    content.requestFullscreen({ navigationUI: "hide" });
}

document.getElementById('next-level-button').addEventListener('click', () => {
    world.currentScene = 'townLevel';
    fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic);
    document.getElementById('level-complete-button-box').classList.add('d-none');
});

document.getElementById('repeat-level-button').addEventListener('click', () => {
    world.restartLevel('farmLevel');
});

document.getElementById('menu-level-button').addEventListener('click', () => {
    fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic, 1000);
    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
    document.getElementById('overlay-startscreen').style.display = 'flex';
    // document.getElementById('overlay-startscreen').classList.remove('opacity-none');
    // document.getElementById('canvas').style.display = 'none';
    // document.getElementById('canvas-button-box').style.display = 'none';
    document.getElementById('move-button-box').classList.add('d-none');
    document.getElementById('level-complete-button-box').classList.add('d-none');
    if (document.fullscreenElement) {
        try {
            document.exitFullscreen();
        } catch (err) {
            console.warn('Fehler beim Beenden des Fullscreens:', err);
        }
    }
    world.stop();
    // world.destroy();
    world = new World(canvas, keyboard, characterImages, npcImages);
    // init();
});

function listenStartButton() {
    document.getElementById('start-button').addEventListener('click', () => {
        world.startGame();
        document.getElementById('overlay-startscreen').style.display = 'none';
        document.getElementById('overlay-start-initialisation').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        document.getElementById('move-button-box').classList.remove('d-none');
        // document.getElementById('background-music').play();
        // this.character.playSpeakSound();
        setFullscreen();
        titleMusic.pause();
        titleMusic2.pause();
    });
}

init();