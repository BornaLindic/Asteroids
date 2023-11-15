var gameActive = false
var myPlayer;
var startTimestamp
var asteroids
var startNumAsteroids;
var asteroidFrequency;
const asteroidLifeSpan = 30_000;
var lastAsteroidSpawn = new Date().getTime();
var windowWidth = window.innerWidth-30
var windowHeight = window.innerHeight-60

if (!localStorage.highScore) {
    localStorage.highScore = 0
}

// Keyboard input handling
var keyState;
window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp" ||
            e.key == "ArrowDown" ||
            e.key == "ArrowRight" ||
            e.key == "ArrowLeft") {
        keyState = e.key;
        if (!gameActive) {
            startGame()
            gameActive = true
        }
    }
});


function mainMenuScreen() {
    myGameArea.setCanvas();
    ctx = myGameArea.context;
    ctx.font = "20px Georgia";
    ctx.fillText("Za pokretanje igre pritisnike neku od strelica.", windowWidth/2-200, windowHeight/2)
}


function startGame() {
    startNumAsteroids = document.getElementById('pocetniBrojAsteroida').value
    asteroidFrequency = document.getElementById("frekvenicijaAsteroida").value
    
    asteroids = []
    for (let i = 0; i < startNumAsteroids; i++) {
        asteroids.push(new asteroid)
    }

    startTimestamp = new Date()

    myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    myPlayer = new player(30, 30, "red", windowWidth/2, windowHeight/2);
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    setCanvas: function () {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[document.body.childNodes.length-1])},
    start: function () {
        this.frameNo = 0;
        if (!gameActive) {
            this.interval = setInterval(updateGameArea, 20);
        }
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
        ctx.shadowBlur = 20;
        ctx.shadowColor = "black";
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
    this.color = "grey"

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
        ctx.shadowBlur = 20;
        ctx.shadowColor = "black";
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
            myPlayer.x - myPlayer.width / 2 < a.x + a.width / 2 &&
            myPlayer.x + myPlayer.width / 2 > a.x - a.width / 2&&
            myPlayer.y - myPlayer.height / 2 < a.y + a.height / 2 &&
            myPlayer.y + myPlayer.height / 2 > a.y - a.height / 2
        ) {
            asteroids = []
            endGame()
        }
    }
}


function getScore(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const millisecondsFormatted = String(milliseconds % 1000).padStart(3, '0');
    const minutesFormatted = String(minutes).padStart(2, '0');
    const secondsFormatted = String(seconds).padStart(2, '0');

    return `${(minutesFormatted)}:${secondsFormatted}:${millisecondsFormatted}`
}


function drawScores() {
    var ctx = myGameArea.context;
    ctx.font = "20px Georgia";

    ctx.fillText(`Vrijeme: ${(getScore(Date.now() - startTimestamp))}`, windowWidth - 300, 50)
    ctx.fillText(`Najbolje vrijeme: ${(getScore(localStorage.highScore))}`, windowWidth - 300, 80)
}


function endGame() {
    if (Date.now() - startTimestamp > localStorage.highScore) {
        localStorage.highScore = Date.now() - startTimestamp
    }

    startGame();
}


function updateGameArea() {
    checkCollisions()

    myGameArea.clear();
    spawnAsteroids();
    myPlayer.newPos();
    myPlayer.update();
    drawScores();

    for (let a of asteroids) {
        if (new Date().getTime() - a.createdAt > asteroidLifeSpan) {
            asteroids.pop(a)
        }
        a.newPos();
        a.update();
    }
}