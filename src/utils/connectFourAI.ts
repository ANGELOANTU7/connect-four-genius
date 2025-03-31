
// Define types for game state
export type Player = 1 | 2 | 0; // 1: Human (Red), 2: AI (Yellow), 0: Empty
export type GameBoard = Player[][];
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Constants
const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;

// Scores for the minimax algorithm
const WINNING_SCORE = 1000000;
const LOSING_SCORE = -1000000;

// Initialize an empty game board
export const createEmptyBoard = (): GameBoard => {
  return Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
};

// Check if a column is full
export const isColumnFull = (board: GameBoard, col: number): boolean => {
  return board[0][col] !== 0;
};

// Get the next available row in a column
export const getNextAvailableRow = (board: GameBoard, col: number): number => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      return row;
    }
  }
  return -1; // Column is full
};

// Make a move on the board
export const makeMove = (board: GameBoard, col: number, player: Player): GameBoard => {
  const newBoard = board.map(row => [...row]);
  const row = getNextAvailableRow(newBoard, col);
  
  if (row !== -1) {
    newBoard[row][col] = player;
  }
  
  return newBoard;
};

// Check if the game is a draw
export const isDraw = (board: GameBoard): boolean => {
  return board[0].every(cell => cell !== 0);
};

// Check for a win
export const checkWin = (board: GameBoard, player: Player): boolean => {
  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      if (
        board[row][col] === player &&
        board[row][col + 1] === player &&
        board[row][col + 2] === player &&
        board[row][col + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check vertical
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col < COLS; col++) {
      if (
        board[row][col] === player &&
        board[row + 1][col] === player &&
        board[row + 2][col] === player &&
        board[row + 3][col] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonal (down-right)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      if (
        board[row][col] === player &&
        board[row + 1][col + 1] === player &&
        board[row + 2][col + 2] === player &&
        board[row + 3][col + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonal (up-right)
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      if (
        board[row][col] === player &&
        board[row - 1][col + 1] === player &&
        board[row - 2][col + 2] === player &&
        board[row - 3][col + 3] === player
      ) {
        return true;
      }
    }
  }

  return false;
};

// Find winning coordinates
export const findWinningCoordinates = (board: GameBoard, player: Player): [number, number][] => {
  const winningCoords: [number, number][] = [];

  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      if (
        board[row][col] === player &&
        board[row][col + 1] === player &&
        board[row][col + 2] === player &&
        board[row][col + 3] === player
      ) {
        winningCoords.push([row, col], [row, col + 1], [row, col + 2], [row, col + 3]);
        return winningCoords;
      }
    }
  }

  // Check vertical
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col < COLS; col++) {
      if (
        board[row][col] === player &&
        board[row + 1][col] === player &&
        board[row + 2][col] === player &&
        board[row + 3][col] === player
      ) {
        winningCoords.push([row, col], [row + 1, col], [row + 2, col], [row + 3, col]);
        return winningCoords;
      }
    }
  }

  // Check diagonal (down-right)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      if (
        board[row][col] === player &&
        board[row + 1][col + 1] === player &&
        board[row + 2][col + 2] === player &&
        board[row + 3][col + 3] === player
      ) {
        winningCoords.push([row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]);
        return winningCoords;
      }
    }
  }

  // Check diagonal (up-right)
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      if (
        board[row][col] === player &&
        board[row - 1][col + 1] === player &&
        board[row - 2][col + 2] === player &&
        board[row - 3][col + 3] === player
      ) {
        winningCoords.push([row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]);
        return winningCoords;
      }
    }
  }

  return winningCoords;
};

// Evaluate the board for a player
const evaluateBoard = (board: GameBoard, player: Player): number => {
  let score = 0;
  const opponent = player === 1 ? 2 : 1;

  // Check if player wins
  if (checkWin(board, player)) {
    return WINNING_SCORE;
  }

  // Check if opponent wins
  if (checkWin(board, opponent)) {
    return LOSING_SCORE;
  }

  // Evaluate window of 4 positions
  const evaluateWindow = (window: Player[]): number => {
    let playerCount = 0;
    let opponentCount = 0;
    let emptyCount = 0;

    window.forEach(cell => {
      if (cell === player) playerCount++;
      else if (cell === opponent) opponentCount++;
      else emptyCount++;
    });

    // Score the window
    if (playerCount === 3 && emptyCount === 1) {
      score += 5;
    } else if (playerCount === 2 && emptyCount === 2) {
      score += 2;
    }

    if (opponentCount === 3 && emptyCount === 1) {
      score -= 4;
    }

    return score;
  };

  // Horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
      score += evaluateWindow(window);
    }
  }

  // Vertical windows
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col < COLS; col++) {
      const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      score += evaluateWindow(window);
    }
  }

  // Diagonal (down-right) windows
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
      score += evaluateWindow(window);
    }
  }

  // Diagonal (up-right) windows
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col <= COLS - WIN_LENGTH; col++) {
      const window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
      score += evaluateWindow(window);
    }
  }

  // Prefer center column
  const centerCol = Math.floor(COLS / 2);
  let centerCount = 0;
  for (let row = 0; row < ROWS; row++) {
    if (board[row][centerCol] === player) {
      centerCount++;
    }
  }
  score += centerCount * 3;

  return score;
};

// Get valid moves (non-full columns)
const getValidMoves = (board: GameBoard): number[] => {
  const validMoves: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (!isColumnFull(board, col)) {
      validMoves.push(col);
    }
  }
  return validMoves;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: GameBoard, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizing: boolean, 
  player: Player
): [number, number] => {
  const opponent = player === 1 ? 2 : 1;
  const validMoves = getValidMoves(board);
  
  // Terminal conditions
  if (depth === 0 || validMoves.length === 0 || checkWin(board, player) || checkWin(board, opponent)) {
    return [evaluateBoard(board, player), -1];
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestCol = validMoves[0];
    
    for (const col of validMoves) {
      const newBoard = makeMove(board, col, player);
      const [score] = minimax(newBoard, depth - 1, alpha, beta, false, player);
      
      if (score > maxScore) {
        maxScore = score;
        bestCol = col;
      }
      
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return [maxScore, bestCol];
  } else {
    let minScore = Infinity;
    let bestCol = validMoves[0];
    
    for (const col of validMoves) {
      const newBoard = makeMove(board, col, opponent);
      const [score] = minimax(newBoard, depth - 1, alpha, beta, true, player);
      
      if (score < minScore) {
        minScore = score;
        bestCol = col;
      }
      
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return [minScore, bestCol];
  }
};

// AI move based on difficulty level
export const getAIMove = (board: GameBoard, difficulty: DifficultyLevel): number => {
  const validMoves = getValidMoves(board);
  
  // If no valid moves, return -1
  if (validMoves.length === 0) {
    return -1;
  }
  
  // Easy: Random move with 70% chance, smart move with 30% chance
  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
    
    // Depth = 2 for easy
    const [_, bestCol] = minimax(board, 2, -Infinity, Infinity, true, 2);
    return bestCol;
  }
  
  // Medium: Random move with 30% chance, smart move with 70% chance
  else if (difficulty === 'medium') {
    if (Math.random() < 0.3) {
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
    
    // Depth = 3 for medium
    const [_, bestCol] = minimax(board, 3, -Infinity, Infinity, true, 2);
    return bestCol;
  }
  
  // Hard: Always make the best move
  else {
    // Depth = 5 for hard
    const [_, bestCol] = minimax(board, 5, -Infinity, Infinity, true, 2);
    return bestCol;
  }
};

// Get hint for the player
export const getHint = (board: GameBoard): number => {
  const [_, bestCol] = minimax(board, 3, -Infinity, Infinity, true, 1);
  return bestCol;
};
