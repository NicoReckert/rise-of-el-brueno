class PopupText {
  constructor(text, x, y, duration = 2000) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.startTime = performance.now();
    this.duration = duration;
    this.active = true;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3); // weiches easing
  }

  draw(ctx, now) {
    if (!this.active) return;

    const elapsed = now - this.startTime;
    if (elapsed > this.duration) {
      this.active = false;
      return;
    }

    const progress = elapsed / this.duration;

    // Y-Bewegung: fliegt hoch + leichte Welle
    const baseOffset = -this.easeOutCubic(progress) * 60;
    const wave = Math.sin(progress * Math.PI * 2) * 5 * (1 - progress);
    const offsetY = baseOffset + wave;

    // Scale: am Anfang etwas größer, federt sanft zurück
    const scale = 1 + (1 - this.easeOutCubic(progress)) * 0.25;

    // Opacity: smoother Fade out
    const opacity = progress < 0.7 ? 1 : 1 - this.easeOutCubic((progress - 0.7) / 0.3);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(this.x, this.y + offsetY);
    ctx.scale(scale, scale);

    // Glow
    ctx.shadowColor = "orange";
    ctx.shadowBlur = 15;

    // Farbverlauf
    const gradient = ctx.createLinearGradient(-80, 0, 80, 0);
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(1, "orange");

    ctx.font = "bold 48px Adventure";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = gradient;

    // Weicher schwarzer Schatten statt harter Outline
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(this.text, 0, 0);

    ctx.restore();

  }
}
