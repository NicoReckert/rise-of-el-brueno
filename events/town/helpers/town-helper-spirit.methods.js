export const townSpiritHelperMethods = {
    /**
     * Spawns the town spirits.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    spawnTownSpirits(setup) {
        townHelper.setupSpiritEchoAnimations(setup);
        townHelper.setupSpiritEchoLayout(setup);
        townHelper.setupTownSpiritAnimations(setup);
        townHelper.setupTownSpiritLayout(setup);
        townHelper.fadeInTownSpirits(setup);
    },

    /**
     * Sets up the spirit echo animations.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupSpiritEchoAnimations(setup) {
        setup.environment.nayeliSpiritEcho.updateAnimationState('idle');
        setup.environment.sollitaSpiritEcho.updateAnimationState('idle');
        setup.environment.tadeoSpiritEcho.updateAnimationState('idle');
    },

    /**
     * Sets up the spirit echo layout.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupSpiritEchoLayout(setup) {
        const env = setup.environment;
        townHelper.setupNayeliSpiritEcho(env);
        townHelper.setupSollitaSpiritEcho(env);
        townHelper.setupTadeoSpiritEcho(env);
    },

    /**
     * Sets up the Nayeli spirit echo layout.
     * @param {Object} env Environment object.
     * @returns {void}
     */
    setupNayeliSpiritEcho(env) {
        env.nayeliSpiritEcho.x = 26970;
        env.nayeliSpiritEcho.width = 200;
        env.nayeliSpiritEcho.height = 200;
        env.nayeliSpiritEcho.y = 170;
    },

    /**
     * Sets up the Sollita spirit echo layout.
     * @param {Object} env Environment object.
     * @returns {void}
     */
    setupSollitaSpiritEcho(env) {
        env.sollitaSpiritEcho.x = 26970;
        env.sollitaSpiritEcho.width = 200;
        env.sollitaSpiritEcho.height = 200;
        env.sollitaSpiritEcho.y = 370;
    },

    /**
     * Sets up the Tadeo spirit echo layout.
     * @param {Object} env Environment object.
     * @returns {void}
     */
    setupTadeoSpiritEcho(env) {
        env.tadeoSpiritEcho.x = 27095;
        env.tadeoSpiritEcho.width = 150;
        env.tadeoSpiritEcho.height = 150;
        env.tadeoSpiritEcho.y = 295;
        env.tadeoSpiritEcho.isFlipped = false;
    },

    /**
     * Sets up the town spirit animations.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupTownSpiritAnimations(setup) {
        setup.environment.lolaSpirit.updateAnimationState('idle', 1000 / 4.5);
        setup.environment.juanitoSpirit.updateAnimationState('idle', 1000 / 4.5);
        setup.environment.pollitoSpirit.updateAnimationState('idle', 1000 / 4.5);
    },

    /**
     * Sets up the town spirit layout.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupTownSpiritLayout(setup) {
        const env = setup.environment;
        env.lolaSpirit.x = 27120;
        env.juanitoSpirit.x = 27145;
        env.pollitoSpirit.x = 27195;
        env.lolaSpirit.y = 400;
        env.juanitoSpirit.y = 145;
        env.pollitoSpirit.y = 320;
        env.juanitoSpirit.isFlipped = false;
        env.pollitoSpirit.isFlipped = true;
    },

    /**
     * Fades in the town spirits.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    fadeInTownSpirits(setup) {
        const time = setup.world.timestamp;
        setup.environment.nayeliSpiritEcho.fadeIn(time, 4000);
        setup.environment.sollitaSpiritEcho.fadeIn(time, 4000);
        setup.environment.tadeoSpiritEcho.fadeIn(time, 4000);
        setup.environment.juanitoSpirit.fadeIn(time, 4000);
        setup.environment.lolaSpirit.fadeIn(time, 4000);
        setup.environment.pollitoSpirit.fadeIn(time, 4000);
    }
};