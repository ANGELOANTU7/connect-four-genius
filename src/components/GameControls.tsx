
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DifficultyLevel, Player } from '../utils/ticTacToeAI';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { playSoundIfEnabled, toggleMute, isMuted } from '../utils/audioService';
import { ChevronDown, Volume2, VolumeX, Lightbulb, RotateCcw, Network, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface GameControlsProps {
  gameStatus: 'playing' | 'won' | 'draw';
  currentPlayer: Player;
  winner: Player | null;
  difficulty: DifficultyLevel;
  isAIThinking: boolean;
  onReset: () => void;
  onShowHint: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onToggleMinimaxTree?: () => void;
  showMinimaxTree?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  currentPlayer,
  winner,
  difficulty,
  isAIThinking,
  onReset,
  onShowHint,
  onDifficultyChange,
  onToggleMinimaxTree,
  showMinimaxTree = true
}) => {
  const [muted, setMuted] = useState(isMuted());
  
  // Get status message
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return winner === 1 
        ? 'You won! Congratulations!' 
        : 'AI won! Better luck next time.';
    } else if (gameStatus === 'draw') {
      return 'Game ended in a draw!';
    } else {
      return currentPlayer === 1 
        ? 'Your turn (X)' 
        : 'AI is thinking... (O)';
    }
  };
  
  // Handle mute toggle
  const handleToggleMute = () => {
    const newMuteState = toggleMute();
    setMuted(newMuteState);
    playSoundIfEnabled('click');
  };
  
  // Format difficulty label
  const formatDifficultyLabel = (diff: DifficultyLevel) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };
  
  return (
    <div className="w-full max-w-2xl p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-primary mb-1">Tic Tac Toe</h2>
        <p className={cn(
          "text-sm font-medium",
          gameStatus === 'won' && winner === 1 && "text-green-600 dark:text-green-400",
          gameStatus === 'won' && winner === 2 && "text-red-600 dark:text-red-400",
          gameStatus === 'draw' && "text-orange-600 dark:text-orange-400"
        )}>
          {getStatusMessage()}
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        {/* Difficulty selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-28">
              {formatDifficultyLabel(difficulty)}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDifficultyChange('easy')}>
              Easy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDifficultyChange('medium')}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDifficultyChange('hard')}>
              Hard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Hint button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onShowHint}
          disabled={gameStatus !== 'playing' || currentPlayer !== 1 || isAIThinking}
        >
          <Lightbulb className="mr-1 h-4 w-4" />
          Hint
        </Button>
        
        {/* Toggle minimax tree */}
        {onToggleMinimaxTree && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleMinimaxTree}
            className={showMinimaxTree ? "bg-blue-100 dark:bg-blue-900" : ""}
          >
            <Network className="mr-1 h-4 w-4" />
            Tree
          </Button>
        )}
        
        {/* Link to full tree visualization */}
        <Link to="/tree">
          <Button 
            variant="outline" 
            size="sm"
          >
            <ExternalLink className="mr-1 h-4 w-4" />
            Full Tree
          </Button>
        </Link>
        
        {/* Sound toggle */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleToggleMute}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        {/* Reset button */}
        <Button 
          variant="default" 
          size="sm"
          onClick={onReset}
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          New Game
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
