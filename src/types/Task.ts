export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  board: string;
  assignedTo?: string;
  assignee?: string; // For UI display
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  labels?: string[]; // For UI display
  subtasks?: {
    title: string;
    isCompleted: boolean;
  }[];
}
