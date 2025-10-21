class CueBall extends Ball {
    constructor(position, hasPhysics = true) {
        const validPosition = {
            x: constrain(position.x, 0, width),
            y: constrain(position.y, 0, height),
        };
        super(ColouredBalls.white, validPosition, hasPhysics); 
    }



    // Cue ball to be within the table bounds
    constrainPosition() {
        if (this.body) {
            const xMin = (width - tableLength) / 2 + this.radius;
            const xMax = (width + tableLength) / 2 - this.radius;
            const yMin = (height - tableHeight) / 2 + this.radius;
            const yMax = (height + tableHeight) / 2 - this.radius;

            this.position.x = constrain(this.position.x, xMin, xMax);
            this.position.y = constrain(this.position.y, yMin, yMax);
        }
    }

    // Cue ball and its physics
    PhysicsEnabled() {
        this.body = this._initPhysicsBody(); 
        World.add(engine.world, this.body); 
    };
};