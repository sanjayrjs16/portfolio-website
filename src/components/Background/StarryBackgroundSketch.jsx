import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { Star } from "../LaserBeam/Star";
import { ShootingStar } from "../LaserBeam/ShootingStar";
import { GalaxyCluster } from "../LaserBeam/GalaxyCluster";
import { Constellation } from "../LaserBeam/Constellation";
import { 
  getDeviceConfig,
  STAR_CONFIG,
  SHOOTING_STAR_CONFIG,
  GALAXY_CONFIG,
  CONSTELLATION_PATTERNS
} from "./backgroundConfig";

const StarryBackgroundSketch = () => {
  const sketchRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      // Variables for stars, galaxies, constellations, and shooting stars
      let stars = [];
      let galaxies = [];
      let constellations = [];
      let shootingStars = [];
      let farShootingStars = [];
      
      // Initialization variables
      let skipFrame = 0;
      const { isMobile, shouldReduceEffects } = getDeviceConfig();
      
      // Progressive initialization variables
      let starInitIndex = 0;
      const STAR_BATCH_SIZE = STAR_CONFIG.BATCH_SIZE;
      const TOTAL_STARS = STAR_CONFIG.TOTAL_STARS;
      let isStarfieldReady = false;
      
      // Buffer for optimization
      let staticSceneBuffer;
      let isInitComplete = false;
      
      // Setup the buffer
      const setupBuffers = () => {
        // Always use full-size buffers, no scaling
        staticSceneBuffer = p.createGraphics(p.width, p.height);
        staticSceneBuffer.clear();
      };
      
      // Update the static buffer with all background elements
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

        // New constellation placement logic
        constellations = [];
        const patterns = [...Object.entries(CONSTELLATION_PATTERNS)];
        const desired = shouldReduceEffects ? 3 : 5; // At least 3 on mobile, 5 on desktop
        let tries = 0;

        while (constellations.length < desired && tries < 50) {
          const x = p.random(0, p.width);
          const y = p.random(0, p.height);
          
          if (isAreaEmpty(x, y)) {
            // Pick a random unused pattern
            if (patterns.length > 0) {
              const randomIndex = Math.floor(p.random(patterns.length));
              const [_, pattern] = patterns.splice(randomIndex, 1)[0];
              constellations.push(new Constellation(p, x, y, pattern));
            }
          }
          tries++;
        }
      };
      
      p.draw = () => {
        p.background(0);
        
        if (isInitComplete) {
          // Draw static elements from buffer (includes galaxies) FIRST
          p.image(staticSceneBuffer, 0, 0);
          
          // Draw dynamic elements last
          drawDynamicElements();
          return;
        }
        
        // During initialization, draw galaxies directly
        drawCurrentState();
        
        // Continue with progressive building
        buildProgressiveStage();
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

      // Progressive initialization of stars
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
            if (starInitIndex < TOTAL_STARS * STAR_CONFIG.LARGE_PERCENT) {
              stars.push(new Star(p, 'large'));
            } else if (starInitIndex < TOTAL_STARS * STAR_CONFIG.MEDIUM_PERCENT) {
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
      };

      // Handle window resizing
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Always recreate the buffers at the new size
        setupBuffers();
        
        // If initialization is complete, re-snapshot everything
        if (isInitComplete) {
          updateStaticSceneBuffer();
        }
      };

      // Update isAreaEmpty to be more precise about constellation spacing
      function isAreaEmpty(x, y) {
        // Check distance from other constellations
        const minConstellationDistance = 200;
        const tooCloseToOthers = constellations.some(c => 
          p.dist(x, y, c.centerX, c.centerY) < minConstellationDistance
        );
        
        return !tooCloseToOthers;
      }
    };

    // Create a new p5 instance and attach it to the sketchRef
    const myP5 = new p5(sketch, sketchRef.current);

    // Cleanup function to remove the p5 instance when the component unmounts
    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default StarryBackgroundSketch; 