export class FarmRenderer {
    constructor(setup, world) {
        this.setup = setup;
        this.world = world;
        this.ctx = world.ctx;
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;

    }

    render(cameraX, questStep) {
        this.renderBackgrounds(cameraX);
        this.renderNPCsAndCharacter(cameraX, questStep);
        // this.renderAfterDark(renderCameraX, questStep);
    }

    renderBackgrounds(cameraX) {
        this.ctx.save();
        this.ctx.translate(-cameraX * 0.2, 0);
        this.addObject(this.setup.farmLevel.sky);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-cameraX * 0.4, 0);
        this.addObject(this.setup.farmLevel.clouds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-cameraX * 0.5, 0);
        this.addObject(this.setup.farmLevel.grounds.backGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-cameraX * 0.75, 0);
        this.addObject(this.setup.farmLevel.grounds.midGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-cameraX * 1.0, 0);
        this.addObject(this.setup.farmLevel.grounds.foreGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-cameraX * 1.0, 0);
        this.addObject(this.setup.farmLevel.sceneryObjects);
        this.ctx.restore();
    }

    renderNPCsAndCharacter(cameraX, questStep) {
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);
        if (questStep < 10) this.addToWorld(this.setup.characters.bird);
        this.addObject(this.setup.environment.trees);
        this.addObject(this.setup.environment.flowers);
        if (questStep === 10) this.addToWorld(this.setup.environment.sun);
        this.addToWorld(this.setup.environment.house);


        this.ctx.save();
        this.ctx.shadowColor = "rgba(0,0,0,0.4)";
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.addToWorld(this.setup.farmLevel.sceneryObjects[0]);
        this.ctx.restore();
        this.addToWorld(this.setup.environment.stable);
        if (questStep < 8) this.addToWorld(this.setup.environment.campfire);
        this.setup.environment.house.isFlipped = false;
        this.setup.environment.stable.isFlipped = false;
        if (!this.setup.state.isGamecharacterInHouse) {
            if (this.character.isCaress) {
                this.addToWorld(this.character);
                this.addToWorld(this.setup.characters.cow);
            } else {
                if (questStep < 8) this.addToWorld(this.setup.characters.cow);
                if (questStep < 8 || questStep > 18) this.addToWorld(this.character);
            }
        }
        this.addToWorld(this.setup.environment.pond);


        this.ctx.restore();
        if (questStep >= 20) this.windParticleEffect.draw(this.ctx, cameraX);
    }

    renderAfterDark(questStep, cameraX) {
        if (questStep >= 8) {
            this.ctx.save();
            this.ctx.translate(-cameraX, 0);
            if (questStep < 14) this.addToWorld(this.setup.characters.cow);
            if (questStep < 13) this.addToWorld(this.character);
            this.addToWorld(this.setup.environment.campfire);
            if (questStep < 14) this.addToWorld(this.setup.characters.pollito);
            if (questStep < 14) this.addToWorld(this.setup.characters.juanito);
            if (questStep < 14) this.addToWorld(this.setup.environment.moon);
            if (questStep >= 14 && questStep < 18) {
                this.addToWorld(this.setup.characters.drone);
                this.addToWorld(this.setup.cutsceneActors.chickenTranced);
                this.addToWorld(this.setup.cutsceneActors.cowTranced);
                this.addToWorld(this.setup.cutsceneActors.chickTranced);
            }
            this.ctx.restore();
        }
    }


}