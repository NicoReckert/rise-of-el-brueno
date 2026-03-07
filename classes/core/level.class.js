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
     * @param {Array} [params.sceneryObjects=[]] List of scenery objects.
     * @param {*}     [params.sky=null] Sky object (procedural or image) OR array (legacy).
     * @param {Array} [params.coins=[]] List of coins.
     * @param {Array} [params.bottles=[]] List of bottles.
     */
    constructor({ enemies = [], endboss = null, clouds = [], grounds = [], sceneryObjects = [], sky = null, coins = [], bottles = [] }) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.grounds = grounds;
        this.sceneryObjects = sceneryObjects;
        this.sky = sky;
        this.coins = coins;
        this.bottles = bottles;
    }
}