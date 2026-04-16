export const gameAppAssetMethods = {

    /**
     * Starts background asset loading.
     * @returns {Promise<void>}
     */
    async startBackgroundAssetLoading() {
        await this.loadDeferredIntoWorld();
        await this.loadLazyIntoWorld();
    },

    /**
     * Restores the saved muted audio state from storage.
     * @returns {void}
     */
    restoreMutedState() {
        const savedMuted = localStorage.getItem("elBruenoMuted") === "1";
        this.audioManager.setMutedState(savedMuted);
    },

    /**
     * Loads deferred assets and applies them to the world.
     * @returns {Promise<void>}
     */
    async loadDeferredIntoWorld() {
        const assets = await this.assetLoader.loadDeferredManifests();
        this.applyDeferredAudios(assets.deferredAudios);
        this.world.farmLevelSetup?.refreshSounds();
        this.applyDeferredVideos(assets.deferredVideos);
        this.applyDeferredWorldAssets(assets);
        this.applyDeferredMuteState();
    },

    /**
     * Applies deferred audio assets to the audio manager.
     * @param {Object} deferredAudios Deferred audio assets.
     * @returns {void}
     */
    applyDeferredAudios(deferredAudios) {
        if (!deferredAudios || !this.audioManager) return;
        this.audioManager.addAudios(deferredAudios);
    },

    /**
     * Applies deferred video assets to the video manager.
     * @param {Object} deferredVideos Deferred video assets.
     * @returns {void}
     */
    applyDeferredVideos(deferredVideos) {
        if (!deferredVideos || !this.videoManager) return;
        this.videoManager.addVideos(deferredVideos);
    },

    /**
     * Applies deferred character and entity assets to the world.
     * @param {{charDeferred:Object, entityDeferred:Object}} assets Deferred world assets.
     * @returns {void}
     */
    applyDeferredWorldAssets({ charDeferred, entityDeferred }) {
        this.world.applyDeferredAssets(charDeferred, entityDeferred);
    },

    /**
     * Reapplies the muted state to all loaded audio assets.
     * @returns {void}
     */
    applyDeferredMuteState() {
        if (!this.audioManager.isMuted) return;
        this.audioManager.applyMuteToAllAudios(this.audioManager.audios);
    },

    /**
     * Loads lazy assets and applies them to the world.
     * @returns {Promise<void>}
     */
    async loadLazyIntoWorld() {
        try {
            const assets = await this.assetLoader.loadLazyManifests();
            this.applyLazyAudios(assets.lazyAudios);
            this.applyLazyWorldAssets(assets);
            this.applyLazyMuteState();
        } catch {
            return;
        }
    },

    /**
     * Applies lazy-loaded audio assets to the audio manager.
     * @param {Object} lazyAudios Lazy audio assets.
     * @returns {void}
     */
    applyLazyAudios(lazyAudios) {
        if (!lazyAudios || !this.audioManager) return;
        this.audioManager.addAudios(lazyAudios);
    },

    /**
     * Applies lazy-loaded character and entity assets to the world.
     * @param {{charLazy:Object, entityLazy:Object}} assets Lazy world assets.
     * @returns {void}
     */
    applyLazyWorldAssets({ charLazy, entityLazy }) {
        this.world.applyLazyAssets(charLazy, entityLazy);
    },

    /**
     * Reapplies the muted state to all lazy-loaded audio assets.
     * @returns {void}
     */
    applyLazyMuteState() {
        if (!this.audioManager.isMuted) return;
        this.audioManager.applyMuteToAllAudios(this.audioManager.audios);
    }
}