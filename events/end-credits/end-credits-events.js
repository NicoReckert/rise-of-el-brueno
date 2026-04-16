export const endCreditsEvents =
    [
        /**
         * Quest event that starts the video playback if available.
         */
        {
            type: 'quest',
            action: (setup) => {
                if (!setup.video) return;
                setup.video.classList.remove('d-none');
                setup.video.currentTime = 0;
                setup.video.loop = false;
                setup.video.play();
                setup.world.uiManager.showEndCreditsState();
            }
        },

        /**
         * Quest event that triggers the end credits menu button
         * when the video has ended.
         */
        {
            type: 'quest',
            condition: (setup) => setup.video && setup.video.ended,
            action: () => {
                document.getElementById('end-credits-menu-button').click();
            }
        }
    ]