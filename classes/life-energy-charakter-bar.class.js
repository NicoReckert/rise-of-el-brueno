class LifeEnergyCharakterBar extends StatusBar {
    constructor() {
        super();
        this.statusImages = [
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
        ]
        this.setPercentage(100);
    }
}