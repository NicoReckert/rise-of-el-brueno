import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { Cloud } from '../../classes/entities/cloud.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';
import { Sky } from '../../classes/entities/sky.class.js';

const groundSrc =
    [
        './assets/img/5_background/layers/3_third_layer/1.webp',
        './assets/img/5_background/layers/2_second_layer/1.webp',
        './assets/img/5_background/layers/1_first_layer/1.webp',
        './assets/img/5_background/layers/3_third_layer/2.webp',
        './assets/img/5_background/layers/2_second_layer/2.webp',
        './assets/img/5_background/layers/1_first_layer/2.webp',
        './assets/img/grass.webp',
        './assets/img/5_background/layers/ground-town.webp',
        './assets/img/5_background/layers/ground-town2.webp',
        './assets/img/5_background/layers/ground-town3.webp'
    ]

const scenerySrc =
    [
        './assets/img/wooden_cart.webp',
    ]

export function createFarmLevel({ entityImages }) {
    // Wolken
    const levelWidth = 7200;
    const CLOUD_DENSITY = 1 / 700;
    const clouds = [];
    const cloudCount = Math.round(levelWidth * CLOUD_DENSITY);
    for (let i = 0; i < cloudCount; i++) {
        clouds.push(new Cloud({ existingClouds: clouds, minDistance: 280, levelWidth: levelWidth, entityImages: entityImages }));
    }

    // BACKGROUND
    const backGrounds = [
        new Ground(groundSrc[3], -720),
        new Ground(groundSrc[0], 0),
        new Ground(groundSrc[3], 720),
        new Ground(groundSrc[0], 1440),
        new Ground(groundSrc[3], 2160),
        new Ground(groundSrc[0], 2880),
        new Ground(groundSrc[3], 3600),
        new Ground(groundSrc[0], 4320),
        new Ground(groundSrc[3], 5040),
        new Ground(groundSrc[0], 5760),
        new Ground(groundSrc[3], 6480)
    ];

    // MIDGROUND
    const midGrounds = [
        new Ground(groundSrc[4], -720),
        new Ground(groundSrc[1], 0),
        new Ground(groundSrc[4], 720),
        new Ground(groundSrc[1], 1440),
        new Ground(groundSrc[4], 2160),
        new Ground(groundSrc[1], 2880),
        new Ground(groundSrc[4], 3600),
        new Ground(groundSrc[1], 4320),
        new Ground(groundSrc[4], 5040),
        new Ground(groundSrc[1], 5760),
        new Ground(groundSrc[4], 6480)
    ];

    // FOREGROUND
    const foreGrounds = [
        new Ground(groundSrc[5], -720),
        new Ground(groundSrc[2], 0),
        new Ground(groundSrc[5], 720),
        new Ground(groundSrc[2], 1440),
        new Ground(groundSrc[5], 2160),
        new Ground(groundSrc[2], 2880),
        new Ground(groundSrc[5], 3600),
        new Ground(groundSrc[2], 4320),
        new Ground(groundSrc[5], 5040),
        new Ground(groundSrc[2], 5760),
        new Ground(groundSrc[5], 6480),
        new Ground(groundSrc[6], 5033, 575, 720, 100), // Grasfläche
    ];

    // Extra-Boden-Kacheln
    let calculationX = 1280;
    for (let i = 0; i < 66; i++) {
        foreGrounds.push(
            new Ground(groundSrc[9], calculationX, 575, 150, 150)
        );
        calculationX += 50;
    }


    const sceneryObjects = [
        new SceneryObject(scenerySrc[0], 1310, 408, 300, 300),
    ];

    // Himmel
    const sky = new Sky({ width: 1280, height: 720, preset: "night" });

    // Level erstellen
    return new Level({
        clouds,
        grounds: {
            backGrounds,
            midGrounds,
            foreGrounds
        },
        sceneryObjects: sceneryObjects,
        sky
    });
}