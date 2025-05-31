class Level {
    enemies;
    endboss;
    clouds;
    grounds;
    sky;
    level_end_x = 1500;

    constructor(enemies, endboss, clouds, grounds, sky) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.grounds = grounds;
        this.sky = sky;
    }
}