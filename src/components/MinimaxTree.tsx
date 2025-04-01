
import React from 'react';
import { X, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { TreeNode } from '../utils/ticTacToeAI';

interface MinimaxTreeProps {
  treeData: TreeNode | null;
  maxDepth?: number;
}

const MinimaxTree: React.FC<MinimaxTreeProps> = ({ 
  treeData, 
  maxDepth = 3
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
    
    // Calculate color based on score
    let scoreColor = 'text-gray-600 dark:text-gray-400';
    if (node.score > 0) scoreColor = 'text-green-600 dark:text-green-400';
    if (node.score < 0) scoreColor = 'text-red-600 dark:text-red-400';
    
    const hasChildren = node.children && node.children.length > 0 && depth < maxDepth;
    const [row, col] = node.position;
    
    return (
      <div 
        key={`${depth}-${index}`} 
        className="flex flex-col items-center"
      >
        {/* Node representation */}
        <div className="flex flex-col items-center">
          <div 
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-md border-2 font-bold",
              node.isMaximizing ? "border-blue-500" : "border-red-500",
              isRoot && "ring-2 ring-primary"
            )}
          >
            {row >= 0 && col >= 0 ? (
              <div className="flex items-center justify-center">
                <div className="text-xs absolute -top-5 left-1/2 transform -translate-x-1/2 font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">
                  [{row}, {col}]
                </div>
                {node.isMaximizing ? (
                  <Circle className="w-8 h-8 text-blue-500" />
                ) : (
                  <X className="w-8 h-8 text-red-500" />
                )}
              </div>
            ) : (
              <span className="text-gray-400">?</span>
            )}
          </div>
          
          <div className={cn("text-xs font-mono mt-1 mb-1", scoreColor)}>
            Score: {node.score}
          </div>
        </div>
        
        {/* Connection lines and children nodes */}
        {hasChildren && (
          <>
            {/* Connection line */}
            <div className="h-6 border-l-2 border-gray-300 dark:border-gray-600"></div>
            
            {/* Children container */}
            <div className="flex flex-row gap-6">
              {node.children.map((child, childIndex) => (
                <div key={childIndex} className="relative">
                  {/* Horizontal line to connect siblings */}
                  {childIndex > 0 && (
                    <div className="absolute h-0.5 bg-gray-300 dark:bg-gray-600" 
                         style={{ width: '24px', top: '-24px', left: '-24px' }}></div>
                  )}
                  {renderNode(child, depth + 1, childIndex)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-auto max-h-[500px]">
      <h3 className="text-lg font-medium mb-4">AI Decision Tree</h3>
      <div className="flex justify-center pb-4">
        {renderNode(treeData, 0, 0, true)}
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="flex items-center">
          <span className="inline-block w-3 h-3 border-2 border-blue-500 mr-2"></span>
          AI's turn (maximizing) - O
        </p>
        <p className="flex items-center">
          <span className="inline-block w-3 h-3 border-2 border-red-500 mr-2"></span>
          Player's turn (minimizing) - X
        </p>
        <p>Position format: [row, column], starting from 0</p>
        <p>Scores: Positive is good for AI, negative is good for player</p>
      </div>
    </div>
  );
};

export default MinimaxTree;
