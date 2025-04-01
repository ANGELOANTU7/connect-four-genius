
import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameBoard as GameBoardType, 
  Player, 
  createEmptyBoard, 
  checkWin, 
  makeMove, 
  getAIMove, 
  isDraw, 
  findWinningCoordinates, 
  DifficultyLevel, 
  getHint,
  getMinimaxTree,
  resetMinimaxTree,
  TreeNode
} from '../utils/ticTacToeAI';
import { playSoundIfEnabled } from '../utils/audioService';
import GameCell from './GameCell';
import GameControls from './GameControls';
import MinimaxTree from './MinimaxTree';

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<GameBoardType>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1); // Human starts
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [showHint, setShowHint] = useState<[number, number] | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [minimaxTree, setMinimaxTree] = useState<TreeNode | null>(null);
  const [showMinimaxTree, setShowMinimaxTree] = useState<boolean>(true);

  // Convert current board to string representation for tree node matching
  const currentGameStateString = board.flat().join('');

  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setGameStatus('playing');
    setWinner(null);
    setWinningCells([]);
    setShowHint(null);
    setLastMove(null);
    setMinimaxTree(null);
    resetMinimaxTree();
    playSoundIfEnabled('click');
  }, []);

  // Handle human player move
  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing' || currentPlayer !== 1 || isAIThinking || board[row][col] !== 0) {
      return;
    }

    // Make a copy of the board
    let newBoard = makeMove(board, row, col, 1);
    setLastMove([row, col]);
    setBoard(newBoard);
    playSoundIfEnabled('drop');
    
    // Check for win
    if (checkWin(newBoard, 1)) {
      setGameStatus('won');
      setWinner(1);
      setWinningCells(findWinningCoordinates(newBoard, 1));
      playSoundIfEnabled('win');
      return;
    }
    
    // Check for draw
    if (isDraw(newBoard)) {
      setGameStatus('draw');
      playSoundIfEnabled('draw');
      return;
    }
    
    // Switch to AI's turn
    setCurrentPlayer(2);
    setShowHint(null);
  }, [board, currentPlayer, gameStatus, isAIThinking]);

  // AI move
  useEffect(() => {
    if (currentPlayer === 2 && gameStatus === 'playing') {
      setIsAIThinking(true);
      
      // Add a slight delay to simulate "thinking"
      const aiMoveTimeout = setTimeout(() => {
        const [row, col] = getAIMove(board, difficulty);
        
        // Capture the minimax tree after AI makes a decision
        setMinimaxTree(getMinimaxTree());
        
        if (row !== -1 && col !== -1) {
          let newBoard = makeMove(board, row, col, 2);
          setLastMove([row, col]);
          setBoard(newBoard);
          playSoundIfEnabled('drop');
          
          // Check for win
          if (checkWin(newBoard, 2)) {
            setGameStatus('won');
            setWinner(2);
            setWinningCells(findWinningCoordinates(newBoard, 2));
            playSoundIfEnabled('win');
          } 
          // Check for draw
          else if (isDraw(newBoard)) {
            setGameStatus('draw');
            playSoundIfEnabled('draw');
          } 
          // Continue game
          else {
            setCurrentPlayer(1);
          }
        }
        
        setIsAIThinking(false);
      }, 800); // Delay for AI move
      
      return () => clearTimeout(aiMoveTimeout);
    }
  }, [board, currentPlayer, difficulty, gameStatus]);

  // Handle showing hints
  const handleShowHint = useCallback(() => {
    if (gameStatus === 'playing' && currentPlayer === 1) {
      const hintPos = getHint(board);
      setShowHint(hintPos);
      playSoundIfEnabled('click');
    }
  }, [board, currentPlayer, gameStatus]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    playSoundIfEnabled('click');
  }, []);

  // Toggle minimax tree visibility
  const toggleMinimaxTree = useCallback(() => {
    setShowMinimaxTree(prev => !prev);
    playSoundIfEnabled('click');
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center w-full md:w-3/5">
        <GameControls 
          gameStatus={gameStatus} 
          currentPlayer={currentPlayer} 
          winner={winner} 
          difficulty={difficulty} 
          onReset={resetGame} 
          onShowHint={handleShowHint} 
          onDifficultyChange={handleDifficultyChange}
          isAIThinking={isAIThinking}
          onToggleMinimaxTree={toggleMinimaxTree}
          showMinimaxTree={showMinimaxTree}
        />
        
        <div className="w-full max-w-md mt-4 relative">
          {/* Board frame */}
          <div className="bg-gradient-to-b from-boardBlue to-boardBlueDark rounded-lg p-4 shadow-lg">
            {/* Game grid */}
            <div 
              className="grid grid-cols-3 gap-1 bg-boardBlueDark rounded-md p-2 border-2 border-boardBlueDark"
              role="grid"
              aria-label="Tic Tac Toe game board"
            >
              {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <GameCell 
                    key={`${rowIndex}-${colIndex}`}
                    value={cell}
                    isWinningCell={winningCells.some(([r, c]) => r === rowIndex && c === colIndex)}
                    isLastMove={lastMove && lastMove[0] === rowIndex && lastMove[1] === colIndex}
                    isHint={showHint && showHint[0] === rowIndex && showHint[1] === colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
        
        {/* Game status message */}
        {gameStatus === 'playing' && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            {currentPlayer === 1 ? (
              <p>Your turn! Click on a cell to place your X.</p>
            ) : (
              <p>AI is thinking...</p>
            )}
          </div>
        )}
      </div>
      
      {/* Minimax Tree Visualization */}
      {showMinimaxTree && (
        <div className="w-full md:w-2/5 mt-4 md:mt-0">
          <MinimaxTree 
            treeData={minimaxTree} 
            maxDepth={3}
            currentGameState={currentGameStateString}
          />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
