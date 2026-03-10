import { SandstormEffect } from '../../classes/effects/sandstorm-effect.class.js';
import { MagicShieldEffect } from '../../classes/effects/magic-shield-effect.class.js';
import { WindParticleEffect } from '../../classes/effects/wind-particle.class.js';
import { TimerManager } from '../../classes/systems/timer-manager.class.js';
import { ThrowBottleSystem } from '../../classes/systems/throw-bottle-system.class.js';
import { DarkEnergyEffect } from '../../classes/effects/dark-energy-effect.class.js';
import { StormHazardSystem } from '../../classes/systems/storm-hazard-system.class.js';

/**
 * Creates runtime systems used in the town level.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Town runtime systems.
 */
export function createTownSystems(setup) {
    const { world, entityImages } = setup;
    const { canvas } = world;
    const sandstorms = createTownSandstorms(canvas, entityImages);
    const magicShield = createTownMagicShield(canvas, sandstorms);
    return {
        timerManager: new TimerManager(), ...sandstorms, magicShield,
        windParticleEffect: createTownWindParticleEffect(canvas),
        throwBottleSystem: createTownThrowBottleSystem(world, setup),
        darkEnergyEffect: createTownDarkEnergyEffect(canvas),
        stormHazards: createTownStormHazardSystem(world, setup, canvas)
    };
}

/**
 * Creates sandstorm effect instances for the town level.
 * @param {HTMLCanvasElement} canvas Canvas reference.
 * @param {Object} entityImages Image resources for sandstorm particles.
 * @returns {Object} Sandstorm effect instances.
 */
function createTownSandstorms(canvas, entityImages) {
    return {
        sandstorm: new SandstormEffect(canvas, entityImages),
        sandstormNear: new SandstormEffect(canvas, entityImages),
        sandstormFar: new SandstormEffect(canvas, entityImages)
    };
}

/**
 * Creates the magic shield effect for the town level.
 * @param {HTMLCanvasElement} canvas Canvas reference.
 * @param {Object} sandstorms Sandstorm effect instances.
 * @returns {Object} Magic shield effect instance.
 */
function createTownMagicShield(canvas, sandstorms) {
    const magicShield = new MagicShieldEffect(canvas);
    magicShield.onShockwave = () => applyTownSandstormShockwave(sandstorms);
    return magicShield;
}

/**
 * Applies a shockwave effect to town sandstorm layers.
 * @param {{sandstorm:Object, sandstormNear:Object, sandstormFar:Object}} sandstorms Sandstorm effect instances.
 * @returns {void}
 */
function applyTownSandstormShockwave({ sandstorm, sandstormNear, sandstormFar }) {
    sandstorm.pressure = 0.4;
    sandstormNear.pressure = 0.6;
    sandstormFar.pressure = 0.2;
}

/**
 * Creates the wind particle effect for the town level.
 * @param {HTMLCanvasElement} canvas Canvas reference.
 * @returns {Object} Wind particle effect instance.
 */
function createTownWindParticleEffect(canvas) {
    return new WindParticleEffect(canvas.width * 38, canvas.height, 1200);
}

/**
 * Creates the throw bottle system for the town level.
 * @param {Object} world World reference.
 * @param {Object} setup Town level setup reference.
 * @returns {Object} Throw bottle system instance.
 */
function createTownThrowBottleSystem(world, setup) {
    return new ThrowBottleSystem({ world, setup, animName: 'throw', releaseFrame: 4 });
}

/**
 * Creates the dark energy effect for the town level.
 * @param {HTMLCanvasElement} canvas Canvas reference.
 * @returns {Object} Dark energy effect instance.
 */
function createTownDarkEnergyEffect(canvas) {
    return new DarkEnergyEffect(canvas.width, canvas.height, 6, {
        yMin: canvas.height * 0.06, yMax: canvas.height * 0.38,
        alphaMin: 0.12, alphaMax: 0.28,
        minWidth: 4, maxWidth: 11, minLen: 320, maxLen: 820
    });
}

/**
 * Creates the storm hazard system for the town level.
 * @param {Object} world World reference.
 * @param {Object} setup Town level setup reference.
 * @param {HTMLCanvasElement} canvas Canvas reference.
 * @returns {Object} Storm hazard system instance.
 */
function createTownStormHazardSystem(world, setup, canvas) {
    return new StormHazardSystem({ world, setup, canvas });
}