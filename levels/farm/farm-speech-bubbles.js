import { SpeechBubble } from "../../classes/ui/speech-bubble.class.js";

export function createFarmSpeechBubbles(character, allAudios) {
    return {
        bubbleFarm1: new SpeechBubble("Juanito, Pollito", character, 'speech', allAudios),
        bubbleFarm2: new SpeechBubble("Kommt wir machen unser Lagerfeuer", character, 'speech', allAudios),
        bubbleFarm3: new SpeechBubble("Was ist hier passiert ???", character, 'speech', allAudios),
        bubbleFarm4: new SpeechBubble("Freunde wo seit ihr ???", character, 'speech', allAudios),
        bubbleFarm5: new SpeechBubble("Neeeeiiiinnnnn.", character, 'speech', allAudios),
        bubbleFarm6: new SpeechBubble("Ich werde euch finden !!!", character, 'speech', allAudios),
        bubbleFarm7: new SpeechBubble("Und wenn ich die ganze Welt nach euch absuchen muss !!!", character, 'speech', allAudios),
        bubbleFarm8: new SpeechBubble("Haltet durch !!!", character, 'speech', allAudios),
        bubbleFarm9: new SpeechBubble("Pollito", character, 'speech', allAudios),
        bubbleFarm10: new SpeechBubble("Juanito", character, 'speech', allAudios),
        bubbleFarm11: new SpeechBubble("Lola", character, 'speech', allAudios),
    };
}
