/**
 * Displays animated popup text.
 */
export class PopupText {
  /**
   * Creates a new floating text instance.
   * @param {string} text Display text.
   * @param {number} x X position.
   * @param {number} y Y position.
   * @param {number} [duration=2000] Display duration in milliseconds.
   */
  constructor(text, x, y, duration = 2000) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.startTime = performance.now();
    this.duration = duration;
    this.active = true;
  }

  /**
   * Applies an ease-out cubic easing function.
   * @param {number} t Normalized time value.
   * @returns {number} Eased value.
   */
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Draws the floating text if it is active.
   * @param {CanvasRenderingContext2D} ctx Rendering context.
   * @param {number} now Current time value.
   * @returns {void}
   */
  draw(ctx, now) {
    if (!this.active) return;
    const state = this.computeAnimationState(now);
    if (!state) return;
    ctx.save();
    this.applyFloatingTextTransform(ctx, state);
    this.drawFloatingText(ctx);
    ctx.restore();
  }

  /**
   * Computes the current animation state.
   * @param {number} now Current time value.
   * @returns {{ offsetY: number, scale: number, opacity: number } | null} Animation state or null if inactive.
   */
  computeAnimationState(now) {
    const elapsed = now - this.startTime;
    if (elapsed > this.duration) { this.active = false; return null; }
    const progress = elapsed / this.duration;
    const offsetY = this.computeOffsetY(progress);
    const scale = this.computeScale(progress);
    const opacity = this.computeOpacity(progress);
    return { offsetY, scale, opacity };
  }

  /**
   * Computes the vertical offset for the animation.
   * @param {number} progress Animation progress value.
   * @returns {number} Vertical offset.
   */
  computeOffsetY(progress) {
    const baseOffset = -this.easeOutCubic(progress) * 60;
    const wave = Math.sin(progress * Math.PI * 2) * 5 * (1 - progress);
    return baseOffset + wave;
  }

  /**
   * Computes the scale for the animation.
   * @param {number} progress Animation progress value.
   * @returns {number} Scale value.
   */
  computeScale(progress) {
    return 1 + (1 - this.easeOutCubic(progress)) * 0.25;
  }

  /**
   * Computes the opacity for the animation.
   * @param {number} progress Animation progress value.
   * @returns {number} Opacity value.
   */
  computeOpacity(progress) {
    if (progress < 0.7) return 1;
    const fadeP = (progress - 0.7) / 0.3;
    return 1 - this.easeOutCubic(fadeP);
  }

  /**
   * Applies the floating text transform.
   * @param {CanvasRenderingContext2D} ctx Rendering context.
   * @param {{ offsetY: number, scale: number, opacity: number }} state Animation state.
   * @returns {void}
   */
  applyFloatingTextTransform(ctx, state) {
    ctx.globalAlpha = state.opacity;
    ctx.translate(this.x, this.y + state.offsetY);
    ctx.scale(state.scale, state.scale);
  }

  /**
   * Draws the floating text.
   * @param {CanvasRenderingContext2D} ctx Rendering context.
   * @returns {void}
   */
  drawFloatingText(ctx) {
    const gradient = ctx.createLinearGradient(-80, 0, 80, 0);
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(1, "orange");
    ctx.font = "bold 48px Adventure";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(this.text, 0, 0);
  }
}