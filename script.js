const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");

const message = document.getElementById("message");
const hint = document.getElementById("hint");

const attemptsDisplay = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");

const difficultySelect = document.getElementById("difficulty");
const rangeText = document.getElementById("rangeText");

const restartBtn = document.getElementById("restartBtn");


let secretNumber;
let attempts;
let score;
let maxNumber;
let gameOver = false;


// Get saved best score
let bestScore = localStorage.getItem("guessBestScore");

if (bestScore !== null) {
    bestScoreDisplay.textContent = bestScore;
}


// Difficulty settings
const difficultySettings = {
    easy: {
        max: 50,
        startingScore: 100
    },

    medium: {
        max: 100,
        startingScore: 100
    },

    hard: {
        max: 500,
        startingScore: 150
    }
};


// Start a new game
function startGame() {

    const difficulty = difficultySelect.value;

    maxNumber = difficultySettings[difficulty].max;

    score = difficultySettings[difficulty].startingScore;

    attempts = 0;

    gameOver = false;

    secretNumber = Math.floor(Math.random() * maxNumber) + 1;

    guessInput.value = "";

    guessInput.disabled = false;

    guessBtn.disabled = false;

    scoreDisplay.textContent = score;

    attemptsDisplay.textContent = attempts;

    rangeText.textContent =
        `Guess a number between 1 and ${maxNumber}`;

    message.textContent = "Make your first guess!";

    message.className = "message";

    hint.textContent =
        "You'll get a hint after every guess.";

    guessInput.min = 1;
    guessInput.max = maxNumber;

    guessInput.focus();
}


// Check the guess
function checkGuess() {

    if (gameOver) {
        return;
    }

    const guess = Number(guessInput.value);

    // Validate input
    if (!guessInput.value || guess < 1 || guess > maxNumber) {

        message.textContent =
            `Please enter a number between 1 and ${maxNumber}.`;

        message.className = "message error";

        return;
    }


    attempts++;

    attemptsDisplay.textContent = attempts;


    // Correct guess
    if (guess === secretNumber) {

        gameOver = true;

        const bonus = Math.max(0, 50 - (attempts - 1) * 5);

        score += bonus;

        scoreDisplay.textContent = score;

        message.textContent =
            `🎉 Correct! The number was ${secretNumber}!`;

        message.className = "message success";

        hint.textContent =
            `You found it in ${attempts} attempt${attempts === 1 ? "" : "s"}!`;

        guessInput.disabled = true;

        guessBtn.disabled = true;


        // Save best score
        if (bestScore === null || score > Number(bestScore)) {

            bestScore = score;

            localStorage.setItem(
                "guessBestScore",
                bestScore
            );

            bestScoreDisplay.textContent = bestScore;
        }

        return;
    }


    // Wrong guess
    score -= 5;

    if (score < 0) {
        score = 0;
    }

    scoreDisplay.textContent = score;


    if (guess < secretNumber) {

        message.textContent = "📈 Too low!";

        message.className = "message warning";

    } else {

        message.textContent = "📉 Too high!";

        message.className = "message warning";
    }


    // Generate useful hint
    const difference = Math.abs(secretNumber - guess);

    if (difference <= 5) {

        hint.textContent = "🔥 Very close!";

    } else if (difference <= 15) {

        hint.textContent = "🌡️ You're getting warm!";

    } else {

        hint.textContent = "❄️ You're quite far away!";
    }


    guessInput.value = "";

    guessInput.focus();
}


// Guess button
guessBtn.addEventListener("click", checkGuess);


// Press Enter to guess
guessInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        checkGuess();
    }

});


// Restart game
restartBtn.addEventListener("click", startGame);


// Change difficulty
difficultySelect.addEventListener("change", startGame);


// Start first game
startGame();