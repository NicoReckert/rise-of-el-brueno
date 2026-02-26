export class EntityAnimationSequenceController {
    constructor(entity) {
        this.entity = entity;
        this.sequence = null;
    }

    start(steps = [], timerManager, { loop = true, audioManager = null } = {}) {
        if (!Array.isArray(steps) || !steps.length || !timerManager) return false;
        this.stop();
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
        this.playCurrentStep();
        return true;
    }

    stop() {
        const seq = this.sequence;
        if (seq?.timerManager && seq?.timerId) {
            seq.timerManager.cancel(seq.timerId);
            seq.timerManager.cancel(`${seq.timerId}:audio`);
        }
        this.sequence = null;
    }

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

    playCurrentStep() {
        const seq = this.sequence;
        if (!seq?.active) return;
        const step = seq.steps[seq.index];
        if (!step) return;
        seq.timerManager.cancel(seq.timerId);
        if (step.fps) {
            this.entity.updateAnimationState(step.anim, 1000 / step.fps);
        } else {
            this.entity.updateAnimationState(step.anim);
        }
        this.entity.setAnimation(step.anim, true);
        this.entity.animationFinished = false;
        this.playStepAudio(step, seq.audioManager, seq);
    }

    isActive() {
        return !!this.sequence?.active;
    }

    buildTimerId() {
        const e = this.entity;
        const name = e?.currentEntity ?? "entity";
        if (!this._uid) {
            this._uid = Math.random().toString(36).slice(2);
        }
        return `animseq:${name}:${this._uid}`;
    }

    isWaitingForPause() {
        return !!this.sequence?.waitingForPause;
    }

    isActive() {
        return !!this.sequence?.active;
    }

    playStepAudio(step, audioManager, seq = null) {
        if (!audioManager) return;
        if (this.entity.audioEnabled === false) return;
        if (typeof step.sound === 'string') {
            audioManager.playOneShot(step.sound);
            return;
        }
        const cfg = step.audio;
        if (!cfg?.name) return;
        if (cfg.chance !== undefined && Math.random() > cfg.chance) return;
        const play = () => {
            audioManager.playOneShot(cfg.name, {
                volume: cfg.volume ?? 1,
                loop: cfg.loop ?? false
            });
        };
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