import { Level } from '../../classes/core/level.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';

const groundSrcNayelisHouse =
    [

    ]

const scenerySrc =
    [
        './assets/img/house_nayeli_interior.png'
    ]

export function createNayelisHouseLevel() {
    const grounds =
        [

        ]
    const sceneryObjects =
        [
            new SceneryObject(scenerySrc[0], 240, 325, 800, 400)
        ]
    return new Level({
        grounds,
        sceneryObjects
    });
}