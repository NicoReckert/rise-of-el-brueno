class LifeEnergyBossBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            './assets/img/7_statusbars/2_statusbar_endboss/green/green0.webp',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green20.webp',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green40.webp',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green60.webp',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green80.webp',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green100.webp'
        ]
        this.setPercentage(100);
        this.x = 450;
    }
}