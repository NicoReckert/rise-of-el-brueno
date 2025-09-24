class Coin extends MovableObject {
    coinImages = [];

    isGameCharacter = true;

    coinCount = 0;

    constructor() {
        super();
        super.loadImage('./assets/img/8_coin/coin_1.webp')
        this.x = 200 + Math.random() * 500;
        this.y = 340 + Math.random() * 20;
        this.height = 100;
        this.offset.top = 35;
        this.offset.left = 35;
        this.offset.right = 35;
        this.offset.bottom = 35;

        this.preloadCoinImages().then(() => {
            this.animationCoin();
        });
    }

    animationCoin() {
        setInterval(() => {
            let index = this.coinCount % this.coinImages.length;
            this.img = this.coinImages[index];
            this.coinCount++
        }, 1000 / 4);
    }

    loadImage2(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async preloadCoinImages() {
        const paths = [
            './assets/img/8_coin/coin_1.webp',
            './assets/img/8_coin/coin_2.webp'
        ];

        this.coinImages = await Promise.all(paths.map(src => this.loadImage2(src)));
    }
}