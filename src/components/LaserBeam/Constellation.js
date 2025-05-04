export class Constellation {
  constructor(p, centerX, centerY, pattern) {
    this.p = p;
    this.centerX = centerX;
    this.centerY = centerY;
    this.stars = [];
    this.edges = [];
    this.scale = p.random(180, 280);
    this.width = this.scale * 2;
    this.height = this.scale * 2;
    
    // Create stars
    pattern.pattern.forEach((pos, index) => {
      this.stars.push({
        x: centerX + (pos[0] - 0.5) * this.scale,
        y: centerY + (pos[1] - 0.5) * this.scale,
        size: p.random(2, 3),
        brightness: p.random(180, 255)
      });
    });
    
    // Create edges
    pattern.connections.forEach(conn => {
      this.edges.push({
        from: conn[0],
        to: conn[1],
        flowPhase: p.random(p.TWO_PI),
        flowSpeed: p.random(0.02, 0.04),
        glowIntensity: 0
      });
    });
  }

  isVisible() {
    return this.stars.some(star => (
      star.x > -50 && 
      star.x < this.p.width + 50 && 
      star.y > -50 && 
      star.y < this.p.height + 50
    ));
  }

  display(ctx = this.p) {
    if (!this.isVisible()) return;
    const p = ctx;
    
    p.push();
    this.edges.forEach(edge => {
      const from = this.stars[edge.from];
      const to = this.stars[edge.to];
      
      edge.flowPhase += edge.flowSpeed;
      edge.glowIntensity = (p.sin(edge.flowPhase) + 1) / 2;
      
      p.strokeWeight(0.5);
      p.stroke(200, 220, 255, 20);
      p.line(from.x, from.y, to.x, to.y);
      
      const gradient = p.drawingContext.createLinearGradient(
        from.x, from.y, to.x, to.y
      );
      
      const flowPos = (p.sin(edge.flowPhase) + 1) / 2;
      gradient.addColorStop(0, p.color(200, 220, 255, 10));
      gradient.addColorStop(Math.max(0, flowPos - 0.2), p.color(200, 220, 255, 10));
      gradient.addColorStop(flowPos, p.color(200, 220, 255, 60 * edge.glowIntensity));
      gradient.addColorStop(Math.min(1, flowPos + 0.2), p.color(200, 220, 255, 10));
      gradient.addColorStop(1, p.color(200, 220, 255, 10));
      
      p.drawingContext.strokeStyle = gradient;
      p.strokeWeight(1.5);
      p.line(from.x, from.y, to.x, to.y);
    });
    p.pop();
    
    this.stars.forEach(star => {
      p.push();
      p.noStroke();
      p.fill(255, star.brightness);
      p.circle(star.x, star.y, star.size);
      p.pop();
    });
  }

  // New method to draw to a specific buffer
  drawToBuffer(ctx) {
    const oldP = this.p;
    this.p = ctx;
    this.display();
    this.p = oldP;
  }
} 