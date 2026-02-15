/**
 * Manages audio playback and mute state.
 */
export class AudioManager {
    /**
    * Creates a new audio manager instance.
    */
    constructor(uiManager) {
        this.isMuted = false;
        this.uiManager = uiManager;
        this.audios = {};
    }

    /**
    * Adds audio elements to the manager.
    * @param {Object<string, HTMLAudioElement|HTMLAudioElement[]>} audioMap Audio elements mapped by key.
    */
    addAudios(audioMap) {
        Object.assign(this.audios, audioMap);
    }

    /**
    * Retrieves an audio entry by name.
    * @param {string} name Audio key.
    * @returns {HTMLAudioElement|HTMLAudioElement[]|undefined}
    */
    get(name) {
        return this.audios[name];
    }

    /**
    * Sets the global mute state and applies it to all audios.
    * @param {boolean} muted Mute state.
    */
    setMutedState(muted) {
        this.isMuted = muted;
        localStorage.setItem("elBruenoMuted", muted ? "1" : "0");
        this.uiManager.updateMuteButtonUI(muted);
        this.applyMuteToAllAudios(this.audios);
    }

    /**
    * Clamps a volume value between 0 and 1.
    * @param {number} value Volume value.
    * @returns {number}
    */
    clampVolume(value) {
        return Math.max(0, Math.min(1, value));
    }

    /**
    * Plays an audio element and suppresses play errors.
    * @param {HTMLAudioElement} audio Audio element to play.
    */
    safePlay(audio) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => { });
        }
    }

    /**
    * Starts a volume fade animation for an audio element.
    * @param {HTMLAudioElement} audio Audio element.
    * @param {number} from Start volume (0–1).
    * @param {number} to Target volume (0–1).
    * @param {number} duration Fade duration in milliseconds.
    * @param {Function} [onDone] Optional callback invoked after fade completes.
    */
    startVolumeFade(audio, from, to, duration, onDone) {
        if (!audio) return;
        const token = Symbol('fade');
        audio.__fadeToken = token;
        const start = performance.now();
        const step = (now) => {
            this.stepVolumeFade(audio, token, start, from, to, duration, onDone, now);
        };
        requestAnimationFrame(step);
    }

    /**
   * Performs a single step of a volume fade animation.
    * @param {HTMLAudioElement} audio Audio element.
    * @param {symbol} token Fade token identifier.
    * @param {number} start Start timestamp.
    * @param {number} from Start volume (0–1).
    * @param {number} to Target volume (0–1).
    * @param {number} duration Fade duration in milliseconds.
    * @param {Function} [onDone] Optional callback invoked after fade completes.
    * @param {number} now Current timestamp.
    */
    stepVolumeFade(audio, token, start, from, to, duration, onDone, now) {
        if (audio.__fadeToken !== token) return;
        const t = Math.min((now - start) / duration, 1);
        const value = from + (to - from) * t;
        audio.volume = this.clampVolume(value);
        if (t < 1) {
            requestAnimationFrame((nextNow) => {
                this.stepVolumeFade(audio, token, start, from, to, duration, onDone, nextNow);
            });
        } else if (onDone) {
            onDone();
        }
    }

    /**
    * Fades in an audio element to a target volume.
    * @param {HTMLAudioElement} audio Audio element.
    * @param {number} [duration=2000] Fade duration in milliseconds.
    * @param {number} [targetVolume=1] Target volume (0–1).
    */
    fadeInAudio(audio, duration = 2000, targetVolume = 1) {
        if (!audio) return;
        const to = this.clampVolume(targetVolume);
        audio.volume = 0;
        this.safePlay(audio);
        this.startVolumeFade(audio, 0, to, duration);
    }

    /**
    * Fades an audio element to a target volume.
    * @param {HTMLAudioElement} audio Audio element.
    * @param {number} [duration=2000] Fade duration in milliseconds.
    * @param {number} [targetVolume=1] Target volume (0–1).
    */
    fadeAudioTo(audio, duration = 2000, targetVolume = 1) {
        if (!audio) return;
        const to = this.clampVolume(targetVolume);
        const from = typeof audio.volume === 'number' ? audio.volume : 1;
        this.startVolumeFade(audio, from, to, duration);
    }

    /**
    * Fades out an audio element and pauses it.
    * @param {HTMLAudioElement} audio Audio element.
    * @param {number} [duration=2000] Fade duration in milliseconds.
    */
    fadeOutAudio(audio, duration = 2000) {
        if (!audio) return;
        if (audio.paused && audio.currentTime === 0) return;
        const from = typeof audio.volume === 'number' ? audio.volume : 1;
        this.startVolumeFade(audio, from, 0, duration, () => {
            audio.volume = 0;
            audio.pause();
        });
    }

    /**
    * Resets a collection of audio elements with configurable options.
    * @param {Object} collection Audio collection.
    * @param {Object} [opts] Reset configuration options.
    */
    resetAllAudios(collection, opts = {}) {
        if (!collection) return;
        const {
            pause = true,
            resetTime = true,
            resetVolume = true,
            defaultVolume = 1,
            resetLoop = true,
            resetRate = true
        } = opts;
        const cfg = { pause, resetTime, resetVolume, defaultVolume, resetLoop, resetRate };
        this.traverseAudioCollection(collection, audio => this.resetAudioNode(audio, cfg));
    }

    /**
    * Recursively traverses an audio collection and applies a callback to each audio node.
    * @param {*} node Audio collection node.
    * @param {Function} onAudio Callback invoked for each audio element.
    */
    traverseAudioCollection(node, onAudio) {
        if (!node) return;
        if (this.isAudioNode(node)) return onAudio(node);
        if (Array.isArray(node)) {
            node.forEach(child => this.traverseAudioCollection(child, onAudio));
            return;
        }
        if (typeof node === 'object') {
            Object.values(node).forEach(child =>
                this.traverseAudioCollection(child, onAudio)
            );
        }
    }

    /**
    * Checks whether a value is an audio element.
    * @param {*} value Value to check.
    * @returns {boolean}
    */
    isAudioNode(value) {
        return (
            typeof value === 'object' &&
            typeof value.play === 'function' &&
            typeof value.pause === 'function' &&
            'currentTime' in value
        );
    }

    /**
    * Resets a single audio element based on configuration.
    * @param {HTMLAudioElement} audio Audio element.
    * @param {Object} config Reset configuration.
    */
    resetAudioNode(audio, config) {
        const {
            pause,
            resetTime,
            resetVolume,
            defaultVolume,
            resetLoop,
            resetRate
        } = config;
        if (pause) audio.pause();
        if (resetTime) audio.currentTime = 0;
        if (resetVolume) audio.volume = defaultVolume;
        if (resetLoop) audio.loop = false;
        if (resetRate) audio.playbackRate = 1;
    }

    /**
    * Pauses all audio elements in a collection.
    * @param {*} collection Audio collection.
    */
    pauseAllAudios(collection) {
        if (!collection) return;
        this.traverseAudioCollection(collection, (audio) => {
            audio._wasPlayingBeforePause = !audio.paused;
            if (!audio.paused) audio.pause();
        });
    }

    /**
    * Resumes previously playing audio elements in a collection.
    * @param {*} collection Audio collection.
    */
    resumeAllAudios(collection) {
        if (!collection) return;
        this.traverseAudioCollection(collection, (audio) => {
            if (!audio._wasPlayingBeforePause) return;
            audio._wasPlayingBeforePause = false;
            this.safePlay(audio);
        });
    }

    /**
    * Applies the current mute state to all audio elements in a collection.
    * @param {*} collection Audio collection.
    */
    applyMuteToAllAudios(collection) {
        if (!collection) return;
        this.traverseAudioCollection(collection, (audio) => {
            audio.muted = this.isMuted;
        });
    }

    /**
    * Sets up automatic transition from intro title music to looping track.
    */
    setupTitleMusicChain() {
        const titleMusicIntro = this.get('titleMusicIntro');
        const titleMusicLoop = this.get('titleMusicLoop');
        if (!titleMusicIntro || !titleMusicLoop) return;
        titleMusicIntro.addEventListener("ended", () => {
            titleMusicLoop.currentTime = 0;
            titleMusicLoop.loop = true;
            titleMusicLoop.play();
        });
    }

    /**
    * Sets up a timed cue during the title intro track.
    * @param {Function} [callback] Optional callback triggered when the cue fires.
    */
    setupTitleIntroCue(callback) {
        const titleMusicIntro = this.get('titleMusicIntro');
        const titleSound = this.get('titleSound');
        if (!titleMusicIntro || !titleSound) return;
        const handler = () => {
            if (titleMusicIntro.currentTime >= 22.8 && titleSound.paused) {
                titleSound.play();
                callback?.();
                titleMusicIntro.removeEventListener('timeupdate', handler);
            }
        }
        titleMusicIntro.addEventListener('timeupdate', handler);
    }

    /**
    * Plays the welcome button click sound.
    */
    playClickSound() {
        const welcomeButtonClickSound = this.get('welcomeButtonClickSound');
        welcomeButtonClickSound.currentTime = 0;
        welcomeButtonClickSound.play();
    }

    /**
    * Stops the title intro and loop music tracks.
    */
    stopTitleMusic() {
        const intro = this.get('titleMusicIntro');
        const loop = this.get('titleMusicLoop');
        intro?.pause();
        loop?.pause();
    }

    /**
    * Fades in the looping title music.
    */
    fadeInTitleMusic() {
        const loop = this.get('titleMusicLoop');
        loop.currentTime = 0;
        this.fadeInAudio(loop, 2000);
    }
}