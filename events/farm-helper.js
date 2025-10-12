// === farm-helper.js ===
// Globale Utilitys für Farm-Events (ohne Import/Export)
// Nutzt den bestehenden EventManager, um Events schlanker zu halten

const FarmHelper = {
    /** 🪶 Popup anzeigen */
    popup(setup, text, yOffset = 400) {
        setup.popupTexts.push(
            new PopupText(text, setup.world.canvas.width / 2, yOffset)
        );
    },

    /** 📜 Neue Aufgabe hinzufügen */
    addTask(setup, text, active = true) {
        setup.taskWindow.addTask(text, { active });
        setup.sounds.newTaskSound.play();
        this.popup(setup, "Neue Aufgabe im Log!");
    },

    /** ✅ Aufgabe erledigen */
    completeTask(setup, index, text = "Aufgabe erledigt!") {
        setup.taskWindow.markDone(index);
        setup.sounds.taskCompletedSound.play();
        this.popup(setup, text);
    },

    /** 🎵 Sound abspielen */
    playSound(setup, name, { loop = false, volume = null } = {}) {
        const s = setup.sounds[name];
        if (!s) return;
        s.loop = loop;
        if (volume !== null) s.volume = volume;
        s.play();
    },

    /** 🎵 Musik pausieren */
    pauseSound(setup, name) {
        const s = setup.sounds[name];
        if (s && !s.paused) s.pause();
    },

    /** 🌤️ Nächsten Quest-Schritt starten */
    nextQuest(setup, step) {
        setup.world.farmLevelController.questManager.advance(step);
    },

    /** 🧭 Kamera sanft zum Ziel bewegen */
    moveCameraTo(setup, targetX, speed = 5) {
        const diff = targetX - setup.world.camera_x;
        if (Math.abs(diff) > 2) setup.world.camera_x += Math.sign(diff) * speed;
        else setup.world.camera_x = targetX;
    },

    /** 🚶‍♀️ NPC bewegen, bis Ziel erreicht */
    moveNpc(setup, npc, speed, limit, nextStep, direction = 1) {
        const obj = setup.npcs[npc];
        if (!obj) return;
        if ((direction > 0 && obj.x <= limit) || (direction < 0 && obj.x >= limit)) {
            obj.x += direction * speed;
            obj.updateState('walk');
        } else if (nextStep) this.nextQuest(setup, nextStep);
    },

    /** 🐄 Kuh läuft nach rechts */
    makeCowWalk(setup, speed = 2, maxX = 5300, nextStep) {
        const cow = setup.npcs.cow;
        if (cow.x <= maxX) {
            cow.x += speed;
            cow.updateState('walk');
        } else if (nextStep) this.nextQuest(setup, nextStep);
    },

    /** 🐄 Kuh frisst */
    makeCowEat(setup) {
        setup.npcs.cow.updateState('eat', 1000 / 5.5);
    },

    /** 🐄 Kuh erschreckt */
    makeCowAfraid(setup, duration = 1000 / 5) {
        setup.npcs.cow.updateState('afraid', duration);
    },

    /** 💬 Standard-Sprechblase rendern */
    renderSpeechBubble(setup, bubbleName, offsetY = 0) {
        const bubble = setup.speechBubbles[bubbleName];
        if (!bubble) return;
        this.withCtx(setup, (ctx) => {
            ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            if (!bubble.startTime) bubble.start();
            bubble.update(performance.now());
            bubble.draw(ctx, offsetY);
        });
    },

    /** 💡 Canvas-Kontext sicher verwenden */
    withCtx(setup, fn) {
        const ctx = setup.world.ctx;
        ctx.save();
        fn(ctx);
        ctx.restore();
    },

    /** 🌈 Porträt mit Glow zeichnen */
    drawPortrait(setup, npcName, glow = "rgba(0,200,255,0.6)", fade = 0.75) {
        const portrait = setup.npcs[npcName];
        if (!portrait) return;
        this.drawPortraitGlow(setup, portrait, fade, glow);
    },

    /** ☀️ Sonne bewegen */
    moveSun(setup, speed = 0.004) {
        const f = setup.world.farmLevelController;
        if (f.sunAngle < Math.PI) f.sunAngle += speed;
        setup.npcs.sun.x = f.sunCenterX + f.sunRadius * Math.cos(f.sunAngle);
        setup.npcs.sun.y = f.sunCenterY - f.sunRadius * Math.sin(f.sunAngle);
    },

    /** 🌙 Mond bewegen */
    moveMoon(setup, speed = 0.004, limit = Math.PI * 0.85) {
        const f = setup.world.farmLevelController;
        if (f.moonAngle < limit) f.moonAngle += speed;
        setup.npcs.moon.x = f.moonCenterX + f.moonRadius * Math.cos(f.moonAngle);
        setup.npcs.moon.y = f.moonCenterY - f.moonRadius * Math.sin(f.moonAngle);
    },

    /** 🌘 Nacht-Helligkeit anpassen */
    updateDarkness(setup) {
        const step = setup.world.farmLevelController.questManager.step;
        const night = [10, 11, 12, 13, 14, 15, 16, 17].includes(step) && setup.isNight;
        const d = 0.005;
        setup.darknessLevel = night
            ? Math.min(setup.darknessLevel + d, setup.maxDarkness)
            : Math.max(setup.darknessLevel - d, 0);
        const ctx = setup.world.ctx;
        ctx.fillStyle = `rgba(10,10,40,${setup.darknessLevel})`;
        ctx.fillRect(0, 0, setup.world.canvas.width, setup.world.canvas.height);
    },

    /** 🔉 Musik langsam ausblenden */
    fadeOutMusic(setup, key = 'farmMusic', step = 0.005) {
        const s = setup.sounds[key];
        if (!s) return;
        setup.volumeLevel = Math.max(setup.volumeLevel - step, setup.minVolumeLevel);
        s.volume = setup.volumeLevel;
    },

    /** 🔦 Musiklautstärke für mehrere Sounds reduzieren */
    fadeOutAll(setup, step = 0.002) {
        const sounds = ['drohneSound', 'nightMusic', 'eveningSound'];
        for (const key of sounds) {
            const s = setup.sounds[key];
            if (!s) continue;
            setup.volumeLevel2 = Math.max(setup.volumeLevel2 - step, setup.minVolumeLevel);
            s.volume = setup.volumeLevel2;
        }
    },

    /** 🔥 Lagerfeuer aktivieren + Musik wechseln */
    startCampfireScene(setup) {
        setup.npcs.campfire.updateState('fireGoesOn');
        this.playSound(setup, 'happyTogetherMusic');
        setup.sounds.farmMusic.loop = false;
        this.playSound(setup, 'eveningSound', { loop: true });
        setup.npcs.cow.updateState('swingToMusic', 1000 / 6.5);
        setup.npcs.chick.updateState('swingToMusic', 1000 / 6.5);
        setup.npcs.chicken2.updateState('swingToMusic', 1000 / 6.5);
        setup.npcs.moon.updateState('swingToMusic');
    },
};

// global verfügbar machen
window.FarmHelper = FarmHelper;