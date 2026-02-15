import { Level } from '../../classes/core/level.class.js';
import { Town } from '../../classes/entities/town.class.js';

const groundSrcNayelisHouse =
    [

    ]

const townSrcNayelisHouse =
    [
        './assets/img/house_nayeli_interior.png'
    ]

export function createNayelisHouseLevel() {
    const grounds =
        [

        ]
    const towns =
        [
            new Town(townSrcNayelisHouse[0], 240, 325, 800, 400)
        ]
    return new Level({
        grounds,
        towns
    });
}