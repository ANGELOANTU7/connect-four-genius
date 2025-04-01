
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MinimaxTree from '../components/MinimaxTree';
import { Button } from '../components/ui/button';
import { getMinimaxTree } from '../utils/ticTacToeAI';
import { ArrowLeft } from 'lucide-react';

const TreeVisualization = () => {
  const [treeData, setTreeData] = useState(getMinimaxTree());
  
  // Refresh tree data when navigating to this page
  useEffect(() => {
    setTreeData(getMinimaxTree());
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Decision Tree Visualization</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Game
            </Button>
          </Link>
        </header>
        
        <main>
          <div className="mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              This visualization shows how the AI evaluates possible moves using the Minimax algorithm with Alpha-Beta pruning.
            </p>
          </div>
          
          <div className="w-full">
            {treeData ? (
              <MinimaxTree 
                treeData={treeData} 
                maxDepth={6} // Show more depth on dedicated page
                currentGameState=""
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-medium mb-4">No Decision Tree Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Play a game first so the AI can generate a decision tree.
                </p>
                <Link to="/">
                  <Button>Go to Game</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TreeVisualization;
