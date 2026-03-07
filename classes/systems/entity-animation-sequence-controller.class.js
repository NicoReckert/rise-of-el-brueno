/**
 * Controller that manages animation sequences for an entity.
 */
export class EntityAnimationSequenceController {
    /**
     * Creates a new animation controller for an entity.
     * @param {*} entity Target entity.
     */
    constructor(entity) {
        this.entity = entity;
        this.sequence = null;
    }

    /**
     * Starts a new animation sequence.
     * @param {Array} steps Sequence steps.
     * @param {*} timerManager Timer manager instance.
     * @param {{loop?: boolean, audioManager?: *}} [options] Optional settings.
     * @returns {boolean} True if sequence started successfully.
     */
    start(steps = [], timerManager, { loop = true, audioManager = null } = {}) {
        if (!Array.isArray(steps) || !steps.length || !timerManager) return false;
        this.stop();
        this.initSequence(steps, timerManager, loop, audioManager);
        this.playCurrentStep();
        return true;
    }

    /**
     * Initializes the animation sequence state.
     * @param {Array} steps Sequence steps.
     * @param {*} timerManager Timer manager instance.
     * @param {boolean} loop Whether the sequence should loop.
     * @param {*} audioManager Optional audio manager.
     */
    initSequence(steps, timerManager, loop, audioManager) {
        this.sequence = {
            steps,
            index: 0,
            loop,
            audioManager,
            active: true,
            timerManager,
            waitingForPause: false,
            timerId: this.buildTimerId()
        };
    }

    /**
     * Stops the current animation sequence and cancels associated timers.
     */
    stop() {
        const seq = this.sequence;
        if (seq?.timerManager && seq?.timerId) {
            seq.timerManager.cancel(seq.timerId);
            seq.timerManager.cancel(`${seq.timerId}:audio`);
        }
        this.sequence = null;
    }

    /**
     * Updates the current animation sequence, advancing to the next step if ready.
     */
    update() {
        const seq = this.sequence;
        if (!seq?.active) return;
        const step = seq.steps[seq.index];
        if (!step) return;
        if (!this.entity.animationFinished) return;
        if (seq.waitingForPause) return;
        seq.waitingForPause = true;
        const pause = step.pause ?? 0;
        seq.timerManager.addUnique(seq.timerId, pause, () => {
            if (!this.sequence || this.sequence !== seq || !seq.active) return;
            this.advanceToNextStep();
        }, false);
    }

    /**
     * Advances the animation sequence to the next step.
     */
    advanceToNextStep() {
        const seq = this.sequence;
        if (!seq?.active) return;
        seq.index++;
        if (seq.index >= seq.steps.length) {
            if (!seq.loop) {
                this.stop();
                return;
            }
            seq.index = 0;
        }
        seq.waitingForPause = false;
        this.playCurrentStep();
    }

    /**
     * Plays the current animation step, including audio if provided.
     */
    playCurrentStep() {
        const seq = this.sequence;
        if (!seq?.active) return;
        const step = seq.steps[seq.index];
        if (!step) return;
        seq.timerManager.cancel(seq.timerId);
        if (step.fps) {
            this.entity.updateAnimationState(step.anim, 1000 / step.fps);
        } else this.entity.updateAnimationState(step.anim);
        this.entity.setAnimation(step.anim, true);
        this.entity.animationFinished = false;
        this.playStepAudio(step, seq.audioManager, seq);
    }

    /**
     * Checks if an animation sequence is currently active.
     * @returns {boolean} True if active, otherwise false.
     */
    isActive() {
        return !!this.sequence?.active;
    }

    /**
     * Builds a unique timer ID for the current animation sequence.
     * @returns {string} Timer ID.
     */
    buildTimerId() {
        const e = this.entity;
        const name = e?.currentEntity ?? "entity";
        if (!this._uid) {
            this._uid = Math.random().toString(36).slice(2);
        }
        return `animseq:${name}:${this._uid}`;
    }

    /**
     * Checks if the sequence is waiting for a pause to complete.
     * @returns {boolean} True if waiting, otherwise false.
     */
    isWaitingForPause() {
        return !!this.sequence?.waitingForPause;
    }

    /**
     * Checks if the animation sequence is currently active.
     * @returns {boolean} True if active, otherwise false.
     */
    isActive() {
        return !!this.sequence?.active;
    }

    /**
     * Plays the audio associated with a sequence step.
     * @param {*} step Animation step object.
     * @param {*} audioManager Audio manager instance.
     * @param {*} [seq=null] Optional sequence reference.
     */
    playStepAudio(step, audioManager, seq = null) {
        if (this.shouldSkipStepAudio(audioManager)) return;
        if (typeof step.sound === "string") {
            audioManager.playOneShot(step.sound);
            return;
        }
        const cfg = step.audio;
        if (!this.isValidAudioConfig(cfg)) return;
        const play = this.buildStepAudioPlayer(audioManager, cfg);
        this.runStepAudioWithDelay(cfg, seq, play);
    }

    /**
     * Determines whether step audio should be skipped.
     * @param {*} audioManager Audio manager instance.
     * @returns {boolean} True if audio should be skipped.
     */
    shouldSkipStepAudio(audioManager) {
        if (!audioManager) return true;
        if (this.entity.audioEnabled === false) return true;
        return false;
    }

    /**
     * Validates an audio configuration for a sequence step.
     * @param {*} cfg Audio configuration object.
     * @returns {boolean} True if valid, otherwise false.
     */
    isValidAudioConfig(cfg) {
        if (!cfg?.name) return false;
        if (cfg.chance !== undefined && Math.random() > cfg.chance) return false;
        return true;
    }

    /**
     * Builds a function to play the step audio with the given configuration.
     * @param {*} audioManager Audio manager instance.
     * @param {*} cfg Audio configuration object.
     * @returns {Function} Function that plays the audio when called.
     */
    buildStepAudioPlayer(audioManager, cfg) {
        return () => {
            audioManager.playOneShot(cfg.name, {
                volume: cfg.volume ?? 1,
                loop: cfg.loop ?? false
            });
        };
    }

    /**
     * Plays step audio after an optional delay using the timer manager.
     * @param {*} cfg Audio configuration object.
     * @param {*} seq Optional sequence reference.
     * @param {Function} play Function to execute the audio playback.
     */
    runStepAudioWithDelay(cfg, seq, play) {
        const delay = cfg.delay ?? 0;
        if (delay > 0 && seq?.timerManager) {
            const audioTimerId = `${seq.timerId}:audio`;
            seq.timerManager.cancel(audioTimerId);
            seq.timerManager.addUnique(audioTimerId, delay, play, false);
            return;
        }
        play();
    }
}