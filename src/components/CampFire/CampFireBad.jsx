import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const CampfireBad = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let fireParticles = [];

      class FireParticle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.alpha = p.random(180, 255);
          this.size = p.random(10, 20);
          this.speed = p.random(1, 3);
        }

        update() {
          this.y -= this.speed;
          this.alpha -= 3;
        }

        display() {
          p.fill(255, 120, 0, this.alpha);
          p.noStroke();
          p.ellipse(this.x, this.y, this.size);
        }

        isDead() {
          return this.alpha <= 0;
        }
      }

      p.setup = () => {
        p.createCanvas(400, 400);
      };

      p.draw = () => {
        p.background(0);
        
        // Draw logs
        p.fill(139, 69, 19);
        p.rect(170, 300, 60, 20, 10);
        p.rect(190, 310, 60, 20, 10);

        // Add fire particles
        if (p.frameCount % 2 === 0) {
          fireParticles.push(new FireParticle(200, 290));
        }

        for (let i = fireParticles.length - 1; i >= 0; i--) {
          fireParticles[i].update();
          fireParticles[i].display();

          if (fireParticles[i].isDead()) {
            fireParticles.splice(i, 1);
          }
        }
      };
    };

    new p5(sketch, sketchRef.current);
  }, []);

  return <div ref={sketchRef} />;
};

export default CampfireBad;
