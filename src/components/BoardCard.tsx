import React from 'react';
import type { IBoard } from '../types/Board';

interface Props {
  board: IBoard;
  onClick?: () => void;
}

const BoardCard: React.FC<Props> = ({ board, onClick }) => {
  return (
    <div
      className='bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-xl transition'
      onClick={onClick}
    >
      <h2 className='font-bold text-lg'>{board.title}</h2>
      <p className='text-gray-500'>{board.description || 'No description'}</p>
    </div>
  );
};

export default BoardCard;
