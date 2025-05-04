export class RectFragment {
  constructor(p, laserBeam) {
    this.p = p;
    this.laserBeam = laserBeam;
    this.active = true;
    this.reset();
  }
  
  reset() {
    const { p, laserBeam } = this;
    this.width = p.random(50, 100);
    this.height = p.random(25, 65);
    this.opacity = p.random(40, 205);
    this.speed = p.random(2, 5);
    
    const isAbove = p.random() > 0.5;
    this.offset = isAbove
      ? p.random(60, 90)
      : p.random(-90, -60);
    this.x = laserBeam.startX;
    this.y = laserBeam.startY + this.offset;
    this.active = true;
  }

  isVisible() {
    const { p } = this;
    return (
      this.x > -this.width &&
      this.x < p.width + this.width &&
      this.y > -this.height &&
      this.y < p.height + this.height
    );
  }

  update() {
    const { p, laserBeam } = this;
    this.x += this.speed;
    this.y = laserBeam.startY +
             this.offset +
             ((this.x / p.width) *
              (laserBeam.endY - laserBeam.startY));
    
    if (!this.isVisible()) this.active = false;
  }

  drawToBuffer(ctx) {
    this.display(ctx);
  }

  display(ctx = this.p) {
    if (!this.active) return;
    
    ctx.push();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.laserBeam.angle);
    ctx.fill(128, 0, 128, this.opacity);
    ctx.noStroke();
    ctx.rectMode(ctx.CENTER);
    ctx.rect(0, 0, this.width, this.height);
    ctx.pop();
  }
} 