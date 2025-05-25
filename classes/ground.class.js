class Ground extends MovableObject {

    constructor(img) {
        super();
        super.loadImage(img);
        this.x = 0;
        this.y = 0;
        this.height = 480;
        this.width = 720;
    }
}