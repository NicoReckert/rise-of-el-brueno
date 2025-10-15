let canvas;
let world;
let keyboard = new Keyboard();
let characterImages;
let entityImages;
let allAudios;

// async function init() {
//     canvas = document.getElementById('canvas');
//     characterImages = await preloadManifestImages(characterImageManifest);
//     entityImages = await preloadManifestImages(entityImageManifest);
//     allAudios = await preloadManifestAudio(audioManifest);
//     world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
//     createTownLevel(entityImages);
//     listenStartButton();
// }

function countManifestFiles(manifests) {
  let count = 0;
  for (const manifest of manifests) {
    for (const value of Object.values(manifest)) {
      if (Array.isArray(value)) {
        count += value.length; // mehrere Einträge (z. B. Animationframes)
      } else if (typeof value === "object" && value !== null) {
        // verschachteltes Manifest (z. B. npc: { walk: [...], idle: [...] })
        count += countManifestFiles([value]);
      } else {
        count++; // einzelner Pfad
      }
    }
  }
  return count;
}


async function init() {
    const overlay = document.getElementById('loading-overlay');
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');

    const manifests = [characterImageManifest, entityImageManifest, audioManifest];
    const totalFiles = countManifestFiles(manifests);
    let loaded = 0;

    const updateProgress = () => {
        const percent = Math.round((loaded / totalFiles) * 100);
        bar.style.width = `${percent}%`;
        text.textContent = `Loading... ${percent}%`;
    };

    const loadFile = async (path) => {
        try {
            if (path.endsWith('.webp') || path.endsWith('.png')) {
                await preloadImage(path);
            } else if (path.endsWith('.opus') || path.endsWith('.mp3')) {
                await preloadAudio(path);
            }
        } catch (e) {
            console.warn('Fehler beim Laden:', path, e);
        } finally {
            loaded++;
            updateProgress();
        }
    };

    const loadManifestDeep = async (obj) => {
        for (const value of Object.values(obj)) {
            if (Array.isArray(value)) {
                for (const v of value) await loadFile(v);
            } else if (typeof value === 'object') {
                await loadManifestDeep(value);
            } else if (typeof value === 'string') {
                await loadFile(value);
            }
        }
    };

    updateProgress();
    for (const m of manifests) await loadManifestDeep(m);

    // Alles fertig
    overlay.style.opacity = 0;
    setTimeout(() => overlay.remove(), 500);

    // Jetzt dein Spiel starten
    canvas = document.getElementById('canvas');
    characterImages = await preloadManifestImages(characterImageManifest);
    entityImages = await preloadManifestImages(entityImageManifest);
    allAudios = await preloadManifestAudio(audioManifest);
    world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
    createTownLevel(entityImages);
    listenStartButton();
}

// Hilfsfunktionen
function countManifestFiles(manifests) {
    let count = 0;
    for (const manifest of manifests) {
        for (const value of Object.values(manifest)) {
            if (Array.isArray(value)) count += value.length;
            else if (typeof value === 'object') count += countManifestFiles([value]);
            else if (typeof value === 'string') count++;
        }
    }
    return count;
}

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });
}

function preloadAudio(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
        audio.src = src;
        audio.load();
    });
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
    world = new World(canvas, keyboard, characterImages, entityImages);
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

