class Coin extends MovableObject {
    coinImages = [
        './assets/img/8_coin/coin_1.png',
        './assets/img/8_coin/coin_2.png'
    ]

    isGameCharakter = true;

    coinCount = 0;

    constructor() {
        super();
        super.loadImage('./assets/img/8_coin/coin_1.png')
        this.x = 200 + Math.random() * 500;
        this.y = 100 + Math.random() * 20;
        this.height = 100;
        this.animationCoin();
        this.offset.top = 35;
        this.offset.left = 35;
        this.offset.right = 35;
        this.offset.bottom = 35;
    }

    animationCoin() {
        setInterval(() => {
            let index = this.coinCount % this.coinImages.length;
            this.img.src = this.coinImages[index];
            this.coinCount++
        }, 1000 / 4);
    }
}