let titleMusic;
let titleMusic2;
let titleSound;
let welcomeButtonHoverSound;
let titleSoundIsPlayed = false;
let videos = {};
let currentCharacterMusic;
let currentCharacterSpeechSound;

// const controls =
//     [
//         {
//             key: 'RightArrow',
//             action: 'nach rechts laufen',
//             mobile: 'right2'
//         },

//         {
//             key: 'LeftArrow',
//             action: 'nach links laufen',
//             mobile: 'left2'
//         },

//         {
//             key: 'UpArrow',
//             action: 'springen',
//             mobile: 'jump'
//         },

//         {
//             key: 'F',
//             action: 'benutzen',
//             mobile: 'use'
//         },

//         {
//             key: 'T',
//             action: 'Log öffnen und schließen',
//             mobile: 'log'
//         },

//         {
//             key: 'D',
//             action: 'Flaschen werfen',
//             mobile: 'throw'
//         },

//         {
//             key: 'A',
//             action: 'Attacke',
//             mobile: 'attack'
//         },
//     ]

let audios = {};
let characters = [];

// function buildCharacters() {
//     characters =
//         [
//             {
//                 name: 'Brünö',
//                 text: 'Ein einfacher Bauer mit großem Herz. Beschützt seine Tiere und ist bereit, alles für sie zu tun.',
//                 text2: 'Brünö ist ein einfacher mexikanischer Bauer, der sein Leben seinen Tieren widmet. Als seine Freunde von einer mysteriösen Macht entführt werden, wird aus dem stillen Bauern ein Held. Mit Mut und einem reinen Herzen stellt er sich einer gefährlichen Reise.',
//                 music: audios.soulMusic,
//                 textSpeechSound: audios.brünöTextSpeechSound
//             },
//             {
//                 name: 'Juanito',
//                 text: 'Das schlaue Huhn. Treu, mutig und Brünös ältester tierischer Freund.',
//                 text2: 'Juanito ist nicht nur ein Huhn. Er ist Brünös engster Freund. Klug und mutig, oft derjenige, der Gefahren zuerst wittert.',
//                 music: audios.happyTogetherMusic,
//                 textSpeechSound: audios.juanitoTextSpeechSound
//             },
//             {
//                 name: 'Pollito',
//                 text: 'Ein quirliges Küken, das immer für Chaos sorgt und Brünö zum Lachen bringt.',
//                 text2: 'Das freche Küken Pollito bringt Leben und Energie in Brünös kleine Welt. Trotz seiner Größe beweist er überraschend viel Mut.',
//                 music: audios.happyTogetherMusic,
//                 textSpeechSound: audios.pollitoTextSpeechSound
//             },
//             {
//                 name: 'Lola',
//                 text: 'Die ruhige Kuh. Gibt Brünö Kraft und Ruhe, eine Art „Familienmutter“.',
//                 text2: 'Die Kuh Lola ist für Brünö wie eine Schwester. Sie hat ein sanftes Herz, sorgt für Ruhe und Ausgeglichenheit.',
//                 music: audios.happyTogetherMusic,
//                 textSpeechSound: audios.lolaTextSpeechSound
//             },
//             {
//                 name: 'Sollita',
//                 text: 'Eine starke Frau aus der Stadt. Kämpft gegen Ungerechtigkeit und hilft Brünö.',
//                 text2: 'Sollita ist eine mutige Kämpferin in der Stadt, die Brünö auf seinem Weg unterstützt. Sie weiß mehr über die Portale und die Wesen als Brünö zunächst ahnt.',
//                 music: audios.sollitasMusic,
//                 textSpeechSound: audios.sollitaTextSpeechSound
//             },
//             {
//                 name: 'Nayeli',
//                 text: 'Die weise Älteste, die mit den Ahnen verbunden ist und Brünö auf seine Mission schickt.',
//                 text2: 'Nayeli ist eine weise Frau mit alten Kräften. Sie kennt Brünös Schicksal und gibt ihm das Schwert der Ahnen.',
//                 music: audios.nayelisMusic,
//                 textSpeechSound: audios.nayeliTextSpeechSound
//             },
//             {
//                 name: 'Tadeo',
//                 text: 'Ein mutiger Junge mit großem Herzen. Von Nayeli gesandt, um Brünö auf seiner Reise zu helfen.',
//                 text2: 'Tadeo ist ein aufgeweckter Junge mit starkem Herz. Er lebt im Einklang mit der Natur und wurde von der weisen Nayeli geschickt, um Brünö zu helfen. Trotz seines jungen Alters zeigt er Mut, Mitgefühl und Entschlossenheit. Für ihn ist es eine Ehre, Teil von Brünös Reise zu sein.',
//                 music: audios.tadeoMusic,
//                 textSpeechSound: audios.tadeoTextSpeechSound
//             }
//         ];
// }
// const storyText = 'Rise of El Brünö erzählt die Geschichte eines einfachen mexikanischen Bauern, der sein friedliches Leben auf dem Hof mit seinen Tieren genießt. Eines Nachts werden seine geliebten Freunde von einer dunklen Macht entführt. Brünö bleibt nichts anderes übrig, als sich auf eine Reise voller Gefahren, Magie und uralter Geheimnisse zu begeben. Auf seinem Weg trifft er Verbündete und stellt sich Wesen, die von einem wahnsinnigen Wissenschaftler erschaffen wurden. Doch je weiter Brünö kommt, desto mehr erkennt er, dass seine Mission größer ist, als nur seine Freunde zu retten. Er kämpft für das Gleichgewicht der Welt.';


// async function startVideo() {
//     const menuVideo = allVideos.menuBg;
//     const vorspann = allVideos.vorspann;

//     if (!menuVideo._loaded) {
//         menuVideo._loaded = true;
//         loadVideo(menuVideo);
//     }
//     vorspann.classList.remove('opacity-none');
//     vorspann.classList.add('animation-video2');
//     playVorspannWithMusic();
//     menuVideo.loop = true;
//     menuVideo.playbackRate = 1.0;
//     setTimeout(async () => {
//         await menuVideo.play();
//         document.getElementById('overlay-start-initialisation').classList.add('animation-overlay-fade-out');
//         document.getElementById('overlay-startscreen').classList.remove('opacity-none');
//         preloadMenuBackgroundDetails();
//         setTimeout(() => {
//             document.getElementById('overlay-start-initialisation').classList.add('opacity-none');
//         }, 400);
//     }, 23000);

// }

// async function preloadMenuBackgroundWarm() {
//     const videos = [allVideos.earth, allVideos.portal, allVideos.thunder];

//     for (const v of videos) {
//         if (v._warmed) continue;
//         v._warmed = true;

//         await loadVideo(v);
//         v.muted = true;
//         v.playsInline = true;
//     }
// }



// function preloadMenuBackgroundDetails() {
//     const bgDetails = [
//         allVideos.earth,
//         allVideos.portal,
//         allVideos.thunder
//     ];

//     bgDetails.forEach(video => {
//         video.loop = true;
//         video.muted = false;
//         video.play().catch(() => { });
//     });
// }


// async function preloadVorspann() {
//     const v = allVideos.vorspann;
//     if (v._warmed) return;
//     v._warmed = true;

//     await loadVideo(v);

//     v.muted = true;
//     v.playsInline = true;
//     v.preload = "auto";
// }


// async function playVorspannWithMusic() {
//     const video = allVideos.vorspann;

//     // beides reset
//     video.currentTime = 0;
//     titleMusic.currentTime = 0;

//     // beides stumm
//     video.muted = true;
//     titleMusic.volume = 0;

//     // parallel starten
//     await Promise.all([
//         video.play(),
//         titleMusic.play()
//     ]);

//     // exakt JETZT hörbar machen
//     titleMusic.volume = 1;
//     video.muted = false;
// }


// function playHoverSound() {
//     welcomeButtonHoverSound.currentTime = 0;
//     welcomeButtonHoverSound.play();
// }

// document.getElementById('welcome-button').addEventListener('click', () => {
//     playHoverSound();
//     openFullscreen(document.body);
// })



const title = document.querySelector("h1");
title.addEventListener("animationend", () => {
    titleSound.play();
});

// let scriptInitialized = false;

// export async function initScriptVisuals() {
// if (scriptInitialized) return;
// scriptInitialized = true;
//     attachVideo("introBg", "start-initialisation-video", videoManifest.intro);
//     attachVideo("vorspann", "start-initialisation-video2", videoManifest.vorspann);
//     attachVideo("menuBg", "background-video", videoManifest.background);
//     attachVideo("earth", "earth-video", videoManifest.earth);
//     attachVideo("portal", "portal-video", videoManifest.portal);
//     attachVideo("thunder", "thunder-video", videoManifest.thunder);
//     attachVideo("submenuBg", "submenu-video", videoManifest.subMenuBackground);
//     await loadVideo(allVideos.introBg);
//     allVideos.introBg.play();
//     preloadVorspann();
//     preloadMenuBackgroundWarm();
// }

// export function initScriptAudioIntro(allAudios) {
//     titleMusic = allAudios.titleMusic
//     titleMusic2 = allAudios.titleMusic2;
//     titleSound = allAudios.titleSound;
//     welcomeButtonHoverSound = allAudios.welcomeButtonHoverSound;

//     titleMusic.addEventListener("ended", () => {
//         titleMusic2.play();
//         titleMusic2.loop = true;
//     });

//     titleMusic.addEventListener('timeupdate', () => {
//         if (titleMusic.currentTime >= 22.8 && !titleSoundIsPlayed) {
//             titleSound.play();
//             document.getElementById('h1').classList.add('animation');
//             titleSoundIsPlayed = true;
//             setTimeout(() => {
//                 document.getElementById('h1').classList.remove('before-animation');
//             }, 800);
//         }
//     });

//     //3. Klick startet es sofort
//     document.getElementById("welcome-button").addEventListener("click", () => {
//         playHoverSound();
//         openFullscreen(document.body);
//         startVideo()
//     });
// }

export function initScriptAudio(allAudios) {

    audios = {
        nayelisMusic: allAudios.nayelisMusic,
        sollitasMusic: allAudios.sollitasMusic,
        tadeoMusic: allAudios.tadeoMusic,
        soulMusic: allAudios.soulMusic,
        happyTogetherMusic: allAudios.happyTogetherMusic,
        infoScreenMusic: allAudios.infoScreenMusic,
        brünöTextSpeechSound: allAudios.brünöTextSpeechSound,
        juanitoTextSpeechSound: allAudios.juanitoTextSpeechSound,
        pollitoTextSpeechSound: allAudios.pollitoTextSpeechSound,
        lolaTextSpeechSound: allAudios.lolaTextSpeechSound,
        sollitaTextSpeechSound: allAudios.sollitaTextSpeechSound,
        nayeliTextSpeechSound: allAudios.nayeliTextSpeechSound,
        tadeoTextSpeechSound: allAudios.tadeoTextSpeechSound,
        storyTextSpeechSound: allAudios.storyTextSpeechSound
    }



    buildCharacters();
}

export function stopTitleMusic(allAudios) {
    allAudios.titleMusic?.pause();
    allAudios.titleMusic2?.pause();
}

export function fadeInTitleMusic() {
    titleMusic2.currentTime = 0;
    fadeInAudio(titleMusic2, 2000);
}



// function openBigBox() {
//     document.getElementById('overlay-big-card').classList.remove('d-none');
//     document.getElementById('body').classList.add('overflow-hidden');
//     document.getElementById('overlay-info').classList.add('blur-effect');
// }

// function closeBigBox() {
//     document.getElementById('overlay-big-card').classList.add('d-none');
//     document.getElementById('body').classList.remove('overflow-hidden');
//     document.getElementById('overlay-info').classList.remove('blur-effect');
//     fadeOutAudio(currentCharacterMusic, 1000);
//     fadeOutAudio(currentCharacterSpeechSound, 1000);
//     titleMusic2.currentTime = 0;
//     audios.infoScreenMusic.currentTime = 0;
//     fadeInAudio(audios.infoScreenMusic, 2000);
// }

// function openOverlay() {
//     const v = allVideos.submenuBg;

//     if (!v._loaded) {
//         v._loaded = true;
//         loadVideo(v);
//     }

//     v.play();

//     document.getElementById('overlay-info').classList.remove('d-none');
//     renderCharacters();
//     fadeOutAudio(titleMusic, 1000);
//     fadeOutAudio(titleMusic2, 1000);
//     audios.infoScreenMusic.currentTime = 0;
//     fadeInAudio(audios.infoScreenMusic, 2000);
// }

// function closeOverlay() {
//     allVideos.submenuBg?.pause();
//     document.getElementById('overlay-info').classList.add('d-none');
//     fadeOutAudio(audios.infoScreenMusic, 1000);
//     titleMusic2.currentTime = 0;
//     fadeInAudio(titleMusic2, 2000);
// }

// function openStoryOverlay() {
//     const v = allVideos.submenuBg;

//     if (!v._loaded) {
//         v._loaded = true;
//         loadVideo(v);
//     }

//     v.play();

//     document.getElementById('overlay-story').classList.remove('d-none');
//     renderStoryCard();
//     fadeOutAudio(titleMusic, 1000);
//     fadeOutAudio(titleMusic2, 1000);
//     audios.infoScreenMusic.currentTime = 0;
//     audios.storyTextSpeechSound.currentTime = 0;
//     fadeInAudio(audios.infoScreenMusic, 2000, 0.2);
//     setTimeout(() => {
//         fadeInAudio(audios.storyTextSpeechSound, 200);
//     }, 2500);
//     audios.storyTextSpeechSound.addEventListener('ended', () => {
//         fadeAudioTo(audios.infoScreenMusic, 2000, 1);
//     });
// }

// function closeStoryOverlay() {
//     allVideos.submenuBg?.pause();
//     document.getElementById('overlay-story').classList.add('d-none');
//     fadeOutAudio(audios.infoScreenMusic, 1000);
//     fadeOutAudio(audios.storyTextSpeechSound, 1000);
//     titleMusic2.currentTime = 0;
//     fadeInAudio(titleMusic2, 2000);
// }


// function openControlsOverlay() {
//     const v = allVideos.submenuBg;

//     if (!v._loaded) {
//         v._loaded = true;
//         loadVideo(v);
//     }

//     v.play();

//     document.getElementById('overlay-controls').classList.remove('d-none');
//     renderControlsCard()
//     fadeOutAudio(titleMusic, 1000);
//     fadeOutAudio(titleMusic2, 1000);
//     audios.infoScreenMusic.currentTime = 0;
//     fadeInAudio(audios.infoScreenMusic, 2000);
// }

// function closeControlsOverlay() {
//     allVideos.submenuBg?.pause();
//     document.getElementById('overlay-controls').classList.add('d-none');
//     fadeOutAudio(audios.infoScreenMusic, 1000);
//     titleMusic2.currentTime = 0;
//     fadeInAudio(titleMusic2, 2000);
// }

// function openCreditsOverlay() {
//     const v = allVideos.submenuBg;

//     if (!v._loaded) {
//         v._loaded = true;
//         loadVideo(v);
//     }

//     v.play();

//     document.getElementById('overlay-credits').classList.remove('d-none');
//     renderCreditsCard();
//     fadeOutAudio(titleMusic, 1000);
//     fadeOutAudio(titleMusic2, 1000);
//     audios.infoScreenMusic.currentTime = 0;
//     fadeInAudio(audios.infoScreenMusic, 2000);
// }

// function closeCreditsOverlay() {
//     allVideos.submenuBg?.pause();
//     document.getElementById('overlay-credits').classList.add('d-none');
//     fadeOutAudio(audios.infoScreenMusic, 1000);
//     titleMusic2.currentTime = 0;
//     fadeInAudio(titleMusic2, 2000);
// }


// function renderStoryCard() {
//     let storyBox = document.getElementById('story-box');
//     storyBox.innerHTML = template3(storyText);
// }

// function renderControlsCard() {
//     let controlsBox = document.getElementById('controls-box');
//     controlsBox.innerHTML = template4();
// }

// function renderCreditsCard() {
//     let creditsBox = document.getElementById('credits-box');
//     creditsBox.innerHTML = template5();
// }



// function renderBigCard(nameCharacter) {
//     let bigCardBox = document.getElementById('big-card-box');
//     openBigBox();
//     const character = characters.find(element => element.name === nameCharacter);
//     if (character) bigCardBox.innerHTML = template2(character.name, character.text2);
//     character.music.currentTime = 0;
//     fadeOutAudio(audios.infoScreenMusic, 1000);
//     fadeInAudio(character.music, 2000, 0.2);
//     currentCharacterMusic = character.music;
//     currentCharacterSpeechSound = character.textSpeechSound;
//     character.textSpeechSound.currentTime = 0;
//     setTimeout(() => {
//         fadeInAudio(character.textSpeechSound, 200);
//     }, 2500);
//     currentCharacterSpeechSound.addEventListener('ended', () => {
//         fadeAudioTo(currentCharacterMusic, 2000, 1);
//     });
// }


// function renderCharacters() {
//     // document.getElementById('test-video').play();
//     let smallCardBox = document.getElementById('small-card-box');
//     smallCardBox.innerHTML = "";
//     characters.forEach(character => smallCardBox.innerHTML += template1(character.name, character.text));
// }

// function template1(characterName, characterText) {
//     return ` <div class="img-text-box" id="${characterName}" onclick="renderBigCard('${characterName}')">
//                 <div class="name-img-box">
//                     <span class="character-name">${characterName}</span>
//                     <img class="character-img" src="./assets/img/characters/${characterName}.webp" alt="">
//                 </div>
//                 <span class="character-text">${characterText}</span>
//             </div>`
// }

// function template2(characterName, characterText) {
//     return ` <div class="big__img-text-box" id="big-${characterName}">
//                 <div class="big__name-img-box">
//                     <span class="big__character-name">${characterName}</span>
//                     <img class="big__character-img" src="./assets/img/characters/${characterName}.webp" alt="">
//                 </div>
//                 <div class="big__character-text-box">
//                     <span class="big__character-text">${characterText}</span>
//                 </div>
//             </div>`
// }

// function template3(storyText) {
//     return ` <div class="story-box">
//                 <div class="story-text-box">
//                     <span class="story-text">${storyText}</span>
//                 </div>
//             </div>`
// }

// function template4() {
//     let controlsActionHtml = "";
//     let controlsKeyHtml = "";
//     let controlsMobileHtml = "";
//     let mobileIconClass = "";
//     controls.forEach(element => {
//         mobileIconClass = element.mobile === 'throw' ? `controls-mobile-throw`
//             : element.mobile === 'right2' || element.mobile === 'left2' ? `controls-mobile-action`
//                 : `controls-mobile-icon`
//         controlsActionHtml += `<span class="controls-text">${element.action}</span>`
//         controlsKeyHtml += `<img class="controls-img" src="./assets/icons/${element.key}.png" alt=""></img>`
//         controlsMobileHtml += `<div class="controls-mobile-icon-box">
//                                 <img class="${mobileIconClass}" src="./assets/icons/${element.mobile}.png" alt=""></img>
//                                </div>`
//     });

//     return ` <div class="story-box">
//                 <div class="controls-text-over-box">
//                     <div class="controls-action-box">
//                         <span >Action</span>
//                         ${controlsActionHtml}
//                     </div>
//                     <div class="controls-key-box">
//                         <img class="controls-first-img" src="./assets/icons/keyboard.png" alt="">
//                         ${controlsKeyHtml}
//                     </div>
//                     <div class="controls-mobile-box">
//                         <img class="controls-first-img2" src="./assets/icons/mobile.png" alt="">
//                         ${controlsMobileHtml}
//                     </div>
//                 </div>
//             </div>`
// }

// function template5() {

//     return ` <div class="story-box">
//                 <div class="story-text-box">               
//                     <div id="impressumContent">
//                         <h2 class="credits-title"><strong>Impressum / Legal Notice - Rise of El Brünö</strong></h2>
//                         <br>
//                         <br>
//                         <p class="credits-sub-title"><strong>Angaben gemäß § 5 TMG:</strong><p>
//                         <p class="credits-text">
//                         Nico Reckert<br>
//                         Am Park 4<br>
//                         39326 Zielitz<br>
//                         Deutschland</p>
//                         <br>
//                         <p class="credits-sub-title"><strong>Kontakt / Contact:</strong><br>
//                         <p class="credits-text">
//                         E-Mail: <a class="credits-links" href="mailto:n.r-86@gmx.de">n.r-86@gmx.de</a></p>


//                         <br>
//                         <h3 class="credits-title">Verantwortlich für den Inhalt / Responsible for Content</h3>
//                         <p class="credits-text">Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten verantwortlich.
//                         Nach §§ 8 bis 10 TMG bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
//                         oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
//                         Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>
//                         <br>
//                         <p class="credits-text">As a service provider, I am responsible for my own content on these pages according to § 7 para. 1 TMG.
//                         However, according to §§ 8 to 10 TMG, I am not obligated to monitor transmitted or stored third-party information.</p>


//                         <br>
//                         <h3 class="credits-title">Haftung für Links / Liability for Links</h3>
//                         <p class="credits-text">Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe.
//                         Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen.
//                         Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
//                         <br>
//                         <p class="credits-text">My offer contains links to external third-party websites over whose content I have no influence.
//                         Therefore, I cannot accept any liability for these external contents.
//                         The respective provider or operator of the pages is always responsible for the content of the linked pages.</p>


//                         <br>
//                         <h3 class="credits-title">Urheberrecht / Copyright</h3>
//                         <p class="credits-text">Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
//                         Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
//                         bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
//                         <br>
//                         <p class="credits-text">The content and works on these pages created by the site operator are subject to German copyright law.
//                         Duplication, processing, distribution, or any form of commercialization of such material beyond the scope
//                         of copyright law requires the prior written consent of the author or creator.</p>


//                         <br>
//                         <h3 class="credits-title">Credits</h3>
//                         <p class="credits-text">Sound Effects by <a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a><br>
//                         Music by <a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a><br>
//                         Icons by <a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a><br>
//                         Fonts by <a class="credits-links" href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> (locally hosted)</p>


//                         <br>
//                         <h3 class="credits-title">Datenschutz / Privacy</h3>
//                         <p class="credits-text">Dieses Webprojekt verarbeitet keine personenbezogenen Daten, setzt keine Cookies und nutzt keine Tracking- oder Analyse-Dienste.
//                         Eingebundene Schriftarten von Google Fonts werden ausschließlich lokal vom eigenen Server geladen.</p>
//                         <br>
//                         <p class="credits-text">This web project does not process personal data, use cookies, or employ any tracking or analytics tools.
//                         Embedded Google Fonts are hosted locally on the same server.</p>


//                         <br>
//                         <h3 class="credits-title">Nichtkommerzielles Projekt / Non-commercial Project</h3>
//                         <p class="credits-text">Dies ist ein privates, nichtkommerzielles Web-Game-Projekt, das ausschließlich zu Lern- und Unterhaltungszwecken erstellt wurde.</p>
//                         <br>
//                         <p class="credits-text">This is a private, non-commercial web game project created for educational and entertainment purposes only.</p>
//                     </div>
//                 </div>
//             </div>`
// }


window.addEventListener('contextmenu', e => e.preventDefault());

function openFullscreen(element) {
    const el = element || document.documentElement;

    if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
            console.warn("Fullscreen request denied:", err);
        });
    } else if (el.webkitRequestFullscreen) { // Safari
        try {
            el.webkitRequestFullscreen();
        } catch (err) {
            console.warn("Fullscreen request denied (webkit):", err);
        }
    } else if (el.msRequestFullscreen) { // alte IE/Edge
        try {
            el.msRequestFullscreen();
        } catch (err) {
            console.warn("Fullscreen request denied (ms):", err);
        }
    }
}

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        document.body.classList.add("fullscreen-active");
    } else {
        document.body.classList.remove("fullscreen-active");
    }
});

document.querySelectorAll(".move-button").forEach(btn => {
    // beim Drücken
    btn.addEventListener("touchstart", () => {
        btn.classList.add("hold");
        triggerPulse(btn);
    });
    btn.addEventListener("mousedown", () => {
        btn.classList.add("hold");
        triggerPulse(btn);
    });

    // beim Loslassen
    btn.addEventListener("touchend", () => btn.classList.remove("hold"));
    btn.addEventListener("mouseup", () => btn.classList.remove("hold"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("hold"));
});

function triggerPulse(button) {
    button.classList.remove("pulse");   // Reset
    void button.offsetWidth;            // Reflow erzwingt Neustart
    button.classList.add("pulse");      // Startet Animation
}