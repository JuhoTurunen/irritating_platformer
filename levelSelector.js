// Happens when contibue button is pressed. Sends player to newest level, or to levels.html, if all levels are open.
function continueLevel() {
    let cAmount = document.cookie.split("; ").length;
    for (let i = 1; i <= cAmount; i++) {
        if (i == 10) {
            window.location.href = "levels.html";
            break;
        }
        if (getCookie("cLevel" + 1) == "") {
            sendToLevel(i);
            break;
        }
        if (getCookie("cLevel" + i) != "" && getCookie("cLevel" + (i + 1)) == "") {
            sendToLevel(i + 1);
            break;
        } 
    }
}

// Deletes all level cookies
function resetLevels() {
    let cAmount = document.cookie.split("; ").length;
    for (let i = 1; i <= cAmount; i++) {
        document.cookie = "cLevel" + i + "=1.00; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/Platformer;";
    }
    window.location.href = "/Platformer";
}

// Happens after page has been loaded
function pageLoaded() {

    // Seperates completed, open and locked levels with the help of cookies
    let levels = document.getElementsByClassName('level');
    Array.from(levels).forEach(function (level, index) {
        let levelNum = index + 1;
        let lastLevelNum = index;

        let time = getCookie("cLevel" + levelNum);
        let lastLevelTime = "";
        if (lastLevelNum != 0) {
            lastLevelTime = getCookie("cLevel" + lastLevelNum);
        }
        if (time != "") {
            level.style.backgroundColor = 'limegreen';
            level.onclick = function () { whenClicked(0, time, levelNum); };
        } else if (levelNum == "1" || lastLevelTime != "") {
            level.style.backgroundColor = 'cyan';
            level.style.color = 'black';
            level.onclick = function () { whenClicked(1, null, levelNum); };
        } else {
            level.style.backgroundColor = '#222'; 
            level.style.color = 'white';
            level.onclick = function () { whenClicked(2, null, null); };
        }
    });
}

// Happens when X is clicked
function closeWindow() {
    document.getElementById('info').style.display = 'none';
}

// Happens when one oof the levels is clicked
function whenClicked(from, time, levelNum) {
    if (from === 0) {
        document.getElementById('info').style.display = 'block';
        let title = document.getElementById('title');
        title.style.fontSize = "32px";
        title.innerHTML = 'Level Completed';

        let timeHTML = document.getElementById('time');
        timeHTML.innerHTML = 'Best time: ' + time;
        timeHTML.style.display = 'inline-block';

        let btn = document.getElementById('playLevel');
        btn.innerHTML = 'Replay';
        btn.style.display = 'inline-block';
        btn.onclick = function () { sendToLevel(levelNum); };
    } else if (from === 1) {
        document.getElementById('info').style.display = 'block';
        let title = document.getElementById('title');
        title.style.fontSize = "32px";
        title.innerHTML = 'Level Open';

        let timeHTML = document.getElementById('time');
        timeHTML.innerHTML = 'Best time: none';
        timeHTML.style.display = 'inline-block';

        let btn = document.getElementById('playLevel');
        btn.innerHTML = 'Play';
        btn.style.display = 'inline-block';
        btn.onclick = function () { sendToLevel(levelNum); };
    } else if (from === 2) {
        document.getElementById('info').style.display = 'block';
        let title = document.getElementById('title');
        title.style.fontSize = "50px";
        title.innerHTML = 'Level Locked';
        document.getElementById('time').style.display = 'none';
        document.getElementById('playLevel').style.display = 'none';
    }
}

// Sends player to level
function sendToLevel(levelNum) {
    let url = 'levels/level' + levelNum + '.html';
    window.location.href = url;
}

// Gets cookie by name (credit to W3S)
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
