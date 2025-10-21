/* COMMENTARY OF MY SNOOKER APP
=======================================================================
# Snooker Game with P5.js and Matter.js
=======================================================================

This project simulates a dynamic snooker game by leveraging p5.js for 
rendering and Matter.js for physics simulation. The snooker table and 
balls are designed using p5.js, while Matter.js handles the underlying 
physics simulation. The collaboration between these two libraries creates 
a visually appealing and realistic gaming experience. Physics aspects like 
collision detection, energy conservation, and friction mimic real-world 
snooker dynamics. Balls bounce off cushions with lifelike responses, and 
their rolling behavior reflects momentum and drag effects. These subtle 
yet impactful details enrich gameplay, ensuring players feel immersed in 
a credible simulation of snooker.

-----------------------------------------------------------------------
### Intuitive Controls for Enhanced Gameplay cue and cueball:
-----------------------------------------------------------------------
The app is designed to deliver an engaging and interactive snooker 
experience by combining mouse-based aiming and cue placement with 
keyboard-based force adjustment. The mouse is used to position and aim 
the cue stick, offering precise control over shot direction. The keyboard 
is utilized to adjust the shot's power, with specific keys mapped to 
increase or decrease force. This dual-input system adds depth to gameplay, 
requiring players to strategize and refine their skills. I chose both mouse
and key for a more realistic apprach.

-----------------------------------------------------------------------
### Realistic Physics Integration:
-----------------------------------------------------------------------
The physics simulation powered by Matter.js ensures that every interaction 
on the table feels authentic. The balls move and collide realistically, 
with energy transfer and friction accurately modeled. Cushions respond 
dynamically to ball impacts, adding a level of immersion that mirrors the 
physical nuances of real-world snooker. The rolling behavior of balls, 
affected by drag and spin, further enhances the realism. These mechanics 
are finely tuned to strike a balance between complexity and accessibility, 
making the game enjoyable for casual players and enthusiasts alike.

-----------------------------------------------------------------------
### Innovative Rat Obstacle Extension:
-----------------------------------------------------------------------
An exciting extension to the game is the inclusion of a unique rat obstacle. 
The rat obstacle appears first after 20 seconds, with new ones of various 
sizes and positions introduced at intervals of 20 seconds. This feature 
introduces a new layer of challenge and unpredictability. If the cue ball 
touches the rat, it deflects, altering its trajectory and creating 
opportunities for unexpected gameplay outcomes. This obstacle encourages 
players to aim and time their shots carefully, taking the rat’s position 
into account. The inclusion of the rat obstacle not only adds humor and 
personality but also significantly increases the game’s replay value by 
challenging players in a fun and unconventional way.

-----------------------------------------------------------------------
### Dynamic Visual and Gameplay Appeal:
-----------------------------------------------------------------------
The app’s design incorporates gradient effects for the table, creating a 
realistic and visually pleasing playing surface. Shadowing effects are 
applied to the balls to give them a sense of depth and dimension, 
enhancing their lifelike appearance. The cue is meticulously designed to 
resemble its real-life counterpart, with precise proportions and details. 
Additionally, the cue's movement is mirrored to real-life mechanics, 
simulating the experience of playing with an actual snooker cue. This 
attention to detail ensures that players feel as though they are engaged 
in an authentic snooker match, elevating the overall immersive quality of 
the game.

=======================================================================
*/



// Draw function for the snooker app
function draw() {
    background(255); // Set white background
    
    // Handle cue repositioning or update the physics engine
    if (RepositionWhiteBall) {
        const ballsStationary = !ballMotion(); // Check if balls are stationary
        const isSpecialGameMode = GameMode === 3; // Check for special game mode (Mode 4)
    
        if (ballsStationary || isSpecialGameMode) {
            // Reposition the cue ball within the 'D' area based on the mouse position
            const targetPosition = PositionD(mouseX, mouseY);
            Matter.Body.setPosition(window.cueBall, targetPosition);
        }
    } else {
        // Advance the physics simulation when repositioning is not active
        Engine.update(engine);
    }
    
    // Display the snooker table and balls
    snooker.display();
    balls.forEach(ball => ball.display());
    
    // Handle cue behavior when not repositioning the cue ball
    if (!RepositionWhiteBall) {
        const noBallsMovingOrStriking = !ballMotion() || cue.isStriking;
        const specialGameModeActive = GameMode === 3 && !cueballMotion();
        
        if (noBallsMovingOrStriking || specialGameModeActive) {
            cue.AdjustPosition();     // Update the cue's position
            cue.display();            // Render the cue
            cue.displayForceBar();    // Show the force bar
            cue.projectGuideLine();   // Display the guideline projection
        }
    }
    
    // Adjust cue force based on arrow key input
    if (keyIsDown(UP_ARROW)) {
        cue.ForceChange(true); // Force increases with the up arrow
    } else if (keyIsDown(DOWN_ARROW)) {
        cue.ForceChange(false); // Force decreases with the down arrow
    }
    
    // Process balls respawning and removal
    for (let i = balls.length - 1; i >= 0; i--) {
        const { body: ballBody, colour: ballColour } = balls[i];
        const { x: ballX, y: ballY } = ballBody.position;

        // Check each pocket for collisions with the ball
        for (const { x: pocketX, y: pocketY } of pockets) {
            const distanceToPocket = dist(ballX, ballY, pocketX, pocketY);
    
            // Determine if the ball is pocketed based on proximity
            if (distanceToPocket < ballRadius * 1.2) {
                World.remove(engine.world, ballBody); // Remove ball from the physics world
    
                // Handle cue ball respawning
                if (balls[i] instanceof CueBall) {
                    RespawnBall.push(balls[i]);
                }
                // Handle non-cue, colored balls
                else if (![ColouredBalls.red, ColouredBalls.white].includes(ballColour)) {
                    RespawnBall.push(balls[i]);
                    repColouredBallPocket++;
    
                    // Notify on two consecutive colored balls pocketed
                    if (repColouredBallPocket === 2) {
                        console.log("Two consecutive colored balls pocketed!");
                        timer = 3 * 60; // 3 seconds timer
                    }
                }
                // Reset streak for non-colored balls
                else {
                    repColouredBallPocket = 0;
                }
                balls.splice(i, 1); // Remove the ball from the array
            }
        }
    }
    
    // Display the "Two consecutive coloured balls pocketed!" message if the timer is on
    if (timer > 0) {
        push();
        fill(255); // White text color
        strokeWeight(4); // Bold text outline
        stroke(50); // Gray outline color
        textAlign(CENTER, CENTER); // Center-align the text
        textSize(32); // Set font size
        text("Two consecutive coloured balls pocketed!", width / 2, height / 2); // Display message at the center
        pop();
        timer--; // Reduce the timer by 1 each frame
    }
    
    // Handle respawning balls or repositioning the cue ball
    if ((!ballMotion() && RespawnBall.length > 0) || (!RepositionWhiteBall && GameMode === 3)) {
        // Process each ball in the RespawnBall list
        for (const ball of RespawnBall) {
            // Handle cue ball repositioning
            if (ball instanceof CueBall) {
                RepositionWhiteBall = true; // Flag for cue ball repositioning
                reEnablePhysics();
                continue;
            }
    
            // Respawn colored balls at predefined locations
            const spawnPosition = (() => {
                switch (ball.colour) {
                    case ColouredBalls.yellow:
                        return { x: width / 2 - ballDiameter * 10, y: height / 2 + ballDiameter * 3 };
                    case ColouredBalls.green:
                        return { x: width / 2 - ballDiameter * 10, y: height / 2 - ballDiameter * 3 };
                    case ColouredBalls.brown:
                        return { x: width / 2 - ballDiameter * 10, y: height / 2 };
                    case ColouredBalls.blue:
                        return { x: width / 2, y: height / 2 };
                    case ColouredBalls.pink:
                        return { x: width / 2 + ballDiameter * 9 - ballDiameter, y: height / 2 };
                    case ColouredBalls.black:
                        return { x: width / 2 + ballDiameter * 15, y: height / 2 };
                    default:
                        return null; // No action for unrecognized colors
                }
            })();
    
            // Add the ball to the game if a valid spawn position is determined
            if (spawnPosition) {
                balls.push(new Ball(ball.colour, spawnPosition));
            }
        }
    
        // Clear the RespawnBall list after processing
        RespawnBall = [];
    }
    
    // Display information about the last collision (if applicable)
    displayCollisionInfo();

    // Render obstacles in Mode 4
    if (GameMode === 3) {
        obstacles.forEach(obstacle => obstacle.display());
    }
}

// Update the keyPressed function to toggle modes
// Handle key press events
function keyPressed() {
    // Determine game mode based on number key input
    switch (key) {
        case '1':
            GameMode = 0;
            Ball.showBalls(GameMode);
            break;
        case '2':
            GameMode = 1;
            Ball.showBalls(GameMode);
            break;
        case '3':
            GameMode = 2;
            Ball.showBalls(GameMode);
            break;
        case '4':
            GameMode = 3;
            initializeMode4(); // Set up Mode 4
            break;
    }

    // If a valid game mode key is pressed, reset the cue ball
    if (key >= '1' && key <= '4') {
        GameMode = parseInt(key) - 1; // Convert the key to the corresponding game mode index
        Ball.showBalls(GameMode);
    
        // Reposition the cue ball within the 'D' area
        const newPosition = PositionD(width / 4, height / 2);
        if (window.cueBall) {
            Matter.Body.setPosition(window.cueBall, newPosition); // Move cue ball to the new position
            Matter.Body.setVelocity(window.cueBall, { x: 0, y: 0 }); // Stop any motion
        }
        
        RepositionWhiteBall = true; // Activate repositioning mode
        if (cue) cue.isStriking = false; 
    }
}

// Handles mouse movement for cue positioning
function mouseMoved() {
    // Update cue position and angle only if repositioning is inactive
    if (cue && !cue.isStriking && !RepositionWhiteBall) {
        const cueBallPos = cue.cueBallInstance.body.position; // Get cue ball position
        const mouseDist = dist(mouseX, mouseY, cueBallPos.x, cueBallPos.y); // Calculate distance from mouse to cue ball
        
        cue.angleCalc(mouseX, mouseY, cueBallPos); // Angle must depend upon mouse point
        cue.newPos(mouseDist); // Update cue position based on the distance
    }
}

// Handles mouse click for striking or cue ball placement
function mouseClicked() {
    // Check if ball repositioning is active
    if (!RepositionWhiteBall) {
        // Calculate total movement of cue ball
        const totalMovement = 
            Math.hypot(window.cueBall.velocity.x, window.cueBall.velocity.y) +
            Math.abs(window.cueBall.angularVelocity);
            
        // Execute strike if conditions met
        if (totalMovement < 0.01 && !cue.isStriking) {
            cue.strike(window.cueBall);
        }
    } 
    // Handle ball placement within D zone
    else if ((mouseButton === LEFT) && insideD(mouseX, mouseY)) {
        RepositionWhiteBall = false;
        Matter.Body.setVelocity(window.cueBall, { x: 0, y: 0 });
    }
}
    
    
    // Reactivate physics for the cue ball while repositioning
    function reEnablePhysics() {
        const newPosition = PositionD(width / 4, height / 2);
    
        // Create and add the cue ball
        const cueBall = new CueBall(newPosition, true);
        balls.push(cueBall);
    
        // Update references 
        window.cueBall = cueBall.body;
        cue.cueBallInstance = cueBall;
    }
    
    // Semicicle confinement for the table
    function PositionD(x, y) {
        const dRadius = tableLength / 12; // 'D' radius
        const dCenter = { x: width / 4 + ballDiameter * 1.2, y: height / 2 }; // 'D' center coordinates
    
        const angle = atan2(y - dCenter.y, x - dCenter.x); // Angle from center to point
        const distance = dist(x, y, dCenter.x, dCenter.y); // Distance from point to center
    
        // Adjust position if outside 'D' radius
        if (distance > dRadius) {
            x = dCenter.x + dRadius * cos(angle);
            y = dCenter.y + dRadius * sin(angle);
        }
    
        // Restrict position to the left semicircle of the 'D'
        x = min(x, dCenter.x);
    
        return { x, y };
    }
    
    // Verifies if it is within semicircle area
    function insideD(x, y) {
        const dRadius = tableLength / 12; // Radius of the 'D' semicircle
        const dCenterX = width / 4 + ballDiameter * 1.2; // Center X-coordinate
        const dCenterY = height / 2; // Center Y-coordinate
    
        const withinRadius = dist(x, y, dCenterX, dCenterY) <= dRadius; // Check distance
        const withinLeftSide = x <= dCenterX; // Ensure point is within the left semicircle
    
        return withinRadius && withinLeftSide;
    }
    // Handles collision events in the game
    function onCollision(event) {
        const collisionPairs = event.pairs; // Retrieve all collision pairs
    
        collisionPairs.forEach(pair => {
            const { bodyA, bodyB } = pair; // Extract the colliding bodies
    
            // Handle ball-obstacle collisions
            if (
                (bodyA.label.includes("ball") && bodyB.label === "Obstacle") ||
                (bodyB.label.includes("ball") && bodyA.label === "Obstacle")
            ) {
                const ball = bodyA.label.includes("ball") ? bodyA : bodyB; // Determine the ball
                const velocity = Matter.Body.getVelocity(ball); // Get the ball's current velocity
    
                // Reflect the ball by reversing its velocity
                Matter.Body.setVelocity(ball, { x: -velocity.x, y: -velocity.y });
                console.log("Ball reflected off an obstacle!");
                lastCollided = "Ball collided with an obstacle"; // Update collision message
            }
    
            // Handle cue ball-specific collisions
            if (bodyA === window.cueBall || bodyB === window.cueBall) {
                const otherBody = bodyA === window.cueBall ? bodyB : bodyA; // Determine the other body
    
                switch (otherBody.label) {
                    case "Cushion":
                        lastCollided = "Cue ball hit a cushion";
                        console.log(lastCollided);
                        break;
                    case "Ball":
                        const ballColor = otherBody.render.fillStyle; // Extract ball color
                        lastCollided = `Cue ball hit a ${ballColor} ball`;
                        console.log(lastCollided);
                        break;
                    case "Obstacle":
                        lastCollided = "Cue ball hit an obstacle";
                        console.log(lastCollided);
                        break;
                }
            }
        });
    }
    
    // Renders the last collision information on the canvas
    function displayCollisionInfo() {
        push();
        fill(255); // White text color
        noStroke(); // No text outline
        textSize(18); // Font size
        text(lastCollided, 100, height - 9); // Display text at the bottom-left corner
        pop();
    }
    // Verifies if any ball on the table is in motion
    function ballMotion() {
        for (const ball of balls) {
            const velocityX = Math.abs(ball.body.velocity.x); // Ball's velocity along the X-axis
            const velocityY = Math.abs(ball.body.velocity.y); // Ball's velocity along the Y-axis
    
            // If any ball's velocity exceeds the threshold, return true
            if (velocityX > 0.01 || velocityY > 0.01) {
                return true;
            }
        }
        return false;
    }
    
    // Determines whether the cue ball is currently moving
    function cueballMotion() {
        // Check if the cue ball's physics body exists
        if (window.cueBall) {
            const cueBallVelocityX = Math.abs(window.cueBall.velocity.x); // Cue ball's velocity along X-axis
            const cueBallVelocityY = Math.abs(window.cueBall.velocity.y); // Cue ball's velocity along Y-axis
    
            // If cue ball's velocity exceeds the threshold, it's moving
            return cueBallVelocityX > 0.01 || cueBallVelocityY > 0.01;
        }
        return false;
    }
    
    // Handles collision events in the game
    function collisionHandler(event) {
        const collisionPairs = event.pairs; // Retrieve all collision pairs
    
        collisionPairs.forEach(pair => {
            const { bodyA, bodyB } = pair; // Extract the colliding bodies
            console.log(`${bodyA.label} - ${bodyB.label}`); // Log the collision
    
            // Manages interactions between the cue ball and the cue 
            if (bodyA.label === "cue" || bodyB.label === "cue") {
                const speedAdjustment = Body.getSpeed(cue.cueBody) / 20000; // Adjust cue speed
                const cueAngle = cue.cueBody.angle; // Get the cue's angle
                const appliedForce = p5.Vector.fromAngle(cueAngle).setMag(speedAdjustment); // Calculate force vector
    
                // Cache the cue ball's body and the applied force
                cueBallCache = {
                    cueBall: cueBall.body,
                    force: { x: appliedForce.x, y: appliedForce.y }
                };
            }
    
            // Handle collisions between balls and pocket sensors
            if (bodyA.label.includes("ball") && bodyB.label === "pocketSensor") {
                ball_pocket_collision(bodyA); // Process collision for the ball
            } else if (bodyB.label.includes("ball") && bodyA.label === "pocketSensor") {
                ball_pocket_collision(bodyB); // Process collision for the ball
            }
        });
    }
    
   
    function generateRandomObstacle() {
        let x = random(width / 4, (3 * width) / 4); // Random x within table bounds
        let y = random(height / 4, (3 * height) / 4); // Random y within table bounds
        let size = random(10, 30); // Random size for the obstacle
    
        // Create a new obstacle and add it to the physics world
        let obstacle = new Obstacle({ x, y }, size);
        World.add(engine.world, obstacle.body); // Add the obstacle to the physics engine
        obstacles.push(obstacle); // Store the obstacle in the global obstacles array
    
        console.log(`New obstacle created at (${x}, ${y}) with size ${size}`);
    }
    
    let obstacleTimer;
    
    function initializeMode4() {
        clearInterval(obstacleTimer);
    
    
        // Generate obstacles every 10 seconds
        obstacleTimer = setInterval(() => {
            generateRandomObstacle();
        }, 20000);
    }
    
    function stopMode4() {
        clearInterval(obstacleTimer);
        obstacles = []; // Clear obstacles when leaving Mode 4
    }

