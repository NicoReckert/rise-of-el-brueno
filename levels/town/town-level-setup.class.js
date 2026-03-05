import { LifeEnergyCharacterBar } from '../../classes/ui/life-energy-character-bar.class.js';
import { LifeEnergyBossBar } from '../../classes/ui/life-energy-boss-bar.class.js';
import { CoinBar } from '../../classes/ui/coin-bar.class.js';
import { BottleBar } from '../../classes/ui/bottle-bar.class.js';
import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { SpeechBubble } from '../../classes/ui/speech-bubble.class.js';
import { Endboss } from '../../classes/entities/endboss.class.js';
import { EndbossAttack } from '../../classes/effects/endboss-attack.class.js';
import { ComicPanel } from '../../classes/ui/comic-panel.class.js';
import { townEvents } from '../../events/town-level-events.js';
import { createTownLevel } from './town-level.js';

export class TownLevelSetup {
    constructor(world) {
        this.world = world;
        this.townLevel = createTownLevel({
            entityImages: this.world.entityImages,
            allAudios: this.world.allAudios
        });
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.townEvents = townEvents;
        this.world.camera_x = 0;
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);
        this.statusBar2 = new LifeEnergyBossBar(this.entityImages);
        this.coinBar = new CoinBar(this.entityImages);
        this.bottleBar = new BottleBar(this.entityImages);
        this.throwableObjects = [];
        const endboss = new Endboss(this.entityImages, this.allAudios, this.world);
        const soul = new AnimatedEntity(
            this.entityImages,
            'soul',
            200,
            200,
            endboss.x + (endboss.width / 2),
            endboss.y + 100
        );
        const tadeo = new AnimatedEntity(
            this.entityImages,
            'tadeo',
            150,
            150,
            17500, //1500
            515
        );
        const sollita = new AnimatedEntity(
            this.entityImages,
            'sollita',
            180,
            180,
            19000,
            480
        );
        const musician = new AnimatedEntity(
            this.entityImages,
            'musician',
            230,
            230,
            20000,
            435
        );

        this.characters = { endboss, soul, tadeo, sollita, musician };
        this.sounds = {
            taskCompletedSound: this.allAudios.taskCompletedSound,
            soulMusic: this.allAudios.soulMusic,
            soulSpeakSound: this.allAudios.soulSpeakSound,
            tadeosMusic: this.allAudios.tadeosMusic,
            enemyHurtSound: this.allAudios.enemyHurtSound,
            attackSound: this.allAudios.attackSound,
            newTaskSound: this.allAudios.newTaskSound,
            tadeoHoldStoneMusic: this.allAudios.tadeoHoldStoneMusic,
            musicianTownMusic: this.allAudios.musicianTownMusic,
            sollitasMusic: this.allAudios.sollitasMusic,
            endbossFlappingWingsSound: this.allAudios.endbossFlappingWingsSound,
            fireballChargeSound: this.allAudios.fireballChargeSound,
            airHitStunMusic: this.allAudios.airHitStunMusic,
            backgroundMusic: this.allAudios.backgroundMusic,
            sadMomentMusic: this.allAudios.sadMomentMusic,
            houseFireSound: this.allAudios.houseFireSound,
            healSound: this.allAudios.healSound,
            nayelisMusic: this.allAudios.nayelisMusic,
            nayelisSpiritSpeakSound: this.allAudios.nayelisSpiritSpeakSound,
            spiritAppearsSound: this.allAudios.spiritAppearsSound,
            nayelisSpiritSpeakSound_B: this.allAudios.nayelisSpiritSpeakSound_B,
            tadeosSpeakSound: this.allAudios.tadeosSpeakSound,
            stormHazardMusic: this.allAudios.stormHazardMusic,
            finalStormHazardMusic: this.allAudios.finalStormHazardMusic,
        };
        this.environment = {
            rockyDesertPedestal: new AnimatedEntity(this.entityImages, 'rockyDesertPedestal', 400, 400, 23300, 300),
            fire: new AnimatedEntity(this.entityImages, 'fire', 500, 500, 23455, 110),
            juanitoSpirit: new AnimatedEntity(this.entityImages, 'juanitoSpirit', 150, 150, 23455, 280),
            pollitoSpirit: new AnimatedEntity(this.entityImages, 'pollitoSpirit', 120, 120, 23450, 350),
            lolaSpirit: new AnimatedEntity(this.entityImages, 'lolaSpirit', 200, 200, 23295, 330),
            nayeliSpirit: new AnimatedEntity(this.entityImages, 'nayeliSpirit', 180, 180, 15500, 485),
            spiritEssence1: new AnimatedEntity(this.entityImages, "spiritEssence", 90, 90, 0, 0),
            spiritEssence2: new AnimatedEntity(this.entityImages, "spiritEssence", 90, 90, 0, 0),
            spiritEssence3: new AnimatedEntity(this.entityImages, "spiritEssence", 90, 90, 0, 0),
            macuahuitl: new AnimatedEntity(this.entityImages, "macuahuitl", 120, 120, 23350, 180),
            houseDestroyed: new AnimatedEntity(this.entityImages, "houseDestroyed", 900, 800, 2000, -50),
            stableDestroyed: new AnimatedEntity(this.entityImages, "stableDestroyed", 600, 600, 2720, 200),
            millDestroyed: new AnimatedEntity(this.entityImages, "millDestroyed", 1100, 800, 3200, -285),
        }

        this.environment.rockyDesertPedestal.opacity = 0;
        this.environment.nayeliSpirit.opacity = 0;
        this.environment.fire.isFlipped = false;
        this.environment.macuahuitl.isFlipped = false;
        this.environment.pollitoSpirit.isFlipped = false;
        this.environment.fire.updateAnimationState('idle', 1000 / 8);
        this.environment.houseDestroyed.updateAnimationState('idle', 1000 / 8);
        this.sounds.soulMusic.volume = 0;
        this.speechBubbles = {
            // bubbleFarm: new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.world.character, 'info'),
        };
        this.isNotificationPlay = false;
        this.endbossMusic = this.allAudios.endbossMusic;
        this.endbossMusic.volume = 0.6;
        this.endbossAlarmSound;
        this.endbossMusicIsPlayed = false;
        this.endbossAlarmSoundIsPlayed = false;
        this.endbossAttack = new EndbossAttack(this.entityImages, this.allAudios, this.world);
        this.backgroundMusic = document.getElementById('background-music');
        this.backgroundMusic.volume = 0.6;

        this.speechBubbles = [
            new SpeechBubble("Ein Bauernhof… völlig verwüstet.", this.world.character, 'speech', this.allAudios),
            new SpeechBubble("Hier hat jemand gewütet…", this.world.character, 'speech', this.allAudios),
            new SpeechBubble("Kratzspuren… Federn… und Blut.", this.world.character, 'speech', this.allAudios),
            new SpeechBubble("Ich darf keine Zeit verlieren.", this.world.character, 'speech', this.allAudios),
            new SpeechBubble("Hey Brünö bist du es?", this.characters.tadeo, 'speech', this.allAudios),
            new SpeechBubble("Ja ich bin es Brünö. Wer bist du?", this.world.character, 'speech', this.allAudios),
            new SpeechBubble("Ich bin Tadeo und Nayeli hat mich geschickt um dir zu helfen", this.characters.tadeo, 'speech', this.allAudios)
        ];
        this.speechBubblesNayeli = [
            new SpeechBubble("Brünö...", this.environment.nayeliSpirit, 'speech'),
            new SpeechBubble("Du kannst jetzt nicht aufgeben.", this.environment.nayeliSpirit, 'speech'),
            new SpeechBubble("Glaub an dich!", this.environment.nayeliSpirit, 'speech'),
            new SpeechBubble("Du bist nicht allein!", this.environment.nayeliSpirit, 'speech'),
            new SpeechBubble("Die Ahnen wachen über dich.", this.environment.nayeliSpirit, 'speech'),
        ];
        this.speechBubblesTadeo = [
            new SpeechBubble("Tonatiuh...", this.characters.tadeo, 'speech'),
            new SpeechBubble("Schütze uns!", this.characters.tadeo, 'speech'),
            new SpeechBubble("Gib uns deinen Schild!", this.characters.tadeo, 'speech'),
        ];

        this.speechBubblesTadeoAfraid = [
            new SpeechBubble("Oh oh… bitte nicht…", this.characters.tadeo, 'speech'),
            new SpeechBubble("Ähm… bleib bitte weg…", this.characters.tadeo, 'speech'),
            new SpeechBubble("Nein… nein… ganz ruhig…", this.characters.tadeo, 'speech'),
            new SpeechBubble("Das ist zu nah… viel zu nah…", this.characters.tadeo, 'speech'),
        ];

        this.speechBubblesTadeoPanic = [
            new SpeechBubble("AAAH! Hilfe!", this.characters.tadeo, 'speech'),
            new SpeechBubble("Weg! Weg! Weg!", this.characters.tadeo, 'speech'),
            new SpeechBubble("Nein!! Bitte!!", this.characters.tadeo, 'speech'),
            new SpeechBubble("HILFE!!", this.characters.tadeo, 'speech'),
        ];

        this.speechBubblesTadeoHelp = [
            new SpeechBubble("Hier, nimm zwei! Schnell!", this.characters.tadeo, 'speech'),
            new SpeechBubble("Ich hab noch welche… nimm die!", this.characters.tadeo, 'speech'),
            new SpeechBubble("Nicht ohne Flaschen! Bitte!", this.characters.tadeo, 'speech'),
        ];


        if (this.townLevel?.enemies) {
            this.townLevel.enemies.forEach(enemy => {
                enemy.world = this.world;
            });
        }
        this.townLevel.projectiles = [];
        this.popupTexts = [];
        this.panel = new ComicPanel(this.world.canvas, this.entityImages.tadeo?.stoneActivated ?? []);
        this.characters.sollita.isFlipped = false;
        this.isNearMusician = false;
        this.isNearSollita = false;
        this.isNearDestroyedHouse = false;

        this.endbossFlyPhase = 0;
        this.effects = [];

        // Spirits erstmal unsichtbar / geparkt (oder opacity 0)
        this.environment.juanitoSpirit.opacity = 0;
        this.environment.pollitoSpirit.opacity = 0;
        this.environment.lolaSpirit.opacity = 0;
        this.environment.spiritEssence1.opacity = 0;
        this.environment.spiritEssence2.opacity = 0;
        this.environment.spiritEssence3.opacity = 0;
        this.damageTexts = [];
        this.isTadeoAfraid = false;
        this.isTadeoPanic = false;
        this._tadeoHelpGivenEmpty = false;
        this._tadeoHelpResetArmed = false;
        this.tadeoSpeechLockUntil = 0;
        this.tadeoHelpUntil = 0;
        this._tadeoPanicProjIdx = 0;
        this._tadeoPanicNearIdx = 0;
        this._tadeoAfraidIdx = 0;
        this.tadeoPanicUntil = 0;
    }
}