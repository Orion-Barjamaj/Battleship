import Ship from './ship';

const backgroundColor = '#EEEEEE';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let takenPos = new Set();
let enemyTakenPos = new Set();
let enemyHit = new Set();

function checkForSameHit(pos){
    if(enemyHit.has([pos[0], pos[1]].toString())){
        return false;
    }
    return true;
}

function isValidPositionEnemy(pos, length) {
    if (pos[0] + length - 2 >= 9 || pos[1] + length - 2 >= 9) return false;
    for (let i = 0; i < length; i++) {
        if (enemyTakenPos.has([pos[0] + i, pos[1]].toString())){
            return false; 
        }
    }
    return true;
}

function isValidPositionX(pos, length) {
    if (pos[0] + length - 2 >= 9 || pos[1] + length - 2 >= 9) return false;
    for (let i = 0; i < length; i++) {
        if (takenPos.has([pos[0] + i, pos[1]].toString())){
            return false; 
        }
    }
    return true;
}

function isValidPositionY(pos, length) {
    if (pos[0] + length - 2 >= 9 || pos[1] + length - 2 >= 9) return false;
    for (let i = 0; i < length; i++) {
        if (takenPos.has([pos[0], pos[1] + i].toString())){
            return false; 
        }
    }
    return true;
}

const randomX = document.querySelector('.randomBtnX');
const randomY = document.querySelector('.randomBtnY');
const manuallyBtn = document.querySelector('.manually');
const names = document.querySelector('.names');
const body = document.body;
let startPlay = false;
const playBtn = document.querySelector('.play');
const evilAiStatus = document.getElementById('evilAIStatus');
const playerStatus = document.getElementById('playerStatus');
const playerName = document.querySelector('.playerName');

//End Screen
const endScreen = document.createElement('div');
endScreen.classList.add('endScreen');
const whoWon = document.createElement('div');
whoWon.classList.add('whoWon');
endScreen.append(whoWon);
const playAgain = document.createElement('button');
playAgain.classList.add('playAgain');
endScreen.append(playAgain);
playAgain.setAttribute('id', 'playBtn');
playAgain.textContent = 'Play Again!';

playAgain.addEventListener('click', (e) => {
    location.reload();
});

let playerTurn = true;

export default function gameboard(ships){
    let playerHealth = 15;
    let enemyHealth = 15;
    let useManual = false;
    const container = document.querySelector('.container');
    const box = document.createElement('div');
    box.addEventListener('click', (event) => {
        l++;
        if(l === 5){
            playBtn.disabled = false;
        }
    });
    box.classList.add('box');
    container.insertBefore(box, names);
    const enemyBox = document.createElement('div');
    enemyBox.classList.add('enemyBox');
    container.append(enemyBox);
    box.setAttribute('id', 'Box');
    enemyBox.setAttribute('id', 'Box');
    const gridSize = 10;
    const grid = [];
    const shipsArray = [];
    const enemyGrid = [];
    const enemyShipsArray = [];
    for(let i = 0; i < gridSize; i++){
        const row = [];
        for(let j = 0; j < gridSize; j++){
            row.push(j);
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('id', `${[i]}, ${[j]}`);
            box.append(cell);
        }
        grid.push(row);
    }

    for(let i = 0; i < gridSize; i++){
        const row = [];
        for(let j = 0; j < gridSize; j++){
            row.push(j);
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('enemyCell');
            cell.setAttribute('id', `${[i]}, ${[j]}`);
            playBtn.addEventListener('click', (event) =>{
                startPlay = true;
                randomX.disabled = true;
                randomY.disabled = true;
                manuallyBtn.disabled = true;
                if(startPlay === true){
                    cell.addEventListener('click', (e) => {
                        if(playerTurn === true){
                            playerTurn = false;
                            if(enemyGrid[i][j] === 'Ship' || enemyGrid[i][j] === j){
                                if(enemyGrid[i][j] === 'Ship'){
                                    enemyHealth--;
                                    enemyGrid[i][j] = 'Hit';
                                    playerStatus.textContent = 'You just landed a hit on Admiral Evil AI ships!';
                                    cell.style.backgroundColor = '#ff9b9b';
                                    cell.classList.add('non-clickable');
                                    cell.classList.remove('enemyCell');
                                }else if(enemyGrid[i][j] === 'Hit') {
                                    enemyGrid[i][j] = 'Hit';
                                    cell.style.backgroundColor = '#ff9b9b';
                                    cell.classList.add('non-clickable');
                                    cell.classList.remove('enemyCell');
                                } else if(enemyGrid[i][j] === j){
                                    enemyGrid[i][j] = 'Miss';
                                    playerStatus.textContent = 'You just missed a hit on Admiral Evil AI ships!';
                                    cell.style.backgroundColor = '#919EC4';
                                    cell.classList.add('non-clickable');
                                    cell.classList.remove('enemyCell');
                                }
                                function getRandomDelay() {
                                    const delays = [500, 1000, 1500];
                                    return delays[Math.floor(Math.random() * delays.length)];
                                }
                
                                setTimeout(() => randomHit(), getRandomDelay()); 
                            }
                            if(enemyHealth <= 0){
                                body.append(endScreen);
                                whoWon.textContent = `Congratulations ${playerName.textContent}! You just defeated Admiral Evil AI and saved the world!`;
                            } else if(playerHealth <= 0){
                                whoWon.textContent = `Oh no! Admiral ${playerName.textContent} are you okay? Don't worry this isn't over!`;
                                body.append(endScreen);
                            }
                        }
                    });
                    const myCell = document.getElementById(`${i}, ${j}`);
                    myCell.classList.add('non-clickable');
                }
            });
            enemyBox.append(cell);
        }
        enemyGrid.push(row);
    }

    function randomPlacementEnemy(){
        for(let i = 1; i <= ships; i++){
            const ship = new Ship(i);
            enemyShipsArray.push(ship);
        }
    
        enemyShipsArray.forEach(element => {
            if (element.pos.length === 0) {
                do {
                    element.pos = [getRandomInt(10), getRandomInt(10)];
                } while (!isValidPositionEnemy(element.pos, element.length));
                for (let i = 0; i < element.length; i++) {
                    enemyTakenPos.add([element.pos[0] + i, element.pos[1]].toString());
                    enemyTakenPos.add([element.pos[0] + i - 1, element.pos[1] - 1].toString());
                    enemyTakenPos.add([element.pos[0] + i + 1, element.pos[1] + 1].toString());
                }
            }
            for(let i = 0; i < element.length; i++){
                const [x, y] = [element.pos[0] + i, element.pos[1]];
                enemyGrid[x][y] = "Ship";  
            }
        });
    }

    function randomHit(){
        let [x, y] = [];
        do{
            [x, y] = [getRandomInt(10), getRandomInt(10)];
        } while(!checkForSameHit([x ,y]));
        if(grid[x][y] === 'Ship'){
            playerHealth--;
            evilAiStatus.textContent = 'Admiral Evil AI just landed a hit on one of your ships!';
            const cell = document.getElementById(`${x}, ${y}`);
            cell.style.backgroundColor = '#ff9b9b';
            grid[x][y] = 'Hit';
            enemyHit.add([x, y].toString());
        } else if(grid[x][y] === 'Hit'){
            const cell = document.getElementById(`${x}, ${y}`);
            cell.style.backgroundColor = '#ff9b9b';
            grid[x][y] = 'Hit';
            enemyHit.add([x, y].toString());
        } else if(grid[x][y] != 'Ship' || grid[x][y] != 'Hit'){
            evilAiStatus.textContent = 'Admiral Evil AI just missed!';
            const cell = document.getElementById(`${x}, ${y}`);
            cell.style.backgroundColor = '#919EC4';
            grid[x][y] = 'Miss';
            enemyHit.add([x, y].toString());
        }
        playerTurn = true;
    }

    randomPlacementEnemy();
    
    function randomPlacementX(){
        for(let i = 1; i <= ships; i++){
            const ship = new Ship(i);
            shipsArray.push(ship);
        }
    
        shipsArray.forEach(element => {
            if (element.pos.length === 0) {
                do {
                    element.pos = [getRandomInt(10), getRandomInt(10)];
                } while (!isValidPositionX(element.pos, element.length));
                for (let i = 0; i < element.length; i++) {
                    takenPos.add([element.pos[0] + i, element.pos[1]].toString());
                    takenPos.add([element.pos[0] + i - 1, element.pos[1] - 1].toString());
                    takenPos.add([element.pos[0] + i + 1, element.pos[1] + 1].toString());
                }
            }
            for(let i = 0; i < element.length; i++){
                const [x, y] = [element.pos[0] + i, element.pos[1]];
                grid[x][y] = "Ship";  
                const cell = document.getElementById(`${[x]}, ${[y]}`);
                cell.style.cssText = `background-color: ${element.color};`;
            }
        });
    }

    randomPlacementX();

    randomX.addEventListener('click', (event) =>{
        useManual = false;
        manuallyBtn.disabled = false;
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid.length; j++){
                if(grid[i][j] === "Ship"){
                    grid[i][j] = j;
                    const cell = document.getElementById(`${[i]}, ${[j]}`);
                    cell.style.backgroundColor = backgroundColor;
                    if(cell.classList.contains('Colored')){
                        cell.classList.remove('Colored')
                    }
                    takenPos.clear();
                    shipsArray.length = 0;
                }
            }
        }
        randomPlacementX();
        manually();
        playBtn.disabled = false;
    })

    function randomPlacementY(){
        for(let i = 1; i <= ships; i++){
            const ship = new Ship(i);
            shipsArray.push(ship);
        }
    
        shipsArray.forEach(element => {
            if (element.pos.length === 0) {
                do {
                    element.pos = [getRandomInt(10), getRandomInt(10)];
                } while (!isValidPositionY(element.pos, element.length));
                for (let i = 0; i < element.length; i++) {
                    takenPos.add([element.pos[0], element.pos[1] + i].toString());
                    takenPos.add([element.pos[0] - 1, element.pos[1] + i - 1].toString());
                    takenPos.add([element.pos[0] + 1, element.pos[1] + i + 1].toString());
                }
            }
            for(let i = 0; i < element.length; i++){
                const [x, y] = [element.pos[0], element.pos[1] + i];
                grid[x][y] = "Ship";  
                const cell = document.getElementById(`${[x]}, ${[y]}`);
                cell.style.cssText = `background-color: ${element.color};`;
            }
        });
    }

    randomY.addEventListener('click', (event) =>{
        useManual = false;
        manuallyBtn.disabled = false;
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid.length; j++){
                if(grid[i][j] === "Ship"){
                    grid[i][j] = j;
                    const cell = document.getElementById(`${[i]}, ${[j]}`);
                    cell.style.backgroundColor = backgroundColor;
                    if(cell.classList.contains('Colored')){
                        cell.classList.remove('Colored')
                    }
                    takenPos.clear();
                    shipsArray.length = 0;
                }
            }
        }
        randomPlacementY();
        manually();
        playBtn.disabled = false;
    });

    let l = 0;

    manuallyBtn.addEventListener('click', (event) =>{
        useManual = true;
        manuallyBtn.disabled = true;
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid.length; j++){
                if(grid[i][j] === "Ship"){
                    grid[i][j] = j;
                    const cell = document.getElementById(`${[i]}, ${[j]}`);
                    cell.style.backgroundColor = backgroundColor;
                    takenPos.clear();
                    shipsArray.length = 0;
                    l = 0;
                }
            }
        }
        manually();
    });

    function manually(){
        playBtn.disabled = true;
        if(useManual === true){
            for(let i = 1; i <= ships; i++){
                const ship = new Ship(i);
                shipsArray.push(ship);
            }

            for(let i = 0; i < grid.length; i++){
                for(let j = 0; j < grid.length; j++){
                const cells = document.getElementById(`${[i]}, ${[j]}`);
                cells.addEventListener('mouseover', (e)=>{
                    if(i <= 5 + l){
                        for(let k = 0; k < shipsArray.length - l; k++){
                            const cell = document.getElementById(`${[i + k]}, ${[j]}`);
                            cell.style.cssText = `background-color: #A9A9A9`;
                            cells.addEventListener('click', (e)=>{
                                grid[i + k][j] = 'Ship';
                            });
                        }
                    }
                });
                cells.addEventListener('mouseout', (e)=>{
                    shipsArray.forEach(element => {
                        if(i + element.length <= 10){
                            const cell = document.getElementById(`${[(i + element.length) - 1]}, ${[j]}`);
                            if(grid[(i + element.length) - 1][j] != 'Ship'){
                                cell.style.backgroundColor = backgroundColor;
                            }
                        }
                    });
                });
            }
        }
    }
}
}