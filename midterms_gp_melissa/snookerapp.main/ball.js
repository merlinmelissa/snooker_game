class Ball {
    constructor(colour, position, PhysicsEnabled = true) {
        this.position = position; // Initial position
        this.colour = colour; // Colour of the ball
        this.diameter = ballDiameter; // Ball diameter
        this.radius = this.diameter / 2; // Ball radius

        if (PhysicsEnabled) {
            this.body = this._initPhysicsBody();
            World.add(engine.world, this.body);
        }
    }

    _initPhysicsBody() {
        return Bodies.circle(this.position.x, this.position.y, this.radius, {
            restitution: 0.95,
            friction: 0.005,
            frictionAir: 0.02,
            label: 'Ball',
            density: 0.05,
            mass: 0.17,
            render: { fillStyle: this.colour }
        });
    }

    // Method to render the ball on the canvas
    display() {
        const pos = this.body ? this.body.position : this.position;
        push();
        translate(pos.x, pos.y);

        // Create gradient for 3D effect
        let gradient = drawingContext.createRadialGradient(
            -this.radius / 3, -this.radius / 3, 0,
            0, 0, this.radius
        );

        // Customize gradient based on ball color
        let baseColorObj = color(this.colour);
        let r = red(baseColorObj);
        let g = green(baseColorObj);
        let b = blue(baseColorObj);

        gradient.addColorStop(0, `rgba(${r + 50}, ${g + 50}, ${b + 50}, 1)`);
        gradient.addColorStop(0.7, this.colour);
        gradient.addColorStop(1, `rgba(${r - 30}, ${g - 30}, ${b - 30}, 1)`);

        drawingContext.fillStyle = gradient;

        // Draw main ball
        ellipse(0, 0, this.diameter);

        // Add highlight
        fill(255, 255, 255, 100);
        ellipse(-this.radius / 3, -this.radius / 3, this.radius / 2);

        pop();
    }

    // Random position across the table
    static RandomPosition() {
        return {
            x: random(
                (width - tableLength) / 2 + ballRadius,
                (width + tableLength) / 2 - ballRadius
            ),
            y: random(
                (height - tableHeight) / 2 + ballRadius,
                (height + tableHeight) / 2 - ballRadius
            )
        };
    }

    // Static method to configure the balls on the table based on the mode
    static showBalls(mode) {
        balls.forEach(ball => World.remove(engine.world, ball.body));
        balls.length = 0; // Clear array

        if (mode === 0 || mode === 3) {
            Ball._setupStandardFormation();
        } else if (mode === 1 || mode === 2) {
            Ball._setupRandomBalls(mode);
        }

        //Cue ball
        let cueBall = new CueBall({ x: width / 4, y: height / 2 });
        balls.push(cueBall); 
        window.cueBall = cueBall.body; 
        cue.cueBallInstance = cueBall;
    }

    static _setupStandardFormation() {
        // Triangular red balls
        const RedPosition = { x: width / 2 + ballDiameter * 9, y: height / 2 };
        const Length = 5;

        for (let row = 0; row < Length; row++) {
            for (let col = 0; col <= row; col++) {
                const position = {
                    x: RedPosition.x + row * ballDiameter * Math.sqrt(3) / 2,
                    y: RedPosition.y - row * ballDiameter / 2 + col * ballDiameter
                };
                balls.push(new Ball(ColouredBalls.red, position));
            }
        }

        // Place coloured balls at specific positions on the table
        balls.push(new Ball(ColouredBalls.green, {
            x: width / 2 - ballDiameter * 10,
            y: height / 2 - ballDiameter * 3
        }));
        balls.push(new Ball(ColouredBalls.brown, {
            x: width / 2 - ballDiameter * 10,
            y: height / 2
        }));
        balls.push(new Ball(ColouredBalls.yellow, {
            x: width / 2 - ballDiameter * 10,
            y: height / 2 + ballDiameter * 3
        }));
        balls.push(new Ball(ColouredBalls.blue, { x: width / 2, y: height / 2 }));
        balls.push(new Ball(ColouredBalls.pink, {
            x: width / 2 + ballDiameter * 9 - ballDiameter,
            y: height / 2
        }));
        balls.push(new Ball(ColouredBalls.black, {
            x: width / 2 + ballDiameter * 15,
            y: height / 2
        }));
    }

    // Private static method to set up random balls
    static _setupRandomBalls(mode) {
        for (let i = 0; i < 15; i++) {
            balls.push(new Ball(ColouredBalls.red, Ball.RandomPosition()));
        }

        if (mode === 2) {
            Object.values(ColouredBalls)
                .filter(colour => colour !== 'red' && colour !== 'white')
                .forEach(colour => balls.push(new Ball(colour, Ball.RandomPosition())));
        }
    }
}

