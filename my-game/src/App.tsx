import React from 'react';
import Game from './Game';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-grey-500">
      <Game />
    </div>
  );
};

export default App;
