
import React from 'react';
import { Circle, ArrowDown, CircleDot } from 'lucide-react';
import { cn } from '../lib/utils';
import { TreeNode } from '../utils/connectFourAI';

interface MinimaxTreeProps {
  treeData: TreeNode | null;
  maxDepth?: number;
}

const MinimaxTree: React.FC<MinimaxTreeProps> = ({ 
  treeData, 
  maxDepth = 2 
}) => {
  if (!treeData) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">AI Decision Tree</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Make a move to see the AI's decision process
        </p>
      </div>
    );
  }

  // Recursive function to render the tree
  const renderNode = (node: TreeNode, depth: number, index: number, isRoot: boolean = false) => {
    // Don't render beyond max depth
    if (depth > maxDepth) return null;
    
    // Calculate color based on score (normalize between -1000 and 1000)
    const normalizedScore = Math.max(-1000, Math.min(1000, node.score)) / 1000;
    const red = normalizedScore < 0 ? 255 : Math.round(255 - (normalizedScore * 255));
    const green = normalizedScore > 0 ? 255 : Math.round(255 + (normalizedScore * 255));
    const scoreColor = `rgb(${red}, ${green}, 100)`;
    
    return (
      <div 
        key={`${depth}-${index}`} 
        className={cn(
          "flex flex-col items-center",
          depth > 0 && "mt-2"
        )}
      >
        {/* Arrow connecting to parent */}
        {depth > 0 && <ArrowDown className="text-gray-400 h-4 w-4 mb-1" />}
        
        {/* Node representation */}
        <div 
          className={cn(
            "relative flex items-center justify-center rounded-full",
            isRoot ? "w-10 h-10 border-2" : "w-8 h-8 border",
            node.isMaximizing ? "border-yellow-500" : "border-red-500",
            isRoot && "animate-pulse"
          )}
          style={{ backgroundColor: scoreColor }}
        >
          <span className="text-xs font-bold text-gray-800">
            {node.column >= 0 ? node.column : '?'}
          </span>
          {isRoot && (
            <CircleDot className="absolute -top-1 -right-1 h-4 w-4 text-primary" />
          )}
        </div>
        
        {/* Node score */}
        <div className="text-xs font-mono mt-1">
          {node.score === Infinity ? "∞" : 
           node.score === -Infinity ? "-∞" : 
           node.score.toFixed(0)}
        </div>
        
        {/* Children nodes */}
        {node.children && node.children.length > 0 && depth < maxDepth && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {node.children.map((child, childIndex) => 
              renderNode(child, depth + 1, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-auto">
      <h3 className="text-lg font-medium mb-2">AI Decision Tree</h3>
      <div className="flex justify-center">
        {renderNode(treeData, 0, 0, true)}
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>- Yellow: AI's turn (maximizing)</p>
        <p>- Red: Player's turn (minimizing)</p>
        <p>- Numbers: Column scores</p>
      </div>
    </div>
  );
};

export default MinimaxTree;
