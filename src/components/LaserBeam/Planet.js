// Make sure planetImages is defined in the main sketch and imported or available here
// If not, you can pass it as a parameter or use a global variable

export class Planet {
    constructor(p,  planetImages) {
      this.p = p;
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.radius = p.random(28, 60); // Controls the drawn size
  
      // Pick a random image from the loaded images
      this.img = (typeof planetImages !== "undefined" && planetImages.length > 0)
        ? planetImages[Math.floor(p.random(planetImages.length))]
        : null;
  
      // Optionally, randomize rotation for variety
      this.angle = p.random(0, 360);
    }
  
    isVisible() {
      // Use the image's size for buffer, or just use radius
      const buffer = this.radius * 2;
      return (
        this.x > -buffer &&
        this.x < this.p.width + buffer &&
        this.y > -buffer &&
        this.y < this.p.height + buffer
      );
    }
  
    display(ctx = this.p) {
      if (!this.isVisible() || !this.img) return;
      const p = ctx;
      p.push();
      p.translate(this.x, this.y);
      p.rotate(p.radians(this.angle));
      p.imageMode(p.CENTER);
      p.image(this.img, 0, 0, this.radius * 2, this.radius * 2);
      p.pop();
    }
  
    // For buffer drawing
    drawToBuffer(ctx) {
      const oldP = this.p;
      this.p = ctx;
      this.display();
      this.p = oldP;
    }
  }