class CoinBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.webp',
            './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.webp',
            './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.webp',
            './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.webp',
            './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.webp',
            './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.webp',
        ]
        this.setPercentage(0);
        this.y = 50;
    }
}