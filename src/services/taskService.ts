import api from '@/api/axios';
import type { Task } from '@/types/Task';

export const taskService = {
  // Get all tasks for a board
  getTasksByBoard: async (boardId: string): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/board/${boardId}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: {
    title: string;
    description?: string;
    status: string;
    board: string;
    priority?: string;
    assignee?: string;
    labels?: string[];
  }): Promise<Task> => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  updateTask: async (
    taskId: string,
    taskData: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      assignee: string;
      labels: string[];
    }>
  ): Promise<Task> => {
    const response = await api.put(`/api/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Update task status (for drag and drop)
  updateTaskStatus: async (taskId: string, status: string): Promise<Task> => {
    const response = await api.put(`/api/tasks/${taskId}`, { status });
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },
};
