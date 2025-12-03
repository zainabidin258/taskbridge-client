// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import BoardCard from '../components/BoardCard';
import type { IBoard } from '../types/Board';
import api from '../api/axios';
import { Button } from '@/components/ui/button';
import AppDialog from '@/components/dialog';

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/boards', { title, description });
      setBoards((prev) => [...prev, res.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  if (loading) return <p>Loading boards...</p>;

  return (
    <>
      <div className='flex flex-col p-6 gap-4'>
        <div className='ml-auto'>
          <AppDialog
            title='Create Board'
            trigger={
              <Button variant='default' className='cursor-pointer'>
                + Create Board
              </Button>
            }
          >
            <form onSubmit={handleCreateBoard} className='spacey-4 mt-2'>
              <div>
                <label>Board Title</label>
                <input
                  type='text'
                  className='w-full border p-2 rounded mt-1'
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className='block font-medium'>Description</label>
                <textarea
                  className='w-full border p-2 rounded mt-1'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button
                variant='default'
                type='submit'
                className='text-white px-4 py-2 rounded-lg w-full hover:opacity-95 cursor-pointer'
              >
                Create
              </Button>
            </form>
          </AppDialog>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onClick={() => console.log(board)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
