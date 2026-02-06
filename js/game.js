import { World } from '../classes/world.class.js';
import { allAudios } from '../media-store.js';
import { initScriptAudioIntro, initScriptVisuals } from '../script.js';
import { initScriptAudio } from '../script.js';
import { stopTitleMusic } from '../script.js';
import { fadeInTitleMusic } from '../script.js';
import { preloadManifestAudio } from '../audio-loader.js';
import { fadeOutAudio } from '../script.js';
import { introAudioManifest } from '../audio-manifest.js';
import { farmAudioManifestImmediate } from '../audio-manifest.js';
import { farmAudioManifestDeferred } from '../audio-manifest.js';
import { otherLevelAudioManifestLazy } from '../audio-manifest.js';
import { characterManifestImmediate } from '../character-image-manifest.js';
import { characterManifestDeferred } from '../character-image-manifest.js';
import { otherLevelCharacterManifestLazy } from '../character-image-manifest.js';
import { farmEntityManifestImmediate } from '../entity-image-manifest.js';
import { farmEntityManifestDeferred } from '../entity-image-manifest.js';
import { otherLevelEntityManifestLazy } from '../entity-image-manifest.js';
import { preloadManifestImages } from '../image-loader.js';
import { preloadManifestVideos } from '../video-loader.js';
import { farmVideoManifestDeferred } from '../video-manifest.js';

let canvas;
let world;
let characterImages = {};
let entityImages = {};
let progressValue = 0;

async function init() {
    const overlay = document.getElementById('loading-overlay');
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');

    // 0–5%: kleines Fake-Intro („Preparing experience…“)
    await smoothFillProgress(
        bar,
        text,
        0,
        5,
        400,
        {
            showPercent: false,
            label: "Preparing experience…"
        }
    );

    // Menü-Videos + Intro-Audios laden
    await initScriptVisuals();
    await preloadManifestAudio(introAudioManifest);
    initScriptAudioIntro();

    // === AB HIER: echter Fortschritt für alle Immediate-Assets (Bilder + Audio) ===

    const manifests = [
        characterManifestImmediate,
        farmEntityManifestImmediate,
        farmAudioManifestImmediate
    ];

    const totalFiles = countManifestFiles(manifests);
    let loaded = 0;

    // Ab 5% geht es „real“ los, bis ca. 70%
    const BASE_PROGRESS = 5;
    const REAL_PROGRESS_RANGE = 65; // 5 → 70

    const updateProgress = (label = "Loading assets…") => {
        const percent =
            BASE_PROGRESS +
            Math.round((loaded / totalFiles) * REAL_PROGRESS_RANGE);

        setProgress(bar, percent);
        text.textContent = `${label} ${percent}%`;
    };

    const onFileLoaded = () => {
        loaded++;
        updateProgress();
    };

    // Direkt nach Setup einmal anzeigen
    updateProgress("Loading assets…");

    // Bilder + Audio parallel laden, alle zählen in denselben Fortschritt
    const [chars, entities] = await Promise.all([
        preloadManifestImages(characterManifestImmediate, onFileLoaded),
        preloadManifestImages(farmEntityManifestImmediate, onFileLoaded),
        preloadManifestAudio(farmAudioManifestImmediate, onFileLoaded)
    ]);

    // Jetzt sollten wir irgendwo um 70% herum sein
    initScriptAudio();

    // 70 → 100%: kleiner „Finishing“-Fake
    await smoothFillProgress(
        bar,
        text,
        progressValue || 70,
        100,
        600,
        { label: "Finalizing…" }
    );

    Object.assign(characterImages, chars);
    smartMerge(entityImages, entities);

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
    world = new World(canvas, characterImages, entityImages, allAudios);
    listenStartButton();

    loadDeferredAssets();
    loadLazyAssets();
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
        const [charDeferred, entityDeferred] = await Promise.all([
            preloadManifestImages(characterManifestDeferred),
            preloadManifestImages(farmEntityManifestDeferred),
            preloadManifestAudio(farmAudioManifestDeferred),
            // preloadManifestVideos(farmVideoManifestDeferred)
        ]);

        Object.assign(characterImages, charDeferred);
        smartMerge(world.entityImages, entityDeferred);

        if (isMuted) {
            applyMuteToAllAudios(allAudios);
        }

        if (world) {
            Object.assign(world.characterImages, charDeferred);
            smartMerge(world.entityImages, entityDeferred);
            world.character?.initMovementImages();
            world.character?.initEmotionImages();
            world.character?.initActionImages();
            world.character?.initSpecialImages();
        }
    } catch { }

    try {
        await preloadManifestVideos(farmVideoManifestDeferred);
        console.log('[loadDeferredAssets] videos loaded');
    } catch (e) {
        console.warn('[loadDeferredAssets] video preload failed:', e);
    }
}

async function loadLazyAssets() {
    try {
        await new Promise(r =>
            ("requestIdleCallback" in window)
                ? requestIdleCallback(r, { timeout: 1500 })
                : setTimeout(r, 1500)
        );

        const [charLazy, entityLazy] = await Promise.all([
            preloadManifestImages(otherLevelCharacterManifestLazy),
            preloadManifestImages(otherLevelEntityManifestLazy),
            preloadManifestAudio(otherLevelAudioManifestLazy)
        ]);

        Object.assign(characterImages, charLazy, world.characterImages);
        smartMerge(world.entityImages, entityLazy);

        if (isMuted) {
            applyMuteToAllAudios(allAudios);
        }


        world.character?.initMovementImages();
        world.character?.initEmotionImages();
        world.character?.initActionImages();
        world.character?.initSpecialImages();

        // ✅ Alle Lazy-Assets geladen → zusätzliche Level initialisieren
        if (world && typeof world.initRemainingSetups === "function") {
            world.initRemainingSetups();
        }

    } catch { }
}

function smartMerge(target, source) {
    if (!source || typeof source !== "object") return target || {};
    if (!target || typeof target !== "object") target = {};

    for (const [key, value] of Object.entries(source)) {
        // 🔹 Sprite-Sheet: nicht rekursiv mergen, sondern komplett übernehmen
        if (value && typeof value === "object" && !Array.isArray(value) && value.type === "sheet") {
            target[key] = value;
            continue;
        }

        if (value && typeof value === "object" && !Array.isArray(value)) {
            if (!target[key] || typeof target[key] !== "object") {
                target[key] = {};
            }
            smartMerge(target[key], value);
        } else {
            target[key] = value;
        }
    }

    return target;
}


function smoothFillProgress(
    bar,
    text,
    from,
    to,
    duration = 600,
    { showPercent = true, label = "Loading..." } = {}
) {
    return new Promise(resolve => {
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.round(from + (to - from) * progress);

            setProgress(bar, value);


            if (showPercent) {
                text.textContent = `${label} ${value}%`;
            } else {
                text.textContent = label;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(step);
    });
}

function setProgress(bar, value) {
    progressValue = Math.max(progressValue, value);
    bar.style.width = `${progressValue}%`;
}












window.addEventListener('keyup', (event) => {
    world.keyboard?.setKeyFalse(event.key);
});

function setFullscreen() {
    enterFullscreen();
}

document.getElementById('next-level-button').addEventListener('click', () => {
    world.currentScene = 'townLevel';
    fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic);
    document.getElementById('level-complete-button-box').classList.add('d-none');
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
        document.getElementById('fullscreen-toggle-button').classList.remove('d-none');
        document.getElementById('move-button-box').classList.add('move-button-box-active');
        // document.getElementById('background-music').play();
        // this.character.playSpeakSound();
        setFullscreen();
        stopTitleMusic();
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

const pauseToggleButton = document.getElementById('pause-toggle-button');
const muteToggleButton = document.getElementById('mute-toggle-button');
const fullscreenToggleButton = document.getElementById('fullscreen-toggle-button');
const pauseOverlay = document.getElementById('pause-overlay');
let isMuted = false;

function openPauseMenu() {
    if (!world) return;
    pauseOverlay.classList.remove('d-none');
    world.pauseGame?.();
    pauseAllAudios(allAudios);
    document.getElementById('move-button-box').classList.remove('move-button-box-active');

}

function closePauseMenu() {
    if (!world) return;
    pauseOverlay.classList.add('d-none');
    world.resumeGame?.();
    resumeAllAudios(allAudios);
    document.getElementById('move-button-box').classList.add('move-button-box-active');

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
    world.keyboard?.setKeyTrue(event.key);

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

    world = new World(canvas, characterImages, entityImages, allAudios);
    if (typeof world.initRemainingSetups === "function") {
        world.initRemainingSetups();
    }
    world.startGame();
    document.getElementById('pause-toggle-button').classList.remove('d-none');
    document.getElementById('mute-toggle-button').classList.remove('d-none');
    document.getElementById('fullscreen-toggle-button').classList.remove('d-none');
    document.getElementById('move-button-box').classList.add('move-button-box-active');
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
    document.getElementById('fullscreen-toggle-button').classList.add('d-none');
    document.getElementById('move-button-box').classList.remove('move-button-box-active');


    try {
        fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic, 1000);
    } catch (e) {
        // falls levelCompleteSetup hier noch nicht existiert → ignorieren
    }

    fadeInTitleMusic();
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

    world = new World(canvas, characterImages, entityImages, allAudios);
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

function isFullscreenActive() {
    return !!document.fullscreenElement;
}

function enterFullscreen() {
    const content = document.getElementById('canvas-button-box');
    if (content.requestFullscreen) {
        content.requestFullscreen({ navigationUI: "hide" }).catch(() => { });
    }
}

function exitFullscreen() {
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
    }
}

function updateFullscreenButtonUI() {
    if (!fullscreenToggleButton) return;
    fullscreenToggleButton.textContent = isFullscreenActive() ? "🡼" : "⛶";
}

fullscreenToggleButton.addEventListener('click', () => {
    if (isFullscreenActive()) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    updateFullscreenButtonUI();
});




init();

