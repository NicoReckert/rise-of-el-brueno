class Sky extends MovableObject {

    constructor(x) {
        super();
        super.loadImage('./assets/img/5_background/layers/air.webp')
        this.x = x;
        this.y = 0;
        this.height = 720;
        this.width = 720;
    }
}