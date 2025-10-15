// === farm-events-part4.js ===
// Farm-Events: Steps 15–22
// dronenangriff 🚁 → Hypnose 🌀 → Trauer 😢 → Entschlossenheit 💪 → Level Complete 🏁

const farmEvents_part4 = [
    // 🚁 STEP 15 – drone FLIEGT EIN ================================
    {
        type: "quest",
        step: 15,
        once: false,
        action: (setup) => {
            const { drone } = setup.characters;
            const targetX = 1500;
            const diff = targetX - drone.x;

            if (Math.abs(diff) >= 3) {
                drone.x += Math.sign(diff) * 5;
                setup.world.camera_x += ((drone.x - 300) - setup.world.camera_x) * 0.1;
            } else {
                drone.x = targetX;
                FarmHelper.nextQuest(setup, 16);
            }
        },
    },

    // 🎧 droneN-SOUNDS & NACHTMUSIK ===============================
    {
        type: "quest",
        step: 15,
        action: (setup) => {
            setup.sounds.farmMusic.pause();
            FarmHelper.playSound(setup, "droneSound", { loop: true });
            FarmHelper.playSound(setup, "nightMusic", { loop: true, volume: 0.6 });
        },
    },

    // 🌀 STEP 16 – HYPNOSE BEGINNT ==================================
    {
        type: "time",
        delay: 4000,
        step: 16,
        action: (setup) => {
            setup.sounds.droneSound.pause();
            FarmHelper.playSound(setup, "droneHypnoSound", { loop: true });
            setup.characters.drone.updateAnimationState("hypno", 1000 / 7);
            setup.cutsceneActors.chickenHypno.updateAnimationState("walk", 1000 / 7);
            setup.cutsceneActors.cowHypno.updateAnimationState("walk", 1000 / 5);
            setup.cutsceneActors.chickHypno.updateAnimationState("walk", 1000 / 7);
        },
    },

    // 🐄 TIERE LAUFEN HYPNOTISIERT ================================
    {
        type: "time",
        delay: 4000,
        step: 16,
        once: false,
        action: (setup) => {
            const { chickenHypno, cowHypno, chickHypno } = setup.cutsceneActors;
            [chickenHypno, cowHypno, chickHypno].forEach((npc) => {
                if (npc.x < 2600) npc.x += 1.5;
            });
            if (cowHypno.x >= 2600) FarmHelper.nextQuest(setup, 17);
        },
    },

    // 💤 STEP 17 – drone FLIEGT WEG ================================
    {
        type: "quest",
        step: 17,
        action: (setup) => {
            setup.sounds.droneHypnoSound.pause();
            FarmHelper.playSound(setup, "droneSound");
            setup.characters.drone.updateAnimationState("idle", 1000 / 7);
        },
    },

    // 🚀 drone VERLÄSST SZENE ====================================
    {
        type: "quest",
        step: 17,
        once: false,
        action: (setup) => {
            const { drone } = setup.characters;
            if (drone.x <= 3500) drone.x += 5;
            else FarmHelper.nextQuest(setup, 18);
        },
    },

    // 🔉 STEP 18 – MUSIK WIRD LEISER ===============================
    {
        type: "quest",
        step: 18,
        once: false,
        action: (setup) => {
            const vol = Math.max(setup.volumeLevel2 - 0.002, setup.minVolumeLevel);
            setup.volumeLevel2 = vol;
            ["droneSound", "nightMusic", "eveningSound"].forEach(
                (s) => (setup.sounds[s].volume = vol)
            );
        },
    },

    // 😢 TRAURIGE MUSIK STARTET ====================================
    {
        type: "time",
        delay: 3000,
        step: 18,
        action: (setup) => {
            setup.isNight = false;
            FarmHelper.playSound(setup, "sadMusic");
        },
    },

    // 🔇 ANDERE SOUNDS AUS =========================================
    {
        type: "time",
        delay: 7000,
        step: 18,
        action: (setup) => {
            ["eveningSound", "droneSound", "nightMusic"].forEach((n) =>
                setup.sounds[n].pause()
            );
        },
    },

    // 🎥 KAMERA FÄHRT ZUR TRAUER-SZENE ==============================
    {
        type: "time",
        delay: 7000,
        step: 18,
        once: false,
        action: (setup) => {
            if (setup.world.camera_x > 800) setup.world.camera_x -= 3;
            else FarmHelper.nextQuest(setup, 19);
        },
    },

    // 💬 STEP 19 – REIHEN VON SPRECHBLASEN =========================
    {
        type: "time",
        from: 4000,
        to: 51000,
        step: 19,
        once: false,
        action: (setup) => {
            const seq = [
                "bubbleFarm3",
                "bubbleFarm4",
                "bubbleFarm5",
                "bubbleFarm6",
                "bubbleFarm7",
                "bubbleFarm8",
            ];
            seq.forEach((id) => {
                const b = setup.speechBubbles[id];
                if (!b.startTime) b.start();
                b.update(performance.now());
                FarmHelper.renderBubble(setup, b);
            });
        },
    },

    // 😭 SPIELER KNIEEND WEINEND ==================================
    {
        type: "time",
        delay: 16000,
        step: 19,
        action: (setup) => (setup.world.character.isKneelAndCry = true),
    },

    // 💪 ENTWICKLUNG – STEHT ENTSCHLOSSEN AUF ======================
    {
        type: "time",
        delay: 35000,
        step: 19,
        action: (setup) => {
            const c = setup.world.character;
            c.isKneelAndCry = false;
            c.isStandUpAndLookDetermined = true;
        },
    },

    // 🔥 PORTRÄT-SZENE BEGINNT (STEP 22) ===========================
    {
        type: "quest",
        step: 22,
        action: (setup) => {
            const { chick, chicken, cow } = setup.characters.portraits;
            setup.world.character.isWalkDetermined = false;
            setup.world.character.isStandDetermined = true;
            [chick, chicken, cow].forEach((p) => {
                p.fadeIn(setup.world.farmLevelController.timestamp, 10000);
                p.updateAnimationState("portrait", 1000 / 5);
                FarmHelper.drawPortraitGlow(setup, p);
            });
        },
    },

    // 🚶‍♂️ SCHLUSSSZENE: WALK DETERMINED ===========================
    {
        type: "time",
        delay: 21000,
        step: 22,
        action: (setup) => {
            const c = setup.world.character;
            c.isWalkDetermined = true;
            c.isStandDetermined = false;
        },
    },

    // 🏁 STEP 22 – LEVEL COMPLETE ==================================
    {
        type: "time",
        delay: 21000,
        once: false,
        step: 22,
        action: (setup) => {
            const c = setup.world.character;
            if (c.x < 6500) c.x += 1.0;
            else setup.world.currentScene = "levelComplete";
        },
    },
];