import { PopupText } from "../../../classes/ui/popup-text.class.js";

export const farmHelper = {
    /**
     * Handles stable door trigger logic based on character position.
     * @param {*} setup Configuration or state setup object.
     * @param {Object} [options={}] Optional stable trigger settings.
     * @returns {void}
     */
    handleStableDoorTrigger(setup, options = {}) {
        const { minX, maxX, openDelay } = farmHelper.normalizeStableOptions(options);
        const { character } = setup.world;
        const stable = setup.environment.stable;
        const state = setup.state;
        const isInside = farmHelper.isCharacterInsideStableRange(character, minX, maxX);
        if (isInside) {
            farmHelper.handleStableInside(state, stable, setup, openDelay);
        } else {
            farmHelper.handleStableOutside(state, stable, setup);
        }
    },

    /**
     * Normalizes stable trigger options with default values.
     * @param {Object} [options={}] Stable trigger options.
     * @param {number} [options.minX=1620] Minimum x-position.
     * @param {number} [options.maxX=1810] Maximum x-position.
     * @param {number} [options.openDelay=350] Delay before opening.
     * @returns {{ minX: number, maxX: number, openDelay: number }}
     */
    normalizeStableOptions({
        minX = 1620,
        maxX = 1810,
        openDelay = 350
    } = {}) {
        return { minX, maxX, openDelay };
    },

    /**
     * Checks whether the character is within the stable range.
     * @param {*} character Character instance.
     * @param {number} minX Minimum x-position.
     * @param {number} maxX Maximum x-position.
     * @returns {boolean}
     */
    isCharacterInsideStableRange(character, minX, maxX) {
        return character.x >= minX && character.x <= maxX;
    },

    /**
     * Handles logic when the character is inside the stable range,
     * including delayed door opening and sound playback.
     * @param {*} state Level state object.
     * @param {*} stable Stable environment object.
     * @param {*} setup Configuration or state setup object.
     * @param {number} openDelay Delay before opening the door.
     * @returns {void}
     */
    handleStableInside(state, stable, setup, openDelay) {
        const animation = stable.currentAnimation;
        if (!state.timeOnStable) {
            state.timeOnStable = performance.now();
        }
        const elapsed = performance.now() - state.timeOnStable;
        if (!farmHelper.canStableDoorOpen(state, animation, elapsed, openDelay)) return;
        state.doorState = "open";
        stable.updateAnimationState("doorOpens");
        setup.sounds.doorOpenSfx.play();
    },

    /**
     * Determines whether the stable door can open.
     * @param {*} state Level state object.
     * @param {string} animation Current stable animation state.
     * @param {number} elapsed Elapsed time in milliseconds.
     * @param {number} openDelay Required delay before opening.
     * @returns {boolean}
     */
    canStableDoorOpen(state, animation, elapsed, openDelay) {
        if (state.doorState === "open") return false;
        if (animation === "doorOpens") return false;
        if (animation === "idleOpen") return false;
        if (elapsed < openDelay) return false;
        return true;
    },

    /**
     * Handles logic when the character is outside the stable range,
     * including door closing and sound playback.
     * @param {*} state Level state object.
     * @param {*} stable Stable environment object.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    handleStableOutside(state, stable, setup) {
        state.timeOnStable = null;
        const animation = stable.currentAnimation;
        if (!farmHelper.canStableDoorClose(state, animation)) return;
        state.doorState = "closed";
        stable.updateAnimationState("doorCloses");
        setup.sounds.doorCloseSfx.play();
    },

    /**
     * Determines whether the stable door can close.
     * @param {*} state Level state object.
     * @param {string} animation Current stable animation state.
     * @returns {boolean}
     */
    canStableDoorClose(state, animation) {
        if (state.doorState === "closed") return false;
        if (animation === "doorCloses") return false;
        if (animation === "idle") return false;
        return true;
    },

    /**
     * Moves the character and camera to the campfire scene
     * and finalizes arrival when both reach their targets.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    moveCharacterToCampfireScene(setup) {
        const world = setup.world;
        const char = world.character;
        const camArrived = world.camera.moveToX(108, { speed: 6 });
        const arrivedX = char.movementCtrl.moveToX(788, { speed: 5, faceTarget: true, stopWalkOnArrive: false });
        const arrivedY = char.movementCtrl.moveToY(393, { speed: 1.5 });
        if (!arrivedX || !arrivedY) return;
        char.isWalk = false;
        if (!camArrived) return;
        farmHelper.finalizeCampfireArrival(setup, char);
    },

    /**
     * Finalizes arrival at the campfire scene by updating character state
     * and advancing the quest.
     * @param {*} setup Configuration or state setup object.
     * @param {*} char Character instance.
     * @returns {void}
     */
    finalizeCampfireArrival(setup, char) {
        char.isFlipped = true;
        char.isWalk = false;
        char.yNormal = 393;
        char.yVoidless = 510;
        char.isLightACampfire = true;
        const questMgr = setup.world.farmLevelController.questManager;
        questMgr.advance(10);
    },

    /**
     * Renders a portrait with a radial fade effect and optional glow.
     * @param {*} setup Configuration or state setup object.
     * @param {*} portrait Portrait object to render.
     * @param {Object} [options={}] Optional fade and glow settings.
     * @returns {void}
     */
    renderPortraitWithRadialFade(setup, portrait, options = {}) {
        const { opacity, glowColor, glowBlur, innerStop } =
            farmHelper.normalizeFadeOptions(options);
        const ctx = setup.world.ctx;
        ctx.save();
        ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
        const offData = farmHelper.createPortraitOffscreen(setup, portrait);
        farmHelper.applyRadialFadeMask(offData, opacity, innerStop);
        farmHelper.drawPortraitWithGlow(ctx, offData, portrait, opacity, glowColor, glowBlur);
        ctx.restore();
    },

    /**
     * Normalizes radial fade and glow options with default values.
     * @param {Object} [options={}] Fade configuration options.
     * @param {number} [options.opacity=0.75] Overlay opacity.
     * @param {string} [options.glowColor="rgba(0, 200, 255, 0.6)"] Glow color.
     * @param {number} [options.glowBlur=30] Glow blur radius.
     * @param {number} [options.innerStop=0.85] Inner gradient stop position.
     * @returns {{ opacity: number, glowColor: string, glowBlur: number, innerStop: number }}
     */
    normalizeFadeOptions({
        opacity = 0.75,
        glowColor = "rgba(0, 200, 255, 0.6)",
        glowBlur = 30,
        innerStop = 0.85
    } = {}) {
        return { opacity, glowColor, glowBlur, innerStop };
    },

    /**
     * Creates an offscreen canvas for rendering a portrait.
     * @param {*} setup Configuration or state setup object.
     * @param {*} portrait Portrait object to render.
     * @returns {{ offscreen: HTMLCanvasElement, offCtx: CanvasRenderingContext2D }}
     */
    createPortraitOffscreen(setup, portrait) {
        const offscreen = document.createElement("canvas");
        offscreen.width = portrait.width;
        offscreen.height = portrait.height;
        const offCtx = offscreen.getContext("2d");
        setup.world.renderer.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);
        return { offscreen, offCtx };
    },

    /**
     * Applies a radial fade mask to an offscreen portrait canvas.
     * @param {{ offscreen: HTMLCanvasElement, offCtx: CanvasRenderingContext2D }} offData Offscreen canvas data.
     * @param {number} opacity Mask opacity.
     * @param {number} innerStop Inner gradient stop position.
     * @returns {void}
     */
    applyRadialFadeMask(offData, opacity, innerStop) {
        const { offscreen, offCtx } = offData;
        const cx = offscreen.width / 2;
        const cy = offscreen.height / 2;
        const r = Math.max(offscreen.width, offscreen.height) / 2;
        const gradient = offCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0.0, `rgba(0, 0, 0, ${opacity})`);
        gradient.addColorStop(innerStop, `rgba(0, 0, 0, ${opacity})`);
        gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");
        offCtx.globalCompositeOperation = "destination-in";
        offCtx.fillStyle = gradient;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
        offCtx.globalCompositeOperation = "source-over";
    },

    /**
     * Draws the faded portrait onto the canvas with a glow effect.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {{ offscreen: HTMLCanvasElement }} offData Offscreen canvas data.
     * @param {*} portrait Portrait object with position data.
     * @param {number} opacity Draw opacity.
     * @param {string} glowColor Glow color.
     * @param {number} glowBlur Glow blur radius.
     * @returns {void}
     */
    drawPortraitWithGlow(ctx, offData, portrait, opacity, glowColor, glowBlur) {
        const { offscreen } = offData;
        ctx.globalAlpha = opacity;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowBlur;
        ctx.drawImage(offscreen, portrait.x, portrait.y);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    },

    /**
     * Updates and draws the darkness overlay.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    syncDarknessOverlay(setup) {
        const dt = farmHelper.getDarknessDeltaSeconds(setup);
        const shouldDarken = farmHelper.shouldDarkenFarm(setup);
        farmHelper.updateDarknessLevel(setup, shouldDarken, dt);
        farmHelper.drawDarknessOverlay(setup);
    },

    /**
     * Returns elapsed seconds since the last darkness update.
     * @param {*} setup Configuration or state setup object.
     * @returns {number}
     */
    getDarknessDeltaSeconds(setup) {
        const now = setup.world.timestamp;
        const last = setup.state.lastDarknessTimestamp ?? now;
        setup.state.lastDarknessTimestamp = now;
        return (now - last) / 1000;
    },

    /**
     * Determines whether the farm darkness should increase.
     * @param {*} setup Configuration or state setup object.
     * @returns {boolean}
     */
    shouldDarkenFarm(setup) {
        const step = setup.world.farmLevelController.questManager.step;
        const darkSteps = [10, 11, 12, 13, 14, 15, 16, 17];
        return darkSteps.includes(step) && setup.state.isNight;
    },

    /**
     * Updates the darkness level using timestamp-based fading.
     * @param {*} setup Configuration or state setup object.
     * @param {boolean} shouldDarken Whether darkness should increase.
     * @param {number} dt Elapsed seconds since last update.
     * @param {number} [speed=0.3] Fade speed per second.
     * @returns {void}
     */
    updateDarknessLevel(setup, shouldDarken, dt, speed = 0.3) {
        const state = setup.state;
        const delta = speed * dt;
        const next = shouldDarken
            ? state.darknessLevel + delta
            : state.darknessLevel - delta;
        state.darknessLevel = Math.max(0, Math.min(next, state.maxDarkness));
    },

    /**
     * Draws the darkness overlay on the farm canvas.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    drawDarknessOverlay(setup) {
        const { ctx, canvas } = setup.world;
        ctx.fillStyle = `rgba(10,10,40,${setup.state.darknessLevel})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * Skips the farmhouse cutscene to the post-prolog state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    skipFarmHouseCutsceneToPostProlog(setup) {
        const world = setup.world;
        const char = world.character;
        setup.dialogManager?.stopAllDialogs?.();
        this.resetFarmHouseCutsceneVideo(setup);
        this.fadeOutFarmHouseCutsceneAudio(setup, world);
        this.resetFarmHouseCutsceneFlags(setup, char, world);
        this.resetFarmHouseCutsceneControls(setup, world, char);
        this.finishFarmHouseCutsceneSkip(setup, world);
    },

    /**
     * Resets the farmhouse cutscene video.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    resetFarmHouseCutsceneVideo(setup) {
        setup.video?.pause();
        if (setup.video) setup.video.currentTime = 0;
    },

    /**
     * Fades out the farmhouse cutscene audio.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @returns {void}
     */
    fadeOutFarmHouseCutsceneAudio(setup, world) {
        world.audioManager.fadeOutAudio(setup.sounds.droneIdleSfx, 300);
        world.audioManager.fadeOutAudio(setup.sounds.droneControlledSfx, 300);
        world.audioManager.fadeOutAudio(setup.sounds.farmNightMusic, 300);
        world.audioManager.fadeOutAudio(setup.sounds.farmNightAmbience, 300);
        world.audioManager.fadeOutAudio(setup.sounds.sadMusic, 300);
    },

    /**
     * Resets the farmhouse cutscene flags.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {Object} world World object.
     * @returns {void}
     */
    resetFarmHouseCutsceneFlags(setup, char, world) {
        setup.state.isNight = false;
        setup.state.darknessLevel = 0;
        setup.state.lastDarknessTimestamp = world.timestamp;
        setup.state.earthquakeStart = false;
        setup.state.prologVideoStarted = false;
        setup.state.prologVideoFinished = false;
        char.isKneelAndCry = false;
        char.isStandUpAndLookDetermined = false;
        char.isLookDeterminedAndStandUp = false;
        world.camera_x = 800;
    },

    /**
     * Resets the farmhouse cutscene controls.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @param {Object} char Character object.
     * @returns {void}
     */
    resetFarmHouseCutsceneControls(setup, world, char) {
        char.isMovingLeft = false;
        char.isMovingRight = false;
        char.isWalk = false;
        char.isStandUp = false;
        setup.environment.house.updateAnimationState('doorCloses');
        setup.cutsceneIndicator.hide();
        world.isKeysStopp = false;
        world.keyboard.X = false;
    },

    /**
     * Finishes the farmhouse cutscene skip.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @returns {void}
     */
    finishFarmHouseCutsceneSkip(setup, world) {
        if (!world.taskWindow.tasks[7]) {
            world.taskWindow.addTask('8. Besuche nochmal den Stall', { active: true });
            setup.sounds.newTaskSfx.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", world.canvas.width / 2, 400));
        }
        world.farmLevelController.questManager.advance(20);
    }
}