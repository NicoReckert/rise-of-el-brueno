import { AnimatedEntity } from './animated-entity.class.js';
import { allVideos } from '../media-store.js';

export class NewWeaponLevelSetup {
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.environment = {
            macuahuitl: new AnimatedEntity(this.entityImages, 'macuahuitl', 300, 300, 700, 300) //412 x 412, 650, 250
        };
        this.sounds = {
            newWeaponMusic: this.allAudios.newWeaponMusic,
            newWeaponSpeakSound: this.allAudios.newWeaponSpeakSound
        };
        this.sounds.newWeaponMusic.volume = 0.8;
        this.environment.macuahuitl.isFlipped = false;
        this.video = allVideos.new_weapon_bg_video || null;
    }
}