let canvas;
let world;
let keyboard = new Keyboard();
let characterImages = {};
let entityImages = {};
let allAudios = {};

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

    const manifests = [characterManifestImmediate, farmEntityManifestImmediate, farmAudioManifestImmediate];
    const totalFiles = countManifestFiles(manifests);
    let loaded = 0;
    const updateProgress = () => {
        const percent = Math.round((loaded / totalFiles) * 100);
        bar.style.width = `${percent}%`;
        text.textContent = `Loading... ${percent}%`;
    };
    const onFileLoaded = () => { loaded++; updateProgress(); };

    const [chars, entities, audios] = await Promise.all([
        preloadManifestImages(characterManifestImmediate, onFileLoaded),
        preloadManifestImages(farmEntityManifestImmediate, onFileLoaded),
        preloadManifestAudio(farmAudioManifestImmediate)
    ]);

    Object.assign(characterImages, chars);
    smartMerge(entityImages, entities);
    Object.assign(allAudios, audios);

    // 🔊🔇 hier: gespeicherten Mute-State wiederherstellen
    const savedMuted = localStorage.getItem("elBruenoMuted");
    if (savedMuted === "1") {
        setMutedState(true);
    } else {
        setMutedState(false);
    }

    overlay.style.opacity = 0;
    setTimeout(() => overlay.remove(), 600);

    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
    // setImages(entityImages);
    // createTownLevel();
    listenStartButton();

    loadDeferredAssets(characterImages, entityImages, allAudios);
    loadLazyAssets(characterImages, entityImages, allAudios);
}

function countManifestFiles(manifests) {
    return manifests.reduce((count, manifest) => {
        for (const value of Object.values(manifest)) {
            if (Array.isArray(value)) count += value.length;
            else if (typeof value === "object" && value) count += countManifestFiles([value]);
            else count++;
        }
        return count;
    }, 0);
}

async function loadDeferredAssets() {
    try {
        const [charDeferred, entityDeferred, audioDeferred] = await Promise.all([
            preloadManifestImages(characterManifestDeferred),
            preloadManifestImages(farmEntityManifestDeferred),
            preloadManifestAudio(farmAudioManifestDeferred)
        ]);

        Object.assign(characterImages, charDeferred);
        smartMerge(entityImages, entityDeferred);
        Object.assign(allAudios, audioDeferred);

        if (isMuted) {
            applyMuteToAllAudios(allAudios);
        }

        if (world) {
            Object.assign(world.characterImages, charDeferred);
            smartMerge(world.entityImages, entityDeferred);
            Object.assign(world.allAudios, audioDeferred);
            world.character?.initMovementImages();
            world.character?.initEmotionImages();
            world.character?.initActionImages();
            world.character?.initSpecialImages();
        }
    } catch { }
}

async function loadLazyAssets() {
    try {
        await new Promise(r =>
            ("requestIdleCallback" in window)
                ? requestIdleCallback(r, { timeout: 1500 })
                : setTimeout(r, 1500)
        );

        const [charLazy, entityLazy, audioLazy] = await Promise.all([
            preloadManifestImages(otherLevelCharacterManifestLazy),
            preloadManifestImages(otherLevelEntityManifestLazy),
            preloadManifestAudio(otherLevelAudioManifestLazy)
        ]);

        Object.assign(characterImages, charLazy, world.characterImages);
        smartMerge(entityImages, entityLazy, world.entityImages);
        Object.assign(allAudios, audioLazy, world.allAudios);

        if (isMuted) {
            applyMuteToAllAudios(allAudios);
        }


        world.character?.initMovementImages();
        world.character?.initEmotionImages();
        world.character?.initActionImages();
        world.character?.initSpecialImages();

        setImages(entityImages);
        createTownLevel(allAudios);


        // ✅ Alle Lazy-Assets geladen → zusätzliche Level initialisieren
        if (world && typeof world.initRemainingSetups === "function") {
            world.initRemainingSetups();
        }

    } catch { }
}





function smartMerge(target, source) {
    if (!source || typeof source !== "object") return target || {};
    if (!target || typeof target !== "object") target = {};

    for (const key of Object.keys(source)) {
        const value = source[key];
        if (value && typeof value === "object" && !Array.isArray(value)) {
            if (!target[key]) target[key] = {};
            smartMerge(target[key], value);
        } else {
            target[key] = value;
        }
    }
    return target;
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
    // resetAllAudios(allAudios, { log: true });
    // world.restartLevel('farmLevel');
    document.getElementById('level-complete-button-box').classList.add('d-none');
    if (world) world.destroy();
    resetAllAudios(allAudios, { log: true });
    world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
    if (typeof world.initRemainingSetups === "function") {
        world.initRemainingSetups();
    }
    world.startGame();
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
    if (world) world.destroy();

    resetAllAudios(allAudios, { log: true });
    console.log("happyTogetherMusic nach reset:", allAudios.happyTogetherMusic?.currentTime);

    world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
    // init();
    if (typeof world.initRemainingSetups === "function") {
        world.initRemainingSetups();
    }
});

function listenStartButton() {
    document.getElementById('start-button').addEventListener('click', () => {
        world.startGame();
        document.getElementById('overlay-startscreen').style.display = 'none';
        document.getElementById('overlay-start-initialisation').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        document.getElementById('move-button-box').classList.remove('d-none');
        document.getElementById('pause-toggle-button').classList.remove('d-none');
        document.getElementById('mute-toggle-button').classList.remove('d-none');
        // document.getElementById('background-music').play();
        // this.character.playSpeakSound();
        setFullscreen();
        titleMusic.pause();
        titleMusic2.pause();
    });
}

function resetAllAudios(
    root,
    {
        pause = true,
        resetTime = true,
        resetVolume = true,
        defaultVolume = 1,
        resetLoop = true,
        resetRate = true,
        log = false
    } = {}
) {
    if (!root) return;

    let counter = 0;

    const visit = (value, path = "root") => {
        if (!value) return;

        const looksLikeAudio =
            typeof value === "object" &&
            typeof value.play === "function" &&
            typeof value.pause === "function" &&
            "currentTime" in value;

        if (looksLikeAudio) {
            try {
                if (log) console.log("[resetAllAudios] audio @", path, "before:", {
                    time: value.currentTime,
                    volume: value.volume,
                    loop: value.loop
                });

                if (pause) value.pause();
                if (resetTime) value.currentTime = 0;
                if (resetVolume) value.volume = defaultVolume;
                if (resetLoop) value.loop = false;
                if (resetRate) value.playbackRate = 1;

                if (log) console.log("[resetAllAudios] audio @", path, "after:", {
                    time: value.currentTime,
                    volume: value.volume,
                    loop: value.loop
                });

                counter++;
            } catch (e) {
                console.warn("Konnte Audio nicht resetten:", e);
            }
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((v, i) => visit(v, `${path}[${i}]`));
            return;
        }

        if (typeof value === "object") {
            Object.entries(value).forEach(([k, v]) => visit(v, `${path}.${k}`));
        }
    };

    visit(root, "allAudios");
    if (log) console.log(`[resetAllAudios] total audios reset: ${counter}`);
}

function pauseAllAudios(root) {
    if (!root) return;

    const visit = (value) => {
        if (!value) return;

        const looksLikeAudio =
            typeof value === "object" &&
            typeof value.play === "function" &&
            typeof value.pause === "function" &&
            "currentTime" in value;

        if (looksLikeAudio) {
            // Merken, ob es vorher gespielt hat
            value._wasPlayingBeforePause = !value.paused;
            if (!value.paused) value.pause();
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(visit);
        }
    };

    visit(root);
}

function resumeAllAudios(root) {
    if (!root) return;

    const visit = (value) => {
        if (!value) return;

        const looksLikeAudio =
            typeof value === "object" &&
            typeof value.play === "function" &&
            typeof value.pause === "function" &&
            "currentTime" in value;

        if (looksLikeAudio) {
            if (value._wasPlayingBeforePause) {
                value.play().catch(() => { /* Autoplay-Blocker ignorieren */ });
            }
            value._wasPlayingBeforePause = false;
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(visit);
        }
    };

    visit(root);
}


function pauseAllAudios(root) {
    if (!root) return;

    const visit = (value) => {
        if (!value) return;

        const looksLikeAudio =
            typeof value === "object" &&
            typeof value.play === "function" &&
            typeof value.pause === "function" &&
            "currentTime" in value;

        if (looksLikeAudio) {
            // Merken, ob es vorher gespielt hat
            value._wasPlayingBeforePause = !value.paused;
            if (!value.paused) value.pause();
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(visit);
        }
    };

    visit(root);
}

function resumeAllAudios(root) {
    if (!root) return;

    const visit = (value) => {
        if (!value) return;

        const looksLikeAudio =
            typeof value === "object" &&
            typeof value.play === "function" &&
            typeof value.pause === "function" &&
            "currentTime" in value;

        if (looksLikeAudio) {
            if (value._wasPlayingBeforePause) {
                value.play().catch(() => { /* Autoplay-Blocker ignorieren */ });
            }
            value._wasPlayingBeforePause = false;
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(visit);
        }
    };

    visit(root);
}

const pauseToggleButton = document.getElementById('pause-toggle-button');
const muteToggleButton = document.getElementById('mute-toggle-button');
const pauseOverlay = document.getElementById('pause-overlay');
let isMuted = false;

function openPauseMenu() {
    if (!world) return;
    pauseOverlay.classList.remove('d-none');
    world.pauseGame?.();
    pauseAllAudios(allAudios);
}

function closePauseMenu() {
    if (!world) return;
    pauseOverlay.classList.add('d-none');
    world.resumeGame?.();
    resumeAllAudios(allAudios);
}

pauseToggleButton.addEventListener('click', () => {
    if (!world) return;

    const isOpen = !pauseOverlay.classList.contains('d-none');

    if (isOpen) {
        closePauseMenu();
    } else {
        openPauseMenu();
    }
});

window.addEventListener('keydown', (event) => {
    keyboard.setKeyTrue(event.key);

    const pauseToggleButton = document.getElementById('pause-toggle-button');
    const pauseButtonVisible = !pauseToggleButton.classList.contains('d-none');

    if (event.key === 'Escape' && world && pauseButtonVisible) {
        const isOpen = !pauseOverlay.classList.contains('d-none');
        if (isOpen) {
            closePauseMenu();
        } else {
            openPauseMenu();
        }
    }
});



function restartGameFromCurrentLevel() {
    // Level-Complete-Overlay und Pause-Overlay schließen
    document.getElementById('level-complete-button-box').classList.add('d-none');
    pauseOverlay.classList.add('d-none');

    if (world) world.destroy();
    resetAllAudios(allAudios, { log: true });

    world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
    if (typeof world.initRemainingSetups === "function") {
        world.initRemainingSetups();
    }
    world.startGame();
    document.getElementById('pause-toggle-button').classList.remove('d-none');
    document.getElementById('mute-toggle-button').classList.remove('d-none');
}

// alter Button vom Level-Complete-Screen
document.getElementById('repeat-level-button').addEventListener('click', () => {
    restartGameFromCurrentLevel();
});

// neuer Button im Pause-Menü
document.getElementById('pause-restart-button').addEventListener('click', () => {
    restartGameFromCurrentLevel();
});


function returnToMainMenu() {
    // Level-Complete-Box & Pause-Overlay schließen
    document.getElementById('level-complete-button-box').classList.add('d-none');
    pauseOverlay.classList.add('d-none');
    document.getElementById('pause-toggle-button').classList.add('d-none');
    document.getElementById('mute-toggle-button').classList.add('d-none');

    try {
        fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic, 1000);
    } catch (e) {
        // falls levelCompleteSetup hier noch nicht existiert → ignorieren
    }

    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
    document.getElementById('overlay-startscreen').style.display = 'flex';
    document.getElementById('move-button-box').classList.add('d-none');

    if (document.fullscreenElement) {
        try {
            document.exitFullscreen();
        } catch (err) {
            console.warn('Fehler beim Beenden des Fullscreens:', err);
        }
    }

    if (world) world.destroy();
    resetAllAudios(allAudios, { log: true });

    world = new World(canvas, keyboard, characterImages, entityImages, allAudios);
    if (typeof world.initRemainingSetups === "function") {
        world.initRemainingSetups();
    }
}

document.getElementById('menu-level-button')
    .addEventListener('click', returnToMainMenu);

document.getElementById('pause-menu-main-button')
    .addEventListener('click', returnToMainMenu);

document.getElementById('pause-resume-button').addEventListener('click', () => {
    closePauseMenu();
});

function applyMuteToAllAudios(root) {
    if (!root) return;

    const visit = (value) => {
        if (!value) return;

        const looksLikeAudio =
            typeof value === "object" &&
            typeof value.play === "function" &&
            typeof value.pause === "function" &&
            "currentTime" in value;

        if (looksLikeAudio) {
            value.muted = isMuted;   // 💡 ganz wichtig: nur muted toggeln
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(visit);
        }
    };

    visit(root);
}

// Button-Optik anpassen
function updateMuteButtonUI() {
    if (!muteToggleButton) return;
    muteToggleButton.textContent = isMuted ? "🔇" : "🔊";
}

// Zentraler Setter: State + localStorage + auf alle Audios anwenden
function setMutedState(muted) {
    isMuted = muted;
    localStorage.setItem("elBruenoMuted", muted ? "1" : "0");
    updateMuteButtonUI();
    applyMuteToAllAudios(allAudios);
}

muteToggleButton.addEventListener('click', () => {
    setMutedState(!isMuted);
});

init();

