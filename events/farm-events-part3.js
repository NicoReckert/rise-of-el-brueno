// === farm-events-part3.js ===
// Farm-Events: Steps 10–14
// Sonnenuntergang 🌞 → Musikabend 🎸 → Nacht 🌙
// Verwendet FarmHelper + EventManager

const farmEvents_part3 = [
    // 🌅 STEP 10 – SONNENUNTERGANG BEGINNT ===========================
    {
        type: "quest",
        step: 10,
        once: false,
        action: (setup) => FarmHelper.moveSun(setup),
    },

    // 🌙 MOND AUFGEHEN LASSEN =======================================
    {
        type: "time",
        delay: 5000,
        step: 10,
        once: false,
        action: (setup) => FarmHelper.moveMoon(setup),
    },

    // 🌘 NACHTMODUS AKTIVIEREN =====================================
    {
        type: "time",
        delay: 5000,
        step: 10,
        action: (setup) => (setup.isNight = true),
    },

    // 🔦 NACHT-DUNKELHEIT RENDERN ===================================
    {
        type: "quest",
        once: false,
        action: (setup) => FarmHelper.updateDarkness(setup),
    },

    // 🔉 MUSIK LANGSAM AUSBLENDEN ===================================
    {
        type: "quest",
        step: 10,
        once: false,
        action: (setup) => FarmHelper.fadeOutMusic(setup, "farmMusic", 0.005),
    },

    // 🔥 LAGERFEUER STARTEN =========================================
    {
        type: "time",
        delay: 1500,
        step: 10,
        action: (setup) => FarmHelper.startCampfireScene(setup),
    },

    // 🎵 LIED & ANIMATIONEN =========================================
    {
        type: "time",
        delay: 3000,
        step: 10,
        once: false,
        action: (setup) => {
            const s = setup.sounds.happyTogetherMusic;
            const c = setup.world.character;

            setup.lyrics = [
                { time: 7.2, text: "Bailamos en la plaza," },
                { time: 9.3, text: "Cantando sin parar," },
                { time: 11.4, text: "Con mis amigos cerca," },
                { time: 13.5, text: "Es un día para amar." },
                { time: 15.7, text: "Juanito, Pollito, Lola, we sing," },
                { time: 20.2, text: "Happy together, joy that we bring," },
                { time: 24.1, text: "Juanito, Pollito, Lola, my friends," },
                { time: 28.2, text: "Our love and laughter will never end." },
                { time: 32.1, text: "" },
            ];

            const t = s.currentTime;
            if (t <= 7.2) c.isSitDownAndPlayGuitar = true;
            else if (t <= 32.1) {
                c.isSitDownAndPlayGuitar = false;
                c.isPlayGuitarAndSing = true;
            }
            setup.world.farmLevelController.renderLyrics();
        },
    },

    // 💤 NACH DEM LIED: TIERCHEN SCHLAFEN ===========================
    {
        type: "quest",
        step: 10,
        once: false,
        action: (setup) => {
            const m = setup.sounds.happyTogetherMusic;
            if (m.currentTime >= 97.0) {
                setup.npcs.cow.updateState("sleep", 1000 / 5.5);
                setup.npcs.chick.updateState("sleep", 1000 / 5.5);
                setup.npcs.chicken2.updateState("sleep", 1000 / 5.5);
                setup.npcs.campfire.updateState("fireGoesOut");
                setup.npcs.moon.updateState("idle");
                setup.world.character.isPlayGuitar = false;
                setup.world.character.isStandUp = true;
                FarmHelper.nextQuest(setup, 11);
            }
        },
    },

    // 🚶‍♂️ STEP 11 – AUFSTEHEN & GEHEN ===============================
    {
        type: "time",
        delay: 4000,
        step: 11,
        action: (setup) => {
            const c = setup.world.character;
            c.isWalk = true;
            c.isFlipped = false;
        },
    },

    // 🎞️ LAUF-ANIMATION =============================================
    {
        type: "time",
        delay: 4000,
        step: 11,
        once: false,
        action: (setup) => {
            const c = setup.world.character;
            if (c.x < 820) c.x += 5;
            if (c.y >= 370) c.y -= 1.5;
            else {
                c.yNormal = 370;
                c.yVoidless = 487;
                setup.world.isKeysStopp = false;
                c.isWalk = false;
                FarmHelper.nextQuest(setup, 12);
            }
        },
    },

    // 🏡 STEP 12 – FEUERSTELLE VERLASSEN =============================
    {
        type: "position",
        objectA: "character",
        area: { x: 1170, width: 100 },
        step: 12,
        requireKey: "F",
        action: (setup) => {
            const c = setup.world.character;
            c.isMovingLeft = false;
            c.isMovingRight = false;
            setup.world.isKeysStopp = true;
            c.isFlipped = false;
            FarmHelper.nextQuest(setup, 13);
        },
    },

    // 🎥 STEP 13 – KAMERA FÄHRT ZUM ZIEL =============================
    {
        type: "quest",
        step: 13,
        once: false,
        action: (setup) => {
            FarmHelper.moveCameraTo(setup, 900, 5);
            if (setup.world.camera_x === 900)
                FarmHelper.nextQuest(setup, 14);
        },
    },

    // 😴 STEP 14 – SCHLAFSZENE START ================================
    {
        type: "time",
        delay: 3000,
        step: 14,
        action: (setup) => FarmHelper.playSound(setup, "yawningSound"),
    },

    // 😪 SCHNARCHEN =================================================
    {
        type: "time",
        delay: 10000,
        step: 14,
        action: (setup) => FarmHelper.playSound(setup, "snoringSound"),
    },

    // 🌍 ERDBEBEN-SOUND =============================================
    {
        type: "time",
        delay: 15000,
        step: 14,
        action: (setup) => {
            FarmHelper.playSound(setup, "earthquakeSound");
            setup.earthquakeStart = true;
        },
    },

    // 🎥 DROHNEN-SZENE BEGINNT ======================================
    {
        type: "time",
        delay: 22000,
        step: 14,
        once: false,
        action: (setup) => {
            const { drohne } = setup.npcs;
            FarmHelper.withCtx(setup, (ctx) => {
                ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(drohne);
            });

            const targetX = drohne.x - 300;
            const diff = targetX - setup.world.camera_x;
            if (Math.abs(diff) >= 3)
                setup.world.camera_x += Math.sign(diff) * 10;
            else {
                setup.world.camera_x = targetX;
                FarmHelper.nextQuest(setup, 15);
            }
        },
    },
];