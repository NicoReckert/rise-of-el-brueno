export class EndbossAnimationController {
    constructor(endboss, combatController) {
        this.endboss = endboss;
        this.combatCtrl = combatController;
    }

    handleStateAnimations() {
        if (this.endboss.isFindsPeace) return this.playFindsPeace();
        if (this.endboss.isDead) return this.playDeathAnimation();
        if (this.endboss.isHurt) return this.playHurtAnimation();
        if (this.endboss.isFireBreath) return this.setAnimation('fireBreathAttack', 5);
        if (this.endboss.isFly) return this.playFlyAnimation();
        if (this.endboss.isFireballAttack) return this.playFireballAttackAnimation()
        if (this.endboss.isJumping) return this.setAnimation('jump', 10);
        if (this.endboss.isMovingLeft || this.endboss.isMovingRight)
            return this.setAnimation('walk', 8);
        this.setAnimation('idle', 8);
    }

    updateAnimation(timestamp) {
        if (!this.endboss.lastFrameTime) this.endboss.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.endboss.lastFrameTime;
        if (deltaTime <= this.endboss.frameInterval) return;
        const anim = this.getAnimationImages(this.endboss.currentAnimation);
        if (!anim) {
            this.endboss.lastFrameTime = timestamp;
            return;
        }
        const prevFrame = this.endboss.frameIndex;
        this.endboss.updateAnimationFromSourceGeneric(anim);
        if (this.endboss.isFireballAttack) {
            const shootFrame = 13;
            if (prevFrame === shootFrame && !this.endboss.hasFiredThisAttack) {
                const audio = this.endboss.allAudios.fireballShotSound.cloneNode();
                audio.play();
                this.endboss.combatCtrl?.shootProjectile(this.endboss.world.character);
                this.endboss.hasFiredThisAttack = true;
            }
        }
        if (this.endboss.currentAnimation === 'dead') {
            const animDead = this.endboss.deadImages;
            if (animDead?.type === 'sheetSequence') {
                if (this.endboss.animationFinished) {
                    this.endboss.isDeadAnimationReady = true;
                }
            } else {
                const frameCount = this.endboss.getFrameCountForSource(animDead, 'dead');
                if (frameCount && this.endboss.frameIndex >= frameCount - 1) {
                    this.endboss.isDeadAnimationReady = true;
                }
            }
        }
        this.endboss.lastFrameTime = timestamp;
    }

    playFindsPeace() {
        this.setAnimation('findsPeace', 6);
        const anim = this.endboss.findsPeaceImages;
        if (!anim) return;
        if (anim.type === 'sheetSequence') {
            if (this.endboss.animationFinished && this.endboss.currentAnimation === 'findsPeace') {
                this.endboss.isFindsPeace = false;
                this.endboss.frameIndex = 0;
                this.endboss.sheetIndex = 0;
                this.endboss.animationFinished = false;
            }
        } else {
            const count = this.endboss.getFrameCountForSource(anim, 'findsPeace');
            if (count && this.endboss.frameIndex >= count) {
                this.endboss.isFindsPeace = false;
                this.endboss.frameIndex = 0;
            }
        }
    }

    playDeathAnimation() {
        if (!this.endboss.isDeadAnimationReady) {
            this.setAnimation('dead', 4);
        } else {
            this.endboss.currentAnimation = null;
        }
    }

    playHurtAnimation() {
        this.setAnimation('hurt', 4);
        const anim = this.endboss.hurtImages;
        if (!anim) return;
        if (anim.type === 'sheetSequence') {
            if (this.endboss.animationFinished && this.endboss.currentAnimation === 'hurt') {
                this.endboss.isHurt = false;
                this.endboss.frameIndex = 0;
                this.endboss.sheetIndex = 0;
                this.endboss.animationFinished = false;
            }
        } else {
            const count = this.endboss.getFrameCountForSource(anim, 'hurt');
            if (count && this.endboss.frameIndex >= count) {
                this.endboss.isHurt = false;
                this.endboss.frameIndex = 0;
            }
        }
    }

    playFlyAnimation() {
        this.setAnimation('fly', 6);
    }

    playFireballAttackAnimation() {
        this.setAnimation('fireballAttack', 5);
        const anim = this.endboss.fireballAttackImages;
        if (!anim) return;
        if (anim.type === 'sheetSequence') {
            if (this.endboss.animationFinished && this.endboss.currentAnimation === 'fireballAttack') {
                this.endboss.isFireballAttack = false;
                this.endboss.hasFiredThisAttack = false;
                this.endboss.frameIndex = 0;
                this.endboss.sheetIndex = 0;
                this.endboss.animationFinished = false;
            }
        } else {
            const count = this.endboss.getFrameCountForSource(anim, 'fireballAttack');
            if (count && this.endboss.frameIndex >= count) {
                this.endboss.isFireballAttack = false;
                this.endboss.hasFiredThisAttack = false;
                this.endboss.frameIndex = 0;
            }
        }
    }

    setAnimation(name, fps) {
        if (this.endboss.currentAnimation !== name) {
            this.endboss.currentAnimation = name;
            this.endboss.frameIndex = 0;
            this.endboss.sheetIndex = 0;
            this.endboss.animationFinished = false;
            this.endboss.lastFrameTime = null;
        }
        if (fps) {
            this.endboss.frameInterval = 1000 / fps;
        }
    }

    getAnimationImages(state) {
        switch (state) {
            case 'dead': return this.endboss.deadImages;
            case 'hurt': return this.endboss.hurtImages;
            case 'fly': return this.endboss.flyImages;
            case 'jump': return this.endboss.jumpImages;
            case 'walk': return this.endboss.walkImages;
            case 'findsPeace': return this.endboss.findsPeaceImages;
            case 'fireballAttack': return this.endboss.fireballAttackImages;
            case 'fireBreathAttack': return this.endboss.fireBreathAttackImages;
            case 'idle': return this.endboss.idleImages;
        }
    }
}