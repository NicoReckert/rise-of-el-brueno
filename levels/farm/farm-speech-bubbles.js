import { SpeechBubble } from "../../classes/ui/speech-bubble.class.js";

/**
 * Creates the farm speech bubble instances.
 * @param {Object} character Character instance.
 * @param {Object} allAudios Audio sources.
 * @returns {Array<Object>} Speech bubble list.
 */
export function createFarmSpeechBubbles(character, allAudios) {
    return [
        new SpeechBubble("Juanito, Pollito", character, 'speech', allAudios),
        new SpeechBubble("Kommt wir machen unser Lagerfeuer", character, 'speech', allAudios),
        new SpeechBubble("Was ist hier passiert ???", character, 'speech', allAudios),
        new SpeechBubble("Freunde wo seit ihr ???", character, 'speech', allAudios),
        new SpeechBubble("Neeeeiiiinnnnn.", character, 'speech', allAudios),
        new SpeechBubble("Ich werde euch finden !!!", character, 'speech', allAudios),
        new SpeechBubble("Und wenn ich die ganze Welt nach euch absuchen muss !!!", character, 'speech', allAudios),
        new SpeechBubble("Haltet durch !!!", character, 'speech', allAudios),
        new SpeechBubble("Pollito", character, 'speech', allAudios),
        new SpeechBubble("Juanito", character, 'speech', allAudios),
        new SpeechBubble("Lola", character, 'speech', allAudios),
    ];
}