let difficulty = 30;  // missing cells from sudoku, the higher num the harder

function getRandomIndices(length, count) {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > length - count - 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(length - count);
}

function generateRandomSudokuBoard() {
  const board = [];
  const emptyCell = 0;
  for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
      board[i][j] = emptyCell;
    }
  }

  function isValidMove(row, col, num) {
    // Check if the number is not already in the row or column
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false;
      }
    }

    // Check if the number is not in the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  function solveSudoku() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === emptyCell) {
          const randomNumbers = shuffle([...Array(9).keys()]).map(i => i + 1);

          for (let i = 0; i < randomNumbers.length; i++) {
            const num = randomNumbers[i];

            if (isValidMove(row, col, num)) {
              board[row][col] = num;

              if (solveSudoku()) {
                return true;
              }

              board[row][col] = emptyCell;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  solveSudoku();

  return board;
}

function generatePartialSudokuBoard(board, numToRemove) {
  const partialBoard = board.map(row => [...row]);

  const indicesToRemove = getRandomIndices(81, numToRemove);
  indicesToRemove.forEach(index => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    partialBoard[row][col] = 0;
  });

  return partialBoard;
}

document.addEventListener('dragstart', () => {
  startTimer();
});


function checkSudokuValidity(row, col, num) {
  return randomSudokuBoard[row][col] === num;
}

function updateMistakesCounter() {
  const mistakesCounter = document.getElementById('mistakes-counter');
  mistakesCounter.innerText = `Mistakes: ${mistakes}`;
}

function checkSudokuValidity(row, col, num) {
  return randomSudokuBoard[row][col] === num;
}

function updateMistakesCounter() {
  const mistakesCounter = document.getElementById('mistakes-counter');
  mistakesCounter.innerText = `Mistakes: ${mistakes}`;
}
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.innerText);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const target = event.target;

  if (target.classList.contains('empty-cell')) {
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);
    const num = parseInt(data);

    if (checkSudokuValidity(row, col, num)) {
      target.innerText = data;
    } else {
      mistakes++;
      updateMistakesCounter();
    }
  }
}

let mistakes = 0;

const randomSudokuBoard = generateRandomSudokuBoard();
const partialSudokuBoard = generatePartialSudokuBoard(randomSudokuBoard, difficulty);

function displaySudokuBoard(board, containerId) {
  const sudokuBoard = document.getElementById(containerId);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (board[i][j] === 0) {
        cell.classList.add('empty-cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
      }
      cell.innerText = board[i][j] !== 0 ? board[i][j] : '';
      sudokuBoard.appendChild(cell);
    }
  }
}

displaySudokuBoard(partialSudokuBoard, 'sudoku-board');

const draggableNumbers = document.querySelectorAll('.draggable');
const emptyCells = document.querySelectorAll('.empty-cell');

draggableNumbers.forEach(draggable => {
  draggable.addEventListener('dragstart', drag);
});

emptyCells.forEach(emptyCell => {
  emptyCell.addEventListener('dragover', allowDrop);
  emptyCell.addEventListener('drop', drop);
});

// Display mistakes counter
const mistakesContainer = document.createElement('div');
mistakesContainer.id = 'mistakes-container';
mistakesContainer.innerHTML = '<h2 id="mistakes-counter">Mistakes: 0</h2>';
document.body.appendChild(mistakesContainer);
updateMistakesCounter();



let startTime;
let endTime;
let timerInterval;

let timerRunning = false;

function startTimer() {
  if (!timerRunning) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
  }function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
  
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(elapsedTime / 3600000); 
    const remainingTime = elapsedTime % 3600000; 
    const minutes = Math.floor(remainingTime / 60000);  
    const seconds = Math.floor((remainingTime % 60000) / 1000); 
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').innerText = `Time: ${formattedTime}`;
  }
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(elapsedTime / 3600000);  // 1 hour = 3600000 milliseconds
  const remainingTime = elapsedTime % 3600000; // Remaining time after subtracting hours
  const minutes = Math.floor(remainingTime / 60000);  // 1 minute = 60000 milliseconds
  const seconds = Math.floor((remainingTime % 60000) / 1000); // Remaining seconds

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer').innerText = `Time: ${formattedTime}`;
}

function stopTimer() {
  clearInterval(timerInterval);

  const sudokuCells = document.querySelectorAll('.cell');
  let completed = true;

  sudokuCells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const cellValue = parseInt(cell.innerText) || 0;
    
    if (cellValue !== randomSudokuBoard[row][col]) {
      completed = false;
      return;
    }
  });

  if (completed) {
    alert("good job");
  }
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const target = event.target;

  if (target.classList.contains('empty-cell')) {
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);
    const num = parseInt(data);

    if (checkSudokuValidity(row, col, num)) {
      target.innerText = data;

      const sudokuCells = document.querySelectorAll('.cell');
      let completed = true;

      sudokuCells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const cellValue = parseInt(cell.innerText) || 0;

        if (cellValue !== randomSudokuBoard[row][col]) {
          completed = false;
          return;
        }
      });

      if (completed) {
        stopTimer();
      }
    } else {
      mistakes++;
      updateMistakesCounter();
    }
  }
}

const timerContainer = document.createElement('div');
timerContainer.id = 'timer-container';
timerContainer.innerHTML = '<h2 id="timer">Time: 00:00:00</h2>';
document.body.appendChild(timerContainer);

// Display completion time


/*
function resetGame() {
  const sudokuBoard = document.getElementById('sudoku-board');
  const timerContainer = document.getElementById('timer-container');
  const completionTimeContainer = document.getElementById('completion-time-container');

  // Reset Sudoku board
  sudokuBoard.innerHTML = '';
  const newPartialSudokuBoard = generatePartialSudokuBoard(randomSudokuBoard, 3);
  displaySudokuBoard(newPartialSudokuBoard, 'sudoku-board');

  // Reset timer and mistakes
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('timer').innerText = 'Time: 00:00:00';
  startTime = null;
  mistakes = 0;
  updateMistakesCounter();

  // Clear completion time
  completionTimeContainer.innerHTML = '';

  // Reattach event listeners for drag and dragover
  const draggableNumbers = document.querySelectorAll('.draggable');
  const emptyCells = document.querySelectorAll('.empty-cell');

  draggableNumbers.forEach(draggable => {
    draggable.addEventListener('dragstart', drag);
  });

  emptyCells.forEach(emptyCell => {
    emptyCell.addEventListener('dragover', allowDrop);
    emptyCell.addEventListener('drop', drop);
  });
}



// Add a "Play Again" button
const playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', resetGame);

*/


// Display timer


// Event listener to start the timer when interaction begins


// console.log('Random Sudoku Board:');
// console.log(randomSudokuBoard.map(row => row.join(' ')).join('\n'));

// console.log('\nPartial Sudoku Board (20 numbers removed):');
// console.log(partialSudokuBoard.map(row => row.join(' ')).join('\n'));


