class Table {
    constructor(width, height) {
        // Initialize table properties and cushions
        this.initializeProperties(width, height);
        this.createCushionBodies();
    }

    // Initialize basic properties of the table
    initializeProperties(width, height) {
        this.width = width; // Table width
        this.height = height; // Table height
        this.mainColor = '#4F7942'; // Main table color
        this.borderColor = '#612502'; // Border color
        this.cushionColor = '#183614'; // Cushion color
        this.accentColor = '#8b7355'; // Accent color for borders and inlays
        this.pocketColour = pocketColour; // Color for the pockets
    }  

    // Draw the semicircle line on the table
    SemiLine() {
        const radius = this.width / 12; // Radius of the semicircle
        const centerX = width / 4 + ballDiameter * 1.2; // Center X position
        const centerY = height / 2; // Center Y position

        push();
        translate(centerX, centerY);
        rotate(-HALF_PI);
        noFill();
        stroke(255);
        strokeWeight(2);
        arc(0, 0, radius * 2, radius * 2, -PI, 0); // Draw the arc
        line(-this.width, 0, this.width, 0); // Draw the baseline
        pop();
    }

    // Matter.js cushions 
    createCushionBodies() {
        const options = { isStatic: true, restitution: 0.8, label: 'Cushion' };
        const pocketSize = ballDiameter * 1.5;
        const pocketRadius = pocketSize / 2;
        const cushionThickness = ballDiameter * 1.5;
        const horizontalCushionLength = (this.width - 2 * pocketSize) / 2;
        const verticalCushionLength = this.height - pocketSize;
        const borderThickness = ballDiameter * 1.5; // Thickness of table borders


        // Border configuration for Matter.js bodies
        const borders = [
            { x: width / 2, y: (height - this.height) / 2 - borderThickness, w: this.width + borderThickness * 2, h: borderThickness },
            { x: width / 2, y: (height + this.height) / 2 + borderThickness, w: this.width + borderThickness * 2, h: borderThickness },
            { x: (width - this.width) / 2 - borderThickness, y: height / 2, w: borderThickness, h: this.height + borderThickness * 2 },
            { x: (width + this.width) / 2 + borderThickness, y: height / 2, w: borderThickness, h: this.height + borderThickness * 2 }
        ];

        // Add borders to the world
        borders.forEach(border => {
            const body = Bodies.rectangle(border.x, border.y, border.w, border.h, options);
            World.add(engine.world, body);
        });

        // Cushion configurations
        const cushions = [
            { x: (width - this.width) / 2 + pocketRadius + horizontalCushionLength / 2, y: (height - this.height) / 2 + pocketRadius - cushionThickness / 2, angle: 0, horizontal: true },
            { x: (width - this.width) / 2 + this.width - pocketRadius - horizontalCushionLength / 2, y: (height - this.height) / 2 + pocketRadius - cushionThickness / 2, angle: 0, horizontal: true },
            { x: (width - this.width) / 2 + pocketRadius + horizontalCushionLength / 2, y: (height - this.height) / 2 + this.height - pocketRadius + cushionThickness / 2, angle: PI, horizontal: true },
            { x: (width - this.width) / 2 + this.width - pocketRadius - horizontalCushionLength / 2, y: (height - this.height) / 2 + this.height - pocketRadius + cushionThickness / 2, angle: PI, horizontal: true },
            { x: (width - this.width) / 2 + pocketRadius - cushionThickness / 2, y: (height - this.height) / 2 + pocketRadius + verticalCushionLength / 2, angle: -HALF_PI, horizontal: false },
            { x: (width - this.width) / 2 + this.width - pocketRadius + cushionThickness / 2, y: (height - this.height) / 2 + pocketRadius + verticalCushionLength / 2, angle: HALF_PI, horizontal: false }
        ];

        // Create and add cushions to the world
        cushions.forEach(cushion => {
        const length = cushion.horizontal ? horizontalCushionLength : verticalCushionLength;

        // Define vertices for each cushion
        const vertices = [
            { x: -length / 2, y: -cushionThickness / 2 },
            { x: length / 2, y: -cushionThickness / 2 },
            { x: length / 2 - cushionThickness, y: cushionThickness / 2 },
            { x: -length / 2 + cushionThickness, y: cushionThickness / 2 }
        ];

        // Create the cushion body
        const cushionBody = Bodies.fromVertices(cushion.x, cushion.y, vertices, options, true);
        Matter.Body.setAngle(cushionBody, cushion.angle);

        // Add the cushion body to the world
        World.add(engine.world, cushionBody);
        });
    }


    display() {
        this.drawTableSurface(); // Draw the main table surface
        this.SemiLine(); // Draw the semicircle line
        this.drawBorders(); // Draw table borders
        this.drawPockets();

        const pocketSize = ballDiameter * 1.5;
        const pocketRadius = pocketSize / 2;
        const cushionThickness = ballDiameter * 1.5;
        const horizontalCushionLength = (this.width - 2 * pocketSize) / 2;
        const verticalCushionLength = this.height - pocketSize;
        

                push();
                fill(this.cushionColor); // Cushion color
                stroke(this.accentColor); // Accent stroke
                strokeWeight(1);
                // Cushion placement and rotation data
                let cushionDetails = [
                { x: (width - this.width) / 2 + pocketSize / 2 + horizontalCushionLength / 2, y: (height - this.height) / 2 + pocketRadius - cushionThickness / 2, rotation: 0, Horizontal: true },
                { x: (width - this.width) / 2 + this.width - pocketSize / 2 - horizontalCushionLength / 2, y: (height - this.height) / 2 + pocketRadius - cushionThickness / 2, rotation: 0, Horizontal: true },
                { x: (width - this.width) / 2 + pocketSize / 2 + horizontalCushionLength / 2, y: (height - this.height) / 2 + this.height - pocketRadius + cushionThickness / 2, rotation: 180, Horizontal: true },
                { x: (width - this.width) / 2 + this.width - pocketSize / 2 - horizontalCushionLength / 2, y: (height - this.height) / 2 + this.height - pocketRadius + cushionThickness / 2, rotation: 180, Horizontal: true },
                { x: (width - this.width) / 2 + pocketRadius - cushionThickness / 2, y: (height - this.height) / 2 + pocketSize / 2 + verticalCushionLength / 2, rotation: 270, Horizontal: false },
                { x: (width - this.width) / 2 + this.width - pocketRadius + cushionThickness / 2, y: (height - this.height) / 2 + pocketSize / 2 + verticalCushionLength / 2, rotation: 90, Horizontal: false }
                ];
    
        
                cushionDetails.forEach(cushion => {
                // Current drawing has to be saved
                push();
                translate(cushion.x, cushion.y);
                rotate(radians(cushion.rotation));
                let cushionLength = cushion.Horizontal ? horizontalCushionLength : verticalCushionLength;
        
                //Cushion drawing
                quad(
                    -cushionLength / 2, -cushionThickness / 2,
                    cushionLength / 2, -cushionThickness / 2,
                    cushionLength / 2 - cushionThickness, cushionThickness / 2,
                    -cushionLength / 2 + cushionThickness, cushionThickness / 2
                );

                pop();
                });
        pop();

    }

        // Draw the main table surface with gradient
        drawTableSurface() {
            const gradient = drawingContext.createLinearGradient(
                width / 2 - this.width / 2,
                height / 2 - this.height / 2,
                width / 2 + this.width / 2,
                height / 2 + this.height / 2
            );
            gradient.addColorStop(0, this.mainColor); // Gradient start color
            gradient.addColorStop(1, '#143c22'); // Gradient end color
            drawingContext.fillStyle = gradient;
    
            rect((width - this.width) / 2, (height - this.height) / 2, this.width, this.height); // Draw table
            rect( // Draw inner details
                this.width * 0.104 - ballDiameter * 1.1,
                (height - this.height) / 3,
                this.width * 1.08 + ballDiameter * 1.1,
                this.width * 0.5 + ballDiameter * 1.5
            );
        }

        // Draw table borders with inlays
        drawBorders() {
            push();
            fill(this.borderColor); // Border color
            stroke(this.accentColor); // Accent stroke
            strokeWeight(2);

            const pocketSize = ballDiameter * 1.5;

            // Draw the borders
            rect(this.width * 0.103 - pocketSize, -1, this.width * 1.085 + pocketSize, pocketSize, 20);
            rect(this.width * 0.103 - pocketSize, height * 0.936, this.width * 1.085 + pocketSize, pocketSize, 20);
            rect(this.width * 0.103 - pocketSize, ballDiameter * 1.4, pocketSize, this.width * 0.5 + ballDiameter * 1.7);
            rect(this.width * 1.105 + pocketSize, ballDiameter * 1.4, pocketSize, this.width * 0.5 + ballDiameter * 1.7);
            

            fill(this.accentColor);
            // Add corner inlays
            this.drawCornerInlay(this.width * 0.102 - pocketSize, -1);
            this.drawCornerInlay(this.width * 1.12, -1);
            this.drawCornerInlay(this.width * 1.12, height * 0.89);
            this.drawCornerInlay(this.width * 0.102 - pocketSize, height * 0.89);
            pop();
        }

        // Draw corner inlays with gradient effect
        drawCornerInlay(x, y) {
            push();
            noStroke();
            for (let i = 0; i < 3; i++) {
                fill(lerpColor(color(this.accentColor), color(this.borderColor), i / 3));
                rect(x + i * 2, y + i * 2, ballDiameter * 2.5 - i * 4, ballDiameter * 2.5 - i * 4, 15 - i);
            }
            pop();
        }

        //Draw pockets
        drawPockets() {
            const pocketSize = ballDiameter * 1.5;
    
            // Draw pockets at specific locations
            for (let x of [0, this.width / 2, this.width]) {
                for (let y of [0, this.height]) {
                    fill(this.pocketColour);
                    ellipse((width - this.width) / 2 + x, (height - this.height) / 2 + y, pocketSize);
                }
            }
        }
}
        


