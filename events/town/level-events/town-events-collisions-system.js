import { townHelper } from "../helpers/town-helper.js";

export const townEvents_collisionsSystem = [
    /**
     * Collision event that collects coins,
     * updates the coin bar, and plays a pickup sound.
     */
    {
        name: "town_collect_coins",
        type: "collision",
        once: false,
        objectA: "character",
        objectB: "coins",
        targetFilter: (coin) => !!coin,
        action: (setup, char, coin) => {
            const coins = setup.townLevel.coins;
            const bar = setup.coinBar;
            const index = coins.indexOf(coin);
            if (index === -1) return;
            coins.splice(index, 1);
            setup.world.audioManager.playOneShot("coinPickupSfx", { volume: 0.4 });
            if (bar.percentage < 100) {
                bar.percentage = Math.min(bar.percentage + 20, 100);
            }
            bar.setPercentage(bar.percentage);
        }
    },

    /**
     * Collision event that collects bottles,
     * updates the bottle bar, and increases throwable bottles.
     */
    {
        name: "town_collect_bottles",
        type: "collision",
        once: false,
        objectA: "character",
        objectB: "bottles",
        condition: (setup) => setup.bottleBar.percentage !== 100,
        action: (setup, char, bottle) => {
            const bottles = setup.townLevel.bottles;
            const bar = setup.bottleBar;
            const index = bottles.indexOf(bottle);
            if (index === -1) return;
            bottles.splice(index, 1);
            setup.world.audioManager.playOneShot("bottleClinkSfx", { volume: 0.6 });
            bar.percentage = Math.min(bar.percentage + 20, 100);
            bar.setPercentage(bar.percentage);
            if (char.throwableBottles < 5) {
                char.throwableBottles += 1;
            }
        }
    },

    /**
     * Hold event that tries to start a bottle throw
     * when the hold input is canceled.
     */
    {
        name: "town_throw_bottle_hold",
        type: "hold",
        requireKey: "D",
        duration: 600,
        once: false,
        onCancel: (setup, char, _b, progress) => {
            townHelper.tryStartBottleThrow(setup, progress);
        }
    },

    /**
     * Time event that renders the bottle throw charge indicator.
     */
    {
        name: "town_throw_charge_ring",
        type: "time",
        once: false,
        from: 0,
        to: Infinity,
        action: (setup) => {
            townHelper.renderBottleThrowChargeIndicator(setup);
        }
    },

    /**
     * Input event that plays an empty bottle sound
     * when the throw key is pressed without bottles.
     */
    {
        name: "town_bottle_empty_click",
        type: "input",
        key: "D",
        once: false,
        cooldown: 250,
        condition: (setup) => {
            const c = setup.world.character;
            if (!c) return false;
            return (c.throwableBottles ?? 0) <= 0;
        },
        action: (setup) => {
            setup.world.audioManager.playOneShot("bottleEmptySfx", { volume: 0.6 });
        }
    },

    /**
     * Quest event that resets broken bottle sound flags
     * for throwable bottles marked for removal.
     */
    {
        name: "town_throwable_bottles_cleanup",
        type: "quest",
        once: false,
        action: (setup) => {
            const bottles = setup.state.throwableObjects;
            for (let i = bottles.length - 1; i >= 0; i--) {
                const bottle = bottles[i];
                if (!bottle.markedForRemoval) continue;
                bottle.isBrokenSound = false;
            }
        }
    },

    /**
     * Quest event that handles bottle ground impacts.
     */
    {
        name: "town_throwable_bottles_ground_hit",
        type: "quest",
        once: false,
        action: (setup) => {
            townHelper.handleBottleGroundImpact(setup);
        }
    },

    /**
     * Quest event that starts the game over sequence
     * when the character is defeated.
     */
    {
        name: "town_start_game_over_sequence",
        type: "quest",
        once: false,
        condition: (setup) => {
            const char = setup.world.character;
            return !!char &&
                char.energy <= 0 &&
                !char.isDead &&
                !setup.state.isGameOverSequenceStarted;
        },
        action: (setup) => {
            const char = setup.world.character;
            if (!char) return;
            setup.state.isGameOverSequenceStarted = true;
            char.isMovingLeft = false;
            char.isMovingRight = false;
            setup.world.isKeysStopp = true;
            char.isDead = true;
            setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.bossBattleMusic, 1000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.stormHazardMusic, 1000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.finalStormHazardMusic, 1000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.tadeoHoldStoneMusic, 1000);
        }
    },

    /**
     * Quest event that starts the game over flash
     * after the death animation has finished.
     */
    {
        name: "town_game_over_flash",
        type: "quest",
        once: false,
        condition: (setup) => {
            const char = setup.world.character;
            return !!char &&
                setup.state.isGameOverSequenceStarted &&
                !setup.state.isGameOverFlashStarted &&
                char.currentAnimation === 'dead' &&
                char.isDeadFinished;
        },
        action: (setup) => {
            setup.state.isGameOverFlashStarted = true;
            setup.state.gameOverSwitchAt = setup.world.timestamp + 500;
            setup.whiteFlashTransition.start(setup.world.timestamp);
        }
    },

    /**
     * Quest event that switches to the game over scene
     * after the game over flash delay.
     */
    {
        name: "town_switch_to_game_over",
        type: "quest",
        once: false,
        condition: (setup) => {
            return setup.state.isGameOverFlashStarted &&
                setup.world.timestamp >= (setup.state.gameOverSwitchAt ?? Infinity);
        },
        action: (setup) => {
            setup.world.levelManager.initGameOverRestart();
            setup.world.currentScene = 'gameOver';
        }
    }
];