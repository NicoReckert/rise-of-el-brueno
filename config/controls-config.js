export const controls = [
    {
        id: 'move-right',
        key: 'RightArrow',
        action: 'nach rechts laufen',
        mobile: 'right'
    },
    {
        id: 'move-left',
        key: 'LeftArrow',
        action: 'nach links laufen',
        mobile: 'left'
    },
    {
        id: 'jump',
        key: 'UpArrow',
        action: 'springen',
        mobile: 'jump'
    },
    {
        id: 'duck',
        key: 'DownArrow',
        action: 'ducken',
        mobile: 'duck'
    },
    {
        id: 'interact',
        key: 'F',
        action: 'benutzen / interagieren',
        mobile: 'use'
    },
    {
        id: 'quest-log',
        key: 'T',
        action: 'Quest-Log / Aufgabenliste öffnen',
        mobile: 'log'
    },
    {
        id: 'throw',
        key: 'D',
        action: 'Flaschen werfen',
        mobile: 'throw'
    },
    {
        id: 'attack',
        key: 'A',
        action: 'attackieren',
        mobile: 'attack'
    },
    {
        id: 'protect',
        key: 'S',
        action: 'schützen / blocken',
        mobile: 'protect'
    },
    {
        id: 'skip',
        key: 'X',
        action: 'Cutscene überspringen',
        mobile: 'skip'
    }
];

/**
 * Gets a control by its identifier.
 * @param {string} id Control identifier.
 * @returns {Object|null} Matching control configuration or null.
 */
export function getControlById(id) {
    return controls.find(control => control.id === id) ?? null;
}