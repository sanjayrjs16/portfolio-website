import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import PortalBlob from '../PortalBlob';
import SocialIcons from '../SocialIcons/SocialIcons';

const LaserBeamSketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      // Add simple device check
      const isMobile = /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);
      const shouldReduceEffects = isMobile || window.devicePixelRatio < 1.5;
      let skipFrame = 0;
      
      let rectangles = []; // Array to store rectangle properties
      let stars = []; // Array to store star properties
      let galaxies = []; // Array to store small galaxy clusters
      let nebulae = []; // New array for nebula clouds
      let scrollOffset = 0;
      let constellations = [];

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

        isVisible() {
          const buffer = this.glowSize * 2; // Account for glow radius
          return (
            this.x > -buffer && 
            this.x < p.width + buffer && 
            this.y > -buffer && 
            this.y < p.height + buffer
          );
        }

        display() {
          if (!this.isVisible()) return;
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
          
          // Simplified galaxy types
          const galaxyTypes = [
            { 
              // Spiral galaxy
              primary: [255, 250, 255],
              secondary: [155, 150, 150],
              size: p.random(80, 120),
              type: 'spiral'
            },
            { 
              // Edge-on galaxy
              primary: [255, 255, 255],
              secondary: [240, 250, 105],
              size: p.random(60, 100),
              type: 'edge'
            }
          ];
          
          const type = p.random(galaxyTypes);
          this.primaryColor = p.color(...type.primary);
          this.secondaryColor = p.color(...type.secondary);
          this.size = type.size;
          this.type = type.type;
          
          const particleCount = shouldReduceEffects ? 40 : 80;
          
          // Create particles based on galaxy type
          for (let i = 0; i < particleCount; i++) {
            if (this.type === 'spiral') {
              const angle = (i / particleCount) * p.TWO_PI * 2;
              const spiralRadius = (i / particleCount) * (this.size / 2);
              this.particles.push({
                x: p.cos(angle) * spiralRadius,
                y: p.sin(angle) * spiralRadius,
                alpha: p.map(i, 0, particleCount, 100, 30),
                size: p.random(0.5, 2),
                color: i < particleCount/2 ? this.primaryColor : this.secondaryColor
              });
            } else {
              // Edge-on galaxy
              const x = p.random(-this.size/2, this.size/2);
              const y = p.random(-this.size/8, this.size/8); // Flattened on y-axis
              this.particles.push({
                x: x,
                y: y,
                alpha: p.map(Math.abs(y), 0, this.size/8, 100, 30),
                size: p.random(0.5, 2),
                color: Math.abs(x) < this.size/4 ? this.primaryColor : this.secondaryColor
              });
            }
          }
        }

        isVisible() {
          const buffer = this.size;
          return (
            this.x > -buffer && 
            this.x < p.width + buffer && 
            this.y > -buffer && 
            this.y < p.height + buffer
          );
        }

        display() {
          if (!this.isVisible()) return;
          p.push();
          p.translate(this.x, this.y);
          this.particles.forEach(particle => {
            p.fill(particle.color, particle.alpha);
            p.noStroke();
            p.circle(particle.x, particle.y, particle.size);
          });
          p.pop();
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

        isVisible() {
          // Check if any star in constellation is visible
          return this.stars.some(star => (
            star.x > -50 && 
            star.x < p.width + 50 && 
            star.y > -50 && 
            star.y < p.height + 50
          ));
        }

        display() {
          if (!this.isVisible()) return;
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

      // Add at top with other variables
      let shootingStars = [];
      let farShootingStars = [];

      let breathePhase = 0;
      const breatheSpeed = 0.019;
      const breatheAmount = 0.05; // 15% size variation

      // Add at top with other variables
      let starInitIndex = 0;
      const STAR_BATCH_SIZE = 50;
      const TOTAL_STARS = shouldReduceEffects ? 1200 : 2000;
      let isStarfieldReady = false;

      // Add at top with other variables
      const inactiveRects = [];
      const rectPool = {
        get: () => {
          if (inactiveRects.length > 0) {
            const rect = inactiveRects.pop();
            rect.active = true;
            return rect;
          }
          return {
            x: 0,
            y: 0,
            offset: 0,
            speed: 0,
            width: 0,
            height: 0,
            opacity: 0,
            active: true
          };
        },
        recycle: (rect) => {
          rect.active = false;
          inactiveRects.push(rect);
        }
      };

      // Add with other variables at the top
      let staticStarBuffer;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.angleMode(p.DEGREES);

        // Create buffer for static stars
        staticStarBuffer = p.createGraphics(p.width, p.height);
        
        // Initialize empty stars array
        stars = [];

        // Create galaxy clusters
        for (let i = 0; i < (isMobile ? 4 : 6); i++) {
          galaxies.push(new GalaxyCluster());
        }

        // Add shooting stars
        for (let i = 0; i < 3; i++) {
          shootingStars.push(new ShootingStar(false));
        }
        for (let i = 0; i < 5; i++) {
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

      // Add function to draw static stars to buffer
      const updateStaticStarBuffer = () => {
        staticStarBuffer.clear();
        staticStarBuffer.background(0);
        stars.forEach(star => {
          if (!star.shouldTwinkle && star.isVisible()) {
            star.display(staticStarBuffer);
          }
        });
      };

      p.draw = () => {
        if (shouldReduceEffects) {
          skipFrame++;
          if (skipFrame % 2 !== 0) return;
        }

        p.background(0);

        // Progressive star initialization
        if (starInitIndex < TOTAL_STARS) {
          const batchSize = Math.min(STAR_BATCH_SIZE, TOTAL_STARS - starInitIndex);
          for (let i = 0; i < batchSize; i++) {
            if (starInitIndex < TOTAL_STARS * 0.015) {
              stars.push(new Star('large'));
            } else if (starInitIndex < TOTAL_STARS * 0.075) {
              stars.push(new Star('medium'));
            } else {
              stars.push(new Star('normal'));
            }
            starInitIndex++;
          }

          // Update buffer when all stars are initialized
          if (starInitIndex >= TOTAL_STARS) {
            updateStaticStarBuffer();
          }
        }

        // Draw static stars from buffer
        p.image(staticStarBuffer, 0, 0);

        // Draw far shooting stars
        farShootingStars.forEach(star => {
          star.update();
          star.display();
        });

        // Draw galaxies
        galaxies.forEach(galaxy => {
          if (galaxy.isVisible()) {
            galaxy.display();
          }
        });

        // Draw only twinkling stars
        stars.forEach(star => {
          if (star.shouldTwinkle && star.isVisible()) {
            star.twinkle();
            star.display(p);
          }
        });

        // Draw close shooting stars
        shootingStars.forEach(star => {
          star.update();
          star.display();
        });

        // Draw only visible constellations
        constellations.forEach(constellation => {
          if (constellation.isVisible()) {
            constellation.display();
          }
        });

        // Laser beam properties (moved outside animation)
        const laserStartX = 0;
        const laserStartY = p.height / 2;
        const laserEndX = p.width;
        const laserEndY = p.height / 3;
        const laserThickness = 55;

        // Calculate beam positions (no animation)
        const angle = p.atan2(laserEndY - laserStartY, laserEndX - laserStartX);
        const beamLength = p.dist(laserStartX, laserStartY, laserEndX, laserEndY);
        const avatarPosX = laserStartX + (beamLength / 2) * p.cos(angle);
        const avatarPosY = laserStartY + (beamLength / 2) * p.sin(angle);

        // Draw static laser beam
        for (let i = 0; i < laserThickness; i++) {
          const alpha = p.map(i, 0, laserThickness, 255, 0);
          const color = p.lerpColor(
            p.color(255, 255, 255, alpha),
            p.color(255, 65, 240, alpha),
            i / laserThickness
          );
          p.stroke(color);
          p.strokeWeight(2);
          
          // Remove pulse animation
          p.line(
            laserStartX, 
            laserStartY + i, 
            laserEndX, 
            laserEndY + i
          );
          p.line(
            laserStartX, 
            laserStartY - i, 
            laserEndX, 
            laserEndY - i
          );
        }

        // Modify rectangle creation to use pool
        if (p.frameCount % (isMobile ? 4 : 3) === 0 && rectangles.filter(r => r.active).length < (isMobile ? 7 : 30)) {
          const rect = rectPool.get();
          rect.width = p.random(50, 100);
          rect.height = p.random(25, 65);
          rect.opacity = p.random(40, 205);
          rect.speed = p.random(2, 5);
          
          const isAbove = p.random() > 0.5;
          rect.offset = isAbove ? p.random(60, 90) : p.random(-90, -60);
          rect.x = laserStartX;
          rect.y = laserStartY + rect.offset;

          rectangles.push(rect);
        }

        // Update and draw rectangles with pooling
        for (let i = rectangles.length - 1; i >= 0; i--) {
          const rect = rectangles[i];
          if (!rect.active) continue;

          // Check visibility with buffer for rotation
          const isVisible = (
            rect.x > -rect.width && 
            rect.x < p.width + rect.width && 
            rect.y > -rect.height && 
            rect.y < p.height + rect.height
          );

          if (!isVisible) {
            rectPool.recycle(rect);
            rectangles.splice(i, 1);
            continue;
          }

          // Update rectangle position
          rect.x += rect.speed;
          rect.y = laserStartY + rect.offset + ((rect.x / p.width) * (laserEndY - laserStartY));

          // Draw rectangle
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
        
        // Draw the avatar with breathing effect
        const avatarSize = laserThickness * 10;
        p.push();
        p.imageMode(p.CENTER);
        if (p.avatarImg) {
          // Optional: add slight rotation based on breathing
          const breatheRotation = Math.sin(breathePhase) * 2; // 2 degrees max rotation
          
          p.push();
          p.translate(avatarPosX, avatarPosY);
          p.rotate(p.radians(breatheRotation));
          p.scale(breatheScale);
          
          // Clear a small area behind the avatar for better visibility
          p.noStroke();
          p.fill(0, 150);
          // p.circle(0, 0, avatarSize * 1.1);
          
          // Draw the avatar
          p.image(p.avatarImg, 0, 0, avatarSize, avatarSize);
          p.pop();
        }
        p.pop();

        // Adjust positions based on scroll
        const baseY = p.height / 2;
        const adjustedY = baseY + scrollOffset;

        // Use adjustedY for positioning elements
        // ... rest of drawing code ...
      };

      // Add preload function to load the avatar image
      p.preload = () => {
        p.avatarImg = p.loadImage('/avatar-face.png');
      };

      // Handle window resizing
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Recreate and update static star buffer
        staticStarBuffer = p.createGraphics(p.width, p.height);
        updateStaticStarBuffer();
      };

      // Update isAreaEmpty to be more precise about constellation spacing
      function isAreaEmpty(x, y) {
        // Check distance from laser beam path
        const laserStartY = p.height / 2;
        const laserEndY = p.height / 3;
        const laserSlope = (laserEndY - laserStartY) / p.width;
        const laserY = laserStartY + laserSlope * x;
        const laserDistance = Math.abs(y - laserY);
        
        // Check distance from name area (center-right)
        const nameAreaX = p.width * 0.7;
        const nameAreaY = p.height * 0.6;
        const nameDistance = p.dist(x, y, nameAreaX, nameAreaY);
        
        // Check distance from other constellations
        const minConstellationDistance = 200;
        const tooCloseToOthers = constellations.some(c => 
          p.dist(x, y, c.centerX, c.centerY) < minConstellationDistance
        );
        
        return laserDistance > 200 && nameDistance > 300 && !tooCloseToOthers;
      }
    };

    // Create a new p5 instance and attach it to the sketchRef
    const myP5 = new p5(sketch, sketchRef.current);

    // Cleanup function to remove the p5 instance when the component unmounts
    return () => {
      myP5.remove();
    };
  }, []);

  return <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <div ref={sketchRef} />
    
  </div>
};

export default LaserBeamSketch;