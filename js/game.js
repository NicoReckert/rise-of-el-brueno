



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