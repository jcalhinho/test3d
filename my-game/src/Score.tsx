import React from 'react';

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="absolute top-4 left-4 text-white text-2xl">
      Score: {score}
    </div>
  );
};

export default Score;
