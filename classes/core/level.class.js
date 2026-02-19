/**
 * Represents a level.
 */
export class Level {
    /**
    * Creates a new instance.
    * @param {Object} params Configuration object.
    * @param {Array} [params.enemies=[]] List of enemies.
    * @param {*} [params.endboss=null] Endboss entity.
    * @param {Array} [params.clouds=[]] List of clouds.
    * @param {Array} [params.grounds=[]] List of grounds.
    * @param {Array} [params.towns=[]] List of towns.
    * @param {Array} [params.sky=[]] List of sky elements.
    * @param {Array} [params.coins=[]] List of coins.
    * @param {Array} [params.bottles=[]] List of bottles.
    */
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