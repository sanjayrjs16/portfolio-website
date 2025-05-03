import React, { useEffect, useRef } from "react";
import p5 from "p5";

const PerlinEyeSketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let noiseOffset = 0; // Offset for Perlin noise animation

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.noiseDetail(4, 0.5); // Perlin noise parameters
        p.noStroke();
      };

      p.draw = () => {
        p.background(0); // Black background

        // Eye properties
        const eyeX = p.width / 2;
        const eyeY = p.height / 2;
        const irisRadius = p.min(p.width, p.height) * 0.4;
        const pupilRadius = irisRadius * 0.3;

        // Draw the iris with gradient fade effect
        for (let r = irisRadius; r > 0; r -= 1) {
          const alpha = p.map(r, 0, irisRadius, 0, 255);
          p.fill(50, 50, 150, alpha); // Blueish gradient for iris
          p.ellipse(eyeX, eyeY, r * 2, r * 2);
        }

        // Draw the pupil (black circle)
        p.fill(0);
        p.circle(eyeX, eyeY, pupilRadius * 2);

        // Generate Perlin noise patterns in the cornea
        const noiseScale = 0.02; // Scale for Perlin noise
        const lineSpacing = 8; // Space between lines
        const maxRadius = irisRadius - pupilRadius;

        for (let angle = 0; angle < 360; angle += 8) {
          p.beginShape();
          for (let r = pupilRadius; r < maxRadius; r += lineSpacing) {
            // Perlin noise value
            const xOff = p.cos(angle) * r * noiseScale;
            const yOff = p.sin(angle) * r * noiseScale;
            const noiseVal = p.noise(xOff + noiseOffset, yOff + noiseOffset);

            // Radial distortion
            const distortion = p.map(noiseVal, 0, 1, -10, 10);

            // Polar coordinates
            const x = eyeX + (r + distortion) * p.cos(angle);
            const y = eyeY + (r + distortion) * p.sin(angle);

            p.vertex(x, y);
          }
          p.endShape();
        }

        // Animate Perlin noise
        noiseOffset += 0.01;
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    const myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default PerlinEyeSketch;
