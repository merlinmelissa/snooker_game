class Obstacle {
    constructor(position, size) {
        this.position = position; // Position of the obstacle
        this.size = size; // Size (radius) of the obstacle
        this.body = this.createPhysicalObstacle(); // Create the physics body
    }

    // Method to create a physical obstacle using Matter.js
    createPhysicalObstacle() {
        let obstacleOptions = {
            isStatic: true, // Obstacles are static (don't move)
            label: 'Obstacle', // Label for the obstacle
            render: {
                fillStyle: '#FF0000', // Red color for the obstacle
                strokeStyle: '#000000', // Black outline
                lineWidth: 2 // Outline width
            }
        };
        return Bodies.circle(this.position.x, this.position.y, this.size, obstacleOptions);
    }

    // Method to display the obstacle on the canvas
    display() {
        const pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        noStroke();
    
        // Draw the circular body (represents the rat)
        fill(150); // Gray body color
        ellipse(0, 0, this.size, this.size); // Main circular body
    
        // Draw the ears
        fill(180); // Light gray for the ears
        ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 0.25, this.size * 0.25); // Left ear
        ellipse(this.size * 0.3, -this.size * 0.3, this.size * 0.25, this.size * 0.25); // Right ear
    
        // Inner ears
        fill(255, 200, 200); // Pink for inner ears
        ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 0.15, this.size * 0.15); // Left inner ear
        ellipse(this.size * 0.3, -this.size * 0.3, this.size * 0.15, this.size * 0.15); // Right inner ear
    
        // Draw the eyes
        fill(0); // Black eyes
        ellipse(-this.size * 0.15, -this.size * 0.1, this.size * 0.1, this.size * 0.1); // Left eye
        ellipse(this.size * 0.15, -this.size * 0.1, this.size * 0.1, this.size * 0.1); // Right eye
    
        // Draw the nose
        fill(255, 100, 100); // Pink nose
        ellipse(0, this.size * 0.2, this.size * 0.1, this.size * 0.1);
    
        // Draw the whiskers
        stroke(0); // Black whiskers
        strokeWeight(1);
        line(-this.size * 0.2, this.size * 0.15, -this.size * 0.4, this.size * 0.2); // Left whisker (top)
        line(-this.size * 0.2, this.size * 0.2, -this.size * 0.4, this.size * 0.3); // Left whisker (middle)
        line(-this.size * 0.2, this.size * 0.25, -this.size * 0.4, this.size * 0.4); // Left whisker (bottom)
        line(this.size * 0.2, this.size * 0.15, this.size * 0.4, this.size * 0.2); // Right whisker (top)
        line(this.size * 0.2, this.size * 0.2, this.size * 0.4, this.size * 0.3); // Right whisker (middle)
        line(this.size * 0.2, this.size * 0.25, this.size * 0.4, this.size * 0.4); // Right whisker (bottom)
    
        pop();
    }
    
   
}