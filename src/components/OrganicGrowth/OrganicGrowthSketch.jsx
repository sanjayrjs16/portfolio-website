import React, { useEffect } from 'react';
import p5 from 'p5';

const OrganicGrowthSketch = () => {
    useEffect(() => {
        const sketch = (p) => {
            let W;          // Canvas width
            let Counter = 0; // Animation counter
            let Angle;      // Branch angle
            
            p.setup = () => {
                // Make canvas fill the window
                W = Math.min(window.innerWidth, window.innerHeight);
                p.createCanvas(W, W);
                p.fill(255, 50); // White with 50% opacity
                p.stroke(255);   // White stroke
                p.strokeWeight(1.5);
            };

            p.draw = () => {
                Counter++;
                
                // Semi-transparent background for fade effect
                p.fill(0, 50);  // Black with 50% opacity
                p.rect(0, 0, W, W);
                
                // Calculate branch angle with smooth oscillation
                Angle = (p.PI + p.sin(Counter * 0.02)) / 7;
                
                // Set color for branches
                p.stroke(255, 200); // White with 80% opacity
                
                // Draw 8 organic structures in a circle
                for(let j = 0; j < p.TWO_PI; j += p.TWO_PI/8) {
                    drawTree(7, W/2, W/2, j, 45);
                }
                
                // Copy slightly smaller version of canvas onto itself for trail effect
                p.copy(10, 10, W-20, W-20, 0, 0, W, W);
            };

            const drawTree = (step, x, y, rad, lengs) => {
                if(step > 0) {
                    // Calculate noise influence (larger for smaller branches)
                    const inf = 20 - step;
                    
                    // Use Perlin noise for organic movement
                    const n = p.noise((x + Counter)/W, (y - Counter)/W) * inf;
                    
                    // Calculate new position with noise influence
                    const newX = x + p.cos(rad) * lengs + p.cos(n) * inf;
                    const newY = y + p.sin(rad) * lengs + p.sin(n) * inf;
                    
                    // Draw branch with gradient color based on step
                    const alpha = p.map(step, 0, 7, 100, 255);
                    p.stroke(255, alpha);
                    p.line(x, y, newX, newY);
                    
                    step--;
                    lengs *= 0.9; // Reduce length for next branches
                    
                    // Recursively draw branches
                    drawTree(step, newX, newY, rad + Angle, lengs);
                    drawTree(step, newX, newY, rad - Angle, lengs);
                }
            };

            // Handle window resize
            p.windowResized = () => {
                W = Math.min(window.innerWidth, window.innerHeight);
                p.resizeCanvas(W, W);
            };
        };

        // Create new p5 instance
        const p5Instance = new p5(sketch);

        // Cleanup on component unmount
        return () => {
            p5Instance.remove();
        };
    }, []);

    return (
        <div id="organic-growth-container" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'black'
        }} />
    );
};

export default OrganicGrowthSketch; 