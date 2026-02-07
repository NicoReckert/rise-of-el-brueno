document.getElementById('next-level-button').addEventListener('click', () => {
    world.currentScene = 'townLevel';
    fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic);
    document.getElementById('level-complete-button-box').classList.add('d-none');
});

const pauseToggleButton = document.getElementById('pause-toggle-button');
const fullscreenToggleButton = document.getElementById('fullscreen-toggle-button');
const pauseOverlay = document.getElementById('pause-overlay');


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

// alter Button vom Level-Complete-Screen
document.getElementById('repeat-level-button').addEventListener('click', () => {
    restartGameFromCurrentLevel();
});

// neuer Button im Pause-Menü
document.getElementById('pause-restart-button').addEventListener('click', () => {
    restartGameFromCurrentLevel();
});

document.getElementById('menu-level-button')
    .addEventListener('click', returnToMainMenu);

document.getElementById('pause-menu-main-button')
    .addEventListener('click', returnToMainMenu);

document.getElementById('pause-resume-button').addEventListener('click', () => {
    closePauseMenu();
});

function isFullscreenActive() {
    return !!document.fullscreenElement;
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