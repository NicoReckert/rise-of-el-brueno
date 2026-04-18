import { HollowHint } from "../../classes/ui/hollow-hint.class.js";
import { getControlById } from "../../config/controls-config.js";

/**
 * Creates the farm hint instances.
 * @param {Object} character Main character instance.
 * @param {Object} characters Collection of character instances.
 * @returns {Array<Object>} List of hint objects.
 */
export function createFarmHints(character, characters) {
  return [
    new HollowHint("Betreten", character, 80, 'desert', { control: getControlById('interact') }),
    new HollowHint("Begleiten", characters.cow, 80, 'desert', { control: getControlById('interact') }),
    new HollowHint("Begleiten", characters.cow, 80, 'desert'),
    new HollowHint("Warten", characters.cow, 120, 'desert'),
    new HollowHint("Belohnen", characters.cow, 80, 'rose', { control: getControlById('interact') }),
    new HollowHint("Haus Betreten", character, 80, 'desert', { control: getControlById('interact') }),
    new HollowHint("Nicht Jetzt", character, 100, 'desert'),
  ];
}