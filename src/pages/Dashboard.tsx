// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import BoardCard from '../components/BoardCard';
import type { IBoard } from '../types/Board';
import api from '../api/axios';

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = async () => {
    try {
      const res = await api.get('http://localhost:5000/api/boards');
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  if (loading) return <p>Loading boards...</p>;

  return (
    <>
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
        {boards.map((board) => (
          <BoardCard
            key={board._id}
            board={board}
            onClick={() => console.log(board)}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
