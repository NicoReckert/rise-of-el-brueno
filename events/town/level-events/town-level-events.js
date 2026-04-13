import { townEvents_part1 } from "./town-events-part1.js";
import { townEvents_part2 } from "./town-events-part2.js";
import { townEvents_part3 } from "./town-events-part3.js";
import { townEvents_part4 } from "./town-events-part4.js";
import { townEvents_part5 } from "./town-events-part5.js";
import { townEvents_part6 } from "./town-events-part6.js";
import { townEvents_collisionsCombat } from "./town-events-collisions-combat.js";
import { townEvents_collisionsSystem } from "./town-events-collisions-system.js";

export const townEvents =
    [
        ...townEvents_part1,
        ...townEvents_part2,
        ...townEvents_part3,
        ...townEvents_part4,
        ...townEvents_part5,
        ...townEvents_part6,
        ...townEvents_collisionsCombat,
        ...townEvents_collisionsSystem
    ];