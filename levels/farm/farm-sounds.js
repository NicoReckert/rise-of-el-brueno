export function createFarmSounds(allAudios) {
    const sounds = {
        farmMusic: allAudios.farmMusic,
        nightMusic: allAudios.nightMusic,
        drohneSound: allAudios.drohneSound,
        drohneControlledSound: allAudios.drohneControlledSound,
        eveningSound: allAudios.eveningSound,
        yawningSound: allAudios.yawningSound,
        snoringSound: allAudios.snoringSound,
        earthquakeSound: allAudios.earthquakeSound,
        sadMusic: allAudios.sadMusic,
        newTaskSound: allAudios.newTaskSound,
        taskCompletedSound: allAudios.taskCompletedSound,
        taskCompletedSound2: allAudios.taskCompletedSound.cloneNode(),
        cowSound: allAudios.cowSound,
        cowSound2: allAudios.cowSound2,
        doorOpeningSound: allAudios.doorOpeningSound,
        doorClosingSound: allAudios.doorClosingSound,
        happyTogetherMusic: allAudios.happyTogetherMusic,
        determinedMusic: allAudios.determinedMusic,
        windSound: allAudios.windSound,
        sadSoulMusic: allAudios.sadSoulMusic,
    };

    // 🎚️ Initiale Sound-Konfiguration gehört ins Setup
    sounds.farmMusic.loop = true;
    sounds.farmMusic.volume = 0.6;

    return sounds;
}