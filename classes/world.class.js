class World {
    charakter = new Character();
    enemies = [new Chicken(200), new Chicken(300), new Chicken(400)];
    ctx;
    canvas;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.charakter.img, this.charakter.x, this.charakter.y, this.charakter.width, this.charakter.height);
        this.enemies.forEach(element => {
            this.ctx.drawImage(element.img, element.x, element.y, element.width, element.height);

        });
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }
}