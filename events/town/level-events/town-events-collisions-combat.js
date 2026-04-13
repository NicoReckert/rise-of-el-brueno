import { DamageText } from "../../../classes/ui/damage-text.class.js";
import { townHelper } from "../helpers/town-helper.js";

export const townEvents_collisionsCombat = [
    /**
     * Quest event that handles projectile hits on the character.
     */
    {
        type: 'quest',
        once: false,
        action: (setup) => {
            townHelper.handleProjectileHitsOnCharacter(setup);
        }
    },

    /**
     * Quest event that handles enemy touch damage on the character.
     */
    {
        type: 'quest',
        once: false,
        action: (setup) => {
            townHelper.handleEnemyTouchDamage(setup);
        }
    },

    /**
     * Collision event that applies attack hit damage from matching enemies
     * to the character and marks the attack as handled.
     */
    {
        type: "collision",
        once: false,
        objectA: "character",
        objectB: "enemies",
        useAttackHitboxB: true,
        condition: (setup) => {
            const char = setup.world.character;
            return !!char && !char.isHurt;
        },
        targetFilter: (enemy) =>
            !!enemy &&
            !enemy.isDead &&
            enemy.currentEnemy === "chickenMutatesSmall" &&
            !!enemy.attackHitbox?.active &&
            !enemy.hasHitPlayerThisAttack,
        action: (setup, char, enemy) => {
            const dmg = char.isProtect ? 2 : 10;
            char.combatCtrl.hit(setup.world.timestamp, dmg);
            setup.statusBarCharacter.setPercentage(char.energy);
            setup.state.damageTexts.push(new DamageText(char, dmg));
            enemy.hasHitPlayerThisAttack = true;
        }
    },

    /**
     * Collision event that applies the character attack hit
     * to a matching enemy and marks the attack as handled.
     */
    {
        type: "collision",
        once: false,
        objectA: "character",
        objectB: "enemies",
        useAttackHitboxA: true,
        condition: (setup) => {
            const char = setup.world.character;
            return !!char && char.isAttack && !char.hasHitEnemyThisAttack;
        },
        targetFilter: (enemy, setup, char) => {
            if (!enemy || enemy.isDead || enemy.isRemoved) return false;
            const cBox = char.getHitboxRect?.();
            const eBox = enemy.getHitboxRect?.();
            const charCenterX = cBox ? cBox.cx : char.x + char.width * 0.5;
            const enemyCenterX = eBox ? eBox.cx : enemy.x + enemy.width * 0.5;
            return char.isFlipped
                ? enemyCenterX < charCenterX
                : enemyCenterX > charCenterX;
        },
        action: (setup, char, enemy) => {
            const hit = enemy.combatCtrl.receiveHit(setup.world.timestamp, {
                dmg: 1, attackerFlipped: char.isFlipped, knockX: 12, knockY: 12, deathRemoveMs: 2000, onHurtSound: () => {
                    const sound = setup.sounds.enemyHurtSfx.cloneNode();
                    sound.currentTime = 0;
                    sound.play();
                },
                onDeathSound: () =>
                    setup.world.audioManager.playOneShot("chickenDeathSfx", { volume: 0.6 })
            });
            if (hit) char.hasHitEnemyThisAttack = true;
        }
    },

    /**
     * Quest event that defeats enemies when the character jumps on them
     * and applies a bounce effect.
     */
    {
        type: 'quest',
        once: false,
        action: (setup) => {
            const char = setup.world.character;
            setup.townLevel.enemies.forEach(enemy => {
                if (enemy.isDead || enemy.isRemoved) return;
                if (char.isJumpOn(enemy)) {
                    enemy.isDead = true;
                    enemy.isMovingLeft = false;
                    enemy.isMovingRight = false;
                    enemy.removeAt = setup.world.timestamp + 2000;
                    enemy.isHurt = false;
                    setup.world.audioManager.playOneShot('chickenDeathSfx', { volume: 0.6 });
                    char.movementCtrl.bounce();
                }
            });
        }
    },

    /**
     * Quest event that removes cleared enemies from the enemy list.
     */
    {
        type: 'quest',
        once: false,
        action: (setup) => {
            setup.townLevel.enemies = setup.townLevel.enemies.filter(e => !e.isRemoved);

        }
    },

    /**
     * Collision event that applies attack hit damage from matching enemies
     * to the character and marks the attack as handled.
     */
    {
        type: "collision",
        once: false,
        objectA: "character",
        objectB: "enemies",
        useAttackHitboxB: true,
        condition: (setup) => {
            const char = setup.world.character;
            return !!char && !char.isHurt;
        },
        targetFilter: (enemy) =>
            !!enemy &&
            !enemy.isDead &&
            enemy.currentEnemy === "dragonSmall" &&
            !!enemy.attackHitbox?.active &&
            !enemy.hasHitPlayerThisAttack,
        action: (setup, char, enemy) => {
            const dmg = char.isProtect ? 2 : 10;
            char.combatCtrl.hit(setup.world.timestamp, dmg);
            setup.statusBarCharacter.setPercentage(char.energy);
            setup.state.damageTexts.push(new DamageText(char, dmg));
            enemy.hasHitPlayerThisAttack = true;
        }
    },

    /**
     * Quest event that handles bottle hits on enemies.
     */
    {
        name: "town_throwable_bottles_hit_enemy",
        type: "quest",
        once: false,
        action: (setup) => {
            townHelper.handleBottleHitsOnEnemies(setup);
        }
    },

    /**
     * Quest event that handles bottle hits on the endboss.
     */
    {
        name: "town_throwable_bottles_hit_boss",
        type: "quest",
        once: false,
        action: (setup) => {
            townHelper.handleBottleHitsOnEndboss(setup);
        }
    },

    /**
     * Collision event that applies a melee hit to the endboss
     * and updates its health state.
     */
    {
        name: "town_melee_hits_boss",
        type: "collision",
        once: false,
        objectA: "character",
        objectB: "endboss",
        useAttackHitboxA: true,
        condition: (setup) => {
            const char = setup.world.character;
            const boss = setup.characters.endboss;
            return !!char && !!boss && char.isAttack && !char.hasHitEnemyThisAttack && !boss.isDead;
        },
        action: (setup, char, boss) => {
            boss.isHurt = true;
            boss.frameIndex = 0;
            boss.energy -= 5;
            setup.statusBarEndboss.setPercentage(boss.energy);
            char.hasHitEnemyThisAttack = true;
            if (boss.energy <= 0) {
                boss.isDead = true;
                boss.frameIndex = 0;
            }
        }
    }
];