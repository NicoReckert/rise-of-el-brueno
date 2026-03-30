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
    }

    /**
     * Initializes menu visuals.
     * @returns {Promise<void>}
     */
    async init() {
        this.registerMenuVideos();
        await this.playOpeningBackground();
        this.preloadIntro();
        this.preloadMenuBackgroundWarm();
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
        openingBg.play();
    }

    /**
     * Preloads the intro video.
     * @returns {Promise<void>}
     */
    async preloadIntro() {
        const v = this.videoManager.get("intro");
        if (!v || v._warmed) return;
        v._warmed = true;
        await loadVideo(v);
        v.muted = true;
        v.playsInline = true;
        v.preload = "auto";
    }

    /**
     * Preloads and warms menu background videos.
     * @returns {Promise<void>}
     */
    async preloadMenuBackgroundWarm() {
        const videos = [
            this.videoManager.get("earth"),
            this.videoManager.get("portal"),
            this.videoManager.get("thunder"),
        ].filter(Boolean);
        for (const v of videos) {
            if (v._warmed) continue;
            v._warmed = true;
            await loadVideo(v);
            v.muted = true;
            v.playsInline = true;
        }
    }

    /**
     * Starts the intro sequence.
     * @returns {Promise<void>}
     */
    async startIntro() {
        const menuVideo = this.videoManager.get("menuBg");
        if (!menuVideo._loaded) {
            menuVideo._loaded = true;
            loadVideo(menuVideo);
        }
        this.uiManager.fadeInIntroVideo();
        this.playIntroWithMusic();
        menuVideo.loop = true;
        menuVideo.playbackRate = 1.0;
        this.scheduleStartScreenTransition(menuVideo);
    }

    /**
     * Schedules the transition to the start screen.
     * @param {HTMLVideoElement} menuVideo Menu background video.
     */
    scheduleStartScreenTransition(menuVideo) {
        setTimeout(async () => {
            await menuVideo.play();
            this.uiManager.transitionToStartScreen();
            this.preloadMenuBackgroundDetails();
            setTimeout(() => {
                this.uiManager.hideIntroOverlay();
            }, 400);
        }, 0); //23000
    }

    /**
     * Plays the intro video with accompanying music.
     * @returns {Promise<void>}
     */
    async playIntroWithMusic() {
        const video = this.videoManager.get("intro");
        const uiTitleIntroMusic = this.audioManager.audios.uiTitleIntroMusic;
        video.currentTime = 0;
        uiTitleIntroMusic.currentTime = 0;
        video.muted = true;
        uiTitleIntroMusic.volume = 0;
        await Promise.all([
            video.play(),
            uiTitleIntroMusic.play()
        ]);
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
}