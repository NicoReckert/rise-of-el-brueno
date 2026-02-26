import { MovableObject } from '../systems/movable-object.class.js';
import { CharacterConfig } from '../systems/character-config.class.js';
import { CharacterAnimationController } from '../systems/character-animation-controller.class.js';
import { CharacterCombatController } from '../systems/character-combat-controller.class.js';
import { CharacterMovementController } from '../systems/character-movement-controller.class.js';
import { CharacterAudioController } from '../systems/character-audio-controller.class.js';

/**
 * Represents the playable character.
 */
export class Character extends MovableObject {
    /**
    * Creates a new character instance.
    * @param {Object} characterImages Character image assets.
    * @param {Object} world World instance.
    * @param {Object} audioManager Audio manager instance.
    */
    constructor(characterImages, world, audioManager) {
        super();
        this.config = new CharacterConfig(this, characterImages);
        this.config.initAll();
        this.animCtrl = new CharacterAnimationController(this);
        this.combatCtrl = new CharacterCombatController(this, this.animCtrl);
        this.movementCtrl = new CharacterMovementController(this, world, this.animCtrl)
        this.audioCtrl = new CharacterAudioController(this, audioManager);
        this.characterImages = characterImages;
        this.world = world;
    }

    /**
    * Updates all character subsystems.
    */
    updateAll(timestamp) {
        this.movementCtrl.updateState(timestamp);
        this.animCtrl.updateAnimation(timestamp);
        if (this.isJumping) this.applyGravity(timestamp);
        this.audioCtrl.update(timestamp);
    }

    /**
    * Returns animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*} Animation images.
    */
    getAnimationImages(state) {
        return (
            this.getMovementImages(state) ??
            this.getEmotionImages(state) ??
            this.getDeterminedImages(state) ??
            this.getMusicImages(state) ??
            this.getCombatImages(state) ??
            this.getSpecialImages(state) ??
            this.idleWalkSheet
        );
    }

    /**
    * Returns movement-related animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*|null} Animation images or null if not found.
    */
    getMovementImages(state) {
        switch (state) {
            case 'walk': return this.idleWalkSheet;
            case 'jump': return this.jumpSheet;
            case 'stand-up': return this.lightCampfireStandUpSheet;
            case 'walk-determined': return this.walkStandDeterminedSheet;
            case 'walk-in-storm': return this.walkInStormCollapseSheet;
        }
        return null;
    }

    /**
    * Returns emotion-related animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*|null} Animation images or null if not found.
    */
    getEmotionImages(state) {
        switch (state) {
            case 'dead': return this.hurtDeadSheet;
            case 'hurt': return this.hurtDeadSheet;
            case 'kneel-and-cry': return this.kneelCryStandUpDeterminedSheet;
            case 'kneel-and-cry-loop': return this.kneelCryStandUpDeterminedSheet;
            case 'collapse': return this.walkInStormCollapseSheet;
            case 'collapse-loop': return this.walkInStormCollapseSheet;
            case 'stand-up-after-collapse': return this.standUpAfterCollapseSheet;
            case 'air-hit-stun': return this.airHitPainStunSheet;
            case 'air-pain-stun': return this.airHitPainStunSheet;
        }
        return null;
    }

    /**
    * Returns determined-state animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*|null} Animation images or null if not found.
    */
    getDeterminedImages(state) {
        switch (state) {
            case 'stand-up-determined': return this.kneelCryStandUpDeterminedSheet;
            case 'stand-up-determined-loop': return this.kneelCryStandUpDeterminedSheet;
            case 'determined-rise': return this.determinedRiseSheet;
            case 'determined-rise-loop': return this.determinedRiseSheet;
            case 'stand-determined': return this.walkStandDeterminedSheet;
            case 'stand-determined-loop': return this.walkStandDeterminedSheet;
        }
        return null;
    }

    /**
    * Returns music-related animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*|null} Animation images or null if not found.
    */
    getMusicImages(state) {
        switch (state) {
            case 'caress': return this.caressSheet;
            case 'caress-loop': return this.caressSheet;
            case 'sit-down-and-play-guitar': return this.sitDownAndPlayGuitarSheet;
            case 'play-guitar-and-sing': return this.playGuitarAndSingSheet;
            case 'play-guitar': return this.playGuitarSheet;
            case 'light-a-campfire': return this.lightCampfireStandUpSheet;
        }
        return null;
    }

    /**
    * Returns combat-related animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*|null} Animation images or null if not found.
    */
    getCombatImages(state) {
        switch (state) {
            case 'attack-staff': return this.attackStaffSheet;
            case 'attack-sword': return this.attackSwordSheet;
            case 'meditation': return this.meditationSheet;
            case 'meditation-loop': return this.meditationSheet;
            case 'new-weapon': return this.newWeaponStartSheet;
            case 'new-weapon-loop': return this.newWeaponLoopSheet;
            case 'protect': return this.protectSheet;
            case 'protect-loop': return this.protectSheet;
            case 'throw': return this.throwSheet;
        }
        return null;
    }

    /**
    * Returns special-case animation images for the given state.
    * @param {string} state Animation state identifier.
    * @returns {*|null} Animation images or null if not found.
    */
    getSpecialImages(state) {
        switch (state) {
            case 'idle': return this.idleWalkSheet;
        }
        return null;
    }

    /**
    * Applies deferred size update for the current animation.
    */
    handleDeferredSizeUpdate() {
        if (!this.deferSizeUpdate) return;
        const oldBottom = this.y + this.height;
        const anim = this.currentAnimation;
        this.applySizeForAnimation(anim);
        this.restoreBottomAfterResize(oldBottom);
        this.updateDrawOffsetForAnim(anim);
        this.deferSizeUpdate = false;
    }

    /**
    * Applies size configuration for the specified animation.
    * @param {string} anim Animation state identifier.
    */
    applySizeForAnimation(anim) {
        const cfg = this.getSizeConfigForAnim(anim);
        this.setCharacterSize(cfg.width, cfg.height, this.y, cfg.offset);
    }

    /**
    * Returns size configuration for the given animation.
    * @param {string} anim Animation state identifier.
    * @returns {Object} Size configuration.
    */
    getSizeConfigForAnim(anim) {
        return (
            this.getVoidlessSizeConfig(anim) ??
            this.getLargeSizeConfig(anim) ??
            this.getSpecialSizeConfig(anim) ??
            this.getDefaultSizeConfig()
        );
    }

    /**
    * Returns size configuration for voidless animations.
    * @param {string} anim Animation state identifier.
    * @returns {Object|null} Size configuration or null if not applicable.
    */
    getVoidlessSizeConfig(anim) {
        if (!this.isVoidlessAnimation(anim)) return null;
        return {
            width: 158,
            height: 183,
            offset: { top: 13, left: 33, right: 55, bottom: 15 }
        };
    }

    /**
    * Returns size configuration for large animations.
    * @param {string} anim Animation state identifier.
    * @returns {Object|null} Size configuration or null if not applicable.
    */
    getLargeSizeConfig(anim) {
        if (this.isLargeAnimationA(anim)) {
            return this.getLargeASizeConfig();
        }
        if (this.isLargeAnimationB(anim)) {
            return this.getLargeBSizeConfig();
        }
        return null;
    }

    /**
    * Returns size configuration for large animation type A.
    * @returns {Object} Size configuration.
    */
    getLargeASizeConfig() {
        return {
            width: 240,
            height: 280,
            offset: { top: 110, left: 30, right: 115, bottom: 10 }
        };
    }

    /**
    * Returns size configuration for large animation type B.
    * @returns {Object} Size configuration.
    */
    getLargeBSizeConfig() {
        return {
            width: 270,
            height: 300,
            offset: { top: 135, left: 35, right: 175, bottom: 15 }
        };
    }

    /**
    * Returns size configuration for special animations.
    * @param {string} anim Animation state identifier.
    * @returns {Object|null} Size configuration or null if not applicable.
    */
    getSpecialSizeConfig(anim) {
        if (this.isProtectAnim(anim)) {
            return this.getProtectSizeConfig();
        }
        if (this.isNewWeaponAnim(anim)) {
            return this.getNewWeaponSizeConfig();
        }
        return null;
    }

    /**
    * Checks whether the animation is a protect animation.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if protect animation, otherwise false.
    */
    isProtectAnim(anim) {
        return anim === 'protect' || anim === 'protect-loop';
    }

    /**
    * Checks whether the animation is a new weapon animation.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if new weapon animation, otherwise false.
    */
    isNewWeaponAnim(anim) {
        return anim === 'new-weapon' || anim === 'new-weapon-loop';
    }

    /**
    * Returns size configuration for protect animations.
    * @returns {Object} Size configuration.
    */
    getProtectSizeConfig() {
        return {
            width: 158,
            height: 183,
            offset: { top: 20, left: 45, right: 40, bottom: 15 }
        };
    }

    /**
    * Returns size configuration for new weapon animations.
    * @returns {Object} Size configuration.
    */
    getNewWeaponSizeConfig() {
        return {
            width: 300,
            height: 340,
            offset: { top: 20, left: 45, right: 40, bottom: 15 }
        };
    }

    /**
    * Returns default size configuration.
    * @returns {Object} Size configuration.
    */
    getDefaultSizeConfig() {
        return {
            width: 130,
            height: 300,
            offset: { top: 130, left: 28, right: 40, bottom: 15 }
        };
    }

    /**
    * Restores the bottom position after resizing.
    * @param {number} oldBottom Previous bottom position.
    */
    restoreBottomAfterResize(oldBottom) {
        this.y = oldBottom - this.height;
    }

    /**
    * Updates draw offset based on the current animation.
    * @param {string} anim Animation state identifier.
    */
    updateDrawOffsetForAnim(anim) {
        if (anim === 'attack-staff') {
            this.drawOffset = { x: 0, y: 0, flipX: -100 };
        } else if (anim === 'attack-sword') {
            this.drawOffset = { x: -5, y: 0, flipX: -130 };
        } else if (anim === 'protect' || anim === 'protect-loop') {
            this.drawOffset = { x: -14, y: 0, flipX: 0 };
        } else if (anim === 'throw') {
            this.drawOffset = { x: -14, y: 0, flipX: 0 };
        } else {
            this.drawOffset = { x: 0, y: 0, flipX: 0 };
        }
    }

    /**
    * Checks whether the animation is voidless.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if voidless animation, otherwise false.
    */
    isVoidlessAnimation(anim) {
        return this.VOIDLESS_ANIMS.has(anim);
    }

    /**
    * Checks whether the animation is of large type A.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if large type A animation, otherwise false.
    */
    isLargeAnimationA(anim) {
        return ['attack-staff'].includes(anim);
    }

    /**
    * Checks whether the animation is of large type B.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if large type B animation, otherwise false.
    */
    isLargeAnimationB(anim) {
        return ['attack-sword'].includes(anim);
    }

    /**
    * Sets the character size and offset.
    * @param {number} width Character width.
    * @param {number} height Character height.
    * @param {number} [y] Optional y-position.
    * @param {Object} offset Offset configuration.
    */
    setCharacterSize(width, height, y, offset) {
        this.width = width;
        this.height = height;
        if (y !== undefined && y !== null) this.y = y;
        this.offset = offset;
    }
}