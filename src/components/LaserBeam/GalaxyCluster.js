export class GalaxyCluster {
  constructor(p) {
    this.p = p;
    this.x = p.random(p.width);
    this.y = p.random(p.height);
    this.particles = [];
    
    const galaxyTypes = [
      { 
        primary: [255, 250, 255],
        secondary: [155, 150, 150],
        size: p.random(80, 120),
        density: 80
      },
      { 
        primary: [255, 220, 180],
        secondary: [180, 140, 100],
        size: p.random(60, 100),
        density: 60
      }
    ];
    
    const type = p.random(galaxyTypes);
    this.size = type.size;
    
    for (let i = 0; i < type.density; i++) {
      const angle = p.random(p.TWO_PI);
      const radius = p.random(this.size);
      
      this.particles.push({
        x: p.cos(angle) * radius,
        y: p.sin(angle) * radius,
        size: p.random(1, 3),
        color: p.random() > 0.7 ? type.primary : type.secondary
      });
    }
  }

  isVisible() {
    const buffer = this.size;
    return (
      this.x > -buffer && 
      this.x < this.p.width + buffer && 
      this.y > -buffer && 
      this.y < this.p.height + buffer
    );
  }

  display() {
    if (!this.isVisible()) return;
    const p = this.p;
    
    this.particles.forEach(particle => {
      p.push();
      p.translate(this.x + particle.x, this.y + particle.y);
      p.noStroke();
      p.fill(particle.color[0], particle.color[1], particle.color[2], 150);
      p.circle(0, 0, particle.size);
      p.pop();
    });
  }
} 