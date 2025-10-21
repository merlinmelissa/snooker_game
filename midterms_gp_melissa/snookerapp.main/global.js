 // Import Matter.js library
let Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// Essential variables defining the physics engine and table dimensions
let engine;
let tableLength, tableHeight;

// Properties of balls and their corresponding container arrays
let ballDiameter, ballRadius;
let balls = []; // Holds all active balls on the table
let pockets = []; // Stores pocket locations

// State variable for repositioning the cue ball
let RepositionWhiteBall = true;

// Cue stick properties
let stickLength // Length of the cue
let stickWidth // Width of the cue

// Ball colours
const ColouredBalls = {
    green: 'green', yellow: 'yellow', red: 'red', 
    brown: 'brown', blue: 'blue', white: 'white', 
    black: 'black', pink: 'pink'
};

// Table and pocket appearance settings
let cue;
let tableColour = '#07580e'; 
let pocketColour = '#001a02'; 

// Game mode to determine ball arrangement
let GameMode = 0;

// Tracks the last ball involved in a collision
let lastCollided = '';

// Counter for consecutive colored balls pocketed
let repColouredBallPocket = 0;

// Respawning array
let RespawnBall = [];

// Timer for on-screen notifications
let timer = 0;


// overall setup
function setup() {
    createCanvas(800, 400);

    // Set initial table dimensions to match the canvas size
    tableLength = width * 0.8;
    tableHeight = height * 0.8;
    halfTableLength = tableLength / 2;
    halfTableHeight = tableHeight / 2;

    // Define ball size relative to the table
    ballDiameter = tableLength / 36;
    ballRadius = ballDiameter / 2;

    // Configure cue stick dimensions relative to canvas
    stickLength = -width / 4;
    stickWidth = width / 160;

    // Initialize the Matter.js physics engine
    engine = Engine.create();
    engine.world.gravity.y = 0; // Disable gravity

    // Create the snooker table 
    snooker = new Table(tableLength, tableHeight);

    // Position the initial cue ball on the left side of the table
    let initialCueBall = new CueBall({ x: width / 4, y: height / 2 }, false);

    // Create the cue stick, linking it to the cue ball
    cue = new Cue(stickLength, stickWidth, '#8B4513', initialCueBall);

    // Arrange game balls based on the selected game mode
    Ball.showBalls(GameMode);

    // Define the locations for all six pockets
    pockets = [
        { x: (width - tableLength) / 2, y: (height - tableHeight) / 2 }, // TOP LEFT
        { x: width / 2, y: (height - tableHeight) / 2 },                // TOP MIDDLE
        { x: (width + tableLength) / 2, y: (height - tableHeight) / 2 }, // TOP RIGHT
        { x: (width - tableLength) / 2, y: (height + tableHeight) / 2 }, // BOTTOM LEFT
        { x: width / 2, y: (height + tableHeight) / 2 },                // BOTTOM MIDDLE
        { x: (width + tableLength) / 2, y: (height + tableHeight) / 2 }  // BOTTOM RIGHT
    ];

    // Set up collision detection to trigger custom behavior
    Matter.Events.on(engine, 'collisionStart', function(event) {
        onCollision(event);
    });
}

let obstacles = []; // Initialize an empty array to store obstacle objects
 


