import api from '@/api/axios';
import type { IBoard } from '@/types/Board';

export const boardService = {
  // Get all boards
  getAllBoards: async (): Promise<IBoard[]> => {
    const response = await api.get('/api/boards');
    return response.data;
  },

  // Get a single board by ID
  getBoardById: async (boardId: string): Promise<IBoard> => {
    const response = await api.get(`/api/boards/${boardId}`);
    return response.data;
  },

  // Create a new board
  createBoard: async (boardData: {
    name: string;
    description?: string;
  }): Promise<IBoard> => {
    const response = await api.post('/api/boards', boardData);
    return response.data;
  },

  // Update an existing board
  updateBoard: async (
    boardId: string,
    boardData: Partial<{
      name: string;
      description: string;
    }>
  ): Promise<IBoard> => {
    const response = await api.put(`/api/boards/${boardId}`, boardData);
    return response.data;
  },

  // Delete a board
  deleteBoard: async (boardId: string): Promise<void> => {
    await api.delete(`/api/boards/${boardId}`);
  },
};