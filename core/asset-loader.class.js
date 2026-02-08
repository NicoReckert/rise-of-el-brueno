import { initScriptVisuals } from "../script.js";
import { preloadManifestAudio } from "../audio-loader.js";
import { introAudioManifest } from "../audio-manifest.js";
import { initScriptAudioIntro } from "../script.js";
import { characterManifestImmediate } from "../character-image-manifest.js";
import { farmEntityManifestImmediate } from "../entity-image-manifest.js";
import { farmAudioManifestImmediate } from "../audio-manifest.js";
import { preloadManifestImages } from "../image-loader.js";
import { initScriptAudio } from "../script.js";
import { characterManifestDeferred } from "../character-image-manifest.js";
import { farmEntityManifestDeferred } from "../entity-image-manifest.js";
import { otherLevelCharacterManifestLazy } from "../character-image-manifest.js";
import { otherLevelEntityManifestLazy } from "../entity-image-manifest.js";
import { otherLevelAudioManifestLazy } from "../audio-manifest.js";
import { farmAudioManifestDeferred } from "../audio-manifest.js";
import { preloadManifestVideos } from "../video-loader.js";
import { farmVideoManifestDeferred } from "../video-manifest.js";
import { smartMerge } from "../utils/asset-merge.util.js";

/**
 * Handles loading and management of game assets.
 */
export class AssetLoader {
    // FIXME: JSDoc stimmt nicht mehr
    /**
    * Creates a new instance and initializes asset state.
    */
    constructor() {
        this.characterImages = {};
        this.entityImages = {};
        this.progressValue = 0;
        this.introAudios = {};
        this.immediateAudios = {};
        this.deferredAudios = {};
        this.lazyAudios = {};
    }

    /**
    * Initializes the setup sequence.
    * @returns {Promise<void>}
    */
    async init() {
        this.cacheDom();
        await this.prepareIntroPhase();
        await this.loadImmediateAssets();
    }

    /**
    * Caches required DOM elements.
    */
    cacheDom() {
        this.bar = document.getElementById('loading-bar');
        this.text = document.getElementById('loading-text');
    }

    /**
    * Prepares the intro phase.
    * @returns {Promise<void>}
    */
    async prepareIntroPhase() {
        await this.runFakeIntroProgress();
        await this.preloadIntroAssets();
    }

    /**
    * Runs a simulated intro loading progress.
    * @returns {Promise<void>}
    */
    async runFakeIntroProgress() {
        await this.smoothFillProgress(0, 5, {
            duration: 400,
            showPercent: false,
            label: "Preparing experience…"
        });
    }

    // FIXME: JSDoc stimmt nicht mehr
    /**
    * Preloads intro assets.
    * @returns {Promise<void>}
    */
    async preloadIntroAssets() {
        await initScriptVisuals();
        const introAudios = await preloadManifestAudio(introAudioManifest);
        this.introAudios = introAudios;
        //TODO
        initScriptAudioIntro(introAudios);
    }

    /**
    * Loads and applies immediately required assets.
    * @returns {Promise<void>}
    */
    async loadImmediateAssets() {
        const manifests = this.buildImmediateManifests();
        const totalFiles = this.countManifestFiles(manifests);
        const tracker = this.createProgressTracker(totalFiles, 5, 65);
        tracker.updateProgress("Loading assets…");
        const results = await this.loadImmediateFiles(tracker.onFileLoaded);
        this.applyImmediateResults(results);
        await this.finishImmediateProgress();
    }

    /**
    * Builds the list of immediate asset manifests.
    * @returns {Array<Object>}
    */
    buildImmediateManifests() {
        return [
            characterManifestImmediate,
            farmEntityManifestImmediate,
            farmAudioManifestImmediate
        ];
    }

    /**
    * Counts the total number of files in asset manifests.
    * @param {Array<Object>} manifests Asset manifests.
    * @returns {number}
    */
    countManifestFiles(manifests) {
        return manifests.reduce((count, manifest) => {
            for (const value of Object.values(manifest)) {
                if (Array.isArray(value)) count += value.length;
                else if (typeof value === "object" && value) count += this.countManifestFiles([value]);
                else count++;
            }
            return count;
        }, 0);
    }

    /**
    * Creates a progress tracker for asset loading.
    * @param {number} totalFiles Total number of files to load.
    * @param {number} [base=0] Base progress percentage.
    * @param {number} [range=100] Progress range.
    * @returns {{updateProgress: Function, onFileLoaded: Function}}
    */
    createProgressTracker(totalFiles, base = 0, range = 100) {
        let loaded = 0;
        const updateProgress = (label = "Loading assets…") => {
            const percent = base + Math.round((loaded / totalFiles) * range);
            this.setProgress(percent);
            this.text.textContent = `${label} ${percent}%`;
        }
        const onFileLoaded = () => {
            loaded++;
            updateProgress();
        };
        return { updateProgress, onFileLoaded };
    }

    /**
    * Loads immediate asset files.
    * @param {Function} onFileLoaded Callback invoked after each loaded file.
    * @returns {Promise<Array<PromiseSettledResult>>}
    */
    async loadImmediateFiles(onFileLoaded) {
        return Promise.allSettled([
            preloadManifestImages(characterManifestImmediate, onFileLoaded),
            preloadManifestImages(farmEntityManifestImmediate, onFileLoaded),
            preloadManifestAudio(farmAudioManifestImmediate, onFileLoaded)
        ]);
    }

    // FIXME: JSDoc stimmt nicht mehr
    /**
     * Applies results of immediate asset loading.
    * @param {Array<PromiseSettledResult>} results Settled load results.
    */
    applyImmediateResults([charsRes, entitiesRes, farmAudioRes]) {
        const chars = this.getSettledValue(charsRes, {});
        const entities = this.getSettledValue(entitiesRes, {});
        const farmAudios = this.getSettledValue(farmAudioRes, {});
        if (farmAudioRes.status === 'rejected') {
            console.warn(
                '[AssetLoader] farmAudioManifestImmediate failed:',
                farmAudioRes.reason
            );
        }
        this.immediateAudios = farmAudios;
        //TODO
        initScriptAudio(farmAudios);
        Object.assign(this.characterImages, chars);
        smartMerge(this.entityImages, entities);
    }

    /**
    * Extracts the fulfilled value from a settled promise result.
    * @param {PromiseSettledResult} res Settled promise result.
    * @param {*} [fallback={}] Fallback value.
    * @returns {*}
    */
    getSettledValue(res, fallback = {}) {
        return res && res.status === "fulfilled" && res.value != null
            ? res.value
            : fallback;
    }

    /**
    * Finalizes the loading progress.
    * @returns {Promise<void>}
    */
    async finishImmediateProgress() {
        await this.smoothFillProgress(this.progressValue || 70, 100, {
            duration: 600,
            label: "Finalizing…"
        });
    }

    /**
    * Smoothly fills the progress bar over time.
    * @param {number} from Start value.
    * @param {number} to End value.
    * @param {Object} [options] Animation options.
    * @returns {Promise<void>}
    */
    smoothFillProgress(from, to, options = {}) {
        const settings = this.createProgressSettings(from, to, options);
        return new Promise((resolve) => {
            const step = (now) =>
                this.handleProgressStep(now, settings, step, resolve);
            requestAnimationFrame(step);
        });
    }

    /**
    * Creates normalized settings for progress animation.
    * @param {number} from Start value.
    * @param {number} to End value.
    * @param {Object} [options] Animation options.
    * @returns {Object}
    */
    createProgressSettings(from, to,
        {
            duration = 600,
            showPercent = true,
            label = "Loading..."
        } = {}
    ) {
        return {
            from, to, duration, showPercent, label, start: performance.now()
        };
    }

    /**
    * Handles a single progress animation step.
    * @param {number} now Current timestamp.
    * @param {Object} settings Progress settings.
    * @param {Function} step Animation frame callback.
    * @param {Function} resolve Promise resolve function.
    */
    handleProgressStep(now, settings, step, resolve) {
        const { from, to, duration, showPercent, label, start } = settings;
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(from + (to - from) * progress);
        this.setProgress(value);
        this.text.textContent = showPercent ? `${label} ${value}%` : label;
        if (progress < 1) requestAnimationFrame(step);
        else resolve();
    }

    /**
    * Updates the loading progress value.
    * @param {number} value Progress percentage.
    */
    setProgress(value) {
        this.progressValue = Math.max(this.progressValue, value);
        this.bar.style.width = `${this.progressValue}%`;
    }

    // FIXME: JSDoc stimmt nicht mehr
    /**
    * Loads deferred asset manifests.
    * @returns {Promise<Object>}
    */
    async loadDeferredManifests() {
        const [charRes, entityRes, audioRes, videoRes] = await Promise.allSettled([
            preloadManifestImages(characterManifestDeferred),
            preloadManifestImages(farmEntityManifestDeferred),
            preloadManifestAudio(farmAudioManifestDeferred),
            preloadManifestVideos(farmVideoManifestDeferred)
        ]);
        if (audioRes.status === 'rejected') {
            console.warn('[loadDeferredAssets] farmAudioManifestDeferred failed:', audioRes.reason);
        }
        if (videoRes.status === 'rejected') {
            console.warn('[loadDeferredAssets] farmVideoManifestDeferred failed:', videoRes.reason);
        } else if (videoRes.status === 'fulfilled') {
            console.log('[loadDeferredAssets] videos loaded (deferred)');
        }
        const charDeferred = this.getSettledValue(charRes, {});
        const entityDeferred = this.getSettledValue(entityRes, {});
        const deferredAudios = this.getSettledValue(audioRes, {});
        this.deferredAudios = deferredAudios;
        return {
            charDeferred,
            entityDeferred,
            deferredAudios
        }
    }

    // FIXME: JSDoc stimmt nicht mehr
    /**
    * Loads lazy asset manifests after idle time.
    * @returns {Promise<Object>}
    */
    async loadLazyManifests() {
        await this.waitForIdle(1500);
        const [charRes, entityRes, audioRes] = await Promise.allSettled([
            preloadManifestImages(otherLevelCharacterManifestLazy),
            preloadManifestImages(otherLevelEntityManifestLazy),
            preloadManifestAudio(otherLevelAudioManifestLazy)
        ]);
        if (audioRes.status === 'rejected') {
            console.warn('[loadLazyAssets] otherLevelAudioManifestLazy failed:', audioRes.reason);
        }
        const charLazy = this.getSettledValue(charRes, {});
        const entityLazy = this.getSettledValue(entityRes, {});
        const lazyAudios = this.getSettledValue(audioRes, {});
        this.lazyAudios = lazyAudios;
        return {
            charLazy,
            entityLazy,
            lazyAudios
        };
    };

    /**
    * Waits until the browser is idle or a timeout is reached.
    * @param {number} [timeout=1500] Maximum wait time in milliseconds.
    * @returns {Promise<void>}
    */
    waitForIdle(timeout = 1500) {
        return new Promise(r =>
            ("requestIdleCallback" in window)
                ? requestIdleCallback(r, { timeout })
                : setTimeout(r, timeout)
        );
    }
}