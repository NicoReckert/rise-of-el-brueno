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
        const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.charactersOverlay);
        if (!submenuBg) return;
        this.uiManager.showCharactersOverlay();
        this.uiManager.renderCharacterCards(this.characters);
        this.startSubmenuMusic();
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
     * @returns {{character:Object, uiSubmenuMusic:Object}|null} Big card state or null.
     */
    getBigCardState(nameCharacter) {
        const character = this.characters.find(c => c.name === nameCharacter);
        const uiSubmenuMusic = this.audioManager.get('uiSubmenuMusic');
        if (!character || !uiSubmenuMusic) return null;
        return { character, uiSubmenuMusic };
    }

    /**
     * Displays the big character card overlay.
     * @param {Object} character Character data.
     * @returns {void}
     */
    showBigCard(character) {
        this.uiManager.showCharacterDetailOverlay();
        this.uiManager.renderBigCharacterCard(character);
    }

    /**
     * Starts the character-specific audio for the big card view.
     * @param {{character:Object, uiSubmenuMusic:Object}} state Big card state.
     * @returns {void}
     */
    startBigCardAudio({ character, uiSubmenuMusic }) {
        character.music.currentTime = 0;
        this.audioManager.fadeOutAudio(uiSubmenuMusic, 1000);
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
        this.uiManager.hideCharacterDetailOverlay();
        this.audioManager.fadeOutAudio(this.currentCharacterMusic, 1000);
        this.stopSpeech(this.currentCharacterSpeechSound, 'characterSpeechTimeout', 1000);
        this.returnToSubmenuMusic();
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
     * @returns {{uiSubmenuMusic:Object, speech:Object}|null} Story overlay state or null.
     */
    getStoryOverlayState() {
        const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.storyOverlay);
        const uiSubmenuMusic = this.audioManager.get('uiSubmenuMusic');
        const speech = this.audioManager.get('narratorStoryVoice');
        if (!submenuBg || !uiSubmenuMusic) return null;
        return { uiSubmenuMusic, speech };
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
     * @param {{uiSubmenuMusic:Object, speech:Object}} state Story overlay state.
     * @returns {void}
     */
    prepareStoryAudio({ uiSubmenuMusic, speech }) {
        this.resetSpeechState(speech, 'storySpeechTimeout');
        this.startSubmenuMusic(0.2);
        this.scheduleSpeechFadeIn(speech, 'storySpeechTimeout');
        this.bindStorySpeechEnd(uiSubmenuMusic, speech);
    }

    /**
     * Binds the speech end event to restore info screen music volume.
     * @param {Object} uiSubmenuMusic Info screen music audio.
     * @param {Object} speech Speech audio element.
     * @returns {void}
     */
    bindStorySpeechEnd(uiSubmenuMusic, speech) {
        if (!speech) return;
        speech.onended = () => {
            this.audioManager.fadeAudioTo(uiSubmenuMusic, 2000, 1);
        };
    }

    /**
     * Closes the story overlay and restores the menu state.
     * @returns {void}
     */
    closeStoryOverlay() {
        this.pauseSubmenuBg();
        this.uiManager.hideStoryOverlay();
        this.stopSpeech(this.audioManager.get('narratorStoryVoice'), 'storySpeechTimeout', 1000);
        this.returnToTitleLoop();
    }

    /**
     * Opens the controls overlay and initializes related UI and audio.
     * @returns {void}
     */
    openControlsOverlay() {
        const fromPause = this.uiManager.returnToPauseOverlay;
        if (!fromPause) {
            const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.controlsOverlay);
            if (!submenuBg) return;
            this.startSubmenuMusic();

        }
        this.uiManager.showControlsOverlay();
        this.uiManager.renderControlsCard(controls);
    }

    /**
     * Closes the controls overlay and restores the menu state.
     * @returns {void}
     */
    closeControlsOverlay() {
        const fromPause = this.uiManager.returnToPauseOverlay;
        if (!fromPause) this.pauseSubmenuBg();
        this.uiManager.hideControlsOverlay();
        if (fromPause) return;
        this.returnToTitleLoop();
    }

    /**
     * Opens the credits overlay and initializes related UI and audio.
     * @returns {void}
     */
    openCreditsOverlay() {
        const fromPause = this.uiManager.returnToPauseOverlay;
        if (!fromPause) {
            const submenuBg = this.prepareSubmenuBg(this.uiManager.dom.creditsOverlay);
            if (!submenuBg) return;
            this.startSubmenuMusic();

        }
        this.uiManager.showCreditsOverlay();
        this.uiManager.renderCreditsCard();
    }

    /**
     * Closes the credits overlay and restores the menu state.
     * @returns {void}
     */
    closeCreditsOverlay() {
        const fromPause = this.uiManager.returnToPauseOverlay;
        if (!fromPause) this.pauseSubmenuBg();
        this.uiManager.hideCreditsOverlay();
        if (fromPause) return;
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
    startSubmenuMusic(targetVolume = 1) {
        const uiTitleIntroMusic = this.audioManager.get('uiTitleIntroMusic');
        const uiTitleLoopMusic = this.audioManager.get('uiTitleLoopMusic');
        const uiSubmenuMusic = this.audioManager.get('uiSubmenuMusic');
        if (!uiSubmenuMusic) return;
        this.audioManager.fadeOutAudio(uiTitleIntroMusic, 1000);
        this.audioManager.fadeOutAudio(uiTitleLoopMusic, 1000);
        uiSubmenuMusic.currentTime = 0;
        this.audioManager.fadeInAudio(uiSubmenuMusic, 2000, targetVolume);
    }

    /**
     * Restores the title loop music and fades out the info screen music.
     * @returns {void}
     */
    returnToTitleLoop() {
        const uiTitleLoopMusic = this.audioManager.get('uiTitleLoopMusic');
        const uiSubmenuMusic = this.audioManager.get('uiSubmenuMusic');
        if (!uiTitleLoopMusic) return;
        this.audioManager.fadeOutAudio(uiSubmenuMusic, 1000);
        uiTitleLoopMusic.currentTime = 0;
        this.audioManager.fadeInAudio(uiTitleLoopMusic, 2000);
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
    returnToSubmenuMusic() {
        const uiSubmenuMusic = this.audioManager.get('uiSubmenuMusic');
        if (!uiSubmenuMusic) return;
        uiSubmenuMusic.currentTime = 0;
        this.audioManager.fadeInAudio(uiSubmenuMusic, 2000);
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