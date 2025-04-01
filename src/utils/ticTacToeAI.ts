// Define types for game state
export type Player = 1 | 2 | 0; // 1: Human (X), 2: AI (O), 0: Empty
export type GameBoard = Player[][];
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Tree visualization data structure
export interface TreeNode {
  score: number;
  position: [number, number]; // [row, col]
  isMaximizing: boolean;
  children: TreeNode[];
  alpha?: number;
  beta?: number;
  pruned?: boolean;
  boardState?: GameBoard;
}

// Last calculated decision tree
let lastCalculatedTree: TreeNode | null = null;

// Initialize an empty game board (3x3 for tic-tac-toe)
export const createEmptyBoard = (): GameBoard => {
  return Array(3).fill(0).map(() => Array(3).fill(0));
};

// Make a move on the board
export const makeMove = (board: GameBoard, row: number, col: number, player: Player): GameBoard => {
  const newBoard = board.map(r => [...r]);
  
  if (newBoard[row][col] === 0) {
    newBoard[row][col] = player;
  }
  
  return newBoard;
};

// Check if the game is a draw
export const isDraw = (board: GameBoard): boolean => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }
  return !checkWin(board, 1) && !checkWin(board, 2);
};

// Check for a win
export const checkWin = (board: GameBoard, player: Player): boolean => {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
      return true;
    }
  }
  
  // Check columns
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
      return true;
    }
  }
  
  // Check diagonals
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true;
  }
  
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true;
  }
  
  return false;
};

// Find winning coordinates
export const findWinningCoordinates = (board: GameBoard, player: Player): [number, number][] => {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
      return [[row, 0], [row, 1], [row, 2]];
    }
  }
  
  // Check columns
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
      return [[0, col], [1, col], [2, col]];
    }
  }
  
  // Check diagonals
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return [[0, 0], [1, 1], [2, 2]];
  }
  
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return [[0, 2], [1, 1], [2, 0]];
  }
  
  return [];
};

// Evaluate board for minimax
const evaluateBoard = (board: GameBoard, player: Player): number => {
  const opponent = player === 1 ? 2 : 1;
  
  // Check for win
  if (checkWin(board, player)) {
    return 10;
  }
  
  // Check for opponent win
  if (checkWin(board, opponent)) {
    return -10;
  }
  
  // Draw
  if (isDraw(board)) {
    return 0;
  }
  
  // Center position bonus
  if (board[1][1] === player) {
    return 1;
  } else if (board[1][1] === opponent) {
    return -1;
  }
  
  return 0;
};

// Get available moves
const getAvailableMoves = (board: GameBoard): [number, number][] => {
  const moves: [number, number][] = [];
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === 0) {
        moves.push([row, col]);
      }
    }
  }
  
  return moves;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: GameBoard,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player,
  buildTree = false,
  parentNode: TreeNode | null = null
): [number, [number, number], TreeNode | null] => {
  const opponent = player === 1 ? 2 : 1;
  const availableMoves = getAvailableMoves(board);
  
  // Create a node for this state if building tree
  let currentNode: TreeNode | null = null;
  if (buildTree) {
    currentNode = {
      score: 0,
      position: [-1, -1],
      isMaximizing,
      children: [],
      alpha,
      beta,
      boardState: board.map(row => [...row]) // Save board state for comparison
    };
    
    if (parentNode) {
      parentNode.children.push(currentNode);
    }
  }
  
  // Terminal conditions
  if (depth === 0 || checkWin(board, player) || checkWin(board, opponent) || availableMoves.length === 0) {
    const score = evaluateBoard(board, player);
    if (currentNode) {
      currentNode.score = score;
    }
    return [score, [-1, -1], currentNode];
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove: [number, number] = availableMoves[0];
    
    for (const [row, col] of availableMoves) {
      const newBoard = makeMove(board, row, col, player);
      const [score, _, childNode] = minimax(newBoard, depth - 1, alpha, beta, false, player, buildTree, currentNode);
      
      if (score > maxScore) {
        maxScore = score;
        bestMove = [row, col];
        if (currentNode) {
          currentNode.score = score;
          currentNode.position = [row, col];
        }
      }
      
      alpha = Math.max(alpha, maxScore);
      if (currentNode) {
        currentNode.alpha = alpha;
      }
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        // Mark remaining moves as pruned if building tree
        if (buildTree && currentNode) {
          for (let i = availableMoves.indexOf([row, col]) + 1; i < availableMoves.length; i++) {
            const prunedMove = availableMoves[i];
            const prunedNode: TreeNode = {
              score: 0,
              position: prunedMove,
              isMaximizing: false,
              children: [],
              pruned: true,
              boardState: makeMove(board, prunedMove[0], prunedMove[1], player)
            };
            currentNode.children.push(prunedNode);
          }
        }
        break; // Alpha-beta pruning
      }
    }
    
    return [maxScore, bestMove, currentNode];
  } else {
    let minScore = Infinity;
    let bestMove: [number, number] = availableMoves[0];
    
    for (const [row, col] of availableMoves) {
      const newBoard = makeMove(board, row, col, opponent);
      const [score, _, childNode] = minimax(newBoard, depth - 1, alpha, beta, true, player, buildTree, currentNode);
      
      if (score < minScore) {
        minScore = score;
        bestMove = [row, col];
        if (currentNode) {
          currentNode.score = score;
          currentNode.position = [row, col];
        }
      }
      
      beta = Math.min(beta, minScore);
      if (currentNode) {
        currentNode.beta = beta;
      }
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        // Mark remaining moves as pruned if building tree
        if (buildTree && currentNode) {
          for (let i = availableMoves.indexOf([row, col]) + 1; i < availableMoves.length; i++) {
            const prunedMove = availableMoves[i];
            const prunedNode: TreeNode = {
              score: 0,
              position: prunedMove,
              isMaximizing: true,
              children: [],
              pruned: true,
              boardState: makeMove(board, prunedMove[0], prunedMove[1], opponent)
            };
            currentNode.children.push(prunedNode);
          }
        }
        break; // Alpha-beta pruning
      }
    }
    
    return [minScore, bestMove, currentNode];
  }
};

// AI move based on difficulty level
export const getAIMove = (board: GameBoard, difficulty: DifficultyLevel): [number, number] => {
  const availableMoves = getAvailableMoves(board);
  
  // If no valid moves, return [-1, -1]
  if (availableMoves.length === 0) {
    return [-1, -1];
  }
  
  // Determine depth based on difficulty
  let depth = 9; // Full depth for tic-tac-toe
  let buildTree = true;
  
  if (difficulty === 'easy') {
    // Easy: Random move with 70% chance, smart move with 30% chance
    if (Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  } else if (difficulty === 'medium') {
    // Medium: Random move with 30% chance, smart move with 70% chance
    if (Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }
  
  // Run minimax with tree building
  const [_, bestMove, treeNode] = minimax(board, depth, -Infinity, Infinity, true, 2, buildTree);
  
  // Store the decision tree for visualization
  lastCalculatedTree = treeNode;
  
  return bestMove;
};

// Get hint for the player
export const getHint = (board: GameBoard): [number, number] => {
  return [-1, -1];
};

// Get the last calculated minimax tree
export const getMinimaxTree = (): TreeNode | null => {
  return lastCalculatedTree;
};

// Reset the minimax tree
export const resetMinimaxTree = (): void => {
  lastCalculatedTree = null;
};
