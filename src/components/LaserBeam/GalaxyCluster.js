export class GalaxyCluster {
  constructor(p) {
    this.p = p;
    this.x = p.random(p.width);
    this.y = p.random(p.height);
    this.particles = [];

    const galaxyTypes = [
      { kind: 'spiral', primary: [255,250,255], secondary: [155,150,150], size: p.random(80,120), density: 80, arms: 2 },
      { kind: 'spiral', primary: [255,220,180], secondary: [180,140,100], size: p.random(60,100), density: 60, arms: 3 },
      { kind: 'barredSpiral', primary: [220,220,255], secondary: [140,140,200], size: p.random(70,110), density: 90, arms: 2 },
      { kind: 'ring',    primary: [200,200,255], secondary: [150,150,200], size: p.random(50,90),  density: 70 },
      { kind: 'elliptical', primary: [240,240,240], secondary: [180,180,180], size: p.random(70,110), density: 100 },
      { kind: 'lenticular', primary: [230,220,200], secondary: [160,140,120], size: p.random(60,100), density: 80 },
      { kind: 'irregular', primary: [255,180,200], secondary: [200,120,150], size: p.random(60,100), density: 90 },
      { kind: 'starburst', primary: [255,255,200], secondary: [255,200,100], size: p.random(50,80), density: 100 }
    ];

    const type = p.random(galaxyTypes);
    this.type = type.kind;
    this.size = type.size;
    this.arms = type.arms || 0;

    for (let i = 0; i < type.density; i++) {
      let angle, radius;
      switch(type.kind) {
        case 'spiral':
          const armAngle = (i % this.arms) * (p.TWO_PI / this.arms);
          angle = armAngle + p.randomGaussian(0, 0.4);
          radius = this.size * Math.sqrt(p.random());
          break;
        case 'barredSpiral':
          const barLen = this.size * 0.5;
          if (p.random() < 0.3) {
            angle = p.random() < 0.5 ? 0 : p.PI;
            radius = p.random(-barLen, barLen);
          } else {
            const spiralArm = (i % this.arms) * (p.TWO_PI / this.arms);
            angle = spiralArm + p.randomGaussian(0, 0.5) + radius/this.size;
            radius = this.size * Math.sqrt(p.random());
          }
          break;
        case 'ring':
          angle = p.random(p.TWO_PI);
          radius = this.size * 0.7 + p.randomGaussian(0, this.size * 0.1);
          break;
        case 'elliptical':
          const theta = p.random(p.TWO_PI);
          const a = this.size;
          const b = this.size * 0.6;
          radius = p.sqrt(p.sq(a * p.cos(theta)) + p.sq(b * p.sin(theta))) * p.random(0.8,1);
          angle = theta;
          break;
        case 'lenticular':
          angle = p.random(p.TWO_PI);
          radius = this.size * Math.sqrt(p.random());
          break;
        case 'starburst':
          angle = p.random(p.TWO_PI);
          radius = p.randomGaussian(0, this.size * 0.3);
          break;
        default: // irregular
          angle = p.random(p.TWO_PI);
          radius = this.size * p.random();
          if (p.random() < 0.3) radius *= p.random(0.3, 0.6);
      }

      const sz = p.random(1,3);
      const col = p.random() < 0.3 ? type.primary : type.secondary;
      const alpha = p.map(radius, 0, this.size, 220, 50);

      this.particles.push({
        x: p.cos(angle) * radius,
        y: p.sin(angle) * radius,
        size: sz,
        color: col,
        alpha
      });
    }
  }

  isVisible() {
    const buf = this.size;
    return (
      this.x > -buf &&
      this.x < this.p.width + buf &&
      this.y > -buf &&
      this.y < this.p.height + buf
    );
  }

  display(ctx = this.p) {
    if (!this.isVisible()) return;
    const p = ctx;

    this.particles.forEach(pt => {
      p.push();
      p.translate(this.x + pt.x, this.y + pt.y);
      p.noStroke();
      p.fill(pt.color[0], pt.color[1], pt.color[2], pt.alpha);
      p.circle(0, 0, pt.size);
      p.pop();
    });
  }

  drawToBuffer(ctx) {
    const oldP = this.p;
    this.p = ctx;
    this.display();
    this.p = oldP;
  }
}
