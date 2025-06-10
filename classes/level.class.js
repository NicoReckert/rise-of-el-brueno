class Level {
    enemies;
    endboss;
    clouds;
    grounds;
    towns;
    sky;
    level_end_x = 6409;

    constructor(enemies, endboss, clouds, grounds, towns, sky) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.grounds = grounds;
        this.towns = towns;
        this.sky = sky;
    }
}