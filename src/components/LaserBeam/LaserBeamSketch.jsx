import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import PortalBlob from '../PortalBlob';
import SocialIcons from '../SocialIcons/SocialIcons';

const LaserBeamSketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      const deviceCapability = {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isLowEnd: window.devicePixelRatio < 1.5 || navigator.hardwareConcurrency <= 4,
        isDesktopMode: window.innerWidth > window.innerHeight && /Android|webOS|iPhone|iPad/i.test(navigator.userAgent)
      };

      const shouldReduceEffects = deviceCapability.isMobile || deviceCapability.isLowEnd;

      let rectangles = [];
      let stars = [];
      let galaxies = [];
      let nebulae = [];
      let scrollOffset = 0;
      let constellations = [];
      let lastDrawTime = 0;

      // First, let's define our constellation patterns
      const CONSTELLATION_PATTERNS = {
        ursa_major: { // Big Dipper/Great Bear
          name: "Ursa Major",
          pattern: [
            [0.2, 0.3], [0.3, 0.35], [0.4, 0.4], [0.5, 0.45], 
            [0.6, 0.4], [0.7, 0.35], [0.75, 0.25]
          ],
          connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
        },
        orion: {
          name: "Orion",
          pattern: [
            [0.5, 0.2], [0.45, 0.3], [0.55, 0.3], // Belt
            [0.4, 0.1], [0.6, 0.1], // Shoulders
            [0.35, 0.4], [0.65, 0.4], // Feet
            [0.5, 0.15], // Head
          ],
          connections: [[0,1], [1,2], [3,1], [4,2], [1,5], [2,6], [3,7], [4,7]]
        },
        cassiopeia: {
          name: "Cassiopeia",
          pattern: [
            [0.3, 0.3], [0.4, 0.2], [0.5, 0.3], [0.6, 0.2], [0.7, 0.3]
          ],
          connections: [[0,1], [1,2], [2,3], [3,4]]
        },
        scorpius: {
          name: "Scorpius",
          pattern: [
            [0.3, 0.2], [0.35, 0.3], [0.4, 0.4], [0.45, 0.5],
            [0.5, 0.6], [0.55, 0.7], [0.6, 0.75], [0.65, 0.73]
          ],
          connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7]]
        }
      };

      // Enhanced Star class
      class Star {
        constructor(type = 'normal') {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.type = type;
          
          // Different properties based on star type
          switch(type) {
            case 'large':
              this.size = p.random(2, 2.2);
              this.twinkleSpeed = p.random(0.03, 0.06);
              this.color = this.getRandomStarColor(true);
              this.glowSize = this.size * 5; // Increased glow size
              this.layers = 4; // More layers for larger stars
              break;
            case 'medium':
              this.size = p.random(1, 2);
              this.twinkleSpeed = p.random(0.02, 0.04);
              this.color = this.getRandomStarColor(false);
              this.glowSize = this.size * 3;
              this.layers = 3;
              break;
            default: // small stars
              this.size = p.random(0.2, 0.8);
              this.twinkleSpeed = p.random(0.01, 0.03);
              this.color = p.color(255);
              this.glowSize = this.size * 2;
              this.layers = 2;
          }
          
          this.brightness = p.random(150, 255);
          this.angle = p.random(p.TWO_PI);
          this.baseAlpha = p.random(150, 255);
          this.shouldTwinkle = p.random() < 0.6; // 60% of stars will twinkle
        }

        getRandomStarColor(bright = false) {
          const colors = bright ? [
            [255, 200, 150],  // Warm white
            [200, 220, 255],  // Blue white
            [255, 180, 180],  // Reddish
            [180, 255, 180],  // Greenish
            [255, 255, 200]   // Yellow white
          ] : [
            [255, 255, 255],  // Pure white
            [200, 200, 255],  // Slight blue
            [255, 200, 200]   // Slight red
          ];
          
          const color = p.random(colors);
          return p.color(color[0], color[1], color[2]);
        }

        twinkle() {
          if (this.shouldTwinkle) {
            this.angle += this.twinkleSpeed;
            this.brightness = p.map(p.sin(this.angle), -1, 1, 150, 255);
          }
        }

        display() {
          p.push();
          p.noStroke();
          
          // Draw multiple layers of glow with decreasing opacity
          for (let i = this.layers; i > 0; i--) {
            const layerSize = this.glowSize * (i / this.layers);
            const layerAlpha = (this.brightness / this.layers) * (i / this.layers);
            
            // Outer colored glow
            const outerGlow = p.color(
              p.red(this.color),
              p.green(this.color),
              p.blue(this.color),
              layerAlpha * 0.3
            );
            p.fill(outerGlow);
            p.circle(this.x, this.y, layerSize);
          }
          
          // Draw white core with color blend
          const coreSize = this.size * 0.8;
          
          // Colored halo around core
          const haloColor = p.color(
            p.red(this.color),
            p.green(this.color),
            p.blue(this.color),
            this.brightness * 0.5
          );
          p.fill(haloColor);
          p.circle(this.x, this.y, this.size * 1.2);
          
          // White core
          const coreColor = p.color(255, 255, 255, this.brightness);
          p.fill(coreColor);
          p.circle(this.x, this.y, coreSize);
          
          // Add a subtle bloom effect
          p.drawingContext.shadowBlur = this.size * 2;
          p.drawingContext.shadowColor = p.color(
            p.red(this.color),
            p.green(this.color),
            p.blue(this.color),
            this.brightness * 0.5
          );
          
          p.pop();
        }
      }

      // Enhanced Galaxy cluster class
      class GalaxyCluster {
        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.particles = [];
          this.rotation = p.random(p.TWO_PI);
          this.rotationSpeed = p.random(0.0001, 0.001);
          
          // More distinct galaxy colors and types
          const galaxyTypes = [
            { 
              primary: [255, 250, 255], // Reddish
              secondary: [155, 150, 150, 0.14],
              size: p.random(80, 120),
              spiral: true
            },
            { 
              primary: [255, 255, 255], // Bluish
              secondary: [240, 250, 105],
              size: p.random(40, 80),
              spiral: false
            },
           
            { 
              primary: [255, 255, 255], // Purple
              secondary: [200, 170, 255],
              size: p.random(75, 10),
              spiral: false
            },
            { 
              primary: [255, 250, 255], // Reddish
              secondary: [15, 10, 10, 0.14],
              size: p.random(80, 220),
              spiral: true
            },
            { 
              primary: [255, 250, 255], // Reddish
              secondary: [15, 10, 10, 0.14],
              size: p.random(80, 220),
              spiral: true
            },
          ];
          
          const type = p.random(galaxyTypes);
          this.primaryColor = p.color(...type.primary);
          this.secondaryColor = p.color(...type.secondary);
          this.size = type.size;
          this.isSpiral = type.spiral;
          
          // Create particles with spiral or elliptical pattern
          for (let i = 0; i < 100; i++) {
            let radius, angle;
            if (this.isSpiral) {
              angle = i * p.random(Array.from([0.1,0.84,0.96, 0.75, 0.65, 0.54]))* p.TWO_PI;
              radius = (i / 100) * (this.size / 2);
            } else {
              angle = p.random(p.TWO_PI);
              radius = p.random(this.size/4, this.size/2);
            }
            
            this.particles.push({
              x: p.cos(angle) * radius,
              y: p.sin(angle) * radius,
              alpha: p.random(30, 100),
              size: p.random(0.5, 2.5),
              color: p.random() > 0.5 ? this.primaryColor : this.secondaryColor
            });
          }
        }

        display() {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);
          p.noStroke();
          
          // Draw galaxy core with gradient
          const coreSize = this.size/4;
          for (let i = coreSize; i > 0; i -= 2) {
            const interColor = p.lerpColor(this.primaryColor, this.secondaryColor, i/coreSize);
            p.fill(p.red(interColor), p.green(interColor), p.blue(interColor), 100 * (i/coreSize));
            p.circle(0, 0, i);
          }
          
          // Draw particles with blend mode for glow effect
          p.blendMode(p.ADD);
          this.particles.forEach(particle => {
            p.fill(p.red(particle.color), p.green(particle.color), p.blue(particle.color), particle.alpha);
            p.circle(particle.x, particle.y, particle.size);
          });
          
          this.rotation += this.rotationSpeed;
          p.pop();
          p.blendMode(p.BLEND);
        }
      }

      // New ShootingStar class
      class ShootingStar {
        constructor(isFar = false) {
          this.reset(isFar);
          this.isFar = isFar;
        }

        reset(isFar) {
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
          if (this.x < -this.length || this.x > p.width + this.length ||
            this.y < -this.length || this.y > p.height + this.length) {
            this.reset(this.isFar);
          }
        }

        display() {
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

      // Modify the Constellation class
      class Constellation {
        constructor(p, x, y, pattern, type = 'normal') {
          this.p = p;
          this.stars = [];
          this.edges = [];
          this.centerX = x;
          this.centerY = y;
          this.scale = p.random(180, 280); // Increased scale
          
          // Create stars with enhanced properties
          pattern.pattern.forEach(pos => {
            const starX = this.centerX + (pos[0] - 0.5) * this.scale;
            const starY = this.centerY + (pos[1] - 0.5) * this.scale;
            
            this.stars.push({
              x: starX,
              y: starY,
              size: p.random(3.5, 4.5), // Increased star size
              brightness: p.random(200, 255),
              twinkleSpeed: p.random(0.02, 0.04),
              twinklePhase: p.random(p.TWO_PI),
              shimmerSpeed: p.random(0.01, 0.03),
              shimmerPhase: p.random(p.TWO_PI)
            });
          });
          
          // Enhanced edges with animation properties
          pattern.connections.forEach(conn => {
            this.edges.push({
              from: conn[0],
              to: conn[1],
              flowPhase: p.random(p.TWO_PI),
              flowSpeed: p.random(0.005, 0.015), // Slow animation
              glowIntensity: 0
            });
          });
        }

        display() {
          const p = this.p;
          
          // Draw edges with flowing light effect
          p.push();
          this.edges.forEach(edge => {
            const from = this.stars[edge.from];
            const to = this.stars[edge.to];
            
            // Update flow animation
            edge.flowPhase += edge.flowSpeed;
            edge.glowIntensity = (p.sin(edge.flowPhase) + 1) / 2; // 0 to 1

            // Base line
            p.strokeWeight(0.5);
            p.stroke(200, 220, 255, 20);
            p.line(from.x, from.y, to.x, to.y);

            // Animated glow effect
            const gradient = p.drawingContext.createLinearGradient(
              from.x, from.y, to.x, to.y
            );
            
            // Create flowing light effect
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
          
          // Draw enhanced stars with multiple layers and shimmer
          this.stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            star.shimmerPhase += star.shimmerSpeed;
            
            const twinkle = p.map(p.sin(star.twinklePhase), -1, 1, 0.7, 1);
            const shimmer = p.map(p.sin(star.shimmerPhase), -1, 1, 0.8, 1.2);
            
            p.push();
            p.noStroke();
            
            // Outer glow layers
            for(let i = 6; i > 0; i--) {
              const glowSize = star.size * i * shimmer;
              const glowAlpha = p.map(i, 6, 1, 
                star.brightness * 0.05, star.brightness * 0.3);
              p.fill(180, 220, 255, glowAlpha * twinkle);
              p.circle(star.x, star.y, glowSize);
            }
            
            // Bright core with shimmer
            const coreSize = star.size * shimmer;
            p.fill(220, 235, 255, star.brightness * twinkle);
            p.circle(star.x, star.y, coreSize);
            
            // Center highlight
            p.fill(255, star.brightness * twinkle);
            p.circle(star.x, star.y, coreSize * 0.5);
            p.pop();
          });
        }
      }

      // In your sketch setup, add:
      let shootingStars = [];
      let farShootingStars = [];

      let breathePhase = 0;
      const breatheSpeed = 0.019;
      const breatheAmount = 0.05; // 15% size variation

      const originalSetup = p.setup;
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.angleMode(p.DEGREES);

        if (shouldReduceEffects) {
          p.frameRate(45);
          p.pixelDensity(1);
        }

        const rectSpawnRate = shouldReduceEffects ? 6 : 3;
        const maxRectangles = shouldReduceEffects ? 15 : 30;

        // Increase total stars for denser background
        for (let i = 0; i < 2000; i++) {
          if (i < 30) {
            stars.push(new Star('large'));
          } else if (i < 150) {
            stars.push(new Star('medium'));
          } else {
            stars.push(new Star('normal'));
          }
        }

        // Create more distinct galaxy clusters
        for (let i = 0; i < 8; i++) {
          galaxies.push(new GalaxyCluster());
        }
        
        // Create shooting stars with reduced count on mobile
        const shootingStarsCount = shouldReduceEffects ? 1 : 3;
        const farShootingStarsCount = shouldReduceEffects ? 2 : 5;

        for (let i = 0; i < shootingStarsCount; i++) {
          shootingStars.push(new ShootingStar(false));
        }
        for (let i = 0; i < farShootingStarsCount; i++) {
          farShootingStars.push(new ShootingStar(true));
        }

        constellations = [];
        const midX = p.width / 2;
        const midY = p.height / 2;

        // Create 3-4 constellations
        const patterns = Object.entries(CONSTELLATION_PATTERNS);
        const numConstellations = p.random([3, 4]);
        const usedPatterns = new Set();

        // Helper function to get random pattern
        const getRandomPattern = () => {
          const availablePatterns = patterns.filter(p => !usedPatterns.has(p));
          const pattern = p.random(availablePatterns);
          usedPatterns.add(pattern);
          return pattern;
        };

        // Top-right constellation (Q2)
        const topRightX = p.random(midX + midX * 0.2, p.width * 0.85);
        const topRightY = p.random(p.height * 0.1, p.height * 0.25);
        if (isAreaEmpty(topRightX, topRightY)) {
          constellations.push(new Constellation(p, topRightX, topRightY, getRandomPattern()[1], 'large'));
        }

        // Bottom-left region constellations (Q3)
        // Create 2-3 constellations in different parts of the bottom-left space
        const bottomLeftRegions = [
          // Center-left region
          {
            x: p.random(midX * 0.3, midX * 0.6),
            y: p.random(midY + midY * 0.2, p.height * 0.8)
          },
          // Lower-left region
          {
            x: p.random(midX * 0.2, midX * 0.4),
            y: p.random(midY + midY * 0.3, p.height * 0.85)
          },
          // Mid-left region
          {
            x: p.random(midX * 0.25, midX * 0.5),
            y: p.random(midY + midY * 0.1, midY + midY * 0.3)
          }
        ];

        // Randomly select and place constellations in bottom-left regions
        p.shuffle(bottomLeftRegions).slice(0, 2).forEach(pos => {
          if (isAreaEmpty(pos.x, pos.y)) {
            constellations.push(new Constellation(p, pos.x, pos.y, getRandomPattern()[1]));
          }
        });

        // Optional: Add one more constellation if numConstellations is 4
        if (numConstellations === 4) {
          const extraPos = {
            x: p.random(midX * 0.4, midX * 0.7),
            y: p.random(midY + midY * 0.15, p.height * 0.75)
          };
          if (isAreaEmpty(extraPos.x, extraPos.y)) {
            constellations.push(new Constellation(p, extraPos.x, extraPos.y, getRandomPattern()[1]));
          }
        }
      };

      // Add scroll listener
      window.addEventListener('scroll', () => {
        scrollOffset = window.pageYOffset * 0.1; // Adjust multiplier for effect strength
      });

      const originalDraw = p.draw;
      p.draw = () => {
        if (!document.hidden) {
          p.background(0);

          farShootingStars.forEach(star => {
            star.update();
            star.display();
          });
  
          galaxies.forEach(galaxy => galaxy.display());

          stars.forEach(star => {
            if (star.shouldTwinkle) star.twinkle();
            star.display();
          });

          constellations.forEach(constellation => constellation.display());

          shootingStars.forEach(star => {
            star.update();
            star.display();
          });

          // Laser beam properties
          const laserStartX = 0;
          const laserStartY = p.height / 2;
          const laserEndX = p.width;
          const laserEndY = p.height / 3;
          const laserThickness = 55;

          // Calculate beam positions
          const angle = p.atan2(laserEndY - laserStartY, laserEndX - laserStartX);
          const beamLength = p.dist(laserStartX, laserStartY, laserEndX, laserEndY);
          const avatarPosX = laserStartX + (beamLength / 2) * p.cos(angle);
          const avatarPosY = laserStartY + (beamLength / 2) * p.sin(angle);

          // Draw the complete laser beam (without splitting)
          const pulse = p.sin(p.frameCount * 0.4);
          for (let i = 0; i < laserThickness; i++) {
            const alpha = p.map(i, 0, laserThickness, 255, 0);
            const color = p.lerpColor(
              p.color(255, 255, 255, alpha),
              p.color(255, 65, 240, alpha),
              i / laserThickness
            );
            p.stroke(color);
            p.strokeWeight(2);
            p.line(
              laserStartX, 
              laserStartY + i + pulse, 
              laserEndX, 
              laserEndY + i + pulse
            );
            p.line(
              laserStartX, 
              laserStartY - i - pulse, 
              laserEndX, 
              laserEndY - i - pulse
            );
          }

          // Optimize rectangle creation
          if (shouldReduceEffects) {
            if (p.frameCount % 6 === 0 && rectangles.length < 15) {
              const rectWidth = p.random(50, 100);
              const rectHeight = p.random(25, 65);
              const opacity = p.random(40, 205);
              const speed = p.random(2, 5);

              const isAbove = p.random() > 0.5;
              const offset = isAbove ? p.random(60, 90) : p.random(-90, -60);

              rectangles.push({
                x: laserStartX,
                y: laserStartY + offset,
                offset: offset,
                speed: speed,
                width: rectWidth,
                height: rectHeight,
                opacity: opacity,
              });
            }
          } else {
            if (p.frameCount % 3 === 0 && rectangles.length < 30) {
              const rectWidth = p.random(50, 100);
              const rectHeight = p.random(25, 65);
              const opacity = p.random(40, 205);
              const speed = p.random(2, 5);

              const isAbove = p.random() > 0.5;
              const offset = isAbove ? p.random(60, 90) : p.random(-90, -60);

              rectangles.push({
                x: laserStartX,
                y: laserStartY + offset,
                offset: offset,
                speed: speed,
                width: rectWidth,
                height: rectHeight,
                opacity: opacity,
              });
            }
          }

          // Update and draw rectangles
          for (let i = rectangles.length - 1; i >= 0; i--) {
            const rect = rectangles[i];

            rect.x += rect.speed;
            rect.y = laserStartY + rect.offset + ((rect.x / p.width) * (laserEndY - laserStartY));

            if (rect.x > p.width) {
              rectangles.splice(i, 1);
              continue;
            }

            p.push();
            p.translate(rect.x, rect.y);
            p.rotate(angle);
            p.fill(128, 0, 128, rect.opacity);
            p.noStroke();
            p.rectMode(p.CENTER);
            p.rect(0, 0, rect.width, rect.height);
            p.pop();
          }

          // Calculate breathing effect
          breathePhase += breatheSpeed;
          const breatheScale = 1 + Math.sin(breathePhase) * breatheAmount;
          
          const avatarSize = laserThickness * 10;
          p.push();
          p.imageMode(p.CENTER);
          if (p.avatarImg) {
            const breatheRotation = Math.sin(breathePhase) * 2;
            
            p.push();
            p.translate(avatarPosX, avatarPosY);
            p.rotate(p.radians(breatheRotation));
            p.scale(breatheScale);
            
            p.noStroke();
            p.fill(0, 150);
            
            p.image(p.avatarImg, 0, 0, avatarSize, avatarSize);
            p.pop();
          }
          p.pop();
        }
      };

      // Add preload function to load the avatar image
      p.preload = () => {
        p.avatarImg = p.loadImage('/avatar-face.png');
      };

      // Handle window resizing
      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };

      // Update isAreaEmpty to be more precise about constellation spacing
      function isAreaEmpty(x, y) {
        const laserStartY = p.height / 2;
        const laserEndY = p.height / 3;
        const laserSlope = (laserEndY - laserStartY) / p.width;
        const laserY = laserStartY + laserSlope * x;
        const laserDistance = Math.abs(y - laserY);
        
        const nameAreaX = p.width * 0.7;
        const nameAreaY = p.height * 0.6;
        const nameDistance = p.dist(x, y, nameAreaX, nameAreaY);
        
        const minConstellationDistance = 200;
        const tooCloseToOthers = constellations.some(c => 
          p.dist(x, y, c.centerX, c.centerY) < minConstellationDistance
        );
        
        return laserDistance > 200 && nameDistance > 300 && !tooCloseToOthers;
      }
    };

    const myP5 = new p5(sketch, sketchRef.current);
    return () => myP5.remove();
  }, []);

  return <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <div ref={sketchRef} />
  </div>
};

export default LaserBeamSketch;