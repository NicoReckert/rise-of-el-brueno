class BottleBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
        ]
        this.setPercentage(0);
        this.y = 100;
    }
}