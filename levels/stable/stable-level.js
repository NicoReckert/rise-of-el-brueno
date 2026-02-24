import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';

const groundSrc =
    [
        './assets/img/wood_background.webp'
    ]

const scenerySrc =
    [
        './assets/img/stable_interior.webp'
    ]

export const stableLevel = new Level(
    {
        grounds:
            [
                // new Ground(groundSrc[0], -719),
                // new Ground(groundSrc[0], 0),
                // new Ground(groundSrc[0], 719),
                // new Ground(groundSrc[0], -719),
                new Ground(groundSrc[0], 0, 0, 1280, 720),
                new Ground(groundSrc[0], 1278, 0, 1280, 720),
            ],
        sceneryObjects:
            [
                new SceneryObject(scenerySrc[0], 280, 260, 720, 480)
            ]
    }
);