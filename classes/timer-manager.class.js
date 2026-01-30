export class TimerManager {
    constructor() {
        this.timers = new Map(); // id → timer
    }

    /**
     * Timer hinzufügen
     * @param {string} id - eindeutige ID
     * @param {number} delay - Zeit in ms
     * @param {function} callback - Funktion, die nach Ablauf ausgeführt wird
     * @param {boolean} repeat - Wiederholen?
     */
    addUnique(id, delay, callback, repeat = false) {
        if (this.timers.has(id)) return; // existierender Timer läuft noch → nichts tun

        const end = performance.now() + delay;
        const timer = { id, end, delay, callback, repeat };
        this.timers.set(id, timer);
    }

    /**
     * Timer abbrechen
     */
    cancel(id) {
        this.timers.delete(id);
    }

    /**
     * Update in jedem Frame aufrufen
     * @param {number} deltaTime - optional, Standard ~16.66ms
     */
    update() {
        const now = performance.now();
        for (const [id, timer] of this.timers.entries()) {
            if (now >= timer.end) {
                timer.callback();

                if (timer.repeat) {
                    timer.end = now + timer.delay;
                } else {
                    this.timers.delete(id); // einmalig → automatisch löschen
                }
            }
        }
    }
}
