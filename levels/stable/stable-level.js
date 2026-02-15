import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { Town } from '../../classes/entities/town.class.js';

const groundSrcStable =
    [
        './assets/img/wood_background.webp'
    ]

const townSrcStable =
    [
        './assets/img/stable_interior.webp'
    ]

export const stableLevel = new Level(
    {
        grounds:
            [
                // new Ground(groundSrcStable[0], -719),
                // new Ground(groundSrcStable[0], 0),
                // new Ground(groundSrcStable[0], 719),
                // new Ground(groundSrcStable[0], -719),
                new Ground(groundSrcStable[0], 0, 0, 720, 1280),
                new Ground(groundSrcStable[0], 1279, 0, 720, 1280),
            ],
        towns:
            [
                new Town(townSrcStable[0], 280, 260, 720, 480)
            ]
    }
);