import React, { useEffect, useRef } from "react";
import p5 from "p5";

const GenerativeEyeWithFlower = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let gen = 800; // Flower animation generator variable
        let bg = p.loadImage('https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg');
      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.noStroke();
      };

      p.draw = () => {
        p.background(bg); // White background for contrast

        // Eye properties
        const eyeX = p.width / 2;
        const eyeY = p.height / 2;
        const irisRadius = p.min(p.width, p.height) * 0.4; // Size of the iris

        // Dynamic pupil radius (oscillates between 0.2 and 0.4 of irisRadius)
        const pupilRadius = irisRadius * (0.3 + 0.1 * p.sin(gen * 44));
        let gradient = p.drawingContext.createLinearGradient(20,20, -20,-20);
        
        p.drawingContext.fillStyle = gradient;
        // Draw the iris with a fading gradient
        for (let r = irisRadius; r > 0; r -= 1) {
          const alpha = p.map(r, 0, irisRadius, 0, 255); // Fade out towards the edges
          p.fill(120, 90, 70, alpha); // Black iris color
          p.ellipse(eyeX, eyeY, r * 2, r * 2);
        }

        // Save the drawing context to apply clipping
        p.drawingContext.save();

        // Clip the drawing to the iris region
        p.drawingContext.beginPath();
        p.ellipse(eyeX, eyeY, irisRadius * 2, irisRadius * 2); // Outer boundary (iris)
        p.drawingContext.clip();

        // Draw the rotating flower animation in the iris
        flowerAnimation(eyeX, eyeY);

        // Restore the drawing context (remove the clip)
        p.drawingContext.restore();

        // Draw the pupil (black circle) above the animation
        p.fill(0);
        p.ellipse(eyeX, eyeY, pupilRadius * 2, pupilRadius * 2);
      };

      function flowerAnimation(originX, originY) {
        const angle = p.sin(gen * 44) * 44; // Dynamic angle based on sine wave
        const backgroundColor = p.map(angle, 84, 44, 0, 255);

        // Background for the flower (optional, for debugging)
        p.fill(255, backgroundColor, backgroundColor, 20);
        p.noStroke();
        p.ellipse(originX, originY, 10);

        p.push();
        p.translate(originX, originY);
        p.rotate(gen * 44); // Rotate the entire flower dynamically
        for (let i = 0; i < 900; i++) {
          p.rotate((20 / gen) * 104);
          p.stroke(30, 20, 20, 80); // Purple stroke
          p.strokeWeight(1.2); // Thin stroke for smooth curves
          p.noFill();
          p.curve(i, i, 0, angle + i, i + 533, angle - i, i + 153, i);
        }
        p.pop();

        gen += 0.00022; // Slowly increment gen for smooth animation
      }

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    const myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}>
   
  </div>;
};

export default GenerativeEyeWithFlower;