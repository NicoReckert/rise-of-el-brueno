export class DialogManager {
    constructor(world, keyboard) {
        this.world = world;
        this.keyboard = keyboard;

        this.dialogs = [];
        this.currentDialog = null;
        this.currentIndex = 0;
        this.active = false;
        this.onComplete = null;

        this.currentBubble = null;
        this.currentBubbleOnComplete = null;

        this.pauseUntil = null;
    }

    addDialog(sequence, options = {}) {
        this.dialogs.push({
            sequence,
            autoStart: options.autoStart ?? false,
            onComplete: options.onComplete ?? null
        });
    }

    startDialog(index = 0, now = performance.now(), onCompleteOverride = null) {
        const dialog = this.dialogs[index];
        if (!dialog) return;

        this.currentDialog = dialog;
        this.currentIndex = 0;
        this.active = true;
        this.onComplete = onCompleteOverride ?? dialog.onComplete;
        this.pauseUntil = null;

        this.startCurrentStep(now);
    }

    playBubble(bubble, {
        duration = null,
        now = performance.now(),
        onComplete = null
    } = {}) {
        if (!bubble) return;
        if (this.currentBubble === bubble && bubble.active) return;
        this.currentBubble = bubble;
        this.currentBubbleOnComplete = onComplete;
        bubble.start(duration, now);
    }

    getCurrentStep() {
        if (!this.active || !this.currentDialog) return null;
        return this.currentDialog.sequence[this.currentIndex] ?? null;
    }

    resolveStepBubble(step) {
        if (!step) return null;

        if (typeof step.start === "function" && typeof step.draw === "function") {
            return step;
        }

        if (step.type !== "bubble") return null;

        if (step.bubble) return step.bubble;

        if (!step._bubbleInstance) {
            step._bubbleInstance = new SpeechBubble(
                step.text ?? "",
                step.target ?? "canvas",
                step.bubbleType ?? "speech",
                step.allAudios ?? this.world.allAudios ?? null,
                step.yOffset ?? 32
            );
        }

        return step._bubbleInstance;
    }

    startCurrentStep(now = performance.now()) {
        const step = this.getCurrentStep();
        if (!step) return;

        if (step.type === "pause") {
            this.pauseUntil = now + (step.duration ?? 0);
            return;
        }

        if (step.type === "callback") {
            this.pauseUntil = null;
            if (typeof step.run === "function") step.run(this.world);
            this.next(now);
            return;
        }

        this.pauseUntil = null;

        const bubble = this.resolveStepBubble(step);
        if (!bubble) return;

        const duration =
            step && typeof step === "object" && "duration" in step
                ? step.duration
                : null;

        bubble.start(duration, now);
    }

    next(now = performance.now()) {
        if (!this.active || !this.currentDialog) return;

        this.currentIndex++;

        if (this.currentIndex >= this.currentDialog.sequence.length) {
            this.active = false;
            this.currentDialog = null;
            this.pauseUntil = null;

            if (this.onComplete) this.onComplete(this.world);
            this.onComplete = null;
            return;
        }

        this.startCurrentStep(now);
    }

    update(now) {
        if (this.active && this.currentDialog) {
            const step = this.getCurrentStep();

            if (step?.type === "pause") {
                if (this.pauseUntil != null && now >= this.pauseUntil) {
                    this.next(now);
                }
            } else if (step?.type === "callback") {
                // wird direkt in startCurrentStep verarbeitet
            } else {
                const bubble = this.resolveStepBubble(step);

                if (bubble) {
                    bubble.update(now);

                    if (this.keyboard.F) {
                        if (bubble.displayedText.length < bubble.fullText.length) {
                            bubble.displayedText = bubble.fullText;
                            bubble.lastCharCount = bubble.fullText.length;
                        } else {
                            this.next(now);
                        }
                        this.keyboard.F = false;
                    }

                    if (!bubble.active) {
                        this.next(now);
                    }
                }
            }
        }

        if (this.currentBubble) {
            this.currentBubble.update(now);

            if (!this.currentBubble.active) {
                const cb = this.currentBubbleOnComplete;
                this.currentBubble = null;
                this.currentBubbleOnComplete = null;

                if (cb) cb(this.world);
            }
        }
    }

    draw(ctx) {
        const camX = this.world.townLevelController?.renderCameraX ?? 0;

        if (this.active && this.currentDialog) {
            const step = this.getCurrentStep();

            if (step?.type !== "pause" && step?.type !== "callback") {
                const bubble = this.resolveStepBubble(step);
                if (bubble) bubble.render(ctx, camX);
            }
        }

        if (this.currentBubble) {
            this.currentBubble.render(ctx, camX);
        }
    }
}