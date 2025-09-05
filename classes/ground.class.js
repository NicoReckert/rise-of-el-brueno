class Ground extends MovableObject {

    constructor(img, x, y = 0, height = 480, width = 720) {
        super();
        super.loadImage(img);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}