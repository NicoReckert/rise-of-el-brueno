class Cloud extends MovableObject {
    constructor(existingClouds = [], minDistance = 6500 / 30) {
        super();
        super.loadImage('./assets/img/5_background/layers/4_clouds/1.webp');

        this.y = 50;

        // zufällige Größe der Wolke
        this.width = 300 + Math.random() * 200;  // 300–500 px
        this.height = 150 + Math.random() * 100; // 150–250 px

        // Position finden, die nicht überlappt oder zu nah ist
        let valid = false;
        while (!valid) {
            this.x = Math.random() * 6500;
            valid = true;

            for (let cloud of existingClouds) {
                if (!this.isFarEnough(cloud, minDistance)) {
                    valid = false;
                    break;
                }
            }
        }

        this.animate();
    }

    isFarEnough(other, minDistance) {
        // Prüft, ob die Wolken plus minDistance auseinander liegen
        return (this.x + this.width + minDistance < other.x) || (this.x > other.x + other.width + minDistance);
    }

    animate() {
        setInterval(() => {
            this.x <= -this.width ? this.x = 7500 : this.x -= 0.3;
        }, 1000 / 60);
    }
}
