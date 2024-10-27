const game = document.getElementById("game");
let points = 0;
let gameOver = false;

let txt = document.createElement('div');
txt.id = 'gameOver';

let score = document.createElement("div");
score.id = "score";
score.innerHTML = "Score:"+ ` ${points}`
game.append(score);

const meteoriteWidth = 160, meteoriteHeight = 200;
const posMeteoriteX = 80, posMeteoriteY = 120;
const lateralLength = 30, collisionHeight = 10, lateralMid = 80, bottomLine = 40;
const level1 = 50, level2 = 150;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const meteorite = new Image();
meteorite.src = '/asteroid.png';

const spawnLineY = 0;
let spawnRate = 1200;
let spawnRateOfDescent = 10;
let lastSpawn = 1;
let objects = [];
const startTime = Date.now();

document.addEventListener("mousemove", mouseMoveHandler, false);

let plane = {
    element: document.getElementById("plane"),
    x: document.getElementById("canvas").width / 2,
    y: 930,
    width: 100,
    height: 100
};

function mouseMoveHandler(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const relativeX = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width);

    if (relativeX > plane.width / 2 && relativeX < canvas.width - plane.width / 2) {
        plane.x = relativeX;
        plane.element.style.left = relativeX - plane.width / 2 + "px";
    }
}

function spawnRandomObject() {
    let object = {
        x: Math.random() * (canvas.width - 30) + 15,
        y: spawnLineY
    };
    objects.push(object);
}

function moveObjects() {
    const time = Date.now();

    if (time > (lastSpawn + spawnRate) && !gameOver) {
        lastSpawn = time;
        spawnRandomObject();
    }

    requestAnimationFrame(moveObjects);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < objects.length; ++i) {
        let object = objects[i];
        object.y += spawnRateOfDescent;
        ctx.drawImage(meteorite, object.x - posMeteoriteX, object.y - posMeteoriteY, meteoriteWidth, meteoriteHeight);
        if (isColliding(plane, object)) {
            spawnRateOfDescent = 0;
            gameOver = true;
            updateText();
            document.removeEventListener("mousemove", mouseMoveHandler, false);
        }
        if (object.y - bottomLine > canvas.height) {
            object.y = null;
            updatePoints();
        }
    }
}

moveObjects();

function isColliding(airplane, meteorite) {
    if (
        ((airplane.y + collisionHeight <= meteorite.y &&
        airplane.x + lateralLength >= meteorite.x &&
        airplane.x - lateralLength <= meteorite.x)  ||
        ((airplane.y + lateralMid <= meteorite.y &&
        airplane.x + lateralMid >= meteorite.x &&
        airplane.x - lateralMid <= meteorite.x))
        )
    ) {
        return true;
    }
    return false;
}

function updatePoints() {
    ++points;
    score.innerHTML = "Score:" + ` ${points}`
    if (points === level1) {
        ++spawnRateOfDescent;
    } else if (points === level2) {
        ++spawnRateOfDescent;
    }
}

function updateText() {
    if (gameOver) {
        game.append(txt);
        txt.innerHTML = 'Game Over! Congrats for your score:' + ` ${points}!`;
    }
}
