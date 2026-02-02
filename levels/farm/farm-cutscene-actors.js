import { AnimatedEntity } from "../../classes/animated-entity.class.js";

export function createFarmCutsceneActors(entityImages) {
    const actors = {
        chickenTranced: new AnimatedEntity(entityImages, 'chickenTranced', 90, 90, 200, 580),
        chickTranced: new AnimatedEntity(entityImages, 'chickTranced', 60, 60, 500, 600),
        cowTranced: new AnimatedEntity(entityImages, 'cowTranced', 200, 200, -100, 492),
    };

    actors.cowTranced.isFlipped = true;

    return actors;
}