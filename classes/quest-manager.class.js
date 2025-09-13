// Quest Manager (vereinfachtes Beispiel)
class CowQuestManager {
  constructor(setup, eventManager) {
    this.setup = setup;
    this.world = setup.world; // falls man es oft braucht
    this.eventManager = eventManager;
    this.step = 1;

    this.registerEvents();
  }

  advance(step) {
    this.step = step;
    console.log("Quest fortschritt:", step);
  }

  registerEvents() {
    // === STEP 1 → Cow glücklich machen ===
    this.eventManager.add({
      type: "position",
      area: { 
        x: this.setup.npcs.cow.x - 50, 
        y: this.setup.npcs.cow.y - 50, 
        width: 200, height: 200 
      },
      action: (setup) => {
        if (this.step === 1) {
          setup.npcs.cow.updateState("happy", 1000 / 5.5);
          setup.sounds.cowSound2.play();
          this.advance(2);

          setup.taskWindow.addTask("3. Bringe Lola zur Wiese", { active: true });
          setup.sounds.newTaskSound.play();
          setup.world.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
        }
      }
    });

    // === STEP 3 → Cow bewegt sich zur Wiese ===
    this.eventManager.add({
      type: "quest",
      step: 3,
      action: (setup) => {
        setup.npcs.cow.updateState("walk");

        const moveCow = () => {
          if (this.step !== 3) return;
          if (setup.npcs.cow.x < 5400) {
            setup.npcs.cow.x += 2;
            requestAnimationFrame(moveCow);
          } else {
            this.advance(4);
            setup.taskWindow.markDone(2);
            setup.sounds.taskCompletedSound.play();
            setup.world.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
          }
        };
        moveCow();
      }
    });
  }
}
