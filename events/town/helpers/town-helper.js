import { townFlowHelperMethods } from './town-helper-flow.methods.js';
import { townTadeoHelperMethods } from './town-helper-tadeo.methods.js';
import { townSpiritHelperMethods } from './town-helper-spirit.methods.js';
import { townCombatHelperMethods } from './town-helper-combat.methods.js';
import { townBottleHitHelperMethods } from './town-helper-bottle-hit.methods.js';
import { townBottleThrowHelperMethods } from './town-helper-bottle-throw.methods.js';

export const townHelper = {
    ...townFlowHelperMethods,
    ...townTadeoHelperMethods,
    ...townSpiritHelperMethods,
    ...townCombatHelperMethods,
    ...townBottleHitHelperMethods,
    ...townBottleThrowHelperMethods
};