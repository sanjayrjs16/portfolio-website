import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Star } from './Star';
import { GalaxyCluster } from './GalaxyCluster';
import { Constellation } from './Constellation';
import { ShootingStar } from './ShootingStar';
import { LaserBeam } from './LaserBeam';
import { RectFragment } from './RectFragment';
import { Planet } from './Planet';
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

      let breathePhase = 0;
      const breatheSpeed = 0.019;
      const breatheAmount = 0.05;

      let starInitIndex = 0;
      const STAR_BATCH_SIZE = 50;
      const TOTAL_STARS = shouldReduceEffects ? 1200 : 2000;
      
      let planetImages = [];
      let planets = [];
      let planetPositions = [];
      const PLANET_COUNT = shouldReduceEffects ? 3 : 4; // Adjust as you like

      let fragmentPool;
      let staticSceneBuffer;
      let laserBeamBuffer;
      let isInitComplete = false;
      let laserBeam;
      let laserBeamDrawnToBuffer = false;
      
      let avatarOpacity = 0;
      const avatarFadeSpeed = shouldReduceEffects ? 15 : 5;
      const RECT_OVER_THRESHOLD = 0.7;

      const setupBuffers = () => {
        staticSceneBuffer = p.createGraphics(p.width, p.height);
        staticSceneBuffer.clear();
        
        laserBeamBuffer = p.createGraphics(p.width, p.height);
        laserBeamBuffer.clear();
      };

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.angleMode(p.DEGREES);
        
        setupBuffers();
        
        laserBeam = new LaserBeam(p);
        laserBeam.startFlicker();
        // laserBeam.drawToBuffer(laserBeamBuffer);
        
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

        for (let i = 0; i < GALAXY_CONFIG.COUNT; i++) {
          const galaxy = new GalaxyCluster(p);
          galaxies.push(galaxy);
          if (galaxy.isVisible()) {
            galaxy.drawToBuffer(staticSceneBuffer);
          }
        }

        // Shuffle the images so the selection is random each time
        shuffleArray(planetImages);

        // Decide how many planets you want (no more than planetImages.length)
        const numPlanets = Math.min(PLANET_COUNT, planetImages.length);

        for (let i = 0; i < numPlanets; i++) {
          // Pass only the image you want for this planet
          const planet = new Planet(p, [planetImages[i]]);
          planets.push(planet);
          planetPositions.push({ x: planet.x, y: planet.y, r: planet.radius });
          if (planet.isVisible()) {
            planet.drawToBuffer(staticSceneBuffer);
          }
        }

        const patterns = [...Object.entries(CONSTELLATION_PATTERNS)];
        const desired = shouldReduceEffects ? 4 : 6;
        let tries = 0;

        while (constellations.length < desired && tries < 100) {
          const x = p.random(0, p.width);
          const y = p.random(0, p.height);
          
          if (isAreaEmpty(x, y)) {
            if (patterns.length > 0) {
              const randomIndex = Math.floor(p.random(patterns.length));
              const [_, pattern] = patterns.splice(randomIndex, 1)[0];
              const constellation = new Constellation(p, x, y, pattern);
              constellations.push(constellation);
              if (constellation.isVisible()) {
                constellation.drawToBuffer(staticSceneBuffer);
              }
            }
          }
          tries++;
        }

        for (let i = 0; i < SHOOTING_STAR_CONFIG.CLOSE_COUNT; i++) {
          shootingStars.push(new ShootingStar(p, false));
        }
        for (let i = 0; i < SHOOTING_STAR_CONFIG.FAR_COUNT; i++) {
          farShootingStars.push(new ShootingStar(p, true));
        }

       // Add safety timeout for laser beam
        setTimeout(() => {
          if (!laserBeam.hasFlickerCompleted) {
            laserBeam.isStatic = true;
            laserBeam.isVisible = true;
        
            if (!laserBeamDrawnToBuffer) {
              laserBeam.drawToBuffer(staticSceneBuffer);
              laserBeamDrawnToBuffer = true;
              laserBeamBuffer.clear();
            }
          }
        }, 1220); // 5 seconds max for flickering

      };
      
      p.draw = () => {
        p.background(0);
        p.image(staticSceneBuffer, 0, 0);
        
        // Only show flickering buffer during animation
        if (!laserBeam.isStatic) {
          p.image(laserBeamBuffer, 0, 0);
        }
        
        if (!isInitComplete) {
          buildProgressiveStage();
        } else {
          drawDynamicElements();
        }
        
        // Safety check for static state
        if (laserBeam.hasFlickerCompleted && !laserBeamDrawnToBuffer) {
          laserBeam.drawToBuffer(staticSceneBuffer);
          laserBeamDrawnToBuffer = true;
          laserBeamBuffer.clear();
        }
      };

      const buildProgressiveStage = () => {
        if (shouldReduceEffects && skipFrame++ < 1) return;
        skipFrame = 0;

        if (starInitIndex < TOTAL_STARS) {
          const batchEnd = Math.min(starInitIndex + STAR_BATCH_SIZE, TOTAL_STARS);
          const newStars = [];

          for (let i = starInitIndex; i < batchEnd; i++) {
            let star;
            if (i < TOTAL_STARS * 0.015) {
              star = new Star(p, 'large');
            } else if (i < TOTAL_STARS * 0.075) {
              star = new Star(p, 'medium');
            } else {
              star = new Star(p, 'normal');
            }
            stars.push(star);
            newStars.push(star);
          }

          newStars.forEach(star => {
            if (star.isVisible()) {
              star.drawToBuffer(staticSceneBuffer);
            }
          });

          starInitIndex = batchEnd;
          
          if (starInitIndex >= TOTAL_STARS) {
            isInitComplete = true;
          }
        }

        // Single point of truth for laser beam state
        if (!laserBeam.isStatic) {
          laserBeamBuffer.clear();
          laserBeam.updateFlicker();
          laserBeam.displayFlicker(laserBeamBuffer);
        } else if (!laserBeamDrawnToBuffer) {
          // Only draw to static buffer once when flickering is done
          laserBeam.drawToBuffer(staticSceneBuffer);
          laserBeamDrawnToBuffer = true;
          laserBeamBuffer.clear();
        }
      };

      const drawDynamicElements = () => {
        // 1. Throttle breathing animation
        if (p.frameCount % (isMobile ? 3 : 2) === 0) {
          breathePhase += breatheSpeed;
        }

        // 2. Precompute breathing values once per update
        const breatheSin = Math.sin(breathePhase);
        const breatheScale = 1 + breatheSin * breatheAmount;
        const breatheRotation = breatheSin * 2;

        // 3. Faster fade-in for mobile
        if (avatarOpacity < 255) {
          avatarOpacity = Math.min(avatarOpacity + (isMobile ? 3 : 2), 255);
        }

        // Update fragments
        fragments.forEach(fragment => fragment.update());
        
        // Draw fragments below threshold
        fragments
          .filter(fragment => fragment.active && fragment.opacity/255 <= RECT_OVER_THRESHOLD)
          .forEach(fragment => fragment.display(p));
        
        // 4. Optimize avatar drawing
        if (p.avatarImg) {
          p.push();
          p.imageMode(p.CENTER);
          const avatarSizeMultiplier = isMobile ? 6.5 : 9; 
          const avatarSize = laserBeam.thickness * avatarSizeMultiplier;
          const avatarPos = laserBeam.getAvatarPosition();

          p.translate(avatarPos.x, avatarPos.y);
          p.rotate(p.radians(breatheRotation));
          p.scale(breatheScale);
          p.tint(255, avatarOpacity);
          p.image(p.avatarImg, 0, 0, avatarSize, avatarSize);
          p.noTint();
          p.pop();
        }
        
        // Draw fragments above threshold
        fragments
          .filter(fragment => fragment.active && fragment.opacity/255 > RECT_OVER_THRESHOLD)
          .forEach(fragment => fragment.display(p));
        
        // 5. Optimize fragment creation
        const activeFragmentCount = fragments.filter(f => f.active).length;
        const fragmentLimit = isMobile ? 5 : 25;

        if (p.frameCount % (isMobile ? 6 : 3) === 0 && activeFragmentCount < fragmentLimit) {
          fragments.push(fragmentPool.get());
        }
        
        // Clean up inactive fragments
        for (let i = fragments.length - 1; i >= 0; i--) {
          if (!fragments[i].active) {
            fragmentPool.recycle(fragments.splice(i, 1)[0]);
          }
        }
      };

      p.preload = () => {
        p.avatarImg = p.loadImage('/avatar-face.png');
        planetImages = [
          p.loadImage('/planets/planet-1.png'),
          p.loadImage('/planets/planet-2.png'),
          p.loadImage('/planets/planet-3.png'),
          p.loadImage('/planets/planet-4.png'),
          p.loadImage('/planets/planet-5.png'),
          p.loadImage('/planets/planet-6.png'),
          p.loadImage('/planets/planet-7.png'),
          p.loadImage('/planets/planet-8.png'),
          p.loadImage('/planets/planet-9.png'),
        ];
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        setupBuffers();
        

        // Resize and redraw laser beam
        // Reset laser beam state
        laserBeamDrawnToBuffer = false;
        laserBeam.resize(p.width, p.height);
        // If laser beam was static, redraw it
        if (laserBeam.isStatic) {
          laserBeam.drawToBuffer(staticSceneBuffer);
          laserBeamDrawnToBuffer = true;
        } else {
          // If it was flickering, restart the flicker
          laserBeam.startFlicker();
        }
        
        // Redraw ALL static elements into the fresh buffer
        galaxies.forEach(galaxy => {
          if (galaxy.isVisible()) {
            galaxy.drawToBuffer(staticSceneBuffer);
          }
        });
        
        constellations.forEach(constellation => {
          if (constellation.isVisible()) {
            constellation.drawToBuffer(staticSceneBuffer);
          }
        });
        
        stars.forEach(star => {
          if (star.isVisible()) {
            star.drawToBuffer(staticSceneBuffer);
          }
        });

        planets.forEach(planet => {
          if (planet.isVisible()) {
            planet.drawToBuffer(staticSceneBuffer);
          }
        });
      };

      function isAreaEmpty(x, y) {
        const laserStartY = p.height / 2;
        const laserEndY = p.height / 3;
        const laserSlope = (laserEndY - laserStartY) / p.width;
        const laserY = laserStartY + laserSlope * x;
        const laserDistance = Math.abs(y - laserY);
        
        const minConstellationDistance = 200;
        const tooCloseToOthers = constellations.some(c => 
          p.dist(x, y, c.centerX, c.centerY) < minConstellationDistance
        );
        
        return laserDistance > 200 && !tooCloseToOthers;
      }

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
    };

    const myP5 = new p5(sketch, sketchRef.current);

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