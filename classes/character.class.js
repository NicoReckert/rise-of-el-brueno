class Character extends MovableObject {
    intervalStand = null;
    standCount = 0;
    intervalWalk = null;
    walkCount = 0;
    jumpCount = 0;
    deadCount = 0;
    hurtCount = 0;
    intervalMoveLeft = null;
    intervalMoveRight = null;
    intervalMoveUp = null;
    intervalJump = null;
    intervalDead = null;
    intervalHurt = null;
    isFlipped = false;
    isMoving = false;
    isMovingLeft = false;
    isMovingRight = false;
    isMeditation = false;
    isDead = false;
    isHurt = false;
    isJumping;
    isThrowing = false;
    isGameCharacter = true;
    throwableBottels = 0;
    isCaress = false;
    isWalk = false;
    isNewWeapon = false;

    constructor(characterImages) {
        super();
        this.characterImages = characterImages;
        super.loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.webp');
        this.height = 300; // 183 für voidless.dev sprite - 300 * 0.61
        this.width = 130; // 158 für voidless.dev sprite - 130 * 1.216
        this.x = 1000;
        this.y = 370; // 487 für voidless.dev sprite - 370 * 1.9
        // this.startMainLoop()
        this.offset.top = 130;
        this.offset.left = 20;
        this.offset.right = 40;
        this.offset.bottom = 15;
        this.speedX = 10;
        this.isJumping = false;
        this.isLanding = false;
        this.isKneelAndCry = false;
        this.isStandUpAndLookDetermined = false;
        this.isLookDeterminedAndStandUp = false;
        this.isSitDownAndPlayGuitar = false;
        this.isPlayGuitarAndSing = false;
        this.isPlayGuitar = false;
        this.isLightACampfire = false;
        this.isAttack = false;
        this.lastFrameTime = 0;        // Timestamp des letzten Framewechsels
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 2.5; // Standard: 5 FPS
        this.frameIndex = 0;
        this.level_start_x = 440;
        this.yNormal = 370;
        this.yVoidless = 487;




        // this.preloadIdleAndWalkImages();
        // this.preloadJumpAndDeadImages();
        // this.preloadHurtAndJetpackImages();
        // this.preloadCaressAndCaress2Images();
        // this.preloadKneelDownAndCryImages();
        // this.preloadStandUpAndLookDeterminedImages();
        // this.preloadLookDeterminedStandUpAndStrongDeterminedImages();
        // this.preloadPlayGuitarImages();
        this.init();
    }

    init() {
        this.idleImages = this.characterImages.idleImages || [];
        this.walkImages = this.characterImages.walkImages || [];
        this.jumpImages = this.characterImages.jumpImages || [];
        this.deadImages = this.characterImages.deadImages || [];
        this.hurtImages = this.characterImages.hurtImages || [];
        this.jetPackImages = this.characterImages.jetPackImages || [];
        this.caressImages = this.characterImages.caressImages || [];
        this.caressImages2 = this.characterImages.caressImages2 || [];
        this.kneelDownAndCryImages = this.characterImages.kneelDownAndCryImages || [];
        this.cryImages = this.characterImages.cryImages || [];
        this.standUpAndLookDeterminedImages = this.characterImages.standUpAndLookDeterminedImages || [];
        this.lookDeterminedImages = this.characterImages.lookDeterminedImages || [];
        this.lookDeterminedStandUpImages = this.characterImages.lookDeterminedStandUpImages || [];
        this.strongDeterminedImages = this.characterImages.strongDeterminedImages || [];
        this.sitDownAndPlayGuitarImages = this.characterImages.sitDownAndPlayGuitarImages || [];
        this.playGuitarAndSingImages = this.characterImages.playGuitarAndSingImages || [];
        this.playGuitarImages = this.characterImages.playGuitarImages || [];
        this.lightACampfireImages = this.characterImages.lightACampfireImages || [];
        this.attackImages = this.characterImages.attackImages || [];
        this.meditationImages = this.characterImages.meditationImages || [];
        this.meditationLoopImages = this.characterImages.meditationLoopImages || [];
        this.newWeaponImages = this.characterImages.newWeaponImages || [];
        this.newWeaponLoopImages = this.characterImages.newWeaponLoopImages || [];
    }

    preloadIdleAndWalkImages() {
        this.idleImages = Array.from({ length: 10 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/1_idle/idle/I-${i + 1}.webp`;
            return img;
        });
        this.walkImages = Array.from({ length: 6 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/2_walk/W-2${i + 1}.webp`;
            return img;
        });
    }

    preloadJumpAndDeadImages() {
        this.jumpImages = Array.from({ length: 9 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/3_jump/J-3${i + 1}.webp`;
            return img;
        });
        this.deadImages = Array.from({ length: 7 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/5_dead/D-5${i + 1}.webp`;
            return img;
        });
    }

    preloadHurtAndJetpackImages() {
        this.hurtImages = Array.from({ length: 3 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/4_hurt/H-4${i + 1}.webp`;
            return img;
        });
        this.jetPackImages = Array.from({ length: 1 }, _ => {
            const img = new Image();
            img.src = `./assets/img/Pepe_Jetpack.webp`;
            return img;
        });
    }

    preloadCaressAndCaress2Images() {
        this.caressImages = Array.from({ length: 8 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/6_caress/image_${i + 1}.webp`;
            return img;
        });
        this.caressImages2 = Array.from({ length: 3 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/6_caress/image_${6 + i}.webp`;
            return img;
        });
    }

    preloadKneelDownAndCryImages() {
        this.kneelDownAndCryImages = Array.from({ length: 8 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/7_kneel-down-and-cry/image_${i + 1}.webp`;
            return img;
        });
        this.cryImages = Array.from({ length: 3 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/7_kneel-down-and-cry/image_${6 + i}.webp`;
            return img;
        });
    }

    preloadStandUpAndLookDeterminedImages() {
        this.standUpAndLookDeterminedImages = Array.from({ length: 10 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/8_stand_up_look_determined/image_${i + 1}.webp`;
            return img;
        });
        this.lookDeterminedImages = Array.from({ length: 3 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/8_stand_up_look_determined/image_${8 + i}.webp`;
            return img;
        });
    }

    preloadLookDeterminedStandUpAndStrongDeterminedImages() {
        this.lookDeterminedStandUpImages = Array.from({ length: 15 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/10/image_${i + 1}.webp`;
            return img;
        });
        this.strongDeterminedImages = Array.from({ length: 4 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/10/image_${12 + i}.webp`;
            return img;
        });
    }

    preloadPlayGuitarImages() {
        this.sitDownAndPlayGuitarImages = Array.from({ length: 6 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/12/image_${i + 1}.webp`;
            return img;
        });

        this.playGuitarAndSingImages = Array.from({ length: 23 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/12/image_${6 + i}.webp`;
            return img;
        });

        this.playGuitarImages = Array.from({ length: 20 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/13/image_${i + 1}.webp`;
            return img;
        });

        this.lightACampfireImages = Array.from({ length: 10 }, (_, i) => {
            const img = new Image();
            img.src = `./assets/img/2_character_pepe/14/image_${i + 1}.webp`;
            return img;
        });
    }

    bounce() {
        this.speedY = 10; // kleiner Rücksprung nach oben
    }

    updateState(timestamp) {
        // 1. Bewegung (immer erlaubt, auch beim Springen)

        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        const deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        const movementSpeed = this.speedX * deltaTime * 60;

        if (this.isMovingLeft) {
            this.isFlipped = true;
            if (this.x > this.level_start_x) {
                this.x -= movementSpeed;
                this.world.camera_x += ((this.x - 1060) - this.world.camera_x) * 0.05;
            }
        } else if (this.isMovingRight) {
            this.isFlipped = false;
            if (this.x < this.world.farmLevelSetup.farmLevel.level_end_x) {
                this.x += movementSpeed;
                this.world.camera_x += ((this.x - 100) - this.world.camera_x) * 0.05;
            }
        }

        // Kamera auf Levelgrenzen begrenzen
        this.world.camera_x = Math.max(0, Math.min(this.world.camera_x, this.world.farmLevelSetup.farmLevel.level_end_x - 720));


        // 2. Animation (nach Priorität)
        if (this.isDead) {
            this.setAnimation('dead')
            // this.currentAnimation = 'dead';
            this.frameInterval = 1000 / 6;
        } else if (this.isJumping) {
            // this.setAnimation('jump')
            this.currentAnimation = 'jump';
            this.frameInterval = 1000 / 10;
        } else if (this.isCaress) {
            if (this.currentAnimation !== 'caress2') {
                this.setAnimation('caress')
                // this.currentAnimation = 'streicheln';
                this.frameInterval = 1000 / 6;
            }
        } else if (this.isKneelAndCry) {
            if (this.currentAnimation !== 'cry') {
                this.setAnimation('kneel-and-cry');
                this.frameInterval = 1000 / 5;
                // this.setPropertiesVoidless();
            }
        } else if (this.isStandUpAndLookDetermined) {
            if (this.currentAnimation !== 'look-determined') {
                this.setAnimation('stand-up-and-look-determined');
                this.frameInterval = 1000 / 6;
                // this.setPropertiesVoidless();
            }
        } else if (this.isLookDeterminedAndStandUp) {
            if (this.currentAnimation !== 'strong-determined') {
                this.setAnimation('look-determined-and-stand-up');
                this.frameInterval = 1000 / 6;
                // this.setPropertiesVoidless();
            }
        } else if (this.isSitDownAndPlayGuitar) {
            if (this.currentAnimation !== 'play-guitar') {
                this.setAnimation('sit-down-and-play-guitar');
                this.frameInterval = 1000 / 6;
                // this.setPropertiesVoidless();
            }
        } else if (this.isPlayGuitar) {
            this.currentAnimation = 'play-guitar';
            this.frameInterval = 1000 / 10;
        } else if (this.isPlayGuitarAndSing) {
            this.currentAnimation = 'play-guitar-and-sing';
            this.frameInterval = 1000 / 10;
        } else if (this.isLightACampfire) {
            if (this.currentAnimation !== 'sit-down-and-play-guitar') {
                this.setAnimation('light-a-campfire');
                this.frameInterval = 1000 / 6;
            }
        } else if (this.isAttack) {
            this.setAnimation('attack');
            this.frameInterval = 1000 / 7;
        } else if (this.isMeditation) {
            if (this.currentAnimation !== 'meditation-loop') {
                this.setAnimation('meditation');
                this.frameInterval = 1000 / 6;
            }
        } else if (this.isNewWeapon) {
            if (this.currentAnimation !== 'new-weapon-loop') {
                this.setAnimation('new-weapon');
                this.frameInterval = 1000 / 6;
            }
        } else if (this.isMovingLeft || this.isMovingRight) {
            // this.setAnimation('walk');
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8;
        } else if (this.isWalk) {
            // this.setAnimation('walk');
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8;
        } else {
            this.setAnimation('idle');
            // this.currentAnimation = 'idle';
            this.frameInterval = 1000 / 2.5;
            // this.setPropertiesNormal();
        }

    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);

            if (images && images.length > 0) {
                this.img = images[this.frameIndex % images.length];
                if (this.deferSizeUpdate) {
                    if (['kneel-and-cry', 'stand-up-and-look-determined', 'cry', 'look-determined', 'look-determined-and-stand-up', 'strong-determined', 'caress', 'caress2', 'sit-down-and-play-guitar', 'play-guitar-and-sing', 'play-guitar', 'light-a-campfire', 'meditation', 'meditation-loop'].includes(this.currentAnimation)) {
                        this.width = 158;
                        this.height = 183;
                        this.y = this.yVoidless;
                        this.offset.top = 13;
                        this.offset.left = 33;
                        this.offset.right = 55;
                        this.offset.bottom = 15;
                    } else if (['attack', 'new-weapon', 'new-weapon-loop'].includes(this.currentAnimation)) {
                        this.width = 290;
                        this.height = 355;
                        this.y = 315;
                        this.offset.top = 13;
                        this.offset.left = 33;
                        this.offset.right = 55;
                        this.offset.bottom = 15;
                    } else {
                        this.width = 130;
                        this.height = 300;
                        this.y = this.yNormal;
                        this.offset.top = 130;
                        this.offset.left = 20;
                        this.offset.right = 40;
                        this.offset.bottom = 15;

                    }
                    this.deferSizeUpdate = false;
                }
                this.frameIndex++;
            }
            this.lastFrameTime = timestamp;
            if (this.frameIndex >= images.length && (this.currentAnimation == 'kneel-and-cry' || this.currentAnimation == 'stand-up-and-look-determined' || this.currentAnimation == 'look-determined-and-stand-up' || this.currentAnimation == 'caress' || this.currentAnimation == 'sit-down-and-play-guitar' || this.currentAnimation == 'light-a-campfire' || this.currentAnimation == 'attack' || this.currentAnimation == 'meditation' || this.currentAnimation == 'new-weapon')) {
                this.animationFinished = true;
                switch (this.currentAnimation) {
                    case 'stand-up-and-look-determined':
                        this.setAnimation('look-determined');
                        this.frameInterval = 1000 / 3;
                        break;
                    case 'kneel-and-cry':
                        this.setAnimation('cry');
                        // this.frameInterval = 1000 / 3;
                        break;
                    case 'look-determined-and-stand-up':
                        this.setAnimation('strong-determined');
                        this.frameInterval = 1000 / 4;
                        break;
                    case 'caress':
                        this.setAnimation('caress2');
                        this.frameInterval = 1000 / 6;
                        break;
                    case 'sit-down-and-play-guitar':
                        this.setAnimation('play-guitar');
                        this.frameInterval = 1000 / 10;
                        break;
                    case 'light-a-campfire':
                        this.setAnimation('sit-down-and-play-guitar');
                        this.frameInterval = 1000 / 4;
                        this.isLightACampfire = false;        // Flag aufräumen
                        this.isSitDownAndPlayGuitar = true;
                        break;
                    case 'attack':
                        this.isAttack = false;
                        break;
                    case 'meditation':
                        this.setAnimation('meditation-loop');
                        this.frameInterval = 1000 / 4;
                        break;
                    case 'new-weapon':
                        this.setAnimation('new-weapon-loop');
                        this.frameInterval = 1000 / 6;
                        break;
                }
            }
        }
    }

    getAnimationImages(state) {
        switch (state) {
            case 'walk': return this.walkImages;
            case 'jump': return this.jumpImages;
            case 'dead': return this.deadImages;
            case 'hurt': return this.hurtImages;
            case 'caress': return this.caressImages;
            case 'caress2': return this.caressImages2;
            case 'kneel-and-cry': return this.kneelDownAndCryImages;
            case 'cry': return this.cryImages;
            case 'stand-up-and-look-determined': return this.standUpAndLookDeterminedImages;
            case 'look-determined': return this.lookDeterminedImages;
            case 'look-determined-and-stand-up': return this.lookDeterminedStandUpImages;
            case 'strong-determined': return this.strongDeterminedImages;
            case 'sit-down-and-play-guitar': return this.sitDownAndPlayGuitarImages;
            case 'play-guitar-and-sing': return this.playGuitarAndSingImages;
            case 'play-guitar': return this.playGuitarImages;
            case 'light-a-campfire': return this.lightACampfireImages;
            case 'attack': return this.attackImages;
            case 'meditation': return this.meditationImages;
            case 'meditation-loop': return this.meditationLoopImages;
            case 'new-weapon': return this.newWeaponImages;
            case 'new-weapon-loop': return this.newWeaponLoopImages;
            case 'idle':
            default: return this.idleImages;
        }
    }

    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;          // Frame-Index zurücksetzen
            this.animationFinished = false; // Flag zurücksetzen
            this.lastFrameTime = null;     // Timer zurücksetzen
            this.deferSizeUpdate = true;
        }
    }
}