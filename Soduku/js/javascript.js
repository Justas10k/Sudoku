let difficulty=2;
let mistakes = 0;
let timer_mistake_con= document.getElementById('timer_mistake_con')


let randomSudokuBoard = generateRandomSudokuBoard();

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
    // Check if not in row or column
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false;
      }
    }

    // Check if not in 3x3 
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

const partialSudokuBoard = generatePartialSudokuBoard(randomSudokuBoard, difficulty);

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

function getRandomIndices(length, count) {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > length - count - 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(length - count);
}

displaySudokuBoard(partialSudokuBoard, 'sudoku-board');
function displaySudokuBoard(board, containerId) {
  const sudokuBoard = document.getElementById(containerId);
  sudokuBoard.innerHTML = ''; // Clear previous content

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.innerText = board[i][j] !== 0 ? board[i][j] : '';

      if (board[i][j] === 0) {
        cell.classList.add('empty-cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('dragover', allowDrop);
        cell.addEventListener('drop', drop);
      }

      sudokuBoard.appendChild(cell);
    }
  }
}
///button start

function resetBoardWithDifficulty(newDifficulty) {
  difficulty = newDifficulty;

  // Reset the timer
  clearInterval(timerInterval);
  timerRunning = false;
  startTime = null;
  const timerElement = document.getElementById('timer');
  timerElement.innerText = 'Time: 00:00:00';
  startTimer();
  mistakes = 0;
  updateMistakesCounter();

  generateNewRandomSudokuBoard();
  const partialSudokuBoard = generatePartialSudokuBoard(randomSudokuBoard, difficulty);
  displaySudokuBoard(partialSudokuBoard, 'sudoku-board');
//drag drop
  const emptyCells = document.querySelectorAll('.empty-cell');
  emptyCells.forEach(emptyCell => {
    emptyCell.addEventListener('dragover', allowDrop);
    emptyCell.addEventListener('drop', drop);
  });
}

function generateNewRandomSudokuBoard() {
  randomSudokuBoard = generateRandomSudokuBoard();
}

const difficultyButtons = document.querySelectorAll('.difficulty-button');
difficultyButtons.forEach(button => {
  button.addEventListener('click', event => {
    const newDifficulty = parseInt(event.target.dataset.difficulty);
    resetBoardWithDifficulty(newDifficulty);
  });
});

const resetButton = document.getElementById('play-again');
resetButton.addEventListener('click', () => {
  resetBoardWithDifficulty(difficulty);
});
//button end//


//drag
document.addEventListener('dragstart', () => {
  startTimer();
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.innerText);
}
const draggableNumbers = document.querySelectorAll('.draggable');
const emptyCells = document.querySelectorAll('.empty-cell');

draggableNumbers.forEach(draggable => {
  draggable.addEventListener('dragstart', drag);
});

emptyCells.forEach(emptyCell => {
  emptyCell.addEventListener('dragover', allowDrop);
  emptyCell.addEventListener('drop', drop);
});


function updateMistakesCounter() {
  const mistakesCounter = document.getElementById('mistakes-counter');
  mistakesCounter.innerText = `Mistakes: ${mistakes}`;
}

const mistakesContainer = document.createElement('div');
mistakesContainer.id = 'mistakes-container';
mistakesContainer.innerHTML = '<h2 id="mistakes-counter">Mistakes: 0</h2>';
timer_mistake_con.appendChild(mistakesContainer);
updateMistakesCounter();


//timer
let startTime;
let endTime;
let timerInterval;

let timerRunning = false;

function startTimer() {
  if (!timerRunning) {
    startTime = Date.now();
    timerRunning = true;

    timerInterval = setInterval(() => {
      updateTimer();
    }, 1000);
  }
}

function updateTimer() {
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
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000;

    const difficultyNames = {
      10: 'Super Easy',
      20: 'Easy',
      35: 'Medium',
      50: 'Hard'
    };

    const modalTime = document.getElementById('modal-time');
    modalTime.innerText = `Time taken: ${Math.floor(elapsedTime / 3600)} hours, ${Math.floor((elapsedTime % 3600) / 60)} minutes, ${Math.floor(elapsedTime % 60)} seconds`;

    const modalMistakes = document.getElementById('modal-mistakes');
    modalMistakes.innerText = `Mistakes: ${mistakes}`;

    const modalDifficulty = document.getElementById('modal-difficulty');
    modalDifficulty.innerText = `Difficulty: ${difficultyNames[difficulty]}`;

    // Display the modal
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
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
function checkSudokuValidity(row, col, num) {
  return randomSudokuBoard[row][col] === num;
}
const timerContainer = document.createElement('div');
timerContainer.id = 'timer-container';
timerContainer.innerHTML = '<h2 id="timer">Time: 00:00:00</h2>';
timer_mistake_con.appendChild(timerContainer);
