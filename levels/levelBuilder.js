//Global variables
let levelPositioning;
let player;
let enemy;
let htmlTimer;
let time;
let count;
let size_y;
let size_x;
let playerNotDead = true;

// Happens when Main Menu button is clicked
function mainMenu() {
    window.location.href = '../index.html';
}

// Happens after page has been loaded
function setBoard(design) {

    /*
    * This is the most important variable, since it keeps track of what the level looks like after every change.
    * 
    * levelPositioning onsists of an array of arrays and each item has a number.
    * 
    * Block types: (0: Wall | 1: Air | 2: Spawn | 3: Goal | 4: Enemy path | 5: Y-Enemy | 6: X-Enemy | 9: Lava | String: Player).
    * 
    * Since the whole level design consists of just 1 variable, the only thing you need to do to create a new level is to just type out 
    * the value of levelPositioning.
    */
    levelPositioning = design;

    size_y = design.length;
    size_x = design[0].length;

    player = document.createElement('div');
    player.id = 'player';

    htmlTimer = document.getElementById('timer');
    timer();

    renderBoard();
    moveEnemy();
}

// Starts counting time after page has been loaded
function timer() {
    let start = Date.now();
    count = setInterval(function () {
        time = Date.now() - start;
        time = (Math.round(time / 10) / 100).toFixed(2);
        htmlTimer.innerHTML = time;
    }, 10);
}

// Either gets player location (1) or X-Enemy location (2) or Y-Enemy location (3)
function getEntityLocation(from, v) {
    if (from == 0) {
        let c = [0, 0];
        for (let y = 0; y < levelPositioning.length; y++) {
            for (let x = 0; x < levelPositioning[0].length; x++) {
                if (typeof levelPositioning[y][x] == 'string') {
                    c[0] = x;
                    c[1] = y;
                    break;
                }
            }
        }
        return c;

    } else if (from == 1) {
        let c = [];
        for (let y = 0; y < levelPositioning.length; y++) {
            for (let x = 0; x < levelPositioning[0].length; x++) {
                if (levelPositioning[y][x] == 5) {
                    c.push([0, x, y]);
                } else if (levelPositioning[y][x] == 6) {
                    c.push([1, x, y]);
                }
            }
        }
        return c;

    } else if (from == 2) {
        let c = 0;
        for (let x = 0; x < levelPositioning[v].length; x++) {
            if (levelPositioning[v][x] == 6) {
                c = x;
            }
        }
        return c;

    } else if (from == 3) {
        let c = 0;
        for (let y = 0; y < levelPositioning.length; y++) {
            if (levelPositioning[y][v] == 5) {
                c = y;
            }
        }
        return c;
    }
}

// Renders the board after page has been loaded or entities have moved
function renderBoard() {

    let board = document.getElementById('board');
    board.innerHTML = "";

    // FOR loop for y direction
    for (let y = 0; y < size_y; y++) {

        // Creating rows
        let row = document.createElement('div');
        row.className = 'row';

        // FOR loop for x direction
        for (let x = 0; x < size_x; x++) {

            // Creating cells
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.width = (900 / size_x) + 'px';
            cell.style.height = (900 / size_x) + 'px';

            // Appends enemy to cell if levelDesign tells us there is supposed to be an enemy there
            if (levelPositioning[y][x] == 5 || levelPositioning[y][x].toString() == "5" || levelPositioning[y][x] == 6 || levelPositioning[y][x].toString() == "6") {
                enemy = document.createElement('div');
                enemy.id = 'enemy';

                cell.id = 'path';
                cell.appendChild(enemy);
            }

            // Appends player to cell if levelDesign tells us there is supposed to be an enemy there
            if (typeof levelPositioning[y][x] === 'string') {
                cell.appendChild(player);

                // If player is in same spot as enemy, launch playerDeath()
                if (levelPositioning[y][x] == "5" || levelPositioning[y][x] == "6" || levelPositioning[y][x] == "9") {
                    playerDeath();
                }
                // If player is in same spot as goal, launch trigger wictory
                else if (levelPositioning[y][x] === '3') {
                    document.getElementById('win').style.display = 'block';
                    document.getElementById('winContainer').style.display = 'block';

                    // Clears timer
                    clearInterval(count);

                    const winTime = time;
                    document.getElementById('time').innerHTML = 'Time: ' + winTime;

                    let levelNum = getLevelNum();

                    // Making of the expire date for cookie
                    let d = new Date();
                    d.setTime(d.getTime() + (180 * 24 * 60 * 60 * 1000));
                    let expires = "expires=" + d.toUTCString();

                    // Making of the cookie
                    let level = getCookie("cLevel" + levelNum);
                    if (level != "") {
                        // If win time is smaller than previous record: overwrite
                        if (parseFloat(level) > winTime) {
                            document.cookie = "cLevel" + levelNum + "=" + winTime + "; " + expires + "; path=/Platformer";
                            document.getElementById('record').innerHTML = "New record!";
                        }
                    } else {
                        document.cookie = "cLevel" + levelNum + "=" + winTime + "; " + expires + "; path=/Platformer";
                    }
                }
            }

            if (levelPositioning[y][x] == 0 || levelPositioning[y][x].toString() == "0") {
                // Wall
                cell.id = 'wall';
            } else if (levelPositioning[y][x] == 1 || levelPositioning[y][x].toString() == "1") {
                // Air
                cell.id = 'air';
            } else if (levelPositioning[y][x] == 2 || levelPositioning[y][x].toString() == "2") {
                // Start
                cell.id = 'start';
            } else if (levelPositioning[y][x] == 3 || levelPositioning[y][x].toString() == "3") {
                // Goal
                cell.id = 'goal';
            } else if (levelPositioning[y][x] == 4 || levelPositioning[y][x].toString() == "4") {
                // Path
                cell.id = 'path';
            } else if (levelPositioning[y][x] == 9) {
                // Lava
                cell.id = 'lava';
            }
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

// Gets cookie value by name (credit to W3S)
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Reloads page
function retry() {
    location.reload();
}

// Happens on player death. Displays red flash and restarts level
function playerDeath() {

    // Prevents movement after death
    playerNotDead = false;

    let flash = document.getElementById('flash');
    flash.style.display = 'block';
    setTimeout(function () {
        location.reload();
    }, 200);
}

// Gets current level number from URL. Only works in double digits
function getLevelNum() {
    let num = window.location.href.split('/');
    if (num.at(-1).length == 11) {
        num = parseInt(num.at(-1).charAt(5));
        return num;
    } else if (num.at(-1).length == 12) {
        num = parseInt(num.at(-1).substring(5, 7));
        return num;
    }
}

// Sends player to next level
function nextLevel() {
    let url = 'level' + (getLevelNum() + 1) + '.html';
    window.location.href = url;
}

// Gets key presses for player movement and sends required data for to setEntityLocation
document.onkeydown = function (e) {
    let newCoordinates = getEntityLocation(0, null);

    // Prevents movement after death
    if (playerNotDead) {

        switch (e.key) {
            case "ArrowLeft":
                //Left
                newCoordinates[0]--;
                setEntityLocation(0, getEntityLocation(0, null), newCoordinates);

                break;
            case "ArrowUp":
                //Up
                newCoordinates[1]--;
                setEntityLocation(0, getEntityLocation(0, null), newCoordinates);

                break;
            case "ArrowRight":
                //Right
                newCoordinates[0]++;
                setEntityLocation(0, getEntityLocation(0, null), newCoordinates);

                break;
            case "ArrowDown":
                //Down
                newCoordinates[1]++;
                setEntityLocation(0, getEntityLocation(0, null), newCoordinates);

                break;
        }
    }
};

// Sets new entity location and resets the previous location back to how it was
function setEntityLocation(from, oldCoordinates, targetCoordinates) {
    // Sets player
    if (from == 0) {
        if (targetCoordinates[0] < 0 || targetCoordinates[1] < 0) {
        } else if (levelPositioning[targetCoordinates[1]][targetCoordinates[0]] == 0) {
        } else {
            levelPositioning[oldCoordinates[1]][oldCoordinates[0]] = parseInt(levelPositioning[oldCoordinates[1]][oldCoordinates[0]]);
            levelPositioning[targetCoordinates[1]][targetCoordinates[0]] = levelPositioning[targetCoordinates[1]][targetCoordinates[0]].toString();
            renderBoard();
        }
    }
    // Sets X-Enemy 
    else if (from == 1) {
        if (levelPositioning[oldCoordinates[1]][oldCoordinates[0]] == 6) {
            levelPositioning[oldCoordinates[1]][oldCoordinates[0]] = 6;
            levelPositioning[targetCoordinates[1]][targetCoordinates[0]] = 5;
        } else {
            levelPositioning[oldCoordinates[1]][oldCoordinates[0]] = 4;
            levelPositioning[targetCoordinates[1]][targetCoordinates[0]] = 5;
        }
        renderBoard();
    }
    // Sets Y-Enemy  
    else if (from == 2) {
        if (levelPositioning[oldCoordinates[1]][oldCoordinates[0]] == 5) {
            levelPositioning[oldCoordinates[1]][oldCoordinates[0]] = 5;
            levelPositioning[targetCoordinates[1]][targetCoordinates[0]] = 6;
        } else {
            levelPositioning[oldCoordinates[1]][oldCoordinates[0]] = 4;
            levelPositioning[targetCoordinates[1]][targetCoordinates[0]] = 6;
        }
        renderBoard();
    }
}

// Gets required enemy coordinates in an array and sends required data to enemy movement functions
function moveEnemy() {
    const c = getEntityLocation(1, null);

    // Happens for every enemy
    for (let n = 0; n < c.length; n++) {
        if (c[n][0] == 1) {
            moveX(c[n][2]);
        } else if (c[n][0] == 0) {
            moveY(c[n][1]);
        }
    }
}

// Enemy type Y
function moveY(x) {
    const y = getEntityLocation(3, x);

    // Checks if downward movement is possible
    if (levelPositioning[y + 1][x] == 4 || levelPositioning[y + 1][x] == 6) {
        let i = 0;
        // Move down
        let tickY = setInterval(function () {

            // If enemy encounters player, trigger playerDeath()
            if (typeof levelPositioning[y + i + 1][x] === 'string') {
                playerDeath();
            }

            setEntityLocation(1, [x, y + i], [x, y + i + 1]);

            /*
            * If enemy encounters certain blocks, stop and run movement again.
            * Blocks: 0: Wall | 1: Air | 2: Spawn | 3: Goal | 4: Enemy path | 5: Y-Enemy | 6: X-Enemy | 9: Lava |
            */
            if (levelPositioning[y + i + 2][x] == 0 || levelPositioning[y + i + 2][x] == 1 ||
                levelPositioning[y + i + 2][x] == 2 || levelPositioning[y + i + 2][x] == 3 ||
                levelPositioning[y + i + 2][x] == 9) {
                clearInterval(tickY);
                moveY(x);
            } else {
                i++;
            }
        }, 500);
    }
    // Checks if upward movement is possible 
    else if (levelPositioning[y - 1][x] == 4 || levelPositioning[y - 1][x] == 6) {
        let i = 0;
        // Move up
        let tickY = setInterval(function () {

            // If enemy encounters player, trigger playerDeath()
            if (typeof levelPositioning[y - i - 1][x] === 'string') {
                playerDeath();
            }

            setEntityLocation(1, [x, y - i], [x, y - i - 1]);

            /*
            * If enemy encounters certain blocks, stop and run movement again.
            * Blocks: 0: Wall | 1: Air | 2: Spawn | 3: Goal | 4: Enemy path | 5: Y-Enemy | 6: X-Enemy | 9: Lava |
            */
            if (levelPositioning[y - i - 2][x] == 0 || levelPositioning[y - i - 2][x] == 1 ||
                levelPositioning[y - i - 2][x] == 2 || levelPositioning[y - i - 2][x] == 3 ||
                levelPositioning[y - i - 2][x] == 9) {
                clearInterval(tickY);
                moveY(x);
            } else {
                i++;
            }
        }, 500);
    }

}

// Enemy type X
function moveX(y) {
    const x = getEntityLocation(2, y);

    if (levelPositioning[y][x - 1] == 4 || levelPositioning[y][x - 1] == 5) {
        let i = 0;
        let tickX = setInterval(function () {
            // Move left
            if (typeof levelPositioning[y][x - i - 1] == 'string') {
                playerDeath();
            }
            setEntityLocation(2, [x - i, y], [x - i - 1, y]);
            if (levelPositioning[y][x - i - 2] == 0 || levelPositioning[y][x - i - 2] == 1 ||
                levelPositioning[y][x - i - 2] == 2 || levelPositioning[y][x - i - 2] == 3 ||
                levelPositioning[y][x - i - 2] == 9) {
                clearInterval(tickX);
                moveX(y);
            } else {
                i++;
            }
        }, 500);
    } else if (levelPositioning[y][x + 1] == 4 || levelPositioning[y][x + 1] == 5) {
        let i = 0;
        let tickX = setInterval(function () {
            // Move right
            if (typeof levelPositioning[y][x + i + 1] == 'string') {
                playerDeath();
            }
            setEntityLocation(2, [x + i, y], [x + i + 1, y]);
            if (levelPositioning[y][x + i + 2] == 0 || levelPositioning[y][x + i + 2] == 1 ||
                levelPositioning[y][x + i + 2] == 2 || levelPositioning[y][x + i + 2] == 3 ||
                levelPositioning[y][x + i + 2] == 9) {
                clearInterval(tickX);
                moveX(y);
            } else {
                i++;
            }
        }, 500);
    }
}