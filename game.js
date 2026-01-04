let dino = document.getElementById("dino");
let dinoX = 50; // startposition
let zombie = document.getElementById("zombie");
let sound = document.getElementById("gameSound");

let gameRunning = false;
let zombieSpeed = 5;
let isJumping = false;

// HOPPA HÖGT
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !isJumping && gameRunning) {
        jump();
    }
    if (e.code === "KeyA" && gameRunning) {
        attack();
    }
});

function updateDinoPosition() {
    dino.style.left = dinoX + "px";
    dino.style.bottom = dinoY + "px";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "a") {
        dinoX -= 10;
        updateDinoPosition();
    }
    if (e.key === "d") {
        dinoX += 10;
        updateDinoPosition();
    }
});


function jump() {
    if (!onGround) return;

    isJumping = true;
    let jumpHeight = 0;

    let up = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(up);
            let down = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(down);
                    isJumping = false;
                }
                jumpHeight -= 5;
                dinoY += 5;
                dino.style.bottom = dinoY + "px";
            }, 20);
        }
        jumpHeight += 5;
        dinoY += 5;
        dino.style.bottom = dinoY + "px";
    }, 20);
}

window.onload = () => {
    let sound = document.getElementById("xc");
    sound.volume = 1.0;
    sound.play();
};


// ATTACK
function attack() {
    let dinoRect = dino.getBoundingClientRect();
    let zombieRect = zombie.getBoundingClientRect();

    if (dinoRect.right >= zombieRect.left && dinoRect.left <= zombieRect.right) {
        zombie.style.right = "-60px"; // respawn
    }
}

// ZOMBIE RÖRELSE
function moveZombie() {
    if (!gameRunning) return;

    let pos = parseInt(zombie.style.right);
    pos += zombieSpeed;
    zombie.style.right = pos + "px";

    if (pos > 900) {
        zombie.style.right = "-60px";
    }

    requestAnimationFrame(moveZombie);
}

// STARTA SPELET
document.getElementById("startBtn").onclick = () => {
    gameRunning = true;
    moveZombie();
};

// STOPPA SPELET
document.getElementById("stopBtn").onclick = () => {
    gameRunning = false;
};

// SPARA MAPP
document.getElementById("saveWorldBtn").onclick = () => {
    saveWorld();
};

// LADDA MAPP
document.getElementById("loadWorldBtn").onclick = () => {
    let name = document.getElementById("worldSelect").value;
    loadWorld(name);
};

// NY MAPP  ← LÄGG DEN HÄR
document.getElementById("newWorldBtn").onclick = () => {
    let name = prompt("Namn på ny mapp:");
    if (!name) return;

    // skapa tom värld
    worlds[name] = [];
    currentWorld = name;

    // TA BORT ALLA BLOCK FRÅN SKÄRMEN
    document.querySelectorAll(".block").forEach(b => b.remove());

    // spara världen
    localStorage.setItem("worlds", JSON.stringify(worlds));

    updateWorldList();
};

document.getElementById("deleteWorldBtn").onclick = () => {
    let name = document.getElementById("worldSelect").value;

    if (!name) return;

    let ok = confirm("Vill du verkligen ta bort mappen: " + name + "?");

    if (!ok) return;

    // Ta bort mappen från worlds
    delete worlds[name];

    // Spara ändringen
    localStorage.setItem("worlds", JSON.stringify(worlds));

    // Rensa block från skärmen
    document.querySelectorAll(".block").forEach(b => b.remove());

    // Välj en annan mapp om det finns någon kvar
    let worldNames = Object.keys(worlds);

    if (worldNames.length > 0) {
        currentWorld = worldNames[0];
        loadWorld(currentWorld);
    } else {
        currentWorld = "default";
        worlds[currentWorld] = [];
        localStorage.setItem("worlds", JSON.stringify(worlds));
    }

    updateWorldList();
};



function moveZombie() {
    if (!gameRunning) return;

    let pos = parseInt(zombie.style.left);
    pos -= zombieSpeed; // rör sig åt vänster
    zombie.style.left = pos + "px";

    // Om zombien går utanför vänster sida → respawn
    if (pos < -80) {
        zombie.style.left = "900px";
    }

    requestAnimationFrame(moveZombie);
}



function updateDinoPosition() {
    dino.style.left = dinoX + "px";
}
document.addEventListener("keydown", function(e) {

    // HOPPA
    if (e.code === "Space" && !isJumping && gameRunning) {
        jump();
    }

    // GÅ VÄNSTER (A)
    if (e.code === "KeyA" && gameRunning) {
        dinoX -= 10;
        if (dinoX < 0) dinoX = 0; // stoppa vid vänster kant
        updateDinoPosition();
    }

    // GÅ HÖGER (D)
    if (e.code === "KeyD" && gameRunning) {
        dinoX += 10;
        if (dinoX > 840) dinoX = 840; // stoppa vid höger kant
        updateDinoPosition();
    }

    // ATTACK (A + SHIFT eller bara F)
    if (e.code === "KeyF" && gameRunning) {
        attack();
    }
});

let game = document.getElementById("game");
let colorPicker = document.getElementById("colorPicker");

// När man klickar i spelplanen → skapa en kvadrat
game.addEventListener("click", function(e) {
    if (!gameRunning) return; // man kan bara bygga när spelet är igång


const worlds = ["XGY", "FGH"];

document.getElementById("searchWorld").oninput = () => {
    let q = searchWorld.value.toLowerCase();
    let list = worlds.filter(w => w.toLowerCase().includes(q));

    worldList.innerHTML = "";
    list.forEach(w => {
        let btn = document.createElement("button");
        btn.textContent = "Joina " + w;
        btn.onclick = () => joinWorld(w);
        worldList.appendChild(btn);
    });
};



    let x = e.offsetX;
    let y = e.offsetY;

    let block = document.createElement("div");
    block.classList.add("block");
    block.style.left = x + "px";
    block.style.top = y + "px";
    block.style.background = colorPicker.value;

    game.appendChild(block);
});
let gravity = 5;
let dinoY = 0; // höjd över marken
let onGround = true;

function checkBlockCollision() {
    let dinoRect = dino.getBoundingClientRect();
    let blocks = document.querySelectorAll(".block");

    onGround = false; // vi antar att dino faller tills vi hittar ett block

    blocks.forEach(block => {
        let b = block.getBoundingClientRect();

        // Kolla om dino står ovanpå blocket
        if (
            dinoRect.bottom <= b.top + 10 &&
            dinoRect.bottom >= b.top - 10 &&
            dinoRect.right > b.left &&
            dinoRect.left < b.right
        ) {
            onGround = true;
            dinoY = b.top - dinoRect.height - game.getBoundingClientRect().top;
        }
    });
}




function applyGravity() {
    if (!onGround && !isJumping) {
        dinoY -= gravity;
        if (dinoY < 0) dinoY = 0;
        dino.style.bottom = dinoY + "px";
    }
}

function gameLoop() {
    if (gameRunning) {
        checkBlockCollision();
        applyGravity();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

let worlds = JSON.parse(localStorage.getItem("worlds")) || {};
let currentWorld = "default";

function updateWorldList() {
    let select = document.getElementById("worldSelect");
    select.innerHTML = "";

    for (let name in worlds) {
        let option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    }

    select.value = currentWorld;
}

updateWorldList();

function saveWorld() {
    let blocks = document.querySelectorAll(".block");
    let blockData = [];

    blocks.forEach(b => {
        blockData.push({
            x: b.style.left,
            y: b.style.top,
            color: b.style.background
        });
    });

    worlds[currentWorld] = blockData;
    localStorage.setItem("worlds", JSON.stringify(worlds));
}

function loadWorld(name) {
    currentWorld = name;
    let blockData = worlds[name] || [];

    // ta bort gamla block
    document.querySelectorAll(".block").forEach(b => b.remove());

    // skapa block igen
    blockData.forEach(data => {
        let block = document.createElement("div");
        block.classList.add("block");
        block.style.left = data.x;
        block.style.top = data.y;
        block.style.background = data.color;
        game.appendChild(block);
    });

    updateWorldList();
}

document.getElementById("newWorldBtn").onclick = () => {
    let name = prompt("Namn på ny mapp:");
    if (!name) return;

    worlds[name] = [];
    currentWorld = name;
    saveWorld();
    updateWorldList();
};

function moveLeft() {
    dinoX -= 10;
    if (dinoX < 0) dinoX = 0;
    updateDinoPosition();
}

function moveRight() {
    dinoX += 10;
    if (dinoX > 840) dinoX = 840;
    updateDinoPosition();
}

document.getElementById("leftBtn").addEventListener("touchstart", moveLeft);
document.getElementById("rightBtn").addEventListener("touchstart", moveRight);
document.getElementById("jumpBtn").addEventListener("touchstart", jump);





