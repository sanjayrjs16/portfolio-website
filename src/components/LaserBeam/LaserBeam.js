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
    this.avatarPosY = this.startY + (this.beamLength / 2.5) * p.sin(this.angle);
    
    // Optional: Store the buffer within the class
    this.buffer = null;
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