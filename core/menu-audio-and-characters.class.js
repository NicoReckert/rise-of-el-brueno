import { buildCharacters } from "../config/character-data.js";
import { loadVideo } from "../loader/video-loader.js";
import { storyText } from "../config/story-text.js";
import { controls } from "../config/controls-config.js";

/**
 * Handles menu audio playback and character-related UI behavior.
 */
export class MenuAudioAndCharacters {
    /**
     * Creates a new MenuAudioAndCharacters instance.
     * @param {Object} audioManager Audio manager instance.
     * @param {Object} videoManager Video manager instance.
     * @param {Object} uiManager UI manager instance.
     */
    constructor(audioManager, videoManager, uiManager) {
        this.audioManager = audioManager;
        this.videoManager = videoManager;
        this.uiManager = uiManager;
        this.initCharacterState();
        this.initSpeechState();
    }

    /**
     * Initializes character-related state for the menu.
     * @returns {void}
     */
    initCharacterState() {
        this.characters = [];
        this.currentCharacterMusic = null;
        this.currentCharacterSpeechSound = null;
    }

    /**
     * Initializes speech-related timeout state.
     * @returns {void}
     */
    initSpeechState() {
        this.storySpeechTimeout = null;
        this.characterSpeechTimeout = null;
    }

    /**
     * Configures title intro audio and animation triggers.
     * @returns {void}
     */
    setupTitleIntro() {
        this.audioManager.setupTitleMusicChain();
        this.audioManager.setupTitleIntroCue(() => {
            this.uiManager.playTitleAnimation();
        });
    }

    /**
     * Initializes character data for the menu.
     * @returns {void}
     */
    initCharacterData() {
        this.characters = buildCharacters(this.audioManager);
    }

    /**
     * Opens the characters overlay and initializes related UI and audio.
     * @returns {void}
     */
    openCharactersOverlay() {
        const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.overlayCharacters);
        if (!submenuBg) return;
        this.uiManager.showCharactersOverlay();
        this.uiManager.renderCharacterCards(this.characters);
        this.startInfoScreenMusic();
    }

    /**
     * Renders the detailed character card and starts related audio and speech.
     * @param {string} nameCharacter Character identifier.
     * @returns {void}
     */
    renderBigCard(nameCharacter) {
        const state = this.getBigCardState(nameCharacter);
        if (!state) return;
        this.showBigCard(state.character);
        this.startBigCardAudio(state);
        this.prepareBigCardSpeech(state);
    }

    /**
     * Resolves the state required to render a character big card.
     * @param {string} nameCharacter Character identifier.
     * @returns {{character:Object, infoScreenMusic:Object}|null} Big card state or null.
     */
    getBigCardState(nameCharacter) {
        const character = this.characters.find(c => c.name === nameCharacter);
        const infoScreenMusic = this.audioManager.get('infoScreenMusic');
        if (!character || !infoScreenMusic) return null;
        return { character, infoScreenMusic };
    }

    /**
     * Displays the big character card overlay.
     * @param {Object} character Character data.
     * @returns {void}
     */
    showBigCard(character) {
        this.uiManager.showBigCardOverlay();
        this.uiManager.renderBigCharacterCard(character);
    }

    /**
     * Starts the character-specific audio for the big card view.
     * @param {{character:Object, infoScreenMusic:Object}} state Big card state.
     * @returns {void}
     */
    startBigCardAudio({ character, infoScreenMusic }) {
        character.music.currentTime = 0;
        this.audioManager.fadeOutAudio(infoScreenMusic, 1000);
        this.audioManager.fadeInAudio(character.music, 2000, 0.2);
        this.currentCharacterMusic = character.music;
    }

    /**
     * Prepares speech playback for the big character card.
     * @param {{character:Object}} state Big card state.
     * @returns {void}
     */
    prepareBigCardSpeech({ character }) {
        this.currentCharacterSpeechSound = character.textSpeechSound;
        this.resetSpeechState(this.currentCharacterSpeechSound, 'characterSpeechTimeout');
        this.scheduleSpeechFadeIn(this.currentCharacterSpeechSound, 'characterSpeechTimeout');
        this.bindBigCardSpeechEnd();
    }

    /**
     * Binds the speech end event to restore character music volume.
     * @returns {void}
     */
    bindBigCardSpeechEnd() {
        if (!this.currentCharacterSpeechSound) return;
        this.currentCharacterSpeechSound.onended = () => {
            this.audioManager.fadeAudioTo(this.currentCharacterMusic, 2000, 1);
        };
    }

    /**
     * Closes the big character card and restores the info screen state.
     * @returns {void}
     */
    closeBigBox() {
        this.uiManager.hideBigCardOverlay();
        this.audioManager.fadeOutAudio(this.currentCharacterMusic, 1000);
        this.stopSpeech(this.currentCharacterSpeechSound, 'characterSpeechTimeout', 1000);
        this.returnToInfoScreenMusic();
    }

    /**
     * Closes the characters overlay and restores the menu state.
     * @returns {void}
     */
    closeCharactersOverlay() {
        this.pauseSubmenuBg();
        this.uiManager.hideCharactersOverlay();
        this.stopSpeech(this.currentCharacterSpeechSound, 'characterSpeechTimeout', 500);
        this.returnToTitleLoop();
    }

    /**
     * Opens the story overlay and prepares its audio state.
     * @returns {void}
     */
    openStoryOverlay() {
        const state = this.getStoryOverlayState();
        if (!state) return;
        this.showStoryOverlay();
        this.prepareStoryAudio(state);
    }

    /**
     * Resolves the state required to open the story overlay.
     * @returns {{infoScreenMusic:Object, speech:Object}|null} Story overlay state or null.
     */
    getStoryOverlayState() {
        const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.overlayStory);
        const infoScreenMusic = this.audioManager.get('infoScreenMusic');
        const speech = this.audioManager.get('storyTextSpeechSound');
        if (!submenuBg || !infoScreenMusic) return null;
        return { infoScreenMusic, speech };
    }

    /**
     * Displays the story overlay and renders the story content.
     * @returns {void}
     */
    showStoryOverlay() {
        this.uiManager.showStoryOverlay();
        this.uiManager.renderStoryCard(storyText);
    }

    /**
     * Prepares audio playback for the story overlay.
     * @param {{infoScreenMusic:Object, speech:Object}} state Story overlay state.
     * @returns {void}
     */
    prepareStoryAudio({ infoScreenMusic, speech }) {
        this.resetSpeechState(speech, 'storySpeechTimeout');
        this.startInfoScreenMusic(0.2);
        this.scheduleSpeechFadeIn(speech, 'storySpeechTimeout');
        this.bindStorySpeechEnd(infoScreenMusic, speech);
    }

    /**
     * Binds the speech end event to restore info screen music volume.
     * @param {Object} infoScreenMusic Info screen music audio.
     * @param {Object} speech Speech audio element.
     * @returns {void}
     */
    bindStorySpeechEnd(infoScreenMusic, speech) {
        if (!speech) return;
        speech.onended = () => {
            this.audioManager.fadeAudioTo(infoScreenMusic, 2000, 1);
        };
    }

    /**
     * Closes the story overlay and restores the menu state.
     * @returns {void}
     */
    closeStoryOverlay() {
        this.pauseSubmenuBg();
        this.uiManager.hideStoryOverlay();
        this.stopSpeech(this.audioManager.get('storyTextSpeechSound'), 'storySpeechTimeout', 1000);
        this.returnToTitleLoop();
    }

    /**
     * Opens the controls overlay and initializes related UI and audio.
     * @returns {void}
     */
    openControlsOverlay() {
        const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.overlayControls);
        if (!submenuBg) return;
        this.uiManager.showControlsOverlay();
        this.uiManager.renderControlsCard(controls);
        this.startInfoScreenMusic();
    }

    /**
     * Closes the controls overlay and restores the menu state.
     * @returns {void}
     */
    closeControlsOverlay() {
        this.pauseSubmenuBg();
        this.uiManager.hideControlsOverlay();
        this.returnToTitleLoop();
    }

    /**
     * Opens the credits overlay and initializes related UI and audio.
     * @returns {void}
     */
    openCreditsOverlay() {
        const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.overlayCredits);
        if (!submenuBg) return;
        this.uiManager.showCreditsOverlay();
        this.uiManager.renderCreditsCard();
        this.startInfoScreenMusic();
    }

    /**
     * Closes the credits overlay and restores the menu state.
     * @returns {void}
     */
    closeCreditsOverlay() {
        this.pauseSubmenuBg();
        this.uiManager.hideCreditsOverlay();
        this.returnToTitleLoop();
    }

    /**
     * Prepares and attaches the submenu background video to an overlay.
     * @param {HTMLElement} overlay Overlay element.
     * @returns {HTMLVideoElement|null} Background video or null if unavailable.
     */
    prepareSubmenuBg(overlay) {
        const video = this.videoManager.get("submenuBg");
        if (!video) return null;
        this.uiManager.attachVideoToOverlay(overlay, video);
        if (!video._loaded) {
            video._loaded = true;
            loadVideo(video);
        }
        video.play();
        return video;
    }

    /**
     * Starts the info screen music with a fade-in.
     * @param {number} [targetVolume=1] Target volume level.
     * @returns {void}
     */
    startInfoScreenMusic(targetVolume = 1) {
        const titleMusicIntro = this.audioManager.get('titleMusicIntro');
        const titleMusicLoop = this.audioManager.get('titleMusicLoop');
        const infoScreenMusic = this.audioManager.get('infoScreenMusic');
        if (!infoScreenMusic) return;
        this.audioManager.fadeOutAudio(titleMusicIntro, 1000);
        this.audioManager.fadeOutAudio(titleMusicLoop, 1000);
        infoScreenMusic.currentTime = 0;
        this.audioManager.fadeInAudio(infoScreenMusic, 2000, targetVolume);
    }

    /**
     * Restores the title loop music and fades out the info screen music.
     * @returns {void}
     */
    returnToTitleLoop() {
        const titleMusicLoop = this.audioManager.get('titleMusicLoop');
        const infoScreenMusic = this.audioManager.get('infoScreenMusic');
        if (!titleMusicLoop) return;
        this.audioManager.fadeOutAudio(infoScreenMusic, 1000);
        titleMusicLoop.currentTime = 0;
        this.audioManager.fadeInAudio(titleMusicLoop, 2000);
    }

    /**
     * Pauses the submenu background video.
     * @returns {void}
     */
    pauseSubmenuBg() {
        this.videoManager.get("submenuBg")?.pause();
    }

    /**
     * Restarts the info screen music with a fade-in.
     * @returns {void}
     */
    returnToInfoScreenMusic() {
        const infoScreenMusic = this.audioManager.get('infoScreenMusic');
        if (!infoScreenMusic) return;
        infoScreenMusic.currentTime = 0;
        this.audioManager.fadeInAudio(infoScreenMusic, 2000);
    }

    /**
     * Clears a speech-related timeout by key.
     * @param {string} timeoutKey Timeout property name.
     * @returns {void}
     */
    clearSpeechTimeout(timeoutKey) {
        if (!this[timeoutKey]) return;
        clearTimeout(this[timeoutKey]);
        this[timeoutKey] = null;
    }

    /**
     * Resets speech playback and clears its associated timeout.
     * @param {HTMLMediaElement} speech Speech audio element.
     * @param {string} timeoutKey Timeout property name.
     * @returns {void}
     */
    resetSpeechState(speech, timeoutKey) {
        if (!speech) return;
        this.clearSpeechTimeout(timeoutKey);
        speech.pause();
        speech.currentTime = 0;
    }

    /**
     * Schedules a speech audio fade-in and stores its timeout key.
     * @param {HTMLMediaElement} speech Speech audio element.
     * @param {string} timeoutKey Timeout property name.
     * @returns {void}
     */
    scheduleSpeechFadeIn(speech, timeoutKey) {
        if (!speech) return;
        this[timeoutKey] = setTimeout(() => {
            this.audioManager.fadeInAudio(speech, 200);
            this[timeoutKey] = null;
        }, 2500);
    }

    /**
     * Stops or fades out speech audio and clears its timeout.
     * @param {HTMLMediaElement} speech Speech audio element.
     * @param {string} timeoutKey Timeout property name.
     * @param {number} [fadeDuration=0] Fade-out duration in milliseconds.
     * @returns {void}
     */
    stopSpeech(speech, timeoutKey, fadeDuration = 0) {
        if (!speech) return;
        this.clearSpeechTimeout(timeoutKey);
        if (fadeDuration > 0) {
            this.audioManager.fadeOutAudio(speech, fadeDuration);
        } else {
            speech.pause();
            speech.currentTime = 0;
        }
        speech.onended = null;
    }
}