
window.addEventListener('load', generateMinions);             // Call generateMinions when the page loads

const theLeftSide = document.querySelector('#leftSide');        // Locate the leftSide div
const theRightSide = document.querySelector('#rightSide');      // Locate the rightSide div
const theLevelText = document.querySelector('#levelText');      // Locate the span in the paragraph text for Level
const PLAY_MODE = ['EASY', 'NORMAL', 'DIFFICULT', 'EXTREME'];   // Display array list for the four modes
const PLAY_MODE_INCREMENT = [2, 5, 8, 12];                      // Number of faces to increment, depending on mode

let playModeIndex = 1;  // 0=easy, 1=normal, 2=difficult, 4=extreme
let numGames = 1;       // Initialize the game counter to level 1 for display
let numberOfMinions = PLAY_MODE_INCREMENT[playModeIndex]; // Default to "normal" number of 5 faces on first game

function generateMinions() {
    // Update the status text inside the paragraph with the current level counter
    updateStatusText();

    // Create an img element for each minion to be displayed
    for (let i = 0; i < numberOfMinions; i++) {
        face = document.createElement('img');
        // If the mode is set to EXTREME, randomize minion images on the page
        if (playModeIndex === 3) {
            let randomImageIndex = Math.floor(Math.random() * 5); // Get an number between 0 and 4
            face.src = 'images/Minion' + randomImageIndex + '.png';
        } else {
            face.src = 'images/Minion' + numGames % 5 + '.png';   // Pick one image per level
        }
        face.addEventListener('click', gameOver);  // If they click wrong image, gameOver is called
        // Generate a random location for each image element
        let randomTop = Math.floor(Math.random() * 400) + 1;
        let randomLeft = Math.floor(Math.random() * 400) + 1;
        face.style.top = randomTop + 'px';
        face.style.left = randomLeft + 'px';
        theLeftSide.appendChild(face);

    }
    // Clone the left side images, remove the last one and assign to the rightSide div
    const leftSideImages = theLeftSide.cloneNode(true);
    leftSideImages.removeChild(leftSideImages.lastChild);
    theRightSide.appendChild(leftSideImages);

    // Replace the event listener on the extra image on the leftSide div, call nextLevel on click
    theLeftSide.lastChild.removeEventListener('click', gameOver);
    theLeftSide.lastChild.addEventListener('click', nextLevel);
}


// This function is called when the user clicks on the correct minion image
function nextLevel() {    
    numGames++;
    numberOfMinions += PLAY_MODE_INCREMENT[playModeIndex];
    // Remove all child nodes from the left div before generating new minion images
    while (theLeftSide.firstChild) {
        theLeftSide.removeChild(theLeftSide.firstChild);
    }
    // Remove all child nodes from the right div before generating new minion images
    while (theRightSide.firstChild) {
        theRightSide.removeChild(theRightSide.firstChild);
    }
    event.stopPropagation(); // Keep the event from being applied to other elements
    animateNextLevel();
    generateMinions();
}


// This function is called when the user clicks on the incorrect area
function gameOver() {
    const audioGameOver = document.getElementById("myAudioGameOver");
    audioGameOver.src = './mp3s/minion-game-over.mp3';
    // Reset the game after the audio is done playing
    audioGameOver.onended = gameOverModal();
    animateGameOver(); // Start the animation while sound triggers
    audioGameOver.play();  // Play the sound, wait until end and then execute the code above
}

// This function clears all minions from the playing field and resets initial values
function resetGame() {
    while (theLeftSide.firstChild) {
        theLeftSide.removeChild(theLeftSide.firstChild);
    }
    while (theRightSide.firstChild) {
        theRightSide.removeChild(theRightSide.firstChild);
    }
    numberOfMinions = PLAY_MODE_INCREMENT[playModeIndex];
    numGames = 1;
}

// This function is called when the user clicks the player "Select Player Mode" button
function getPlayMode() {
    // Selecting the input element and get its value
    let playMode = document.getElementById("gameMode").value;
    playModeIndex = PLAY_MODE.indexOf(playMode);
    resetGame();
    generateMinions();
}


/* This function is called to update the text displays in the paragraph for "Current Level". 
   Remove any previous text nodes that are in the span element. */
function updateStatusText() {
    while (theLevelText.firstChild) {
        theLevelText.removeChild(theLevelText.firstChild);
    }
    statusTextNode = document.createTextNode('Current Level: ' + numGames);
    theLevelText.appendChild(statusTextNode);
}


function animateNextLevel() {
    const theAnimatedArea = document.querySelector('.animatedArea');
    imageToAnimate = document.createElement('img');
    imageToAnimate.src = 'images/Minion-group.png';
    theAnimatedArea.appendChild(imageToAnimate);

    // Randomly pick from 15 minion sounds to play as image animates
    const audioNextLevel = document.getElementById("myAudioNextLevel");
    let randomSoundIndex = Math.floor(Math.random() * 15);
    audioNextLevel.src = './mp3s/' + randomSoundIndex + '-minion-sounds.mp3';
    audioNextLevel.play();


    let pos = 0;
    let posStop = 0;
    let posIncrementer = 0;

    // Alternate between swiping left and swiping right with animation
    if (numGames % 2) {
        pos = -100;
        posStop = 680;
        posIncrementer = 2;
    } else {
        pos = 680;
        posStop = -100;
        posIncrementer = -2;
    }
    const frameID = setInterval(frameBumpHorizontal, 3);
    function frameBumpHorizontal() {
        if (pos == posStop) {
            clearInterval(frameID);
            theAnimatedArea.removeChild(theAnimatedArea.lastChild);
        } else {
            pos += posIncrementer;
            imageToAnimate.style.left = pos + 'px';
        }
    }
}

// Animate the Game Over Modal Dialog from bottom to top
function animateGameOver() {
    const theAnimatedArea = document.querySelector('#gameOverModal');
    let pos = 400;
    let posIncrementer = 0;

    const frameID = setInterval(frameBumpVertical, 3);
    function frameBumpVertical() {
        if (pos == 20) {  
            clearInterval(frameID);
        } else {
            pos--;
            theAnimatedArea.style.top = pos + 'px';
        }
    }
}


// modal functions
function gameOverModal(){
    modal.style.display = "block";
}

// create modals
let modal = document.getElementById("gameOverModal");
let tryButton = document.getElementsByClassName("tryagain-button")[0];
tryButton.onclick = function () {
    resetGame();
    generateMinions();
    modal.style.display = "none";
}