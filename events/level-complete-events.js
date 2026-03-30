export const levelCompleteEvents =
    [
        /**
         * Quest event that plays level completion audio and video,
         * updates the completion character state, and shows the UI button box.
         */
        {
            type: 'quest',
            action: (setup) => {
                setup.characters.levelCompleteCharacter.x = 290;
                setup.world.camera_x = 0;
                setup.sounds.levelCompleteMusic.loop = true;
                setup.sounds.levelCompleteMusic.play();
                setup.sounds.voLevelComplete01.play();
                setup.video.loop = true;
                setup.video.play();
                setup.characters.levelCompleteCharacter.isFlipped = false;
                document.getElementById('level-complete-actions').classList.remove('d-none');
            }
        }
    ]