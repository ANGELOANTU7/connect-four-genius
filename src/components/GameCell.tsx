
import React from 'react';
import { Player } from '../utils/connectFourAI';
import { cn } from '../lib/utils';

interface GameCellProps {
  value: Player;
  isWinningCell: boolean;
  isLastMove: boolean;
  onClick: () => void;
}

const GameCell: React.FC<GameCellProps> = ({ value, isWinningCell, isLastMove, onClick }) => {
  // Determine piece color and animation
  const getPieceClasses = () => {
    let classes = "w-full h-full rounded-full shadow-inner transform transition-all";
    
    if (value === 1) {
      classes += " bg-playerRed";
    } else if (value === 2) {
      classes += " bg-playerYellow";
    } else {
      classes += " bg-white/90";
    }
    
    if (isLastMove) {
      classes += " piece-fall";
    }
    
    if (isWinningCell) {
      classes += " winner-pulse";
    }
    
    return classes;
  };
  
  return (
    <div 
      className="aspect-square p-1 cursor-pointer"
      onClick={onClick}
      role="gridcell"
      aria-label={`${value === 0 ? 'Empty' : value === 1 ? 'Red' : 'Yellow'} cell`}
    >
      <div className="w-full h-full bg-boardBlue rounded-full flex items-center justify-center p-1">
        <div className={getPieceClasses()}></div>
      </div>
    </div>
  );
};

export default GameCell;
