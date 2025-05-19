export class LaserBeam {
  constructor(p, options = {}) {
    this.p = p;
    
    // Default values that can be overridden with options
    this.startX = options.startX || 0;
    this.startY = options.startY || p.height / 2;
    this.endX = options.endX || p.width;
    this.endY = options.endY || p.height / 3;
    this.thickness = options.thickness || 50;
    
    // Calculate beam angle and properties
    this.angle = p.atan2(this.endY - this.startY, this.endX - this.startX);
    this.beamLength = p.dist(this.startX, this.startY, this.endX, this.endY);
    
    // Avatar position (center of beam)
    this.avatarPosX = this.startX + (this.beamLength / 2) * p.cos(this.angle);
    this.avatarPosY = this.startY + (this.beamLength / 2.5 ) * p.sin(this.angle);
    
    // Optional: Store the buffer within the class
    this.buffer = null;
    this.flickerPhase = 1; // 1: flickering, 2: stabilizing, 3: on
    this.flickerTimer = 0;
    this.flickerInterval = 400; // ms, start with long interval
    this.flickerCount = 0;
    this.isVisible = false;
    this.isStatic = false;
    this.flickerStartTime = null;
    
  }
  get hasFlickerCompleted() {
    return this.isStatic && this.isVisible;
  }
  startFlicker() {
    this.flickerPhase = 1;
    this.flickerTimer = 0;
    this.flickerInterval = 400;
    this.flickerCount = 0;
    this.isVisible = false;
    this.isStatic = false;
    this.flickerStartTime = this.p.millis();
  }

  updateFlicker() {
    if (this.isStatic) return;

    if (this.flickerStartTime === null) {
      this.flickerStartTime = this.p.millis();
    }

    if (this.p.millis() - this.flickerTimer > this.flickerInterval) {
      this.flickerTimer = this.p.millis();
      this.isVisible = !this.isVisible;
      if (!this.isVisible) {
        this.flickerCount++;
        if (this.flickerInterval > 80) {
          this.flickerInterval *= 0.7;
        }
      }
      if (this.flickerCount > 10) {
        this.isVisible = true;
        this.isStatic = true;
      }
    }
  }

  displayFlicker(ctx = this.p) {
    if (this.isVisible && !this.isStatic) {
      ctx.push();
      ctx.drawingContext.globalAlpha = this.p.random(0.5, 1);
      // Smooth sine wave
//       const flickerAlpha = 0.6 + 0.4 * Math.sin(this.p.millis() / 100);
// ctx.drawingContext.globalAlpha = flickerAlpha;

      this.display(ctx);
      ctx.pop();
    }
  }
  
  // Create a buffer with the static laser beam
  createBuffer() {
    const p = this.p;
    this.buffer = p.createGraphics(p.width, p.height);
    this.drawToBuffer(this.buffer);
    return this.buffer;
  }
  
  // Draw the laser beam to a specific buffer
  drawToBuffer(buffer) {
    const p = this.p; // Reference to p5 instance
    
    // Draw laser beam
    for (let i = 0; i < this.thickness; i++) {
      const alpha = p.map(i, 0, this.thickness, 255, 0);
      const color = p.lerpColor(
        p.color(255, 255, 255, alpha),
        p.color(255, 65, 240, alpha),
        i / this.thickness
      );
      
      buffer.stroke(color);
      buffer.strokeWeight(2);
      
      buffer.line(
        this.startX, 
        this.startY + i, 
        this.endX, 
        this.endY + i
      );
      buffer.line(
        this.startX, 
        this.startY - i, 
        this.endX, 
        this.endY - i
      );
    }
  }
  
  // Get avatar position (useful for other components)
  getAvatarPosition() {
    return {
      x: this.avatarPosX,
      y: this.avatarPosY
    };
  }
  
  // Display the pre-rendered buffer
  display(ctx) {
    if (this.buffer) {
      ctx.image(this.buffer, 0, 0);
    } else {
      // Fallback to direct drawing if buffer wasn't created
      this.drawToBuffer(ctx);
    }
  }
  
  // Resize handler
  resize(width, height) {
    // Update dimensions if needed
    this.endX = width;
    this.startY = height / 2;
    this.endY = height / 3;
    
    // Recalculate properties
    this.angle = this.p.atan2(this.endY - this.startY, this.endX - this.startX);
    this.beamLength = this.p.dist(this.startX, this.startY, this.endX, this.endY);
    this.avatarPosX = this.startX + (this.beamLength / 2) * this.p.cos(this.angle);
    this.avatarPosY = this.startY + (this.beamLength / 2) * this.p.sin(this.angle);
    
    // Recreate buffer if it exists
    if (this.buffer) {
      this.buffer = this.p.createGraphics(width, height);
      this.drawToBuffer(this.buffer);
    }
  }
} 