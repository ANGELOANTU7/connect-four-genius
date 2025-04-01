
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
        "border-2 border-gray-300 transition-all duration-300 relative",
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
      
      {/* Position indicator in corner */}
      {value === 0 && (
        <div className="absolute top-0 left-0 text-[8px] text-gray-400 p-0.5">
          {React.Children.count(Array.from(document.querySelectorAll('[role="gridcell"]')).indexOf(document.activeElement as Element))}
        </div>
      )}
      
      {isLastMove && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default GameCell;
