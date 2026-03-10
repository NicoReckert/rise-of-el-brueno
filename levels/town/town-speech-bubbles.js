import { SpeechBubble } from '../../classes/ui/speech-bubble.class.js';

/**
 * Creates speech bubbles for the main character in the town level.
 * @param {Object} character Character reference used as bubble anchor.
 * @param {Object} audioManager Audio manager used for speech playback.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesCharacter(character, audioManager) {
    return [
        new SpeechBubble("Ein Bauernhof… völlig verwüstet.", character, 'speech', { audioManager }),
        new SpeechBubble("Hier hat jemand gewütet…", character, 'speech', { audioManager }),
        new SpeechBubble("Kratzspuren… Federn… und Blut.", character, 'speech', { audioManager }),
        new SpeechBubble("Ich darf keine Zeit verlieren.", character, 'speech', { audioManager })
    ]
}

/**
 * Creates speech bubbles for Nayeli in the town level.
 * @param {Object} nayeliSpirit Nayeli spirit entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesNayeli(nayeliSpirit) {
    return [
        new SpeechBubble("Brünö...", nayeliSpirit, 'speech'),
        new SpeechBubble("Du kannst jetzt nicht aufgeben.", nayeliSpirit, 'speech'),
        new SpeechBubble("Glaub an dich!", nayeliSpirit, 'speech'),
        new SpeechBubble("Du bist nicht allein!", nayeliSpirit, 'speech'),
        new SpeechBubble("Die Ahnen wachen über dich.", nayeliSpirit, 'speech')
    ]
}

/**
 * Creates speech bubbles for Tadeo in the town level.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeo(tadeo) {
    return [
        new SpeechBubble("Tonatiuh...", tadeo, 'speech'),
        new SpeechBubble("Schütze uns!", tadeo, 'speech'),
        new SpeechBubble("Gib uns deinen Schild!", tadeo, 'speech')
    ]
}

/**
 * Creates speech bubbles for Tadeo when he is afraid.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoAfraid(tadeo) {
    return [
        new SpeechBubble("Oh oh… bitte nicht…", tadeo, 'speech'),
        new SpeechBubble("Ähm… bleib bitte weg…", tadeo, 'speech'),
        new SpeechBubble("Nein… nein… ganz ruhig…", tadeo, 'speech'),
        new SpeechBubble("Das ist zu nah… viel zu nah…", tadeo, 'speech')
    ]
}

/**
 * Creates speech bubbles for Tadeo when he panics.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoPanic(tadeo) {
    return [
        new SpeechBubble("AAAH! Hilfe!", tadeo, 'speech'),
        new SpeechBubble("Weg! Weg! Weg!", tadeo, 'speech'),
        new SpeechBubble("Nein!! Bitte!!", tadeo, 'speech'),
        new SpeechBubble("HILFE!!", tadeo, 'speech')
    ]
}

/**
 * Creates speech bubbles for Tadeo when he offers help.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoHelp(tadeo) {
    return [
        new SpeechBubble("Hier, nimm zwei! Schnell!", tadeo, 'speech'),
        new SpeechBubble("Ich hab noch welche… nimm die!", tadeo, 'speech'),
        new SpeechBubble("Nicht ohne Flaschen! Bitte!", tadeo, 'speech')
    ]
}