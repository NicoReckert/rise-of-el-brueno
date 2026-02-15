export class WorldRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    addObject(objectArray) {
        objectArray.forEach(obj => this.addToWorld(obj));
    }

    addToWorld(object) {
        if (!object || !object.img) return;
        const flipped = !!(object.isFlipped ?? false);
        const flippedNPC = !!(object.isNpcFlipped ?? false);
        const isFlipped = flipped || flippedNPC;
        const off = Object.assign(
            { left: 0, right: 0, top: 0, bottom: 0 },
            object.offset || {}
        );
        const drawOff = Object.assign(
            { x: 0, y: 0, flipX: 0 },
            object.drawOffset || {}
        );
        const dx = drawOff.x;
        const dy = drawOff.y;
        const fx = drawOff.flipX;
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = object.opacity !== undefined ? object.opacity : 1;
        if (isFlipped) {
            const tx = Math.round(object.x + object.width + dx + fx);
            const ty = Math.round(object.y + dy);
            ctx.translate(tx, ty);
            ctx.scale(-1, 1);
            this.drawSprite(ctx, object, 0, 0);
            if (object.isGamecharacter) {
                this.drawCharacterDebugFlipped(ctx, object, off);
            }
        } else {
            const drawX = Math.round(object.x + dx);
            const drawY = Math.round(object.y + dy);
            this.drawSprite(ctx, object, drawX, drawY);
            if (object.isGamecharacter) {
                this.drawCharacterDebug(ctx, object, off, drawX, drawY);
            }
        }
        ctx.restore();
    }

    drawSprite(ctx, object, dx, dy) {
        const { img, width, height, frameSource } = object;
        if (frameSource) {
            ctx.drawImage(
                img,
                frameSource.sx,
                frameSource.sy,
                frameSource.sw,
                frameSource.sh,
                dx,
                dy,
                width,
                height
            );
        } else {
            ctx.drawImage(img, dx, dy, width, height);
        }
    }

    drawCharacterDebug(ctx, object, off, x, y) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, object.width, object.height);
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(
            x + off.left,
            y + off.top,
            object.width - off.left - off.right,
            object.height - off.top - off.bottom
        );
        if (object.attackHitbox?.active) {
            const hb = object.attackHitbox;
            const wA = object.width - hb.left - hb.right;
            const hA = object.height - hb.top - hb.bottom;
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(x + hb.left, y + hb.top, wA, hA);
        }
    }

    drawCharacterDebugFlipped(ctx, object, off) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(0, 0, object.width, object.height);
        const w = object.width - off.left - off.right;
        const h = object.height - off.top - off.bottom;
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(off.left, off.top, w, h);
        if (object.attackHitbox?.active) {
            const hb = object.attackHitbox;
            const wA = object.width - hb.left - hb.right;
            const hA = object.height - hb.top - hb.bottom;
            const attackX = object.width - hb.right - wA;
            const attackY = hb.top;

            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(attackX, attackY, wA, hA);
        }
    }
}