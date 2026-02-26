import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { Cloud } from '../../classes/entities/cloud.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';
import { Sky } from '../../classes/entities/sky.class.js';
import { Bottle } from '../../classes/entities/bottle.class.js';

const groundSrc =
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

const scenerySrc =
    [
        './assets/img/town1.webp',
        './assets/img/town2.webp',
        './assets/img/town3.webp',
        './assets/img/town4.webp',
        './assets/img/town5.webp',
        './assets/img/town6.webp',
        './assets/img/house_nayeli.png'

    ]

export function createTownLevel({ entityImages, allAudios }) {
    const levelWidth = 26640;
    const CLOUD_DENSITY = 1 / 700;
    const cloudArray = [];
    const cloudCount = Math.round(levelWidth * CLOUD_DENSITY);
    for (let i = 0; i < cloudCount; i++) {
        cloudArray.push(new Cloud({ existingClouds: cloudArray, minDistance: 280, levelWidth: levelWidth, entityImages: entityImages })); // 100px Mindestabstand
    }
    const townLevel = new Level(
        {
            enemies:
                [
                    // new Chicken('chickenMutatesSmall', entityImages, 120, 120, 545, null, allAudios),
                    // new Chicken('chickenMutatesSmall', entityImages, 120, 120, 545, null,  allAudios),
                    // new Chicken('chickenMutatesSmall', entityImages, 120, 120, 545, null,  allAudios),
                    // new Chicken('chickenMutatesBig', entityImages, 160, 160, 505, null,  allAudios),
                    // new Chicken('chickenMutatesBig', entityImages, 160, 160, 505, null, allAudios),
                    // new Chicken('chickenMutatesBig', entityImages, 160, 160, 505, null, allAudios)
                ],
            clouds: cloudArray,

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
            sceneryObjects:
                [
                    new SceneryObject(scenerySrc[6], 10000, 275, 550, 450),
                    new SceneryObject(scenerySrc[0], 18676, 5, 1000, 800),
                    new SceneryObject(scenerySrc[1], 19618, -105, 1000, 1000),
                    // new SceneryObject(scenerySrc[2], 3160, 25, 800, 800),
                    new SceneryObject(scenerySrc[3], 20523, -35, 800, 800),
                    new SceneryObject(scenerySrc[4], 21338, -18, 800, 800),
                    new SceneryObject(scenerySrc[5], 22038, -17, 1000, 800)
                ],
            sky:
                new Sky({ width: 1280, height: 720, preset: "tragicDay" }),
            coins:
                [
                    // new Coin(entityImages),
                    // new Coin(entityImages),
                    // new Coin(entityImages),
                    // new Coin(entityImages),
                    // new Coin(entityImages),
                    // new Coin(entityImages)
                ],
            bottles:
                [
                    new Bottle(entityImages, 1500),
                    new Bottle(entityImages, 1550),
                    // new Bottle(entityImages, 530),
                    // new Bottle(entityImages, 550),
                    // new Bottle(entityImages, 560),
                    // new Bottle(entityImages, 580),
                    // new Bottle(entityImages, 590),
                    // new Bottle(entityImages, 600)
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
            new Ground(groundSrc[backFrame], xPos)
        );

        // MIDGROUND: 4 ↔ 1
        const midFrame = i % 2 === 0 ? 4 : 1;
        townLevel.grounds.midGrounds.push(
            new Ground(groundSrc[midFrame], xPos)
        );

        // FOREGROUND: 5 ↔ 2
        const foreFrame = i % 2 === 0 ? 5 : 2;
        townLevel.grounds.foreGrounds.push(
            new Ground(groundSrc[foreFrame], xPos)
        );
    }

    let calculationX = 18676
    for (let index = 0; index < 41; index++) {
        townLevel.grounds.foreGrounds.push(new Ground(groundSrc[7], calculationX, 572, 300, 150));
        calculationX = calculationX + 100;
    }
    return townLevel;
}
