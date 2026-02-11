import { buildCharacters } from "../config/character-data.js";
import { loadVideo } from "../video-loader.js";
import { template1, template2 } from "../ui/menu-templates.js";

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
        this.currentCharacterMusic = null;
        this.currentCharacterSpeechSound = null;
    }

    setupTitleIntro() {
        this.audioManager.setupTitleMusicChain();
        this.audioManager.setupTitleIntroCue(() => {
            this.uiManager.playTitleAnimation();
        });
    }

    initCharacterData() {
        this.characters = buildCharacters(this.audioManager);
    }

    openCharactersOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        const overlay = document.getElementById('overlay-characters');
        overlay.prepend(submenuBg);
        if (!submenuBg._loaded) {
            submenuBg._loaded = true;
            loadVideo(submenuBg);
        }
        submenuBg.play();
        document.getElementById('overlay-characters').classList.remove('d-none'); //ui
        this.renderCharacters(); //ui
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicIntro, 1000); //audio
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicLoop, 1000); // audio
        this.audioManager.audios.infoScreenMusic.currentTime = 0; // audio
        this.audioManager.fadeInAudio(this.audioManager.audios.infoScreenMusic, 2000); // audio
    }

    renderCharacters() {
        let smallCardBox = document.getElementById('small-card-box');
        smallCardBox.innerHTML = "";
        this.characters.forEach(character => smallCardBox.innerHTML += template1(character.name, character.text));
    }

    renderBigCard(nameCharacter) {
        let bigCardBox = document.getElementById('big-card-box');
        this.openBigBox();
        const character = this.characters.find(element => element.name === nameCharacter);
        if (character) bigCardBox.innerHTML = template2(character.name, character.text2);
        character.music.currentTime = 0;
        this.audioManager.fadeOutAudio(this.audioManager.audios.infoScreenMusic, 1000);
        this.audioManager.fadeInAudio(character.music, 2000, 0.2);
        this.currentCharacterMusic = character.music;
        this.currentCharacterSpeechSound = character.textSpeechSound;
        character.textSpeechSound.currentTime = 0;
        setTimeout(() => {
            this.audioManager.fadeInAudio(character.textSpeechSound, 200);
        }, 2500);
        this.currentCharacterSpeechSound.addEventListener('ended', () => {
            this.audioManager.fadeAudioTo(this.currentCharacterMusic, 2000, 1);
        });
    }

    openBigBox() {
        document.getElementById('overlay-big-card').classList.remove('d-none');
        document.getElementById('body').classList.add('overflow-hidden');
        document.getElementById('overlay-characters').classList.add('blur-effect');
    }

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

function closeCharactersOverlay() {
    allVideos.submenuBg?.pause();
    document.getElementById('overlay-characters').classList.add('d-none');
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