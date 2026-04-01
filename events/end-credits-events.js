export const endCreditsEvents =
    [
        /**
         * Quest event that starts the video playback if available.
         */
        {
            type: 'quest',
            action: (setup) => {
                if (!setup.video) return;
                setup.video.loop = false;
                setup.video.play();
                document.getElementById('end-credits-actions').classList.remove('d-none');
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