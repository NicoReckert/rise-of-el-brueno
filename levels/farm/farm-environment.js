import { AnimatedEntity } from "../../classes/entities/animated-entity.class.js";

export function createFarmEnvironment(entityImages) {
    const environment = {
        pond: new AnimatedEntity(entityImages, 'pond', 500, 600, -28, 320),

        trees: [
            new AnimatedEntity(entityImages, 'treeA', 450, 450, 500, 250),
            new AnimatedEntity(entityImages, 'treeB', 450, 450, 4600, 250),
            new AnimatedEntity(entityImages, 'treeC', 450, 450, 5700, 255),
        ],

        flowers: [
            new AnimatedEntity(entityImages, 'flowerA', 65, 65, 5650, 600),
            new AnimatedEntity(entityImages, 'flowerB', 65, 65, 5600, 600),
            new AnimatedEntity(entityImages, 'flowerC', 65, 65, 5550, 600),
            new AnimatedEntity(entityImages, 'flowerA', 65, 65, 5070, 600),
            new AnimatedEntity(entityImages, 'flowerB', 65, 65, 5120, 600),
            new AnimatedEntity(entityImages, 'flowerC', 65, 65, 5170, 600),
            new AnimatedEntity(entityImages, 'flowerA', 65, 65, 4730, 600),
            new AnimatedEntity(entityImages, 'flowerA', 65, 65, 4800, 600),
        ],

        house: new AnimatedEntity(entityImages, 'house', 900, 900, 800, -30),
        stable: new AnimatedEntity(entityImages, 'stable', 600, 600, 1550, 177),
        clock: new AnimatedEntity(entityImages, 'clock', 150, 150, 5320, 400),
        campfire: new AnimatedEntity(entityImages, 'campfire', 200, 200, 650, 520),
        sun: new AnimatedEntity(entityImages, 'sun', 250, 250, 3000, 50),
        moon: new AnimatedEntity(entityImages, 'moon', 200, 200, 3000, 50),
    };

    environment.pond.isFlipped = false;
    environment.house.isFlipped = false;
    environment.stable.isFlipped = false;

    return environment;
}
