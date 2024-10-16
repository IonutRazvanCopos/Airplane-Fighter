let plane = document.getElementById("plane");
let game = document.getElementById("game");

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - game.offsetLeft;

    if (relativeX > 0 && relativeX < game.offsetWidth) {
    let x = e.clientX;
    plane.style.left = x - 100 + "px";
    }
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let spawnLineY = 28;
let spawnRate = 1500;
let spawnRateOfDescent = 3;
let lastSpawn = -1;
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
        y: spawnLineY,
    }

    objects.push(object);
}

function animate() {
    let time = Date.now();

    if (time > (lastSpawn + spawnRate)) {
        lastSpawn = time;
        spawnRandomObject();
    }

    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, spawnLineY);
    ctx.lineTo(canvas.width, spawnLineY);
    ctx.stroke();

    for (let i = 0; i < objects.length; ++i) {
        let object = objects[i];
        object.y += spawnRateOfDescent;
        ctx.beginPath();
        ctx.arc(object.x, object.y, 8, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = object.type;
        ctx.fill();
        if (collision(plane, object) == true) {
            alert("STOP");
            spawnRateOfDescent = 0;
        }
    }
}


function collision(a, b) {
    if (
        b.x + b.width >= a.x &&
        b.x <= a.x + a.width &&
        b.y + b.height >= a.y &&
        b.y <= a.y + a.height
    ) {
        return true;
    }
    return false;
}