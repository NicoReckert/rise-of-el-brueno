/**
 * Handles character animation transitions.
 */
export class CharacterAnimationTransitions {
    /**
    * Creates a new instance.
    * @param {Object} character Character instance.
    * @param {Object} animationController Animation controller instance.
    */
    constructor(character, animationController) {
        this.char = character;
        this.animCtrl = animationController;
    }

    /**
    * Handles transitions after an animation finishes.
    * @param {string} anim Animation state identifier.
    */
    handleAnimationTransition(anim) {
        if (this.handleDeterminedTransitions(anim)) return;
        if (this.handleEmotionalTransitions(anim)) return;
        if (this.handleMusicTransitions(anim)) return;
        if (this.handleCombatTransitions(anim)) return;
    }

    /**
    * Handles determined-related animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleDeterminedTransitions(anim) {
        switch (anim) {
            case 'stand-up-determined':
                return this.setTransition('stand-up-determined-loop', 5.5);
            case 'determined-rise':
                return this.setTransition('determined-rise-loop', 4);
            case 'stand-up':
                this.char.isStandUp = false;
                return true;
            case 'stand-determined':
                return this.setTransition('stand-determined-loop');
        }
        return false;
    }

    /**
    * Handles emotional animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleEmotionalTransitions(anim) {
        if (this.handleHurtAndBasic(anim)) return true;
        if (this.handleCollapseAndStand(anim)) return true;
        if (this.handleAirHitStunTransition(anim)) return true;
        return false;
    }

    /**
    * Handles hurt and basic emotional animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleHurtAndBasic(anim) {
        if (anim === 'hurt') {
            this.char.isHurt = false;
            return true;
        }
        if (anim === 'kneel-and-cry')
            return this.setTransition('kneel-and-cry-loop');
        if (anim === 'caress')
            return this.setTransition('caress-loop', 6);
        return false;
    }

    /**
    * Handles collapse and stand-up animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleCollapseAndStand(anim) {
        if (anim === 'collapse')
            return this.setTransition('collapse-loop', 5);
        if (anim === 'stand-up-after-collapse') {
            this.char.isStandUpAfterCollapse = false;
            return this.setTransition('air-pain-stun', 5);
        }
        return false;
    }

    /**
    * Handles air hit stun animation transition.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleAirHitStunTransition(anim) {
        if (anim === 'air-hit-stun')
            return this.setTransition('air-pain-stun', 5);
        return false;
    }

    /**
    * Handles music-related animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleMusicTransitions(anim) {
        switch (anim) {
            case 'sit-down-and-play-guitar':
                return this.setTransition('play-guitar', 10);
            case 'light-a-campfire':
                this.char.isLightACampfire = false;
                this.char.isSitDownAndPlayGuitar = true;
                return this.setTransition('sit-down-and-play-guitar', 4);
        }
        return false;
    }

    /**
    * Handles combat-related animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleCombatTransitions(anim) {
        if (this.handleAttackTransitions(anim)) return true;
        if (this.handleMeditationTransition(anim)) return true;
        if (this.handleNewWeaponTransition(anim)) return true;
        if (this.handleProtectTransition(anim)) return true;
        return false;
    }

    /**
    * Handles attack animation transitions.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleAttackTransitions(anim) {
        if (anim !== 'attack-staff' && anim !== 'attack-sword') {
            return false;
        }
        this.char.isAttack = false;
        this.char.hasHitEnemyThisAttack = false;
        return true;
    }

    /**
    * Handles meditation animation transition.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleMeditationTransition(anim) {
        if (anim !== 'meditation') return false;
        return this.setTransition('meditation-loop', 4);
    }

    /**
    * Handles new weapon animation transition.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleNewWeaponTransition(anim) {
        if (anim !== 'new-weapon') return false;
        return this.setTransition('new-weapon-loop', 6);
    }

    /**
    * Handles protect animation transition.
    * @param {string} anim Animation state identifier.
    * @returns {boolean} True if a transition was applied, otherwise false.
    */
    handleProtectTransition(anim) {
        if (anim !== 'protect') return false;
        return this.setTransition('protect-loop', 6);
    }

    /**
    * Sets an animation transition.
    * @param {string} name Animation state identifier.
    * @param {?number} [fps=null] Optional frames per second.
    * @returns {boolean} Always returns true.
    */
    setTransition(name, fps = null) {
        this.animCtrl.setAnimation(name);
        if (fps) this.char.frameInterval = 1000 / fps;
        return true;
    }
}