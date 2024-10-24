let game = document.getElementById("game");
let points = 0;
let gameOver = false;

let score = document.createElement("div");
score.id = "score";
score.innerHTML = "Score:"+ ` ${points}`
game.append(score);

document.addEventListener("mousemove", mouseMoveHandler, false);

    let plane = {
        element: document.getElementById("plane"),
        x: 634,
        y: 930,
        width: 100,
        height: 100
    }

    function mouseMoveHandler(e) {
        const canvasRect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - canvasRect.left;
        if (relativeX > 0 && relativeX < canvasRect.width) {
            plane.x = relativeX;
            plane.element.style.left = relativeX - plane.width / 2 + "px";
        }
    }

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let img = new Image();
img.src = '/asteroid.png';

let spawnLineY = 0;
let spawnRate = 1200;
let spawnRateOfDescent = 8;
let lastSpawn = 1;
let objects = [];
let startTime = Date.now();

animate();

function spawnRandomObject() {

    let t;

    if (Math.random() < 0.50) {
        t = "red";
    } else {
        t = "blue";
    }
    
    let object = {
        type: t,
        x: Math.random() * (canvas.width - 30) + 15,
        y: spawnLineY
    }

    objects.push(object);
}

function animate() {
    let time = Date.now();

    if (time > (lastSpawn + spawnRate) && !gameOver) {
        lastSpawn = time;
        spawnRandomObject();
    }

    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, spawnLineY);
    ctx.lineTo(canvas.width, spawnLineY);

    for (let i = 0; i < objects.length; ++i) {
        let object = objects[i];
        object.y += spawnRateOfDescent;
        ctx.beginPath();
        ctx.arc(object.x, object.y, 40, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = object.type;
        ctx.fill();
        if (isCollide(plane, object)) {
            spawnRateOfDescent = 0;
        }
        if (object.y > canvas.height) {
            object.y = null;
            updatePoints();
        }
    }
}

function isCollide(airplane, meteorit) {
    if (
        ((airplane.y + 10 <= meteorit.y &&
            airplane.x + 30 >= meteorit.x &&
            airplane.x - 30 <= meteorit.x) ||
        ((airplane.y + 50 <= meteorit.y &&
        airplane.x + 65 >= meteorit.x &&
        airplane.x - 65 <= meteorit.x))
        )
    ) {
        gameOver = true;
        updateText();
        document.removeEventListener("mousemove", mouseMoveHandler, false);
        return true;
    }
    return false;
}

function updatePoints() {
    ++points;
    score.innerHTML = "Score:" + ` ${points}`
    if (points == 50) {
        spawnRateOfDescent = 9;
    } else if (points == 150) {
        spawnRateOfDescent = 10;
    }
}

let txt = document.createElement('div');
txt.id = 'gameOver';

function updateText() {
    if (gameOver) {
        game.append(txt);
        txt.innerHTML = 'Game Over! Congrats for your score:' + ` ${points}!`;
    }
}
