let titleMusic = new Audio('./assets/audio/title-music.opus');
let titleMusic2 = new Audio('./assets/audio/title-music2.opus');
let titleSound = new Audio('./assets/audio/title-sound5.opus');
let welcomeButtonHoverSound = new Audio('./assets/audio/ui-tuping-391160.opus');
let titleSoundIsPlayed = false;

function startVideo() {
    let video = document.getElementById('background-video');
    let video2 = document.getElementById('start-initialisation-video2');
    video2.classList.remove('opacity-none');
    video2.classList.add('animation-video2');
    video2.play();
    video.load();
    titleMusic.play();
    titleMusic2.load();
    setTimeout(() => {
        video.play();
        video.playbackRate = 1.0;
        video.loop = true;
        document.getElementById('overlay-start-initialisation').classList.add('animation-overlay-fade-out');
        document.getElementById('overlay-startscreen').classList.remove('opacity-none');
        setTimeout(() => {
            document.getElementById('overlay-start-initialisation').classList.add('opacity-none');
        }, 400);
    }, 23000);
}

function playHoverSound() {
    welcomeButtonHoverSound.currentTime = 0;
    welcomeButtonHoverSound.play();
}

titleMusic.addEventListener("ended", () => {
    titleMusic2.play();
    titleMusic2.loop = true;
});

const title = document.querySelector("h1");
title.addEventListener("animationend", () => {
    titleSound.play();
});

titleMusic.addEventListener('timeupdate', () => {
    if (titleMusic.currentTime >= 22.8 && !titleSoundIsPlayed) {
        titleSound.play();
        document.getElementById('h1').classList.add('animation');
        titleSoundIsPlayed = true;
        setTimeout(() => {
            document.getElementById('h1').classList.remove('before-animation');
        }, 800);
    }
});

async function init() {
  // Optional: sofort Kritisches priorisieren (Startscreen/Background)
  // z.B. nur die Videos im Start-Overlay:
  await preloadAllVideos('#overlay-startscreen video, #overlay-start-initialisation video');

  // Jetzt Spiel initialisieren
  // … deine bisherige Init-Logik …
}

// --- Video Preloader ---------------------------------------------

/** Resolves sobald das Video abspielbereit ist (robust; blockiert nie ewig). */
function preloadVideo(el, { timeoutMs = 12000 } = {}) {
    return new Promise((resolve) => {
        let done = false;
        const finish = () => { if (!done) { done = true; cleanup(); resolve(el); } };

        const cleanup = () => {
            clearInterval(checkReady);
            clearTimeout(timer);
            el.removeEventListener('canplaythrough', onReady);
            el.removeEventListener('loadeddata', onReady);
            el.removeEventListener('loadedmetadata', onReadyMeta);
            el.removeEventListener('error', finish);
            el.removeEventListener('stalled', onStalled);
        };

        const onReady = () => finish();
        const onReadyMeta = () => { if (el.readyState >= 3) finish(); }; // Safari fallback
        const onStalled = () => { /* ignoriere, wir pollen unten */ };

        el.addEventListener('canplaythrough', onReady, { once: true });
        el.addEventListener('loadeddata', onReady, { once: true });
        el.addEventListener('loadedmetadata', onReadyMeta, { once: true });
        el.addEventListener('error', finish, { once: true });
        el.addEventListener('stalled', onStalled);

        // sicherstellen, dass der Browser lädt
        try { el.preload = el.preload || 'auto'; el.load?.(); } catch (_) { }

        // schon fertig?
        if (el.readyState >= 3) return finish();

        // Poll alle 400ms (hilft bei Browsern, die Events skippen)
        const checkReady = setInterval(() => {
            if (el.readyState >= 3) finish();
        }, 400);

        // Hartes Timeout -> wir blockieren den Start nicht
        const timer = setTimeout(finish, timeoutMs);
    });
}

/** Lädt alle Videos parallel; gibt zurück, wenn alle „spielbereit ODER timeout“ sind. */
async function preloadAllVideos(selector = 'video') {
    const videos = Array.from(document.querySelectorAll(selector));
    if (videos.length === 0) return;
    // Optionale Netzwerk-Tweaks pro Video
    for (const v of videos) {
        v.setAttribute('playsinline', ''); // iOS sicher
        v.setAttribute('preload', 'auto');
        v.muted = v.muted || true; // Autoplay-Policy freundlicher
    }
    await Promise.all(videos.map(v => preloadVideo(v)));
}
