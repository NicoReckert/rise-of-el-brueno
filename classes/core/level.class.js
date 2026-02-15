export class Level {
    constructor({ enemies = [], endboss = null, clouds = [], grounds = [], towns = [], sky = [], coins = [], bottles = [] }) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.grounds = grounds;
        this.towns = towns;
        this.sky = sky;
        this.coins = coins;
        this.bottles = bottles;
    }
}