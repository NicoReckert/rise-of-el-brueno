export class VideoManager {
    constructor() {
        this.videos = {};
    }

    addVideos(map) {
        Object.assign(this.videos, map);
    }

    get(name) {
        return this.videos[name];
    }

    play(name, opts = {}) {
        const v = this.videos[name];
        if (!v) return;
        if (opts.loop !== undefined) v.loop = opts.loop;
        if (opts.muted !== undefined) v.muted = opts.muted;
        v.play().catch(() => { });
    }
}
