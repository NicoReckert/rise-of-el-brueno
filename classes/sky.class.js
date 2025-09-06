class Sky extends MovableObject {

    constructor(x) {
        super();
        super.loadImage('./assets/img/5_background/layers/air.png')
        this.x = x;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}