const levelCompleteEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.sounds.levelCompleteMusic.loop = true;
                setup.sounds.levelCompleteMusic.play();
                setup.sounds.levelCompleteSound.play();
                setup.video.play();
                setup.npcs.levelComplete.isFlipped = false;
            }
        }
    ]