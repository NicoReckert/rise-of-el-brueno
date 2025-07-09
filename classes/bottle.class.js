class Bottle extends MovableObject {
    bottleImages = [
        './assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    isGameCharakter = true;
    randomImage;

    constructor() {
        super();
        this.randomImage = this.bottleImages[Math.floor(Math.random() * this.bottleImages.length)];
        super.loadImage(this.randomImage);
        this.x = 200 + Math.random() * 1000;
        this.y = 343;
        this.height = 80;
        this.width = 80;
        this.offset.top = 12;
        if (this.randomImage != "./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png") {
            this.offset.left = 24;
            this.offset.right = 25;
        } else {
            this.offset.left = 33;
            this.offset.right = 15;
        }
        this.offset.bottom = 8;
    }
}