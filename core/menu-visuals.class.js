import { attachVideo, loadVideo } from "../loader/video-loader.js";
import { videoManifest } from "../manifests/video-manifest.js";

/**
 * Manages menu visuals and related media controllers.
 */
export class MenuVisuals {
    /**
     * Creates a new menu visuals instance.
     * @param {Object} videoManager Video manager instance.
     * @param {Object} audioManager Audio manager instance.
     * @param {Object} uiManager UI manager instance.
     */
    constructor(videoManager, audioManager, uiManager) {
        this.videoManager = videoManager;
        this.audioManager = audioManager;
        this.uiManager = uiManager;
        this.startScreenTimeout = null;
    }

    /**
     * Initializes the menu resources.
     * @returns {Promise<void>}
     */
    async init() {
        this.registerMenuVideos();
        await Promise.all([
            this.playOpeningBackground(),
            this.preloadIntro(),
            this.preloadMenuBg()
        ]);
        this.preloadMenuBackgroundWarm().catch(() => { });
    }

    /**
     * Registers menu-related videos.
     */
    registerMenuVideos() {
        const map = {
            ...attachVideo("openingBg", "opening-background-video", videoManifest.opening),
            ...attachVideo("intro", "intro-video", videoManifest.intro),
            ...attachVideo("menuBg", "background-video", videoManifest.background),
            ...attachVideo("earth", "earth-video", videoManifest.earth),
            ...attachVideo("portal", "portal-video", videoManifest.portal),
            ...attachVideo("thunder", "thunder-video", videoManifest.thunder),
            ...attachVideo("submenuBg", "submenu-video", videoManifest.submenuBackground),
        };
        this.videoManager.addVideos(map);
    }

    /**
     * Loads and plays the opening background video.
     * @returns {Promise<void>}
     */
    async playOpeningBackground() {
        const openingBg = this.videoManager.get("openingBg");
        await loadVideo(openingBg);
        openingBg.play().catch(() => { });
    }

    /**
     * Preloads the intro video.
     * @returns {Promise<void>}
     */
    async preloadIntro() {
        const v = this.videoManager.get("intro");
        if (!v || v._warmed) return;
        v._warmed = true;
        v.preload = "auto";
        v.muted = true;
        v.playsInline = true;
        await loadVideo(v);
    }

    /**
     * Preloads the menu background video.
     * @returns {Promise<void>}
     */
    async preloadMenuBg() {
        const v = this.videoManager.get("menuBg");
        if (!v || v._warmed) return;
        v._warmed = true;
        v.preload = "auto";
        v.muted = true;
        v.playsInline = true;
        await loadVideo(v);
    }

    /**
     * Preloads menu background videos.
     * @returns {Promise<void>}
     */
    async preloadMenuBackgroundWarm() {
        const videos = this.getWarmMenuVideos();
        await Promise.allSettled(videos.map(v => this.warmMenuVideo(v)));
    }

    /**
     * Gets menu background videos to preload.
     * @returns {Array<*>}
     */
    getWarmMenuVideos() {
        return [
            this.videoManager.get("earth"),
            this.videoManager.get("portal"),
            this.videoManager.get("thunder")
        ].filter(Boolean);
    }

    /**
     * Preloads a menu background video.
     * @param {*} v Video instance.
     * @returns {Promise<void>}
     */
    async warmMenuVideo(v) {
        if (v._warmed) return;
        v._warmed = true;
        v.preload = "auto";
        v.muted = true;
        v.playsInline = true;
        await loadVideo(v);
    }

    /**
     * Starts the intro sequence.
     * @returns {Promise<void>}
     */
    async startIntro() {
        const menuVideo = this.videoManager.get("menuBg");
        if (!menuVideo) return;
        this.uiManager.fadeInIntroVideo();
        this.uiManager.dom.introActions?.classList.remove("d-none");
        await this.playIntroWithMusic();
        menuVideo.loop = true;
        menuVideo.playbackRate = 1.0;
        this.scheduleStartScreenTransition(menuVideo);
    }

    /**
     * Schedules the start screen transition.
     * @param {*} menuVideo Menu video instance.
     * @returns {void}
     */
    scheduleStartScreenTransition(menuVideo) {
        clearTimeout(this.startScreenTimeout);
        this.startScreenTimeout = setTimeout(async () => {
            await menuVideo.play().catch(() => { });
            this.uiManager.transitionToStartScreen();
            this.preloadMenuBackgroundDetails();
            setTimeout(() => {
                this.uiManager.hideIntroOverlay();
                this.uiManager.dom.introActions?.classList.add("d-none");
            }, 400);
        }, 23000);
    }

    /**
     * Plays the intro video with music.
     * @returns {Promise<void>}
     */
    async playIntroWithMusic() {
        const media = this.getIntroMedia();
        if (!media) return;
        this.prepareIntroMedia(media);
        await Promise.allSettled([media.video.play(), media.uiTitleIntroMusic.play()]);
        this.finishIntroMediaStart(media);
    }

    /**
     * Gets intro media.
     * @returns {{video: *, uiTitleIntroMusic: *}|null}
     */
    getIntroMedia() {
        const video = this.videoManager.get("intro");
        const uiTitleIntroMusic = this.audioManager.audios.uiTitleIntroMusic;
        if (!video || !uiTitleIntroMusic) return null;
        return { video, uiTitleIntroMusic };
    }

    /**
     * Prepares intro media.
     * @param {{video: *, uiTitleIntroMusic: *}} param0 Intro media.
     * @returns {void}
     */
    prepareIntroMedia({ video, uiTitleIntroMusic }) {
        video.currentTime = 0;
        uiTitleIntroMusic.currentTime = 0;
        video.muted = true;
        uiTitleIntroMusic.volume = 0;
    }

    /**
     * Finalizes intro media start.
     * @param {{video: *, uiTitleIntroMusic: *}} param0 Intro media.
     * @returns {void}
     */
    finishIntroMediaStart({ video, uiTitleIntroMusic }) {
        uiTitleIntroMusic.volume = 1;
        video.muted = false;
    }

    /**
     * Preloads and starts background detail videos.
     */
    preloadMenuBackgroundDetails() {
        const bgDetails = [
            this.videoManager.videos.earth,
            this.videoManager.videos.portal,
            this.videoManager.videos.thunder
        ];
        bgDetails.forEach(video => {
            video.loop = true;
            video.muted = false;
            video.play().catch(() => { });
        });
    }

    /**
     * Skips the intro sequence.
     * @returns {Promise<void>}
     */
    async skipIntro() {
        const media = this.getSkipIntroMedia();
        this.audioManager.titleCueTriggered = true;
        this.resetSkipIntroTimeout();
        this.stopSkipIntroVideo(media.introVideo);
        this.startSkipIntroMusic(media.uiTitleIntroMusic, media.uiTitleHitSfx);
        await this.startSkipMenuVideo(media.menuVideo);
        this.finishSkipIntroTransition();
    }

    /**
     * Gets media for skipping the intro.
     * @returns {{introVideo: *, menuVideo: *, uiTitleIntroMusic: *, uiTitleHitSfx: *}}
     */
    getSkipIntroMedia() {
        return {
            introVideo: this.videoManager.get("intro"),
            menuVideo: this.videoManager.get("menuBg"),
            uiTitleIntroMusic: this.audioManager.get("uiTitleIntroMusic"),
            uiTitleHitSfx: this.audioManager.get("uiTitleHitSfx")
        };
    }

    /**
     * Resets the intro skip timeout.
     * @returns {void}
     */
    resetSkipIntroTimeout() {
        clearTimeout(this.startScreenTimeout);
        this.startScreenTimeout = null;
    }

    /**
     * Stops the intro video.
     * @param {*} introVideo Intro video instance.
     * @returns {void}
     */
    stopSkipIntroVideo(introVideo) {
        if (!introVideo) return;
        introVideo.pause();
        introVideo.currentTime = 0;
    }

    /**
     * Starts intro skip audio.
     * @param {*} uiTitleIntroMusic Intro music instance.
     * @param {*} uiTitleHitSfx Hit sound instance.
     * @returns {void}
     */
    startSkipIntroMusic(uiTitleIntroMusic, uiTitleHitSfx) {
        this.resetSkipIntroSounds(uiTitleIntroMusic, uiTitleHitSfx);
        const uiTitleLoopMusic = this.audioManager.get("uiTitleLoopMusic");
        if (!uiTitleLoopMusic) return;
        uiTitleLoopMusic.pause();
        uiTitleLoopMusic.currentTime = 0;
        uiTitleLoopMusic.loop = true;
        this.audioManager.safePlay(uiTitleLoopMusic);
    }

    /**
     * Resets intro skip sounds.
     * @param {*} uiTitleIntroMusic Intro music instance.
     * @param {*} uiTitleHitSfx Hit sound instance.
     * @returns {void}
     */
    resetSkipIntroSounds(uiTitleIntroMusic, uiTitleHitSfx) {
        if (uiTitleIntroMusic) {
            uiTitleIntroMusic.pause();
            uiTitleIntroMusic.currentTime = 0;
        }
        if (!uiTitleHitSfx) return;
        uiTitleHitSfx.pause();
        uiTitleHitSfx.currentTime = 0;
        this.audioManager.safePlay(uiTitleHitSfx);
    }

    /**
     * Starts menu video after skipping intro.
     * @param {*} menuVideo Menu video instance.
     * @returns {Promise<void>}
     */
    async startSkipMenuVideo(menuVideo) {
        if (!menuVideo) return;
        menuVideo.loop = true;
        menuVideo.playbackRate = 1.0;
        await menuVideo.play().catch(() => { });
    }

    /**
     * Finalizes intro skip transition.
     * @returns {void}
     */
    finishSkipIntroTransition() {
        this.uiManager.transitionToStartScreen();
        this.uiManager.playTitleAnimation();
        this.preloadMenuBackgroundDetails();
        setTimeout(() => {
            this.uiManager.hideIntroOverlay();
            this.uiManager.dom.introActions?.classList.add("d-none");
        }, 400);
    }
}