import React, { useEffect } from 'react';
import p5 from 'p5';

const RealisticTreesSketch = () => {
    useEffect(() => {
        const sketch = (p) => {
            let trees = [];    // Array to store trees
            let ntrees = 0;    // Tree count
            let nh = 8;        // Number of horizontal trees
            let nv = 3;        // Number of vertical trees
            let maxlife = 15;  // Maximum branch life

            class Tree {
                constructor(start, coeff, index) {
                    this.branches = [];
                    this.start = start;
                    this.coeff = coeff;
                    this.teinte = p.random(30);
                    this.index = index;
                    this.proba1 = p.random(0.8, 1);
                    this.proba2 = p.random(0.8, 1);
                    this.proba3 = p.random(0.4, 0.5);
                    this.proba4 = p.random(0.4, 0.5);
                }

                grow() {
                    let found = false;
                    for (let i = 0; i < this.branches.length; i++) {
                        const b = this.branches[i];
                        if (b.alive) {
                            found = true;
                            b.age++;
                            b.grow();
                            b.display();
                        }
                    }
                }
            }

            class Branch {
                constructor(start, stw, angle, gen, index) {
                    this.position = start.copy();
                    this.stw = stw;
                    this.gen = gen;
                    this.alive = true;
                    this.age = 0;
                    this.angle = angle;
                    this.speed = p.createVector(0, -3);
                    this.index = index;
                    this.maxlife = maxlife * p.random(0.3, 0.8);
                    this.proba1 = trees[this.index].proba1;
                    this.proba2 = trees[this.index].proba2;
                    this.proba3 = trees[this.index].proba3;
                    this.proba4 = trees[this.index].proba4;
                    this.deviation = p.random(0.2, 0.7);
                }

                grow() {
                    if (this.age === p.int(this.maxlife/this.gen) || p.random(1) < 0.05 * this.gen) {
                        this.alive = false;
                        if (this.stw > 0.2) {
                            const brs = trees[this.index].branches;
                            if (p.random(1) < this.proba1/this.gen) 
                                brs.push(new Branch(p.createVector(this.position.x, this.position.y), 
                                    this.stw * p.random(0.2, 1), 
                                    this.angle + p.random(0.7, 1.1) * this.deviation, 
                                    this.gen + 0.1, 
                                    this.index));
                            // ... similar for other probabilities
                            if (p.random(1) < this.proba2/this.gen)
                                brs.push(new Branch(p.createVector(this.position.x, this.position.y),
                                    this.stw * p.random(0.2, 1),
                                    this.angle - p.random(0.7, 1.1) * this.deviation,
                                    this.gen + 0.1,
                                    this.index));
                        }
                    } else {
                        this.speed.x += p.random(-0.5, 0.5);
                    }
                }

                display() {
                    const c = trees[this.index].coeff;
                    const st = trees[this.index].start;
                    const x0 = this.position.x;
                    const y0 = this.position.y;

                    this.position.x += -this.speed.x * p.cos(this.angle) + this.speed.y * p.sin(this.angle);
                    this.position.y += this.speed.x * p.sin(this.angle) + this.speed.y * p.cos(this.angle);

                    // Shadows
                    p.stroke(trees[this.index].teinte + this.age + 10 * this.gen, 0, 0, 0.04);
                    p.strokeWeight(p.map(this.age, 0, this.maxlife, this.stw * 1.3, this.stw * 0.9));
                    const dis = 0.005 * p.pow(st.y - y0, 1.8);

                    // Draw shadow lines
                    p.line(x0 + dis * p.random(0.5, 1.2), 
                          2 * st.y - y0 + dis * p.random(0.5, 1.2),
                          this.position.x + dis * p.random(0.5, 1.2),
                          2 * st.y - this.position.y + dis * p.random(0.5, 1.2));

                    // Light accents
                    p.strokeWeight(p.map(this.age, 0, this.maxlife, this.stw, this.stw * 0.6));
                    p.stroke(trees[this.index].teinte + this.age + 20 * this.gen, 
                            150 * c, 200 + 20 * this.gen, 15 * c);
                    p.line(x0 + 0.1 * this.stw, y0,
                          this.position.x + 0.1 * this.stw, this.position.y);

                    // Main branch
                    p.stroke(trees[this.index].teinte + this.age + 20 * this.gen,
                            100 * c, 50 + 20 * this.gen, 15 * c);
                    p.strokeWeight(p.map(this.age, 0, this.maxlife, this.stw, this.stw * 0.6));
                    p.line(x0, y0, this.position.x, this.position.y);
                }
            }

            function createTree(i, j) {
                const x = 0.1 * p.width + i * p.int(0.9 * p.width/nh);
                const y = p.int(0.2 * p.height + j * p.int(0.8 * p.height/nv));
                const start = p.createVector(x, y);
                trees[i + j * nh] = new Tree(start, start.y/(p.height-130), i + j * nh);
                trees[i + j * nh].branches[0] = new Branch(start, 
                    15 * p.sqrt(start.y/p.height), 0, 1, i + j * nh);
                ntrees++;
            }

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                p.colorMode(p.HSB, 360, 255, 255);
                p.background(40, 10, 255);
                p.frameRate(200);
                p.smooth(4);

                trees = [];
                ntrees = 0;

                for (let i = 0; i < nh; i++) {
                    for (let j = 0; j < nv; j++) {
                        createTree(i, j);
                    }
                }
            };

            p.draw = () => {
                for (let i = 0; i < nv * nh; i++) {
                    trees[i].grow();
                }
            };

            p.mouseReleased = () => {
                p.setup();
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
                p.setup();
            };
        };

        const p5Instance = new p5(sketch);
        return () => p5Instance.remove();
    }, []);

    return (
        <div id="realistic-trees-container" style={{
            width: '100%',
            height: '100vh',
            background: '#f0f0f0'
        }} />
    );
};

export default RealisticTreesSketch; 