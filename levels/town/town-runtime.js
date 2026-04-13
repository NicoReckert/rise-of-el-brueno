import { EndbossAttack } from '../../classes/effects/endboss-attack.class.js';
import { ComicPanel } from '../../classes/ui/comic-panel.class.js';
import { townEvents } from '../../events/town/level-events/town-level-events.js';

/**
 * Applies runtime objects and references to the town setup.
 * @param {Object} setup Town level setup reference.
 * @returns {void}
 */
export function applyTownRuntime(setup) {
    setup.townEvents = townEvents;
    setup.endbossAttack = new EndbossAttack(setup.entityImages, setup.allAudios, setup.world);
    setup.panel = new ComicPanel(setup.world.canvas, setup.entityImages.tadeo?.stoneActivated ?? []);
}