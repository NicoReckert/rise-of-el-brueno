let titleMusic = new Audio('./assets/audio/title-music.mp3');
let titleMusic2 = new Audio('./assets/audio/title-music2.mp3');
let titleSound = new Audio('./assets/audio/title-sound5.mp3');
let titleSoundIsPlayed = false;

function startVideo() {
    let video = document.getElementById('background-video');
    video.play();
    video.playbackRate = 0.8;
    titleMusic.play();
    titleMusic2.load();
}

titleMusic.addEventListener("ended", () => {
    titleMusic2.play();
    titleMusic2.loop = true;
});

const title = document.querySelector("h1");
title.addEventListener("animationend", () => {
    titleSound.play();
});

titleMusic.addEventListener('timeupdate', () => {
    if (titleMusic.currentTime >= 22.8 && !titleSoundIsPlayed) {
        titleSound.play();
        document.getElementById('h1').classList.add('animation');
        titleSoundIsPlayed = true;
    }
});