export const worldIntroMethods = {
    /**
     * Checks whether the scene intro should be played.
     * @param {string} scene Scene name.
     * @returns {boolean} True if the scene intro should be played, otherwise false.
     */
    shouldPlaySceneIntro(scene) {
        return scene === 'farmLevel' || scene === 'townLevel';
    },

    /**
     * Starts the scene intro.
     * @param {string} scene Scene name.
     * @returns {void}
     */
    startSceneIntro(scene) {
        if (!this.shouldPlaySceneIntro(scene)) {
            this.isSceneIntroActive = false;
            this.uiManager?.showGameControls();
            return;
        }
        this.intro.setScene(scene);
        this.isSceneIntroActive = true;
        this.isChapterStingSfxPlayed = false;
        this.uiManager?.hideGameControls();
    },

    /**
     * Finishes the scene intro.
     * @returns {void}
     */
    finishSceneIntro() {
        this.isSceneIntroActive = false;
        this.uiManager?.showGameControls();
    },

    /**
     * Handles the intro phase.
     * @param {number} deltaTime Frame delta time.
     * @returns {boolean} True if the intro phase is active, otherwise false.
     */
    handleIntroPhase(deltaTime) {
        if (!this.isSceneIntroActive) return false;
        this.intro.update(deltaTime);
        this.intro.draw();
        if (!this.isChapterStingSfxPlayed) {
            this.chapterStingSfx?.play();
            this.isChapterStingSfxPlayed = true;
        }
        if (!this.intro.done) return true;
        this.finishSceneIntro();
        return false;
    }
}