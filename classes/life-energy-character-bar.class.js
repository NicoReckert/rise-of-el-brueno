class LifeEnergyCharacterBar extends StatusBar {
    constructor(entityImages) {
        super();
        this.entityImages = entityImages;
        this.statusImages = this.entityImages.lifeEnergyCharacter.status || [];
        this.setPercentage(100);
    }
}