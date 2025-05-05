export class Constellation {
    constructor(p, centerX, centerY, pattern) {
      this.p = p;
      this.centerX = centerX;
      this.centerY = centerY;
      this.stars = [];
      this.edges = [];
      this.scale = p.random(180, 280);
      
      // Create stars
      pattern.pattern.forEach(pos => {
        this.stars.push({
          x: centerX + (pos[0] - 0.5) * this.scale,
          y: centerY + (pos[1] - 0.5) * this.scale,
          size: p.random(2, 3),
          brightness: p.random(180, 255)
        });
      });
      
      // Create edges
      pattern.connections.forEach(conn => {
        this.edges.push({ from: conn[0], to: conn[1] });
      });
    }
  
    isVisible() {
      return this.stars.some(s =>
        s.x > -50 && s.x < this.p.width + 50 &&
        s.y > -50 && s.y < this.p.height + 50
      );
    }
  
    display(ctx = this.p) {
      if (!this.isVisible()) return;
      const p = ctx;
      
      // ——— draw glowing lines behind each connection ———
      p.push();
      p.stroke(200, 220, 255, 30);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 140;
      p.drawingContext.shadowColor = 'rgba(200,220,255,0.5)';
      this.edges.forEach(edge => {
        const A = this.stars[edge.from];
        const B = this.stars[edge.to];
        p.line(A.x, A.y, B.x, B.y);
      });
      p.pop();
      
      // ——— draw crisp lines on top ———
      p.push();
      p.stroke(200, 220, 255, 200);
      p.strokeWeight(0.2);
      p.drawingContext.shadowBlur = 0;
      this.edges.forEach(edge => {
        const A = this.stars[edge.from];
        const B = this.stars[edge.to];
        p.line(A.x, A.y, B.x, B.y);
      });
      p.pop();
      
      // ——— draw each star with a soft halo behind it ———
      this.stars.forEach(star => {
        p.push();
        // halo
        p.noStroke();
        p.fill(200, 220, 255, 20);
        p.circle(star.x, star.y, star.size * 6);
        p.pop();
        
        p.push();
        // core
        p.noStroke();
        p.fill(255, star.brightness);
        p.circle(star.x, star.y, star.size);
        p.pop();
      });
    }
  
    drawToBuffer(ctx) {
      const old = this.p;
      this.p = ctx;
      this.display();
      this.p = old;
    }
  }
  