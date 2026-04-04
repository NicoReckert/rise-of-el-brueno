import { EssenceTrailParticle } from '../../../classes/effects/essence-trail-particle.class.js';

/**
 * Controller responsible for handling spirit essence behavior and sequences.
 */
export class TownSpiritEssenceController {
    /**
     * Creates a new TownSpiritEssenceController instance.
     * @param {Object} setup Town level setup reference.
     * @param {Object} character Player character reference.
     */
    constructor(setup, character) {
        this.setup = setup;
        this.character = character;
    }

    /**
     * Starts the spirit essence sequence.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    startSpiritEssenceSequence(timestamp) {
        const hero = this.character;
        const spirits = this.getSpiritSequenceSpirits();
        const essences = this.getSpiritSequenceEssences();
        const start = this.getSpiritSequenceStart(hero);
        this.setup.state.spiritEssenceSeq = this.createSpiritEssenceSequenceState(
            timestamp, essences, spirits, start
        );
        this.resetSpiritEssences(essences, start);
        this.hideSpiritSequenceSpirits(spirits);
    }

    /**
     * Returns the spirits involved in the spirit essence sequence.
     * @returns {Object[]} Spirit entities.
     */
    getSpiritSequenceSpirits() {
        return [
            this.setup.environment.juanitoSpirit,
            this.setup.environment.pollitoSpirit,
            this.setup.environment.lolaSpirit
        ];
    }

    /**
     * Returns the spirit essence objects used in the sequence.
     * @returns {Object[]} Spirit essence entities.
     */
    getSpiritSequenceEssences() {
        return [
            this.setup.environment.spiritEssence1,
            this.setup.environment.spiritEssence2,
            this.setup.environment.spiritEssence3
        ];
    }

    /**
     * Calculates the starting position for the spirit essence sequence.
     * @param {Object} hero Player character reference.
     * @returns {{x:number, y:number}} Start position.
     */
    getSpiritSequenceStart(hero) {
        return {
            x: hero.x + hero.width * 0.45,
            y: hero.y + hero.height * 0.35
        };
    }

    /**
     * Creates the state object for the spirit essence sequence.
     * @param {number} timestamp Frame timestamp.
     * @param {Object[]} essences Spirit essence entities.
     * @param {Object[]} spirits Spirit entities.
     * @param {{x:number, y:number}} start Start position.
     * @returns {Object} Spirit essence sequence state.
     */
    createSpiritEssenceSequenceState(timestamp, essences, spirits, start) {
        return {
            active: true, index: 0, nextTime: timestamp, essences, spirits, start,
            fadeOutDur: 220, fadeOuts: [null, null, null],
            targetOffsets: [{ x: 20, y: -5 }, { x: 15, y: 80 }, { x: -140, y: 35 }],
            arcAmp: 26, arcWobble: 0.0, speed: 2.2, fadeInSpeed: 0.04,
            arrivalDist: 10, delayBetween: 900, reveals: [null, null, null]
        };
    }

    /**
     * Resets spirit essence entities to the starting position and state.
     * @param {Object[]} essences Spirit essence entities.
     * @param {{x:number, y:number}} start Start position.
     * @returns {void}
     */
    resetSpiritEssences(essences, start) {
        essences.forEach((e) => {
            e.x = start.x;
            e.y = start.y;
            e.opacity = 0;
            e.updateAnimationState("idle", 1000 / 10);
        });
    }

    /**
     * Hides the spirits involved in the spirit essence sequence.
     * @param {Object[]} spirits Spirit entities.
     * @returns {void}
     */
    hideSpiritSequenceSpirits(spirits) {
        spirits.forEach((s) => {
            s.opacity = 0;
        });
    }

    /**
     * Updates the spirit essence sequence state.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateSpiritEssenceSequence(timestamp) {
        const seq = this.setup.state.spiritEssenceSeq;
        if (!seq?.active) return;
        if (timestamp >= seq.nextTime) {
            if (this.updateSpiritEssenceStep(seq, timestamp)) return;
        }
        this.updateSpiritReveals(seq, timestamp);
        this.finishSpiritEssenceSequence(seq);
    }

    /**
     * Updates the current step of the spirit essence sequence.
     * @param {Object} seq Spirit essence sequence state.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the step finished or the sequence ended.
     */
    updateSpiritEssenceStep(seq, timestamp) {
        const data = this.getSpiritEssenceStepData(seq);
        if (!data) return (seq.active = false, true);
        const motion = this.moveSpiritEssence(seq, data);
        this.spawnSpiritEssenceTrail(data.e, motion.nx, motion.ny);
        if (motion.dist > seq.arrivalDist) return false;
        this.updateSpiritEssenceArrival(seq, data, timestamp);
        return true;
    }

    /**
     * Returns data for the current spirit essence step.
     * @param {Object} seq Sequence data.
     * @returns {{i: number, e: *, s: *, tx: number, ty: number} | null} Step data or null.
     */
    getSpiritEssenceStepData(seq) {
        const i = seq.index;
        const e = seq.essences[i];
        const s = seq.spirits[i];
        const off = seq.targetOffsets[i];
        if (!e || !s || !off) return null;
        const hero = this.character;
        const spiritX = hero.x + off.x;
        const spiritY = hero.y + off.y;
        return { i, e, s, tx: spiritX + s.width * 0.2, ty: spiritY + s.height * 0.25 };
    }

    /**
     * Moves a spirit essence toward its target position.
     * @param {Object} seq Spirit essence sequence state.
     * @param {{e:Object, tx:number, ty:number}} data Step data containing essence and target.
     * @returns {{dist:number, nx:number, ny:number}} Movement data.
     */
    moveSpiritEssence(seq, { e, tx, ty }) {
        e.opacity = Math.min(1, (e.opacity ?? 0) + seq.fadeInSpeed);
        const dx = tx - e.x;
        const dy = ty - e.y;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;
        const step = Math.min(dist, seq.speed);
        const arc = seq.arcAmp * Math.min(1, dist / 220) * 0.02;
        e.x += nx * step - ny * arc;
        e.y += ny * step + nx * arc;
        return { dist, nx, ny };
    }

    /**
     * Spawns a trail particle behind a moving spirit essence.
     * @param {Object} e Spirit essence entity.
     * @param {number} nx Normalized x-direction.
     * @param {number} ny Normalized y-direction.
     * @returns {void}
     */
    spawnSpiritEssenceTrail(e, nx, ny) {
        const back = 14;
        const pX = e.x + e.width * 0.5 - nx * back;
        const pY = e.y + e.height * 0.5 - ny * back;
        const half = 9;
        this.setup.state.effectsFront.push(new EssenceTrailParticle(e.img, pX - half, pY - half));
    }

    /**
     * Updates spirit essence arrival and reveals the spirit after fade-out.
     * @param {Object} seq Sequence data.
     * @param {{i: number, e: *, s: *}} step Current step data.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateSpiritEssenceArrival(seq, { i, e, s }, timestamp) {
        if (!seq.fadeOuts[i]) {
            seq.fadeOuts[i] = { start: timestamp, dur: seq.fadeOutDur, from: e.opacity ?? 1 };
        }
        const done = this.updateSpiritEssenceFadeOut(seq, i, e, timestamp);
        if (!done) return;
        const hero = this.character;
        const off = seq.targetOffsets[i];
        const spiritX = hero.x + off.x;
        const spiritY = hero.y + off.y;
        this.revealSpiritAfterEssence(seq, i, s, spiritX, spiritY, timestamp);
    }

    /**
     * Updates the fade-out animation of a spirit essence.
     * @param {Object} seq Spirit essence sequence state.
     * @param {number} i Essence index.
     * @param {Object} e Spirit essence entity.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if fade-out finished.
     */
    updateSpiritEssenceFadeOut(seq, i, e, timestamp) {
        const fo = seq.fadeOuts[i];
        const ft = Math.min(1, (timestamp - fo.start) / fo.dur);
        e.opacity = fo.from * (1 - ft);
        if (ft < 1) return false;
        e.opacity = 0;
        seq.fadeOuts[i] = null;
        return true;
    }

    /**
     * Reveals a spirit after its corresponding essence fades out.
     * @param {Object} seq Spirit essence sequence state.
     * @param {number} i Essence index.
     * @param {Object} s Spirit entity.
     * @param {number} tx Target x-position.
     * @param {number} ty Target y-position.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    revealSpiritAfterEssence(seq, i, s, tx, ty, timestamp) {
        s.x = tx;
        s.y = ty;
        s.opacity = 0;
        s.updateAnimationState("spiritCuddle", 1000 / 4);
        seq.reveals[i] = { start: timestamp, dur: 700 };
        seq.index++;
        seq.nextTime = timestamp + seq.delayBetween;
    }

    /**
     * Updates the reveal fade-in for spirits.
     * @param {Object} seq Spirit essence sequence state.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateSpiritReveals(seq, timestamp) {
        seq.reveals.forEach((r, idx) => {
            if (!r) return;
            const spirit = seq.spirits[idx];
            const tt = Math.min(1, (timestamp - r.start) / r.dur);
            spirit.opacity = tt;
            if (tt >= 1) seq.reveals[idx] = null;
        });
    }

    /**
     * Finishes the spirit essence sequence when all steps are complete.
     * @param {Object} seq Spirit essence sequence state.
     * @returns {void}
     */
    finishSpiritEssenceSequence(seq) {
        if (seq.index < seq.essences.length) return;
        if (!seq.reveals.every(r => !r)) return;
        seq.active = false;
    }
}