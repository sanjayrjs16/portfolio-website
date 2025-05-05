import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Star } from './Star';
import { GalaxyCluster } from './GalaxyCluster';
import { Constellation } from './Constellation';
import { ShootingStar } from './ShootingStar';
import { LaserBeam } from './LaserBeam';
import { RectFragment } from './RectFragment';
import { 
  getDeviceConfig,
  STAR_CONFIG,
  SHOOTING_STAR_CONFIG,
  GALAXY_CONFIG,
  CONSTELLATION_PATTERNS
} from "../Background/backgroundConfig";

const LaserBeamSketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    let scrollOffset = 0;
    const scrollHandler = () => { scrollOffset = window.pageYOffset * 0.1; };
    window.addEventListener('scroll', scrollHandler);

    const sketch = (p) => {
      const { isMobile, shouldReduceEffects } = getDeviceConfig();
      let skipFrame = 0;
      
      let fragments = [];
      let inactiveFragments = [];
      
      let stars = [];
      let galaxies = [];
      let constellations = [];
      let shootingStars = [];
      let farShootingStars = [];

      // Add at top with other variables
      let breathePhase = 0;
      const breatheSpeed = 0.019;
      const breatheAmount = 0.05; // 15% size variation

      // Add at top with other variables
      let starInitIndex = 0;
      const STAR_BATCH_SIZE = 50;
      const TOTAL_STARS = shouldReduceEffects ? 1200 : 2000;
      let isStarfieldReady = false;

      // Add at top with other variables - new fragment pool
      let fragmentPool;

      // With unified buffers
      let staticSceneBuffer;
      let laserBeamBuffer; // New buffer just for the laser beam
      let isInitComplete = false;
      let laserBeam; // Instance of our LaserBeam class
      
      // Add this variable for fade-in effect
      let avatarOpacity = 0;
      const avatarFadeSpeed = 5; // Speed of fade-in

      // Add this constant near the top with your other constants
      const RECT_OVER_THRESHOLD = 0.7; // 80% opacity threshold

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
        
        // Now that laserBeam is defined, create the fragment pool
        fragmentPool = {
          get: () => {
            if (inactiveFragments.length > 0) {
              const fragment = inactiveFragments.pop();
              fragment.reset();
              return fragment;
            }
            return new RectFragment(p, laserBeam);
          },
          recycle: (fragment) => {
            fragment.active = false;
            inactiveFragments.push(fragment);
          }
        };
        
        // Initialize empty stars array
        stars = [];

        // Create galaxy clusters
        for (let i = 0; i < GALAXY_CONFIG.COUNT; i++) {
          galaxies.push(new GalaxyCluster(p));
        }

        // Add shooting stars
        for (let i = 0; i < SHOOTING_STAR_CONFIG.CLOSE_COUNT; i++) {
          shootingStars.push(new ShootingStar(p, false));
        }
        for (let i = 0; i < SHOOTING_STAR_CONFIG.FAR_COUNT; i++) {
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
      
      p.draw = () => {
        p.background(0);
        
        if (isInitComplete) {
          // Draw static elements from buffer (includes galaxies) FIRST
          p.image(staticSceneBuffer, 0, 0);
          
          // Then draw the laser beam OVER the static elements
          p.image(laserBeamBuffer, 0, 0);
          
          // Draw dynamic elements last
          drawDynamicElements();
          return;
        }
        
        // During initialization, draw galaxies directly
        drawCurrentState();
        
        // Draw laser beam on top
        p.image(laserBeamBuffer, 0, 0);
        
        // Continue with progressive building
        buildProgressiveStage();
      };

      // Create a comprehensive drawFrame function that always draws a complete frame
      const drawFrame = () => {
        p.background(0);
        
        if (isInitComplete) {
          // Draw static elements from buffer first
          p.image(staticSceneBuffer, 0, 0);
          
          // Then laser beam
          p.image(laserBeamBuffer, 0, 0);
          
          // Then dynamic elements
          drawDynamicElements();
        } else {
          // Draw current state first (galaxies, stars)
          drawCurrentState();
          
          // Then laser beam on top
          p.image(laserBeamBuffer, 0, 0);
        }
      };

      // Create a separate function to draw the current state
      const drawCurrentState = () => {
        // Draw all stars created so far
        stars.forEach(star => {
          if (star.isVisible()) {
            if (star.shouldTwinkle) {
              star.twinkle();
            }
            star.display(p);
          }
        });
       
        // Draw all galaxies created so far
        galaxies.forEach(galaxy => {
          if (galaxy.isVisible()) {
            galaxy.display(p);
          }
        });
        
        // Draw all constellations created so far
        constellations.forEach(constellation => {
          if (constellation.isVisible()) {
            constellation.display(p);
          }
        });
      };

      // Modify buildProgressiveStage to only handle the initialization work, not drawing
      const buildProgressiveStage = () => {
        // Throttle only the heavy initialization work, not the drawing
        if (shouldReduceEffects && skipFrame++ < 1) {
          return;
        }
        skipFrame = 0;
        
        // Do progressive star initialization
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
          
          // Take snapshot once initialization is complete
          if (starInitIndex >= TOTAL_STARS && !isInitComplete) {
            updateStaticSceneBuffer();
            isInitComplete = true;
          }
        }
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

        // 1. Update all fragments first
        fragments.forEach(fragment => fragment.update());
        
        // 2. Draw fragments that should appear BEHIND the avatar
        fragments
          .filter(fragment => fragment.active && fragment.opacity/255 <= RECT_OVER_THRESHOLD)
          .forEach(fragment => fragment.display(p));
        
        // 3. Draw the avatar with breathing effect
        const avatarSizeMultiplier = isMobile ? 7 : 10; 
        const avatarSize = laserBeam.thickness * avatarSizeMultiplier;
        const avatarPos = laserBeam.getAvatarPosition();
        
        p.push();
        p.imageMode(p.CENTER);
        if (p.avatarImg) {
          const breatheRotation = Math.sin(breathePhase) * 2;
          p.push();
          p.translate(avatarPos.x, avatarPos.y);
          p.rotate(p.radians(breatheRotation));
          p.scale(breatheScale);
          p.tint(255, avatarOpacity);
          p.image(p.avatarImg, 0, 0, avatarSize, avatarSize);
          p.noTint();
          p.pop();
        }
        p.pop();
        
        // 4. Draw fragments that should appear IN FRONT of the avatar
        fragments
          .filter(fragment => fragment.active && fragment.opacity/255 > RECT_OVER_THRESHOLD)
          .forEach(fragment => fragment.display(p));
        
        // 5. Recycle inactive fragments
        for (let i = fragments.length - 1; i >= 0; i--) {
          if (!fragments[i].active) {
            fragmentPool.recycle(fragments.splice(i, 1)[0]);
          }
        }
        
        // 6. Create new fragments if needed
        if (isInitComplete && p.frameCount % (isMobile ? 4 : 3) === 0 && 
            fragments.filter(f => f.active).length < (isMobile ? 7 : 30)) {
          fragments.push(fragmentPool.get());
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
      myP5.remove();
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <div ref={sketchRef} />
    
  </div>
};

export default LaserBeamSketch;