
import React from 'react';
import { ArrowDown } from 'lucide-react';
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
    
    // Calculate color based on score
    let backgroundColor = 'bg-gray-100 dark:bg-gray-700';
    if (node.score > 100) backgroundColor = 'bg-green-100 dark:bg-green-800';
    if (node.score < -100) backgroundColor = 'bg-red-100 dark:bg-red-800';
    if (node.score === Infinity) backgroundColor = 'bg-green-300 dark:bg-green-600';
    if (node.score === -Infinity) backgroundColor = 'bg-red-300 dark:bg-red-600';
    
    const hasChildren = node.children && node.children.length > 0 && depth < maxDepth;
    
    return (
      <div 
        key={`${depth}-${index}`} 
        className="flex flex-col items-center"
      >
        {/* Node representation */}
        <div className="flex flex-col items-center">
          <div 
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-md border-2 font-bold text-lg",
              node.isMaximizing ? "border-yellow-500" : "border-red-500",
              backgroundColor,
              isRoot && "ring-2 ring-primary"
            )}
          >
            {node.column >= 0 ? node.column : '?'}
          </div>
          
          <div className="text-xs font-mono mt-1 mb-1">
            {node.score === Infinity ? "∞" : 
             node.score === -Infinity ? "-∞" : 
             node.score.toFixed(0)}
          </div>
        </div>
        
        {/* Connection lines and children nodes */}
        {hasChildren && (
          <>
            {/* Connection lines */}
            <div className="w-full flex justify-center mb-2">
              <div className="h-6 border-l-2 border-gray-300 dark:border-gray-600"></div>
            </div>
            
            {/* Horizontal line connecting all children */}
            <div className="flex flex-row items-start">
              <div className="flex flex-row gap-4">
                {node.children.map((child, childIndex) => (
                  <div key={childIndex} className="flex flex-col items-center">
                    {/* Horizontal line to sibling */}
                    {childIndex > 0 && childIndex < node.children.length && (
                      <div className="absolute h-0.5 bg-gray-300 dark:bg-gray-600" 
                           style={{ width: '16px', transform: 'translateY(6px) translateX(-8px)' }}></div>
                    )}
                    {renderNode(child, depth + 1, childIndex)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-auto max-h-[500px]">
      <h3 className="text-lg font-medium mb-4">AI Decision Tree</h3>
      <div className="flex justify-center">
        {renderNode(treeData, 0, 0, true)}
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="flex items-center">
          <span className="inline-block w-3 h-3 border-2 border-yellow-500 mr-2"></span>
          AI's turn (maximizing)
        </p>
        <p className="flex items-center">
          <span className="inline-block w-3 h-3 border-2 border-red-500 mr-2"></span>
          Player's turn (minimizing)
        </p>
        <p>Numbers inside boxes: Column choices</p>
        <p>Numbers below boxes: Position scores</p>
      </div>
    </div>
  );
};

export default MinimaxTree;
