const farmEvents = [
    ...farmEvents_part1,
    ...farmEvents_part2,
    ...farmEvents_part3,
    ...farmEvents_part4
];

const farmEvents2 =
    [
        {
            type: 'quest',
            name: 'initialize',
            once: true,
            action: (setup) => {
                setup.comeFromStable ? setup.world.character.x = 1700 : setup.world.character.x = 1000;
                setup.world.camera_x = setup.world.character.x - 500;
                setup.farmLevel.level_end_x = 6409;
                setup.world.character.level_start_x = 440;
                setup.sounds.farmMusic.play();
                setup.sounds.farmMusic.loop = true;
                setup.comeFromStable = false;
            }
        },

        {
            type: 'position',
            name: 'changeLevel',
            area: { x: 1705, width: 125 },
            objectA: 'character',
            requireKey: 'F',
            action: (setup) => {
                setup.world.currentScene = 'stableLevel';
                setup.world.stableLevelController.eventManager.resetEventByName('initialize');
                setup.world.stableLevelController.eventManager.resetEventByName('changeLevel');
                setup.world.keyboard.F = false;
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            action: (setup) => setup.npcs.cow.updateState('happy', 1000 / 5.5),
            onLeave: (setup) => setup.npcs.cow.updateState('idle', 1000 / 5.5)
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            cooldown: 6000,
            action: (setup) => setup.sounds.cowSound2.play()
        },

        {
            type: 'quest',
            step: 1,
            once: false,
            condition: (setup) => setup.taskWindow.tasks[0].done && setup.taskWindow.tasks[1].done,
            action: (setup) => setup.world.farmLevelController.questManager.advance(2)
        },

        {
            type: 'quest',
            step: 2,
            action: (setup) => {
                setup.taskWindow.addTask('3. Bringe Lola zur Wiese', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            }
        },

        {
            type: 'hold',
            objectA: 'character',
            objectB: 'cow',
            step: 2,
            requireKey: "F",
            duration: 2000,
            once: false,
            action: (setup) => {
                setup.npcs.cow.updateState('standUp', 1000 / 5.5)
                setup.npcs.cow.y = 485
                setup.world.farmLevelController.questManager.advance(3)
            }
        },

        {
            type: 'time',
            delay: 600,
            step: 3,
            action: (setup) => {
                setup.npcs.cow.updateState('walk')
                setup.world.keyboard.F = false
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 3,
            once: false,
            action: (setup) => {
                if (setup.npcs.cow.x <= 5300) {
                    setup.npcs.cow.x += 2
                    setup.npcs.cow.updateState('walk')
                } else setup.world.farmLevelController.questManager.advance(4)
            },
            onLeave: (setup) => setup.npcs.cow.updateState('afraid', 1000 / 5)
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 3,
            once: false,
            cooldown: 4000,
            onLeave: (setup) => setup.sounds.cowSound.play()
        },

        {
            type: 'quest',
            step: 4,
            action: (setup) => {
                setup.taskWindow.markDone(2);
                setup.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.sounds.taskCompletedSound.play();
                setup.npcs.cow.updateState('eat', 1000 / 5.5);
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.addTask('4. Warte bis Lola fertig ist', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
            }
        },

        {
            type: 'time',
            from: 4000,
            to: 14000,
            step: 4,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0)
                setup.world.addToWorld(setup.npcs.clock)
                setup.world.ctx.restore()
            }
        },

        {
            type: 'time',
            delay: 15000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.markDone(3)
                setup.sounds.taskCompletedSound.play()
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400))
            }
        },

        {
            type: 'time',
            delay: 18000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.addTask('5. Belohne Lola', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
                setup.world.farmLevelController.questManager.advance(5)
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 5,
            requireKey: 'F',
            action: (setup) => {
                setup.world.character.isCaress = true
                setup.world.character.isMovingLeft = false
                setup.world.character.isMovingRight = false
                setup.world.isKeysStopp = true;
                setup.npcs.cow.updateState('love');
                setup.world.character.x = setup.npcs.cow.x + 135;
                if (setup.npcs.cow.isFlipped) setup.world.character.isFlipped = true
                setup.sounds.cowSound2.play();
                setup.world.farmLevelController.questManager.advance(6)
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 6,
            once: false,
            action: (setup) => {
                if (setup.npcs.cow.currentAnimation === 'love') setup.sounds.cowSound2.play()
            }
        },

        {
            type: "time",
            delay: 5000,
            step: 6,
            action: (setup) => {
                setup.npcs.cow.updateState('eat', 1000 / 5.5);
                setup.world.character.isCaress = false;
                setup.world.isKeysStopp = false;
                setup.world.keyboard.F = false;
            },
        },

        {
            type: "time",
            delay: 6000,
            step: 6,
            action: (setup) => {
                setup.taskWindow.markDone(4);
                setup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
            },
        },

        {
            type: "time",
            delay: 9000,
            step: 6,
            action: (setup) => {
                setup.world.farmLevelController.questManager.advance(7)
            },
        },

        {
            type: "quest",
            step: 7,
            action: (setup) => {
                setup.taskWindow.addTask('6. Bringe Lola wieder zurück', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
                setup.npcs.cow.updateState('walk');
                setup.npcs.cow.isFlipped = false;
            },
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 7,
            once: false,
            action: (setup) => {
                if (setup.npcs.cow.x >= 500) {
                    setup.npcs.cow.x -= 2
                    setup.npcs.cow.updateState('walk');
                } else {
                    setup.taskWindow.markDone(5);
                    setup.sounds.taskCompletedSound.play();
                    setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
                    setup.npcs.cow.updateState('idle');
                    setup.world.farmLevelController.questManager.advance(8)
                }
            },
            onLeave: (setup) => setup.npcs.cow.updateState('afraid', 1000 / 5)
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 7,
            once: false,
            cooldown: 4000,
            onLeave: (setup) => setup.sounds.cowSound.play()
        },

        {
            type: 'quest',
            step: 8,
            action: (setup) => {
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
                setup.world.character.isFlipped = false;
                setup.npcs.cow.isFlipped = true;
                setup.npcs.chicken2.updateState('walk2', 1000 / 8);
                setup.npcs.chick.updateState('walk', 1000 / 8);
                setup.npcs.chicken2.isFlipped = true;
                setup.npcs.chick.isFlipped = false;
            }
        },

        {
            type: 'quest',
            step: 8,
            once: false,
            action: (setup) => {
                if (setup.npcs.chicken2.x >= 500) setup.npcs.chicken2.x -= 3;
                if (setup.npcs.chick.x >= 575) setup.npcs.chick.x -= 3;
            }
        },

        {
            type: 'position',
            objectA: 'chick',
            area: { x: 525, width: 50 },
            step: 8,
            action: (setup) => {
                setup.world.farmLevelController.questManager.advance(9)
            }
        },

        {
            type: 'quest',
            step: 9,
            action: (setup) => {
                setup.npcs.chicken2.updateState('idle');
                setup.npcs.chicken2.isFlipped = false;
                setup.npcs.chick.updateState('idle');
                setup.npcs.chick.isFlipped = true;
                setup.world.character.isWalk = true;
            }
        },

        {
            type: 'quest',
            step: 9,
            condition: (setup) => setup.world.character.x >= 788,
            action: (setup) => setup.world.character.isFlipped = true
        },

        {
            type: 'quest',
            step: 9,
            condition: (setup) => setup.world.character.x <= 788,
            action: (setup) => setup.world.character.isFlipped = false
        },

        {
            type: 'quest',
            step: 9,
            once: false,
            action: (setup) => {
                if (setup.world.camera_x <= 108) setup.world.camera_x += 6;
                if (setup.world.camera_x >= 108) setup.world.camera_x -= 6;
                if (setup.world.character.x < 788) setup.world.character.x += 5;
                if (setup.world.character.x > 788) setup.world.character.x -= 5;
                if (setup.world.character.y <= 393) setup.world.character.y += 1.5;
            }
        },

        {
            type: 'quest',
            step: 9,
            once: false,
            action: (setup) => {
                if (setup.world.character.x <= 788 && setup.world.character.x >= 738 && setup.world.character.y <= 394 && setup.world.character.y >= 343 && setup.world.camera_x <= 108) {
                    setup.world.character.isFlipped = true;
                    setup.world.character.isWalk = false;
                    setup.world.character.yNormal = 393;
                    setup.world.character.yVoidless = 510;
                    setup.world.character.isLightACampfire = true;
                    setup.world.farmLevelController.questManager.advance(10)
                }
            }
        },
        {
            type: 'quest',
            step: 10,
            once: false,
            action: (setup) => {
                if (setup.world.farmLevelController.sunAngle < Math.PI) {
                    setup.world.farmLevelController.sunAngle += 0.004;

                }
                setup.npcs.sun.x = setup.world.farmLevelController.sunCenterX + setup.world.farmLevelController.sunRadius * Math.cos(setup.world.farmLevelController.sunAngle);
                setup.npcs.sun.y = setup.world.farmLevelController.sunCenterY - setup.world.farmLevelController.sunRadius * Math.sin(setup.world.farmLevelController.sunAngle);
            }
        },

        {
            type: 'quest',
            step: 10,
            once: false,
            action: (setup) => {
                if (setup.volumeLevel > setup.minVolumeLevel) {
                    setup.volumeLevel = Math.max(setup.volumeLevel - 0.005, setup.minVolumeLevel);
                    setup.sounds.farmMusic.volume = setup.volumeLevel;
                }
            }
        },

        {
            type: 'time',
            delay: 5000,
            step: 10,
            once: false,
            action: (setup) => {
                if (setup.world.farmLevelController.moonAngle < Math.PI * 0.85) {
                    setup.world.farmLevelController.moonAngle += 0.004;
                }
                setup.npcs.moon.x = setup.world.farmLevelController.moonCenterX + setup.world.farmLevelController.moonRadius * Math.cos(setup.world.farmLevelController.moonAngle);
                setup.npcs.moon.y = setup.world.farmLevelController.moonCenterY - setup.world.farmLevelController.moonRadius * Math.sin(setup.world.farmLevelController.moonAngle);
            }
        },

        {
            type: 'time',
            delay: 5000,
            step: 10,
            action: (setup) => setup.isNight = true
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                if ([10, 11, 12, 13, 14, 15, 16, 17].includes(setup.world.farmLevelController.questManager.step) && setup.isNight) {
                    if (setup.darknessLevel < setup.maxDarkness) setup.darknessLevel += 0.005;
                } else {
                    if (setup.darknessLevel > 0) setup.darknessLevel -= 0.005;
                }
                setup.world.ctx.fillStyle = `rgba(10,10,40,${setup.darknessLevel})`;
                setup.world.ctx.fillRect(0, 0, setup.world.canvas.width, setup.world.canvas.height);
            }
        },


        {
            type: 'time',
            delay: 1500,
            step: 10,
            action: (setup) => {
                setup.npcs.campfire.updateState('fireGoesOn');
                setup.sounds.happyTogetherMusic.play();
                setup.sounds.farmMusic.loop = false;
                setup.sounds.eveningSound.loop = true;
                setup.sounds.eveningSound.play();
                setup.npcs.cow.updateState('swingToMusic', 1000 / 6.5);
                setup.npcs.chick.updateState('swingToMusic', 1000 / 6.5);
                setup.npcs.chicken2.updateState('swingToMusic', 1000 / 6.5);
                setup.npcs.moon.updateState('swingToMusic');
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 10,
            once: false,
            action: (setup) => {
                setup.lyrics = [
                    { time: 7.2, text: "Bailamos en la plaza," },
                    { time: 9.3, text: "Cantando sin parar," },
                    { time: 11.4, text: "Con mis amigos cerca," },
                    { time: 13.5, text: "Es un día para amar." },

                    { time: 15.7, text: "Juanito, Pollito, Lola, we sing," },
                    { time: 20.2, text: "Happy together, joy that we bring," },
                    { time: 24.1, text: "Juanito, Pollito, Lola, my friends," },
                    { time: 28.2, text: "Our love and our laughter will never end." },
                    { time: 32.1, text: "" },

                    { time: 39.5, text: "Caminamos la calle," },
                    { time: 41, text: "con sonrisas y fe," },
                    { time: 43, text: "cada paso juntos," },
                    { time: 45.5, text: "la vida se ve bien." },

                    { time: 46.8, text: "Juanito, Pollito, Lola my friends," },
                    { time: 52, text: "Singing together, the joy never ends," },
                    { time: 55.5, text: "Juanito, Pollito, Lola we sing," },
                    { time: 60, text: "Friendship forever, the joy that we bring." },
                    { time: 64.5, text: "" },

                    { time: 71.2, text: "Siempre cantando, amigos de verdad," },
                    { time: 75.7, text: "Juanito, Pollito, y Lola están," },
                    { time: 79.7, text: "Juanito, Pollito, Lola my friends," },
                    { time: 84.1, text: "Amigos por siempre, love never ends.", duration: 1 },
                    { time: 89.9, text: "" }
                ];

                switch (true) {
                    case (setup.sounds.happyTogetherMusic.currentTime >= 0 && setup.sounds.happyTogetherMusic.currentTime <= 7.2):
                        setup.world.character.isSitDownAndPlayGuitar = true;
                        break;
                    case (setup.sounds.happyTogetherMusic.currentTime >= 7.2 && setup.sounds.happyTogetherMusic.currentTime <= 32.1):
                        setup.world.character.isSitDownAndPlayGuitar = false;
                        setup.world.character.isPlayGuitarAndSing = true;
                        break;
                    case (setup.sounds.happyTogetherMusic.currentTime >= 32.1 && setup.sounds.happyTogetherMusic.currentTime <= 39.5):
                        setup.world.character.isPlayGuitarAndSing = false;
                        setup.world.character.isPlayGuitar = true;
                        break;
                    case (setup.sounds.happyTogetherMusic.currentTime >= 39.5 && setup.sounds.happyTogetherMusic.currentTime <= 64.5):
                        setup.world.character.isPlayGuitar = false;
                        setup.world.character.isPlayGuitarAndSing = true;
                        break;
                    case (setup.sounds.happyTogetherMusic.currentTime >= 64.5 && setup.sounds.happyTogetherMusic.currentTime <= 71.2):
                        setup.world.character.isPlayGuitarAndSing = false;
                        setup.world.character.isPlayGuitar = true;
                        break;
                    case (setup.sounds.happyTogetherMusic.currentTime >= 71.2 && setup.sounds.happyTogetherMusic.currentTime <= 89.9):
                        setup.world.character.isPlayGuitar = false;
                        setup.world.character.isPlayGuitarAndSing = true;
                        break;
                    case (setup.sounds.happyTogetherMusic.currentTime >= 89.9 && setup.sounds.happyTogetherMusic.currentTime <= 97.0):
                        setup.world.character.isPlayGuitarAndSing = false;
                        setup.world.character.isPlayGuitar = true;
                        break;
                }
                setup.world.farmLevelController.renderLyrics();
            }
        },
        {
            type: 'quest',
            step: 10,
            once: false,
            action: (setup) => {
                if (setup.sounds.happyTogetherMusic.currentTime >= 97.0) {
                    setup.npcs.cow.updateState('sleep', 1000 / 5.5);
                    setup.npcs.chick.updateState('sleep', 1000 / 5.5);
                    setup.npcs.chicken2.updateState('sleep', 1000 / 5.5);
                    setup.npcs.campfire.updateState('fireGoesOut');
                    setup.npcs.moon.updateState('idle');
                    setup.world.character.isPlayGuitar = false;
                    setup.world.character.isStandUp = true;
                    setup.world.farmLevelController.questManager.advance(11);
                }
            }
        },
        {
            type: 'time',
            delay: 4000,
            step: 11,
            action: (setup) => {
                setup.world.character.isWalk = true;
                setup.world.character.isFlipped = false

            }
        },
        {
            type: 'time',
            delay: 4000,
            step: 11,
            once: false,
            action: (setup) => {
                if (setup.world.character.x < 820) setup.world.character.x += 5;
                if (setup.world.character.y >= 370) {
                    setup.world.character.y -= 1.5;
                } else {
                    setup.world.character.yNormal = 370;
                    setup.world.character.yVoidless = 487;
                    setup.world.isKeysStopp = false;
                    setup.world.character.isWalk = false;
                    setup.world.farmLevelController.questManager.advance(12);
                }
            }
        },

        {
            type: 'position',
            objectA: 'character',
            area: { x: 1170, width: 100 },
            step: 12,
            requireKey: 'F',
            action: (setup) => {
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
                setup.world.character.isFlipped = false;
                setup.world.farmLevelController.questManager.advance(13);
            }
        },

        {
            type: 'quest',
            step: 13,
            once: false,
            action: (setup) => {
                const targetX = 900;
                const differenceX = targetX - setup.world.camera_x;
                if (Math.abs(differenceX) >= 3) {
                    setup.world.camera_x += Math.sign(differenceX) * 5;
                } else {
                    setup.world.camera_x = targetX
                    setup.world.farmLevelController.questManager.advance(14)
                }
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 14,
            action: (setup) => {
                setup.sounds.yawningSound.play();
            }
        },
        {
            type: 'time',
            delay: 10000,
            step: 14,
            action: (setup) => {
                setup.sounds.snoringSound.play();
            }
        },

        {
            type: 'time',
            delay: 15000,
            step: 14,
            action: (setup) => {
                setup.sounds.earthquakeSound.play();
                setup.earthquakeStart = true;
            }
        },

        {
            type: 'time',
            delay: 22000,
            step: 14,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(setup.npcs.drohne);
                setup.world.ctx.restore();
                const targetX = setup.npcs.drohne.x - 300;
                const differenceX = targetX - setup.world.camera_x;
                if (Math.abs(differenceX) >= 3) {
                    setup.world.camera_x += Math.sign(differenceX) * 10;
                } else {
                    setup.world.camera_x = targetX;
                    setup.world.farmLevelController.questManager.advance(15)
                }
            }
        },

        {
            type: 'quest',
            step: 15,
            once: false,
            action: (setup) => {
                const targetX = 1500;
                const differenceX = targetX - setup.npcs.drohne.x;
                if (Math.abs(differenceX) >= 3) {
                    setup.npcs.drohne.x += Math.sign(differenceX) * 5;
                    setup.world.camera_x += ((setup.npcs.drohne.x - 300) - setup.world.camera_x) * 0.1;
                } else {
                    setup.npcs.drohne.x = targetX;
                    setup.world.farmLevelController.questManager.advance(16)
                }
            }
        },

        {
            type: 'quest',
            step: 15,
            action: (setup) => {
                setup.sounds.farmMusic.pause();
                setup.sounds.drohneSound.loop = true;
                setup.sounds.drohneSound.play();
                setup.sounds.nightMusic.loop = true;
                setup.sounds.nightMusic.volume = 0.6;
                setup.sounds.nightMusic.play();
            }
        },

        {
            type: 'time',
            delay: 4000,
            step: 16,
            action: (setup) => {
                setup.sounds.drohneSound.pause();
                setup.sounds.drohneHypnoSound.loop = true;
                setup.sounds.drohneHypnoSound.play();
                setup.npcs.drohne.updateState('hypno', 1000 / 7);
                setup.npcs.chicken.updateState('walk', 1000 / 7);
                setup.npcs.cowHypno.updateState('walk', 1000 / 5);
                setup.npcs.chickHypno.updateState('walk', 1000 / 7);
            }
        },

        {
            type: 'time',
            delay: 4000,
            step: 16,
            once: false,
            action: (setup) => {
                if (setup.npcs.chicken.x < 2600) {
                    setup.npcs.chicken.x += 1.5;
                }
                if (setup.npcs.cowHypno.x < 2600) {
                    setup.npcs.cowHypno.x += 1.5;
                } else {
                    setup.world.farmLevelController.questManager.advance(17);
                }
                if (setup.npcs.chickHypno.x < 2600) {
                    setup.npcs.chickHypno.x += 1.5;
                }
            }
        },

        {
            type: 'quest',
            step: 17,
            action: (setup) => {
                setup.sounds.drohneHypnoSound.pause();
                setup.sounds.drohneSound.play();
                setup.npcs.drohne.updateState('idle', 1000 / 7);
            }
        },

        {
            type: 'quest',
            step: 17,
            once: false,
            action: (setup) => {
                if (setup.npcs.drohne.x <= 3500) {
                    setup.npcs.drohne.x += 5;
                } else {
                    setup.world.farmLevelController.questManager.advance(18);
                }
            }
        },

        {
            type: 'quest',
            step: 18,
            once: false,
            action: (setup) => {
                if (setup.volumeLevel2 > setup.minVolumeLevel) {
                    setup.volumeLevel2 = Math.max(setup.volumeLevel2 - 0.002, setup.minVolumeLevel);
                    setup.sounds.drohneSound.volume = setup.volumeLevel2;
                    setup.sounds.nightMusic.volume = setup.volumeLevel2;
                    setup.sounds.eveningSound.volume = setup.volumeLevel2;
                }
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 18,
            action: (setup) => {
                setup.isNight = false;
                setup.sounds.sadMusic.play();
            }
        },
        {
            type: 'time',
            delay: 7000,
            step: 18,
            action: (setup) => {
                setup.sounds.eveningSound.pause();
                setup.sounds.drohneSound.pause();
                setup.sounds.nightMusic.pause();
            }
        },
        {
            type: 'time',
            delay: 7000,
            step: 18,
            once: false,
            action: (setup) => {
                if (setup.world.camera_x > 800) {
                    setup.world.camera_x -= 3;
                } else setup.world.farmLevelController.questManager.advance(19);
            }
        },

        {
            type: 'time',
            from: 4000,
            to: 9000,
            step: 19,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm3.startTime) {
                    setup.speechBubbles.bubbleFarm3.start();
                }
                setup.speechBubbles.bubbleFarm3.update(performance.now());
                setup.speechBubbles.bubbleFarm3.draw(setup.world.ctx);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            from: 9000,
            to: 14000,
            step: 19,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm4.startTime) {
                    setup.speechBubbles.bubbleFarm4.start();
                }
                setup.speechBubbles.bubbleFarm4.update(performance.now());
                setup.speechBubbles.bubbleFarm4.draw(setup.world.ctx);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            from: 14000,
            to: 30000,
            step: 19,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm5.startTime) {
                    setup.speechBubbles.bubbleFarm5.start();
                }
                setup.speechBubbles.bubbleFarm5.update(performance.now());
                setup.speechBubbles.bubbleFarm5.draw(setup.world.ctx, 40);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            delay: 16000,
            step: 19,
            action: (setup) => {
                setup.world.character.isKneelAndCry = true;
            }
        },
        {
            type: 'time',
            delay: 35000,
            step: 19,
            action: (setup) => {
                setup.world.character.isKneelAndCry = false;
                setup.world.character.isStandUpAndLookDetermined = true;
            }
        },

        {
            type: 'time',
            from: 36000,
            to: 41000,
            step: 19,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm6.startTime) {
                    setup.speechBubbles.bubbleFarm6.start();
                }
                setup.speechBubbles.bubbleFarm6.update(performance.now());
                setup.speechBubbles.bubbleFarm6.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            from: 41000,
            to: 46000,
            step: 19,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm7.startTime) {
                    setup.speechBubbles.bubbleFarm7.start();
                }
                setup.speechBubbles.bubbleFarm7.update(performance.now());
                setup.speechBubbles.bubbleFarm7.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            from: 46000,
            to: 51000,
            step: 19,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm8.startTime) {
                    setup.speechBubbles.bubbleFarm8.start();
                }
                setup.speechBubbles.bubbleFarm8.update(performance.now());
                setup.speechBubbles.bubbleFarm8.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            delay: 46000,
            step: 19,
            action: (setup) => {
                setup.world.character.isStandUpAndLookDetermined = false;
                setup.world.character.isLookDeterminedAndStandUp = true;
            }
        },
        {
            type: 'time',
            delay: 54000,
            step: 19,
            action: (setup) => {
                setup.world.character.isLookDeterminedAndStandUp = false;
                setup.world.isKeysStopp = false;
                setup.world.farmLevelController.questManager.advance(20);
            }
        },

        {
            type: 'position',
            area: { x: 3000, width: 200 },
            objectA: 'character',
            step: 20,
            action: (setup) => {
                setup.world.character.isWalkDetermined = true;
                setup.sounds.determinedMusic.play();
                setup.world.farmLevelController.questManager.advance(21);
            }
        },

        {
            type: 'quest',
            step: 21,
            once: false,
            action: (setup) => {
                if (setup.world.character.x < 5100) {
                    setup.world.character.x += 1.0;
                } else {
                    setup.world.farmLevelController.questManager.advance(22);
                }
                const targetX = setup.world.character.x - 300;
                const differenceX = targetX - setup.world.camera_x;
                if (Math.abs(differenceX) >= 3) {
                    setup.world.camera_x += Math.sign(differenceX) * 1.0;
                }
            }
        },

        {
            type: 'quest',
            step: 22,
            action: (setup) => {
                setup.world.character.isWalkDetermined = false;
                setup.world.character.isStandDetermined = true;
                setup.npcs.chickPortrait.fadeIn(setup.world.farmLevelController.timestamp, 10000);
                setup.npcs.chickPortrait.updateState('portrait', 1000 / 5);
                setup.npcs.chickenPortrait.updateState('portrait', 1000 / 5);
                setup.npcs.cowPortrait.updateState('portrait', 1000 / 5);
            }
        },

        // {
        //     type: 'time',
        //     delay: 500,
        //     once: false,
        //     step: 22,
        //     cooldown: 4000,
        //     action: (setup) => {
        //         setup.sounds.windSound.play();
        //     }
        // },

        {
            type: 'time',
            from: 500,
            to: 5500,
            once: false,
            step: 22,
            action: (setup) => {
                // setup.world.ctx.save();
                // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                // setup.world.addToWorld(setup.npcs.chickPortrait);
                // setup.world.ctx.restore();



                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);

                // === 1. Offscreen-Canvas vorbereiten ===
                const portrait = setup.npcs.chickPortrait;
                const fadeOpacity = 0.75;

                const offscreen = document.createElement("canvas");
                offscreen.width = portrait.width;
                offscreen.height = portrait.height;
                const offCtx = offscreen.getContext("2d");

                // === 2. Bild in Offscreen-Canvas zeichnen ===
                setup.world.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);

                // === 3. Radial-Alpha-Maske anwenden ===
                const gradient = offCtx.createRadialGradient(
                    offscreen.width / 2,
                    offscreen.height / 2,
                    0,
                    offscreen.width / 2,
                    offscreen.height / 2,
                    Math.max(offscreen.width, offscreen.height) / 2
                );

                gradient.addColorStop(0.0, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(0.85, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

                offCtx.globalCompositeOperation = "destination-in";
                offCtx.fillStyle = gradient;
                offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
                offCtx.globalCompositeOperation = "source-over";

                // === 4. Haupt-Canvas vorbereiten (mit optionalem Glow) ===
                setup.world.ctx.globalAlpha = fadeOpacity;
                setup.world.ctx.shadowColor = "rgba(0, 200, 255, 0.6)"; // Glow
                setup.world.ctx.shadowBlur = 30;

                // === 5. Offscreen auf Main-Canvas zeichnen ===
                setup.world.ctx.drawImage(offscreen, portrait.x, portrait.y);

                // === 6. Zurücksetzen ===
                setup.world.ctx.shadowBlur = 0;
                setup.world.ctx.globalAlpha = 1.0;
                setup.world.ctx.restore();

                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm9.startTime) {
                    setup.speechBubbles.bubbleFarm9.start();
                }
                setup.speechBubbles.bubbleFarm9.update(performance.now());
                setup.speechBubbles.bubbleFarm9.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            from: 5500,
            to: 10500,
            once: false,
            step: 22,
            action: (setup) => {
                // setup.world.ctx.save();
                // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                // setup.world.addToWorld(setup.npcs.chickenPortrait);
                // setup.world.ctx.restore();

                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);

                // === 1. Offscreen-Canvas vorbereiten ===
                const portrait = setup.npcs.chickenPortrait;
                const fadeOpacity = 0.75;

                const offscreen = document.createElement("canvas");
                offscreen.width = portrait.width;
                offscreen.height = portrait.height;
                const offCtx = offscreen.getContext("2d");

                // === 2. Bild in Offscreen-Canvas zeichnen ===
                setup.world.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);

                // === 3. Radial-Alpha-Maske anwenden ===
                const gradient = offCtx.createRadialGradient(
                    offscreen.width / 2,
                    offscreen.height / 2,
                    0,
                    offscreen.width / 2,
                    offscreen.height / 2,
                    Math.max(offscreen.width, offscreen.height) / 2
                );

                gradient.addColorStop(0.0, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(0.85, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

                offCtx.globalCompositeOperation = "destination-in";
                offCtx.fillStyle = gradient;
                offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
                offCtx.globalCompositeOperation = "source-over";

                // === 4. Haupt-Canvas vorbereiten (mit optionalem Glow) ===
                setup.world.ctx.globalAlpha = fadeOpacity;
                setup.world.ctx.shadowColor = "rgba(0, 200, 255, 0.6)"; // Glow
                setup.world.ctx.shadowBlur = 30;

                // === 5. Offscreen auf Main-Canvas zeichnen ===
                setup.world.ctx.drawImage(offscreen, portrait.x, portrait.y);

                // === 6. Zurücksetzen ===
                setup.world.ctx.shadowBlur = 0;
                setup.world.ctx.globalAlpha = 1.0;
                setup.world.ctx.restore();


                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm10.startTime) {
                    setup.speechBubbles.bubbleFarm10.start();
                }
                setup.speechBubbles.bubbleFarm10.update(performance.now());
                setup.speechBubbles.bubbleFarm10.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            from: 10500,
            to: 15500,
            once: false,
            step: 22,
            action: (setup) => {
                // setup.world.ctx.save();
                // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                // setup.world.addToWorld(setup.npcs.cowPortrait);
                // setup.world.ctx.restore();
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);

                // === 1. Offscreen-Canvas vorbereiten ===
                const portrait = setup.npcs.cowPortrait;
                const fadeOpacity = 0.75;

                const offscreen = document.createElement("canvas");
                offscreen.width = portrait.width;
                offscreen.height = portrait.height;
                const offCtx = offscreen.getContext("2d");

                // === 2. Bild in Offscreen-Canvas zeichnen ===
                setup.world.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);

                // === 3. Radial-Alpha-Maske anwenden ===
                const gradient = offCtx.createRadialGradient(
                    offscreen.width / 2,
                    offscreen.height / 2,
                    0,
                    offscreen.width / 2,
                    offscreen.height / 2,
                    Math.max(offscreen.width, offscreen.height) / 2
                );

                gradient.addColorStop(0.0, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(0.85, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

                offCtx.globalCompositeOperation = "destination-in";
                offCtx.fillStyle = gradient;
                offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
                offCtx.globalCompositeOperation = "source-over";

                // === 4. Haupt-Canvas vorbereiten (mit optionalem Glow) ===
                setup.world.ctx.globalAlpha = fadeOpacity;
                setup.world.ctx.shadowColor = "rgba(0, 200, 255, 0.6)"; // Glow
                setup.world.ctx.shadowBlur = 30;

                // === 5. Offscreen auf Main-Canvas zeichnen ===
                setup.world.ctx.drawImage(offscreen, portrait.x, portrait.y);

                // === 6. Zurücksetzen ===
                setup.world.ctx.shadowBlur = 0;
                setup.world.ctx.globalAlpha = 1.0;
                setup.world.ctx.restore();

                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm11.startTime) {
                    setup.speechBubbles.bubbleFarm11.start();
                }
                setup.speechBubbles.bubbleFarm11.update(performance.now());
                setup.speechBubbles.bubbleFarm11.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();

            }
        },

        {
            type: 'time',
            from: 15500,
            to: 20500,
            once: false,
            step: 22,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                if (!setup.speechBubbles.bubbleFarm8.startTime) {
                    setup.speechBubbles.bubbleFarm8.start();
                }
                setup.speechBubbles.bubbleFarm8.update(performance.now());
                setup.speechBubbles.bubbleFarm8.draw(setup.world.ctx, 0);
                setup.world.ctx.restore();
            }
        },

        {
            type: 'time',
            delay: 21000,
            step: 22,
            action: (setup) => {
                setup.world.character.isWalkDetermined = true;
                setup.world.character.isStandDetermined = false;
            }
        },

        {
            type: 'time',
            delay: 21000,
            once: false,
            step: 22,
            action: (setup) => {
                if (setup.world.character.x < 6500) {
                    setup.world.character.x += 1.0;
                } else {
                    setup.world.currentScene = 'levelComplete';
                }
            }
        }
    ];
