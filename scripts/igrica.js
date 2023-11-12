var player;
var asteroids = []
const asteroidFrequency = 500; // milliseconds
const asteroidLifeSpan = 30_000;
var lastAsteroidSpawn = new Date().getTime();
var windowWidth = window.innerWidth-30
var windowHeight = window.innerHeight-30

// Keyboard input handling
var keyState;

window.addEventListener("keydown", (e) => {
    keyState = e.key;
});

window.addEventListener("keyup", (e) => {
    keyState = e.key;
});

window.addEventListener("keyright", (e) => {
    keyState = e.key;
});

window.addEventListener("keyleft", (e) => {
    keyState = e.key;
});


function startGame() {
    player = new player(30, 30, "red", windowWidth/2, windowHeight/2);
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function player(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = 15;
    this.speed_y = 15;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        if (keyState == "ArrowUp" && this.y - this.height / 2 > 0) {
            this.y -= this.speed_y;
            keyState = ""
        }
        else if (keyState == "ArrowDown" && this.y + this.height / 2 < windowHeight) {
            this.y += this.speed_y;
            keyState = ""
        }
        else if (keyState == "ArrowLeft" && this.x - this.width / 2 > 0) {
            this.x -= this.speed_x;
            keyState = ""
        }
        else if (keyState == "ArrowRight" && this.x + this.width / 2 < windowWidth) {
            this.x += this.speed_x;
            keyState = ""
        }
    }
}


function asteroid() {
    this.color = "black"

    this.width = Math.random() * (150 - 20) + 20;
    this.height = this.width;
    this.createdAt = new Date().getTime();

    this.desiredDirection = "" //general direction in which asteroid should move 

    this.startPosition = Math.floor((Math.random() * 4)-0.00000001)
    if (this.startPosition == 0) { //left
        this.x = 0 - this.width;
        this.y = Math.random() * windowHeight;
        this.desiredDirection = "R"
    } else if(this.startPosition == 1) { //right
        this.x = windowWidth + this.width; 
        this.y = Math.random() * windowHeight;
        this.desiredDirection = "L"
    } else if (this.startPosition == 2) { //up
        this.y = 0 - this.height;
        this.x = Math.random() * windowWidth;
        this.desiredDirection = "D"
    } else { //down
        this.y = windowHeight + this.height
        this.x = Math.random() * windowWidth;
        this.desiredDirection = "U"
    }

    this.speed_x = Math.random() * (10 - 2) + 2;
    this.speed_y = Math.random() * (10 - 2) + 2;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }

    var otherSpeedCompDir = Math.floor((Math.random() * 2)-0.00000001)
    this.newPos = function () {
        if (this.desiredDirection == "R") {
            this.x += this.speed_x;
            if (otherSpeedCompDir == 0) {
                this.y += this.speed_y
            } else {
                this.y -= this.speed_y
            }
        }
        else if (this.desiredDirection == "L") {
            this.x -= this.speed_x;
            if (otherSpeedCompDir == 0) {
                this.y += this.speed_y
            } else {
                this.y -= this.speed_y
            }
        }
        else if (this.desiredDirection == "D") {
            this.y += this.speed_y;
            if (otherSpeedCompDir == 0) {
                this.x += this.speed_x
            } else {
                this.x -= this.speed_x
            }
        }
        else if (this.desiredDirection == "U") {
            this.y -= this.speed_y;
            if (otherSpeedCompDir == 0) {
                this.x += this.speed_x
            } else {
                this.x -= this.speed_x
            }
            
        }
    }
}


function spawnAsteroids() {
    const currentTime = new Date().getTime();
    if (currentTime - lastAsteroidSpawn > asteroidFrequency) {
        asteroids.push(new asteroid());
        lastAsteroidSpawn = currentTime;
    }
}


function checkCollisions() {
    for (const a of asteroids) {
        if (
            player.x - player.width / 2 < a.x + a.width / 2 &&
            player.x + player.width / 2 > a.x - a.width / 2&&
            player.y - player.height / 2 < a.y + a.height / 2 &&
            player.y + player.height / 2 > a.y - a.height / 2
        ) {
            asteroids = []
            startGame();
        }
    }
}


function updateGameArea() {
    checkCollisions()

    myGameArea.clear();
    spawnAsteroids();
    player.newPos();
    player.update();

    for (let a of asteroids) {
        if (new Date().getTime() - a.createdAt > asteroidLifeSpan) {
            asteroids.pop(a)
        }
        a.newPos();
        a.update();
    }
}