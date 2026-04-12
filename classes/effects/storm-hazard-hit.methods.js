import { ImpactEffect } from './impact-effect.class.js';

export const stormHazardHitMethods = {
    /**
     * Handles hit on character.
     * @param {*} character Character instance.
     * @param {*} setup Setup object.
     * @param {number} now Current time.
     * @returns {void}
     */
    onHitCharacter(character, setup, now) {
        const hit = this.def?.hit;
        if (!hit) {
            this.markedForRemoval = true;
            return;
        }
        character.stormHazardHitUntil = now + (hit.invulnMs ?? 700);
        this.applyCharacterDamage(character, setup, hit);
        this.applyCharacterHurt(character, hit, now);
        this.applyCharacterKnockback(character, hit);
        const impactAnim = this.getImpactAnim(hit, setup);
        if (impactAnim) this.spawnImpactEffect(hit, setup, impactAnim);
        setup.world.audioManager.playOneShot('explodeSfx', { volume: 0.5 });
        this.markedForRemoval = true;
    },

    /**
     * Applies damage to the character.
     * @param {*} character Character instance.
     * @param {*} setup Setup object.
     * @param {*} hit Hit data.
     * @returns {void}
     */
    applyCharacterDamage(character, setup, hit) {
        const damage = character.isProtect
            ? (hit.protectDamage ?? 5)
            : (hit.damage ?? 10);
        character.energy = Math.max(0, (character.energy ?? 100) - damage);
        setup.statusBarCharacter?.setPercentage(character.energy);
    },

    /**
     * Applies a hurt state to the character.
     * @param {Object} character Character instance.
     * @param {Object} hit Hit configuration.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    applyCharacterHurt(character, hit, now) {
        const hurtMs = hit.hurtMs ?? 300;
        character.hurtUntil = Math.max(character.hurtUntil ?? 0, now + hurtMs);
    },

    /**
     * Applies knockback to the character.
     * @param {Object} character Character instance.
     * @param {Object} hit Hit configuration.
     * @returns {void}
     */
    applyCharacterKnockback(character, hit) {
        const knock = hit.knockback ?? 0;
        character.knockbackVelocityX = (this.speedX < 0 ? -1 : 1) * knock;
    },

    /**
     * Returns the impact animation for a hit configuration.
     * @param {Object} hit Hit configuration.
     * @param {Object} setup Setup reference.
     * @returns {Object|null} Impact animation source.
     */
    getImpactAnim(hit, setup) {
        return hit.getImpactAnim?.({ images: setup.entityImages }) ?? null;
    },

    /**
     * Spawns an impact effect at the hazard position.
     * @param {Object} hit Hit configuration.
     * @param {Object} setup Setup reference.
     * @param {Object} impactAnim Impact animation source.
     * @returns {void}
     */
    spawnImpactEffect(hit, setup, impactAnim) {
        const { cx, cy } = this.getImpactCenter(hit);
        const size = hit.impactSize ?? { width: 220, height: 220 };
        setup.state.effectsFront.push(this.createImpactEffect(hit, impactAnim, cx, cy, size));
    },

    /**
     * Returns the impact center position.
     * @param {Object} hit Hit configuration.
     * @returns {{cx:number,cy:number}} Impact center coordinates.
     */
    getImpactCenter(hit) {
        const cx = (this.getRenderX?.() ?? this.x) + this.width * 0.5;
        const factorY = hit.impactOffsetFactorY ?? 0.5;
        const cy = this.y + this.height * factorY;
        return { cx, cy };
    },

    /**
     * Creates an impact effect instance.
     * @param {Object} hit Hit configuration.
     * @param {Object} impactAnim Impact animation source.
     * @param {number} cx Impact center X.
     * @param {number} cy Impact center Y.
     * @param {{width:number,height:number}} size Impact size.
     * @returns {Object} Impact effect instance.
     */
    createImpactEffect(hit, impactAnim, cx, cy, size) {
        return new ImpactEffect(
            impactAnim,
            cx - size.width / 2,
            cy - size.height / 2,
            { fps: hit.impactFps ?? 18, width: size.width, height: size.height }
        );
    }
}