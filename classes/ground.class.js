class Ground extends MovableObject {

    constructor(img, x) {
        super();
        super.loadImage(img);
        this.x = x;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}