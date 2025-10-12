class LifeEnergyBossBar extends StatusBar {
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.statusImages = this.npcImages.lifeEnergyBoss_status || [];
        this.setPercentage(100);
        this.x = 450;
    }
}