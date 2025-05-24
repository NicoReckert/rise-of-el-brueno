class Chicken extends MovableObject {

    constructor() {
        super();
        this.x = 200 + Math.random() * 500;
        super.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
    }

    eat() {

    }
}