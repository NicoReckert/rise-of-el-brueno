class LifeEnergyCharacterBar extends StatusBar {
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.statusImages = this.npcImages.lifeEnergyCharacter_status || [];
        this.setPercentage(100);
    }
}