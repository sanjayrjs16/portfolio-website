import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const SpaceBackground = ({ children }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let stars = [];
      let galaxies = [];
      let farShootingStars = [];
      let shootingStars = [];

      // Star class
      class Star {
        constructor(type = 'normal') {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.type = type;
          
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
            default:
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

        // ... existing Star methods ...
      }

      // Galaxy class
      class GalaxyCluster {
        // ... existing GalaxyCluster code ...
      }

      // ShootingStar class
      class ShootingStar {
        // ... existing ShootingStar code ...
      }

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.angleMode(p.DEGREES);

        // Initialize stars
        for (let i = 0; i < 1000; i++) {
          if (i < 20) stars.push(new Star('large'));
          else if (i < 100) stars.push(new Star('medium'));
          else stars.push(new Star('normal'));
        }

        // Initialize galaxies
        for (let i = 0; i < 8; i++) {
          galaxies.push(new GalaxyCluster());
        }

        // Initialize shooting stars
        for (let i = 0; i < 3; i++) {
          shootingStars.push(new ShootingStar(false));
        }
        for (let i = 0; i < 5; i++) {
          farShootingStars.push(new ShootingStar(true));
        }
      };

      p.draw = () => {
        p.background(0);

        // Draw far shooting stars
        farShootingStars.forEach(star => {
          star.update();
          star.display();
        });

        // Draw galaxies
        galaxies.forEach(galaxy => galaxy.display());

        // Draw stars
        stars.forEach(star => {
          star.twinkle();
          star.display();
        });

        // Draw close shooting stars
        shootingStars.forEach(star => {
          star.update();
          star.display();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    const myP5 = new p5(sketch, sketchRef.current);
    return () => myP5.remove();
  }, []);

  return (
    <div className="space-background" style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <div ref={sketchRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }} />
      <div className="content-layer" style={{
        position: 'relative',
        zIndex: 2
      }}>
        {children}
      </div>
    </div>
  );
};

export default SpaceBackground; 