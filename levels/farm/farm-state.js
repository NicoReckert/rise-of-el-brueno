export function createFarmState() {
    return {
        // House / Door
        isGameCharacterInHouse: false,
        doorState: 'closed',
        timeOnStable: null,

        // Night / Atmosphere
        isNight: false,
        darknessLevel: 0,
        maxDarkness: 0.9,

        // Audio / Volume
        volumeLevel: 0.6,
        volumeLevel2: 0.8,
        minVolumeLevel: 0,

        //Earthquake
        earthquakeStart: false,
        shakeIntensity: 20,

        // Progress / Flow
        comeFromStable: false,

        popupTexts: []
    };
}
