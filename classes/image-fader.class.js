export class ImageFader {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.alpha = 0;
        this.duration = 2000; // Fade in/out Dauer in ms
        this.visibleDuration = 3000; // Wie lange sichtbar

        this.startTime = null;
        this.state = "idle"; // idle | fadeIn | visible | fadeOut | done
    }

    start(timestamp) {
        this.startTime = timestamp;
        this.state = "fadeIn";
    }

    update(timestamp) {
        if (this.state === "idle" || this.state === "done") return;

        const elapsed = timestamp - this.startTime;

        switch (this.state) {
            case "fadeIn":
                this.alpha = Math.min(elapsed / this.duration, 1);
                if (elapsed >= this.duration) {
                    this.state = "visible";
                    this.startTime = timestamp;
                }
                break;

            case "visible":
                this.alpha = 1;
                if (elapsed >= this.visibleDuration) {
                    this.state = "fadeOut";
                    this.startTime = timestamp;
                }
                break;

            case "fadeOut":
                this.alpha = Math.max(1 - (elapsed / this.duration), 0);
                if (elapsed >= this.duration) {
                    this.state = "done";
                }
                break;
        }
    }

    draw(ctx) {
        if (this.state === "idle" || this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    isDone() {
        return this.state === "done";
    }
}
