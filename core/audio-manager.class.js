import { allAudios } from "../media-store.js";
import { UIManager } from "./ui-manager.class.js";

export class AudioManager {
    constructor() {
        this.isMuted = false;
        this.uiManager = new UIManager();
    }

    setMutedState(muted) {
        this.isMuted = muted;
        localStorage.setItem("elBruenoMuted", muted ? "1" : "0");
        this.uiManager.updateMuteButtonUI(muted);
        this.applyMuteToAllAudios(allAudios);
    }


    fadeInAudio(audio, duration = 2000, targetVolume = 1) {
        // Sicherheitschecks
        if (!audio) return;

        // Clamp sicherstellen: Volume darf nie <0 oder >1 sein
        targetVolume = Math.max(0, Math.min(1, targetVolume));

        // Start bei 0
        audio.volume = 0;

        // Play versuchen – falls blockiert, Fehler abfangen
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.warn("Audio play() blocked:", err));
        }

        const startTime = performance.now();

        function fade(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Linear einblenden bis zur Ziel-Lautstärke
            let newVolume = targetVolume * progress;
            newVolume = Math.max(0, Math.min(1, newVolume)); // Sicherheit

            audio.volume = newVolume;

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                audio.volume = targetVolume;
            }
        }

        requestAnimationFrame(fade);
    }

    fadeAudioTo(audio, duration = 2000, targetVolume = 1) {
        // Sicherheitschecks
        if (!audio) return;

        // Ziel-Volume sicher im Bereich 0–1 halten
        targetVolume = Math.max(0, Math.min(1, targetVolume));

        const startVolume = audio.volume;
        const startTime = performance.now();

        function fade(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Lineare Interpolation (lerp)
            let newVolume = startVolume + (targetVolume - startVolume) * progress;
            newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp

            audio.volume = newVolume;

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                audio.volume = targetVolume; // sicherstellen, dass Ziel erreicht wird
            }
        }

        requestAnimationFrame(fade);
    }

    fadeOutAudio(audio, duration = 2000) {
        // Sicherheitschecks
        if (!audio) return;
        if (audio.paused && audio.currentTime === 0) return; // noch nie gestartet

        const startVolume = typeof audio.volume === "number" ? audio.volume : 1;
        const startTime = performance.now();

        function fade(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Neue Lautstärke berechnen und sicher clampen
            let newVolume = startVolume * (1 - progress);
            newVolume = Math.max(0, Math.min(1, newVolume));

            audio.volume = newVolume;

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                audio.volume = 0;
                audio.pause(); // optional: Musik am Ende stoppen
            }
        }

        requestAnimationFrame(fade);
    }

    resetAllAudios(
        root,
        {
            pause = true,
            resetTime = true,
            resetVolume = true,
            defaultVolume = 1,
            resetLoop = true,
            resetRate = true,
            log = false
        } = {}
    ) {
        if (!root) return;

        let counter = 0;

        const visit = (value, path = "root") => {
            if (!value) return;

            const looksLikeAudio =
                typeof value === "object" &&
                typeof value.play === "function" &&
                typeof value.pause === "function" &&
                "currentTime" in value;

            if (looksLikeAudio) {
                try {
                    if (log) console.log("[resetAllAudios] audio @", path, "before:", {
                        time: value.currentTime,
                        volume: value.volume,
                        loop: value.loop
                    });

                    if (pause) value.pause();
                    if (resetTime) value.currentTime = 0;
                    if (resetVolume) value.volume = defaultVolume;
                    if (resetLoop) value.loop = false;
                    if (resetRate) value.playbackRate = 1;

                    if (log) console.log("[resetAllAudios] audio @", path, "after:", {
                        time: value.currentTime,
                        volume: value.volume,
                        loop: value.loop
                    });

                    counter++;
                } catch (e) {
                    console.warn("Konnte Audio nicht resetten:", e);
                }
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((v, i) => visit(v, `${path}[${i}]`));
                return;
            }

            if (typeof value === "object") {
                Object.entries(value).forEach(([k, v]) => visit(v, `${path}.${k}`));
            }
        };

        visit(root, "allAudios");
        if (log) console.log(`[resetAllAudios] total audios reset: ${counter}`);
    }

    pauseAllAudios(root) {
        if (!root) return;

        const visit = (value) => {
            if (!value) return;

            const looksLikeAudio =
                typeof value === "object" &&
                typeof value.play === "function" &&
                typeof value.pause === "function" &&
                "currentTime" in value;

            if (looksLikeAudio) {
                // Merken, ob es vorher gespielt hat
                value._wasPlayingBeforePause = !value.paused;
                if (!value.paused) value.pause();
                return;
            }

            if (Array.isArray(value)) {
                value.forEach(visit);
                return;
            }

            if (typeof value === "object") {
                Object.values(value).forEach(visit);
            }
        };

        visit(root);
    }

    resumeAllAudios(root) {
        if (!root) return;

        const visit = (value) => {
            if (!value) return;

            const looksLikeAudio =
                typeof value === "object" &&
                typeof value.play === "function" &&
                typeof value.pause === "function" &&
                "currentTime" in value;

            if (looksLikeAudio) {
                if (value._wasPlayingBeforePause) {
                    value.play().catch(() => { /* Autoplay-Blocker ignorieren */ });
                }
                value._wasPlayingBeforePause = false;
                return;
            }

            if (Array.isArray(value)) {
                value.forEach(visit);
                return;
            }

            if (typeof value === "object") {
                Object.values(value).forEach(visit);
            }
        };

        visit(root);
    }


    applyMuteToAllAudios(root) {
        if (!root) return;

        const visit = (value) => {
            if (!value) return;

            const looksLikeAudio =
                typeof value === "object" &&
                typeof value.play === "function" &&
                typeof value.pause === "function" &&
                "currentTime" in value;

            if (looksLikeAudio) {
                value.muted = this.isMuted;   // 💡 ganz wichtig: nur muted toggeln
                return;
            }

            if (Array.isArray(value)) {
                value.forEach(visit);
                return;
            }

            if (typeof value === "object") {
                Object.values(value).forEach(visit);
            }
        };

        visit(root);
    }
}