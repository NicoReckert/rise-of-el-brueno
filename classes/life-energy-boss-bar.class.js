class LifeEnergyBossBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            './assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
            './assets/img/7_statusbars/2_statusbar_endboss/green/green100.png'
        ]
        this.setPercentage(100);
        this.x = 450;
    }
}