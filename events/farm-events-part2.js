// === farm-events-part2.js ===
// Enthält alle Farm-Events für Steps 5–9
// Verwendet FarmHelper + EventManager (global)

const farmEvents_part2 = [
    // 🐮 STEP 5 – LOLA BELOHNEN =====================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        step: 5,
        requireKey: "F",
        action: (setup) => {
            const c = setup.world.character;
            const cow = setup.npcs.cow;
            c.isCaress = true;
            c.isMovingLeft = false;
            c.isMovingRight = false;
            setup.world.isKeysStopp = true;
            cow.updateState("love");
            c.x = cow.x + 135;
            if (cow.isFlipped) c.isFlipped = true;
            FarmHelper.playSound(setup, "cowSound2");
            FarmHelper.nextQuest(setup, 6);
        },
    },

    // 💞 STEP 6 – KUH FREUT SICH ====================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        step: 6,
        once: false,
        action: (setup) => {
            if (setup.npcs.cow.currentAnimation === "love") {
                FarmHelper.playSound(setup, "cowSound2");
            }
        },
    },

    // ⏱️ KUH GEHT ESSEN =============================================
    {
        type: "time",
        delay: 5000,
        step: 6,
        action: (setup) => {
            FarmHelper.makeCowEat(setup);
            const c = setup.world.character;
            c.isCaress = false;
            setup.world.isKeysStopp = false;
            setup.world.keyboard.F = false;
        },
    },

    // ✅ AUFGABE ABGESCHLOSSEN =====================================
    {
        type: "time",
        delay: 6000,
        step: 6,
        action: (setup) => FarmHelper.completeTask(setup, 4),
    },

    // 🧭 NÄCHSTER QUEST-SCHRITT ====================================
    {
        type: "time",
        delay: 9000,
        step: 6,
        action: (setup) => FarmHelper.nextQuest(setup, 7),
    },

    // 🐄 STEP 7 – LOLA ZURÜCK BRINGEN ================================
    {
        type: "quest",
        step: 7,
        action: (setup) => {
            FarmHelper.addTask(setup, "6. Bringe Lola wieder zurück");
            const cow = setup.npcs.cow;
            cow.updateState("walk");
            cow.isFlipped = false;
        },
    },

    // 🐄 KUH GEHT ZURÜCK ============================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        toleranceB: { x: -200, width: -250 },
        step: 7,
        once: false,
        action: (setup) => {
            const cow = setup.npcs.cow;
            if (cow.x >= 500) {
                cow.x -= 2;
                cow.updateState("walk");
            } else {
                FarmHelper.completeTask(setup, 5);
                cow.updateState("idle");
                FarmHelper.nextQuest(setup, 8);
            }
        },
        onLeave: (setup) => FarmHelper.makeCowAfraid(setup),
    },

    // 🐄 SOUND WENN WEG =============================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        toleranceB: { x: -200, width: -250 },
        step: 7,
        once: false,
        cooldown: 4000,
        onLeave: (setup) => FarmHelper.playSound(setup, "cowSound"),
    },

    // 🐔 STEP 8 – CHICKEN CUTSCENE ==================================
    {
        type: "quest",
        step: 8,
        action: (setup) => {
            const { chicken2, chick } = setup.npcs;
            const c = setup.world.character;
            c.isMovingLeft = false;
            c.isMovingRight = false;
            setup.world.isKeysStopp = true;
            c.isFlipped = false;
            setup.npcs.cow.isFlipped = true;
            chicken2.updateState("walk2", 1000 / 8);
            chick.updateState("walk", 1000 / 8);
            chicken2.isFlipped = true;
            chick.isFlipped = false;
        },
    },

    // 🐥 HÜHNER BEWEGEN =============================================
    {
        type: "quest",
        step: 8,
        once: false,
        action: (setup) => {
            const { chicken2, chick } = setup.npcs;
            if (chicken2.x >= 500) chicken2.x -= 3;
            if (chick.x >= 575) chick.x -= 3;
        },
    },

    // 🎯 POSITION – ANKUNFT DER KÜKEN ================================
    {
        type: "position",
        objectA: "chick",
        area: { x: 525, width: 50 },
        step: 8,
        action: (setup) => FarmHelper.nextQuest(setup, 9),
    },

    // 🏕️ STEP 9 – FEUER MACHEN ======================================
    {
        type: "quest",
        step: 9,
        action: (setup) => {
            const { chicken2, chick } = setup.npcs;
            chicken2.updateState("idle");
            chicken2.isFlipped = false;
            chick.updateState("idle");
            chick.isFlipped = true;
            setup.world.character.isWalk = true;
        },
    },

    // 🔄 SPIELERBLICK LINKS =========================================
    {
        type: "quest",
        step: 9,
        condition: (setup) => setup.world.character.x >= 788,
        action: (setup) => (setup.world.character.isFlipped = true),
    },

    // 🔄 SPIELERBLICK RECHTS ========================================
    {
        type: "quest",
        step: 9,
        condition: (setup) => setup.world.character.x <= 788,
        action: (setup) => (setup.world.character.isFlipped = false),
    },

    // 🎥 KAMERA & SPIELER JUSTIERUNG ================================
    {
        type: "quest",
        step: 9,
        once: false,
        action: (setup) => {
            const c = setup.world.character;
            if (setup.world.camera_x <= 108) setup.world.camera_x += 6;
            if (setup.world.camera_x >= 108) setup.world.camera_x -= 6;
            if (c.x < 788) c.x += 5;
            if (c.x > 788) c.x -= 5;
            if (c.y <= 393) c.y += 1.5;
        },
    },

    // 🔥 FEUERPOSITION ERREICHT =====================================
    {
        type: "quest",
        step: 9,
        once: false,
        action: (setup) => {
            const c = setup.world.character;
            if (
                c.x <= 788 &&
                c.x >= 738 &&
                c.y <= 394 &&
                c.y >= 343 &&
                setup.world.camera_x <= 108
            ) {
                c.isFlipped = true;
                c.isWalk = false;
                c.yNormal = 393;
                c.yVoidless = 510;
                c.isLightACampfire = true;
                FarmHelper.nextQuest(setup, 10);
            }
        },
    },
];