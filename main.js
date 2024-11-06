const game = document.getElementById("game");
let points = 0;
let pointsText = `${points}`;
let gameOver = false;

let txt = document.createElement('div');
txt.id = 'gameOver';

let score = document.createElement("div");
score.id = "score";
score.innerHTML = "Score: "+ pointsText;
game.append(score);

const meteoriteWidth = 160, meteoriteHeight = 200;
const posMeteoriteX = 80, posMeteoriteY = 120;
const lateralLength = 30, collisionHeight = 10, lateralMid = 80, bottomLine = 40;
const level1 = 50, level2 = 150;
const bulletWidth = 10, bulletHeight = 50;
const nextLevel = 100;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const meteorite = new Image();
meteorite.src = 'asteroid.png';
const bulletCanvas = document.getElementById("bullet");
const ctxBullet = bulletCanvas.getContext("2d");
const bullet = new Image();
bullet.src = 'bullet.png';

const spawnLineY = 0;
let spawnRate = 600;
let spawnRateOfDescent = 10;
let lastSpawn = -1;
let objects = [];
let bullets = [];
const startTime = Date.now();

document.addEventListener("mousemove", mouseMoveHandler, false);

const plane = {
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
    const object = {
        x: Math.random() * (canvas.width - 30) + 15,
        y: spawnLineY
    };
    objects.push(object);
}

function spawnBullet() {
    const bulletObj = {
        x: plane.x,
        y: plane.y
    };

    bullets.push(bulletObj);
}

function bulletPropulsion(bulletObj) {
    ctxBullet.drawImage(bullet, bulletObj.x, bulletObj.y, bulletWidth, bulletHeight);
}

function spawnTime() {
    const time = Date.now();

    if (time > (lastSpawn + spawnRate) && !gameOver) {
        lastSpawn = time;
        spawnRandomObject();
    }
    requestAnimationFrame(spawnTime);
}

spawnTime();

function moveObjects() {
    requestAnimationFrame(moveObjects);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < objects.length; ++i) {
        let object = objects[i];
        object.y += spawnRateOfDescent;
        ctx.drawImage(meteorite, object.x - posMeteoriteX, object.y - posMeteoriteY, meteoriteWidth, meteoriteHeight);
        if ((isColliding(plane, object) && !gameOver) || (object.y - bottomLine > canvas.height)) {
            spawnRateOfDescent = 0;
            gameOver = true;
            updateText();
            document.removeEventListener("mousemove", mouseMoveHandler, false);
        }
    }

    if (bullets.length > 0) {
        ctxBullet.clearRect(0, 0, bulletCanvas.width, bulletCanvas.height);

        bullets.forEach((bulletObj, bulletIndex) => {
            bulletObj.y -= 20;
            bulletPropulsion(bulletObj);
            objects.forEach((object, objectIndex) => {
                if (shotCollision(bulletObj, object)) {
                    bullets.splice(bulletIndex, 1);
                    objects.splice(objectIndex, 1);
                    updatePoints();
                }
            });
    
            if (bulletObj.y < -bulletHeight) {
                bullets.splice(bulletIndex, 1);
            }
        });
    }
}

moveObjects();

function isColliding(airplane, meteorite) {
    return (
        ((airplane.y + collisionHeight <= meteorite.y &&
        airplane.x + lateralLength >= meteorite.x &&
        airplane.x - lateralLength <= meteorite.x)  ||
        ((airplane.y + lateralMid <= meteorite.y &&
        airplane.x + lateralMid >= meteorite.x &&
        airplane.x - lateralMid <= meteorite.x))
        )
    );
}

function shotCollision(bllt, meteorite) {
    return (
        bllt.y < meteorite.y &&
        bllt.x >= meteorite.x - bulletHeight &&
        bllt.x <= meteorite.x + bulletHeight
    );
}

function updatePoints() {
    ++points;
    pointsText = `${points}`;
    score.innerHTML = "Score: " + pointsText;
    if (points === level1 || points === level2) {
        spawnRate -= nextLevel;
    }
}

function updateText() {
    if (gameOver) {
        game.append(txt);
        txt.innerHTML = 'Game Over! Congrats for your score: ' + pointsText;
    }
}

game.addEventListener("click", () => {
    if (!gameOver) {
        spawnBullet();
    }
});
