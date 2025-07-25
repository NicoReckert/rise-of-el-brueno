class ChickenInBasket extends MovableObject {
    constructor(x, y) {
        super();
        super.loadImage('./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.height = 50;
        this.width = 50;
        this.x = x;
        this.y = y;
        this.isFlipped = true;
        this.isGameCharakter = true;
        this.isAttack = false;
        this.isIdle = true;
        this.speedX = 10;
        this.offset.top = 5;
        this.offset.left = 5;
        this.offset.right = 2;
        this.offset.bottom = 5;

        this.startX = 0;
        this.startY = 0;
        this.returnStart = false;
        this.isReturning = false;
        this.justLanded = false;
        this.returnProgress = 0;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;

    }

    chickenAttack(charakterX, charakterY, basketX, basketY) {
        if (this.isAttack && this.x <= this.attackStartX + 300) {
            console.log(charakterX - this.x);
            this.x += this.speedX;
        } else if (this.isAttack) {
            this.isAttack = false;
            this.startReturn(
                this.x,
                this.y,
                basketX,
                basketY
            );
        }
    }

    startReturn(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.returnProgress = 0;
        this.isReturning = true;
    }

    updateReturnFlight() {
        if (!this.isReturning) return;

        this.returnProgress += 0.02;

        if (this.returnProgress >= 1) {
            this.returnProgress = 1;
            this.isReturning = false;
            this.isIdle = true;
            this.justLanded = true;

            // direkt an Ziel setzen
            this.x = this.endX;
            this.y = this.endY;

            setTimeout(() => {
                this.justLanded = false;
            }, 200);

            return;
        }

        const t = this.returnProgress;
        const easeOut = t => 1 - Math.pow(1 - t, 2);
        const smoothT = easeOut(t);

        const cx = (this.startX + this.endX) / 2 - 40;
        const cy = Math.min(this.startY, this.endY) - 100;

        this.x = (1 - smoothT) ** 2 * this.startX + 2 * (1 - smoothT) * smoothT * cx + smoothT ** 2 * this.endX;
        this.y = (1 - smoothT) ** 2 * this.startY + 2 * (1 - smoothT) * smoothT * cy + smoothT ** 2 * this.endY;

        console.log('➡ Rückflug:', this.returnProgress.toFixed(2), 'Pos:', this.x.toFixed(0), this.y.toFixed(0));
    }


}