import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const CampfireOptimized = () => {
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
          this.element = document.createElement('div');
          this.element.className = 'fire-particle';
          this.element.style.width = `${this.size}px`;
          this.element.style.height = `${this.size}px`;
          this.element.style.backgroundColor = `rgba(255, 120, 0, ${this.alpha / 255})`;
          this.element.style.position = 'absolute';
          this.element.style.left = `${this.x}px`;
          this.element.style.top = `${this.y}px`;
          this.element.style.borderRadius = '50%';
          this.element.style.transform = `translateY(0px)`;
          sketchRef.current.appendChild(this.element);
        }

        update() {
          this.element.style.transform = `translateY(-${this.speed}px) scale(1.1)`;
          this.alpha -= 3;
          this.element.style.opacity = this.alpha / 255;
        }

        isDead() {
          return this.alpha <= 0;
        }

        remove() {
          this.element.remove();
        }
      }

      p.setup = () => {
        p.createCanvas(400, 400);
        sketchRef.current.style.position = 'relative';
      };

      p.draw = () => {
        p.clear();

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

          if (fireParticles[i].isDead()) {
            fireParticles[i].remove();
            fireParticles.splice(i, 1);
          }
        }
      };
    };

    new p5(sketch, sketchRef.current);
  }, []);

  return <div ref={sketchRef} />;
};

export default CampfireOptimized;
