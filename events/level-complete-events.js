export const levelCompleteEvents =
    [
        /**
         * Quest event that plays level completion audio and video,
         * updates the completion character state, and shows the UI button box.
         */
        {
            type: 'quest',
            action: (setup) => {
                setup.sounds.levelCompleteMusic.loop = true;
                setup.sounds.levelCompleteMusic.play();
                setup.sounds.levelCompleteSound.play();
                setup.video.loop = true;
                setup.video.play();
                setup.characters.levelCompleteCharacter.isFlipped = false;
                document.getElementById('level-complete-button-box').classList.remove('d-none');
            }
        }
    ]