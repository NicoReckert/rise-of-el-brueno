export class MenuAudioAndCharacters {
    constructor(audioManager, videoManager, uiManager) {
        this.audioManager = audioManager;
        this.videoManager = videoManager;
        this.uiManager = uiManager;
        this.titleMusic = null;
        this.titleMusic2 = null;
        this.titleSound = null;
        this.welcomeButtonHoverSound = null;
        this.characters = [];
        this.currentCharacterMusic = null;
        this.currentCharacterSpeechSound = null;
        this.titleSoundIsPlayed = false;
    }

    setupTitleIntro() {
        this.audioManager.setupTitleMusicChain();
        this.audioManager.setupTitleIntroCue(() => {
            this.uiManager.playTitleAnimation();
        });
    }

    initWelcomeButton(fullscreenManager, menuVisuals) {
        const btn = document.getElementById("welcome-button");
        btn.addEventListener("click", () => {
            this.playHoverSound();
            fullscreenManager.enter(document.body);
            menuVisuals.startVideo(this.titleMusic);
        });
    }

    playHoverSound() {
        this.welcomeButtonHoverSound.currentTime = 0;
        this.welcomeButtonHoverSound.play();
    }

    initCharacterData() {
        const a = this.audioManager.audios;
        this.characters = buildCharacters(a);
    }



}

function openBigBox() {
    document.getElementById('overlay-big-card').classList.remove('d-none');
    document.getElementById('body').classList.add('overflow-hidden');
    document.getElementById('overlay-info').classList.add('blur-effect');
}

function closeBigBox() {
    document.getElementById('overlay-big-card').classList.add('d-none');
    document.getElementById('body').classList.remove('overflow-hidden');
    document.getElementById('overlay-info').classList.remove('blur-effect');
    fadeOutAudio(currentCharacterMusic, 1000);
    fadeOutAudio(currentCharacterSpeechSound, 1000);
    titleMusic2.currentTime = 0;
    audios.infoScreenMusic.currentTime = 0;
    fadeInAudio(audios.infoScreenMusic, 2000);
}


function openOverlay() {
    const v = allVideos.submenuBg;

    if (!v._loaded) {
        v._loaded = true;
        loadVideo(v);
    }

    v.play();

    document.getElementById('overlay-info').classList.remove('d-none');
    renderCharacters();
    fadeOutAudio(titleMusic, 1000);
    fadeOutAudio(titleMusic2, 1000);
    audios.infoScreenMusic.currentTime = 0;
    fadeInAudio(audios.infoScreenMusic, 2000);
}

function closeOverlay() {
    allVideos.submenuBg?.pause();
    document.getElementById('overlay-info').classList.add('d-none');
    fadeOutAudio(audios.infoScreenMusic, 1000);
    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
}

function openStoryOverlay() {
    const v = allVideos.submenuBg;

    if (!v._loaded) {
        v._loaded = true;
        loadVideo(v);
    }

    v.play();

    document.getElementById('overlay-story').classList.remove('d-none');
    renderStoryCard();
    fadeOutAudio(titleMusic, 1000);
    fadeOutAudio(titleMusic2, 1000);
    audios.infoScreenMusic.currentTime = 0;
    audios.storyTextSpeechSound.currentTime = 0;
    fadeInAudio(audios.infoScreenMusic, 2000, 0.2);
    setTimeout(() => {
        fadeInAudio(audios.storyTextSpeechSound, 200);
    }, 2500);
    audios.storyTextSpeechSound.addEventListener('ended', () => {
        fadeAudioTo(audios.infoScreenMusic, 2000, 1);
    });
}

function closeStoryOverlay() {
    allVideos.submenuBg?.pause();
    document.getElementById('overlay-story').classList.add('d-none');
    fadeOutAudio(audios.infoScreenMusic, 1000);
    fadeOutAudio(audios.storyTextSpeechSound, 1000);
    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
}

function openControlsOverlay() {
    const v = allVideos.submenuBg;

    if (!v._loaded) {
        v._loaded = true;
        loadVideo(v);
    }

    v.play();

    document.getElementById('overlay-controls').classList.remove('d-none');
    renderControlsCard()
    fadeOutAudio(titleMusic, 1000);
    fadeOutAudio(titleMusic2, 1000);
    audios.infoScreenMusic.currentTime = 0;
    fadeInAudio(audios.infoScreenMusic, 2000);
}

function closeControlsOverlay() {
    allVideos.submenuBg?.pause();
    document.getElementById('overlay-controls').classList.add('d-none');
    fadeOutAudio(audios.infoScreenMusic, 1000);
    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
}

function openCreditsOverlay() {
    const v = allVideos.submenuBg;

    if (!v._loaded) {
        v._loaded = true;
        loadVideo(v);
    }

    v.play();

    document.getElementById('overlay-credits').classList.remove('d-none');
    renderCreditsCard();
    fadeOutAudio(titleMusic, 1000);
    fadeOutAudio(titleMusic2, 1000);
    audios.infoScreenMusic.currentTime = 0;
    fadeInAudio(audios.infoScreenMusic, 2000);
}

function closeCreditsOverlay() {
    allVideos.submenuBg?.pause();
    document.getElementById('overlay-credits').classList.add('d-none');
    fadeOutAudio(audios.infoScreenMusic, 1000);
    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
}


function renderStoryCard() {
    let storyBox = document.getElementById('story-box');
    storyBox.innerHTML = template3(storyText);
}

function renderControlsCard() {
    let controlsBox = document.getElementById('controls-box');
    controlsBox.innerHTML = template4();
}

function renderCreditsCard() {
    let creditsBox = document.getElementById('credits-box');
    creditsBox.innerHTML = template5();
}



function renderBigCard(nameCharacter) {
    let bigCardBox = document.getElementById('big-card-box');
    openBigBox();
    const character = characters.find(element => element.name === nameCharacter);
    if (character) bigCardBox.innerHTML = template2(character.name, character.text2);
    character.music.currentTime = 0;
    fadeOutAudio(audios.infoScreenMusic, 1000);
    fadeInAudio(character.music, 2000, 0.2);
    currentCharacterMusic = character.music;
    currentCharacterSpeechSound = character.textSpeechSound;
    character.textSpeechSound.currentTime = 0;
    setTimeout(() => {
        fadeInAudio(character.textSpeechSound, 200);
    }, 2500);
    currentCharacterSpeechSound.addEventListener('ended', () => {
        fadeAudioTo(currentCharacterMusic, 2000, 1);
    });
}


function renderCharacters() {
    // document.getElementById('test-video').play();
    let smallCardBox = document.getElementById('small-card-box');
    smallCardBox.innerHTML = "";
    characters.forEach(character => smallCardBox.innerHTML += template1(character.name, character.text));
}