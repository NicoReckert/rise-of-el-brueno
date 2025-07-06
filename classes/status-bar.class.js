class StatusBar extends DrawableObject {
    statusImages = [];
    percentage = 100;

    constructor() {
        super();
        this.setPercentage(100);
        this.height = 60;
        this.width = 250;
        this.x = 10;
        this.y = 0;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.statusImages[this.resolveImageIndex(percentage)];
        this.loadImage(path);
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}