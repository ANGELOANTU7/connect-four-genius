
import React, { useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import { initAudio } from '../utils/audioService';

const Index = () => {
  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio();
      // Remove event listeners after initialization
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    // Add event listeners
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      // Clean up
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Tic Tac Toe</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Challenge the AI with X's and O's!
          </p>
        </header>
        
        <main>
          <GameBoard />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>An AI-powered Tic Tac Toe game with Minimax algorithm</p>
          <p className="mt-1">Click on a cell to place your X!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
