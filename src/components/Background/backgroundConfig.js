// Common background configuration constants

// Device detection and performance settings
export const getDeviceConfig = () => {
  // Use the exact same check as in LaserBeamSketch
  const isMobile = /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);
  const shouldReduceEffects = isMobile || window.devicePixelRatio < 1.5;
  
  return {
    isMobile,
    shouldReduceEffects
  };
};

// Star configuration
export const STAR_CONFIG = {
  BATCH_SIZE: 50,
  get TOTAL_STARS() {
    const { shouldReduceEffects } = getDeviceConfig();
    return shouldReduceEffects ? 1200 : 2000;
  },
  LARGE_PERCENT: 0.015,    // First 1.5% of stars are large
  MEDIUM_PERCENT: 0.075    // Next 6% of stars are medium
};

// Breathing effect config (used for avatar in LaserBeamSketch)
export const BREATHE_CONFIG = {
  SPEED: 0.019,
  AMOUNT: 0.05
};

// Shooting stars configuration
export const SHOOTING_STAR_CONFIG = {
  CLOSE_COUNT: 3,
  FAR_COUNT: 5,
  SPAWN_CHANCE: 0.005 // Chance to spawn a new shooting star each frame
};

// Galaxy configuration
export const GALAXY_CONFIG = {
  get COUNT() {
    const { isMobile } = getDeviceConfig();
    return isMobile ? 4 : 6;
  }
};

// Constellation configuration
export const CONSTELLATION_CONFIG = {
  MIN_DISTANCE: 200,  // Minimum distance between constellations
};

// Fragment configuration (used in LaserBeamSketch)
export const FRAGMENT_CONFIG = {
  RECT_OVER_THRESHOLD: 0.7,
  get SPAWN_RATE() {
    const { isMobile } = getDeviceConfig();
    return isMobile ? 4 : 3;
  },
  get MAX_ACTIVE() {
    const { isMobile } = getDeviceConfig();
    return isMobile ? 7 : 30;
  }
};

// Constellation patterns
export const CONSTELLATION_PATTERNS = {
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
  cygnus: {
    name: "Cygnus",
    pattern: [
      [0.5, 0.3], [0.5, 0.4], [0.5, 0.5], [0.5, 0.6],
      [0.4, 0.5], [0.6, 0.5], [0.3, 0.4], [0.7, 0.4]
    ],
    connections: [[0,1], [1,2], [2,3], [2,4], [2,5], [1,6], [1,7]]
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

// Avatar configuration (used in LaserBeamSketch)
export const AVATAR_CONFIG = {
  FADE_SPEED: 5,
  get SIZE_MULTIPLIER() {
    const { isMobile } = getDeviceConfig();
    return isMobile ? 7 : 10;
  }
}; 