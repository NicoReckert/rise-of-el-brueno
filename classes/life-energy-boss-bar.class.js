class LifeEnergyBossBar extends StatusBar {
    constructor(entityImages) {
        super();
        this.entityImages = entityImages;
        this.statusImages = this.entityImages.lifeEnergyBoss.status || [];
        this.setPercentage(100);
        this.x = 450;
    }
}