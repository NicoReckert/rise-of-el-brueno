import { Level } from '../classes/level.class.js';
import { Ground } from '../classes/ground.class.js';
import { Cloud } from '../classes/cloud.class.js';
import { Town } from '../classes/town.class.js';
import { Sky } from '../classes/sky.class.js';

const groundSrcTown =
    [
        './assets/img/5_background/layers/3_third_layer/1.webp',
        './assets/img/5_background/layers/2_second_layer/1.webp',
        './assets/img/5_background/layers/1_first_layer/1.webp',
        './assets/img/5_background/layers/3_third_layer/2.webp',
        './assets/img/5_background/layers/2_second_layer/2.webp',
        './assets/img/5_background/layers/1_first_layer/2.webp',
        './assets/img/5_background/layers/ground-town.webp',
        './assets/img/5_background/layers/ground-town2.webp'
    ]

const townSrcTown =
    [
        './assets/img/town1.webp',
        './assets/img/town2.webp',
        './assets/img/town3.webp',
        './assets/img/town4.webp',
        './assets/img/town5.webp',
        './assets/img/town6.webp',
        './assets/img/house-weise.png'

    ]

let townLevel = null;
let images = {};
const cloudArrayTown = [];
const cloudCountTown = 10;
for (let i = 0; i < cloudCountTown; i++) {
    cloudArrayTown.push(new Cloud(cloudArrayTown, 100)); // 100px Mindestabstand
}

function setImages(entityImages) {
    images = { ...entityImages };
}

function createTownLevel(allAudios) {
    townLevel = new Level(
        {
            enemies:
                [
                    // new Chicken('chickenMutatesSmall', images, 120, 120, 545, null, allAudios),
                    // new Chicken('chickenMutatesSmall', images, 120, 120, 545, null,  allAudios),
                    // new Chicken('chickenMutatesSmall', images, 120, 120, 545, null,  allAudios),
                    // new Chicken('chickenMutatesBig', images, 160, 160, 505, null,  allAudios),
                    // new Chicken('chickenMutatesBig', images, 160, 160, 505, null, allAudios),
                    // new Chicken('chickenMutatesBig', images, 160, 160, 505, null, allAudios)
                ],
            clouds: cloudArrayTown,

            grounds: {

                backGrounds: [
                ],

                // MITTELGRUND (mittlere Bewegung)
                midGrounds: [
                ],

                // VORDERGRUND (schnellste Bewegung)
                foreGrounds: [
                ]
            },
            towns:
                [
                    new Town(townSrcTown[6], 10000, 275, 550, 450),
                    new Town(townSrcTown[0], 18676, 5, 1000, 800),
                    new Town(townSrcTown[1], 19618, -105, 1000, 1000),
                    // new Town(townSrcTown[2], 3160, 25, 800, 800),
                    new Town(townSrcTown[3], 20523, -35, 800, 800),
                    new Town(townSrcTown[4], 21338, -18, 800, 800),
                    new Town(townSrcTown[5], 22038, -17, 1000, 800)
                ],
            sky:
                [
                    // new Sky(-719),
                    // new Sky(0),
                    // new Sky(719),
                    // new Sky(1438),
                    // new Sky(2157),
                    // new Sky(2876),
                    // new Sky(3595),
                    // new Sky(4314),
                    // new Sky(5033),
                    // new Sky(5752),
                    // new Sky(6471),
                    // new Sky(7190),
                    // new Sky(7909)
                ],
            coins:
                [
                    // new Coin(images),
                    // new Coin(images),
                    // new Coin(images),
                    // new Coin(images),
                    // new Coin(images),
                    // new Coin(images)
                ],
            bottles:
                [
                    new Bottle(images, 1500),
                    new Bottle(images, 1550),
                    // new Bottle(images, 530),
                    // new Bottle(images, 550),
                    // new Bottle(images, 560),
                    // new Bottle(images, 580),
                    // new Bottle(images, 590),
                    // new Bottle(images, 600)
                ]
        }


    );

    const step = 720;
    const count = 38;
    const startX = -720;


    for (let i = 0; i < count; i++) {
        const xPos = startX + i * step;

        // BACKGROUND: 3 ↔ 0
        const backFrame = i % 2 === 0 ? 3 : 0;
        townLevel.grounds.backGrounds.push(
            new Ground(groundSrcTown[backFrame], xPos)
        );

        // MIDGROUND: 4 ↔ 1
        const midFrame = i % 2 === 0 ? 4 : 1;
        townLevel.grounds.midGrounds.push(
            new Ground(groundSrcTown[midFrame], xPos)
        );

        // FOREGROUND: 5 ↔ 2
        const foreFrame = i % 2 === 0 ? 5 : 2;
        townLevel.grounds.foreGrounds.push(
            new Ground(groundSrcTown[foreFrame], xPos)
        );
    }

    for (let i = 0; i < count; i++) {
        const xPos = startX + i * step;
        townLevel.sky.push(new Sky(xPos));
    }


    let calculationX = 18676
    for (let index = 0; index < 41; index++) {
        townLevel.grounds.foreGrounds.push(new Ground(groundSrcTown[7], calculationX, 572, 150, 300));
        calculationX = calculationX + 100;
    }
    return townLevel;
}
