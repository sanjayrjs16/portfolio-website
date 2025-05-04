import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Star } from './Star';
import { GalaxyCluster } from './GalaxyCluster';
import { Constellation } from './Constellation';
import { ShootingStar } from './ShootingStar';
import { LaserBeam } from './LaserBeam';

const scrollHandler = () => { scrollOffset = window.pageYOffset * 0.1; };

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
      let scrollOffset = 0;
      let constellations = [];
      let shootingStars = [];
      let farShootingStars = [];

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

      // With unified buffers
      let staticSceneBuffer;
      let laserBeamBuffer; // New buffer just for the laser beam
      let isInitComplete = false;
      let laserBeam; // Instance of our LaserBeam class
      
      // Add this variable near the top with your other animation variables
      let avatarOpacity = 0; // For fade-in effect
      const avatarFadeSpeed = 5; // Speed of fade-in

      const setupBuffers = () => {
        // Always use full-size buffers, no scaling
        staticSceneBuffer = p.createGraphics(p.width, p.height);
        staticSceneBuffer.clear();
        
        laserBeamBuffer = p.createGraphics(p.width, p.height);
        laserBeamBuffer.clear();
      };

      const updateStaticSceneBuffer = () => {
        staticSceneBuffer.clear();
        
        // Draw all stars to buffer (twinkling and non-twinkling)
        stars.forEach(star => {
          if (star.isVisible()) {
            star.drawToBuffer(staticSceneBuffer);
          }
        });
        
        // Draw galaxies to buffer
        galaxies.forEach(galaxy => {
          if (galaxy.isVisible()) {
            if (galaxy.drawToBuffer) {
              galaxy.drawToBuffer(staticSceneBuffer);
            } else {
              galaxy.display(staticSceneBuffer);
            }
          }
        });
        
        // Draw constellations to buffer
        constellations.forEach(constellation => {
          if (constellation.isVisible()) {
            if (constellation.drawToBuffer) {
              constellation.drawToBuffer(staticSceneBuffer);
            } else {
              constellation.display(staticSceneBuffer);
            }
          }
        });
      };

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.angleMode(p.DEGREES);
        
        setupBuffers();
        
        // Initialize laser beam and draw it to buffer immediately
        laserBeam = new LaserBeam(p);
        laserBeam.drawToBuffer(laserBeamBuffer);
        
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
      window.addEventListener('scroll', scrollHandler );

      p.draw = () => {
        p.background(0);
        
        // Always draw the laser beam buffer
        p.image(laserBeamBuffer, 0, 0);
        
        if (isInitComplete) {
          // Draw static elements from buffer
          p.image(staticSceneBuffer, 0, 0);
          
          // Draw dynamic elements
          drawDynamicElements();
          return;
        }
        
        // Always call buildProgressiveStage, but it will handle throttling internally
        buildProgressiveStage();
      };

      // Modify buildProgressiveStage to handle throttling internally
      const buildProgressiveStage = () => {
        // Skip heavy processing on mobile, but don't skip entire frames
        if (shouldReduceEffects && skipFrame++ < 1) {
          return;
        }
        skipFrame = 0;
        
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
          if(star.isVisible()){
            if (!star.shouldTwinkle) {
              star.display(p);
            }
            else {
              star.twinkle();
              star.display(p);
            }
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

      const drawDynamicElements = () => {
        // Draw far shooting stars
        farShootingStars.forEach(star => {
          star.update();
          star.display(p);
        });

        // Draw close shooting stars
        shootingStars.forEach(star => {
          star.update();
          star.display(p);
        });

        // Calculate breathing effect for avatar
        breathePhase += breatheSpeed;
        const breatheScale = 1 + Math.sin(breathePhase) * breatheAmount;
        
        // Fade in the avatar if needed
        if (avatarOpacity < 255) {
          avatarOpacity = Math.min(avatarOpacity + avatarFadeSpeed, 255);
        }

        // Draw the avatar with breathing effect
        const avatarSizeMultiplier = isMobile ? 7 : 10; // Smaller on mobile
        const avatarSize = laserBeam.thickness * avatarSizeMultiplier;
        const avatarPos = laserBeam.getAvatarPosition();
        
        p.push();
        p.imageMode(p.CENTER);
        if (p.avatarImg) {
          // Optional: add slight rotation based on breathing
          const breatheRotation = Math.sin(breathePhase) * 2; // 2 degrees max rotation
          
          p.push();
          p.translate(avatarPos.x, avatarPos.y);
          p.rotate(p.radians(breatheRotation));
          p.scale(breatheScale);
          
          // Draw the avatar with fade-in effect
          p.tint(255, avatarOpacity);
          p.image(p.avatarImg, 0, 0, avatarSize, avatarSize);
          p.noTint();
          p.pop();
        }
        p.pop();

        // Rectangle creation code using object pool
        if (isInitComplete && p.frameCount % (isMobile ? 4 : 3) === 0 && rectangles.filter(r => r.active).length < (isMobile ? 7 : 30)) {
          const rect = rectPool.get();
          rect.width = p.random(50, 100);
          rect.height = p.random(25, 65);
          rect.opacity = p.random(40, 205);
          rect.speed = p.random(2, 5);
          
          const isAbove = p.random() > 0.5;
          rect.offset = isAbove ? p.random(60, 90) : p.random(-90, -60);
          rect.x = laserBeam.startX;
          rect.y = laserBeam.startY + rect.offset;

          rectangles.push(rect);
        }

        // Update and draw rectangles
        for (let i = rectangles.length - 1; i >= 0; i--) {
          const rect = rectangles[i];
          if (!rect.active) continue;

          // Check visibility
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
          rect.y = laserBeam.startY + rect.offset + ((rect.x / p.width) * (laserBeam.endY - laserBeam.startY));

          // Draw rectangle
          p.push();
          p.translate(rect.x, rect.y);
          p.rotate(laserBeam.angle);
          p.fill(128, 0, 128, rect.opacity);
          p.noStroke();
          p.rectMode(p.CENTER);
          p.rect(0, 0, rect.width, rect.height);
          p.pop();
        }
      };

      // Add preload function to load the avatar image
      p.preload = () => {
        p.avatarImg = p.loadImage('/avatar-face.png');
      };

      // Handle window resizing
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Always recreate the buffers at the new size
        setupBuffers();
        
        // Update laser beam for new dimensions and redraw to buffer
        laserBeam.resize(p.width, p.height);
        laserBeam.drawToBuffer(laserBeamBuffer);
        
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
      window.removeEventListener('scroll', scrollHandler);
      myP5.remove();
    };
  }, []);

  return <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <div ref={sketchRef} />
    
  </div>
};

export default LaserBeamSketch;