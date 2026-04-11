import { SpeechBubble } from "../../classes/ui/speech-bubble.class.js";

/**
 * Creates farm speech bubbles.
 * @param {*} character Character instance.
 * @param {*} audioManager Audio manager instance.
 * @returns {Array<SpeechBubble>}
 */
export function createFarmSpeechBubbles(character, audioManager) {
    return [
        new SpeechBubble("Juanito! Pollito!", character, 'speech', { audioManager }),
        new SpeechBubble("Kommt schon, es ist Zeit für unser Lagerfeuer.", character, 'speech', { audioManager }),
        new SpeechBubble("Was ist hier passiert?!", character, 'speech', { audioManager }),
        new SpeechBubble("Freunde, wo seid ihr?!", character, 'speech', { audioManager }),
        new SpeechBubble("Neeeeiiiinnnnn!", character, 'speech', { audioManager }),
        new SpeechBubble("Ich werde euch finden!", character, 'speech', { audioManager }),
        new SpeechBubble("Und wenn ich die ganze Welt nach euch absuchen muss!", character, 'speech', { audioManager }),
        new SpeechBubble("Haltet durch!", character, 'speech', { audioManager }),
        new SpeechBubble("Pollito?!", character, 'speech', { audioManager }),
        new SpeechBubble("Juanito?!", character, 'speech', { audioManager }),
        new SpeechBubble("Lola?!", character, 'speech', { audioManager })
    ];
}