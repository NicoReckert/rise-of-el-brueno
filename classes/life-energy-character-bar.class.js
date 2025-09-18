class LifeEnergyCharacterBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.webp',
            './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.webp',
            './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.webp',
            './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.webp',
            './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.webp',
            './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.webp',
        ]
        this.setPercentage(100);
    }
}