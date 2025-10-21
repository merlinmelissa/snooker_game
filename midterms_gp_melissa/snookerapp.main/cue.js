class Cue {
    // Constructor to set up the properties of the cue stick
    constructor(length, width, colour, cueBall) {
        this.length = length; // Overall length of the cue stick
        this.width = width; // Thickness of the cue stick
        this.colour = colour; // Visual appearance color of the cue stick
        this.angle = 0; // Rotation angle of the cue stick, initialized to zero
        this.isStriking = false; // Tracks if a strike action is ongoing
        this.cueBallInstance = cueBall; // Stores the cue ball object for reference

        // Set the initial position of the cue stick near the cue ball
        this.x = cueBall.position.x;
        this.y = cueBall.position.y;

        // Force and distance parameters
        this.maximumForce = 0.0015;
        this.minimumDistCue = 50;
        this.maxPullBackt = 100;
        this.forceLevel = 5;
        this.maxforceLevel = 10;

        // Visual properties
        this.woodColor = '#8B4513'; // Wooden part
        this.tipColor = '#f2f3f2'; // Tip color
        this.leatherColor = '#8B5742'; // Grip section
        this.metalColor = '#C0C0C0'; // Metal ring
    }

    projectGuideLine() {
        if (!this.cueBallInstance || this.isStriking) return;

        // Check if the cue ball is moving
        const cueBallVel = this.cueBallInstance.body.velocity;
        if (Math.abs(cueBallVel.x) > 0.01 || Math.abs(cueBallVel.y) > 0.01) return;

        // Table boundaries
        const cueBallPos = this.cueBallInstance.body.position;
        const leftBound = width / 2 - halfTableLength + 10;
        const rightBound = width / 2 + halfTableLength - 10;
        const topBound = height / 2 - halfTableLength + 170;
        const bottomBound = height / 2 + halfTableLength - 170;

        // Initial trajectory
        const baseLength = 50;
        const projectionLength = baseLength * this.forceLevel;
        let beginX = cueBallPos.x;
        let beginY = cueBallPos.y;
        let dx = Math.cos(this.angle);
        let dy = Math.sin(this.angle);

        const maxBounces = 2;
        push();
        stroke(255, 0, 0);
        strokeWeight(1);

        for (let i = 0; i < maxBounces; i++) {
            let t = Infinity;
            let endX = beginX + projectionLength * dx;
            let endY = beginY + projectionLength * dy;

            if (dx > 0) {
                t = (rightBound - beginX) / dx;
                if (t < (endY - beginY) / dy) {
                    endX = rightBound;
                    endY = beginY + t * dy;
                }
            } else if (dx < 0) {
                t = (leftBound - beginX) / dx;
                if (t < (endY - beginY) / dy) {
                    endX = leftBound;
                    endY = beginY + t * dy;
                }
            }
            if (dy > 0) {
                t = Math.min(t, (bottomBound - beginY) / dy);
                if (t < (endX - beginX) / dx) {
                    endX = beginX + t * dx;
                    endY = bottomBound;
                }
            } else if (dy < 0) {
                t = Math.min(t, (topBound - beginY) / dy);
                if (t < (endX - beginX) / dx) {
                    endX = beginX + t * dx;
                    endY = topBound;
                }
            }

            // Draw the line segment
            line(beginX, beginY, endX, endY);

            // Update start point for next segment
            beginX = endX;
            beginY = endY;

            // Reflect the direction vector
            if (endX === leftBound || endX === rightBound) dx *= -1;
            if (endY === topBound || endY === bottomBound) dy *= -1;
        }
        pop();
    }

    AdjustPosition() {
        if (this.cueBallInstance && !this.isStriking) {
            let cueBallPos = this.cueBallInstance.body.position;
            this.x = cueBallPos.x - ballDiameter * cos(this.angle);
            this.y = cueBallPos.y - ballDiameter * sin(this.angle);
            this.cueBallInstance.constrainPosition();
        }
    }

    angleCalc(mouseX, mouseY, cueBallPos) {
        let distX = cueBallPos.x - mouseX;
        let distY = cueBallPos.y - mouseY;
        this.angle = atan2(distY, distX);
    }

    newPos(mouseDist) {
        let threshold = 10;
        if (mouseDist > threshold) {
            let offset = min(mouseDist - threshold, this.maxPullBackt);
            this.x += offset * cos(this.angle);
            this.y += offset * sin(this.angle);
        }
    }

    forceGetter() {
        let cueBallPos = this.cueBallInstance.body.position;
        let distance = dist(this.x, this.y, cueBallPos.x, cueBallPos.y);
        return map(distance, this.minimumDistCue, this.length, this.maximumForce, 0, true);
    }

    ForceChange(increase) {
        const forceChange = 0.2;
        if (increase && this.forceLevel < this.maxforceLevel) {
            this.forceLevel += forceChange;
        } else if (!increase && this.forceLevel > 1) {
            this.forceLevel -= forceChange;
        }
    }

    strike(cueBall) {
        if (!this.validateStrike(cueBall)) return;
        this.initializeStrike();
        this.executeStrike(cueBall);
    }

    validateStrike(cueBall) {
        return !this.isStriking && cueBall;
    }

    initializeStrike() {
        this.isStriking = true;
    }

    executeStrike(cueBall) {
        this.animateCueStrike(cueBall, () => {
            const force = this.calculateForce();
            this.applyForceToBall(cueBall, force);
            this.resetStrikeState();
        });
    }

    calculateForce() {
        const forceMagnitude = this.forceLevel * this.maximumForce;
        return p5.Vector.fromAngle(this.angle).mult(forceMagnitude);
    }

    applyForceToBall(cueBall, forceVector) {
        Body.applyForce(cueBall, cueBall.position, forceVector);
    }

    resetStrikeState() {
        setTimeout(() => {
            this.isStriking = false;
        }, 500);
    }

    animateCueStrike(cueBall, callback) {
        let totalAnimationDuration = map(this.forceLevel, 1, this.maxforceLevel, 375, 625);
        let pullBackDuration = (totalAnimationDuration * 3) / 4;
        let strikeDuration = totalAnimationDuration / 4;
        let frames = 60;

        let pullBackFrames = Math.round((frames * pullBackDuration) / totalAnimationDuration);
        let strikeFrames = frames - pullBackFrames;
        let originalPosition = { x: this.x, y: this.y };

        let maxPullBack = this.length / 2;
        let distancePulled = map(this.forceLevel, 1, this.maxforceLevel, 0, maxPullBack);

        for (let frame = 0; frame < pullBackFrames; frame++) {
            const delay = (pullBackDuration / pullBackFrames) * frame;
            setTimeout(() => {
                const lerpFactor = frame / pullBackFrames;
                const targetX = originalPosition.x + distancePulled * cos(this.angle);
                const targetY = originalPosition.y + distancePulled * sin(this.angle);

                this.x = lerp(originalPosition.x, targetX, lerpFactor);
                this.y = lerp(originalPosition.y, targetY, lerpFactor);
            }, delay);
        }

        const strikeTarget = {
            x: cueBall.position.x + ballRadius * cos(this.angle) - ballRadius * 2 * cos(this.angle),
            y: cueBall.position.y + ballRadius * sin(this.angle) - ballRadius * 2 * sin(this.angle)
        };

        for (let frame = 0; frame < strikeFrames; frame++) {
            const delay = pullBackDuration + (strikeDuration / strikeFrames) * frame;
            const startPos = {
                x: originalPosition.x + distancePulled * cos(this.angle),
                y: originalPosition.y + distancePulled * sin(this.angle)
            };

            setTimeout(() => {
                const lerpFactor = frame / strikeFrames;
                this.x = lerp(startPos.x, strikeTarget.x, lerpFactor);
                this.y = lerp(startPos.y, strikeTarget.y, lerpFactor);

                if (frame === strikeFrames - 1 && callback) callback();
            }, delay);
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        let cueLength = this.length;
        let shaftProportion = 0.5;
        let gripProportion = 0.5;
        let tripProportion = 0.01;

        let shaftSectionLength = shaftProportion * cueLength;
        let gripSectionLength = gripProportion * cueLength;
        let tipSectionLength = tripProportion * cueLength;

        this.drawWoodGrain(shaftSectionLength, -this.width / 2, gripSectionLength, this.width);

        let shaftGradient = drawingContext.createLinearGradient(
            0, -this.width / 2,
            shaftSectionLength, this.width / 2
        );
        shaftGradient.addColorStop(0, '#fcf2cd');
        shaftGradient.addColorStop(1, '#e5dbb5');
        drawingContext.fillStyle = shaftGradient;
        rect(tipSectionLength, -this.width / 2, shaftSectionLength, this.width);

        fill(this.metalColor);
        rect(tipSectionLength / 2, -this.width / 2, tipSectionLength / 2, this.width);

        let tipGradient = drawingContext.createLinearGradient(
            0, -this.width / 2,
            tipSectionLength / 2, this.width / 2
        );
        tipGradient.addColorStop(0, '#8B4513');
        tipGradient.addColorStop(1, '#654321');
        drawingContext.fillStyle = tipGradient;
        rect(0, -this.width / 2, tipSectionLength / 2, this.width);

        pop();
    }

    drawWoodGrain(x, y, width, height) {
        let grainCount = 8;
        for (let i = 0; i < grainCount; i++) {
            let yPos = y + (height * i / grainCount);
            let grainGradient = drawingContext.createLinearGradient(
                x, yPos,
                x + width, yPos + height / grainCount
            );
            grainGradient.addColorStop(0, '#8B4513');
            grainGradient.addColorStop(0.5, '#A0522D');
            grainGradient.addColorStop(1, '#8B4513');
            drawingContext.fillStyle = grainGradient;
            rect(x, yPos, width, height / grainCount);
        }
    }

    displayForceBar() {
        push();
        let barGradient = drawingContext.createLinearGradient(
            width - 30, 50,
            width - 10, 150
        );
        barGradient.addColorStop(0, '#333333');
        barGradient.addColorStop(1, '#666666');
        drawingContext.fillStyle = barGradient;
        rect(width - 30, 50, 20, 100);

        let forceGradient = drawingContext.createLinearGradient(
            width - 30, 150,
            width - 10, 50
        );
        forceGradient.addColorStop(0, '#ff0000');
        forceGradient.addColorStop(0.5, '#ff6666');
        forceGradient.addColorStop(1, '#ff9999');

        drawingContext.fillStyle = forceGradient;
        let barHeight = map(this.forceLevel, 1, this.maxforceLevel, 0, 98);
        rect(width - 30, 150 - barHeight, 20, barHeight);
        pop();
    }
}


