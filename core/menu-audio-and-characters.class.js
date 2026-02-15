import { buildCharacters } from "../config/character-data.js";
import { loadVideo } from "../loader/video-loader.js";
import { template1, template2 } from "../ui/menu-templates.js";
import { template3 } from "../ui/menu-templates.js";
import { storyText } from "../config/story-text.js";
import { template4 } from "../ui/menu-templates.js";
import { controls } from "../config/controls-config.js";
import { template5 } from "../ui/menu-templates.js";

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
        this.storySpeechTimeout = null;
        this.characterSpeechTimeout = null;
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
        this.resetCharacterSpeechState();
        this.scheduleCharacterSpeechFadeIn();
        this.currentCharacterSpeechSound.onended = () => {
            this.audioManager.fadeAudioTo(this.currentCharacterMusic, 2000, 1);
        };
    }

    resetCharacterSpeechState() {
        const speech = this.currentCharacterSpeechSound;
        if (!speech) return;

        if (this.characterSpeechTimeout) {
            clearTimeout(this.characterSpeechTimeout);
            this.characterSpeechTimeout = null;
        }

        speech.pause();
        speech.currentTime = 0;
    }

    scheduleCharacterSpeechFadeIn() {
        const speech = this.currentCharacterSpeechSound;
        if (!speech) return;

        this.characterSpeechTimeout = setTimeout(() => {
            this.audioManager.fadeInAudio(speech, 200);
            this.characterSpeechTimeout = null;
        }, 2500);
    }

    stopCharacterSpeech(fadeDuration = 0) {
        const speech = this.currentCharacterSpeechSound;
        if (!speech) return;
        if (this.characterSpeechTimeout) {
            clearTimeout(this.characterSpeechTimeout);
            this.characterSpeechTimeout = null;
        }
        if (fadeDuration > 0) {
            this.audioManager.fadeOutAudio(speech, fadeDuration);
        } else {
            speech.pause();
            speech.currentTime = 0;
        }
        speech.onended = null;
    }

    openBigBox() {
        document.getElementById('overlay-big-card').classList.remove('d-none');
        document.getElementById('body').classList.add('overflow-hidden');
        document.getElementById('overlay-characters').classList.add('blur-effect');
    }

    closeBigBox() {
        document.getElementById('overlay-big-card').classList.add('d-none');
        document.getElementById('body').classList.remove('overflow-hidden');
        document.getElementById('overlay-characters').classList.remove('blur-effect');
        this.audioManager.fadeOutAudio(this.currentCharacterMusic, 1000);
        this.stopCharacterSpeech(1000);
        this.audioManager.audios.titleMusicLoop.currentTime = 0;
        this.audioManager.audios.infoScreenMusic.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.infoScreenMusic, 2000);
    }

    closeCharactersOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        submenuBg?.pause();
        document.getElementById('overlay-characters').classList.add('d-none');
        this.stopCharacterSpeech(500);
        this.audioManager.fadeOutAudio(this.audioManager.audios.infoScreenMusic, 1000);
        this.audioManager.audios.titleMusicLoop.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.titleMusicLoop, 2000);
    }

    openStoryOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        if (!submenuBg._loaded) {
            submenuBg._loaded = true;
            loadVideo(submenuBg);
        }
        submenuBg.play();
        document.getElementById('overlay-story').classList.remove('d-none');
        const overlay = document.getElementById('overlay-story');
        overlay.prepend(submenuBg);
        this.renderStoryCard();
        const infoMusic = this.audioManager.audios.infoScreenMusic;
        const speech = this.audioManager.audios.storyTextSpeechSound;
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicIntro, 1000);
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicLoop, 1000);
        this.resetStorySpeechState(speech);
        infoMusic.currentTime = 0;
        this.audioManager.fadeInAudio(infoMusic, 2000, 0.2);
        this.scheduleStorySpeechFadeIn(speech);
        speech.onended = () => {
            this.audioManager.fadeAudioTo(infoMusic, 2000, 1);
        };
    }

    resetStorySpeechState(speech) {
        if (!speech) return;

        if (this.storySpeechTimeout) {
            clearTimeout(this.storySpeechTimeout);
            this.storySpeechTimeout = null;
        }

        speech.pause();
        speech.currentTime = 0;
    }

    scheduleStorySpeechFadeIn(speech) {
        if (!speech) return;

        this.storySpeechTimeout = setTimeout(() => {
            this.audioManager.fadeInAudio(speech, 200);
            this.storySpeechTimeout = null;
        }, 2500);
    }

    stopStorySpeech(fadeDuration = 0) {
        const speech = this.audioManager.audios.storyTextSpeechSound;
        if (!speech) return;

        if (this.storySpeechTimeout) {
            clearTimeout(this.storySpeechTimeout);
            this.storySpeechTimeout = null;
        }

        if (fadeDuration > 0) {
            this.audioManager.fadeOutAudio(speech, fadeDuration);
        } else {
            speech.pause();
            speech.currentTime = 0;
        }

        speech.onended = null;
    }


    renderStoryCard() {
        let storyBox = document.getElementById('story-box');
        storyBox.innerHTML = template3(storyText);
    }

    closeStoryOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        submenuBg?.pause();
        document.getElementById('overlay-story').classList.add('d-none');
        this.audioManager.fadeOutAudio(this.audioManager.audios.infoScreenMusic, 1000);
        this.stopStorySpeech(1000);
        this.audioManager.audios.titleMusicLoop.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.titleMusicLoop, 2000);
    }

    openControlsOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        if (!submenuBg._loaded) {
            submenuBg._loaded = true;
            loadVideo(submenuBg);
        }
        submenuBg.play();
        const overlay = document.getElementById('overlay-controls');
        overlay.prepend(submenuBg);
        document.getElementById('overlay-controls').classList.remove('d-none');
        this.renderControlsCard();
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicIntro, 1000);
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicLoop, 1000);
        this.audioManager.audios.infoScreenMusic.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.infoScreenMusic, 2000);
    }

    renderControlsCard() {
        let controlsBox = document.getElementById('controls-box');
        controlsBox.innerHTML = template4(controls);
    }

    closeControlsOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        submenuBg?.pause();
        document.getElementById('overlay-controls').classList.add('d-none');
        this.audioManager.fadeOutAudio(this.audioManager.audios.infoScreenMusic, 1000);
        this.audioManager.audios.titleMusicLoop.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.titleMusicLoop, 2000);
    }

    openCreditsOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        if (!submenuBg._loaded) {
            submenuBg._loaded = true;
            loadVideo(submenuBg);
        }
        submenuBg.play();
        const overlay = document.getElementById('overlay-credits');
        overlay.prepend(submenuBg);
        document.getElementById('overlay-credits').classList.remove('d-none');
        this.renderCreditsCard();
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicIntro, 1000);
        this.audioManager.fadeOutAudio(this.audioManager.audios.titleMusicLoop, 1000);
        this.audioManager.audios.infoScreenMusic.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.infoScreenMusic, 2000);
    }

    renderCreditsCard() {
        let creditsBox = document.getElementById('credits-box');
        creditsBox.innerHTML = template5();
    }

    closeCreditsOverlay() {
        const submenuBg = this.videoManager.get("submenuBg");
        submenuBg?.pause();
        document.getElementById('overlay-credits').classList.add('d-none');
        this.audioManager.fadeOutAudio(this.audioManager.audios.infoScreenMusic, 1000);
        this.audioManager.audios.titleMusicLoop.currentTime = 0;
        this.audioManager.fadeInAudio(this.audioManager.audios.titleMusicLoop, 2000);
    }
}