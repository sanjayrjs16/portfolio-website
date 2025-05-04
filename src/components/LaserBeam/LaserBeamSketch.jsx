import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Star } from './Star';
import { GalaxyCluster } from './GalaxyCluster';
import { Constellation } from './Constellation';
import { ShootingStar } from './ShootingStar';

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

      // With a single unified buffer
      let staticSceneBuffer;
      let isInitComplete = false;

      const setupBuffers = () => {
        // Create just one static buffer, potentially at reduced resolution for low-end devices
        const bufferScale = shouldReduceEffects ? 0.75 : 1;
        staticSceneBuffer = p.createGraphics(p.width * bufferScale, p.height * bufferScale);
        staticSceneBuffer.clear();
      };

      const updateStaticSceneBuffer = () => {
        staticSceneBuffer.clear();
        drawStarsToBuffer();
        drawGalaxiesToBuffer();
        drawConstellationsToBuffer();
      };

      const drawStarsToBuffer = () => {
        stars.forEach(star => {
          if (!star.shouldTwinkle && star.isVisible()) {
            star.display(staticSceneBuffer);
          }
        });
      };

      const drawGalaxiesToBuffer = () => {
        galaxies.forEach(galaxy => {
          if (!galaxy.isVisible()) return;
          
          galaxy.particles.forEach(particle => {
            staticSceneBuffer.push();
            staticSceneBuffer.translate(galaxy.x + particle.x, galaxy.y + particle.y);
            staticSceneBuffer.noStroke();
            staticSceneBuffer.fill(
              particle.color[0], 
              particle.color[1], 
              particle.color[2], 
              150 // Fixed opacity for static look
            );
            staticSceneBuffer.circle(0, 0, particle.size * 0.8);
            staticSceneBuffer.pop();
          });
        });
      };

      const drawConstellationsToBuffer = () => {
        constellations.forEach(constellation => {
          if (!constellation.isVisible()) return;
          
          // Draw edges with fixed glow
          constellation.edges.forEach(edge => {
            const from = constellation.stars[edge.from];
            const to = constellation.stars[edge.to];
            
            // Use static values instead of animation
            staticSceneBuffer.strokeWeight(0.5);
            staticSceneBuffer.stroke(200, 220, 255, 20);
            staticSceneBuffer.line(from.x, from.y, to.x, to.y);
            
            // Static glow
            staticSceneBuffer.strokeWeight(1.5);
            staticSceneBuffer.stroke(200, 220, 255, 30);
            staticSceneBuffer.line(from.x, from.y, to.x, to.y);
          });
          
          // Draw constellation stars with fixed brightness
          constellation.stars.forEach(star => {
            staticSceneBuffer.push();
            staticSceneBuffer.noStroke();
            staticSceneBuffer.fill(255, star.brightness * 0.85);
            staticSceneBuffer.circle(star.x, star.y, star.size);
            staticSceneBuffer.pop();
          });
        });
      };

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.angleMode(p.DEGREES);
        
        setupBuffers();
        
        // Initialize empty stars array
        stars = [];

        // Create galaxy clusters
        for (let i = 0; i < (isMobile ? 4 : 6); i++) {
          galaxies.push(new GalaxyCluster(p));
        }

        // Add shooting stars
        for (let i = 0; i < 3; i++) {
          shootingStars.push(new ShootingStar(p, false));
        }
        for (let i = 0; i < 5; i++) {
          farShootingStars.push(new ShootingStar(p, true));
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

        // After constellations are created
        // updateStaticSceneBuffer();
      };

      // Add scroll listener
      window.addEventListener('scroll', () => {
        scrollOffset = window.pageYOffset * 0.1; // Adjust multiplier for effect strength
      });

      p.draw = () => {
        if (shouldReduceEffects) {
          skipFrame++;
          if (skipFrame % 2 !== 0) return;
        }

        p.background(0);

        // Break draw into clear phases
        if (!isInitComplete) {
          buildProgressiveStage();
        } else {
          drawStaticScene();
        }
        
        drawDynamicElements();
      };

      // Clear phase functions for better readability
      const buildProgressiveStage = () => {
        // Progressive star initialization
        if (starInitIndex < TOTAL_STARS) {
          const batchSize = Math.min(STAR_BATCH_SIZE, TOTAL_STARS - starInitIndex);
          for (let i = 0; i < batchSize; i++) {
            if (starInitIndex < TOTAL_STARS * 0.015) {
              stars.push(new Star(p, 'large'));
            } else if (starInitIndex < TOTAL_STARS * 0.075) {
              stars.push(new Star(p, 'medium'));
            } else {
              stars.push(new Star(p, 'normal'));
            }
            starInitIndex++;
          }

          // Create the buffer ONCE when all stars are initialized
          if (starInitIndex >= TOTAL_STARS && !isInitComplete) {
            updateStaticSceneBuffer();
            isInitComplete = true;
          }
        }

        // During initialization, directly draw what we have so far
        stars.forEach(star => {
          if (!star.shouldTwinkle && star.isVisible()) {
            star.display(p);
          }
        });
        
        galaxies.forEach(galaxy => {
          if (galaxy.isVisible()) {
            galaxy.display(p);
          }
        });
        
        constellations.forEach(constellation => {
          if (constellation.isVisible()) {
            // Consider using a dedicated drawStatic(ctx) method that matches
            // the buffer appearance exactly
            constellation.display(p);
          }
        });
      };

      const drawStaticScene = () => {
        // Draw the entire static scene from buffer
        // If we're using a scaled buffer, stretch to full size
        if (staticSceneBuffer.width !== p.width || staticSceneBuffer.height !== p.height) {
          p.image(staticSceneBuffer, 0, 0, p.width, p.height);
        } else {
          p.image(staticSceneBuffer, 0, 0);
        }
      };

      const drawDynamicElements = () => {
        // Draw far shooting stars
        farShootingStars.forEach(star => {
          star.update();
          star.display(p);
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
          star.display(p);
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
        
        // Always recreate the buffer at the new size
        setupBuffers();
        
        // If initialization is complete, re-snapshot everything
        if (isInitComplete) {
          updateStaticSceneBuffer();
        }
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