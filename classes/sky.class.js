class Sky extends MovableObject {

    constructor() {
        super();
        super.loadImage('assets/img/5_background/layers/air.png')
        this.x = 0;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}