export const levelCompleteEvents =
    [
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