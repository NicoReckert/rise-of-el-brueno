// === farm-events-part1.js ===
// Enthält alle Farm-Events bis einschließlich Quest-Step 4
// Verwendet FarmHelper + EventManager
// Global verfügbar (kein Import/Export)

export const farmEvents_part1 = [
    // 🟩 INITIALISIERUNG ============================================
    {
        type: "quest",
        name: "initialize",
        once: true,
        action: (setup) => {
            setup.world.character.x = setup.comeFromStable ? 1700 : 1000;
            setup.world.camera_x = setup.world.character.x - 500;
            setup.farmLevel.level_end_x = 6409;
            setup.world.character.level_start_x = 440;
            FarmHelper.playSound(setup, "farmMusic", { loop: true });
            setup.comeFromStable = false;
        },
    },

    // 🔁 LEVELWECHSEL ===============================================
    {
        type: "position",
        name: "changeLevel",
        area: { x: 1705, width: 125 },
        objectA: "character",
        requireKey: "F",
        action: (setup) => {
            setup.world.currentScene = "stableLevel";
            setup.world.stableLevelController.eventManager.resetEventByName("initialize");
            setup.world.stableLevelController.eventManager.resetEventByName("changeLevel");
            setup.world.keyboard.F = false;
        },
    },

    // 🐄 KUH – STREICHELN ============================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        step: 1,
        once: false,
        action: (setup) => setup.characters.cow.updateAnimationState("happy", 1000 / 5.5),
        onLeave: (setup) => setup.characters.cow.updateAnimationState("idle", 1000 / 5.5),
    },

    // 🐄 KUH – SOUND ================================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        step: 1,
        once: false,
        cooldown: 6000,
        action: (setup) => FarmHelper.playSound(setup, "cowSound2"),
    },

    // 🧭 QUEST 1 – WENN ALLE AUFGABEN ERLEDIGT ======================
    {
        type: "quest",
        step: 1,
        once: false,
        condition: (setup) =>
            setup.taskWindow.tasks[0].done && setup.taskWindow.tasks[1].done,
        action: (setup) => FarmHelper.nextQuest(setup, 2),
    },

    // 📝 QUEST 2 – NEUE AUFGABE =====================================
    {
        type: "quest",
        step: 2,
        action: (setup) => FarmHelper.addTask(setup, "3. Bringe Lola zur Wiese"),
    },

    // 🐄 LOLA AUFSTEHEN =============================================
    {
        type: "hold",
        objectA: "character",
        objectB: "cow",
        step: 2,
        requireKey: "F",
        duration: 2000,
        once: false,
        action: (setup) => {
            setup.characters.cow.updateAnimationState("standUp", 1000 / 5.5);
            setup.characters.cow.y = 485;
            FarmHelper.nextQuest(setup, 3);
        },
    },

    // 🕐 QUEST 3 – KUH STARTET WEG ==================================
    {
        type: "time",
        delay: 600,
        step: 3,
        action: (setup) => {
            setup.characters.cow.updateAnimationState("walk");
            setup.world.keyboard.F = false;
        },
    },

    // 🐄 LOLA LAUFEN LASSEN ========================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        toleranceB: { x: -200, width: -250 },
        step: 3,
        once: false,
        action: (setup) => FarmHelper.makeCowWalk(setup, 2, 5300, 4),
        onLeave: (setup) => FarmHelper.makeCowAfraid(setup),
    },

    // 🐮 SOUND BEIM WEGGEHEN =======================================
    {
        type: "collision",
        objectA: "character",
        objectB: "cow",
        toleranceB: { x: -200, width: -250 },
        step: 3,
        once: false,
        cooldown: 4000,
        onLeave: (setup) => FarmHelper.playSound(setup, "cowSound"),
    },

    // ✅ QUEST 4 – KUH ISST =========================================
    {
        type: "quest",
        step: 4,
        action: (setup) => {
            FarmHelper.completeTask(setup, 2);
            FarmHelper.makeCowEat(setup);
        },
    },

    // 🕒 WARTE BIS LOLA FERTIG IST ==================================
    {
        type: "time",
        delay: 3000,
        step: 4,
        action: (setup) => FarmHelper.addTask(setup, "4. Warte bis Lola fertig ist"),
    },

    // 🕒 UHRZEIT ANZEIGEN ==========================================
    {
        type: "time",
        from: 4000,
        to: 14000,
        step: 4,
        once: false,
        action: (setup) => {
            FarmHelper.withCtx(setup, (ctx) => {
                ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(setup.environment.clock);
            });
        },
    },

    // ✅ WARTE-AUFGABE ERLEDIGT =====================================
    {
        type: "time",
        delay: 15000,
        step: 4,
        action: (setup) => FarmHelper.completeTask(setup, 3),
    },

    // ✨ NEUE AUFGABE „LOLA BELOHNEN“ ===============================
    {
        type: "time",
        delay: 18000,
        step: 4,
        action: (setup) => {
            FarmHelper.addTask(setup, "5. Belohne Lola");
            FarmHelper.nextQuest(setup, 5);
        },
    },
];
