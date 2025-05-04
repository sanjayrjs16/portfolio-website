export class Star {
  constructor(p, type = 'normal') {
    this.p = p;
    this.x = p.random(p.width);
    this.y = p.random(p.height);
    this.type = type;
    
    // Different properties based on star type
    switch(type) {
      case 'large':
        this.size = p.random(2, 2.2);
        this.twinkleSpeed = p.random(0.03, 0.06);
        this.color = this.getRandomStarColor(true);
        this.glowSize = this.size * 5;
        this.layers = 4;
        break;
      case 'medium':
        this.size = p.random(1, 2);
        this.twinkleSpeed = p.random(0.02, 0.04);
        this.color = this.getRandomStarColor(false);
        this.glowSize = this.size * 3;
        this.layers = 3;
        break;
      default: // small stars
        this.size = p.random(0.2, 0.8);
        this.twinkleSpeed = p.random(0.01, 0.03);
        this.color = p.color(255);
        this.glowSize = this.size * 2;
        this.layers = 2;
    }
    
    this.brightness = p.random(150, 255);
    this.angle = p.random(p.TWO_PI);
    this.baseAlpha = p.random(150, 255);
    this.shouldTwinkle = p.random() < 0.6;
  }

  getRandomStarColor(bright = false) {
    const colors = bright ? [
      [255, 200, 150],  // Warm white
      [200, 220, 255],  // Blue white
      [255, 180, 180],  // Reddish
      [180, 255, 180],  // Greenish
      [255, 255, 200]   // Yellow white
    ] : [
      [255, 255, 255],  // Pure white
      [200, 200, 255],  // Slight blue
      [255, 200, 200]   // Slight red
    ];
    
    const color = this.p.random(colors);
    return this.p.color(color[0], color[1], color[2]);
  }

  twinkle() {
    if (this.shouldTwinkle) {
      this.angle += this.twinkleSpeed;
      this.brightness = this.p.map(this.p.sin(this.angle), -1, 1, 150, 255);
    }
  }

  isVisible() {
    const buffer = this.glowSize * 2;
    return (
      this.x > -buffer && 
      this.x < this.p.width + buffer && 
      this.y > -buffer && 
      this.y < this.p.height + buffer
    );
  }

  display(ctx = this.p) {
    if (!this.isVisible()) return;
    const p = ctx;  // Use the provided context or fall back to this.p
    p.push();
    p.noStroke();
    
    for (let i = this.layers; i > 0; i--) {
      const layerSize = this.glowSize * (i / this.layers);
      const layerAlpha = (this.brightness / this.layers) * (i / this.layers);
      
      const outerGlow = p.color(
        p.red(this.color),
        p.green(this.color),
        p.blue(this.color),
        layerAlpha * 0.3
      );
      p.fill(outerGlow);
      p.circle(this.x, this.y, layerSize);
    }
    
    const coreSize = this.size * 0.8;
    
    const haloColor = p.color(
      p.red(this.color),
      p.green(this.color),
      p.blue(this.color),
      this.brightness * 0.5
    );
    p.fill(haloColor);
    p.circle(this.x, this.y, this.size * 1.2);
    
    const coreColor = p.color(255, 255, 255, this.brightness);
    p.fill(coreColor);
    p.circle(this.x, this.y, coreSize);
    
    p.drawingContext.shadowBlur = this.size * 2;
    p.drawingContext.shadowColor = p.color(
      p.red(this.color),
      p.green(this.color),
      p.blue(this.color),
      this.brightness * 0.5
    );
    
    p.pop();
  }

  // New method to draw to a specific buffer
  drawToBuffer(ctx) {
    const oldP = this.p;
    this.p = ctx;
    this.display();
    this.p = oldP;
  }
} 