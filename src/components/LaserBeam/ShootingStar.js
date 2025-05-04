export class ShootingStar {
  constructor(p, isFar = false) {
    this.p = p;
    this.reset(isFar);
    this.isFar = isFar;
  }

  reset(isFar) {
    const p = this.p;
    // Start from a random edge of the screen
    const edge = Math.floor(p.random(4));
    this.angle = p.random(p.TWO_PI);
    this.speed = isFar ? p.random(0.5, 1) : p.random(15, 25);
    this.length = isFar ? p.random(20, 40) : p.random(100, 500);
    this.alpha = isFar ? p.random(100, 150) : p.random(150, 200);
    
    switch(edge) {
      case 0: // top
        this.x = p.random(p.width);
        this.y = -this.length;
        break;
      case 1: // right
        this.x = p.width + this.length;
        this.y = p.random(p.height);
        break;
      case 2: // bottom
        this.x = p.random(p.width);
        this.y = p.height + this.length;
        break;
      case 3: // left
        this.x = -this.length;
        this.y = p.random(p.height);
        break;
    }
    
    this.dx = p.cos(this.angle) * this.speed;
    this.dy = p.sin(this.angle) * this.speed;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    
    // Check if off screen
    if (this.x < -this.length || this.x > this.p.width + this.length ||
      this.y < -this.length || this.y > this.p.height + this.length) {
      this.reset(this.isFar);
    }
  }

  display() {
    const p = this.p;
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);
    
    // Draw tail gradient
    for (let i = 0; i < this.length; i++) {
      const alpha = p.map(i, 0, this.length, this.alpha, 0);
      p.stroke(255, alpha);
      p.line(0, 0, -1, 0);
      p.translate(-1, 0);
    }
    p.pop();
  }
} 