let titleMusic = new Audio('./assets/audio/title-music.opus');
let titleMusic2 = new Audio('./assets/audio/title-music2.opus');
let titleSound = new Audio('./assets/audio/title-sound5.opus');
let welcomeButtonHoverSound = new Audio('./assets/audio/ui-tuping-391160.opus');
let titleSoundIsPlayed = false;
let videos = {};

function startVideo() {
    let video = document.getElementById('background-video');
    let video2 = document.getElementById('start-initialisation-video2');
    video2.classList.remove('opacity-none');
    video2.classList.add('animation-video2');
    video2.play();
    video.load();
    titleMusic.play();
    titleMusic2.load();
    setTimeout(() => {
        video.play();
        video.playbackRate = 1.0;
        video.loop = true;
        document.getElementById('overlay-start-initialisation').classList.add('animation-overlay-fade-out');
        document.getElementById('overlay-startscreen').classList.remove('opacity-none');
        setTimeout(() => {
            document.getElementById('overlay-start-initialisation').classList.add('opacity-none');
        }, 400);
    }, 23000);
}

function playHoverSound() {
    welcomeButtonHoverSound.currentTime = 0;
    welcomeButtonHoverSound.play();
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
        setTimeout(() => {
            document.getElementById('h1').classList.remove('before-animation');
        }, 800);
    }
});

async function init2() {
    // 1. Intro sofort laden
    await attachVideoSource("start-initialisation-video", videoManifest.intro);

    // 2. Vorspann-Video im Hintergrund schon vorbereiten
    attachVideoSource("start-initialisation-video2", videoManifest.vorspann);

    // 3. Klick startet es sofort
    // document.getElementById("welcome-button").addEventListener("click", () => {
    //     const video2 = document.getElementById("start-initialisation-video2");
    //     video2.play();
    // });


    // 3. Hintergrund-Videos nebenbei (ohne zu blockieren) laden
    Promise.allSettled([
        attachVideoSource("background-video", videoManifest.background),
        attachVideoSource("earth-video", videoManifest.earth),
        attachVideoSource("portal-video", videoManifest.portal),
        attachVideoSource("thunder-video", videoManifest.thunder)
    ]);
}

// init();

