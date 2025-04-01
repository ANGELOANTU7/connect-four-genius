
import React from 'react';
import { Player } from '../utils/ticTacToeAI';
import { cn } from '../lib/utils';
import { X, Circle } from 'lucide-react';

interface GameCellProps {
  value: Player;
  isWinningCell: boolean;
  isLastMove: boolean;
  isHint?: boolean;
  onClick: () => void;
}

const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  isWinningCell, 
  isLastMove, 
  isHint = false,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "aspect-square p-2 cursor-pointer bg-white/90 flex items-center justify-center",
        "border-2 border-gray-300 transition-all duration-300",
        isWinningCell && "bg-green-100",
        isLastMove && "bg-blue-50",
        isHint && "bg-yellow-100",
        value === 0 && "hover:bg-gray-100"
      )}
      role="gridcell"
      aria-label={`${value === 0 ? 'Empty' : value === 1 ? 'X' : 'O'} cell`}
    >
      {value === 1 && (
        <X 
          className={cn(
            "text-red-500 w-12 h-12", 
            isWinningCell && "animate-pulse text-green-500",
            isLastMove && !isWinningCell && "animate-in fade-in-50"
          )} 
        />
      )}
      {value === 2 && (
        <Circle 
          className={cn(
            "text-blue-500 w-10 h-10", 
            isWinningCell && "animate-pulse text-green-500",
            isLastMove && !isWinningCell && "animate-in fade-in-50"
          )} 
        />
      )}
    </div>
  );
};

export default GameCell;
