import { attachVideo, loadVideo } from "../video-loader.js";
import { videoManifest } from "../video-manifest.js";

export class MenuVisuals {
    constructor(videoManager, audioManager) {
        this.videoManager = videoManager;
        this.audioManager = audioManager;
    }

    async init() {
        const map = {
            ...attachVideo("openingBg", "opening-background-video", videoManifest.opening),
            ...attachVideo("intro", "intro-video", videoManifest.intro),
            ...attachVideo("menuBg", "background-video", videoManifest.background),
            ...attachVideo("earth", "earth-video", videoManifest.earth),
            ...attachVideo("portal", "portal-video", videoManifest.portal),
            ...attachVideo("thunder", "thunder-video", videoManifest.thunder),
            ...attachVideo("submenuBg", "submenu-video", videoManifest.subMenuBackground),
        }
        this.videoManager.addVideos(map);
        const openingBg = this.videoManager.get("openingBg");
        await loadVideo(openingBg);
        openingBg.play();

        this.preloadIntro();
        this.preloadMenuBackgroundWarm();
    }

    async preloadIntro() {
        const v = this.videoManager.get("intro");
        if (!v || v._warmed) return;
        v._warmed = true;
        await loadVideo(v);
        v.muted = true;
        v.playsInline = true;
        v.preload = "auto";
    }

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

    async startIntro() {
        const menuVideo = this.videoManager.get("menuBg");
        const introVideo = this.videoManager.get("intro");
        if (!menuVideo._loaded) {
            menuVideo._loaded = true;
            loadVideo(menuVideo);
        }
        introVideo.classList.remove('opacity-none');
        introVideo.classList.add('animation-video2');
        this.playVorspannWithMusic();
        menuVideo.loop = true;
        menuVideo.playbackRate = 1.0;
        setTimeout(async () => {
            await menuVideo.play();
            document.getElementById('overlay-start-initialisation').classList.add('animation-overlay-fade-out');
            document.getElementById('overlay-startscreen').classList.remove('opacity-none');
            this.preloadMenuBackgroundDetails();
            setTimeout(() => {
                document.getElementById('overlay-start-initialisation').classList.add('opacity-none');
            }, 400);
        }, 23000);

    }

    async playVorspannWithMusic() {
        const video = this.videoManager.get("intro");
        const titleMusic = this.audioManager.audios.titleMusic;
        // beides reset
        video.currentTime = 0;
        titleMusic.currentTime = 0;

        // beides stumm
        video.muted = true;
        titleMusic.volume = 0;

        // parallel starten
        await Promise.all([
            video.play(),
            titleMusic.play()
        ]);

        // exakt JETZT hörbar machen
        titleMusic.volume = 1;
        video.muted = false;
    }

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

