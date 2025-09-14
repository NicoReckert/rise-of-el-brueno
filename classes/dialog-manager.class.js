class DialogManager {
    constructor(world, keyboard) {
        this.world = world;
        this.keyboard = keyboard;
        this.dialogs = [];
        this.currentDialog = null;
        this.currentIndex = 0;
        this.active = false;
        this.onComplete = null; // optionaler Callback am Ende
    }

    addDialog(sequence, options = {}) {
        this.dialogs.push({
            sequence,
            autoStart: options.autoStart ?? false,
            onComplete: options.onComplete ?? null
        });
    }

    startDialog(index = 0) {
        const dialog = this.dialogs[index];
        if (!dialog) return;

        this.currentDialog = dialog;
        this.currentIndex = 0;
        this.active = true;
        this.onComplete = dialog.onComplete;

        dialog.sequence[0].start();
    }

    next() {
        if (!this.active) return;

        this.currentIndex++;
        if (this.currentIndex >= this.currentDialog.sequence.length) {
            this.active = false;
            if (this.onComplete) this.onComplete(this.world);
        } else {
            this.currentDialog.sequence[this.currentIndex].start();
        }
    }

    update(now) {
        if (!this.active) return;

        const bubble = this.currentDialog.sequence[this.currentIndex];
        bubble.update(now);

        if (this.keyboard.F) {
            this.next();
            this.keyboard.F = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        const bubble = this.currentDialog.sequence[this.currentIndex];
        bubble.draw(ctx);
    }
}
