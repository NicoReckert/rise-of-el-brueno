import { SpeechBubble } from '../../classes/ui/speech-bubble.class.js';

/**
 * Creates speech bubbles for the main character in the town level.
 * @param {Object} character Character reference used as bubble anchor.
 * @param {Object} audioManager Audio manager used for speech playback.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesCharacter(character, audioManager) {
    return [
        ...townSpeechBubblesCharacterPart01(character, audioManager),
        ...townSpeechBubblesCharacterPart02(character, audioManager),
        ...townSpeechBubblesCharacterPart03(character, audioManager)
    ];
}

/**
 * Creates the first part of town speech bubbles for the character.
 * @param {*} character Character instance.
 * @param {*} audioManager Audio manager instance.
 * @returns {Array} Speech bubble instances.
 */
export function townSpeechBubblesCharacterPart01(character, audioManager) {
    return [
        new SpeechBubble("Ein Bauernhof… völlig verwüstet.", character, 'speech', { audioManager }),
        new SpeechBubble("Hier hat jemand gewütet…", character, 'speech', { audioManager }),
        new SpeechBubble("Kratzspuren… Federn… und Blut.", character, 'speech', { audioManager }),
        new SpeechBubble("Ich darf keine Zeit verlieren.", character, 'speech', { audioManager }),
        new SpeechBubble("Ein Sandsturm...", character, 'speech', { audioManager }),
        new SpeechBubble("Der Sandsturm wird sehr viel stärker...", character, 'speech', { audioManager }),
        new SpeechBubble("Dieser Sturm… ich kann kaum noch stehen…", character, 'speech', { audioManager }),
        new SpeechBubble("Nein… ich darf jetzt nicht aufgeben…", character, 'speech', { audioManager }),
        new SpeechBubble("Meine Kraft… verlässt mich…", character, 'speech', { audioManager }),
    ];
}

/**
 * Creates the second part of town speech bubbles for the character.
 * @param {*} character Character instance.
 * @param {*} audioManager Audio manager instance.
 * @returns {Array} Speech bubble instances.
 */
export function townSpeechBubblesCharacterPart02(character, audioManager) {
    return [
        new SpeechBubble("Tadeo… du hast mich gerettet…", character, 'speech', { audioManager }),
        new SpeechBubble("Ich dachte schon, es wäre vorbei…", character, 'speech', { audioManager }),
        new SpeechBubble("Ich bin nicht wegen des Schwertes hier.", character, 'speech', { audioManager }),
        new SpeechBubble("Ich bin hier, um meine Freunde zurückzuholen.", character, 'speech', { audioManager })
    ];
}

/**
 * Creates character dialog part 03 speech bubbles.
 * @param {*} character Character instance.
 * @param {*} audioManager Audio manager instance.
 * @returns {Array<SpeechBubble>}
 */
export function townSpeechBubblesCharacterPart03(character, audioManager) {
    return [
        new SpeechBubble("Es tut mir so leid …", character, 'speech', { audioManager }),
        new SpeechBubble("Ich hätte euch beschützen müssen, aber ich habe versagt.", character, 'speech', { audioManager }),
        new SpeechBubble("Nicht ein Tag vergeht, ohne dass ich an euch denke und daran zerbreche.", character, 'speech', { audioManager }),
        new SpeechBubble("Wenn ich stärker gewesen wäre, wärt ihr jetzt noch bei mir.", character, 'speech', { audioManager }),
        new SpeechBubble("Bitte … sagt mir, dass ihr mich noch nicht ganz verlassen habt.", character, 'speech', { audioManager }),
        new SpeechBubble("Ahnen! Freunde! Gebt mir eure Kraft!", character, 'speech', { audioManager }),
        new SpeechBubble("Lebewesen dieser Welt… leiht mir eure Hoffnung!", character, 'speech', { audioManager }),
        new SpeechBubble("Aus euren Tugenden wird mein Licht!", character, 'speech', { audioManager })
    ];
}

/**
 * Creates speech bubbles for Nayeli in the town level.
 * @param {Object} nayeliSpirit Nayeli spirit entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesNayeliSpirit(nayeliSpirit) {
    return [
        new SpeechBubble("Brünö...", nayeliSpirit, 'speech'),
        new SpeechBubble("Du kannst jetzt nicht aufgeben.", nayeliSpirit, 'speech'),
        new SpeechBubble("Glaub an dich!", nayeliSpirit, 'speech'),
        new SpeechBubble("Du bist nicht allein!", nayeliSpirit, 'speech'),
        new SpeechBubble("Die Ahnen wachen über dich.", nayeliSpirit, 'speech')
    ];
}

/**
 * Creates town speech bubbles for Nayeli spirit echo.
 * @param {*} nayeliSpiritEcho Nayeli spirit echo instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesNayeliSpiritEcho(nayeliSpiritEcho) {
    return [
        new SpeechBubble("Brünö...", nayeliSpiritEcho, 'speech'),
        new SpeechBubble("Du kannst jetzt nicht aufgeben.", nayeliSpiritEcho, 'speech'),
        new SpeechBubble("Glaub an dich!", nayeliSpiritEcho, 'speech'),
        new SpeechBubble("Weisheit!", nayeliSpiritEcho, 'speech', { yOffset: 20 })
    ];
}

/**
 * Creates town speech bubbles for Sollita.
 * @param {*} sollita Sollita instance.
 * @returns {Array} Speech bubble configurations.
 */
export function createTownSpeechBubblesSollita(sollita) {
    return [
        ...townSpeechBubblesSollitaPart01(sollita),
        ...townSpeechBubblesSollitaPart02(sollita),
        ...townSpeechBubblesSollitaPart03(sollita)
    ];
}

/**
 * Creates Sollita dialog part 01 speech bubbles.
 * @param {*} sollita Sollita instance.
 * @returns {Array<SpeechBubble>}
 */
export function townSpeechBubblesSollitaPart01(sollita) {
    return [
        new SpeechBubble("Von dir habe ich schon gehört.", sollita, 'speech'),
        new SpeechBubble("Du bist also wirklich hier, Brünö.", sollita, 'speech'),
        new SpeechBubble("Und du trägst tatsächlich das Schwert der Ahnen.", sollita, 'speech'),
        new SpeechBubble("Gut. Dann ist noch nicht alles verloren.", sollita, 'speech'),
        new SpeechBubble("Dann verschwenden wir keine Zeit.", sollita, 'speech'),
        new SpeechBubble("Wenn du bereit bist, triff mich hinter der Stadt.", sollita, 'speech'),
        new SpeechBubble("Dort beenden wir das.", sollita, 'speech')
    ];
}

/**
 * Creates Sollita dialog part 02 speech bubbles.
 * @param {*} sollita Sollita instance.
 * @returns {Array<SpeechBubble>}
 */
export function townSpeechBubblesSollitaPart02(sollita) {
    return [
        new SpeechBubble("Dies war erst der Anfang, Brünö.", sollita, 'speech'),
        new SpeechBubble("Du bist aufgebrochen, um deine Freunde zu finden...", sollita, 'speech'),
        new SpeechBubble("...und sie sind bestimmt noch nicht verloren.", sollita, 'speech'),
        new SpeechBubble("Vielleicht wirst du sie eines Tages wiedersehen", sollita, 'speech'),
        new SpeechBubble("Doch jenseits des Horizonts wartet weit mehr auf dich, als du je ahnen konntest", sollita, 'speech'),
        new SpeechBubble("Neue Wege werden sich öffnen,", sollita, 'speech')
    ];
}

/**
 * Creates Sollita dialog part 03 speech bubbles.
 * @param {*} sollita Sollita instance.
 * @returns {Array<SpeechBubble>}
 */
export function townSpeechBubblesSollitaPart03(sollita) {
    return [
        new SpeechBubble("verborgene Portale werden dich in ferne Teile dieser Welt führen...", sollita, 'speech'),
        new SpeechBubble("...und dunkle Mächte werden sich erheben", sollita, 'speech'),
        new SpeechBubble("Denn es ist nicht nur dein Schicksal, gegen das Böse zu kämpfen,", sollita, 'speech'),
        new SpeechBubble("sondern auch die verlorenen Seelen jener Wesen zu befreien,", sollita, 'speech'),
        new SpeechBubble("die durch Wahnsinn und dunkle Mächte verdorben wurden.", sollita, 'speech'),
        new SpeechBubble("Aus der Suche eines einfachen Bauern könnte die Rettung einer ganzen Welt werden.", sollita, 'speech')
    ];
}

/**
 * Creates town speech bubbles for Sollita spirit.
 * @param {*} sollitaSpirit Sollita spirit instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesSollitaSpiritEcho(sollitaSpiritEcho) {
    return [
        new SpeechBubble("Brünö…", sollitaSpiritEcho, 'speech'),
        new SpeechBubble("du darfst jetzt nicht aufgeben…", sollitaSpiritEcho, 'speech'),
        new SpeechBubble("steh auf…", sollitaSpiritEcho, 'speech'),
        new SpeechBubble("und kämpf…", sollitaSpiritEcho, 'speech'),
        new SpeechBubble("ich glaube an dich.", sollitaSpiritEcho, 'speech'),
        new SpeechBubble("Stärke!", sollitaSpiritEcho, 'speech', { yOffset: 20 })
    ];
}

/**
 * Creates speech bubbles for Tadeo in the town level.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeo(tadeo) {
    return [
        new SpeechBubble("Brünö...!", tadeo, 'speech'),
        new SpeechBubble("Halte durch!", tadeo, 'speech'),
        new SpeechBubble("Tonatiuh...", tadeo, 'speech'),
        new SpeechBubble("Schütze uns!", tadeo, 'speech'),
        new SpeechBubble("Gib uns deinen Schild!", tadeo, 'speech'),
        new SpeechBubble("Geschafft… der Schild hält!", tadeo, 'speech'),
        new SpeechBubble("Jetzt kann dir der Sturm nichts mehr tun.", tadeo, 'speech'),
        new SpeechBubble("Komm, Brünö...", tadeo, 'speech'),
        new SpeechBubble("Ich bringe dich zu Nayeli.", tadeo, 'speech'),
        new SpeechBubble("Dort sind wir sicher.", tadeo, 'speech'),
        new SpeechBubble("Übrigens... ich bin Tadeo.", tadeo, 'speech'),
        new SpeechBubble("Da sind wir, Brünö.", tadeo, 'speech'),
        new SpeechBubble("Geh hinein...", tadeo, 'speech'),
        new SpeechBubble("Nayeli wartet auf dich.", tadeo, 'speech'),
        new SpeechBubble("Der Sandsturm ist vorbei!", tadeo, 'speech'),
        new SpeechBubble("Komm, wir können jetzt in die Stadt!", tadeo, 'speech'),
        new SpeechBubble("Okay, mein Freund.", tadeo, 'speech'),
        new SpeechBubble("Ich gehe zurück zu Nayeli.", tadeo, 'speech'),
        new SpeechBubble("Wenn du mich brauchst, komme ich sofort.", tadeo, 'speech'),
        new SpeechBubble("Du solltest jetzt mit Sollita sprechen.", tadeo, 'speech')
    ];
}

/**
 * Creates speech bubbles for Tadeo when he is afraid.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoAfraid(tadeo) {
    return [
        new SpeechBubble("Oh oh… bitte nicht…", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Ähm… bleib bitte weg…", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Nein… nein… ganz ruhig…", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Das ist zu nah… viel zu nah…", tadeo, 'speech', { yOffset: 10 })
    ];
}

/**
 * Creates speech bubbles for Tadeo when he panics.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoPanic(tadeo) {
    return [
        new SpeechBubble("AAAH! Hilfe!", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Weg! Weg! Weg!", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Nein!! Bitte!!", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("HILFE!!", tadeo, 'speech', { yOffset: 10 })
    ];
}

/**
 * Creates speech bubbles for Tadeo when he offers help.
 * @param {Object} tadeo Tadeo character entity used as bubble anchor.
 * @returns {Object[]} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoHelp(tadeo) {
    return [
        new SpeechBubble("Hier, nimm zwei! Schnell!", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Ich hab noch welche… nimm die!", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Nicht ohne Flaschen! Bitte!", tadeo, 'speech', { yOffset: 10 })
    ];
}

/**
 * Creates Tadeo encouragement speech bubbles.
 * @param {*} tadeo Tadeo instance.
 * @returns {Array<SpeechBubble>}
 */
export function createTownSpeechBubblesTadeoEncourage(tadeo) {
    return [
        new SpeechBubble("Komm, Brünö! Wir sind gleich da!", tadeo, 'speech', { yOffset: 10 }),
        new SpeechBubble("Nur noch ein kleines Stück, Brünö!", tadeo, 'speech', { yOffset: 10 })
    ];
}

/**
 * Creates town speech bubbles for Tadeo spirit echo.
 * @param {*} tadeoSpiritEcho Tadeo spirit echo instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesTadeoSpiritEcho(tadeoSpiritEcho) {
    return [
        new SpeechBubble("Brünö!", tadeoSpiritEcho, 'speech'),
        new SpeechBubble("die Angst ist ein Teil von dir…", tadeoSpiritEcho, 'speech'),
        new SpeechBubble("aber…", tadeoSpiritEcho, 'speech'),
        new SpeechBubble("sie ist nicht stärker als du…", tadeoSpiritEcho, 'speech'),
        new SpeechBubble("Kämpf!", tadeoSpiritEcho, 'speech'),
        new SpeechBubble("Willenskraft", tadeoSpiritEcho, 'speech', { yOffset: 10 })
    ];
}

/**
 * Creates town speech bubbles for Juanito.
 * @param {*} juanito Juanito instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesJuanito(juanitoSpirit) {
    return [
        new SpeechBubble("Mut!", juanitoSpirit, 'speech', { yOffset: -35 })
    ];

}

/**
 * Creates town speech bubbles for Pollito.
 * @param {*} pollito Pollito instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesPollito(pollitoSpirit) {
    return [
        new SpeechBubble("Hoffnung!", pollitoSpirit, 'speech', { yOffset: -10 })
    ];
}

/**
 * Creates town speech bubbles for Lola.
 * @param {*} lola Lola instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesLola(lolaSpirit) {
    return [
        new SpeechBubble("Liebe!", lolaSpirit, 'speech', { yOffset: -35 })
    ];
}

/**
 * Creates town speech bubbles for a soul.
 * @param {*} soul Soul instance.
 * @returns {Array} Speech bubble instances.
 */
export function createTownSpeechBubblesSoul(soul) {
    return [
        new SpeechBubble("Ich Grüße dich aus dem Licht Brünö.", soul, 'speech'),
        new SpeechBubble("Danke das du mich aus den Fängen des Bösen befreit hast.", soul, 'speech'),
        new SpeechBubble("Viele andere leiden noch wie ich.", soul, 'speech'),
        new SpeechBubble("Ich hoffe du kannst auch ihnen helfen.", soul, 'speech'),
        new SpeechBubble("Indem du meditierst, kannst du mir Ruhe schenken.", soul, 'speech')
    ];
}