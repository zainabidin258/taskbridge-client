// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import BoardCard from '@/components/BoardCard';
import type { IBoard } from '@/types/Board';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import AppDialog from '@/components/dialog';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //Form states for create board
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchBoards = async () => {
    const res = await api.get('/api/boards');
    return res.data;
  };

  //React query: fetch boards
  const {
    data: boards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  const createBoardMutation = useMutation({
    mutationFn: async (boardData: { title: string; description: string }) => {
      const res = await api.post('/api/boards', boardData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });

      setTitle('');
      setDescription('');
    },
    onError: (error) => {
      console.error('Failed to create a new board', error);
    },
  });

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    createBoardMutation.mutate({ title, description });
  };

  if (isLoading) return <p>Loading boards...</p>;
  if (isError) return <p>Error loading boards: {error.message}</p>;

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
          {boards.map((board: IBoard) => (
            <BoardCard
              key={board._id}
              board={board}
              onClick={() => navigate(`/boards/${board._id}`)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
