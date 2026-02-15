import { UIManager } from "./ui-manager.class.js";

export class AudioManager {
    constructor() {
        this.isMuted = false;
        this.uiManager = new UIManager();
        this.audios = {};
    }

    addAudios(audioMap) {
        Object.assign(this.audios, audioMap);
    }

    get(name) {
        return this.audios[name];
    }


    setMutedState(muted) {
        this.isMuted = muted;
        localStorage.setItem("elBruenoMuted", muted ? "1" : "0");
        this.uiManager.updateMuteButtonUI(muted);
        this.applyMuteToAllAudios(this.audios);
    }

    clampVolume(value) {
        return Math.max(0, Math.min(1, value));
    }

    safePlay(audio) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => { });
        }
    }

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

    fadeInAudio(audio, duration = 2000, targetVolume = 1) {
        if (!audio) return;
        const to = this.clampVolume(targetVolume);
        audio.volume = 0;
        this.safePlay(audio);
        this.startVolumeFade(audio, 0, to, duration);
    }

    fadeAudioTo(audio, duration = 2000, targetVolume = 1) {
        if (!audio) return;
        const to = this.clampVolume(targetVolume);
        const from = typeof audio.volume === 'number' ? audio.volume : 1;
        this.startVolumeFade(audio, from, to, duration);
    }

    fadeOutAudio(audio, duration = 2000) {
        if (!audio) return;
        if (audio.paused && audio.currentTime === 0) return;
        const from = typeof audio.volume === 'number' ? audio.volume : 1;
        this.startVolumeFade(audio, from, 0, duration, () => {
            audio.volume = 0;
            audio.pause();
        });
    }

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

    isAudioNode(value) {
        return (
            typeof value === 'object' &&
            typeof value.play === 'function' &&
            typeof value.pause === 'function' &&
            'currentTime' in value
        );
    }

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

    pauseAllAudios(collection) {
        if (!collection) return;
        this.traverseAudioCollection(collection, (audio) => {
            audio._wasPlayingBeforePause = !audio.paused;
            if (!audio.paused) audio.pause();
        });
    }

    resumeAllAudios(collection) {
        if (!collection) return;
        this.traverseAudioCollection(collection, (audio) => {
            if (!audio._wasPlayingBeforePause) return;
            audio._wasPlayingBeforePause = false;
            this.safePlay(audio);
        });
    }

    applyMuteToAllAudios(collection) {
        if (!collection) return;
        this.traverseAudioCollection(collection, (audio) => {
            audio.muted = this.isMuted;
        });
    }

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

    playClickSound() {
        const welcomeButtonClickSound = this.get('welcomeButtonClickSound');
        welcomeButtonClickSound.currentTime = 0;
        welcomeButtonClickSound.play();
    }

    stopTitleMusic() {
        const intro = this.get('titleMusicIntro');
        const loop = this.get('titleMusicLoop');
        intro?.pause();
        loop?.pause();
    }
}