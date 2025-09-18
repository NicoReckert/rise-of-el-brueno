class BottleBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.webp',
            './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.webp',
            './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.webp',
            './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.webp',
            './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.webp',
            './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.webp',
        ]
        this.setPercentage(0);
        this.y = 100;
    }
}