class Cloud extends MovableObject {

    constructor() {
        super();
        super.loadImage('assets/img/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 500;
        this.y = 20;
        this.height = 250;
        this.width = 500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x <= -500 ? this.x = 700
                : this.x -= 0.15;
        }, 1000 / 60);
    }


}