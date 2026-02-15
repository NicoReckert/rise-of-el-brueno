import { AnimatedEntity } from "../../classes/entities/animated-entity.class.js";

export function createFarmCharacters(entityImages) {
    const characters = {
        juanito: new AnimatedEntity(entityImages, 'juanito', 150, 150, 1600, 540),
        pollito: new AnimatedEntity(entityImages, 'pollito', 120, 120, 1680, 587),
        cow: new AnimatedEntity(entityImages, 'cow', 200, 200, 500, 495),
        bird: new AnimatedEntity(entityImages, 'bird', 80, 80, 1400, 178),
        drone: new AnimatedEntity(entityImages, 'drone', 300, 300, 5000, 190),
        portraits: {
            juanito: new AnimatedEntity(entityImages, 'juanito', 400, 400, 5200, 100),
            pollito: new AnimatedEntity(entityImages, 'pollito', 400, 400, 5200, 100),
            cow: new AnimatedEntity(entityImages, 'cow', 400, 400, 5200, 100),
        }
    };

    // 🔧 Initiale Animationsstates (gehören hierher!)
    characters.bird.updateAnimationState('idle', 1000 / 7);
    characters.drone.updateAnimationState('idle', 1000 / 7);

    return characters;
}