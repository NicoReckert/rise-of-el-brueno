import { preloadManifestAudio } from "../loader/audio-loader.js";
import { introAudioManifest } from "../manifests/audio-manifest.js";
import { characterManifestImmediate } from "../manifests/character-image-manifest.js";
import { farmEntityManifestImmediate } from "../manifests/entity-image-manifest.js";
import { farmAudioManifestImmediate } from "../manifests/audio-manifest.js";
import { preloadManifestImages } from "../loader/image-loader.js";
import { characterManifestDeferred } from "../manifests/character-image-manifest.js";
import { farmEntityManifestDeferred } from "../manifests/entity-image-manifest.js";
import { otherLevelCharacterManifestLazy } from "../manifests/character-image-manifest.js";
import { otherLevelEntityManifestLazy } from "../manifests/entity-image-manifest.js";
import { otherLevelAudioManifestLazy } from "../manifests/audio-manifest.js";
import { farmAudioManifestDeferred } from "../manifests/audio-manifest.js";
import { preloadManifestVideos } from "../loader/video-loader.js";
import { videoManifest, farmVideoManifestDeferred } from "../manifests/video-manifest.js";
import { smartMerge } from "../utils/asset-merge.util.js";
import { levelVisualImageManifest } from "../manifests/level-visual-image-manifest.js";

/**
 * Handles loading and management of game assets.
 */
export class AssetLoader {
    /**
     * Creates a new asset loader instance and initializes asset state containers.
     */
    constructor() {
        this.characterImages = {};
        this.entityImages = {};
        this.levelImages = {};
        this.progressValue = 0;
        this.introAudios = {};
        this.immediateAudios = {};
        this.deferredAudios = {};
        this.deferredVideos = {};
        this.lazyAudios = {};
        this.introVideos = {};
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

    /**
     * Preloads intro audio assets from the manifest.
     */
    async preloadIntroAssets() {
        const introAudios = await preloadManifestAudio(introAudioManifest);
        this.introAudios = introAudios;
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
            levelVisualImageManifest,
            farmAudioManifestImmediate,
            videoManifest
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
            preloadManifestImages(levelVisualImageManifest, onFileLoaded),
            preloadManifestAudio(farmAudioManifestImmediate, onFileLoaded),
            preloadManifestVideos(videoManifest, onFileLoaded)
        ]);
    }

    /**
     * Applies immediately loaded assets to the caches.
     * @param {Array<PromiseSettledResult>} results Array of settled promises for characters, entities, level images, and farm audio.
     */
    applyImmediateResults([charsRes, entitiesRes, levelImagesRes, farmAudioRes, introVideosRes]) {
        const chars = this.getSettledValue(charsRes, {});
        const entities = this.getSettledValue(entitiesRes, {});
        const levelImages = this.getSettledValue(levelImagesRes, {});
        const farmAudios = this.getSettledValue(farmAudioRes, {});
        const introVideos = this.getSettledValue(introVideosRes, {});
        this.immediateAudios = farmAudios;
        this.introVideos = introVideos;
        Object.assign(this.characterImages, chars);
        smartMerge(this.entityImages, entities);
        smartMerge(this.levelImages, levelImages);
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

    /**
     * Loads all deferred image, audio, and video manifests using a unified loader.
     * Updates deferred caches and returns loaded assets.
     * @returns {Promise<{charDeferred: Object, entityDeferred: Object, deferredAudios: Object, deferredVideos: Object}>}
     */
    async loadDeferredManifests() {
        const results = await this.loadAllDeferred([
            { fn: () => preloadManifestImages(characterManifestDeferred), defaultValue: {} },
            { fn: () => preloadManifestImages(farmEntityManifestDeferred), defaultValue: {} },
            { fn: () => preloadManifestAudio(farmAudioManifestDeferred), defaultValue: {} },
            { fn: () => preloadManifestVideos(farmVideoManifestDeferred), defaultValue: {} }
        ]);
        const [charDeferred, entityDeferred, deferredAudios, deferredVideos] = results;
        this.deferredAudios = deferredAudios;
        this.deferredVideos = deferredVideos;
        return { charDeferred, entityDeferred, deferredAudios, deferredVideos };
    }

    /**
     * Loads multiple deferred tasks and returns their resolved values or defaults.
     * @param {Array<{fn: Function, defaultValue: *}>} tasks Deferred tasks to load.
     * @returns {Promise<Array<*>>} Resolved values for each task.
     */
    async loadAllDeferred(tasks) {
        const settled = await Promise.allSettled(tasks.map(t => t.fn()));
        return settled.map((res, i) => this.getSettledValue(res, tasks[i].defaultValue));
    }

    /**
     * Loads lazy image and audio manifests after an optional wait, updating the lazy caches.
     * @returns {Promise<{charLazy: Object, entityLazy: Object, lazyAudios: Object}>} Loaded lazy assets.
     */
    async loadLazyManifests() {
        await this._waitBeforeLoad();
        const [charRes, entityRes, audioRes] = await this._loadLazyManifests();
        const { charLazy, entityLazy, lazyAudios } = this._processLazyResults(charRes, entityRes, audioRes);
        this.lazyAudios = lazyAudios;
        return { charLazy, entityLazy, lazyAudios };
    }

    /**
     * Waits for a short idle period before starting lazy loading.
     */
    async _waitBeforeLoad() {
        await this.waitForIdle(1500);
    }

    /**
     * Loads lazy image and audio manifests concurrently.
     * @returns {Promise<Array<PromiseSettledResult>>} Settled results for characters, entities, and audio.
     */
    async _loadLazyManifests() {
        return Promise.allSettled([
            preloadManifestImages(otherLevelCharacterManifestLazy),
            preloadManifestImages(otherLevelEntityManifestLazy),
            preloadManifestAudio(otherLevelAudioManifestLazy)
        ]);
    }

    /**
     * Processes settled lazy manifest results and returns the resolved values.
     * @param {PromiseSettledResult} charRes Character manifest result.
     * @param {PromiseSettledResult} entityRes Entity manifest result.
     * @param {PromiseSettledResult} audioRes Audio manifest result.
     * @returns {{charLazy: Object, entityLazy: Object, lazyAudios: Object}} Processed lazy assets.
     */
    _processLazyResults(charRes, entityRes, audioRes) {
        const charLazy = this.getSettledValue(charRes, {});
        const entityLazy = this.getSettledValue(entityRes, {});
        const lazyAudios = this.getSettledValue(audioRes, {});
        return { charLazy, entityLazy, lazyAudios };
    }

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