class ChickenBasket extends MovableObject {
    constructor(x, y) {
        super();
        super.loadImage('./assets/img/hühnerkorb.png');
        this.height = 35;
        this.width = 35;
        this.x = x;
        this.y = y;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
}