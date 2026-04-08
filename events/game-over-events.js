export const gameOverEvents = [
    /**
     * Quest event that shows the game over video, starts music,
     * and displays related overlay elements.
     */
    {
        type: 'quest',
        action: (setup) => {
            if (!setup.video) return;
            setup.video.classList.remove('d-none');
            setup.video.currentTime = 0;
            setup.video.loop = true;
            setup.video.play();
            setup.sounds.gameOverMusic.loop = true;
            setup.world.audioManager.fadeInAudio(setup.sounds.gameOverMusic, 2000, 0.8);
            document.getElementById('game-over-actions')?.classList.remove('d-none');
            document.getElementById('game-over-video-overlay')?.classList.remove('d-none');
            document.getElementById('game-over-video-vignette')?.classList.remove('d-none');
            document.getElementById('game-over-video-light')?.classList.remove('d-none');
        }
    }
];