const setup = document.getElementById('setup');
const board = document.getElementById('board');
const message = document.getElementById('message');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const gameControls = document.getElementById('gameControls');
const playAgainButton = document.getElementById('playAgain');
const exitButton = document.getElementById('exitButton');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const startButton = document.getElementById('startButton');
const confirmationPopup = document.getElementById('confirmationPopup');
const confirmLeaveButton = document.getElementById('confirmLeave');
const cancelLeaveButton = document.getElementById('cancelLeave');
const toggleInputs = document.querySelectorAll('.toggle-input');

let playerX, playerO;
let currentPlayer, currentSymbol;
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let scores = { X: 0, O: 0 };
let roundCount = 0;
const maxRounds = 3;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// capitalise input
// playerXInput.textContent = playerXInput.textContent.toUpperCase();
// playerOInput.textContent = playerOInput.textContent.toUpperCase();

// Initialize game
playerXInput.focus();

// Input navigation
playerXInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') playerOInput.focus();
});

playerOInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startButton.click();
});

startButton.addEventListener('click', () => {
    playerX = formatName(playerXInput.value.trim()) || "Player X";
    playerO = formatName(playerOInput.value.trim()) || "Player O";
    setup.style.display = 'none';
    board.style.display = 'grid';
    gameControls.style.display = 'flex';
    gameActive = true;
    currentPlayer = playerX;
    currentSymbol = 'X';
    message.textContent = `${currentPlayer}'s turn (${currentSymbol}) 🌸`;
    updateScores();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
});

function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function handleCellClick(event) {
    if (!gameActive) return;

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '') return;

    gameState[clickedCellIndex] = currentSymbol;
    clickedCell.textContent = currentSymbol;
    clickedCell.classList.add(currentSymbol);

    checkForWinner();
}

function checkForWinner() {
    let roundWon = false;

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        scores[currentSymbol]++;
        roundCount++;
        message.textContent = `${currentPlayer} wins! 🎉`;
        message.classList.add('win-animation');
        gameActive = false;
        celebrate();
        updateScores();
        playAgainButton.style.display = 'block';

        if (roundCount >= maxRounds) {
            declareFinalWinner();
        }
        return;
    }

    if (!gameState.includes('')) {
        message.textContent = 'It\'s a tie! 🤝';
        gameActive = false;
        playAgainButton.style.display = 'block';
        return;
    }

    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    currentSymbol = currentSymbol === 'X' ? 'O' : 'X';
    message.textContent = `${currentPlayer}'s turn (${currentSymbol}) 🌸`;
}

function updateScores() {
    scoreX.textContent = `${playerX} (X): ${scores.X}`;
    scoreO.textContent = `${playerO} (O): ${scores.O}`;
}

function declareFinalWinner() {
    let finalWinner;
    if (scores.X > scores.O) finalWinner = `${playerX} (X)`;
    else if (scores.O > scores.X) finalWinner = `${playerO} (O)`;
    else finalWinner = "It's a tie!";
    
    message.textContent = `Final Winner: ${finalWinner} 🏆`;
    playAgainButton.style.display = 'none';
    exitButton.style.display = 'block';
}

function celebrate() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confetti);
    }
}

playAgainButton.addEventListener('click', () => {
    if (roundCount >= maxRounds) {
        resetGame();
    } else {
        resetRound();
    }
});

exitButton.addEventListener('click', () => {
    if (gameActive) confirmationPopup.style.display = 'block';
    else resetGame();

});

confirmLeaveButton.addEventListener('click', () => {
    confirmationPopup.style.display = 'none';
    location.reload();
    if (gameActive) {
        scores[currentSymbol === 'X' ? 'O' : 'X']++;
        message.textContent = `${currentPlayer} left! ${currentSymbol === 'X' ? playerO : playerX} wins! 🎉`;
        gameActive = false;
        celebrate();
        updateScores();
        playAgainButton.style.display = 'block';
    }
});

cancelLeaveButton.addEventListener('click', () => {
    confirmationPopup.style.display = 'none';
});

function resetRound() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    currentPlayer = scores.X > scores.O ? playerX : playerO;
    currentSymbol = scores.X > scores.O ? 'X' : 'O';
    message.textContent = `${currentPlayer}'s turn (${currentSymbol}) 🌸`;
    gameActive = true;
    playAgainButton.style.display = 'none';
    document.querySelectorAll('.confetti').forEach(c => c.remove());
}

function resetGame() {
    scores = { X: 0, O: 0 };
    roundCount = 0;
    gameState = ['', '', '', '', '', '', '', '', ''];
    setup.style.display = 'block';
    board.style.display = 'none';
    gameControls.style.display = 'none';
    message.textContent = '';
    document.querySelectorAll('.cell').forEach(cell => cell.className = 'cell');
    document.querySelectorAll('.confetti').forEach(c => c.remove());
    playerXInput.value = '';
    playerOInput.value = '';
    playerXInput.focus();
    updateScores();
    location.reload();
}

toggleInputs.forEach(toggleInput => {
    let ontoggleInput = false;
    toggleInput.addEventListener('dblclick',()=>{
        ontoggleInput = !ontoggleInput;

        if (ontoggleInput) {
            capitalizeInput()
        } else {
            uncapitaliseInput()
        }
    })
});

function capitalizeInput() {
    playerXInput.style.color = "#efab07";
    playerOInput.style.color = "#efab07";
    var input1 = playerXInput;
    var input2 = playerOInput;
    const value1 = input1.value;
    const value2 = input2.value;
    
    // Capitalize the first letter and make the rest lowercase
    // input1.value = value1.charAt(0).toUpperCase() + value1.slice(1).toLowerCase();
    // input2.value = value2.charAt(0).toUpperCase() + value2.slice(1).toLowerCase();

    input1.value = value1.toUpperCase();
    input2.value = value2.toUpperCase();

}

function uncapitaliseInput() {
    playerXInput.style.color = "#fff";
    playerOInput.style.color = "#fff";
    var input1 = playerXInput;
    var input2 = playerOInput;
    const value1 = input1.value;
    const value2 = input2.value;

    input1.value = value1.toLowerCase();
    input2.value = value2.toLowerCase();
}

capitalizeInput();
uncapitaliseInput();