class World {
    charakter = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud];
    groundSrc = ['assets/img/5_background/layers/3_third_layer/1.png', 'assets/img/5_background/layers/3_third_layer/2.png', 'assets/img/5_background/layers/2_second_layer/1.png', 'assets/img/5_background/layers/2_second_layer/2.png', 'assets/img/5_background/layers/1_first_layer/1.png', 'assets/img/5_background/layers/1_first_layer/2.png'];
    grounds = [new Ground(this.groundSrc[0], 0), new Ground(this.groundSrc[2], 0), new Ground(this.groundSrc[4], 0), new Ground(this.groundSrc[1], 721), new Ground(this.groundSrc[3], 721), new Ground(this.groundSrc[5], 721)];
    sky = new Sky();
    ctx;
    canvas;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.addToWorld(this.sky);
        this.addObject(this.grounds);
        this.addToWorld(this.charakter);
        this.addObject(this.enemies);
        this.addObject(this.clouds);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }

    addToWorld(object) {
        this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
    }

    addObject(objectArray) {
        objectArray.forEach(element => {
            this.addToWorld(element);

        });
    }
}