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

      let breathePhase = 0;
      const breatheSpeed = 0.019;
      const breatheAmount = 0.05;

      let starInitIndex = 0;
      const STAR_BATCH_SIZE = 50;
      const TOTAL_STARS = shouldReduceEffects ? 1200 : 2000;
      
      let fragmentPool;
      let staticSceneBuffer;
      let laserBeamBuffer;
      let isInitComplete = false;
      let laserBeam;
      
      let avatarOpacity = 0;
      const avatarFadeSpeed = 5;
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
        laserBeam.drawToBuffer(laserBeamBuffer);
        
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

        constellations = [];
        const midX = p.width / 2;
        const midY = p.height / 2;

        const patterns = Object.entries(CONSTELLATION_PATTERNS);
        const numConstellations = p.random([3, 4]);
        const usedPatterns = new Set();

        const getRandomPattern = () => {
          const availablePatterns = patterns.filter(p => !usedPatterns.has(p));
          const pattern = p.random(availablePatterns);
          usedPatterns.add(pattern);
          return pattern;
        };

        const topRightX = p.random(midX + midX * 0.2, p.width * 0.85);
        const topRightY = p.random(p.height * 0.1, p.height * 0.25);
        if (isAreaEmpty(topRightX, topRightY)) {
          constellations.push(new Constellation(p, topRightX, topRightY, getRandomPattern()[1], 'large'));
        }

        const bottomLeftRegions = [
          {
            x: p.random(midX * 0.3, midX * 0.6),
            y: p.random(midY + midY * 0.2, p.height * 0.8)
          },
          {
            x: p.random(midX * 0.2, midX * 0.4),
            y: p.random(midY + midY * 0.3, p.height * 0.85)
          },
          {
            x: p.random(midX * 0.25, midX * 0.5),
            y: p.random(midY + midY * 0.1, midY + midY * 0.3)
          }
        ];

        p.shuffle(bottomLeftRegions).slice(0, 2).forEach(pos => {
          if (isAreaEmpty(pos.x, pos.y)) {
            constellations.push(new Constellation(p, pos.x, pos.y, getRandomPattern()[1]));
          }
        });

        if (numConstellations === 4) {
          const extraPos = {
            x: p.random(midX * 0.4, midX * 0.7),
            y: p.random(midY + midY * 0.15, p.height * 0.75)
          };
          if (isAreaEmpty(extraPos.x, extraPos.y)) {
            constellations.push(new Constellation(p, extraPos.x, extraPos.y, getRandomPattern()[1]));
          }
        }

        for (let i = 0; i < SHOOTING_STAR_CONFIG.CLOSE_COUNT; i++) {
          shootingStars.push(new ShootingStar(p, false));
        }
        for (let i = 0; i < SHOOTING_STAR_CONFIG.FAR_COUNT; i++) {
          farShootingStars.push(new ShootingStar(p, true));
        }

        // After creating constellations, draw them to buffer
        constellations.forEach(constellation => {
          if (constellation.isVisible()) {
            constellation.drawToBuffer(staticSceneBuffer);
          }
        });
      };
      
      p.draw = () => {
        p.background(0);
        p.image(staticSceneBuffer, 0, 0);
        p.image(laserBeamBuffer, 0, 0);
        
        if (!isInitComplete) {
          buildProgressiveStage();
        } else {
          drawDynamicElements();
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
      };

      const drawDynamicElements = () => {
        farShootingStars.forEach(star => {
          star.update();
          star.display(p);
        });

        shootingStars.forEach(star => {
          star.update();
          star.display(p);
        });

        breathePhase += breatheSpeed;
        const breatheScale = 1 + Math.sin(breathePhase) * breatheAmount;
        
        if (avatarOpacity < 255) {
          avatarOpacity = Math.min(avatarOpacity + avatarFadeSpeed, 255);
        }

        fragments.forEach(fragment => fragment.update());
        
        fragments
          .filter(fragment => fragment.active && fragment.opacity/255 <= RECT_OVER_THRESHOLD)
          .forEach(fragment => fragment.display(p));
        
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
        
        fragments
          .filter(fragment => fragment.active && fragment.opacity/255 > RECT_OVER_THRESHOLD)
          .forEach(fragment => fragment.display(p));
        
        for (let i = fragments.length - 1; i >= 0; i--) {
          if (!fragments[i].active) {
            fragmentPool.recycle(fragments.splice(i, 1)[0]);
          }
        }
        
        if (p.frameCount % (isMobile ? 4 : 3) === 0 && 
            fragments.filter(f => f.active).length < (isMobile ? 7 : 30)) {
          fragments.push(fragmentPool.get());
        }
      };

      p.preload = () => {
        p.avatarImg = p.loadImage('/avatar-face.png');
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        setupBuffers();
        
        // Resize and redraw laser beam
        laserBeam.resize(p.width, p.height);
        laserBeam.drawToBuffer(laserBeamBuffer);
        
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
      };

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